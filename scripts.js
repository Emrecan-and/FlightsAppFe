document.addEventListener('DOMContentLoaded', function() {
    const tripTypeDropdown = document.getElementById('tripType');
    const returnDateField = document.getElementById('returnDateField');
    const departureCountryDropdown = document.getElementById('departureCountry');
    const arrivalCountryDropdown = document.getElementById('arrivalCountry');
    const departureCityDropdown = document.getElementById('departureCity');
    const arrivalCityDropdown = document.getElementById('arrivalCity');
    const departureAirportDropdown = document.getElementById('departureAirport');
    const arrivalAirportDropdown = document.getElementById('arrivalAirport');
    const searchButton = document.getElementById('searchButton');


    function handleTripTypeChange() {
        if (tripTypeDropdown.value === 'roundTrip') {
            returnDateField.style.display = 'block'; 
        } else {
            returnDateField.style.display = 'none'; 
        }
    }

    if (tripTypeDropdown) {
        tripTypeDropdown.value = 'roundTrip'; 
        handleTripTypeChange(); 
        tripTypeDropdown.addEventListener('change', handleTripTypeChange);
    } else {
        console.error('Trip Type Dropdown element not found');
    }


    if (departureCountryDropdown) {
        departureCountryDropdown.addEventListener('change', function() {
            const country = this.value;
            const city = departureCityDropdown.value; 
            fetchCitiesAndAirports(country, city, 'departure');
        });
    } else {
        console.error('Departure Country Dropdown element not found');
    }

    if (arrivalCountryDropdown) {
        arrivalCountryDropdown.addEventListener('change', function() {
            const country = this.value;
            const city = arrivalCityDropdown.value; 
            fetchCitiesAndAirports(country, city, 'arrival');
        });
    } else {
        console.error('Arrival Country Dropdown element not found');
    }


    if (departureCityDropdown) {
        departureCityDropdown.addEventListener('change', function() {
            const country = departureCountryDropdown.value;
            const city = this.value;
            fetchCitiesAndAirports(country, city, 'departure');
        });
    } else {
        console.error('Departure City Dropdown element not found');
    }

    if (arrivalCityDropdown) {
        arrivalCityDropdown.addEventListener('change', function() {
            const country = arrivalCountryDropdown.value;
            const city = this.value;
            fetchCitiesAndAirports(country, city, 'arrival');
        });
    } else {
        console.error('Arrival City Dropdown element not found');
    }


    function fetchCountries() {
        fetch('https://localhost:7289/api/v1/Airport/GetCountries')
            .then(response => response.json())
            .then(data => {
                console.log('API Response:', data);
                if (data && data.success) {
                    populateDropdown('departureCountry', data.data);
                    populateDropdown('arrivalCountry', data.data);
                } else {
                    console.error('API Error:', data ? data.message : 'Unknown error');
                }
            })
            .catch(error => console.error('Error fetching countries:', error));
    }


    function populateDropdown(id, data, selectedValue) {
        const selectElement = document.getElementById(id);
        if (selectElement) {
            selectElement.innerHTML = '<option value="">Seçiniz</option>'; 
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item; 
                option.textContent = item; 
                if (item === selectedValue) {
                    option.selected = true; 
                }
                selectElement.appendChild(option);
            });
        } else {
            console.error(`Dropdown with ID '${id}' not found`);
        }
    }

    fetchCountries();

    function fetchCitiesAndAirports(country, city, type) {
        let url = `https://localhost:7289/api/v1/Airport/GetAirportsByCountry?country=${country}`;
        
        if (city) {
            url = `https://localhost:7289/api/v1/Airport/GetAirportsByCountryAndCity?country=${country}&city=${city}`;
        }
        
        fetch(`https://localhost:7289/api/v1/Airport/GetCities?country=${country}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.success) {
                    populateDropdown(`${type}City`, data.data, city);
                } else {
                    console.error(`Error fetching ${type} cities:`, data ? data.message : 'Unknown error');
                }
            })
            .catch(error => console.error(`Error fetching ${type} cities:`, error));

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.success) {
                    const airports = data.data.map(item => item.airport);
                    populateDropdown(`${type}Airport`, airports, departureAirportDropdown.value); 
                } else {
                    console.error(`Error fetching ${type} airports:`, data ? data.message : 'Unknown error');
                }
            })
            .catch(error => console.error(`Error fetching ${type} airports:`, error));
    }


    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const tripType = tripTypeDropdown.value;
            const departureDate = document.getElementById('departureDate').value;
            const departureAirport = departureAirportDropdown.value;
            const arrivalAirport = arrivalAirportDropdown.value;
            const returnDate = document.getElementById('returnDate').value;

            const requestData = {
                DepartureDate: departureDate,
                Destination: arrivalAirport,
                Origin: departureAirport
            };

            let url;
            if (tripType === 'roundTrip' && returnDate) {
                requestData.ReturnDate = returnDate;
                url = 'https://localhost:7289/api/v1/Flight/GetRoundTripFlights';
            } else {
                url = 'https://localhost:7289/api/v1/Flight/GetOneWayFlights';
            }

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    let redirectUrl = 'other-page.html?';
                    Object.keys(requestData).forEach(key => {
                        redirectUrl += `${encodeURIComponent(key)}=${encodeURIComponent(requestData[key])}&`;
                    });
                    window.location.href = redirectUrl.slice(0, -1); 
                } else {
                    console.error('API Error:', data.message);
                    alert(data.message); 
                }
            })
            .catch(error => {
                console.error('Error fetching flights:', error);
                alert('Bir hata oluştu. Lütfen tekrar deneyin.'); 
            });
        });
    } else {
        console.error('Search Button element not found');
    }
});

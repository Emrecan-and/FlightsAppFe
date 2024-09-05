function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        origin: params.get('Origin') || 'N/A',
        destination: params.get('Destination') || 'N/A'
    };
}

function displayFlights() {
    const flightData = JSON.parse(localStorage.getItem('flightData')) || [];
    const { origin, destination } = getQueryParams();
    console.log(flightData);

    const flightCardsContainer = document.getElementById('flightCards');
    if (!flightCardsContainer) {
        console.error('Flight cards container element not found');
        return;
    }

    if (flightData.length > 0) {
        flightCardsContainer.innerHTML = ''; 

        flightData.forEach(flight => {
            const outboundFlight = flight.outboundFlight || {};
            const returnFlight = flight.returnFlight || {};

            const outboundPrice = outboundFlight.price ? outboundFlight.price.toFixed(2) : 'N/A';
            const returnPrice = returnFlight.price ? returnFlight.price.toFixed(2) : 'N/A';
            
            const flightElement = document.createElement('div');
            flightElement.className = 'flight-card';
            flightElement.innerHTML = `
                <div class="flight-info">
                    <h3>Flight Information</h3>
                    <p><strong>Origin:</strong> ${origin}</p>
                    <p><strong>Destination:</strong> ${destination}</p>
                    <p><strong>Departure Time:</strong> ${new Date(outboundFlight.departureDateTime).toLocaleString()}</p>
                    <p><strong>Arrival Time:</strong> ${new Date(outboundFlight.arrivalDateTime).toLocaleString()}</p>
                    <p><strong>Outbound Price:</strong> $${outboundPrice}</p>
                    <p><strong>Return Departure Time:</strong> ${new Date(returnFlight.departureDateTime).toLocaleString()}</p>
                    <p><strong>Return Arrival Time:</strong> ${new Date(returnFlight.arrivalDateTime).toLocaleString()}</p>
                    <p><strong>Return Price:</strong> $${returnPrice}</p>
                </div>
            `;
            flightCardsContainer.appendChild(flightElement);
        });
    } else {
        console.error('No flight data found in localStorage');
    }
}

document.addEventListener('DOMContentLoaded', displayFlights);

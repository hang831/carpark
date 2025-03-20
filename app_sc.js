let carParks = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || []; // Load favorites from localStorage

function showSection(section, element) {
    // Hide all sections
    document.getElementById('favorites-section').classList.add('hidden');
    document.getElementById('search-section').classList.add('hidden');
    document.getElementById('config-section').classList.add('hidden');

    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active-tab');
    });

    // Show the selected section
    if (section === 'favorites') {
        document.getElementById('favorites-section').classList.remove('hidden');
    } else if (section === 'search') {
        document.getElementById('search-section').classList.remove('hidden');
    } else if (section === 'config') {
        document.getElementById('config-section').classList.remove('hidden');
    }

    // Add active class to the clicked link
    element.classList.add('active-tab');
}

// Initial page load
showSection('favorites', document.querySelector('.nav-link[onclick*="favorites"]')); // Show favorites section by default


// Function to fetch car park data from the API
async function fetchCarParks() {
    try {
        const response = await fetch('https://resource.data.one.gov.hk/td/carpark/basic_info_all.json');
        const data = await response.json();
        carParks = data.car_park; // Store the fetched data
        displayRandomCarParks(); // Display random car parks on load
        displayFavorites(); // Display favorites on load
    } catch (error) {
        console.error('Error fetching car parks:', error);
    }
}

// Randomly select and display three car park cards
function displayRandomCarParks() {
    const randomParks = carParks.sort(() => 0.5 - Math.random()).slice(0, 3);
    displayCarParks(randomParks);
}

function displayCarParks(parks) {
    const cardContainer = document.getElementById('carpark-cards');
    cardContainer.innerHTML = ''; // Clear existing cards

    parks.forEach(carPark => {
        carPark.park_id = carPark.park_id.replace(/\s+/g, '');
        const card = `
            <div class="col-md-4">
                <div class="card">
                    <img src="${carPark.carpark_photo}" class="card-img-top" alt="${carPark.name_tc}">
                    <div class="card-body">
                        <h5 class="card-title">${carPark.name_tc}</h5>
                        <p class="card-text">地址: ${carPark.displayAddress_tc}</p>
                        <p class="card-text">联络电话: ${carPark.contactNo || 'N/A'}</p>
                        <p class="card-text">状态: ${carPark.opening_status || 'Unknown'}</p>
                        <div id="vacancy-${carPark.park_id}" class="mt-3"></div>
                        <button class="btn btn-primary" onclick="handleFavorite('${carPark.park_id}', 'save')">关注</button>
                         <a target="_blank" href="https://www.google.com/maps?q=${carPark.latitude},${carPark.longitude}"><button class="btn btn-success">地图</button></a>
                    </div>
                </div>
            </div>
        `;
        cardContainer.insertAdjacentHTML('beforeend', card);
        fetchVacancy(`${carPark.park_id}`);
    });
}


// Function to display favorites on page load
function displayFavorites() {
    const favoritesContainer = document.getElementById('favorites-cards');
    favoritesContainer.innerHTML = ''; // Clear existing favorites

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `
  
        <div class="alert alert-info" role="alert">
        <h3>未关注任何停车位。</h3>
        </div>`;
        return;
    }

    favorites.forEach(carPark => {
        const card = `
            <div class="col-md-4">
                <div class="card">
                    <img src="${carPark.carpark_photo}" class="card-img-top" alt="${carPark.name_tc}">
                    <div class="card-body">
                        <h5 class="card-title">${carPark.name_tc}</h5>
                        <p class="card-text">地址: ${carPark.displayAddress_tc}</p>
                        <p class="card-text">联络电话: ${carPark.contactNo || 'N/A'}</p>
                        <p class="card-text">状态: ${carPark.opening_status || 'Unknown'}</p>
                         <div id="vacancy-${carPark.park_id}" class="mt-3"></div>
                        <button class="btn btn-danger" onclick="handleFavorite('${carPark.park_id}', 'remove')">移除</button>
                         <a target="_blank" href="https://www.google.com/maps?q=${carPark.latitude},${carPark.longitude}"><button class="btn btn-success">地图</button></a>
                    </div>
                </div>
            </div>
        `;
        favoritesContainer.insertAdjacentHTML('beforeend', card);
        fetchVacancy(`${carPark.park_id}`);
    });
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.role = 'alert';
    alert.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;
    alertContainer.appendChild(alert);

    // Automatically close the alert after 3 seconds
    setTimeout(() => {
        $(alert).alert('close');
    }, 3000);
}

function handleFavorite(parkId, action) {
    const carPark = carParks.find(park => park.park_id === parkId);
    if (!carPark) return;

    if (action === "save") {
        if (!favorites.some(fav => fav.park_id === parkId)) {
            favorites.push(carPark);
            localStorage.setItem('favorites', JSON.stringify(favorites)); // Save to localStorage
            showAlert(`${carPark.name_tc} 已储存到关注!`, 'success'); // Use new alert function
            displayFavorites(); // Update favorites display in real time
        } else {
            showAlert(`${carPark.name_tc} 已经关注了!`, 'warning'); // Use new alert function
        }
    } else if (action === "remove") {
        favorites = favorites.filter(fav => fav.park_id !== parkId);
        localStorage.setItem('favorites', JSON.stringify(favorites)); // Update localStorage
        showAlert(`${carPark.name_tc} 已从关注移除!`, 'danger'); // Use new alert function
        displayFavorites(); // Refresh the favorites display
    }
}

function filterCarParks() {
    const selectedDistrict = document.getElementById('districtFilter').value;
    if (selectedDistrict == "Random") {
        displayRandomCarParks();
    } else {
        const filteredParks = selectedDistrict ? carParks.filter(park => park.district_tc === selectedDistrict) : carParks;
        displayCarParks(filteredParks);
    }
}

function fetchVacancy(parkId) {
    const vehicleTypeMap = {
        "P": "私家车/面包车",
        "M": "摩托车",
        "L": "轻型货车",
        "H": "重型货车",
        "C": "巴士",
        "T": "货柜车",
        "B": "轻型巴士",
        "N": "非专营巴士",
        "P_D": "私家车/面包车（残疾人士专用）",
        "M_D": "摩托车（残疾人士专用）",
        "L_D": "轻型货车（残疾人士专用）",
        "H_D": "重型货车（残疾人士专用）",
        "C_D": "巴士（残疾人士专用）",
        "T_D": "货柜车（残疾人士专用）",
        "B_D": "轻型巴士（残疾人士专用）"
            };

    const vacancy_typeA = {
        "0": "满",
        "-1": "停车场经营者未能提供数据",
        "1": "停车场经营者未能提供数据"
    };

    const vacancy_typeB = {
        "0": "满",
        "-1": "停车场经营者未能提供数据",
    };

    const vacancy_typeC = {
        "0": "停车场关闭",
    };

    fetch(`https://resource.data.one.gov.hk/td/carpark/vacancy_${parkId}.json`)
        .then(response => response.json())
        .then(data => {
            // Find the car park in the response
            const carPark = data.car_park.find(park => park.park_id === parkId);
            if (carPark && Array.isArray(carPark.vehicle_type)) {
                const vacancyInfo = carPark.vehicle_type.map(vehicle => {
                    const serviceCategory = vehicle.service_category[0]; // Get the first service category
                    const category = serviceCategory.category; // Get the category
                    const lastupdate = serviceCategory.lastupdate; // Get the update time
                    const vacancy_type = serviceCategory.vacancy_type; // Get the vacancy_type
                    const vacancy = serviceCategory.vacancy; // Get the vacancy

                    const fullVehicleType = vehicleTypeMap[vehicle.type] || vehicle.type; // Fallback to the original type if not found
                    let vacancyTypeValue = "";

                    if (vacancy_type == "A") {
                        vacancyTypeValue = vacancy_typeA.hasOwnProperty(vacancy) ? vacancy_typeA[vacancy] : vacancy; // Fallback to the original type
                    } else if (vacancy_type == "B") {
                        vacancyTypeValue = vacancy_typeB.hasOwnProperty(vacancy) ? vacancy_typeB[vacancy] : vacancy; // Fallback to the original type
                    } else {
                        vacancyTypeValue = vacancy_typeC.hasOwnProperty(vacancy) ? vacancy_typeC[vacancy] : vacancy; // Fallback to the original type
                    }
                    return `<p><h4><span class="badge badge-primary">${fullVehicleType}</span></h4> (${category}): ${vacancyTypeValue} <br/>最后更新: ${lastupdate} </p>`;
                }).join('');

                document.getElementById(`vacancy-${parkId}`).innerHTML = `<h6>停车场空位详情:</h6>${vacancyInfo}`;
            } else {
                document.getElementById(`vacancy-${parkId}`).innerHTML = `<h6>暂无空位讯息</h6>`;
            }
        })
        .catch(error => {
            console.error('Error fetching vacancy details:', error);
        });
}

// Fetch car parks when the page loads
fetchCarParks();

function myFunction() {
    //console.log("Function called at interval: " + (intervalDuration / 1000) + " seconds.");
    displayFavorites();
}
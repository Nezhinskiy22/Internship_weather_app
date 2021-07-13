// -------------------Fetch weather data----------------

let key = "6098b624670ec84594279f993228f92d"
let baseUrl = "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}"
let searchButton = document.querySelector('.search-button')
let mainSearchElement = document.querySelector("#main-search")
let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });







searchButton.onclick = function searchCityFunc() {
    let searchCity = mainSearchElement.value
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${key}`)
        .then(function(resp) {
            return resp.json()
        })
        .then(showCityWeather)
        .catch(function() {

        })
}


let placeElement = document.querySelector('.place')
let temperatureElement = document.querySelector('.temperature')
let precipationElement = document.querySelector('.precipation')
let descriptionElement = document.querySelector('.description')
let dateElement = document.querySelector('.date')
let belowZeroElement = document.querySelector('.below-zero')
let aboveZeroElement = document.querySelector('.above-zero')
let weatherIconElement = document.querySelector('.weather-icon')

let cityElementClass = ""


let showCityWeather = (data) => {
    placeElement.textContent = data.name + ', ' + regionNames.of(data.sys.country)
    temperatureElement.textContent = Math.round(data.main.temp - 273) + ' °C'
    precipationElement.textContent = data.weather[0].main
    let a = data.weather[0].description
    a = a[0].toUpperCase() + a.substring(1)
    descriptionElement.textContent = a
    dateElement.textContent = dateToday
    belowZeroElement.textContent = Math.round(data.main.temp_min - 273) + ' °C'
    aboveZeroElement.textContent = Math.round(data.main.temp_max - 273) + ' °C'
    const weatherIcon = document.createElement('img')
    let imageUrl = `https://openweathermap.org/img/wn/${data.weather[0]['icon']}@2x.png`
    weatherIcon.setAttribute('src', imageUrl)
    weatherIconElement.innerHTML = ""
    weatherIconElement.append(weatherIcon)
}

// ---------------Find cities------------------


let search = document.querySelector("#main-search")
let noResult = document.querySelector('.not-found')
let matchListElement = document.querySelector(".match-list")
let resultDropdownElement = document.querySelector('.result-dropdown')
let searchStates = async searchInput => {
    let value = searchInput.value

    if (value.length < 3) {
        clearSearchResults()
        return
    }

    let res = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${key}`)
    if (searchInput.value.length < 3) {
        clearSearchResults()
        return
    }
    let states = await res.json()
    if (states.list.length === 0) {
        showSearchNotFound()
        return
    }
    showSearchResult(states)
}

let clearSearchResults = () => {
    matchListElement.innerHTML = ""
    noResult.classList.remove('not-found-active')
    matchListElement.classList.remove("match-list-active")
}

let showSearchNotFound = () => {
    matchListElement.innerHTML = ""
    noResult.classList.add('not-found-active')
    matchListElement.classList.remove("match-list-active")
}

let showSearchResult = states => {
    noResult.classList.remove('not-found-active')
    matchListElement.classList.add("match-list-active")
    let links = ""
    states.list.forEach(item => {
        links += `<li class="card-body ${cityElementClass}">${item.name}, ${regionNames.of(item.sys.country)}</li> `

    })
    clearSearchResultListener()
    matchListElement.innerHTML = links
    setSearchResultListener()
}

search.addEventListener('input', () => {
    searchStates(search)
})




// ---------------city buttons search-------------------
let cityButtons = document.querySelectorAll(".city-button")

cityButtons.forEach(function(btn) {
    btn.addEventListener('click', function(event) {
        let searchCity = event.target.value
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${key}`)
            .then(function(resp) {
                return resp.json()
            })
            .then(showCityWeather)
            .catch(function() {

            })
        scrollTop()
    })

})



// --------------Add year at the end ----------

let yearOnPage = document.querySelector('#currentYear')
    .innerHTML = new Date().getFullYear()



// -----------------Currett date--------------
let currentDate = new Date()
let day = currentDate.getDate()
let months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')
let month = months[currentDate.getMonth()]
let year = currentDate.getFullYear()
let dateToday = day + " " + month + " " + year




// -----------search on list click------------

function getWeather(a) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${a}&appid=${key}`)
        .then(function(resp) {
            return resp.json()
        })
        .then(showCityWeather)
        .catch(function() {

        })
}

function setSearchResultListener() {
    document.querySelectorAll(".card-body").forEach(cardBody =>
        cardBody.addEventListener('click', searchResultClickListener)
    )
}

function clearSearchResultListener() {
    document.querySelectorAll(".card-body").forEach(cardBody =>
        cardBody.removeEventListener('click', searchResultClickListener)
    )
}

function searchResultClickListener(e) {
    let a = e.target.textContent
    getWeather(a)
    mainSearchElement.value = a
    clearSearchResults()
}

// ------------hide list on page clic----------

document.onclick = function(e) {
    if (resultDropdownElement.contains(e.target) || resultDropdownElement === e.target) {
        return
    };

    clearSearchResults()
}

// --------------day&night theme---------------
let themeBackground = document.querySelector('.result')

let date = new Date()
let h = date.getHours()
if (h < 6 || h > 21) {
    cityElementClass = 'card-body-night'
    searchButton.classList.add("button-night")
    themeBackground.classList.add("result-night")
} else {
    searchButton.classList.remove("button-night")
    themeBackground.classList.remove("result-night")
}


// --------------Top scroll---------------

function scrollTop() {
    mainSearchElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    })
}





mainSearchElement.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
        getWeather(this.value)
        clearSearchResults()
    }

})
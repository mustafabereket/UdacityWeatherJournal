/* Global Variables */
const API_KEY = '52b18c4fff6a53e6809a84dc38f7d45e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const postURL = ',us&appid=';
const zip = document.getElementById('zip');
const city = document.getElementById('city');
const temp = document.getElementById('temp');
const button = document.getElementById('generate');
const userResponse = document.getElementById('feelings');
const errorMessage = document.getElementById('errorMessage');
const journalView = document.getElementById('journal');


// Helper Functions
const generate = async() => {
    if(userResponse.value && zip.value){ //Validation check
        errorMessage.innerHTML = '';
        const result = await getWeather();
        if(result && result.cod === 200){
            updateUI(result);
            const postAction = await submitRecord(result);
            getJournal();
        } else {
            errorMessage.innerHTML = `Wrong input: ${result.message}`;
        }
    } else {
        errorMessage.innerHTML = 'Please provide a US zip code and some journal notes';
    }
}
const updateUI = (payload)=> {
    city.innerHTML = payload.name;
    temp.innerHTML = Math.round(payload.main.temp - 273.15) + ' &#176;C';
}

// GET call to fetch Weather data
const getWeather = async() =>{
    const response = await fetch(BASE_URL + zip.value + postURL + API_KEY);
    return response.json();
}

// POST function
const submitRecord = async (result) => {
    const postObj = {
        userResponse: userResponse.value,
        zip: zip.value,
        city: result.name,
        temp: (result.main.temp - 273.15).toFixed(0),
        date: new Date()
    }
    const postResponse = await fetch('http://localhost:3000/postData', {
        method: 'POST',
        credentials: 'same-origin', 
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(postObj)
    });
    return postResponse;
}

// GET function
const getJournal = () => {
    fetch('http://localhost:3000/getData').then(async response => {
        const data = await response.json();
        updateJournalView(data);
    })
}

// Dynamically Updating UI
// Using Document Fragment
const updateJournalView = (data) => {
    const view = document.createDocumentFragment();
    journalView.innerHTML = '';
    for (const entry in data){
        const div = document.createElement('div');
        const date = document.createElement('h3');
        date.innerHTML = new Date(data[entry].date).toDateString();
        // Adding city name here as an extra
        const city = document.createElement('p');
        city.innerHTML = `${data[entry].city} ZIP: ${data[entry].zip}`;
        const temp = document.createElement('p');
        temp.innerHTML = `${data[entry].temp} &#176;C`;
        const notes = document.createElement('p');
        notes.innerHTML = data[entry].userResponse;
        div.appendChild(date);
        div.appendChild(city);
        div.appendChild(temp);
        div.appendChild(notes);
        div.className = 'journalCard';
        view.appendChild(div);
    }
    journalView.appendChild(view);
}
button.addEventListener('click', generate);
getJournal();


//Trayendo los elementos necesarios desde el DOM

const app = document.querySelector('.weather-app')
const temp = document.querySelector('.temp')
const dateOutput = document.querySelector('.date')
const timeOutput = document.querySelector('.time')
const conditionOutput = document.querySelector('.condition')
const nameOutput = document.querySelector('.name')
const details = document.querySelector('.details')
const icon = document.querySelector('.icon')
const cloudOutput = document.querySelector('.cloud')
const humidityOutput = document.querySelector('.humidity')
const windOutput = document.querySelector('.wind')
const form = document.getElementById('location-input')
const btn = document.querySelector('.submit')
const cities = document.querySelectorAll('.city')
const baseUrl = " https://api.weatherapi.com/v1/current.json?"
const apikey = "key=511483f5c6bd41aa9cb72758221007&q="


//Ciudad a mostrar por default
let cityInput = "Chiguayante"


//Agregando 'Click Event' para cada ciudad en el panel
cities.forEach((city) => {
  city.addEventListener('click', (e) => {
    //Cambiar la ciudad por default con la ciudad clickeada
    cityInput = e.target.innerHTML;
    
    //función que obtiene y muestra todos los datos de la API meteorológica
    fetchWeatherData()

    //desvanecer la aplicación (animación simple)
    app.style.opacity = "0"
  })
});

//Agregando el evento 'submit' del formulario
form.addEventListener('submit', (e) => {
  //Si el input (barra de busqueda) esta vacio, enviara una alerta
  if (search.value.length === 0) {
    alert('Please type in a city name')
  } else {
    //Cambia la ciudad default por la ciudad escrita en el input
    cityInput = search.value;
    fetchWeatherData()

    //Elimina el texto del input
    search.value = ""
    app.style.opacity = "0"
  }

  //Previniendo el comportamiento por defaul del formulario
  e.preventDefault()
});

//Función que devuelve un día de la semana a partir de una fecha
function dayOfTheWeek(day, month, year) {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
  
  let date = new Date(`${month},${day},${year}`);
  return weekday[date.getDay()]
}

//Función que obtiene y muestra todos los datos de la API meteorológica
function fetchWeatherData() {
  //Obteniene los datos y agrega dinamicamente el nombre de la ciudad
  fetch(`${baseUrl}${apikey}${cityInput}&aqi=no`)

  //Obtiene la data en formato JSON y lo convierte a un Objeto JS

  .then(response => response.json())
  .then(data => {
    console.log(data)

    temp.innerHTML = data.current.temp_c + "&#176";
    conditionOutput.innerHTML = data.current.condition.text

    //Obtengo la fecha y la hora de la ciudad, y guardo el día, el mes, el año y la hora en variables individuales
    const date = data.location.localtime
    const y = parseInt(date.substr(0,4))
    const m = parseInt(date.substr(5,2))
    const d = parseInt(date.substr(8,2))
    const time = date.substr(11);

    //Reformateo la hora para mostrar en la pantalla
    //Formato original: 2022-07-10 02:38
    //Formato nuevo: 02:38 - Domingo 10, 7 2022

    dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`
    timeOutput.innerHTML = time

    //Agregar el nombre de la ciudad en la pagina
    nameOutput.innerHTML = data.location.name

    //Agrego los detalles del clima a la pagina
    cloudOutput.innerHTML = data.current.cloud + "%";
    humidityOutput.innerHTML = data.current.humidity + "%";
    windOutput.innerHTML = data.current.wind_kph + " km/h"

    //Obtengo la URL del ícono correspondiente para el clima y extraiga una parte de ella
    const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length)

    //Reformateo la URL del icono a su propia ruta de la carpeta local y la agrego a la página
    icon.src = "./icons/" + iconId;

    //Seteo hora predeterminada del dia
    let timeOfDay = "day"

    //Obtengo el Id único para cada condición climática
    const code = data.current.condition.code

    //Cambio a noche si es que es de noche en la ciudad elegida
    if(!data.current.is_day) {
      timeOfDay = "night"
    }


    if (code == 1000) {

      //Seteo la imagen de fondo a clear si el clima es despejado (code: 1000 == despejado)
      app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpeg)`

      //Cambio el color de boton a noche
      btn.style.background = "#e5ba92"

      if(timeOfDay == "night") {
        btn.style.background = "#181e27"
      }
    }

    // Lo mismo para el tiempo nublado
    else if (
      code == 1003 ||
      code == 1006 ||
      code == 1009 ||
      code == 1030 ||
      code == 1069 ||
      code == 1087 ||
      code == 1135 ||
      code == 1273 ||
      code == 1276 ||
      code == 1279 ||
      code == 1282 
    ) {
      app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpeg)`
      btn.style.background = "#fa6d1b"

      if(timeOfDay == "night") {
        btn.style.background = "#181e27"
      }
    }

    // Lo mismo para el tiempo lluvioso
    else if (
      code == 1063 ||
      code == 1069 ||
      code == 1072 ||
      code == 1150 ||
      code == 1153 ||
      code == 1180 ||
      code == 1183 ||
      code == 1186 ||
      code == 1189 ||
      code == 1192 ||
      code == 1195 ||
      code == 1204 ||
      code == 1207 ||
      code == 1240 ||
      code == 1243 ||
      code == 1246 ||
      code == 1249 ||
      code == 1252 
      
    ) {
      app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpeg)`
      btn.style.background = "#647d75"

      if(timeOfDay == "night") {
        btn.style.background = "#325c80"
      }

      //Para finalizar, tiempo nevoso
    } else {
      app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpeg)`
      btn.style.background = "#4d72aa"

      if(timeOfDay == "night") {
        btn.style.background = "#1b1b1b"
      }
    }

    //Desvanecerse en la página una vez que todo está hecho
    app.style.opacity = "1"
  })

  //Si un usuario ingresa una ciudad que no existe, mostrará una alerta

  .catch(() => {
    alert("City not found, please try again")
    app.style.opacity = "1"
  })
}

//Llamado a la funcion
fetchWeatherData()

//Desvanecer en la pagina
app.style.opacity = "1"
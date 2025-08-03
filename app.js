
document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.btn-search').addEventListener('click', async function() {
        const city = document.querySelector("#cityFounded")
        const city_text = city.value.trim()
        city.textContent = " "
        const city_select =  await getCity(city_text)
        const result_city = city_select.results?.[0];
        const latitude = result_city.latitude
        const longitude = result_city.longitude
        const weatherData = await getWeatherData(latitude, longitude)
        document.querySelector('.table-weather').style.display = "block"
        buildWeather(weatherData,result_city)
    })
    
});


async function getCity(city) {
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`)
    const data = await res.json()
    return data
  } catch(err) {
    console.error(err)
  }
}

async function getWeatherData(latitude, longitude) {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`)
    const data = await res.json()
    return data
  } catch(err) {
    console.error(err)
  }
}

function buildWeather(data,city_data) {
  document.querySelector(".city_selected").textContent = city_data.name
  document.querySelector(".city_selected").style.color = data.current.is_day === 1 ? "#000": "#FFF"
  document.querySelector('.temperature').textContent = `${data.current.temperature_2m} ${data.current_units.temperature_2m} `
  document.querySelector(".temperature").style.color = data.current.is_day === 1 ? "#000": "#FFF"
  document.querySelector(".day_image").style.backgroundImage = data.current.is_day === 1 
  ? "url('./images/day.jpg')" 
  : "url('./images/night.jpg')";
  document.querySelector(".day_image").style.backgroundSize = "cover";
  document.querySelector(".day_image").style.backgroundPosition = "center";
   console.log(data)
  //Table
  document.querySelector('.country-table').textContent = city_data.country
  document.querySelector('.timezone').textContent = city_data.timezone
  document.querySelector('.population').textContent = city_data.population
  const temp_max = `${data.daily.temperature_2m_max} ${data.daily_units.temperature_2m_max}`
  const temp_min = `${data.daily.temperature_2m_min} ${data.daily_units.temperature_2m_min}`
  document.querySelector('.temperature-daily').innerHTML = `Low: ${temp_min} </br> Max: ${temp_max}`
}


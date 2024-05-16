import React, { useEffect, useState } from "react";
import axios from 'axios';
import './Weather.css'
import { UilSun, } from "@iconscout/react-unicons";
import BarLoader from "react-spinners/BarLoader";

const api = {
  key: process.env.REACT_APP_WEATHER_API_KEY,
  base: process.env.REACT_APP_OPENWEATHER_LINK,
  city: process.env.REACT_APP_CITY_FOR_WEATHER
}

const icon = <UilSun />;


const Weather = () => {
  const [weather, setWeather] = useState("")

  useEffect(() => {
    axios.get(`${api.base}weather?q=${api.city}&units=metric&APPID=${api.key}`)
      .then((result) => {
        setWeather(result.data)
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error)
      })

  }, []);

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const makeIconURL = (iconID) => `https://openweathermap.org/img/wn/${iconID}@2x.png`

  return (
    <div className="Weather">
      {weather ? (
        <div className="WeatherContainer">
          <img src={makeIconURL(weather.weather[0].icon)} alt="Weather Icon" className="WeatherIcon" />
          <p className="WeatherStats"><b>{weather.name} {weather.main.temp}°C {weather.weather[0].description}</b></p>
        </div>
      ) : (
        <BarLoader
          cssOverride={override}
          color="red" />
      )}
    </div>
  )
}

export default Weather
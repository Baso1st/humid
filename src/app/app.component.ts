import { Component, OnInit } from '@angular/core';
import { WeatherService } from './services/weather.service';
import { WeatherPoint } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  weatherPoint: WeatherPoint;

  constructor(
    private weatherService: WeatherService
  ) { }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.weatherService.getWeather(position.coords.latitude, position.coords.longitude).subscribe(weatherPoint => {
          if (weatherPoint) {
            this.weatherPoint = weatherPoint;
          }
        })
      });
    } else {
      console.log('Location is not supported');
    }
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherPoint} from '../types';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  weatherKey = "d69052cdbbbf76ae897e756a1d311594"

  constructor(
    private http: HttpClient
  ) { }


  getWeather(latitude: number, longitude: number): Observable<WeatherPoint> {
    // return this.http.get('api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=d69052cdbbbf76ae897e756a1d311594');
    return this.http.get<WeatherPoint>(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&APPID=${this.weatherKey}`);
  }
}

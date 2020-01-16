import { Component, OnInit } from '@angular/core';
import { WeatherService } from './services/weather.service';
import { WeatherPoint} from './types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, map, flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LocationService } from './services/location.service';
import { MatAutocompleteSelectedEvent } from '@angular/material';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  weatherPoint: WeatherPoint;
  formGroup: FormGroup;
  filteredCities: Observable<Array<string>>;
  imageSourceDirectory = "../assets/images/";
  imageSource: string;
  iconSourceAPI = "https://openweathermap.org/img/wn/";
  iconSource: string;
  screedWidth: number;

  FortWayneLat = 41.1253703;
  FortWayneLong  = -85.3485966;

  constructor(
    private weatherService: WeatherService,
    private formBuilder: FormBuilder,
    private locationService: LocationService
  ) { }

  ngOnInit() {

    this.screedWidth = window.screen.width;

    this.formGroup = this.formBuilder.group({
      'location': ['']
    });

     this.filteredCities = this.formGroup.get('location').valueChanges.pipe(
        debounceTime(100),
        distinctUntilChanged(),
        flatMap(newValue => newValue.trim() ? this.locationService.getLocations(newValue): [])
       )

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.weatherService.getWeather(position.coords.latitude, position.coords.longitude).subscribe(weatherPoint => {
          if (weatherPoint) {
            this.weatherPoint = weatherPoint;
            this.setImageSource();
            this.setIconSource();
          }
        })
      }, error => {
        this.formGroup.get('location').setValue('Fort Wayne, IN, USA')
        this.weatherService.getWeather(this.FortWayneLat, this.FortWayneLong).subscribe(weatherPoint => {
          if (weatherPoint) {
            this.weatherPoint = weatherPoint;
            this.setImageSource();
            this.setIconSource();
          }
        })
      });
    } else {
    }
    
  }

  /**
   * Calls the location service to get the geocode based on the user text
   * and uses that geocode to retrieve the weather info. Then calls the setImageSource and setIconSource functions.
   * @param event 
   */
  citySelected(event: MatAutocompleteSelectedEvent) {
    if (event && event.option && event.option.value)
      this.locationService.getGeoCode(event.option.value).subscribe(geoCode => {
        if (geoCode && geoCode.results && geoCode.results.length > 0) {
          let latitude = geoCode.results[0].geometry.location.lat;
          let longitude = geoCode.results[0].geometry.location.lng;
          this.weatherService.getWeather(latitude, longitude).subscribe(weatherPoint => {
            if (weatherPoint) {
              this.weatherPoint = weatherPoint;
              this.setImageSource();
              this.setIconSource();
            }
          })
        }
      })
  }


  /**
   * Sets the images source based on the humidity level
   */
  setImageSource() {
    if (this.weatherPoint) {
      let humidity = this.weatherPoint.main.humidity;
      if (!humidity || humidity <= 0) {
        this.imageSource = this.imageSourceDirectory + "humid1.png";
      } else if (humidity <= 20) {
        this.imageSource = this.imageSourceDirectory + "humid2.png";
      } else if (humidity <= 40) {
        this.imageSource = this.imageSourceDirectory + "humid3.png";
      } else if (humidity <= 60) {
        this.imageSource = this.imageSourceDirectory + "humid4.png";
      } else if (humidity <= 80) {
        this.imageSource = this.imageSourceDirectory + "humid5.png";
      } else if (humidity <= 100) {
        this.imageSource = this.imageSourceDirectory + "humid6.png";
      }
    }
  }

  /**
   * Sets the icon source based on the retrieved icon name from the WeatherPoint object.
   */
  setIconSource() {
    if (this.weatherPoint) {
      this.iconSource = `${this.iconSourceAPI}${this.weatherPoint.weather[0].icon}${this.screedWidth >= 768 ? '@2x' : ''}.png`
    }
  }

}

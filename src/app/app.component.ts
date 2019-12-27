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

  constructor(
    private weatherService: WeatherService,
    private formBuilder: FormBuilder,
    private locationService: LocationService
  ) { }

  ngOnInit() {
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
          }
        })
      }, error => {

      });
    } else {
    }
  }

  citySelected(event: MatAutocompleteSelectedEvent) {
    if (event && event.option && event.option.value)
      this.locationService.getGeoCode(event.option.value).subscribe(geoCode => {
        if (geoCode && geoCode.results && geoCode.results.length > 0) {
          let latitude = geoCode.results[0].geometry.location.lat;
          let longitude = geoCode.results[0].geometry.location.lng;
          this.weatherService.getWeather(latitude, longitude).subscribe(weatherPoint => {
            if (weatherPoint) {
              this.weatherPoint = weatherPoint;
            }
          })
        }
      })
  }

}

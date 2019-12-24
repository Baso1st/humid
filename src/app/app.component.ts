import { Component, OnInit } from '@angular/core';
import { WeatherService } from './services/weather.service';
import { WeatherPoint, City } from './types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  weatherPoint: WeatherPoint;
  formGroup: FormGroup;
  cities: Array<City>;
  filteredCities: Observable<Array<City>>;

  constructor(
    private weatherService: WeatherService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.weatherService.getCities().subscribe(cities => {
      // this.cities = cities.slice(0, 100);
      this.cities = cities;
    })

    this.formGroup = this.formBuilder.group({
      'location': ['']
    });

     this.filteredCities = this.formGroup.get('location').valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        // startWith(''),
        map(value => {
          const filterValue = value.toLowerCase();
          return this.cities.filter(city => `${city.name}${city.country}`.toLowerCase().includes(filterValue));
        })
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

  autoCompleteDisplayFn(city: City): string | undefined {
    return city ? `${city.name}, ${city.country}` : undefined;
  }

}

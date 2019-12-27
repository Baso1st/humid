import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {} from 'googlemaps';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private gKey = "AIzaSyAKcnDbWxMi1fzkNL37JB6oPywev-oGyQ4";
  private predictionSubject = new Subject<string[]>();

  
  constructor(
    private http: HttpClient
  ) { }

  getLocations(term: string): Observable<string[]> {
    new google.maps.places.AutocompleteService().getPlacePredictions({ input: term, types: ['(cities)'] }, (predictions, status) => {
      if (status.toUpperCase() === 'OK') {
        this.predictionSubject.next(predictions.map(p => p.description));
      } else {
        throw Error('Predictions Status is not Ok');
      }
    });
    return this.predictionSubject;
  }

  getGeoCode(cityName: string) {
    this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${cityName}&key=${this.gKey}`);
  }

} 

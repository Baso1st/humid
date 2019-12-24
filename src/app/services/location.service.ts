import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  gKey = "AIzaSyAKcnDbWxMi1fzkNL37JB6oPywev-oGyQ4";

  // service = new google.maps.places.AutocompleteService();

  constructor(
    private http: HttpClient
  ) { }


  
} 

import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpClient, HttpClientJsonpModule, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class dbService {
  REST_DB_KEY = '5bb259a3bd79880aab0a78a0';
  httpOptions = {
    headers: new HttpHeaders({
      'x-apikey': this.REST_DB_KEY
    })
  };


  constructor(private http: HttpClient) {
  }

  public getAllClients(): any {
    return this.http.get(`https://carrental-027b.restdb.io/rest/clients`, this.httpOptions);
  }
  public getAllCars(): any {
    return this.http.get(`https://carrental-027b.restdb.io/rest/cars`, this.httpOptions);
  }

}

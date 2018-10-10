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

  public addNewCustomer(customer: any): any{
    return this.http.post('https://carrental-027b.restdb.io/rest/clients', customer, this.httpOptions);
  }

  public updateCustomer(customer: any, id: string): any{
    return this.http.put(`https://carrental-027b.restdb.io/rest/clients/${id}`, customer, this.httpOptions);
  }

  public removeCustomer(id: string): any{
    return this.http.delete(`https://carrental-027b.restdb.io/rest/clients/${id}`, this.httpOptions);
  }

  public getAllCars(): any {
    return this.http.get(`https://carrental-027b.restdb.io/rest/cars`, this.httpOptions);
  }

  public removeCar(id: string): any{
    return this.http.delete(`https://carrental-027b.restdb.io/rest/cars/${id}`, this.httpOptions);
  }

  public addNewRent(rent: any): any{
    return this.http.post('https://carrental-027b.restdb.io/rest/rentals', rent, this.httpOptions);
  }

  public getAllRentals(): any{
    return this.http.get(`https://carrental-027b.restdb.io/rest/rentals`, this.httpOptions);
  }
}

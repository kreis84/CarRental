import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class LoaderService{
  loaderStatus = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  public turnOn(): void {
    this.loaderStatus.next(true);
  }

  public turnOff(): void {
    this.loaderStatus.next(false);
  }

  get status(): Observable<boolean> {
    return this.loaderStatus;
  }
}

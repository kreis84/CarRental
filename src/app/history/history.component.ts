import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoaderService } from '../services/loader.service';
import { dbService } from '../services/db.service';
import { BehaviorSubject, combineLatest } from 'rxjs/index';
import { DialogComponent } from '../utils/dialog/dialog.component';
import { BUTTON_TYPE, MSG_TYPES } from '../utils/utils';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  @Input() car: any = null;
  @Input() customer: any = null;
  @Input() activ = new BehaviorSubject(false);

  histGroup: FormGroup = new FormGroup({
    selectedCar: new FormControl(''),
    selectedCustomer: new FormControl('')
  });

  carsList: Array<any>;
  customersList: Array<any>;
  rentalsList: Array<any>;
  selectedHistoryList: Array<any>;

  constructor(public loader: LoaderService,
              public dialogApi: MatDialog,
              public dbApi: dbService) {
  }

  ngOnInit() {
    this.activ.subscribe((activ) => {
      if (activ) {
        this.onTabActive();
      }
    });
  }

  public onTabActive(): void {
    this.loader.turnOn();
    this.histGroup.reset();
    combineLatest(this.dbApi.getAllRentals(), this.dbApi.getAllCars(), this.dbApi.getAllClients())
      .subscribe(([rentals, cars, customers]) => {
        this.carsList = cars;
        this.customersList = customers;
        this.rentalsList = rentals;
        this.loader.turnOff();
        this.setSubscribers();

        if (this.car || this.customer) {
          this.initByInput();
        }

      }, (error) => {
        this.loader.turnOff();
        this.dialogApi.open(DialogComponent, {data: {type: MSG_TYPES.ERROR, buttonType: BUTTON_TYPE.OK, message: error.message}});
      });

  }

  public setSubscribers(): void {
    this.histGroup.get('selectedCar').valueChanges.subscribe((carId) => {
      this.selectedHistoryList = this.rentalsList.filter((rent) => rent.car_id === carId);
    });
    this.histGroup.get('selectedCustomer').valueChanges.subscribe((customerId) => {
      this.selectedHistoryList = this.rentalsList.filter((rent) => rent.customer_id === customerId);
    });
  }

  public initByInput(): void {
    this.car
      ? this.histGroup.get('selectedCar').patchValue(this.car._id)
      : this.histGroup.get('selectedCustomer').patchValue(this.customer._id);
  }
}

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
  historyForTable: Array<any>;

  displayedColumns = ['person', 'car', 'time', 'cost'];

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
      if (carId === '') {
        return;
      }
      this.selectedHistoryList = this.rentalsList.filter((rent) => rent.car_id === carId);
      this.histGroup.get('selectedCustomer').patchValue('');
      this.prepareHistoryForTable();
    });
    this.histGroup.get('selectedCustomer').valueChanges.subscribe((customerId) => {
      if (customerId === '') {
        return;
      }
      this.selectedHistoryList = this.rentalsList.filter((rent) => rent.customer_id === customerId);
      this.histGroup.get('selectedCar').patchValue('');
      this.prepareHistoryForTable();
    });
  }

  public prepareHistoryForTable(): void {
    this.historyForTable = this.selectedHistoryList.map((history) => {
      const customer = this.customersList.find((customer) => customer._id === history.customer_id);
      const car = this.carsList.find((car) => car._id === history.car_id);
      return {
        person: `${customer.name} ${customer.lastName}`,
        car: `${car.mark} ${car.model} ${car.engine}`,
        time: `${history.start_date} - ${history.start_hour}  -  ${history.end_date} / ${history.end_hour}`,
        cost: history.cost
      };
    });
  }

  public initByInput(): void {
    this.car
      ? this.histGroup.get('selectedCar').patchValue(this.car._id)
      : this.histGroup.get('selectedCustomer').patchValue(this.customer._id);
  }
}

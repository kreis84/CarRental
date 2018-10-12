import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { dbService } from '../../services/db.service';
import { BUTTON_TYPE, MSG_TYPES } from '../../utils/utils';
import { DialogComponent } from '../../utils/dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { LoaderService } from '../../services/loader.service';
import * as moment from 'moment';
import { combineLatest } from 'rxjs/index';

@Component({
  selector: 'add-rent',
  templateUrl: './add-rent.component.html',
  styleUrls: ['./add-rent.component.scss']
})
export class AddRentComponent implements OnInit {
  @Input() customer: any = null;
  @Input() car: any = null;

  @Output() onCloseEvent = new EventEmitter();

  customersList: Array<any>;
  carsList: Array<any>;
  selectedCar = new FormControl('');
  selectedCustomer = new FormControl('');
  rentalsList: Array<any>;
  hours: Array<string> = [];

  rentGroup: FormGroup = new FormGroup({
    customerName: new FormControl(''),
    customerLastName: new FormControl(''),
    customerPesel: new FormControl(''),
    carModel: new FormControl(''),
    carMark: new FormControl(''),
    carRegistration: new FormControl(''),
    carBasicCost: new FormControl(''),
    customerId: new FormControl(''),
    carId: new FormControl(''),
    startDate: new FormControl(''),
    startHour: new FormControl(''),
    endDate: new FormControl(''),
    endHour: new FormControl(''),
    cost: new FormControl(''),
    timeSpan: new FormControl(''),
    hoursSpan: new FormControl(''),
    summaryCost: new FormControl('')
  });

  constructor(private dbApi: dbService,
              private loader: LoaderService,
              private dialogApi: MatDialog) {
  }

  ngOnInit() {
    this.loader.turnOn();
    this.generateHours();
    this.fieldsDisable();

    combineLatest(this.dbApi.getAllCars(), this.dbApi.getAllClients(), this.dbApi.getAllRentals()).subscribe(([cars, customers, rentals]) => {
      this.rentalsList = rentals;
      this.customersList = customers.sort((a, b) => a.lastName.localeCompare(b.lastName));
      this.carsList = cars.sort((a, b) => a.mark.localeCompare(b.mark));
      this.loader.turnOff();
      console.log('asdfasdf');
    }, (error) => {
      console.log(error);
      this.loader.turnOff();
      this.dialogApi.open(DialogComponent, {data: {type: MSG_TYPES.ERROR, buttonType: BUTTON_TYPE.OK, message: error.message}});
    });

    this.car
      ? this.fillCar()
      : this.fillCustomer();

    this.setSubscribers();
  }

  public generateHours(): void {
    for (let i = 0; i < 24; i++) {
      const hour = i < 10 ? `0${i}:00` : `${i}:00`;
      this.hours.push(hour);
    }
  }

  public setSubscribers(): void {
    this.selectedCar.valueChanges.subscribe((selectedCarId) => {
      const selectedCar = this.carsList.find((car) => car._id === selectedCarId);
      this.fillCar(selectedCar);
      this.countSummaryCost();
    });

    this.selectedCustomer.valueChanges.subscribe((selectedCustomerId) => {
      const selectedCustomer = this.customersList.find((customer) => customer._id === selectedCustomerId);
      this.fillCustomer(selectedCustomer);
    });

    combineLatest(this.rentGroup.get('startDate').valueChanges,
      this.rentGroup.get('startHour').valueChanges,
      this.rentGroup.get('endDate').valueChanges,
      this.rentGroup.get('endHour').valueChanges)
      .subscribe(([startDate, startHour, endDate, endHour]) => {
        startDate.setHours(startHour.split(':')[0]);
        endDate.setHours(endHour.split(':')[0]);
        if (moment(endDate).isBefore(moment(startDate))) {
          this.rentGroup.get('hoursSpan').patchValue('');
          this.rentGroup.get('timeSpan').patchValue('');
          this.rentGroup.get('summaryCost').patchValue('');
          this.dialogApi.open(DialogComponent, {
            data: {
              type: MSG_TYPES.WARN, buttonType: BUTTON_TYPE.OK,
              message: 'End date can\'t be before start date.'
            }
          });
        } else {
          this.countTimeSpan(startDate, endDate);
          this.countSummaryCost();
        }
      });
  }

  public countTimeSpan(startDate, endDate): void {
    const timeSpan = moment(endDate).diff(moment(startDate));
    const hours = timeSpan / (3600 * 1000);
    const daysAndHours = `${(hours - (hours % 24)) / 24} days, ${hours % 24} hours`;
    this.rentGroup.get('hoursSpan').patchValue(hours);
    this.rentGroup.get('timeSpan').patchValue(daysAndHours);
  }

  public countSummaryCost(): void {
    const carBasicCost = this.rentGroup.get('carBasicCost').value;
    const hoursSpan = this.rentGroup.get('hoursSpan').value;
    if (carBasicCost !== '' && hoursSpan !== '') {
      const hourCost = +carBasicCost / 24;
      const summaryCost = hourCost * +hoursSpan;
      this.rentGroup.get('summaryCost').patchValue(summaryCost.toFixed(2));
    }
  }

  public fillCar(selectedCar?: any): void {
    const car = selectedCar ? selectedCar : this.car;
    this.rentGroup.get('carId').patchValue(car._id);
    this.rentGroup.get('carModel').patchValue(car.model);
    this.rentGroup.get('carMark').patchValue(car.mark);
    this.rentGroup.get('carRegistration').patchValue(car.registration);
    this.rentGroup.get('carBasicCost').patchValue((+car.base_cost).toFixed(2));
  }

  public fillCustomer(selectedCustomer?: any): void {
    const customer = selectedCustomer ? selectedCustomer : this.customer;
    this.rentGroup.get('customerId').patchValue(customer._id);
    this.rentGroup.get('customerName').patchValue(customer.name);
    this.rentGroup.get('customerLastName').patchValue(customer.lastName);
    this.rentGroup.get('customerPesel').patchValue(customer.pesel);
  }

  public fieldsDisable(): void {
    this.rentGroup.get('carModel').disable();
    this.rentGroup.get('carMark').disable();
    this.rentGroup.get('carRegistration').disable();
    this.rentGroup.get('carBasicCost').disable();
    this.rentGroup.get('customerName').disable();
    this.rentGroup.get('customerLastName').disable();
    this.rentGroup.get('customerPesel').disable();
    this.rentGroup.get('timeSpan').disable();
    this.rentGroup.get('hoursSpan').disable();
    this.rentGroup.get('summaryCost').disable();
  }

  public onSaveNewRent(): void {
    if (this.checkIfIsRentAlready()) {
      return;
    }

    let carId, customerId;
    if (this.car) {
      carId = this.car._id;
      customerId = this.selectedCustomer.value;
    } else {
      customerId = this.customer._id;
      carId = this.selectedCar.value;
    }
    const newRent = {
      car_id: carId,
      customer_id: customerId,
      start_date: moment(this.rentGroup.get('startDate').value).format('DD.MM.YYYY'),
      start_hour: this.rentGroup.get('startHour').value,
      end_date: moment(this.rentGroup.get('endDate').value).format('DD.MM.YYYY'),
      end_hour: this.rentGroup.get('endHour').value,
      cost: this.rentGroup.get('summaryCost').value
    };
    this.loader.turnOn();
    this.dbApi.addNewRent(newRent).subscribe(() => {
      this.dialogApi.open(DialogComponent, {data: {type: MSG_TYPES.INFO, buttonType: BUTTON_TYPE.OK, message: 'Rent successfuly added.'}});
      this.onCancel();
    }, (error) => {
      this.dialogApi.open(DialogComponent, {data: {type: MSG_TYPES.ERROR, buttonType: BUTTON_TYPE.OK, message: error.message}});
      this.loader.turnOff();
    });
  }

  public checkIfIsRentAlready(): boolean {
    const carId = this.car ? this.car._id : this.selectedCar.value;
    const actualStartDate = moment(`${moment(this.rentGroup.get('startDate').value).format('DD.MM.YYYY')} ${this.rentGroup.get('startHour').value}`, 'DD.MM.YYYY hh:mm');
    const actualEndDate = moment(`${moment(this.rentGroup.get('endDate').value).format('DD.MM.YYYY')} ${this.rentGroup.get('endHour').value}`, 'DD.MM.YYYY hh:mm');
    const colideRental = this.rentalsList
      .filter((rental) => rental.car_id === carId)
      .find((rental) => {
        const e1start = actualStartDate,
          e1end = actualEndDate,
          e2start = moment(`${rental.start_date} ${rental.start_hour}`, 'DD.MM.YYYY hh:mm'),
          e2end = moment(`${rental.end_date} ${rental.end_hour}`, 'DD.MM.YYYY hh:mm');
        return (e1start.isAfter(e2start) && e1start.isBefore(e2end) || e2start.isAfter(e1start) && e2start.isBefore(e1end));
      });

    if (colideRental) {
      const customer = this.customersList.find((customer) => customer._id === colideRental.customer_id);
      const startDate = moment(`${colideRental.start_date} ${colideRental.start_hour}`, 'DD.MM.YYYY hh:mm').format('DD.MM.YYYY hh.mm');
      const endDate = moment(`${colideRental.end_date} ${colideRental.end_hour}`, 'DD.MM.YYYY hh:mm').format('DD.MM.YYYY hh.mm');
      this.dialogApi.open(DialogComponent, {
        data: {
          type: MSG_TYPES.ERROR, buttonType: BUTTON_TYPE.OK,
          message: `The car has already been leased at this time for ${customer.name} ${customer.lastName} (${startDate}  -  ${endDate})`
        }
      });
      return true;
    }
    return false;
  }

  public onCancel(): void {
    this.onCloseEvent.emit();
  }

  public checkIfSaveEnabled(): boolean {
    return this.rentGroup.get('customerPesel').value !== ''
      && this.rentGroup.get('carRegistration').value !== ''
      && this.rentGroup.get('summaryCost').value !== '';
  }
}

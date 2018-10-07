import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs/index';
import { dbService } from '../../services/db.service';
import { clearResolutionOfComponentResourcesQueue } from '@angular/core/src/metadata/resource_loading';
import { BUTTON_TYPE, MSG_TYPES } from '../../utils/utils';
import { DialogComponent } from '../../utils/dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'add-rent',
  templateUrl: './add-rent.component.html',
  styleUrls: ['./add-rent.component.scss']
})
export class AddRentComponent implements OnInit {
  @Input() customer: any = null;
  @Input() car: any = null;

  customersList: Array<any>;
  carsList: Array<any>;
  selectedCar = new FormControl('');
  selectedCustomer = new FormControl('');

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
    cost: new FormControl('')
  });

  constructor(private dbApi: dbService,
              private loader: LoaderService,
              private dialogApi: MatDialog) {
  }

  ngOnInit() {
    this.loader.turnOn();
    this.fieldsDisable();
    combineLatest(this.dbApi.getAllClients(), this.dbApi.getAllCars())
      .subscribe(([customers, cars]) => {
        this.customersList = customers;
        this.carsList = cars.sort((a, b) => a.mark.localeCompare(b.mark));
        this.loader.turnOff();
      }, (error) => {
        this.loader.turnOff();
        this.dialogApi.open(DialogComponent, {data: {type: MSG_TYPES.ERROR, buttonType: BUTTON_TYPE.OK, message: error.message}});
      });
    if (this.customer) {
      this.fillCustomer();
    }
    if (this.car) {
      this.fillCar();
    }

    this.selectedCar.valueChanges.subscribe((selectedCarId) => {
      const selectedCar = this.carsList.find((car) => car._id === selectedCarId);
      this.fillCar(selectedCar);
    });
    this.selectedCustomer.valueChanges.subscribe((selectedCustomerId) => {
      const selectedCustomer = this.customersList.find((customer) => customer._id === selectedCustomerId);
      this.fillCustomer(selectedCustomer);
    });
  }

  public fillCar(selectedCar?: any): void {
    const car = selectedCar ? selectedCar : this.car;
    this.rentGroup.get('carId').patchValue(car._id);
    this.rentGroup.get('carModel').patchValue(car.model);
    this.rentGroup.get('carMark').patchValue(car.mark);
    this.rentGroup.get('carRegistration').patchValue(car.registration);
    this.rentGroup.get('carBasicCost').patchValue(car.base_cost);
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
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { dbService } from '../../services/db.service';
import { LoaderService } from '../../services/loader.service';
import { MatDialog } from '@angular/material';
import { BUTTON_TYPE, MSG_TYPES } from '../../utils/utils';
import { DialogComponent } from '../../utils/dialog/dialog.component';

@Component({
  selector: 'add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {
  @Input() customer: any;
  @Output() onAddNewCustomerBack: EventEmitter<any> = new EventEmitter<any>();

  customerGroup: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    pesel: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]{11}\d*)?$/)]),
    address: new FormControl('', Validators.required),
    birthDate: new FormControl(''),
    phone: new FormControl('', [Validators.pattern(/^-?(0|[1-9]\d*)?$/)])
  });


  constructor(private dbApi: dbService,
              private loaderApi: LoaderService,
              private dialogApi: MatDialog) {
  }

  ngOnInit() {
    if (this.customer) {
      this.initExsitingCustomer();
    }
    // this.customerGroup.valueChanges.subscribe((val) => console.log(this.customerGroup));
  }

  public onSaveNewCustomer(): void {
    const customer = this.customerGroup.getRawValue();
    if(customer.birthDate !== null && customer.birthDate !== undefined && customer.birthDate !== '')
    customer.birthDate = moment(customer.birthDate).format('DD.MM.YYYY').toString();
    const service = this.customer
      ? this.dbApi.updateCustomer(customer, this.customer._id)
      : this.dbApi.addNewCustomer(customer);
    this.loaderApi.turnOn();
    service.subscribe((res) => {
        this.onAddNewCustomerBack.emit();
        this.dialogApi.open(DialogComponent, {data: {type: MSG_TYPES.INFO, buttonType: BUTTON_TYPE.OK, message: 'Customer successfuly added.'}});
      },
      (error) => {
        this.dialogApi.open(DialogComponent, {data: {type: MSG_TYPES.ERROR, buttonType: BUTTON_TYPE.OK, message: error.message}});
        this.loaderApi.turnOff();
      });
  }

  public initExsitingCustomer(): void {
    this.customerGroup.get('name').patchValue(this.customer.name);
    this.customerGroup.get('lastName').patchValue(this.customer.lastName);
    this.customerGroup.get('pesel').patchValue(this.customer.pesel);
    this.customerGroup.get('address').patchValue(this.customer.address);
    this.customerGroup.get('phone').patchValue(this.customer.phone);
    if (this.customer.birthDate) {
      this.customerGroup.get('birthDate').patchValue(new Date(moment(this.customer.birthDate, 'DD.MM.YYYY').toString()));
    } else {
      this.customerGroup.get('birthDate').patchValue('');
    }
  }

  public onCancel(): void {
    this.onAddNewCustomerBack.emit();
  }

  public getPropLength(propName): number {
    if (this.customerGroup.get(propName).value) {
      return this.customerGroup.get(propName).value.toString().length;
    } else {
      return 0;
    }
  }
}

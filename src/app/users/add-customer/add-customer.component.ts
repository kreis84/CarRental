import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { dbService } from '../../services/db.service';

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
    phone: new FormControl('')
  });


  constructor(private dbApi: dbService) {
  }

  ngOnInit() {
    if (this.customer) {
      this.initExsitingCustomer();
    }
    this.customerGroup.valueChanges.subscribe((val) => this.customerGroup);
  }

  public onSaveNewCustomer(): void {
    const customer = this.customerGroup.getRawValue();
    customer.birthDate = moment(customer.birthDate).format('DD.MM.YYYY').toString();
    console.log(customer.birthDate);
    const service = this.customer
      ? this.dbApi.updateCustomer(customer, this.customer._id)
      : this.dbApi.addNewCustomer(customer);
    service.subscribe((res) => this.onAddNewCustomerBack.emit(),
      (error) => console.log(error));
  }

  public initExsitingCustomer(): void {
    this.customerGroup.get('name').patchValue(this.customer.name);
    this.customerGroup.get('lastName').patchValue(this.customer.lastName);
    this.customerGroup.get('pesel').patchValue(this.customer.pesel);
    this.customerGroup.get('address').patchValue(this.customer.address);
    this.customerGroup.get('phone').patchValue(this.customer.phone);
    if (this.customer.birthDate) {
      this.customerGroup.get('birthDate').patchValue(new Date(moment(this.customer.birthDate, 'DD.MM.YYYY').toString()));
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

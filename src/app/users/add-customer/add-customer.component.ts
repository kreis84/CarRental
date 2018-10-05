import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {
  @Output()
  onAddNewCustomerBack: EventEmitter = new EventEmitter(null);

  customerGroup: FormGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      pesel: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]{11}\d*)?$/)]),
      address: new FormControl('', Validators.required),
      birthDate: new FormControl(''),
      phone: new FormControl('')
    });


  constructor() {
  }

  ngOnInit() {
    this.customerGroup.valueChanges.subscribe((val) => this.customerGroup);
  }

  public onSaveNewCustomer(): void {

  }

  public onCancel(): void {
    this.onAddNewCustomerBack.emit();
  }
}

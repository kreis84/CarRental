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
    if(this.customer){
      this.initExsitingCustomer();
    }
    this.customerGroup.valueChanges.subscribe((val) => this.customerGroup);
  }

  public onSaveNewCustomer(): void {
    const customer = this.customerGroup.getRawValue()
    customer.birthDate = moment(customer.birthDate).format('DD.MM.YYYY');
    console.log(customer);
    this.dbApi.putNewCustopmer(customer).subscribe((res) => this.onAddNewCustomerBack.emit(),
      (error) => console.log(error));
  }

  public initExsitingCustomer(): void {

  }

  public onCancel(): void {
    this.onAddNewCustomerBack.emit();
  }
}

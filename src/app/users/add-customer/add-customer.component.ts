import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {
  @Output()
  onAddNewCustomerBack: EventEmitter = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  public onSaveNewCustomer(): void {

  }

  public onCancel(): void {
    this.onAddNewCustomerBack.emit();
  }
}

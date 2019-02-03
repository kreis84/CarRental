import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { dbService } from '../services/db.service';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { LoaderService } from '../services/loader.service';
import { DialogComponent } from '../utils/dialog/dialog.component';
import { BUTTON_TYPE, MSG_TYPES } from '../utils/utils';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Output() changeMainTab = new EventEmitter();
  @Output() selectCustomerForHistory = new EventEmitter();

  displayedColumns = ['name', 'lastName', 'phone', 'birthDate', 'pesel', 'address', 'actions'];
  dataSource: MatTableDataSource<any>;
  filterInput = new FormControl('');
  displayedCustomers: Array<any>;
  allCustomers: Array<any>;

  showAllCustomers: boolean = true;
  showAddNewCustomer: boolean = false;
  showAddNewRent: boolean = false;

  customerToEdit = null;
  customerForRent = null;

  constructor(private dbApi: dbService,
              private loaderApi: LoaderService,
              private dialogApi: MatDialog) {
  }

  ngOnInit() {
    // this.getUsers();
    this.filterInput.valueChanges.subscribe(this.filterCustomers.bind(this));
  }

  public getUsers(): void {
    this.loaderApi.turnOn();
    this.dbApi.getAllClients().subscribe((response) => {
      this.dataSource = new MatTableDataSource(response);
      this.allCustomers = this.displayedCustomers = response;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.filterInput.patchValue('');
      this.loaderApi.turnOff();
    }, (error) => {
      this.loaderApi.turnOff();
    });
  }

  public selectClientEvent(client): void {
  }

  public filterCustomers(filterString): void {
    const filteredCustomers = this.allCustomers.filter((customer) => {
      const test = Object.keys(customer).map((key) => customer[key].toString().toLowerCase().includes(filterString.toLowerCase()));
      return test.includes(true);
    });
    this.dataSource.data = filteredCustomers;
  }

  public onNewRent(customer): void {
    this.customerForRent = customer;
    this.showAllCustomers = false;
    this.showAddNewRent = true;
  }

  public onEditCusomer(customer): void {
    this.customerToEdit = customer;
    this.onShowAddNewCustomer();
  }

  public onShowHistory(customer): void {
    this.selectCustomerForHistory.emit(customer);
    this.changeMainTab.emit(2);
  }

  public onRemoveCustomer(customer): void {
    this.dialogApi.open(DialogComponent, {data: {type: MSG_TYPES.WARN, buttonType: BUTTON_TYPE.OK_CANCEL, message: 'Are you sure you want to delete customer?'}})
      .afterClosed().subscribe((response) => {
        if(response === 'cancel'){
          return;
        } else {
          this.loaderApi.turnOn();
          this.dbApi.removeCustomer(customer._id).subscribe(() => {
            this.getUsers();
            this.dialogApi.open(DialogComponent, {data: {type: MSG_TYPES.INFO, buttonType: BUTTON_TYPE.OK, message: 'Customer successfuly removed.'}})
          }, (error) => {
            this.dialogApi.open(DialogComponent, {data: {type: MSG_TYPES.ERROR, buttonType: BUTTON_TYPE.OK, message: error.message}})
            this.loaderApi.turnOff();
          });
        }
      });
  }

  public onShowAddNewCustomer(): void {
    this.showAddNewCustomer = true;
    this.showAllCustomers = false;
  }

  public onAddNewCustomerClose(): void {
    this.showAddNewCustomer = false;
    this.showAllCustomers = true;
    this.ngOnInit();
    this.customerToEdit = null;
  }

  public onAddNewRentClose(): void {
    this.showAddNewRent = false;
    this.showAllCustomers = true;
    this.ngOnInit();
  }
}

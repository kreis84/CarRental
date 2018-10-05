import { Component, OnInit, ViewChild } from '@angular/core';
import { dbService } from '../services/db.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // displayedColumns = ['name', 'lastName', 'pesel', 'birthDate', 'address', 'actions'];
  displayedColumns = ['name', 'lastName', 'phone', 'birthDate', 'pesel', 'address', 'actions'];
  dataSource: MatTableDataSource<any>;
  filterInput = new FormControl('');
  displayedCustomers: Array<any>;
  allCustomers: Array<any>;

  showAddNewCustomer: boolean = false;
  showAllCustomers: boolean = true;

  constructor(private dbApi: dbService) {
  }

  ngOnInit() {
    console.log('worka');
    this.getUsers();
    this.filterInput.valueChanges.subscribe(this.filterCustomers.bind(this));
  }

  public getUsers(): void {
    this.dbApi.getAllClients().subscribe((response) => {
      response.forEach((customer, index) => response[index].birthDate = moment(customer.birthDate).format('DD.MM.YYYY'));
      this.dataSource = new MatTableDataSource(response);
      this.allCustomers = this.displayedCustomers = response;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public selectClientEvent(client): void {
    console.log(client);
  }

  public filterCustomers(filterString): void {
    const filteredCustomers = this.allCustomers.filter((customer) => {
      const test = Object.keys(customer).map((key) => customer[key].toString().toLowerCase().includes(filterString.toLowerCase()));
      return test.includes(true);
    });
    this.dataSource.data = filteredCustomers;
  }

  public onNewRent(customer): void {
    console.log(customer);
  }

  public onEditCusomer(customer): void {
    console.log(customer);
  }

  public onShowHistory(customer): void {
    console.log(customer);
  }

  public onRemoveCustomer(customer): void {
    console.log(customer);
  }

  public onShowAddNewCustomer(): void {
    this.showAddNewCustomer = true;
    this.showAllCustomers = false;
  }

  public onAddNewCustomerClose(): void {
    this.showAddNewCustomer = false;
    this.showAllCustomers = true;
    this.ngOnInit();
  }
}

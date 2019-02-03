import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BUTTON_TYPE, MSG_TYPES } from '../utils/utils';
import { DialogComponent } from '../utils/dialog/dialog.component';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { LoaderService } from '../services/loader.service';
import { dbService } from '../services/db.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Output() selectCarForHistory = new EventEmitter();
  @Output() changeMainTab = new EventEmitter();

  displayedColumns = ['mark', 'model', 'engine', 'base_cost', 'color', 'segment', 'registration', 'actions'];
  dataSource: MatTableDataSource<any>;
  filterInput = new FormControl('');
  displayedCars: Array<any>;
  allCars: Array<any>;
  showAllCars: boolean = true;
  carToEdit: any = null;
  showAddNewRent: boolean = false;
  carForRent: any;

  constructor(private dbApi: dbService,
              private loaderApi: LoaderService,
              private dialogApi: MatDialog) {
  }

  ngOnInit() {
    // this.getCars();
    this.filterInput.valueChanges.subscribe(this.filterCars.bind(this));
  }

  public getCars(): void {
    this.loaderApi.turnOn();
    this.dbApi.getAllCars().subscribe((response) => {
      this.dataSource = new MatTableDataSource(response);
      this.allCars = this.displayedCars = response;
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

  public filterCars(filterString): void {
    const filteredCars = this.allCars.filter((customer) => {
      const test = Object.keys(customer).map((key) => customer[key].toString().toLowerCase().includes(filterString.toLowerCase()));
      return test.includes(true);
    });
    this.dataSource.data = filteredCars;
  }

  public onNewRent(car): void {
    this.carForRent = car;
    this.showAllCars = false;
    this.showAddNewRent = true;
  }

  public onEditCusomer(car): void {
    this.carToEdit = car;
  }

  public onShowHistory(car): void {
    this.selectCarForHistory.emit(car);
    this.changeMainTab.emit(2);
  }

  public onRemoveCustomer(car): void {
    this.dialogApi.open(DialogComponent, {data: {type: MSG_TYPES.WARN, buttonType: BUTTON_TYPE.OK_CANCEL, message: 'Are you sure you want to delete car?'}})
      .afterClosed().subscribe((response) => {
      if(response === 'cancel'){
        return;
      } else {
        this.loaderApi.turnOn();
        this.dbApi.removeCar(car._id).subscribe(() => {
          this.getCars();
          this.dialogApi.open(DialogComponent, {data: {type: MSG_TYPES.INFO, buttonType: BUTTON_TYPE.OK, message: 'Car successfuly removed.'}})
        }, (error) => {
          this.dialogApi.open(DialogComponent, {data: {type: MSG_TYPES.ERROR, buttonType: BUTTON_TYPE.OK, message: error.message}})
          this.loaderApi.turnOff();
        });
      }
    });
  }

  public onCloseNewRent(): void {
    this.showAddNewRent = false;
    this.showAllCars = true;
    this.ngOnInit();
  }
}

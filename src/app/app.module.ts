import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import {
  MAT_DATE_LOCALE, MAT_DIALOG_DEFAULT_OPTIONS,
  MatButtonModule, MatButtonToggleModule,
  MatCardModule, MatDatepickerModule, MatDialogModule, MatDivider,
  MatDividerModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule, MatNativeDateModule,
  MatPaginatorModule, MatProgressSpinnerModule,
  MatSortModule, MatSpinner,
  MatTableDataSource,
  MatTableModule, MatTooltipModule
} from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { MomentModule } from 'angular2-moment';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddCustomerComponent } from './users/add-customer/add-customer.component';
import { LoaderService } from './services/loader.service';
import { DialogComponent } from './utils/dialog/dialog.component';
import { CarsComponent } from './cars/cars.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    AddCustomerComponent,
    DialogComponent,
    CarsComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatCardModule,
    MatGridListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MomentModule,
    MatSortModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
  exports: [
    BrowserModule,
    MatButtonModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatCardModule,
    MatGridListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    HttpClientModule,
    MomentModule,
    MatSortModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
  entryComponents: [DialogComponent],
  providers: [HttpClient,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    LoaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }

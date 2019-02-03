import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LoaderService } from './services/loader.service';
import { BehaviorSubject } from 'rxjs/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  showLoader: boolean = true;
  historyTabActiv: BehaviorSubject<boolean> = new BehaviorSubject(false);
  selectedIndex = 0;
  selectedCar: any = null;
  selectedCustomer: any = null;
  startMonthForCalendar: {year: number, month: number};

  constructor(public loaderApi: LoaderService) {
    const today = new Date();
    // this.startMonthForCalendar = {year: today.getFullYear(), month: today.getMonth()+1};
    this.startMonthForCalendar = {year: today.getFullYear(), month: 12};
  }

  ngOnInit() {
    this.loaderApi.status.subscribe((value) => {
      this.showLoader = value;
    });
  }

  public selectedTabChanged(index): void {
    index === 2
      ? this.historyTabActiv.next(true)
      : this.historyTabActiv.next(false);
  }

  public onTabChangeFromChild(index): void {
    this.selectedIndex = index;
  }

  public onSelectCustomerForHistory(customer): void {
    this.selectedCustomer = customer;
    this.selectedCar = null;
  }

  public onSelectCarForHistory(car): void {
    this.selectedCar = car;
    this.selectedCustomer = null;
  }
}

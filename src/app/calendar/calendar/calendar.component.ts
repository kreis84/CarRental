import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input() startDate: {year: number, month: number};
  @Input() monthsQuantity: number = 5;
  
  // months: {days: number[]} = {days: []};
  months: Array<{emptyDays: number, days: number, year: number, month: number}>;
  showCalendar: boolean = false;

  constructor() { }

  ngOnInit() {
    this.prepareCalendarObject();
  }

  private prepareCalendarObject(startDate: {year: number, month: number} = this.startDate): void {
    let modifMonth = 0, modifYear = 0;
    this.months = [];
    for(let i=0; i<this.monthsQuantity; i++){
      if((startDate.month + i) > 12) {
        modifMonth = -12;
        modifYear = 1;
      }
      const month: any = {emptyDays: 0, days: 0};
      const emptyDays = moment([startDate.year + modifYear, startDate.month-1+i+modifMonth]).format('d');
      month.emptyDays = +emptyDays;
      const days = moment([startDate.year + modifYear, startDate.month-1+i+modifMonth]).daysInMonth();
      month.days = days;
      month.year = startDate.year+modifYear;
      month.month = startDate.month+i+modifMonth;
      month.name = moment([startDate.year + modifYear, startDate.month-1+i+modifMonth]).format('MMMM');
      this.months.push(month);
    }
    this.showCalendar = true;
  }

  public onDayClick(dayNumber, monthNumber, year): void {
    console.log(dayNumber + ' ' + monthNumber + ' ' + year);
  }

  public changeMonth(forward: boolean = true): void {
    forward
      ? this.startDate.month++
      : this.startDate.month--;
    if(this.startDate.month > 12){
      this.startDate.year++;
      this.startDate.month = 1;
    }
    if(this.startDate.month < 1){
      this.startDate.year--;
      this.startDate.month = 12;
    }
    
    this.prepareCalendarObject(this.startDate);
  }

  public loopHelper(quant: number): any[] {
    const arr = [];
    for(let i = 1; i<= quant; i++){
      arr.push(i);
    }
    return arr;
  }
}

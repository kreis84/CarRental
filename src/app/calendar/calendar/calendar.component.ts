import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { iRange } from './calendar.component.utils';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input() startDate: {year: number, month: number};
  @Input() monthsQuantity: number = 10;
  @Input() reservedDatesRanges: BehaviorSubject<iRange[]> = new BehaviorSubject([]);

  @Output() rangeChangeEvent = new EventEmitter<iRange>();
  
  months: Array<{emptyDays: number, days: number, year: number, month: number}>;
  showCalendar: boolean = false;
  range: iRange = {} as iRange;
  constructor() { }

  ngOnInit() {
    if(!this.startDate){
      const today = new Date();
      this.startDate = {year: today.getFullYear(), month: today.getMonth()+1};
    }
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
    if(JSON.stringify(this.range.start) === JSON.stringify({day: dayNumber, month: monthNumber, year: year})){
      this.range.start = null;
      return;
    }
    if(JSON.stringify(this.range.end) === JSON.stringify({day: dayNumber, month: monthNumber, year: year})){
      this.range.end = null;
      return;
    }
    if(!this.range || !this.range.start){
      this.range.start = {day: dayNumber, month: monthNumber, year: year};
    } else {
      this.range.end = {day: dayNumber, month: monthNumber, year: year};
    }
    if(this.range.start && this.range.end){
      const start = moment([this.range.start.day, this.range.start.month, this.range.start.year], 'DD-MM-YYYY');
      const end = moment([this.range.end.day, this.range.end.month, this.range.end.year], 'DD-MM-YYYY');
      if(start.isAfter(end)){
        const tempEnd = this.range.end;
        this.range.end = this.range.start;
        this.range.start = tempEnd;
      }
    }

    if(this.range.start && this.range.end){
      this.prepareCalendarObject(this.startDate);
      this.rangeChangeEvent.emit(this.range);
    }
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

  public checkIfDaySelected(day: number, month: number, year: number): boolean {
    const checkDay = moment([day, month, year], 'DD-MM-YYYY');
    if(this.range.start && this.range.end){
      const start = moment([this.range.start.day, this.range.start.month, this.range.start.year], 'DD-MM-YYYY');
      const end = moment([this.range.end.day, this.range.end.month, this.range.end.year], 'DD-MM-YYYY');
      if(checkDay.isBetween(start,end,'day') || checkDay.isSame(start) || checkDay.isSame(end)){
        return true;
      }
    } 
    return false;
  }

  public checkIfFirstOrLast(day: number, month: number, year: number): boolean{
    const checkDay = moment([day, month, year], 'DD-MM-YYYY');
    if(this.range.start || this.range.end){
      const start = this.range.start ? moment([this.range.start.day, this.range.start.month, this.range.start.year], 'DD-MM-YYYY') : null;
      const end = this.range.end ? moment([this.range.end.day, this.range.end.month, this.range.end.year], 'DD-MM-YYYY') : null;
      if(checkDay.isSame(start) || checkDay.isSame(end)){
        return true;
      }
    } 
    return false;
  }

  public checkIfActual(day: number, month: number, year: number): boolean{
    const checkDay = moment([day, month, year], 'DD-MM-YYYY');
    if(moment().isSame(checkDay, 'day')){
      return true;
    }
    return false;
  }

  public chekIfUnabailable(day: number, month: number, year: number): boolean {
    const checkDay = moment([day, month, year], 'DD-MM-YYYY');
    const includesList = this.reservedDatesRanges.value.map((range: iRange) => {
      const start = moment([range.start.day, range.start.month, range.start.year], 'DD-MM-YYYY');
      const end = moment([range.end.day, range.end.month, range.end.year], 'DD-MM-YYYY');
      if (checkDay.isBetween(start, end,'day') || checkDay.isSame(start) || checkDay.isSame(end)){
        return true;
      } else {
        return false;
      }
    });
    return includesList.some(item => item);
  }
}

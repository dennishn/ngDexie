import { Component } from '@angular/core';
import {BetsService} from "./models/bets/bets.service";

import * as moment from 'moment';
import {YearRange, MonthRange, WeekRange} from "./models/bets/bet";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  public startDate: string;
  public startRangeDate: string;
  public endRangeDate: string;

  public log = [];

  constructor(private betsService: BetsService) {
    this.startDate = moment().hour(14).minute(30).add(10, 'minutes').format('YYYY-MM-DDTHH:mm:ss');
  }

  public getFromPast() {
    const startDate = moment(this.startDate).unix();

    this.betsService.getFromPast('year', startDate).then((items) => {
      // console.log(items, items.length);
      this.log.push(`found ${items.length} bets from last year`);
    });
    this.betsService.getFromPast('month', startDate).then((items) => {
      // console.log(items, items.length);
      this.log.push(`found ${items.length} bets from last month`);
    });
    this.betsService.getFromPast('week', startDate).then((items) => {
      // console.log(items, items.length);
      this.log.push(`found ${items.length} bets from last week`);
    });
  }

  public getFromDateRange() {
    const startDate = moment(this.startRangeDate).unix();
    const endDate = moment(this.endRangeDate).unix();

    this.betsService.getFromDateRange(startDate, endDate).then((items) => {
      // console.log(items, items.length);
      this.log.push(`found ${items.length} bets from date range`);
    });
  }

}

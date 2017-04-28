import { Component } from '@angular/core';
import {BetsService} from "./models/bets/bets.service";

import * as moment from 'moment';
import {Bet, IBet} from "./models/bets/bet";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public startDate: string;
  public startRangeDate: string;
  public endRangeDate: string;

  public dateRange: 'year' | 'month' | 'week' = 'year';

  public dateRangeSuper: 'year' | 'month' | 'week' = 'year';
  public statusSuper: '0' | '1' | '2' = '0';

  public statusUberSuper: '0' | '1' | '2' = '0';

  public log = [];
  public items = [];

  constructor(private betsService: BetsService) {
    this.startDate = moment().hour(14).minute(30).add(10, 'minutes').format('YYYY-MM-DDTHH:mm:ss');
  }

  public getFromPast() {
    const startDate = moment(this.startDate).unix();

    this.betsService.getFromPast(startDate).then((items: Bet[]) => {
      this.logItems(items);
      this.log.push(`found ${items.length} bets`);
    });
  }


  public getFromPastRange() {
    const startDate = moment(this.startDate).unix();

    this.betsService.getFromPastRange(this.dateRange, startDate).then((items: Bet[]) => {
      this.logItems(items);
      this.log.push(`found ${items.length} bets from last ${this.dateRange}`);
    });
  }

  public getFromDateRange() {
    const startDate = moment(this.startRangeDate).unix();
    const endDate = moment(this.endRangeDate).unix();

    this.betsService.getFromDateRange(startDate, endDate).then((items) => {
      this.logItems(items);
      this.log.push(`found ${items.length} bets from date range`);
    });
  }

  public getAllBetsByStatusFromPastRange() {
    this.items = [];

    this.betsService.getAllBetsByStatusFromPastRange(this.dateRangeSuper, this.stupidStringToStupidSpecificInt(this.statusSuper)).then((items) => {
      this.logItems(items);
      this.log.push(`found ${items.length} bets from last ${this.dateRangeSuper} with status ${this.statusSuper}`);
    });
  }

  public getAllBetsByStatus() {
    this.betsService.getAllBetsByStatus(this.stupidStringToStupidSpecificInt(this.statusUberSuper)).then((items) => {
      this.logItems(items);
      this.log.push(`found ${items.length} bets with status ${this.statusSuper}`);
    });
  }

  private stupidStringToStupidSpecificInt(input: '0' | '1' | '2'): 0 | 1 | 2 {
    switch (input) {
      case '0':
        return 0;
      case '1':
        return 1;
      case '2':
        return 2;
    }
  }

  private logItems(items: IBet[]) {
    this.items = [];
    this.items = items;
    console.log(this.items[0], this.items[0].log());
  }

}

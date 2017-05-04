import {Component, OnInit} from '@angular/core';
import {BetsService} from "./models/bets/bets.service";

import * as moment from 'moment';
import {Bet, BetStatus, IBet, IBetStatus} from "./models/bets/bet";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {bootstrapItem} from "@angular/cli/lib/ast-tools";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public startDate: string;
  public startRangeDate: string;
  public endRangeDate: string;

  public dateRange: 'year' | 'month' | 'week' = 'year';

  public dateRangeSuper: 'year' | 'month' | 'week' = 'year';
  public statusSuper = BetStatus.Lost;

  public statusOptions = Object.assign({}, BetStatus);

  public statusUberSuper = BetStatus.Lost;

  public log = [];
  public items = [];

  public betForm: FormGroup;

  public getBetId: number;

  constructor(private betsService: BetsService, private fb: FormBuilder) {
    this.startDate = moment().hour(14).minute(30).add(10, 'minutes').format('YYYY-MM-DDTHH:mm:ss');
  }

  ngOnInit() {
    this.betForm = this.fb.group({
      stake: [null, [Validators.required]],
      note: [''],
      status: [BetStatus.Awaiting, [Validators.required]],
      endAt: [this.startDate, [Validators.required]],
      notify: [false]
    });
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

  public getAllByStatusFromPastRange() {
    this.items = [];

    this.betsService.getAllByStatusFromPastRange(this.dateRangeSuper, this.statusSuper).then((items) => {
      this.logItems(items);
      this.log.push(`found ${items.length} bets from last ${this.dateRangeSuper} with status ${this.statusSuper}`);
    });
  }

  public getAllByStatus() {
    this.betsService.getAllByStatus(this.statusUberSuper).then((items) => {
      this.logItems(items);
      this.log.push(`found ${items.length} bets with status ${this.statusUberSuper}`);
    });
  }

  public createBet(bet: Bet, isValid: boolean) {
    if(!isValid) {
      return;
    }

    const newBet = new Bet(
        Object.assign({}, bet)
    );

    this.log.push(`creating new bet: ${JSON.stringify(newBet)}`);
    this.betsService.add(newBet).then((newBetId: number) => {
      this.getBetId = newBetId;
      this.log.push(`created new bet with id: ${newBetId}`);
      this.betForm.reset({
        stake: null,
        note: '',
        status: BetStatus.Awaiting,
        endAt: this.startDate,
        notify: false
      });
    }).catch((e) => console.warn(e));
  }

  public getOne() {
    this.betsService.getOne(this.getBetId).then((bet: Bet) => {
      this.logItems([bet]);
      this.log.push(`got one bet`);

      this.betForm.reset(Object.assign({}, bet, {endAt: moment.unix(bet.endAt).format('YYYY-MM-DDTHH:mm:ss')}));
    });
  }
  public getAll() {
    this.betsService.getAll().then((bets: Bet[]) => {
      this.logItems(bets);
      this.log.push(`got all ${bets.length} bets`);
    });
  }
  public update() {
    this.betsService.update(this.getBetId, this.betForm.value).then((betId: number) => {
      this.log.push(`updated bet with id: ${betId}`);
      return this.getOne();
    }).catch((e) => console.warn(e));
  }
  public remove() {
    this.betsService.remove(this.getBetId).then(() => {
      this.log.push(`removed bet with id: ${this.getBetId}`);
      this.getBetId = null;
    });
  }

  public getInPlayAmount() {
    this.betsService.getInPlayAmount().then((amount: number) => {
      this.log.push(`getInPlayAmount: ${amount}`);
    });
  }

  public getBalance() {
    this.betsService.getBalance(this.dateRange).then((amount: number) => {
      this.log.push(`getBalance: ${amount}`);
    });
  }

  public hasAwaiting() {
    this.betsService.hasAwaiting().then((hasAwaiting: boolean) => {
      this.log.push(`hasAwaiting: ${hasAwaiting}`);
    });
  }

  private logItems(items: IBet[]) {
    this.items = [];
    this.items = items;
    if(this.items[0]) {
      console.log(this.items[0], this.items[0].log());
    }
  }

}

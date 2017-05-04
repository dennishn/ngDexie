import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import * as moment from 'moment';

import {DexieService} from '../../core/dexie.service';
import {IBet, Bet, BetStatus} from "./bet";

import {BetMockFactory} from './bet.mocking';
import {environment} from "../../../environments/environment";

@Injectable()
export class BetsService {

  private table: Dexie.Table<IBet, number>;

  constructor(private dexieService: DexieService) {
    this.table = this.dexieService.table('bets');

    // Map Table entries to classes <3
    this.table.mapToClass(Bet);

    this.table.hook('creating', (primaryKey: any, bet: Bet) => {

      const timestamp = moment().unix();

      // endAt will always come from some sort of DatePicker - which returned Dates as formatted strings - fix it!
      if(typeof bet.endAt !== 'number') {
        bet.endAt = moment(bet.endAt).unix();
      }

      // Set created/updated timestamps on creation - hiding "implementation" details from the controllers
      bet.createdAt = timestamp;
      bet.updatedAt = timestamp;

      // Set the notifyAt to next day at 12:00 (24h time) on creation - also hiding "implementation" details from controllers
      bet.notifyAt = moment.unix(bet.endAt).add(1, 'days').hour(12).minute(0).second(0).millisecond(0).unix();
    });

    this.table.hook('updating', (modifications: any, primaryKey: any, obj, transaction) => {
      if(typeof modifications.endAt !== 'number') {
        modifications.endAt = moment(modifications.endAt).unix();
      }

      modifications.updatedAt = moment().unix();

      return modifications;
    });

    if(!environment.production) {
      console.info('App running in dev mode - setting up mock data...');
      console.info('Clearing existing Database');
      Dexie['delete']('SPMD').then(() => {
        console.info('Existing Database cleared');
        const mock = new BetMockFactory();
        const data = mock.generateMockData();
        console.info('Seeding Database');
        this.table.bulkAdd(data)
            .then(() => this.table.count())
            .then((count) => console.info(`Done seeding Database ${count} rows added`));
      });
    }
  }

  public getAll(): Promise<Bet[]> {
    return this.table.toArray();
  }

  public getOne(id: number): Promise<Bet> {
    return this.table.where('id').equals(id).first();
  }

  public add(data: Bet): Promise<number> {
    return this.table.add(data);
  }

  public update(id: number, data: IBet): Promise<number> {
    return this.table.update(id, data);
  }

  public remove(id: number): Promise<void> {
    return this.table.where('id').equals(id).delete();
  }

  public getFromPast(startDate?: number): Promise<Bet[]> {
    const s = this.getStartDate(startDate);

    return this.table.toCollection().first().then((bet: Bet) => {
      const e = bet.endAt;

      return this.table.where('endAt').between(e, s.unix(), true, true).toArray();
    });
  }

  public getFromPastRange(dateRange: 'year' | 'month' | 'week', startDate?: number): Promise<Bet[]> {
    const s = this.getStartDate(startDate);
    const e = s.clone().subtract(1, dateRange);

    return this.table.where('endAt').between(e.unix(), s.unix(), true, true).toArray();
  }

  public getFromDateRange(startDate: number, endDate: number): Promise<Bet[]> {
    const s = moment.unix(startDate).unix();
    const e = moment.unix(endDate).unix();

    return this.table.where('endAt').between(s, e, true, true).toArray();
  }

  public getAllByStatus(status: string): Promise<Bet[]> {
    return this.table.where('status').equals(status).toArray();
  }

  public getAllByStatusFromPastRange(dateRange: 'year' | 'month' | 'week', status: string, startDate?: number): Promise<Bet[]> {
    return this.getFromPastRange(dateRange, startDate).then((collection) => {
      return this.filterCollectionByStatus(collection, status);
    });
  }

  public getInPlayAmount(): Promise<number> {
    let sum = 0;

    return this.table.where('status').equals(BetStatus.Awaiting).toArray().then((bets: Bet[]) => {
      bets.forEach((bet: Bet) => sum += bet.stake);
      return sum;
    });
  }

  public getBalance(dateRange: 'year' | 'month' | 'week'): Promise<number> {
    let sum = 0;

    return this.getAllByStatus(BetStatus.Awaiting).then((bets: Bet[]) => {
      bets.forEach(bet => sum += bet.stake);
      return this.getAllByStatusFromPastRange(dateRange, BetStatus.Won);
    }).then((bets: Bet[]) => {
      bets.forEach(bet => sum += bet.stake);
      return this.getAllByStatusFromPastRange(dateRange, BetStatus.Lost);
    }).then((bets: Bet[]) => {
      bets.forEach(bet => sum += bet.stake);
      return sum;
    });
  }

  public hasAwaiting(): Promise<boolean> {
    return this.getAllByStatus(BetStatus.Awaiting).then((bets: Bet[]) => {
      return bets.length > 0;
    });
  }

  public filterCollectionByStatus(collection: IBet[], status: string): Promise<Bet[]> {
    return new Promise((resolve) => {
      return resolve(collection.filter((item) => {
        return item.status === status;
      }));
    });
  }

  private getStartDate(initialStartDate?: number) {
    return initialStartDate ? moment.unix(initialStartDate) : moment.unix(moment().unix());
  }
}

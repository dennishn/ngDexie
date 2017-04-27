import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import * as moment from 'moment';

import {DexieService} from '../../core/dexie.service';
import {IBetWithID, IBet, YearRange, MonthRange, WeekRange} from "./bet";

import {BetMockFactory} from './bet.mocking';
import {environment} from "../../../environments/environment";

@Injectable()
export class BetsService {
  private table: Dexie.Table<IBet, number>;

  constructor(private dexieService: DexieService) {
    this.table = this.dexieService.table('bets');

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
            .then((count) => console.info(`Done seeding Database ${count} rows added`))
      });
    }
  }

  public getAll() {
    return this.table.toArray();
  }

  public add(data) {
    return this.table.add(data);
  }

  public update(id, data) {
    return this.table.update(id, data);
  }

  public remove(id) {
    return this.table.delete(id);
  }
// man skal kunne hente alt past
  public getFromPast(dateRange: 'year' | 'month' | 'week', startDate?: number): Promise<IBet[]> {
    const s = startDate ? moment.unix(startDate) : moment.unix(moment().unix());
    const e = s.clone().subtract(1, dateRange);
    return this.table.where('endAt').between(e.unix(), s.unix(), true, true).toArray();
  }

  public getFromDateRange(startDate: number, endDate: number): Promise<IBet[]> {
    const s = moment.unix(startDate).unix();
    const e = moment.unix(endDate).unix();

    return this.table.where('endAt').between(s, e, true, true).toArray();
  }

  public findLostInCollection(collection: IBet[]): IBet[] {
    return collection.filter((item) => item.status === 0);
  }
  public findAwaitingInCollection(collection: IBet[]): IBet[] {
    return collection.filter((item) => item.status === 2);
  }
  public findWonInCollection(collection: IBet[]): IBet[] {
    return collection.filter((item) => item.status === 2);
  }

}

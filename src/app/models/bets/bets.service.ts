import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import * as moment from 'moment';

import {DexieService} from '../../core/dexie.service';
import {IBet, Bet} from "./bet";

import {BetMockFactory} from './bet.mocking';
import {environment} from "../../../environments/environment";

@Injectable()
export class BetsService {

  // TODO
  /*
      The "types": 'year' | 'month' | 'week' and 0 | 1 | 2 should be expressed as a Type, and not as using the | symbol - look at moment...
   */

  private table: Dexie.Table<IBet, number>;

  constructor(private dexieService: DexieService) {
    this.table = this.dexieService.table('bets');
    // Map Table entries to classes <3
    this.table.mapToClass(Bet);

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

  /**
   * Gets all Bets from the first entry in DB up until the startDate.
   * If the startDate argument is not supplied, it will use todays date.
   * @param startDate
   * @returns {Dexie.Promise<TResult>}
   */
  public getFromPast(startDate?: number): Promise<IBet[]> {
    const s = this.getStartDate(startDate);

    return this.table.toCollection().first().then((bet: Bet) => {
      const e = bet.endAt;

      return this.table.where('endAt').between(e, s.unix(), true, true).toArray();
    });
  }

  /**
   * Gets all Bets from the startDate and backwards in a predefined range (year, month or week).
   * If the startDate argument is not supplied, it will use todays date.
   * @param dateRange
   * @param startDate
   * @returns {Promise<Array<IBet>>}
   */
  public getFromPastRange(dateRange: 'year' | 'month' | 'week', startDate?: number): Promise<IBet[]> {
    const s = this.getStartDate(startDate);
    const e = s.clone().subtract(1, dateRange);
    return this.table.where('endAt').between(e.unix(), s.unix(), true, true).toArray();
  }

  /**
   * Gets all Bets in a range from startDate until endDate.
   * @param startDate
   * @param endDate
   * @returns {Promise<Array<IBet>>}
   */
  public getFromDateRange(startDate: number, endDate: number): Promise<IBet[]> {
    const s = moment.unix(startDate).unix();
    const e = moment.unix(endDate).unix();

    return this.table.where('endAt').between(s, e, true, true).toArray();
  }

  public getAllBetsByStatus(status: 0 | 1 | 2): Promise<IBet[]> {
    return this.table.where('status').equals(status).toArray();
  }

  public getAllBetsByStatusFromPastRange(dateRange: 'year' | 'month' | 'week', status: 0 | 1 | 2, startDate?: number): Promise<IBet[]> {
    return this.getFromPastRange(dateRange, startDate).then((collection) => {
      return this.filterCollectionByStatus(collection, status);
    });
  }
  public filterCollectionByStatus(collection: IBet[], status: 0 | 1 | 2): Promise<IBet[]> {
    return new Promise((resolve, reject) => {
      return resolve(collection.filter((item) => {
        console.log(status, item.status);
        return item.status === status;
      }));
    });
  }

  private getStartDate(initialStartDate?: number) {
    return initialStartDate ? moment.unix(initialStartDate) : moment.unix(moment().unix());
  }
}

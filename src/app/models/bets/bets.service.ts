import { Injectable } from '@angular/core';
import {Dexie} from 'dexie';

import {DexieService} from '../../core/dexie.service';
import {IBetWithID} from "./bet";

@Injectable()
export class BetsService {
  private table: Dexie.Table<IBetWithID, number>;

  constructor(private dexieService: DexieService) {
    this.table = this.dexieService.table('bets');
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

  public getFromLastYear() {

  }

  public getFromLastMonth() {

  }

  public getFromLastWeek() {

  }

  public getFromDateRange(startDate: Date, endDate: Date) {

  }

  public getWon() {

  }
  public getPending() {

  }
  public getLost() {

  }

  public getBalance() {
    
  }

}

import { Injectable } from '@angular/core';
import Dexie from 'dexie';

@Injectable()
export class DexieService extends Dexie {

  constructor() {
    super('SPMD');

    this.version(1).stores({
      bets: '++id,triggerAt,createdAt,endAt,status,stake,note'
    });
  }

}

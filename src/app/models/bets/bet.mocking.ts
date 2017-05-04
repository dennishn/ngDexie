import * as moment from 'moment';

import {Bet, BetStatus, IBet} from './bet';

export class BetMockFactory {
    constructor() {}

    public generateMockData(): Bet[] {

        const startDate = moment().hour(14).minute(30).second(0).millisecond(0).add(10, 'minutes').subtract(18, 'months');
        const endDate = moment().add(10, 'minutes').add(1, 'weeks');

        const data: Bet[] = [];

        while(startDate < endDate) {
            const todaysDate = moment().add(10, 'minutes');

            let d: Bet = new Bet({
                // createdAt: startDate.clone().subtract(1, 'days').unix(),
                // updatedAt: startDate.clone().subtract(1, 'days').unix(),
                endAt: startDate.clone().add(30, 'minutes').unix(),
                // notifyAt: startDate.clone().add(1, 'hours').unix(),
                status: BetStatus.Awaiting,
                note: 'Lorem Ipsum for now.',
                stake: this.getRandomInteger(1, 9999)
            });

            if(startDate < todaysDate) {
                d.status = Math.random() > 0.33 ? BetStatus.Lost : BetStatus.Won;
            }
            if(d.status === BetStatus.Won) {
                d.stake = this.getRandomInteger(10, 9999);
            }
            if(d.status === BetStatus.Lost) {
                d.stake = this.getRandomInteger(-10, -9999);
            }

            data.push(d);
            startDate.add(1, 'days');
        }

        return data;
    }

    private getRandomInteger(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
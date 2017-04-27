import * as moment from 'moment';

import {IBet} from './bet';

export class BetMockFactory {
    constructor() {}

    public generateMockData(): IBet[] {

        const startDate = moment().hour(14).minute(30).second(0).millisecond(0).add(10, 'minutes').subtract(18, 'months');
        const endDate = moment().add(10, 'minutes').add(6, 'months');

        const data: IBet[] = [];

        while(startDate < endDate) {
            const todaysDate = moment().add(10, 'minutes');

            let d: IBet = {
                triggerAt: startDate.clone().add(1, 'hours').unix(),
                createdAt: startDate.clone().subtract(1, 'days').unix(),
                endAt: startDate.clone().add(30, 'minutes').unix(),
                status: 0,
                note: 'Lorem Ipsum for now.'
            };

            if(startDate < todaysDate) {
                d.status = this.getRandomInteger(0, 2);
                d.reward = this.getRandomInteger(-500, 999999);
            }

            data.push(d);
            startDate.add(1, 'days');
        }

        return data;
    }

    private getRandomInteger(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
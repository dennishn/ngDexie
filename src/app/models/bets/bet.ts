import * as moment from 'moment';

export interface IBetStatus {
    Lost: string;
    Awaiting: string;
    Won: string;
}
export const BetStatus: IBetStatus = {
    Lost: '0',
    Awaiting: '1',
    Won: '2'
};

export interface IBet {
    id?: number;
    triggerAt: number;
    createdAt: number;
    endAt: number; // "settles"
    status: string; // 0 lost | 1 awaiting | 2 won
    stake: number;
    note?: string;
    notify: boolean;
}

// todo: implement dateRange const ...

export class Bet implements IBet {
    id?: number;
    triggerAt: number;
    createdAt: number;
    endAt: number;
    status: string;
    stake: number;
    note: string;
    notify: boolean;

    constructor(
        data:{
            status?: string,
            triggerAt?: number,
            createdAt?: number,
            endAt?: number,
            id?: number,
            stake: number,
            note?: string,
            notify?: boolean
        }
    ) {
        // Stake will always be defined
        if(data.status === BetStatus.Lost && data.stake > 0) {
            throw new Error(`lost bet cannot have a positive bet: ${data.stake}`);
        }
        if(data.status === BetStatus.Won && data.stake < 0) {
            throw new Error(`lost bet cannot have a positive bet: ${data.stake}`);
        }
        this.stake = data.stake;

        // Status will always be defined
        this.status = data.status || BetStatus.Awaiting;

        // Rest is optional - either defined or undefined
        if(data.createdAt) {
            this.createdAt = data.createdAt;
        } else {
            this.triggerAt = moment().unix();
        }

        if(data.endAt) {
            this.endAt = data.endAt;
        }
        if(data.triggerAt) {
            this.triggerAt = data.triggerAt;
        } else {
            // As a user with an awaiting bet I will receive a push notification on 12:00 AM the day after the settlement day
            this.triggerAt = moment.unix(this.endAt).add(1, 'days').hour(12).unix();
        }

        if(!data.notify) {
            // User has to disable a notification
            this.notify = true;
        }

        if(data.id) {
            this.id = data.id;
        }

        if(data.note) {
            this.note = data.note;
        }

    }

    public log() {
        console.log('Class nice!');
        return 'from Bet Class';
    }

    // Methods on Bet:

    /*
        setNotification
        clearNotification
        presentNotification

          noget nice med translations for status?
     */

}

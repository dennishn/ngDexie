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

export interface IBetDateRange {
    Year: string;
    Month: string;
    Week: string;
}
export const BetDateRange: IBetDateRange = {
    Year: 'year',
    Month: 'month',
    Week: 'week'
};

export interface IBet {
    id?: number;
    createdAt: number;
    updatedAt: number;
    endAt: number;
    notifyAt: number; // "settles"
    status: string; // 0 lost | 1 awaiting | 2 won
    stake: number;
    gain?: number;
    note: string;
    notify: boolean;
}

export class Bet implements IBet {
    id?: number;
    createdAt: number;
    updatedAt: number;
    endAt: number;
    notifyAt: number;
    status: string;
    stake: number;
    gain?: number;
    note: string;
    notify: boolean;

    constructor(
        data: {
            status?: string,
            createdAt?: number,
            updatedAt?: number,
            endAt?: number, // TODO
            notifyAt?: number,
            id?: number,
            stake: number,
            gain?: number, // TODO
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

        // Note will always be defined
        if(!data.note || data.note.length < 1) {
            throw new Error(`bet requires a note`);
        }

        // Dates will always be a number
        if(typeof data.endAt !== 'number') {
            this.endAt = moment(data.endAt).unix();
        } else {
            this.endAt = data.endAt;
        }
        if(typeof data.createdAt !== 'number') {
            this.createdAt = moment(data.createdAt).unix();
        } else {
            this.createdAt = data.createdAt;
        }
        if(typeof data.updatedAt !== 'number') {
            this.updatedAt = moment(data.updatedAt).unix();
        } else {
            this.updatedAt = data.updatedAt;
        }
        if(typeof data.notifyAt !== 'number') {
            this.notifyAt = moment(data.notifyAt).unix();
        } else {
            this.notifyAt = data.notifyAt;
        }

        // Rest is optional - either defined or undefined
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

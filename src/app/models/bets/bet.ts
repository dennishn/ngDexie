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

// todo: implement dateRange const ...

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
        data:{
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

        // EndAt will always be a number
        if(typeof data.endAt !== 'number') {
            throw new Error(`endAt must be a number (unix timestamp)`);
        }

        // Rest is optional - either defined or undefined
        if(data.createdAt) {
            this.createdAt = data.createdAt;
        } else {
            // this.createdAt = moment().unix();
        }
        if(data.updatedAt) {
            this.updatedAt = data.updatedAt;
        } else {
            // this.updatedAt = this.createdAt;
        }

        if(data.endAt) {
            this.endAt = data.endAt;
        }
        if(data.notifyAt) {
            this.notifyAt = data.notifyAt;
        } else {
            // As a user with an awaiting bet I will receive a push notification on 12:00 AM the day after the settlement day
            this.notifyAt = moment.unix(this.endAt).add(1, 'days').hour(12).unix();
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

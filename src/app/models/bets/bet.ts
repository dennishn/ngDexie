export interface IBet {
    id?: number;
    triggerAt: number; // Not sure if this should be a stored property, or calculated
    createdAt: number;
    endAt: number;
    status: number; // 0 lost | 1 awaiting | 2 won
    reward?: number;
    note?: string;
}

export class Bet implements IBet {
    id: number;
    triggerAt: number;
    createdAt: number;
    endAt: number;
    status: number;
    reward: number;
    note: string;

    constructor(
        status?: number,
        triggerAt?: number,
        createdAt?: number,
        endAt?: number,
        id?: number,
        reward?: number,
        note?: string) {

        // Status will always be defined
        this.status = status || 1;

        // Rest is optional - either defined or undefined
        if(triggerAt) {
            this.triggerAt = triggerAt;
        }
        if(createdAt) {
            this.createdAt = createdAt;
        }
        if(endAt) {
            this.endAt = endAt;
        }
        if(id) {
            this.id = id;
        }
        if(reward) {
            this.reward = reward;
        }
        if(note) {
            this.note = note;
        }

    }

    public log() {
        console.log('Class nice!', this);
    }

}

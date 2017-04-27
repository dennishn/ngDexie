export interface IBet {
    triggerAt: Date;
    createdAt: Date;
    status: number;
    reward?: number;
    note?: string;
}

export interface IBetWithID extends IBet {
    id: number;
}

// export class Bet implements IBet {
//
// }

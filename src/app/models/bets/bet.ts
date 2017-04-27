export interface IBet {
    triggerAt: number;
    createdAt: number;
    endAt: number;
    status: number; // 0 lost | 1 awaiting | 2 won
    reward?: number;
    note?: string;
}

export interface IBetWithID extends IBet {
    id: number;
}

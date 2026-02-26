import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Tournament {
    id: bigint;
    name: string;
    entryFeeType: EntryFeeType;
    dateTime: string;
    prizePool: bigint;
}
export interface LeaderboardEntry {
    teamName: string;
    rank: bigint;
    playerName: string;
    totalPoints: bigint;
    kills: bigint;
}
export enum EntryFeeType {
    free = "free",
    paid = "paid"
}
export interface backendInterface {
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getTournaments(): Promise<Array<Tournament>>;
    registerPlayer(playerName: string, inGameId: string, teamName: string, whatsappNumber: string): Promise<void>;
}

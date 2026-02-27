import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LeaderboardEntry {
    teamName: string;
    rank: bigint;
    playerName: string;
    totalPoints: bigint;
    kills: bigint;
}
export interface User {
    freefireUid: string;
    password: string;
    name: string;
    whatsapp: string;
    email: string;
}
export interface Tournament {
    id: bigint;
    name: string;
    entryFeeType: EntryFeeType;
    entryFee: string;
    dateTime: string;
    prizePool: string;
}
export interface Room {
    startTime: bigint;
    name: string;
    joinedSlots: bigint;
    totalSlots: bigint;
    joinStatus: RoomJoinStatus;
    entryFee: string;
    roomType: RoomType;
    prizePool: string;
}
export type LoginUserResult = {
    __kind__: "userNotFound";
    userNotFound: null;
} | {
    __kind__: "passwordIncorrect";
    passwordIncorrect: null;
} | {
    __kind__: "success";
    success: User;
};
export interface UserProfile {
    freefireUid: string;
    name: string;
    whatsapp: string;
    email: string;
}
export enum EntryFeeType {
    free = "free",
    paid = "paid"
}
export enum RegisterUserResult {
    emailExists = "emailExists",
    success = "success"
}
export enum RoomJoinStatus {
    closed = "closed",
    open = "open",
    inProgress = "inProgress"
}
export enum RoomType {
    duo = "duo",
    solo = "solo",
    clashSquad = "clashSquad",
    squad = "squad",
    fullMap = "fullMap"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getRooms(): Promise<Array<Room>>;
    getTournaments(): Promise<Array<Tournament>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    loginUser(email: string, password: string): Promise<LoginUserResult>;
    registerPlayer(playerName: string, inGameId: string, teamName: string, whatsappNumber: string): Promise<void>;
    registerUser(name: string, email: string, whatsapp: string, freefireUid: string, password: string): Promise<RegisterUserResult>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}

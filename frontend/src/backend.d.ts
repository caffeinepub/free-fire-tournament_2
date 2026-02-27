import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
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
    walletBalance: number;
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
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface DepositRecord {
    id: bigint;
    status: DepositStatus;
    user: Principal;
    submittedAt: bigint;
    amount: number;
    screenshot: ExternalBlob;
    transactionId: string;
}
export interface UserProfile {
    freefireUid: string;
    name: string;
    whatsapp: string;
    email: string;
}
export enum DepositStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
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
    approveDeposit(depositId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deposit(uid: string, amount: number): Promise<void>;
    getAllPendingDeposits(): Promise<Array<DepositRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDepositRecord(depositId: bigint): Promise<DepositRecord | null>;
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getRooms(): Promise<Array<Room>>;
    getTournaments(): Promise<Array<Tournament>>;
    getUserDeposits(user: Principal): Promise<Array<DepositRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWalletBalance(uid: string): Promise<number>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    loginUser(email: string, password: string): Promise<LoginUserResult>;
    registerPlayer(playerName: string, inGameId: string, teamName: string, whatsappNumber: string): Promise<void>;
    registerUser(name: string, email: string, whatsapp: string, freefireUid: string, password: string): Promise<RegisterUserResult>;
    rejectDeposit(depositId: bigint): Promise<void>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    submitDeposit(amount: number, transactionId: string, screenshot: ExternalBlob): Promise<bigint>;
    withdraw(uid: string, amount: number): Promise<void>;
}

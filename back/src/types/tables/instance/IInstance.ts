export interface IInstance {
    /** Unique challenge ID */
    challengeId?: number,
    /** Unique student ID */
    studentId?: number,
    /** SSH listenning port */
    port: number,
    /** Instance addressID */
    addressIp: string,
    /** Username of instance */
    username: string,
}

export type IInstanceUpdate = Partial<IInstance>;
export type IInstanceRO = Readonly<IInstance>;
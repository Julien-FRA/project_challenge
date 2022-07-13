export interface IChallenge {
    /** Unique challenge ID */
    challengeId?: number,
    /** Challenge name */
    challengeName: string;
    /** Public key of challenge */
    publicKey: string;
}

export type IChallengeCreate = Omit<IChallenge, 'challengeId'>;
export type IChallengeUpdate = Partial<IChallenge>;
export type IChallengeRO = Readonly<IChallenge>;

export interface ILaunchChallenge {
    /** Unique challenge ID */ 
    challengeId: number,
    /** Unique student ID */ 
    studentId: number,
    /** SSH listenning port */ 
    port: number,
    /** Instance addressID */ 
    addressIp: string,
    /** Username of instance */ 
    username: string,
}

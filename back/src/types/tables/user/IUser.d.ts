/**
 * Un utilisateur de la plateforme.
 */
export interface IUser {
  /** ID Unique */
  userId: number;
  /** Role du user, qui défini si l'utilisateur est un étudiant ou un admin */
  role?: number;
  /** Adress e-mail, ceci doit être unique est sera utilisé comme identifiant pour l'utilisateur */
  email: string;
}

export type IUserCreate = Omit<IUser, 'userId'>;
export type IUserUpdate = Partial<IUserCreate>;
export type IUserRO = Readonly<IUser>;

export interface IUserToken extends IUser{
  promoId: number;
  challengeId: number;
}
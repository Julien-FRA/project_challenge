/**
 * Un admin de la plateforme.
 */
export interface IAdmin {
    /** ID lié au user */
    adminId: number;
    /** Pseudo de l'administrateur */
    pseudo: string;
    /** Mot de passe pour accéder au dashboard */
    password: string;
    // /** Token de d'accès pour le challenge fourni par la librairies JWT */
    accessToken?: string
}

export type IAdminCreate = IAdmin;
export type IAdminUpdate = Partial<IAdmin>;
export type IAdminRO = Readonly<IAdmin>;
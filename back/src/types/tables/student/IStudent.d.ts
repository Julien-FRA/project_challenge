/**
 * Un étudiant de la plateforme.
 */
export interface IStudent {
    /** ID Unique */
    studentId: number;
    /** Nom de famille */
    familyName: string;
    /** Prénom */
    givenName: string;
    /** Note de l'élève */
    rating?: number;
    /** ID de la promo de l'élève */
    promoId: number;
}

export type IStudentCreate = Omit<IStudent, 'token'>;
export type IStudentUpdate = Partial<IStudent>;
export type IStudentRO = Readonly<IStudent>;
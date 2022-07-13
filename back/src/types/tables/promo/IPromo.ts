export interface IPromo {
    /** Unique promo ID */
    promoId?: number,
    /** Unique student ID */
    promoName: string,
}

export type IPromoCreate = Omit<IPromo, 'promoId'>;
export type IPromoUpdate = Partial<IPromo>;
export type IPromoRO = Readonly<IPromo>;
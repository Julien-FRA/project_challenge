export interface IChallengePromo {
  challengePromoId?: number
  challengeId: number;
  promoId: number;
  isOpen?: boolean;
}

export interface IChallengePromoList extends IChallengePromo {
  challengePromoId: number
  challengeName: string;
  promoName: string;
}

export interface ICreateChallengePromo {
  id: number;
  token: string;
}

export interface IUpdateStateChallengePromo {
  isOpen: boolean;
}
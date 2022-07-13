 export interface IQuestion {
    questionId: number;
    challengeId: number;
    textQuestion: string;
    commandQuestion?: string;
    expectedAnswer?: string;
    scoreQuestion: number;
  }

  export type IQuestionCreate = Omit<IQuestion, 'questionId'>;
  export type IQuestionUpdate = Partial<IQuestion>;
  export type IQuestionRO = Readonly<IQuestion>;

  export interface IUserToken extends IQuestion{
    promo: string;
  }

  export interface IQuestionResponse {
    questionId: number;
    message: string;
    success: boolean;
  }

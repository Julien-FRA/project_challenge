import { Body, Delete, Get, Path, Post, Put, Query, Route } from 'tsoa';
import { Crud } from '../../../classes/Crud';
import { IIndexResponse } from '../../../types/api/IIndexQuery';
import { IUpdateResponse } from '../../../types/api/IUpdateResponse';
import { IChallenge, IChallengeCreate, IChallengeUpdate, ILaunchChallenge } from '../../../types/tables/challenge/IChallenge';
import { connectToInstance, getQuestionsFromChallenge, isQuestionCorrectlyAnswered, resultMessage, updateStudentScore, getQuestionScore } from '../../../middleware/utils';
import { IQuestionResponse } from '../../../types/tables/question/IQuestion';
import { IPromo, IPromoCreate } from '../../../types/tables/promo/IPromo';
import { IChallengePromo } from '../../../types/tables/challengePromo/IChallengePromo';

const READ_COLUMNS = ['challengeId', 'challengeName', 'publicKey' ];
const READ_PROMO_COLUMN = ['promoId', 'promoName'];

/**
 * Gestion des challenges dans la BDD.
 */
@Route("/auth/challenge")
export class ChallengeController {
  @Post('/launch')
  public async playChallenge(@Body() body: ILaunchChallenge) {
    const questionsState: IQuestionResponse[] = [];
    const questions = await getQuestionsFromChallenge(body.challengeId)
    let scoreChallenge: number = 0;

    if (questions.length > 0) {
      for (const question of questions) {
        const response = await connectToInstance(body, question.commandQuestion);

        if (response.stdout) {
          const result = isQuestionCorrectlyAnswered(response, question.expectedAnswer);

          const message = resultMessage(result , response.stderr , `La réponse a la question ${question.questionId} est valide`, question.commandQuestion, response.stdout )
          questionsState.push({questionId: question.questionId, message: message, success: result});

          if (result) {
            const questionScore = await getQuestionScore(question.questionId)
            scoreChallenge += questionScore;
          }
          else {
            await updateStudentScore(body.studentId, scoreChallenge);
            return questionsState
          }
        }
        else {
          await updateStudentScore(body.studentId, scoreChallenge);
          questionsState.push({questionId: question.questionId, message: response.stderr, success: false})
          return questionsState
        }
      };
    }
    else {
      return 'il n\'y pas de questions dans le challenge';
    }
    console.log('scoreChallenge', scoreChallenge);
    await updateStudentScore(body.studentId, scoreChallenge);
    return questionsState;
  }
      /**
   * Récupérer une page des challenges.
   */
  @Get()
  public async getChallenge(
    /** La page (zéro-index) à récupérer */
    @Query() page?: number,
    /** Le nombre d'éléments à récupérer (max 50) */
    @Query() limit?: number,
  ): Promise<IIndexResponse<IChallenge>> {
    return Crud.Index<IChallenge>({ page, limit }, 'challenge', READ_COLUMNS);
  }

  /**
   * Créer un nouveau challenge
   */
    @Post()
    public async createChallenge(
      @Body() body: IChallengeCreate
    ): Promise<any> {
      return Crud.Create<IChallengeCreate>(body, 'challenge');
    }

      /**
   * Récupérer un challenge avec le ID passé dans le URL
   */
  @Get('{challengeId}')
  public async readChallenge(
    @Path() challengeId: number
  ): Promise<IChallenge> {
    return Crud.Read<IChallenge>('challenge', 'challengeId', challengeId, READ_COLUMNS);
  }

   /**
   * Mettre à jour un challenge avec le ID passé dans le URL
   */
     @Put('{challengeId}')
     public async updateUser(
       @Path() challengeId: number,
       @Body() body: IChallengeUpdate
    ): Promise<IUpdateResponse> {
       return Crud.Update<IChallengeUpdate>(body, 'challenge', 'challengeId', challengeId);
    }

    /**
   * Supprimer un challenge
   */
     @Delete('{challengeId}')
     public async deleteUser(
       @Path() challengeId: number,
     ): Promise<IUpdateResponse> {
       return Crud.Delete('challenge', 'challengeId', challengeId);
     }

}

async function challengeNameExist(challengeName: string): Promise<number> {
  return await Crud.Read<IChallenge>('challenge', 'challengeName', challengeName, READ_COLUMNS).then( (challenge) => {
    return Number(challenge.challengeId)
  }).catch(() => {
    return 0
  });
}

async function promoNameExist(promoName: string): Promise<number> {
  return await Crud.Read<IPromo>('promo', 'promoName', promoName, READ_PROMO_COLUMN).then((promo) => {
    return Number(promo.promoId)
  }).catch(() => {
    return Number(Crud.Create<IPromoCreate>({promoName: promoName}, 'promo'));
  });

}


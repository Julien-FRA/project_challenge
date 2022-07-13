import { Body, Delete, Get, Path, Post, Put, Route } from "tsoa";
import { Crud } from "../../classes/Crud";
import { IUpdateResponse } from "../../types/api/IUpdateResponse";
import { IQuestion, IQuestionCreate, IQuestionUpdate } from "../../types/tables/question/IQuestion";

const READ_COLUMNS = ['challengeId', 'questionId', 'textQuestion', 'commandQuestion', 'expectedAnswer', 'scoreQuestion'];

 @Route("/auth/question")
 export class QuestionController {

  /**
   * Créer une nouvelle question
   */
  @Post('{challengeId}')
  public async createQuestion( @Body() body: IQuestionCreate, @Path() challengeId: number): Promise<any> {
    return Crud.checkSumScoreQuestion<{score: number}>('question', 'challengeId', body.challengeId, ["scoreQuestion"]).then((data) => {
      if((Number(data.score) + body.scoreQuestion) > 20) {
        return 'ERROR : Questions sum rate can exceed 20';
      } else {
        return  Crud.Create<IQuestionCreate>(body, 'question').then((data) => {
          return JSON.parse("{id : + " + data.id + "}")
        });
      }
    }).catch((error) => {
      return error
    });
  }

  /**
   * Récupérer un liste de question liée a un challenge.
  */
  @Get('{challengeId}')
  public async readQuestionsForChallenge(
    @Path() challengeId: number
    ): Promise<any> {
    return Crud.ReadList<IQuestion>('question', 'challengeId', challengeId, READ_COLUMNS);
  }

    /**
   * Récupérer une  question avec les ID passé dans le URL
   */
     @Get('/{challengeId}/{questionId}')
     public async readInstance(
       @Path() challengeId: number, questionId: number
     ): Promise<IQuestion> {
       return Crud.ReadWithTwo<IQuestion>('question', 'challengeId', challengeId, 'questionId', questionId, READ_COLUMNS);
     }

  /**
   * Mettre à jour une quesquestion avec le ID passé dans le URL
  */
  @Put('{questionId}')
  public async updateQuestion(
    @Path() questionId: number,
    @Body() body: IQuestionUpdate
  ): Promise<IUpdateResponse> {
    return Crud.Update<IQuestionUpdate>(body, 'question', 'questionId', questionId);
  }

  /**
   * Supprimer une question
   */
   @Delete('{questionId}')
   public async deleteQuestion(
     @Path() questionId: number,
   ): Promise<IUpdateResponse> {
     return Crud.Delete('question', 'questionId', questionId);
   }

 }



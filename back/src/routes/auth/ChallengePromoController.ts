import { Controller, Body, Get, Path, Post, Route, Put } from "tsoa";
import { Crud } from '../../classes/Crud';
import { IUpdateResponse } from "../../types/api/IUpdateResponse";
import { ICreateChallengePromo, IChallengePromo, IChallengePromoList, IUpdateStateChallengePromo } from '../../types/tables/challengePromo/IChallengePromo';
import { getJwt } from '../../middleware/utils';
import mailjet from "node-mailjet"

const READ_COLUMNS = ['challengePromoId', 'challengeId', 'promoId', 'isOpen'];

@Route("/challengePromo")
export class challengePromo extends Controller {
  @Get('/id/{challengePromoId}')
  public async getOpenChallengePromoIdForPromo(@Path() challengePromoId: number): Promise<IChallengePromo> {
    return await Crud.Read<IChallengePromo>('challengePromo', 'challengePromoId', challengePromoId, READ_COLUMNS)
  }
  /**
 * Créer un nouveau challenge pour promo
 */
  @Post()
  public async createChallengePromo(
    @Body() body: IChallengePromo
  ): Promise<ICreateChallengePromo> {
    const { id } = await Crud.Create<IChallengePromo>(body, 'challengePromo');
    return {
      id,
      token: getJwt({ challengePromoId: id, challengeId: body.challengeId, promoId: body.promoId })
    }
  }

  /**
 * Récupérer une liste des challenge pour promo
 */
  @Get("/list")
  public async getChallengePromoList(): Promise<IChallengePromoList> {
    return Crud.CustomSqlQuery(`
    SELECT challengePromoId, ChallengePromo.challengeId, ChallengePromo.promoId, challengeName, promoName, isOpen from ChallengePromo LEFT JOIN Challenge on ChallengePromo.challengeId = Challenge.challengeId LEFT JOIN Promo on ChallengePromo.promoId = Promo.promoId GROUP BY ChallengePromo.challengeId
    `)
  }

  /**
   * Mettre à jour un utilisateur avec le ID passé dans le URL
   */
  @Put('{promoId}')
  public async updateStateChallengePromo(
    @Path() promoId: number,
    @Body() body: IUpdateStateChallengePromo,
  ): Promise<IUpdateResponse> {
    return Crud.Update<IUpdateStateChallengePromo>(body, 'challengePromo', 'challengePromoId', promoId);
  }
}
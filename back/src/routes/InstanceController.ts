const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
import { Body, Get, Path, Post, Route, Query, Delete, Put } from 'tsoa';
import { Crud } from '../classes/Crud';
import { IIndexResponse } from '../types/api/IIndexQuery';
import { IUpdateResponse } from '../types/api/IUpdateResponse';
import { IInstance, IInstanceUpdate } from '../types/tables/instance/IInstance';
import { connectToInstance, isQuestionCorrectlyAnswered, resultMessage } from '../middleware/utils';

const READ_COLUMNS = ['challengeId', 'studentId', 'port', 'addressIp', "username"];

/**
 * Envoie d'un email avec génération d'un token d'accès.
 */
@Route("/instance")
export class InstanceController {

  @Post('/connection')
  public async connect(@Body() body: IInstance): Promise<any> {
    console.log(body)
    const command = 'pwd';
    const response = await connectToInstance(body, command);
    const result = isQuestionCorrectlyAnswered(response, `/home/${body.username}`);
    return resultMessage(result, response.stderr, 'la connexion ssh à bien été mis en place')
  }

  /**
   * Récupérer une page d'instance.
   */
  @Get()
  public async getInstances(
    /** La page (zéro-index) à récupérer */
    @Query() page?: number,
    /** Le nombre d'éléments à récupérer (max 50) */
    @Query() limit?: number,
  ): Promise<IIndexResponse<IInstance>> {
    return Crud.Index<IInstance>({ page, limit }, 'instance', READ_COLUMNS);
  }

  /**
   * Créer une nouvelle instance
   */
  @Post()
  public async createInstanceForUser(
    @Body() body: IInstance
  ): Promise<any> {
    return Crud.Create<IInstance>(body, 'instance');
  }

  /**
 * Mettre à jour une instance avec les ID passés dans le URL
 */
  @Put('/{challengeId}/{studentId}')
  public async updateInstance(
    @Path() challengeId: number, studentId: number,
    @Body() body: IInstanceUpdate
  ): Promise<IUpdateResponse> {
    return Crud.UpdateWithTwo<IInstanceUpdate>(body, 'instance', 'challengeId', challengeId, 'studentId', studentId);
  }

  /**
   * Récupérer une utilisateur avec le ID passé dans le URL
   */
  @Get('/{challengeId}/{studentId}')
  public async readInstance(
    @Path() challengeId: number, studentId: number
  ): Promise<IInstance> {
    return Crud.ReadWithTwo<IInstance>('instance', 'challengeId', challengeId, 'studentId', studentId, READ_COLUMNS);
  }

  /**
* Supprimer une instance
*/
  @Delete('/{challengeId}-{studentId}')
  public async deleteInstance(@Path() challengeId: number, studentId: number): Promise<IUpdateResponse> {
    return Crud.DeleteWithTwo('instance', 'challengeId', challengeId, "studentId", studentId);
  }
}
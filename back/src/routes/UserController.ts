import { Body, Delete, Get, Path, Post, Put, Query, Route } from 'tsoa';
import { Crud } from '../classes/Crud';
import { ICreateResponse } from '../types/api/ICreateResponse';
import { IIndexResponse } from '../types/api/IIndexQuery';
import { IUpdateResponse } from '../types/api/IUpdateResponse';
import { IUser, IUserCreate, IUserToken, IUserUpdate } from '../types/tables/user/IUser';
import { getJwt } from '../middleware/utils';

const READ_COLUMNS = ['userId', 'email', 'role'];

/**
 * Un utilisateur de la plateforme.
 */
@Route("/user")
export class UserController {

  /**
   * Récupérer une page d'utilisateurs.
   */
  @Get()
  public async getUsers(
    /** La page (zéro-index) à récupérer */
    @Query() page?: number,
    /** Le nombre d'éléments à récupérer (max 50) */
    @Query() limit?: number,
  ): Promise<IIndexResponse<IUser>> {
    return Crud.Index<IUser>({ page, limit }, 'user', READ_COLUMNS);
  }

  /**
   * Créer un nouvel utilisateur
   */
  @Post()
  public async createUser(
    @Body() body: IUserCreate
  ): Promise<ICreateResponse> {
    const defaultRole = 0;
    body.role = body.role ?? defaultRole;
    return Crud.Create<IUserCreate>(body, 'user');
  }

  /**
   * Récupérer une utilisateur avec l'email passé dans le URL
   */
  @Get('email/{userEmail}')
  public async readEmailUser(
    @Path() userEmail: string
  ): Promise<IUser> {
    return Crud.Read<IUser>('user', 'email', userEmail, READ_COLUMNS);
  }

  /**
   * Récupérer une utilisateur avec le ID passé dans le URL
   */
  @Get('{userId}')
  public async readUser(
    @Path() userId: number
  ): Promise<IUser> {
    return Crud.Read<IUser>('user', 'userId', userId, READ_COLUMNS);
  }

  /**
   * Mettre à jour un utilisateur avec le ID passé dans le URL
   */
  @Put('{userId}')
  public async updateUser(
    @Path() userId: number,
    @Body() body: IUserUpdate
  ): Promise<IUpdateResponse> {
    return Crud.Update<IUserUpdate>(body, 'user', 'userId', userId);
  }

  /**
   * Supprimer un utilisateur
   */
  @Delete('{userId}')
  public async deleteUser(
    @Path() userId: number,
  ): Promise<IUpdateResponse> {
    return Crud.Delete('user', 'userId', userId);
  }

  @Post('/token')
  public async getToken(@Body() body: IUserToken): Promise<boolean> {
    return getJwt({ user: body })
  }

}

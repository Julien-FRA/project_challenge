import { Body, Delete, Get, Path, Post, Put, Query, Route } from 'tsoa';
import { Crud } from '../../../classes/Crud';
import { IIndexResponse } from '../../../types/api/IIndexQuery';
import { IUpdateResponse } from '../../../types/api/IUpdateResponse';
import { IPromo, IPromoCreate, IPromoUpdate } from '../../../types/tables/promo/IPromo';

const READ_COLUMNS = ['promoId', 'promoName'];

/**
 * Un utilisateur de la plateforme.
 */
@Route("/auth/promo")
export class PromoController {

  /**
   * Récupérer une page de la liste des promos.
   */
  @Get()
  public async getPromos(
    /** La page (zéro-index) à récupérer */
    @Query() page?: number,
    /** Le nombre d'éléments à récupérer (max 50) */
    @Query() limit?: number,
  ): Promise<IIndexResponse<IPromo>> {
    return Crud.Index<IPromo>({ page, limit }, 'promo', READ_COLUMNS);
  }

  /**
   * Créer une nouvelle promo
   */
  @Post()
  public async createPromo(
    @Body() body: IPromoCreate
  ): Promise<any> {
    return Crud.Create<IPromoCreate>(body, 'promo');
  }

  /**
   * Récupérer une promo avec le ID passé dans le URL
   */
  @Get('{promoId}')
  public async readPromo(
    @Path() promoId: number
  ): Promise<IPromo> {
    return Crud.Read<IPromo>('promo', 'promoId', promoId, READ_COLUMNS);
  }

  /**
   * Mettre à jour un utilisateur avec le ID passé dans le URL
   */
  @Put('{promoId}')
  public async updatePromo(
    @Path() promoId: number,
    @Body() body: IPromoUpdate
  ): Promise<IUpdateResponse> {
    return Crud.Update<IPromoUpdate>(body, 'promo', 'promoId', promoId);
  }

  /**
   * Supprimer un utilisateur
   */
  @Delete('{promoId}')
  public async deletePromo(
    @Path() promoId: number,
  ): Promise<IUpdateResponse> {
    return Crud.Delete('promo', 'promoId', promoId);
  }
}

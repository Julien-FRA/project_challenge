import { Body, Delete, Get, Path, Post, Put, Query, Route } from 'tsoa';
import { Crud } from '../../classes/Crud';
import { IChallengeLink } from '../../types/api/IAdmin';
import { IIndexResponse } from '../../types/api/IIndexQuery';
import { IUpdateResponse } from '../../types/api/IUpdateResponse';
import { IAdmin, IAdminCreate, IAdminUpdate } from '../../types/tables/admin/IAdmin';
import { getJwt } from '../../middleware/utils';

const bcrypt = require('bcrypt');
const READ_COLUMNS = ['adminId', 'pseudo', 'password'];

/**
 * Un utilisateur de la plateforme.
 */
@Route("/auth/admin")
// @Security('jwt')
export class AdminController {

    @Post('/link')
    public async sendMail(@Body() body: IChallengeLink): Promise<string> {
        return getJwt({ promoId: body.promoId, challengeId: body.challengeId })
    }

    /**
     * Récupérer une page d'utilisateurs.
     */
    @Get()
    public async getAdmins(
        /** La page (zéro-index) à récupérer */
        @Query() page?: number,
        /** Le nombre d'éléments à récupérer (max 50) */
        @Query() limit?: number,
    ): Promise<IIndexResponse<IAdmin>> {
        return Crud.Index<IAdmin>({ page, limit }, 'admin', READ_COLUMNS);
    }

    /**
     * Créer un nouvel utilisateur
     */
    @Post()
    public async createAdmin(
        @Body() body: IAdminCreate,
    ): Promise<any> {
        const password = body.password;
        const passwordHash = bcrypt.hashSync(password, 10);
        body.password = passwordHash;
        return Crud.Create<IAdminCreate>(body, 'admin');
    }

    /**
     * Récupérer une utilisateur avec le ID passé dans le URL
     */
    @Get('{adminId}')
    public async readAdmin(
        @Path() adminId: number
    ): Promise<IAdmin> {
        return Crud.Read<IAdmin>('admin', 'adminId', adminId, READ_COLUMNS);
    }

    /**
     * Mettre à jour un utilisateur avec le ID passé dans le URL
     */
    @Put('{adminId}')
    public async updateAdmin(
        @Path() adminId: number,
        @Body() body: IAdminUpdate
    ): Promise<IUpdateResponse> {
        return Crud.Update<IAdminUpdate>(body, 'admin', 'adminId', adminId);
    }

    /**
     * Supprimer un utilisateur
     */
    @Delete('{adminId}')
    public async deleteStudent(
        @Path() adminId: number,
    ): Promise<IUpdateResponse> {
        return Crud.Delete('admin', 'adminId', adminId);
    }

    /**
     * Récupérer une utilisateur avec le pseudo passé dans le URL
     */
     @Post('/connect/{pseudo}')
     public async connectAdmin(
         @Body() body: any,
         @Path() pseudo: string
     ): Promise<false| { token: string }> {
         const admin = await Crud.Read<IAdmin>('admin', 'pseudo', pseudo, READ_COLUMNS);
         console.log(admin);
         console.log(body.password);
         const verifiedPassword = bcrypt.compareSync(body.password, admin.password);
         console.log(verifiedPassword)
         if(!verifiedPassword) return false
 
       const token = getJwt(
         {
           id: admin.adminId
         },
         "24h",
       );
         return {
           token
         };
     }

}
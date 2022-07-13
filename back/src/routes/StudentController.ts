import { Body, Delete, Get, Path, Post, Put, Query, Route } from 'tsoa';
import { Crud } from '../classes/Crud';
import { ICreateResponse } from '../types/api/ICreateResponse';
import { IIndexResponse } from '../types/api/IIndexQuery';
import { IUpdateResponse } from '../types/api/IUpdateResponse';
import { IStudent, IStudentCreate, IStudentUpdate } from '../types/tables/student/IStudent';

const READ_COLUMNS = ['studentId', 'promoId', 'familyName', 'givenName', 'rating'];

/**
 * Un utilisateur de la plateforme.
 */
@Route("/student")
// @Security('jwt')
export class StudentController {

    /**
     * Récupérer une page d'utilisateurs.
     */
    @Get()
    public async getStudents(
        /** La page (zéro-index) à récupérer */
        @Query() page?: number,
        /** Le nombre d'éléments à récupérer (max 50) */
        @Query() limit?: number,
    ): Promise<IIndexResponse<IStudent>> {
        return Crud.Index<IStudent>({ page, limit }, 'student', READ_COLUMNS);
    }

    /**
     * Créer un nouvel utilisateur
     */
    @Post()
    public async createStudent(
        @Body() body: IStudentCreate
    ): Promise<ICreateResponse> {
        return Crud.Create<IStudentCreate>(body, 'student');
    }

    /**
     * Récupérer une utilisateur avec le ID passé dans le URL
     */
    @Get('{studentId}')
    public async readStudent(
        @Path() studentId: number
    ): Promise<IStudent> {
        return Crud.Read<IStudent>('student', 'studentId', studentId, READ_COLUMNS);
    }

    /**
     * Mettre à jour un utilisateur avec le ID passé dans le URL
     */
    @Put('{studentId}')
    public async updateStudent(
        @Path() studentId: number,
        @Body() body: IStudentUpdate
    ): Promise<IUpdateResponse> {
        return Crud.Update<IStudentUpdate>(body, 'student', 'studentId', studentId);
    }

    /**
     * Supprimer un utilisateur
     */
    @Delete('{studentId}')
    public async deleteStudent(
        @Path() studentId: number,
    ): Promise<IUpdateResponse> {
        return Crud.Delete('student', 'studentId', studentId);
    }
}
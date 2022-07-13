import { Controller, Body, Post, Route, SuccessResponse, Get, Path, Query } from "tsoa";
import { Crud } from '../../classes/Crud';
import { ILinkStudentToChallenge, IStudentChallengeList } from '../../types/tables/challengeStudent/linkStudentToChallenge';
import { ICreateResponse } from "../../types/api/ICreateResponse";
import { IChallengePromoList } from "../../types/tables/challengePromo/IChallengePromo";

@Route("/challengeStudent")
export class ChallengeStudentController extends Controller {

    @Post()
    @SuccessResponse("201", "Created")
    public async linkStudentToChallenge(@Body() body: ILinkStudentToChallenge): Promise<ICreateResponse> {
        console.log('body', body);
        return Crud.Create<ILinkStudentToChallenge>(body, 'challengeStudent');
    }

    /**
    * Récupérer une liste des challenge pour promo
    */
    @Get("/list")
    public async getChallengeStudentList(
        @Query() filter?: string,
    ): Promise<IStudentChallengeList> {
        const baseFilter = filter ? filter : "challengeName"
        return Crud.CustomSqlQuery(`
        SELECT Student.studentId, Challenge.challengeId, Promo.promoId, familyName, givenName, rating, challengeName, promoName from Student
        LEFT JOIN ChallengeStudent on ChallengeStudent.studentId = Student.studentId
        LEFT JOIN Promo on Promo.promoId = Student.promoId
        LEFT JOIN Challenge on Challenge.challengeId = ChallengeStudent.challengeId
        ORDER BY ${baseFilter} DESC
    `)
    }
}



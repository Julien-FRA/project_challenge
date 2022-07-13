import jwt, { JwtPayload } from "jsonwebtoken"
import { Body, Get, Path, Post, Route } from 'tsoa';
import { IRegister } from '../types/api/IRegister';
import { getJwt } from '../middleware/utils';
import mailjet from "node-mailjet"

/**
 * Envoie d'un email avec génération d'un token d'accès.
 */
@Route("/register")
export class Register {
  @Post()
  public async sendUserMail(@Body() body: IRegister): Promise<IRegister> {
    const token = getJwt(
      {
        ...body
      },
      "24h",
    );
    body.identityToken = token;
    const request = mailjet.connect(process.env.MJ_APIKEY_PUBLIC || "", process.env.MJ_APIKEY_PRIVATE || "")
      .post("send", { 'version': 'v3.1' })
      .request({
        "Messages": [{
          "From": {
            "Email": process.env.MAIL_TO_CHALLENGE,
            "Name": "API Node Challenge"
          },
          "To": [{
            "Email": body.email,
            "Name": body.email
          }],
          "Subject": "Lien du challenge",
          "TextPart": `Voici le lien pour accéder a votre challenge ${process.env.URL}/verify?token=${body.identityToken} bonne chance bébou !`
        }]
      })
    request
      .then((result: any) => console.log(result.body))
      .catch((err: any) => console.log(err.statusCode))

    return body
  }

  @Get('/verify/{token}')
  public async getRegisterMail(
    @Path() token: string): Promise<string | JwtPayload> {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "maeKMdGKpxTSaBPa");
    return decodedToken;
  }
}

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
import { Request } from 'express';
import { ApiError } from '../classes/Errors/ApiError';
import { ErrorCode } from '../classes/Errors/ErrorCode';
import { Log } from '../classes/Logging/Log';

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<boolean> {

  const jwt = require("jsonwebtoken");
  const emailUser = request.body;

  if (securityName === 'jwt') {
    if (!request.headers.authorization) {
      throw new ApiError(ErrorCode.Unauthorized, 'auth/missing-header', 'Missing authorization header');
    }
    else {
      const decodedToken = jwt.verify(request.headers.authorization.substring(7), process.env.ACCESS_TOKEN_SECRET);
      const decodedEmail = decodedToken.email;

      if (emailUser.email !== decodedEmail) {
        throw 'Invalid user ID';
      }
    }

  }

  return true;
}


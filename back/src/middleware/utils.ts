import jwt from 'jsonwebtoken'
import { IInstance } from '../types/tables/instance/IInstance';
const { readFileSync } = require('fs');
import { Client } from 'ssh2';
import { IQuestion } from "../types/tables/question/IQuestion";
import { Crud } from "../classes/Crud";
import { IStudentUpdate } from "../types/tables/student/IStudent";
import { IUpdateResponse } from "../types/api/IUpdateResponse";

const QUESTION_COLUMNS = ['challengeId', 'questionId', 'textQuestion', 'commandQuestion', 'expectedAnswer', 'scoreQuestion'];


interface Generic {
  [key: string]: string | number | object
}

export function getJwt(params: Generic, duration?: string): any {
  return jwt.sign(
    params,
    process.env.ACCESS_TOKEN_SECRET || "maeKMdGKpxTSaBPa",
    { ...duration && { expiresIn: duration } }
  )
};

export function connectToInstance(instanceCoord: IInstance, command: string | undefined) {
  return new Promise<any>((resolve, reject) => {
    let output: object, stdout: string, stderr: string;

    const conn = new Client();
    conn.on('ready', () => {
      console.log('Client :: ready');
      conn.exec(`${command}`, (err: any, stream: any) => {
        if (err) {
          console.log("ERROR: Connection to your instance is failed. Please check your instance coordornees")
          reject(err);
        };
        stream.on('close', (code: any, signal: any) => {
          console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
          conn.end();
          output = {
            stdout: stdout?.replace('undefined', '').replace(/\n/g, ''),
            stderr: stderr?.replace('undefined', '').replace(/\n/g, '')
          };
          resolve(output);
        }).on('data', (data: any) => {
          console.log('STDOUT: ' + data);
          stdout += data
        }).stderr.on('data', (data: any) => {
          console.log('STDERR: ' + data);
          stderr += data
        });
      });
    }).on('error', (err) => {
      console.log("ERROR: La connexion n'as pas pu etre étbalir avec l'instance")
      reject(err);
    }).connect({
      host: instanceCoord.addressIp,
      port: instanceCoord.port,
      username: instanceCoord.username,
      privateKey: readFileSync(process.env.PRIVATE_KEY_PATH),
    });
  })
}

export async function getQuestionScore(questionId: number) {
  return await Crud.Read<IQuestion>('question', 'questionId', questionId, ['scoreQuestion']).then((data) => {
    return data.scoreQuestion
  });
}

export function isQuestionCorrectlyAnswered(instanceResponse: any, expectedAnswer: any): boolean {
  instanceResponse = instanceResponse.stdout;
  const clearEdxpectedAnswer = expectedAnswer.replace(/\s\n/g, '');
  if (instanceResponse.includes(clearEdxpectedAnswer)) {
    return true
  }
  return false;
}

export function resultMessage(isCorrectlyAnswered: boolean, stdError: string, successMessage: string, commandQuestion?: string, stdOut?: string): string {
  console.log(`${commandQuestion} isCorrectlyAnswered`, isCorrectlyAnswered)
  let errorMessage
  if (commandQuestion?.includes('curl')) {
    errorMessage = `${stdOut}. La réponse renvoyer par le serveur n'est pas celle attendu`
  }
  else
    errorMessage = stdError

  return isCorrectlyAnswered ? successMessage : errorMessage
}

export async function updateStudentScore(studentId: number, scoreChallenge: number): Promise<IUpdateResponse> {
  return await Crud.Update<IStudentUpdate>({rating: scoreChallenge}, 'student', 'studentId', studentId);
}

export async function getQuestionsFromChallenge(challengeId: number): Promise<IQuestion[]> {
  return await Crud.ReadList<IQuestion>('question', 'challengeId', challengeId, QUESTION_COLUMNS);
}

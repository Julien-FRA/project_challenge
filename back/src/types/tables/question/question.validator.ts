import Ajv, { JSONSchemaType } from 'ajv';
import { IQuestionCreate, IQuestionUpdate } from './IQuestion';



const QuestionCreateSchema: JSONSchemaType<IQuestionCreate> = {
  type: "object",
  properties: {
    challengeId: { type: 'number' },
    textQuestion: { type: 'string' },
    commandQuestion: { type: 'string', nullable: true },
    expectedAnswer: { type: 'string', nullable: true },
    scoreQuestion: { type: 'number' },
  },
  required: ["challengeId", "textQuestion", "scoreQuestion"],
  additionalProperties: false,
};


const QuestionUpdateSchema: JSONSchemaType<IQuestionUpdate> = {
  type: "object",
  properties: {
    questionId: { type: 'number', nullable: true },
    challengeId: { type: 'number', nullable: true },
    textQuestion: { type: 'string', nullable: true },
    commandQuestion: { type: 'string', nullable: true },
    expectedAnswer: { type: 'string', nullable: true },
    scoreQuestion: { type: 'number', nullable: true },
  },
  additionalProperties: false,
};

const ajv = new Ajv();
export const QuestionCreateValidator = ajv.compile(QuestionCreateSchema);
export const QuestionUpdateValidator = ajv.compile(QuestionUpdateSchema);
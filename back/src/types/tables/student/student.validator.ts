import Ajv, { JSONSchemaType } from 'ajv';
import { IStudentCreate, IStudentUpdate } from './IStudent';



const StudentCreateSchema: JSONSchemaType<IStudentCreate> = {
    type: "object",
    properties: {
        studentId: { type: 'number' },
        familyName: { type: 'string'},
        givenName: { type: 'string'},
        rating: { type: 'number', nullable: true },
        promoId: { type: 'number'},
    },
    required: ["familyName", "givenName", "promoId", "studentId"],
    additionalProperties: false,
};


const StudentUpdateSchema: JSONSchemaType<IStudentUpdate> = {
    type: "object",
    properties: {
      studentId: { type: 'number', nullable: true },
      familyName: { type: 'string', nullable: true },
      givenName: { type: 'string', nullable: true },
      rating: { type: 'number', nullable: true },
      promoId: { type: 'number', nullable: true },
    },
    additionalProperties: false,
};

const ajv = new Ajv();
export const StudentCreateValidator = ajv.compile(StudentCreateSchema);
export const StudentUpdateValidator = ajv.compile(StudentUpdateSchema);
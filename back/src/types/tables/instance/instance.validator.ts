import Ajv, { JSONSchemaType } from 'ajv';
import { IInstance, IInstanceUpdate } from './IInstance';


const InstanceCreateSchema: JSONSchemaType<IInstance> = {
    type: "object",
    properties: {
      challengeId: { type: 'number', nullable: true },
      studentId: { type: 'number', nullable: true },
      port: { type: 'number' },
      addressIp: { type: 'string'},
      username: { type: 'string' },
    },
    required: ["addressIp", "username", "port"],
    additionalProperties: false,
};

const InstanceUpdateSchema: JSONSchemaType<IInstanceUpdate> = {
    type: "object",
    properties: {
      challengeId: { type: 'number', nullable: true },
      studentId: { type: 'number', nullable: true },
      port: { type: 'number', nullable: true },
      addressIp: { type: 'string', nullable: true},
      username: { type: 'string', nullable: true },
    },
    additionalProperties: false,
};

const ajv = new Ajv();
export const UserCreateValidator = ajv.compile(InstanceCreateSchema);
export const UserUpdateValidator = ajv.compile(InstanceUpdateSchema);

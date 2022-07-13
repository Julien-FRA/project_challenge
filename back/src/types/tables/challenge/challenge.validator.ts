import Ajv, { JSONSchemaType } from 'ajv';
import { IChallengeCreate, IChallengeUpdate } from './IChallenge';


const ChallengeCreateSchema: JSONSchemaType<IChallengeCreate> = {
    type: "object",
    properties: {
      challengeName: { type: 'string' },
      publicKey: { type: 'string', nullable: false},
    },
    required: ["challengeName", "publicKey"],
    additionalProperties: false,
};

const ChallengeUpdateSchema: JSONSchemaType<IChallengeUpdate> = {
    type: "object",
    properties: {
      challengeId: { type: 'number', nullable: true },
      challengeName: { type: 'string', nullable: true },
      publicKey: { type: 'string', nullable: true },
    },
    additionalProperties: false,
};

const ajv = new Ajv();
export const ChallengeCreateValidator = ajv.compile(ChallengeCreateSchema);
export const ChallengeUpdateValidator = ajv.compile(ChallengeUpdateSchema);
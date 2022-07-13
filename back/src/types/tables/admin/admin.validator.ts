import Ajv, { JSONSchemaType } from 'ajv';
import { IAdminCreate, IAdminUpdate } from './IAdmin';



const AdminCreateSchema: JSONSchemaType<IAdminCreate> = {
    type: "object",
    properties: {
        adminId: { type: 'number' },
        pseudo: { type: 'string' },
        password: { type: 'string' },
        accessToken: {type: "string", nullable: true}
    },
    required: ["adminId", "pseudo", "password"],
    additionalProperties: false,
};


const AdminUpdateSchema: JSONSchemaType<IAdminUpdate> = {
    type: "object",
    properties: {
        adminId: { type: 'number', nullable: true },
        pseudo: { type: 'string', nullable: true },
        password: { type: 'string', nullable: true },
        accessToken: { type: "string", nullable: true }
    },
    additionalProperties: false,
};

const ajv = new Ajv();
export const UserCreateValidator = ajv.compile(AdminCreateSchema);
export const UserUpdateValidator = ajv.compile(AdminUpdateSchema);
import Ajv, { JSONSchemaType } from 'ajv';
import { IPromoCreate, IPromoUpdate } from './IPromo';



const PromoCreateSchema: JSONSchemaType<IPromoCreate> = {
  type: "object",
  properties: {
    promoName: { type: 'string' },
  },
  required: ["promoName"],
  additionalProperties: false,
};


const PromoUpdateSchema: JSONSchemaType<IPromoUpdate> = {
  type: "object",
  properties: {
    promoId: { type: 'number', nullable: true},
    promoName: { type: 'string', nullable: true},
  },
  additionalProperties: false,
};

const ajv = new Ajv();
export const PromoCreateValidator = ajv.compile(PromoCreateSchema);
export const PromoUpdateValidator = ajv.compile(PromoUpdateSchema);
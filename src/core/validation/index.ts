import Ajv from 'ajv';
import { ValidationError } from '../../common/errors';

class Validation {
  validator: any;
  constructor() {
    this.validator = new Ajv();
  }

  validate(schema, data, strict = true) {
    const nSchema = schema;

    if (!strict) {
      delete nSchema.required;
    }

    const valid = this.validator.validate(nSchema, data);
    if (!valid) {
      throw new ValidationError('Validation error(s)', this.validator.errors);
    }
  }
}

export const validation = new Validation();

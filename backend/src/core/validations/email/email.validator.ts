import validator from 'validator';
import { IDatabaseValidator } from '../../interfaces/database-validator.interface';
import { errorMessageBuilder } from '../error-message-builder';

export const _validateEmail = (value: string): boolean => {
  if (!value) {
    return false;
  }

  return validator.isEmail(value);
};

export const validateEmail: IDatabaseValidator = {
  validator: _validateEmail,
  message: errorMessageBuilder,
};

import { ModelError } from '../models/model-error.js';

export const throwModelError = (message) => {
  throw new ModelError(message);
}

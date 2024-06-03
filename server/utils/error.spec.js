import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ModelError } from '../models/model-error.js';
import { throwModelError } from './errors.js';

describe('Errors', () => {
  it('should throw ModelError with correct message', () => {
    const errorMessage = 'Test error message';
    assert.throws(() => {
      throwModelError(errorMessage);
    }, new ModelError(errorMessage));
  });

  it('should throw ModelError with different message', () => {
    const errorMessage = 'Another test error message';
    assert.throws(() => {
      throwModelError(errorMessage);
    }, new ModelError(errorMessage));
  });
});

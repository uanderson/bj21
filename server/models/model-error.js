/**
 * Custom error class for model-related errors.
 *
 * Represents a custom error class specifically designed for model-related errors. Inherits from the built-in Error class.
 * Provides additional properties such as status code for HTTP responses and captures stack traces for debugging purposes.
 *
 * @class
 * @extends Error
 * @param {string} message - The error message.
 */
export class ModelError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 400;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

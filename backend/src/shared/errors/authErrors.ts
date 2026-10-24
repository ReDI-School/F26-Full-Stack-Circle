/**
 * Errors the auth service throws on purpose. They describe what went
 * wrong in business terms only; turning them into HTTP responses is the
 * controller's job, so the service can be reused outside a request
 * (a seed script, a background job) without dragging status codes along.
 */
export class EmailAlreadyRegisteredError extends Error {
  constructor(message = 'That email is already registered.') {
    super(message);
    this.name = 'EmailAlreadyRegisteredError';
  }
}

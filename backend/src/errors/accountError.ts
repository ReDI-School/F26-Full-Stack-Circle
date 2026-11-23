/**
 * Errors the account service throws on purpose. Status codes live here
 * the same way they do on ItemError / ThreadError: the controller maps
 * them onto the HTTP response and does not invent a second meaning.
 */
export class AccountError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AccountError';
  }
}

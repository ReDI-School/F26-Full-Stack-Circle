import type { PublicUser } from '../services/authService';

/* Adds `req.user` to Express's Request type. requireAuth sets it, so any
   handler after requireAuth can read the logged-in user with full types.
*/
declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
    }
  }
}
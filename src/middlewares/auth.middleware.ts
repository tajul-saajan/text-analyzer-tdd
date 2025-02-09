import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

/* istanbul ignore next */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    console.log('error', err, 'user', user);
    if (err || !user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    req.user = user;
    next();
  })(req, res, next);
};

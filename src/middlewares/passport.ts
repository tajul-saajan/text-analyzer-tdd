import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '@/entities/user';
import { PassportStatic } from 'passport';
import { SECRET_KEY } from '@config';

export const jwtStrategy = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: SECRET_KEY,
      },
      async (jwt_payload, done) => {
        try {
          console.log(jwt_payload, 'ppppp');
          const user = await User.findOne({ where: { id: +jwt_payload.userId } });
          if (!user) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );
};

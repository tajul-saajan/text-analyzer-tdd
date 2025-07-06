import { UserRegisterDto } from '@dtos/user-register.dto';
import { User } from '@/entities/user';
import { HttpException } from '@exceptions/httpException';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { ACCOUNT_LOCK_DURATION_MINUTES, ACCOUNT_LOCK_THRESHOLD, SECRET_KEY } from '@config';
import { UserLoginDto } from '@dtos/user-login.dto';
import logger from '@/utils/logger';

@Service()
export class AuthService {
  async register(dto: UserRegisterDto) {
    const { name, email, password } = dto;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new HttpException(400, 'Email is already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User();
    newUser.email = email;
    newUser.name = name;
    newUser.password = hashedPassword;
    await newUser.save();

    const token = jwt.sign({ userId: newUser.id }, SECRET_KEY, { expiresIn: '1h' });

    return token;
  }

  async login(dto: UserLoginDto) {
    const { email, password } = dto;

    logger.info(`Login attempt for email: ${email}`);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      logger.warn(`Login failed. Invalid credentials for email: ${email}`);
      throw new HttpException(400, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      user.failedLoginAttempts += 1;
      let message = `Login failed. Incorrect password for email: ${email}`;

      if (user.failedLoginAttempts >= ACCOUNT_LOCK_THRESHOLD) {
        message = `User ${email} locked out due to too many failed login attempts`;
        user.lockoutUntil = new Date(Date.now() + ACCOUNT_LOCK_DURATION_MINUTES); // Lockout for 15 minutes
        await user.save();
      }
      logger.warn(message);
      throw new HttpException(400, message);
    }

    logger.info(`User ${email} logged in successfully`);

    user.failedLoginAttempts = 0; // Reset failed attempts on successful login
    user.lockoutUntil = null; // Clear lockout time
    await user.save();

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });

    return token;
  }
}

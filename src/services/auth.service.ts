import { UserRegisterDto } from '@dtos/user-register.dto';
import { User } from '@/entities/user';
import { HttpException } from '@exceptions/httpException';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { UserLoginDto } from '@dtos/user-login.dto';

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

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(400, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(400, 'Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });

    return token;
  }
}

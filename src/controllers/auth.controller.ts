import { NextFunction, Request, Response } from 'express';
import { validateRequest } from '@utils/validateRequest';
import { UserRegisterDto } from '@dtos/user-register.dto';
import { AuthService } from '@services/auth.service';
import { Container } from 'typedi';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = Container.get(AuthService);
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = await validateRequest<UserRegisterDto>(UserRegisterDto, req.body, res);
      const token = await this.authService.register(dto);

      res.status(201).json({ message: 'User created successfully', token });
    } catch (e) {
      next(e);
    }
  };
}

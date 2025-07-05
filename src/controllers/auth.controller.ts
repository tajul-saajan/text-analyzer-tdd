import { NextFunction, Request, Response } from 'express';
import { validateRequest } from '@utils/validateRequest';
import { UserRegisterDto } from '@dtos/user-register.dto';
import { AuthService } from '@services/auth.service';
import { Container } from 'typedi';
import { UserLoginDto } from '@dtos/user-login.dto';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = Container.get(AuthService);
  }

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = await validateRequest<UserRegisterDto>(UserRegisterDto, req.body, res);
      const token = await this.authService.register(dto);

      res.status(201).json({ message: 'User created successfully', token });
    } catch (e) {
      next(e);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = await validateRequest<UserLoginDto>(UserLoginDto, req.body, res);
      const token = await this.authService.login(dto);

      res.status(200).json({ message: 'Login successful', token });
    } catch (e) {
      next(e);
    }
  };

  public getProfile = async (req: Request, res: Response) => {
    res.status(200).json({ message: 'Profile accessed', user: req.user });
  };
}

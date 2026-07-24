import { Request, Response } from "express";

import { AuthService } from "./auth.service.js";
// using arrow functions to prevent losing "this"
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  signup = async (req: Request, res: Response) => {
    const result = await this.authService.signup(req.body);
    
    res.status(201).json(result);
  }

  login = async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);

    res.status(200).json(result);
  }

  refresh = async (req: Request, res: Response) => {
    const result = await this.authService.refresh(
      req.cookies.refreshToken,
    );

    res.status(200).json(result);
  }

  logout = async (req: Request, res: Response) => {
    await this.authService.logout(
      req.cookies.refreshToken,
    );

    res.sendStatus(204);
  }
}
/**
 * alternative way to prevent losing "this"
 * constructor(
  private readonly authService: AuthService,
) {
  this.signup = this.signup.bind(this);
  this.login = this.login.bind(this);
  this.refresh = this.refresh.bind(this);
  this.logout = this.logout.bind(this);
}
 */
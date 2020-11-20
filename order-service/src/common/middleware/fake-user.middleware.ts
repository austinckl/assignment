import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: {
        name: string;
        phone: string;
        email: string;
      };
    }
  }
}

@Injectable()
export class FakeUserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    const fakeUser = {
      name: 'Fake User',
      phone: '60123456789',
      email: 'fake@user.com',
    };

    req.user = fakeUser;

    next();
  }
}

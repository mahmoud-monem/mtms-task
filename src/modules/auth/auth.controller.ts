import { Request } from 'express';
import Utils from '../../common/utils';
import { aclResources } from '../../core/authorization/resources';
import { BaseController } from '../../core/base.controller';
import { AuthSchema } from './auth.schema';
import authService from './auth.service';

class CountryController extends BaseController {
  constructor() {
    super({
      name: aclResources.AUTH,
      service: authService,
      path: '/auth/local',
      routes: [
        {
          method: 'POST',
          path: '/login',
          handler: 'login',
        },
        {
          method: 'POST',
          path: '/register',
          handler: 'register',
        },
      ],
    });
  }

  async login(req: Request, res, next) {
    try {
      await this.authorize(req, 'createAny');
      this.validate(AuthSchema.login, req.body);
      res.send(
        await this.service.login(
          req.body,
          Utils.parseBoolean(req.query.is_fourteen),
        ),
      );
    } catch (err) {
      next(err);
    }
  }

  async register(req, res, next) {
    try {
      await this.authorize(req, 'createAny');
      this.validate(AuthSchema.register, req.body);
      res.send(await this.service.register(req.body));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CountryController;

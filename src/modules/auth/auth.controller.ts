import { aclResources } from '../../core/authorization/resources';
import { BaseController } from '../../core/base.controller';
import { AuthSchema } from './auth.schema';
import { AuthService } from './auth.service';

class CountryController extends BaseController {
  constructor() {
    super({
      name: aclResources.AUTH,
      service: AuthService,
      path: '/auth/local',
      routes: [
        {
          method: 'POST',
          path: '/login',
          handler: 'login',
        },
      ],
    });
  }

  async login(req, res, next) {
    try {
      await this.authorize(req, 'createAny');
      this.validate(AuthSchema.login, req.body);
      res.send(await this.service.login(req.body));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CountryController;

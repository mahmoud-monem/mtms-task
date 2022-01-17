import { aclResources } from '../../core/authorization/resources';
import { BaseController } from '../../core/base.controller';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';

class UserPostController extends BaseController {
  service: UserService;
  constructor() {
    super({
      name: aclResources.USER,
      service: new UserService(),
      path: '/users',
      routes: [
        { method: 'GET', path: '/', handler: 'find' },
        { method: 'GET', path: '/:id', handler: 'findOne' },
        { method: 'PUT', path: '/:id', handler: 'update' },
        { method: 'DELETE', path: '/:id', handler: 'delete' },
      ],
    });
  }

  async find(req, res, next) {
    try {
      await this.authorize(
        req,
        ['readAny', 'readOwn'],
        () => req.params.id === req.account.id.toString(),
      );
      res.send(await this.service.find(req.query));
    } catch (err) {
      next(err);
    }
  }

  async findOne(req, res, next) {
    try {
      await this.authorize(req, 'readAny');
      res.send(await this.service.findOne(req.params.id));
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      await this.authorize(
        req,
        'updateOwn',
        () => req.params.id === req.account.id.toString(),
      );
      this.validate(UserSchema.update, req.body, false);
      res.send(await this.service.update(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await this.authorize(
        req,
        ['deleteAny', 'deleteOwn'],
        () => req.params.id === req.account.id.toString(),
      );
      res.send(await this.service.delete(req.params.id));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserPostController;

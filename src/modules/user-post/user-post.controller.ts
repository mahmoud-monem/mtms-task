import { aclResources } from '../../core/authorization/resources';
import { BaseController } from '../../core/base.controller';
import { PostSchema } from './user-post.schema';
import userPostService from './user-post.service';

class UserPostController extends BaseController {
  constructor() {
    super({
      name: aclResources.USER_POST,
      service: userPostService,
      path: '/users/:userId/posts',
      routes: [
        { method: 'POST', path: '/', handler: 'create' },
        { method: 'GET', path: '/', handler: 'find' },
        { method: 'GET', path: '/:id', handler: 'findOne' },
        { method: 'PUT', path: '/:id', handler: 'update' },
        { method: 'DELETE', path: '/:id', handler: 'delete' },
      ],
    });
  }

  async create(req, res, next) {
    try {
      await this.authorize(
        req,
        'createOwn',
        () => req.params.userId === req.account.id.toString(),
      );
      this.validate(PostSchema.create, req.body);
      req.body.user = req.account;
      res.send(await this.service.create(req.body));
    } catch (err) {
      next(err);
    }
  }

  async find(req, res, next) {
    try {
      await this.authorize(
        req,
        ['readAny', 'readOwn'],
        () => req.params.userId === req.account.id.toString(),
      );
      req.query.userId = req.params.userId;
      res.send(await this.service.find(req.query));
    } catch (err) {
      next(err);
    }
  }

  async findOne(req, res, next) {
    try {
      await this.authorize(req, 'readAny');
      res.send(await this.service.findOne(req.params.id, req.params.userId));
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      await this.authorize(
        req,
        'updateOwn',
        () => req.params.userId === req.account.id.toString(),
      );
      this.validate(PostSchema.update, req.body, false);
      res.send(
        await this.service.update(req.params.id, req.body, req.params.userId),
      );
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await this.authorize(
        req,
        'deleteOwn',
        () => req.params.userId === req.account.id.toString(),
      );
      res.send(await this.service.delete(req.params.id, req.params.userId));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserPostController;

import { aclResources } from '../../core/authorization/resources';
import { BaseController } from '../../core/base.controller';
import { CommentSchema } from './comment.schema';
import { CommentService } from './comment.service';

class UserPostController extends BaseController {
  service: CommentService;

  constructor() {
    super({
      name: aclResources.COMMENT,
      service: new CommentService(),
      path: '/posts/:postId/comments',
      routes: [
        { method: 'POST', path: '/', handler: 'create' },
        { method: 'GET', path: '/', handler: 'find' },
        { method: 'PUT', path: '/:id', handler: 'update' },
        { method: 'DELETE', path: '/:id', handler: 'delete' },
      ],
    });
  }

  async create(req, res, next) {
    try {
      await this.authorize(req, 'createAny');
      this.validate(CommentSchema.create, req.body);
      req.body.user = req.account;
      req.body.post = req.params.postId;
      res.send(await this.service.create(req.body));
    } catch (err) {
      next(err);
    }
  }

  async find(req, res, next) {
    try {
      await this.authorize(req, 'readAny');
      req.query.postId = req.params.postId;
      res.send(await this.service.find(req.query));
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      await this.authorize(req, 'updateAny');
      this.validate(CommentSchema.update, req.body, false);
      res.send(
        await this.service.update(req.params.id, req.body, req.account.id),
      );
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await this.authorize(req, 'deleteAny');
      res.send(await this.service.delete(req.params.id, req.account.id));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserPostController;

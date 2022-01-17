import { aclResources } from '../../core/authorization/resources';
import { BaseController } from '../../core/base.controller';
import { LikeService } from './like.service';

class LikeController extends BaseController {
  service: LikeService;
  constructor() {
    super({
      name: aclResources.LIKE,
      service: new LikeService(),
      path: '/posts/:postId/likes',
      routes: [
        { method: 'POST', path: '/', handler: 'create' },
        { method: 'GET', path: '/', handler: 'find' },
        { method: 'DELETE', path: '/:id', handler: 'delete' },
      ],
    });
  }

  async create(req, res, next) {
    try {
      await this.authorize(req, 'createAny');
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

  async delete(req, res, next) {
    try {
      await this.authorize(req, 'deleteAny');
      res.send(await this.service.delete(req.params.id, req.account.id));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LikeController;

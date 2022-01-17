import { aclResources } from '../../core/authorization/resources';
import { BaseController } from '../../core/base.controller';
import postService from './post.service';

class PostController extends BaseController {
  constructor() {
    super({
      name: aclResources.POST,
      service: postService,
      path: '/posts',
      routes: [
        { method: 'GET', path: '/', handler: 'find' },
        { method: 'GET', path: '/:id', handler: 'findOne' },
      ],
    });
  }

  async find(req, res, next) {
    try {
      await this.authorize(req, 'readAny');
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
}

module.exports = PostController;

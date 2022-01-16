import { aclResources } from '../../core/authorization/resources';
import { BaseController } from '../../core/base.controller';
import { PostSchema } from './post.schema';
import postService from './post.service';

class PostController extends BaseController {
  constructor() {
    super({
      name: aclResources.POST,
      service: postService,
      path: '/posts',
      routes: [
        { method: 'POST', path: '/', handler: 'create' },
        // { method: 'GET', path: '/', handler: 'find' },
        // { method: 'GET', path: '/:id', handler: 'findOne' },
        // { method: 'PUT', path: '/:id', handler: 'update' },
        // { method: 'DELETE', path: '/:id', handler: 'delete' },
      ],
    });
  }

  async create(req, res, next) {
    try {
      await this.authorize(req, 'createAny');
      this.validate(PostSchema.create, req.body);
      req.body.user = req.account;
      res.send(await this.service.create(req.body));
    } catch (err) {
      next(err);
    }
  }

  // async find(req, res, next) {
  //   try {
  //     await this.authorize(req, 'readAny');
  //     res.send(
  //       await this.service.login(
  //         req.body,
  //         Utils.parseBoolean(req.query.is_fourteen),
  //       ),
  //     );
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // async register(req, res, next) {
  //   try {
  //     await this.authorize(req, 'createAny');
  //     this.validate(PostSchema.register, req.body);
  //     res.send(await this.service.register(req.body));
  //   } catch (err) {
  //     next(err);
  //   }
  // }
}

module.exports = PostController;

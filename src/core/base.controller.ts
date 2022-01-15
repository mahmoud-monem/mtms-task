import _ from 'lodash';
import { authorization } from './authorization';
import { validation } from './validation';

export class BaseController {
  name: string;
  path: string;
  service: any;
  routes: any;
  constructor(config) {
    const { name, path, service, routes } = config;

    this.name = name;
    this.path = path;
    this.service = service;
    this.routes = routes || [];
  }

  async _filterBody(req, res) {
    // Filter response if possible
    const body = _.get(res, 'body');
    const permission = _.get(req._locals, 'permission');

    let path = 'body';
    const bodyDescriptor = _.get(res, 'body._i');
    if (bodyDescriptor) {
      path = `body.${bodyDescriptor.dataPath}`;
      _.unset(res, 'body._i');
    }

    if (body && permission) {
      if (
        permission.attributes.length > 0 &&
        !(
          permission.attributes.length === 1 && permission.attributes[0] === '*'
        )
      ) {
        await authorization.filterByPermission(permission, res, path);
      }
    }
  }

  async beforeAction(req, res, next) {
    // Add resource name to local variables
    _.set(req, '_locals.resource', this.name);

    return next();
  }

  async afterAction(req, res, next) {
    await next();
    this.leanObject(req, res);
    // Filter response body based on user permission (if possible)
    await this._filterBody(req, res);
  }

  leanObject(req, res) {
    res.body = JSON.parse(JSON.stringify(_.get(res, 'body', {})));
  }

  async authorize(req, access, predicate?) {
    const { account, _locals } = req;
    const permission = await authorization.authorize(
      account,
      _locals.resource,
      access,
      predicate,
    );
    _.set(req, '_locals.permission', permission);
    await authorization.filterByPermission(permission, req, 'body');
  }

  validate(schema, data, strict = true) {
    validation.validate(schema, data, strict);
  }
}

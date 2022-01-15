import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { ValidationError } from '../../common/errors';

const ROUTER_METHODS = ['POST', 'PUT', 'PATCH', 'GET', 'DELETE'];
// Controllers
const controllersPath = '../../modules';
const controllersDir = path.join(__dirname, controllersPath);

const controllers = [];
getAllControllersInFolder(controllersDir);

function getAllControllersInFolder(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const controllerPath = path.join(dir, file);
    if (fs.lstatSync(controllerPath).isDirectory()) {
      getAllControllersInFolder(controllerPath);
    } else if (file.includes('controller')) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const controller = require(controllerPath);
      controllers.push(controller);
    }
  });
}

function getActionsFromController(controller) {
  const actions = {};
  const { prototype } = controller.constructor || [];

  Object.getOwnPropertyNames(prototype).forEach((key) => {
    if (key === 'constructor') {
      return;
    }

    actions[key] = prototype[key];
  });

  return actions;
}

function buildControllerRouter(controller) {
  const router = Router();
  const ctrlPath = controller.path;
  const ctrlRoutes = controller.routes;
  const { beforeAction, afterAction } = controller.constructor.prototype;
  const actions = getActionsFromController(controller);
  if (ctrlPath.charAt(0) !== '/') {
    throw new ValidationError(`controller path should start with /`, null);
  }
  ctrlRoutes.forEach((route) => {
    const { method, path, handler } = route;

    if (!ROUTER_METHODS.includes(method)) {
      throw new ValidationError(`Method ${method} is not supported`, null);
    }

    const routerArgs = [
      path,
      afterAction.bind(controller),
      beforeAction.bind(controller),
      actions[handler].bind(controller),
    ];

    router[method.toLowerCase()](...routerArgs);
  });

  return [ctrlPath, router];
}

export function routes() {
  const routes = [];
  const router = Router();
  controllers.forEach((Controller) => {
    const ctrlInstance = new Controller();
    const ctrlRoute = buildControllerRouter(ctrlInstance);
    routes.push(ctrlRoute);
  });

  routes.forEach((route) => {
    router.use(...route);
  });

  return router;
}

import { aclResources } from './resources';
import { ROLES } from './roles';

export const aclRoles = {
  [ROLES.admin]: {
    [aclResources.USER]: {
      'read:any': ['*'],
      'update:any': ['*'],
      'update:own': ['*'],
      'delete:any': ['*'],
    },
    [aclResources.POST]: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    [aclResources.LIKE]: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    [aclResources.COMMENT]: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  },
  [ROLES.user]: {
    [aclResources.USER]: {
      'read:any': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
    [aclResources.POST]: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    [aclResources.LIKE]: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
    [aclResources.COMMENT]: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  },
  [ROLES.public]: {
    [aclResources.AUTH]: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
    },
    [aclResources.ROOT]: {
      'read:any': ['*'],
    },
  },
};

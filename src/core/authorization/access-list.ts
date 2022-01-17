import { aclResources } from './resources';
import { ROLES } from './roles';

export const aclRoles = {
  [ROLES.admin]: {
    [aclResources.USER]: {
      'read:any': ['*', '!password'],
      'read:own': ['*', '!password'],
      'update:own': ['*', '!password', '!email'],
      'delete:any': ['*'],
    },
    [aclResources.USER_POST]: {
      'read:any': ['*'],
      'read:own': ['*'],
      'create:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
    [aclResources.POST]: {
      'read:any': ['*'],
    },
    [aclResources.LIKE]: {
      'create:any': ['*'],
      'read:any': ['*'],
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
      'read:any': ['*', '!password'],
      'read:own': ['*', '!password'],
      'update:own': ['*', '!password', '!email'],
      'delete:own': ['*'],
    },
    [aclResources.USER_POST]: {
      'read:any': ['*'],
      'read:own': ['*'],
      'create:own': ['*'],
      'update:own': ['*'],
      'delete:own': ['*'],
    },
    [aclResources.POST]: {
      'read:any': ['*'],
    },
    [aclResources.LIKE]: {
      'create:any': ['*'],
      'read:any': ['*'],
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

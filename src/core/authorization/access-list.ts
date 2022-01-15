import { aclResources } from './resources';
import { roles } from './roles';

export const aclRoles = {
  [roles.admin]: {},
  [roles.user]: {},
  public: {
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

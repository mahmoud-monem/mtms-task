export const AuthSchema = {
  create: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string', minLength: 6 },
    },
    required: ['username', 'password'],
    additionalProperties: false,
  },
  register: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      birthDate: { type: 'string', format: 'date-time' },
    },
    required: ['email', 'password', 'name', 'birthDate'],
    additionalProperties: false,
  },
};

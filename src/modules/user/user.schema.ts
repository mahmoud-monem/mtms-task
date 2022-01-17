export const UserSchema = {
  update: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      birthDate: { type: 'string', format: 'date-time' },
    },
    required: ['email', 'password', 'name', 'birthDate'],
    additionalProperties: false,
  },
};

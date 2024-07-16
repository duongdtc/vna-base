import { FormLoginType } from '@vna-base/screens/login/type';
import { stringifyObjectValidate } from '@vna-base/utils/string';
import { z } from 'zod';

export const loginValidation = z.object<ZodShape<FormLoginType>>({
  Username: z.string().min(
    1,
    stringifyObjectValidate({
      keyT: 'validation:username_required',
    }),
  ),
  Password: z.string().min(
    1,
    stringifyObjectValidate({
      keyT: 'validation:password_required',
    }),
  ),
});

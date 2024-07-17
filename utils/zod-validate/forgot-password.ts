import { FormForgotPassword } from '@vna-base/screens/forgot-password/type';
import { stringifyObjectValidate } from '@vna-base/utils/string';
import { z } from 'zod';

export const forgotPasswordValidation = z.object<ZodShape<FormForgotPassword>>({
  Email: z.string().email(
    stringifyObjectValidate({
      keyT: 'validation:password_required',
    }),
  ),
});

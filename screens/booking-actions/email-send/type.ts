import { LanguageEmailBooking } from '@vna-base/utils';

export type EmailSendForm = {
  language: LanguageEmailBooking;
  emails: Array<{ value: string }>;
};

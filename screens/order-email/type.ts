import { Currency, EmailType, LanguageSystem, TicketMimeType } from '@vna-base/utils';

export type EmailForm = {
  subject: string;
  emailType: EmailType;
  language: LanguageSystem;
  currency: Currency;

  showFooter: boolean;
  showHeader: boolean;
  showPrice: boolean;
  /**
   * hiển thị booking code
   */
  showPNR: boolean;

  /**
   * các email cách nhau dấu phẩy
   */
  email: string;
  attachETicket: boolean;
  /**
   * default true
   */
  allPassenger: boolean;
  /**
   * default html
   */
  ticketType: TicketMimeType;

  orderId: string;

  bookingIds?: Array<string>;
};

export type ModalSendEmailProps = {
  orderId: string | null | undefined;
};

export type ModalSendEmailRef = {
  show: () => void;
};

import { IconTypes } from '@assets/icon';
import { I18nKeys } from '@translations/locales';

export const MapTitleSection: Record<
  string,
  { t18n: I18nKeys; order: number }
> = {
  BOOKING: { t18n: 'booking_action:booking_action', order: 9 },
  ANCILLARY: { t18n: 'booking_action:additional_services', order: 8 },
  PASSENGER: { t18n: 'booking_action:passenger_manipulation', order: 7 },
  TICKET: { t18n: 'booking_action:ticket_manipulation', order: 6 },
  OTHER: { t18n: 'booking_action:other_operations', order: 5 },
};

export const MapActionIcon: Record<string, IconTypes> = {
  AddBaggage: 'suitcase_outline',
  AddFlight: 'plane_up_fill',
  AddInfant: 'baby_fill',
  MemberUpdate: 'credit_card_outline',
  SeatmapUpdate: 'flight_seat_fill',
  AncillaryUpdate: 'eat_outline',
  BookingCancel: 'close_circle_outline',
  FlightUpdate: 'shuffle_2_outline',
  ChangePassenger: 'person_outline',
  CheckInOnline: 'checkmark_square_2_outline',
  TicketExch: 'flip_2_outline',
  FareRuleGet: 'pantone_outline',
  TicketEMDs: 'external_link_outline',
  BookingRebook: 'arrowhead_left_outline',
  TicketRfnd: 'undo_outline',
  BookingRetrieve: 'folder_outline',
  EmailSend: 'send_mail_outline',
  SendSMS: 'message_square_outline',
  PassengerSplit: 'people_outline',
  SubmitCommand: 'keypad_outline',
  TicketImage: 'ticket_fill',
  UpdateContact: 'edit_2_outline',
  PassengerUpdate: 'book_open_outline',
  UpdateRemark: 'file_text_outline',
  TicketVoid: 'banner_outline',
  History: 'history_outline',
  TicketIssue: 'printer_outline',
  BookingUpdate: 'pricetag_outline',
  PassportUpdate: 'book_open_outline',
};

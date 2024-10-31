import { IconTypes } from '@assets/icon';
import { I18nKeys } from '@translations/locales';

export const MapTitleSection: Record<
  string,
  { t18n: I18nKeys; order: number }
> = {
  BOOKING: { t18n: 'booking_action:booking_action', order: 10 },
  ANCILLARY: { t18n: 'booking_action:additional_services', order: 9 },
  PASSENGER: { t18n: 'booking_action:passenger_manipulation', order: 8 },
  SUPPORTS: { t18n: 'Dịch vụ bổ trợ' as I18nKeys, order: 7 },
  TICKET: { t18n: 'booking_action:ticket_manipulation', order: 6 },
  OTHER: { t18n: 'booking_action:other_operations', order: 5 },
};

export const MapActionIcon: Record<string, IconTypes> = {
  BookingRetrieve: 'refresh_fill',
  BookingUpdate: 'pricetag_outline',
  Rebook: 'arrowhead_left_fill',
  UpdateContact: 'phone_fill',
  UpdateRemark: 'weight_fill',
  UpdateOSI: 'monitor_fill',
  UpdateSK: 'unlock_fill',
  BookingPricing: 'browser_fill',
  SendQueue: 'diagonal_arrow_right_up_fill',
  FlightChange: 'sync_outline',
  BookingCancel: 'close_circle_outline',

  PassengerUpdate: 'person_fill',
  PassengerSplit: 'people_fill',
  MoreBabies: 'baby_fill',
  Membership: 'credit_card_fill',
  PassportUpdate: 'book_open_fill',

  BaggagesAndServices: 'bag_fill',
  Seat: 'seat_fill',
  ServicesSupport: 'eat_fill',

  TicketIssue: 'navigation_2_fill',
  EMDIssue: 'layers_fill',
  OpenNumberTicket: 'printer_fill',
  TicketExch: 'repeat_fill',
  TicketVoid: 'banner_outline',
  TicketRfnd: 'undo_fill',

  CheckInOnline: 'checkmark_circle_2_fill',
  SMSSend: 'message_square_fill',
  EmailSend: 'send_mail_outline',

  // AddBaggage: 'suitcase_outline',
  // AddFlight: 'plane_up_fill',
  // AddInfant: 'baby_fill',
  // MemberUpdate: 'credit_card_outline',
  // SeatmapUpdate: 'flight_seat_fill',
  // AncillaryUpdate: 'eat_outline',
  // FlightUpdate: 'shuffle_2_outline',
  // ChangePassenger: 'person_outline',
  // FareRuleGet: 'pantone_outline',
  // BookingRebook: 'arrowhead_left_outline',
  // EmailSend: 'send_mail_outline',
  // SendSMS: 'message_square_outline',
  // SubmitCommand: 'keypad_outline',
  // TicketImage: 'ticket_fill',
  // History: 'history_outline',
};

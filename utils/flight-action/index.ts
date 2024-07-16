export {};

// import { IconTypes } from '@assets/icon';
// import { APP_SCREEN } from '../navigation/screen-types';

// export enum FlightAction {
//   'BookingRetrieve' = 'BookingRetrieve',
//   'TicketEMDs' = 'TicketEMDs',
//   'BookingRebook' = 'BookingRebook',
//   'TicketVoid' = 'TicketVoid',
//   'BookingCancel' = 'BookingCancel',
//   'EmailSend' = 'EmailSend',
//   'FareRuleGet' = 'FareRuleGet',
//   'AddBaggage' = 'AddBaggage',
//   'SeatmapUpdate' = 'SeatmapUpdate',
//   'ChangePassenger' = 'ChangePassenger',
//   'AncillaryUpdate' = 'AncillaryUpdate',
//   'AddFlight' = 'AddFlight',
//   'FlightUpdate' = 'FlightUpdate',
//   'MemberUpdate' = 'MemberUpdate',
//   'TicketExch' = 'TicketExch',
//   'TicketRfnd' = 'TicketRfnd',
//   'PassengerUpdate' = 'PassengerUpdate',
//   'PassengerSplit' = 'PassengerSplit',
//   'UpdateContact' = 'UpdateContact',
//   'UpdateRemark' = 'UpdateRemark',
//   'CheckInOnline' = 'CheckInOnline',
//   'SendSMS' = 'SendSMS',
//   'TicketImage' = 'TicketImage',
//   'SubmitCommand' = 'SubmitCommand',
//   'AddInfant' = 'AddInfant',
//   'History' = 'History',
//   'TicketIssue' = 'TicketIssue',
//   'BookingUpdate' = 'BookingUpdate',
//   'PassportUpdate' = 'PassportUpdate',
// }

// export const FlightActionDetails: Record<
//   FlightAction,
//   { icon: IconTypes; path?: APP_SCREEN }
// > = {
//   AddBaggage: { icon: 'suitcase_outline' },
//   AddFlight: { icon: 'plane_up_fill' },
//   AddInfant: { icon: 'baby_fill' },
//   MemberUpdate: { icon: 'credit_card_outline' },
//   SeatmapUpdate: { icon: 'flight_seat_fill' },

//   AncillaryUpdate: { icon: 'eat_outline' },
//   BookingCancel: {
//     icon: 'close_circle_outline',
//   },
//   FlightUpdate: { icon: 'shuffle_2_outline' },
//   ChangePassenger: { icon: 'person_outline' },
//   CheckInOnline: { icon: 'checkmark_square_2_outline' },

//   TicketExch: { icon: 'flip_2_outline' },
//   FareRuleGet: { icon: 'pantone_outline' },
//   TicketEMDs: { icon: 'external_link_outline', path: APP_SCREEN.ISSUE_EMD },
//   BookingRebook: { icon: 'arrowhead_left_outline', path: APP_SCREEN.RE_BOOK },
//   TicketRfnd: { icon: 'undo_outline' },

//   BookingRetrieve: { icon: 'folder_outline' },
//   EmailSend: { icon: 'send_mail_outline' },
//   SendSMS: { icon: 'message_square_outline' },
//   PassengerSplit: { icon: 'people_outline' },
//   SubmitCommand: { icon: 'keypad_outline' },

//   TicketImage: { icon: 'ticket_fill' },
//   UpdateContact: { icon: 'edit_2_outline' },
//   PassengerUpdate: { icon: 'book_open_outline' },
//   UpdateRemark: { icon: 'file_text_outline' },
//   TicketVoid: { icon: 'banner_outline', path: APP_SCREEN.VOID_BOOKING },

//   History: { icon: 'history_outline' },
//   TicketIssue: { icon: 'printer_outline', path: APP_SCREEN.ISSUE_TICKET },
//   BookingUpdate: { icon: 'pricetag_outline', path: APP_SCREEN.UPDATE_BOOKING },
//   PassportUpdate: { icon: 'book_open_outline' },
// };

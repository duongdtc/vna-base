import { I18nKeys } from '@translations/locales';

enum TypeRequireEnum {
  SearchFlight = 'SearchFlight',
  Bookings = 'Bookings',
  Ancillaries = 'Ancillaries',
  BookingActions = 'BookingActions',
  SendEmail = 'SendEmail',
  Payment = 'Payment',
}

export type TypeRequire = {
  key: TypeRequireEnum;
  t18n: I18nKeys;
};

export const TypeRequires: Record<TypeRequireEnum, TypeRequire> = {
  [TypeRequireEnum.SearchFlight]: {
    key: TypeRequireEnum.SearchFlight,
    t18n: 'Tìm kiếm chuyến bay' as I18nKeys,
  },
  [TypeRequireEnum.Bookings]: {
    key: TypeRequireEnum.Bookings,
    t18n: 'Đặt booking' as I18nKeys,
  },
  [TypeRequireEnum.Ancillaries]: {
    key: TypeRequireEnum.Ancillaries,
    t18n: 'Đặt dịch vụ/hành lý' as I18nKeys,
  },
  [TypeRequireEnum.BookingActions]: {
    key: TypeRequireEnum.BookingActions,
    t18n: 'Thao tác booking' as I18nKeys,
  },
  [TypeRequireEnum.SendEmail]: {
    key: TypeRequireEnum.SendEmail,
    t18n: 'Gửi email' as I18nKeys,
  },
  [TypeRequireEnum.Payment]: {
    key: TypeRequireEnum.Payment,
    t18n: 'Thanh toán' as I18nKeys,
  },
};

import { I18nKeys } from '@translations/locales';

export enum NumberRoom {
  ZERO = 'ZERO',
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
}

export type NumberRoomDetail = {
  t18n: I18nKeys;
  description?: string;
  key: NumberRoom;
};

export const NumberRoomDetails: Record<NumberRoom, NumberRoomDetail> = {
  [NumberRoom.ZERO]: {
    t18n: 'Không chọn' as I18nKeys,
    key: NumberRoom.ZERO,
  },
  [NumberRoom.ONE]: {
    t18n: '1 phòng' as I18nKeys,
    key: NumberRoom.ONE,
  },
  [NumberRoom.TWO]: {
    t18n: '2 phòng' as I18nKeys,
    key: NumberRoom.TWO,
  },
  [NumberRoom.THREE]: {
    t18n: '3 phòng' as I18nKeys,
    key: NumberRoom.THREE,
  },
  [NumberRoom.FOUR]: {
    t18n: '4 phòng' as I18nKeys,
    key: NumberRoom.FOUR,
  },
  [NumberRoom.FIVE]: {
    t18n: '5 phòng' as I18nKeys,
    key: NumberRoom.FIVE,
  },
};

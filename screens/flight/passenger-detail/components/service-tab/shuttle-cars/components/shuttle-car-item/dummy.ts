import { IconTypes } from '@assets/icon';
import { Colors } from '@theme';
import { I18nKeys } from '@translations/locales';
import { images } from '@vna-base/assets/image';

enum TRIP {
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
}

export type TripDetail = {
  t18n: I18nKeys;
  description: string;
  key: TRIP;
  icon?: IconTypes;
  iconColorTheme?: Colors;
  colorTheme?: Colors;
};

export const TripDetails: Record<TRIP, TripDetail> = {
  [TRIP.ONE]: {
    t18n: 'Nội thành Hà Nội -> Sân bay Nội Bài' as I18nKeys,
    key: TRIP.ONE,
    description: 'Hoàn Kiếm, Ba Đình, Hai Bà Trưng, Tây Hồ',
  },
  [TRIP.TWO]: {
    t18n: 'Nội thành Hà Nội -> Sân bay Nội Bài' as I18nKeys,
    key: TRIP.TWO,
    description: 'Cầu Giấy, Đống Đa, Thanh Xuân, Nam Từ Liêm',
  },
  [TRIP.THREE]: {
    t18n: 'Ngoại thành Hà Nội -> Sân bay Nội Bài' as I18nKeys,
    key: TRIP.THREE,
    description: 'Chương Mỹ, Hà Đông, Đan Phượng, Long Biên',
  },
};

export enum NumberBus {
  ZERO = 'ZERO',
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
  SIX = 'SIX',
  SEVEN = 'SEVEN',
}

export type NumberBusDetail = {
  t18n: I18nKeys;
  description?: string;
  key: NumberBus;
};

export const NumberBusDetails: Record<NumberBus, NumberBusDetail> = {
  [NumberBus.ZERO]: {
    t18n: 'Không chọn' as I18nKeys,
    key: NumberBus.ZERO,
  },
  [NumberBus.ONE]: {
    t18n: '1 xe' as I18nKeys,
    key: NumberBus.ONE,
  },
  [NumberBus.TWO]: {
    t18n: '2 xe' as I18nKeys,
    key: NumberBus.TWO,
  },
  [NumberBus.THREE]: {
    t18n: '3 xe' as I18nKeys,
    key: NumberBus.THREE,
  },
  [NumberBus.FOUR]: {
    t18n: '4 xe' as I18nKeys,
    key: NumberBus.FOUR,
  },
  [NumberBus.FIVE]: {
    t18n: '5 xe' as I18nKeys,
    key: NumberBus.FIVE,
  },
  [NumberBus.SIX]: {
    t18n: '6 xe' as I18nKeys,
    key: NumberBus.SIX,
  },
  [NumberBus.SEVEN]: {
    t18n: '7 xe' as I18nKeys,
    key: NumberBus.SEVEN,
  },
};

export enum Bus {
  ZERO = 'ZERO',
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
}

export type BusDetail = {
  t18n: I18nKeys;
  key: Bus;
  image?: string;
  description?: string | null;
  price?: number;
  capacity?: number;
};

export const BusDetails: Record<Bus, BusDetail> = {
  [Bus.ZERO]: {
    t18n: 'Không chọn' as I18nKeys,
    key: Bus.ZERO,
  },
  [Bus.ONE]: {
    t18n: 'Vinfast VF E34' as I18nKeys,
    key: Bus.ONE,
    image: images.imgCar1,
    capacity: 5,
    description: '• 16.000 VND/km (Dự kiến)',
    price: 190_000,
  },
  [Bus.TWO]: {
    t18n: 'Mai Linh 7 chỗ' as I18nKeys,
    key: Bus.TWO,
    image: images.imgCar2,
    capacity: 7,
    description: '• 16.000 VND/km (Dự kiến)',
    price: 210_000,
  },
  [Bus.THREE]: {
    t18n: 'Vinasun 4 chỗ' as I18nKeys,
    key: Bus.THREE,
    image: images.imgCar3,
    capacity: 16,
    description: '• 16.000 VND/km (Dự kiến)',
    price: 350_000,
  },
};

import { I18nKeys } from '@translations/locales';
import { images } from '@vna-base/assets/image';

export enum HotelEnum {
  ZERO = 'ZERO',
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
  SIX = 'SIX',
}

export type HotelDetail = {
  t18n: I18nKeys;
  key: HotelEnum;
  image?: string;
  description?: string | null;
  price?: number;
  star?: number;
};

export const ListHotelDetails: Record<HotelEnum, HotelDetail> = {
  [HotelEnum.ZERO]: {
    t18n: 'Không chọn' as I18nKeys,
    key: HotelEnum.ZERO,
  },
  [HotelEnum.ONE]: {
    t18n: 'Vinhomes landmark81' as I18nKeys,
    key: HotelEnum.ONE,
    image: images.imgHotel1,
    star: 5,
    description: '1 Đồng Khởi, Bến Nghé, Quận 1, TP.Hồ Chí Minh',
    price: 290_000,
  },
  [HotelEnum.TWO]: {
    t18n: 'Le Saigon Hotel' as I18nKeys,
    key: HotelEnum.TWO,
    image: images.imgHotel2,
    star: 3,
    description: '1 Đồng Khởi, Bến Nghé, Quận 1, TP.Hồ Chí Minh',
    price: 210_000,
  },
  [HotelEnum.THREE]: {
    t18n: 'Alagon City Hotel & Spa' as I18nKeys,
    key: HotelEnum.THREE,
    image: images.imgHotel3,
    star: 3,
    description: '1 Đồng Khởi, Bến Nghé, Quận 1, TP.Hồ Chí Minh',
    price: 220_000,
  },
  [HotelEnum.FOUR]: {
    t18n: 'Hotel Nikko Saigon' as I18nKeys,
    key: HotelEnum.FOUR,
    image: images.imgHotel4,
    star: 4,
    description: '1 Đồng Khởi, Bến Nghé, Quận 1, TP.Hồ Chí Minh',
    price: 300_000,
  },
  [HotelEnum.FIVE]: {
    t18n: 'Alagon City Hotel & Spa' as I18nKeys,
    key: HotelEnum.FIVE,
    image: images.imgHotel5,
    star: 4,
    description: '1 Đồng Khởi, Bến Nghé, Quận 1, TP.Hồ Chí Minh',
    price: 450_000,
  },
  [HotelEnum.SIX]: {
    t18n: 'Bay Hotel Ho Chi Minh' as I18nKeys,
    key: HotelEnum.SIX,
    image: images.imgHotel6,
    star: 5,
    description: '1 Đồng Khởi, Bến Nghé, Quận 1, TP.Hồ Chí Minh',
    price: 550_000,
  },
};

export enum RoomEnum {
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
}

export type RoomDetail = {
  t18n: I18nKeys;
  key: RoomEnum;
  image?: string;
  description1?: string | null;
  description2?: string | null;
  description3?: string | null;
  price?: number;
  people?: string;
  acreage?: string;
};

export const ListRoomDetails: Record<RoomEnum, RoomDetail> = {
  [RoomEnum.ONE]: {
    t18n: 'Phòng Superior 2 giường' as I18nKeys,
    key: RoomEnum.ONE,
    image: images.imgRoom1,
    people: '2 người lớn',
    description1: 'Tầm nhìn hướng thành phố',
    description2: 'Tủ lạnh',
    description3: '',
    price: 290_000,
    acreage: '19.0 m2',
  },
  [RoomEnum.TWO]: {
    t18n: 'Phòng Superior giường đôi' as I18nKeys,
    key: RoomEnum.TWO,
    image: images.imgRoom2,
    people: '3 người lớn',
    description1: 'Tầm nhìn hướng thành phố',
    description2: 'Tủ lạnh',
    description3: '',
    price: 210_000,
    acreage: '19.0 m2',
  },
  [RoomEnum.THREE]: {
    t18n: 'Phòng Deluxe giường đôi' as I18nKeys,
    key: RoomEnum.THREE,
    image: images.imgRoom3,
    people: '2 người lớn',
    description1: 'Tầm nhìn hướng thành phố',
    description2: 'Tủ lạnh',
    description3: 'Có ban công',
    price: 220_000,
    acreage: '19.0 m2',
  },
  [RoomEnum.FOUR]: {
    t18n: 'Phòng Deluxe 2 giường' as I18nKeys,
    key: RoomEnum.FOUR,
    image: images.imgRoom4,
    people: '4 người lớn',
    description1: 'Tầm nhìn hướng thành phố',
    description2: 'Tủ lạnh',
    description3: 'Có ban công',
    price: 300_000,
    acreage: '24.0 m2',
  },
  [RoomEnum.FIVE]: {
    t18n: 'Phòng Deluxe 3 người' as I18nKeys,
    key: RoomEnum.FIVE,
    image: images.imgRoom5,
    people: '3 người lớn',
    description1: 'Tầm nhìn hướng thành phố',
    description2: 'Tủ lạnh',
    description3: 'Có ban công',
    price: 450_000,
    acreage: '24.0 m2',
  },
};

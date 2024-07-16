import i18n from '@vna-base/translations/i18n';
import { I18nKeys } from '@vna-base/translations/locales';
import { translate } from '@vna-base/translations/translate';
import { PassengerType } from '@vna-base/utils/constant';
import dayjs, { Dayjs } from 'dayjs';

export const getNameDay = (order: number) => {
  let temp: I18nKeys | undefined;
  switch (order) {
    case 1:
      temp = 'common:monday';
      break;
    case 2:
      temp = 'common:tuesday';
      break;
    case 3:
      temp = 'common:wednesday';
      break;
    case 4:
      temp = 'common:thursday';
      break;
    case 5:
      temp = 'common:friday';
      break;
    case 6:
      temp = 'common:saturday';
      break;

    default:
      temp = 'common:sunday';
      break;
  }

  return translate(temp);
};

export const getMonthName = (order: number) => {
  const isVi = i18n.language === 'vi';
  let temp = '';
  switch (order) {
    case 1:
      temp = isVi ? 'Tháng 2' : 'February';
      break;
    case 2:
      temp = isVi ? 'Tháng 3' : 'March';
      break;
    case 3:
      temp = isVi ? 'Tháng 4' : 'April';
      break;
    case 4:
      temp = isVi ? 'Tháng 5' : 'May';
      break;
    case 5:
      temp = isVi ? 'Tháng 6' : 'June';
      break;
    case 6:
      temp = isVi ? 'Tháng 7' : 'July';
      break;
    case 7:
      temp = isVi ? 'Tháng 8' : 'August';
      break;
    case 8:
      temp = isVi ? 'Tháng 9' : 'September';
      break;
    case 9:
      temp = isVi ? 'Tháng 10' : 'October';
      break;
    case 10:
      temp = isVi ? 'Tháng 11' : 'November';
      break;
    case 11:
      temp = isVi ? 'Tháng 12' : 'December';
      break;

    default:
      temp = isVi ? 'Tháng 1' : 'January';
      break;
  }

  return temp;
};

export function getDateTimeOfFlightOption(params?: string | null) {
  if (!params) {
    return null;
  }

  const dateTime = params.split(' ');
  const date = `${dateTime[0].slice(0, 2)}/${dateTime[0].slice(
    2,
    4,
  )}/${dateTime[0].slice(4, 8)}`;
  const onlyDate = `${dateTime[0].slice(0, 2)}/${dateTime[0].slice(2, 4)}`;
  const time = `${dateTime[1].slice(0, 2)}:${dateTime[1].slice(2, 4)}`;
  return { date, time, onlyDate };
}

// đổi từ phút ra giờ trong duration
export function convertMin2Hour(minutes: number) {
  if (minutes <= 0) {
    return '';
  }

  // const days = Math.floor(minutes / 1440);
  // const remainingMinutes = minutes % 1440;

  const hours = Math.floor(minutes / 60);
  const finalMinutes = minutes % 60;

  // if (days === 0) {
  //   return translate('common:hour_minute', {
  //     h: hours,
  //     m: finalMinutes,
  //   });
  // }

  if (hours === 0) {
    return translate('common:day_minute', {
      m: finalMinutes,
    });
  }

  if (finalMinutes === 0) {
    return translate('common:day_hour', {
      h: hours,
    });
  }

  return translate('common:hour_minute', {
    h: hours,
    m: finalMinutes,
  });

  // return translate('common:day_hour_minute', {
  //   d: days,
  //   h: hours,
  //   m: finalMinutes,
  // });
}

/**
 * sử dụng trong slider, độ chia nhỏ nhất là 0.5h
 */
export function convertHalf2Hour(num: number) {
  const hour = Math.floor(num / 2);
  const remainingMinutes = num % 2;

  return `${('0' + hour).slice(-2)}:${remainingMinutes === 0 ? '00' : '30'}`;
}

export function getMaxMinPassengerBirthday(
  type: PassengerType,
  departureDateOfFinalFlight: Dayjs,
) {
  // const currentDate = dayjs();
  let minDate;
  let maxDate;

  switch (type) {
    case PassengerType.ADT:
      minDate = departureDateOfFinalFlight.subtract(108, 'year'); // Người lớn từ 12 tuổi trở lên (giả sử tối đa 108 tuổi)
      maxDate = departureDateOfFinalFlight.subtract(12, 'year'); // Người lớn từ 12 tuổi trở lên
      break;

    case PassengerType.CHD:
      minDate = departureDateOfFinalFlight.subtract(12, 'year').add(1, 'day'); // Trẻ em từ 2 tuổi tới dưới 12 tuổi
      maxDate = departureDateOfFinalFlight.subtract(2, 'year'); // Trẻ em từ 2 tuổi tới dưới 12 tuổi
      break;

    case PassengerType.INF:
      minDate = departureDateOfFinalFlight.subtract(2, 'year').add(1, 'day'); // Trẻ sơ sinh nhỏ hơn 2 tuổi
      maxDate = dayjs().subtract(7, 'day'); // Trẻ sơ sinh nhỏ hơn 2 tuổi
      break;
  }

  return { maxDate: maxDate.toDate(), minDate: minDate.toDate() };
}

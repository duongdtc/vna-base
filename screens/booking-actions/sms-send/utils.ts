/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Booking } from '@services/axios/axios-data';
import { AirlineRealm, AirportRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { getFullNameOfPassenger } from '@vna-base/utils';
import dayjs from 'dayjs';
import { LanguageType } from './type';

function getAirportName(airportCode: string, lng: 'vi' | 'en' = 'vi') {
  return realmRef.current?.objectForPrimaryKey<AirportRealm>(
    AirportRealm.schema.name,
    airportCode,
  )?.[lng === 'vi' ? 'NameVi' : 'NameEn'];
}

export function genContent(
  bookingDetail: Booking,
  languageType: LanguageType = LanguageType.VI,
) {
  const airline = realmRef.current?.objectForPrimaryKey<AirlineRealm>(
    AirlineRealm.schema.name,
    bookingDetail.Airline as string,
  )?.NameVi;

  if (languageType === LanguageType.EN) {
    return `Booking code: ${
      bookingDetail.BookingCode ?? 'N/A'
    } - ${airline}\n${bookingDetail.Passengers?.reduce(
      (total, currPassenger, currIdx) =>
        total +
        (currIdx + 1) +
        '. ' +
        getFullNameOfPassenger(currPassenger, false, false, LanguageType.EN) +
        '\n',
      '',
    )}Flight Information:\n${bookingDetail.Flights?.reduce(
      (total, currFj) =>
        total +
        currFj.Segments?.reduce(
          (subTotal, currSeg) =>
            subTotal +
            '*' +
            currSeg.Airline +
            currSeg.FlightNumber +
            ' from ' +
            `${getAirportName(currSeg.StartPoint!, 'en')} (${
              currSeg.StartPoint
            })` +
            ' to ' +
            `${getAirportName(currSeg.EndPoint!, 'en')} (${currSeg.EndPoint})` +
            ' at ' +
            dayjs(currSeg.DepartDate)
              .locale('en')
              .format('HH:mm on DD MMM YYYY') +
            '\n' +
            '     Carry-on baggage: ' +
            (bookingDetail.FareInfos?.find(
              ffi => ffi.SegmentId === currSeg.SegmentId,
            )?.HandBaggage?.replace('1 piece x ', '') ?? 0) +
            '\n',
          '',
        ),
      '',
    )}Please bring necessary identity documents and available at check-in counter at least 90 minutes before departure.`;
  } else {
    const viWithAccent = `Mã đặt chỗ: ${
      bookingDetail.BookingCode ?? 'N/A'
    } - ${airline}\n${bookingDetail.Passengers?.reduce(
      (total, currPassenger, currIdx) =>
        total +
        (currIdx + 1) +
        '. ' +
        getFullNameOfPassenger(currPassenger, false, false) +
        '\n',
      '',
    )}Chuyến bay:\n${bookingDetail.Flights?.reduce(
      (total, currFj) =>
        total +
        currFj.Segments?.reduce(
          (subTotal, currSeg) =>
            subTotal +
            '*' +
            currSeg.Airline +
            currSeg.FlightNumber +
            ' từ ' +
            `${getAirportName(currSeg.StartPoint!)} (${currSeg.StartPoint})` +
            ' đi ' +
            `${getAirportName(currSeg.EndPoint!)} (${currSeg.EndPoint})` +
            ' lúc ' +
            dayjs(currSeg.DepartDate).format('HH:mm ngày DD MMM YYYY') +
            '\n' +
            '     Hành lý xách tay: ' +
            (bookingDetail.FareInfos?.find(
              ffi => ffi.SegmentId === currSeg.SegmentId,
            )?.HandBaggage?.replace('1 piece x ', '') ?? 0) +
            '\n',
          '',
        ),
      '',
    )}Quý khách mang theo Giấy tờ tùy thân bản chính hợp lệ và có mặt tại quầy trước 90 phút để làm thủ tục.`;

    if (languageType === LanguageType.VI_WITHOUT_ACC) {
      return viWithAccent.removeAccent();
    }

    return viWithAccent;
  }
}

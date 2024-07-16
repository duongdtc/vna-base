/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block, Text } from '@vna-base/components';
import { selectViewingBookingId } from '@redux-selector';
import { Ancillary, Passenger } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { ColorLight } from '@theme/color';
import { FontStyle } from '@theme/typography';
import {
  ANCILLARY_TYPE,
  BookingStatus,
  Gender,
  PassengerType,
  TicketType,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

export const BookingView = () => {
  const bookingId = useSelector(selectViewingBookingId);

  const bookingDetail = useObject<BookingRealm>(
    BookingRealm.schema.name,
    bookingId!,
  );

  const num = useRef(1);

  const idxServiceCode: Record<string, number> = {};

  const PreSeats: Array<Ancillary & Pick<Passenger, 'Surname' | 'GivenName'>> =
    [];

  const Baggages: Array<Ancillary & Pick<Passenger, 'Surname' | 'GivenName'>> =
    [];

  const Services: Array<Ancillary & Pick<Passenger, 'Surname' | 'GivenName'>> =
    [];

  const Airlines: Array<string> = [];

  bookingDetail?.Ancillaries.forEach((anci: Ancillary) => {
    const pax = bookingDetail.Passengers.find(p => p.Id === anci.PassengerId);

    switch (anci.Type) {
      case ANCILLARY_TYPE.PRESEAT:
        PreSeats.push({
          ...anci,
          ...(pax ?? {}),
        });

        break;

      case ANCILLARY_TYPE.BAGGAGE:
        Baggages.push({
          ...anci,
          ...(pax ?? {}),
        });

        break;

      default:
        Services.push({
          ...anci,
          ...(pax ?? {}),
        });

        break;
    }
  });

  const Passengers =
    bookingDetail?.Passengers?.map(p => p).sort(
      (a, b) => (a.Index ?? 0) - (b.Index ?? 0),
    ) ?? [];

  const Infants = Passengers.filter(p => p.PaxType === PassengerType.INF);

  const Children = Passengers.filter(p => p.PaxType === PassengerType.CHD);

  const Flights =
    bookingDetail?.Flights.flatMap(fl =>
      fl.Segments.map(sgm => {
        const idx = Airlines.findIndex(al => al === sgm.Airline);
        if (idx === -1) {
          Airlines.push(sgm.Airline ?? '');
        }

        return sgm;
      }),
    ) ?? [];

  const getIndexOfSegment = ({
    startPoint,
    endPoint,
    multi,
  }: {
    startPoint: string | null | undefined;
    endPoint: string | null | undefined;
    /**
     * nếu là true thì tìm những segment thuộc chuyến bay đó, trả về dạng 3-4
     */
    multi?: boolean;
  }) => {
    if (multi) {
      const flIdx = bookingDetail?.Flights.findIndex(
        fl =>
          (fl.StartPoint === startPoint && fl.EndPoint === endPoint) ||
          (fl.StartPoint === startPoint && !endPoint),
      );

      if (flIdx !== undefined && flIdx !== -1) {
        return bookingDetail?.Flights[flIdx].Segments.reduce(
          (total, _, currIdx) =>
            (currIdx !== 0 ? '-' : '') +
            total +
            (currIdx + flIdx + 1 + Passengers.length),
          '',
        );
      }

      return '';
    }

    return (
      Passengers.length +
      1 +
      Flights.findIndex(
        fl =>
          (fl.StartPoint === startPoint && fl.EndPoint === endPoint) ||
          (fl.StartPoint === startPoint && !endPoint),
      )
    );
  };

  return (
    <Block rowGap={2}>
      {/* hành khách */}
      <>
        {Passengers.map((px, idx) => (
          <Text
            key={idx}
            style={styles.txt}
            text={`${num.current < 10 ? num.current++ + ' ' : num.current++} ${
              px.Surname
            }/${px.GivenName} ${px.Title}(${px.PaxType}${
              px.BirthDate
                ? '/' + dayjs(px.BirthDate).locale('en').format('DDMMMYY')
                : ''
            })`.toUpperCase()}
          />
        ))}
      </>

      {/* Chuyến bay */}
      <>
        {Flights.map((fl, idx) => (
          <Text
            key={idx}
            style={styles.txt}
            text={`${num.current < 10 ? num.current++ + ' ' : num.current++} ${
              fl.Airline
            } ${fl.FlightNumber} ${fl?.FareClass} ${dayjs(fl.DepartDate)
              .locale('en')
              .format('DDMMM')} ${fl.StartPoint}${fl.EndPoint} HK2   ${dayjs(
              fl.DepartDate,
            ).format('HHmm')} ${dayjs(fl.ArriveDate).format(
              'HHmm',
            )}`.toUpperCase()}
          />
        ))}
      </>

      {/* Số điện thoại */}
      <>
        <Text
          style={styles.txt}
          text={`${
            num.current < 10 ? num.current++ + ' ' : num.current++
          } APM ${bookingDetail?.ContactPhone}`.toUpperCase()}
        />
      </>

      {/* liên hệ */}
      <>
        <Text
          style={styles.txt}
          text={`${
            num.current < 10 ? num.current++ + ' ' : num.current++
          } SSR CTCE ${
            bookingDetail?.Airline
          } HK1 ${bookingDetail?.ContactEmail?.replaceAll(
            '@',
            '//',
          )}`.toUpperCase()}
        />
      </>

      {/* time limit */}
      <>
        {bookingDetail?.ExpirationDate &&
          bookingDetail?.BookingStatus !== BookingStatus.TICKETED && (
            <Text
              style={styles.txt}
              text={`${
                num.current < 10 ? num.current++ + ' ' : num.current++
              } TIMELIMIT ${dayjs(bookingDetail?.ExpirationDate)
                .locale('en')
                .format('DDMMMYY HH:mm')}`.toUpperCase()}
            />
          )}
      </>

      {/* Ticket */}
      <>
        {bookingDetail?.Tickets &&
          bookingDetail.Tickets.length > 0 &&
          bookingDetail?.BookingStatus === BookingStatus.TICKETED &&
          bookingDetail.Tickets.map((tk, idx) =>
            tk.TicketType === TicketType.EMD ? (
              <Text
                key={idx}
                style={styles.txt}
                text={`${
                  num.current < 10 ? num.current++ + ' ' : num.current++
                } FA PAX ${tk.TicketNumber}/EMD/${tk.Currency}${
                  tk.Total
                }/${dayjs(tk.IssueDate).locale('en').format('DDMMMYY')}/E${
                  idxServiceCode[tk.ServiceCode ?? ''] ?? ''
                }`.toUpperCase()}
              />
            ) : (
              <Text
                key={idx}
                style={styles.txt}
                text={`${
                  num.current < 10 ? num.current++ + ' ' : num.current++
                } FA PAX ${tk.TicketNumber}/ET/${dayjs(tk.IssueDate)
                  .locale('en')
                  .format('DDMMMYY')}/S${getIndexOfSegment({
                  startPoint: tk.StartPoint,
                  endPoint: tk.EndPoint,
                  multi: true,
                })}/P${
                  1 + Passengers.findIndex(px => px.Id === tk.PassengerId)
                }`.toUpperCase()}
              />
            ),
          )}
      </>

      {/* Thẻ khách hàng thường xuyên */}
      <>
        {Passengers.map(
          (px, idx) =>
            px.Membership && (
              <Text
                key={idx}
                style={styles.txt}
                text={`${
                  num.current < 10 ? num.current++ + ' ' : num.current++
                } SSR FQTV ${bookingDetail?.Airline} HK1 ${px.Membership}/P${
                  idx + 1
                }`.toUpperCase()}
              />
            ),
        )}
      </>

      {/* Ghế ngồi */}
      <>
        {PreSeats.map((pre, idx) => {
          idxServiceCode[pre.Code!] = num.current + 1;
          return (
            <Text
              key={idx}
              style={styles.txt}
              text={`${
                num.current < 10 ? num.current++ + ' ' : num.current++
              } SSR RQST ${pre.Airline} HK1 ${pre.StartPoint}${pre.EndPoint}/${
                pre.Value
              }/P${
                Passengers.findIndex(px => px.Id === pre.PassengerId) + 1
              }`.toUpperCase()}
            />
          );
        })}
      </>

      {/* trẻ sơ sinh*/}
      <>
        {Infants.map((inf, idx) =>
          Flights.map((fl, flIdx) => (
            <Text
              key={`${idx}_${flIdx}`}
              style={styles.txt}
              text={`${
                num.current < 10 ? num.current++ + ' ' : num.current++
              } SSR INFT ${
                fl.Airline
              } HK1 ${inf.Surname?.removeSpace()}/${inf.GivenName?.removeSpace()}${
                inf.Title
              } ${dayjs(inf.BirthDate)
                .locale('en')
                .format('DDMMMYY')}/S${getIndexOfSegment({
                startPoint: fl.StartPoint,
                endPoint: fl.EndPoint,
              })}/P${1 + idx}`.toUpperCase()}
            />
          )),
        )}
      </>

      {/* trẻ em*/}
      <>
        {Children.map((chd, idx) =>
          Airlines.map((al, alIdx) => (
            <Text
              key={`${idx}_${alIdx}`}
              style={styles.txt}
              text={`${
                num.current < 10 ? num.current++ + ' ' : num.current++
              } SSR CHD ${al} HK1 ${dayjs(chd.BirthDate)
                .locale('en')
                .format('DDMMMYY')}/P${
                1 + Passengers.findIndex(px => px.Id === chd.Id)
              }`.toUpperCase()}
            />
          )),
        )}
      </>

      {/* Số passport */}
      <>
        {Passengers.map((px, idx) =>
          Airlines.map(
            (al, alIdx) =>
              px.IssueCountry && (
                <Text
                  key={`${idx}_${alIdx}`}
                  style={styles.txt}
                  text={`${
                    num.current < 10 ? num.current++ + ' ' : num.current++
                  } SSR DOCS ${al} HK1 P/${px.IssueCountry}/${
                    px.DocumentNumb
                  }/${px.Nationality}/${
                    px.BirthDate
                      ? dayjs(px.BirthDate).locale('en').format('DDMMMYY')
                      : ''
                  }/${px.Gender === Gender.Female ? 'FI' : 'M'}${
                    px.DocumentExpiry
                      ? '/' +
                        dayjs(px.DocumentExpiry).locale('en').format('DDMMMYY')
                      : ''
                  }/${px.Surname}/${px.GivenName?.removeSpace()}/P${
                    1 + Passengers.findIndex(pas => pas.Id === px.Id)
                  }`.toUpperCase()}
                />
              ),
          ),
        )}
      </>

      {/* Hành lý*/}
      <>
        {Baggages.map((bag, idx) => {
          idxServiceCode[bag.Code!] = num.current + 1;

          return (
            <Text
              key={idx}
              style={styles.txt}
              text={`${
                num.current < 10 ? num.current++ + ' ' : num.current++
              } SSR ${(bag.Name ?? bag.Value)?.trim()} ${
                bag.Airline
              } HK1/S${getIndexOfSegment({
                startPoint: bag.StartPoint,
                endPoint: bag.EndPoint,
              })}/P${
                1 + Passengers.findIndex(pas => pas.Id === bag.PassengerId)
              }`.toUpperCase()}
            />
          );
        })}
      </>

      {/* Dịch vụ*/}
      <>
        {Services.map((ser, idx) => {
          idxServiceCode[ser.Code!] = num.current + 1;
          return (
            <Text
              key={idx}
              style={styles.txt}
              text={`${
                num.current < 10 ? num.current++ + ' ' : num.current++
              } SSR ${(ser?.Name ?? ser.Value)?.trim()} ${
                ser.Airline
              } HK1/S${getIndexOfSegment({
                startPoint: ser.StartPoint,
                endPoint: ser.EndPoint,
              })}/P${
                1 + Passengers.findIndex(pas => pas.Id === ser.PassengerId)
              }`.toUpperCase()}
            />
          );
        })}
      </>
    </Block>
  );
};

const styles = StyleSheet.create({
  txt: {
    ...FontStyle.Body10SemiMono,
    color: ColorLight.classicWhite,
  },
});

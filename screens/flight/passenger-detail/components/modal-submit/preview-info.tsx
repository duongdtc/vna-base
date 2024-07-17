/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block, Text } from '@vna-base/components';
import { DEFAULT_CURRENCY } from '@env';
import { selectCustomFeeTotal } from '@vna-base/redux/selector';
import { Passenger, PassengerForm } from '@vna-base/screens/flight/type';
import { Ancillary, Seat, Segment } from '@services/axios/axios-ibe';
import { CountryRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import {
  getFlightNumber,
  getFullNameOfPassenger,
  getPassengerTitle,
  removeLeadingZero,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import isEmpty from 'lodash.isempty';
import React from 'react';
import { useSelector } from 'react-redux';
import { calculateTotalPrice } from '../../utils';

export const PreviewInfo = ({ form }: { form: PassengerForm }) => {
  const { Total } = useSelector(selectCustomFeeTotal);

  const dialCode = realmRef.current?.objectForPrimaryKey<CountryRealm>(
    CountryRealm.schema.name,
    form.ContactInfo.CountryCode,
  )?.DialCode;

  let PreSeats: Array<
    | Seat &
        Pick<Passenger, 'Surname' | 'FullName' | 'GivenName'> &
        Pick<Segment, 'StartPoint' | 'EndPoint' | 'Airline'>
  > = [];

  let Baggages: Array<
    Ancillary & Pick<Passenger, 'Surname' | 'FullName' | 'GivenName'>
  > = [];

  let Services: Array<
    Ancillary & Pick<Passenger, 'Surname' | 'FullName' | 'GivenName'>
  > = [];

  form.Passengers.forEach(passenger => {
    passenger.PreSeats.forEach((preS, idxFlight) => {
      PreSeats = PreSeats.concat(
        preS
          .map((pre, idxSegment) => ({
            ...pre,
            Surname: passenger.Surname,
            FullName: passenger.FullName,
            GivenName: passenger.GivenName,
            StartPoint:
              form.FLights[idxFlight].ListSegment![idxSegment].StartPoint,
            EndPoint: form.FLights[idxFlight].ListSegment![idxSegment].EndPoint,
            Airline: form.FLights[idxFlight].ListSegment![idxSegment].Airline,
          }))
          .filter(pre => !isEmpty(pre)),
      );
    });

    Baggages = Baggages.concat(
      passenger.Baggages.filter(bg => !isEmpty(bg)).map(bg => ({
        ...bg,
        Surname: passenger.Surname,
        FullName: passenger.FullName,
        GivenName: passenger.GivenName,
      })),
    );

    passenger.Services.forEach((serviceFl, idxFlight) => {
      serviceFl.forEach((services, idxSegment) => {
        Services = Services.concat(
          services
            .filter(sv => !isEmpty(sv))
            .map(sv => ({
              ...sv,
              Surname: passenger.Surname,
              FullName: passenger.FullName,
              GivenName: passenger.GivenName,
              StartPoint:
                form.FLights[idxFlight].ListSegment![idxSegment].StartPoint,
              EndPoint:
                form.FLights[idxFlight].ListSegment![idxSegment].EndPoint,
            })),
        );
      });
    });
  });

  //******* Tính tổng giá tiền ************
  const services: Array<any> = [];
  services.push(form.SplitFullName);

  form.Passengers.forEach((_, currPassengerIndex) => {
    services.push(form.Passengers[currPassengerIndex].FullName);
    services.push(form.Passengers[currPassengerIndex].GivenName);
    services.push(form.Passengers[currPassengerIndex].Surname);
    services.push(form.Passengers[currPassengerIndex].PreSeats);
    services.push(form.Passengers[currPassengerIndex].Baggages);
    services.push(form.Passengers[currPassengerIndex].Services);
  });

  const total = calculateTotalPrice(
    services,
    form.Passengers.length,
    form.TotalFareFlight,
  );

  return (
    <Block rowGap={10}>
      {/* Hành khách */}
      <Block>
        <Text text="PASSENGERS" fontStyle="Body10RegMono" colorTheme="white" />
        <Block flexDirection="row" columnGap={8}>
          {/* Số thứ tự */}
          <Block>
            {form.Passengers.map((_, idx) => (
              <Text
                key={idx}
                text={`${idx + 1}.`}
                fontStyle="Body10RegMono"
                colorTheme="white"
              />
            ))}
          </Block>

          {/* Tên hành khách*/}
          <Block flexShrink={1}>
            {form.Passengers.map((passenger, idx) => (
              <Text
                numberOfLines={1}
                ellipsizeMode="middle"
                key={idx}
                text={(passenger.FullName !== ''
                  ? passenger.FullName
                  : `${passenger.Surname}/${passenger.GivenName}`
                ).toUpperCase()}
                fontStyle="Body10RegMono"
                colorTheme="white"
              />
            ))}
          </Block>

          {/* Loại khách */}
          <Block>
            {form.Passengers.map((passenger, idx) => (
              <Text
                key={idx}
                text={getPassengerTitle({
                  type: passenger.Type,
                  gender: passenger.Gender,
                }).toUpperCase()}
                fontStyle="Body10RegMono"
                colorTheme="white"
              />
            ))}
          </Block>

          {/* Ngày sinh */}
          <Block>
            {form.Passengers.map((passenger, idx) => (
              <Text
                key={idx}
                text={
                  passenger.Birthday
                    ? dayjs(passenger.Birthday).format('DD/MM/YYYY')
                    : ' '
                }
                fontStyle="Body10RegMono"
                colorTheme="white"
              />
            ))}
          </Block>
        </Block>
      </Block>

      {/* Chuyến bay */}
      <Block>
        <Text text="FLIGHTS" fontStyle="Body10RegMono" colorTheme="white" />
        <Block flexDirection="row" columnGap={8}>
          {/* Số thứ tự */}
          <Block>
            {form.FLights.map((_, idx) => (
              <Text
                key={idx}
                text={idx + 1 + '.'}
                fontStyle="Body10RegMono"
                colorTheme="white"
              />
            ))}
          </Block>

          {/* hãng bay
          <Block>
            {form.FLights.map((flight, idx) => (
              <Text
                key={idx}
                text={flight.System?.toUpperCase()}
                fontStyle="Body10RegMono"
                colorTheme="white"
              />
            ))}
          </Block>
          */}

          {/* số hiệu chuyến bay */}
          <Block>
            {form.FLights.map((flight, idx) => (
              <Text
                key={idx}
                text={getFlightNumber(
                  flight.Airline,
                  flight.FlightNumber,
                ).toUpperCase()}
                fontStyle="Body10RegMono"
                colorTheme="white"
              />
            ))}
          </Block>

          {/* Hạng vé */}
          <Block>
            {form.FLights.map((flight, idx) => (
              <Text
                key={idx}
                text={flight.FareOption!.ListFarePax![0].ListFareInfo![0].FareClass!.toUpperCase()}
                fontStyle="Body10RegMono"
                colorTheme="white"
              />
            ))}
          </Block>

          {/* route */}
          <Block>
            {form.FLights.map((flight, idx) => (
              <Text
                key={idx}
                text={`${flight.StartPoint}${flight.EndPoint}`.toUpperCase()}
                fontStyle="Body10RegMono"
                colorTheme="white"
              />
            ))}
          </Block>

          {/* Ngày khởi hành */}
          <Block>
            {form.FLights.map((flight, idx) => (
              <Text
                key={idx}
                text={dayjs(flight.DepartDate, 'DDMMYYYY HHmm')
                  .format('DD/MM/YYYY')
                  .toUpperCase()}
                fontStyle="Body10RegMono"
                colorTheme="white"
              />
            ))}
          </Block>

          {/* Giờ đi */}
          <Block>
            {form.FLights.map((flight, idx) => (
              <Text
                key={idx}
                text={dayjs(flight.DepartDate).format('HH:mm').toUpperCase()}
                fontStyle="Body10RegMono"
                colorTheme="white"
              />
            ))}
          </Block>

          {/* Giờ đến */}
          <Block>
            {form.FLights.map((flight, idx) => (
              <Text
                key={idx}
                text={dayjs(flight.ArriveDate).format('HH:mm').toUpperCase()}
                fontStyle="Body10RegMono"
                colorTheme="white"
              />
            ))}
          </Block>
        </Block>
      </Block>

      {/* Hành lý */}
      {Baggages.length > 0 && (
        <Block>
          <Text text="BAGGAGES" fontStyle="Body10RegMono" colorTheme="white" />
          {Baggages.map((baggage, idx) => (
            <Block key={idx}>
              <Block flexDirection="row">
                {/* index */}
                <Text
                  text={`${idx + 1}. `}
                  fontStyle="Body10RegMono"
                  colorTheme="white"
                />
                {/* tên gói hàng */}
                <Block flex={1}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="clip"
                    text={`${baggage.Name?.trim().toUpperCase()}...................................................`}
                    fontStyle="Body10RegMono"
                    colorTheme="white"
                  />
                </Block>
                <Text text="..." fontStyle="Body10RegMono" colorTheme="white" />

                {/* giá */}
                <Text
                  text={baggage.Price?.currencyFormat().toUpperCase()}
                  fontStyle="Body10RegMono"
                  colorTheme="white"
                />
              </Block>
              <Block flexDirection="row">
                <Text
                  text={'   '}
                  fontStyle="Body10RegMono"
                  colorTheme="white"
                />
                {/* Tên hành khách */}
                <Block flex={1}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="middle"
                    text={(baggage.FullName !== ''
                      ? baggage.FullName
                      : getFullNameOfPassenger({
                          Surname: baggage.Surname,
                          GivenName: baggage.GivenName,
                        } as Passenger)
                    ).toUpperCase()}
                    fontStyle="Body10RegMono"
                    colorTheme="white"
                  />
                </Block>
                {/* route */}
                <Text
                  text={`${baggage.StartPoint}${baggage.EndPoint}`.toUpperCase()}
                  fontStyle="Body10RegMono"
                  colorTheme="white"
                />
              </Block>
            </Block>
          ))}
        </Block>
      )}

      {/* Chỗ ngồi */}
      {PreSeats.length > 0 && (
        <Block>
          <Text text="PRESEATS" fontStyle="Body10RegMono" colorTheme="white" />
          {PreSeats.map((preSeat, idx) =>
            preSeat.SeatNumber ? (
              <Block key={idx}>
                <Block flexDirection="row">
                  {/* index */}
                  <Text
                    text={`${idx + 1}. `}
                    fontStyle="Body10RegMono"
                    colorTheme="white"
                  />

                  {/* Số ghế */}
                  <Block flex={1}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="clip"
                      text={`${preSeat.SeatNumber}......................................................`}
                      fontStyle="Body10RegMono"
                      colorTheme="white"
                    />
                  </Block>
                  <Text
                    text="..."
                    fontStyle="Body10RegMono"
                    colorTheme="white"
                  />
                  {/* giá */}
                  <Text
                    text={preSeat.Price?.currencyFormat().toUpperCase()}
                    fontStyle="Body10RegMono"
                    colorTheme="white"
                  />
                </Block>
                <Block flexDirection="row">
                  <Text
                    text={'   '}
                    fontStyle="Body10RegMono"
                    colorTheme="white"
                  />
                  {/* Tên hành khách */}
                  <Block flex={1}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="middle"
                      text={(preSeat.FullName !== ''
                        ? preSeat.FullName
                        : getFullNameOfPassenger({
                            Surname: preSeat.Surname,
                            GivenName: preSeat.GivenName,
                          } as Passenger)
                      ).toUpperCase()}
                      fontStyle="Body10RegMono"
                      colorTheme="white"
                    />
                  </Block>
                  {/* hãng bay */}
                  <Text
                    text={`${preSeat.Airline?.toUpperCase()} `}
                    fontStyle="Body10RegMono"
                    colorTheme="white"
                  />

                  {/* route */}
                  <Text
                    text={`${preSeat.StartPoint}${preSeat.EndPoint}`.toUpperCase()}
                    fontStyle="Body10RegMono"
                    colorTheme="white"
                  />
                </Block>
              </Block>
            ) : null,
          )}
        </Block>
      )}

      {/* Dịch vụ */}
      {Services.length > 0 && (
        <Block>
          <Text text="SERVICES" fontStyle="Body10RegMono" colorTheme="white" />
          {Services.map((service, idx) => (
            <Block key={idx}>
              <Block flexDirection="row">
                {/* index */}
                <Text
                  text={`${idx + 1}. `}
                  fontStyle="Body10RegMono"
                  colorTheme="white"
                />
                <Block flex={1}>
                  <Text
                    text={`${
                      service.Description ?? service.Name
                    }.....................................................`}
                    fontStyle="Body10RegMono"
                    colorTheme="white"
                    numberOfLines={1}
                    ellipsizeMode="clip"
                  />
                </Block>
                <Text text="..." fontStyle="Body10RegMono" colorTheme="white" />
                {/* giá */}
                <Text
                  text={service.Price?.currencyFormat().toUpperCase()}
                  fontStyle="Body10RegMono"
                  colorTheme="white"
                />
              </Block>
              <Block flexDirection="row">
                <Text
                  text={'   '}
                  fontStyle="Body10RegMono"
                  colorTheme="white"
                />

                {/* Tên hành khách */}
                <Block flex={1}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="middle"
                    text={(service.FullName !== ''
                      ? service.FullName
                      : getFullNameOfPassenger({
                          Surname: service.Surname,
                          GivenName: service.GivenName,
                        } as Passenger)
                    ).toUpperCase()}
                    fontStyle="Body10RegMono"
                    colorTheme="white"
                  />
                </Block>
                {/* hãng bay */}
                <Text
                  text={`${service.Airline?.toUpperCase()} `}
                  fontStyle="Body10RegMono"
                  colorTheme="white"
                />

                {/* route */}
                <Text
                  text={`${service.StartPoint}${service.EndPoint}`.toUpperCase()}
                  fontStyle="Body10RegMono"
                  colorTheme="white"
                />
              </Block>
            </Block>
          ))}
        </Block>
      )}

      {/* Thông tin liên hệ */}
      <Block>
        {/* SDT liên hệ */}
        <Block flexDirection="row" alignItems="center">
          <Text text="PHONE: " fontStyle="Body10RegMono" colorTheme="white" />
          <Text
            text={`${dialCode}${removeLeadingZero(
              form.ContactInfo.PhoneNumber,
            )}`}
            fontStyle="Body10RegMono"
            colorTheme="white"
          />
        </Block>

        {/* Email liên hệ */}
        <Block flexDirection="row" alignItems="center">
          <Text text="EMAIL: " fontStyle="Body10RegMono" colorTheme="white" />
          <Text
            text={form.ContactInfo.Email.toUpperCase()}
            fontStyle="Body10RegMono"
            colorTheme="white"
          />
        </Block>

        {/* Tên liên hệ */}
        {form.ContactInfo.FullName && form.ContactInfo.FullName !== '' && (
          <Block flexDirection="row" alignItems="center">
            <Text text="NAME: " fontStyle="Body10RegMono" colorTheme="white" />
            <Text
              text={form.ContactInfo.FullName.toUpperCase()}
              fontStyle="Body10RegMono"
              colorTheme="white"
            />
          </Block>
        )}

        {/* Địa chỉ */}
        {form.ContactInfo.Address && form.ContactInfo.Address !== '' && (
          <Block flexDirection="row" alignItems="center">
            <Text
              text="ADDRESS: "
              fontStyle="Body10RegMono"
              colorTheme="white"
            />
            <Block flex={1}>
              <Text
                text={form.ContactInfo.Address.toUpperCase()}
                fontStyle="Body10RegMono"
                numberOfLines={2}
                ellipsizeMode="clip"
                colorTheme="white"
              />
            </Block>
          </Block>
        )}
        {/* Ghi chú */}
        {form.ContactInfo.Note && form.ContactInfo.Note !== '' && (
          <Block flexDirection="row" alignItems="center">
            <Text
              text="CONTACT NOTE:  "
              fontStyle="Body10RegMono"
              colorTheme="white"
            />
            <Text
              text={form.ContactInfo.Note.toUpperCase()}
              fontStyle="Body10RegMono"
              colorTheme="white"
            />
          </Block>
        )}
      </Block>

      {/* Tổng tiền */}
      <Block flexDirection="row">
        <Block flex={1}>
          <Text
            numberOfLines={1}
            ellipsizeMode="clip"
            text={`TOTAL PRICE (${DEFAULT_CURRENCY}):..........................................`}
            fontStyle="Body10RegMono"
            colorTheme="white"
          />
        </Block>
        <Text
          text={`${(total + Total).currencyFormat()}`}
          fontStyle="Body10RegMono"
          colorTheme="white"
        />
      </Block>
    </Block>
  );
};

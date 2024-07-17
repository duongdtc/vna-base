import { Block, Icon, Separator, Text } from '@vna-base/components';
import { selectCurrentFeature } from '@vna-base/redux/selector';
import { Flight } from '@services/axios/axios-data';
import { Passenger } from '@services/axios/axios-ibe';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { ActiveOpacity, getFullNameOfPassenger, scale } from '@vna-base/utils';
import React, { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { AncillaryUpdateForm } from '../type';

type ServiceItemProps = {
  isEmptyService: boolean;
  passengerIndex: number;
  segmentIndex: number;
  flightIndex: number;
  isOneway: boolean;
  onPress: (data: {
    listSelected: Array<string> | undefined | null;
    passengerIndex: number;
    segmentIndex: number;
    flight: Flight & { index: number };
  }) => void;
};

export const ServiceItem = (props: ServiceItemProps) => {
  const {
    passengerIndex,
    flightIndex,
    segmentIndex,
    isOneway,
    onPress,
    isEmptyService,
  } = props;
  const { bookingId } = useSelector(selectCurrentFeature);
  const { control, getValues } = useFormContext<AncillaryUpdateForm>();
  const Flights = useObject<BookingRealm>(BookingRealm.schema.name, bookingId)?.toJSON()
    ?.Flights as Array<Flight>;

  const passenger = useMemo(() => {
    const { PaxType, GivenName, Surname } = getValues(
      `passengers.${passengerIndex}`,
    );

    return {
      isInf: PaxType === 'INF',
      fullName: getFullNameOfPassenger({ GivenName, Surname } as Passenger),
    };
  }, []);

  const services = useWatch({
    control,
    name: `passengers.${passengerIndex}.Services.${flightIndex}.${segmentIndex}`,
  });

  const _onPress = () => {
    onPress({
      passengerIndex,
      listSelected: services?.map(service => service.Value as string),
      flight: { ...Flights[flightIndex], index: flightIndex },
      segmentIndex,
    });
  };

  if (passenger.isInf) {
    return null;
  }

  return (
    <TouchableOpacity
      disabled={isEmptyService}
      activeOpacity={ActiveOpacity}
      style={[
        {
          paddingVertical: scale(12),
        },
        isOneway && {
          paddingHorizontal: 12,
        },
      ]}
      onPress={_onPress}>
      <Block
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <Text
          text={passenger.fullName}
          fontStyle="Body12Med"
          colorTheme="neutral900"
        />
        {/*  eslint-disable-next-line no-nested-ternary */}
        {!services || services.length === 0 ? (
          isEmptyService ? (
            <Text
              t18n="ancillary_update:no_more_services"
              fontStyle="Body12Reg"
              colorTheme="neutral800"
            />
          ) : (
            <Block flexDirection="row" columnGap={4} alignItems="center">
              <Text
                t18n="input_info_passenger:select_service"
                fontStyle="Body12Reg"
                colorTheme="neutral800"
              />
              <Icon
                icon="arrow_ios_down_outline"
                size={16}
                colorTheme="neutral900"
              />
            </Block>
          )
        ) : (
          <Text
            t18n="common:price"
            fontStyle="Body12Med"
            colorTheme="neutral900"
          />
        )}
      </Block>
      {services && services.length > 0 && (
        <Block>
          {services.map((service, index) => (
            <Block key={service.Value}>
              {index !== 0 && (
                <Separator
                  size={2}
                  type="horizontal"
                  colorTheme="neutral50"
                  marginVertical={4}
                  paddingHorizontal={4}
                />
              )}
              <Block
                flex={1}
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center">
                <Block flex={1} alignItems="center" flexDirection="row">
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    text={service.Name as string}
                    fontStyle="Body12Reg"
                    colorTheme="neutral800"
                  />
                </Block>

                <Text
                  text={service.Price?.currencyFormat()}
                  fontStyle="Body12Bold"
                  colorTheme="price"
                />
              </Block>
            </Block>
          ))}
        </Block>
      )}
    </TouchableOpacity>
  );
};

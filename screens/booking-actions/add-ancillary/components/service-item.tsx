/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block, Icon, Separator, Text } from '@vna-base/components';
import { Flight } from '@services/axios/axios-data';
import { Passenger } from '@services/axios/axios-ibe';
import { ActiveOpacity, getFullNameOfPassenger, scale } from '@vna-base/utils';
import React, { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { AddAncillaryForm } from '../type';

type ServiceItemProps = {
  isEmptyService: boolean;
  passengerIndex: number;
  segmentIndex: number;
  flightIndex: number;
  onPress: (data: {
    listSelected: Array<string> | undefined | null;
    passengerIndex: number;
    segmentIndex: number;
    flight: Flight & { index: number };
  }) => void;
};

export const ServiceItem = (props: ServiceItemProps) => {
  const { passengerIndex, flightIndex, segmentIndex, onPress, isEmptyService } =
    props;

  const { control, getValues } = useFormContext<AddAncillaryForm>();

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
    const { flights } = getValues();

    onPress({
      passengerIndex,
      listSelected: services?.map(service => service.Value as string),
      // @ts-ignore
      flight: { ...flights[flightIndex], index: flightIndex },
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
                <Block
                  flex={8}
                  alignItems="center"
                  flexDirection="row"
                  justifyContent="flex-start">
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    text={service.Name as string}
                    fontStyle="Body12Reg"
                    colorTheme="neutral800"
                  />
                </Block>
                <Block
                  flex={2}
                  flexDirection="row"
                  justifyContent="flex-end"
                  alignItems="center">
                  <Text
                    text={service.Price?.currencyFormat()}
                    fontStyle="Body12Bold"
                    colorTheme="price"
                  />
                </Block>
              </Block>
            </Block>
          ))}
        </Block>
      )}
    </TouchableOpacity>
  );
};

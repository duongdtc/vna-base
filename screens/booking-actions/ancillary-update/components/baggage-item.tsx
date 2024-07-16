import { Block, Icon, Text } from '@vna-base/components';
import { Passenger } from '@services/axios/axios-ibe';
import { ActiveOpacity, getFullNameOfPassenger, scale } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { AncillaryUpdateForm } from '../type';

type BaggageItemProps = {
  isEmptyService: boolean;
  passengerIndex: number;
  flightIndex: number;
  isOneway: boolean;
  onPress: (data: {
    selected: string | undefined | null;
    passengerIndex: number;
    flightIndex: number;
  }) => void;
};

export const BaggageItem = (props: BaggageItemProps) => {
  const { passengerIndex, flightIndex, isOneway, onPress, isEmptyService } =
    props;

  const { control, getValues } = useFormContext<AncillaryUpdateForm>();

  const passenger = useMemo(() => {
    const { PaxType, GivenName, Surname } = getValues(
      `passengers.${passengerIndex}`,
    );

    return {
      isInf: PaxType === 'INF',
      fullName: getFullNameOfPassenger({
        GivenName,
        Surname,
      } as Passenger),
    };
  }, []);

  const baggage = useWatch({
    control,
    name: `passengers.${passengerIndex}.Baggages.${flightIndex}`,
  });

  const _baggageExist = useMemo(() => !isEmpty(baggage), [baggage]);

  if (passenger.isInf) {
    return null;
  }

  return (
    <TouchableOpacity
      disabled={isEmptyService}
      activeOpacity={ActiveOpacity}
      style={[
        { paddingVertical: scale(12) },
        isOneway && {
          paddingHorizontal: scale(12),
        },
      ]}
      onPress={() => {
        onPress({
          passengerIndex,
          selected: baggage?.Value,
          flightIndex,
        });
      }}>
      <Block
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <Block flex={1} flexDirection="row" alignItems="center" columnGap={4}>
          <Block flex={1}>
            <Text
              numberOfLines={2}
              text={passenger.fullName}
              fontStyle="Body12Med"
              colorTheme="neutral900"
            />
          </Block>
          {_baggageExist && (
            <Text
              t18n="common:price"
              fontStyle="Body12Med"
              colorTheme="neutral900"
            />
          )}
        </Block>
        {isEmptyService && !_baggageExist ? (
          <Text
            t18n="ancillary_update:no_more_baggages"
            fontStyle="Body12Reg"
            colorTheme="neutral800"
          />
        ) : (
          !_baggageExist && (
            <Block flexDirection="row" columnGap={4} alignItems="center">
              <Text
                t18n="input_info_passenger:select_baggage"
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
        )}
      </Block>
      {_baggageExist && (
        <Block flexDirection="row" columnGap={4} alignItems="center">
          <Block flex={1}>
            <Text
              numberOfLines={2}
              text={baggage?.Name as string}
              fontStyle="Body12Reg"
              colorTheme="neutral800"
            />
          </Block>
          <Text
            text={!baggage ? undefined : baggage.Price?.currencyFormat()}
            fontStyle="Body12Bold"
            colorTheme="price"
          />
        </Block>
      )}
    </TouchableOpacity>
  );
};

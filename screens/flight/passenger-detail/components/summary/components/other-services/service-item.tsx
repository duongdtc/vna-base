import { Block, Separator, Text } from '@vna-base/components';
import { useWatchName } from '@vna-base/screens/flight/passenger-detail/hooks';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { bs } from '@theme';
import React, { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { View } from 'react-native';

export const ServiceItem = ({
  passengerIndex,
  flightIndex,
}: {
  passengerIndex: number;
  flightIndex: number;
}) => {
  const { control } = useFormContext<PassengerForm>();

  const fullName = useWatchName(passengerIndex);

  const service = useWatch({
    control,
    name: `Passengers.${passengerIndex}.Services.${flightIndex}`,
  });

  const valuesService = useMemo(() => {
    const result: {
      name: string | null | undefined;
      price: number | undefined;
    }[] = [];

    service?.forEach(subArrayService => {
      subArrayService?.forEach(item => {
        const name = item?.Name;
        const price = item?.Price;
        result.push({ name, price });
      });
    });

    return result;
  }, [service]);

  if (valuesService.length === 0) {
    return null;
  }

  return (
    <Block>
      <View style={[bs.marginVertical_16]}>
        <Separator type="horizontal" size={4} />
      </View>
      <Block
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Text text={fullName} fontStyle="Body12Med" colorTheme="neutral100" />
        <Text
          t18n="common:price"
          fontStyle="Body12Reg"
          colorTheme="neutral100"
        />
      </Block>

      {valuesService.map((item, idx) => {
        return (
          <Block key={idx}>
            <View style={[bs.padding_4]}>
              <Separator type="horizontal" size={2} colorTheme="neutral50" />
            </View>
            <Block
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Block flex={1}>
                <Text
                  text={item?.name as string}
                  fontStyle="Body12Reg"
                  colorTheme="neutral80"
                  numberOfLines={2}
                />
              </Block>
              <Block flex={0.23} alignItems="flex-end">
                <Text
                  text={item?.price?.currencyFormat()}
                  fontStyle="Body12Bold"
                  colorTheme="price"
                />
              </Block>
            </Block>
          </Block>
        );
      })}
    </Block>
  );
};

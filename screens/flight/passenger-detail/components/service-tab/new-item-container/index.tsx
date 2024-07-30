/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createStyleSheet, useStyles } from '@theme';
import { Block, Icon, Text } from '@vna-base/components';
import {
  FlightOfPassengerForm,
  PassengerForm,
} from '@vna-base/screens/flight/type';
import { ActiveOpacity } from '@vna-base/utils';
import React, { useCallback, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  FlatList,
  LayoutAnimation,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';
import { NewItemContainerProps } from '../type';
import { FlightItem } from './flight-item';

export const NewItemContainer = (props: NewItemContainerProps) => {
  const {
    t18nTitle,
    defaultClose = true,
    disabled = false,
    renderServiceItem,
    renderEndpoint,
    icon,
  } = props;

  const { styles } = useStyles(styleSheet);
  const { control } = useFormContext<PassengerForm>();
  const [isClose, setIsClose] = useState<boolean>(defaultClose);

  const flights = useWatch({
    control,
    name: 'FLights',
  });

  const _renderServiceItem = useCallback(
    (data: { flightIndex: number; airportIdx: number }) =>
      renderServiceItem({ ...data }),
    [flights.length, renderServiceItem],
  );

  const toggleContent = useCallback(() => {
    // if (
    //   flights.length === 1 &&
    //   flights[0].ListSegment?.length === 1 &&
    //   t18nTitle === 'choose_services:choose_seat' &&
    //   !disabled &&
    //   !loading
    // ) {
    //   onPressPreSeat(0, 0);
    //   setIsClose(false);
    // } else {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 160,
    });
    setIsClose(prev => !prev);
    // }
  }, [disabled, flights, t18nTitle]);

  const renderFlight = useCallback<
    ListRenderItem<FlightOfPassengerForm & { airportIdx: number }>
  >(
    ({ item, index }) => (
      <FlightItem
        {...item}
        index={index}
        renderServiceItem={_renderServiceItem}
      />
    ),
    [_renderServiceItem],
  );

  const _flight = useMemo(() => {
    if (!renderEndpoint) {
      return flights;
    }

    return flights.flatMap(fl => [
      { ...fl, airportIdx: 0 },
      { ...fl, StartPoint: fl.EndPoint, airportIdx: 1 },
    ]);
  }, [flights, renderEndpoint]);

  return (
    <Block borderRadius={8} colorTheme="neutral100">
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        onPress={toggleContent}
        style={[
          styles.btnItemService,
          !isClose &&
            flights.length === 1 &&
            flights[0].ListSegment?.length === 1 && { paddingBottom: 0 },
        ]}>
        <Icon icon={icon} size={20} colorTheme="neutral700" />
        <Block flex={1}>
          <Text
            fontStyle="Body16Semi"
            colorTheme="neutral100"
            t18n={t18nTitle}
          />
        </Block>
        <Icon
          icon={isClose ? 'arrow_ios_down_fill' : 'arrow_ios_up_fill'}
          size={24}
          colorTheme="neutral100"
        />
      </TouchableOpacity>
      <Block
        height={isClose ? 0 : 'auto'}
        overflow="hidden"
        borderColorTheme="neutral100"
        paddingHorizontal={12}>
        <FlatList
          // @ts-ignore
          data={_flight}
          renderItem={renderFlight}
          scrollEnabled={false}
          keyExtractor={(_, index) => index.toString()}
          style={{ marginTop: 12 }}
        />
      </Block>
    </Block>
  );
};

const styleSheet = createStyleSheet(({ spacings }) => ({
  btnItemService: {
    borderRadius: spacings[8],
    padding: spacings[12],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 8,
  },
}));

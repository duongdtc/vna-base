import { createStyleSheet, useStyles } from '@theme';
import { Block, Icon, Text } from '@vna-base/components';
import {
  FlightOfPassengerForm,
  PassengerForm,
} from '@vna-base/screens/flight/type';
import { ActiveOpacity, HairlineWidth, scale } from '@vna-base/utils';
import React, { useCallback, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  FlatList,
  LayoutAnimation,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';
import { Service } from '..';
import { HotelItem } from './components';

export const Hotels = ({ t18nTitle }: Pick<Service, 't18nTitle'>) => {
  const { styles } = useStyles(styleSheet);
  const { control } = useFormContext<PassengerForm>();
  const [isClose, setIsClose] = useState(false);

  const flights = useWatch({
    control,
    name: 'FLights',
  });

  const toggleContent = useCallback(() => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 160,
    });
    setIsClose(prev => !prev);
  }, []);

  const renderFlight = useCallback<ListRenderItem<FlightOfPassengerForm>>(
    ({ item, index }) => {
      return <HotelItem item={item} index={index} />;
    },
    [],
  );

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
        <Text fontStyle="Body16Semi" colorTheme="neutral100" t18n={t18nTitle} />
        <Icon
          icon={isClose ? 'arrow_ios_right_fill' : 'arrow_ios_down_fill'}
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
          data={flights}
          renderItem={renderFlight}
          scrollEnabled={false}
          keyExtractor={(_, index) => index.toString()}
          style={{
            marginTop: scale(8),
          }}
        />
      </Block>
    </Block>
  );
};

const styleSheet = createStyleSheet(({ spacings, colors }) => ({
  btnItemService: {
    borderRadius: spacings[8],
    padding: spacings[12],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flightItemContainerCommon: { marginBottom: spacings[12] },
  flightItemContainer: {
    borderRadius: 8,
    borderWidth: HairlineWidth * 3,
    overflow: 'hidden',
    borderColor: colors.neutral20,
  },
  flightItemContainerNoWrap: {},
}));

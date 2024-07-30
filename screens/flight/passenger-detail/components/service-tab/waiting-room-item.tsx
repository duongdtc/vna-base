import { createStyleSheet, useStyles } from '@theme';
import { Block, Icon, Text } from '@vna-base/components';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { ActiveOpacity } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { WaitingRoomItemProps } from './type';

export const WaitingRoomItem = (props: WaitingRoomItemProps) => {
  const { flightIndex, onPress } = props;

  const { control } = useFormContext<PassengerForm>();
  const { styles } = useStyles(styleSheet);

  const room = useWatch({
    control,
    name: `WaitingRooms.${flightIndex}`,
  });

  const _roomExist = useMemo(() => {
    if (typeof room === 'object' && !isEmpty(room)) {
      return true;
    }

    return false;
  }, [room]);

  return (
    <TouchableOpacity
      activeOpacity={ActiveOpacity}
      style={[styles.servicePassengerItem]}
      onPress={() => {
        onPress({
          selected: room?.value,
          flightIndex,
        });
      }}>
      <Block rowGap={4}>
        <Block flexDirection="row" columnGap={2} alignItems="center">
          <Block flex={1}>
            <Text
              text="Loại phòng"
              fontStyle="Body14Med"
              colorTheme="neutral100"
            />
          </Block>
          {_roomExist ? (
            <Text text="Giá" fontStyle="Body14Reg" colorTheme="neutral100" />
          ) : (
            <>
              <Text
                text="Chưa chọn"
                fontStyle="Body14Reg"
                colorTheme="neutral100"
              />
              <Icon
                icon="arrow_ios_down_outline"
                size={16}
                colorTheme="neutral100"
              />
            </>
          )}
        </Block>
        {_roomExist && (
          <Block
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center">
            <Text
              text={room.title}
              fontStyle="Body12Bold"
              colorTheme="successColor"
            />
            <Text
              text={room.price?.currencyFormat()}
              fontStyle="Body12Bold"
              colorTheme="price"
            />
          </Block>
        )}
      </Block>
    </TouchableOpacity>
  );
};

const styleSheet = createStyleSheet(({ spacings }) => ({
  servicePassengerItem: {
    padding: spacings[12],
  },
}));

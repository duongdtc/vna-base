import { navigate } from '@navigation/navigation-service';
import { AirportRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { createStyleSheet, useStyles } from '@theme';
import { APP_SCREEN } from '@utils';
import { Block, Icon, Text } from '@vna-base/components';
import {
  FlightOfPassengerForm,
  PassengerForm,
} from '@vna-base/screens/flight/type';
import { HairlineWidth } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext, useWatch } from 'react-hook-form';
import { FlatList, Pressable, View } from 'react-native';

type Props = {
  item: FlightOfPassengerForm;
  index: number;
};

export const HotelItem = memo(({ item, index }: Props) => {
  const { styles } = useStyles(styleSheet);

  const { control, getValues, setValue } = useFormContext<PassengerForm>();

  const navToPickRoomHotel = () => {
    const hotel = getValues(`Hotels.${index}`);

    navigate(APP_SCREEN.LIST_HOTEL, {
      initData: hotel,
      onDone: data => {
        setValue(`Hotels.${index}`, data, {
          shouldDirty: true,
        });
      },
    });
  };

  const hotel = useWatch({
    control,
    name: `Hotels.${index}`,
  });

  return (
    <>
      <View
        style={[styles.flightItemContainer, styles.flightItemContainerCommon]}>
        <FlatList
          data={item.ListSegment}
          keyExtractor={(item, index) => `${item.SegmentId}_${index}`}
          renderItem={({ item: _it, index: idx }) => {
            const city = realmRef.current?.objectForPrimaryKey<AirportRealm>(
              AirportRealm.schema.name,
              item.EndPoint as string,
            );

            return (
              <Block key={idx}>
                <Pressable onPress={navToPickRoomHotel}>
                  <Block
                    paddingHorizontal={8}
                    paddingVertical={12}
                    colorTheme="neutral50"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between">
                    <Text
                      text={`${index + 1}. ${city?.City.NameVi}`}
                      fontStyle="Body14Semi"
                      colorTheme="neutral800"
                    />
                  </Block>
                  {!hotel?.hotel && (
                    <Block
                      padding={12}
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between">
                      <Text
                        text="Khách sạn"
                        fontStyle="Body14Med"
                        colorTheme="neutral100"
                      />
                      <Block
                        flex={1}
                        flexDirection="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        columnGap={4}>
                        <Text
                          text={'Chưa chọn'}
                          fontStyle="Body14Med"
                          colorTheme={'neutral100'}
                        />
                        <Icon
                          icon="arrow_ios_down_fill"
                          size={16}
                          colorTheme="neutral100"
                        />
                      </Block>
                    </Block>
                  )}
                  {(hotel?.hotel || hotel?.room) && (
                    <Block
                      paddingHorizontal={12}
                      paddingTop={4}
                      paddingBottom={12}
                      rowGap={4}>
                      <Block
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between">
                        <Text
                          text="Loại phòng"
                          fontStyle="Body14Med"
                          colorTheme="neutral100"
                        />
                        <Text
                          text="Giá"
                          fontStyle="Body14Med"
                          colorTheme="success500"
                        />
                      </Block>
                      {hotel?.room && (
                        <Block
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Text
                            text={hotel?.room?.t18n}
                            fontStyle="Body12Bold"
                            colorTheme="successColor"
                          />
                          <Text
                            text={hotel?.room?.price?.currencyFormat()}
                            fontStyle="Body12Bold"
                            colorTheme="price"
                          />
                        </Block>
                      )}
                      {hotel?.hotel && (
                        <Block>
                          <Text
                            text={hotel?.hotel?.t18n}
                            fontStyle="Body14Semi"
                            colorTheme="neutral100"
                          />
                          <Block
                            flexDirection="row"
                            alignItems="center"
                            columnGap={4}>
                            <Icon
                              icon="pin_outline"
                              size={12}
                              colorTheme="neutral100"
                            />
                            <Text
                              text={hotel?.hotel?.description ?? ''}
                              fontStyle="Body10Reg"
                              colorTheme="neutral100"
                            />
                          </Block>
                        </Block>
                      )}
                    </Block>
                  )}
                </Pressable>
              </Block>
            );
          }}
        />
      </View>
    </>
  );
}, isEqual);

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

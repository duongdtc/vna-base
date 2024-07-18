import { navigate } from '@navigation/navigation-service';
import { AirportRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { createStyleSheet, useStyles } from '@theme';
import { I18nKeys } from '@translations/locales';
import { APP_SCREEN } from '@utils';
import {
  Block,
  DateTimePicker,
  Icon,
  Separator,
  Text,
} from '@vna-base/components';
import { DatePickerRef } from '@vna-base/components/date-picker/type';
import {
  FlightOfPassengerForm,
  PassengerForm,
} from '@vna-base/screens/flight/type';
import { ModalCustomPicker } from '@vna-base/screens/order-detail/components';
import {
  ItemCustom,
  ModalCustomPickerRef,
} from '@vna-base/screens/order-detail/components/modal-custom-picker/type';
import { HairlineWidth, SnapPoint } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { FlatList, Pressable, View } from 'react-native';
import { NumberRoom, NumberRoomDetails } from './dummy';

type Props = {
  item: FlightOfPassengerForm;
  index: number;
};

export const HotelItem = memo(({ item, index }: Props) => {
  const { styles } = useStyles(styleSheet);

  const { control, getValues, setValue } = useFormContext<PassengerForm>();

  const datePickerRef = useRef<DatePickerRef>(null);
  const bottomRoomRef = useRef<ModalCustomPickerRef>(null);

  const showDateTimePicker = (dateTime: Date | undefined) => {
    datePickerRef.current?.open({
      date: dayjs(dateTime).toDate(),
    });
  };

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

  const { hotel, room } = useWatch({
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
          renderItem={({ item: it, index: idx }) => {
            const city = realmRef.current?.objectForPrimaryKey<AirportRealm>(
              AirportRealm.schema.name,
              item.EndPoint as string,
            );

            return (
              <Block key={idx}>
                <Block
                  paddingHorizontal={8}
                  paddingVertical={12}
                  colorTheme="neutral200"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between">
                  <Text
                    text={`${index + 1}. ${city?.City.NameVi}`}
                    fontStyle="Body14Semi"
                    colorTheme="neutral100"
                  />
                  <Controller
                    control={control}
                    name={`Hotels.${index}.dateTime`}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <>
                          <Pressable
                            onPress={() =>
                              showDateTimePicker(
                                value ?? dayjs(it.StartDate).toDate(),
                              )
                            }>
                            <Block
                              flexDirection="row"
                              alignItems="center"
                              columnGap={4}>
                              <Text
                                text={
                                  value !== undefined
                                    ? dayjs(value).format('HH:mm DD/MM/YYYY')
                                    : 'Thời gian lưu trú'
                                }
                                fontStyle="Body12Med"
                                colorTheme="neutral100"
                              />
                              <Icon
                                icon="arrow_ios_right_fill"
                                size={16}
                                colorTheme="neutral100"
                              />
                            </Block>
                          </Pressable>
                          <DateTimePicker
                            ref={datePickerRef}
                            minimumDate={dayjs(item.StartDate).toDate()}
                            t18nTitle={'Chọn thời gian đón' as I18nKeys}
                            submit={_date => {
                              onChange(_date.toISOString());
                            }}
                          />
                        </>
                      );
                    }}
                  />
                </Block>
                <Controller
                  control={control}
                  name={`Hotels.${index}.numberRoom`}
                  render={({ field: { value, onChange } }) => {
                    const selected = Object.values(NumberRoomDetails).find(
                      i => i.key === value?.toString(),
                    );

                    return (
                      <>
                        <Pressable
                          onPress={() => {
                            bottomRoomRef.current?.present(String(value));
                          }}>
                          <Block
                            padding={12}
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between"
                            columnGap={8}>
                            <Text
                              text="Số lượng phòng"
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
                                text={
                                  value && selected?.key !== NumberRoom.ZERO
                                    ? selected?.t18n
                                    : 'Chưa chọn'
                                }
                                fontStyle="Body14Med"
                                colorTheme={
                                  value && selected?.key !== NumberRoom.ZERO
                                    ? 'success500'
                                    : 'neutral100'
                                }
                              />
                              <Icon
                                icon="arrow_ios_down_fill"
                                size={16}
                                colorTheme="neutral100"
                              />
                            </Block>
                          </Block>
                        </Pressable>
                        <ModalCustomPicker
                          ref={bottomRoomRef}
                          data={
                            Object.values(NumberRoomDetails) as ItemCustom[]
                          }
                          snapPoints={[SnapPoint['60%']]}
                          t18nTitle={'Số lượng phòng' as I18nKeys}
                          handleDone={onChange}
                        />
                      </>
                    );
                  }}
                />
                <Separator size={3} type="horizontal" />
                <Pressable onPress={navToPickRoomHotel}>
                  {!hotel && (
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
                  {(hotel || room) && (
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
                          fontStyle="Body14Reg"
                          colorTheme="neutral100"
                        />
                        <Text
                          text="Giá"
                          fontStyle="Body14Reg"
                          colorTheme="neutral100"
                        />
                      </Block>
                      {room && (
                        <Block
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between">
                          <Text
                            text={room?.t18n}
                            fontStyle="Body12Bold"
                            colorTheme="successColor"
                          />
                          <Text
                            text={room?.price?.currencyFormat()}
                            fontStyle="Body12Bold"
                            colorTheme="price"
                          />
                        </Block>
                      )}
                      {hotel && (
                        <Block>
                          <Text
                            text={hotel?.t18n}
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
                              text={hotel?.description ?? ''}
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

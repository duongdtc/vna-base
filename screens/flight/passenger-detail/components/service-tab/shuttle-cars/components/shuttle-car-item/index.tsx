import { AirportRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { createStyleSheet, useStyles } from '@theme';
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
import { HairlineWidth, scale, SnapPoint } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { Controller, useFormContext } from 'react-hook-form';
import { FlatList, Pressable, View } from 'react-native';
import {
  Bus,
  BusDetails,
  NumberBus,
  NumberBusDetails,
  TripDetails,
} from './dummy';
import { ModalPicker } from '../modal-picker';
import { Item, ModalPickerRef } from '../modal-picker/type';
import { I18nKeys } from '@translations/locales';

type Props = {
  item: FlightOfPassengerForm;
  index: number;
};

export const ShuttleCarItem = memo(({ item, index }: Props) => {
  const { styles } = useStyles(styleSheet);

  const { control } = useFormContext<PassengerForm>();

  const datePickerRef = useRef<DatePickerRef>(null);
  const bottomSheetRef = useRef<ModalCustomPickerRef>(null);
  const bottomBusRef = useRef<ModalCustomPickerRef>(null);
  const bottomTypeBusRef = useRef<ModalPickerRef>(null);

  const showDateTimePicker = (dateTime: Date | undefined) => {
    datePickerRef.current?.open({
      date: dayjs(dateTime).toDate(),
    });
  };

  return (
    <>
      <View
        style={[styles.flightItemContainer, styles.flightItemContainerCommon]}>
        <FlatList
          data={item.ListSegment}
          keyExtractor={(item, index) => `${item.SegmentId}_${index}`}
          renderItem={({ item: it, index: idx }) => {
            const airportSP =
              realmRef.current?.objectForPrimaryKey<AirportRealm>(
                AirportRealm.schema.name,
                item.StartPoint as string,
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
                    text={`${index + 1}. ${airportSP?.NameVi}`}
                    fontStyle="Body14Semi"
                    colorTheme="neutral100"
                  />
                  <Controller
                    control={control}
                    name={`ShuttleBuses.${index}.dateTime`}
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
                                    : 'Thời gian đón'
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
                  name={`ShuttleBuses.${index}.trip`}
                  render={({ field: { value, onChange } }) => {
                    const selected = Object.values(TripDetails).find(
                      i => i.key === value,
                    );

                    return (
                      <>
                        <Pressable
                          onPress={() => {
                            bottomSheetRef.current?.present(value!);
                          }}>
                          <Block
                            padding={12}
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between"
                            columnGap={8}>
                            <Text
                              text="Hành trình"
                              fontStyle="Body14Med"
                              colorTheme="neutral100"
                            />
                            <Block
                              flex={1}
                              flexDirection="row"
                              justifyContent="flex-end"
                              alignItems="center"
                              columnGap={4}>
                              <Block flexShrink={1}>
                                <Text
                                  text={value ? selected?.t18n : 'Chưa chọn'}
                                  fontStyle="Body14Med"
                                  colorTheme={
                                    value ? 'success500' : 'neutral100'
                                  }
                                  ellipsizeMode="tail"
                                  numberOfLines={1}
                                />
                              </Block>
                              <Icon
                                icon="arrow_ios_down_fill"
                                size={16}
                                colorTheme="neutral100"
                              />
                            </Block>
                          </Block>
                        </Pressable>
                        <ModalCustomPicker
                          ref={bottomSheetRef}
                          data={Object.values(TripDetails) as ItemCustom[]}
                          snapPoints={[SnapPoint['40%']]}
                          t18nTitle={'Chọn hành trình' as I18nKeys}
                          handleDone={onChange}
                          hasDescription
                        />
                      </>
                    );
                  }}
                />

                <Separator type="horizontal" size={3} />
                <Controller
                  control={control}
                  name={`ShuttleBuses.${index}.numberBus`}
                  render={({ field: { value, onChange } }) => {
                    const selected = Object.values(NumberBusDetails).find(
                      i => i.key === value?.toString(),
                    );

                    return (
                      <>
                        <Pressable
                          onPress={() => {
                            bottomBusRef.current?.present(String(value));
                          }}>
                          <Block
                            padding={12}
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between">
                            <Text
                              text="Số lượng xe"
                              fontStyle="Body14Med"
                              colorTheme="neutral100"
                            />
                            <Block
                              flexDirection="row"
                              alignItems="center"
                              columnGap={4}>
                              <Text
                                text={
                                  value && selected?.key !== NumberBus.ZERO
                                    ? selected?.t18n
                                    : 'Chưa chọn'
                                }
                                fontStyle="Body14Med"
                                colorTheme={
                                  value && selected?.key !== NumberBus.ZERO
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
                          ref={bottomBusRef}
                          data={Object.values(NumberBusDetails) as ItemCustom[]}
                          snapPoints={[SnapPoint['60%']]}
                          t18nTitle={'Số lượng xe' as I18nKeys}
                          handleDone={onChange}
                        />
                      </>
                    );
                  }}
                />

                <Separator type="horizontal" size={3} />
                <Controller
                  control={control}
                  name={`ShuttleBuses.${index}.type`}
                  render={({ field: { value, onChange } }) => {
                    const selected = Object.values(BusDetails).find(
                      i => i.key === value?.toString(),
                    );

                    return (
                      <>
                        <Pressable
                          onPress={() => {
                            bottomTypeBusRef.current?.present(String(value));
                          }}
                          style={{ paddingVertical: scale(12) }}>
                          <Block
                            paddingHorizontal={12}
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between">
                            <Text
                              text="Loại xe"
                              fontStyle="Body14Med"
                              colorTheme="neutral100"
                            />
                            <Block
                              flexDirection="row"
                              alignItems="center"
                              columnGap={4}>
                              <Text
                                text={
                                  value && selected?.key !== Bus.ZERO
                                    ? 'Giá'
                                    : 'Chưa chọn'
                                }
                                fontStyle="Body14Med"
                                colorTheme={
                                  value && selected?.key !== Bus.ZERO
                                    ? 'success500'
                                    : 'neutral100'
                                }
                              />
                              {(!value ||
                                value === undefined ||
                                selected?.key === Bus.ZERO) && (
                                <Icon
                                  icon={'arrow_ios_down_fill'}
                                  size={16}
                                  colorTheme="neutral100"
                                />
                              )}
                            </Block>
                          </Block>
                          {value && selected?.key !== Bus.ZERO && (
                            <Block
                              paddingHorizontal={12}
                              flexDirection="row"
                              alignItems="center"
                              justifyContent="space-between">
                              <Text
                                text={selected?.t18n}
                                fontStyle="Body12Bold"
                                colorTheme={'success500'}
                              />
                              <Text
                                text={selected?.price?.currencyFormat()}
                                fontStyle="Body12Bold"
                                colorTheme={'price'}
                              />
                            </Block>
                          )}
                        </Pressable>
                        <ModalPicker
                          ref={bottomTypeBusRef}
                          data={Object.values(BusDetails) as Item[]}
                          snapPoints={[SnapPoint['60%']]}
                          t18nTitle={'Chọn loại xe' as I18nKeys}
                          handleDone={onChange}
                        />
                      </>
                    );
                  }}
                />
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

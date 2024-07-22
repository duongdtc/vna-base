import { AirportRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { createStyleSheet, useStyles } from '@theme';
import { I18nKeys } from '@translations/locales';
import { Block, Icon, Text } from '@vna-base/components';
import {
  FlightOfPassengerForm,
  PassengerForm,
} from '@vna-base/screens/flight/type';
import { HairlineWidth, SnapPoint } from '@vna-base/utils';
import React, { memo, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { Controller, useFormContext } from 'react-hook-form';
import { FlatList, Pressable, View } from 'react-native';
import { ModalPicker } from '../modal-picker';
import { Item, ModalPickerRef } from '../modal-picker/type';
import { Bus, BusDetails } from './dummy';

type Props = {
  item: FlightOfPassengerForm;
  index: number;
};

export const ShuttleCarItem = memo(({ item, index }: Props) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);

  const { control } = useFormContext<PassengerForm>();

  const bottomTypeBusRef = useRef<ModalPickerRef>(null);

  return (
    <>
      <View
        style={[styles.flightItemContainer, styles.flightItemContainerCommon]}>
        <FlatList
          data={item.ListSegment}
          keyExtractor={(item, index) => `${item.SegmentId}_${index}`}
          renderItem={({ item: _it, index: idx }) => {
            const airportSP =
              realmRef.current?.objectForPrimaryKey<AirportRealm>(
                AirportRealm.schema.name,
                item.StartPoint as string,
              );

            return (
              <Block key={idx}>
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
                          style={{ paddingBottom: 12 }}
                          onPress={() => {
                            bottomTypeBusRef.current?.present(String(value));
                          }}>
                          <View
                            style={{
                              paddingHorizontal: 8,
                              paddingVertical: 12,
                              marginBottom: 12,
                              backgroundColor: colors.neutral20,
                            }}>
                            <Text
                              text={`${index + 1}. ${airportSP?.NameVi}`}
                              fontStyle="Body14Semi"
                              colorTheme="neutral800"
                            />
                          </View>
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
                          snapPoints={[SnapPoint['50%']]}
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

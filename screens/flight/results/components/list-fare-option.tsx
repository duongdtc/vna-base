/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Block,
  Button,
  Icon,
  LinearGradient,
  Separator,
  Text,
} from '@vna-base/components';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { navigate } from '@navigation/navigation-service';
import { FareRuleParams } from '@navigation/type';
import { FareFilter } from '@vna-base/screens/flight/type';
import { FareOption } from '@services/axios/axios-ibe';
import { createStyleSheet, useStyles } from '@theme';
import { HitSlop, scale } from '@vna-base/utils';
import React, { useCallback } from 'react';
import { ListRenderItem, Pressable, StyleSheet, View } from 'react-native';
import { APP_SCREEN } from '@utils';

type Props = {
  type: 'economy' | 'business';
  dataFareOptions: ArrayLike<FareOption> | null | undefined;
  ticketInfo: Omit<FareRuleParams, 'FareOptionId'> & {
    Itinerary: number;
    verifySession?: string;
  };
  selectFare: (fareOptionId: number) => void;
  selected?: boolean;
  fareType?:
    | {
        fareType?: keyof FareFilter;
        customFeeTotalType?: 'Total' | 'TotalFare' | 'BaseFare' | 'PriceAdt';
      }
    | undefined;
};

export const ListFareOption = ({
  dataFareOptions,
  ticketInfo,
  selectFare,
  selected,
  fareType: fareTypeProp,
  type,
}: Props) => {
  const { styles } = useStyles(styleSheet);

  const _navToDetailFare = useCallback(
    (fareOption: FareOption) => {
      navigate(APP_SCREEN.INFO_TICKET, {
        fareOption,
        ticketInfo,
      });
    },
    [ticketInfo],
  );

  const _renderFareOption = useCallback<ListRenderItem<FareOption>>(
    ({ item, index }) => {
      return (
        <View style={styles.fareItem}>
          <View style={styles.headerItem}>
            {type === 'business' && (
              <LinearGradient type="graPre" style={StyleSheet.absoluteFill} />
            )}
            <Text
              text={`${item.FareFamily} (${item.FareClass})`.toUpperCase()}
              fontStyle="Body12Med"
              colorTheme="white"
            />
            <Text
              text={item.TotalFare?.currencyFormat() + ' VND'}
              fontStyle="H418Bold"
              colorTheme="white"
            />
            <Text
              text={item.FareBasis?.toUpperCase()}
              fontStyle="Body12Bold"
              colorTheme="white"
            />
          </View>
          <View style={styles.subtitleItem}>
            <LinearGradient type="graPre" style={StyleSheet.absoluteFill} />
            <Icon icon="ic_manage_hanhly" size={16} />
            <Text
              text="Hệ số cộng dặm Bông sen vàng"
              fontStyle="Body10Semi"
              colorTheme="white"
            />
            <Text text="25%" fontStyle="Body10Semi" colorTheme="white" />
          </View>
          <Pressable
            hitSlop={HitSlop.Large}
            onPress={() => {
              _navToDetailFare(item);
            }}>
            <Block
              paddingVertical={4}
              paddingHorizontal={8}
              flexDirection="row"
              colorTheme="neutral100_old"
              columnGap={8}
              alignItems="center">
              <LinearGradient type="gra3" style={StyleSheet.absoluteFill} />
              <Icon icon="alert_circle_outline" size={14} />
              <Block flex={1}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  text="Chi tiết giá"
                  fontStyle="Body12Med"
                  colorTheme="neutral900"
                />
              </Block>
              <Icon
                icon="arrow_ios_right_outline"
                size={12}
                colorTheme="neutral900"
              />
            </Block>
          </Pressable>
          <Block paddingHorizontal={8}>
            <Block
              paddingVertical={12}
              flexDirection="row"
              colorTheme="neutral100_old"
              columnGap={8}
              alignItems="center">
              <Icon icon="bag_fill" size={14} />
              <Block flex={1}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  text="Hành lý xách tay *"
                  fontStyle="Body12Semi"
                  colorTheme="neutral900"
                />
              </Block>
              <Text
                text="1 kiện 12kg"
                fontStyle="Body12Reg"
                colorTheme="neutral70"
              />
            </Block>
            <Separator type="horizontal" />
            <Block
              paddingVertical={12}
              flexDirection="row"
              colorTheme="neutral100_old"
              columnGap={8}
              alignItems="center">
              <Icon icon="bag_fill" size={14} />
              <Block flex={1}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  text="Hành lý ký gửi *"
                  fontStyle="Body12Semi"
                  colorTheme="neutral900"
                />
              </Block>
              <Icon
                icon="close_circle_outline"
                colorTheme="errorColor"
                size={16}
              />
            </Block>
            <Separator type="horizontal" />
            <Block
              paddingVertical={12}
              flexDirection="row"
              colorTheme="neutral100_old"
              columnGap={8}
              alignItems="center">
              <Icon icon="bag_fill" size={14} />
              <Block flex={1}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  text="Đổi vé *"
                  fontStyle="Body12Semi"
                  colorTheme="neutral900"
                />
              </Block>
              <Icon
                icon="close_circle_outline"
                colorTheme="errorColor"
                size={16}
              />
            </Block>
            <Separator type="horizontal" />
            <Block
              paddingVertical={12}
              flexDirection="row"
              colorTheme="neutral100_old"
              columnGap={8}
              alignItems="center">
              <Icon icon="bag_fill" size={14} />
              <Block flex={1}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  text="Go-Show"
                  fontStyle="Body12Semi"
                  colorTheme="neutral900"
                />
              </Block>
              <Icon icon="Noti_Money" size={16} />
              <Text
                text={(500000).currencyFormat() + ' VND'}
                fontStyle="Body12Reg"
                colorTheme="neutral70"
              />
            </Block>
            <Separator type="horizontal" />
            <Block
              paddingVertical={12}
              flexDirection="row"
              colorTheme="neutral100_old"
              columnGap={8}
              alignItems="center">
              <Icon icon="bag_fill" size={14} />
              <Block flex={1}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  text="No-Show"
                  fontStyle="Body12Semi"
                  colorTheme="neutral900"
                />
              </Block>
              <Icon
                icon="close_circle_outline"
                colorTheme="errorColor"
                size={16}
              />
            </Block>
            <Separator type="horizontal" />
            <Block
              paddingVertical={12}
              flexDirection="row"
              colorTheme="neutral100_old"
              columnGap={8}
              alignItems="center">
              <Icon icon="bag_fill" size={14} />
              <Block flex={1}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  text="Thủ tục ưu tiên"
                  fontStyle="Body12Semi"
                  colorTheme="neutral900"
                />
              </Block>
              <Icon
                icon="close_circle_outline"
                colorTheme="errorColor"
                size={16}
              />
            </Block>
            <Separator type="horizontal" />
            <Block
              paddingVertical={12}
              flexDirection="row"
              colorTheme="neutral100_old"
              columnGap={8}
              alignItems="center">
              <Icon icon="bag_fill" size={14} />
              <Block flex={1}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  text="Phòng khách Bông Sen"
                  fontStyle="Body12Semi"
                  colorTheme="neutral900"
                />
              </Block>
              <Icon
                icon="close_circle_outline"
                colorTheme="errorColor"
                size={16}
              />
            </Block>
            <Separator type="horizontal" />
            <Block
              paddingVertical={12}
              flexDirection="row"
              colorTheme="neutral100_old"
              columnGap={8}
              alignItems="center">
              <Icon icon="bag_fill" size={14} />
              <Block flex={1}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  text="Chọn trước chỗ ngồi"
                  fontStyle="Body12Semi"
                  colorTheme="neutral900"
                />
              </Block>
              <Icon icon="Noti_Money" size={16} />
            </Block>
            <Separator type="horizontal" />
            <Block
              paddingVertical={12}
              flexDirection="row"
              colorTheme="neutral100_old"
              columnGap={8}
              alignItems="center">
              <Icon icon="bag_fill" size={14} />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                text="Hoàn vé"
                fontStyle="Body12Semi"
                colorTheme="neutral900"
              />

              <Block
                flex={1}
                justifyContent="flex-end"
                flexDirection="row"
                columnGap={4}
                alignItems="center">
                <Icon
                  icon="close_circle_outline"
                  size={14}
                  colorTheme={item.Refundable ? 'success400' : 'errorColor'}
                />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  text={item.Refundable ? 'Được hoàn vé' : 'Không được hoàn vé'}
                  fontStyle="Body12Semi"
                  colorTheme={item.Refundable ? 'success400' : 'errorColor'}
                />
              </Block>
            </Block>
            <Button
              disabled={!item.Availability || item.Unavailable}
              buttonColorTheme="gra1"
              text="Chọn"
              size="medium"
              fullWidth
              textColorTheme="white"
              onPress={() => {
                selectFare(index);
              }}
            />
            <Block
              marginTop={8}
              marginBottom={8}
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              columnGap={4}>
              <Icon
                icon="alert_circle_outline"
                size={10}
                colorTheme="errorColor"
              />
              {item.Availability && !item.Unavailable ? (
                <>
                  <Text
                    text="Còn"
                    fontStyle="Body10Reg"
                    colorTheme="errorColor"
                  />
                  <Text
                    text={item.Availability ?? 2}
                    fontStyle="Body10Bold"
                    colorTheme="errorColor"
                  />
                  <Text
                    text="chỗ"
                    fontStyle="Body10Reg"
                    colorTheme="errorColor"
                  />
                </>
              ) : (
                <Text
                  text="Hết chỗ"
                  fontStyle="Body10Reg"
                  colorTheme="errorColor"
                />
              )}
            </Block>
          </Block>
        </View>
      );
    },
    [selectFare, styles.fareItem, styles.headerItem, styles.subtitleItem, type],
  );

  return (
    <View style={styles.container}>
      <BottomSheetFlatList
        scrollEnabled={dataFareOptions?.length !== 1}
        keyExtractor={(item, index) => `${item.OptionId}_${index}`}
        data={dataFareOptions}
        horizontal
        renderItem={_renderFareOption}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: scale(12) }}
        ItemSeparatorComponent={() => <View style={{ width: scale(12) }} />}
      />
      <Text
        t18n="flight:fare_sub"
        colorTheme="neutral100"
        fontStyle="Body12Reg"
        textAlign="center"
        style={{ marginBottom: scale(12) }}
      />
    </View>
  );
};

const styleSheet = createStyleSheet(({ colors, spacings }) => ({
  container: { backgroundColor: colors.neutral20 },
  fareItem: {
    width: scale(323),
    backgroundColor: colors.neutral10,
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  btnDetail: {
    paddingVertical: scale(6),
    paddingHorizontal: scale(12),
    backgroundColor: colors.neutral50,
    borderRadius: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
  },
  headerItem: {
    paddingVertical: spacings[12],
    rowGap: spacings[4],
    alignItems: 'center',
    backgroundColor: colors.primaryColor,
  },
  subtitleItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: spacings[4],
    alignItems: 'center',
  },
}));

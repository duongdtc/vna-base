/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { images } from '@assets/image';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { MinPrice } from '@services/axios/axios-ibe';
import { Block, BottomSheet, Button, Image, Text } from '@vna-base/components';
import { HitSlop, getDateTimeOfFlightOption, scale } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useStyles } from './styles';

export type DetailMinPriceBottomSheetRef = {
  present: (index: number) => void;
};

export type DetailMinPriceBottomSheetProps = {
  minPrices: Array<MinPrice>;
  selectMinPrice: (minPrice: MinPrice) => void;
};

export const DetailMinPriceBottomSheet = forwardRef<
  DetailMinPriceBottomSheetRef,
  DetailMinPriceBottomSheetProps
>((props, ref) => {
  const { minPrices, selectMinPrice } = props;
  const styles = useStyles();
  const normalRef = useRef<BottomSheetModal>(null);

  const [selectingPrice, setSelectingPrice] = useState<MinPrice | null>(null);

  useImperativeHandle(ref, () => ({
    present: index => {
      setSelectingPrice(minPrices[index]);
      normalRef.current?.present();
    },
  }));

  return (
    <BottomSheet
      type="normal"
      typeBackDrop="gray"
      ref={normalRef}
      showIndicator={false}
      enablePanDownToClose={false}
      useDynamicSnapPoint={true}
      enableOverDrag={false}
      onDone={() => {}}
      header={
        <Block
          alignItems="center"
          borderTopRadius={8}
          paddingHorizontal={12}
          paddingVertical={8}
          colorTheme="neutral100"
          flexDirection="row"
          justifyContent="space-between"
          borderColorTheme="neutral200">
          <Button
            scale={false}
            leftIcon="close_outline"
            textColorTheme="neutral900"
            leftIconSize={24}
            hitSlop={HitSlop.Large}
            padding={4}
            onPress={() => {
              normalRef.current?.dismiss();
            }}
          />
          <Block
            style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
            justifyContent="center"
            alignItems="center">
            <Text
              colorTheme="neutral900"
              text={dayjs(selectingPrice?.DepartDate)
                .format('dddd, DD/MM/YYYY')
                .capitalize()}
              fontStyle="Title16Bold"
            />
          </Block>
        </Block>
      }>
      <Block>
        <Block padding={8} colorTheme="neutral50">
          <Block
            overflow="hidden"
            borderRadius={8}
            colorTheme="neutral300"
            rowGap={1}>
            {selectingPrice?.ListFlightFare?.map(item => (
              <TouchableOpacity
                key={item.Airline}
                style={styles.minPriceItem}
                activeOpacity={1}
                onPress={() => {}}>
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Block
                    width={24}
                    height={24}
                    borderRadius={4}
                    overflow="hidden">
                    <Image
                      source={images.logo_vna}
                      style={{ width: scale(24), height: scale(24) }}
                    />
                  </Block>
                  <Block
                    width={85}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between">
                    <Text
                      colorTheme="neutral900"
                      fontStyle="Body12Bold"
                      text={
                        getDateTimeOfFlightOption(
                          item.ListFlight![0].DepartDate,
                        )?.time
                      }
                    />
                    <Text
                      colorTheme="neutral900"
                      fontStyle="Body12Med"
                      text="-"
                    />
                    <Text
                      colorTheme="neutral900"
                      fontStyle="Body12Bold"
                      text={
                        getDateTimeOfFlightOption(
                          item.ListFlight![0].ArriveDate,
                        )?.time
                      }
                    />
                  </Block>
                  <Block flexDirection="row" columnGap={4} alignItems="center">
                    <Text
                      text={String(item.ListFlight![0].FlightNumber)}
                      fontStyle="Body12Reg"
                      colorTheme="neutral900"
                    />
                  </Block>
                </Block>
                <Text
                  fontStyle="Body12Bold"
                  colorTheme="price"
                  text={Number(item.FareInfo?.TotalFare).currencyFormat()}
                />
              </TouchableOpacity>
            ))}
          </Block>
        </Block>
        <Block padding={12} colorTheme="neutral100" shadow="main">
          <Button
            onPress={() => {
              selectMinPrice(selectingPrice!);
              normalRef.current?.close();
            }}
            fullWidth
            paddingVertical={12}
            buttonColorTheme="info600"
            textColorTheme="classicWhite"
            text="Chọn ngày này"
          />
        </Block>
      </Block>
    </BottomSheet>
  );
});

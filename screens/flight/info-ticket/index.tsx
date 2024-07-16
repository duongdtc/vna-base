/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Block,
  Button,
  NormalHeader,
  Screen,
  Text,
} from '@vna-base/components';
import { goBack, navigate } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectCustomFeeTotal } from '@redux-selector';
import { FarePax } from '@services/axios/axios-ibe';
import { useTheme } from '@theme';
import { HairlineWidth, WindowWidth } from '@vna-base/utils';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';
import { ItemTicketInfo } from './components/item-ticket-info';
import { OtherInfoTicket } from './components/other-ticket-info';
import { useStyles } from './style';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const InfoTicket = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.INFO_TICKET>) => {
  const { colors, dark } = useTheme();
  const { fareOption, ticketInfo } = route.params;

  const styles = useStyles();

  const { TotalFare, Total } = useSelector(selectCustomFeeTotal);

  const [heightBottomView, setHeight] = useState<number>(0);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height);
  }, []);

  const widthOnlyOneItem = useMemo(() => WindowWidth - 24, []);

  // tìm ListFareItem dài nhất
  const ListFareItem = useMemo(() => {
    const tempKeys: Array<string> = [];
    fareOption.ListFarePax?.forEach(farePax => {
      farePax.ListFareItem?.forEach((fareItem, iFareItem) => {
        const i = tempKeys.findIndex(str => str === fareItem.Code);

        if (i !== -1) {
          return;
        }

        let newIndex = 0;
        if (iFareItem !== 0) {
          newIndex =
            tempKeys.findIndex(
              str => str === farePax.ListFareItem![iFareItem - 1].Code,
            ) + 1;
        }

        tempKeys.splice(newIndex, 0, fareItem.Code!);
      });
    });
    return tempKeys;
  }, [fareOption.ListFarePax]);

  const renderItem = useCallback(
    ({ item }: { item: FarePax }) => {
      return (
        <ItemTicketInfo
          listFareItem={ListFareItem}
          infoPax={item}
          widthItem={
            fareOption.ListFarePax!.length > 1 ? undefined : widthOnlyOneItem
          }
        />
      );
    },
    [ListFareItem, fareOption, widthOnlyOneItem],
  );

  const seeFareDetail = useCallback(() => {
    navigate(APP_SCREEN.FareRuleGet, {
      ...ticketInfo,
      FareOptionId: fareOption.OptionId!,
      StartPoint: fareOption.ListFarePax![0].ListFareInfo![0].StartPoint,
      EndPoint: fareOption.ListFarePax![0].ListFareInfo![0].EndPoint,
    });
  }, [fareOption.ListFarePax, fareOption.OptionId, ticketInfo]);

  return (
    <Screen unsafe backgroundColor={colors.neutral50}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />
      <NormalHeader
        style={{ backgroundColor: colors.neutral100 }}
        leftContent={
          <Button
            type="common"
            size="small"
            leftIcon="arrow_ios_left_fill"
            textColorTheme="neutral900"
            leftIconSize={32}
            padding={0}
            onPress={() => {
              goBack();
            }}
          />
        }
        centerContent={
          <Text
            t18n="choose_services:detail"
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
      />
      <ScrollView
        nestedScrollEnabled
        scrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 12 + heightBottomView }}>
        <FlatList
          data={fareOption.ListFarePax}
          horizontal
          scrollEnabled={fareOption.ListFarePax!.length > 1}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ padding: 12 }}
          ItemSeparatorComponent={() => (
            <Block width={12} colorTheme="neutral50" />
          )}
          renderItem={renderItem}
        />

        <OtherInfoTicket fareOption={fareOption} />
      </ScrollView>
      <Block
        width={WindowWidth}
        colorTheme="neutral100"
        position="absolute"
        padding={12}
        bottom={0}
        onLayout={onLayout}
        style={styles.footerContainer}>
        <Block
          flexDirection="row"
          alignItems="center"
          width={'100%'}
          justifyContent="space-between">
          <Text
            fontStyle="Body14Semi"
            t18n="flight:total_price_fare"
            colorTheme="neutral800"
          />
          <Block flexDirection="row" alignItems="center" columnGap={4}>
            <Text
              fontStyle="Title20Semi"
              text={(
                (fareOption.TotalFare ?? 0) +
                (ticketInfo.Itinerary > 1 ? Total : TotalFare)
              ).currencyFormat()}
              colorTheme="price"
            />
            <Text fontStyle="Title20Semi" text="VND" colorTheme="neutral800" />
          </Block>
        </Block>
        <Button
          marginTop={16}
          t18n="flight:ticket_condition"
          fullWidth
          rightIcon="pantone_fill"
          rightIconSize={20}
          buttonColorTheme="neutral100_old"
          textColorTheme="primary600"
          type="outline"
          onPress={seeFareDetail}
          buttonStyle={{ borderWidth: HairlineWidth * 3 }}
        />
      </Block>
    </Screen>
  );
};

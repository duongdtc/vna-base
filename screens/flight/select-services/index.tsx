/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { APP_SCREEN, RootStackParamList } from '@utils';
import {
  Button,
  Icon,
  Image,
  LazyPlaceholder,
  NormalHeader,
  Screen,
  Separator,
  Text,
} from '@vna-base/components';
import React, { useCallback, useEffect, useState } from 'react';
import { bs, createStyleSheet, useStyles } from '@theme';
import { ActiveOpacity, HitSlop, scale } from '@vna-base/utils';
import { goBack } from '@navigation/navigation-service';
import { useSelector } from 'react-redux';
import {
  selectIsLoadingAncillaries,
  selectServices,
} from '@vna-base/redux/selector';
import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native';
import { Ancillary } from '@services/axios/axios-data';
import cloneDeep from 'lodash.clonedeep';
import { images } from '@vna-base/assets/image';
import { UnistylesRuntime } from 'react-native-unistyles';

export const SelectServices = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.SELECT_SERVICES>) => {
  const { initData, onDone } = route.params;
  const { styles } = useStyles(styleSheet);

  const isLoading = useSelector(selectIsLoadingAncillaries);
  const services = useSelector(selectServices);

  const [ownerServices, setOwnerServices] = useState<
    Array<Ancillary & { selected?: boolean }>
  >([]);

  useEffect(() => {
    if (!initData.listSelected || initData.listSelected.length === 0) {
      setOwnerServices(services[initData.flight.index]);
    } else {
      const tempServices = cloneDeep(services[initData.flight.index]) as Array<
        Ancillary & { selected?: boolean }
      >;
      tempServices.forEach(service => {
        const i = initData.listSelected?.findIndex(
          serviceCode => serviceCode === service.Value,
        );
        if (i !== -1) {
          service.selected = true;
        }
      });

      setOwnerServices(tempServices);
    }
  }, [initData.listSelected, services]);

  const selectService = useCallback(
    (select: boolean, index: number) => {
      const tempServices = cloneDeep(ownerServices);
      tempServices[index].selected = select;
      setOwnerServices(tempServices);
    },
    [ownerServices],
  );

  const submit = () => {
    onDone({
      services: ownerServices.filter(service => service.selected),
      passengerIndex: initData.passengerIndex!,
      flightIndex: initData.flight.index!,
      segmentIndex: initData.segmentIndex!,
    });

    goBack();
  };

  const renderItem = useCallback<
    ListRenderItem<Ancillary & { selected?: boolean }>
  >(
    ({ item, index }) => (
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        onPress={() => selectService(!item?.selected, index)}
        style={styles.itemContainer}>
        <Image
          containerStyle={styles.img}
          source={images[item.image]}
          resizeMode="cover"
        />
        <View style={[bs.flex, bs.justifyCenter, bs.rowGap_4]}>
          <Text
            text={item.Name as string}
            fontStyle="Body14Semi"
            colorTheme="neutral100"
          />
          <Text fontStyle="Body14Bold" colorTheme="neutral100">
            {'+ '}
            <Text
              text={item.Price?.currencyFormat()}
              fontStyle="Body14Bold"
              colorTheme="price"
            />
          </Text>
        </View>
        <View style={bs.paddingLeft_12}>
          <Icon
            icon={
              item?.selected
                ? 'checkmark_square_fill'
                : 'checkmark_square_non_fill'
            }
            size={24}
            colorTheme={item?.selected ? 'primary500' : 'neutral20'}
          />
        </View>
      </TouchableOpacity>
    ),
    [selectService, styles.itemContainer],
  );

  return (
    <Screen backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        shadow=".3"
        colorTheme="neutral10"
        leftContent={
          <Button
            hitSlop={HitSlop.Large}
            type="common"
            size="small"
            leftIcon="arrow_ios_left_fill"
            textColorTheme="neutral100"
            leftIconSize={24}
            padding={4}
            onPress={() => goBack()}
          />
        }
        centerContent={
          <Text
            text="Chọn dịch vụ"
            fontStyle="H320Semi"
            colorTheme="neutral100"
          />
        }
      />
      {isLoading ? (
        <LazyPlaceholder style={bs.flex} />
      ) : (
        <View style={bs.flex}>
          <FlatList
            contentContainerStyle={styles.contentContainer}
            data={ownerServices}
            keyExtractor={(it, idx) => `${it.Value}_${idx}`}
            ItemSeparatorComponent={() => <Separator type="horizontal" />}
            renderItem={renderItem}
          />
        </View>
      )}
      <View style={styles.footer}>
        <Button
          fullWidth
          text="Xác nhận"
          textColorTheme="white"
          buttonColorTheme="gra1"
          onPress={submit}
        />
      </View>
    </Screen>
  );
};

const styleSheet = createStyleSheet(({ colors, spacings, shadows }) => ({
  container: {
    backgroundColor: colors.neutral10,
  },
  contentContainer: {
    paddingBottom: spacings[12],
  },
  itemContainer: {
    paddingVertical: spacings[12],
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacings[8],
    columnGap: spacings[8],
  },
  img: { width: scale(72), height: scale(52) },
  footer: {
    paddingBottom: UnistylesRuntime.insets.bottom,
    padding: spacings[12],
    backgroundColor: colors.neutral10,
    ...shadows.main,
  },
}));

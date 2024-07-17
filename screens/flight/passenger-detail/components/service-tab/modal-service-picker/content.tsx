import { Block, Button, Icon, Separator, Text } from '@vna-base/components';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { selectIsLoadingAncillaries, selectServices } from '@vna-base/redux/selector';
import { FlightOfPassengerForm } from '@vna-base/screens/flight/type';
import { Ancillary } from '@services/axios/axios-ibe';
import { ActiveOpacity } from '@vna-base/utils';
import cloneDeep from 'lodash.clonedeep';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  ActivityIndicator,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles, createStyleSheet } from '@theme';
import { UnistylesRuntime } from 'react-native-unistyles';
import { lightColors } from '@theme/unistyle-temp/colors/light';

type Props = {
  selectedServices: Array<string> | undefined | null;
  flight: FlightOfPassengerForm & { index: number };
  onDone: (services: Array<Ancillary>) => void;
};

export type ContentRef = { submit: () => void };

export const Content = forwardRef<ContentRef, Props>(
  ({ onDone, selectedServices, flight }, ref) => {
    const { styles } = useStyles(styleSheet);
    const isLoading = useSelector(selectIsLoadingAncillaries);
    const services = useSelector(selectServices);

    const [ownerServices, setOwnerServices] = useState<
      Array<Ancillary & { selected?: boolean }>
    >([]);

    useEffect(() => {
      if (!selectedServices || selectedServices.length === 0) {
        setOwnerServices(services[flight.index]);
      } else {
        const tempServices = cloneDeep(services[flight.index]) as Array<
          Ancillary & { selected?: boolean }
        >;
        tempServices.forEach(service => {
          const i = selectedServices?.findIndex(
            serviceCode => serviceCode === service.Value,
          );
          if (i !== -1) {
            service.selected = true;
          }
        });

        setOwnerServices(tempServices);
      }
    }, [selectedServices, services]);

    const selectService = useCallback(
      (select: boolean, index: number) => {
        const tempServices = cloneDeep(ownerServices);
        tempServices[index].selected = select;
        setOwnerServices(tempServices);
      },
      [ownerServices],
    );

    const submit = () => {
      onDone(ownerServices.filter(service => service.selected));
    };

    useImperativeHandle(
      ref,
      () => ({
        submit,
      }),
      [ownerServices],
    );

    const _renderItem = useCallback<
      ListRenderItem<Ancillary & { selected?: boolean }>
    >(
      ({ item, index }) => (
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => selectService(!item?.selected, index)}
          style={styles.itemContainer}>
          <Block rowGap={4} justifyContent="center" flex={1}>
            <Text
              text={item.Name as string}
              fontStyle="Body10Reg"
              colorTheme="neutral100"
            />
            <Text
              text={item.Price?.currencyFormat()}
              fontStyle="Body14Semi"
              colorTheme="price"
            />
          </Block>
          <Block paddingLeft={12}>
            <Icon
              icon={
                item?.selected
                  ? 'checkmark_square_fill'
                  : 'checkmark_square_non_fill'
              }
              size={24}
              colorTheme={item?.selected ? 'primaryColor' : 'neutral50'}
            />
          </Block>
        </TouchableOpacity>
      ),
      [selectService, styles.itemContainer],
    );

    return (
      <Block flex={1}>
        {isLoading ? (
          <Block flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="small" color={lightColors.primaryColor} />
          </Block>
        ) : (
          <BottomSheetFlatList<Ancillary & { selected?: boolean }>
            keyboardShouldPersistTaps="handled"
            data={ownerServices}
            renderItem={_renderItem}
            ItemSeparatorComponent={() => <Separator type="horizontal" />}
            keyExtractor={(item, index) => index.toString() + item.Value}
            contentContainerStyle={styles.contentContainer}
          />
        )}
        <Block
          flexDirection="row"
          alignItems="center"
          colorTheme="neutral100"
          shadow="main"
          style={styles.footerContainer}>
          <Button
            fullWidth
            t18n="common:confirm"
            onPress={submit}
            size="medium"
            buttonStyle={styles.btn}
            textColorTheme="white"
            buttonColorTheme="graPre"
          />
        </Block>
      </Block>
    );
  },
);

const styleSheet = createStyleSheet(({ spacings }) => ({
  itemContainer: {
    paddingVertical: spacings[12],
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: spacings[12],
  },
  footerContainer: { paddingBottom: UnistylesRuntime.insets.bottom },
  btn: { margin: spacings[12] },
}));

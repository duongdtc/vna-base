import { Block, Button, Icon, Separator, Text } from '@vna-base/components';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import {
  selectCurrentFeature,
  selectIsLoadingAncillariesActionBooking,
  selectServicesActionBooking,
} from '@vna-base/redux/selector';
import { Flight } from '@services/axios/axios-data';
import { Ancillary } from '@services/axios/axios-ibe';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { ColorLight } from '@theme/color';
import { ActiveOpacity, BookingStatus } from '@vna-base/utils';
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
import { useStyles } from './styles';

type Props = {
  oldServices: Array<Ancillary>;
  selectedServices: Array<string> | undefined | null;
  flight: Flight & { index: number };
  onDone: (services: Array<Ancillary>) => void;
};

export type ContentRef = { submit: () => void };

export const Content = forwardRef<ContentRef, Props>(
  ({ onDone, selectedServices, flight, oldServices }, ref) => {
    const styles = useStyles();
    const { bookingId } = useSelector(selectCurrentFeature);
    const isLoading = useSelector(selectIsLoadingAncillariesActionBooking);
    const services = useSelector(selectServicesActionBooking);
    const bookingDetail = useObject<BookingRealm>(
      BookingRealm.schema.name,
      bookingId,
    );

    const [ownerServices, setOwnerServices] = useState<
      Array<Ancillary & { selected?: boolean }>
    >([]);

    useEffect(() => {
      // if (!selectedServices || selectedServices.length === 0) {
      //   setOwnerServices(services[flight.index]);
      // } else {
      const tempServices = cloneDeep([
        ...new Set([...oldServices, ...services[flight.index]]),
      ]) as Array<Ancillary & { selected?: boolean }>;

      tempServices.forEach(service => {
        const i = selectedServices?.findIndex(
          serviceCode => serviceCode === service.Value,
        );

        if (i !== -1) {
          service.selected = true;
        }
      });

      setOwnerServices(tempServices);
      // }
    }, [flight.index, oldServices, selectedServices, services]);

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

    const isTicketed = bookingDetail?.BookingStatus === BookingStatus.TICKETED;

    const _renderItem = useCallback<
      ListRenderItem<Ancillary & { selected?: boolean; isInit?: boolean }>
    >(
      ({ item, index }) => (
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          disabled={isTicketed && item.isInit}
          onPress={() => selectService(!item?.selected, index)}
          style={[
            styles.itemContainer,
            isTicketed && item.isInit && { opacity: 0.6 },
          ]}>
          <Block rowGap={4} justifyContent="center" flex={1}>
            <Text
              text={item.Name as string}
              fontStyle="Capture11Reg"
              colorTheme="neutral900"
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
              colorTheme={item?.selected ? 'primary500' : 'neutral50'}
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
            <ActivityIndicator size="small" color={ColorLight.primary500} />
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
            buttonStyle={styles.btn}
            buttonColorTheme="primary600"
          />
        </Block>
      </Block>
    );
  },
);

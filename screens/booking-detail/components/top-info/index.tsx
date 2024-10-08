import {
  Block,
  BottomSheet,
  Icon,
  LinearGradient,
  TerminalView,
  Text,
} from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { PREFIX_BOOKING_VIEW } from '@env';
import { FormBookingDetail } from '@vna-base/screens/booking-detail/type';
import {
  ActiveOpacity,
  BookingStatus,
  BookingStatusDetails,
  Gender,
  getPassengerTitle,
  PassengerType,
  SnapPoint,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { useCallback, useRef } from 'react';
import {
  FieldArrayWithId,
  useController,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { BookingView } from './booking-view';
import { useStyles } from './styles';

export const TopInfo = ({
  info: { expirationDate, timePurchase, bookingDate },
}: {
  info: {
    expirationDate: string | null | undefined;
    timePurchase: string | null | undefined;
    bookingDate: string | null | undefined;
  };
}) => {
  const styles = useStyles();

  const bookingViewBottomSheetRef = useRef<NormalRef>(null);
  const { control } = useFormContext<FormBookingDetail>();

  const {
    field: { value: status },
  } = useController({
    control,
    name: 'BookingStatus',
  });

  const { fields } = useFieldArray({ control, name: 'Passengers' });

  const statusDetail = BookingStatusDetails[status];

  const isExpired = dayjs(expirationDate).isBefore(dayjs());

  const renderItem = useCallback<
    ListRenderItem<FieldArrayWithId<FormBookingDetail, 'Passengers', 'id'>>
  >(
    ({ item }) => (
      <Block
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        columnGap={8}>
        <Block flex={1}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            fontStyle="Body14Semi"
            colorTheme="primaryPressed">
            {`${item.Surname},${item.GivenName} `}
            <Text
              text={getPassengerTitle({
                type: item.PaxType as PassengerType,
                gender: item.Gender as Gender,
              })}
              fontStyle="Body14Semi"
              colorTheme="neutral100"
            />
          </Text>
        </Block>
        {item.BirthDate && (
          <Text
            text={dayjs(item.BirthDate).format('DD/MM/YYYY')}
            fontStyle="Body12Reg"
            colorTheme="neutral100"
          />
        )}
      </Block>
    ),
    [],
  );

  return (
    <Block rowGap={16} paddingHorizontal={16}>
      <Block rowGap={4}>
        <Block flexDirection="row" alignItems="center" columnGap={2}>
          <Icon icon="timer_fill" size={12} colorTheme="neutral600" />
          <Text
            fontStyle="Body12Med"
            colorTheme="neutral600"
            text={dayjs(bookingDate).format('HH:mm DD/MM/YYYY')}
          />
        </Block>
        <Block flexDirection="row" columnGap={12}>
          <Block style={[styles.headerBtn, styles.stateBtn]}>
            <Block flexDirection="row" alignItems="center" columnGap={8}>
              <Icon
                icon={statusDetail?.icon}
                colorTheme={statusDetail?.iconColorTheme}
                size={16}
              />
              <Text
                fontStyle="Body14Reg"
                colorTheme="neutral900"
                t18n={statusDetail?.t18n}
              />
            </Block>
          </Block>
          <TouchableOpacity
            onPress={() => {
              bookingViewBottomSheetRef.current?.present();
            }}
            style={[styles.headerBtn, styles.actionBtn]}
            activeOpacity={ActiveOpacity}>
            <LinearGradient style={StyleSheet.absoluteFillObject} type="001" />
            <Icon icon="browser_outline" size={20} colorTheme="white" />
            <Text
              t18n="booking:booking_view"
              fontStyle="Body14Semi"
              colorTheme="white"
            />
          </TouchableOpacity>
        </Block>
        <BottomSheet
          useDynamicSnapPoint={false}
          ref={bookingViewBottomSheetRef}
          type="normal"
          snapPoints={[SnapPoint['65%']]}
          showCloseButton={false}
          showIndicator={true}>
          <TerminalView
            useInBottomSheet={true}
            prefixExportName={PREFIX_BOOKING_VIEW}
            cb={() => {
              bookingViewBottomSheetRef.current?.dismiss();
            }}>
            <BookingView />
          </TerminalView>
        </BottomSheet>
      </Block>
      {(!!timePurchase || !!expirationDate) &&
        statusDetail?.key !== BookingStatus.TICKETED && (
          <Block
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between">
            <Block flex={1} rowGap={4}>
              {expirationDate && (
                <>
                  <Block flexDirection="row" alignItems="center" columnGap={4}>
                    <Text
                      t18n="booking:reservation_deadline"
                      fontStyle="Body12Med"
                      colorTheme="neutral600"
                    />
                    <Icon
                      icon="plane_timer_fill"
                      size={12}
                      colorTheme="neutral600"
                    />
                  </Block>
                  <Text
                    colorTheme={isExpired ? 'error600' : 'success600'}
                    fontStyle="Body16Reg">
                    {`${dayjs(expirationDate).format('DD/MM/YYYY ')}`}
                    <Text
                      colorTheme={isExpired ? 'error600' : 'success600'}
                      fontStyle="Title16Bold"
                      text={dayjs(expirationDate).format(' HH:mm')}
                    />
                  </Text>
                </>
              )}
            </Block>
            <Block flex={1} alignItems="flex-end" rowGap={4}>
              {timePurchase && (
                <>
                  <Block flexDirection="row" alignItems="center" columnGap={4}>
                    <Icon icon="timer_fill" size={12} colorTheme="neutral600" />
                    <Text
                      t18n="booking:price_hold_deadline"
                      fontStyle="Body12Med"
                      colorTheme="neutral600"
                    />
                  </Block>
                  <Text
                    colorTheme={isExpired ? 'error600' : 'primary600'}
                    fontStyle="Body16Reg">
                    {`${dayjs(timePurchase).format('DD/MM/YYYY ')}`}
                    <Text
                      colorTheme={isExpired ? 'error600' : 'primary600'}
                      fontStyle="Title16Bold"
                      text={dayjs(timePurchase).format(' HH:mm')}
                    />
                  </Text>
                </>
              )}
            </Block>
          </Block>
        )}

      <FlatList
        data={fields}
        keyExtractor={it => it.id}
        ItemSeparatorComponent={() => <Block height={8} />}
        renderItem={renderItem}
      />
    </Block>
  );
};

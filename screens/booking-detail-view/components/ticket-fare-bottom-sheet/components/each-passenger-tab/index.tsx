import { Block, Text } from '@vna-base/components';
import { DEFAULT_CURRENCY } from '@env';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { selectViewingBookingVersion } from '@redux-selector';
import { FlightPassengerWithCharge } from '@vna-base/screens/booking-detail/type';
import { FareCode } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { memo, useCallback, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { ListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';
import { PassengerItem } from './passenger-item';
import { useStyles } from './styles';

export const EachPassengerTab = memo(() => {
  const styles = useStyles();
  const [t] = useTranslation();

  const bookingDetail = useSelector(selectViewingBookingVersion);

  const formattedDataCharge = useMemo<Array<FlightPassengerWithCharge>>(
    () =>
      bookingDetail?.Passengers?.map(passenger => {
        const fee = bookingDetail?.Charges?.filter(
          charge => charge.PassengerId === passenger.Id,
        ).reduce(
          (total, currCharge) => {
            switch (currCharge.ChargeType) {
              case FareCode.TICKET_FARE:
                total.ticketFare = total.ticketFare + (currCharge.Amount ?? 0);

                break;
              case FareCode.TICKET_TAX:
                total.ticketTax = total.ticketTax + (currCharge.Amount ?? 0);

                break;
              case FareCode.SERVICE_FEE:
                total.serviceFee = total.serviceFee + (currCharge.Amount ?? 0);

                break;
              case FareCode.DISCOUNT:
                total.discount = total.discount + (currCharge.Amount ?? 0);

                break;
            }

            return total;
          },
          {
            ticketFare: 0,
            ticketTax: 0,
            serviceFee: 0,
            discount: 0,
          },
        );

        return { ...passenger, ...fee } as FlightPassengerWithCharge;
      }) ?? [],
    [bookingDetail],
  );

  const totalTicketFare = useMemo(() => {
    if (isEmpty(bookingDetail)) {
      return 0;
    }

    return (
      bookingDetail.Charges?.reduce(
        (total, charge) =>
          total +
          (charge.ChargeType === FareCode.TICKET_FARE ? charge.Amount ?? 0 : 0),
        0,
      ) ?? 0
    );
  }, [bookingDetail]);

  const renderItemCharge = useCallback<
    ListRenderItem<FlightPassengerWithCharge>
  >(({ item }) => {
    return <PassengerItem {...item} />;
  }, []);

  const footerInfoPriceTicketCharge = () => {
    return (
      <Block
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        colorTheme="neutral100"
        marginTop={12}
        borderRadius={12}
        padding={12}>
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          <Text
            t18n="booking:total"
            fontStyle="Body14Semi"
            colorTheme="primary600"
          />
          <Text
            text={`(${t('booking:only_ticket_prices')}):`}
            fontStyle="Body14Reg"
            colorTheme="neutral600"
          />
        </Block>
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          <Text fontStyle="Title20Semi" colorTheme="price">
            {totalTicketFare.currencyFormat()}{' '}
            <Text text={DEFAULT_CURRENCY} colorTheme="neutral800" />
          </Text>
        </Block>
      </Block>
    );
  };

  return (
    <Block flex={1} colorTheme="neutral50">
      <BottomSheetFlatList
        data={Object.values(formattedDataCharge)}
        renderItem={renderItemCharge}
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={() => <Block height={12} />}
        ListFooterComponent={footerInfoPriceTicketCharge}
        contentContainerStyle={styles.contentContainer}
      />
    </Block>
  );
}, isEqual);

/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IconTypes } from '@assets/icon';
import { Block, Icon, Separator, Text } from '@vna-base/components';
import { LOGO_URL } from '@env';
import { navigate } from '@navigation/navigation-service';
import {
  selectCustomFeeTotal,
  selectListRoute,
  selectVerifiedFlights,
} from '@vna-base/redux/selector';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { FlightFare } from '@services/axios/axios-ibe';
import { AirlineRealm } from '@services/realm/models';
import { useRealm } from '@services/realm/provider';
import { I18nKeys } from '@translations/locales';
import { translate } from '@vna-base/translations/translate';
import {
  ActiveOpacity,
  getFareFromFareOption,
  getState,
  HitSlop,
  PassengerType,
} from '@vna-base/utils';
import React, { memo, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { createStyleSheet, useStyles } from '@theme';
import { APP_SCREEN } from '@utils';

export const RouteItem = memo(({ item }: { item: FlightFare }) => {
  const { styles } = useStyles(styleSheet);
  const realm = useRealm();

  const routes = useSelector(selectListRoute);
  const verifiedFlights = useSelector(selectVerifiedFlights);

  const {
    PriceAdt: NetFare,
    PriceChd: NetFareCHD,
    PriceInf: NetFareINF,
  } = useSelector(selectCustomFeeTotal);

  const { getValues } = useFormContext<PassengerForm>();

  const isCombineFlight = (verifiedFlights[0].Itinerary ?? 1) > 1;

  const customFee = {
    ADT: isCombineFlight ? routes.length * NetFare : NetFare,
    CHD: isCombineFlight ? routes.length * NetFareCHD : NetFareCHD,
    INF: isCombineFlight ? routes.length * NetFareINF : NetFareINF,
  };

  const airline = realm.objectForPrimaryKey<AirlineRealm>(
    AirlineRealm.schema.name,
    item.Airline!,
  );

  const fare = getFareFromFareOption(item.FareInfo!);

  const numPassengers: Record<
    PassengerType,
    { count: number; t18n: I18nKeys; netFare: number }
  > = {
    ADT: {
      count: 0,
      t18n: 'flight:adult',
      netFare: fare.ADT.NetFare,
    },
    CHD: {
      count: 0,
      t18n: 'flight:children',
      netFare: fare?.CHD?.NetFare ?? 0,
    },
    INF: {
      count: 0,
      t18n: 'flight:infant',
      netFare: fare?.INF?.NetFare ?? 0,
    },
  };

  getValues('Passengers').forEach(passenger => {
    numPassengers[passenger.Type].count =
      numPassengers[passenger.Type].count + 1;
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  Object.keys(numPassengers).forEach((key: keyof typeof PassengerType) => {
    numPassengers[key].netFare =
      (numPassengers[key].netFare + customFee[key]) * numPassengers[key].count;
  });

  //  giá + thuế phí cho 1 ng x số ng
  const netFare = Object.values(numPassengers).reduce(
    (total, currPassenger) => total + currPassenger.netFare,
    0,
  );

  // TODO: chưa biết phải truyền AirlineOptionId, FlightOptionId như nào
  const navToDetail = () => {
    const { session: sessions } = getState('flightResult');
    navigate(APP_SCREEN.INFO_TICKET, {
      fareOption: item.FareInfo!,
      ticketInfo: {
        // truyền tạm
        AirlineOptionId: 1,
        FlightOptionId: 1,

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        Session: sessions[item.System] as string,
        System: 'VN',
        Itinerary: verifiedFlights[0].Itinerary ?? 1,
        verifySession: item.Session!,
      },
    });
  };

  const aiport = useMemo<{
    icon: IconTypes;
    startPoint: string;
    endPoint: string;
  }>(() => {
    if (!item.ListFlight || item.ListFlight.length === 0) {
      return {
        startPoint: '',
        endPoint: '',
        icon: 'arrow_right_fill',
      };
    }

    if (item.ListFlight?.length === 1) {
      return {
        startPoint: item.ListFlight[0].StartPoint!,
        endPoint: item.ListFlight[0].EndPoint!,
        icon: 'arrow_right_fill',
      };
    }

    if (
      item.ListFlight?.length === 2 &&
      item.ListFlight[0].StartPoint === item.ListFlight[1].EndPoint &&
      item.ListFlight[0].EndPoint === item.ListFlight[1].StartPoint
    ) {
      return {
        startPoint: item.ListFlight[0].StartPoint!,
        endPoint: item.ListFlight[0].EndPoint!,
        icon: 'swap_fill',
      };
    }

    return {
      startPoint: item.ListFlight[0].StartPoint!,
      endPoint: item.ListFlight[item.ListFlight?.length - 1].EndPoint!,
      icon: 'f_arrow_list_transit',
    };
  }, [item.ListFlight]);

  return (
    <Block borderRadius={8} padding={16} colorTheme="neutral100" rowGap={16}>
      <Block
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <Block flexDirection="row" columnGap={4} alignItems="center">
          <Block width={20} height={20} borderRadius={8} overflow="hidden">
            <SvgUri
              width={20}
              height={20}
              uri={LOGO_URL + item.Airline + '.svg'}
            />
          </Block>
          <Text
            fontStyle="Body12Reg"
            colorTheme="neutral100"
            text={airline?.NameVi ?? airline?.NameEn}
          />
        </Block>
        <Block
          flexDirection="row"
          alignItems="center"
          paddingVertical={2}
          columnGap={2}>
          <Text
            fontStyle="Body12Bold"
            text={aiport.startPoint}
            colorTheme="neutral100"
          />
          <Icon icon={aiport.icon} size={12} colorTheme="neutral100" />
          <Text
            fontStyle="Body12Bold"
            text={aiport.endPoint}
            colorTheme="neutral100"
          />
        </Block>
      </Block>
      <Separator type="horizontal" />
      <Block>
        {Object.values(numPassengers).map((passenger, index) =>
          passenger.count ? (
            <Block
              key={index}
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Text
                fontStyle="Body14Reg"
                colorTheme="neutral80"
                text={`${translate(passenger.t18n)} x ${passenger.count}`}
              />
              <Text
                fontStyle="Body14Semi"
                colorTheme="neutral100"
                text={passenger.netFare.currencyFormat()}
              />
            </Block>
          ) : null,
        )}
      </Block>
      <Separator type="horizontal" />
      <Block
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          hitSlop={HitSlop.Large}
          style={styles.detailContainer}
          onPress={navToDetail}>
          <Text
            t18n="common:detail"
            colorTheme="primaryColor"
            fontStyle="Body10Reg"
          />
          <Icon icon="external_link_fill" colorTheme="primaryColor" size={12} />
        </TouchableOpacity>
        <Text
          text={netFare.currencyFormat()}
          fontStyle="Body16Bold"
          colorTheme="price"
        />
      </Block>
    </Block>
  );
}, isEqual);

const styleSheet = createStyleSheet(({ colors, spacings }) => ({
  detailContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacings[12],
    paddingVertical: spacings[6],
    columnGap: spacings[2],
    borderRadius: spacings[12],
    backgroundColor: colors.neutral20,
  },
}));

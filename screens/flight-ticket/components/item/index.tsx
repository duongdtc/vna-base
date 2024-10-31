/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { images } from '@assets/image';
import { Ticket } from '@services/axios/axios-data';
import { AirlineRealm, FlightTicketInList } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { useTheme } from '@theme';
import { Block, Icon, Image, Text } from '@vna-base/components';
import { selectAccount, selectLanguage } from '@vna-base/redux/selector';
import { translate } from '@vna-base/translations/translate';
import {
  TicketType,
  TicketTypeDetails,
  WindowWidth,
  scale,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React from 'react';
import { Pressable } from 'react-native';
import { Circle, Line, Svg } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';

export type Props = {
  // bắt buộc phải truyền 1 trong 2 : id hoặc item
  id?: string;
  item?: Ticket;
};

export const Item = (props: Props) => {
  const styles = useStyles();

  const { id, item } = props;
  const { colors } = useTheme();
  const lng = useSelector(selectLanguage);

  const TicketDetail = (
    id
      ? realmRef.current?.objectForPrimaryKey<FlightTicketInList>(
          FlightTicketInList.schema.name,
          id,
        ) ?? {}
      : item
  ) as Ticket;

  const issueUser = useSelector(selectAccount(TicketDetail!.IssueUser!));

  const airline = TicketDetail!.Airline
    ? realmRef.current?.objectForPrimaryKey<AirlineRealm>(
        AirlineRealm.schema.name,
        TicketDetail!.Airline as string,
      )
    : undefined;

  const onPress = () => {};

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Block rowGap={12} paddingHorizontal={12}>
        <Block flexDirection="row" alignItems="center" columnGap={12}>
          <Block width={36} height={36} borderRadius={8} overflow="hidden">
            <Image
              source={images.logo_vna}
              style={{ width: scale(36), height: scale(36) }}
            />
          </Block>
          <Block rowGap={2} flex={1}>
            <Text
              colorTheme="primary600"
              fontStyle="Title16Bold"
              text={TicketDetail!.Airline + ': ' + TicketDetail!.TicketNumber}
              numberOfLines={1}
              ellipsizeMode="tail"
            />
            <Text
              colorTheme="neutral800"
              fontStyle="Capture11Reg"
              text={lng === 'en' ? airline?.NameEn : airline?.NameVi}
              numberOfLines={1}
              ellipsizeMode="tail"
            />
          </Block>
          <Block
            paddingVertical={4}
            paddingHorizontal={8}
            borderRadius={4}
            colorTheme={
              TicketTypeDetails[TicketDetail!.TicketType as TicketType]
                ?.bgColorTheme
            }>
            <Text
              t18n={
                TicketTypeDetails[TicketDetail!.TicketType as TicketType]?.t18n
              }
              colorTheme="neutral900"
              fontStyle="Body12Med"
            />
          </Block>
        </Block>
        <Block flexDirection="row" alignItems="flex-end" columnGap={4}>
          <Block flex={1}>
            <Text
              fontStyle="Capture11Reg"
              colorTheme="neutral800"
              numberOfLines={1}
              ellipsizeMode="tail">
              {translate('flight_ticket:issue_user')}
              {': '}
              <Text
                fontStyle="Capture11Bold"
                colorTheme="neutral800"
                text={issueUser?.FullName ?? ''}
              />
            </Text>
          </Block>
          <Text
            text={
              translate('flight_ticket:issue_date') +
              ': ' +
              dayjs(TicketDetail!.IssueDate).format('DD/MM/YYYY')
            }
            fontStyle="Capture11Reg"
            colorTheme="neutral800"
          />
          <Text
            text={dayjs(TicketDetail!.IssueDate).format('HH:MM')}
            fontStyle="Capture11Bold"
            colorTheme="price"
          />
        </Block>
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          <Icon icon="person_fill" size={14} colorTheme="neutral700" />
          <Text
            t18n="flight_ticket:passenger"
            colorTheme="neutral700"
            fontStyle="Body12Med"
          />
          <Block flex={1} alignItems="flex-end">
            <Text
              text={TicketDetail!.FullName ?? ''}
              fontStyle="Body14Semi"
              colorTheme="neutral900"
            />
          </Block>
          {TicketDetail!.PaxType && (
            <Text
              text={'- ' + TicketDetail!.PaxType}
              fontStyle="Body14Reg"
              colorTheme="neutral900"
            />
          )}
        </Block>
      </Block>
      <Svg height={25} width={WindowWidth - scale(23)}>
        <Circle cx="0" cy="12" r="10" fill={colors.neutral50} />
        <Line
          key={Math.random()}
          x1={0}
          y1={12}
          x2={WindowWidth - scale(24)}
          y2={12}
          stroke={colors.neutral50}
          strokeDasharray="10, 6"
          strokeWidth={1}
        />
        <Circle
          cx={WindowWidth - scale(24)}
          cy="12"
          r="10"
          fill={colors.neutral50}
        />
      </Svg>
      <Block
        paddingHorizontal={12}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          <Icon icon="coin_fill" size={16} colorTheme="neutral700" />
          <Text
            t18n="flight_ticket:total_price"
            colorTheme="neutral600"
            fontStyle="Body12Med"
          />
        </Block>
        <Text
          text={(TicketDetail.Total ?? 0)?.currencyFormat()}
          colorTheme="price"
          fontStyle="Title16Bold"
        />
      </Block>
    </Pressable>
  );
};

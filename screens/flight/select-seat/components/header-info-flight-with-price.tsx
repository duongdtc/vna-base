/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block, Icon, Text } from '@vna-base/components';
import { BlockProps } from '@vna-base/components/block/type';
import { LOGO_URL } from '@env';
import { Segment } from '@services/axios/axios-ibe';
import { AirlineRealm } from '@services/realm/models';
import { useObject } from '@services/realm/provider';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { SvgUri } from 'react-native-svg';

export const HeaderInfoFlightWithPrice = memo(
  (props: { segment: Segment } & BlockProps) => {
    const { segment, ...rest } = props;

    const airline = useObject<AirlineRealm>(
      AirlineRealm.schema.name,
      segment.Airline as string,
    );

    return (
      <Block
        flexDirection="row"
        alignItems="center"
        paddingHorizontal={12}
        paddingVertical={8}
        shadow="small"
        zIndex={999}
        colorTheme="neutral100"
        justifyContent="space-between"
        {...rest}>
        <Block
          flexDirection="row"
          flex={1}
          alignItems="center"
          justifyContent="space-between">
          <Block flexDirection="row" alignItems="center" columnGap={4}>
            <Block width={20} height={20} borderRadius={4} overflow="hidden">
              <SvgUri
                width={20}
                height={20}
                uri={LOGO_URL + segment.Airline + '.svg'}
              />
            </Block>
            <Text
              text={airline?.NameVi ?? airline?.NameEn}
              fontStyle="Body12Reg"
              colorTheme="neutral900"
            />
          </Block>
          <Block
            flexDirection="row"
            alignItems="center"
            paddingHorizontal={8}
            paddingVertical={2}
            borderRadius={4}
            columnGap={2}>
            <Text
              fontStyle="Body12Bold"
              text={segment.StartPoint as string}
              colorTheme="primary900"
            />
            <Icon icon="arrow_right_fill" size={12} colorTheme="primary900" />
            <Text
              fontStyle="Body12Bold"
              text={segment.EndPoint as string}
              colorTheme="primary900"
            />
          </Block>
        </Block>
      </Block>
    );
  },
  isEqual,
);

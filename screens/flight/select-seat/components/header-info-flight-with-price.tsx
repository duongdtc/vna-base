/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { images } from '@assets/image';
import { Segment } from '@services/axios/axios-ibe';
import { AirlineRealm } from '@services/realm/models';
import { useObject } from '@services/realm/provider';
import { Block, Icon, Image, Text } from '@vna-base/components';
import { BlockProps } from '@vna-base/components/block/type';
import { scale } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';

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
              <Image
                source={images.logo_vna}
                style={{ width: scale(20), height: scale(20) }}
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

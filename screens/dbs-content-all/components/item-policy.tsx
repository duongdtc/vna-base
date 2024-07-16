import { images } from '@assets/image';
import { Block, Icon, Image, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { Content } from '@services/axios/axios-email';
import { WindowWidth } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable } from 'react-native';
import { APP_SCREEN } from '@utils';

type Props = {
  item: Content;
};

export const ItemPolicy = memo((props: Props) => {
  const { item } = props;

  const _onPressDetail = () => {
    navigate(APP_SCREEN.DBS_CONTENT_DETAIL, { id: item.Id! });
  };

  return (
    <Pressable onPress={_onPressDetail}>
      <Block rowGap={8}>
        <Block
          width={WindowWidth - 32}
          height={170}
          overflow="hidden"
          borderRadius={12}>
          <Image
            source={item.Image ?? images.image_default_news}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </Block>
        <Block rowGap={4}>
          <Text
            text={item.Title as string}
            numberOfLines={1}
            fontStyle="Body14Semi"
            colorTheme="neutral900"
          />
          <Block flexDirection="row" alignItems="center" columnGap={2}>
            <Icon icon="clock_outline" size={14} colorTheme="neutral600" />
            <Text
              text={dayjs(item.CreatedDate).format('HH:mm - DD/MM')}
              numberOfLines={1}
              fontStyle="Body12Reg"
              colorTheme="neutral600"
            />
          </Block>
        </Block>
      </Block>
    </Pressable>
  );
}, isEqual);

import { images } from '@assets/image';
import { Icon, Image, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { Content } from '@services/axios/axios-email';
import { createStyleSheet, useStyles, bs } from '@theme';
import { WindowWidth, scale } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable, View } from 'react-native';
import { APP_SCREEN } from '@utils';

type Props = {
  item: Content;
};

export const ItemNews = memo((props: Props) => {
  const { item } = props;
  const { styles } = useStyles(styleSheet);

  const _onPressDetail = () => {
    navigate(APP_SCREEN.BANNER_AND_NEWS_DETAIL, { id: item.Id! });
  };

  return (
    <Pressable onPress={_onPressDetail}>
      <View style={[styles.itemContainer, bs.rowGap_8]}>
        <View style={[styles.img, bs.borderRadius_12]}>
          <Image
            source={item.Image ?? images.image_default}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </View>
        <View style={[bs.rowGap_4]}>
          <Text
            text={item.Title as string}
            numberOfLines={2}
            fontStyle="Body14Semi"
            colorTheme="neutral100"
          />
          <View
            style={[
              bs.flexDirectionRow,
              bs.columnGap_2,
              { alignItems: 'center' },
            ]}>
            <Icon icon="calendar_outline" size={14} colorTheme="neutral60" />
            <Text
              text={dayjs(item.CreatedDate).format('HH:mm - DD/MM')}
              numberOfLines={1}
              fontStyle="Body12Reg"
              colorTheme="neutral60"
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}, isEqual);

const styleSheet = createStyleSheet(() => ({
  itemContainer: {
    width: (WindowWidth - scale(48)) / 2,
  },
  img: {
    width: '100%',
    height: scale(170),
    overflow: 'hidden',
  },
}));

import { images } from '@assets/image';
import {
  Block,
  EmptyList,
  Icon,
  Image,
  Text,
  TextInputAutoHeight,
} from '@vna-base/components';
import { getAccount, selectListOrderRemark } from '@redux-selector';
import { orderActions } from '@redux-slice';
import { Remark } from '@services/axios/axios-data';
import { useTheme } from '@theme';
import { translate } from '@vna-base/translations/translate';
import { delay, dispatch } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import {
  FlatList,
  ListRenderItem,
  Platform,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useSoftInputHeightChanged } from 'react-native-avoid-softinput';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { useStyles } from '../../style';

export const TabNote = memo(({ id }: { id: string }) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const listRemarkRef = useRef<FlatList>(null);

  const listRemark = useSelector(selectListOrderRemark);

  const [remark, setRemark] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    dispatch(orderActions.getListRemarkByOrderId(id));
  }, []);

  const insertRemark = useCallback(() => {
    dispatch(orderActions.insertRemark(remark));
    setRemark('');
  }, [remark]);

  const pullToRefresh = () => {
    setIsRefreshing(true);
    dispatch(
      orderActions.getListRemarkByOrderId(id, () => {
        setIsRefreshing(false);
      }),
    );
  };

  useEffect(() => {
    if (listRemark.length > 0) {
      listRemarkRef.current?.scrollToIndex({
        index: listRemark.length - 1,
        animated: true,
      });
    }
  }, [listRemark]);

  const buttonContainerPaddingValue = useSharedValue(0);

  const buttonContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: buttonContainerPaddingValue.value,
    };
  });

  useSoftInputHeightChanged(({ softInputHeight }) => {
    buttonContainerPaddingValue.value = withTiming(
      softInputHeight - (Platform.OS === 'ios' ? 30 : 0),
      {
        duration: 200,
      },
    );
  });

  const renderItem = useCallback<ListRenderItem<Remark>>(
    ({ item, index }) => {
      const account = getAccount(item.UserId);

      return (
        <Block
          key={index}
          paddingHorizontal={16}
          paddingVertical={12}
          borderRadius={8}
          flexDirection="row"
          colorTheme="neutral100"
          justifyContent="space-between">
          <Block flexDirection="row" alignItems="center" columnGap={12}>
            <Block>
              <Image
                source={account?.Photo ?? images.default_avatar}
                style={styles.avatarImg}
                resizeMode="cover"
              />
            </Block>
            <Block rowGap={4}>
              <Text
                text={item.CreatedName?.toString()}
                fontStyle="Title16Semi"
                colorTheme="neutral900"
              />
              <Text
                text={item.Message?.toString()}
                fontStyle="Body16Reg"
                colorTheme="neutral900"
              />
            </Block>
          </Block>
          <Text
            text={dayjs(item.CreatedDate).format('HH:mm DD/MM')}
            fontStyle="Body12Reg"
            colorTheme="neutral600"
          />
        </Block>
      );
    },
    [styles],
  );

  return (
    <Block flex={1}>
      <FlatList
        ref={listRemarkRef}
        data={listRemark}
        keyExtractor={(item, index) => `${item.Id}_${index}`}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={pullToRefresh}
            tintColor={colors.neutral900}
          />
        }
        ListEmptyComponent={
          <EmptyList
            height={400}
            image="emptyListFlight"
            imageStyle={{ width: 192, height: 101 }}
            t18nTitle="common:no_data"
          />
        }
        ItemSeparatorComponent={() => <Block height={8} />}
        contentContainerStyle={styles.remarkContentContainer}
        onScrollToIndexFailed={async info => {
          await delay(200);

          listRemarkRef.current?.scrollToIndex({
            index: info.index,
            animated: true,
          });
        }}
      />
      <Animated.View
        style={[buttonContainerAnimatedStyle, styles.footerContainerWrapper]}>
        <Block style={[styles.bottomContainer]}>
          <TextInputAutoHeight
            fontStyle="Body16Reg"
            styleInput={styles.textInput}
            right={
              <Pressable
                onPress={insertRemark}
                disabled={!remark || remark === ''}>
                <Icon
                  icon="message_square_fill"
                  colorTheme="primary600"
                  size={24}
                />
              </Pressable>
            }
            textAlignVertical="center"
            placeholder={translate('order_detail:insert_remark_plh')}
            value={remark}
            maxLength={100}
            onChangeText={setRemark}
          />
        </Block>
      </Animated.View>
    </Block>
  );
}, isEqual);

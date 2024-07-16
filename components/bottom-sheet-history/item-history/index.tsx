import { images } from '@assets/image';
import { Block, Button, Icon, Image, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { getAccount, selectDetailHistory } from '@redux-selector';
import { historyActions } from '@redux-slice';
import { History } from '@services/axios/axios-data';
import { APP_SCREEN, System, SystemDetails, dispatch, scale } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo, useCallback, useState } from 'react';
import isEqual from 'react-fast-compare';
import { LayoutAnimation, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { DetailItemHistory } from './detail-content-history';

type Props = {
  item: History;
  disabled: boolean;
  isShowBookingInfo: boolean;
};

export const ItemHistory = memo((props: Props) => {
  const { item, disabled, isShowBookingInfo } = props;

  const detailHistory = useSelector(selectDetailHistory(item.Id!));
  const user = getAccount(item.CreatedUser);

  const [isShowDetail, setShowDetail] = useState(false);

  const _onToggleDetail = useCallback(() => {
    if (detailHistory === undefined) {
      dispatch(historyActions.getDetailHistory(item.Id!));
    }

    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 100,
    });
    setShowDetail(!isShowDetail);
  }, [detailHistory, isShowDetail, item.Id]);

  return (
    <Block paddingHorizontal={12}>
      <Pressable onPress={_onToggleDetail} disabled={disabled}>
        <Block flexDirection="row" columnGap={12}>
          <Block
            flex={1}
            maxWidth={34}
            maxHeight={34}
            borderWidth={10}
            borderColorTheme="neutral200"
            borderRadius={16}>
            <Image
              source={item.CreatedPhoto ?? images.default_avatar}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                overflow: 'hidden',
              }}
              resizeMode="cover"
            />
            <Block
              borderRadius={10}
              style={{ bottom: -2, right: -2 }}
              colorTheme="neutral100"
              position="absolute"
              alignItems="center"
              justifyContent="center">
              <Icon
                icon={
                  item.Status ? 'checkmark_circle_fill' : 'close_circle_fill'
                }
                size={12}
                colorTheme={item.Status ? 'success500' : 'error500'}
              />
            </Block>
          </Block>
          <Block flex={1} rowGap={4}>
            <Block flexDirection="row" justifyContent="space-between">
              <Text
                text={item?.ActionName ?? 'N/A'}
                fontStyle="Title16Semi"
                colorTheme="primary600"
              />
              <Block alignItems="flex-end" columnGap={8} flexDirection="row">
                {item.System && (
                  <Block
                    paddingHorizontal={8}
                    paddingVertical={2}
                    borderWidth={10}
                    borderRadius={4}
                    borderColorTheme={
                      SystemDetails[item.System as System]?.colorTheme
                    }>
                    <Text
                      text={`${item.System}: ${item.BookingCode}`}
                      fontStyle="Body10SemiMono"
                      colorTheme={
                        SystemDetails[item.System as System]?.colorTheme
                      }
                    />
                  </Block>
                )}
                {!disabled && (
                  <Icon
                    icon={
                      isShowDetail ? 'arrow_ios_up_fill' : 'arrow_ios_down_fill'
                    }
                    size={18}
                    colorTheme="neutral700"
                  />
                )}
              </Block>
            </Block>
            <Block
              flexDirection="row"
              justifyContent="space-between"
              alignItems="flex-end">
              <Block>
                <Text
                  text={user?.FullName ?? 'N/A'}
                  fontStyle="Body14Reg"
                  colorTheme="neutral900"
                />
                <Text
                  text={dayjs(item.CreatedDate).format('DD/MM/YYYY HH:mm')}
                  fontStyle="Body12Reg"
                  colorTheme="neutral600"
                />
              </Block>
              {item.VersionId !== null && (
                <Button
                  type="common"
                  buttonColorTheme="success600"
                  t18n="order_detail:open_version"
                  textColorTheme="neutral100"
                  onPress={() => {
                    navigate(APP_SCREEN.BOOKING_VERSION_DETAIL, {
                      id: item.VersionId!,
                      versionDate: item.CreatedDate!,
                    });
                  }}
                  size="small"
                  buttonStyle={{ borderRadius: scale(4) }}
                />
              )}
            </Block>
          </Block>
        </Block>
      </Pressable>

      <DetailItemHistory
        isShowDetail={isShowDetail}
        item={item}
        historyChange={detailHistory?.Changes ?? []}
        isShowBookingInfo={isShowBookingInfo}
      />
    </Block>
  );
}, isEqual);

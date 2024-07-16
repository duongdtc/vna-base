import { BottomSheet, Icon, Text } from '@vna-base/components';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { selectSort } from '@redux-selector';
import { flightResultActions } from '@redux-slice';
import { bs, createStyleSheet, useStyles } from '@theme';
import { ActiveOpacity, ListFieldSort, dispatch } from '@vna-base/utils';
import React, { memo, useCallback, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { TouchableOpacity, View } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useSelector } from 'react-redux';

export const Sort = memo(() => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const sortField = useSelector(selectSort);
  const { styles } = useStyles(styleSheet);

  const onPressOption = useCallback(
    (key: 'Fare' | 'DepartDate' | 'ArriveDate' | 'Airline') => {
      let type: 'Asc' | 'Desc';

      if (sortField.OrderField === key) {
        type = sortField.OrderType === 'Asc' ? 'Desc' : 'Asc';
      } else {
        type = 'Asc';
      }

      dispatch(
        flightResultActions.saveSort({ OrderField: key, OrderType: type }),
      );

      bottomSheetRef.current?.dismiss();
    },
    [sortField.OrderField, sortField.OrderType],
  );

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          bottomSheetRef.current?.present();
        }}
        activeOpacity={ActiveOpacity}
        style={styles.btnFooterContainer}>
        <Icon icon="height_outline" size={20} colorTheme="primaryColor" />
        <Text t18n="common:_sort" fontStyle="Body14Reg" />
      </TouchableOpacity>
      <BottomSheet
        type="normal"
        typeBackDrop={'gray'}
        ref={bottomSheetRef}
        enablePanDownToClose={false}
        style={styles.container}
        t18nTitle="common:_sort"
        showIndicator={false}>
        <View>
          {ListFieldSort.map(({ key, t18n, icon }) => {
            const selected = key === sortField.OrderField;
            return (
              <TouchableOpacity
                onPress={() => {
                  onPressOption(key);
                }}
                key={key}
                style={styles.item}
                activeOpacity={ActiveOpacity}>
                <View
                  style={[bs.flexDirectionRow, bs.alignCenter, bs.columnGap_8]}>
                  <Icon
                    icon={icon}
                    size={20}
                    colorTheme={selected ? 'primaryColor' : 'neutral100'}
                  />
                  <Text
                    t18n={t18n}
                    fontStyle="Body16Reg"
                    colorTheme={selected ? 'primaryColor' : 'neutral100'}
                  />
                </View>
                {selected && (
                  <Icon
                    icon={
                      sortField.OrderType === 'Desc'
                        ? 'sort_down_fill'
                        : 'sort_up_fill'
                    }
                    colorTheme="primaryColor"
                    size={28}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheet>
    </>
  );
}, isEqual);

const styleSheet = createStyleSheet(({ colors, spacings }) => ({
  btnFooterContainer: {
    flex: 1,
    paddingVertical: spacings[8],
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacings[8],
  },
  container: {
    backgroundColor: colors.neutral10,
    paddingBottom: UnistylesRuntime.insets.bottom,
  },
  item: {
    flexDirection: 'row',
    padding: spacings[16],
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

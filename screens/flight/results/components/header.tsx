import { goBack } from '@navigation/navigation-service';
import { RightHeader } from '@screens/flight/results/components/right-header';
import { bs, createStyleSheet, useStyles } from '@theme';
import { Button, Icon, NormalHeader, Text } from '@vna-base/components';
import {
  selectCurrentStage,
  selectListRoute,
  selectSearchDone,
  selectSearchForm,
} from '@vna-base/redux/selector';
import {
  ActiveOpacity,
  HitSlop,
  getDateForHeaderResult,
} from '@vna-base/utils';
import React, { memo, useMemo } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useFilterContext } from './filter-provider';

export const Header = memo(
  () => {
    const { styles } = useStyles(styleSheet);
    const searchForm = useSelector(selectSearchForm);
    const currentStage = useSelector(selectCurrentStage);
    const listRoute = useSelector(selectListRoute);

    const searchDone = useSelector(selectSearchDone);

    const { showBottomSheet } = useFilterContext();

    const _renderSubDesTitleHeader = useMemo(() => {
      if (currentStage === listRoute.length) {
        return '';
      }

      return getDateForHeaderResult(
        listRoute[currentStage]?.DepartDate,
        searchForm?.Passengers,
      );
    }, [currentStage, listRoute, searchForm?.Passengers]);

    const _renderLeftContent = (
      <TouchableOpacity
        disabled={!searchDone}
        onPress={showBottomSheet}
        activeOpacity={ActiveOpacity}
        hitSlop={HitSlop.Large}
        style={styles.headerContainer}>
        <Button
          hitSlop={HitSlop.Large}
          type="common"
          size="small"
          leftIcon="arrow_ios_left_fill"
          textColorTheme="white"
          leftIconSize={24}
          padding={4}
          onPress={() => {
            goBack();
          }}
        />
        <View style={bs.rowGap_12}>
          <View style={styles.titleSearchContainer}>
            <Text
              fontStyle="H320Semi"
              text={`${listRoute[currentStage]?.StartPoint?.CityNameVi}`}
              colorTheme="white"
            />
            <Icon icon="arrow_list_transit_fill" size={16} colorTheme="white" />
            <Text
              fontStyle="H320Semi"
              text={`${listRoute[currentStage]?.EndPoint?.CityNameVi}`}
              colorTheme="white"
            />
          </View>
          <View style={styles.titleSearchContainer}>
            <Text
              fontStyle="Body12Reg"
              text={_renderSubDesTitleHeader}
              colorTheme="white"
            />
            {searchDone ? (
              <Icon icon="external_link_fill" size={12} colorTheme="white" />
            ) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={styles.loading.color} />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );

    // render
    return (
      <NormalHeader
        zIndex={0}
        leftContent={_renderLeftContent}
        rightContent={<RightHeader />}
      />
    );
  },
  () => true,
);

const styleSheet = createStyleSheet(({ colors, spacings, radius }) => ({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacings[8],
  },
  titleSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacings[4],
  },
  loadingContainer: {
    position: 'absolute',
    borderRadius: radius[8],
    right: -spacings[16],
    transform: [
      {
        scale: 0.5,
      },
    ],
  },
  loading: {
    color: colors.white,
  },
}));

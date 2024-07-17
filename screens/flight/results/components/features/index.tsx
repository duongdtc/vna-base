/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ActionSheet, Icon, Text } from '@vna-base/components';
import { OptionData } from '@vna-base/components/action-sheet/type';
import { navigate } from '@navigation/navigation-service';
import {
  selectCustomFeeTotal,
  selectListRoute,
  selectSearchDone,
} from '@vna-base/redux/selector';
import { flightResultActions } from '@vna-base/redux/action-slice';
import { createStyleSheet, useStyles } from '@theme';
import { translate } from '@vna-base/translations/translate';
import {
  ActiveOpacity,
  FeaturesEnum,
  ListFeature,
  ListOptionDownloadQuote,
  ListOptionDownloadQuoteEnum,
  dispatch,
} from '@vna-base/utils';
import React, { memo, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { AddFeeModal } from './add-fee-modal';
import { APP_SCREEN } from '@utils';

export const Features = memo(() => {
  const { styles } = useStyles(styleSheet);

  const actionSheetRefs = useRef<ActionSheet>(null);
  const actionSheetOptionDownloadQuoteRefs = useRef<ActionSheet>(null);
  const actionSheetEachStagesRefs = useRef<ActionSheet>(null);
  const addFeeModalRef = useRef<ActionSheet>(null);

  const { Total, disable } = useSelector(selectCustomFeeTotal);
  const searchDone = useSelector(selectSearchDone);
  const listRoute = useSelector(selectListRoute);

  const listRouteFlight: Array<OptionData> = listRoute.map(route => ({
    key: String(route.Leg),
    t18n:
      translate('preview_fare_report:stage') +
      ' ' +
      `${route.StartPoint.CityNameVi} (${route.StartPoint.Code})` +
      ' - ' +
      `${route.EndPoint.CityNameVi} (${route.EndPoint.Code})`,
  }));

  const onPressOption = (item: OptionData, _index: number) => {
    if (item.key === FeaturesEnum.DownloadQuote) {
      actionSheetOptionDownloadQuoteRefs.current?.show();
    } else {
      addFeeModalRef.current?.show();
    }
  };

  const copyFareReportToClipboard = () => {
    dispatch(flightResultActions.copyFareReportToClipboard());
  };

  const onPressOptionDownload = (item: OptionData, index: number) => {
    if (item.key === ListOptionDownloadQuoteEnum.Text) {
      //TODO: trong trường hợp copy text, đợi confirm từ sếp về việc chia copy theo từng stage hay không ( đã comment với design )
      copyFareReportToClipboard();
    } else {
      if (listRoute.length > 1) {
        actionSheetEachStagesRefs.current?.show();
      } else {
        navigate(APP_SCREEN.PREVIEW_FARE_REPORT, {
          indxRoute: index - 1,
        });
      }
    }
  };

  const onPressOptionDownloadByStage = (_item: OptionData, index: number) => {
    navigate(APP_SCREEN.PREVIEW_FARE_REPORT, { indxRoute: index });
  };

  const showRedDot = !!Total;

  const _listFeature = disable ? ListFeature.slice(1) : ListFeature;

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          actionSheetRefs.current?.show();
        }}
        disabled={!searchDone}
        activeOpacity={ActiveOpacity}
        style={styles.btnFooterContainer}>
        {searchDone ? (
          <Icon icon="calendar_outline" size={20} colorTheme="primaryPressed" />
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={styles.loading.color} />
          </View>
        )}
        <Text fontStyle="Body14Reg">
          {translate('flight:features')}
          {showRedDot && <Text text=" *" colorTheme="errorColor" />}
        </Text>
      </TouchableOpacity>
      {/* show lên option features ( thêm phí dịch vụ hoặc tải xuống báo giá ) */}
      <ActionSheet
        type="select"
        typeBackDrop="gray"
        ref={actionSheetRefs}
        onPressOption={onPressOption}
        option={_listFeature}
      />
      {/* show lên type báo giá ( dạng ảnh hoặc dạng text ) */}
      <ActionSheet
        type="select"
        typeBackDrop="gray"
        ref={actionSheetOptionDownloadQuoteRefs}
        onPressOption={onPressOptionDownload}
        option={ListOptionDownloadQuote}
      />
      {/* action sheet option stages flight */}
      <ActionSheet
        type="select"
        typeBackDrop="gray"
        ref={actionSheetEachStagesRefs}
        onPressOption={onPressOptionDownloadByStage}
        option={listRouteFlight}
      />
      <AddFeeModal ref={addFeeModalRef} />
    </>
  );
}, isEqual);

const styleSheet = createStyleSheet(({ colors, spacings, radius }) => ({
  btnFooterContainer: {
    flex: 1,
    paddingVertical: spacings[8],
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacings[8],
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

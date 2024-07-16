/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  Block,
  Button,
  Icon,
  NormalHeader,
  Screen,
  Separator,
  showToast,
  Text,
} from '@vna-base/components';
import { PREFIX_FARE_REPORT_NAME } from '@env';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectListRoute, selectSearchForm } from '@redux-selector';
import { Route } from '@redux/type';
import { AirOption } from '@services/axios/axios-ibe';
import { useStyles } from '@theme';
import { ColorLight } from '@theme/color';
import { delay, getDateForHeaderResult, getState } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  SectionList,
  SectionListData,
  SectionListRenderItem,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { useSelector } from 'react-redux';
import { Item, SeparatorMultiFlight } from './components';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const PreviewFareReport = ({
  route,
}: NativeStackScreenProps<
  RootStackParamList,
  APP_SCREEN.PREVIEW_FARE_REPORT
>) => {
  const {
    theme: { colors },
  } = useStyles();

  const ref = useRef<any>(null);
  const searchForm = useSelector(selectSearchForm);
  const listRoute = useSelector(selectListRoute);

  const [sections, setSections] = useState([
    {
      route: listRoute[route.params.indxRoute],
      data: [] as Array<AirOption>,
    },
  ]);

  useEffect(() => {
    const initSections = async () => {
      await delay(50);

      const processedListFlight =
        getState('flightResult').listGroup[route.params.indxRoute];

      const multiFlight =
        route.params.indxRoute === 0
          ? getState('flightResult').multiFlights
          : [];

      setSections([
        {
          route: listRoute[route.params.indxRoute],
          data: (processedListFlight.ListAirOption ?? [])
            .concat(
              multiFlight.length > 0
                ? //@ts-ignore
                  [{ type: searchForm.Type }]
                : [],
            )
            .concat(multiFlight)
            .flatMap(airOption => {
              //@ts-ignore
              if (airOption?.type) {
                return [airOption];
              }

              return (
                airOption?.ListFareOption?.map(fareOption => ({
                  ...airOption,
                  ListFareOption: [fareOption],
                })) ?? []
              );
            }) as Array<AirOption>,
        },
      ]);
    };

    initSections();
  }, []);

  const renderItem: SectionListRenderItem<AirOption, { route: Route }> = ({
    item,
    index,
  }) => {
    if (!item) {
      return null;
    }

    //@ts-ignore
    if (item.type) {
      //@ts-ignore
      return <SeparatorMultiFlight type={item.type} />;
    }

    return <Item {...item} index={index} />;
  };

  const renderHeader = ({
    section: { route: _route },
  }: {
    section: SectionListData<AirOption, { route: Route }>;
  }) => {
    return (
      <Block rowGap={4} colorTheme="primary500" padding={12}>
        <Block flexDirection="row" columnGap={4} alignItems="center">
          <Text
            text={`${_route.StartPoint.CityNameVi} (${_route.StartPoint?.Code})`}
            fontStyle="Title16Bold"
            colorTheme="white"
          />
          <Icon icon="arrow_list" size={16} colorTheme="white" />
          <Text
            text={`${_route.EndPoint.CityNameVi} (${_route.EndPoint?.Code})`}
            fontStyle="Title16Bold"
            colorTheme="white"
          />
        </Block>

        <Text
          fontStyle="Capture11Reg"
          text={getDateForHeaderResult(
            _route.DepartDate,
            searchForm?.Passengers,
          )}
          colorTheme="white"
        />
      </Block>
    );
  };

  const exportImg = async () => {
    try {
      let uri = '';
      const fileName =
        PREFIX_FARE_REPORT_NAME + dayjs().format('YYYYMMDD_HHmmss');

      if (Platform.OS === 'android') {
        uri = await ref.current.capture();
      } else {
        uri = await captureRef(ref, {
          format: 'png',
          quality: 1,
          snapshotContentContainer: true,
          fileName,
          useRenderInContext: true,
        });
      }

      if (!!uri && uri !== '') {
        if (Platform.OS === 'ios') {
          ReactNativeBlobUtil.ios.presentOptionsMenu(uri);
        } else {
          showToast({
            type: 'success',
            t18n: 'common:done',
          });

          await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
            {
              name: fileName, // name of the file
              parentFolder: '', // subdirectory in the Media Store, e.g. HawkIntech/Files to create a folder HawkIntech with a subfolder Files and save the image within this folder
              mimeType: 'image/png', // MIME type of the file
            },
            'Download', // Media Collection to store the file in ("Audio" | "Image" | "Video" | "Download")
            uri, // Path to the file being copied in the apps own storage
          );
        }
      } else {
        throw new Error('lưu lỗi kìa');
      }
    } catch (error) {
      showToast({
        type: 'error',
        t18n: 'common:failed',
      });
      console.log(error);
    }
  };

  const renderAndroid = (item: { route: Route; data: AirOption[] }) => {
    return (
      <Block>
        {/* @ts-ignore */}
        {renderHeader({ section: { route: item.route } })}
        {/* @ts-ignore */}
        {item.data.map((fl, idx) => renderItem({ item: fl, index: idx }))}
      </Block>
    );
  };

  return (
    <Screen unsafe backgroundColor={colors.neutral100}>
      <NormalHeader
        leftContent={
          <Button
            leftIcon="arrow_ios_left_outline"
            leftIconSize={24}
            textColorTheme="neutral900"
            onPress={() => {
              goBack();
            }}
            padding={4}
          />
        }
        centerContent={
          <Text
            fontStyle="Title20Semi"
            t18n="preview_fare_report:preview_fare_report"
            colorTheme="neutral900"
          />
        }
      />

      {sections[0].data.length > 0 ? (
        <>
          {Platform.OS === 'android' ? (
            <ScrollView>
              <ViewShot
                ref={ref}
                style={{ backgroundColor: colors.neutral100 }}>
                {sections.map(renderAndroid)}
              </ViewShot>
            </ScrollView>
          ) : (
            <SectionList
              contentContainerStyle={{ backgroundColor: colors.neutral100 }}
              ref={ref}
              sections={sections}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderItem}
              renderSectionHeader={renderHeader}
              initialNumToRender={999}
              windowSize={999}
              collapsable={false}
              ItemSeparatorComponent={() => <Separator type="horizontal" />}
            />
          )}
          <TouchableOpacity
            activeOpacity={0.94}
            onPress={exportImg}
            style={[
              styles.btnExport,
              {
                backgroundColor: colors.primary500,
              },
            ]}>
            <Icon icon="share_outline" size={24} colorTheme="white" />
          </TouchableOpacity>
        </>
      ) : (
        <Block flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={ColorLight.primary500} />
        </Block>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  btnExport: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    padding: 12,
    borderRadius: 24,
  },
});

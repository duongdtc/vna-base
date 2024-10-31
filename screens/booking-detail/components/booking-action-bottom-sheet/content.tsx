/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IconTypes } from '@assets/icon';
import { BottomSheetSectionList } from '@gorhom/bottom-sheet';
import { navigate } from '@navigation/navigation-service';
import { Action } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { realmRef } from '@services/realm/provider';
import { I18nKeys } from '@translations/locales';
import { APP_SCREEN } from '@utils';
import {
  Block,
  Icon,
  LinearGradient,
  showToast,
  Text,
} from '@vna-base/components';
import { bookingActionActions } from '@vna-base/redux/action-slice';
import {
  selectFlightActionsByBookingId,
  selectLanguage,
} from '@vna-base/redux/selector';
import { FlightActionExpandParams } from '@vna-base/screens/booking-detail/type';
import {
  ActiveOpacity,
  BookingStatus,
  CheckInOnlineSystem,
  dispatch,
  HairlineWidth,
  scale,
} from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useMemo } from 'react';
import {
  RefreshControl,
  SectionListData,
  SectionListRenderItem,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { MapActionIcon, MapTitleSection } from './constants';
import { Colors, createStyleSheet, useStyles } from '@theme';
import { UnistylesRuntime } from 'react-native-unistyles';

export const Content = ({
  bookingId,
  closeBottomSheet,
}: FlightActionExpandParams) => {
  const { styles } = useStyles(styleSheet);
  const Lng = useSelector(selectLanguage);
  const actions = useSelector(selectFlightActionsByBookingId(bookingId));

  const refresh = useCallback(() => {
    dispatch(bookingActionActions.getActionsByBookingId(bookingId));
  }, [bookingId]);

  const sectionList = useMemo(() => {
    const sections: Array<{
      group: string | null | undefined;
      data: Array<Action>;
      t18n: I18nKeys;
    }> = [];

    const booking = realmRef.current?.objectForPrimaryKey<BookingRealm>(
      BookingRealm.schema.name,
      bookingId,
    );

    actions
      .filter(
        ac =>
          (booking?.BookingStatus === BookingStatus.TICKETED &&
            ac.FeatureId !== 'TicketIssue') ||
          (booking?.BookingStatus === BookingStatus.OK &&
            ac.FeatureId !== 'CheckInOnline'),
      )
      .forEach(action => {
        //@ts-ignore
        const actionGroup = isEmpty(MapTitleSection[action.Feature?.Group])
          ? 'OTHER'
          : action.Feature?.Group;

        const idx = sections.findIndex(
          section => section.group === actionGroup,
        );

        if (idx === -1) {
          sections.push({
            group: actionGroup,
            data: [action],
            //@ts-ignore
            t18n: MapTitleSection[actionGroup]?.t18n,
          });
        } else {
          sections[idx].data.push(action);
        }
      });

    sections
      .sort(
        (a, b) =>
          //@ts-ignore
          (MapTitleSection[b.group]?.order ?? 0) -
          //@ts-ignore
          (MapTitleSection[a.group]?.order ?? 0),
      )
      .forEach(section => {
        if (section.data.length % 2) {
          section.data.push({});
        }
      });

    return sections;
  }, [actions]);

  const onPressItem = useCallback(
    ({ FeatureId, System }: Action) => {
      if (
        FeatureId !== 'TicketIssue' &&
        FeatureId !== 'CheckInOnline' &&
        FeatureId !== 'TicketVoid' &&
        FeatureId !== 'TicketRfnd' &&
        FeatureId !== 'TicketExch'
      ) {
        showToast({
          type: 'warning',
          text: 'Chỉ Demo chức năng Xuất vé và Check in online',
        });

        return;
      }

      let screen: APP_SCREEN;

      dispatch(
        bookingActionActions.saveCurrentFeature({
          featureId: FeatureId as string,
          bookingId,
        }),
      );

      switch (FeatureId) {
        case 'TicketExch':
          screen = APP_SCREEN.FlightChange;
          break;

        default:
          screen = FeatureId as APP_SCREEN;

          break;
      }

      //@ts-ignore
      navigate(screen, {
        id: bookingId,
        system: System as CheckInOnlineSystem,
      });

      closeBottomSheet();
    },
    [bookingId, closeBottomSheet],
  );

  const getActionIcon = useCallback(
    (featureId: string | null | undefined): IconTypes => {
      if (!featureId || !MapActionIcon[featureId]) {
        return 'edit_2_outline';
      }

      return MapActionIcon[featureId];
    },
    [],
  );

  const renderColorBtn = useCallback((item: Action) => {
    let colorTheme: Colors;
    switch (item?.FeatureId) {
      case 'BookingCancel':
      case 'TicketVoid':
        colorTheme = 'errorCol';
        break;

      case 'TicketIssue':
      case 'EMDIssue':
      case 'TicketRfnd':
        colorTheme = 'graSuc';
        break;

      default:
        colorTheme = 'gra1';
        break;
    }

    return colorTheme;
  }, []);

  const renderItem = useCallback<
    SectionListRenderItem<
      Action,
      {
        group: string | null | undefined;
        data: Array<Action>;
        t18n: I18nKeys;
      }
    >
  >(
    ({ item, index, section }) => {
      if (index % 2 !== 0) {
        return null;
      }

      const nextItem = section.data[index + 1];

      return (
        <Block style={styles.itemSection}>
          <TouchableOpacity
            activeOpacity={ActiveOpacity}
            onPress={() => {
              onPressItem(item);
            }}
            style={[styles.itemContainer, styles.itemPressable]}>
            {/* <RenderColorBtn featureId={item.FeatureId} /> */}
            <LinearGradient
              type={renderColorBtn(item)}
              style={[StyleSheet.absoluteFillObject, styles.linear]}
            />
            <Icon
              icon={getActionIcon(item.FeatureId)}
              size={20}
              colorTheme="neutral10"
            />
            <Text
              text={
                (Lng === 'en' ? item.Feature?.NameEn : item.Feature?.NameVi) ??
                ''
              }
              fontStyle="Body14Semi"
              colorTheme="neutral10"
            />
          </TouchableOpacity>
          {isEmpty(nextItem) ? (
            <Block style={styles.itemContainer} />
          ) : (
            <TouchableOpacity
              activeOpacity={ActiveOpacity}
              onPress={() => {
                onPressItem(nextItem);
              }}
              style={[styles.itemContainer, styles.itemPressable]}>
              <LinearGradient
                type={renderColorBtn(nextItem)}
                style={[StyleSheet.absoluteFillObject, styles.linear]}
              />
              <Icon
                icon={getActionIcon(nextItem.FeatureId)}
                size={20}
                colorTheme="neutral10"
              />
              <Text
                text={
                  (Lng === 'en'
                    ? nextItem.Feature?.NameEn
                    : nextItem.Feature?.NameVi) ?? ''
                }
                fontStyle="Body14Semi"
                colorTheme="neutral10"
              />
            </TouchableOpacity>
          )}
        </Block>
      );
    },
    [
      Lng,
      getActionIcon,
      onPressItem,
      renderColorBtn,
      styles.itemContainer,
      styles.itemPressable,
      styles.itemSection,
      styles.linear,
    ],
  );

  const renderSectionHeader = useCallback(
    ({
      section,
    }: {
      section: SectionListData<
        Action,
        {
          group: string | null | undefined;
          data: Array<Action>;
          t18n: I18nKeys;
        }
      >;
    }) => (
      <Text
        t18n={section.t18n}
        fontStyle="Title20Semi"
        colorTheme="neutral900"
        style={{ marginBottom: scale(12) }}
      />
    ),
    [],
  );

  return (
    <Block flex={1}>
      <BottomSheetSectionList
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refresh} />
        }
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.contentContainer}
        sections={sectionList}
        keyExtractor={(it, idx) => `${it?.Id}_${idx}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />
    </Block>
  );
};

const styleSheet = createStyleSheet(({ shadows, colors }) => ({
  contentContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: UnistylesRuntime.insets.bottom,
    paddingTop: scale(12),
  },
  itemContainer: {
    flex: 1,
    padding: scale(12),
    rowGap: scale(4),
    borderRadius: scale(4),
    flexDirection: 'row',
    columnGap: scale(6),
  },
  itemPressable: {
    borderWidth: HairlineWidth * 3,
    borderColor: colors.neutral200,
    backgroundColor: 'white',
    ...shadows.medium,
  },
  itemSection: {
    flexDirection: 'row',
    columnGap: scale(16),
    marginBottom: scale(16),
  },
  linear: {
    borderRadius: scale(4),
  },
}));

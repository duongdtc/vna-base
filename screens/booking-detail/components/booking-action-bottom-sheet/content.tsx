/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IconTypes } from '@assets/icon';
import { Block, Icon, showToast, Text } from '@vna-base/components';
import { BottomSheetSectionList } from '@gorhom/bottom-sheet';
import { navigate } from '@navigation/navigation-service';
import {
  selectFlightActionsByBookingId,
  selectLanguage,
} from '@vna-base/redux/selector';
import {
  bookingActionActions,
  bookingActions,
} from '@vna-base/redux/action-slice';
import { FlightActionExpandParams } from '@vna-base/screens/booking-detail/type';
import { Action } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { realmRef } from '@services/realm/provider';
import { I18nKeys } from '@translations/locales';
import {
  ActiveOpacity,
  CheckInOnlineSystem,
  dispatch,
  scale,
  System,
} from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useMemo } from 'react';
import {
  RefreshControl,
  SectionListData,
  SectionListRenderItem,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { MapActionIcon, MapTitleSection } from './constants';
import { useStyles } from './styles';
import { APP_SCREEN } from '@utils';

export const Content = ({
  bookingId,
  closeBottomSheet,
}: FlightActionExpandParams) => {
  const styles = useStyles();
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

    actions.forEach(action => {
      //@ts-ignore
      const actionGroup = isEmpty(MapTitleSection[action.Feature?.Group])
        ? 'OTHER'
        : action.Feature?.Group;

      const idx = sections.findIndex(section => section.group === actionGroup);

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

  const onPressItem = useCallback(({ FeatureId, System }: Action) => {
    if (FeatureId !== 'TicketIssue' && FeatureId !== 'CheckInOnline') {
      showToast({
        type: 'warning',
        text: 'Chỉ Demo chức năng Xuất vé và Check in online',
      });

      return;
    }

    let screen: APP_SCREEN;

    closeBottomSheet();

    if (FeatureId === 'BookingPricing') {
      const bookingDetail = realmRef.current?.objectForPrimaryKey<BookingRealm>(
        BookingRealm.schema.name,
        bookingId,
      );

      dispatch(
        bookingActionActions.bookingPricing(
          {
            System: System as System,
            Airline: bookingDetail?.Airline ?? '',
            BookingCode: bookingDetail?.BookingCode ?? '',
            BookingId: bookingId,
            AccountCode: bookingDetail?.AccountCode ?? '',
            Tourcode: bookingDetail?.Tourcode ?? '',
          },
          isSuccess => {
            if (isSuccess) {
              navigate(APP_SCREEN.BOOKING_PRICING_COMPLETED);
            }
          },
        ),
      );

      return;
    }

    if (FeatureId === 'BookingRetrieve') {
      const bookingDetail = realmRef.current?.objectForPrimaryKey<BookingRealm>(
        BookingRealm.schema.name,
        bookingId,
      );
      dispatch(
        bookingActions.getBookingByIdOrBookingCode(
          {
            id: bookingId,
            system: System as CheckInOnlineSystem,
            bookingCode: bookingDetail?.BookingCode ?? '',
            surname: bookingDetail?.Passengers[0]?.Surname,
          },
          { force: true },
        ),
      );

      return;
    }

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

    navigate(screen, {
      id: bookingId,
      system: System as CheckInOnlineSystem,
    });
  }, []);

  const getActionIcon = useCallback(
    (featureId: string | null | undefined): IconTypes => {
      if (!featureId || !MapActionIcon[featureId]) {
        return 'edit_2_outline';
      }

      return MapActionIcon[featureId];
    },
    [],
  );

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
            <Icon
              icon={getActionIcon(item.FeatureId)}
              size={20}
              colorTheme="neutral900"
            />
            <Text
              text={
                (Lng === 'en' ? item.Feature?.NameEn : item.Feature?.NameVi) ??
                ''
              }
              fontStyle="Body12Reg"
              colorTheme="neutral900"
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
              <Icon
                icon={getActionIcon(nextItem.FeatureId)}
                size={20}
                colorTheme="neutral900"
              />
              <Text
                text={
                  (Lng === 'en'
                    ? nextItem.Feature?.NameEn
                    : nextItem.Feature?.NameVi) ?? ''
                }
                fontStyle="Body12Reg"
                colorTheme="neutral900"
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
      styles.itemContainer,
      styles.itemPressable,
      styles.itemSection,
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
        fontStyle="Title16Semi"
        colorTheme="neutral900"
        style={{ marginBottom: scale(8) }}
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

import { Block, Icon, Separator, Text } from '@vna-base/components';
import { LOGO_URL } from '@env';
import { selectLanguage } from '@redux-selector';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { Segment } from '@services/axios/axios-ibe';
import { AirlineRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { I18nKeys } from '@translations/locales';
import { scale } from '@vna-base/utils';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FlatList, Pressable } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { useStyles, createStyleSheet } from '@theme';

export const SegmentItem = memo(
  ({
    hideHeader,
    onPressSegmentPreSeat,
    isEmptyService,
    Airline,
    StartPoint,
    EndPoint,
    renderServiceItem,
    t18nEmpty,
    index: segmentIndex,
  }: Segment & {
    hideHeader: boolean;
    isEmptyService: boolean;
    t18nEmpty?: I18nKeys;
    index: number;
    onPressSegmentPreSeat: ((segmentIdx: number) => void) | null;
    renderServiceItem: (data: {
      passengerIndex: number;
      segmentIndex?: number | undefined;
    }) => JSX.Element;
  }) => {
    const { styles } = useStyles(styleSheet);
    const lng = useSelector(selectLanguage);

    const { control } = useFormContext<PassengerForm>();

    const { fields } = useFieldArray({
      control,
      name: 'Passengers',
    });

    const airline = realmRef.current?.objectForPrimaryKey<AirlineRealm>(
      AirlineRealm.schema.name,
      Airline as string,
    );

    const _onPressSegmentPreSeat = () => {
      onPressSegmentPreSeat?.(segmentIndex);
    };

    const renderPassenger = useCallback(
      (smIndex?: number) =>
        ({ index }: { index: number }) =>
          renderServiceItem({
            passengerIndex: index,
            segmentIndex: smIndex,
          }),
      [renderServiceItem],
    );

    return (
      <Block>
        {!hideHeader && (
          <Pressable
            onPress={_onPressSegmentPreSeat}
            disabled={isEmptyService || !onPressSegmentPreSeat}
            style={styles.segmentHeader}>
            <Block flexDirection="row" alignItems="center" columnGap={4}>
              <Block width={20} height={20} borderRadius={4} overflow="hidden">
                <SvgUri
                  width={20}
                  height={20}
                  uri={LOGO_URL + Airline + '.svg'}
                />
              </Block>
              <Text
                text={lng === 'en' ? airline?.NameEn : airline?.NameVi}
                fontStyle="Body12Reg"
                colorTheme="neutral100"
              />
            </Block>
            <Block
              paddingHorizontal={8}
              paddingVertical={2}
              columnGap={2}
              flexDirection="row"
              alignItems="center">
              <Text
                text={StartPoint as string}
                fontStyle="Body12Bold"
                colorTheme="primaryColor"
              />
              <Icon
                icon="arrow_right_fill"
                size={12}
                colorTheme="primaryColor"
              />
              <Text
                text={EndPoint as string}
                fontStyle="Body12Bold"
                colorTheme="primaryColor"
              />
            </Block>
          </Pressable>
        )}

        {isEmptyService ? (
          <Text
            t18n={t18nEmpty}
            textAlign="center"
            fontStyle="Body14Reg"
            colorTheme="neutral70"
            style={{ marginVertical: scale(12) }}
          />
        ) : (
          <FlatList
            scrollEnabled={false}
            data={fields}
            keyExtractor={i => i.id}
            ItemSeparatorComponent={() => (
              <Separator type="horizontal" size={4} />
            )}
            renderItem={renderPassenger(segmentIndex)}
          />
        )}
      </Block>
    );
  },
  isEqual,
);

const styleSheet = createStyleSheet(({ colors, spacings }) => ({
  segmentHeader: {
    flexDirection: 'row',
    padding: spacings[8],
    backgroundColor: colors.neutral50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentContainer: {
    paddingBottom: spacings[12],
  },
}));

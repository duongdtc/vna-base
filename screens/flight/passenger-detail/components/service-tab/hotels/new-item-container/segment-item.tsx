import { Segment } from '@services/axios/axios-ibe';
import { AirportRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { createStyleSheet, useStyles } from '@theme';
import {
  Block,
  DateRangePicker,
  DateRangePickerMode,
  Icon,
  RangeDate,
  Text,
} from '@vna-base/components';
import dayjs from 'dayjs';
import React, { memo, useState } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable, TouchableOpacity } from 'react-native';

export const SegmentItem = memo(
  ({
    StartPoint,
    renderServiceItem,
    index: segmentIndex,
  }: Segment & {
    index: number;
    renderServiceItem: () => JSX.Element;
  }) => {
    const { styles } = useStyles(styleSheet);

    const [range, setRange] = useState<RangeDate | null>(null);

    const startPoint = realmRef.current?.objectForPrimaryKey<AirportRealm>(
      AirportRealm.schema.name,
      StartPoint as string,
    );

    const handleDoneDatePicker = (ranges: RangeDate) => {
      setRange(ranges);
    };

    const showDatePicker = () => {
      DateRangePicker.present(
        {
          minimumDate: dayjs().subtract(1, 'years').toDate(),
          t18nTitle: 'common:select_booking_date',
          mode: DateRangePickerMode.Range,
          allowDateRangeChanges: false,
          allowToChooseNilDate: false,
          t18nCancel: 'common:cancel',
          maximumDate: dayjs().toDate(),
        },
        handleDoneDatePicker,
      );
    };

    return (
      <Block>
        <Pressable disabled={true} style={styles.segmentHeader}>
          <Block flex={1}>
            <Text
              text={`${segmentIndex + 1}. Tại ${startPoint?.City.NameVi}`}
              fontStyle="Body14Semi"
              colorTheme="neutral80"
            />
          </Block>
          <TouchableOpacity onPress={showDatePicker}>
            <Block flexDirection="row" alignItems="center" columnGap={12}>
              <Text
                text={
                  !range
                    ? 'Chọn ngày'
                    : `${dayjs(range.from).format('DD/MM')} - ${dayjs(
                        range.to,
                      ).format('DD/MM/YYYY')}`
                }
                fontStyle="Body12Reg"
                colorTheme="neutral80"
              />
              <Icon
                icon="arrow_ios_right_fill"
                size={16}
                colorTheme="neutral100"
              />
            </Block>
          </TouchableOpacity>
        </Pressable>
        {renderServiceItem()}
      </Block>
    );
  },
  isEqual,
);

const styleSheet = createStyleSheet(({ colors, spacings }) => ({
  segmentHeader: {
    flexDirection: 'row',
    paddingVertical: spacings[12],
    paddingHorizontal: spacings[8],
    backgroundColor: colors.neutral20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentContainer: {
    paddingBottom: spacings[12],
  },
}));

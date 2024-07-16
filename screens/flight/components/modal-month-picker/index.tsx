/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Block,
  BottomSheet,
  DateRangePickerMode,
  RangeDate,
  Text,
} from '@vna-base/components';
import { BottomSheetModal, BottomSheetSectionList } from '@gorhom/bottom-sheet';
import { selectLanguage } from '@redux-selector';
import {
  ModalMonthPickerProps,
  ModalMonthPickerRef,
} from '@vna-base/screens/flight/type';
import { I18nKeys } from '@translations/locales';
import {
  ActiveOpacity,
  SnapPoint,
  convertStringToNumber,
  getMonthName,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SectionListRenderItem, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';

export const ModalMonthPicker = memo(
  forwardRef<ModalMonthPickerRef, ModalMonthPickerProps>(
    ({ handleDone }, ref) => {
      const styles = useStyles();
      const { bottom } = useSafeAreaInsets();
      const lng = useSelector(selectLanguage);
      const bottomSheetRef = useRef<BottomSheetModal>(null);
      const [_t18nTitle, setT18nTitle] = useState<I18nKeys>(
        'flight:departure_day',
      );
      const [_date, setDate] = useState<
        Pick<RangeDate, 'from'> & { to?: Date }
      >();

      const [_minDate, setMinDate] = useState<Date>();
      const [_mode, setMode] = useState(DateRangePickerMode.Single);
      const [_isBackDay, setIsBackDay] = useState(false);

      useImperativeHandle(
        ref,
        () => ({
          present: ({ t18nTitle, initialValue, mode, isBackDay, minDate }) => {
            bottomSheetRef.current?.present();
            setT18nTitle(t18nTitle);
            setDate(initialValue);
            setMode(mode);
            setIsBackDay(!!isBackDay);
            setMinDate(minDate);
          },
        }),
        [],
      );

      const sections = useMemo(() => {
        const currYear = dayjs().get('year');
        const currMonth = dayjs().get('month');
        const _temp: Array<{ title: string; data: Array<number> }> = [
          { data: [], title: currYear.toString() },
        ];

        for (let i = currMonth; i < 12; i++) {
          _temp[0].data.push(i);
        }

        for (let i = 0; i <= currMonth; i++) {
          if (i === 0) {
            _temp.push({
              title: (currYear + 1).toString(),
              data: [],
            });
          }

          _temp[1].data.push(i);
        }

        return _temp;
      }, []);

      const selectMonth = useCallback(
        (month: number, year: string) => {
          if (_mode === DateRangePickerMode.Single) {
            handleDone(
              {
                from: dayjs()
                  .set('year', Number(year))
                  .set('month', month)
                  .startOf('month')
                  .toDate(),
                //@ts-ignore
                to: undefined,
              },
              _isBackDay,
            );
            bottomSheetRef.current?.dismiss();
          } else {
            const selectedDate = dayjs()
              .set('year', Number(year))
              .set('month', month)
              .startOf('month');
            if (
              selectedDate.isBefore(dayjs(_date?.from).startOf('month')) ||
              _date?.to
            ) {
              setDate({
                from: selectedDate.toDate(),
                to: undefined,
              });
            } else {
              handleDone(
                {
                  from: dayjs(_date?.from).startOf('month').toDate(),
                  to: selectedDate.endOf('month').toDate(),
                },
                _isBackDay,
              );
              bottomSheetRef.current?.dismiss();
            }
          }
        },
        [_date?.from, _date?.to, _isBackDay, _mode, handleDone],
      );

      const renderItem = useCallback<SectionListRenderItem<any>>(
        ({ section, item }) => {
          const selected =
            (dayjs(_date?.from).month() === item &&
              dayjs(_date?.from).year() == section.title) ||
            (_date?.to &&
              dayjs(_date.to).month() === item &&
              dayjs(_date.to).year() == section.title);

          const disabled =
            _minDate &&
            (dayjs(_minDate).year() > convertStringToNumber(section.title) ||
              (dayjs(_minDate).year() == section.title &&
                dayjs(_minDate).month() > item));

          return (
            <TouchableOpacity
              disabled={disabled}
              onPress={() => selectMonth(item, section.title)}
              style={[
                styles.item,
                selected && styles.selected,
                disabled && { opacity: 0.5 },
              ]}
              activeOpacity={ActiveOpacity}>
              <Text
                text={getMonthName(item)}
                fontStyle="Title16Semi"
                colorTheme="neutral900"
              />
            </TouchableOpacity>
          );
        },
        [
          _date?.from,
          _date?.to,
          selectMonth,
          styles.item,
          styles.selected,
          _minDate,
        ],
      );

      const renderSectionHeader = useCallback(
        ({ section: { title } }: any) => (
          <Block style={styles.title}>
            <Text fontStyle="Body14Bold" colorTheme="neutral700">
              {`${lng === 'vi' ? 'Năm ' : ''}${title}`}
            </Text>
          </Block>
        ),
        [],
      );

      return (
        <BottomSheet
          dismissWhenClose={true}
          type="normal"
          typeBackDrop={'gray'}
          ref={bottomSheetRef}
          enablePanDownToClose
          useDynamicSnapPoint={false}
          snapPoints={[SnapPoint.Full]}
          t18nTitle={_t18nTitle}
          showIndicator={false}>
          <Block style={styles.container}>
            <BottomSheetSectionList
              sections={sections}
              keyExtractor={(i, index) => `${i}_${index}`}
              stickySectionHeadersEnabled={false}
              renderSectionHeader={renderSectionHeader}
              renderItem={renderItem}
              contentContainerStyle={[
                styles.contentContainer,
                { paddingBottom: bottom },
              ]}
            />
          </Block>
        </BottomSheet>
      );
    },
  ),
  () => false,
);

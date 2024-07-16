import { BottomSheet } from '@vna-base/components/bottom-sheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, {
  ForwardedRef,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import DatePicker from 'react-native-date-picker';
import { useStyles } from './styles';
import { DatePickerCustomProp, DatePickerRef } from './type';
import { useTheme } from '@theme';

export const DatePickerCustom = memo(
  forwardRef(
    (props: DatePickerCustomProp, ref: ForwardedRef<DatePickerRef>) => {
      const { maximumDate, minimumDate, submit, t18nTitle, onDismiss } = props;
      const bottomSheetRef = useRef<BottomSheetModal>(null);
      const { dark } = useTheme();
      const [_date, setDate] = useState(new Date());
      const styles = useStyles();

      const open = ({ date }: { date?: Date }) => {
        let initDate = dayjs().toDate();

        if (date) {
          initDate = date;
        }

        if (maximumDate && dayjs(initDate).isAfter(maximumDate)) {
          initDate = maximumDate;
        }

        if (minimumDate && dayjs(initDate).isBefore(minimumDate)) {
          initDate = minimumDate;
        }

        setDate(initDate);
        bottomSheetRef.current?.present();
      };

      const close = () => {
        bottomSheetRef.current?.close();
      };

      const _submit = useCallback(() => {
        submit(_date);
        close();
      }, [submit, _date]);

      useImperativeHandle(
        ref,
        () => ({
          open,
        }),
        [],
      );

      return (
        <BottomSheet
          type="normal"
          dismissWhenClose={true}
          typeBackDrop="gray"
          ref={bottomSheetRef}
          t18nDone="common:done"
          t18nTitle={t18nTitle}
          onDone={_submit}
          style={styles.container}
          onDismiss={onDismiss}
          showIndicator={false}>
          <DatePicker
            locale={'vi_VN'}
            date={_date}
            // fadeToColor={styles.fadeToColor.color}
            onDateChange={setDate}
            mode="date"
            style={styles.datePicker}
            // textColor={styles.datePickerTxt.color}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            theme={dark ? 'dark' : 'light'}
            dividerColor={styles.dividerColor.color}
          />
        </BottomSheet>
      );
    },
  ),
  () => false,
);

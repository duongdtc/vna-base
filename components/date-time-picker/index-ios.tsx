import { BottomSheet } from '@components/bottom-sheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import RNDateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useStyles } from './styles';
import { DateTimePickerProps, DateTimePickerRef } from './type';
import { useSelector } from 'react-redux';
import { selectLanguage } from '@redux-selector';

export const DateTimePickerIOS = memo(
  forwardRef<DateTimePickerRef, DateTimePickerProps>((props, ref) => {
    const { maximumDate, minimumDate, submit, t18nTitle, onDismiss, locale } =
      props;
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [_date, setDate] = useState(new Date());
    const styles = useStyles();
    const Lng = useSelector(selectLanguage);

    const open = ({ date }: { date: Date }) => {
      setDate(date ?? dayjs().toDate());
      bottomSheetRef.current?.present();
    };

    const close = () => {
      bottomSheetRef.current?.close();
    };

    const _submit = useCallback(() => {
      submit(_date);
      close();
    }, [submit, _date]);

    const onChangeDate = (
      event: DateTimePickerEvent,
      date?: Date | undefined,
    ) => {
      if (event.type !== 'dismissed') {
        setDate(date!);
      }
    };

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
        onPressBackDrop={onDismiss}
        showIndicator={false}>
        <RNDateTimePicker
          style={styles.datePicker}
          display="inline"
          mode="datetime"
          locale={locale ?? (Lng === 'vi' ? 'vi-VN' : undefined)}
          onChange={onChangeDate}
          value={_date}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      </BottomSheet>
    );
  }),
  () => false,
);

import { Block, DatePicker, Icon, Text } from '@vna-base/components';
import { DatePickerRef } from '@vna-base/components/date-picker/type';
import { PassengerForm } from '@vna-base/screens/flight/type';
import {
  ActiveOpacity,
  HairlineWidth,
  PassengerType,
  getMaxMinPassengerBirthday,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo, useMemo, useRef } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import isEqual from 'react-fast-compare';
import { createStyleSheet, useStyles } from '@theme';

export const BirthdayPicker = memo(({ index }: { index: number }) => {
  const datePickerRef = useRef<DatePickerRef>(null);
  const { styles } = useStyles(styleSheet);
  const { control, getValues } = useFormContext<PassengerForm>();

  const ConstantData = useMemo(() => {
    const passengerType = getValues().Passengers[index].Type;

    return {
      passengerType,
      rangeDate: getMaxMinPassengerBirthday(
        passengerType,
        dayjs(getValues().FLights[getValues().FLights?.length - 1]?.StartDate),
      ),
    };
  }, [getValues, index]);

  const {
    field: { onBlur, value, onChange },
    fieldState: { invalid },
  } = useController({
    control,
    name: `Passengers.${index}.Birthday`,
    rules: {
      required: ConstantData.passengerType !== PassengerType.ADT ? true : false,
    },
  });

  const showDatePicker = (val: Date | undefined) => {
    datePickerRef.current?.open({
      date: val ?? ConstantData.rangeDate.maxDate,
    });
  };

  return (
    <Block flex={1}>
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        onPress={() => showDatePicker(value)}
        style={[
          styles.inputBirthday,
          !invalid || value
            ? styles.inputBirthdayNormal
            : styles.inputBirthdayError,
        ]}>
        <Text>
          <Text
            colorTheme={value ? 'neutral100' : 'neutral50'}
            fontStyle="Body16Reg"
            t18n={!value ? 'input_info_passenger:dob' : undefined}
            text={value ? dayjs(value).format('DD/MM/YYYY') : undefined}
          />
          {!value && ConstantData.passengerType !== PassengerType.ADT && (
            <Text text="*" colorTheme="errorColor" fontStyle="Body16Reg" />
          )}
        </Text>
        <Icon icon="calendar_fill" size={24} colorTheme="primaryColor" />
        {value && (
          <Block
            flexDirection="row"
            position="absolute"
            left={8}
            style={{ top: -16 }}
            colorTheme="neutral100"
            padding={4}>
            <Text
              colorTheme="neutral60"
              fontStyle="Body12Reg"
              t18n="input_info_passenger:dob"
            />
            {ConstantData.passengerType !== PassengerType.ADT && (
              <Text text="*" colorTheme="errorColor" fontStyle="Body12Reg" />
            )}
          </Block>
        )}
      </TouchableOpacity>
      <DatePicker
        ref={datePickerRef}
        maximumDate={ConstantData.rangeDate.maxDate}
        minimumDate={ConstantData.rangeDate.minDate}
        t18nTitle={'input_info_passenger:dob'}
        submit={date => onChange(date)}
        onDismiss={onBlur}
      />
    </Block>
  );
}, isEqual);

const styleSheet = createStyleSheet(({ colors, spacings }) => ({
  inputBirthday: {
    backgroundColor: colors.neutral100,
    borderWidth: HairlineWidth * 3,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacings[12],
    borderRadius: spacings[8],
    justifyContent: 'space-between',
  },
  inputBirthdayError: {
    borderWidth: HairlineWidth * 6,
    borderColor: colors.errorColor,
  },
  inputBirthdayNormal: {
    borderColor: colors.neutral30,
  },
}));

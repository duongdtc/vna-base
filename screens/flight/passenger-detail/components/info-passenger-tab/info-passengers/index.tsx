import {
  Block,
  Button,
  Switch,
  Text,
  TouchableScale,
} from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { selectListSelectedFlight } from '@vna-base/redux/selector';
import { PassengerForm } from '@vna-base/screens/flight/type';
import {
  ActiveOpacity,
  getMaxMinPassengerBirthday,
  rxSpecialAndNumber,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useMemo } from 'react';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { LayoutAnimation } from 'react-native';
import { useSelector } from 'react-redux';
import { Item } from './item';
import { useStyles, createStyleSheet } from '@theme';
import { APP_SCREEN } from '@utils';

export const InfoPassengers = () => {
  const { styles } = useStyles(styleSheet);

  const listSelectedFlight = useSelector(selectListSelectedFlight);

  const { control, setValue, getValues } = useFormContext<PassengerForm>();

  const { fields } = useFieldArray({
    control,
    name: 'Passengers',
  });

  useWatch({
    control,
    name: 'Passengers',
  });

  const uniqueAirlines = useMemo(
    () =>
      listSelectedFlight.filter((item, index) => {
        return (
          listSelectedFlight.findIndex(obj => obj.Airline === item.Airline) ===
          index
        );
      }),
    [],
  );

  const handleReceiveValueWhenGoBack = useCallback(
    (
      value:
        | {
            [x: string]: any;
          }[]
        | undefined,
    ) => {
      if (!isEmpty(value) && value !== undefined) {
        for (const [idxPassenger, passenger] of value.entries()) {
          if (idxPassenger >= fields.length) {
            break;
          }

          if (!rxSpecialAndNumber.test(passenger.FullName)) {
            setValue(
              `Passengers.${idxPassenger}.FullName`,
              undefined as unknown as string,
            );
          } else {
            setValue(`Passengers.${idxPassenger}.FullName`, passenger.FullName);
          }

          setValue(`Passengers.${idxPassenger}.Gender`, passenger.Gender);

          if (passenger.Birthday !== undefined) {
            const { Type } = getValues(`Passengers.${idxPassenger}`);
            const maxMinDate = getMaxMinPassengerBirthday(
              Type,
              dayjs(
                getValues().FLights[getValues().FLights?.length - 1]?.StartDate,
              ),
            );
            if (
              dayjs(passenger.Birthday).isBetween(
                maxMinDate.minDate,
                maxMinDate.maxDate,
                'date',
                '[]',
              )
            ) {
              setValue(
                `Passengers.${idxPassenger}.Birthday`,
                passenger.Birthday,
              );
            }
          } else {
            setValue(
              `Passengers.${idxPassenger}.Birthday`,
              undefined as unknown as Date,
            );
          }
        }
      }
    },
    [fields, setValue, getValues],
  );

  const navToQuickInputScreen = useCallback(() => {
    navigate(APP_SCREEN.QUICK_INPUT_SCREEN, {
      onSubmitQuickInput: handleReceiveValueWhenGoBack,
    });
  }, [handleReceiveValueWhenGoBack]);

  const processSplitName = (isSplit: boolean) => {
    if (isSplit) {
      fields.forEach((psg, index) => {
        setValue(
          `Passengers.${index}.FullName`,
          (
            getValues(`Passengers.${index}.Surname`).trim() +
            ' ' +
            getValues(`Passengers.${index}.GivenName`).trim()
          ).trim(),
        );
      });
    } else {
      fields.forEach((psg, index) => {
        const FullName = getValues(`Passengers.${index}.FullName`).trim();
        const firstIdxSpace = FullName.indexOf(' ');

        if (firstIdxSpace !== -1) {
          const Surname = FullName.substring(0, firstIdxSpace);
          const GivenName = FullName.substring(firstIdxSpace + 1);
          setValue(`Passengers.${index}.Surname`, Surname);
          setValue(`Passengers.${index}.GivenName`, GivenName);
        }
      });
    }

    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 200,
    });
    setValue('SplitFullName', !isSplit);
  };

  return (
    <>
      <Block
        marginBottom={12}
        flexDirection="row"
        columnGap={16}
        marginTop={24}>
        {fields.length !== 1 && (
          <Block flex={1}>
            <Button
              onPress={navToQuickInputScreen}
              fullWidth
              t18n="input_info_passenger:quick_input"
              size="medium"
              textColorTheme="white"
              textFontStyle="Body16Semi"
              buttonColorTheme="successColor"
            />
          </Block>
        )}
        <Controller
          control={control}
          name="SplitFullName"
          render={({ field: { value } }) => (
            <Block flex={1}>
              <TouchableScale
                minScale={0.98}
                containerStyle={styles.optionBtn}
                activeOpacity={ActiveOpacity}
                onPress={() => {
                  processSplitName(value);
                }}>
                <Text
                  t18n="input_info_passenger:separate_full_name"
                  fontStyle="Body16Reg"
                  colorTheme="neutral100"
                />
                <Switch value={value} disable opacity={1} />
              </TouchableScale>
            </Block>
          )}
        />
      </Block>
      <Block paddingBottom={12}>
        {fields.map((_, idx) => (
          <Block paddingTop={idx === 0 ? 0 : 16} key={idx}>
            <Item
              index={idx}
              airlines={uniqueAirlines.map(item => item.Airline as string)}
            />
          </Block>
        ))}
      </Block>
    </>
  );
};

const styleSheet = createStyleSheet(({ colors, spacings }) => ({
  optionBtn: {
    flex: 1,
    borderRadius: spacings[8],
    paddingHorizontal: spacings[12],
    paddingVertical: spacings[14],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral10,
  },
}));

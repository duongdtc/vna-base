import { navigate } from '@navigation/navigation-service';
import { APP_SCREEN } from '@utils';
import { Block, RowOfForm, Separator } from '@vna-base/components';
import {
  AdditionalPassengerInfoForm,
  PassengerForm,
} from '@vna-base/screens/flight/type';
import {
  MaxLengthFullName,
  PassengerType,
  getMaxMinPassengerBirthday,
  rxSpecialAndNumber,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { LayoutAnimation } from 'react-native';
import { Title } from './title';

export const Item = memo(
  ({ index, airlines }: { index: number; airlines: string[] }) => {
    const [isClose, setIsClose] = useState<boolean>(false);
    const { getValues, setValue, control } = useFormContext<PassengerForm>();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const toggleContent = useCallback(() => {
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.easeInEaseOut,
        duration: 240,
      });
      setIsClose(prev => !prev);
    }, []);

    const navToAdditionalInfo = () => {
      const additionalInfo = getValues().Passengers[index].AdditionalInfo;

      navigate(APP_SCREEN.ADDITIONAL_INFO, {
        airlines: airlines,
        initData: additionalInfo
          ? {
              ListMembership: [],
              DocumentCode: additionalInfo.DocumentCode,
              DocumentExpiry: additionalInfo.DocumentExpiry,
              Nationality: additionalInfo.Nationality,
              IssueCountry: additionalInfo.IssueCountry,
            }
          : undefined,
        onSubmit: (data: AdditionalPassengerInfoForm) => {
          setValue(`Passengers.${index}.AdditionalInfo`, data);
        },
      });
    };

    const ConstantData = useMemo(() => {
      const passengerType = getValues().Passengers[index].Type;

      return {
        passengerType,
        rangeDate: getMaxMinPassengerBirthday(
          passengerType,
          dayjs(
            getValues().FLights[getValues().FLights?.length - 1]?.DepartDate,
            'DDMMYYYY HHmm',
          ),
        ),
      };
    }, [getValues, index]);

    const splitFullName = useWatch({
      control,
      name: 'SplitFullName',
    });

    useWatch({
      control,
      name: 'Passengers',
    });

    return (
      <Block colorTheme="neutral100" borderRadius={8} overflow="hidden">
        <Title
          navToAdditionalInfo={navToAdditionalInfo}
          isClose={isClose}
          index={index}
        />
        <Block overflow="hidden">
          <Separator type="horizontal" size={3} />
          {splitFullName ? (
            <Block>
              <RowOfForm<PassengerForm>
                t18n="input_info_passenger:last_name"
                name={`Passengers.${index}.Surname`}
                fixedTitleFontStyle={true}
                control={control}
                isRequire
                pattern={rxSpecialAndNumber}
                autoComplete="name-prefix"
                textContentType="namePrefix"
                autoCapitalize="characters"
                maxLength={MaxLengthFullName}
                useBlur={true}
              />
              <Separator type="horizontal" size={3} />
              <RowOfForm<PassengerForm>
                t18n="input_info_passenger:first_name"
                name={`Passengers.${index}.GivenName`}
                fixedTitleFontStyle={true}
                control={control}
                isRequire
                pattern={rxSpecialAndNumber}
                autoComplete="name-prefix"
                textContentType="namePrefix"
                autoCapitalize="characters"
                maxLength={MaxLengthFullName}
                useBlur={true}
              />
            </Block>
          ) : (
            <RowOfForm<PassengerForm>
              t18n="agent:customer_name"
              name={`Passengers.${index}.FullName`}
              fixedTitleFontStyle={true}
              control={control}
              isRequire
              autoComplete="name-prefix"
              textContentType="namePrefix"
              autoCapitalize="characters"
              useBlur={true}
            />
          )}
          <Separator type="horizontal" size={3} />
          <RowOfForm<PassengerForm>
            t18n="booking:dob"
            name={`Passengers.${index}.Birthday`}
            fixedTitleFontStyle={true}
            type="date-picker"
            maximumDate={ConstantData.rangeDate.maxDate}
            minimumDate={ConstantData.rangeDate.minDate}
            colorThemeValue="neutral700"
            control={control}
            isRequire={ConstantData.passengerType !== PassengerType.ADT}
          />
        </Block>
      </Block>
    );
  },
);

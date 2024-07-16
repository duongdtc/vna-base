import { RowOfForm, Separator, Text } from '@vna-base/components';
import { FormBookingDetail } from '@vna-base/screens/booking-detail/type';
import { useTheme } from '@theme';
import { translate } from '@vna-base/translations/translate';
import {
  Gender,
  GenderTypeDetails,
  PassengerType,
  PassengerTypeDetails,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React from 'react';
import { FieldArrayWithId, useFormContext } from 'react-hook-form';
import { ItemCollapseContent } from './item-collapse-content';

type Props = {
  item: FieldArrayWithId<FormBookingDetail, 'Passengers', 'id'>;
  index: number;
};

export const ItemPassenger = ({ item, index }: Props) => {
  const { colors } = useTheme();

  const { control } = useFormContext<FormBookingDetail>();

  const convertPassengerType = (val: PassengerType) => (
    <Text
      fontStyle="Body14Reg"
      colorTheme="neutral700"
      text={`${translate(PassengerTypeDetails[val as PassengerType].t18n)} - ${
        PassengerTypeDetails[val as PassengerType].key
      }`}
    />
  );

  const convertPassengerGender = (val: Gender) =>
    translate(GenderTypeDetails[val].t18n);

  return (
    <ItemCollapseContent item={item}>
      <Separator type="horizontal" size={3} />
      <RowOfForm<FormBookingDetail>
        type="dropdown"
        typeDetails={PassengerTypeDetails}
        disable={true}
        t18n="booking:passenger_type"
        t18nBottomSheet="booking:passenger_type"
        name={`Passengers.${index}.PaxType`}
        fixedTitleFontStyle={true}
        t18nAll="common:not_choose"
        ValueView={convertPassengerType}
        control={control}
      />
      <Separator type="horizontal" size={3} />
      <RowOfForm<FormBookingDetail>
        disable={true}
        t18n="booking:gender"
        name={`Passengers.${index}.Gender`}
        fixedTitleFontStyle={true}
        ValueView={convertPassengerGender}
        style={{ color: colors.neutral700 }}
        control={control}
      />
      <Separator type="horizontal" size={3} />
      <RowOfForm<FormBookingDetail>
        disable={true}
        t18n="booking:surname"
        name={`Passengers.${index}.Surname`}
        fixedTitleFontStyle={true}
        style={{ color: colors.neutral700 }}
        autoCapitalize="characters"
        control={control}
      />

      <Separator type="horizontal" size={3} />
      <RowOfForm<FormBookingDetail>
        disable={true}
        t18n="booking:given_name"
        name={`Passengers.${index}.GivenName`}
        fixedTitleFontStyle={true}
        style={{ color: colors.neutral700 }}
        autoCapitalize="characters"
        control={control}
      />

      <Separator type="horizontal" size={3} />
      <RowOfForm<FormBookingDetail>
        disable={true}
        t18n="booking:dob"
        name={`Passengers.${index}.BirthDate`}
        fixedTitleFontStyle={true}
        type="date-picker"
        colorThemeValue="neutral700"
        control={control}
      />
      <Separator type="horizontal" size={3} />
      <RowOfForm<FormBookingDetail>
        disable={true}
        t18n="booking:membership_card"
        name={`Passengers.${index}.Membership`}
        fixedTitleFontStyle={true}
        style={{ color: colors.neutral700 }}
        autoCapitalize="characters"
        control={control}
      />

      <Separator type="horizontal" size={3} />
      <RowOfForm<FormBookingDetail>
        disable={true}
        t18n="booking:document_number"
        name={`Passengers.${index}.DocumentNumb`}
        fixedTitleFontStyle={true}
        style={{ color: colors.neutral700 }}
        autoCapitalize="characters"
        control={control}
      />

      <Separator type="horizontal" size={3} />
      <RowOfForm<FormBookingDetail>
        disable={true}
        t18n="booking:expiration_date"
        name={`Passengers.${index}.DocumentExpiry`}
        fixedTitleFontStyle={true}
        type="date-picker"
        colorThemeValue="neutral700"
        minimumDate={dayjs().toDate()}
        control={control}
      />

      <Separator type="horizontal" size={3} />
      <RowOfForm<FormBookingDetail>
        disable={true}
        t18n="booking:nationality"
        name={`Passengers.${index}.Nationality`}
        fixedTitleFontStyle={true}
        type="country-picker"
        colorThemeValue="neutral700"
        minimumDate={dayjs().toDate()}
        control={control}
      />

      <Separator type="horizontal" size={3} />
      <RowOfForm<FormBookingDetail>
        disable={true}
        t18n="booking:place_of_issue"
        name={`Passengers.${index}.IssueCountry`}
        fixedTitleFontStyle={true}
        type="country-picker"
        colorThemeValue="neutral700"
        minimumDate={dayjs().toDate()}
        control={control}
      />
    </ItemCollapseContent>
  );
};

import { RowOfForm, Separator } from '@vna-base/components';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { useTheme } from '@theme';
import { getMaxMinPassengerBirthday } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { FieldArrayWithId, useFormContext } from 'react-hook-form';
import { PassportUpdateForm } from '../../type';
import { ItemCollapseContent } from './item-collapse-content';

type Props = {
  item: FieldArrayWithId<PassportUpdateForm, 'ListPassenger', 'id'>;
  index: number;
  bookingId: string;
};

export const ItemPassenger = memo(({ item, index, bookingId }: Props) => {
  const { colors } = useTheme();

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, bookingId);

  const { control } = useFormContext<PassportUpdateForm>();

  const { maxDate, minDate } = getMaxMinPassengerBirthday(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    item?.PaxType as string,
    dayjs(bookingDetail!.Flights![0]?.DepartDate) ?? dayjs(),
  );

  return (
    <ItemCollapseContent item={item} index={index}>
      <Separator type="horizontal" size={3} />
      <RowOfForm<PassportUpdateForm>
        t18n="input_info_passenger:passport_number"
        name={`ListPassenger.${index}.Passport.DocumentCode`}
        fixedTitleFontStyle={true}
        style={{ color: colors.neutral700 }}
        autoCapitalize="characters"
        control={control}
      />
      <Separator type="horizontal" size={3} />
      <RowOfForm<PassportUpdateForm>
        t18n="booking:dob"
        name={`ListPassenger.${index}.DateOfBirth`}
        fixedTitleFontStyle={true}
        type="date-picker"
        maximumDate={maxDate}
        minimumDate={minDate}
        colorThemeValue="neutral700"
        control={control}
      />
      <Separator type="horizontal" size={3} />
      <RowOfForm<PassportUpdateForm>
        t18n="booking:nationality"
        name={`ListPassenger.${index}.Passport.Nationality`}
        fixedTitleFontStyle={true}
        type="country-picker"
        colorThemeValue="neutral700"
        minimumDate={dayjs().toDate()}
        control={control}
      />
      <Separator type="horizontal" size={3} />
      <RowOfForm<PassportUpdateForm>
        t18n="booking:place_of_issue"
        name={`ListPassenger.${index}.Passport.IssueCountry`}
        fixedTitleFontStyle={true}
        type="country-picker"
        colorThemeValue="neutral700"
        minimumDate={dayjs().toDate()}
        control={control}
      />
      <Separator type="horizontal" size={3} />
      <RowOfForm<PassportUpdateForm>
        t18n="booking:expiration_date"
        name={`ListPassenger.${index}.Passport.DocumentExpiry`}
        fixedTitleFontStyle={true}
        type="date-picker"
        colorThemeValue="neutral700"
        minimumDate={dayjs().toDate()}
        control={control}
      />
    </ItemCollapseContent>
  );
}, isEqual);

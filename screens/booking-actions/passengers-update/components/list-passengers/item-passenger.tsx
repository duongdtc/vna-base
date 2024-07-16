import { Block, RowOfForm, Separator, Text } from '@vna-base/components';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { getMaxMinPassengerBirthday } from '@vna-base/utils';
import dayjs from 'dayjs';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { FieldArrayWithId, useFormContext } from 'react-hook-form';
import { PassengerUpdateForm } from '../../type';
import { ItemCollapseContent } from './item-collapse-content';
import { GenderSelect } from './select-gender';

type Props = {
  item: FieldArrayWithId<PassengerUpdateForm, 'Passengers', 'id'>;
  index: number;
  bookingId: string;
};

export const ItemPassenger = memo(({ item, index, bookingId }: Props) => {
  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, bookingId);

  const { control } = useFormContext<PassengerUpdateForm>();

  const { maxDate, minDate } = getMaxMinPassengerBirthday(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    item?.PaxType as string,
    dayjs(bookingDetail!.Flights![0]?.DepartDate) ?? dayjs(),
  );

  return (
    <ItemCollapseContent item={item} index={index}>
      <Separator type="horizontal" size={3} />
      <Block
        flexDirection="row"
        paddingVertical={16}
        paddingLeft={16}
        paddingRight={12}
        alignItems="center"
        justifyContent="space-between">
        <Text t18n="booking:gender" />
        <GenderSelect index={index} />
      </Block>
      {/* <RowOfForm<PassengerUpdateForm>
        t18n="booking:gender"
        name={`Passengers.${index}.Gender`}
        fixedTitleFontStyle={true}
        style={{ color: colors.neutral700 }}
        autoCapitalize="characters"
        control={control}
      /> */}
      <Separator type="horizontal" size={3} />
      <RowOfForm<PassengerUpdateForm>
        t18n="booking:surname"
        name={`Passengers.${index}.Surname`}
        fixedTitleFontStyle={true}
        colorThemeValue="neutral700"
        control={control}
      />
      <Separator type="horizontal" size={3} />
      <RowOfForm<PassengerUpdateForm>
        t18n="booking:given_name"
        name={`Passengers.${index}.GivenName`}
        fixedTitleFontStyle={true}
        colorThemeValue="neutral700"
        control={control}
      />
      <Separator type="horizontal" size={3} />
      <RowOfForm<PassengerUpdateForm>
        t18n="booking:dob"
        name={`Passengers.${index}.BirthDate`}
        fixedTitleFontStyle={true}
        type="date-picker"
        maximumDate={maxDate}
        minimumDate={minDate}
        colorThemeValue="neutral700"
        control={control}
      />
    </ItemCollapseContent>
  );
}, isEqual);

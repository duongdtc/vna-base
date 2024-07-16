import { Block, RowOfForm, Separator, Text } from '@vna-base/components';
import {
  getFullNameOfPassenger,
  PassengerType,
  PassengerTypeDetails,
} from '@vna-base/utils';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import {
  FieldArrayWithId,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { FlatList, ListRenderItem } from 'react-native';
import { MemberCardUpdateForm } from '../../type';

export const ListPassenger = memo(() => {
  const { control } = useFormContext<MemberCardUpdateForm>();

  const { fields } = useFieldArray({
    control,
    name: 'ListPassenger',
  });

  const renderPassengers = useCallback<
    ListRenderItem<
      FieldArrayWithId<MemberCardUpdateForm, 'ListPassenger', 'id'>
    >
  >(
    ({ item, index }) => {
      return (
        <Block borderRadius={8} overflow="hidden" colorTheme="neutral100">
          <Block
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            padding={12}>
            <Text
              text={getFullNameOfPassenger(item)}
              fontStyle="Title16Bold"
              colorTheme="primary900"
            />
            <Text
              t18n={PassengerTypeDetails[item.Type as PassengerType].t18n}
              fontStyle="Body12Med"
              colorTheme="neutral900"
            />
          </Block>
          <Separator type="horizontal" />
          <RowOfForm<MemberCardUpdateForm>
            t18n="member_card_udpate:member_card_numb"
            name={`ListPassenger.${index}.ListMembership.${index}.MembershipID`}
            fixedTitleFontStyle={true}
            colorThemeValue="neutral700"
            control={control}
          />
        </Block>
      );
    },
    [control],
  );

  return (
    <FlatList
      renderItem={renderPassengers}
      scrollEnabled={false}
      keyExtractor={(item, index) => `${item}_${index}`}
      data={fields.filter(item => item.Type !== PassengerType.INF)}
      ItemSeparatorComponent={() => <Block height={12} />}
      style={{ marginTop: 12 }}
    />
  );
}, isEqual);

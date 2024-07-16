import { Block, CheckBox, Separator, Text } from '@vna-base/components';
import { TicketStatus, TicketTypeDetails } from '@vna-base/utils';
import React, { useCallback, useEffect } from 'react';
import {
  Controller,
  FieldArrayWithId,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { FlatList, ListRenderItem, Pressable } from 'react-native';
import { VoidTicketForm } from '../../type';
import { useStyles } from './styles';

export const ListTicket = () => {
  const styles = useStyles();
  const { control, setValue } = useFormContext<VoidTicketForm>();

  const isVoidAllTicket = useWatch({
    control: control,
    name: 'isVoidAllTicket',
  });

  const { fields } = useFieldArray({
    name: 'tickets',
    control,
    rules: {
      validate: tickets =>
        tickets.reduce((total, tk) => total || tk.isSelected, false),
    },
  });

  useEffect(() => {
    if (isVoidAllTicket) {
      fields.forEach((_, idx) => {
        setValue(`tickets.${idx}.isSelected`, true, { shouldValidate: true });
      });
    }
  }, [isVoidAllTicket]);

  const renderItem = useCallback<
    ListRenderItem<FieldArrayWithId<VoidTicketForm, 'tickets', 'id'>>
  >(
    ({ item, index }) => {
      return (
        <Controller
          control={control}
          name={`tickets.${index}.isSelected`}
          render={({ field: { onChange, value } }) => (
            <Pressable
              disabled={isVoidAllTicket}
              style={[
                styles.itemContainer,
                isVoidAllTicket && styles.disabledItem,
              ]}
              onPress={() => {
                onChange(!value);
              }}>
              <Block flex={1}>
                <Text
                  text={item.TicketNumber?.toString()}
                  fontStyle="Body12Bold"
                  colorTheme="neutral900"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
                <Text
                  text={`${item.FullName}${
                    item.Remark && item.Remark !== '' ? ` - ${item.Remark}` : ''
                  }`}
                  fontStyle="Body12Med"
                  colorTheme="neutral600"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                />
              </Block>
              <Block alignItems="flex-end">
                <Text
                  t18n={TicketTypeDetails[item.TicketType as TicketStatus].t18n}
                  fontStyle="Body12Med"
                  colorTheme={
                    TicketTypeDetails[item.TicketType as TicketStatus]
                      .colorTheme
                  }
                />
                <Text
                  text={`${item.StartPoint}-${item.EndPoint}`}
                  fontStyle="Body12Reg"
                  colorTheme="neutral600"
                />
              </Block>
              <Block paddingHorizontal={8} justifyContent="center">
                <CheckBox disable value={value} />
              </Block>
            </Pressable>
          )}
        />
      );
    },
    [control, isVoidAllTicket, styles.itemContainer, styles.disabledItem],
  );

  return (
    <FlatList
      scrollEnabled={false}
      data={fields}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <Separator type="horizontal" />}
    />
  );
};

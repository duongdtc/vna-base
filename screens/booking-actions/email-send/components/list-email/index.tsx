import { Block, Icon, Separator, Text } from '@vna-base/components';
import { delay } from '@vna-base/utils';
import React, { useCallback } from 'react';
import {
  FieldArrayWithId,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { FlatList, ListRenderItem, Pressable } from 'react-native';
import { EmailSendForm } from '../../type';
import { Input } from './input';
import { useStyles } from './styles';

export const ListEmail = () => {
  const styles = useStyles();
  const { control, setFocus } = useFormContext<EmailSendForm>();

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'emails',
  });

  const renderItem = useCallback<
    ListRenderItem<FieldArrayWithId<EmailSendForm, 'emails', 'id'>>
  >(
    ({ index }) => (
      <Block flexDirection="row" alignItems="center">
        <Input name={`emails.${index}.value`} />
        <Block height={20} width={1} colorTheme="neutral200" />
        <Pressable
          disabled={fields.length === 1}
          style={[
            styles.rightContainer,
            fields.length === 1 && { opacity: 0.6 },
          ]}
          onPress={() => {
            remove(index);
          }}>
          <Icon icon="trash_2_outline" size={20} colorTheme="error500" />
        </Pressable>
      </Block>
    ),
    [fields.length, remove, styles.rightContainer],
  );

  const addNewEmail = useCallback(async () => {
    append({ value: '' });
    await delay(200);
    setFocus(`emails.${fields.length}.value`);
  }, [append, fields.length, setFocus]);

  return (
    <Block paddingTop={8} rowGap={8}>
      <Text
        t18n="send_email:emails"
        fontStyle="Title20Semi"
        colorTheme="neutral900"
      />
      <Block borderRadius={8} overflow="hidden" colorTheme="neutral100">
        <FlatList
          scrollEnabled={false}
          data={fields}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Separator type="horizontal" />}
        />
        <Separator type="horizontal" />
        {fields.length < 3 && (
          <Pressable style={styles.addEmailContainer} onPress={addNewEmail}>
            <Icon icon="plus_fill" size={18} colorTheme="primary900" />
            <Text
              t18n="send_email:add_email"
              colorTheme="primary900"
              fontStyle="Body14Semi"
            />
          </Pressable>
        )}
      </Block>
    </Block>
  );
};

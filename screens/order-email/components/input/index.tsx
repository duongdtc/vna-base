import { Block, Icon, Text } from '@vna-base/components';
import { EmailForm } from '@vna-base/screens/order-email/type';
import { I18nKeys } from '@translations/locales';
import { useErrorMessageTranslation } from '@vna-base/utils/hooks';
import isEmpty from 'lodash.isempty';
import React, { memo, useMemo } from 'react';
import isEqual from 'react-fast-compare';
import { useController, useFormContext } from 'react-hook-form';
import {
  ActivityIndicator,
  Pressable,
  TextInput,
  TextInputProps,
} from 'react-native';
import { useStyles } from './styles';
import { useSelector } from 'react-redux';
import { selectIsLoadingEmail } from '@vna-base/redux/selector';
import { ColorLight } from '@theme/color';

type Props = TextInputProps & {
  name: 'subject' | 'email';
  t18n: I18nKeys;
  pattern?: RegExp;
  required?: boolean;
};

export const Input = memo(
  ({ name, t18n, pattern, required, ...textInputProps }: Props) => {
    const styles = useStyles();
    const { control, setFocus } = useFormContext<EmailForm>();
    const isLoadingEmail = useSelector(selectIsLoadingEmail);

    const {
      field: { value, onChange, ref },
      fieldState: { error },
    } = useController<EmailForm>({
      name: name,
      rules: {
        pattern,
        required,
      },
      control,
    });

    const message = useErrorMessageTranslation(error?.message);

    const isError = useMemo<boolean>(() => {
      switch (true) {
        case isEmpty(message) && isEmpty(error):
          return false;

        default:
          return true;
      }
    }, [error, message]);

    return (
      <Block>
        <Pressable
          onPress={() => {
            setFocus(name);
          }}
          style={[styles.container, isError && styles.containerError]}>
          <Block
            flexDirection="row"
            justifyContent="space-between"
            columnGap={4}
            alignItems="center">
            <Block flex={1}>
              <Text
                t18n={t18n}
                colorTheme="neutral900"
                fontStyle="Title16Semi"
              />
            </Block>
            {isLoadingEmail ? (
              <Block
                borderRadius={8}
                style={{
                  transform: [
                    {
                      scale: 0.6,
                    },
                  ],
                }}>
                <ActivityIndicator size="small" color={ColorLight.primary500} />
              </Block>
            ) : (
              <Icon icon="edit_2_fill" size={20} colorTheme="neutral700" />
            )}
          </Block>
          <TextInput
            ref={ref}
            value={value as string}
            onChangeText={onChange}
            style={styles.input}
            {...textInputProps}
          />
        </Pressable>
        {isError && (
          <Text
            style={{ marginTop: 4 }}
            fontStyle="Capture11Reg"
            colorTheme="error500"
            text={message}
          />
        )}
      </Block>
    );
  },
  isEqual,
);

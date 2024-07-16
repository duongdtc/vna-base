import { Block, Icon, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { FilterFormInBottomSheet } from '@vna-base/screens/policy/type';
import { I18nKeys } from '@translations/locales';
import { translate } from '@vna-base/translations/translate';
import { APP_SCREEN } from '@utils';
import React from 'react';
import { Control, useController } from 'react-hook-form';
import { Pressable } from 'react-native';
import { useStyles } from './styles';

type Props = {
  t18n: I18nKeys;
  name: string;
  control: Control<FilterFormInBottomSheet, any>;
};

export const DepArrArea = ({ t18n, name, control }: Props) => {
  const styles = useStyles();

  const {
    field: { value, onChange },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
  } = useController<FilterFormInBottomSheet>({ name, control });

  return (
    <Pressable
      style={styles.depArrAreaContainer}
      onPress={() => {
        navigate(APP_SCREEN.DEP_ARR_AREA, {
          selected: value as string,
          onDone: (code: string) => {
            onChange(code);
          },
          t18n,
        });
      }}>
      <Block flex={1}>
        <Text
          t18n={t18n}
          fontStyle={value && value !== '' ? 'Title16Bold' : 'Body16Reg'}
          colorTheme="neutral900"
        />
      </Block>
      <Text
        text={
          value && value !== '' ? (value as string) : translate('common:all')
        }
        fontStyle="Body14Reg"
        colorTheme={value && value !== '' ? 'neutral900' : 'neutral700'}
      />
      <Icon
        icon="arrow_ios_right_outline"
        size={20}
        colorTheme={value ? 'neutral900' : 'neutral700'}
      />
    </Pressable>
  );
};

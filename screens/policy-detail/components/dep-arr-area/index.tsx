import { Block, Icon, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { PolicyDetailForm } from '@vna-base/screens/policy-detail/type';
import { I18nKeys } from '@translations/locales';
import { scale } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useController } from 'react-hook-form';
import { Pressable, StyleSheet } from 'react-native';
import { APP_SCREEN } from '@utils';

type Props = {
  t18n: I18nKeys;
  name: string;
};

export const DepArrArea = memo(({ t18n, name }: Props) => {
  const {
    field: { value, onChange },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
  } = useController<PolicyDetailForm>({ name });

  return (
    <Pressable
      style={styles.container}
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
        <Text t18n={t18n} fontStyle="Body16Reg" colorTheme="neutral900" />
      </Block>
      <Text
        text={value as string}
        fontStyle="Body14Reg"
        colorTheme="neutral900"
      />
      <Icon
        icon="arrow_ios_right_outline"
        size={20}
        colorTheme={value ? 'neutral900' : 'neutral700'}
      />
    </Pressable>
  );
}, isEqual);

const styles = StyleSheet.create({
  container: {
    paddingVertical: scale(20),
    paddingLeft: scale(16),
    paddingRight: scale(12),
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 8,
  },
});

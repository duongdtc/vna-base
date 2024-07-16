import { Block, RadioButton, Text } from '@vna-base/components';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { ActiveOpacity, GenderTypeDetails, HitSlop } from '@vna-base/utils';
import React from 'react';
import { useController } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from '@theme';

export const GenderSelect = ({ index }: { index: number }) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);

  const {
    field: { value, onChange },
    fieldState: { invalid },
  } = useController<PassengerForm>({
    name: `Passengers.${index}.Gender`,
    rules: {
      required: true,
    },
  });

  return (
    <Block marginTop={8} flexDirection="row" alignItems="center" columnGap={12}>
      {Object.values(GenderTypeDetails).map(({ key, t18n }) => {
        const selected = value === key;
        return (
          key !== undefined && (
            <Block key={key}>
              <TouchableOpacity
                hitSlop={HitSlop.Large}
                disabled={selected}
                activeOpacity={ActiveOpacity}
                style={styles.gender}
                onPress={() => onChange(key)}>
                <RadioButton
                  sizeDot={14}
                  value={selected}
                  disable
                  opacity={1}
                  unActiveColor={invalid ? colors.errorColor : undefined}
                />
                <Text
                  t18n={t18n}
                  fontStyle="Body16Reg"
                  colorTheme={
                    // eslint-disable-next-line no-nested-ternary
                    invalid
                      ? 'errorColor'
                      : selected
                      ? 'primaryColor'
                      : 'neutral60'
                  }
                />
              </TouchableOpacity>
            </Block>
          )
        );
      })}
    </Block>
  );
};

const styleSheet = createStyleSheet(({ spacings }) => ({
  gender: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacings[4],
  },
}));

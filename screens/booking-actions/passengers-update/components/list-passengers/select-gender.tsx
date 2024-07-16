import { Block, RadioButton, Text } from '@vna-base/components';
import { ActiveOpacity, GenderTypeDetails, HitSlop } from '@vna-base/utils';
import React, { memo } from 'react';
import { useController } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { PassengerUpdateForm } from '../../type';
import isEqual from 'react-fast-compare';

export const GenderSelect = memo(({ index }: { index: number }) => {
  const {
    field: { value, onChange },
  } = useController<PassengerUpdateForm>({
    name: `Passengers.${index}.Gender`,
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
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}
                onPress={() => onChange(key)}>
                <RadioButton
                  sizeDot={14}
                  value={selected}
                  disable
                  opacity={1}
                />
                <Text
                  t18n={t18n}
                  fontStyle="Body16Reg"
                  colorTheme={selected ? 'primary600' : 'neutral600'}
                />
              </TouchableOpacity>
            </Block>
          )
        );
      })}
    </Block>
  );
}, isEqual);

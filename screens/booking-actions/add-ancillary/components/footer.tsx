import { Block, Button, Text } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { AddAncillaryScreenParams } from '@navigation/type';
import { scale } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AddAncillaryForm } from '../type';
import { TotalPrice } from './total-price';

export const Footer = memo(
  ({ onDone }: Pick<AddAncillaryScreenParams, 'onDone'>) => {
    const { bottom } = useSafeAreaInsets();
    const { handleSubmit, formState } = useFormContext<AddAncillaryForm>();

    const submit = () => {
      handleSubmit(formData => {
        goBack();
        onDone({ passengers: formData.passengers });
      })();
    };

    return (
      <Block
        shadow="main"
        colorTheme="neutral100"
        paddingHorizontal={12}
        paddingTop={8}
        style={{ paddingBottom: scale(12) + bottom }}
        rowGap={8}>
        <Block
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Text
            t18n="add_ancillary:total_price"
            colorTheme="neutral900"
            fontStyle="Body14Semi"
          />
          <TotalPrice />
        </Block>

        <Block flexDirection="row" columnGap={10}>
          <Block flex={1}>
            <Button
              fullWidth
              size="medium"
              t18n="common:cancel"
              textColorTheme="neutral900"
              textFontStyle="Body14Semi"
              buttonColorTheme="neutral50"
              onPress={() => {
                goBack();
              }}
            />
          </Block>
          <Block flex={1}>
            <Button
              onPress={submit}
              fullWidth
              disabled={!formState.isDirty}
              size="medium"
              t18n="common:continue"
              textColorTheme="classicWhite"
              textFontStyle="Body14Semi"
              buttonColorTheme="primary500"
            />
          </Block>
        </Block>
      </Block>
    );
  },
  isEqual,
);

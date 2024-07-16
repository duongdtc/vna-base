import { Block, Button } from '@vna-base/components';
import {
  ConfigEmailForm,
  PreviewEmailBottomSheetRef,
} from '@vna-base/screens/config-email/type';
import React, { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { PreviewEmailBottomSheet } from '../preview-email-bottom-sheet';
import { useStyles } from './styles';

export const Footer = () => {
  const styles = useStyles();

  const previewRef = useRef<PreviewEmailBottomSheetRef>(null);
  const { getValues } = useFormContext<ConfigEmailForm>();

  return (
    <Block style={styles.container}>
      <Button
        onPress={() => {
          previewRef.current?.present(getValues());
        }}
        fullWidth
        size="medium"
        t18n="config_email:preview_email"
        rightIcon="pantone_fill"
        rightIconSize={20}
        textColorTheme="primary500"
        type="outline"
        activityIndicatorColorTheme="primary500"
      />
      <PreviewEmailBottomSheet ref={previewRef} />
    </Block>
  );
};

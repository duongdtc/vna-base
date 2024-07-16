import { Block, Button } from '@vna-base/components';
import {
  ConfigTicketForm,
  PreviewTicketBottomSheetRef,
} from '@vna-base/screens/config-ticket/type';
import React, { useRef } from 'react';
import { useFormContext } from 'react-hook-form';

import { PreviewTicketBottomSheet } from '../preview-ticket-bottom-sheet';
import { useStyles } from './styles';

export const Footer = () => {
  const styles = useStyles();

  const previewRef = useRef<PreviewTicketBottomSheetRef>(null);
  const { getValues } = useFormContext<ConfigTicketForm>();

  return (
    <Block style={styles.container}>
      <Button
        onPress={() => {
          previewRef.current?.present(getValues());
        }}
        fullWidth
        size="medium"
        t18n="config_ticket:preview_ticket"
        rightIcon="pantone_fill"
        rightIconSize={20}
        textColorTheme="primary500"
        type="outline"
        activityIndicatorColorTheme="primary500"
      />
      <PreviewTicketBottomSheet ref={previewRef} />
    </Block>
  );
};

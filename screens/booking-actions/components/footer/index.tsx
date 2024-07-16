import { Block, Button, showModalConfirm } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import React from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import { useStyles } from './styles';

type FooterProps<T> = {
  isShowModalConfirm?: boolean;
  onSubmit: (data: T) => void;
  disableSubmit?: boolean;
};

export function Footer<TFieldValues extends FieldValues = FieldValues>({
  onSubmit,
  isShowModalConfirm,
  disableSubmit,
}: FooterProps<TFieldValues>) {
  const styles = useStyles();

  const { handleSubmit } = useFormContext<TFieldValues>();

  const execute = () => {
    handleSubmit(data => {
      if (isShowModalConfirm) {
        showModalConfirm({
          t18nTitle: 'order_email:confirm_send_email',
          t18nSubtitle: 'order_email:confirm_subtitle',
          t18nOk: 'modal_confirm:ok',
          themeColorCancel: 'neutral50',
          themeColorTextCancel: 'neutral900',
          themeColorOK: 'success600',
          flexDirection: 'row',
          onOk: () => {
            onSubmit(data);
          },
        });
      } else {
        onSubmit(data);
      }
    })();
  };

  return (
    <Block style={styles.container}>
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
          onPress={execute}
          fullWidth
          disabled={disableSubmit}
          size="medium"
          t18n="common:execute"
          textColorTheme="classicWhite"
          textFontStyle="Body14Semi"
          buttonColorTheme="primary500"
        />
      </Block>
    </Block>
  );
}

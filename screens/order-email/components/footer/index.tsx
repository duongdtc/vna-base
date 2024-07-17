import { Block, BottomSheet, Button, showModalConfirm } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { emailActions } from '@vna-base/redux/action-slice';
import { EmailForm } from '@vna-base/screens/order-email/type';
import { SnapPoint, dispatch } from '@vna-base/utils';
import React, { memo, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext } from 'react-hook-form';
import { PreviewEmail } from './preview-email';
import { useStyles } from './styles';
import { goBack } from '@navigation/navigation-service';
import { useSelector } from 'react-redux';
import { selectIsLoadingEmail } from '@vna-base/redux/selector';

export const Footer = memo(() => {
  const styles = useStyles();
  const previewEmailBTSRef = useRef<NormalRef>(null);
  const isLoadingEmail = useSelector(selectIsLoadingEmail);

  const { getValues, handleSubmit } = useFormContext<EmailForm>();

  const sendEmail = () => {
    handleSubmit(data => {
      showModalConfirm({
        t18nTitle: 'order_email:confirm_send_email',
        t18nSubtitle: 'order_email:confirm_subtitle',
        t18nOk: 'modal_confirm:ok',
        themeColorCancel: 'neutral50',
        themeColorTextCancel: 'neutral900',
        themeColorOK: 'success600',
        flexDirection: 'row',
        onOk: () => {
          dispatch(
            emailActions.sendCustomEmail(data, isSuccess => {
              if (isSuccess) {
                goBack();
              }
            }),
          );
        },
      });
    })();
  };

  return (
    <Block style={styles.container}>
      <Button
        onPress={() => {
          previewEmailBTSRef.current?.present();
        }}
        fullWidth
        size="medium"
        t18n="common:preview_email"
        rightIcon="pantone_fill"
        rightIconSize={20}
        textColorTheme="primary500"
        type="outline"
      />

      <Block flexDirection="row" columnGap={12}>
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
            disabled={isLoadingEmail}
            onPress={sendEmail}
            fullWidth
            size="medium"
            t18n="common:send_email"
            textColorTheme="classicWhite"
            textFontStyle="Body14Semi"
            buttonColorTheme="primary500"
          />
        </Block>
      </Block>
      <BottomSheet
        paddingBottom
        enablePanDownToClose={false}
        enableOverDrag={false}
        ref={previewEmailBTSRef}
        type="normal"
        snapPoints={[SnapPoint.Full]}
        useDynamicSnapPoint={false}
        showCloseButton={true}
        t18nTitle="common:preview_email">
        <PreviewEmail formData={getValues()} />
      </BottomSheet>
    </Block>
  );
}, isEqual);

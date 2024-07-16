import { Block, Button } from '@vna-base/components';
import { PreviewEmailBottomSheet } from '@vna-base/screens/config-email/components';
import {
  ConfigEmailForm,
  PreviewEmailBottomSheetRef,
} from '@vna-base/screens/config-email/type';
import { HeaderAndFooterForm } from '@vna-base/screens/header-and-footer-of-email/type';
import { Content } from '@services/axios/axios-data';
import {
  LanguageSystem,
  LanguageSystemDetail,
  LanguageSystemDetails,
} from '@vna-base/utils';
import React, { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useStyles } from './styles';

export const Footer = (
  props: Pick<
    ConfigEmailForm,
    | 'showPrice'
    | 'showFooter'
    | 'showHeader'
    | 'showPNR'
    | 'template'
    | 'individualTicket'
    | 'includeETicket'
  >,
) => {
  const styles = useStyles();

  const previewRef = useRef<PreviewEmailBottomSheetRef>(null);

  const { getValues } = useFormContext<HeaderAndFooterForm>();

  return (
    <Block style={styles.container}>
      <Button
        onPress={() => {
          const value = getValues();

          const data: ConfigEmailForm & {
            languages: Record<
              LanguageSystem,
              LanguageSystemDetail & { contents: Array<Content> }
            >;
          } = {
            ...props,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            languages: {
              [value.language]: {
                contents: [value.Header, value.Footer],
                ...LanguageSystemDetails[value.language],
              },
            },
          };

          previewRef.current?.present(data);
        }}
        fullWidth
        size="medium"
        t18n="config_ticket:preview_ticket"
        rightIcon="pantone_fill"
        rightIconSize={20}
        textColorTheme="primary500"
        type="outline"
      />
      <PreviewEmailBottomSheet ref={previewRef} />
    </Block>
  );
};

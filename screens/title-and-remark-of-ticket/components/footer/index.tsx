import { Block, Button } from '@vna-base/components';
import React, { useRef } from 'react';
import { useStyles } from './styles';
import { PreviewTicketBottomSheet } from '@vna-base/screens/config-ticket/components';
import {
  ConfigTicketForm,
  PreviewTicketBottomSheetRef,
} from '@vna-base/screens/config-ticket/type';
import { useFormContext } from 'react-hook-form';
import { TitleAndRemarkForm } from '@vna-base/screens/title-and-remark-of-ticket/type';
import {
  LanguageSystem,
  LanguageSystemDetail,
  LanguageSystemDetails,
} from '@vna-base/utils';
import { Content } from '@services/axios/axios-data';

export const Footer = (
  props: Pick<
    ConfigTicketForm,
    'PNRColor' | 'foreColor' | 'logo' | 'mainColor' | 'showTicketNumber'
  >,
) => {
  const styles = useStyles();

  const previewRef = useRef<PreviewTicketBottomSheetRef>(null);

  const { getValues } = useFormContext<TitleAndRemarkForm>();

  return (
    <Block style={styles.container}>
      <Button
        onPress={() => {
          const value = getValues();

          const data: ConfigTicketForm & {
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
                contents: [value.Header, value.Footer, value.Remark],
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
      <PreviewTicketBottomSheet ref={previewRef} />
    </Block>
  );
};

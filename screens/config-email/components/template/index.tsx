import { images } from '@assets/image';
import { Block, Image, RadioButton, Text } from '@vna-base/components';
import { ConfigEmailForm } from '@vna-base/screens/config-email/type';
import { ActiveOpacity, TEMPLATE_E_TICKET } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useController } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { useStyles } from './styles';

export const Template = memo(() => {
  const styles = useStyles();

  const {
    field: { value, onChange },
  } = useController<ConfigEmailForm>({ name: 'template' });

  return (
    <Block rowGap={12} paddingTop={8}>
      <Text
        t18n="config_ticket:select_ticket_template"
        fontStyle="Title20Semi"
        colorTheme="neutral900"
      />
      <Block
        colorTheme="neutral100"
        borderRadius={8}
        padding={16}
        flexDirection="row"
        columnGap={12}>
        <TouchableOpacity
          disabled={value === TEMPLATE_E_TICKET.Temp1}
          style={styles.templateContainer}
          activeOpacity={ActiveOpacity}
          onPress={() => {
            onChange(TEMPLATE_E_TICKET.Temp1);
          }}>
          <Block
            borderRadius={4}
            overflow="hidden"
            borderWidth={20}
            borderColorTheme="neutral50">
            <Image
              source={images.email_1}
              containerStyle={styles.templateImg}
            />
            <Block position="absolute" right={6} bottom={6}>
              <RadioButton
                disable
                sizeDot={14}
                opacity={1}
                value={value === TEMPLATE_E_TICKET.Temp1}
              />
            </Block>
          </Block>
          <Text
            t18n="config_ticket:template_1"
            colorTheme="neutral900"
            fontStyle="Body16Reg"
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={value === TEMPLATE_E_TICKET.Temp2}
          onPress={() => {
            onChange(TEMPLATE_E_TICKET.Temp2);
          }}
          style={styles.templateContainer}
          activeOpacity={ActiveOpacity}>
          <Block
            borderRadius={4}
            overflow="hidden"
            borderWidth={20}
            borderColorTheme="neutral50">
            <Image
              source={images.email_2}
              containerStyle={styles.templateImg}
            />
            <Block position="absolute" right={6} bottom={6}>
              <RadioButton
                disable
                sizeDot={14}
                opacity={1}
                value={value === TEMPLATE_E_TICKET.Temp2}
              />
            </Block>
          </Block>
          <Text
            t18n="config_ticket:template_2"
            colorTheme="neutral900"
            fontStyle="Body16Reg"
          />
        </TouchableOpacity>
      </Block>
    </Block>
  );
}, isEqual);

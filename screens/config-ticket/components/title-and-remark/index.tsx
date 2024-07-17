/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, Button, Row, Separator, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { selectConfigTicketLanguages } from '@vna-base/redux/selector';
import { ConfigTicketForm } from '@vna-base/screens/config-ticket/type';
import { LanguageSystem, LanguageSystemDetails } from '@vna-base/utils';
import { APP_SCREEN } from '@utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

export const TitleAndRemark = memo(() => {
  const languages = useSelector(selectConfigTicketLanguages);
  const { getValues } = useFormContext<ConfigTicketForm>();

  const navToDetailOrCreate = (lng?: LanguageSystem) => {
    const { PNRColor, foreColor, logo, mainColor, showTicketNumber, template } =
      getValues();

    //@ts-ignore
    let languageKey: LanguageSystem = lng;

    if (!languageKey) {
      languageKey = Object.keys(LanguageSystemDetails).find(
        k => !languages[k as LanguageSystem],
      ) as LanguageSystem;
    }

    navigate(APP_SCREEN.TITLE_AND_REMARK_OF_TICKET, {
      languageKey,
      PNRColor,
      foreColor,
      logo,
      mainColor,
      showTicketNumber,
      template,
    });
  };

  return (
    <Block rowGap={12} paddingTop={8}>
      <Text
        t18n="config_ticket:title_and_remark"
        fontStyle="Title20Semi"
        colorTheme="neutral900"
      />
      <Block borderRadius={12} colorTheme="neutral100" overflow="hidden">
        {Object.values(languages).map((lng, index) => (
          <Block key={lng.key}>
            {index !== 0 && <Separator type="horizontal" size={3} />}
            <Row
              type="nav"
              t18n={lng.t18n}
              fixedTitleFontStyle
              onPress={() => {
                navToDetailOrCreate(lng.key);
              }}
              rightIcon="edit_2_fill"
              rightIconColorTheme="neutral700"
            />
          </Block>
        ))}
      </Block>
      {Object.values(languages).length <
        Object.keys(LanguageSystemDetails).length && (
        <Button
          onPress={() => {
            navToDetailOrCreate();
          }}
          fullWidth
          size="large"
          t18n="config_ticket:add_language"
          leftIcon="plus_fill"
          leftIconSize={18}
          textColorTheme="primary900"
          buttonColorTheme="neutral100"
        />
      )}
    </Block>
  );
}, isEqual);

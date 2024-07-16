import { Block, Icon, Text } from '@vna-base/components';
import { Ancillary, Passenger } from '@services/axios/axios-data';
import { I18nKeys } from '@translations/locales';
import { translate } from '@vna-base/translations/translate';
import React from 'react';

export const ItemService = ({
  dataService,
  titleT18n,
}: {
  dataService: Array<Ancillary & Passenger> | null | undefined;
  titleT18n: I18nKeys;
}) => {
  if (dataService?.length === 0) {
    return null;
  }

  return (
    <Block paddingBottom={12}>
      <Text
        t18n={titleT18n}
        fontStyle="Title20Semi"
        colorTheme="neutral900"
        style={{ marginBottom: 12 }}
      />
      <Block borderRadius={8} colorTheme="neutral100" padding={12}>
        {dataService?.map((service, idx) => {
          return (
            <Block key={idx} rowGap={4}>
              {idx !== 0 && (
                <Block height={1} colorTheme="neutral200" marginVertical={12} />
              )}
              {/* //cmt: passenger + status code */}
              <Block
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between">
                <Text
                  text={`${service.Surname} ${service.GivenName}`}
                  fontStyle="Body12Med"
                  colorTheme="neutral900"
                />
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Icon
                    icon={
                      service.StatusCode === 'HK' && service.Confirmed
                        ? 'checkmark_circle_fill'
                        : 'alert_circle_fill'
                    }
                    size={16}
                    colorTheme={
                      service.StatusCode === 'HK' && service.Confirmed
                        ? 'success500'
                        : 'error500'
                    }
                  />
                  <Text
                    text={
                      service.StatusCode === 'HK' && service.Confirmed
                        ? translate('booking:confirm')
                        : translate('booking:not_confirm')
                    }
                    fontStyle="Body12Reg"
                    colorTheme="neutral900"
                  />
                </Block>
              </Block>
              {/* //cmt: service */}
              <Block
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                columnGap={4}>
                <Block
                  flex={1}
                  flexDirection="row"
                  alignItems="center"
                  columnGap={4}
                  flexWrap="wrap">
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    text={service.Name?.trim()}
                    fontStyle="Body12Reg"
                    colorTheme="neutral900"
                  />
                  <Block height={12} width={1} colorTheme="neutral400" />
                  <Text fontStyle="Body12Med" colorTheme="neutral900">
                    {service.StartPoint}
                    {service.StartPoint && service.EndPoint && '-'}
                    <Text
                      text={`${service.EndPoint}`}
                      fontStyle="Body12Med"
                      colorTheme="neutral900"
                    />
                  </Text>
                </Block>
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Text
                    t18n="common:price"
                    fontStyle="Body12Reg"
                    colorTheme="neutral800"
                  />
                  <Text
                    text={service.Price?.currencyFormat()}
                    fontStyle="Body12Bold"
                    colorTheme="price"
                  />
                </Block>
              </Block>
            </Block>
          );
        })}
      </Block>
    </Block>
  );
};

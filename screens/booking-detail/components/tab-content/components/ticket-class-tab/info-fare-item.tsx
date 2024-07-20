import { Block, Icon, Text } from '@vna-base/components';
import { FareInfo } from '@services/axios/axios-data';
import { I18nKeys } from '@translations/locales';
import { translate } from '@vna-base/translations/translate';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';

export const InfoFareItem = memo(
  ({
    dataFare,
    titleT18n,
  }: {
    dataFare: FareInfo[] | undefined;
    titleT18n: I18nKeys;
  }) => {
    if (dataFare?.length === 0) {
      return null;
    }

    return (
      <Block paddingBottom={16}>
        <Text
          t18n={titleT18n}
          fontStyle="Title20Semi"
          colorTheme="neutral900"
        />
        <Block borderRadius={12} colorTheme="neutral100" marginTop={8}>
          {dataFare?.map((item, idx) => {
            return (
              <Block key={item.Id}>
                {idx !== 0 && <Block height={1} colorTheme="neutral200" />}
                <Block paddingVertical={12} rowGap={8}>
                  <Block
                    flexDirection="row"
                    alignItems="center"
                    paddingHorizontal={12}
                    justifyContent="space-between">
                    <Block
                      flexDirection="row"
                      alignItems="center"
                      columnGap={4}>
                      <Text
                        text={item.StartPoint as string}
                        fontStyle="Body14Semi"
                        colorTheme="primary900"
                      />
                      <Icon
                        icon="arrow_list"
                        size={18}
                        colorTheme="primary900"
                      />
                      <Text
                        text={item.EndPoint as string}
                        fontStyle="Body14Semi"
                        colorTheme="primary900"
                      />
                    </Block>
                    <Block
                      colorTheme="info600"
                      flexDirection="row"
                      borderRadius={4}
                      alignItems="center"
                      justifyContent="center"
                      paddingVertical={4}
                      paddingHorizontal={12}>
                      <Text
                        text={item.FareClass as string}
                        colorTheme="white"
                        fontStyle="Capture11Bold"
                      />
                      {item.FareBasis && (
                        <Text
                          text={`_${item.FareBasis}`}
                          colorTheme="white"
                          fontStyle="Capture11Bold"
                        />
                      )}
                    </Block>
                  </Block>
                  <Block flexDirection="row" paddingHorizontal={12}>
                    <Block
                      flex={1}
                      flexDirection="row"
                      justifyContent="space-between">
                      <Text
                        t18n="flight:hand_baggage"
                        fontStyle="Body12Reg"
                        colorTheme="neutral800"
                      />
                      <Block flex={1} alignItems="flex-end">
                        <Text
                          text={
                            item.HandBaggage !== null
                              ? (item.HandBaggage as string)
                              : translate('booking:follow_condition')
                          }
                          fontStyle="Body14Semi"
                          colorTheme="primary600"
                        />
                      </Block>
                    </Block>
                    <Block
                      width={1}
                      height={'100%'}
                      marginHorizontal={8}
                      colorTheme="neutral200"
                    />
                    <Block
                      flex={1}
                      flexDirection="row"
                      justifyContent="space-between">
                      <Text
                        t18n="flight:free_baggage"
                        fontStyle="Body12Reg"
                        colorTheme="neutral800"
                      />
                      <Block flex={1} alignItems="flex-end">
                        <Text
                          text={
                            item.FreeBaggage
                              ? (item.FreeBaggage as string)
                              : translate('booking:follow_condition')
                          }
                          fontStyle="Body14Semi"
                          colorTheme="primary600"
                        />
                      </Block>
                    </Block>
                  </Block>
                </Block>
              </Block>
            );
          })}
        </Block>
      </Block>
    );
  },
  isEqual,
);

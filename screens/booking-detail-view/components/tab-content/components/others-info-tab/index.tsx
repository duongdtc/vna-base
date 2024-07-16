import { Block, Text } from '@vna-base/components';
import { selectViewingBookingVersion } from '@redux-selector';
import React from 'react';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

export const OthersInfoTab = () => {
  const bookingDetail = useSelector(selectViewingBookingVersion);

  return (
    <Block flex={1}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 12,
        }}>
        <Block colorTheme="neutral100" borderRadius={8}>
          <Block
            flexDirection="row"
            alignItems="center"
            paddingVertical={20}
            paddingHorizontal={16}
            justifyContent="space-between">
            <Text
              t18n="booking:sign_in_set"
              fontStyle="Body16Reg"
              colorTheme="neutral900"
            />
            <Text
              text={bookingDetail?.SignIn ?? ''}
              fontStyle="Body14Reg"
              colorTheme="neutral700"
            />
          </Block>
          <Block height={1} colorTheme="neutral200" />
          <Block
            flexDirection="row"
            alignItems="center"
            paddingVertical={20}
            paddingHorizontal={16}
            justifyContent="space-between">
            <Text
              t18n="booking:pcc_set"
              fontStyle="Body16Reg"
              colorTheme="neutral900"
            />
            <Text
              text={bookingDetail?.Pcc ?? ''}
              fontStyle="Body14Reg"
              colorTheme="neutral700"
            />
          </Block>
          <Block height={1} colorTheme="neutral200" />
          <Block
            flexDirection="row"
            alignItems="center"
            paddingVertical={20}
            paddingHorizontal={16}
            justifyContent="space-between">
            <Text
              t18n="booking:speech"
              fontStyle="Body16Reg"
              colorTheme="neutral900"
            />
            <Text
              text={bookingDetail?.Latency?.toString()}
              fontStyle="Body14Reg"
              colorTheme="neutral700"
            />
          </Block>
          <Block height={1} colorTheme="neutral200" />
          <Block
            flexDirection="row"
            alignItems="center"
            paddingVertical={20}
            paddingHorizontal={16}
            justifyContent="space-between">
            <Text
              t18n="booking:auto_issue"
              fontStyle="Body16Reg"
              colorTheme="neutral900"
            />
            <Text
              text={bookingDetail?.AutoIssue ? 'True' : 'False'}
              fontStyle="Body14Reg"
              colorTheme="neutral700"
            />
          </Block>
          <Block height={1} colorTheme="neutral200" />
          <Block
            flexDirection="row"
            alignItems="center"
            paddingVertical={20}
            paddingHorizontal={16}
            justifyContent="space-between">
            <Text
              t18n="booking:acc_code"
              fontStyle="Body16Reg"
              colorTheme="neutral900"
            />
            <Text
              text={bookingDetail?.AccountCode ?? ''}
              fontStyle="Body14Reg"
              colorTheme="neutral700"
            />
          </Block>
          <Block height={1} colorTheme="neutral200" />
          <Block
            flexDirection="row"
            alignItems="center"
            paddingVertical={20}
            paddingHorizontal={16}
            justifyContent="space-between">
            <Text
              t18n="booking:tour_code"
              fontStyle="Body16Reg"
              colorTheme="neutral900"
            />
            <Text
              text={bookingDetail?.Tourcode ?? ''}
              fontStyle="Body14Reg"
              colorTheme="neutral700"
            />
          </Block>
          <Block height={1} colorTheme="neutral200" />
          <Block
            flexDirection="row"
            alignItems="center"
            paddingVertical={20}
            paddingHorizontal={16}
            justifyContent="space-between">
            <Text
              t18n="booking:ca_code"
              fontStyle="Body16Reg"
              colorTheme="neutral900"
            />
            <Text
              text={bookingDetail?.CACode ?? ''}
              fontStyle="Body14Reg"
              colorTheme="neutral700"
            />
          </Block>
        </Block>
      </ScrollView>
    </Block>
  );
};

import { Block, Text } from '@vna-base/components';
import { LOGO_URL } from '@env';
import { AdditionalPassengerInfoForm } from '@vna-base/screens/flight/type';
import { AirlineRealm } from '@services/realm/models';
import { useRealm } from '@services/realm/provider';
import { useTheme } from '@theme';
import { FontStyle } from '@theme/typography';
import { HairlineWidth } from '@vna-base/utils';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput } from 'react-native';
import { SvgUri } from 'react-native-svg';

export const AddMembershipCardNumb = ({
  airline,
  index,
}: {
  airline: string;
  index: number;
}) => {
  const { control, setFocus } = useFormContext<AdditionalPassengerInfoForm>();

  const [t] = useTranslation();
  const { colors } = useTheme();
  const realm = useRealm();

  const [isFocus, setIsFocus] = useState(false);

  const airlineData = realm.objectForPrimaryKey<AirlineRealm>(
    AirlineRealm.schema.name,
    airline,
  );

  return (
    <Block>
      <Controller
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <Pressable
            onPress={() => {
              setFocus(`ListMembership.${index}.MembershipID`);
            }}
            style={{
              flex: 1,
              borderWidth: HairlineWidth * (isFocus ? 6 : 3),
              borderColor: colors[isFocus ? 'primary500' : 'neutral300'],
              borderRadius: 8,
              flexDirection: 'row',
              columnGap: 4,
              alignItems: 'center',
            }}>
            <Block
              padding={12}
              flexDirection="row"
              columnGap={4}
              alignItems="center"
              maxWidth={140}>
              <Block width={24} height={24} borderRadius={8} overflow="hidden">
                <SvgUri
                  width={24}
                  height={24}
                  uri={LOGO_URL + airline + '.svg'}
                />
              </Block>
              <Block flex={1}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  fontStyle="Body12Med"
                  colorTheme="neutral700"
                  text={airlineData?.NameVi ?? airlineData?.NameEn}
                />
              </Block>
            </Block>
            <Block flex={1} paddingHorizontal={12}>
              <TextInput
                ref={ref}
                onChangeText={onChange}
                onFocus={() => {
                  setIsFocus(true);
                }}
                onBlur={() => {
                  setIsFocus(false);
                }}
                value={value ?? ''}
                placeholder={t('input_info_passenger:membership_card')}
                placeholderTextColor={colors.neutral600}
                style={{
                  width: '100%',
                  paddingVertical: 12,
                  ...FontStyle.Body16Reg,
                }}
              />
            </Block>
          </Pressable>
        )}
        name={`ListMembership.${index}.MembershipID`}
      />
    </Block>
  );
};

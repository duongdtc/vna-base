import { images } from '@assets/image';
import { Block, Icon, Image, Text } from '@vna-base/components';
import { ActiveOpacity } from '@vna-base/utils';
import React, { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useStyles, createStyleSheet } from '@theme';

export const FooterService = () => {
  const { styles } = useStyles(styleSheet);
  const [isChoose, setIsChoose] = useState<boolean>(true);

  const _chooseInsurance = useCallback(() => {
    setIsChoose(prev => !prev);
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={ActiveOpacity}
      onPress={_chooseInsurance}
      style={styles.btnIssurance}>
      <Block
        flexDirection="row"
        alignItems="center"
        marginBottom={12}
        justifyContent="space-between">
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          <Text
            fontStyle="Body16Semi"
            colorTheme="neutral100"
            t18n="choose_services:travel_insurance"
          />
          <Image
            source={images.default_avatar}
            style={{ width: 98, height: 24 }}
            resizeMode="cover"
          />
        </Block>
        <Icon
          icon={isChoose ? 'checkmark_circle_2_fill' : 'radio_button_off_fill'}
          size={24}
          colorTheme={isChoose ? 'successColor' : 'neutral50'}
        />
      </Block>
      <Image
        source={images.default_avatar}
        style={styles.imgIssurance}
        resizeMode="cover"
      />
      <Text
        style={{ marginTop: 12 }}
        fontStyle="Body14Semi"
        colorTheme="neutral100"
        t18n="choose_services:note_travel_insurance"
      />
      <Block marginTop={12} flexDirection="row" width={342}>
        <Text
          fontStyle="Body12Med"
          colorTheme="neutral100"
          t18n="choose_services:benefit"
        />
        <Text
          fontStyle="Body12Reg"
          colorTheme="neutral100"
          t18n="choose_services:sub_benefit"
        />
      </Block>
      <Block
        flexDirection="row"
        alignItems="center"
        marginTop={12}
        justifyContent="space-between">
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => {}}
          style={styles.btnDetail}>
          <Text
            fontStyle="Body10Reg"
            t18n="choose_services:detail"
            colorTheme="primaryColor"
          />
          <Icon icon="external_link_fill" size={12} colorTheme="primaryColor" />
        </TouchableOpacity>
        <Block flexDirection="row" alignItems="center">
          <Text
            fontStyle="Body16Semi"
            colorTheme="successColor"
            text="108,000"
          />
          <Text fontStyle="Body16Semi" colorTheme="neutral100" text="VND" />
        </Block>
      </Block>
    </TouchableOpacity>
  );
};

const styleSheet = createStyleSheet(
  ({ radius, spacings, colors, shadows }) => ({
    imgIssurance: {
      width: '100%',
      height: 60,
      borderRadius: radius[12],
    },
    btnDetail: {
      paddingVertical: spacings[6],
      paddingHorizontal: spacings[12],
      backgroundColor: colors.neutral50,
      borderRadius: spacings[12],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: spacings[2],
    },
    btnIssurance: {
      marginTop: spacings[16],
      backgroundColor: colors.neutral10,
      paddingHorizontal: spacings[12],
      borderRadius: radius[8],
      paddingVertical: spacings[16],
      ...shadows.small,
    },
  }),
);

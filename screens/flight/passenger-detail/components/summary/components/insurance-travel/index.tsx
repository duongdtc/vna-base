import React from 'react';
import { ActiveOpacity, scale } from '@vna-base/utils';
import { Image, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, bs, useStyles } from '@theme';
import { Block, Icon, Image as ImgComp, Text } from '@vna-base/components';
import { images as imgSource } from '@assets/image';
import { translate } from '@vna-base/translations/translate';
import { useFormContext, useWatch } from 'react-hook-form';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { images } from '@vna-base/assets/image';

export const InsuranceTravelTab = () => {
  const { control } = useFormContext<PassengerForm>();

  const insurance = useWatch({
    control,
    name: 'Insurance',
  });

  const { styles } = useStyles(styleSheet);

  if (!insurance) {
    return (
      <Block flex={1} justifyContent="center" alignItems="center">
        <ImgComp
          source={imgSource.img_other_service}
          style={{ width: scale(100), height: scale(100) }}
          resizeMode="contain"
        />
        <Text
          fontStyle="Body16Semi"
          colorTheme="primaryColor"
          t18n="input_info_passenger:not_others_services"
          style={{ marginTop: scale(12) }}
        />
        <Text
          fontStyle="Body12Reg"
          colorTheme="neutral60"
          t18n="input_info_passenger:sub_not_others_services"
        />
      </Block>
    );
  }

  return (
    <View style={styles.insuranceContainer}>
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        style={[bs.flexRowSpaceBetween]}>
        <View style={[bs.flex, bs.flexRowAlignCenter, bs.columnGap_8]}>
          <Text
            fontStyle="Title16Semi"
            colorTheme="neutral100"
            t18n="choose_services:insurance_travel"
          />
          <Image source={images.saladinImg} resizeMode="contain" />
        </View>
      </TouchableOpacity>
      <View style={styles.imageInsurance}>
        <Image source={images.insuranceImg} resizeMode="contain" />
      </View>
      <Text
        fontStyle="Body14Semi"
        colorTheme="neutral100"
        t18n="choose_services:des_insurance1"
      />
      <Text fontStyle="Body12Med" colorTheme="neutral100">
        {translate('choose_services:des_insurance2')}{' '}
        <Text
          fontStyle="Body12Reg"
          colorTheme="neutral100"
          t18n="choose_services:des_insurance3"
        />
      </Text>
      <View style={[bs.flexRowSpaceBetween]}>
        <View style={styles.detailInsurance}>
          <Text
            t18n="choose_services:detail"
            fontStyle="Capture11Reg"
            colorTheme="primaryPressed"
          />
          <Icon
            icon="external_link_fill"
            size={12}
            colorTheme="primaryPressed"
          />
        </View>
        <View>
          <Text fontStyle="Title16Semi" colorTheme="price">
            {'108,000'}{' '}
            <Text fontStyle="Title16Semi" colorTheme="neutral100" text="VND" />
          </Text>
        </View>
      </View>
    </View>
  );
};

const styleSheet = createStyleSheet(({ spacings, colors, radius }) => ({
  contentContainer: {
    paddingTop: spacings[16],
    paddingHorizontal: spacings[12],
    paddingBottom: spacings[16],
  },
  insuranceContainer: {
    margin: spacings[12],
    backgroundColor: colors.white,
    borderRadius: radius[8],
    padding: spacings[12],
    rowGap: spacings[12],
  },
  imageInsurance: {
    width: '100%',
    height: scale(106),
    borderRadius: radius[8],
    overflow: 'hidden',
  },
  detailInsurance: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacings[12],
    paddingVertical: spacings[6],
    backgroundColor: colors.neutral20,
    borderRadius: radius[8],
  },
}));

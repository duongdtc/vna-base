import { Block, Button, Icon, NormalHeader, Text } from '@vna-base/components';
import React, { useMemo } from 'react';
import { SharedValue } from 'react-native-reanimated';
import { useFormContext, useWatch } from 'react-hook-form';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { HitSlop } from '@vna-base/utils';
import { View } from 'react-native';
import { bs, useStyles } from '@theme';

export const Header = ({
  onPressBack,
}: {
  onPressBack: () => void;
  // sau này muốn làm animation thì làm
  sharedValue: SharedValue<number>;
}) => {
  const {
    theme: { colors },
  } = useStyles();
  const { control } = useFormContext<PassengerForm>();

  const tabIndex = useWatch({
    control,
    name: 'TabIndex',
  });

  const t18nTitle = useMemo(() => {
    switch (tabIndex) {
      case 1:
        return 'choose_services:choose_services';
      case 2:
        return 'info_payment:info_payment';

      default:
        return 'input_info_passenger:input_info';
    }
  }, [tabIndex]);

  const _renderLeftContent = (
    <Block flexDirection="row" alignItems="center" columnGap={8}>
      <Button
        hitSlop={HitSlop.Large}
        leftIcon="arrow_ios_left_outline"
        padding={4}
        onPress={onPressBack}
        leftIconSize={24}
        textColorTheme="white"
      />
      <Text fontStyle="H320Semi" t18n={t18nTitle} colorTheme="white" />
    </Block>
  );

  const _renderRightContent = (
    <Block flexDirection="row" alignItems="center">
      <View
        style={[
          bs.width_16,
          bs.height_16,
          bs.borderRadius_8,
          bs.contentCenter,
          { opacity: 1, backgroundColor: colors.white },
        ]}>
        <Text fontStyle="Body12Reg" text="1" colorTheme="primaryColor" />
      </View>
      <Block opacity={tabIndex !== 0 ? 1 : 0.4}>
        <Icon
          icon={tabIndex !== 0 ? 'minus_fill' : 'more_horizontal_fill'}
          size={16}
          colorTheme="white"
        />
      </Block>
      <View
        style={[
          bs.width_16,
          bs.height_16,
          bs.borderRadius_8,
          bs.contentCenter,
          { opacity: tabIndex !== 0 ? 1 : 0.4, backgroundColor: colors.white },
        ]}>
        <Text fontStyle="Body12Reg" text="2" colorTheme="primaryColor" />
      </View>
      <Block opacity={tabIndex === 2 ? 1 : 0.4}>
        <Icon
          icon={tabIndex === 2 ? 'minus_fill' : 'more_horizontal_fill'}
          size={16}
          colorTheme="white"
        />
      </Block>
      <View
        style={[
          bs.width_16,
          bs.height_16,
          bs.borderRadius_8,
          bs.contentCenter,
          { opacity: tabIndex === 2 ? 1 : 0.4, backgroundColor: colors.white },
        ]}>
        <Text fontStyle="Body12Reg" text="3" colorTheme="primaryColor" />
      </View>
    </Block>
  );

  return (
    <NormalHeader
      zIndex={0}
      leftContent={_renderLeftContent}
      rightContent={_renderRightContent}
    />
  );
};

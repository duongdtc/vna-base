import { goBack } from '@navigation/navigation-service';
import { useStyles } from '@theme';
import {
  Block,
  Button,
  Icon,
  NormalHeader,
  Screen,
  Text,
} from '@vna-base/components';
import { HitSlop } from '@vna-base/utils';
import React from 'react';
import { ScrollView } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';

export const CreateRequestSupport = () => {
  const {
    theme: { colors },
  } = useStyles();

  return (
    <Screen backgroundColor={colors.neutral20}>
      <NormalHeader
        colorTheme="neutral10"
        shadow=".3"
        leftContent={
          <Button
            hitSlop={HitSlop.Large}
            leftIcon="arrow_ios_left_fill"
            leftIconSize={24}
            textColorTheme="neutral900"
            onPress={() => {
              goBack();
            }}
            padding={4}
          />
        }
        centerContent={
          <Text
            fontStyle="Title20Semi"
            text="Tạo yêu cầu mới"
            colorTheme="neutral900"
          />
        }
      />
      <ScrollView contentContainerStyle={{ padding: 12, rowGap: 12 }}>
        <Block
          flexDirection="row"
          alignItems="center"
          columnGap={12}
          padding={12}
          colorTheme="neutral100"
          borderRadius={8}>
          <Icon icon="alert_circle_fill" colorTheme="neutral800" size={16} />
          <Text
            text="Yêu cầu có thể có tối đa 1500 kí tự và 5 ảnh"
            colorTheme="neutral900"
            fontStyle="Body12Reg"
          />
        </Block>
      </ScrollView>
      <Block
        shadow="main"
        style={{
          paddingVertical: 12,
          paddingHorizontal: 16,
          paddingBottom: UnistylesRuntime.insets.bottom + 12,
          backgroundColor: colors.neutral10,
        }}>
        <Button
          fullWidth
          buttonColorTheme="gra1"
          text="Gửi"
          textColorTheme="white"
        />
      </Block>
    </Screen>
  );
};

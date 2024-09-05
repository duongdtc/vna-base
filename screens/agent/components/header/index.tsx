import { Button, NormalHeader, Text } from '@vna-base/components';
import { goBack, navigate } from '@navigation/navigation-service';
import { HitSlop } from '@vna-base/utils';
import React from 'react';
import { APP_SCREEN } from '@utils';

export const Header = () => {
  return (
    <NormalHeader
      colorTheme="neutral10"
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
          t18n="agent:screen_name"
          colorTheme="neutral900"
        />
      }
      rightContent={
        <Button
          hitSlop={HitSlop.Large}
          leftIcon="plus_fill"
          leftIconSize={24}
          textColorTheme="neutral900"
          padding={4}
          onPress={() => navigate(APP_SCREEN.ADD_NEW_AGENT)}
        />
      }
    />
  );
};

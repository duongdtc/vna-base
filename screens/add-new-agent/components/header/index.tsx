import { Button, NormalHeader, Text } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { HitSlop } from '@vna-base/utils';
import React from 'react';

export const Header = () => {
  return (
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
          t18n="add_new_agent:add_new"
          colorTheme="neutral900"
        />
      }
    />
  );
};

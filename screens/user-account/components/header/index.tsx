import { goBack, navigate } from '@navigation/navigation-service';
import { APP_SCREEN } from '@utils';
import { Button, NormalHeader, Text } from '@vna-base/components';
import { HitSlop } from '@vna-base/utils';
import React from 'react';
export const Header = () => {
  const navToAddNewUserAccount = () => {
    navigate(APP_SCREEN.PERSONAL_INFO, {
      id: undefined,
      userSubAgtWithAgtId: undefined,
    });
  };

  return (
    <NormalHeader
      colorTheme="neutral100"
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
          t18n="user_account:list"
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
          onPress={navToAddNewUserAccount}
        />
      }
    />
  );
};

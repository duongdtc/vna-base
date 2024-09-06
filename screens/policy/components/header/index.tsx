import { Button, NormalHeader, Text } from '@vna-base/components';
import { goBack, navigate } from '@navigation/navigation-service';
import { HitSlop } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { APP_SCREEN } from '@utils';

export const Header = memo(() => {
  return (
    <NormalHeader
      zIndex={0}
      colorTheme="neutral10"
      leftContent={
        <Button
          hitSlop={HitSlop.Large}
          type="common"
          size="small"
          leftIcon="arrow_ios_left_fill"
          textColorTheme="neutral900"
          leftIconSize={24}
          padding={4}
          onPress={() => goBack()}
        />
      }
      rightContent={
        <Button
          hitSlop={HitSlop.Large}
          type="common"
          size="small"
          leftIcon="plus_outline"
          textColorTheme="neutral900"
          leftIconSize={24}
          padding={4}
          onPress={() => {
            navigate(APP_SCREEN.POLICY_DETAIL);
          }}
        />
      }
      centerContent={
        <Text
          t18n="policy:service_fee_list"
          fontStyle="Title20Semi"
          colorTheme="neutral900"
        />
      }
    />
  );
}, isEqual);

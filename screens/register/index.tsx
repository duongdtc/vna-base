import React, { memo } from 'react';

import isEqual from 'react-fast-compare';

import { Block, Button, Screen } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';

const RegisterComponent = () => {
  // render
  return (
    <Block block>
      <Screen>
        <Block block justifyContent={'center'} middle>
          <Button
            onPress={() => {
              goBack();
            }}
          />
        </Block>
      </Screen>
    </Block>
  );
};

export const Register = memo(RegisterComponent, isEqual);

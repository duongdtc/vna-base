/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { images } from '@assets/image';
import { goBack, navigate } from '@navigation/navigation-service';
import { createStyleSheet, useStyles } from '@theme';
import { APP_SCREEN } from '@utils';
import { Avatar, Button, Text } from '@vna-base/components';
import { selectCurrentAccount } from '@vna-base/redux/selector';
import { HitSlop, scale } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

export const Header = memo(() => {
  const { styles } = useStyles(styleSheet);

  const { Id, FullName } = useSelector(selectCurrentAccount);

  const navToUserAccount = () => {
    navigate(APP_SCREEN.PERSONAL_INFO, { id: Id! });
  };

  return (
    <View style={styles.container}>
      <Avatar
        source={images.default_avatar}
        size={36}
        onPress={navToUserAccount}
      />
      <View style={styles.nameAndAvatarContainer}>
        <Text
          text={FullName as string}
          numberOfLines={1}
          ellipsizeMode="tail"
          fontStyle="H320Semi"
        />
        <View style={styles.positionContainer}>
          <Text
            t18n="home:account"
            fontStyle="Body12Reg"
            colorTheme="neutral100"
          />
          <Text
            fontStyle="Body12Bold"
            numberOfLines={1}
            ellipsizeMode="tail"
            colorTheme="neutral100"
            // text={` ${UserGroup?.Code}-${UserGroup?.Name}`}
            text=" AD-Admin"
          />
        </View>
      </View>
      <Button
        leftIcon="close_outline"
        leftIconSize={24}
        padding={4}
        hitSlop={HitSlop.Large}
        onPress={() => {
          goBack();
        }}
      />
    </View>
  );
}, isEqual);

const styleSheet = createStyleSheet(() => ({
  container: {
    flexDirection: 'row',
    padding: scale(12),
    paddingLeft: scale(16),
    columnGap: scale(8),
    alignItems: 'center',
  },
  nameAndAvatarContainer: {
    rowGap: scale(2),
    flex: 1,
  },
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 2,
  },
}));

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Avatar, Button, Text } from '@vna-base/components';
import { goBack, navigate } from '@navigation/navigation-service';
import { selectCurrentAccount } from '@redux-selector';
import { createStyleSheet, useStyles } from '@theme';
import { HitSlop, scale } from '@vna-base/utils';
import { APP_SCREEN } from '@utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

export const Header = memo(() => {
  const { styles } = useStyles(styleSheet);

  const { Photo, Id, FullName, UserGroup } = useSelector(selectCurrentAccount);

  const navToUserAccount = () => {
    navigate(APP_SCREEN.PERSONAL_INFO, { id: Id! });
  };

  return (
    <View style={styles.container}>
      <Avatar source={Photo} size={36} onPress={navToUserAccount} />
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
            text={` ${UserGroup?.Code}-${UserGroup?.Name}`}
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

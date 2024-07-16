import { Button, Text } from '@vna-base/components';
import { VERSION_CODE, VERSION_NAME } from '@env';
import { createStyleSheet, useStyles } from '@theme';
import { MenuModules, logout, scale } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { Block } from './block';

export const Body = memo(() => {
  const { styles } = useStyles(styleSheet);
  const [t] = useTranslation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Block t18n="menu:management" features={MenuModules.slice(0, 4)} />
        <Block t18n="menu:administration" features={MenuModules.slice(4, 9)} />
        <Block t18n="menu:report" features={MenuModules.slice(9)} />
      </ScrollView>
      <View style={styles.footer}>
        <Button
          fullWidth
          t18n="common:logout"
          onPress={logout}
          buttonColorTheme="neutral30"
          size="medium"
          textColorTheme="errorColor"
        />
        <Text
          text={`${t('common:version')} ${VERSION_NAME}v${VERSION_CODE}`}
          fontStyle="Body10Reg"
          colorTheme="neutral100"
          textAlign="center"
          style={styles.versionTxt}
        />
      </View>
    </View>
  );
}, isEqual);

const styleSheet = createStyleSheet(() => ({
  container: {
    marginTop: scale(12),
    flex: 1,
  },
  contentContainer: {
    paddingVertical: scale(16),
    rowGap: scale(16),
  },
  footer: {
    paddingHorizontal: scale(12),
    paddingTop: scale(16),
    rowGap: scale(12),
    paddingBottom: scale(4),
  },
  versionTxt: { marginLeft: scale(4) },
}));

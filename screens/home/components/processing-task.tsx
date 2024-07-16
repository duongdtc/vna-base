import { Icon, Text } from '@vna-base/components';
import { bs, createStyleSheet, useStyles } from '@theme';
import { ActiveOpacity } from '@vna-base/utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

export const ProcessingTask = memo(() => {
  const [t] = useTranslation();
  const { styles } = useStyles(styleSheet);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={ActiveOpacity}
      onPress={() => {}}>
      <Icon icon="log_in_fill" size={24} colorTheme="successColor" />
      <View style={bs.flex}>
        <Text fontStyle="Body12Reg" colorTheme="neutral100">
          {t('home:still')}
          <Text fontStyle="Body12Bold" colorTheme="neutral100">
            {' 12 '}
            <Text
              t18n="home:noti_description"
              fontStyle="Body12Reg"
              colorTheme="neutral100"
            />
          </Text>
        </Text>
      </View>
      <Icon icon="arrow_ios_right_fill" size={24} colorTheme="neutral100" />
    </TouchableOpacity>
  );
}, isEqual);

const styleSheet = createStyleSheet(({ colors, spacings, radius }) => ({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.neutral20,
    paddingHorizontal: spacings[12],
    paddingVertical: spacings[8],
    borderRadius: radius[8],
    columnGap: spacings[12],
    marginHorizontal: spacings[12],
    alignItems: 'center',
  },
}));

import { Icon, Text } from '@vna-base/components';
import { useCASLContext } from '@services/casl';
import { createStyleSheet, useStyles, bs } from '@theme';
import { I18nKeys } from '@translations/locales';
import { ActiveOpacity, MenuModuleType, WindowWidth, scale } from '@vna-base/utils';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native';

type Props = { t18n: I18nKeys; features: Array<MenuModuleType> };

export const Block = memo(({ t18n, features }: Props) => {
  const { styles } = useStyles(styleSheet);
  const { can } = useCASLContext();

  const renderItem = useCallback<ListRenderItem<MenuModuleType>>(
    ({ item }) => {
      if (item.action && item.module && !can(item.action, item.module)) {
        return null;
      }

      return (
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => {}}
          style={styles.itemContainer}>
          <Icon icon={item.icon} size={28} colorTheme="primaryPressed" />
          <Text
            numberOfLines={2}
            textAlign="center"
            t18n={item.t18n}
            colorTheme="neutral100"
            fontStyle="Body12Reg"
          />
        </TouchableOpacity>
      );
    },
    [can, styles.itemContainer],
  );

  return (
    <View style={styles.container}>
      <View style={[bs.marginHorizontal_8]}>
        <Text t18n={t18n} colorTheme="neutral100" fontStyle="Body16Semi" />
      </View>
      <FlatList
        scrollEnabled={false}
        data={features}
        ItemSeparatorComponent={() => <View style={[bs.height_8]} />}
        renderItem={renderItem}
        numColumns={4}
      />
    </View>
  );
}, isEqual);

const styleSheet = createStyleSheet(() => ({
  container: {
    paddingTop: scale(4),
    rowGap: scale(12),
    paddingHorizontal: scale(8),
  },
  itemContainer: {
    paddingHorizontal: scale(7),
    rowGap: scale(8),
    alignItems: 'center',
    marginHorizontal: scale(4),
    width: (WindowWidth - scale(24 + 8 * 3)) / 4,
  },
}));

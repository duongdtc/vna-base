import { Button } from '@vna-base/components';
import { TimeSlotProps } from '@vna-base/screens/flight/type';
import { bs, createStyleSheet, useStyles } from '@theme';
import React from 'react';
import { View } from 'react-native';

export const TimeSlot = ({ slots, onChangeRange }: TimeSlotProps) => {
  const { styles } = useStyles(styleSheet);

  return (
    <View style={[bs.paddingVertical_12, bs.rowGap_8]}>
      <View style={[bs.paddingHorizontal_8, bs.rowGap_8]}>
        <View style={[bs.flexDirectionRow, bs.columnGap_8]}>
          <View style={bs.flex}>
            <Button
              text="00:00 - 05:59"
              size="medium"
              textFontStyle="Body14Bold"
              textColorTheme={slots[0] ? 'neutral100' : 'neutral80'}
              type="outline"
              fullWidth
              onPress={() => onChangeRange(0)}
              buttonStyle={slots[0] ? styles.selectedBtn : styles.btn}
            />
          </View>
          <View style={bs.flex}>
            <Button
              text="06:00 - 11:59"
              size="medium"
              textFontStyle="Body14Bold"
              textColorTheme={slots[1] ? 'neutral100' : 'neutral80'}
              type="outline"
              fullWidth
              onPress={() => onChangeRange(1)}
              buttonStyle={slots[1] ? styles.selectedBtn : styles.btn}
            />
          </View>
        </View>
        <View style={[bs.flexDirectionRow, bs.columnGap_8]}>
          <View style={bs.flex}>
            <Button
              text="12:00 - 17:59"
              size="medium"
              textFontStyle="Body14Bold"
              textColorTheme={slots[2] ? 'neutral100' : 'neutral80'}
              type="outline"
              fullWidth
              onPress={() => onChangeRange(2)}
              buttonStyle={slots[2] ? styles.selectedBtn : styles.btn}
            />
          </View>
          <View style={bs.flex}>
            <Button
              text="18:00 - 23:59"
              size="medium"
              textFontStyle="Body14Bold"
              textColorTheme={slots[3] ? 'neutral100' : 'neutral80'}
              type="outline"
              fullWidth
              onPress={() => onChangeRange(3)}
              buttonStyle={slots[3] ? styles.selectedBtn : styles.btn}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styleSheet = createStyleSheet(({ colors }) => ({
  btn: {
    borderColor: colors.neutral40,
    backgroundColor: colors.neutral10,
  },
  selectedBtn: {
    borderColor: colors.primarySurface,
    backgroundColor: colors.primaryFocus,
  },
}));

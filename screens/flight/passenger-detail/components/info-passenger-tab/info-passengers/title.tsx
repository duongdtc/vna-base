import { Block, Icon, Text } from '@vna-base/components';
import { PassengerForm } from '@vna-base/screens/flight/type';
import { bs, createStyleSheet, useStyles } from '@theme';
import { translate } from '@vna-base/translations/translate';
import { ActiveOpacity, PassengerType } from '@vna-base/utils';
import React, { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { SwitchGender } from './switch-gender';

export const Title = ({
  navToAdditionalInfo,
  isClose,
  index,
}: {
  navToAdditionalInfo: () => void;
  isClose: boolean;
  index: number;
}) => {
  const { styles } = useStyles(styleSheet);
  const { control } = useFormContext<PassengerForm>();

  const arrVal = useWatch({
    control,
    name: [
      `Passengers.${index}.FullName`,
      `Passengers.${index}.FirstName`,
      `Passengers.${index}.LastName`,
      `Passengers.${index}.Type`,
      `Passengers.${index}.Index`,
      'SplitFullName',
    ],
  });

  const translatedType = useMemo(() => {
    switch (arrVal[3]) {
      case PassengerType.ADT:
        return translate('input_info_passenger:adult');

      case PassengerType.CHD:
        return translate('input_info_passenger:children');

      case PassengerType.INF:
        return translate('input_info_passenger:infant');
    }
  }, [arrVal]);

  const name = useMemo(() => {
    if (
      !isClose ||
      (isClose &&
        arrVal[5] &&
        (!arrVal[1] || arrVal[1] === '') &&
        (!arrVal[2] || arrVal[2] === '')) ||
      (isClose && !arrVal[5] && (!arrVal[0] || arrVal[0] === '')) ||
      ((!arrVal[0] || arrVal[0] === '') &&
        (!arrVal[1] || arrVal[1] === '') &&
        (!arrVal[2] || arrVal[2] === ''))
    ) {
      return translate('input_info_passenger:info_passenger', {
        detail: `${translatedType} ${arrVal[4]}`,
      });
    }

    if (arrVal[5]) {
      return `${arrVal[2]?.trim() ?? ''} ${arrVal[2]?.trim() ?? ''}`;
    }

    return `${arrVal[0]?.trim() ?? ''}`;
  }, [isClose, arrVal, translatedType]);

  return (
    <TouchableOpacity
      activeOpacity={ActiveOpacity}
      // onPress={toggleContent}
      disabled
      style={styles.item}>
      <View style={[bs.flexRowAlignCenter, bs.columnGap_8]}>
        <SwitchGender index={index} />
        <Text
          fontStyle="Body16Semi"
          text={name.upperCaseFirstLetter()}
          colorTheme="primaryPressed"
        />
      </View>
      <Pressable onPress={navToAdditionalInfo}>
        <Block flexDirection="row" alignItems="center">
          <Text fontStyle="Body14Semi" text={'Thêm'} colorTheme="neutral80" />
          <Icon icon="arrow_ios_right_fill" size={16} colorTheme="neutral100" />
        </Block>
      </Pressable>
    </TouchableOpacity>
  );
};

const styleSheet = createStyleSheet(({ spacings }) => ({
  item: {
    padding: spacings[12],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

import { Block, Icon, Text } from '@vna-base/components';
import { FormBookingDetail } from '@vna-base/screens/booking-detail/type';
import { Passenger } from '@services/axios/axios-ibe';
import { I18nKeys } from '@translations/locales';
import { getFullNameOfPassenger, PassengerType } from '@vna-base/utils';
import React, { PropsWithChildren, useMemo, useState } from 'react';
import { FieldArrayWithId } from 'react-hook-form';
import { LayoutAnimation, Pressable } from 'react-native';

type AccordionItemPros = PropsWithChildren<{
  item: FieldArrayWithId<FormBookingDetail, 'Passengers', 'id'>;
}>;

export const ItemCollapseContent = ({ children, item }: AccordionItemPros) => {
  const [expanded, setExpanded] = useState(false);

  const toggleItem = () => {
    setExpanded(!expanded);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const RenderSubInfoPassenger = useMemo(() => {
    let typePassenger;
    switch (item.PaxType) {
      case PassengerType.CHD:
        typePassenger = 'flight:children';
        break;

      case PassengerType.INF:
        typePassenger = 'flight:infant';
        break;

      default:
        typePassenger = 'flight:adult';
        break;
    }

    return (
      <Block flexDirection="row" alignItems="center" columnGap={4}>
        <Text
          t18n={typePassenger as I18nKeys}
          fontStyle="Body12Med"
          colorTheme="neutral900"
        />
        <Block width={1} height={'100%'} colorTheme="neutral200" />
        <Text
          t18n={
            item.Gender === 0
              ? 'input_info_passenger:female'
              : 'input_info_passenger:male'
          }
          fontStyle="Body12Reg"
          colorTheme="neutral900"
        />
      </Block>
    );
  }, [item]);

  return (
    <Block overflow="hidden" colorTheme="neutral100" borderRadius={8}>
      <Pressable onPress={toggleItem}>
        <Block
          flexDirection="row"
          alignItems="center"
          padding={12}
          justifyContent="space-between">
          <Block rowGap={4}>
            <Text
              text={getFullNameOfPassenger({
                ...item,
                Title: item.PaxType,
              } as Passenger)}
              fontStyle="Title16Bold"
              colorTheme="primary900"
            />
            {RenderSubInfoPassenger}
          </Block>
          <Icon
            icon={expanded ? 'arrow_ios_up_fill' : 'arrow_ios_down_fill'}
            size={24}
            colorTheme="neutral900"
          />
        </Block>
      </Pressable>
      <Block height={expanded ? undefined : 0} overflow="hidden">
        {children}
      </Block>
    </Block>
  );
};

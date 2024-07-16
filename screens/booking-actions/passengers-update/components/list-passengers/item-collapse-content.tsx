import { Block, Icon, Text } from '@vna-base/components';
import React, { PropsWithChildren, useState } from 'react';
import { FieldArrayWithId } from 'react-hook-form';
import { LayoutAnimation, Pressable } from 'react-native';
import { PassengerUpdateForm } from '../../type';
import {
  getFullNameOfPassenger,
  PassengerType,
  PassengerTypeDetails,
} from '@vna-base/utils';
import { Passenger } from '@services/axios/axios-ibe';

type AccordionItemPros = PropsWithChildren<{
  item: FieldArrayWithId<PassengerUpdateForm, 'Passengers', 'id'>;
  index: number;
}>;

export const ItemCollapseContent = ({
  children,
  item,
  index,
}: AccordionItemPros) => {
  const [expanded, setExpanded] = useState(index === 0 ? true : false);

  const toggleItem = () => {
    setExpanded(!expanded);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

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
              text={getFullNameOfPassenger(item as Passenger)}
              fontStyle="Title16Bold"
              colorTheme="primary900"
            />
            <Block flexDirection="row" alignItems="center" columnGap={4}>
              <Text
                t18n={PassengerTypeDetails[item.PaxType as PassengerType].t18n}
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

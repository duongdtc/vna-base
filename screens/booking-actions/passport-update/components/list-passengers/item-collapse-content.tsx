import { Block, Icon, Text } from '@vna-base/components';
import { getFullNameOfPassenger } from '@vna-base/utils';
import React, { PropsWithChildren, useState } from 'react';
import { FieldArrayWithId } from 'react-hook-form';
import { LayoutAnimation, Pressable } from 'react-native';
import { PassportUpdateForm } from '../../type';

type AccordionItemPros = PropsWithChildren<{
  item: FieldArrayWithId<PassportUpdateForm, 'ListPassenger', 'id'>;
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
              text={getFullNameOfPassenger(item)}
              fontStyle="Title16Bold"
              colorTheme="primary900"
            />
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

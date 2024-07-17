import { Block, Button, Icon, Text } from '@vna-base/components';
import { documentActions } from '@vna-base/redux/action-slice';
import { Document } from '@services/axios/axios-data';
import { dispatch } from '@vna-base/utils';
import React, { useCallback } from 'react';

type Props = {
  item: Document;
};

export const ItemDocument = (props: Props) => {
  const { item } = props;

  const deleteDocument = useCallback(() => {
    dispatch(
      documentActions.deleteDocument(item.Id!, item.AgentId!, item.Name!),
    );
  }, [item]);

  return (
    <Block paddingVertical={12} paddingLeft={16} paddingRight={12}>
      <Block
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center">
        <Block
          flexDirection="row"
          alignItems="center"
          columnGap={8}
          flex={1}
          maxWidth={250}>
          <Icon icon="folder_fill" size={20} colorTheme="neutral900" />
          <Text
            text={item.Name as string}
            fontStyle="Body12Med"
            colorTheme="neutral900"
            ellipsizeMode="middle"
            numberOfLines={1}
          />
        </Block>
        <Block
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-end"
          columnGap={8}
          flex={1}>
          <Block
            paddingVertical={4}
            paddingHorizontal={8}
            borderWidth={10}
            borderColorTheme="neutral300">
            <Text
              text={item.Size as string}
              fontStyle="Capture11Reg"
              colorTheme="neutral900"
            />
          </Block>
          <Button
            type="common"
            size="small"
            leftIcon="trash_2_outline"
            textColorTheme="error500"
            leftIconSize={20}
            padding={4}
            onPress={deleteDocument}
          />
        </Block>
      </Block>
    </Block>
  );
};

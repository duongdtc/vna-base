import { Block, Icon, Text } from '@vna-base/components';
import { selectAgentDetailById } from '@redux-selector';
import { documentActions } from '@redux-slice';
import { selectListDocumentByAgentId } from '@redux/selector/document';
import { Document } from '@services/axios/axios-data';
import { dispatch } from '@vna-base/utils';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { ItemDocument } from './item-document';
import { useTheme } from '@theme';

export const DocumentsTab = () => {
  const { colors } = useTheme();
  const { Id } = useSelector(selectAgentDetailById);
  const ListDocument = useSelector(selectListDocumentByAgentId);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    dispatch(documentActions.getListDocumentByAgentId(Id!));
  }, [Id]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    dispatch(
      documentActions.getListDocumentByAgentId(Id!, () => {
        setIsRefreshing(false);
      }),
    );
  }, [Id]);

  const _renderItem = useCallback<ListRenderItem<Document>>(({ item }) => {
    return <ItemDocument item={item} />;
  }, []);

  return (
    <Block flex={1} colorTheme="neutral50">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.neutral900}
          />
        }
        contentContainerStyle={{
          paddingTop: 12,
          paddingHorizontal: 12,
          paddingBottom: 155,
        }}>
        <Pressable onPress={() => {}}>
          <Block
            flexDirection="row"
            alignItems="center"
            colorTheme="neutral100"
            paddingVertical={16}
            shadow=".3"
            borderRadius={8}
            columnGap={8}
            justifyContent="center">
            <Icon icon="upload_fill" size={18} colorTheme="primary900" />
            <Text
              t18n="agent:upload_document"
              colorTheme="primary900"
              fontStyle="Body14Semi"
            />
          </Block>
        </Pressable>
        <Block
          flex={1}
          marginTop={12}
          colorTheme="neutral100"
          borderRadius={12}>
          <FlatList
            data={ListDocument}
            keyExtractor={(item, index) => `${item.Id}_${index}`}
            renderItem={_renderItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <Block height={1} colorTheme="neutral50" />
            )}
          />
        </Block>
      </ScrollView>
    </Block>
  );
};

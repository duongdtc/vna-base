import { Block, Icon, Text } from '@vna-base/components';
import {
  selectAgentDetailById,
  selectListActivityByAgent,
} from '@redux-selector';
import { activityActions, employeeActions } from '@redux-slice';
import { Activity } from '@services/axios/axios-data';
import { dispatch } from '@vna-base/utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { ItemActivity } from './item-activity';
import { ModalAddNew, ModalAddNewActivity } from './modal-add-new-activity';
import { useTheme } from '@theme';

export const ActivitiesTab = () => {
  const { colors } = useTheme();
  const listActivityByAgt = useSelector(selectListActivityByAgent);
  const { Id } = useSelector(selectAgentDetailById);

  const actModalRef = useRef<ModalAddNew>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const _renderItem = useCallback<ListRenderItem<Activity>>(({ item }) => {
    return <ItemActivity item={item} />;
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    dispatch(
      activityActions.getListActivityByAgent(Id!, () => {
        setIsRefreshing(false);
      }),
    );
  }, [Id]);

  useEffect(() => {
    dispatch(activityActions.getListActivityByAgent(Id!));
    dispatch(employeeActions.getAllEmployeeOfAgent(Id!));
  }, [Id]);

  return (
    <Block flex={1} colorTheme="neutral50">
      <ScrollView
        contentContainerStyle={{
          padding: 12,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.neutral900}
          />
        }>
        <Pressable onPress={() => actModalRef.current?.show()}>
          <Block
            flexDirection="row"
            alignItems="center"
            colorTheme="neutral100"
            paddingVertical={16}
            shadow=".3"
            borderRadius={8}
            columnGap={8}
            justifyContent="center">
            <Icon icon="plus_fill" size={18} colorTheme="primary900" />
            <Text
              t18n="agent_detail:add_activity"
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
            data={listActivityByAgt}
            keyExtractor={(item, index) => `${item.Id}_${index}`}
            renderItem={_renderItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <Block height={1} colorTheme="neutral50" />
            )}
          />
        </Block>
      </ScrollView>
      <ModalAddNewActivity ref={actModalRef} />
    </Block>
  );
};

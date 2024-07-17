import { Block, Icon, Text } from '@vna-base/components';
import {
  selectAgentDetailById,
  selectListContactByAgentId,
} from '@vna-base/redux/selector';
import { contactActions } from '@vna-base/redux/action-slice';
import { Contact } from '@services/axios/axios-data';
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
import { ItemContact } from './item-contact';
import { ModalAddNewEmp, ModalAddNewEmployee } from './modal-add-new-employee';
import { useTheme } from '@theme';

export const EmployeesTab = () => {
  const { colors } = useTheme();
  const { Id } = useSelector(selectAgentDetailById);
  const ListContact = useSelector(selectListContactByAgentId);

  const contactEmptRef = useRef<ModalAddNewEmp>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    dispatch(contactActions.getListContactByAgentId(Id!));
  }, [Id]);

  const _renderItem = useCallback<ListRenderItem<Contact>>(({ item }) => {
    return <ItemContact item={item} />;
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    dispatch(
      contactActions.getListContactByAgentId(Id!, () => {
        setIsRefreshing(false);
      }),
    );
  }, [Id]);

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
          padding: 12,
        }}>
        <Pressable
          onPress={() => {
            contactEmptRef.current?.show();
          }}>
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
              t18n="agent:add_more_employees"
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
            data={ListContact}
            keyExtractor={(item, index) => `${item.Id}_${index}`}
            renderItem={_renderItem}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <Block height={1} colorTheme="neutral50" />
            )}
          />
        </Block>
      </ScrollView>
      <ModalAddNewEmployee ref={contactEmptRef} />
    </Block>
  );
};

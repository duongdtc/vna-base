import { Block, BottomSheet, Icon, RadioButton, Text } from '@vna-base/components';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  selectResultMonthAirlines,
  selectResultMonthFilterForm,
} from '@redux-selector';
import { flightResultMonthActions } from '@redux-slice';
import { AirlineRealm } from '@services/realm/models';
import { useRealm } from '@services/realm/provider';
import { translate } from '@vna-base/translations/translate';
import { ActiveOpacity, dispatch } from '@vna-base/utils';
import React, { useCallback, useRef } from 'react';
import { FlatList, ListRenderItem, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles } from './styles';

export const FilterButton = () => {
  const styles = useStyles();
  const normalRef = useRef<BottomSheetModal>(null);
  const airlines = useSelector(selectResultMonthAirlines);
  const filterForm = useSelector(selectResultMonthFilterForm);
  const realm = useRealm();

  const onPressItem = useCallback((airline: string) => {
    const _airline = airline === 'all' ? null : airline;

    normalRef.current?.dismiss();

    dispatch(flightResultMonthActions.changeFilterForm({ Airline: _airline }));
  }, []);

  const renderItem = useCallback<ListRenderItem<string>>(
    ({ item }) => {
      let title = '';
      let isSelected = false;

      if (!filterForm.Airline) {
        if (item === 'all') {
          isSelected = true;
        } else {
          isSelected = false;
        }
      } else {
        isSelected = item === filterForm.Airline;
      }

      if (item === 'all') {
        title = translate('common:select_all');
      } else {
        title =
          realm.objectForPrimaryKey<AirlineRealm>(AirlineRealm.schema.name, item)
            ?.NameVi ?? '';
      }

      return (
        <TouchableOpacity
          style={styles.airlineItem}
          activeOpacity={ActiveOpacity}
          onPress={() => {
            onPressItem(item);
          }}>
          <Text
            text={title}
            fontStyle="Body16Reg"
            colorTheme={isSelected ? 'neutral900' : 'neutral600'}
          />
          <RadioButton sizeDot={14} value={isSelected} disable opacity={1} />
        </TouchableOpacity>
      );
    },
    [filterForm.Airline, onPressItem, realm, styles.airlineItem],
  );

  return (
    <Block style={styles.bottomContainer}>
      <TouchableOpacity
        activeOpacity={ActiveOpacity}
        onPress={() => {
          normalRef.current?.present();
        }}
        style={styles.bottomBtn}>
        <Icon icon="options_2_outline" size={20} colorTheme="primary500" />
        <Text
          t18n="common:_filter"
          fontStyle="Body14Reg"
          colorTheme="neutral900"
        />
      </TouchableOpacity>
      <BottomSheet
        type="normal"
        typeBackDrop="gray"
        ref={normalRef}
        showIndicator={false}
        enablePanDownToClose={false}
        useDynamicSnapPoint={true}
        enableOverDrag={false}
        onDone={() => {}}
        t18nTitle="common:_filter">
        <Block>
          <Block
            padding={12}
            borderBottomWidth={3}
            borderColorTheme="neutral50">
            <Text
              t18n="flight:airline"
              fontStyle="Title16Semi"
              colorTheme="neutral900"
            />
          </Block>
          <FlatList
            contentContainerStyle={styles.filterContentContainer}
            scrollEnabled={false}
            data={['all', ...airlines]}
            keyExtractor={it => it}
            renderItem={renderItem}
          />
        </Block>
      </BottomSheet>
    </Block>
  );
};

import { Block, Screen, hideLoading, showLoading } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import { selectListRoute } from '@vna-base/redux/selector';
import { flightSearchActions } from '@vna-base/redux/action-slice';
import { Route } from '@redux/type';
import { MinPrice } from '@services/axios/axios-ibe';
import { delay, dispatch } from '@vna-base/utils';
import cloneDeep from 'lodash.clonedeep';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, LayoutAnimation, ListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';
import { FilterButton, Header, RouteItem } from './components';
import { SelectedMinPricesItem } from './components/selected-min-price-item';
import { useStyles } from './styles';
import { APP_SCREEN } from '@utils';

export const ResultSearchFlightByMonth = () => {
  const styles = useStyles();

  const routes = useSelector(selectListRoute);

  const [selectedMinPrices, setSelectedMinPrices] = useState<
    Array<MinPrice & { Leg: number }>
  >([]);

  const listRoute = useMemo(() => {
    const newList: Array<Route> = [];

    routes.forEach(r => {
      if (selectedMinPrices.findIndex(mp => mp.Leg === r.Leg) === -1) {
        newList.push(r);
      }
    });

    return newList;
  }, [routes, selectedMinPrices]);

  const selectMinPrice = useCallback(
    async (minPrice: MinPrice, Leg: number) => {
      const newList = cloneDeep(selectedMinPrices);

      newList.push({ ...minPrice, Leg });

      newList.sort((a, b) => a.Leg - b.Leg);

      setSelectedMinPrices(newList);

      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.linear,
        duration: 160,
      });

      if (newList.length === routes.length) {
        dispatch(
          flightSearchActions.searchFlights(undefined, undefined, newList),
        );
        showLoading();
        await delay(100);
        navigate(APP_SCREEN.RESULT_SEARCH_FLIGHT);
        hideLoading();
      }
    },
    [routes.length, selectedMinPrices],
  );

  const reselectMinPrice = (leg: number) => {
    setSelectedMinPrices(pre => {
      const newList = cloneDeep(pre);
      const idx = newList.findIndex(it => it.Leg === leg);

      if (idx !== -1) {
        newList.splice(idx, 1);
      }

      return newList;
    });

    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.linear,
      duration: 160,
    });
  };

  const renderItem = useCallback<ListRenderItem<Route>>(
    ({ item, index }) => (
      <RouteItem
        {...item}
        minDate={index === 0 ? null : routes[index - 1].DepartDate}
        selectMinPrice={selectMinPrice}
      />
    ),
    [routes, selectMinPrice],
  );

  const renderSelectedMinPrice = useCallback<
    ListRenderItem<MinPrice & { Leg: number }>
  >(
    ({ item }) => (
      <SelectedMinPricesItem {...item} reselectMinPrice={reselectMinPrice} />
    ),
    [],
  );

  return (
    <Screen backgroundColor={styles.container.backgroundColor}>
      <Header />
      {selectedMinPrices.length > 0 && (
        <Block marginVertical={8}>
          <FlatList
            contentContainerStyle={styles.selectedContentContainer}
            scrollEnabled={false}
            data={selectedMinPrices}
            keyExtractor={it => it.Leg.toString()}
            ItemSeparatorComponent={() => <Block height={8} />}
            renderItem={renderSelectedMinPrice}
          />
        </Block>
      )}
      <FlatList
        style={{ marginTop: selectedMinPrices.length > 0 ? 8 : 0 }}
        data={listRoute}
        keyExtractor={(it, idx) => `${idx}_${it.Leg}`}
        ItemSeparatorComponent={() => <Block height={8} />}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingTop: selectedMinPrices.length > 0 ? 0 : 8,
        }}
      />
      <FilterButton />
    </Screen>
  );
};

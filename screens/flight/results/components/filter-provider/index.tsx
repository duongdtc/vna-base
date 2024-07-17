/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BottomSheet, hideLoading, showLoading } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import { navigate } from '@navigation/navigation-service';
import { ResultSearchFlightParams } from '@navigation/type';
import { useFocusEffect } from '@react-navigation/native';
import {
  selectIsCryptic,
  selectListFlights,
  selectListRoute,
  selectMultiFlights,
  selectSearchDone,
  selectSearchForm,
  selectSort,
} from '@vna-base/redux/selector';
import { flightResultActions } from '@vna-base/redux/action-slice';
import { SearchForm } from '@vna-base/screens/flight/components';
import {
  AirOptionCustom,
  BottomSheetContentFlightRef,
  BottomSheetFareOptionRef,
  FLightItemInResultScreen,
  FilterContextType,
  FilterForm,
} from '@vna-base/screens/flight/type';
import { AirOption } from '@services/axios/axios-ibe';
import { FlashList } from '@shopify/flash-list';
import {
  delay,
  dispatch,
  filterFlight as filterFlightUtil,
  getState,
  sortFlights as sortFlightsUtil,
} from '@vna-base/utils';
import cloneDeep from 'lodash.clonedeep';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { LayoutAnimation, View } from 'react-native';
import { useSelector } from 'react-redux';
import { BottomSheetContentFlight } from '../content-flight-bottom-sheet';
import { BottomSheetFareOption } from '../bottom-sheet-fare-option';
import { APP_SCREEN } from '@utils';

const FilterContext = createContext<FilterContextType>({} as FilterContextType);

export const useFilterContext = () => useContext(FilterContext);

export const FilterProvider = ({
  children,
  routeParams,
}: {
  children: ReactNode;
  routeParams: ResultSearchFlightParams | undefined;
}) => {
  const researchBSRef = useRef<NormalRef>(null);
  const contentFlightBSRef = useRef<BottomSheetContentFlightRef>(null);
  const fareOptionBSRef = useRef<BottomSheetFareOptionRef>(null);
  const listFlightRef = useRef<FlashList<FLightItemInResultScreen>>(null);
  const customFilterFormRef = useRef<FilterForm | null>(null);

  const listFlight = useSelector(selectListFlights);
  const multiFlights = useSelector(selectMultiFlights);
  const sortField = useSelector(selectSort);
  const isCryptic = useSelector(selectIsCryptic);
  const { Type } = useSelector(selectSearchForm);
  const listRoute = useSelector(selectListRoute);
  const isDone = useSelector(selectSearchDone);

  const [selectedFlights, setSelectedFlights] = useState<
    Array<AirOptionCustom>
  >([]);

  const [returnFlights, setReturnFlights] = useState<
    Array<FLightItemInResultScreen>
  >([]);

  const filterFlight = useCallback(
    (customFilterForm?: FilterForm | null) => {
      const tempSelectedFlights = selectedFlights.filter(fl => !!fl);

      const _customFilterForm =
        customFilterForm === undefined
          ? customFilterFormRef.current
          : customFilterForm;

      if (customFilterForm !== undefined) {
        customFilterFormRef.current = customFilterForm;
      }

      let tempFlight = filterFlightUtil(listFlight, _customFilterForm);

      tempFlight = sortFlightsUtil(tempFlight, {
        ...sortField,
        FareType: _customFilterForm?.Fare ?? 'TotalFare',
      });

      if (!isDone) {
        tempFlight.ListAirOption = Array(8).fill(null) as Array<AirOption>;
      }

      setReturnFlights(
        tempSelectedFlights
          //@ts-ignore
          .concat(tempSelectedFlights.length > 0 ? [{ Type: 'Continue' }] : [])
          //@ts-ignore
          .concat(
            tempFlight.ListAirOption?.map((ao, idx) => {
              if (ao && idx === 0) {
                return { ...ao, Type: 'MinPrice' };
              } else if (ao && idx === 1) {
                return { ...ao, Type: 'Fastest' };
              }

              return ao;
            }),
          )
          .concat(
            multiFlights.length > 0 && tempSelectedFlights.length === 0
              ? //@ts-ignore
                [{ Type }]
              : [],
          )
          .concat(
            tempSelectedFlights.length > 0 ? [] : multiFlights,
          ) as Array<FLightItemInResultScreen>,
      );
    },
    [Type, isDone, listFlight, multiFlights, selectedFlights, sortField],
  );

  const showBottomSheet = useCallback(() => {
    researchBSRef.current?.expand();
  }, []);

  const callbackSubmitFormSearch = useCallback(() => {
    setSelectedFlights(new Array(listRoute.length).fill(null));
    researchBSRef.current?.close();
  }, [listRoute]);

  const showDetailAirOption = useCallback(
    (item: AirOption, flightOptionIndex = 0, stageIndex?: number) => {
      const { currentStage } = getState('flightResult');

      contentFlightBSRef.current?.expand({
        airOption: item,
        indexs: {
          stageIndex: stageIndex ?? currentStage,
          flightOptionIndex: flightOptionIndex,
        },
      });
    },
    [],
  );

  const showFareOption = useCallback(
    (
      item: AirOption,
      type: 'economy' | 'business',
      flightOptionIndex = 0,
      stageIndex?: number,
    ) => {
      const { currentStage } = getState('flightResult');

      fareOptionBSRef.current?.expand({
        type,
        airOption: item,
        indexs: {
          stageIndex: stageIndex ?? currentStage,
          flightOptionIndex: flightOptionIndex,
        },
      });
    },
    [],
  );

  const onSelectItem = useCallback(
    async (
      airOption: AirOption,
      flightOptionIndex: number,
      fareOptionIndex: number,
    ) => {
      customFilterFormRef.current = null;

      listFlightRef.current?.scrollToIndex({ index: 0, animated: true });
      if ((airOption.Itinerary ?? 1) > 1) {
        dispatch(
          flightResultActions.saveListSelectedFlight([
            {
              ...airOption,
              ListFlightOption: [
                airOption.ListFlightOption![flightOptionIndex],
              ],
              ListFareOption: [airOption.ListFareOption![fareOptionIndex]],
              selected: true,
            },
          ]),
        );

        showLoading();
        await delay(200);
        navigate(routeParams?.screenWhenDone ?? APP_SCREEN.PASSENGER_DETAIL);
        hideLoading();

        fareOptionBSRef.current?.close();

        return;
      }

      const tempSelectedFlights = cloneDeep(selectedFlights);
      const { currentStage } = getState('flightResult');
      const { routes } = getState('flightSearch');

      tempSelectedFlights[currentStage] = {
        ...airOption,
        ListFlightOption: [airOption.ListFlightOption![flightOptionIndex]],
        ListFareOption: [airOption.ListFareOption![fareOptionIndex]],
        selected: true,
      };

      setSelectedFlights(tempSelectedFlights);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      const nextIndex = tempSelectedFlights.findIndex(fl => fl === null);

      if (nextIndex !== -1) {
        dispatch(flightResultActions.changeCurrentStage(nextIndex));
      } else {
        dispatch(flightResultActions.changeCurrentStage(routes.length));
        dispatch(
          flightResultActions.saveListSelectedFlight(tempSelectedFlights),
        );

        showLoading();
        await delay(200);
        navigate(routeParams?.screenWhenDone ?? APP_SCREEN.PASSENGER_DETAIL);
        hideLoading();
      }

      fareOptionBSRef.current?.close();
    },
    [routeParams?.screenWhenDone, selectedFlights],
  );

  const onReselectItem = useCallback(
    (i: number) => {
      customFilterFormRef.current = null;

      const tempSelectedFlights = cloneDeep(selectedFlights);
      //@ts-ignore
      tempSelectedFlights[i] = null;

      setSelectedFlights(tempSelectedFlights);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      dispatch(flightResultActions.changeCurrentStage(i));
    },
    [selectedFlights],
  );

  useFocusEffect(
    useCallback(() => {
      if (routeParams?.selectedIndex === undefined) {
        dispatch(flightResultActions.changeCurrentStage(0));
        setSelectedFlights(pre => new Array(pre.length).fill(null));
      } else {
        onReselectItem(routeParams.selectedIndex);
      }
    }, [routeParams?.selectedIndex]),
  );

  useEffect(() => {
    if (listRoute.length !== 0) {
      setSelectedFlights(new Array(listRoute.length).fill(null));
    }
  }, [listRoute]);

  useEffect(() => {
    filterFlight();
  }, [listFlight, sortField, multiFlights, filterFlight]);

  return (
    <FilterContext.Provider
      value={{
        listFlightRef,
        filterFlight,
        listFlight: returnFlights,
        isCryptic,
        selectedFlights,
        setSelectedFlights,
        showBottomSheet,
        showDetailAirOption,
        showFareOption,
        onSelectItem,
        onReselectItem,
      }}>
      {children}
      <BottomSheetContentFlight ref={contentFlightBSRef} useModal={false} />
      <BottomSheetFareOption
        ref={fareOptionBSRef}
        useModal={false}
        onSelectFare={onSelectItem}
      />
      <BottomSheet
        useModal={false}
        style={{ zIndex: 99 }}
        t18nTitle="flight:change_search"
        type="screen"
        ref={researchBSRef}>
        <View style={{ height: '100%' }}>
          <SearchForm
            callbackSubmit={callbackSubmitFormSearch}
            hideBookingSystems={routeParams?.hideBookingSystems}
            hidePassengers={routeParams?.hidePassengers}
          />
        </View>
      </BottomSheet>
    </FilterContext.Provider>
  );
};

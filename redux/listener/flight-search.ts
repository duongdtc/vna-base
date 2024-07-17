/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { flightResultActions, flightSearchActions } from '@vna-base/redux/action-slice';
import { ListenerEffectAPI } from '@reduxjs/toolkit';
import { FilterForm, SearchForm } from '@vna-base/screens/flight/type';
import { Ibe } from '@services/axios';
import {
  AirOption,
  FlightFilter,
  MinPrice,
  OptionGroup,
} from '@services/axios/axios-ibe';
import { RootState } from '@store/all-reducers';
import { AppDispatch } from '@store/store';
import {
  StorageKey,
  clearSearchFlightResult,
  getListRoute,
  load,
  updateFilterForm,
  validResponse,
} from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import dayjs from 'dayjs';
import cloneDeep from 'lodash.clonedeep';

export const runFlightSearchListener = () => {

  /**
   * * tìm chuyến bay
   */
  takeLatestListeners()({
    actionCreator: flightSearchActions.searchFlights,
    effect: async (action, listenerApi) => {
      if (action.payload.form?.ByMonth) {
        searchFlightByMonths(listenerApi, {
          form: action.payload.form,
        });
      } else {
        searchFlightByDate(listenerApi, action.payload);
      }
    },
  });

  /**
   * * tìm chuyến bay theo 1 tháng - dùng cho màn kết quả tìm theo tháng
   */
  takeLatestListeners()({
    actionCreator: flightSearchActions.searchFlightByMonth,
    effect: async () => {
      // const { date, leg } = action.payload;
      // const form = cloneDeep(
      //   listenerApi.getState().flightSearch.searchForm,
      // ) as SearchForm;
      // // tạo 1 mảng để lưu index của các route có departure date thay đổi trong ListRoute
      // const indexChanges = [];
      // if (form.Type === 'RoundStage' && leg === 1) {
      //   form.Flights[0].date.backDay = date;
      //   // index của back day trong ListRoute
      //   indexChanges.push(1);
      // } else {
      //   form.Flights[leg].date.departureDay = date;
      //   indexChanges.push(leg);
      //   for (let index = leg + 1; index < form.Flights.length; index++) {
      //     if (
      //       dayjs(form.Flights[index].date.departureDay).isBefore(
      //         dayjs(date),
      //         'months',
      //       )
      //     ) {
      //       form.Flights[index].date.departureDay = date;
      //       indexChanges.push(index);
      //     }
      //   }
      // }
      // const { listRoute, isDomestic } = getListRoute({
      //   Type: form.Type,
      //   Flights: form.Flights,
      // });
      // // Lưu lại form và routes vào store
      // listenerApi.dispatch(
      //   flightSearchActions.saveSearchForm({
      //     form,
      //     routes: listRoute,
      //     isDomestic,
      //   }),
      // );
      // // const airlines: Array<string> = [];
      // await Promise.allSettled(
      //   indexChanges.map(async (indexChange, _) => {
      //     listenerApi.dispatch(
      //       flightResultMonthActions.saveStage({
      //         idx: indexChange,
      //         data: [],
      //       }),
      //     );
      //     const res = await Ibe.flightSearchMonthCreate({
      //       StartPoint: listRoute[indexChange].StartPoint.Code,
      //       EndPoint: listRoute[indexChange].EndPoint.Code,
      //       Year: dayjs(listRoute[indexChange].DepartDate).get('year'),
      //       Month: dayjs(listRoute[indexChange].DepartDate).get('months') + 1,
      //       System: form.BookingSystems.filter(
      //         sys => !isDomestic || sys.domestic,
      //       ).reduce(
      //         (totalStr, currSys, currIndex) =>
      //           totalStr + (currIndex === 0 ? '' : ',') + currSys.key,
      //         '',
      //       ),
      //       // Airline: form.BookingSystems.reduce(
      //       //   (totalStr, currSys) => totalStr + currSys.key + ',',
      //       //   '',
      //       // ),
      //     });
      //     if (validResponse(res)) {
      //       // res.data.ListMinPrice![0].ListFlightFare?.forEach(ff => {
      //       //   const i = airlines.findIndex(al => al === ff.Airline);
      //       //   if (i === -1) {
      //       //     airlines.push(ff.Airline!);
      //       //   }
      //       // });
      //       // listenerApi.dispatch(flightResultMonthActions.saveAirlines(airlines));
      //       listenerApi.dispatch(
      //         flightResultMonthActions.saveStage({
      //           idx: indexChange,
      //           data: res.data.ListMinPrice ?? [],
      //         }),
      //       );
      //     }
      //   }),
      // );
    },
  });

  async function searchFlightByMonths(
    listenerApi: ListenerEffectAPI<RootState, AppDispatch>,
    formParam: {
      form: SearchForm;
    },
  ) {
    console.log('🚀 ~ formParam:', formParam);
    console.log('🚀 ~ listenerApi:', listenerApi);
    // const { form: formPr } = formParam;
    // const form = (formPr ??
    //   cloneDeep(listenerApi.getState().flightSearch.searchForm)) as SearchForm;
    // listenerApi.dispatch(
    //   flightResultMonthActions.saveFilterForm({
    //     Airline: null,
    //   }),
    // );
    // const { listRoute, isDomestic } = getListRoute({
    //   Type: form.Type,
    //   Flights: form.Flights,
    // });
    // listRoute.forEach(async (_, idx) => {
    //   listenerApi.dispatch(
    //     flightResultMonthActions.saveStage({
    //       idx,
    //       data: [],
    //     }),
    //   );
    // });
    // // Lưu lại form và routes vào store
    // listenerApi.dispatch(
    //   flightSearchActions.saveSearchForm({
    //     form,
    //     routes: listRoute,
    //     isDomestic,
    //   }),
    // );
    // const airlines: Array<string> = [];
    // await Promise.allSettled(
    //   listRoute.map(async (route, idx) => {
    //     const res = await Ibe.flightSearchMonthCreate({
    //       StartPoint: route.StartPoint.Code,
    //       EndPoint: route.EndPoint.Code,
    //       Year: dayjs(route.DepartDate).get('year'),
    //       Month: dayjs(route.DepartDate).get('months') + 1,
    //       System: form.BookingSystems.filter(
    //         sys => !isDomestic || sys.domestic,
    //       ).reduce(
    //         (totalStr, currSys, currIndex) =>
    //           totalStr + (currIndex === 0 ? '' : ',') + currSys.key,
    //         '',
    //       ),
    //     });
    //     if (validResponse(res)) {
    //       res.data.ListMinPrice![0].ListFlightFare?.forEach(ff => {
    //         const i = airlines.findIndex(al => al === ff.Airline);
    //         if (i === -1) {
    //           airlines.push(ff.Airline!);
    //         }
    //       });
    //       listenerApi.dispatch(flightResultMonthActions.saveAirlines(airlines));
    //       listenerApi.dispatch(
    //         flightResultMonthActions.saveStage({
    //           idx,
    //           data: res.data.ListMinPrice ?? [],
    //         }),
    //       );
    //     }
    //   }),
    // );
  }

  async function searchFlightByDate(
    listenerApi: ListenerEffectAPI<RootState, AppDispatch>,
    formParam: {
      date?: Date;
      form?: SearchForm;
      minPrices?: Array<
        MinPrice & {
          Leg: number;
        }
      >;
    },
  ) {
    clearSearchFlightResult(formParam.date === undefined);

    const form = (formParam.form ??
      cloneDeep(listenerApi.getState().flightSearch.searchForm)) as SearchForm;

    const newDate = formParam.date;
    const currStage = listenerApi.getState().flightResult.currentStage;

    if (newDate) {
      if (form.Type === 'RoundStage' && currStage === 1) {
        form.Flights[0].date.backDay = newDate;
      } else {
        form.Flights[currStage].date.departureDay = newDate;
        for (let index = currStage + 1; index < form.Flights.length; index++) {
          if (
            dayjs(form.Flights[index].date.departureDay).isBefore(dayjs(newDate))
          ) {
            form.Flights[index].date.departureDay = newDate;
          }
        }
      }
    }

    if (formParam.minPrices) {
      if (form.Type === 'RoundStage' && currStage === 1) {
        form.Flights[0].date.departureDay = dayjs(
          formParam.minPrices[0].DepartDate,
        ).toDate();
        form.Flights[0].date.backDay = dayjs(
          formParam.minPrices[1].DepartDate,
        ).toDate();
      } else {
        form.Flights.forEach((fl, idx) => {
          fl.date.departureDay = dayjs(
            formParam.minPrices![idx].DepartDate,
          ).toDate();
        });
      }
    }

    const { listRoute } = getListRoute({
      Type: form.Type,
      Flights: form.Flights,
    });

    // Lưu lại form và routes vào store
    listenerApi.dispatch(
      flightSearchActions.saveSearchForm({
        form,
        routes: listRoute,
      }),
    );

    listenerApi.dispatch(
      flightResultActions.saveMinFares(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        new Array(listRoute.length).fill(0).map(() => [
          {
            fareOption: null,
            date: dayjs(listRoute[0].DepartDate).subtract(3, 'days').toDate(),
          },
          {
            fareOption: null,
            date: dayjs(listRoute[0].DepartDate).subtract(2, 'days').toDate(),
          },
          {
            fareOption: null,
            date: dayjs(listRoute[0].DepartDate).subtract(1, 'days').toDate(),
          },
          {
            fareOption: null,
            date: listRoute[0].DepartDate,
          },
          {
            fareOption: null,
            date: dayjs(listRoute[0].DepartDate).add(1, 'days').toDate(),
          },
          {
            fareOption: null,
            date: dayjs(listRoute[0].DepartDate).add(2, 'days').toDate(),
          },
          {
            fareOption: null,
            date: dayjs(listRoute[0].DepartDate).add(3, 'days').toDate(),
          },
        ]),
      ),
    );

    const Option: FlightFilter = {
      DirectOnly: form.Straight,
      NearByAirport: form.Nearby,
      PreferCabin: form.SeatClass,
    };

    const filterForms: Array<FilterForm> = listRoute.map(r => ({
      Airline: [],
      Fare: 'TotalFare',
      StopNum: [
        {
          selected: true,
          key: 'NonStop',
          t18n: 'flight:non_stop',
        },
        {
          selected: true,
          key: 'OneStop',
          t18n: 'flight:one_stop',
        },
        {
          selected: true,
          key: 'MultiStop',
          t18n: 'flight:multi_stop',
        },
      ],
      SeatClass: [],
      DepartTimeRange: {
        range: [0, 48],
        ...r,
      },
      DepartTimeSlot: {
        slots: [true, true, true, true],
        ...r,
      },
      DepartTimeType: load(StorageKey.DEPART_TIME_TYPE) ?? 'DepartTimeRange',
      FareRange: {
        range: [0, 100],
        fare: {
          BaseFare: { max: 0, min: 100_000_000_000 },
          PriceAdt: { max: 0, min: 100_000_000_000 },
          TotalFare: { max: 0, min: 100_000_000_000 },
        },
      },
      Duration: {
        range: [0, 100],
        duration: {
          // 2 ngày
          min: 2_880,
          max: 0,
        },
      },
    }));

    listenerApi.dispatch(flightResultActions.saveFilterForms(filterForms));

    const res = await Ibe.flightSearchFlightCreate({
      ...form.Passengers,
      System: 'VN',
      ListRoute: listRoute.map(r => ({
        DepartDate: dayjs(r.DepartDate).format('DDMMYYYY'),
        EndPoint: r.EndPoint.Code,
        Leg: r.Leg,
        StartPoint: r.StartPoint.Code,
      })),
      Option,
    });

    if (validResponse(res)) {
      // chia kết quả thành từng stage

      const { flightResult } = listenerApi.getState();

      const tempListGroup: Array<OptionGroup> = [];

      const tempMultiFlights: Array<AirOption> = flightResult.multiFlights.concat(
        (res.data.ListGroup![0]?.ListAirOption ?? []).filter(
          ap => (ap.Itinerary ?? 1) > 1,
        ),
      );

      for (let i = 0; i < 4; i++) {
        tempListGroup.push({
          ...flightResult.listGroup[i],
          ListAirOption: (flightResult.listGroup[i]?.ListAirOption ?? []).concat(
            (res.data.ListGroup![i]?.ListAirOption ?? []).filter(
              ap => !ap.Itinerary || ap.Itinerary < 2,
            ),
          ),
        });
      }

      listenerApi.dispatch(flightResultActions.saveListGroup(tempListGroup));

      listenerApi.dispatch(
        flightResultActions.saveMultiFlights(tempMultiFlights),
      );

      // update defaultFilterForm sau mỗi success req
      const tempFilterForms = updateFilterForm(
        flightResult.filterForms!,
        res.data.ListGroup!,
      );

      listenerApi.dispatch(
        flightResultActions.saveSession(res.data.Session ?? ''),
      );

      listenerApi.dispatch(flightResultActions.saveFilterForms(tempFilterForms));

      listenerApi.dispatch(flightResultActions.saveSearchDone(true));

      // get min fares
      listenerApi.dispatch(flightResultActions.getMinFares());
    }
  }
}
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  flightResultActions,
  flightSearchActions,
} from '@vna-base/redux/action-slice';
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
import { AppDispatch } from '@vna-base/redux/store/store';
import {
  StorageKey,
  clearSearchFlightResult,
  delay,
  getListRoute,
  load,
  updateFilterForm,
  validResponse,
} from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import dayjs from 'dayjs';
import cloneDeep from 'lodash.clonedeep';
import { RearchRes } from '@vna-base/utils/dumy/search-flight';

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
    try {
      clearSearchFlightResult(formParam.date === undefined);

      const form = (formParam.form ??
        cloneDeep(
          listenerApi.getState().flightSearch.searchForm,
        )) as SearchForm;

      const newDate = formParam.date;
      const currStage = listenerApi.getState().flightResult.currentStage;

      if (newDate) {
        if (form.Type === 'RoundStage' && currStage === 1) {
          form.Flights[0].date.backDay = newDate;
        } else {
          form.Flights[currStage].date.departureDay = newDate;
          for (
            let index = currStage + 1;
            index < form.Flights.length;
            index++
          ) {
            if (
              dayjs(form.Flights[index].date.departureDay).isBefore(
                dayjs(newDate),
              )
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

      const res = await fakeData({
        ListRoute: listRoute.map(r => ({
          DepartDate: dayjs(r.DepartDate).format('DDMMYYYY'),
          EndPoint: r.EndPoint.Code,
          Leg: r.Leg,
          StartPoint: r.StartPoint.Code,
        })),
      });
      // const res = await Ibe.flightSearchFlightCreate({
      //   ...form.Passengers,
      //   System: 'VN',
      //   ListRoute: listRoute.map(r => ({
      //     DepartDate: dayjs(r.DepartDate).format('DDMMYYYY'),
      //     EndPoint: r.EndPoint.Code,
      //     Leg: r.Leg,
      //     StartPoint: r.StartPoint.Code,
      //   })),
      //   Option,
      // });
      // console.log('res', res);

      if (validResponse(res)) {
        // console.log('first');
        // chia kết quả thành từng stage

        const { flightResult } = listenerApi.getState();

        const tempListGroup: Array<OptionGroup> = [];

        const tempMultiFlights: Array<AirOption> =
          flightResult.multiFlights.concat(
            (res.data.ListGroup![0]?.ListAirOption ?? []).filter(
              ap => (ap.Itinerary ?? 1) > 1,
            ),
          );

        for (let i = 0; i < 4; i++) {
          tempListGroup.push({
            ...flightResult.listGroup[i],
            ListAirOption: (
              flightResult.listGroup[i]?.ListAirOption ?? []
            ).concat(
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

        listenerApi.dispatch(
          flightResultActions.saveFilterForms(tempFilterForms),
        );

        listenerApi.dispatch(flightResultActions.saveSearchDone(true));
        // get min fares
        listenerApi.dispatch(flightResultActions.getMinFares());
      }
    } catch (error) {
      console.log('🚀 ~ runFlightSearchListener ~ error:', error);
    }
  }
};

async function fakeData({
  ListRoute,
}: {
  ListRoute: Array<{
    DepartDate: string;
    EndPoint: string;
    Leg: number;
    StartPoint: string;
  }>;
}) {
  await delay(800);

  const ListGroup = ListRoute.map(
    ({ DepartDate: dp, StartPoint, EndPoint }, idx) => {
      const Journey = `${StartPoint}${EndPoint}${dayjs(dp).format('DDMMYYYY')}`;

      const DepartDate = dayjs(dp).format('DDMMYYYY');

      const StartDate = dayjs(dp).format('YYYY-MM-DD');

      return {
        Leg: idx,
        TripType: 'OW',
        Journey,
        StartPoint,
        EndPoint,
        DepartDate,
        ListAirOption: [
          {
            OptionId: 0,
            Leg: idx,
            Itinerary: 1,
            Airline: 'VN',
            System: 'VN',
            Remark: null,
            ListFlightOption: [
              {
                OptionId: 0,
                ListFlight: [
                  {
                    Leg: 0,
                    FlightId: '1',
                    Airline: 'VN',
                    Operator: 'VN',
                    StartPoint,
                    EndPoint,
                    StartDate: `${StartDate}T07:00:00`,
                    EndDate: `${StartDate}T09:15:00`,
                    DepartDate: `${DepartDate} 0700`,
                    ArriveDate: `${DepartDate} 0915`,
                    FlightNumber: '207',
                    StopNum: 0,
                    Duration: 135,
                    ListSegment: [
                      {
                        Leg: 0,
                        SegmentId: '1',
                        Airline: 'VN',
                        Operator: 'VN',
                        StartPoint,
                        EndPoint,
                        StartDate: `${StartDate}T07:00:00`,
                        EndDate: `${StartDate}T09:15:00`,
                        DepartDate: `${DepartDate} 0700`,
                        ArriveDate: `${DepartDate} 0915`,
                        StartTerminal: '1',
                        EndTerminal: '1',
                        FlightNumber: '207',
                        Equipment: '787',
                        FareClass: null,
                        FareBasis: null,
                        Duration: 135,
                        HasStop: false,
                        StopPoint: null,
                        StopTime: 0,
                        MarriageGrp: null,
                        FlightsMiles: 0,
                        Status: null,
                      },
                    ],
                  },
                ],
                OriginValue: 0,
                NdcInfo: null,
              },
            ],
            ListFareOption: [
              {
                OptionId: 0,
                FareClass: 'B',
                FareBasis: 'BVNF',
                FareFamily: 'Economy Flex',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2937000,
                PriceAdt: 3841000,
                NetFare: 3741000,
                TotalFare: 3841000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2937000,
                    NetFare: 3741000,
                    TotalFare: 3841000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2937000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 804000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'B',
                        FareBasis: 'BVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 1,
                FareClass: 'J',
                FareBasis: 'JVNF',
                FareFamily: 'Business Flex',
                CabinCode: 'C',
                CabinName: 'BUSINESS',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 7599000,
                PriceAdt: 8876000,
                NetFare: 8776000,
                TotalFare: 8876000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 7599000,
                    NetFare: 8776000,
                    TotalFare: 8876000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 7599000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 1177000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'J',
                        FareBasis: 'JVNF',
                        HandBaggage: '2 pieces x 9kg',
                        FreeBaggage: '1 piece x 32kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
            ],
            OriginValue: 1,
            OriginSession: 'HANSG${DepartDate}_100_180724153516_VNA00017',
            IsNDC: false,
          },
          {
            OptionId: 1,
            Leg: idx,
            Itinerary: 1,
            Airline: 'VN',
            System: 'VN',
            Remark: null,
            ListFlightOption: [
              {
                OptionId: 0,
                ListFlight: [
                  {
                    Leg: 0,
                    FlightId: '1',
                    Airline: 'VN',
                    Operator: 'VN',
                    StartPoint,
                    EndPoint,
                    StartDate: `${StartDate}T13:00:00`,
                    EndDate: `${StartDate}T15:15:00`,
                    DepartDate: `${DepartDate} 1300`,
                    ArriveDate: `${DepartDate} 1515`,
                    FlightNumber: '213',
                    StopNum: 0,
                    Duration: 135,
                    ListSegment: [
                      {
                        Leg: 0,
                        SegmentId: '1',
                        Airline: 'VN',
                        Operator: 'VN',
                        StartPoint,
                        EndPoint,
                        StartDate: `${StartDate}T13:00:00`,
                        EndDate: `${StartDate}T15:15:00`,
                        DepartDate: `${DepartDate} 1300`,
                        ArriveDate: `${DepartDate} 1515`,
                        StartTerminal: '1',
                        EndTerminal: '1',
                        FlightNumber: '213',
                        Equipment: '787',
                        FareClass: null,
                        FareBasis: null,
                        Duration: 135,
                        HasStop: false,
                        StopPoint: null,
                        StopTime: 0,
                        MarriageGrp: null,
                        FlightsMiles: 0,
                        Status: null,
                      },
                    ],
                  },
                ],
                OriginValue: 0,
                NdcInfo: null,
              },
            ],
            ListFareOption: [
              {
                OptionId: 0,
                FareClass: 'B',
                FareBasis: 'BVNF',
                FareFamily: 'Economy Flex',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2937000,
                PriceAdt: 3841000,
                NetFare: 3741000,
                TotalFare: 3841000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2937000,
                    NetFare: 3741000,
                    TotalFare: 3841000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2937000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 804000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'B',
                        FareBasis: 'BVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 1,
                FareClass: 'J',
                FareBasis: 'JVNF',
                FareFamily: 'Business Flex',
                CabinCode: 'C',
                CabinName: 'BUSINESS',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 7599000,
                PriceAdt: 8876000,
                NetFare: 8776000,
                TotalFare: 8876000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 7599000,
                    NetFare: 8776000,
                    TotalFare: 8876000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 7599000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 1177000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'J',
                        FareBasis: 'JVNF',
                        HandBaggage: '2 pieces x 9kg',
                        FreeBaggage: '1 piece x 32kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
            ],
            OriginValue: 2,
            OriginSession: 'HANSG${DepartDate}_100_180724153516_VNA00017',
            IsNDC: false,
          },
          {
            OptionId: 2,
            Leg: idx,
            Itinerary: 1,
            Airline: 'VN',
            System: 'VN',
            Remark: null,
            ListFlightOption: [
              {
                OptionId: 0,
                ListFlight: [
                  {
                    Leg: 0,
                    FlightId: '1',
                    Airline: 'VN',
                    Operator: 'VN',
                    StartPoint,
                    EndPoint,
                    StartDate: `${StartDate}T14:00:00`,
                    EndDate: `${StartDate}T16:00:00`,
                    DepartDate: `${DepartDate} 1400`,
                    ArriveDate: `${DepartDate} 1600`,
                    FlightNumber: '1999',
                    StopNum: 0,
                    Duration: 120,
                    ListSegment: [
                      {
                        Leg: 0,
                        SegmentId: '1',
                        Airline: 'VN',
                        Operator: 'VN',
                        StartPoint,
                        EndPoint,
                        StartDate: `${StartDate}T14:00:00`,
                        EndDate: `${StartDate}T16:00:00`,
                        DepartDate: `${DepartDate} 1400`,
                        ArriveDate: `${DepartDate} 1600`,
                        StartTerminal: '1',
                        EndTerminal: '1',
                        FlightNumber: '1999',
                        Equipment: '321',
                        FareClass: null,
                        FareBasis: null,
                        Duration: 120,
                        HasStop: false,
                        StopPoint: null,
                        StopTime: 0,
                        MarriageGrp: null,
                        FlightsMiles: 0,
                        Status: null,
                      },
                    ],
                  },
                ],
                OriginValue: 0,
                NdcInfo: null,
              },
            ],
            ListFareOption: [
              {
                OptionId: 0,
                FareClass: 'B',
                FareBasis: 'BVNF',
                FareFamily: 'Economy Flex',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2937000,
                PriceAdt: 3841000,
                NetFare: 3741000,
                TotalFare: 3841000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2937000,
                    NetFare: 3741000,
                    TotalFare: 3841000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2937000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 804000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'B',
                        FareBasis: 'BVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 1,
                FareClass: 'J',
                FareBasis: 'JVNF',
                FareFamily: 'Business Flex',
                CabinCode: 'C',
                CabinName: 'BUSINESS',
                Refundable: true,
                Availability: 8,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 7599000,
                PriceAdt: 8876000,
                NetFare: 8776000,
                TotalFare: 8876000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 7599000,
                    NetFare: 8776000,
                    TotalFare: 8876000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 7599000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 1177000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'J',
                        FareBasis: 'JVNF',
                        HandBaggage: '2 pieces x 9kg',
                        FreeBaggage: '1 piece x 32kg',
                        Availability: 8,
                      },
                    ],
                  },
                ],
              },
            ],
            OriginValue: 3,
            OriginSession: 'HANSG${DepartDate}_100_180724153516_VNA00017',
            IsNDC: false,
          },
          {
            OptionId: 3,
            Leg: idx,
            Itinerary: 1,
            Airline: 'VN',
            System: 'VN',
            Remark: null,
            ListFlightOption: [
              {
                OptionId: 0,
                ListFlight: [
                  {
                    Leg: 0,
                    FlightId: '1',
                    Airline: 'VN',
                    Operator: 'VN',
                    StartPoint,
                    EndPoint,
                    StartDate: `${StartDate}T15:00:00`,
                    EndDate: `${StartDate}T17:00:00`,
                    DepartDate: `${DepartDate} 1500`,
                    ArriveDate: `${DepartDate} 1700`,
                    FlightNumber: '203',
                    StopNum: 0,
                    Duration: 120,
                    ListSegment: [
                      {
                        Leg: 0,
                        SegmentId: '1',
                        Airline: 'VN',
                        Operator: 'VN',
                        StartPoint,
                        EndPoint,
                        StartDate: `${StartDate}T15:00:00`,
                        EndDate: `${StartDate}T17:00:00`,
                        DepartDate: `${DepartDate} 1500`,
                        ArriveDate: `${DepartDate} 1700`,
                        StartTerminal: '1',
                        EndTerminal: '1',
                        FlightNumber: '203',
                        Equipment: '321',
                        FareClass: null,
                        FareBasis: null,
                        Duration: 120,
                        HasStop: false,
                        StopPoint: null,
                        StopTime: 0,
                        MarriageGrp: null,
                        FlightsMiles: 0,
                        Status: null,
                      },
                    ],
                  },
                ],
                OriginValue: 0,
                NdcInfo: null,
              },
            ],
            ListFareOption: [
              {
                OptionId: 0,
                FareClass: 'B',
                FareBasis: 'BVNF',
                FareFamily: 'Economy Flex',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2937000,
                PriceAdt: 3841000,
                NetFare: 3741000,
                TotalFare: 3841000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2937000,
                    NetFare: 3741000,
                    TotalFare: 3841000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2937000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 804000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'B',
                        FareBasis: 'BVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 1,
                FareClass: 'J',
                FareBasis: 'JVNF',
                FareFamily: 'Business Flex',
                CabinCode: 'C',
                CabinName: 'BUSINESS',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 7599000,
                PriceAdt: 8876000,
                NetFare: 8776000,
                TotalFare: 8876000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 7599000,
                    NetFare: 8776000,
                    TotalFare: 8876000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 7599000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 1177000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'J',
                        FareBasis: 'JVNF',
                        HandBaggage: '2 pieces x 9kg',
                        FreeBaggage: '1 piece x 32kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
            ],
            OriginValue: 4,
            OriginSession: 'HANSG${DepartDate}_100_180724153516_VNA00017',
            IsNDC: false,
          },
          {
            OptionId: 4,
            Leg: idx,
            Itinerary: 1,
            Airline: 'VN',
            System: 'VN',
            Remark: null,
            ListFlightOption: [
              {
                OptionId: 0,
                ListFlight: [
                  {
                    Leg: 0,
                    FlightId: '1',
                    Airline: 'VN',
                    Operator: 'VN',
                    StartPoint,
                    EndPoint,
                    StartDate: `${StartDate}T16:00:00`,
                    EndDate: `${StartDate}T18:20:00`,
                    DepartDate: `${DepartDate} 1600`,
                    ArriveDate: `${DepartDate} 1820`,
                    FlightNumber: '271',
                    StopNum: 0,
                    Duration: 140,
                    ListSegment: [
                      {
                        Leg: 0,
                        SegmentId: '1',
                        Airline: 'VN',
                        Operator: 'VN',
                        StartPoint,
                        EndPoint,
                        StartDate: `${StartDate}T16:00:00`,
                        EndDate: `${StartDate}T18:20:00`,
                        DepartDate: `${DepartDate} 1600`,
                        ArriveDate: `${DepartDate} 1820`,
                        StartTerminal: '1',
                        EndTerminal: '1',
                        FlightNumber: '271',
                        Equipment: '321',
                        FareClass: null,
                        FareBasis: null,
                        Duration: 140,
                        HasStop: false,
                        StopPoint: null,
                        StopTime: 0,
                        MarriageGrp: null,
                        FlightsMiles: 0,
                        Status: null,
                      },
                    ],
                  },
                ],
                OriginValue: 0,
                NdcInfo: null,
              },
            ],
            ListFareOption: [
              {
                OptionId: 0,
                FareClass: 'B',
                FareBasis: 'BVNF',
                FareFamily: 'Economy Flex',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2937000,
                PriceAdt: 3841000,
                NetFare: 3741000,
                TotalFare: 3841000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2937000,
                    NetFare: 3741000,
                    TotalFare: 3841000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2937000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 804000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'B',
                        FareBasis: 'BVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 1,
                FareClass: 'J',
                FareBasis: 'JVNF',
                FareFamily: 'Business Flex',
                CabinCode: 'C',
                CabinName: 'BUSINESS',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 7599000,
                PriceAdt: 8876000,
                NetFare: 8776000,
                TotalFare: 8876000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 7599000,
                    NetFare: 8776000,
                    TotalFare: 8876000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 7599000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 1177000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'J',
                        FareBasis: 'JVNF',
                        HandBaggage: '2 pieces x 9kg',
                        FreeBaggage: '1 piece x 32kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
            ],
            OriginValue: 5,
            OriginSession: 'HANSG${DepartDate}_100_180724153516_VNA00017',
            IsNDC: false,
          },
          {
            OptionId: 5,
            Leg: idx,
            Itinerary: 1,
            Airline: 'VN',
            System: 'VN',
            Remark: null,
            ListFlightOption: [
              {
                OptionId: 0,
                ListFlight: [
                  {
                    Leg: 0,
                    FlightId: '1',
                    Airline: 'VN',
                    Operator: 'VN',
                    StartPoint,
                    EndPoint,
                    StartDate: `${StartDate}T17:00:00`,
                    EndDate: `${StartDate}T19:15:00`,
                    DepartDate: `${DepartDate} 1700`,
                    ArriveDate: `${DepartDate} 1915`,
                    FlightNumber: '217',
                    StopNum: 0,
                    Duration: 135,
                    ListSegment: [
                      {
                        Leg: 0,
                        SegmentId: '1',
                        Airline: 'VN',
                        Operator: 'VN',
                        StartPoint,
                        EndPoint,
                        StartDate: `${StartDate}T17:00:00`,
                        EndDate: `${StartDate}T19:15:00`,
                        DepartDate: `${DepartDate} 1700`,
                        ArriveDate: `${DepartDate} 1915`,
                        StartTerminal: '1',
                        EndTerminal: '1',
                        FlightNumber: '217',
                        Equipment: '359',
                        FareClass: null,
                        FareBasis: null,
                        Duration: 135,
                        HasStop: false,
                        StopPoint: null,
                        StopTime: 0,
                        MarriageGrp: null,
                        FlightsMiles: 0,
                        Status: null,
                      },
                    ],
                  },
                ],
                OriginValue: 0,
                NdcInfo: null,
              },
            ],
            ListFareOption: [
              {
                OptionId: 0,
                FareClass: 'L',
                FareBasis: 'LPXVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 1999000,
                PriceAdt: 2828000,
                NetFare: 2728000,
                TotalFare: 2828000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 1999000,
                    NetFare: 2728000,
                    TotalFare: 2828000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 1999000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 729000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'L',
                        FareBasis: 'LPXVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 1,
                FareClass: 'K',
                FareBasis: 'KPXVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2209000,
                PriceAdt: 3055000,
                NetFare: 2955000,
                TotalFare: 3055000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2209000,
                    NetFare: 2955000,
                    TotalFare: 3055000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2209000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 746000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'K',
                        FareBasis: 'KPXVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 2,
                FareClass: 'H',
                FareBasis: 'HPXVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2419000,
                PriceAdt: 3282000,
                NetFare: 3182000,
                TotalFare: 3282000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2419000,
                    NetFare: 3182000,
                    TotalFare: 3282000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2419000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 763000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'H',
                        FareBasis: 'HPXVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 3,
                FareClass: 'S',
                FareBasis: 'SVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2609000,
                PriceAdt: 3487000,
                NetFare: 3387000,
                TotalFare: 3487000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2609000,
                    NetFare: 3387000,
                    TotalFare: 3487000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2609000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 778000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'S',
                        FareBasis: 'SVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 4,
                FareClass: 'M',
                FareBasis: 'MVNF',
                FareFamily: 'Economy Flex',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2789000,
                PriceAdt: 3682000,
                NetFare: 3582000,
                TotalFare: 3682000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2789000,
                    NetFare: 3582000,
                    TotalFare: 3682000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2789000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 793000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'M',
                        FareBasis: 'MVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 5,
                FareClass: 'B',
                FareBasis: 'BVNF',
                FareFamily: 'Economy Flex',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2937000,
                PriceAdt: 3841000,
                NetFare: 3741000,
                TotalFare: 3841000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2937000,
                    NetFare: 3741000,
                    TotalFare: 3841000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2937000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 804000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'B',
                        FareBasis: 'BVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 6,
                FareClass: 'J',
                FareBasis: 'JVNF',
                FareFamily: 'Business Flex',
                CabinCode: 'C',
                CabinName: 'BUSINESS',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 7599000,
                PriceAdt: 8876000,
                NetFare: 8776000,
                TotalFare: 8876000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 7599000,
                    NetFare: 8776000,
                    TotalFare: 8876000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 7599000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 1177000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'J',
                        FareBasis: 'JVNF',
                        HandBaggage: '2 pieces x 9kg',
                        FreeBaggage: '1 piece x 32kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
            ],
            OriginValue: 6,
            OriginSession: 'HANSG${DepartDate}_100_180724153516_VNA00017',
            IsNDC: false,
          },
          {
            OptionId: 6,
            Leg: idx,
            Itinerary: 1,
            Airline: 'VN',
            System: 'VN',
            Remark: null,
            ListFlightOption: [
              {
                OptionId: 0,
                ListFlight: [
                  {
                    Leg: 0,
                    FlightId: '1',
                    Airline: 'VN',
                    Operator: 'VN',
                    StartPoint,
                    EndPoint,
                    StartDate: `${StartDate}T17:10:00`,
                    EndDate: `${StartDate}T20:00:00`,
                    DepartDate: `${DepartDate} 1710`,
                    ArriveDate: `${DepartDate} 2000`,
                    FlightNumber: '257',
                    StopNum: 0,
                    Duration: 170,
                    ListSegment: [
                      {
                        Leg: 0,
                        SegmentId: '1',
                        Airline: 'VN',
                        Operator: 'VN',
                        StartPoint,
                        EndPoint,
                        StartDate: `${StartDate}T17:10:00`,
                        EndDate: `${StartDate}T20:00:00`,
                        DepartDate: `${DepartDate} 1710`,
                        ArriveDate: `${DepartDate} 2000`,
                        StartTerminal: '1',
                        EndTerminal: '1',
                        FlightNumber: '257',
                        Equipment: '350',
                        FareClass: null,
                        FareBasis: null,
                        Duration: 170,
                        HasStop: false,
                        StopPoint: null,
                        StopTime: 0,
                        MarriageGrp: null,
                        FlightsMiles: 0,
                        Status: null,
                      },
                    ],
                  },
                ],
                OriginValue: 0,
                NdcInfo: null,
              },
            ],
            ListFareOption: [
              {
                OptionId: 0,
                FareClass: 'L',
                FareBasis: 'LPXVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 1999000,
                PriceAdt: 2828000,
                NetFare: 2728000,
                TotalFare: 2828000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 1999000,
                    NetFare: 2728000,
                    TotalFare: 2828000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 1999000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 729000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'L',
                        FareBasis: 'LPXVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 1,
                FareClass: 'K',
                FareBasis: 'KPXVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2209000,
                PriceAdt: 3055000,
                NetFare: 2955000,
                TotalFare: 3055000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2209000,
                    NetFare: 2955000,
                    TotalFare: 3055000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2209000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 746000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'K',
                        FareBasis: 'KPXVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 2,
                FareClass: 'H',
                FareBasis: 'HPXVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2419000,
                PriceAdt: 3282000,
                NetFare: 3182000,
                TotalFare: 3282000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2419000,
                    NetFare: 3182000,
                    TotalFare: 3282000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2419000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 763000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'H',
                        FareBasis: 'HPXVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 3,
                FareClass: 'S',
                FareBasis: 'SVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2609000,
                PriceAdt: 3487000,
                NetFare: 3387000,
                TotalFare: 3487000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2609000,
                    NetFare: 3387000,
                    TotalFare: 3487000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2609000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 778000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'S',
                        FareBasis: 'SVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 4,
                FareClass: 'M',
                FareBasis: 'MVNF',
                FareFamily: 'Economy Flex',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2789000,
                PriceAdt: 3682000,
                NetFare: 3582000,
                TotalFare: 3682000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2789000,
                    NetFare: 3582000,
                    TotalFare: 3682000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2789000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 793000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'M',
                        FareBasis: 'MVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 5,
                FareClass: 'B',
                FareBasis: 'BVNF',
                FareFamily: 'Economy Flex',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2937000,
                PriceAdt: 3841000,
                NetFare: 3741000,
                TotalFare: 3841000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2937000,
                    NetFare: 3741000,
                    TotalFare: 3841000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2937000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 804000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'B',
                        FareBasis: 'BVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 6,
                FareClass: 'U',
                FareBasis: 'UVNF',
                FareFamily: 'Premium Economy Classic',
                CabinCode: 'W',
                CabinName: 'PREMIUM',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2939000,
                PriceAdt: 3844000,
                NetFare: 3744000,
                TotalFare: 3844000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2939000,
                    NetFare: 3744000,
                    TotalFare: 3844000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2939000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 805000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'U',
                        FareBasis: 'UVNF',
                        HandBaggage: '2 pieces x 9kg',
                        FreeBaggage: '1 piece x 32kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 7,
                FareClass: 'Z',
                FareBasis: 'ZVNF',
                FareFamily: 'Premium Economy Classic',
                CabinCode: 'W',
                CabinName: 'PREMIUM',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 3139000,
                PriceAdt: 4060000,
                NetFare: 3960000,
                TotalFare: 4060000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 3139000,
                    NetFare: 3960000,
                    TotalFare: 4060000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 3139000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 821000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'Z',
                        FareBasis: 'ZVNF',
                        HandBaggage: '2 pieces x 9kg',
                        FreeBaggage: '1 piece x 32kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 8,
                FareClass: 'W',
                FareBasis: 'WVNF',
                FareFamily: 'Premium Economy Flex',
                CabinCode: 'W',
                CabinName: 'PREMIUM',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 3439000,
                PriceAdt: 4384000,
                NetFare: 4284000,
                TotalFare: 4384000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 3439000,
                    NetFare: 4284000,
                    TotalFare: 4384000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 3439000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 845000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'W',
                        FareBasis: 'WVNF',
                        HandBaggage: '2 pieces x 9kg',
                        FreeBaggage: '1 piece x 32kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 9,
                FareClass: 'J',
                FareBasis: 'JVNF',
                FareFamily: 'Business Flex',
                CabinCode: 'C',
                CabinName: 'BUSINESS',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 7599000,
                PriceAdt: 8876000,
                NetFare: 8776000,
                TotalFare: 8876000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 7599000,
                    NetFare: 8776000,
                    TotalFare: 8876000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 7599000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 1177000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'J',
                        FareBasis: 'JVNF',
                        HandBaggage: '2 pieces x 9kg',
                        FreeBaggage: '1 piece x 32kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
            ],
            OriginValue: 7,
            OriginSession: 'HANSG${DepartDate}_100_180724153516_VNA00017',
            IsNDC: false,
          },
          {
            OptionId: 7,
            Leg: idx,
            Itinerary: 1,
            Airline: 'VN',
            System: 'VN',
            Remark: null,
            ListFlightOption: [
              {
                OptionId: 0,
                ListFlight: [
                  {
                    Leg: 0,
                    FlightId: '1',
                    Airline: 'VN',
                    Operator: 'VN',
                    StartPoint,
                    EndPoint,
                    StartDate: `${StartDate}T19:00:00`,
                    EndDate: `${StartDate}T20:20:00`,
                    DepartDate: `${DepartDate} 1900`,
                    ArriveDate: `${DepartDate} 2020`,
                    FlightNumber: '208',
                    StopNum: 0,
                    Duration: 80,
                    ListSegment: [
                      {
                        Leg: 0,
                        SegmentId: '1',
                        Airline: 'VN',
                        Operator: 'VN',
                        StartPoint,
                        EndPoint,
                        StartDate: `${StartDate}T19:00:00`,
                        EndDate: `${StartDate}T20:20:00`,
                        DepartDate: `${DepartDate} 1900`,
                        ArriveDate: `${DepartDate} 2020`,
                        StartTerminal: '1',
                        EndTerminal: '1',
                        FlightNumber: '208',
                        Equipment: '321',
                        FareClass: null,
                        FareBasis: null,
                        Duration: 80,
                        HasStop: false,
                        StopPoint: null,
                        StopTime: 0,
                        MarriageGrp: null,
                        FlightsMiles: 0,
                        Status: null,
                      },
                    ],
                  },
                ],
                OriginValue: 0,
                NdcInfo: null,
              },
            ],
            ListFareOption: [
              {
                OptionId: 0,
                FareClass: 'L',
                FareBasis: 'LPXVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 1999000,
                PriceAdt: 2828000,
                NetFare: 2728000,
                TotalFare: 2828000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 1999000,
                    NetFare: 2728000,
                    TotalFare: 2828000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 1999000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 729000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'L',
                        FareBasis: 'LPXVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 1,
                FareClass: 'K',
                FareBasis: 'KPXVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2209000,
                PriceAdt: 3055000,
                NetFare: 2955000,
                TotalFare: 3055000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2209000,
                    NetFare: 2955000,
                    TotalFare: 3055000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2209000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 746000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'K',
                        FareBasis: 'KPXVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 2,
                FareClass: 'H',
                FareBasis: 'HPXVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2419000,
                PriceAdt: 3282000,
                NetFare: 3182000,
                TotalFare: 3282000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2419000,
                    NetFare: 3182000,
                    TotalFare: 3282000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2419000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 763000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'H',
                        FareBasis: 'HPXVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 3,
                FareClass: 'S',
                FareBasis: 'SVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2609000,
                PriceAdt: 3487000,
                NetFare: 3387000,
                TotalFare: 3487000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2609000,
                    NetFare: 3387000,
                    TotalFare: 3487000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2609000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 778000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'S',
                        FareBasis: 'SVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 4,
                FareClass: 'M',
                FareBasis: 'MVNF',
                FareFamily: 'Economy Flex',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2789000,
                PriceAdt: 3682000,
                NetFare: 3582000,
                TotalFare: 3682000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2789000,
                    NetFare: 3582000,
                    TotalFare: 3682000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2789000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 793000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'M',
                        FareBasis: 'MVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 5,
                FareClass: 'B',
                FareBasis: 'BVNF',
                FareFamily: 'Economy Flex',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2937000,
                PriceAdt: 3841000,
                NetFare: 3741000,
                TotalFare: 3841000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2937000,
                    NetFare: 3741000,
                    TotalFare: 3841000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2937000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 804000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'B',
                        FareBasis: 'BVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 6,
                FareClass: 'J',
                FareBasis: 'JVNF',
                FareFamily: 'Business Flex',
                CabinCode: 'C',
                CabinName: 'BUSINESS',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 7599000,
                PriceAdt: 8876000,
                NetFare: 8776000,
                TotalFare: 8876000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 7599000,
                    NetFare: 8776000,
                    TotalFare: 8876000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 7599000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 1177000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'J',
                        FareBasis: 'JVNF',
                        HandBaggage: '2 pieces x 9kg',
                        FreeBaggage: '1 piece x 32kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
            ],
            OriginValue: 8,
            OriginSession: 'HANSG${DepartDate}_100_180724153516_VNA00017',
            IsNDC: false,
          },
          {
            OptionId: 8,
            Leg: idx,
            Itinerary: 1,
            Airline: 'VN',
            System: 'VN',
            Remark: null,
            ListFlightOption: [
              {
                OptionId: 0,
                ListFlight: [
                  {
                    Leg: 0,
                    FlightId: '1',
                    Airline: 'VN',
                    Operator: 'BL',
                    StartPoint,
                    EndPoint,
                    StartDate: `${StartDate}T21:10:00`,
                    EndDate: `${StartDate}T23:30:00`,
                    DepartDate: `${DepartDate} 2110`,
                    ArriveDate: `${DepartDate} 2330`,
                    FlightNumber: '6021',
                    StopNum: 0,
                    Duration: 140,
                    ListSegment: [
                      {
                        Leg: 0,
                        SegmentId: '1',
                        Airline: 'VN',
                        Operator: 'BL',
                        StartPoint,
                        EndPoint,
                        StartDate: `${StartDate}T21:10:00`,
                        EndDate: `${StartDate}T23:30:00`,
                        DepartDate: `${DepartDate} 2110`,
                        ArriveDate: `${DepartDate} 2330`,
                        StartTerminal: '1',
                        EndTerminal: '1',
                        FlightNumber: '6021',
                        Equipment: '320',
                        FareClass: null,
                        FareBasis: null,
                        Duration: 140,
                        HasStop: false,
                        StopPoint: null,
                        StopTime: 0,
                        MarriageGrp: null,
                        FlightsMiles: 0,
                        Status: null,
                      },
                    ],
                  },
                ],
                OriginValue: 0,
                NdcInfo: null,
              },
            ],
            ListFareOption: [
              {
                OptionId: 0,
                FareClass: 'N',
                FareBasis: 'NPXVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 1639000,
                PriceAdt: 2440000,
                NetFare: 2340000,
                TotalFare: 2440000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 1639000,
                    NetFare: 2340000,
                    TotalFare: 2440000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 1639000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 701000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'N',
                        FareBasis: 'NPXVNF',
                        HandBaggage: '1 piece x 7kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 1,
                FareClass: 'Q',
                FareBasis: 'QPXVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 1809000,
                PriceAdt: 2623000,
                NetFare: 2523000,
                TotalFare: 2623000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 1809000,
                    NetFare: 2523000,
                    TotalFare: 2623000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 1809000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 714000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'Q',
                        FareBasis: 'QPXVNF',
                        HandBaggage: '1 piece x 7kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 2,
                FareClass: 'L',
                FareBasis: 'LPXVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 1999000,
                PriceAdt: 2828000,
                NetFare: 2728000,
                TotalFare: 2828000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 1999000,
                    NetFare: 2728000,
                    TotalFare: 2828000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 1999000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 729000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'L',
                        FareBasis: 'LPXVNF',
                        HandBaggage: '1 piece x 7kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 3,
                FareClass: 'K',
                FareBasis: 'KPXVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2209000,
                PriceAdt: 3055000,
                NetFare: 2955000,
                TotalFare: 3055000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2209000,
                    NetFare: 2955000,
                    TotalFare: 3055000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2209000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 746000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'K',
                        FareBasis: 'KPXVNF',
                        HandBaggage: '1 piece x 7kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 4,
                FareClass: 'H',
                FareBasis: 'HPXVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2419000,
                PriceAdt: 3282000,
                NetFare: 3182000,
                TotalFare: 3282000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2419000,
                    NetFare: 3182000,
                    TotalFare: 3282000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2419000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 763000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'H',
                        FareBasis: 'HPXVNF',
                        HandBaggage: '1 piece x 7kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 5,
                FareClass: 'S',
                FareBasis: 'SVNF',
                FareFamily: 'Economy Flex',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2609000,
                PriceAdt: 3487000,
                NetFare: 3387000,
                TotalFare: 3487000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2609000,
                    NetFare: 3387000,
                    TotalFare: 3487000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2609000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 778000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'S',
                        FareBasis: 'SVNF',
                        HandBaggage: '1 piece x 7kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 6,
                FareClass: 'M',
                FareBasis: 'MVNF',
                FareFamily: 'Economy Flex',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2789000,
                PriceAdt: 3682000,
                NetFare: 3582000,
                TotalFare: 3682000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2789000,
                    NetFare: 3582000,
                    TotalFare: 3682000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2789000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 793000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'M',
                        FareBasis: 'MVNF',
                        HandBaggage: '1 piece x 7kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 7,
                FareClass: 'B',
                FareBasis: 'BVNF',
                FareFamily: 'Economy Flex',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2937000,
                PriceAdt: 3841000,
                NetFare: 3741000,
                TotalFare: 3841000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2937000,
                    NetFare: 3741000,
                    TotalFare: 3841000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2937000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 804000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'B',
                        FareBasis: 'BVNF',
                        HandBaggage: '1 piece x 7kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
            ],
            OriginValue: 9,
            OriginSession: 'HANSG${DepartDate}_100_180724153516_VNA00017',
            IsNDC: false,
          },
          {
            OptionId: 9,
            Leg: idx,
            Itinerary: 1,
            Airline: 'VN',
            System: 'VN',
            Remark: null,
            ListFlightOption: [
              {
                OptionId: 0,
                ListFlight: [
                  {
                    Leg: 0,
                    FlightId: '1',
                    Airline: 'VN',
                    Operator: 'VN',
                    StartPoint,
                    EndPoint,
                    StartDate: `${StartDate}T22:00:00`,
                    EndDate: '2024-07-22T00:15:00',
                    DepartDate: `${DepartDate} 2200`,
                    ArriveDate: '22072024 0015',
                    FlightNumber: '4333',
                    StopNum: 0,
                    Duration: 135,
                    ListSegment: [
                      {
                        Leg: 0,
                        SegmentId: '1',
                        Airline: 'VN',
                        Operator: 'VN',
                        StartPoint,
                        EndPoint,
                        StartDate: `${StartDate}T22:00:00`,
                        EndDate: '2024-07-22T00:15:00',
                        DepartDate: `${DepartDate} 2200`,
                        ArriveDate: '22072024 0015',
                        StartTerminal: '1',
                        EndTerminal: '1',
                        FlightNumber: '4333',
                        Equipment: '321',
                        FareClass: null,
                        FareBasis: null,
                        Duration: 135,
                        HasStop: false,
                        StopPoint: null,
                        StopTime: 0,
                        MarriageGrp: null,
                        FlightsMiles: 0,
                        Status: null,
                      },
                    ],
                  },
                ],
                OriginValue: 0,
                NdcInfo: null,
              },
            ],
            ListFareOption: [
              {
                OptionId: 0,
                FareClass: 'L',
                FareBasis: 'LPXVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 1999000,
                PriceAdt: 2828000,
                NetFare: 2728000,
                TotalFare: 2828000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 1999000,
                    NetFare: 2728000,
                    TotalFare: 2828000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 1999000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 729000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'L',
                        FareBasis: 'LPXVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 1,
                FareClass: 'K',
                FareBasis: 'KPXVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2209000,
                PriceAdt: 3055000,
                NetFare: 2955000,
                TotalFare: 3055000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2209000,
                    NetFare: 2955000,
                    TotalFare: 3055000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2209000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 746000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'K',
                        FareBasis: 'KPXVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 2,
                FareClass: 'H',
                FareBasis: 'HPXVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2419000,
                PriceAdt: 3282000,
                NetFare: 3182000,
                TotalFare: 3282000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2419000,
                    NetFare: 3182000,
                    TotalFare: 3282000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2419000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 763000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'H',
                        FareBasis: 'HPXVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 3,
                FareClass: 'S',
                FareBasis: 'SVNF',
                FareFamily: 'Economy Classic',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2609000,
                PriceAdt: 3487000,
                NetFare: 3387000,
                TotalFare: 3487000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2609000,
                    NetFare: 3387000,
                    TotalFare: 3487000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2609000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 778000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'S',
                        FareBasis: 'SVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 4,
                FareClass: 'M',
                FareBasis: 'MVNF',
                FareFamily: 'Economy Flex',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2789000,
                PriceAdt: 3682000,
                NetFare: 3582000,
                TotalFare: 3682000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2789000,
                    NetFare: 3582000,
                    TotalFare: 3682000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2789000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 793000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'M',
                        FareBasis: 'MVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 5,
                FareClass: 'B',
                FareBasis: 'BVNF',
                FareFamily: 'Economy Flex',
                CabinCode: 'M',
                CabinName: 'ECONOMY',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 2937000,
                PriceAdt: 3841000,
                NetFare: 3741000,
                TotalFare: 3841000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 2937000,
                    NetFare: 3741000,
                    TotalFare: 3841000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 2937000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 804000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'B',
                        FareBasis: 'BVNF',
                        HandBaggage: '1 piece x 10kg',
                        FreeBaggage: '1 piece x 23kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 6,
                FareClass: 'C',
                FareBasis: 'CVNF',
                FareFamily: 'Business Flex',
                CabinCode: 'C',
                CabinName: 'BUSINESS',
                Refundable: true,
                Availability: 1,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 6499000,
                PriceAdt: 7688000,
                NetFare: 7588000,
                TotalFare: 7688000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 6499000,
                    NetFare: 7588000,
                    TotalFare: 7688000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 6499000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 1089000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'C',
                        FareBasis: 'CVNF',
                        HandBaggage: '2 pieces x 9kg',
                        FreeBaggage: '1 piece x 32kg',
                        Availability: 1,
                      },
                    ],
                  },
                ],
              },
              {
                OptionId: 7,
                FareClass: 'J',
                FareBasis: 'JVNF',
                FareFamily: 'Business Flex',
                CabinCode: 'C',
                CabinName: 'BUSINESS',
                Refundable: true,
                Availability: 9,
                Unavailable: false,
                ExpiryDate: null,
                BaseFare: 7599000,
                PriceAdt: 8876000,
                NetFare: 8776000,
                TotalFare: 8876000,
                Currency: 'VND',
                System: 'VN',
                ListFarePax: [
                  {
                    PaxType: 'ADT',
                    PaxNumb: 1,
                    BaseFare: 7599000,
                    NetFare: 8776000,
                    TotalFare: 8876000,
                    ListFareItem: [
                      {
                        Code: 'TICKET_FARE',
                        Amount: 7599000,
                        Name: 'Ticket fare',
                      },
                      {
                        Code: 'TICKET_TAX',
                        Amount: 1177000,
                        Name: 'Ticket taxes',
                      },
                      {
                        Code: 'SERVICE_FEE',
                        Amount: 100000,
                        Name: 'Service fee',
                      },
                    ],
                    ListTaxDetail: [],
                    ListFareInfo: [
                      {
                        SegmentId: '1',
                        StartPoint,
                        EndPoint,
                        FareClass: 'J',
                        FareBasis: 'JVNF',
                        HandBaggage: '2 pieces x 9kg',
                        FreeBaggage: '1 piece x 32kg',
                        Availability: 9,
                      },
                    ],
                  },
                ],
              },
            ],
            OriginValue: 10,
            OriginSession: 'HANSG${DepartDate}_100_180724153516_VNA00017',
            IsNDC: false,
          },
        ],
      };
    },
  );

  return {
    data: {
      Session: 'DTC117-ECE15F0BE59E43E5B1FDC5E64B59909E',
      ListGroup,
      RequestID: 0,
      ApiQueries: [],
      StatusCode: '000',
      Success: true,
      Expired: false,
      Message: null,
      Language: 'vi',
      CustomProperties: null,
    },
  };
}

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { showToast } from '@vna-base/components';
import Clipboard from '@react-native-clipboard/clipboard';
import { flightResultActions } from '@vna-base/redux/action-slice';
import {
  ApplyFlightFee,
  ApplyPassengerFee,
} from '@vna-base/screens/flight/type';
import { Ibe } from '@services/axios';
import { AirOption, MinFare } from '@services/axios/axios-ibe';
import { AirportRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { translate } from '@vna-base/translations/translate';
import {
  StorageKey,
  convertStringToNumber,
  delay,
  getDateForHeaderResult,
  getFlightNumber,
  save,
  validResponse,
} from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import dayjs, { Dayjs } from 'dayjs';

export const runFlightResultListener = () => {
  takeLatestListeners(true)({
    actionCreator: flightResultActions.getFareRule,
    effect: async (action, listenerApi) => {
      const { System: SystemFare, verifySession, ...rest } = action.payload;

      const res = await Ibe.flightGetFareRuleCreate({
        SessionInfo: verifySession ? undefined : rest,
        System: SystemFare,
        VerifySession: verifySession,
      });

      if (validResponse(res)) {
        listenerApi.dispatch(
          flightResultActions.saveFareRule({
            type:
              res.data.ListFareRule?.[0]?.ListRuleGroup?.length === 1
                ? 'Custom'
                : 'Terminal',
            list: res.data.ListFareRule ?? [],
          }),
        );
      } else {
        listenerApi.dispatch(
          flightResultActions.saveFareRule({
            type: 'Terminal',
            list: [],
          }),
        );
      }
    },
  });

  takeLatestListeners(true)({
    actionCreator: flightResultActions.changeMinimize,
    effect: async (_, listenerApi) => {
      await delay(100);

      const { isCryptic } = listenerApi.getState().flightResult;
      listenerApi.dispatch(flightResultActions.saveIsCryptic(!isCryptic));

      save(StorageKey.IS_CRYPTIC_FLIGHT, !isCryptic);
      await delay(200);
    },
  });

  takeLatestListeners()({
    actionCreator: flightResultActions.getMinFares,
    effect: async (_, listenerApi) => {
      const { routes: storedRoutes } = listenerApi.getState().flightSearch;

      const arrDates = storedRoutes.map(route => [
        {
          date: dayjs(route.DepartDate).subtract(3, 'days'),
          ...route,
        },
        {
          date: dayjs(route.DepartDate).subtract(2, 'days'),
          ...route,
        },
        {
          date: dayjs(route.DepartDate).subtract(1, 'days'),
          ...route,
        },
        {
          date: dayjs(route.DepartDate),
          ...route,
        },
        {
          date: dayjs(route.DepartDate).add(1, 'days'),
          ...route,
        },
        {
          date: dayjs(route.DepartDate).add(2, 'days'),
          ...route,
        },
        {
          date: dayjs(route.DepartDate).add(3, 'days'),
          ...route,
        },
      ]);

      //@ts-ignore
      const result: Array<Array<{ minFare: MinFare; date: Date }>> = new Array(
        storedRoutes.length,
      )
        .fill(0)
        .map(() => [{}, {}, {}, {}, {}, {}, {}]);

      for (const [indexRoute, routeWithDate] of arrDates.entries()) {
        const res = await Promise.allSettled(
          routeWithDate.map(async dateWithRoute => {
            // const resMinFare = await Ibe.flightSearchMinFareCreate({
            //   DepartDate: dateWithRoute.date.format('DDMMYYYY'),
            //   StartPoint: dateWithRoute.StartPoint.Code,
            //   EndPoint: dateWithRoute.EndPoint.Code,
            //   System: 'VN',
            // });
            const resMinFare = await fakeMinFare({
              DepartDate: dateWithRoute.date,
              StartPoint: dateWithRoute.StartPoint.Code,
              EndPoint: dateWithRoute.EndPoint.Code,
            });

            return {
              minFare: (resMinFare.data.MinFare ?? {}) as MinFare,
              date: dateWithRoute.date.toDate(),
            };
          }),
        );

        res.forEach((rs, idxDate) => {
          if (rs.status === 'fulfilled') {
            result[indexRoute][idxDate] = rs.value;
          } else {
            result[indexRoute][idxDate] = {} as {
              minFare: MinFare;
              date: Date;
            };
          }
        });
      }

      listenerApi.dispatch(flightResultActions.saveMinFares(result));
    },
  });

  takeLatestListeners(true)({
    actionCreator: flightResultActions.saveCustomFee,
    effect: async (action, listenerApi) => {
      const customFee = action.payload;

      // lưu form này vào storage
      // save(StorageKey.CUSTOM_FEE_FLIGHT_FORM, {
      //   ...(load(StorageKey.CUSTOM_FEE_FLIGHT_FORM) ?? {}),
      //   ...customFee,
      // });

      listenerApi.dispatch(flightResultActions.calCustomFeeTotal(customFee));
    },
  });

  takeLatestListeners()({
    actionCreator: flightResultActions.calCustomFeeTotal,
    effect: async (action, listenerApi) => {
      const customFee = action.payload;

      const {
        searchForm: { Passengers: passengers },
        routes,
      } = listenerApi.getState().flightSearch;

      /**
       * Tổng tất cả các chuyến bay
       */
      let Total = 0;

      /**
       * Tổng giá vé cho 1 chuyến bay
       */
      let TotalFare = 0;
      /**
       * Giá cơ bản cho 1 người lớn (luôn bằng 0) cho 1 chuyến bay
       */
      const TicketFare = 0;
      /**
       * giá + thuế phí cho 1 ng lớn  cho 1 chuyến bay
       */
      let NetFare = 0;
      /**
       * giá + thuế phí cho 1 ng cho tất cả các chuyến bay
       */
      let NetFareForAll = 0;
      /**
       * giá + thuế phí cho 1 trẻ em cho 1 chuyến bay
       */
      let NetFareCHD = 0;
      /**
       * giá + thuế phí cho 1 trẻ sơ sinh cho 1 chuyến bay
       */
      let NetFareINF = 0;

      if (customFee) {
        const _amountAdult = convertStringToNumber(customFee.ADT);
        const _amountChildren = convertStringToNumber(customFee.CHD);
        const _amountInfant = convertStringToNumber(customFee.INF);

        // Tổng giá vé của các hành khách trong 1 chuyến bay
        const totalAmountPassenger =
          customFee.applyPassenger === ApplyPassengerFee.All
            ? _amountAdult +
              (passengers.Chd ? _amountChildren : 0) +
              (passengers.Inf ? _amountInfant : 0)
            : _amountAdult * passengers.Adt +
              _amountChildren * (passengers.Chd ?? 0) +
              _amountInfant * (passengers.Inf ?? 0);

        if (customFee.applyFLight === ApplyFlightFee.All) {
          Total = totalAmountPassenger;
        } else {
          Total = totalAmountPassenger * routes.length;

          TotalFare = totalAmountPassenger;

          NetFare =
            customFee.applyPassenger === ApplyPassengerFee.All
              ? Math.round(_amountAdult / passengers.Adt)
              : _amountAdult;

          NetFareForAll =
            (customFee.applyPassenger === ApplyPassengerFee.All
              ? Math.round(_amountAdult / passengers.Adt)
              : _amountAdult) * routes.length;

          NetFareCHD =
            customFee.applyPassenger === ApplyPassengerFee.All
              ? Math.round(_amountChildren / (passengers.Chd || 1))
              : _amountChildren;

          NetFareINF =
            customFee.applyPassenger === ApplyPassengerFee.All
              ? Math.round(_amountInfant / (passengers.Inf || 1))
              : _amountInfant;
        }
      }

      listenerApi.dispatch(
        flightResultActions.saveCustomFeeTotal({
          ...customFee,
          Total,
          PriceAdt: NetFare,
          TotalFare,
          BaseFare: TicketFare,
          PriceInf: NetFareINF,
          PriceChd: NetFareCHD,
          PriceAdtForAll: NetFareForAll,
        }),
      );
    },
  });

  takeLatestListeners()({
    actionCreator: flightResultActions.copyFareReportToClipboard,
    effect: async (_, listenerApi) => {
      const { listGroup, multiFlights } = listenerApi.getState().flightResult;

      const {
        flightSearch: { routes, searchForm },
        flightResult: {
          filterForms: { Fare },
          customFeeTotal,
        },
        app: { language },
      } = listenerApi.getState();

      const listRoute = routes.map((fl, index) => {
        const multiFlight = index === 0 ? multiFlights : [];

        const listAirOption = (listGroup[index].ListAirOption ?? [])
          .concat(
            multiFlight.length > 0
              ? //@ts-ignore
                [{ type: searchForm.Type }]
              : [],
          )
          .concat(multiFlight);

        return {
          route: fl,
          data: listAirOption.flatMap(airOption => {
            //@ts-ignore
            if (airOption?.type) {
              return [airOption];
            }

            return (
              airOption?.ListFareOption?.map(fareOption => ({
                ...airOption,
                ListFareOption: [fareOption],
              })) ?? []
            );
          }) as Array<AirOption>,
        };
      });

      // generate ra string để lưu vào clipboard
      let result = '';

      result += listRoute.reduce(
        (concatRoute, currRoute) =>
          concatRoute +
          `${translate('common:route')} ${
            currRoute.route.StartPoint.CityNameVi
          } (${currRoute.route.StartPoint.Code}) - ${
            currRoute.route.EndPoint.CityNameVi
          } (${currRoute.route.EndPoint.Code})\n` +
          `${translate('common:departure_date')}: ${getDateForHeaderResult(
            currRoute.route.DepartDate,
            searchForm?.Passengers,
          )}\n\n` +
          currRoute.data.reduce((concatAirOption, airOption) => {
            if (!airOption) {
              return concatAirOption;
            }

            //@ts-ignore
            if (airOption.type) {
              //@ts-ignore
              const isMultiFlight = airOption.type === 'MultiStage';

              const startPointCode =
                searchForm.Flights[0].airport.takeOff?.Code;
              const endPointCode = isMultiFlight
                ? searchForm.Flights[searchForm.Flights.length - 1].airport
                    .takeOff?.Code
                : searchForm.Flights[0].airport.landing?.Code;

              const startCity =
                realmRef.current?.objectForPrimaryKey<AirportRealm>(
                  AirportRealm.schema.name,
                  startPointCode,
                )?.City;

              const endCity =
                realmRef.current?.objectForPrimaryKey<AirportRealm>(
                  AirportRealm.schema.name,
                  endPointCode,
                )?.City;

              return (
                concatAirOption +
                '\n' +
                `${translate(
                  'flight:combined_flight',
                ).upperCaseFirstLetter()} ${translate(
                  isMultiFlight ? 'flight:multi_stage' : 'flight:round_stage',
                ).toLocaleLowerCase()} ${
                  language === 'vi' ? startCity?.NameVi : startCity?.NameEn
                }(${startPointCode}) -  ${
                  language === 'vi' ? endCity?.NameVi : endCity?.NameEn
                }(${endPointCode})\n` +
                `${translate(
                  'common:departure_date',
                )}: ${getDateForHeaderResult(
                  currRoute.route.DepartDate,
                  searchForm?.Passengers,
                )}\n\n`
              );
            }

            return (
              concatAirOption +
              airOption.ListFlightOption![0].ListFlight?.reduce(
                (concatFlight, currFlight, currLFightIdx) =>
                  concatFlight +
                  currFlight.ListSegment?.reduce(
                    (concatSegment, currSegment, currSegmentIdx) =>
                      concatSegment +
                      `${getFlightNumber(
                        currSegment.Airline,
                        currSegment.FlightNumber,
                      )} ${dayjs(currSegment.StartDate).format(
                        'DD/MM',
                      )} ${dayjs(currSegment.StartDate).format(
                        'HH:mm',
                      )} - ${dayjs(currSegment.EndDate).format('HH:mm')} ${
                        currSegment.StartPoint
                      } ${currSegment.EndPoint} ${
                        currSegmentIdx === 0 && currLFightIdx === 0
                          ? `${(
                              (airOption.ListFareOption?.[0].TotalFare ?? 0) +
                              customFeeTotal[Fare]
                            ).currencyFormat()}`
                          : ''
                      }\n`,
                    '',
                  ),
                '',
              ) +
              '--------------------------------\n'
            );
          }, ''),
        '',
      );

      Clipboard.setString(result);
      //lưu thành công
      showToast({
        type: 'normal',
        text: translate('common:saved_to_clipboard'),
        color: '#0E8C35',
        icon: 'all_done_fill',
      });
    },
  });

  takeLatestListeners()({
    actionCreator: flightResultActions.verifyFlights,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(
        flightResultActions.changeIsLoadingVerifiedFlights(true),
      );

      const { flights, cb } = action.payload;

      const res = await Ibe.flightVerifyFlightCreate({
        ListSession: flights,
      });

      if (validResponse(res)) {
        listenerApi.dispatch(
          flightResultActions.saveVerifiedFlights(res.data.ListFlightFare!),
        );
      }

      listenerApi.dispatch(
        flightResultActions.changeIsLoadingVerifiedFlights(false),
      );

      cb({
        verifiedFlights: res.data.ListFlightFare ?? [],
        errMsg: res.data.Message,
      });
    },
  });
};

async function fakeMinFare({
  DepartDate,
  EndPoint,
  StartPoint,
}: {
  DepartDate: Dayjs;
  StartPoint: string;
  EndPoint: string;
}) {
  await delay(500);
  return {
    data: {
      MinFare: {
        System: 'VN',
        Airline: 'VN',
        StartPoint,
        EndPoint,
        DepartDate: `${DepartDate.format('DDMMYYYY')} 2055`,
        ArrivalDate: `${DepartDate.format('DDMMYYYY')} 2310`,
        FlightNumber: '787',
        FareClass: 'H',
        FareBasis: 'HREGOW',
        Currency: 'VND',
        Fare: 628000,
        Tax: 687640,
        Total: 1315640,
        StartDate: `${DepartDate.format('YYYY-MM-DD')}T20:55:00`,
        EndDate: `${DepartDate.format('YYYY-MM-DD')}T23:10:00`,
      },
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

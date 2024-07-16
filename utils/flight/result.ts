/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Route } from '@redux/type';
import {
  ApplyFlightFee,
  ApplyPassengerFee,
  CustomFeeForm,
  FilterForm,
  Passengers,
  Sort,
} from '@vna-base/screens/flight/type';
import {
  AirOption,
  FareOption,
  FlightOption,
  OptionGroup,
} from '@services/axios/axios-ibe';
import { translate } from '@vna-base/translations/translate';
import {
  convertHalf2Hour,
  convertStringToNumber,
  getState,
  HourSlot,
} from '@vna-base/utils';

import dayjs from 'dayjs';
import cloneDeep from 'lodash.clonedeep';
import isEmpty from 'lodash.isempty';

export function sortFlights(optionGroup: OptionGroup, sort: Sort) {
  const tempOptionGroup = cloneDeep(optionGroup);

  if ((tempOptionGroup?.ListAirOption ?? []).length === 0) {
    return tempOptionGroup;
  }

  /** Có phải tăng dần hay không */
  const isAsc = sort.OrderType === 'Asc';

  switch (sort.OrderField) {
    case 'Airline':
      tempOptionGroup.ListAirOption!.sort((a: AirOption, b: AirOption) => {
        if (a.Airline! < b.Airline!) {
          return isAsc ? -1 : 1;
        }

        if (a.Airline! > b.Airline!) {
          return isAsc ? 1 : -1;
        }

        return 0;
      });

      break;

    case 'DepartDate':
      tempOptionGroup?.ListAirOption!.sort((a: AirOption, b: AirOption) => {
        const dateA = dayjs(
          a.ListFlightOption![0].ListFlight![0].DepartDate,
          'DDMMYYYY HHmm',
        );
        const dateB = dayjs(
          b.ListFlightOption![0].ListFlight![0].DepartDate,
          'DDMMYYYY HHmm',
        );

        return isAsc
          ? dateA.unix() - dateB.unix()
          : dateB.unix() - dateA.unix();
      });

      break;

    case 'ArriveDate':
      tempOptionGroup.ListAirOption!.sort((a: AirOption, b: AirOption) => {
        const dateA = dayjs(
          a.ListFlightOption![0].ListFlight![0].ArriveDate,
          'DDMMYYYY HHmm',
        );
        const dateB = dayjs(
          b.ListFlightOption![0].ListFlight![0].ArriveDate,
          'DDMMYYYY HHmm',
        );

        return isAsc
          ? dateA.unix() - dateB.unix()
          : dateB.unix() - dateA.unix();
      });

      break;

    default:
      tempOptionGroup.ListAirOption!.sort((a: AirOption, b: AirOption) => {
        const _a = a.ListFareOption![0][sort.FareType!] ?? 0;
        const _b = b.ListFareOption![0][sort.FareType!] ?? 0;

        return isAsc ? _a - _b : _b - _a;
      });

      break;
  }

  return tempOptionGroup;
}

export function filterFlight(
  optionGroup: OptionGroup,
  filterForm: FilterForm | null,
) {
  const tempOptionGroup = cloneDeep(optionGroup);

  if ((tempOptionGroup?.ListAirOption ?? []).length === 0 || !filterForm) {
    return tempOptionGroup;
  }

  const filterObject: Record<string, any> = {
    Airline: {},
    System: {},
    SeatClass: {},
    StopNum: {},
    FareRange: [],
    Duration: [],
  };
  if (filterForm.DepartTimeType === 'DepartTimeRange') {
    filterObject.DepartTimeRange = [];
  } else {
    filterObject.DepartTimeSlot = [];
  }

  // * Fare range
  const fare = filterForm.FareRange?.fare?.[filterForm?.Fare];

  const rangeFare = fare.max - fare.min;

  filterObject.FareRange[0] =
    fare.min + Math.floor((rangeFare * filterForm.FareRange?.range[0]) / 100);

  filterObject.FareRange[1] =
    fare.min + Math.ceil((rangeFare * filterForm.FareRange?.range[1]) / 100);

  //* Flight Duration
  const { duration } = filterForm.Duration;

  const rangeDuration = duration.max - duration.min;

  filterObject.Duration[0] =
    duration.min +
    Math.floor((rangeDuration * filterForm.Duration?.range[0]) / 100);

  filterObject.Duration[1] =
    duration.min +
    Math.ceil((rangeDuration * filterForm.Duration?.range[1]) / 100);

  Object.keys(filterObject).forEach(key => {
    switch (key) {
      case 'Airline':
        filterForm.Airline.forEach(al => {
          if (al.selected === false) {
            filterObject.Airline[al.key] = false;
          }
        });
        break;

      case 'System':
        filterForm.System.forEach(s => {
          if (s.selected === false) {
            filterObject.System[s.key] = false;
          }
        });
        break;

      case 'SeatClass':
        filterForm.SeatClass.forEach(s => {
          if (s.selected === false) {
            filterObject.SeatClass[s.key] = false;
          }
        });
        break;

      case 'StopNum':
        filterForm.StopNum.forEach(sn => {
          if (sn.selected === false) {
            filterObject.StopNum[sn.key] = false;
          }
        });

        break;

      case 'DepartTimeRange':
        filterObject.DepartTimeRange = [
          dayjs(convertHalf2Hour(filterForm.DepartTimeRange.range[0]), 'HH:mm'),
          dayjs(convertHalf2Hour(filterForm.DepartTimeRange.range[1]), 'HH:mm'),
        ];

        break;

      case 'DepartTimeSlot':
        filterForm.DepartTimeSlot.slots.forEach((slot, index) => {
          if (slot) {
            filterObject.DepartTimeSlot.push([
              dayjs(HourSlot[index][0], 'HH:mm'),
              dayjs(HourSlot[index][1], 'HH:mm'),
            ]);
          }
        });

        break;

      // 'Fare'|'FareRange'|'Duration'|'DepartTimeType'
      default:
        break;
    }
  });

  tempOptionGroup.ListAirOption = tempOptionGroup.ListAirOption!.filter(
    airOption => {
      let bool = true;

      Object.keys(filterObject).forEach(filterKey => {
        if (!bool) {
          return;
        }

        switch (filterKey) {
          case 'Airline':
            if (filterObject.Airline[airOption.Airline!] === false) {
              bool = false;
              return;
            }

            break;

          case 'System':
            if (filterObject.System[airOption.System!] === false) {
              bool = false;
              return;
            }

            break;

          case 'SeatClass':
            airOption.ListFareOption = airOption.ListFareOption?.filter(
              fareOption =>
                filterObject.SeatClass[fareOption.FareFamily!] !== false,
            );

            if (airOption.ListFareOption?.length === 0) {
              bool = false;
              return;
            }

            break;

          case 'FareRange':
            // kiểm tra xem trong mảng faresOfAirlineOption có member nào thoản mãn điều kiện không.
            // nếu có thì cho qua.
            // nếu không thì return.

            airOption.ListFareOption = airOption.ListFareOption?.filter(
              fareOption => {
                const resolveFare = getFareFromFareOption(fareOption);
                // nếu đang chọn: tổng giá vé cho tất cả hành khách
                if (
                  filterForm.Fare === 'TotalFare' &&
                  Number(resolveFare.ADT.TotalFare) >=
                    filterObject.FareRange[0] &&
                  Number(resolveFare.ADT.TotalFare) <= filterObject.FareRange[1]
                ) {
                  return true;
                }

                // nếu đang chọn: Giá cơ bản cho 1 người lớn
                if (
                  filterForm.Fare === 'BaseFare' &&
                  Number(resolveFare.ADT.TicketFare) >=
                    filterObject.FareRange[0] &&
                  Number(resolveFare.ADT.TicketFare) <=
                    filterObject.FareRange[1]
                ) {
                  return true;
                }

                // nếu đang chọn: Giá+ thuế, phí cho 1 người lớn
                if (
                  filterForm.Fare === 'PriceAdt' &&
                  Number(resolveFare.ADT.NetFare) >=
                    filterObject.FareRange[0] &&
                  Number(resolveFare.ADT.NetFare) <= filterObject.FareRange[1]
                ) {
                  return true;
                }

                return false;
              },
            );

            if (
              !airOption.ListFareOption ||
              airOption.ListFareOption.length === 0
            ) {
              bool = false;
              return;
            }

            break;

          case 'Duration':
            airOption.ListFlightOption = airOption.ListFlightOption?.filter(
              flightOption => {
                for (const flight of flightOption.ListFlight!) {
                  if (
                    flight.Duration! > filterObject.Duration[1] ||
                    flight.Duration! < filterObject.Duration[0]
                  ) {
                    return false;
                  }
                }

                return true;
              },
            );

            if (
              !airOption.ListFlightOption ||
              airOption.ListFlightOption.length === 0
            ) {
              bool = false;
              return;
            }

            break;

          case 'StopNum':
            airOption.ListFlightOption = airOption.ListFlightOption?.filter(
              flightOption => {
                const iFlight = flightOption.ListFlight?.findIndex(flight => {
                  let stopNum = 'MultiStop';
                  if (flight.StopNum === 0) {
                    stopNum = 'NonStop';
                  } else if (flight.StopNum === 1) {
                    stopNum = 'OneStop';
                  }

                  return filterObject.StopNum[stopNum] !== false;
                });

                return iFlight !== -1;
              },
            );

            if (airOption.ListFlightOption?.length === 0) {
              bool = false;
              return;
            }

            break;

          case 'DepartTimeRange':
            if (filterObject.DepartTimeRange.length > 0) {
              airOption.ListFlightOption = airOption.ListFlightOption?.filter(
                flightOption => {
                  const iFlight = flightOption.ListFlight?.findIndex(flight =>
                    dayjs(
                      flight.DepartDate!.substring(9, 13),
                      'HHmm',
                    ).isBetween(
                      filterObject.DepartTimeRange[0],
                      filterObject.DepartTimeRange[1],
                      'hours',
                      '[]',
                    ),
                  );
                  return iFlight !== -1;
                },
              );

              if (airOption.ListFlightOption?.length === 0) {
                bool = false;
                return;
              }
            }

            break;

          case 'DepartTimeSlot':
            if (filterObject.DepartTimeSlot.length > 0) {
              airOption.ListFlightOption = airOption.ListFlightOption?.filter(
                flightOption => {
                  const iFlight = flightOption.ListFlight?.findIndex(flight => {
                    for (const slot of filterObject.DepartTimeSlot) {
                      if (
                        dayjs(
                          flight.DepartDate!.substring(9, 13),
                          'HHmm',
                        ).isBetween(slot[0], slot[1], 'hour', '[]')
                      ) {
                        return true;
                      }
                    }

                    return false;
                  });

                  return iFlight !== -1;
                },
              );

              if (airOption.ListFlightOption?.length === 0) {
                bool = false;
                return;
              }
            } else {
              bool = false;
              return;
            }

            break;
        }
      });

      return bool;
    },
  );

  return tempOptionGroup;
}

/**
 *
 * @param fareOption
 * @returns
 * TotalFare: giá tổng ---
 * TicketFare: giá cơ bản cho 1 ng ----
 * TicketTax: thue + phí ---
 * TicketVat: vat ---
 * NetFare:  giá + thuế phí cho 1 ng
 */
export function getFareFromFareOption(
  fareOption: FareOption,
): Record<
  'ADT' | 'CHD' | 'INF',
  Record<
    'TotalFare' | 'TicketFare' | 'TicketTax' | 'TicketVat' | 'NetFare',
    number
  >
> {
  const value: any = {};
  const ADTFarePax = fareOption?.ListFarePax?.find(fp => fp.PaxType === 'ADT');
  value.ADT = {
    /**
     * giá vé
     */
    TotalFare: fareOption?.TotalFare ?? 0,
    /**
     * giá cơ bản cho 1 ng
     */
    TicketFare: ADTFarePax?.ListFareItem?.[0]?.Amount ?? 0,

    /**
     * Thue + phi
     */
    TicketTax: ADTFarePax?.ListFareItem?.[1]?.Amount ?? 0,

    /**
     * VAT
     */
    TicketVat: ADTFarePax?.ListFareItem?.[2]?.Amount ?? 0,

    /**
     * giá + thuế phí cho 1 ng
     */
    NetFare: ADTFarePax?.TotalFare ?? 0,
  };

  const CHDFarePax = fareOption?.ListFarePax?.find(fp => fp.PaxType === 'CHD');

  if (!isEmpty(CHDFarePax)) {
    value.CHD = {
      /**
       * giá vé
       */
      TotalFare: fareOption?.TotalFare ?? 0,
      /**
       * giá cơ bản cho 1 ng
       */
      TicketFare: CHDFarePax?.ListFareItem?.[0]?.Amount ?? 0,

      /**
       * Thue + phi
       */
      TicketTax: CHDFarePax?.ListFareItem?.[1]?.Amount ?? 0,

      /**
       * VAT
       */
      TicketVat: CHDFarePax?.ListFareItem?.[2]?.Amount ?? 0,

      /**
       * giá + thuế phí cho 1 ng
       */
      NetFare: CHDFarePax?.TotalFare ?? 0,
    };
  }

  const INFFarePax = fareOption?.ListFarePax?.find(fp => fp.PaxType === 'INF');

  if (!isEmpty(INFFarePax)) {
    value.INF = {
      /**
       * giá vé
       */
      TotalFare: fareOption?.TotalFare ?? 0,
      /**
       * giá cơ bản cho 1 ng
       */
      TicketFare: INFFarePax.ListFareItem?.[0]?.Amount ?? 0,

      /**
       * Thue + phi trẻ sơ sinh được miễn
       */
      TicketTax: 0,

      /**
       * VAT trẻ sơ sinh được miễn
       */
      TicketVat: 0,

      /**
       * giá + thuế phí cho 1 ng
       */
      NetFare: INFFarePax?.TotalFare ?? 0,
    };
  }

  return value;
}

/**
 * Update filterForm theo sau mỗi req
 */
export const updateFilterForm = (
  filterForms: Array<FilterForm>,
  optionGroups: Array<OptionGroup>,
) => {
  const tempFilterForm = cloneDeep(filterForms);

  // duyệt từng group
  for (let i = 0; i < optionGroups.length; i++) {
    optionGroups[i]?.ListAirOption?.forEach(ao => {
      // LẤY DANH SÁCH CÁC HÃNG BAY CHO FILTER_FORM
      // tìm xem trong mảng airline của filter có hãng bay ao.Airline chưa
      const iEqu = tempFilterForm[i].Airline.findIndex(
        ar => ar.key === ao.Airline,
      );
      // nếu chưa có thì push vào danh sách airline- đoạn này để lấy giá rẻ nhất của airline
      if (iEqu === -1) {
        tempFilterForm[i].Airline.push({
          key: ao.Airline as string,
          selected: true,
          minFare: {
            TotalFare: ao.ListFareOption![0].TotalFare ?? 0,
            PriceAdt:
              ao.ListFareOption![0].ListFarePax![0].ListFareItem![0].Amount ??
              0,
            BaseFare: ao.ListFareOption![0].ListFarePax![0].TotalFare ?? 0,
          },
        });
      }
      // nếu có rồi thì so sánh xem fare nào nhỏ hơn thì lấy fare đó - đoạn này để lấy giá rẻ nhất của airline
      else {
        tempFilterForm[i].Airline[iEqu].minFare.TotalFare =
          ao.ListFareOption![0].TotalFare! <
          tempFilterForm[i].Airline[iEqu].minFare.TotalFare
            ? ao.ListFareOption![0].TotalFare!
            : tempFilterForm[i].Airline[iEqu].minFare.TotalFare;

        tempFilterForm[i].Airline[iEqu].minFare.PriceAdt =
          ao.ListFareOption![0].ListFarePax![0].ListFareItem![0].Amount! <
          tempFilterForm[i].Airline[iEqu].minFare.PriceAdt
            ? ao.ListFareOption![0].ListFarePax![0].ListFareItem![0].Amount!
            : tempFilterForm[i].Airline[iEqu].minFare.PriceAdt;

        tempFilterForm[i].Airline[iEqu].minFare.BaseFare =
          ao.ListFareOption![0].ListFarePax![0].TotalFare! <
          tempFilterForm[i].Airline[iEqu].minFare.BaseFare
            ? ao.ListFareOption![0].ListFarePax![0].TotalFare!
            : tempFilterForm[i].Airline[iEqu].minFare.BaseFare;
      }

      ao.ListFareOption?.forEach(fo => {
        //* tìm xem trong mảng SeatClass của filter có fo.FareFamily chưa
        const index = tempFilterForm[i].SeatClass.findIndex(
          sc => sc.key === fo.FareFamily,
        );
        // nếu chưa có thì push vào mảng seatClass - đoạn này để lấy giá rẻ nhất của FareFamily
        if (index === -1) {
          tempFilterForm[i].SeatClass.push({
            key: fo.FareFamily as string,
            selected: true,
            minFare: {
              TotalFare: fo.TotalFare ?? 0,
              PriceAdt: fo.ListFarePax![0].ListFareItem![0].Amount ?? 0,
              BaseFare: fo.ListFarePax![0].TotalFare ?? 0,
            },
          });
        }
        // nếu có rồi thì so sánh xem fare nào nhỏ hơn thì lấy fare đó - đoạn này để lấy giá rẻ nhất của FareFamily
        else {
          tempFilterForm[i].SeatClass[index].minFare.TotalFare =
            fo.TotalFare! < tempFilterForm[i].SeatClass[index].minFare.TotalFare
              ? fo.TotalFare!
              : tempFilterForm[i].SeatClass[index].minFare.TotalFare;

          tempFilterForm[i].SeatClass[index].minFare.PriceAdt =
            fo.ListFarePax![0].ListFareItem![0].Amount! <
            tempFilterForm[i].SeatClass[index].minFare.PriceAdt
              ? fo.ListFarePax![0].ListFareItem![0].Amount!
              : tempFilterForm[i].SeatClass[index].minFare.PriceAdt;

          tempFilterForm[i].SeatClass[index].minFare.BaseFare =
            fo.ListFarePax![0].TotalFare! <
            tempFilterForm[i].SeatClass[index].minFare.BaseFare
              ? fo.ListFarePax![0].TotalFare!
              : tempFilterForm[i].SeatClass[index].minFare.BaseFare;
        }
        // *end

        //* lấy giá rẻ nhất và đắt nhất
        compareMinMaxFare(ao.ListFareOption!, tempFilterForm[i]);
        //* end
      });

      //* TÌM KHOẢNG THỜI GIAN BAY MAX-MIN
      compareMinMaxDuration(ao.ListFlightOption!, tempFilterForm[i]);
    });
  }

  return tempFilterForm;
};

const compareMinMaxFare = (
  listFareOption: Array<FareOption>,
  filterForm: FilterForm,
) => {
  //* tìm min
  // fareOption số 0 thì có giá rẻ nhất trong số các fareOption
  // eslint-disable-next-line prefer-destructuring
  const fareOption0 = listFareOption[0];

  // TotalFare
  if (fareOption0.TotalFare! < filterForm.FareRange.fare.TotalFare.min) {
    filterForm.FareRange.fare.TotalFare.min = fareOption0.TotalFare!;
  }

  // TicketFare
  if (
    fareOption0.ListFarePax![0].ListFareItem![0].Amount! <
    filterForm.FareRange.fare.PriceAdt.min
  ) {
    filterForm.FareRange.fare.PriceAdt.min =
      fareOption0.ListFarePax![0].ListFareItem![0].Amount!;
  }

  // NetFare
  if (
    fareOption0.ListFarePax![0].TotalFare! <
    filterForm.FareRange.fare.BaseFare.min
  ) {
    filterForm.FareRange.fare.BaseFare.min =
      fareOption0.ListFarePax![0].TotalFare!;
  }
  //* end

  //* tìm max
  // fareOption ở vị trí cuối cùng thì có giá đắt nhất trong số các fareOption

  const lastFareOption = listFareOption[listFareOption.length - 1];

  // TotalFare
  if (lastFareOption.TotalFare! > filterForm.FareRange.fare.TotalFare.max) {
    filterForm.FareRange.fare.TotalFare.max = lastFareOption.TotalFare!;
  }

  // TicketFare
  if (
    lastFareOption.ListFarePax![0].ListFareItem![0].Amount! >
    filterForm.FareRange.fare.PriceAdt.max
  ) {
    filterForm.FareRange.fare.PriceAdt.max =
      lastFareOption.ListFarePax![0].ListFareItem![0].Amount!;
  }

  // NetFare
  if (
    lastFareOption.ListFarePax![0].TotalFare! >
    filterForm.FareRange.fare.BaseFare.max
  ) {
    filterForm.FareRange.fare.BaseFare.max =
      lastFareOption.ListFarePax![0].TotalFare!;
  }
  //* end
};

const compareMinMaxDuration = (
  flightOptions: Array<FlightOption>,
  filterForm: FilterForm,
) => {
  flightOptions.forEach(flo => {
    flo.ListFlight?.forEach(fl => {
      if (fl.Duration! > filterForm.Duration.duration.max) {
        filterForm.Duration.duration.max = fl.Duration!;
      } else if (fl.Duration! < filterForm.Duration.duration.min) {
        filterForm.Duration.duration.min = fl.Duration!;
      }
    });
  });

  if (filterForm.Duration.duration.min > filterForm.Duration.duration.max) {
    filterForm.Duration.duration.min = filterForm.Duration.duration.max;
  }
};

export const getDateForHeaderResult = (
  date: Date,
  passengers: Passengers | undefined,
) => {
  const { language } = getState('app');
  switch (language) {
    case 'en':
      return `${dayjs(date)
        .locale('en')
        .format('dddd, D MMMM YYYY')
        .capitalize()} | ${Object.entries(
        passengers !== undefined &&
          (passengers as { [s: string]: number } | ArrayLike<number>),
      ).reduce((acc, [_key, value]) => acc + value, 0)} ${translate(
        'flight:passenger',
      )}`;

    default:
      return `${dayjs(date)
        .locale('vi')
        .format('dddd, D [Tháng] M YYYY')
        .capitalize()} | ${Object.entries(
        passengers !== undefined &&
          (passengers as { [s: string]: number } | ArrayLike<number>),
      ).reduce((acc, [_key, value]) => acc + value, 0)} ${translate(
        'flight:passenger',
      )}`;
  }
};

export const calTotalCustomFee = (
  customFee: CustomFeeForm,
  passengers: Passengers,
  routes: Array<Route>,
) => {
  const _amountAdult = convertStringToNumber(customFee.ADT);
  const _amountChildren = convertStringToNumber(customFee.CHD);
  const _amountInfant = convertStringToNumber(customFee.INF);

  const totalAmountPassenger =
    customFee.applyPassenger === ApplyPassengerFee.All
      ? _amountAdult +
        (passengers.Chd ? _amountChildren : 0) +
        (passengers.Inf ? _amountInfant : 0)
      : _amountAdult * passengers.Adt +
        _amountChildren * (passengers.Chd ?? 0) +
        _amountInfant * (passengers.Inf ?? 0);

  return (
    totalAmountPassenger *
    (customFee.applyFLight === ApplyFlightFee.All ? 1 : routes.length)
  );
};

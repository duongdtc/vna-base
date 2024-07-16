/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  selectCurrentStage,
  selectFilterForm,
  selectListRoute,
  selectMinFares,
  selectSearchForm,
} from '@redux-selector';
import { FareFilter } from '@vna-base/screens/flight/type';
import dayjs from 'dayjs';
import isEmpty from 'lodash.isempty';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useMinFareFollowingDate = () => {
  const searchForm = useSelector(selectSearchForm);
  const currentStage = useSelector(selectCurrentStage);
  const listRoute = useSelector(selectListRoute);
  const minFares = useSelector(selectMinFares);
  const filterForm = useSelector(selectFilterForm);

  const minDate = useMemo(() => {
    let date = dayjs();

    if (
      searchForm &&
      currentStage > 0 &&
      date.isBefore(dayjs(listRoute[currentStage - 1].DepartDate))
    ) {
      date = dayjs(listRoute[currentStage - 1].DepartDate);
    }

    return date;
  }, [currentStage, listRoute, searchForm]);

  const data = useMemo(
    () =>
      listRoute.length === 0 || !filterForm
        ? [
            {
              date: new Date(),
              fare: { TotalFare: 0, PriceAdt: 0 } as FareFilter,
            },
          ]
        : minFares[currentStage]?.map(dateWithMinFare => {
            //@ts-ignore
            const fare: FareFilter = {};

            // Tổng giá vé cho tất cả hành khách
            if (
              !isEmpty(dateWithMinFare.minFare) &&
              (isEmpty(fare) ||
                fare.TotalFare >
                  (dateWithMinFare.minFare?.Total ?? 100_000_000))
            ) {
              fare.TotalFare = dateWithMinFare.minFare!.Total!;
            }

            return { fare, date: dateWithMinFare.date ?? new Date() };
          }),
    [listRoute.length, filterForm, minFares, currentStage],
  );

  return {
    minDate,
    data,
  };
};

import { selectMinPrices, selectResultMonthFilterForm } from '@vna-base/redux/selector';
import { ResultMonthFilterForm } from '@vna-base/screens/flight/type';
import { MinPrice } from '@services/axios/axios-ibe';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const useGetResult = (leg: number) => {
  const minPrices = useSelector(selectMinPrices(leg));
  const filterForm = useSelector(selectResultMonthFilterForm);

  const [data, setData] = useState<Array<MinPrice>>([]);

  const filterPrice = useCallback(
    (
      _minPrices: Array<MinPrice>,
      _filterForm: ResultMonthFilterForm | null,
    ) => {
      if (!_filterForm?.Airline) {
        setData(_minPrices);
        return;
      }

      setData(
        _minPrices.map(minPrice => ({
          DepartDate: minPrice.DepartDate,
          ListFlightFare: minPrice.ListFlightFare?.filter(
            ff => ff.Airline === _filterForm?.Airline,
          ),
        })),
      );
      return;
    },
    [],
  );

  useEffect(() => {
    filterPrice(minPrices, filterForm);
  }, [minPrices, filterForm, filterPrice]);

  return data;
};

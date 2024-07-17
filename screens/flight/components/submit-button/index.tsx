import { Button } from '@vna-base/components';
import { flightSearchActions } from '@vna-base/redux/action-slice';
import { SearchForm, SubmitButtonProps } from '@vna-base/screens/flight/type';
import { bs } from '@theme';
import { dispatch } from '@vna-base/utils';
import React, { useMemo } from 'react';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import { View } from 'react-native';

export const SubmitButton = ({
  callback,
  style,
  type: bgColor = 'gra1',
}: SubmitButtonProps) => {
  const { handleSubmit, control } = useFormContext<SearchForm>();

  const { isValid } = useFormState<SearchForm>({ control: control });

  const flights = useWatch({
    control,
    name: 'Flights',
  });

  const type = useWatch({
    control,
    name: 'Type',
  });

  const _isValid = useMemo(() => {
    let isValidFlights = true;
    if (type === 'MultiStage') {
      const i = flights.findIndex(fl => fl.airport.landing === undefined);
      isValidFlights = i < 0;
    } else if (
      flights[0].airport.takeOff === undefined ||
      flights[0].airport.landing === undefined
    ) {
      isValidFlights = false;
    }

    return isValidFlights && isValid;
  }, [flights, isValid, type]);

  const search = (data: SearchForm) => {
    dispatch(flightSearchActions.searchFlights(data));

    callback?.(data.ByMonth);
  };

  const submit = () => {
    handleSubmit(search)();
  };

  return (
    <View style={bs.marginHorizontal_16}>
      <Button
        buttonStyle={style}
        t18n="flight:search"
        fullWidth
        onPress={submit}
        buttonColorTheme={bgColor}
        textColorTheme="white"
        disabled={!_isValid}
      />
    </View>
  );
};

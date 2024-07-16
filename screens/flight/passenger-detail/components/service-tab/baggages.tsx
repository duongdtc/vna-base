import { Block } from '@vna-base/components';
import { selectBaggages, selectIsLoadingAncillaries } from '@redux-selector';
import { ModalBaggagePickerRef, PassengerForm } from '@vna-base/screens/flight/type';
import { Ancillary } from '@services/axios/axios-ibe';
import React, { useMemo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Service } from '.';
import { BaggageItem } from './baggage-item';
import { ItemContainer } from './item-container';
import { ModalBaggagePicker } from './modal-baggage-picker';

export const Baggages = ({ t18nTitle }: Pick<Service, 't18nTitle'>) => {
  const { setValue } = useFormContext<PassengerForm>();
  const modalRef = useRef<ModalBaggagePickerRef>(null);
  const baggages = useSelector(selectBaggages);
  const isLoading = useSelector(selectIsLoadingAncillaries);

  const isNotEmp = useMemo(
    () => Object.values(baggages).some(baggage => baggage.length > 0),
    [baggages],
  );

  const renderItem = (data: {
    passengerIndex: number;
    flightIndex: number;
    isOneway: boolean;
  }) => {
    return (
      <BaggageItem
        {...data}
        onPress={args => {
          modalRef.current?.present(args);
        }}
      />
    );
  };

  const onPickDone = ({
    baggage,
    flightIndex,
    passengerIndex,
  }: {
    baggage: Ancillary;
    passengerIndex: number;
    flightIndex: number;
  }) =>
    setValue(`Passengers.${passengerIndex}.Baggages.${flightIndex}`, baggage);

  return (
    <Block>
      <ItemContainer
        renderServiceItem={renderItem}
        defaultClose={false}
        t18nTitle={t18nTitle}
        renderSegment={false}
        disabled={!isNotEmp}
        services={baggages}
        loading={isLoading}
        t18nEmpty="input_info_passenger:no_more_baggages"
      />
      <ModalBaggagePicker ref={modalRef} onDone={onPickDone} />
    </Block>
  );
};

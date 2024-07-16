import {
  selectBaggagesActionBooking,
  selectIsLoadingAncillariesActionBooking,
} from '@redux-selector';
import { Ancillary } from '@services/axios/axios-ibe';
import React, { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { AncillaryUpdateForm, ModalBaggagePickerRef } from '../type';
import { BaggageItem } from './baggage-item';
import { ItemContainer } from './item-container';
import { ModalBaggagePicker } from './modal-baggage-picker';

export const Baggages = () => {
  const { setValue } = useFormContext<AncillaryUpdateForm>();
  const modalRef = useRef<ModalBaggagePickerRef>(null);
  const baggages = useSelector(selectBaggagesActionBooking);
  const isLoading = useSelector(selectIsLoadingAncillariesActionBooking);

  const renderItem = (data: {
    passengerIndex: number;
    flightIndex: number;
    isOneway: boolean;
    isEmptyService: boolean;
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
    setValue(`passengers.${passengerIndex}.Baggages.${flightIndex}`, baggage, {
      shouldDirty: true,
    });

  return (
    <>
      <ItemContainer
        renderServiceItem={renderItem}
        t18nTitle="ancillary_update:add_baggages"
        renderSegment={false}
        services={baggages}
        loading={isLoading}
      />
      <ModalBaggagePicker ref={modalRef} onDone={onPickDone} />
    </>
  );
};

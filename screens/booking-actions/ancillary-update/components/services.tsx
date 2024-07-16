/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  selectIsLoadingAncillariesActionBooking,
  selectServicesActionBooking,
} from '@redux-selector';
import { Ancillary } from '@services/axios/axios-ibe';
import React, { useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { AncillaryUpdateForm, ModalServicePickerRef } from '../type';
import { ItemContainer } from './item-container';
import { ModalServicePicker } from './modal-service-picker';
import { ServiceItem } from './service-item';

export const Services = () => {
  const { setValue } = useFormContext<AncillaryUpdateForm>();
  const modalRef = useRef<ModalServicePickerRef>(null);
  const services = useSelector(selectServicesActionBooking);
  const isLoading = useSelector(selectIsLoadingAncillariesActionBooking);

  const renderItem = useCallback(
    (data: {
      passengerIndex: number;
      flightIndex: number;
      segmentIndex: number;
      isOneway: boolean;
      isEmptyService: boolean;
    }) => (
      <ServiceItem
        {...data}
        onPress={args => {
          modalRef.current?.present(args);
        }}
      />
    ),
    [],
  );

  const onPickDone = ({
    services: _services,
    flightIndex,
    passengerIndex,
    segmentIndex,
  }: {
    services: Array<Ancillary & { isInit?: boolean }>;
    passengerIndex: number;
    flightIndex: number;
    segmentIndex: number;
  }) =>
    // @ts-ignore
    setValue(
      `passengers.${passengerIndex}.Services.${flightIndex}.${segmentIndex}`,
      _services,
      { shouldDirty: true },
    );

  return (
    <>
      <ItemContainer
        // @ts-ignore
        renderServiceItem={renderItem}
        t18nTitle="ancillary_update:add_services"
        services={services}
        loading={isLoading}
      />
      <ModalServicePicker ref={modalRef} onDone={onPickDone} />
    </>
  );
};

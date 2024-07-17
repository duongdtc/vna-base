/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block } from '@vna-base/components';
import { selectIsLoadingAncillaries, selectServices } from '@redux-selector';
import { ModalServicePickerRef, PassengerForm } from '@vna-base/screens/flight/type';
import React, { useCallback, useMemo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Service } from '.';
import { ItemContainer } from './item-container';
import { ModalServicePicker } from './modal-service-picker';
import { ServiceItem } from './service-item';
import { Ancillary } from '@services/axios/axios-ibe';

export const Services = ({ t18nTitle }: Pick<Service, 't18nTitle'>) => {
  const { setValue } = useFormContext<PassengerForm>();
  const modalRef = useRef<ModalServicePickerRef>(null);
  const services = useSelector(selectServices);
  const isLoading = useSelector(selectIsLoadingAncillaries);

  const isNotEmp = useMemo(
    () => Object.values(services).some(service => service.length > 0),
    [services],
  );

  const renderItem = useCallback(
    (data: {
      passengerIndex: number;
      flightIndex: number;
      segmentIndex: number;
      isOneway: boolean;
    }) => {
      return (
        <ServiceItem
          {...data}
          onPress={args => {
            modalRef.current?.present(args);
          }}
        />
      );
    },
    [],
  );

  const onPickDone = ({
    services: _services,
    flightIndex,
    passengerIndex,
    segmentIndex,
  }: {
    services: Array<Ancillary>;
    passengerIndex: number;
    flightIndex: number;
    segmentIndex: number;
  }) =>
    setValue(
      `Passengers.${passengerIndex}.Services.${flightIndex}.${segmentIndex}`,
      _services,
    );

  return (
    <Block>
      <ItemContainer
        // @ts-ignore
        renderServiceItem={renderItem}
        t18nTitle={t18nTitle}
        defaultClose={true}
        disabled={!isNotEmp}
        services={services}
        loading={isLoading}
        t18nEmpty="input_info_passenger:no_more_services"
      />
      <ModalServicePicker ref={modalRef} onDone={onPickDone} />
    </Block>
  );
};
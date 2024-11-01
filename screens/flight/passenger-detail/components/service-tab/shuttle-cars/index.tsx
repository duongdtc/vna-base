import { images } from '@vna-base/assets/image';
import { Block } from '@vna-base/components';
import {
  PassengerForm,
  ShuttleCar,
  ShuttleCarPickerRef,
} from '@vna-base/screens/flight/type';
import React, { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Service } from '../index';
import { NewItemContainer } from './new-item-container';
import { ShuttleCarItem } from './shuttle-car-item';
import { ShuttleCarPicker } from './shuttle-car-picker';

export const ShuttleCarsFake: Array<ShuttleCar> = [
  {
    title: 'Vinfast VF E34',
    value: 'ONE',
    image: images.vf_dspwla,
    capacity: 5,
    description: '• 14.000 VND/km (Dự kiến)',
    price: 190_000,
  },
  {
    title: 'Mai Linh 7 chỗ',
    value: 'TWO',
    image: images.ml_clp07d,
    capacity: 7,
    description: '• 15.000 VND/km (Dự kiến)',
    price: 210_000,
  },
  {
    title: 'Vinasun 4 chỗ',
    value: 'THREE',
    image: images.vns_wy9lrh,
    capacity: 4,
    description: '• 16.000 VND/km (Dự kiến)',
    price: 350_000,
  },
];

export const ShuttleCars = ({
  t18nTitle,
  icon,
}: Pick<Service, 't18nTitle' | 'icon'>) => {
  const { setValue } = useFormContext<PassengerForm>();
  const modalRef = useRef<ShuttleCarPickerRef>(null);

  const renderItem = (data: { flightIndex: number; airportIdx: number }) => {
    return (
      <ShuttleCarItem
        {...data}
        onPress={args => {
          modalRef.current?.present(args);
        }}
      />
    );
  };

  const onCheckRound = ({
    round,
    flightIndex,
    airportIdx,
  }: {
    round: boolean;
    flightIndex: number;
    airportIdx: number;
  }) => {
    setValue(`ShuttleCars.${flightIndex}.${airportIdx}.round`, round);
  };

  const onPickDone = ({
    shuttleCar,
    flightIndex,
    airportIdx,
  }: {
    shuttleCar: ShuttleCar;
    flightIndex: number;
    airportIdx: number;
  }) => setValue(`ShuttleCars.${flightIndex}.${airportIdx}`, shuttleCar);

  return (
    <Block>
      <NewItemContainer
        renderEndpoint={true}
        renderServiceItem={renderItem}
        t18nTitle={t18nTitle}
        disabled={false}
        onCheckRound={onCheckRound}
        services={ShuttleCarsFake}
        loading={false}
        icon={icon}
        t18nEmpty="input_info_passenger:no_more_baggages"
      />
      <ShuttleCarPicker ref={modalRef} onDone={onPickDone} />
    </Block>
  );
};

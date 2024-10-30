import { Block } from '@vna-base/components';
import {
  PassengerForm,
  WaitingRoom,
  WaitingRoomPickerRef,
} from '@vna-base/screens/flight/type';
import React, { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Service } from '.';
import { NewItemContainer } from './new-item-container';
import { WaitingRoomItem } from './waiting-room-item';
import { WaitingRoomPicker } from './waiting-room-picker';
import { images } from '@vna-base/assets/image';

export const WaitingRoomsFake: Array<WaitingRoom> = [
  {
    img: images.Rectangle_34624148_t1xelq,
    price: 344_000,
    title: 'Phòng chờ nội địa',
    value: 'DO',
  },
  {
    img: images.Rectangle_34624147_tv33le,
    price: 638_000,
    title: 'Phòng chờ quốc tế',
    value: 'GL',
  },
];

export const WaitingRooms = ({
  t18nTitle,
  icon,
}: Pick<Service, 't18nTitle' | 'icon'>) => {
  const { setValue } = useFormContext<PassengerForm>();
  const modalRef = useRef<WaitingRoomPickerRef>(null);

  const renderItem = (data: { flightIndex: number }) => {
    return (
      <WaitingRoomItem
        {...data}
        onPress={args => {
          modalRef.current?.present(args);
        }}
      />
    );
  };

  const onPickDone = ({
    waitingRoom,
    flightIndex,
  }: {
    waitingRoom: WaitingRoom;
    flightIndex: number;
  }) => setValue(`WaitingRooms.${flightIndex}`, waitingRoom);

  return (
    <Block>
      <NewItemContainer
        renderEndpoint={false}
        renderServiceItem={renderItem}
        t18nTitle={t18nTitle}
        disabled={false}
        services={WaitingRoomsFake}
        loading={false}
        t18nEmpty="input_info_passenger:no_more_baggages"
        icon={icon}
      />
      <WaitingRoomPicker ref={modalRef} onDone={onPickDone} />
    </Block>
  );
};

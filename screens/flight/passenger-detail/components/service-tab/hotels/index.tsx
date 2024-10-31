import { navigate } from '@navigation/navigation-service';
import { APP_SCREEN } from '@utils';
import { Block } from '@vna-base/components';
import { PassengerForm } from '@vna-base/screens/flight/type';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Service } from '..';
import { HotelItem } from './hotel-item';
import { NewItemContainer } from './new-item-container';

export const Hotels = ({
  t18nTitle,
  icon,
}: Pick<Service, 't18nTitle' | 'icon'>) => {
  const { setValue } = useFormContext<PassengerForm>();

  const renderItem = (data: { flightIndex: number; airportIdx: number }) => {
    return (
      <HotelItem
        {...data}
        onPress={({ airportIdx, flightIndex, selected }) => {
          navigate(APP_SCREEN.LIST_HOTEL, {
            initData: selected,
            onDone: data => {
              setValue(`Hotels.${flightIndex}.${airportIdx}`, data, {
                shouldDirty: true,
              });
            },
          });
        }}
      />
    );
  };

  return (
    <Block>
      <NewItemContainer
        renderEndpoint={true}
        renderServiceItem={renderItem}
        t18nTitle={t18nTitle}
        disabled={false}
        icon={icon}
      />
    </Block>
  );
};

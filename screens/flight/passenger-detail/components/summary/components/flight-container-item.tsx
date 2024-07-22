/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block, Icon, Text } from '@vna-base/components';
import { LOGO_URL } from '@env';
import { selectLanguage } from '@vna-base/redux/selector';
import {
  FlightOfPassengerForm,
  PassengerForm,
} from '@vna-base/screens/flight/type';
import { Ancillary, Seat } from '@services/axios/axios-ibe';
import { AirlineRealm } from '@services/realm/models';
import { useRealm } from '@services/realm/provider';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useMemo } from 'react';
import {
  FieldArrayWithId,
  useFieldArray,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { FlatList, ListRenderItem } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';

export const FlightContainerItem = ({
  item,
  flightIndex,
  renderItem,
  typeService,
}: {
  item: FlightOfPassengerForm;
  flightIndex: number;
  renderItem: (data: {
    passengerIndex: number;
    flightIndex: number;
    segmentIndex?: number;
  }) => JSX.Element;
  typeService: 'PreSeats' | 'Baggages' | 'Services';
}) => {
  const lng = useSelector(selectLanguage);
  const { control } = useFormContext<PassengerForm>();
  const realm = useRealm();

  const airline = item.Airline
    ? realm.objectForPrimaryKey<AirlineRealm>(
        AirlineRealm.schema.name,
        item.Airline as string,
      )
    : undefined;

  const { fields } = useFieldArray({
    control,
    name: 'Passengers',
  });

  const arrayName = useMemo(() => {
    return fields?.map(
      (_, indx) => `Passengers.${indx}.${typeService}.${flightIndex}`,
    );
  }, [fields, flightIndex, typeService]);

  //@ts-ignore
  const allServices: Array<
    Ancillary | (Seat | null | undefined) | Array<Array<Ancillary>>
    //@ts-ignore
  > = useWatch({
    control,
    name: arrayName,
  });

  const isShow = useMemo(() => {
    if (typeService === 'Services') {
      return (
        (allServices as Array<Array<Ancillary[]>>).findIndex(
          ServicesOfFlight =>
            ServicesOfFlight?.findIndex(
              servicesOfSegment => !isEmpty(servicesOfSegment),
            ) !== -1,
        ) !== -1
      );
    }

    return allServices.findIndex(service => !isEmpty(service)) !== -1;
  }, [allServices, typeService]);

  const renderPassenger = useCallback<
    ListRenderItem<FieldArrayWithId<PassengerForm, 'Passengers', 'id'>>
  >(
    ({ index }: { index: number }) =>
      renderItem({
        passengerIndex: index,
        flightIndex,
      }),
    [flightIndex, renderItem],
  );

  if (!isShow) {
    return null;
  }

  return (
    <Block
      borderRadius={8}
      colorTheme="neutral100"
      overflow="hidden"
      padding={16}>
      <Block
        flexDirection="row"
        colorTheme="neutral100"
        alignItems="center"
        justifyContent="space-between">
        <Block flexDirection="row" columnGap={4} alignItems="center">
          <Block borderRadius={4} overflow="hidden">
            <Block width={20} height={20} borderRadius={4} overflow="hidden">
              <SvgUri
                width={20}
                height={20}
                uri={LOGO_URL + item.Airline + '.svg'}
              />
            </Block>
          </Block>
          <Text
            text={lng === 'en' ? airline?.NameEn : airline?.NameVi}
            fontStyle="Body12Reg"
            colorTheme="neutral100"
          />
        </Block>
        <Block
          columnGap={2}
          flexDirection="row"
          alignItems="center"
          borderRadius={4}>
          <Text
            text={item.StartPoint as string}
            fontStyle="Body12Bold"
            colorTheme="primaryColor"
          />
          <Icon icon="arrow_right_fill" size={12} colorTheme="primaryColor" />
          <Text
            text={item.EndPoint as string}
            fontStyle="Body12Bold"
            colorTheme="primaryColor"
          />
        </Block>
      </Block>
      <FlatList
        scrollEnabled={false}
        data={fields}
        keyExtractor={i => i.id}
        renderItem={renderPassenger}
      />
    </Block>
  );
};

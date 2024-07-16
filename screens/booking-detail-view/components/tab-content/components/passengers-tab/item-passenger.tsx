import { Block, Separator, Text } from '@vna-base/components';
import { Passenger } from '@services/axios/axios-data';
import { I18nKeys } from '@translations/locales';
import { translate } from '@vna-base/translations/translate';
import {
  Gender,
  GenderTypeDetails,
  PassengerType,
  PassengerTypeDetails,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React from 'react';
import { ItemCollapseContent } from './item-collapse-content';

type Props = {
  item: Passenger;
};

export const ItemPassenger = ({ item }: Props) => {
  return (
    <ItemCollapseContent item={item}>
      <ItemContainer
        t18n="booking:passenger_type"
        value={`${translate(
          PassengerTypeDetails[item.PaxType as PassengerType].t18n,
        )} - ${PassengerTypeDetails[item.PaxType as PassengerType].key}`}
      />

      <ItemContainer
        t18n="booking:gender"
        value={translate(GenderTypeDetails[item.Gender as Gender].t18n)}
      />

      <ItemContainer t18n="booking:surname" value={item.Surname} />

      <ItemContainer t18n="booking:given_name" value={item.GivenName} />

      <ItemContainer
        t18n="booking:dob"
        value={
          item.BirthDate ? dayjs(item.BirthDate).format('DD/MM/YYYY') : null
        }
      />

      <ItemContainer t18n="booking:membership_card" value={item.Membership} />

      <ItemContainer t18n="booking:document_number" value={item.DocumentNumb} />

      <ItemContainer
        t18n="booking:expiration_date"
        value={
          item?.DocumentExpiry
            ? dayjs(item.DocumentExpiry).format('DD/MM/YYYY')
            : null
        }
      />

      <ItemContainer t18n="booking:nationality" value={item.Nationality} />

      <ItemContainer t18n="booking:place_of_issue" value={item.IssueCountry} />
    </ItemCollapseContent>
  );
};

const ItemContainer = ({
  t18n,
  value,
}: {
  t18n: I18nKeys;
  value: string | null | undefined;
}) => {
  return (
    <>
      <Separator type="horizontal" size={3} />
      <Block
        flexDirection="row"
        alignItems="center"
        paddingVertical={20}
        paddingRight={12}
        paddingLeft={16}
        columnGap={4}
        justifyContent="space-between">
        <Text t18n={t18n} fontStyle="Body16Reg" colorTheme="neutral900" />

        <Block flex={1} alignItems="flex-end">
          <Text
            text={value ?? '----'}
            fontStyle="Body16Reg"
            colorTheme="neutral700"
          />
        </Block>
      </Block>
    </>
  );
};

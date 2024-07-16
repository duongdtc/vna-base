/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block, CheckBox, Icon, Text, RadioButton } from '@vna-base/components';
import { LOGO_URL } from '@env';
import { selectCustomFeeTotal } from '@redux-selector';
import { AirlineRealm } from '@services/realm/models';
import { useObject } from '@services/realm/provider';
import { useTheme } from '@theme';
import { ActiveOpacity, HitSlop } from '@vna-base/utils';
import React from 'react';
import { FieldPath, useController } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { Flight, FlightChangeForm } from '../../type';
import { useStyles } from './styles';
import dayjs from 'dayjs';

type Props = {
  index: number;
  // onPressItem: (item: Flight, index: number) => void;
  onPressSecondOption: (index: number, item: Flight) => void;
  name: FieldPath<FlightChangeForm>;
  /**
   * @default false
   */
  isOld?: boolean;
  useRadioButton?: boolean;
};

export const FlightItem = ({
  // onPressItem,
  index,
  name,
  onPressSecondOption,
  useRadioButton,
  isOld = false,
}: Props) => {
  const styles = useStyles();
  const { colors } = useTheme();
  const { TotalFare } = useSelector(selectCustomFeeTotal);

  const {
    //@ts-ignore
    field: { value },
  } = useController<FlightChangeForm>({ name });

  const airline = useObject<AirlineRealm>(
    AirlineRealm.schema.name,
    value.Airline as string,
  );

  // const _onPressItem = () => {
  //   onPressItem(value as Flight, index);
  // };

  const _onPressSecondOption = () => {
    onPressSecondOption(index, value as Flight);
  };

  return (
    <Block
      // activeOpacity={ActiveOpacity}
      // onPress={_onPressItem}
      style={[
        styles.container,
        { borderColor: isOld ? colors.error600 : colors.success600 },
      ]}>
      <Block flex={1} rowGap={8}>
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          <Block width={20} height={20} borderRadius={4} overflow="hidden">
            <SvgUri
              width={20}
              height={20}
              uri={LOGO_URL + (value?.Airline ?? '') + '.svg'}
            />
          </Block>
          <Text
            text={airline?.NameVi ?? airline?.NameEn}
            fontStyle="Body12Reg"
            colorTheme="neutral900"
          />
          <Block width={1} height={10} colorTheme="neutral400" />
          <Block
            flexDirection="row"
            alignItems="center"
            paddingVertical={2}
            columnGap={2}>
            <Text
              fontStyle="Body14Semi"
              text={value.StartPoint as string}
              colorTheme="neutral900"
            />
            <Icon icon="arrow_right_fill" size={12} colorTheme="neutral900" />
            <Text
              fontStyle="Body14Semi"
              text={value.EndPoint as string}
              colorTheme="neutral900"
            />
          </Block>
          {/* <Icon icon="info_outline" size={16} colorTheme="primary600" /> */}
        </Block>
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          <Text
            fontStyle="Body12Bold"
            colorTheme={isOld ? 'error500' : 'success500'}
            text={dayjs(value.StartDate).format('DD/MM/YYYY')}
          />
          <Block width={0.5} height={10} colorTheme="neutral400" />
          <Text
            fontStyle="Body12Med"
            colorTheme="neutral900"
            text={dayjs(value.StartDate).format('HH:mm')}
          />
          <Text fontStyle="Body12Med" colorTheme="neutral900" text="-" />
          <Text
            fontStyle="Body12Med"
            colorTheme="neutral900"
            text={dayjs(value.EndDate).format('HH:mm')}
          />
          <Block flexDirection="row" alignItems="center" columnGap={4}>
            <Block width={0.5} height={10} colorTheme="neutral400" />
            <Text
              fontStyle="Body12Bold"
              colorTheme="price"
              text={(value.FareOption.TotalFare! + TotalFare).currencyFormat()}
            />
            <Text fontStyle="Body12Med" colorTheme="neutral900" text={'VND'} />
          </Block>
        </Block>
      </Block>

      <TouchableOpacity
        hitSlop={HitSlop.Large}
        activeOpacity={ActiveOpacity}
        style={{ justifyContent: 'flex-end' }}
        onPress={_onPressSecondOption}>
        {isOld ? (
          <Block flexDirection="row" alignItems="center" columnGap={4}>
            <Text
              t18n="common:cancel"
              fontStyle="Body12Reg"
              colorTheme="neutral800"
            />
            {useRadioButton ? (
              <RadioButton
                disable
                sizeDot={14}
                opacity={1}
                value={value.isSelected}
              />
            ) : (
              <CheckBox
                disable
                checkedColorTheme="error500"
                value={value.isSelected}
                style={{ paddingVertical: 0 }}
              />
            )}
          </Block>
        ) : (
          <Text
            t18n="common:reselect"
            fontStyle="Body14Semi"
            colorTheme="success500"
          />
        )}
      </TouchableOpacity>
    </Block>
  );
};

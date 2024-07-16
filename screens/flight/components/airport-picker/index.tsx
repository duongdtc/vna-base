/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Icon, Text, TouchableScale } from '@vna-base/components';
import {
  AirportFlight,
  AirportPickerProps,
  SearchForm,
} from '@vna-base/screens/flight/type';
import { createStyleSheet, useStyles, bs } from '@theme';
import { I18nKeys } from '@translations/locales';
import { ActiveOpacity, HitSlop, scale } from '@vna-base/utils';
import React, { memo, useCallback, useContext } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext, useWatch } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { AirportPickerContext } from '../modal-airport-picker';

export const AirportPicker = memo(({ style, index }: AirportPickerProps) => {
  const { styles } = useStyles(styleSheet);
  const { showModalAirportPicker } = useContext(AirportPickerContext);
  const { control, setValue, getValues } = useFormContext<SearchForm>();

  const airportFlight = useWatch({
    control,
    name: `Flights.${index}.airport`,
  });

  const _reverseValue = useCallback(() => {
    setValue(`Flights.${index}.airport`, {
      takeOff: airportFlight.landing,
      landing: airportFlight.takeOff,
    });
  }, [airportFlight.landing, airportFlight.takeOff, index, setValue]);

  const onPressBtnDestination = (t18nTitle: I18nKeys) => {
    showModalAirportPicker({
      t18nTitle,
      dataItemIgnore:
        t18nTitle === 'flight:choose_departure'
          ? undefined
          : airportFlight.takeOff,
      onSubmit: airport => {
        const newVal = {
          ...airportFlight,
          [t18nTitle === 'flight:choose_departure' ? 'takeOff' : 'landing']: {
            NameVi: airport.NameVi,
            Code: airport.Code,
            CityNameVi: airport.City.NameVi,
            CityNameEn: airport.City.NameEn,
            CountryNameVi: airport.Country.NameVi,
            CountryNameEn: airport.Country.NameEn,
            CountryCode: airport.Country.Code,
          },
        } as AirportFlight;

        // nếu takeoff và landing cùng 1 sân bay thì set landing thành undefined
        if (newVal.takeOff?.Code === newVal.landing?.Code) {
          newVal.landing = undefined;
        }

        //@ts-ignore
        setValue(`Flights.${index}.airport`, newVal);

        // nếu chặng tiếp theo có takeoff là undefined
        // thì set takeoff đó có giá trị là landing của chặng này
        const flights = getValues().Flights;
        if (flights.length > index + 1 && !flights[index + 1].airport.takeOff) {
          //@ts-ignore
          setValue(`Flights.${index + 1}.airport`, {
            takeOff: newVal.landing,
            landing: undefined,
          });
        }
      },
    });
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[bs.flexDirectionRow, bs.columnGap_16, bs.justifyCenter]}>
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => {
            onPressBtnDestination('flight:choose_departure');
          }}
          style={styles.btnDestination}>
          <View style={[styles.circleAbsolute, styles.circleAbsoluteLeft]} />
          {airportFlight.takeOff ? (
            <View style={bs.rowGap_4}>
              <Text
                t18n="flight:departure"
                colorTheme="neutral70"
                fontStyle="Body12Med"
              />
              <Text
                text={airportFlight.takeOff.Code}
                colorTheme="neutral100"
                fontStyle="H320Semi"
              />
              <Text
                text={`${airportFlight.takeOff.CityNameVi}, ${airportFlight.takeOff.CountryNameVi}`}
                colorTheme="neutral80"
                numberOfLines={1}
                ellipsizeMode="middle"
                fontStyle="Body12Med"
              />
            </View>
          ) : (
            <View
              style={[bs.flexDirectionRow, bs.columnGap_12, bs.alignCenter]}>
              <Icon icon="plane_up_fill" colorTheme="primaryColor" size={24} />
              <Text
                t18n="flight:departure"
                fontStyle="H320Semi"
                colorTheme="neutral70"
              />
            </View>
          )}
          {airportFlight.takeOff && (
            <View style={styles.icPlaneUp} pointerEvents="none">
              <Icon icon="plane_up_fill" colorTheme="primaryColor" size={36} />
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          onPress={() => {
            onPressBtnDestination('flight:choose_destination');
          }}
          style={styles.btnDestination}>
          <View style={[styles.circleAbsolute, styles.circleAbsoluteRight]} />
          {airportFlight.landing && (
            <View style={styles.icPlaneDown} pointerEvents="none">
              <Icon
                icon="plane_down_fill"
                colorTheme="primaryColor"
                size={36}
              />
            </View>
          )}
          {airportFlight.landing ? (
            <View style={bs.rowGap_4}>
              <Text
                t18n="flight:destination"
                colorTheme="neutral70"
                fontStyle="Body12Med"
              />
              <Text
                text={airportFlight.landing.Code}
                colorTheme="neutral100"
                fontStyle="H320Semi"
              />
              <Text
                text={`${airportFlight.landing.CityNameVi}, ${airportFlight.landing.CountryNameVi}`}
                numberOfLines={1}
                ellipsizeMode="middle"
                colorTheme="neutral80"
                fontStyle="Body12Med"
              />
            </View>
          ) : (
            <View
              style={[bs.flexDirectionRow, bs.columnGap_12, bs.alignCenter]}>
              <Icon
                icon="plane_down_fill"
                colorTheme="primaryColor"
                size={24}
              />
              <Text
                t18n="flight:destination"
                fontStyle="H320Semi"
                colorTheme="neutral70"
              />
            </View>
          )}
        </TouchableOpacity>
        <TouchableScale
          hitSlop={HitSlop.Large}
          minScale={0.9}
          activeOpacity={1}
          style={styles.btnSwap}
          disabled={!(airportFlight.landing && airportFlight.takeOff)}
          onPress={_reverseValue}>
          <Icon icon="swap_fill" colorTheme="primaryColor" size={24} />
        </TouchableScale>
      </View>
    </View>
  );
}, isEqual);

const styleSheet = createStyleSheet(({ colors, borders }) => ({
  container: {
    justifyContent: 'center',
  },
  btnDestination: {
    flex: 1,
    height: scale(88),
    borderRadius: scale(8),
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderColor: colors.neutral40,
    backgroundColor: colors.neutral10,
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: borders[5],
  },
  btnSwap: {
    position: 'absolute',
    borderRadius: 50,
    padding: scale(6),
    borderColor: colors.neutral40,
    backgroundColor: colors.neutral10,
    alignSelf: 'center',
  },
  circleAbsolute: {
    position: 'absolute',
    borderRadius: scale(50),
    width: scale(36),
    height: scale(36),
    backgroundColor: colors.neutral40,
  },
  circleAbsoluteLeft: {
    right: scale(-26),
  },
  circleAbsoluteRight: {
    left: scale(-26),
  },
  icPlaneUp: {
    position: 'absolute',
    right: 4,
    bottom: -2,
    opacity: 0.08,
  },
  icPlaneDown: {
    position: 'absolute',
    right: 4,
    bottom: -2,
    opacity: 0.08,
  },
}));

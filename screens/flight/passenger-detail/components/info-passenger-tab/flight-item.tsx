/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LOGO_URL } from '@env';
import { navigate } from '@navigation/navigation-service';
import { FlightFare } from '@services/axios/axios-ibe';
import { AirlineRealm } from '@services/realm/models';
import { useRealm } from '@services/realm/provider';
import { bs, useStyles } from '@theme';
import { APP_SCREEN } from '@utils';
import { Block, Button, Icon, Separator, Text } from '@vna-base/components';
import {
  ActiveOpacity,
  HitSlop,
  convertMin2Hour,
  scale,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Line, Svg, SvgUri } from 'react-native-svg';

type Props = {
  index: number;
  item: FlightFare;
  onPressItem: (item: FlightFare, index: number) => void;
  saveForm: () => void;
};

const SingleFlightItem = ({
  item,
  index,
  onPressItem,
  saveForm,
}: Omit<Props, 'onPressItem'> & { onPressItem: () => void }) => {
  const {
    theme: { colors },
  } = useStyles();

  const reselect = () => {
    saveForm();
    navigate(APP_SCREEN.RESULT_SEARCH_FLIGHT, {
      selectedIndex: index,
    });
  };

  const stopPoints = item.ListFlight![0].ListSegment?.flatMap(segment => {
    return segment.StopPoint ? [segment.StopPoint] : [];
  });

  return (
    <TouchableOpacity
      activeOpacity={ActiveOpacity}
      onPress={onPressItem}
      style={styles.singleContainer}>
      {/* xuất phát */}
      <View>
        <Text
          text={dayjs(item.ListFlight![0].StartDate).format('HH:mm')}
          fontStyle="H320Bold"
          colorTheme="primaryColor"
        />
        <Text
          text={item.ListFlight![0].StartPoint}
          fontStyle="Body14Med"
          colorTheme="neutral70"
        />
      </View>

      {/* Hành trình */}
      <View style={[bs.flex]}>
        <Block
          flexDirection="row"
          alignItems="center"
          columnGap={4}
          justifyContent="center">
          <Text
            textAlign="center"
            text={convertMin2Hour(Number(item.ListFlight![0].Duration))}
            fontStyle="Body12Med"
            colorTheme="neutral70"
          />
          <Icon icon="alert_circle_outline" size={12} colorTheme="neutral80" />
        </Block>
        <View style={{ width: '100%', paddingVertical: 4 }}>
          <Svg height={16} style={{ width: '100%' }}>
            <Line
              key={Math.random()}
              x1={0}
              y1={7.5}
              x2={1000}
              y2={7.5}
              stroke={colors.neutral50}
              strokeDasharray="10, 4"
              strokeWidth={1}
            />
          </Svg>
        </View>
        <View
          style={[
            bs.flexDirectionRow,
            bs.columnGap_6,
            {
              justifyContent: 'space-around',
            },
          ]}>
          {stopPoints?.length !== 0 ? (
            stopPoints?.map((ap, idx) => (
              <Text
                key={idx}
                text={ap}
                fontStyle="Body12Reg"
                colorTheme="neutral80"
              />
            ))
          ) : (
            <Text
              t18n="flight:direct_flight"
              fontStyle="Body12Med"
              colorTheme="neutral100"
            />
          )}
        </View>
      </View>
      {/* đến */}
      <View style={{ alignItems: 'flex-end' }}>
        <Text
          text={dayjs(item.ListFlight![0].EndDate).format('HH:mm')}
          fontStyle="H320Bold"
          colorTheme="primaryColor"
        />
        <Text
          text={item.ListFlight![0].EndPoint!}
          fontStyle="Body14Med"
          colorTheme="neutral70"
        />
      </View>
      <Block justifyContent="space-between" alignItems="flex-end" rowGap={10}>
        <Text fontStyle="Body12Reg" colorTheme="neutral80">
          Hạng chỗ:{' '}
          <Text
            fontStyle="Body12Bold"
            colorTheme="neutral100"
            text={item.FareInfo?.FareClass}
          />
        </Text>
        <Button
          onPress={reselect}
          leftIcon="refresh_fill"
          leftIconSize={20}
          textColorTheme="successColor"
          text="Chọn lại"
          padding={0}
          hitSlop={HitSlop.Medium}
        />
      </Block>
    </TouchableOpacity>
  );
};

const MultiFlightItem = ({
  item,
  onPressItem,
  saveForm,
}: Pick<Props, 'item' | 'saveForm'> & { onPressItem: () => void }) => {
  const realm = useRealm();

  const reselect = () => {
    saveForm();
    navigate(APP_SCREEN.RESULT_SEARCH_FLIGHT);
  };

  return (
    <TouchableOpacity activeOpacity={ActiveOpacity} onPress={onPressItem}>
      {item.ListFlight?.map((fl, idx) => {
        const airline = realm.objectForPrimaryKey<AirlineRealm>(
          AirlineRealm.schema.name,
          fl.Airline as string,
        );
        const days = dayjs(fl.EndDate)
          .startOf('day')
          .diff(dayjs(fl.StartDate).startOf('day'), 'day');

        const stopPoints = fl.ListSegment?.flatMap(segment => {
          return segment.StopPoint ? [segment.StopPoint] : [];
        });

        return (
          <Block key={idx}>
            <Block
              style={styles.singleContainer}
              flexDirection="row"
              alignItems="center"
              columnGap={8}
              flex={1}>
              <Block width={36} height={36} borderRadius={8} overflow="hidden">
                <SvgUri
                  width={36}
                  height={36}
                  uri={LOGO_URL + fl.Airline + '.svg'}
                />
              </Block>
              <Block rowGap={4} flex={1}>
                <Block>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    text={airline?.NameVi ?? airline?.NameEn ?? ''}
                    fontStyle="Body14Reg"
                    colorTheme="neutral100"
                  />
                </Block>
                <Text
                  text={dayjs(fl.StartDate).format('DD/MM/YYYY')}
                  fontStyle="Body12Reg"
                  colorTheme="neutral100"
                />
              </Block>
              <Block flexDirection="row" columnGap={4} alignItems="center">
                <Block rowGap={4} alignItems="center">
                  <Text
                    text={dayjs(fl.StartDate).format('HH:mm')}
                    fontStyle="Body16Semi"
                    colorTheme="primaryColor"
                  />
                  <Block
                    width={47}
                    paddingVertical={2}
                    colorTheme="neutral50"
                    borderRadius={4}
                    alignItems="center">
                    <Text
                      fontStyle="Body12Reg"
                      colorTheme="neutral100"
                      text={fl.StartPoint!}
                    />
                  </Block>
                </Block>

                <Block rowGap={6} alignItems="center" width={60}>
                  <Text
                    text={convertMin2Hour(Number(fl.Duration))}
                    colorTheme="neutral80"
                    fontStyle="Body12Reg"
                  />

                  <Block
                    height={1}
                    width={'100%'}
                    colorTheme="neutral40"
                    flexDirection="row"
                    justifyContent="space-around"
                    alignItems="center">
                    {stopPoints?.map((_, idx) => (
                      <Block
                        key={idx}
                        width={6}
                        height={6}
                        borderRadius={4}
                        colorTheme="neutral40"
                      />
                    ))}
                  </Block>
                  <Block
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-around">
                    {stopPoints?.length === 0 ? (
                      <Text
                        t18n="flight:direct_flight"
                        colorTheme="neutral80"
                        fontStyle="Body12Reg"
                      />
                    ) : (
                      stopPoints?.map((stp, idx) => (
                        <Text
                          key={idx}
                          text={stp}
                          colorTheme="neutral80"
                          fontStyle="Body12Reg"
                        />
                      ))
                    )}
                  </Block>
                </Block>

                <Block rowGap={4} alignItems="center">
                  <Block>
                    <Text
                      text={dayjs(fl.EndDate).format('HH:mm')}
                      fontStyle="Body16Semi"
                      colorTheme="primaryColor"
                    />
                    {days !== 0 && (
                      <Block position="absolute" style={{ top: -2, right: -8 }}>
                        <Text
                          text={`+${days}`}
                          fontStyle="Body10Med"
                          colorTheme="price"
                        />
                      </Block>
                    )}
                  </Block>
                  <Block
                    width={47}
                    paddingVertical={2}
                    colorTheme="neutral50"
                    borderRadius={4}
                    alignItems="center">
                    <Text
                      fontStyle="Body12Reg"
                      colorTheme="neutral100"
                      text={fl.EndPoint!}
                    />
                  </Block>
                </Block>
              </Block>
            </Block>
            <Separator
              style={{
                width: '100%',
              }}
              // paddingHorizontal={12}
              type="horizontal"
              colorTheme="neutral20"
            />
          </Block>
        );
      })}
      <Block
        flexDirection="row"
        alignItems="center"
        paddingVertical={12}
        justifyContent="space-between"
        paddingHorizontal={12}>
        <Block
          paddingHorizontal={6}
          paddingVertical={2}
          borderRadius={2}
          colorTheme={'VN'}>
          <Text
            text={item.System ?? ''}
            colorTheme="white"
            fontStyle="Body10Semi"
          />
        </Block>
        <TouchableOpacity
          onPress={reselect}
          activeOpacity={ActiveOpacity}
          hitSlop={HitSlop.Large}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 4,
          }}>
          <Icon icon="refresh_fill" size={20} colorTheme="successColor" />
          <Text
            t18n="common:reselect"
            colorTheme="successColor"
            fontStyle="Body14Semi"
          />
        </TouchableOpacity>
      </Block>
    </TouchableOpacity>
  );
};

export const FlightItem = ({ item, onPressItem, index, saveForm }: Props) => {
  const _onPressItem = () => {
    onPressItem(item, index);
  };

  // multi flight
  if ((item.Itinerary ?? 1) > 1) {
    return (
      <MultiFlightItem
        item={item}
        onPressItem={_onPressItem}
        saveForm={saveForm}
      />
    );
  }

  // single flight
  return (
    <SingleFlightItem
      item={item}
      index={index}
      onPressItem={_onPressItem}
      saveForm={saveForm}
    />
  );
};

const styles = StyleSheet.create({
  singleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scale(12),
    padding: scale(12),
  },
});

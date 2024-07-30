/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Block,
  Button,
  LazyPlaceholder,
  NormalHeader,
  Screen,
  Text,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  selectIsLoadingSeatMaps,
  selectIsLoadingSeatMapsActionBooking,
  selectSeatMaps,
  selectSeatMapsActionBooking,
} from '@vna-base/redux/selector';
import { Seat } from '@services/axios/axios-ibe';
import {
  FlashList,
  ListRenderItem as ListRenderItemFlashList,
} from '@shopify/flash-list';
import { useTheme } from '@theme';
import { WindowWidth } from '@vna-base/utils';
import { APP_SCREEN, RootStackParamList } from '@utils';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FlatList, ListRenderItem, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { MappedCabin, Passenger as PassengerType, SeatType } from '../type';
import {
  HeaderInfoFlightWithPrice,
  Passenger,
  Seat as SeatItem,
} from './components';
import { useStyles } from './styles';
import isEmpty from 'lodash.isempty';
import { SubmitBtn } from '@screens/flight/select-seat/components/submit-btn';

export const SelectSeat = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.SELECT_SEAT>) => {
  const {
    flightIndex,
    initData,
    initPassengerIndex,
    segment,
    onSubmit,
    passengers,
    isSelectForActionBooking,
  } = route.params;

  const { colors } = useTheme();
  const styles = useStyles();

  const selectingPassengerRef = useRef<number | null>(initPassengerIndex);

  const seatMaps = useSelector(selectSeatMaps);

  const seatMapActionBooking = useSelector(selectSeatMapsActionBooking);

  const isLoadingSeatMapActionBooking = useSelector(
    selectIsLoadingSeatMapsActionBooking,
  );

  const isLoadingSeatMaps = useSelector(selectIsLoadingSeatMaps);

  const [seats, setSeats] = useState<
    Array<
      | (Seat & {
          isInit?: boolean | undefined;
        })
      | null
      | undefined
    >
  >(initData ?? []);

  const [selectingPassenger, setSelectingPassengerState] = useState<
    number | null
  >(initPassengerIndex);

  const _seatMaps = useMemo(
    () => (isSelectForActionBooking ? seatMapActionBooking : seatMaps),
    [isSelectForActionBooking, seatMapActionBooking, seatMaps],
  );

  const setSelectingPassenger = useCallback((idx: number | null) => {
    setSelectingPassengerState(idx);
    selectingPassengerRef.current = idx;
  }, []);

  useEffect(() => {
    const unMount = async () => {
      await FastImage.clearMemoryCache();
      await FastImage.clearDiskCache();
    };

    return () => {
      unMount();
    };
  }, []);

  // const totalPrice = useMemo<number>(
  //   () => seats.reduce((total, curr) => total + (curr?.Price ?? 0), 0),
  //   [seats],
  // );

  const onSelectSeat = (seat: Seat | null, passengerIndex?: number) => {
    setSeats(pre => {
      const temp = [...pre];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      temp[passengerIndex ?? selectingPassengerRef.current] = seat;

      if (passengerIndex !== undefined) {
        setSelectingPassenger(passengerIndex);
      } else {
        const nonSelectIndex = temp.findIndex(s => !s);
        if (nonSelectIndex !== -1) {
          setSelectingPassenger(nonSelectIndex);
        } else if (passengers.length > 1) {
          setSelectingPassenger(null);
        }
      }

      return temp;
    });
  };

  const renderPassenger = useCallback<ListRenderItem<PassengerType>>(
    ({ item, index }) => {
      const selecting = index === selectingPassenger;
      const selectedSeat = seats[index];
      return (
        <Passenger
          fullName={item.FullName}
          selecting={selecting}
          selectedSeat={selectedSeat}
          index={index}
          setSelectingPassenger={setSelectingPassenger}
        />
      );
    },
    [seats, selectingPassenger],
  );

  const renderSeat = useCallback<
    ListRenderItemFlashList<Seat & { SeatType: SeatType }>
  >(
    ({ item }) => {
      /**
       * neeus ghế này đã được chọn thì selectedIndex !==-1
       * biến này cho thấy index của ghế đó ứng với người nào
       */
      const selectedIndex =
        item.SeatType !== SeatType.S
          ? -1
          : seats.findIndex(seat => seat?.SeatNumber === item.SeatNumber);

      const disable = selectingPassenger === null && selectedIndex === -1;
      const isSelectForCurrentPassenger = selectedIndex === selectingPassenger;

      return (
        <SeatItem
          item={item}
          selectedIndex={selectedIndex}
          styles={styles}
          disable={disable}
          isSelectForCurrentPassenger={isSelectForCurrentPassenger}
          onSelectSeat={onSelectSeat}
        />
      );
    },
    [seats, selectingPassenger, styles],
  );

  const listCabin = useMemo(() => {
    const seatMapTemp = _seatMaps[flightIndex.toString()]?.[segment.index];

    if (!seatMapTemp) {
      return [];
    }

    const result: Array<MappedCabin> = [];

    seatMapTemp.ListCabin?.forEach((cabin, index) => {
      result.push({
        CabinClass: cabin.CabinClass,
        ClassLocation: cabin.ClassLocation,
        FirstRow: cabin.FirstRow,
        LastRow: cabin.LastRow,
        Wing: cabin.Wing,
        NumColumns: cabin.ListColumn?.length ?? 0,
        ListSeat: [],
      });

      // thêm cửa sổ trái ở hàng hàng tên cột
      // result[index].ListSeat.push({ SeatType: SeatType.WN });

      cabin.ListColumn?.forEach(cl => {
        result[index].ListSeat.push({
          SeatType: cl.ColumnType === 'column' ? SeatType.CLN : SeatType.N,
          ...cl,
        });
      });

      // thêm cửa sổ phải ở hàng hàng tên cột
      // result[index].ListSeat.push({ SeatType: SeatType.WN });

      cabin.ListRow?.forEach(row => {
        // thêm cửa sổ trái
        // result[index].ListSeat.push({ SeatType: SeatType.WL });

        row.ListSeat?.forEach(seat => {
          const Enabled =
            (!isEmpty(initData) &&
              initData.findIndex(
                s => s?.SeatNumber === seat.SeatNumber && s?.isInit,
              ) !== -1) ||
            seat.Enabled;

          result[index].ListSeat.push({
            ...seat,
            RowNumber: row.RowNumber,
            Enabled,
            SeatType: seat.SeatType === 'aisle' ? SeatType.A : SeatType.S,
            Session: seatMapTemp.Session,
          });
        });

        // thêm cửa sổ phải
        // result[index].ListSeat.push({ SeatType: SeatType.WR });
      });
    });

    return result;
  }, [_seatMaps, flightIndex, initData, segment.index]);

  const paddingLefts = useMemo(
    () =>
      listCabin.map(cabin =>
        Math.floor((WindowWidth - cabin.NumColumns * 32) / 2),
      ),
    [listCabin],
  );

  return (
    <Screen unsafe backgroundColor={colors.neutral100}>
      <NormalHeader
        leftContent={
          <Button
            leftIcon="arrow_ios_left_outline"
            leftIconSize={24}
            textColorTheme="neutral900"
            onPress={() => {
              goBack();
              onSubmit(seats);
            }}
          />
        }
        centerContent={
          <Text
            fontStyle="Title20Semi"
            t18n="choose_services:choose_seat"
            colorTheme="neutral900"
          />
        }
      />
      <Block
        flex={1}
        colorTheme="neutral50"
        borderTopWidth={5}
        borderColorTheme="neutral50">
        <Block shadow=".3" colorTheme="neutral100" height={108} zIndex={1}>
          <HeaderInfoFlightWithPrice segment={segment} />
          <FlatList
            horizontal
            style={{ overflow: 'visible' }}
            showsHorizontalScrollIndicator={false}
            data={passengers}
            ItemSeparatorComponent={() => <Block width={12} />}
            contentContainerStyle={styles.contentContainer}
            renderItem={renderPassenger}
          />
        </Block>

        {isLoadingSeatMapActionBooking || isLoadingSeatMaps ? (
          <LazyPlaceholder flex={1} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {listCabin.map((cabin, index) => (
              <FlashList
                extraData={[selectingPassenger, seats]}
                bouncesZoom={true}
                maximumZoomScale={2}
                minimumZoomScale={1}
                key={index}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <Block height={4} />}
                numColumns={cabin.NumColumns}
                data={cabin.ListSeat}
                estimatedItemSize={28}
                renderItem={renderSeat}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  ...styles.contentContainerListSeat,
                  paddingLeft: paddingLefts[index] + 2,
                  paddingRight: paddingLefts[index] - 2,
                }}
              />
            ))}
          </ScrollView>
        )}

        <Block
          flexDirection="row"
          alignItems="center"
          colorTheme="neutral100"
          shadow="main"
          style={styles.footerContainer}>
          <SubmitBtn
            onPress={() => {
              goBack();
              onSubmit(seats);
            }}
          />
        </Block>
      </Block>
    </Screen>
  );
};

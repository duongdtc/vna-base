import {
  ActionSheet,
  Block,
  Button,
  Icon,
  NormalHeader,
  Text,
} from '@vna-base/components';
import { OptionData } from '@vna-base/components/action-sheet/type';
import { goBack } from '@navigation/navigation-service';
import { FormBookingDetail } from '@vna-base/screens/booking-detail/type';
import { AirlineRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { HitSlop, System, SystemDetails } from '@vna-base/utils';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { Controller, useFormContext, useFormState } from 'react-hook-form';

type Props = {
  info: {
    id: string | undefined | null;
    system: System | undefined | null;
    airline: string | undefined | null;
  };
  onPressHistory: () => void;
};

const options: Array<OptionData> = [
  {
    t18n: 'booking:view_history',
    key: 'VIEW_HISTORY',
    icon: 'history_outline',
  },
  // {
  //   t18n: 'booking:delete_booking',
  //   key: 'DELETE',
  //   icon: 'trash_2_fill',
  // },
];

export const HeaderBookingOrderDetail = memo(
  ({ info, onPressHistory }: Props) => {
    const { control } = useFormContext<FormBookingDetail>();
    const actionSheetRefs = useRef<ActionSheet>(null);

    const airline = useMemo(
      () =>
        info.airline
          ? realmRef.current?.objectForPrimaryKey<AirlineRealm>(
              AirlineRealm.schema.name,
              info.airline,
            )?.NameEn
          : '',
      [info],
    );

    const { isDirty } = useFormState<FormBookingDetail>({ control });

    const _save = useCallback(() => {
      // handleSubmit(formData => {
      //   const bookingDetail = realmRef.current
      //     ?.objectForPrimaryKey<BookingRealm>(BookingRealm.schema.name, '')
      //     ?.toJSON() as Booking;
      //   dispatch(
      //     bookingActions.updateBooking({
      //       ...bookingDetail,
      //       BookingCode: formData.BookingCode,
      //       BookingStatus: formData.BookingStatus,
      //       Passengers: bookingDetail?.Passengers?.map((psg, idx) => ({
      //         ...psg,
      //         BirthDate: formData.Passengers[idx].BirthDate,
      //         DocumentExpiry: formData.Passengers[idx].DocumentExpiry,
      //         DocumentNumb: formData.Passengers[idx].DocumentNumb,
      //         Gender: formData.Passengers[idx].Gender,
      //         GivenName: formData.Passengers[idx].GivenName,
      //         IssueCountry: formData.Passengers[idx].IssueCountry,
      //         Membership: formData.Passengers[idx].Membership,
      //         Nationality: formData.Passengers[idx].Nationality,
      //         PaxType: formData.Passengers[idx].PaxType,
      //         Surname: formData.Passengers[idx].Surname,
      //       })),
      //     }),
      //   );
      // })();
    }, []);

    const onPressOption = (item: OptionData) => {
      switch (item.key) {
        case 'VIEW_HISTORY':
          onPressHistory();

          break;

        // case 'DELETE':
        //   showModalConfirm({
        //     flexDirection: 'row',
        //     t18nTitle: 'booking:delete_booking_ques',
        //     t18nCancel: 'common:cancel',
        //     t18nOk: 'common:delete',
        //     themeColorCancel: 'neutral50',
        //     themeColorTextCancel: 'neutral900',
        //     themeColorOK: 'error500',
        //     onOk: () => {
        //       dispatch(
        //         bookingActions.deleteBookings([info.id], () => {
        //           goBack();
        //         }),
        //       );
        //     },
        //   });

        //   break;
      }
    };

    const _leftContent = useMemo(
      () => (
        <Block flexDirection="row" alignItems="center">
          <Block flex={1} flexDirection="row" alignItems="center" columnGap={8}>
            <Button
              hitSlop={HitSlop.Large}
              leftIcon="arrow_ios_left_outline"
              leftIconSize={24}
              textColorTheme="neutral900"
              onPress={() => {
                goBack();
              }}
              padding={4}
            />
            <Block rowGap={2}>
              <Controller
                control={control}
                name="BookingCode"
                render={({ field: { value } }) => (
                  <Text
                    text={`${info?.airline}: ${value ?? 'FAIL'}`}
                    colorTheme={!value ? 'error500' : 'success600'}
                    fontStyle="Title20Semi"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  />
                )}
              />
              <Block flexDirection="row" alignItems="center" columnGap={4}>
                <Icon
                  icon="navigation_2_fill"
                  colorTheme="neutral800"
                  size={10}
                />
                <Text
                  text={airline}
                  colorTheme="neutral800"
                  fontStyle="Capture11Reg"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                />
              </Block>
            </Block>
          </Block>
          <Block
            paddingHorizontal={8}
            paddingVertical={4}
            borderRadius={4}
            marginHorizontal={16}
            colorTheme={
              info.system
                ? SystemDetails[info.system as System]?.colorTheme
                : 'neutral100'
            }>
            <Text
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              text={info.system}
              fontStyle="Capture11Bold"
              colorTheme="classicWhite"
            />
          </Block>
        </Block>
      ),
      [control, airline, info.system, info?.airline],
    );

    const _rightContent = useMemo(
      () => (
        <Block
          flexDirection="row"
          alignItems="center"
          columnGap={8}
          // width={72}
          // justifyContent="flex-end"
        >
          {isDirty && (
            <Button
              type="common"
              size="small"
              leftIcon="saver_outline"
              textColorTheme="neutral900"
              leftIconSize={24}
              padding={4}
              onPress={_save}
            />
          )}
          <Button
            type="common"
            size="small"
            leftIcon="more_vertical_outline"
            textColorTheme="neutral900"
            leftIconSize={24}
            padding={4}
            onPress={() => {
              actionSheetRefs.current?.show();
            }}
          />
        </Block>
      ),
      [isDirty, _save],
    );

    return (
      <>
        <NormalHeader
          zIndex={0}
          leftContentStyle={{ flex: 1 }}
          colorTheme="neutral100"
          leftContent={_leftContent}
          rightContent={_rightContent}
        />
        <ActionSheet
          type="select"
          ref={actionSheetRefs}
          onPressOption={onPressOption}
          option={options}
        />
      </>
    );
  },
  isEqual,
);

import { Block, Button, Modal, Text, TextInput } from '@vna-base/components';
import { selectSearchForm } from '@vna-base/redux/selector';
import { flightResultActions } from '@vna-base/redux/action-slice';
import {
  ApplyFlightFee,
  ApplyPassengerFee,
  CustomFeeForm,
  ModalSubmitRef,
} from '@vna-base/screens/flight/type';
import { translate } from '@vna-base/translations/translate';
import { convertStringToNumber, dispatch, WindowWidth } from '@vna-base/utils';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { AddFeeTotal } from './add-fee-total';

export const AddFeeModal = forwardRef<ModalSubmitRef, any>((_, ref) => {
  // const styles = useStyles();

  const { Passengers } = useSelector(selectSearchForm);

  const addFeeFormMethod = useForm<CustomFeeForm>({
    defaultValues: {
      applyFLight: ApplyFlightFee.PerSegment,
      applyPassenger: ApplyPassengerFee.PerPassenger,
    },
    mode: 'all',
  });

  const [isVisibleModalAddFee, setIsVisibleModalAddFee] = useState(false);

  const _onCancel = () => {
    setIsVisibleModalAddFee(false);
  };

  useImperativeHandle(
    ref,
    () => ({
      show: () => {
        setIsVisibleModalAddFee(true);
      },
    }),
    [],
  );

  const submit = useCallback(() => {
    setIsVisibleModalAddFee(false);

    addFeeFormMethod.handleSubmit(form => {
      // dispatch(flightResultActions.saveCustomFee(form));
      dispatch(flightResultActions.calCustomFeeTotal(form));
    })();
  }, [addFeeFormMethod]);

  return (
    <Modal
      isVisible={isVisibleModalAddFee}
      onBackdropPress={_onCancel}
      onBackButtonPress={_onCancel}
      entering={SlideInDown}
      exiting={SlideOutDown}>
      <FormProvider {...addFeeFormMethod}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}>
          <Block
            width={342}
            maxWidth={WindowWidth - 32}
            paddingTop={16}
            alignSelf="center"
            paddingHorizontal={12}
            paddingBottom={12}
            borderRadius={14}
            colorTheme="neutral100"
            rowGap={12}>
            <Block paddingHorizontal={4} rowGap={16}>
              <Controller
                control={addFeeFormMethod.control}
                name="ADT"
                render={({ field: { value, onChange } }) => (
                  <TextInput
                    value={value}
                    labelI18n="flight:adult"
                    size="large"
                    type="normal"
                    onChangeText={txt => {
                      onChange(convertStringToNumber(txt).currencyFormat());
                    }}
                    keyboardType="number-pad"
                    contextMenuHidden={true}
                  />
                )}
              />

              {Passengers.Chd! > 0 && (
                <Controller
                  control={addFeeFormMethod.control}
                  name="CHD"
                  render={({ field: { value, onChange } }) => (
                    <TextInput
                      value={value}
                      labelI18n="flight:children"
                      size="large"
                      type="normal"
                      disable={!Passengers.Chd}
                      onChangeText={txt => {
                        onChange(convertStringToNumber(txt).currencyFormat());
                      }}
                      keyboardType="number-pad"
                      contextMenuHidden={true}
                    />
                  )}
                />
              )}

              {Passengers.Inf! > 0 && (
                <Controller
                  control={addFeeFormMethod.control}
                  name="INF"
                  render={({ field: { value, onChange } }) => (
                    <TextInput
                      value={value}
                      labelI18n="flight:infant"
                      size="large"
                      type="normal"
                      disable={!Passengers.Inf}
                      onChangeText={txt => {
                        onChange(convertStringToNumber(txt).currencyFormat());
                      }}
                      keyboardType="number-pad"
                      contextMenuHidden={true}
                    />
                  )}
                />
              )}
            </Block>
            {/* <Block paddingHorizontal={4} rowGap={8}>
              <Text
                t18n="flight:apply_per_passenger"
                fontStyle="Body14Reg"
                colorTheme="neutral900"
              />

              <Controller
                control={addFeeFormMethod.control}
                name="applyPassenger"
                render={({ field: { value, onChange } }) => (
                  <Block flexDirection="row" columnGap={8}>
                    <Block flex={1}>
                      <Button
                        t18n="flight:charge_per_passenger"
                        fullWidth
                        size="small"
                        textFontStyle="Body14Semi"
                        type="outline"
                        padding={12}
                        onPress={() => {
                          onChange(ApplyPassengerFee.PerPassenger);
                        }}
                        textColorTheme={
                          value !== ApplyPassengerFee.All
                            ? 'neutral900'
                            : 'neutral800'
                        }
                        buttonStyle={
                          value !== ApplyPassengerFee.All
                            ? styles.selectedBtn
                            : styles.btn
                        }
                      />
                    </Block>
                    <Block flex={1}>
                      <Button
                        t18n="flight:charge_once_for_all"
                        fullWidth
                        textColorTheme={
                          value === ApplyPassengerFee.All
                            ? 'neutral900'
                            : 'neutral800'
                        }
                        buttonStyle={
                          value === ApplyPassengerFee.All
                            ? styles.selectedBtn
                            : styles.btn
                        }
                        size="small"
                        textFontStyle="Body14Semi"
                        type="outline"
                        padding={12}
                        onPress={() => {
                          onChange(ApplyPassengerFee.All);
                        }}
                      />
                    </Block>
                  </Block>
                )}
              />
            </Block>
            <Block paddingHorizontal={4} rowGap={8}>
              <Text
                t18n="flight:apply_per_flight"
                fontStyle="Body14Reg"
                colorTheme="neutral900"
              />

              <Controller
                control={addFeeFormMethod.control}
                name="applyFLight"
                render={({ field: { value, onChange } }) => (
                  <Block flexDirection="row" columnGap={8}>
                    <Block flex={1}>
                      <Button
                        t18n="flight:charge_per_segment"
                        fullWidth
                        size="small"
                        textFontStyle="Body14Semi"
                        type="outline"
                        padding={12}
                        textColorTheme={
                          value !== ApplyFlightFee.All
                            ? 'neutral900'
                            : 'neutral800'
                        }
                        buttonStyle={
                          value !== ApplyFlightFee.All
                            ? styles.selectedBtn
                            : styles.btn
                        }
                        onPress={() => {
                          onChange(ApplyFlightFee.PerSegment);
                        }}
                      />
                    </Block>
                    <Block flex={1}>
                      <Button
                        t18n="flight:charge_once_for_all"
                        fullWidth
                        size="small"
                        textFontStyle="Body14Semi"
                        type="outline"
                        padding={12}
                        textColorTheme={
                          value === ApplyFlightFee.All
                            ? 'neutral900'
                            : 'neutral800'
                        }
                        buttonStyle={
                          value === ApplyFlightFee.All
                            ? styles.selectedBtn
                            : styles.btn
                        }
                        onPress={() => {
                          onChange(ApplyFlightFee.All);
                        }}
                      />
                    </Block>
                  </Block>
                )}
              />
            </Block> */}
            <Block
              borderRadius={8}
              padding={12}
              rowGap={8}
              colorTheme="warning50"
              marginHorizontal={4}>
              <Text colorTheme="neutral900" fontStyle="Body12Bold">
                {translate('input_info_passenger:service_fee') + ' '}
                <Text t18n="flight:note_modal_add_fee" fontStyle="Body12Reg" />
              </Text>
              {/* <Text colorTheme="neutral900" fontStyle="Body12Reg">
                {translate('flight:if_applicable')}
                <Text
                  t18n="flight:per_passenger_per_segment"
                  fontStyle="Body12Bold"
                />
                {translate('flight:add_fee_sub2')}
              </Text> */}
            </Block>
            <AddFeeTotal />
            <Block flexDirection="row" columnGap={8}>
              <Block flex={1}>
                <Button
                  t18n="common:cancel"
                  fullWidth
                  textColorTheme="neutral900"
                  size="large"
                  textFontStyle="Body14Bold"
                  buttonColorTheme="neutral50"
                  paddingVertical={12}
                  onPress={() => {
                    setIsVisibleModalAddFee(false);
                  }}
                />
              </Block>
              <Block flex={1}>
                <Button
                  t18n="common:execute"
                  fullWidth
                  textColorTheme="white"
                  buttonColorTheme="primary500"
                  size="large"
                  textFontStyle="Body14Bold"
                  paddingVertical={12}
                  onPress={submit}
                />
              </Block>
            </Block>
          </Block>
        </TouchableWithoutFeedback>
      </FormProvider>
    </Modal>
  );
});

// const useStyles = () => {
//   const { colors } = useTheme();

//   return useMemo(
//     () =>
//       StyleSheet.create({
//         btn: {
//           borderColor: colors.neutral400,
//           backgroundColor: colors.neutral50,
//         },
//         selectedBtn: {
//           borderColor: colors.primary300,
//           backgroundColor: colors.primary50,
//         },
//       }),
//     [colors.neutral400, colors.neutral50, colors.primary300, colors.primary50],
//   );
// };

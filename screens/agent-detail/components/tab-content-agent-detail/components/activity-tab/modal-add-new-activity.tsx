import {
  Block,
  BottomSheet,
  Button,
  Icon,
  Text,
  TextInput as TextInputCP,
} from '@vna-base/components';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { selectAgentDetailById, selectAllEmployee } from '@vna-base/redux/selector';
import { activityActions } from '@vna-base/redux/action-slice';
import { ModalCustomPicker } from '@vna-base/screens/order-detail/components';
import {
  ItemCustom,
  ModalCustomPickerRef,
} from '@vna-base/screens/order-detail/components/modal-custom-picker/type';
import { useTheme } from '@theme';
import { I18nKeys } from '@translations/locales';
import { translate } from '@vna-base/translations/translate';
import {
  ModalMinWidth,
  ModalPaddingHorizontal,
  ModalWidth,
  dispatch,
} from '@vna-base/utils';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Pressable, TextInput } from 'react-native';
import { useSelector } from 'react-redux';
import { useStyles } from './style';
import { ModalAddActivityType } from './type';

export type ModalAddNew = {
  show: () => void;
};

export const ModalAddNewActivity = forwardRef<ModalAddNew, any>((_, ref) => {
  const styles = useStyles();
  const { colors } = useTheme();

  const { Id } = useSelector(selectAgentDetailById);
  const listAllEmployee = useSelector(selectAllEmployee);

  const normalRef = useRef<BottomSheetModal>(null);
  const employeeRef = useRef<ModalCustomPickerRef>(null);

  const formModalAddNew = useForm<ModalAddActivityType>({
    mode: 'all',
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const allEmployee: ItemCustom[] = listAllEmployee.map(item => ({
    key: item.Id,
    t18n: item.FullName,
  }));

  const showModalChooseEmployee = () => {
    const employee = allEmployee.find(
      item => item.key === formModalAddNew.getValues('EmployeeId'),
    );
    employeeRef.current?.present(employee?.key ?? null);
  };

  const selectEmployee = (val?: string | null) => {
    formModalAddNew.setValue('EmployeeId', val, {
      shouldDirty: true,
    });
  };

  const showContentModal = useCallback(() => {
    formModalAddNew.reset({
      EmployeeId: '',
      Title: '',
      Content: '',
    });

    normalRef.current?.present();
  }, [formModalAddNew]);

  useImperativeHandle(
    ref,
    () => ({
      show: () => {
        showContentModal();
      },
    }),
    [showContentModal],
  );

  //cmt: insert/update new user account
  const submit = useCallback(async () => {
    const isValid = await formModalAddNew.trigger(['EmployeeId', 'Title']);
    if (isValid) {
      normalRef.current?.close();
    }

    formModalAddNew.handleSubmit(form => {
      dispatch(activityActions.insertNewActivity(form, Id!));
    })();
  }, [Id, formModalAddNew]);

  const _onCancel = () => {
    normalRef.current?.dismiss();
  };

  return (
    <Block>
      <BottomSheet
        useDynamicSnapPoint={true}
        ref={normalRef}
        showCloseButton={false}
        showIndicator={false}
        paddingBottom={false}
        showLineBottomHeader={false}
        style={{
          marginHorizontal: ModalPaddingHorizontal,
        }}
        header={<Block />}
        enablePanDownToClose={false}
        enableOverDrag={false}
        detachedCenter={true}
        disablePressBackDrop={true}>
        <FormProvider {...formModalAddNew}>
          <Block
            colorTheme="neutral100"
            borderRadius={16}
            minWidth={ModalMinWidth}
            width={ModalWidth}
            rowGap={16}
            paddingTop={16}
            alignSelf="center"
            paddingHorizontal={16}>
            {/* //cmt: chọn nhân viên */}
            <Controller
              control={formModalAddNew.control}
              name="EmployeeId"
              rules={{
                required: true,
              }}
              render={({ field: { value }, fieldState: { invalid } }) => {
                const employee = allEmployee.find(item => item.key === value);

                return (
                  <Block flex={1}>
                    <Pressable
                      onPress={showModalChooseEmployee}
                      style={[
                        styles.row,
                        invalid && {
                          borderColor: colors.error500,
                        },
                        employee && {
                          borderColor: colors.neutral300,
                        },
                      ]}>
                      <Block
                        flexDirection="row"
                        alignItems="center"
                        columnGap={4}>
                        <Text
                          colorTheme={value ? 'neutral900' : 'neutral600'}
                          fontStyle="Body16Reg"
                          t18n={
                            employee ? employee?.t18n : 'agent_detail:employee'
                          }
                        />
                        {!employee && (
                          <Text
                            colorTheme="error500"
                            fontStyle="Body16Reg"
                            text="*"
                          />
                        )}
                      </Block>
                      <Icon
                        icon="arrow_ios_down_fill"
                        size={24}
                        colorTheme="neutral900"
                      />
                    </Pressable>
                    {value && (
                      <Block
                        position="absolute"
                        left={8}
                        style={{ top: -8 }}
                        paddingHorizontal={4}
                        colorTheme="neutral100">
                        <Block
                          flexDirection="row"
                          alignItems="center"
                          columnGap={4}>
                          <Text
                            t18n="agent_detail:employee"
                            fontStyle="Body12Reg"
                            colorTheme="neutral600"
                          />
                          <Text
                            colorTheme="error500"
                            fontStyle="Body12Reg"
                            text="*"
                          />
                        </Block>
                      </Block>
                    )}
                  </Block>
                );
              }}
            />
            {/* //cmt: title */}
            <Controller
              control={formModalAddNew.control}
              name="Title"
              rules={{
                required: true,
              }}
              render={({
                field: { value, onChange },
                fieldState: { invalid },
              }) => {
                return (
                  <Block flex={1}>
                    <TextInputCP
                      placeholder={translate('agent_detail:summary')}
                      placeholderTextColor={colors.neutral600}
                      defaultValue={value!}
                      onChangeText={txt => onChange(txt)}
                      numberOfLines={1}
                      maxLength={60}
                      present={invalid ? 'error' : 'normal'}
                      style={[styles.input, { height: 48 }]}
                    />
                    {!value && (
                      <Block position="absolute" style={{ left: 74, top: 14 }}>
                        <Text
                          colorTheme="error500"
                          fontStyle="Body16Reg"
                          text="*"
                        />
                      </Block>
                    )}
                    {value && (
                      <Block
                        position="absolute"
                        left={8}
                        style={{ top: -8 }}
                        paddingHorizontal={4}
                        colorTheme="neutral100">
                        <Block
                          flexDirection="row"
                          alignItems="center"
                          columnGap={4}>
                          <Text
                            t18n="agent_detail:summary"
                            fontStyle="Body12Reg"
                            colorTheme="neutral600"
                          />
                          <Text
                            colorTheme="error500"
                            fontStyle="Body12Reg"
                            text="*"
                          />
                        </Block>
                      </Block>
                    )}
                  </Block>
                );
              }}
            />
            {/* //cmt: content */}
            <Controller
              control={formModalAddNew.control}
              name="Content"
              render={({ field: { value, onChange } }) => {
                return (
                  <Block flex={1}>
                    <TextInput
                      placeholder={translate('agent_detail:content')}
                      placeholderTextColor={colors.neutral600}
                      defaultValue={value!}
                      onChangeText={txt => onChange(txt)}
                      multiline
                      maxLength={150}
                      numberOfLines={3}
                      style={styles.input}
                    />
                    {value && (
                      <Block
                        position="absolute"
                        left={8}
                        style={{ top: -8 }}
                        paddingHorizontal={4}
                        colorTheme="neutral100">
                        <Text
                          t18n="agent_detail:content"
                          fontStyle="Body12Reg"
                          colorTheme="neutral600"
                        />
                      </Block>
                    )}
                  </Block>
                );
              }}
            />
            {/* //cmt: footer */}
            <Block
              flexDirection="row"
              alignItems="center"
              columnGap={16}
              marginBottom={16}
              justifyContent="space-between">
              <Block flex={1}>
                <Button
                  type="classic"
                  fullWidth
                  size="medium"
                  t18n="common:cancel"
                  textColorTheme="neutral900"
                  onPress={_onCancel}
                />
              </Block>
              <Block flex={1}>
                <Button
                  type="classic"
                  buttonStyle={{ backgroundColor: colors.success600 }}
                  fullWidth
                  size="medium"
                  t18n="order_detail:more"
                  textColorTheme="classicWhite"
                  onPress={submit}
                />
              </Block>
            </Block>
          </Block>
        </FormProvider>
      </BottomSheet>
      <ModalCustomPicker
        ref={employeeRef}
        data={allEmployee}
        snapPoints={['40%']}
        showCloseButton={false}
        showIndicator={true}
        t18nTitle={undefined as unknown as I18nKeys}
        handleDone={selectEmployee}
      />
    </Block>
  );
});

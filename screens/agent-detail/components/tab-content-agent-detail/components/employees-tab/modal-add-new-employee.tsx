import { images } from '@assets/image';
import {
  ActionSheet,
  Block,
  BottomSheet,
  Button,
  DatePicker,
  Icon,
  Image,
  Text,
  TextInput,
} from '@vna-base/components';
import { OptionData } from '@vna-base/components/action-sheet/type';
import { DatePickerRef } from '@vna-base/components/date-picker/type';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { selectAgentDetailById } from '@vna-base/redux/selector';
import { contactActions } from '@vna-base/redux/action-slice';
import { listOptionUploadImg } from '@vna-base/screens/add-new-agent/type';
import { useTheme } from '@theme';
import { translate } from '@vna-base/translations/translate';
import {
  ActiveOpacity,
  ModalMinWidth,
  ModalPaddingHorizontal,
  ModalWidth,
  dispatch,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Pressable, TouchableOpacity } from 'react-native';
import ImagePicker, {
  Image as ImageCropPicker,
} from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import { useStyles } from './style';

export type ModalAddNewEmp = {
  show: () => void;
};

export type ModalAddNewEmpType = {
  Photo?: string | ImageCropPicker | null;
  FullName?: string | null;
  Title?: string | null;
  Phone?: string | null;
  Email?: string | null;
  DateOfBirth?: Date | null;
  Remark?: string | null;
  AgentId?: string | null;
};

export const ModalAddNewEmployee = forwardRef<ModalAddNewEmp, any>((_, ref) => {
  const { colors } = useTheme();
  const styles = useStyles();

  const normalRef = useRef<BottomSheetModal>(null);
  const actionSheetRef = useRef<ActionSheet>(null);
  const datePickerRef = useRef<DatePickerRef>(null);

  const { Id } = useSelector(selectAgentDetailById);

  const formModalAddNew = useForm<ModalAddNewEmpType>({
    mode: 'all',
  });

  useImperativeHandle(
    ref,
    () => ({
      show: () => {
        formModalAddNew.reset({
          Photo: null,
          Title: '',
          FullName: '',
          Phone: '',
          Email: '',
          DateOfBirth: null,
          Remark: '',
          AgentId: Id,
        });

        normalRef.current?.present();
      },
    }),
    [Id, formModalAddNew],
  );

  const showModal = () => {
    actionSheetRef.current?.show();
  };

  const onCamera = useCallback(() => {
    ImagePicker.openCamera({
      // cropping: true,
      multiple: false,
    }).then(image => {
      formModalAddNew.setValue('Photo', image);
    });
  }, [formModalAddNew]);

  const onGallery = useCallback(() => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      // cropping: true,
    }).then(image => {
      formModalAddNew.setValue('Photo', image);
    });
  }, [formModalAddNew]);

  const onPressOption = (item: OptionData) => {
    switch (item.key) {
      case 'TAKE_PICTURE':
        onCamera();
        break;

      case 'PICK_IMAGES':
        onGallery();
        break;
    }
  };

  //cmt: insert/update new user account
  const submit = useCallback(() => {
    formModalAddNew.handleSubmit(form => {
      dispatch(contactActions.insertContact(form));
    })();
    normalRef.current?.close();
  }, [formModalAddNew]);

  const _onCancel = () => {
    normalRef.current?.dismiss();
  };

  return (
    <>
      <BottomSheet
        useDynamicSnapPoint={true}
        ref={normalRef}
        showCloseButton={false}
        showIndicator={false}
        showLineBottomHeader={false}
        paddingBottom={false}
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
            rowGap={16}
            paddingTop={16}
            alignSelf="center"
            width={ModalWidth}
            paddingHorizontal={16}>
            {/* //cmt: image Photo  */}
            <Controller
              control={formModalAddNew.control}
              name="Photo"
              render={({ field: { value } }) => (
                <Pressable
                  onPress={showModal}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    columnGap: 16,
                  }}>
                  <Block alignSelf="center">
                    <Block
                      width={56}
                      height={56}
                      borderWidth={10}
                      borderColorTheme="neutral200"
                      style={{ borderRadius: 28 }}
                      overflow="hidden">
                      <Image
                        source={
                          // eslint-disable-next-line no-nested-ternary
                          value
                            ? typeof value === 'string'
                              ? value
                              : value.path
                            : images.default_avatar
                        }
                        style={{ width: 56, height: 56 }}
                        resizeMode="contain"
                      />
                    </Block>
                    <Block
                      position="absolute"
                      style={{ bottom: 0, right: 0 }}
                      borderRadius={10}
                      width={20}
                      height={20}
                      padding={1}
                      colorTheme="neutral100">
                      <Block
                        borderWidth={5}
                        width={18}
                        height={18}
                        alignItems="center"
                        justifyContent="center"
                        borderColorTheme="neutral200"
                        borderRadius={10}
                        colorTheme="neutral100">
                        <Icon
                          icon="edit_2_outline"
                          size={12}
                          colorTheme="neutral900"
                        />
                      </Block>
                    </Block>
                  </Block>
                  <Block
                    flex={1}
                    flexWrap="wrap"
                    borderRadius={8}
                    paddingLeft={12}
                    paddingVertical={12}
                    colorTheme="neutral50"
                    alignItems="center"
                    flexDirection="row">
                    <Icon
                      icon="alert_circle_fill"
                      size={16}
                      colorTheme="neutral900"
                    />
                    <Text
                      text={
                        translate('add_new_agent:note').slice(0, 28) +
                        '\n' +
                        translate('add_new_agent:note').slice(28)
                      }
                      style={{ marginLeft: 12 }}
                      fontStyle="Body12Reg"
                      colorTheme="neutral900"
                    />
                  </Block>
                </Pressable>
              )}
            />
            {/* //cmt: controller full name  */}
            <Controller
              control={formModalAddNew.control}
              name="FullName"
              render={({ field: { value, onChange } }) => (
                <Block flex={1}>
                  <TextInput
                    placeholderI18n="input_info_passenger:full_name"
                    placeholderTextColor={colors.neutral600}
                    defaultValue={value!}
                    onChangeText={txt => onChange(txt)}
                  />
                  {value !== '' && (
                    <Block
                      position="absolute"
                      left={8}
                      style={{ top: -8 }}
                      paddingHorizontal={4}
                      colorTheme="neutral100">
                      <Text
                        t18n="input_info_passenger:full_name"
                        fontStyle="Body12Reg"
                        colorTheme="neutral600"
                      />
                    </Block>
                  )}
                </Block>
              )}
            />
            {/* //cmt: controller Chức vụ  */}
            <Controller
              control={formModalAddNew.control}
              name="Title"
              render={({ field: { value, onChange } }) => (
                <Block flex={1}>
                  <TextInput
                    placeholderI18n="agent_detail:title"
                    placeholderTextColor={colors.neutral600}
                    defaultValue={value!}
                    onChangeText={txt => onChange(txt)}
                  />
                  {value !== '' && (
                    <Block
                      position="absolute"
                      left={8}
                      style={{ top: -8 }}
                      paddingHorizontal={4}
                      colorTheme="neutral100">
                      <Text
                        t18n="agent_detail:title"
                        fontStyle="Body12Reg"
                        colorTheme="neutral600"
                      />
                    </Block>
                  )}
                </Block>
              )}
            />
            {/* //cmt: controller phone  */}
            <Controller
              control={formModalAddNew.control}
              name="Phone"
              render={({ field: { value, onChange } }) => (
                <Block flex={1}>
                  <TextInput
                    placeholderI18n="order:phone"
                    placeholderTextColor={colors.neutral600}
                    defaultValue={value!}
                    onChangeText={txt => onChange(txt)}
                  />
                  {value !== '' && (
                    <Block
                      position="absolute"
                      left={8}
                      style={{ top: -8 }}
                      paddingHorizontal={4}
                      colorTheme="neutral100">
                      <Text
                        t18n="order:phone"
                        fontStyle="Body12Reg"
                        colorTheme="neutral600"
                      />
                    </Block>
                  )}
                </Block>
              )}
            />
            {/* //cmt: controller email  */}
            <Controller
              control={formModalAddNew.control}
              name="Email"
              render={({ field: { value, onChange } }) => (
                <Block flex={1}>
                  <TextInput
                    placeholderI18n="order:email"
                    placeholderTextColor={colors.neutral600}
                    defaultValue={value!}
                    onChangeText={txt => onChange(txt)}
                  />
                  {value !== '' && (
                    <Block
                      position="absolute"
                      left={8}
                      style={{ top: -8 }}
                      paddingHorizontal={4}
                      colorTheme="neutral100">
                      <Text
                        t18n="order:email"
                        fontStyle="Body12Reg"
                        colorTheme="neutral600"
                      />
                    </Block>
                  )}
                </Block>
              )}
            />
            {/* //cmt: controller Ngày sinh  */}
            <Controller
              control={formModalAddNew.control}
              name="DateOfBirth"
              render={({ field: { value, onChange } }) => {
                const showDatePicker = () => {
                  datePickerRef.current?.open({
                    date: value ?? new Date(),
                  });
                };

                return (
                  <Block flex={1}>
                    <TouchableOpacity
                      activeOpacity={ActiveOpacity}
                      onPress={showDatePicker}
                      style={styles.row}>
                      <Text>
                        <Text
                          colorTheme={value ? 'neutral900' : 'neutral600'}
                          fontStyle="Body16Reg"
                          t18n={!value ? 'input_info_passenger:dob' : undefined}
                          text={
                            value
                              ? dayjs(value).format('DD/MM/YYYY')
                              : undefined
                          }
                        />
                      </Text>
                      <Icon
                        icon="calendar_fill"
                        size={24}
                        colorTheme="primary600"
                      />
                      {value && (
                        <Block
                          flexDirection="row"
                          position="absolute"
                          left={8}
                          style={{ top: -16 }}
                          colorTheme="neutral100"
                          padding={4}>
                          <Text
                            colorTheme="neutral600"
                            fontStyle="Body12Reg"
                            t18n="input_info_passenger:dob"
                          />
                        </Block>
                      )}
                    </TouchableOpacity>
                    <DatePicker
                      ref={datePickerRef}
                      maximumDate={dayjs().toDate()}
                      t18nTitle="input_info_passenger:dob"
                      submit={date => onChange(date)}
                    />
                  </Block>
                );
              }}
            />
            {/* //cmt: controller Remark  */}
            <Controller
              control={formModalAddNew.control}
              name="Remark"
              render={({ field: { value, onChange } }) => (
                <Block flex={1}>
                  <TextInput
                    placeholderI18n="order_detail:note"
                    placeholderTextColor={colors.neutral600}
                    defaultValue={value!}
                    onChangeText={txt => onChange(txt)}
                  />
                  {value !== '' && (
                    <Block
                      position="absolute"
                      left={8}
                      style={{ top: -8 }}
                      paddingHorizontal={4}
                      colorTheme="neutral100">
                      <Text
                        t18n="order_detail:note"
                        fontStyle="Body12Reg"
                        colorTheme="neutral600"
                      />
                    </Block>
                  )}
                </Block>
              )}
            />
            {/* //cmt: footer */}
            <Block
              flexDirection="row"
              alignItems="center"
              marginBottom={16}
              columnGap={16}
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
        <ActionSheet
          type="select"
          typeBackDrop="gray"
          ref={actionSheetRef}
          onPressOption={onPressOption}
          option={listOptionUploadImg}
        />
      </BottomSheet>
    </>
  );
});

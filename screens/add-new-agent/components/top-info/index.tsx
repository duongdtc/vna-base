import { images } from '@assets/image';
import { ActionSheet, Block, Icon, Image, Text } from '@vna-base/components';
import {
  FormNewAgentType,
  listOptionUploadImg,
} from '@vna-base/screens/add-new-agent/type';
import { OptionData } from '@vna-base/components/action-sheet/type';
import React, { memo, useCallback, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { Controller, useFormContext } from 'react-hook-form';
import { Pressable } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

export const TopInfo = memo(() => {
  const actionSheetRef = useRef<ActionSheet>(null);

  const { control, setValue } = useFormContext<FormNewAgentType>();

  const showModal = () => {
    actionSheetRef.current?.show();
  };

  const onCamera = useCallback(() => {
    ImagePicker.openCamera({
      // cropping: true,
      multiple: false,
    }).then(image => {
      setValue('Logo', image);
    });
  }, [setValue]);

  const onGallery = useCallback(() => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      // cropping: true,
    }).then(image => {
      setValue('Logo', image);
    });
  }, [setValue]);

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

  // render
  return (
    <Block
      paddingHorizontal={16}
      paddingVertical={8}
      rowGap={16}
      colorTheme="neutral100">
      <Controller
        control={control}
        name="Logo"
        render={({ field: { value } }) => {
          return (
            <Pressable onPress={showModal}>
              <Block alignSelf="center">
                <Block
                  width={80}
                  height={80}
                  style={{ borderRadius: 40 }}
                  overflow="hidden"
                  borderWidth={10}
                  alignItems="center"
                  justifyContent="center"
                  borderColorTheme="neutral200">
                  <Image
                    source={
                      // eslint-disable-next-line no-nested-ternary
                      value
                        ? typeof value === 'string'
                          ? value
                          : value.path
                        : images.default_avatar
                    }
                    style={{ width: 80, height: 80 }}
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
            </Pressable>
          );
        }}
      />

      <Block
        borderRadius={8}
        colorTheme="neutral50"
        padding={12}
        flexDirection="row"
        alignItems="center"
        columnGap={12}>
        <Icon icon="alert_circle_fill" size={16} colorTheme="neutral800" />
        <Block flexDirection="row" alignItems="center">
          <Text
            t18n="add_new_agent:note"
            fontStyle="Body12Reg"
            colorTheme="neutral900"
          />
        </Block>
      </Block>
      <ActionSheet
        type="select"
        typeBackDrop="gray"
        ref={actionSheetRef}
        onPressOption={onPressOption}
        option={listOptionUploadImg}
      />
    </Block>
  );
}, isEqual);

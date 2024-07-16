import { images } from '@assets/image';
import { Block, Icon, Image, Text } from '@vna-base/components';
import { ConfigEmailForm } from '@vna-base/screens/config-email/type';
import { ActiveOpacity, HitSlop } from '@vna-base/utils';
import React from 'react';
import { useController } from 'react-hook-form';
import { Pressable, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useStyles } from './styles';

export const Logo = () => {
  const styles = useStyles();
  const {
    field: { value, onChange },
  } = useController<ConfigEmailForm>({ name: 'logo' });

  const onGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      // cropping: true,
    }).then(image => {
      onChange(image);
    });
  };

  return (
    <Block rowGap={12} paddingTop={8}>
      <Block
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        columnGap={12}>
        <Text
          t18n="common:logo"
          fontStyle="Title20Semi"
          colorTheme="neutral900"
        />
        <Pressable
          hitSlop={HitSlop.Large}
          onPress={() => {
            onChange(null);
          }}>
          <Text
            t18n="common:delete_logo"
            fontStyle="Body14Reg"
            colorTheme="error500"
          />
        </Pressable>
      </Block>
      <Block rowGap={12} justifyContent="center" alignItems="center">
        <TouchableOpacity
          style={styles.avatarContainer}
          activeOpacity={ActiveOpacity}
          onPress={onGallery}>
          <Image
            containerStyle={styles.avatar}
            source={
              value?.path ??
              (value && value !== '' ? value : images.take_picture)
            }
          />
          <Block
            position="absolute"
            bottom={0}
            right={4}
            padding={1}
            colorTheme="neutral100"
            borderRadius={24}>
            <Block
              borderWidth={3}
              colorTheme="neutral100"
              borderColorTheme="neutral200"
              borderRadius={24}
              padding={4}
              justifyContent="center"
              alignItems="center">
              <Icon icon="edit_2_outline" colorTheme="neutral900" size={12} />
            </Block>
          </Block>
        </TouchableOpacity>
        <Block
          width={'100%'}
          borderRadius={8}
          colorTheme="neutral100"
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
      </Block>
    </Block>
  );
};

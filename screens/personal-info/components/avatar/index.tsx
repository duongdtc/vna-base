import { images } from '@assets/image';
import {
  ActionSheet,
  Block,
  Icon,
  Image,
  ImageViewer,
  ImageViewerRef,
  Text,
  showToast,
} from '@vna-base/components';
import { OptionData } from '@vna-base/components/action-sheet/type';
import { PersonalInfoForm } from '@vna-base/screens/personal-info/type';
import { ActiveOpacity } from '@vna-base/utils';
import React, { memo, useCallback, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { useController } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useStyles } from './styles';

const Options: Array<OptionData> = [
  {
    t18n: 'user_account:view_avatar',
    key: 'VIEW_AVATAR',
    icon: 'eye_fill',
  },
  {
    t18n: 'upload_file:take_picture',
    key: 'TAKE_PICTURE',
    icon: 'camera_fill',
  },
  {
    t18n: 'upload_file:pick_image',
    key: 'PICK_IMAGES',
    icon: 'image_fill',
  },
];

export const Avatar = memo(({ id }: { id: string }) => {
  const styles = useStyles();
  const imgActionSheetRef = useRef<ActionSheet>(null);
  const imageViewerRef = useRef<ImageViewerRef>(null);

  const {
    field: { value, onChange },
  } = useController<PersonalInfoForm>({
    name: 'Photo',
  });

  const onCamera = useCallback(() => {
    ImagePicker.openCamera({
      // cropping: true,
      multiple: false,
    }).then(image => {
      onChange(image);
    });
  }, [onChange]);

  const viewAvatar = useCallback(() => {
    if (!value) {
      showToast({
        type: 'error',
        t18n: 'common:can_not_view_image',
      });
    } else {
      imageViewerRef.current?.showImage(value?.path ?? value);
    }
  }, [value]);

  const onGallery = useCallback(() => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      // cropping: true,
      // width: 1024,
      // height: 1024,
    }).then(image => {
      onChange(image);
    });
  }, [onChange]);

  const onPressOptionUploadImg = useCallback(
    (item: OptionData) => {
      switch (item.key) {
        case 'VIEW_AVATAR':
          viewAvatar();
          break;

        case 'TAKE_PICTURE':
          onCamera();
          break;

        case 'PICK_IMAGES':
          onGallery();
          break;
      }
    },
    [onCamera, onGallery, viewAvatar],
  );

  return (
    <Block
      paddingVertical={12}
      rowGap={16}
      justifyContent="center"
      colorTheme="neutral100"
      alignItems="center">
      <TouchableOpacity
        style={styles.avatarContainer}
        activeOpacity={ActiveOpacity}
        onPress={() => {
          imgActionSheetRef.current?.show();
        }}>
        <Image
          containerStyle={styles.avatar}
          source={
            value?.path ??
            value ??
            (id === undefined
              ? images.default_avatar_user
              : images.default_avatar)
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
      <ImageViewer
        ref={imageViewerRef}
        images={[
          {
            uri: value?.path ?? value,
          },
        ]}
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
        ref={imgActionSheetRef}
        onPressOption={onPressOptionUploadImg}
        option={Options}
      />
    </Block>
  );
}, isEqual);

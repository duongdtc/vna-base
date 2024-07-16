import { Block, Button, LinearGradient, showToast } from '@components';
import dayjs from 'dayjs';
import React, { useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import { ScrollView } from './scroll-view';
import { TerminalViewProps } from './type';

export const TerminalView = ({
  children,
  useInBottomSheet = false,
  showExportButton = true,
  cb,
  prefixExportName,
}: TerminalViewProps) => {
  const scrollViewRef = useRef<any>(null);
  const { bottom } = useSafeAreaInsets();

  const exportImg = async () => {
    try {
      let uri = '';
      const fileName = prefixExportName + dayjs().format('YYYYMMDD_HHmmss');

      if (!useInBottomSheet || Platform.OS === 'ios') {
        uri = await captureRef(scrollViewRef, {
          format: 'png',
          quality: 1,
          fileName,
          useRenderInContext: true,
          snapshotContentContainer: true,
        });
      } else {
        uri = await scrollViewRef.current.capture();
      }

      if (!!uri && uri !== '') {
        if (Platform.OS === 'ios') {
          ReactNativeBlobUtil.ios.presentOptionsMenu(uri);
        } else {
          await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
            {
              name: fileName, // name of the file
              parentFolder: '', // subdirectory in the Media Store, e.g. HawkIntech/Files to create a folder HawkIntech with a subfolder Files and save the image within this folder
              mimeType: 'image/png', // MIME type of the file
            },
            'Download', // Media Collection to store the file in ("Audio" | "Image" | "Video" | "Download")
            uri, // Path to the file being copied in the apps own storage
          );

          showToast({
            type: 'success',
            t18n: 'common:done',
          });
        }

        cb?.();
      } else {
        throw new Error('lưu lỗi kìa');
      }
    } catch (error) {
      showToast({
        type: 'error',
        t18n: 'common:failed',
      });
      console.log(error);
    }
  };

  return (
    <Block flex={1}>
      <LinearGradient style={StyleSheet.absoluteFillObject} type="gra1" />
      <ScrollView useInBottomSheet={useInBottomSheet} ref={scrollViewRef}>
        <Block
          padding={8}
          style={{ paddingBottom: useInBottomSheet ? bottom : 8 }}>
          <LinearGradient style={StyleSheet.absoluteFillObject} type="gra1" />
          {children}
        </Block>
      </ScrollView>
      {showExportButton && (
        <Block position="absolute" top={12} right={12}>
          <Button
            onPress={exportImg}
            leftIcon="download_fill"
            textColorTheme="primary600"
            buttonColorTheme="neutral10"
            padding={4}
            leftIconSize={24}
          />
        </Block>
      )}
    </Block>
  );
};

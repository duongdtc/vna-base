import { showModalConfirm } from '@vna-base/components/modal-confirm';
import React, { forwardRef, memo, useImperativeHandle, useState } from 'react';
import isEqual from 'react-fast-compare';
import ImageView from 'react-native-image-viewing';
import { ImageViewerProps, ImageViewerRef } from './type';

export const ImageViewer = memo(
  forwardRef<ImageViewerRef, ImageViewerProps>(({ images }, ref) => {
    const [visible, setIsVisible] = useState(false);
    const [index, setIndex] = useState(0);

    const showImage = (path: string | null | undefined) => {
      if (!path) {
        showModalConfirm({
          t18nTitle: 'modal_confirm:image_error',
          t18nSubtitle: 'modal_confirm:image_error_subtitle',
          t18nCancel: 'modal_confirm:close',
        });
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const i = images.findIndex(f => f?.uri === path);
        if (i > -1) {
          setIndex(i);
          setIsVisible(true);
        } else {
          showModalConfirm({
            t18nTitle: 'modal_confirm:image_error',
            t18nSubtitle: 'modal_confirm:image_error_subtitle',
            t18nCancel: 'modal_confirm:close',
          });
        }
      }
    };

    useImperativeHandle(ref, () => ({
      showImage,
    }));

    return (
      <ImageView
        images={images}
        imageIndex={index}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    );
  }),
  isEqual,
);

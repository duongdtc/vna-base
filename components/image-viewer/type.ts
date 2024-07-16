import { ImageSource } from 'react-native-image-viewing/dist/@types';

export type ImageViewerRef = {
  showImage: (path: string | null | undefined) => void;
};

export type ImageViewerProps = {
  images: Array<ImageSource>;
};

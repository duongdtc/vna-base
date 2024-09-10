import ReactNativeBlobUtil from 'react-native-blob-util';
import { ApiConstants } from './api';
import { UPLOAD_FILE_URL, UPLOAD_FILE_KEY } from '@env';
import { DocumentPickerResponse } from 'react-native-document-picker';
import { Process, UploadFileResponse } from '@redux/type';
import { Platform } from 'react-native';
import { Image } from 'react-native-image-crop-picker';
import { ImageTypes } from '@assets/image';
import { images } from '@vna-base/assets/image';

export enum PathInServer {
  MISSION = 'mission/document',
  AVATAR = 'images/avatar',
  LOGO = 'data/images/logo',
}

const uploadMultipleFile = async (
  files: DocumentPickerResponse[],
  pathInServer: PathInServer,
  uploadProgress: (process: Process, index: number) => void,
) => {
  try {
    const listRes = await Promise.allSettled(
      files.map(async (file, i) => {
        const res = await ReactNativeBlobUtil.fetch(
          'POST',
          UPLOAD_FILE_URL + ApiConstants.SINGLE_UPLOAD,
          {
            'Content-Type': 'multipart/form-data',
          },
          [
            {
              name: 'FileData',
              filename: file.name,
              data: ReactNativeBlobUtil.wrap(
                Platform.OS === 'ios'
                  ? decodeURIComponent(file.uri.replace('file://', ''))
                  : file.uri,
              ),
            },
            {
              name: 'FileName',
              data: file.name,
            },
            {
              name: 'FilePath',
              data: pathInServer,
            },
            {
              name: 'PrivateKey',
              data: UPLOAD_FILE_KEY,
            },
          ],
        ).uploadProgress((written, total) => {
          uploadProgress({ processed: written, total: total }, i);
        });

        return res.data as UploadFileResponse;
      }),
    );

    const success = listRes.reduce(
      (result, curr) => result && curr.status === 'fulfilled',
      true,
    );

    return {
      data: listRes,
      success,
    };
  } catch (error) {
    console.log('🚀 ~ file: index.ts:62 ~ error:', error);
  }
};

export const uploadFiles = (
  files: DocumentPickerResponse[],
  uploadProgress: (process: Process, index: number) => void,
  pathInServer: PathInServer = PathInServer.MISSION,
) => {
  try {
    if (files.length === 0) {
      throw Error('No file to upload');
    } else {
      return uploadMultipleFile(files, pathInServer, uploadProgress);
    }
  } catch (error) {
    console.log('🚀 ~ file: index.ts:63 ~ uploadFile ~ error:', error);
  }
};

export const downloadFile = () => {};

function changeExtensionOfFile(filename: string, newExt?: string): string {
  const lastDotIndex = filename.lastIndexOf('.');

  let newFileName = filename;

  if (lastDotIndex !== -1) {
    newFileName = filename.substring(0, lastDotIndex);
  }

  return newFileName + newExt ? `.${newExt}` : '';
}

function getFilenameFromPath(path: string): string {
  const lastIndex: number = path.lastIndexOf('/');

  if (lastIndex !== -1) {
    return path.substring(lastIndex + 1);
  } else {
    return path;
  }
}

export function getNameOfPhoto(photo: Image, newExt?: string): string {
  let filename = '';

  if (photo.filename) {
    filename = changeExtensionOfFile(photo.filename, newExt);
  } else {
    filename = getFilenameFromPath(photo.path);
  }

  return filename;
}

export function getImageUrl(
  urlOrPath: string | number | null | undefined,
  defaultImage?: ImageTypes,
) {
  if (!urlOrPath) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return images[defaultImage];
  }

  if (typeof urlOrPath === 'number') {
    return urlOrPath;
  }

  if (urlOrPath.startsWith('http')) {
    return urlOrPath;
  }

  return UPLOAD_FILE_URL + urlOrPath;
}

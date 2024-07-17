import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import { fileActions } from '@vna-base/redux/action-slice';
import { dispatch, uploadFiles } from '@vna-base/utils';
import { Process } from '@redux/type';

export const onProgressFile = (process: Process, index: number) => {
  dispatch(fileActions.updateProcess({ process, index }));
};

export const runFileListener = () => {
  takeLatestListeners(true)({
    actionCreator: fileActions.uploadFiles,
    effect: async action => {
      const { files, resolve, reject, pathInServer } = action.payload;
      const res = await uploadFiles(files, onProgressFile, pathInServer);
      const success = res?.data?.reduce(
        (result, curr) => result || curr.status === 'fulfilled',
        false,
      );
      if (success) {
        resolve?.(
          res!.data.map(f => {
            if (f.status === 'fulfilled') {
              return f.value.FileUrl;
            }

            return '';
          }),
        );
      } else {
        reject?.('upload_file:upload_failed');
      }
    },
  });
}
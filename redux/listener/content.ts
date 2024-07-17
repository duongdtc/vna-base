/* eslint-disable @typescript-eslint/ban-ts-comment */
import { contentActions } from '@redux-slice';
import { Data } from '@services/axios';
import { validResponse } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

takeLatestListeners(true)({
  actionCreator: contentActions.updateOrInsert,
  effect: async actions => {
    const { contents, cb } = actions.payload;

    const res = await Data.contentContentInsertOrUpdateCreate({
      List: contents,
    });

    cb?.(validResponse(res));
  },
});

takeLatestListeners(true)({
  actionCreator: contentActions.deleteContent,
  effect: async actions => {
    const { contentIds, cb } = actions.payload;

    const res = await Promise.allSettled(
      contentIds.map(async id => {
        const subRes = await Data.contentContentDeleteCreate({
          Id: id,
        });

        return { data: validResponse(subRes) };
      }),
    );

    const isValidResponse = res.reduce(
      (result, currRes) =>
        result || (currRes.status === 'fulfilled' && currRes.value.data),
      false,
    );

    cb?.(isValidResponse);
  },
});

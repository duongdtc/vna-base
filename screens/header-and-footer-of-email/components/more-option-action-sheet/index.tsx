/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ActionSheet, showToast } from '@vna-base/components';
import { OptionData } from '@vna-base/components/action-sheet/type';
import { goBack } from '@navigation/navigation-service';
import { configEmailActions, contentActions } from '@vna-base/redux/action-slice';
import { TitleAndRemarkForm } from '@vna-base/screens/title-and-remark-of-ticket/type';
import { dispatch } from '@vna-base/utils';
import React, { forwardRef, memo } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext } from 'react-hook-form';

const listOptions: Array<OptionData> = [
  {
    t18n: 'common:delete',
    key: 'DELETE',
    icon: 'trash_2_fill',
  },
];

export const MoreOptionActionSheet = memo(
  forwardRef<ActionSheet, any>((_, ref) => {
    const { getValues } = useFormContext<TitleAndRemarkForm>();

    const onPressOption = (item: OptionData) => {
      const values = getValues();
      switch (item.key) {
        case 'DELETE':
          dispatch(
            contentActions.deleteContent(
              [values.Header.Id!, values.Footer.Id!],
              isSuccess => {
                if (isSuccess) {
                  goBack();

                  dispatch(configEmailActions.getLanguages());
                } else {
                  showToast({
                    type: 'error',
                    t18n: 'common:failed',
                  });
                }
              },
            ),
          );
          break;
      }
    };

    return (
      <ActionSheet
        ref={ref}
        type="select"
        typeBackDrop="gray"
        onPressOption={onPressOption}
        option={listOptions}
      />
    );
  }),
  isEqual,
);

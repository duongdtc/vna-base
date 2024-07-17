import {
  ActionSheet,
  Block,
  Button,
  NormalHeader,
  Text,
  showToast,
} from '@vna-base/components';
import { OptionData } from '@vna-base/components/action-sheet/type';
import { goBack } from '@navigation/navigation-service';
import { selectConfigTicket } from '@vna-base/redux/selector';
import { configTicketActions } from '@vna-base/redux/action-slice';
import { ConfigTicketForm } from '@vna-base/screens/config-ticket/type';
import { HitSlop, dispatch } from '@vna-base/utils';
import React, { memo, useCallback, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext, useFormState } from 'react-hook-form';
import { useSelector } from 'react-redux';

const listOptions: Array<OptionData> = [
  {
    t18n: 'order_detail:view_history',
    key: 'VIEW_HISTORY',
    icon: 'history_outline',
  },
];

export const Header = memo(
  ({ openHistoryBts }: { openHistoryBts: () => void }) => {
    const actionSheetRef = useRef<ActionSheet>(null);
    const configTicket = useSelector(selectConfigTicket);

    const { handleSubmit } = useFormContext<ConfigTicketForm>();
    const { isDirty } = useFormState<ConfigTicketForm>();

    const onPressOption = useCallback(
      (item: OptionData) => {
        switch (item.key) {
          case 'VIEW_HISTORY':
            openHistoryBts();

            break;
        }
      },
      [openHistoryBts],
    );

    const submit = useCallback(() => {
      handleSubmit(form => {
        dispatch(
          configTicketActions.updateConfigTicket(form, isSuccess => {
            if (isSuccess) {
              goBack();
            } else {
              showToast({
                type: 'error',
                t18n: 'common:failed',
              });
            }
          }),
        );
      })();
    }, [handleSubmit]);

    return (
      <NormalHeader
        zIndex={0}
        colorTheme="neutral100"
        shadow=".3"
        leftContent={
          <Button
            hitSlop={HitSlop.Large}
            type="common"
            size="small"
            leftIcon="arrow_ios_left_fill"
            textColorTheme="neutral900"
            leftIconSize={24}
            padding={4}
            onPress={() => goBack()}
          />
        }
        centerContent={
          <Text
            t18n="config_ticket:config_ticket"
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
        rightContent={
          <Block flexDirection="row" alignItems="center" columnGap={8}>
            {isDirty && (
              <Button
                type="common"
                size="small"
                leftIcon="saver_outline"
                textColorTheme="neutral900"
                leftIconSize={24}
                padding={4}
                onPress={submit}
              />
            )}
            {!!configTicket?.Id && (
              <>
                <Button
                  type="common"
                  size="small"
                  leftIcon="more_vertical_outline"
                  textColorTheme="neutral900"
                  leftIconSize={24}
                  padding={4}
                  onPress={() => {
                    actionSheetRef.current?.show();
                  }}
                />
                <ActionSheet
                  ref={actionSheetRef}
                  type="select"
                  typeBackDrop="gray"
                  onPressOption={onPressOption}
                  option={listOptions}
                />
              </>
            )}
          </Block>
        }
      />
    );
  },
  isEqual,
);

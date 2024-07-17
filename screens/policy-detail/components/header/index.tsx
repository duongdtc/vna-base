import {
  ActionSheet,
  Block,
  Button,
  NormalHeader,
  Text,
  showModalConfirm,
} from '@vna-base/components';
import { OptionData } from '@vna-base/components/action-sheet/type';
import { goBack } from '@navigation/navigation-service';
import { selectPolicyDetail } from '@vna-base/redux/selector';
import { policyActions } from '@vna-base/redux/action-slice';
import { PolicyDetailForm } from '@vna-base/screens/policy-detail/type';
import { HitSlop, dispatch } from '@vna-base/utils';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { useFormContext, useFormState } from 'react-hook-form';
import { useSelector } from 'react-redux';

type Props = {
  policyId: string | undefined;
  openHistory: () => void;
};

const options: Array<OptionData> = [
  {
    t18n: 'booking:view_history',
    key: 'VIEW_HISTORY',
    icon: 'history_outline',
  },
  {
    t18n: 'policy_detail:delete_service',
    key: 'DELETE',
    icon: 'trash_2_fill',
  },
];

export const Header = memo(({ policyId, openHistory }: Props) => {
  const actionSheetRefs = useRef<ActionSheet>(null);
  const { handleSubmit } = useFormContext<PolicyDetailForm>();
  const { isDirty } = useFormState<PolicyDetailForm>();
  const { Visible } = useSelector(selectPolicyDetail);

  const listOption = useMemo(() => {
    const temp = [...options];

    if (!Visible) {
      temp[1] = {
        t18n: 'policy_detail:restore',
        key: 'RESTORE',
        icon: 'undo_outline',
      };
    }

    return temp;
  }, [Visible]);

  const submit = useCallback(() => {
    handleSubmit(form => {
      if (policyId) {
        //update
        dispatch(
          policyActions.updatePolicy(form, isSuccess => {
            if (isSuccess) {
              goBack();
            }
          }),
        );
      } else {
        //create
        dispatch(
          policyActions.createPolicy(form, isSuccess => {
            if (isSuccess) {
              goBack();
            }
          }),
        );
      }
    })();
  }, [handleSubmit, policyId]);

  const onPressOption = (item: OptionData) => {
    switch (item.key) {
      case 'VIEW_HISTORY':
        openHistory();

        break;

      case 'RESTORE':
        showModalConfirm({
          t18nTitle: 'policy_detail:restore',
          t18nSubtitle: 'policy_detail:r_u_restore',
          t18nCancel: 'common:cancel',
          t18nOk: 'common:delete',
          themeColorCancel: 'neutral50',
          themeColorTextCancel: 'neutral900',
          themeColorOK: 'primary500',
          onOk: () => {
            dispatch(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              policyActions.restorePolicy(policyId!, isSuccess => {
                if (isSuccess) {
                  goBack();
                }
              }),
            );
          },
          flexDirection: 'row',
        });

        break;

      case 'DELETE':
        showModalConfirm({
          t18nTitle: 'policy_detail:delete',
          t18nSubtitle: 'policy_detail:r_u_sure',
          t18nCancel: 'common:cancel',
          t18nOk: 'common:delete',
          themeColorCancel: 'neutral50',
          themeColorTextCancel: 'neutral900',
          themeColorOK: 'error500',
          onOk: () => {
            dispatch(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              policyActions.deletePolicy(policyId!, isSuccess => {
                if (isSuccess) {
                  goBack();
                }
              }),
            );
          },
          flexDirection: 'row',
        });

        break;
    }
  };

  return (
    <>
      <NormalHeader
        colorTheme="neutral100"
        zIndex={0}
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
        rightContent={
          <Block flexDirection="row" columnGap={8}>
            {isDirty && (
              <Button
                hitSlop={{ ...HitSlop.LargeInset, right: policyId ? 0 : 16 }}
                type="common"
                size="small"
                leftIcon="saver_outline"
                textColorTheme="neutral900"
                leftIconSize={24}
                padding={4}
                onPress={submit}
              />
            )}
            {policyId && (
              <Button
                hitSlop={{ ...HitSlop.LargeInset, left: 0 }}
                type="common"
                size="small"
                leftIcon="more_vertical_outline"
                textColorTheme="neutral900"
                leftIconSize={24}
                padding={4}
                onPress={() => {
                  actionSheetRefs.current?.show();
                }}
              />
            )}
          </Block>
        }
        centerContent={
          <Text
            t18n="policy_detail:service_fee"
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
      />
      <ActionSheet
        type="select"
        ref={actionSheetRefs}
        onPressOption={onPressOption}
        option={listOption}
      />
    </>
  );
}, isEqual);

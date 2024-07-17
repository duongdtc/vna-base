/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { images } from '@assets/image';
import {
  ActionSheet,
  Block,
  Button,
  Icon,
  Image,
  NormalHeader,
  Text,
  showModalConfirm,
} from '@vna-base/components';
import { OptionData } from '@vna-base/components/action-sheet/type';
import { goBack } from '@navigation/navigation-service';
import { selectAgentDetailById } from '@vna-base/redux/selector';
import { agentActions } from '@vna-base/redux/action-slice';
import { listOptionUploadImg } from '@vna-base/screens/add-new-agent/type';
import { FormAgentDetail, listOption } from '@vna-base/screens/agent-detail/type';
import { translate } from '@vna-base/translations/translate';
import { HitSlop, dispatch } from '@vna-base/utils';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { Controller, useFormContext, useFormState } from 'react-hook-form';
import { Pressable } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';

export const HeaderAgentDetail = memo(
  ({ openBtsHistory }: { openBtsHistory: () => void }) => {
    const imgActionSheetRef = useRef<ActionSheet>(null);
    const actionSheetRef = useRef<ActionSheet>(null);

    const agentDetail = useSelector(selectAgentDetailById);

    const { control, handleSubmit, setValue } =
      useFormContext<FormAgentDetail>();

    const { isDirty, dirtyFields } = useFormState<FormAgentDetail>({
      control,
    });

    const _save = () => {
      handleSubmit(formData => {
        dispatch(
          agentActions.updateAgentDetail(
            agentDetail.Id!,
            formData,
            dirtyFields,
            () => {
              goBack();
            },
          ),
        );
      })();
    };

    const pickImg = () => {
      imgActionSheetRef.current?.show();
    };

    const onCamera = useCallback(() => {
      ImagePicker.openCamera({
        // cropping: true,
        multiple: false,
      }).then(image => {
        setValue('GeneralTab.Logo', image, {
          shouldDirty: true,
        });
      });
    }, [setValue]);

    const onGallery = useCallback(() => {
      ImagePicker.openPicker({
        mediaType: 'photo',
        // cropping: true,
      }).then(image => {
        setValue('GeneralTab.Logo', image, {
          shouldDirty: true,
        });
      });
    }, [setValue]);

    const onPressOptionUploadImg = useCallback(
      (item: OptionData) => {
        switch (item.key) {
          case 'TAKE_PICTURE':
            onCamera();
            break;

          case 'PICK_IMAGES':
            onGallery();
            break;
        }
      },
      [onCamera, onGallery],
    );

    const listOpt = useMemo(() => {
      if (agentDetail.Visible) {
        listOption[1].key = 'DELETE_AGENT';
        listOption[1].t18n = 'add_new_agent:delete_agent';
        listOption[1].icon = 'trash_2_fill';
        return listOption;
      } else {
        listOption[1].key = 'RESTORE';
        listOption[1].t18n = 'agent_detail:restore_agent';
        listOption[1].icon = 'refresh_outline';
        return listOption;
      }
    }, [agentDetail.Visible]);

    const _onDelete = useCallback(() => {
      dispatch(
        agentActions.deleteAgent(agentDetail.Id!, () => {
          goBack();
        }),
      );
    }, [agentDetail.Id]);

    const _onRestore = useCallback(() => {
      dispatch(
        agentActions.restoreAgent(agentDetail.Id!, () => {
          dispatch(agentActions.getAgentDetailById(agentDetail.Id!));
        }),
      );
    }, [agentDetail.Id]);

    const onPressOption = (item: OptionData) => {
      if (item.key === 'VIEW_ACTIVITY') {
        openBtsHistory();
        return;
      }

      if (item.key === 'DELETE_AGENT') {
        showModalConfirm({
          t18nTitle: 'order_detail:delete_data',
          t18nSubtitle: 'agent_detail:confirm_delete',
          t18nCancel: 'common:cancel',
          t18nOk: 'common:delete',
          themeColorCancel: 'neutral50',
          themeColorTextCancel: 'neutral900',
          themeColorOK: 'error500',
          onOk: _onDelete,
          flexDirection: 'row',
        });
        return;
      }

      if (item.key === 'RESTORE') {
        showModalConfirm({
          t18nTitle: 'agent_detail:restore_data',
          t18nSubtitle: 'agent_detail:confirm_restore',
          t18nCancel: 'common:cancel',
          t18nOk: 'common:confirm',
          themeColorCancel: 'neutral50',
          themeColorTextCancel: 'neutral900',
          themeColorTextOK: 'classicWhite',
          themeColorOK: 'success500',
          onOk: _onRestore,
          flexDirection: 'row',
        });
        return;
      }
    };

    const _leftContent = useMemo(() => {
      return (
        <Block flexDirection="row" alignItems="center" columnGap={4}>
          <Button
            hitSlop={HitSlop.Large}
            leftIcon="arrow_ios_left_outline"
            leftIconSize={24}
            textColorTheme="neutral900"
            onPress={() => {
              goBack();
            }}
            padding={4}
          />
          <Block>
            <Block flexDirection="row" alignItems="center" columnGap={8}>
              {/* //cmt: avatar image */}
              <Controller
                control={control}
                name="GeneralTab.Logo"
                render={({ field: { value } }) => {
                  return (
                    <Pressable onPress={pickImg}>
                      <Block
                        width={40}
                        height={40}
                        borderRadius={24}
                        overflow="hidden"
                        borderWidth={10}
                        alignItems="center"
                        justifyContent="center"
                        borderColorTheme="neutral200">
                        <Image
                          source={
                            // eslint-disable-next-line no-nested-ternary
                            value
                              ? typeof value === 'string'
                                ? value
                                : value.path
                              : images.default_avatar
                          }
                          style={{ width: 40, height: 40 }}
                          resizeMode="contain"
                        />
                      </Block>
                      <Block
                        position="absolute"
                        style={{ bottom: -1, right: -2 }}
                        borderRadius={10}
                        padding={1}
                        colorTheme="neutral100">
                        <Block
                          borderWidth={5}
                          borderColorTheme="neutral200"
                          borderRadius={10}
                          colorTheme="neutral100">
                          <Icon
                            icon="edit_2_outline"
                            size={11}
                            colorTheme="neutral900"
                          />
                        </Block>
                      </Block>
                    </Pressable>
                  );
                }}
              />

              <Block rowGap={2}>
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Text
                    text={agentDetail.AgentCode as string}
                    fontStyle="Title20Semi"
                    colorTheme="neutral900"
                  />
                  {!agentDetail.Visible && (
                    <Block
                      paddingHorizontal={6}
                      paddingVertical={2}
                      borderRadius={4}
                      colorTheme="error50">
                      <Text
                        text={translate('agent_detail:deleted')
                          .slice(0, 6)
                          .toUpperCase()}
                        fontStyle="Capture11Reg"
                        colorTheme="error500"
                        textAlign="center"
                      />
                    </Block>
                  )}
                </Block>
                <Block flexDirection="row" alignItems="center" columnGap={4}>
                  <Block
                    paddingHorizontal={4}
                    paddingVertical={2}
                    colorTheme="primary600"
                    borderRadius={4}>
                    <Text
                      text={agentDetail.CustomerID ?? 'N/A'}
                      colorTheme="classicWhite"
                      fontStyle="Capture11Bold"
                    />
                  </Block>
                  <Text
                    text={agentDetail.AgentName as string}
                    colorTheme="primary600"
                    fontStyle="Capture11Reg"
                  />
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      );
    }, [
      agentDetail.AgentCode,
      agentDetail.AgentName,
      agentDetail.CustomerID,
      agentDetail.Visible,
      control,
    ]);

    const _rightContent = () => (
      <Block flexDirection="row" alignItems="center" columnGap={8}>
        {isDirty && (
          <Button
            type="common"
            size="small"
            leftIcon="saver_outline"
            textColorTheme="neutral900"
            leftIconSize={24}
            padding={4}
            onPress={_save}
          />
        )}
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
      </Block>
    );

    return (
      <>
        <NormalHeader
          colorTheme="neutral100"
          leftContent={_leftContent}
          rightContent={_rightContent()}
          zIndex={0}
        />
        <ActionSheet
          type="select"
          typeBackDrop="gray"
          ref={actionSheetRef}
          onPressOption={onPressOption}
          option={listOpt}
        />
        <ActionSheet
          type="select"
          typeBackDrop="gray"
          ref={imgActionSheetRef}
          onPressOption={onPressOptionUploadImg}
          option={listOptionUploadImg}
        />
      </>
    );
  },
  isEqual,
);

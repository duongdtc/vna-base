import { Block } from '@vna-base/components/block';
import { BottomSheet } from '@vna-base/components/bottom-sheet';
import { TextInput } from '@vna-base/components/text-input';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { ActiveOpacity } from '@utils';
import React, { memo, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { TouchableOpacity } from 'react-native';
import { AccessoryKeyboardProps } from './type';

export const AccessoryKeyboard = memo((props: AccessoryKeyboardProps) => {
  const { children, disable, ...textInputProps } = props;
  const normalRef = useRef<BottomSheetModalMethods>(null);

  return (
    <>
      <TouchableOpacity
        disabled={disable}
        activeOpacity={ActiveOpacity}
        onPress={() => {
          normalRef.current?.present();
        }}>
        {children}
      </TouchableOpacity>
      <BottomSheet
        type="normal"
        typeBackDrop="gray"
        ref={normalRef}
        showIndicator={false}
        header={<Block />}
        enablePanDownToClose={false}
        enableOverDrag={false}>
        <Block padding={12} colorTheme="neutral100">
          <TextInput
            {...textInputProps}
            autoFocus
            onBlur={() => {
              normalRef.current?.dismiss();
            }}
            returnKeyType="done"
          />
        </Block>
      </BottomSheet>
    </>
  );
}, isEqual);

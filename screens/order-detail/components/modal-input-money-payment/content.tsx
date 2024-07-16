import { Block, Icon, Text } from '@vna-base/components';
import { I18nKeys } from '@translations/locales';
import { translate } from '@vna-base/translations/translate';
import { convertStringToNumber, scale } from '@vna-base/utils';
import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Pressable, TextInput } from 'react-native';
import { ModalCustomPicker } from '../modal-custom-picker';
import { ModalCustomPickerRef } from '../modal-custom-picker/type';
import { listCurrency } from '../tab-contents/components/tab-payment/type';
import { useStyles } from './styles';
import { ModalInputMoneyPaymentProps } from './type';

type Props = {
  inputAndOption: {
    money: string;
    curr: string;
  };
  handleDone: (money: string, currency: string) => void;
};

export const Content = ({
  inputAndOption,
  handleDone,
}: Omit<
  ModalInputMoneyPaymentProps,
  't18nTitle' | 'handleDone' | 'snapPoints'
> &
  Props) => {
  const styles = useStyles();

  const actionSheetRef = useRef<ModalCustomPickerRef>(null);

  const [money, setMoney] = useState<string>(inputAndOption.money.toString());
  const [curr, setCurrency] = useState<string>(inputAndOption.curr);

  const _onShowOption = () => {
    actionSheetRef.current?.present(curr);
  };

  const onPressOption = (val: string | null) => {
    setCurrency(val!);
  };

  const _onPressConfirm = () => {
    handleDone(money, curr);
  };

  // useAvoidSoftInput();

  return (
    <Block flex={1} paddingVertical={12} paddingHorizontal={16}>
      <KeyboardAvoidingView behavior="position">
        <Block flexDirection="row" alignItems="center" columnGap={12}>
          <Block flex={1}>
            <TextInput
              style={styles.inputPrice}
              value={money}
              onChangeText={txt =>
                setMoney(convertStringToNumber(txt).currencyFormat())
              }
              keyboardType="numeric"
              placeholder={translate('order_detail:plh_input-money')}
            />
          </Block>
          <Block
            flex={1}
            maxWidth={scale(100)}
            maxHeight={scale(48)}
            borderWidth={10}
            padding={12}
            borderColorTheme="neutral300"
            borderRadius={8}>
            <Pressable onPress={_onShowOption}>
              <Block
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between">
                <Text
                  text={curr ?? translate('common:select')}
                  fontStyle="Body16Reg"
                  colorTheme="neutral600"
                />
                <Icon
                  icon="arrow_ios_down_fill"
                  size={24}
                  colorTheme="neutral900"
                />
              </Block>
            </Pressable>
          </Block>
        </Block>
        <Block
          marginTop={12}
          maxHeight={44}
          borderRadius={8}
          alignItems="center"
          justifyContent="center"
          colorTheme="primary600">
          <Pressable style={styles.btnSearch} onPress={_onPressConfirm}>
            <Block
              flex={1}
              borderRadius={8}
              alignItems="center"
              justifyContent="center"
              colorTheme="primary600">
              <Text
                t18n="common:confirm"
                fontStyle="Title16Bold"
                colorTheme="classicWhite"
              />
            </Block>
          </Pressable>
        </Block>
      </KeyboardAvoidingView>

      <ModalCustomPicker
        ref={actionSheetRef}
        data={listCurrency}
        snapPoints={['30%']}
        showCloseButton={false}
        showIndicator={true}
        handleDone={onPressOption}
        t18nTitle={undefined as unknown as I18nKeys}
      />
    </Block>
  );
};

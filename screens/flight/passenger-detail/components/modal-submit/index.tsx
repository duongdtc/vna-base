import { Block, Button, Modal, TerminalView } from '@vna-base/components';
import { PREFIX_BOOKING_XLSX_NAME } from '@env';
import {
  ModalSubmitProps,
  ModalSubmitRef,
  PassengerForm,
} from '@vna-base/screens/flight/type';
import { ModalMinWidth } from '@vna-base/utils';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { useFormContext } from 'react-hook-form';
import { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { PreviewInfo } from './preview-info';

export const ModalSubmit = forwardRef<ModalSubmitRef, ModalSubmitProps>(
  ({ onSubmit, onCancel }, ref) => {
    // const styles = useStyles();
    const [isVisible, setIsVisible] = useState(false);

    const { getValues } = useFormContext<PassengerForm>();

    // const flights = useWatch({
    //   control,
    //   name: 'FLights',
    // });

    // const _option = useMemo(() => {
    //   if (flights.length === 1) {
    //     return SubmitOptions.filter(
    //       item => item.key !== 'BookEachLegSeparately',
    //     );
    //   } else {
    //     return SubmitOptions;
    //   }
    // }, [flights.length]);

    const _onCancel = useCallback(() => {
      setIsVisible(false);
      onCancel?.();
    }, []);

    const _onOk = useCallback(() => {
      setIsVisible(false);
      onSubmit();
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        show: () => {
          setIsVisible(true);
        },
      }),
      [],
    );

    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={_onCancel}
        onBackButtonPress={_onCancel}
        entering={SlideInDown}
        exiting={SlideOutDown}>
        <Block
          colorTheme="neutral100"
          borderRadius={12}
          minWidth={ModalMinWidth}
          alignSelf="center">
          <Block
            flexDirection="row"
            colorTheme="neutral10"
            overflow="hidden"
            borderTopRadius={10}
            margin={2}
            maxHeight={400}
            borderBottomRadius={8}>
            <TerminalView prefixExportName={PREFIX_BOOKING_XLSX_NAME}>
              <PreviewInfo form={getValues()} />
            </TerminalView>
          </Block>

          {/* <Block paddingTop={10} paddingHorizontal={16} paddingBottom={12}>
            {_option.map(item => (
              <Controller
                key={item.key}
                control={control}
                name={`SubmitOption.${item.key}`}
                render={({ field: { onChange, value } }) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={ActiveOpacity}
                      style={styles.itemContainer}
                      onPress={() => {
                        onChange(!value);
                      }}>
                      <Text
                        t18n={item.t18n}
                        fontStyle="Body16Reg"
                        colorTheme="neutral900"
                      />
                      <Switch value={value} disable opacity={1} />
                    </TouchableOpacity>
                  );
                }}
              />
            ))}
          </Block> */}

          <Block
            flexDirection="row"
            alignItems="center"
            padding={12}
            columnGap={8}>
            <Block flex={1}>
              <Button
                onPress={_onCancel}
                fullWidth
                t18n="common:cancel"
                textColorTheme="neutral100"
                type="classic"
                size="medium"
              />
            </Block>
            <Block flex={1}>
              <Button
                onPress={_onOk}
                fullWidth
                size="medium"
                t18n="input_info_passenger:submit"
                type="common"
                textColorTheme="white"
                buttonColorTheme="primaryColor"
              />
            </Block>
          </Block>
        </Block>
      </Modal>
    );
  },
);

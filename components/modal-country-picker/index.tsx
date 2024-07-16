import { BottomSheet } from '@vna-base/components';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { SnapPoint } from '@vna-base/utils';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { CountryCode } from '@services/realm/models';
import { Content } from './content';
import { ModalCountryPickerProps, ModalCountryPickerRef } from './type';

export const ModalCountryPicker = forwardRef<
  ModalCountryPickerRef,
  ModalCountryPickerProps
>((props, ref) => {
  const { handleDone, t18nTitle, showDialCode, isCanReset = false } = props;
  const normalRef = useRef<BottomSheetModal>(null);

  const [selectedCountry, setSelectedCountry] = useState<CountryCode>();

  useImperativeHandle(
    ref,
    () => ({
      present: (selected?: CountryCode | undefined) => {
        setSelectedCountry(selected);
        normalRef.current?.present();
      },
    }),
    [],
  );
  const _handleDone = (country: CountryCode) => {
    normalRef.current?.dismiss();
    handleDone(country);
  };

  const _cancelSelectedCountry = useCallback(() => {
    handleDone(undefined);
    normalRef.current?.dismiss();
  }, []);

  return (
    <BottomSheet
      type="normal"
      typeBackDrop="gray"
      ref={normalRef}
      showIndicator={false}
      enablePanDownToClose={false}
      useDynamicSnapPoint={false}
      enableOverDrag={false}
      snapPoints={[SnapPoint.Full]}
      t18nDone={isCanReset ? 'common:reset' : undefined}
      onDone={_cancelSelectedCountry}
      t18nTitle={t18nTitle}>
      <Content
        selectedCountry={selectedCountry}
        handleDone={_handleDone}
        showDialCode={showDialCode}
      />
    </BottomSheet>
  );
});

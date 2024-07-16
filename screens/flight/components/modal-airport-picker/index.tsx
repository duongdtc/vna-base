import { BottomSheet } from '@vna-base/components';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Airport } from '@redux/type';
import {
  AirportPickerContext as AirportPickerContextType,
  Flight,
  ModalAirportPickerRef,
} from '@vna-base/screens/flight/type';
import { AirportRealm, CountryRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { I18nKeys } from '@translations/locales';
import { SnapPoint } from '@vna-base/utils';
import React, {
  createContext,
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Content } from './content';

export const AirportPickerContext = createContext<AirportPickerContextType>({
  showModalAirportPicker: () => {},
  closeModalAirportPicker: () => {},
});

export const ModalAirportPicker = memo(
  forwardRef<ModalAirportPickerRef>((_, ref) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const onSubmit = useRef<any>(null);

    const [t18nTitle, setT18nTitle] = useState<I18nKeys>('common:back');
    const [ignoreData, setIgnoreData] = useState<Flight>();

    useImperativeHandle(ref, () => ({
      present: data => {
        setT18nTitle(data.t18nTitle);
        setIgnoreData(data?.dataItemIgnore);
        onSubmit.current = data.onSubmit;
        bottomSheetRef.current?.present();
      },
      dismiss: () => bottomSheetRef.current?.dismiss(),
      close: () => bottomSheetRef.current?.close(),
    }));

    const _onPressItem = (data: Airport | AirportRealm) => {
      const airport = data;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      if (!airport?.Country) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        airport.Country = realmRef.current?.objectForPrimaryKey<CountryRealm>(
          CountryRealm.schema.name,
          airport.CountryCode,
        );
      }

      onSubmit.current(airport as Airport);
      bottomSheetRef.current?.close();
    };

    return (
      <BottomSheet
        dismissWhenClose={true}
        type="normal"
        typeBackDrop="gray"
        ref={bottomSheetRef}
        enablePanDownToClose={false}
        useDynamicSnapPoint={false}
        snapPoints={[SnapPoint.Full]}
        t18nTitle={t18nTitle}
        showIndicator={false}>
        <Content ignoreData={ignoreData} onPressItem={_onPressItem} />
      </BottomSheet>
    );
  }),
  () => true,
);

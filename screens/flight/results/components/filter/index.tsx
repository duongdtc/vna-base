/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Content } from '@screens/flight/results/components/filter/content';
import { createStyleSheet, useStyles } from '@theme';
import { BottomSheet } from '@vna-base/components';
import { selectFilterForm } from '@vna-base/redux/selector';
import { FilterForm } from '@vna-base/screens/flight/type';
import { ActiveOpacity, SnapPoint } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { memo, PropsWithChildren, useEffect, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { useForm } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { UnistylesRuntime } from 'react-native-unistyles';
import { useSelector } from 'react-redux';
import { useFilterContext } from '../filter-provider';

export const Filter = memo(({ children }: PropsWithChildren) => {
  const { styles } = useStyles(styleSheet);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { filterFlight } = useFilterContext();

  const defaultFilterForm = useSelector(selectFilterForm);

  const formMethod = useForm<FilterForm>();

  const setValues = (form: FilterForm | undefined) => {
    if (!isEmpty(form)) {
      Object.keys(form).forEach(key => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        formMethod.setValue(key, form[key]);
      });
    }
  };

  useEffect(() => {
    setValues(defaultFilterForm);
  }, [defaultFilterForm]);

  const submit = () => {
    formMethod.handleSubmit(data => {
      filterFlight(data);
    })();
  };

  const onDone = () => {
    submit();
    bottomSheetRef.current?.close();
  };

  const reset = () => {
    setValues(defaultFilterForm!);

    onDone();
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          bottomSheetRef.current?.present();
        }}
        activeOpacity={ActiveOpacity}
        style={styles.btnFooterContainer}>
        {children}
      </TouchableOpacity>
      <BottomSheet
        snapPoints={[SnapPoint.Full]}
        type="normal"
        ref={bottomSheetRef}
        useDynamicSnapPoint={false}
        enablePanDownToClose={false}
        t18nTitle="common:_filter"
        showIndicator={false}
        onPressBackDrop={submit}
        t18nDone="common:reset"
        onDone={reset}
        typeBackDrop="gray">
        <Content formMethod={formMethod} onDone={onDone} />
      </BottomSheet>
    </>
  );
}, isEqual);

const styleSheet = createStyleSheet(({ colors, spacings, shadows }) => ({
  container: {
    backgroundColor: colors.neutral10,
    flex: 1,
  },
  btnFooterContainer: {
    flex: 1,
    paddingVertical: spacings[8],
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacings[8],
  },
  contentContainerScrollView: {
    paddingBottom: spacings[12],
  },
  footerContainer: {
    paddingBottom: UnistylesRuntime.insets.bottom,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral10,
    ...shadows.main,
  },
  btn: { margin: spacings[12] },
}));

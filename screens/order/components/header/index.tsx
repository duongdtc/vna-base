import { images } from '@assets/image';
import { Button, Image, NormalHeaderGradient, showToast } from '@vna-base/components';
import { useDrawer } from '@navigation/navigation-service';
import { orderActions } from '@vna-base/redux/action-slice';
import { FilterForm } from '@vna-base/screens/order/type';
import { ColorLight } from '@theme/color';
import { HitSlop, dispatch, getState } from '@vna-base/utils';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useStyles } from './styles';

export const Header = () => {
  const { open } = useDrawer();
  const styles = useStyles();

  const { getValues } = useFormContext<FilterForm>();

  const exportExcel = () => {
    const { list } = getState('order').resultFilter;
    if (list && list.length > 0) {
      dispatch(orderActions.exportExcel(getValues()));
    } else {
      showToast({
        type: 'error',
        t18n: 'order:no_order',
      });
    }
  };

  return (
    <NormalHeaderGradient
      zIndex={99}
      leftContent={
        <Button
          hitSlop={HitSlop.Large}
          leftIcon="menu_2_outline"
          leftIconSize={24}
          textColorTheme="classicWhite"
          onPress={open}
          padding={4}
        />
      }
      centerContent={
        <Image
          source={images.logo}
          style={styles.logo}
          resizeMode="center"
          tintColor={ColorLight.classicWhite}
        />
      }
      rightContent={
        <Button
          hitSlop={HitSlop.Large}
          leftIcon="excel_fill"
          leftIconSize={24}
          textColorTheme="classicWhite"
          padding={4}
          onPress={exportExcel}
        />
      }
    />
  );
};

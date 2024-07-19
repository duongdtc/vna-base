import { images } from '@assets/image';
import { navigate } from '@navigation/navigation-service';
import { APP_SCREEN } from '@utils';
import { Button, Image, NormalHeaderGradient } from '@vna-base/components';
import React from 'react';
import { useStyles } from './styles';

export const Header = () => {
  const styles = useStyles();

  // const { getValues } = useFormContext<FilterForm>();

  // const exportExcel = () => {
  //   const { list } = getState('bookings').resultFilter;
  //   if (list && list.length > 0) {
  //     dispatch(bookingActions.exportExcel(getValues()));
  //   } else {
  //     showToast({
  //       type: 'error',
  //       t18n: 'order:no_order',
  //     });
  //   }
  // };

  return (
    <NormalHeaderGradient
      gradientType="gra1"
      leftContent={
        <Image source={images.logo} style={styles.logo} resizeMode="cover" />
      }
      rightContent={
        <Button
          leftIcon="menu_2_outline"
          leftIconSize={24}
          padding={4}
          onPress={() => {
            navigate(APP_SCREEN.MENU);
          }}
          textColorTheme="white"
        />
      }
    />
  );
};

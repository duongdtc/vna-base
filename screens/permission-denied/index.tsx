import {
  Block,
  Button,
  Image,
  NormalHeader,
  Screen,
  Text,
} from '@vna-base/components';
import React from 'react';
import { useStyles } from './styles';
import { goBack } from '@navigation/navigation-service';
import { images } from '@assets/image';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const PermissionDenied = ({
  route,
}: NativeStackScreenProps<
  RootStackParamList,
  APP_SCREEN.PERMISSION_DENIED
>) => {
  const styles = useStyles();
  const isShowBackBtn = route.params?.isShowBackBtn;

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        colorTheme="neutral100"
        leftContent={
          isShowBackBtn ? (
            <Button
              leftIcon="arrow_ios_left_outline"
              leftIconSize={24}
              textColorTheme="neutral900"
              onPress={() => {
                goBack();
              }}
              padding={4}
            />
          ) : (
            <Block height={32} width={32} />
          )
        }
      />
      <Block flex={1} justifyContent="center" alignItems="center" rowGap={16}>
        <Image
          source={images.emptyListFlight}
          resizeMode="contain"
          containerStyle={styles.img}
        />
        <Text
          t18n="common:permission_denied"
          fontStyle="Title20Semi"
          colorTheme="neutral900"
        />
      </Block>
    </Screen>
  );
};

import React, { memo, useCallback } from 'react';
import { Block, Button, Text } from '@vna-base/components';
import isEqual from 'react-fast-compare';
import { Alert, Linking } from 'react-native';

export const Notification = memo(({ content }: { content: any }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(content?.url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(content?.url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${content?.url}`);
    }
  }, [content]);

  return (
    <Block
      borderRadius={8}
      padding={12}
      colorTheme="neutral200"
      alignItems="center"
      marginHorizontal={16}
      marginBottom={16}
      flexDirection="row">
      <Button
        leftIcon="shield_fill"
        leftIconSize={26}
        padding={4}
        disabled
        textColorTheme="neutral900"
      />
      <Block flex={1}>
        <Text
          text={content?.title}
          fontStyle="Body12Reg"
          colorTheme="neutral900"
        />
        <Text fontStyle="Body12Reg" colorTheme="neutral900">
          Nhấn để xem chi tiết{' '}
          <Text
            onPress={handlePress}
            text="Xem chi tiết"
            fontStyle="Body14Bold"
            colorTheme="primary500"
          />
        </Text>
      </Block>
      <Button
        leftIcon="close_outline"
        textColorTheme="neutral900"
        leftIconSize={24}
        padding={0}
      />
    </Block>
  );
}, isEqual);

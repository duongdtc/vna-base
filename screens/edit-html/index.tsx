import {
  RichText,
  Toolbar,
  useEditorBridge,
  useEditorContent,
} from '@10play/tentap-editor';
import { Button, Text } from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { BlurView } from '@react-native-community/blur';
import { HitSlop, delay } from '@vna-base/utils';
import { APP_SCREEN, RootStackParamList } from '@utils';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StatusBar, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { useStyles } from './styles';

export const EditHTML = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.EDIT_HTML>) => {
  const styles = useStyles();
  const { onDone, t18n, initValue, sharedTransitionTag } = route.params;

  const [isTransitionDone, setIsTransitionDone] = useState(false);

  const editor = useEditorBridge({
    avoidIosKeyboard: true,
  });

  const content = useEditorContent(editor, { type: 'html' });

  const submit = () => {
    onDone(content ?? '');
    goBack();
  };

  useEffect(() => {
    let setInitValueTimeId: NodeJS.Timeout | null = null;
    const mountTimeId = setTimeout(() => {
      setIsTransitionDone(true);
    }, 400);

    if (initValue !== undefined) {
      setInitValueTimeId = setTimeout(async () => {
        editor.setContent(initValue);
        await delay(200);
        editor.focus();
      }, 800);
    }

    return () => {
      clearTimeout(mountTimeId);
      if (setInitValueTimeId !== null) {
        clearTimeout(setInitValueTimeId);
      }
    };
  }, []);

  // render
  return (
    <BlurView style={styles.container} blurType={'dark'} blurAmount={1}>
      <StatusBar barStyle={'dark-content'} />
      <Animated.View
        style={styles.editContainer}
        sharedTransitionTag={sharedTransitionTag}>
        {isTransitionDone && (
          <View style={styles.headerContainer}>
            <Text
              t18n={t18n}
              colorTheme="classicBlack"
              fontStyle={'Title16Semi'}
            />
            <Button
              leftIcon="close_fill"
              textColorTheme="classicBlack"
              leftIconSize={20}
              padding={0}
              hitSlop={HitSlop.Large}
              onPress={submit}
            />
          </View>
        )}
        {isTransitionDone && (
          <RichText
            editor={editor}
            onError={e => {
              console.log('error :>> ', e.nativeEvent.title);
            }}
          />
        )}
      </Animated.View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
        }}>
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </BlurView>
  );
};

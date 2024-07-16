/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Block } from '@vna-base/components/block';
import { LazyPlaceholder } from '@vna-base/components/lazy-placeholder';
import { I18nKeys } from '@translations/locales';
import { LanguageSystem, SnapPoint, WindowWidth } from '@vna-base/utils';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabView,
} from 'react-native-tab-view';

import { BottomSheet } from '@vna-base/components';
import { NormalRef } from '@vna-base/components/bottom-sheet/type';
import {
  ConfigEmailForm,
  PreviewEmailBottomSheetRef,
} from '@vna-base/screens/config-email/type';
import { LanguageTab } from './language-tab';
import { TabBar } from './tab-bar';
import { useSelector } from 'react-redux';
import { selectConfigEmailLanguages } from '@redux-selector';

export const PreviewEmailBottomSheet = forwardRef<
  PreviewEmailBottomSheetRef,
  any
>((_, ref) => {
  const languages = useSelector(selectConfigEmailLanguages);
  const previewTicketBTSRef = useRef<NormalRef>(null);
  const [index, setIndex] = useState<number>(0);

  const [formData, setFormData] = useState<ConfigEmailForm>(
    {} as ConfigEmailForm,
  );

  useImperativeHandle(
    ref,
    () => ({
      present: data => {
        previewTicketBTSRef.current?.present();
        setFormData(data);
      },
    }),
    [],
  );

  const routes = useMemo(() => {
    const r: Array<{ key: LanguageSystem; t18n: I18nKeys }> = Object.values(
      languages,
    ).map(lng => ({
      key: lng.key,
      t18n: lng.t18n,
    }));

    return r;
  }, [languages]);

  const renderScene = useCallback(
    ({
      route,
    }: SceneRendererProps & {
      route: Route;
    }) => (
      <LanguageTab
        {...languages[route.key as LanguageSystem]}
        {...formData}
        language={route.key as LanguageSystem}
      />
    ),
    [formData, languages],
  );

  const renderTabBar = useCallback(
    (
      props: SceneRendererProps & {
        navigationState: NavigationState<Route>;
      },
    ) => <TabBar {...props} />,
    [],
  );

  return (
    <BottomSheet
      paddingBottom
      enablePanDownToClose={false}
      enableOverDrag={false}
      ref={previewTicketBTSRef}
      type="normal"
      snapPoints={[SnapPoint.Full]}
      useDynamicSnapPoint={false}
      showCloseButton={true}
      t18nTitle="common:preview_email">
      <Block flex={1} colorTheme="neutral50">
        {Object.values(languages).length < 2 ? (
          <LanguageTab
            {...Object.values(languages)?.[0]}
            {...formData}
            language={Object.keys(languages)?.[0] as LanguageSystem}
          />
        ) : (
          <TabView
            navigationState={{ index, routes }}
            lazy
            swipeEnabled={false}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={renderTabBar}
            initialLayout={{ width: WindowWidth }}
            renderLazyPlaceholder={() => <LazyPlaceholder height={160} />}
          />
        )}
      </Block>
    </BottomSheet>
  );
});

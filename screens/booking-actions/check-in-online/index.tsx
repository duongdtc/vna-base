import { Block, Screen } from '@vna-base/components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingRealm } from '@services/realm/models/booking';
import { useObject } from '@services/realm/provider';
import { ColorLight } from '@theme/color';
import { CHECK_IN_ONLINE_URL, scale, System } from '@vna-base/utils';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, NativeSyntheticEvent } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { WebViewNavigationEvent } from 'react-native-webview/lib/RNCWebViewNativeComponent';
import { AnimatedHeader, Footer } from './components';
import { useStyles } from './styles';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const HEADER_HEIGHT = scale(56);
export const CheckInOnline = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.CheckInOnline>) => {
  const { id, system } = route.params;
  const styles = useStyles();
  const { top } = useSafeAreaInsets();

  const webviewRef = useRef<WebView>(null);
  const preY = useRef(0);

  const bookingDetail = useObject<BookingRealm>(BookingRealm.schema.name, id);

  const [webviewState, setWebviewState] = useState<
    Pick<WebViewNavigationEvent, 'canGoBack' | 'canGoForward' | 'loading'>
  >({ canGoBack: false, canGoForward: false, loading: false });

  const headerHeight = useMemo(() => top + HEADER_HEIGHT, [top]);

  const headerSharedValue = useSharedValue(1);

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    if (event.nativeEvent) {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        switch (data.topic) {
          case 'ERROR':
            console.log('Webview Error', data.message);
            break;

          default:
            break;
        }

        return;
      } catch (error) {}
    } else {
    }
  }, []);

  const onScroll = useCallback(
    (
      syntheticEvent: NativeSyntheticEvent<
        Readonly<{
          contentOffset: {
            y: number;
            x: number;
          };
        }>
      >,
    ) => {
      const {
        contentOffset: { y },
      } = syntheticEvent.nativeEvent;
      switch (true) {
        // cuộn lên thì hiện nút, ẩn calories
        case y > headerHeight && y - preY.current < -10:
          headerSharedValue.value = withTiming(1, {
            duration: 200,
          });

          break;

        // cuộn xuống thì ẩn nút, hiện calories
        case y > headerHeight && y - preY.current > 10:
          headerSharedValue.value = withTiming(0.7, {
            duration: 200,
          });

          break;

        // khi ở vị trí từ 0 -> headerHeight thì hiện cả 2
        case y >= 0 && y <= headerHeight:
          headerSharedValue.value = withTiming(1, {
            duration: 200,
          });

          break;
      }

      preY.current = y;
    },
    [headerHeight, headerSharedValue],
  );

  const INJECTED_JAVASCRIPT = useMemo(() => {
    if (id !== bookingDetail?.Id) {
      return '';
    }

    let script = '';

    switch (system) {
      case System.VN:
        script = `
        document.getElementById('mb-checkin-reservation-code').value = '${
          bookingDetail?.BookingCode ?? ''
        }';
        document.getElementById('mb-checkin-online-last-name').value = '${
          bookingDetail?.Passengers?.[0].Surname ?? ''
        }';
        document.querySelectorAll('label').forEach(function(label) {
          label.classList.add('move-top-label-active');
        });

        setTimeout(function() {
          document.getElementById('btnCheckInOnlineMobile').click();
        }, 1000);
        `;
        break;

      case System.VJ:
        script = `
        document.querySelector('input[name="reservationLocator"]').value = '${
          bookingDetail?.BookingCode ?? ''
        }';
        document.querySelector('input[name="contactFamilyName"]').value = '${
          bookingDetail?.Passengers?.[0].Surname ?? ''
        }';
        document.querySelector('input[name="contactMiddleGivenName"]').value = '${
          bookingDetail?.Passengers?.[0].GivenName ?? ''
        }';

        document.querySelectorAll('.MuiFormLabel-root.MuiInputLabel-root.MuiInputLabel-formControl').forEach(function(label) {
          label.setAttribute('data-shrink', true);
          label.classList.add('MuiInputLabel-shrink');
          label.classList.add('MuiFormLabel-filled');
          while (label.firstChild) {
            label.removeChild(label.firstChild);
          }
        });

        setTimeout(function() {
          document.querySelectorAll('.MuiButtonBase-root.MuiButton-root.MuiButton-text.jss395')[0].click();
        }, 1000);
        `;
        break;

      case System.VU:
        script = `
        setTimeout(function() {
          var inputPNRs = document.querySelectorAll('input[name="checkin-confirmation-number"]')
          inputPNRs[inputPNRs.length - 1].value = '${
            bookingDetail?.BookingCode ?? ''
          }'
          
          var inputLastNames = document.querySelectorAll('input[name="checkin-last-name"]')
          inputLastNames[inputLastNames.length - 1].value = '${
            bookingDetail?.Passengers?.[0].GivenName ?? ''
          }'
        }, 2000);
        `;
        break;

      case System.QH:
        script = `
        var checkInBtn = document.querySelector('button[class*="explore-check-in"]')
        if(checkInBtn){
          checkInBtn.click();
        }

        document.getElementById('reservationCodePopup').value = '${
          bookingDetail?.BookingCode ?? ''
        }';
        document.getElementById('lastNamePopup').value = '${
          bookingDetail?.Passengers?.[0].Surname ?? ''
        }';


        setTimeout(function() {
          document.querySelectorAll('.btn-bamboo.text-white.mb-0.font-weight-medium')[0].click();
        }, 1000);
        `;
        break;
    }

    return `(function addStyleToElements() {
        try{
          var style = document.createElement('style');
          style.innerHTML = \`
              body {
                  padding-top: ${headerHeight}px !important;
              }
          \`;
          document.head.appendChild(style);

          ${script}
    
        } catch (error) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ message:  error.message, topic: 'ERROR' }));
      }
      })();`;
  }, [bookingDetail, headerHeight, id, system]);

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <AnimatedHeader
        sharedValue={headerSharedValue}
        url={CHECK_IN_ONLINE_URL[system]}
        webviewRef={webviewRef}
      />
      {id === bookingDetail?.Id ? (
        <WebView
          ref={webviewRef}
          source={{
            uri: CHECK_IN_ONLINE_URL[system] ?? '',
          }}
          onScroll={onScroll}
          thirdPartyCookiesEnabled
          sharedCookiesEnabled
          style={{
            flex: 1,
          }}
          onMessage={handleMessage}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          onLoadStart={e => {
            setWebviewState({
              canGoBack: e.nativeEvent.canGoBack,
              canGoForward: e.nativeEvent.canGoForward,
              loading: e.nativeEvent.loading,
            });
          }}
          onLoadEnd={e => {
            setWebviewState({
              canGoBack: e.nativeEvent.canGoBack,
              canGoForward: e.nativeEvent.canGoForward,
              loading: e.nativeEvent.loading,
            });
          }}
        />
      ) : (
        <Block flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color={ColorLight.primary900} />
        </Block>
      )}

      <Footer
        sharedValue={headerSharedValue}
        url={CHECK_IN_ONLINE_URL[system]}
        webviewState={webviewState}
        webviewRef={webviewRef}
      />
    </Screen>
  );
};

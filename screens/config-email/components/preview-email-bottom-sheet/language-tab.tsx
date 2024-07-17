/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { selectConfigEmailTemplates } from '@vna-base/redux/selector';
import { LanguageTabProps } from '@vna-base/screens/config-email/type';
import { ObjectField, WIDTH_OF_PRINTER_PAGE, WindowWidth } from '@vna-base/utils';
import React, { memo, useEffect, useMemo, useState } from 'react';
import isEqual from 'react-fast-compare';
import { Alert } from 'react-native';
//@ts-ignore
import ImgToBase64 from 'react-native-image-base64';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { useSelector } from 'react-redux';

export const LanguageTab = memo((props: LanguageTabProps) => {
  const { bottom } = useSafeAreaInsets();
  const templates = useSelector(selectConfigEmailTemplates);

  const [webViewContentHeight, setWebViewContentHeight] = useState(
    (WindowWidth * 297) / 210,
  );

  const [ratioPixel, setRatioPixel] = useState(1);
  const [scale, setScale] = useState(1);
  const [logo, setLogo] = useState('');

  useEffect(() => {
    const getBase64 = async () => {
      //@ts-ignore
      const base64String: string = props.logo?.path
        ? //@ts-ignore
          await ImgToBase64.getBase64String(props.logo?.path)
        : '';

      setLogo(
        //@ts-ignore
        props.logo?.path
          ? //@ts-ignore
            `data:${props.logo?.mime};base64,${base64String}`
          : (props.logo as string),
      );
    };

    getBase64();
  }, []);

  const content = useMemo(
    () => `
      <!DOCTYPE html>
      <html>
      <head>
      </head>
      <body>
      ${templates[`${props.template}_${props.language}`] ?? ''}
      <script>

        function addStyleToElements() {
          try{

            var emailContentElement = document.getElementById('emailContent');
            if(emailContentElement){
              emailContentElement.style.width= '${WIDTH_OF_PRINTER_PAGE}px';
              emailContentElement.style.scale= ${scale};
              emailContentElement.style['margin-left']= '${
                (WIDTH_OF_PRINTER_PAGE * (scale - 1)) / 2
              }px';
              emailContentElement.style['margin-top']= '${
                (webViewContentHeight * (scale - 1)) / 2 + 10
              }px';
            }

            // hiển thị price
            var priceElement = document.getElementById('price');
            if (${!props.showPrice}) {
              priceElement?.remove()
            }

            // hiển thị mã đặt chỗ
            // Lấy tất cả các thẻ div có id là "bookingCode"
            var bookingCodeElements = document.querySelectorAll("#bookingCode");
            bookingCodeElements.forEach(function(bookingCodeDiv) {
              if (${!props.showPNR}) {
                bookingCodeDiv.innerHTML = "";
    
                bookingCodeDiv.textContent = "Đã xác nhận";
                bookingCodeDiv.style.textAlign = "right";
                bookingCodeDiv.style.color = "#228b22";
              }
            });

            //logo
            var logoContainerDiv = document.getElementById('logoContainer');
            if ( logoContainerDiv ) {
              if(${!!logo}){
                var newImg = document.createElement("img");
                newImg.src = '${logo}';
                newImg.alt = "Logo";
                newImg.style.maxWidth = "120px";
                newImg.style.height = "40px";
                newImg.style.objectFit = "contain";
                
                logoContainerDiv.innerHTML = "";
                logoContainerDiv.appendChild(newImg);
              } else {
                logoContainerDiv.innerHTML = ""
              }
            }

            // nối header
            var emailHeaderDiv = document.getElementById('emailHeader');
            if(${props.showHeader}){
              var emailHeaderElement = document.createElement('div');
              emailHeaderElement.innerHTML = \`${
                props.contents?.find(
                  ct => ct.ObjectField === ObjectField.Header,
                )?.Data
              }\`
              while (emailHeaderDiv.firstChild) {
                emailHeaderDiv.removeChild(emailHeaderDiv.firstChild);
              }
              if (emailHeaderDiv) {
                emailHeaderDiv.appendChild(emailHeaderElement);
              }
            } else {
              emailHeaderDiv.remove()
              logoContainerDiv?.remove()
            }

            // nối footer
            var emailFooterDiv = document.getElementById('emailFooter');
            if(${props.showFooter}){
              var emailFooterElement = document.createElement('div');
              emailFooterElement.innerHTML = \`${
                props.contents?.find(
                  ct => ct.ObjectField === ObjectField.Footer,
                )?.Data
              }\`
              while (emailFooterDiv.firstChild) {
                emailFooterDiv.removeChild(emailFooterDiv.firstChild);
              }
              if (emailFooterDiv) {
                emailFooterDiv.appendChild(emailFooterElement);
              }
            } else {
              emailFooterDiv?.remove()
            }

            window.ReactNativeWebView.postMessage(JSON.stringify({ height: document.getElementById('emailContent').offsetHeight, topic: 'TOPIC_WEB_VIEW_HEIGHT' }));
            window.ReactNativeWebView.postMessage(JSON.stringify({ width: document.body.offsetWidth, topic: 'TOPIC_WEB_VIEW_WIDTH' }));
          } catch (error) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ message:  error.message, topic: 'ERROR' }));
            console.log("🚀 ~ addStyleToElements ~ error:", error)
          }
        }

        addStyleToElements();
        
      </script>
      </body>
      </html>
      `,
    [
      logo,
      props.contents,
      props.language,
      props.showFooter,
      props.showHeader,
      props.showPNR,
      props.showPrice,
      props.template,
      scale,
      templates,
      webViewContentHeight,
    ],
  );

  const handleMessage = (event: WebViewMessageEvent) => {
    if (event.nativeEvent) {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        switch (data.topic) {
          case 'TOPIC_WEB_VIEW_HEIGHT':
            setWebViewContentHeight(data.height);
            break;

          case 'TOPIC_WEB_VIEW_WIDTH':
            setRatioPixel(data.width / WindowWidth);
            setScale((data.width - 24) / WIDTH_OF_PRINTER_PAGE);
            break;

          case 'ERROR':
            Alert.alert('Webview Error', data.message);
            break;

          default:
            break;
        }

        return;
      } catch (error) {}
    } else {
    }
  };

  const webViewHeight = useMemo(
    () => (webViewContentHeight * scale) / ratioPixel,
    [ratioPixel, scale, webViewContentHeight],
  );

  return (
    <BottomSheetScrollView
      contentContainerStyle={{ paddingBottom: bottom || 12 }}>
      <WebView
        originWhitelist={['*']}
        style={{
          width: WindowWidth,
          height: webViewHeight,
        }}
        source={{ html: content }}
        onMessage={handleMessage}
      />
    </BottomSheetScrollView>
  );
}, isEqual);

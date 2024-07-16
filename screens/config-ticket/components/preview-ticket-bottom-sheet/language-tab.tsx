/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { selectTicketTemplates } from '@redux-selector';
import { LanguageTabProps } from '@vna-base/screens/config-ticket/type';
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
  const templates = useSelector(selectTicketTemplates);

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

  const content = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
      </head>
      <body>
      ${templates[`${props.template}_${props.language}`]?.Content ?? ''}
      <script>

        function addStyleToElements() {
          try{

            // màu eTktBody
            var eTktBodyElement = document.getElementById('eTktBody');
            if (eTktBodyElement) {
              eTktBodyElement.style.width= '${WIDTH_OF_PRINTER_PAGE}px';
              eTktBodyElement.style.scale= ${scale};
              eTktBodyElement.style['margin-left']= '${
                (WIDTH_OF_PRINTER_PAGE * (scale - 1)) / 2
              }px';
              eTktBodyElement.style['margin-top']= '${
                (webViewContentHeight * (scale - 1)) / 2 + 10
              }px';
            }

            //màu main và chữ main
            var mainColorElements = document.querySelectorAll('.main-color');
            mainColorElements.forEach(function(element) {
                element.style.background = '${props.mainColor}';
                element.style.color = '${props.foreColor}';
            });

            // màu Booking code
            var pnrCodeElement = document.getElementById('pnrCode');
            if (pnrCodeElement) {
              pnrCodeElement.style.color = '${props.PNRColor}';
            }

            // nối header
            var headerDiv = document.getElementById('eTktHeader');
            var headerElement = document.createElement('div');
            headerElement.innerHTML = \`${
              props.contents?.find(ct => ct.ObjectField === ObjectField.Header)
                ?.Data
            }\`
            while (!!headerDiv && !!headerDiv.firstChild) {
              headerDiv.removeChild(headerDiv.firstChild);
            }
            if (headerDiv) {
              headerDiv.appendChild(headerElement);
            }

            // nối footer
            var footerDiv = document.getElementById('eTktFooter');
            var footerElement = document.createElement('div');
            footerElement.innerHTML = \`${
              props.contents?.find(ct => ct.ObjectField === ObjectField.Footer)
                ?.Data
            }\`
            while (!!footerDiv && !!footerDiv.firstChild) {
              footerDiv.removeChild(footerDiv.firstChild);
            }
            if (footerDiv) {
              footerDiv.appendChild(footerElement);
            }

            //nối remark
            var remarkDiv = document.getElementById('eTktRemark');
            var remarkElement = document.createElement('div');
            remarkElement.innerHTML = \`${
              props.contents?.find(ct => ct.ObjectField === ObjectField.Remark)
                ?.Data
            }\`
            while (!!remarkDiv && !!remarkDiv.firstChild) {
              remarkDiv.removeChild(remarkDiv.firstChild);
            }
            if (remarkDiv) {
              remarkDiv.appendChild(remarkElement);
            }

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


            // hiển thị số vé 
            if (${!props.showTicketNumber}) {
              // Lấy tất cả các thẻ div có id là "eTktNumber"
              var eTktNumberElements = document.querySelectorAll("#eTktNumber");
              eTktNumberElements.forEach(function(eTktNumberDiv) {
                 eTktNumberDiv.remove()
              });
              // Lấy tất cả các thẻ td có class là "eTktNumberLabel"
              var eTktNumberLabelElements = document.querySelectorAll(".eTktNumberLabel");
              eTktNumberLabelElements.forEach(function(eTktNumberLabelTd) {
                 eTktNumberLabelTd.remove()
              });
              // Lấy tất cả các thẻ td có class là "eTktNumberValue"
              var eTktNumberValueElements = document.querySelectorAll(".eTktNumberValue");
              eTktNumberValueElements.forEach(function(eTktNumberValueTd) {
                 eTktNumberValueTd.remove()
              });

            }

            window.ReactNativeWebView.postMessage(JSON.stringify({ height: !!eTktBodyElement? eTktBodyElement.offsetHeight : 0, topic: 'TOPIC_WEB_VIEW_HEIGHT' }));
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
      `;
  }, [
    logo,
    props.PNRColor,
    props.contents,
    props.foreColor,
    props.language,
    props.mainColor,
    props.showTicketNumber,
    props.template,
    scale,
    templates,
    webViewContentHeight,
  ]);

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

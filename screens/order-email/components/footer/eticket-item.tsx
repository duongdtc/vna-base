import { Block } from '@vna-base/components/block';
import { Icon } from '@vna-base/components/icon';
import { Text } from '@vna-base/components/text';
import { ETicket } from '@services/axios/axios-email';
import { WIDTH_OF_PRINTER_PAGE, WindowWidth } from '@vna-base/utils';
import React, { useMemo, useState } from 'react';
import { Pressable } from 'react-native';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { useStyles } from './styles';

const ID_OF_E_TICKET_CONTENT = 'eTicketContent';

export const ETicketItem = ({
  index,
  Passenger,
  Content,
  showHeader,
}: ETicket & { index: number; showHeader: boolean }) => {
  const styles = useStyles();

  const [isOpen, setIsOpen] = useState(index === 0);

  const [webViewContentHeight, setWebViewContentHeight] = useState(
    (WindowWidth * 297) / 210,
  );

  const [ratioPixel, setRatioPixel] = useState(1);
  const [scale, setScale] = useState(1);

  const content = useMemo(
    () => `
      <!DOCTYPE html>
      <html>
      <head>
      <style>
      #${ID_OF_E_TICKET_CONTENT} {
        width: ${WIDTH_OF_PRINTER_PAGE}px;
        scale: ${scale};
        margin-left: ${(WIDTH_OF_PRINTER_PAGE * (scale - 1)) / 2}px;
        margin-top: ${(webViewContentHeight * (scale - 1)) / 2 + 10}px;
        }
      </style>
      </head>
      <body>
      ${Content ?? ''}
      <script>
        window.ReactNativeWebView.postMessage(JSON.stringify({ height: document.getElementById('${ID_OF_E_TICKET_CONTENT}').offsetHeight, topic: 'TOPIC_WEB_VIEW_HEIGHT' }));
        window.ReactNativeWebView.postMessage(JSON.stringify({ width: document.body.offsetWidth, topic: 'TOPIC_WEB_VIEW_WIDTH' }));
      </script>
      </body>
      
      </html>
      
      `,
    [Content, scale, webViewContentHeight],
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
    <Block colorTheme="neutral50">
      {showHeader && (
        <Pressable
          onPress={() => {
            setIsOpen(!isOpen);
          }}
          style={styles.eticketHeader}>
          <Text
            text={Passenger ?? ''}
            fontStyle="Title16Semi"
            colorTheme="neutral900"
          />
          <Icon
            icon={isOpen ? 'arrow_ios_down_outline' : 'arrow_ios_up_outline'}
            size={24}
            colorTheme="neutral900"
          />
        </Pressable>
      )}
      <Block height={isOpen ? 'auto' : 0} overflow="hidden" paddingTop={2}>
        <WebView
          originWhitelist={['*']}
          style={{
            width: WindowWidth,
            height: webViewHeight,
          }}
          source={{ html: content }}
          onMessage={handleMessage}
        />
      </Block>
    </Block>
  );
};

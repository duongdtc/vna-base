import React, { forwardRef, useMemo, useState } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { WebViewAutoHeightProps } from './type';
import { TOPIC_WEB_VIEW_AUTO_HEIGHT, isSizeChanged, reduceData } from './utils';

export const WebViewAutoHeight = forwardRef<WebView, WebViewAutoHeightProps>(
  (props, ref) => {
    const { style, content, onMessage, ...subProps } = props;
    const [webViewHeight, setWebViewHeight] = useState(0);
    const [webViewWidth, setWebViewWidth] = useState(0);

    const _content = useMemo(
      () => reduceData(content, webViewWidth),
      [content, webViewWidth],
    );

    const handleMessage = (event: WebViewMessageEvent) => {
      if (event.nativeEvent) {
        try {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.topic !== TOPIC_WEB_VIEW_AUTO_HEIGHT) {
            onMessage && onMessage(event);
            return;
          }

          const { height } = data;

          isSizeChanged({
            height,
            previousHeight: webViewHeight,
          }) && setWebViewHeight(height);
        } catch (error) {
          onMessage && onMessage(event);
        }
      } else {
        onMessage && onMessage(event);
      }
    };

    return (
      <WebView
        onLayout={e => {
          setWebViewWidth(e.nativeEvent.layout.width);
        }}
        ref={ref}
        {...subProps}
        style={[style, { height: webViewHeight }]}
        originWhitelist={['*']}
        source={{ html: _content }}
        scrollEnabled={false}
        onMessage={handleMessage}
      />
    );
  },
);

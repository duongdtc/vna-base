import { WebViewAutoHeight } from '@vna-base/components/web-view-auto-height';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { selectEmail } from '@redux-selector';
import { useTheme } from '@theme';
import React, { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export const EmailTab = () => {
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();

  const { Content } = useSelector(selectEmail);

  const content = useMemo(
    () => `
      <!DOCTYPE html>
      <html>
      <head>
      <style>
        body {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: '400';
          line-height: 19px;
          font-style: normal;
          background-color: ${colors.neutral100}
        }
        p {
          color: ${colors.neutral900};
        }
        label {
          color: ${colors.neutral900};
        }
        #main_div {
          overflow: scroll
        }
      </style>
      </head>
      <body>
      <div id="main_div">
      ${Content ?? ''}
      </div>
      </body>
      </html>
      `,
    [Content, colors.neutral100, colors.neutral900],
  );

  return (
    <BottomSheetScrollView
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: 8 }}>
      <WebViewAutoHeight content={content} />
    </BottomSheetScrollView>
  );
};

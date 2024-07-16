import { Block, WebViewAutoHeight } from '@vna-base/components';
import { FareItemProps } from '@vna-base/screens/flight/type';
import { useTheme } from '@theme';
import React, { useMemo } from 'react';

export const CustomItem = ({ data }: FareItemProps) => {
  const { colors } = useTheme();

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
      #main_div {
        overflow: scroll
      }
    </style>
    </head>
    <body>
    <div id="main_div">
    ${data.ListRuleText?.[0] ?? ''}
    </div>
    </body>
    </html>
    `,
    [colors.neutral100, colors.neutral900, data.ListRuleText],
  );

  return (
    <Block paddingBottom={12} paddingHorizontal={12}>
      <WebViewAutoHeight content={content} />
    </Block>
  );
};

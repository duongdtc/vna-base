/* eslint-disable react/react-in-jsx-scope */
import { Text } from '@vna-base/components';
import { findAll } from 'highlight-words-core';
import { HighLightTextProps } from './type';

export const Highlighter = (props: HighLightTextProps) => {
  const {
    searchWords,
    textToHighlight,
    fontStyle,
    highlightStyle,
    style,
    colorTheme,
    highlightColorTheme,
  } = props;

  const chunks = findAll({
    searchWords,
    textToHighlight,
  });

  return (
    <Text fontStyle={fontStyle} style={style} colorTheme={colorTheme}>
      {chunks.map((chunk, index) => {
        const text = textToHighlight?.substr(
          chunk.start,
          chunk.end - chunk.start,
        );

        return !chunk.highlight ? (
          text
        ) : (
          <Text
            fontStyle={fontStyle}
            key={index}
            style={highlightStyle}
            colorTheme={highlightColorTheme}>
            {text}
          </Text>
        );
      })}
    </Text>
  );
};

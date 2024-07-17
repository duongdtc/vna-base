import {
  Block,
  Button,
  Icon,
  NormalHeader,
  Screen,
  Text,
} from '@vna-base/components';
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectDetailDBSContent } from '@vna-base/redux/selector';
import { dbsContentActions } from '@vna-base/redux/action-slice';
import { useTheme } from '@theme';
import { translate } from '@vna-base/translations/translate';
import { HitSlop, WindowWidth, dispatch } from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import RenderHTML, {
  HTMLContentModel,
  MixedStyleDeclaration,
  defaultHTMLElementModels,
} from 'react-native-render-html';
import { useSelector } from 'react-redux';
import { useStyles } from './style';
import dayjs from 'dayjs';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const DBSContentDetail = ({
  route,
}: NativeStackScreenProps<
  RootStackParamList,
  APP_SCREEN.DBS_CONTENT_DETAIL
>) => {
  const { colors } = useTheme();
  const styles = useStyles();
  const { id } = route.params;

  const content = useSelector(selectDetailDBSContent(id));

  useEffect(() => {
    if (isEmpty(content)) {
      dispatch(dbsContentActions.getDetailDBSContent(id));
    }
  }, [content, id]);

  const _renderRating = (rate: number) => {
    return [1, 2, 3, 4, 5].map((item, key) => {
      return (
        <Block key={key}>
          <Icon
            icon="star_fill"
            size={16}
            colorTheme={item < Math.round(rate) ? 'VU' : 'neutral600'}
          />
        </Block>
      );
    });
  };

  const customHTMLElementModels = {
    button: defaultHTMLElementModels.button.extend({
      contentModel: HTMLContentModel.textual,
      isVoid: false,
      tagName: 'button',
    }),
    label: defaultHTMLElementModels.label.extend({
      contentModel: HTMLContentModel.textual,
      isVoid: false,
      tagName: 'label',
    }),
    iframe: defaultHTMLElementModels.iframe.extend({
      contentModel: HTMLContentModel.textual,
      isVoid: false,
      tagName: 'iframe',
    }),
    img: defaultHTMLElementModels.img.extend({
      contentModel: HTMLContentModel.textual,
      isVoid: false,
      tagName: 'img',
    }),
  };

  const renderersProps = {
    img: {
      enableExperimentalPercentWidth: true,
    },
  };

  const tagsStyles: Record<string, MixedStyleDeclaration> = {
    body: {
      whiteSpace: 'normal',
      color: colors.neutral900,
    },
    p: {
      color: colors.neutral900,
      fontSize: 18,
    },
  };

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        shadow=".3"
        colorTheme="neutral100"
        leftContent={
          <Button
            hitSlop={HitSlop.Large}
            type="common"
            size="small"
            leftIcon="arrow_ios_left_fill"
            textColorTheme="neutral900"
            leftIconSize={24}
            padding={4}
            onPress={() => goBack()}
          />
        }
        centerContent={
          <Text
            t18n={'common:detail'}
            fontStyle="Title20Semi"
            colorTheme="neutral900"
          />
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <Text
          text={content?.Intro as string}
          fontStyle="Display24Bold"
          colorTheme="neutral900"
        />
        <Block
          marginVertical={12}
          flexDirection="row"
          alignItems="center"
          columnGap={10}>
          <Block flexDirection="row" alignItems="center" columnGap={4}>
            <Text
              t18n="common:rate"
              fontStyle="Body14Reg"
              colorTheme="neutral700"
            />
            {_renderRating((content?.Rate as number) + 1)}
          </Block>
          <Block
            width={6}
            height={6}
            borderRadius={4}
            colorTheme="neutral500"
          />
          <Block flexDirection="row" alignItems="center" columnGap={4}>
            <Text
              text={translate('flight:departure_day').split(' ')[0]}
              fontStyle="Body14Reg"
              colorTheme="neutral700"
            />
            <Text
              text={dayjs(content?.CreatedDate).format('DD/MM/YYYY')}
              fontStyle="Body14Reg"
              colorTheme="neutral700"
            />
          </Block>
        </Block>
        <RenderHTML
          contentWidth={WindowWidth}
          customHTMLElementModels={customHTMLElementModels}
          source={{ html: `<div>${content?.Html}</div>` }}
          renderersProps={renderersProps}
          tagsStyles={tagsStyles}
        />
      </ScrollView>
    </Screen>
  );
};

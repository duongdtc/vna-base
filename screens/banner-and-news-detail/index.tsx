import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { bs, createStyleSheet, useStyles } from '@theme';
import { APP_SCREEN, RootStackParamList } from '@utils';
import { Button, Icon, NormalHeader, Screen, Text } from '@vna-base/components';
import { dbsContentActions } from '@vna-base/redux/action-slice';
import { selectDetailDBSContent } from '@vna-base/redux/selector';
import { translate } from '@vna-base/translations/translate';
import { HitSlop, WindowWidth, dispatch, scale } from '@vna-base/utils';
import dayjs from 'dayjs';
import isEmpty from 'lodash.isempty';
import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import RenderHTML, {
  HTMLContentModel,
  MixedStyleDeclaration,
  defaultHTMLElementModels,
} from 'react-native-render-html';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export const BannerAndNewsDetail = ({
  route,
}: NativeStackScreenProps<
  RootStackParamList,
  APP_SCREEN.BANNER_AND_NEWS_DETAIL
>) => {
  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);
  const { bottom } = useSafeAreaInsets();

  const { id } = route.params;

  const content = useSelector(selectDetailDBSContent(id));

  // useEffect(() => {
  //   if (isEmpty(content)) {
  //     dispatch(dbsContentActions.getDetailDBSContent(id));
  //   }
  // }, [content, id]);

  const _renderRating = (rate: number) => {
    return [1, 2, 3, 4, 5].map((item, key) => {
      return (
        <View key={key}>
          <Icon
            icon="star_fill"
            size={16}
            colorTheme={item < Math.round(rate) ? 'warning400' : 'neutral60'}
          />
        </View>
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
      contentModel: HTMLContentModel.mixed,
      isVoid: false,
      tagName: 'label',
    }),
    iframe: defaultHTMLElementModels.iframe.extend({
      contentModel: HTMLContentModel.mixed,
      isVoid: false,
      tagName: 'iframe',
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
      color: colors.neutral100,
    },
    p: {
      color: colors.neutral100,
      fontSize: 18,
    },
  };

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        colorTheme="neutral10"
        leftContent={
          <Button
            hitSlop={HitSlop.Large}
            type="common"
            size="small"
            leftIcon="arrow_ios_left_fill"
            textColorTheme="neutral100"
            leftIconSize={24}
            padding={4}
            onPress={() => goBack()}
          />
        }
        centerContent={
          <Text
            t18n={'common:detail'}
            fontStyle="H320Semi"
            colorTheme="neutral100"
          />
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: bottom + scale(12) },
        ]}>
        <Text
          text={content?.Intro as string}
          fontStyle="H224Bold"
          colorTheme="neutral100"
        />
        <View
          style={[
            bs.marginVertical_12,
            bs.flexDirectionRow,
            bs.columnGap_10,
            { alignItems: 'center' },
          ]}>
          <View
            style={[
              bs.flexDirectionRow,
              bs.columnGap_4,
              { alignItems: 'center' },
            ]}>
            <Text
              t18n="common:rate"
              fontStyle="Body14Reg"
              colorTheme="neutral70"
            />
            {_renderRating(content?.Rate as number)}
          </View>
          <View style={[styles.description, bs.borderRadius_4]} />
          <View
            style={[
              bs.flexDirectionRow,
              bs.columnGap_4,
              { alignItems: 'center' },
            ]}>
            <Text
              text={translate('common:choose_role').split(' ')[0]}
              fontStyle="Body14Reg"
              colorTheme="neutral70"
            />
            <Text
              text={dayjs(content?.CreatedDate).format('DD/MM/YYYY')}
              fontStyle="Body14Reg"
              colorTheme="neutral70"
            />
          </View>
        </View>
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

const styleSheet = createStyleSheet(({ colors }) => ({
  container: {
    backgroundColor: colors.neutral10,
  },
  contentContainer: {
    padding: scale(12),
  },
  description: {
    width: scale(6),
    height: scale(6),
    backgroundColor: colors.neutral50,
  },
}));

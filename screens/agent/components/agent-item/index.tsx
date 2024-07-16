/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { images } from '@assets/image';
import { Block, Icon, Image, Text } from '@vna-base/components';
import { navigate } from '@navigation/navigation-service';
import {
  selectAgentGroup,
  selectAgentType,
  selectLanguage,
} from '@redux-selector';
import { Agent, AgentGroup, AgentType } from '@services/axios/axios-data';
import { translate } from '@vna-base/translations/translate';
import { APP_SCREEN } from '@utils';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';

export type Props = {
  item: Agent;
};

export const AgentItem = memo((props: Props) => {
  const { item } = props;

  const lng = useSelector(selectLanguage);

  const agentType = selectAgentType(item.AgentType) as AgentType;
  const agentGroup = selectAgentGroup(item.AgentGroup) as AgentGroup;

  return (
    <Pressable
      onPress={() => navigate(APP_SCREEN.AGENT_DETAIL, { id: item.Id! })}>
      <Block
        paddingVertical={12}
        paddingHorizontal={16}
        colorTheme="neutral100">
        <Block flexDirection="row" columnGap={12}>
          {/* //cmt: logo agent */}
          <Block
            flex={1}
            maxWidth={34}
            maxHeight={34}
            borderWidth={10}
            borderColorTheme="neutral200"
            opacity={item.Visible ? 1 : 0.6}
            borderRadius={16}>
            <Image
              source={item.Logo ?? images.default_avatar}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                overflow: 'hidden',
              }}
              resizeMode="cover"
            />
            <Block
              borderRadius={10}
              style={{ bottom: -2, right: -2 }}
              colorTheme="neutral100"
              position="absolute"
              alignItems="center"
              justifyContent="center">
              <Icon
                icon={
                  item.Active ? 'checkmark_circle_fill' : 'close_circle_fill'
                }
                size={12}
                colorTheme={item.Active ? 'success500' : 'error500'}
              />
            </Block>
          </Block>

          {/* //cmt: info agent */}
          <Block flex={1} rowGap={4}>
            <Block flexDirection="row" alignItems="center" columnGap={4}>
              <Block
                paddingHorizontal={6}
                paddingVertical={2}
                borderRadius={4}
                colorTheme={item.Visible ? 'primary600' : 'neutral600'}>
                <Text
                  text={item.CustomerID ?? 'N/A'}
                  fontStyle="Capture11Bold"
                  colorTheme="neutral100"
                />
              </Block>
              <Text
                text={item.AgentCode ?? 'N/A'}
                fontStyle="Body14Bold"
                colorTheme={item.Visible ? 'neutral900' : 'neutral600'}
              />
            </Block>
            <Text
              text={item.AgentName?.toUpperCase()}
              fontStyle="Title16Semi"
              colorTheme={item.Visible ? 'primary600' : 'neutral700'}
            />
            <Block flexDirection="row" alignItems="center" columnGap={4}>
              <Text
                text={
                  // eslint-disable-next-line no-nested-ternary
                  agentType
                    ? lng === 'vi'
                      ? agentType.NameVi!
                      : agentType.NameEn!
                    : 'N/A'
                }
                fontStyle="Body12Med"
                colorTheme={item.Visible ? 'neutral800' : 'neutral600'}
              />
              <Block
                width={6}
                height={6}
                borderRadius={4}
                colorTheme="neutral800"
              />
              <Text
                text={
                  // eslint-disable-next-line no-nested-ternary
                  agentGroup
                    ? lng === 'vi'
                      ? agentGroup.NameVi!
                      : agentGroup.NameEn!
                    : 'N/A'
                }
                fontStyle="Body12Reg"
                colorTheme={item.Visible ? 'neutral800' : 'neutral600'}
              />
            </Block>
          </Block>
          {/* //cmt: expiry date */}
          {item.Visible ? (
            <Block flex={1} maxWidth={80} alignItems="center">
              {/* {item.ExpiryDate && (
                <Block
                  paddingHorizontal={6}
                  paddingVertical={2}
                  borderRadius={4}
                  colorTheme="error600">
                  <Text
                    text={dayjs(item.ExpiryDate).format('DD/MM/YYYY')}
                    fontStyle="Capture11Bold"
                    colorTheme="neutral100"
                  />
                </Block>
              )} */}
            </Block>
          ) : (
            <Block flex={1} maxWidth={80} alignItems="center">
              {item.ExpiryDate && (
                <Block
                  paddingHorizontal={6}
                  paddingVertical={2}
                  borderRadius={4}
                  colorTheme="neutral50">
                  <Text
                    text={translate('agent_detail:deleted')
                      .slice(0, 6)
                      .toUpperCase()}
                    fontStyle="Capture11Reg"
                    colorTheme="neutral600"
                  />
                </Block>
              )}
            </Block>
          )}
        </Block>
      </Block>
    </Pressable>
  );
}, isEqual);

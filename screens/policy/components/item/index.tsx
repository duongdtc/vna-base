/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Block, Icon, Text } from '@vna-base/components';
import React, { memo } from 'react';
import isEqual from 'react-fast-compare';
import { useStyles } from './styles';
import { Pressable } from 'react-native';
import { Policy } from '@services/axios/axios-data';
import { translate } from '@vna-base/translations/translate';
import { useSelector } from 'react-redux';
import { selectAllAgentGroup, selectAllAirGroups } from '@redux-selector';
import { navigate } from '@navigation/navigation-service';
import {
  ServiceFeeFormulaDetails,
  ServiceFeeFormula as ServiceFeeFormulaEnum,
} from '@vna-base/utils';
import { APP_SCREEN } from '@utils';

export const Item = memo(
  ({
    System,
    StartPoint,
    EndPoint,
    AgentGroup,
    AirGroup,
    ServiceFeeADT,
    ServiceFeeCHD,
    ServiceFeeINF,
    Id,
    ServiceFeeFormula,
    Currency,
    FareClassApply,
    Visible,
  }: Policy) => {
    const styles = useStyles();
    const allAgentGroups = useSelector(selectAllAgentGroup);
    const allAirGroups = useSelector(selectAllAirGroups);

    return (
      <Pressable
        onPress={() => {
          navigate(APP_SCREEN.POLICY_DETAIL, { id: Id! });
        }}
        style={styles.container}>
        <Block rowGap={4}>
          <Block
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center">
            <Block flexDirection="row" columnGap={4} alignItems="center">
              <Block
                paddingHorizontal={6}
                paddingVertical={2}
                borderRadius={4}
                colorTheme={Visible ? 'primary600' : 'neutral600'}>
                <Text
                  text={System ?? translate('common:all')}
                  colorTheme="classicWhite"
                  fontStyle="Capture11Bold"
                />
              </Block>
              {StartPoint || EndPoint ? (
                <>
                  <Text
                    text={StartPoint!}
                    fontStyle="Title16Bold"
                    colorTheme={Visible ? 'neutral900' : 'neutral600'}
                  />
                  {(StartPoint || EndPoint) && (
                    <Icon
                      icon="arrow_list"
                      size={18}
                      colorTheme={Visible ? 'neutral900' : 'neutral600'}
                    />
                  )}
                  <Text
                    text={EndPoint!}
                    fontStyle="Title16Bold"
                    colorTheme={Visible ? 'neutral900' : 'neutral600'}
                  />
                </>
              ) : (
                <Text
                  fontStyle="Title16Bold"
                  colorTheme={Visible ? 'neutral900' : 'neutral600'}
                  t18n="policy:all_routes"
                />
              )}
            </Block>
            {FareClassApply && (
              <Block
                borderRadius={4}
                paddingVertical={4}
                paddingHorizontal={8}
                alignItems="center"
                colorTheme="neutral50"
                minWidth={80}
                maxWidth={140}>
                <Text
                  text={FareClassApply}
                  fontStyle="Capture11Bold"
                  colorTheme={Visible ? 'neutral900' : 'neutral600'}
                />
              </Block>
            )}
          </Block>
          {(AgentGroup || AirGroup) && (
            <Block flexDirection="row" alignItems="center" columnGap={8}>
              <Text
                text={allAgentGroups[AgentGroup as string]?.NameVi ?? ''}
                fontStyle="Title16Bold"
                colorTheme="neutral900"
              />
              {AgentGroup && AirGroup && (
                <Block
                  width={4}
                  height={4}
                  borderRadius={4}
                  colorTheme="neutral500"
                />
              )}
              <Text
                text={allAirGroups[AirGroup as string]?.Name ?? ''}
                fontStyle="Title16Bold"
                colorTheme="neutral900"
              />
            </Block>
          )}
        </Block>

        <Block
          flexDirection="row"
          marginBottom={8}
          marginTop={12}
          alignItems="center"
          columnGap={4}>
          <Icon icon="coin_fill" size={16} colorTheme="neutral700" />
          <Block flex={1}>
            <Text
              text={`${translate('policy:service_fee')} (${
                ServiceFeeFormula === ServiceFeeFormulaEnum.ADD_DIRECTLY
                  ? Currency
                  : '%'
              }):`}
              fontStyle="Body12Med"
              colorTheme="neutral600"
            />
          </Block>
          <Block
            paddingHorizontal={8}
            paddingVertical={4}
            borderRadius={12}
            colorTheme={Visible ? 'success500' : 'neutral600'}>
            <Text
              t18n={
                ServiceFeeFormulaDetails[
                  ServiceFeeFormula as ServiceFeeFormulaEnum
                ].t18n
              }
              fontStyle="Capture11Reg"
              colorTheme="neutral50"
            />
          </Block>
        </Block>

        <Block flexDirection="row" alignItems="center" columnGap={8}>
          {ServiceFeeADT !== null && ServiceFeeADT !== undefined && (
            <Block
              flexDirection="row"
              alignItems="center"
              columnGap={4}
              paddingHorizontal={8}
              paddingVertical={2}
              borderRadius={4}
              colorTheme="neutral50">
              <Text
                text="ADT:"
                fontStyle="Body12Bold"
                colorTheme={Visible ? 'neutral900' : 'neutral600'}
              />
              <Text
                text={ServiceFeeADT.currencyFormat()}
                fontStyle="Body12Bold"
                colorTheme={Visible ? 'price' : 'neutral600'}
              />
            </Block>
          )}
          {ServiceFeeCHD !== null && ServiceFeeCHD !== undefined && (
            <Block
              flexDirection="row"
              alignItems="center"
              columnGap={4}
              paddingHorizontal={8}
              paddingVertical={2}
              borderRadius={4}
              colorTheme="neutral50">
              <Text
                text="CHD:"
                fontStyle="Body12Bold"
                colorTheme={Visible ? 'neutral900' : 'neutral600'}
              />
              <Text
                text={ServiceFeeCHD.currencyFormat()}
                fontStyle="Body12Bold"
                colorTheme={Visible ? 'price' : 'neutral600'}
              />
            </Block>
          )}
          {ServiceFeeINF !== null && ServiceFeeINF !== undefined && (
            <Block
              flexDirection="row"
              alignItems="center"
              columnGap={4}
              paddingHorizontal={8}
              paddingVertical={2}
              borderRadius={4}
              colorTheme="neutral50">
              <Text
                text="INF:"
                fontStyle="Body12Bold"
                colorTheme={Visible ? 'neutral900' : 'neutral600'}
              />
              <Text
                text={ServiceFeeINF.currencyFormat()}
                fontStyle="Body12Bold"
                colorTheme={Visible ? 'price' : 'neutral600'}
              />
            </Block>
          )}
        </Block>
      </Pressable>
    );
  },
  isEqual,
);

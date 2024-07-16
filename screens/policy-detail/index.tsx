import {
  Block,
  BottomSheetHistory,
  BottomSheetHistoryRef,
  RowOfForm,
  Screen,
  Separator,
  Text,
} from '@vna-base/components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  selectAllAgentGroup,
  selectAllAirGroups,
  selectPolicyDetail,
} from '@redux-selector';
import { policyActions } from '@redux-slice';
import {
  CurrencyDetails,
  ObjectHistoryTypes,
  ServiceFeeFormulaDetails,
  SnapPoint,
  SystemDetails,
  convertStringToNumber,
  dispatch,
} from '@vna-base/utils';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { DepArrArea, Header } from './components';
import { useStyles } from './style';
import { PolicyDetailForm } from './type';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const PolicyDetail = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.POLICY_DETAIL>) => {
  const id = route.params?.id;
  const styles = useStyles();

  const BTSHistoryRef = useRef<BottomSheetHistoryRef>(null);

  const policyDetail = useSelector(selectPolicyDetail);
  const allAgentGroups = useSelector(selectAllAgentGroup);
  const allAirGroup = useSelector(selectAllAirGroups);

  const formMethod = useForm<PolicyDetailForm>();

  useEffect(() => {
    if (id && policyDetail?.Id !== id) {
      dispatch(policyActions.getPolicyDetail(id));
    }
  }, []);

  useEffect(() => {
    if (!isEmpty(policyDetail)) {
      formMethod.reset({
        Active: policyDetail.Active,
        AgentGroup: policyDetail.AgentGroup,
        AirGroup: policyDetail.AirGroup,
        Currency: policyDetail.Currency,
        EndPoint: policyDetail.EndPoint,
        FareClassApply: policyDetail.FareClassApply?.toUpperCase(),
        ServiceFeeADT: policyDetail.ServiceFeeADT?.currencyFormat(),
        ServiceFeeCHD: policyDetail.ServiceFeeCHD?.currencyFormat(),
        ServiceFeeINF: policyDetail.ServiceFeeINF?.currencyFormat(),
        ServiceFeeFormula: policyDetail.ServiceFeeFormula,
        StartPoint: policyDetail.StartPoint,
        System: policyDetail.System,
      });
    }
  }, [policyDetail]);

  const openHistory = useCallback(() => {
    BTSHistoryRef.current?.present({
      ObjectId: id,
      ObjectType: ObjectHistoryTypes.CONFIG_EMAIL,
    });
  }, [id]);

  return (
    <Screen unsafe backgroundColor={styles.container.backgroundColor}>
      <FormProvider {...formMethod}>
        <Header policyId={id} openHistory={openHistory} />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Block borderRadius={8} overflow="hidden">
            <RowOfForm<PolicyDetailForm>
              type="switch"
              t18n="policy_detail:active"
              name="Active"
              fixedTitleFontStyle={true}
              control={formMethod.control}
            />
          </Block>
          <Block borderRadius={8} overflow="hidden">
            <RowOfForm<PolicyDetailForm>
              t18n="policy_detail:adult"
              name="ServiceFeeADT"
              titleFontStyle="Title16Semi"
              fixedTitleFontStyle={true}
              control={formMethod.control}
              keyboardType="number-pad"
              styleInput={styles.inputPrice}
              processValue={val => convertStringToNumber(val).currencyFormat()}
            />
            <Separator type="horizontal" size={3} />
            <RowOfForm<PolicyDetailForm>
              t18n="policy_detail:children"
              name="ServiceFeeCHD"
              titleFontStyle="Title16Semi"
              fixedTitleFontStyle={true}
              control={formMethod.control}
              styleInput={styles.inputPrice}
              keyboardType="number-pad"
              processValue={val => convertStringToNumber(val).currencyFormat()}
            />
            <Separator type="horizontal" size={3} />
            <RowOfForm<PolicyDetailForm>
              titleFontStyle="Title16Semi"
              t18n="policy_detail:infant"
              name="ServiceFeeINF"
              fixedTitleFontStyle={true}
              styleInput={styles.inputPrice}
              control={formMethod.control}
              keyboardType="number-pad"
              processValue={val => convertStringToNumber(val).currencyFormat()}
            />
          </Block>
          <Block borderRadius={8} overflow="hidden">
            <RowOfForm<PolicyDetailForm>
              type="dropdown"
              t18n="policy_detail:calculation"
              t18nBottomSheet="policy_detail:calculation"
              name="ServiceFeeFormula"
              fixedTitleFontStyle={true}
              control={formMethod.control}
              typeDetails={ServiceFeeFormulaDetails}
              removeAll
              snapPoint={[SnapPoint['30%']]}
            />
          </Block>
          <Block paddingTop={8} rowGap={8}>
            <Text
              t18n="policy_detail:trip"
              colorTheme="neutral900"
              fontStyle="Title20Semi"
            />
            <Block borderRadius={8} overflow="hidden" colorTheme="neutral100">
              <DepArrArea
                t18n="policy_detail:departure_area"
                name="StartPoint"
              />
              <Separator type="horizontal" size={3} />
              <DepArrArea t18n="policy_detail:arrival_area" name="EndPoint" />
            </Block>
          </Block>
          <Block paddingTop={8} rowGap={8}>
            <Text
              t18n="policy_detail:options"
              colorTheme="neutral900"
              fontStyle="Title20Semi"
            />
            <Block borderRadius={8} overflow="hidden">
              <RowOfForm<PolicyDetailForm>
                type="dropdown"
                t18n="policy_detail:agent_group"
                t18nBottomSheet="policy_detail:agent_group"
                name="AgentGroup"
                fixedTitleFontStyle={true}
                control={formMethod.control}
                typeDetails={allAgentGroups}
              />
              <Separator type="horizontal" size={3} />
              <RowOfForm<PolicyDetailForm>
                type="dropdown"
                t18n="policy_detail:system"
                t18nBottomSheet="policy_detail:system"
                name="System"
                fixedTitleFontStyle={true}
                control={formMethod.control}
                typeDetails={SystemDetails}
              />
              <Separator type="horizontal" size={3} />
              <RowOfForm<PolicyDetailForm>
                type="dropdown"
                t18n="policy_detail:air_group"
                t18nBottomSheet="policy_detail:air_group"
                name="AirGroup"
                fixedTitleFontStyle={true}
                control={formMethod.control}
                typeDetails={allAirGroup}
              />
              <Separator type="horizontal" size={3} />
              <RowOfForm<PolicyDetailForm>
                t18n="policy_detail:fare_class"
                name="FareClassApply"
                autoCapitalize="characters"
                processValue={val => val.toUpperCase()}
                fixedTitleFontStyle={true}
                control={formMethod.control}
              />
              <Separator type="horizontal" size={3} />
              <RowOfForm<PolicyDetailForm>
                type="dropdown"
                t18n="policy_detail:currency"
                t18nBottomSheet="policy_detail:currency"
                name="Currency"
                fixedTitleFontStyle={true}
                control={formMethod.control}
                typeDetails={CurrencyDetails}
                snapPoint={[SnapPoint['30%']]}
              />
            </Block>
          </Block>
        </ScrollView>
      </FormProvider>
      <BottomSheetHistory ref={BTSHistoryRef} />
    </Screen>
  );
};

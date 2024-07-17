import {
  BottomSheetHistory,
  BottomSheetHistoryRef,
  Screen,
} from '@vna-base/components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { selectAgentDetailById } from '@vna-base/redux/selector';
import {
  agentActions,
  flightReportActions,
  historyActions,
} from '@vna-base/redux/action-slice';
import {
  GetFlightReportMode,
  ObjectHistoryTypes,
  dispatch,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import isEmpty from 'lodash.isempty';
import React, { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
  HeaderAgentDetail,
  TabContentAgentDetail,
  TopInfo,
} from './components';
import { FormAgentDetail } from './type';
import { APP_SCREEN, RootStackParamList } from '@utils';

export const AgentDetail = ({
  route,
}: NativeStackScreenProps<RootStackParamList, APP_SCREEN.AGENT_DETAIL>) => {
  const { id } = route.params;

  const agentDetail = useSelector(selectAgentDetailById);
  const bottomSheetRef = useRef<BottomSheetHistoryRef>(null);

  const formMethod = useForm<FormAgentDetail>({
    mode: 'all',
  });

  useEffect(() => {
    dispatch(agentActions.getAgentDetailById(id));
    //cmt: fake form get list report flight
    dispatch(
      flightReportActions.getListFlightReport(id, GetFlightReportMode.TODAY),
    );

    return () => {
      dispatch(agentActions.saveAgentDetailById({}));
      dispatch(historyActions.saveListHistory({}));
      dispatch(historyActions.saveDetailHistory({}));
    };
  }, [id]);

  useEffect(() => {
    if (!isEmpty(agentDetail)) {
      formMethod.reset({
        GeneralTab: {
          Active: agentDetail.Active,
          CustomerID: agentDetail.CustomerID,
          AgentName: agentDetail.AgentName,
          AgentGroup: agentDetail.AgentGroup,
          AgentType: agentDetail.AgentType,
          Phone: agentDetail.Phone,
          Email: agentDetail.Email,
          Contact: agentDetail.Contact,
          OfficeId: agentDetail.OfficeId,
          // ExpiryDate: dayjs(agentDetail.ExpiryDate).toDate(),
          Address: agentDetail.Address,
          Logo: agentDetail.Logo,
        },
        CompanyInfo: {
          Company: agentDetail.Company,
          TaxCode: agentDetail.TaxCode,
          BankNumb: agentDetail.BankNumb,
          BankName: agentDetail.BankName,
          StartupDate: agentDetail.StartupDate
            ? dayjs(agentDetail.StartupDate).toDate()
            : null,
          ContractDate: agentDetail.ContractDate
            ? dayjs(agentDetail.ContractDate).toDate()
            : null,
        },
        ConfigTab: {
          AllowBook: agentDetail.AllowBook,
          AllowIssue: agentDetail.AllowIssue,
          AllowSearch: agentDetail.AllowSearch,
          AllowVoid: agentDetail.AllowVoid,
          SISetId: agentDetail.SISetId,
        },
      });
    }
  }, [agentDetail, formMethod]);

  const openBtsHistory = () => {
    bottomSheetRef.current?.present({
      ObjectId: agentDetail.Id!,
      ObjectType: ObjectHistoryTypes.AGENT,
    });
  };

  return (
    <Screen unsafe>
      <FormProvider {...formMethod}>
        <HeaderAgentDetail openBtsHistory={openBtsHistory} />

        <TopInfo />
        <TabContentAgentDetail />
      </FormProvider>
      <BottomSheetHistory ref={bottomSheetRef} />
    </Screen>
  );
};

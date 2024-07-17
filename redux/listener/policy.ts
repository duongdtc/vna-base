/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { showToast } from '@vna-base/components';
import { policyActions } from '@vna-base/redux/action-slice';
import { Data, SortType } from '@services/axios';
import {
  PAGE_SIZE_BOOKING,
  convertStringToNumber,
  validResponse,
} from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';


export const runPolicyListener = () => {
  takeLatestListeners()({
    actionCreator: policyActions.getListPolicy,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(policyActions.changeIsLoadingFilter(true));

      const { pageIndex, form } = action.payload;

      if (form) {
        listenerApi.dispatch(policyActions.saveFilterForm(form));
      }

      const tempForm = form ?? listenerApi.getState().policy.filterForm;

      const response = await Data.policyPolicyGetListCreate({
        PageSize: PAGE_SIZE_BOOKING,
        PageIndex: pageIndex ?? 1,
        OrderBy: tempForm?.OrderBy,
        SortType: tempForm?.SortType ?? SortType.Desc,
        Filter: tempForm?.Filter,
        GetAll: tempForm?.GetAll,
      });

      if (validResponse(response)) {
        listenerApi.dispatch(
          policyActions.saveResultFilter({
            list: response.data.List ?? [],
            pageIndex: response.data.PageIndex ?? 1,
            totalPage: response.data.TotalPage ?? 1,
            totalItem: response.data.TotalItem ?? 0,
          }),
        );
      }

      listenerApi.dispatch(policyActions.changeIsLoadingFilter(false));
    },
  });

  takeLatestListeners(true)({
    actionCreator: policyActions.getPolicyDetail,
    effect: async (action, listenerApi) => {
      const { id } = action.payload;

      const response = await Data.policyPolicyGetByIdCreate({
        Id: id,
      });

      if (validResponse(response)) {
        listenerApi.dispatch(policyActions.savePolicyDetail(response.data.Item!));
      }
    },
  });

  takeLatestListeners(true)({
    actionCreator: policyActions.deletePolicy,
    effect: async (action, listenerApi) => {
      const { id, cb } = action.payload;

      const response = await Data.policyPolicyDeleteCreate({
        Id: id,
      });

      if (validResponse(response)) {
        showToast({ type: 'success', t18n: 'common:success' });
        listenerApi.dispatch(policyActions.getListPolicy({}));
      } else {
        showToast({ type: 'error', t18n: 'common:failed' });
      }

      cb(validResponse(response));
    },
  });

  takeLatestListeners(true)({
    actionCreator: policyActions.updatePolicy,
    effect: async (action, listenerApi) => {
      const { form, cb } = action.payload;
      const { policyDetail } = listenerApi.getState().policy;

      const response = await Data.policyPolicyUpdateCreate({
        Item: {
          ...policyDetail,
          ...form,
          ServiceFeeADT: convertStringToNumber(form.ServiceFeeADT),
          ServiceFeeCHD: convertStringToNumber(form.ServiceFeeCHD),
          ServiceFeeINF: convertStringToNumber(form.ServiceFeeINF),
        },
      });

      if (validResponse(response)) {
        showToast({ type: 'success', t18n: 'common:update_done' });
        listenerApi.dispatch(policyActions.getListPolicy({}));
      } else {
        showToast({ type: 'error', t18n: 'common:update_failed' });
      }

      cb(validResponse(response));
    },
  });

  takeLatestListeners(true)({
    actionCreator: policyActions.createPolicy,
    effect: async (action, listenerApi) => {
      const { form, cb } = action.payload;

      const response = await Data.policyPolicyInsertCreate({
        Item: {
          ...form,
          ServiceFeeADT: convertStringToNumber(form.ServiceFeeADT),
          ServiceFeeCHD: convertStringToNumber(form.ServiceFeeCHD),
          ServiceFeeINF: convertStringToNumber(form.ServiceFeeINF),
        },
      });

      if (validResponse(response)) {
        showToast({ type: 'success', t18n: 'common:success' });
        listenerApi.dispatch(policyActions.getListPolicy({}));
      } else {
        showToast({ type: 'error', t18n: 'common:failed' });
      }

      cb(validResponse(response));
    },
  });

  takeLatestListeners(true)({
    actionCreator: policyActions.restorePolicy,
    effect: async (action, listenerApi) => {
      const { id, cb } = action.payload;

      const response = await Data.policyPolicyRestoreCreate({
        Id: id,
      });

      if (validResponse(response)) {
        showToast({ type: 'success', t18n: 'common:success' });
        listenerApi.dispatch(policyActions.getListPolicy({}));
      } else {
        showToast({ type: 'error', t18n: 'common:failed' });
      }

      cb(validResponse(response));
    },
  });
}
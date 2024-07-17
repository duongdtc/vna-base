import Actions from '@redux-action-type';
import { ListData, OrderState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { FormOrderDetailType } from '@vna-base/screens/order-detail/type';
import { FilterForm } from '@vna-base/screens/order/type';
import { HistoryLst, Remark } from '@services/axios/axios-data';
import { FieldNamesMarkedBoolean } from 'react-hook-form';
import { SLICE_NAME } from './constant';

const initialState: OrderState = {
  resultFilter: { list: [], pageIndex: 1, totalPage: 1 },
  loadingFilter: true,
  filterForm: null,
  viewingOrderId: null,
  historyGetDetail: {},

  listRemark: [],
  resultListActivity: {},
};

const orderSlice = createSlice({
  name: SLICE_NAME.ORDER,
  initialState: initialState,
  reducers: {
    saveResultFilter: (state, { payload }: PayloadAction<ListData>) => {
      state.resultFilter = payload;
    },
    changeLoadingFilter: (state, { payload }: PayloadAction<boolean>) => {
      state.loadingFilter = payload;
    },
    saveListRemark: (state, { payload }: PayloadAction<Array<Remark>>) => {
      state.listRemark = payload;
    },
    saveListActivity: (
      state,
      {
        payload,
      }: PayloadAction<
        Omit<
          HistoryLst,
          'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
        >
      >,
    ) => {
      state.resultListActivity = payload;
    },
    savedFilterForm: (state, { payload }: PayloadAction<FilterForm | null>) => {
      state.filterForm = payload;
    },

    saveViewingOrderId: (state, { payload }: PayloadAction<string | null>) => {
      state.viewingOrderId = payload;
    },

    saveHistoryGetDetail: (
      state,
      { payload }: PayloadAction<Record<string, number>>,
    ) => {
      state.historyGetDetail = payload;
    },
  },
});

const getListOrder = createAction(
  Actions.GET_LIST_ORDER,
  (payload: { filterForm?: FilterForm; pageIndex?: number }) => ({
    payload,
  }),
);

const exportExcel = createAction(
  Actions.EXPORT_EXCEL_ORDERS,
  (filterForm: FilterForm) => ({
    payload: filterForm,
  }),
);

const getOrderDetail = createAction(Actions.GET_ORDER_DETAIL, (id: string) => ({
  payload: { id },
}));

const deleteOrder = createAction(
  Actions.DELETE_ORDER,
  (id: string, callback: () => void) => ({
    payload: { id, callback },
  }),
);

const getListRemarkByOrderId = createAction(
  Actions.GET_LIST_REMARK,
  (id: string, cb?: () => void) => ({
    payload: { id, cb },
  }),
);

const getActivityByOrderId = createAction(
  Actions.GET_ACTIVITY,
  (id: string) => ({
    payload: { id },
  }),
);

const insertRemark = createAction(Actions.INSERT_REMARK, (remark: string) => ({
  payload: { remark },
}));

const updateOrderDetail = createAction(
  Actions.UPDATE_ORDER_DETAIL,
  (
    form: FormOrderDetailType,
    dirtyFields: FieldNamesMarkedBoolean<FormOrderDetailType>,
  ) => ({
    payload: { form, dirtyFields },
  }),
);

export const orderActions = {
  ...orderSlice.actions,
  getListOrder,
  exportExcel,
  getOrderDetail,
  deleteOrder,
  getListRemarkByOrderId,
  getActivityByOrderId,
  insertRemark,
  updateOrderDetail,
};

export const orderReducer = orderSlice.reducer;

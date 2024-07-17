import Actions from '@redux-action-type';
import { ActivityState } from '@redux/type';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { Activity, ActivityLst } from '@services/axios/axios-data';
import { SLICE_NAME } from './constant';
import { FilterFormActivity } from '@vna-base/screens/agent-detail/type';
import { ModalAddActivityType } from '@vna-base/screens/agent-detail/components/tab-content-agent-detail/components/activity-tab/type';

const initialState: ActivityState = {
  resultFilterActivity: {},
  ActivityByAgent: [],
};

const activitySlice = createSlice({
  name: SLICE_NAME.ACTIVITY,
  initialState: initialState,
  reducers: {
    saveListActivityByAgent: (
      state,
      { payload }: PayloadAction<Array<Activity>>,
    ) => {
      state.ActivityByAgent = payload;
    },
    saveListActivity: (
      state,
      {
        payload,
      }: PayloadAction<
        Omit<
          ActivityLst,
          'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
        >
      >,
    ) => {
      state.resultFilterActivity = payload;
    },
  },
});

const getListActivityByAgent = createAction(
  Actions.GET_LIST_ACTIVITY_BY_AGENT,
  (agtId: string, cb?: () => void) => ({
    payload: { agtId, cb },
  }),
);

const getListActivity = createAction(
  Actions.GET_LIST_ACTIVITY,
  (form: FilterFormActivity) => ({
    payload: form,
  }),
);

const insertNewActivity = createAction(
  Actions.INSERT_NEW_ACTIVITY,
  (form: ModalAddActivityType, agentId: string) => ({
    payload: { form, agentId },
  }),
);

const deleteActivity = createAction(
  Actions.DELETE_ACTIVITY,
  (id: string, agentId: string) => ({
    payload: { id, agentId },
  }),
);

export const activityActions = {
  ...activitySlice.actions,
  getListActivityByAgent,
  getListActivity,
  insertNewActivity,
  deleteActivity,
};

export const activityReducer = activitySlice.reducer;

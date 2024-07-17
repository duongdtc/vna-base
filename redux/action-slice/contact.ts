import Actions from '@vna-base/redux/action-type';
import { ContactState } from '@redux/type';
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contact } from '@services/axios/axios-data';
import { SLICE_NAME } from './constant';
import { ModalAddNewEmpType } from '@vna-base/screens/agent-detail/components/tab-content-agent-detail/components/employees-tab/modal-add-new-employee';

const initState: ContactState = {
  List: [],
  Contact: {},
};

const getListContactByAgentId = createAction(
  Actions.GET_LIST_CONTACT_BY_AGENT_ID,
  (agentId?: string, cb?: () => void) => ({
    payload: { agentId, cb },
  }),
);

const getContact = createAction(Actions.GET_CONTACT, (id?: string) => ({
  payload: { id },
}));

const insertContact = createAction(
  Actions.INSERT_CONTACT,
  (form: ModalAddNewEmpType) => ({
    payload: { form },
  }),
);

const deleteContact = createAction(
  Actions.DELETE_CONTACT,
  (id: string, agentId: string) => ({
    payload: { id, agentId },
  }),
);

const contactSlide = createSlice({
  name: SLICE_NAME.CONTACT,
  initialState: initState,
  reducers: {
    saveListContactByAgentId: (
      state,
      { payload }: PayloadAction<Array<Contact>>,
    ) => {
      state.List = payload;
    },
    saveContact: (state, { payload }: PayloadAction<Contact>) => {
      state.Contact = payload;
    },
  },
});

export const contactReducer = contactSlide.reducer;
export const contactActions = {
  ...contactSlide.actions,
  getListContactByAgentId,
  getContact,
  insertContact,
  deleteContact,
};

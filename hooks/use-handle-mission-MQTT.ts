import { TypeIdMessage } from '@services/mqtt/constants';
import { useMQTTContext } from '@services/mqtt/provider';
import {
  DataMessagePassive,
  QualiTyNotification,
  StatusNotification,
} from '@services/mqtt/types/client';
import { dispatch } from '@vna-base/utils';
import { useCallback, useEffect } from 'react';

export const useHandleMissionMQTT = (id?: string | undefined) => {
  const { addFunOnMessage, subscribe, unsubscribe, removeFunOnMessage } =
    useMQTTContext();

  const _onMessageMission = useCallback(
    (
      data: DataMessagePassive<
        MissionComment | QualiTyNotification | StatusNotification
      >,
    ) => {
      switch (data.TypeId) {
        case TypeIdMessage.InsertMissionComment:
          dispatch(
            missionCommentActions.insertMissionComment(
              data.Data as MissionComment,
            ),
          );
          break;
        case TypeIdMessage.UpdateMissionComment:
          dispatch(
            missionCommentActions.updateMissionComment(
              data.Data as MissionComment,
            ),
          );
          break;
        case TypeIdMessage.DeleteMissionComment:
          dispatch(
            missionCommentActions.deleteMissionComment(
              data.Data as MissionComment,
            ),
          );
          break;
        case TypeIdMessage.RestoreMissionComment:
          dispatch(
            missionCommentActions.restoreMissionComment(
              data.Data as MissionComment,
            ),
          );
          break;
        case TypeIdMessage.UpdateMissionQuality:
          dispatch(
            missionActions.updateQuality(
              (data.Data as QualiTyNotification).Item.Quality,
            ),
          );
          break;
        case TypeIdMessage.UpdateMissionStatus:
          dispatch(
            missionActions.updateStatus((data.Data as StatusNotification).To),
          );
          break;
      }
    },
    [],
  );

  useEffect(() => {
    if (!!id) {
      subscribe(id);
      addFunOnMessage(_onMessageMission, '_onMessageMission');
    }

    return () => {
      if (!!id) {
        unsubscribe(id);
        removeFunOnMessage('_onMessageMission');
      }
    };
  }, [
    id,
    _onMessageMission,
    addFunOnMessage,
    unsubscribe,
    subscribe,
    removeFunOnMessage,
  ]);
};

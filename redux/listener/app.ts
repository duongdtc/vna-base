import { ThemeType } from '@theme';
import { delay, saveString, StorageKey } from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';

import { ThemeOptions } from '@theme/type';
import { currentAccountActions } from '@vna-base/redux/action-slice';
import i18n from '@vna-base/translations/i18n';
import isEmpty from 'lodash.isempty';
import { Appearance } from 'react-native';
import { appActions } from '../action-slice/app';

export const runAppListener = () => {
  takeLatestListeners()({
    actionCreator: appActions.startLoadApp,
    effect: async (_, listenerApi) => {
      // await createRealmFile();

      // const lastTime = load(StorageKey.LAST_TIME_DELETE_REALM);

      // if (!lastTime || dayjs().diff(lastTime, 'days') > 4) {
      //   realmRef.current?.write(() => {
      //     realmRef.current?.delete(
      //       realmRef.current?.objects(OrderRealm.schema.name),
      //     );
      //     realmRef.current?.delete(
      //       realmRef.current?.objects(FlightTicketInList.schema.name),
      //     );
      //     realmRef.current?.delete(
      //       realmRef.current?.objects(TopupRealm.schema.name),
      //     );
      //     realmRef.current?.delete(
      //       realmRef.current?.objects(PaymentHistoryInList.schema.name),
      //     );
      //     realmRef.current?.delete(
      //       realmRef.current?.objects(BookingRealm.schema.name),
      //     );
      //   });

      //   save(StorageKey.LAST_TIME_DELETE_REALM, dayjs().toDate());
      // }

      const { token } = listenerApi.getState().authentication;

      if (!isEmpty(token)) {
        listenerApi.dispatch(currentAccountActions.loadAccountData());
      }
    },
  });

  takeLatestListeners(true)({
    actionCreator: appActions.changeThemeOption,
    effect: async (action, listenerApi) => {
      const themeOption = action.payload;

      listenerApi.dispatch(
        appActions.setThemeOption(themeOption as ThemeOptions),
      );

      if (
        themeOption === ThemeOptions.Light ||
        themeOption === ThemeOptions.Dark
      ) {
        listenerApi.dispatch(appActions.setAppTheme(themeOption as ThemeType));
      } else {
        const deviceTheme = Appearance.getColorScheme();
        listenerApi.dispatch(appActions.setAppTheme(deviceTheme as ThemeType));
      }

      await delay(500);

      saveString(StorageKey.APP_THEME_OPTION, themeOption);
    },
  });

  takeLatestListeners(true)({
    actionCreator: appActions.changeLanguage,
    effect: async (action, _) => {
      i18n.changeLanguage(action.payload);
      await delay(500);
    },
  });
};

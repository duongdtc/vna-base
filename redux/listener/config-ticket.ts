/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { showToast } from '@vna-base/components';
import { DEFAULT_CURRENCY } from '@env';
import { configTicketActions } from '@redux-slice';
import { Data, Email } from '@services/axios';
import { Content, Eticket } from '@services/axios/axios-data';
import {
  LanguageSystem,
  LanguageSystemDetail,
  LanguageSystemDetails,
  ObjectHistoryTypes,
  PathInServer,
  TEMPLATE_E_TICKET,
  getNameOfPhoto,
  uploadFiles,
  validResponse,
} from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import { onProgressFile } from './file';

takeLatestListeners(true)({
  actionCreator: configTicketActions.getConfigTicket,
  effect: async (_, listenerApi) => {
    const response = await Data.eticketEticketGetByAgentCreate({});

    if (validResponse(response)) {
      listenerApi.dispatch(
        configTicketActions.saveConfigTicket(response.data.Item!),
      );
      listenerApi.dispatch(
        configTicketActions.getLanguages(response.data.Item?.Id),
      );
    } else {
      listenerApi.dispatch(configTicketActions.saveConfigTicket({} as Eticket));
    }
  },
});

takeLatestListeners(true)({
  actionCreator: configTicketActions.getTemplates,
  effect: async (_, listenerApi) => {
    const res = await Promise.allSettled(
      Object.keys(TEMPLATE_E_TICKET)
        .flatMap(temp =>
          Object.keys(LanguageSystemDetails).map(lng => `${temp}_${lng}`),
        )
        .map(async key => {
          const [temp, lng] = key.split('_');
          const subRes = await Email.emailHelperEmailHelperGetETicketCreate({
            Template: temp,
            Language: lng,
            ShowTicketNumber: true,
            AllPassenger: true,
            Currency: DEFAULT_CURRENCY,
          });

          return { data: subRes.data.ListTicket?.[0], key };
        }),
    );
    //@ts-ignore
    const data: Record<string, ETicket> = {};

    res.forEach(subRes => {
      if (subRes.status === 'fulfilled') {
        data[subRes.value.key] = subRes.value.data;
      }
    });

    listenerApi.dispatch(configTicketActions.saveTemplates(data));
  },
});

takeLatestListeners(true)({
  actionCreator: configTicketActions.updateConfigTicket,
  effect: async (action, listenerApi) => {
    const {
      cb,
      data: {
        logo,
        mainColor,
        PNRColor,
        foreColor,
        showTicketNumber,
        template,
      },
    } = action.payload;

    const { Id, Logo } = listenerApi.getState().configTicket.configTicket;

    let logoUrl = Logo;

    if (typeof logo !== 'string' && !!logo) {
      const resPhoto = await uploadFiles(
        [
          {
            name: getNameOfPhoto(logo, 'jpg'),
            size: logo.size,
            type: logo.mime,
            uri: logo.path,
            fileCopyUri: logo.path,
          },
        ],
        onProgressFile,
        PathInServer.LOGO,
      );

      const success = resPhoto?.data?.reduce(
        (result, curr) => result || curr.status === 'fulfilled',
        false,
      );

      if (success && resPhoto!.data[0].status === 'fulfilled') {
        //@ts-ignore
        logoUrl = JSON.parse(resPhoto!.data[0].value).FileUrl;
      } else {
        showToast({
          type: 'error',
          t18n: 'personal_info:update_avatar_failed',
        });
      }
    } else if (logo === '' || logo === null) {
      logoUrl = logo;
    }

    const res = await Data.eticketEticketUpdateCreate({
      Item: {
        Id,
        MainColor: mainColor,
        ForeColor: foreColor,
        PNRColor: PNRColor,
        Template: template,
        ShowTicket: showTicketNumber,
        Logo: logoUrl,
      },
    });

    if (validResponse(res)) {
      listenerApi.dispatch(
        configTicketActions.saveConfigTicket(res.data.Item!),
      );
    }

    cb(validResponse(res));
  },
});

takeLatestListeners()({
  actionCreator: configTicketActions.getLanguages,
  effect: async (action, listenerApi) => {
    const { configEmailId } = action.payload;
    const { Id } = listenerApi.getState().configEmail.configEmail;

    const res = await Data.contentContentGetListCreate({
      Item: {
        ObjectId: configEmailId ?? Id,
        ObjectType: ObjectHistoryTypes.CONFIG_TICKET,
      },
    });

    if (validResponse(res)) {
      const lng: Record<
        LanguageSystem,
        LanguageSystemDetail & { contents: Array<Content> }
      > = {} as Record<
        LanguageSystem,
        LanguageSystemDetail & { contents: Array<Content> }
      >;

      res.data.List?.forEach(ct => {
        if (!lng[ct.Language as LanguageSystem]) {
          lng[ct.Language as LanguageSystem] = {
            contents: [ct],
            ...LanguageSystemDetails[ct.Language as LanguageSystem],
          };
        } else {
          lng[ct.Language as LanguageSystem].contents.push(ct);
        }
      });

      listenerApi.dispatch(configTicketActions.saveLanguages(lng));
    } else {
      listenerApi.dispatch(
        configTicketActions.saveLanguages(
          {} as Record<
            LanguageSystem,
            LanguageSystemDetail & { contents: Array<Content> }
          >,
        ),
      );
    }
  },
});

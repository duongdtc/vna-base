/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { configEmailActions } from '@vna-base/redux/action-slice';
import { Data, Email } from '@services/axios';
import { Content } from '@services/axios/axios-data';
import {
  EmailType,
  LanguageSystem,
  LanguageSystemDetail,
  LanguageSystemDetails,
  ObjectHistoryTypes,
  PathInServer,
  TEMPLATE_EMAIL,
  convertStringToNumber,
  uploadFiles,
  validResponse,
  getNameOfPhoto,
} from '@vna-base/utils';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import { onProgressFile } from './file';
import { showToast } from '@vna-base/components';
import { DEFAULT_CURRENCY } from '@env';

export const runConfigEmailListener = () => {
  takeLatestListeners(true)({
    actionCreator: configEmailActions.getConfigEmail,
    effect: async (_, listenerApi) => {
      const response = await Data.emailEmailGetByAgentCreate({});

      if (validResponse(response)) {
        listenerApi.dispatch(
          configEmailActions.saveConfigEmail(response.data.Item!),
        );
        listenerApi.dispatch(
          configEmailActions.getLanguages(response.data.Item?.Id),
        );
      } else {
        listenerApi.dispatch(configEmailActions.saveConfigEmail({}));
      }
    },
  });

  takeLatestListeners(true)({
    actionCreator: configEmailActions.getTemplates,
    effect: async (_, listenerApi) => {
      const res = await Promise.allSettled(
        Object.keys(TEMPLATE_EMAIL)
          .flatMap(temp =>
            Object.keys(LanguageSystemDetails).map(lng => `${temp}_${lng}`),
          )
          .map(async key => {
            const [temp, lng] = key.split('_');
            const subRes = await Email.emailHelperEmailHelperGetEmailCreate({
              Template: temp,
              Language: lng,
              Currency: DEFAULT_CURRENCY,
              EmailType: EmailType.ORDER_INFO,
              ShowFooter: true,
              ShowHeader: true,
              ShowPNR: true,
              ShowPrice: true,
            });

            return { data: subRes.data.Content, key };
          }),
      );

      const data: Record<string, string | null | undefined> = {};

      res.forEach(subRes => {
        if (subRes.status === 'fulfilled') {
          data[subRes.value.key] = subRes.value.data;
        }
      });

      listenerApi.dispatch(configEmailActions.saveTemplates(data));
    },
  });

  takeLatestListeners()({
    actionCreator: configEmailActions.getLanguages,
    effect: async (action, listenerApi) => {
      const { configEmailId } = action.payload;
      const { Id } = listenerApi.getState().configEmail.configEmail;

      const res = await Data.contentContentGetListCreate({
        Item: {
          ObjectId: configEmailId ?? Id,
          ObjectType: ObjectHistoryTypes.CONFIG_EMAIL,
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

        listenerApi.dispatch(configEmailActions.saveLanguages(lng));
      } else {
        listenerApi.dispatch(
          configEmailActions.saveLanguages(
            {} as Record<
              LanguageSystem,
              LanguageSystemDetail & { contents: Array<Content> }
            >,
          ),
        );
      }
    },
  });

  takeLatestListeners(true)({
    actionCreator: configEmailActions.updateConfigEmail,
    effect: async (action, listenerApi) => {
      const { cb, data } = action.payload;

      const { Id, Logo } = listenerApi.getState().configEmail.configEmail;

      let logoUrl = Logo;

      if (typeof data.logo !== 'string' && !!data.logo) {
        const resPhoto = await uploadFiles(
          [
            {
              name: getNameOfPhoto(data.logo, 'jpg'),
              size: data.logo.size,
              type: data.logo.mime,
              uri: data.logo.path,
              fileCopyUri: data.logo.path,
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
      } else if (data.logo === '' || data.logo === null) {
        logoUrl = data.logo;
      }

      const res = await Data.emailEmailUpdateCreate({
        Item: {
          Id,
          EnableSSL: data.EnableSSL,
          MailServer: data.MailServer,
          Host: data.Host,
          MailAddress: data.MailAddress,
          Password: data.Password,
          Port: convertStringToNumber(data.Port),
          SenderName: data.SenderName,
          CCEmail: data.CCEmail,
          Template: data.template,
          ShowPrice: data.showPrice,
          ShowFooter: data.showFooter,
          ShowHeader: data.showHeader,
          ShowPNR: data.showPNR,
          IncludeETicket: data.includeETicket,
          IndividualTicket: data.individualTicket,
          TicketFormat: data.ticketType,
          Logo: logoUrl,
        },
      });

      if (validResponse(res)) {
        listenerApi.dispatch(
          configEmailActions.saveConfigEmail(res.data.Item!),
        );
      }

      cb(validResponse(res));
    },
  });
};

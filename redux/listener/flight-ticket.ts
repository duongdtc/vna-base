/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PREFIX_FLIGHT_TICKET_XLSX_NAME } from '@env';
import { getAccount } from '@vna-base/redux/selector';
import { flightTicketActions } from '@vna-base/redux/action-slice';
import { Data, SortType } from '@services/axios';
import {
  AirlineRealm,
  AirportRealm,
  FlightTicketInList,
} from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { translate } from '@vna-base/translations/translate';
import {
  PAGE_SIZE_ORDER,
  TicketStatus,
  TicketStatusDetails,
  delay,
  scale,
  validResponse,
} from '@vna-base/utils';
import { createFlightTicketInListFromAxios } from '@vna-base/utils/realm/flight-ticket';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import dayjs from 'dayjs';
import cloneDeep from 'lodash.clonedeep';
import isEmpty from 'lodash.isempty';
import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import { UpdateMode } from 'realm';
import XLSX from 'xlsx';

export const runFlightTicketListener = () => {

  takeLatestListeners()({
    actionCreator: flightTicketActions.getListFlightTicket,
    effect: async (action, listenerApi) => {
      const { filterForm, pageIndex } = action.payload;

      if (!pageIndex) {
        realmRef.current?.write(() => {
          realmRef.current?.delete(
            realmRef.current?.objects(FlightTicketInList.schema.name),
          );
        });

        listenerApi.dispatch(
          flightTicketActions.saveResultFilter({
            list: [],
            pageIndex: 1,
            totalPage: 1,
          }),
        );

        listenerApi.dispatch(flightTicketActions.changeIsLoadingFilter(true));
      }

      let _filterForm = filterForm;

      if (!isEmpty(_filterForm)) {
        listenerApi.dispatch(flightTicketActions.savedFilterForm(_filterForm));
      } else {
        _filterForm = listenerApi.getState().flightTicket.filterForm!;
      }

      const response = await Data.ticketTicketGetListCreate({
        PageSize: PAGE_SIZE_ORDER,
        PageIndex: pageIndex,
        OrderBy: _filterForm.OrderBy,
        SortType: _filterForm.SortType ?? SortType.Desc,
        Filter: _filterForm.Filter,
        From: dayjs(_filterForm.Range.from).format(),
        To: dayjs(_filterForm.Range.to).format(),
        GetAll: _filterForm.GetAll,
      });

      if (validResponse(response)) {
        const { List: newFlightTickets, TotalPage } = response.data;
        const listId: Array<string | null> = cloneDeep(
          listenerApi.getState().flightTicket.resultFilter.list,
        );

        realmRef.current?.write(() => {
          newFlightTickets?.forEach(flTicket => {
            if (
              !realmRef.current?.objectForPrimaryKey<FlightTicketInList>(
                FlightTicketInList.schema.name,
                flTicket.Id!,
              )
            ) {
              // Không bị trùng thì lưu vào realm và push vào listOrderId
              createFlightTicketInListFromAxios(flTicket);

              listId.push(flTicket.Id!);
            } else {
              // bị trùng thì update data trong realm và xoá id trong listId, push vào cuối listId
              createFlightTicketInListFromAxios(flTicket, UpdateMode.Modified);

              const i = listId.findIndex(id => id === flTicket.Id);
              listId[i] = null;

              listId.push(flTicket.Id!);
            }
          });
        });

        listenerApi.dispatch(
          flightTicketActions.saveResultFilter({
            list: listId.filter(id => id !== null) as Array<string>,
            pageIndex: pageIndex ?? 1,
            totalPage: TotalPage ?? 1,
          }),
        );
      }

      if (!pageIndex) {
        listenerApi.dispatch(flightTicketActions.changeIsLoadingFilter(false));
      }
    },
  });

  takeLatestListeners(true, {
    showConfig: {
      lottie: 'loading',
      t18nSubtitle: 'common:please_wait_a_several_minute',
      t18nTitle: 'order:exporting_file',
      lottieStyle: { width: scale(182), height: scale(72) },
    },
    successConfig: {
      lottie: 'done',
      lottieStyle: { width: scale(182), height: scale(72) },
      t18nSubtitle: 'common:success',
      t18nTitle: 'order:saved_to_download_folder_success',
    },
    failedConfig: {
      lottie: 'failed',
      lottieStyle: { width: scale(182), height: scale(72) },
      t18nSubtitle: 'common:please_try_again',
      t18nTitle: 'common:failed',
    },
  })({
    actionCreator: flightTicketActions.exportExcel,
    effect: async (action, listenerApi) => {
      const from = action.payload;

      const { language } = listenerApi.getState().app;

      const form = {
        PageSize: 10_000,
        PageIndex: 1,
        OrderBy: from.OrderBy,
        SortType: from.SortType,
        From: dayjs(from.Range.from).format(),
        To: dayjs(from.Range.to).format(),
        GetAll: true,
      };
      const response = await Data.ticketTicketGetListCreate(form);

      if (validResponse(response)) {
        // xử lý excel

        const processedData =
          response.data.List?.map((flightTicket, index) => {
            return {
              Index: index, //Số thứ tự
              System: flightTicket.System, //Hệ thống
              Airline: realmRef.current?.objectForPrimaryKey<AirlineRealm>(
                AirlineRealm.schema.name,
                flightTicket.Airline as string,
              )?.[language === 'en' ? 'NameEn' : 'NameVi'], // Hãng
              TicketNumber: flightTicket.TicketNumber, // Số vé
              TicketStatus: flightTicket.TicketStatus
                ? translate(
                  TicketStatusDetails[flightTicket.TicketStatus as TicketStatus]
                    .t18n,
                )
                : null, // trajng thasi vé
              BookingCode: flightTicket.BookingCode, //Mã booking
              IssueDate: dayjs(flightTicket.IssueDate).format('DD/MM/YYYY'), // Ngày xuất
              IssueUser: getAccount(flightTicket.IssueUser)?.FullName, // Người xuất
              Passenger: flightTicket.FullName, // Họ tên khách
              PassengerType: flightTicket.PaxType, // Loại khách
              Amount: flightTicket.Total, // Số tiền xuất
              Currency: flightTicket.Currency, // Đơn vị tiền tệ
              StartPoint:
                flightTicket.StartPoint +
                ' - ' +
                realmRef.current?.objectForPrimaryKey<AirportRealm>(
                  AirportRealm.schema.name,
                  flightTicket.StartPoint as string,
                )?.City[language === 'en' ? 'NameEn' : 'NameVi'], // Điểm khởi hành
              EndPoint:
                flightTicket.EndPoint +
                ' - ' +
                realmRef.current?.objectForPrimaryKey<AirportRealm>(
                  AirportRealm.schema.name,
                  flightTicket.EndPoint as string,
                )?.City[language === 'en' ? 'NameEn' : 'NameVi'], // Điểm đến
              FareBasic: flightTicket.FareBasis, // FareBasic
              Remark: flightTicket.Remark, // Ghi chú
            };
          }) ?? [];

        processedData.unshift({
          //@ts-ignore
          Index: translate('flight_ticket:index'), //Số thứ tự
          System: translate('flight_ticket:system'), //Hệ thống
          Airline: translate('flight_ticket:airline'), // Hãng
          TicketNumber: translate('flight_ticket:ticket_number'), // Số vé
          TicketStatus: translate('flight_ticket:ticket_status'), // trạng thái vé
          BookingCode: translate('flight_ticket:booking_code'), //Mã booking
          IssueDate: translate('flight_ticket:issue_date'), // Ngày xuất
          IssueUser: translate('flight_ticket:issue_user'), // Người xuất
          Passenger: translate('flight_ticket:passenger'), // Họ tên khách
          PassengerType: translate('flight_ticket:passenger_type'), // Loại khách
          //@ts-ignore
          Amount: translate('flight_ticket:amount'), // Số tiền xuất
          Currency: translate('flight_ticket:currency'), // Đơn vị tiền tệ
          StartPoint: translate('flight_ticket:start_point'), // Điểm khởi hành
          EndPoint: translate('flight_ticket:end_point'), // Điểm đến
          FareBasic: translate('flight_ticket:fare_basic'), // FareBasic
          Remark: translate('flight_ticket:remark'), // Ghi chú
        });

        // Tạo sheet từ dữ liệu JSON
        const wb = XLSX.utils.book_new();

        const ws = XLSX.utils.json_to_sheet(processedData, {
          skipHeader: true,
        });

        // Định dạng độ rộng cho các cột cụ thể
        const columnWidths = [
          { wch: 4 }, //Số thứ tự
          { wch: 8 }, //Hệ thống
          { wch: 20 }, // Hãng
          { wch: 14 }, // Số vé
          { wch: 20 }, // trajng thasi ve
          { wch: 14 }, //Mã booking
          { wch: 20 }, // Ngày xuất
          { wch: 36 }, // Người xuất
          { wch: 36 }, // Họ tên khách
          { wch: 20 }, // Loại khách
          { wch: 14 }, // Số tiền xuất
          { wch: 6 }, // Đơn vị tiền tệ
          { wch: 36 }, // Điểm khởi hành
          { wch: 40 }, // Điểm đến
          { wch: 40 }, // FareBasic
          { wch: 40 }, // Ghi chú
        ];

        // Áp dụng độ rộng cho từng cột trong sheet
        ws['!cols'] = columnWidths;

        const AmountColumnIndex = 10; // Xác định chỉ số cột TotalPrice

        const AmountColumnChar = XLSX.utils.encode_col(AmountColumnIndex); // Chuyển đổi chỉ số sang ký tự cột

        const format = '#,##0_);\\(#,##0\\)'; // Định dạng số tiền (ví dụ: 1,000)

        for (let R = 1; R <= (response.data.List?.length ?? 0) + 1; ++R) {
          // Bắt đầu từ hàng thứ hai (hàng tiêu đề là hàng đầu tiên)

          //Amount
          const totalPriceCellRef = `${AmountColumnChar}${R}`;
          if (ws[totalPriceCellRef]) {
            ws[totalPriceCellRef].z = format; // Áp dụng định dạng cho từng ô trong cột TotalPrice
          }
        }

        XLSX.utils.book_append_sheet(wb, ws, 'FlightTicket');
        const wbout = XLSX.write(wb, { type: 'base64' });

        const fileName = `${PREFIX_FLIGHT_TICKET_XLSX_NAME}${dayjs().format(
          'YYYYMMDD_HHmmss',
        )}`;

        const filePath =
          ReactNativeBlobUtil.fs.dirs[
          Platform.OS === 'ios' ? 'DocumentDir' : 'LegacyDownloadDir'
          ] + `/${fileName}.xlsx`;

        await ReactNativeBlobUtil.fs.writeFile(filePath, wbout, 'base64');

        await delay(500);

        if (Platform.OS === 'ios') {
          await Share.open({
            url: filePath,
            saveToFiles: true,
            filename: fileName,
          });
          // ReactNativeBlobUtil.ios.presentOptionsMenu(filePath);
        } else {
          // showToast({
          //   type: 'success',
          //   t18n: 'order:saved_to_download_folder_success',
          // });
          // await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
          //   {
          //     name: fileName, // name of the file
          //     parentFolder: '', // subdirectory in the Media Store, e.g. HawkIntech/Files to create a folder HawkIntech with a subfolder Files and save the image within this folder
          //     mimeType:
          //       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // MIME type of the file
          //   },
          //   'Download', // Media Collection to store the file in ("Audio" | "Image" | "Video" | "Download")
          //   filePath, // Path to the file being copied in the apps own storage
          // );
          // await Share.open({
          //   type: 'file',
          //   url: filePath,
          // });
        }
      }
    },
  });
}
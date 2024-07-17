/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { hideLoading, showLoading, showToast } from '@vna-base/components';
import { PREFIX_BOOKING_XLSX_NAME } from '@env';
import {
  bookingActions,
  bookingActionActions,
} from '@vna-base/redux/action-slice';
import { Data, Ibe, SortType } from '@services/axios';
import { Booking } from '@services/axios/axios-data';
import { BookingRealm } from '@services/realm/models/booking';
import { realmRef } from '@services/realm/provider';
import { translate } from '@vna-base/translations/translate';
import {
  BookingStatus,
  BookingStatusDetails,
  delay,
  PAGE_SIZE_BOOKING,
  scale,
  validResponse,
} from '@vna-base/utils';
import { createBookingFromAxios } from '@vna-base/utils/realm/bookings';
import {
  takeLatestListeners,
  takeMultiListeners,
} from '@vna-base/utils/redux/listener';
import dayjs from 'dayjs';
import cloneDeep from 'lodash.clonedeep';
import isEmpty from 'lodash.isempty';
import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import { UpdateMode } from 'realm';
import XLSX from 'xlsx';

export const runBookingListnener = () => {
  takeLatestListeners()({
    actionCreator: bookingActions.getListBookings,
    effect: async (action, listenerApi) => {
      const { filterForm, pageIndex } = action.payload;

      if (!pageIndex) {
        realmRef.current?.write(() => {
          realmRef.current?.delete(
            realmRef.current?.objects(BookingRealm.schema.name),
          );
        });

        listenerApi.dispatch(
          bookingActions.saveResultFilter({
            list: [],
            pageIndex: 1,
            totalPage: 1,
          }),
        );

        listenerApi.dispatch(bookingActions.changeLoadingFilter(true));
      }

      let _filterForm = filterForm;

      if (!isEmpty(_filterForm)) {
        listenerApi.dispatch(bookingActions.savedFilterForm(_filterForm));
      } else {
        _filterForm = listenerApi.getState().bookings.filterForm!;
      }

      const response = await Data.bookingBookingGetListCreate({
        PageSize: PAGE_SIZE_BOOKING,
        PageIndex: pageIndex ?? 1,
        OrderBy: _filterForm.OrderBy,
        SortType: _filterForm.SortType ?? SortType.Desc,
        Filter: _filterForm.Filter,
        From: dayjs(_filterForm.Range.from).format(),
        To: dayjs(_filterForm.Range.to).format(),
        GetAll: _filterForm.GetAll,
      });

      if (validResponse(response)) {
        const { List: newBookings, TotalPage } = response.data;
        const listId: Array<string | null> = cloneDeep(
          listenerApi.getState().bookings.resultFilter.list,
        );

        realmRef.current?.write(() => {
          newBookings?.forEach(booking => {
            if (
              !realmRef.current?.objectForPrimaryKey<BookingRealm>(
                BookingRealm.schema.name,
                booking.Id!,
              )
            ) {
              // Không bị trùng thì lưu vào realm và push vào listOrderId
              createBookingFromAxios(booking);

              listId.push(booking.Id!);
            } else {
              // bị trùng thì update data trong realm và xoá id trong listId, push vào cuối listId
              createBookingFromAxios(booking, UpdateMode.Modified);

              const i = listId.findIndex(id => id === booking.Id);
              listId[i] = null;

              listId.push(booking.Id!);
            }
          });
        });

        listenerApi.dispatch(
          bookingActions.saveResultFilter({
            list: listId.filter(id => id !== null) as Array<string>,
            pageIndex: pageIndex ?? 1,
            totalPage: TotalPage ?? 1,
          }),
        );
      }

      if (!pageIndex) {
        listenerApi.dispatch(bookingActions.changeLoadingFilter(false));
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
    actionCreator: bookingActions.exportExcel,
    effect: async (action, _) => {
      const { filterForm } = action.payload;

      const form = {
        PageSize: 10_000,
        PageIndex: 1,
        OrderBy: filterForm.OrderBy,
        SortType: filterForm.SortType,
        From: dayjs(filterForm.Range.from).format(),
        To: dayjs(filterForm.Range.to).format(),
        GetAll: true,
      };
      const response = await Data.bookingBookingGetListCreate(form);

      if (validResponse(response)) {
        // xử lý excel
        const processedData =
          response.data.List?.map(booking => {
            return {
              Index: booking.OrderCode ?? '', // index
              BookingStatus: translate(
                BookingStatusDetails[booking.BookingStatus as BookingStatus]
                  .t18n,
              ), // trạng thái
              FlightBooking: booking.BookingCode
                ? booking.Airline + ':' + booking.BookingCode
                : booking.Airline, // mã đặt chỗ
              FlightInfo: booking.FlightInfo ?? '', // Chuyến bay
              PaxName: booking.PaxName ?? '', // tên khách
              PaxSumm: booking.PaxSumm ?? '', // số khách
              TotalPrice: booking.TotalPrice ?? '', // giá bán
              NetPrice: booking.NetPrice ?? '', // giá nhập
              //cmt: paidamt here
              Profit: booking.Profit ?? '', // lợi nhuận
              Currency: booking.Currency, // loại tiền
              ContactName: booking.ContactName ?? '', // liên hệ
              ContactPhone: booking.ContactPhone ?? '', // điện thoại
              ContactEmail: booking.ContactEmail ?? '', // email
            };
          }) ?? [];

        processedData.unshift({
          //@ts-ignore
          Index: translate('order:order_code'), // mã đơn hàng
          BookingStatus: translate('order:status'), // trạng thái
          FlightBooking: translate('order:booking_code'), // mã đặt chỗ
          FlightInfo: translate('order:flight'), // Chuyến bay
          PaxName: translate('order:customer_name'), // tên khách
          PaxSumm: translate('order:number_of_passengers'), // số khách
          //@ts-ignore
          TotalPrice: translate('order:selling_price'), // giá bán
          //@ts-ignore
          NetPrice: translate('order:purchase_price'), // giá nhập
          //cmt: paidamt here
          //@ts-ignore
          Profit: translate('order:profit'), // lợi nhuận
          Currency: translate('order:currency'), // loại tiền
          ContactName: translate('order:contact'), // liên hệ
          ContactPhone: translate('order:phone'), // điện thoại
          ContactEmail: translate('order:email'), // email
        });

        // Tạo sheet từ dữ liệu JSON
        const wb = XLSX.utils.book_new();

        const ws = XLSX.utils.json_to_sheet(processedData, {
          skipHeader: true,
        });

        // Định dạng độ rộng cho các cột cụ thể
        const columnWidths = [
          { wch: 14 }, // mã đơn hàng
          { wch: 16 }, // trạng thái
          { wch: 16 }, // mã đặt chỗ
          { wch: 32 }, // Hệ thống
          { wch: 36 }, // tên khách
          { wch: 22 }, // số khách
          { wch: 10 }, // loại tiền
          { wch: 14 }, // giá bán
          { wch: 14 }, // giá nhập
          { wch: 14 }, // lợi nhuận
          { wch: 36 }, // liên hệ
          { wch: 20 }, // điện thoại
          { wch: 36 }, // email
        ];

        // Áp dụng độ rộng cho từng cột trong sheet
        ws['!cols'] = columnWidths;

        // const IndexColumnIndex = 6; // Xác định chỉ số cột Index
        const TotalPriceColumnIndex = 7; // Xác định chỉ số cột TotalPrice
        const NetPriceColumnIndex = 8; // Xác định chỉ số cột NetPrice
        // const PaidAmtColumnIndex = 10; // Xác định chỉ số cột PaidAmt
        const ProfitColumnIndex = 9; // Xác định chỉ số cột Profit

        const TotalPriceColumnChar = XLSX.utils.encode_col(
          TotalPriceColumnIndex,
        ); // Chuyển đổi chỉ số sang ký tự cột
        const NetPriceColumnChar = XLSX.utils.encode_col(NetPriceColumnIndex);
        // const PaidAmtColumnChar = XLSX.utils.encode_col(PaidAmtColumnIndex);
        const ProfitColumnChar = XLSX.utils.encode_col(ProfitColumnIndex);
        // const IndexColumnChar = XLSX.utils.encode_col(IndexColumnIndex);

        const format = '#,##0_);\\(#,##0\\)'; // Định dạng số tiền (ví dụ: 1,000)

        for (let R = 1; R <= (response.data.List?.length ?? 0) + 1; ++R) {
          // Bắt đầu từ hàng thứ hai (hàng tiêu đề là hàng đầu tiên)

          //TotalPrice
          const totalPriceCellRef = `${TotalPriceColumnChar}${R}`;
          if (ws[totalPriceCellRef]) {
            ws[totalPriceCellRef].z = format; // Áp dụng định dạng cho từng ô trong cột TotalPrice
          }

          //NetPrice
          const netPriceCellRef = `${NetPriceColumnChar}${R}`;
          if (ws[netPriceCellRef]) {
            ws[netPriceCellRef].z = format;
          }

          //PaidAmt
          // const paidAmtCellRef = `${PaidAmtColumnChar}${R}`;
          // if (ws[paidAmtCellRef]) {
          //   ws[paidAmtCellRef].z = format;
          // }

          //Profit
          const profitCellRef = `${ProfitColumnChar}${R}`;
          if (ws[profitCellRef]) {
            ws[profitCellRef].z = format;
          }

          //Index
          // const indexCellRef = `${IndexColumnChar}${R}`;
          // if (ws[indexCellRef]) {
          //   ws[indexCellRef].s = { alignment: { horizontal: 'left' } };
          // }
        }

        XLSX.utils.book_append_sheet(wb, ws, 'FlightBooking');
        const wbout = XLSX.write(wb, { type: 'base64' });

        const fileName = `${PREFIX_BOOKING_XLSX_NAME}${dayjs().format(
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

  takeMultiListeners()({
    actionCreator: bookingActions.getBookingByIdOrBookingCode,
    effect: async (action, listenerApi) => {
      const { id, system, bookingCode, surname, option, cb } = action.payload;
      const idHistory = bookingCode;

      const { viewingBookingId } = listenerApi.getState().bookings;

      const isShowLoading =
        option?.isViewing || (viewingBookingId === id && option?.force);

      const isSaveLoading =
        option?.withLoading || (viewingBookingId !== id && option?.force);

      if (isShowLoading) {
        showLoading();
      }

      if (isSaveLoading) {
        listenerApi.dispatch(
          bookingActions.saveLoadingBooking({ [id!]: true }),
        );
      }

      const history = listenerApi.getState().bookings.historyGetDetail;

      if (
        !history[idHistory] ||
        dayjs().unix() - history[idHistory] > 30 ||
        option?.force
      ) {
        const resRetrieve = await Ibe.flightRetrieveBookingCreate({
          BookingId: id,
          BookingCode: bookingCode,
          System: system,
          PassengerName: surname,
        });
        const retrieveSuccess = validResponse(resRetrieve);

        cb?.(retrieveSuccess, {
          bookingId: resRetrieve.data.Booking?.BookingId,
          bookingCode: resRetrieve.data.Booking?.BookingCode,
          surname: (resRetrieve.data.Booking?.ListPassenger ?? [])[0]?.Surname,
        });

        if (retrieveSuccess || (id && id !== '')) {
          const bookingId = resRetrieve.data.Booking?.BookingId ?? id!;

          const response = await Data.bookingBookingGetByIdCreate({
            Id: bookingId,
            Forced: true,
          });

          if (validResponse(response)) {
            listenerApi.dispatch(
              bookingActionActions.getActionsByBookingId(bookingId),
            );

            realmRef.current?.write(() => {
              createBookingFromAxios(
                response.data.Item as Booking,
                UpdateMode.Modified,
              );
            });
          }
        }

        listenerApi.dispatch(
          bookingActions.saveHistoryGetDetail({
            ...history,
            [idHistory]: dayjs().unix(),
          }),
        );
      }

      if (isShowLoading) {
        listenerApi.dispatch(bookingActions.saveViewingBookingId(id!));
        hideLoading();
      }

      if (isSaveLoading) {
        listenerApi.dispatch(
          bookingActions.saveLoadingBooking({ [id!]: false }),
        );
      }
    },
  });

  takeLatestListeners()({
    actionCreator: bookingActions.updateBooking,
    effect: async action => {
      const { item, isLoadingModal, cb } = action.payload;

      showLoading(
        isLoadingModal
          ? {
              lottie: 'loading',
              t18nSubtitle: 'common:please_wait_a_several_minute',
              t18nTitle: 'update_booking:updating',
              lottieStyle: { width: scale(182), height: scale(72) },
            }
          : undefined,
      );

      const res = await Data.bookingBookingUpdateCreate({
        Item: item,
      });

      if (validResponse(res)) {
        // tìm index của item bị xoá trong list
        if (!isLoadingModal) {
          showToast({
            type: 'success',
            t18n: 'booking:update_success',
          });
        }

        // const { resultFilter } = listenerApi.getState().bookings;

        // const idx = resultFilter.list?.findIndex(bk => bk === item.Id) ?? 0;

        // nếu tìm thấy
        // if (resultFilter.list !== undefined && idx !== -1) {
        // tính xem item đó thuộc page nào thì lấy lại data từ page đó
        // const page = Math.floor(idx / PAGE_SIZE_BOOKING) + 1;
        //call load more
        // listenerApi.dispatch(bookingActions.loadMoreBookings(page));
        // }

        // listenerApi.dispatch(bookingActions.getBookingById(item.Id!));
        await delay(1000);

        hideLoading(
          isLoadingModal
            ? {
                lottie: 'done',
                t18nSubtitle: 'update_booking:update_successful',
                t18nTitle: 'update_booking:success',
                lottieStyle: { width: scale(182), height: scale(72) },
              }
            : undefined,
        );
      } else {
        await delay(500);
        hideLoading(
          isLoadingModal
            ? {
                lottie: 'failed',
                t18nSubtitle: 'update_booking:contact_admin_help',
                t18nTitle: 'update_booking:failed',
                lottieStyle: { width: scale(182), height: scale(72) },
              }
            : undefined,
        );
      }

      cb?.(validResponse(res));
    },
  });

  // takeLatestListeners(true)({
  //   actionCreator: bookingActions.deleteBookings,
  //   effect: async (action, listenerApi) => {
  //     const { ids, cb } = action.payload;

  //     const allRes = await Promise.allSettled(
  //       ids.map(async id => {
  //         const res = await Data.bookingBookingDeleteCreate({
  //           Id: id,
  //         });
  //         return res;
  //       }),
  //     );

  //     const isSuccess = allRes.reduce(
  //       (total, currRes) =>
  //         total ||
  //         (currRes.status === 'fulfilled' && validResponse(currRes.value)),
  //       true,
  //     );

  //     if (isSuccess || allRes.length > 1) {
  //       // nếu xoá thành công thì thực hiện callback, callback thường là nav về màn trước
  //       cb();

  //       showToast({
  //         type: 'success',
  //         t18n: 'booking:delete_booking_success',
  //       });

  //       // tìm index của item bị xoá trong list

  //       const idx =
  //         listenerApi
  //           .getState()
  //           .bookings.resultFilter.List?.findIndex(bk => bk.Id === ids[0]) ?? 0;

  //       // nếu tìm thấy
  //       if (idx !== -1) {
  //         // tính xem item đó thuộc page nào thì lấy lại data từ page đó
  //         const page = Math.floor(idx / PAGE_SIZE_BOOKING) + 1;
  //         //call load more
  //         listenerApi.dispatch(bookingActions.loadMoreBookings(page));
  //       }
  //     } else {
  //       showModalConfirm({
  //         t18nTitle: 'booking:delete_booking_failed',
  //         t18nSubtitle: 'booking:delete_booking_failed_subtitle',
  //         t18nCancel: 'modal_confirm:close',
  //       });
  //     }
  //   },
  // });

  takeMultiListeners(true)({
    actionCreator: bookingActions.getBookingVersionDetail,
    effect: async (action, listenerApi) => {
      const { id } = action.payload;

      const response = await Data.bookingBookingGetVersionCreate({
        Id: id,
        Forced: true,
      });

      if (validResponse(response)) {
        listenerApi.dispatch(
          bookingActions.saveViewingBookingVersion(response.data.Item!),
        );
      }
    },
  });
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EntryType } from '@redux/type';
import { Data } from '@services/axios';
import { EntryItem } from '@services/axios/axios-data';
import { realmRef } from '@services/realm/provider';
import { I18nKeys } from '@translations/locales';
import { topupActions } from '@vna-base/redux/action-slice';
import { scale, validResponse } from '@vna-base/utils';
import { createTopupFromAxios } from '@vna-base/utils/realm/topup';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import dayjs from 'dayjs';
import { UpdateMode } from 'realm';

export const runTopupListener = () => {
  takeLatestListeners()({
    actionCreator: topupActions.getListTopupHistory,
    effect: async (action, listenerApi) => {
      // const { filterForm, pageIndex } = action.payload;
      // if (!pageIndex) {
      //   realmRef.current?.write(() => {
      //     realmRef.current?.delete(realmRef.current?.objects(TopupRealm.schema.name));
      //   });
      //   listenerApi.dispatch(
      //     topupActions.saveResultFilter({
      //       list: [],
      //       pageIndex: 1,
      //       totalPage: 1,
      //     }),
      //   );
      //   listenerApi.dispatch(topupActions.changeLoadingFilter(true));
      // }
      // let _filterForm = filterForm;
      // if (!isEmpty(_filterForm)) {
      //   listenerApi.dispatch(topupActions.savedFilterForm(_filterForm));
      // } else {
      //   _filterForm = listenerApi.getState().topup.filterForm!;
      // }
      // const response = await Data.entryItemEntryItemGetOwnerCreate({
      //   PageSize: PAGE_SIZE_ORDER,
      //   PageIndex: pageIndex ?? 1,
      //   OrderBy: _filterForm.OrderBy,
      //   SortType: _filterForm.SortType ?? SortType.Desc,
      //   Filter: _filterForm.Filter,
      //   From: dayjs(_filterForm.Range.from).format(),
      //   To: dayjs(_filterForm.Range.to).format(),
      //   GetAll: _filterForm.GetAll,
      // });
      // if (validResponse(response)) {
      //   const { List: newEntryItems, TotalPage } = response.data;
      //   const listId: Array<string | null> = cloneDeep(
      //     listenerApi.getState().topup.resultFilter.list,
      //   );
      //   realmRef.current?.write(() => {
      //     newEntryItems?.forEach(entryItem => {
      //       if (
      //         !realmRef.current?.objectForPrimaryKey<TopupRealm>(
      //           TopupRealm.schema.name,
      //           entryItem.Id!,
      //         )
      //       ) {
      //         // Không bị trùng thì lưu vào realm và push vào listOrderId
      //         createTopupFromAxios(entryItem);
      //         listId.push(entryItem.Id!);
      //       } else {
      //         // bị trùng thì update data trong realm và xoá id trong listId, push vào cuối listId
      //         createTopupFromAxios(entryItem, UpdateMode.Modified);
      //         const i = listId.findIndex(id => id === entryItem.Id);
      //         listId[i] = null;
      //         listId.push(entryItem.Id!);
      //       }
      //     });
      //   });
      //   listenerApi.dispatch(
      //     topupActions.saveResultFilter({
      //       list: listId.filter(id => id !== null) as Array<string>,
      //       pageIndex: pageIndex ?? 1,
      //       totalPage: TotalPage ?? 1,
      //     }),
      //   );
      // }
      // if (!pageIndex) {
      //   listenerApi.dispatch(topupActions.changeLoadingFilter(false));
      // }
    },
  });

  takeLatestListeners()({
    actionCreator: topupActions.getTopupDetailByIdAndParentId,
    effect: async action => {
      const { id } = action.payload;

      const response = await Data.entryItemEntryItemGetByIdAndParentIdCreate({
        Id: id,
      });

      if (validResponse(response)) {
        realmRef.current?.write(() => {
          createTopupFromAxios(
            response.data.Item as EntryItem,
            UpdateMode.Modified,
          );
        });
      }
    },
  });

  takeLatestListeners()({
    actionCreator: topupActions.getAllType,
    effect: async (_, listenerApi) => {
      const res = await Data.entryTypeEntryTypeGetAllCreate({});

      if (validResponse(res)) {
        const obj: Record<string, EntryType> = {
          R_OTHER: {
            ViewVi: 'Khác',
            key: 'R_OTHER',
            ViewEn: 'Other',
            t18n: 'Khác' as I18nKeys,
          },
        };

        res.data.List?.forEach(entryType => {
          obj[entryType.Code as string] = {
            ...entryType,
            key: entryType.Code!,
            t18n: entryType.ViewVi as I18nKeys,
          };
        });

        listenerApi.dispatch(topupActions.saveAllType(obj));
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
    actionCreator: topupActions.exportExcel,
    effect: async (action, _listenerApi) => {
      const form = action.payload;

      const response = await Data.entryItemEntryItemGetOwnerCreate({
        PageSize: 10_000,
        PageIndex: 1,
        OrderBy: form.OrderBy,
        SortType: form.SortType,
        From: dayjs(form.Range.from).format(),
        To: dayjs(form.Range.to).format(),
        GetAll: false,
      });
      console.log(
        '🚀 ~ effect: ~ response:',
        JSON.stringify(response.data.List),
      );

      // if (validResponse(response)) {
      //   // xử lý excel

      //   const processedData =
      //     response.data.List?.map(order => {
      //       return {
      //         Index: order.Index, // mã đơn hàng
      //         OrderStatus: translate(
      //           OrderStatusDetails[order.OrderStatus as OrderStatus].t18n,
      //         ), // trạng thái
      //         FlightBooking: order.FlightBooking, // mã đặt chỗ
      //         FlightSystem: calSystemNameExcel(order.FlightSystem), // Hệ thống
      //         FlightInfo: order.FlightInfo, // Chuyến bay
      //         PaxName: order.PaxName, // tên khách
      //         PaxSumm: order.PaxSumm, // số khách
      //         Currency: order.Currency, // loại tiền
      //         TotalPrice: order.TotalPrice, // giá bán
      //         NetPrice: order.NetPrice, // giá nhập
      //         Profit: order.Profit, // lợi nhuận
      //         PaidAmt: order.PaidAmt, // đã thanh toán
      //         ContactName: order.ContactName, // liên hệ
      //         ContactPhone: order.ContactPhone, // điện thoại
      //         ContactEmail: order.ContactEmail, // email
      //         MonitorBy: getAccount(order.MonitorBy)?.FullName, // người xử lý
      //         PaymentExpiry: order.PaymentExpiry
      //           ? dayjs(order.PaymentExpiry).format('DD/MM/YYYY HH:mm')
      //           : '', // Thời hạn thanh toán
      //         CreatedDate: dayjs(order.CreatedDate).format('DD/MM/YYYY HH:mm'), // ngày đặt
      //       };
      //     }) ?? [];
      //   processedData.unshift({
      //     //@ts-ignore
      //     Index: translate('order:order_code'), // mã đơn hàng
      //     OrderStatus: translate('order:status'), // trạng thái
      //     FlightBooking: translate('order:booking_code'), // mã đặt chỗ
      //     FlightSystem: translate('order:system'), // Hệ thống
      //     FlightInfo: translate('order:flight'), // Chuyến bay
      //     PaxName: translate('order:customer_name'), // tên khách
      //     PaxSumm: translate('order:number_of_passengers'), // số khách
      //     Currency: translate('order:currency'), // loại tiền
      //     //@ts-ignore
      //     TotalPrice: translate('order:selling_price'), // giá bán
      //     //@ts-ignore
      //     NetPrice: translate('order:purchase_price'), // giá nhập
      //     //@ts-ignore
      //     Profit: translate('order:profit'), // lợi nhuận
      //     //@ts-ignore
      //     PaidAmt: translate('order:paid_amount'), // đã thanh toán
      //     ContactName: translate('order:contact'), // liên hệ
      //     ContactPhone: translate('order:phone'), // điện thoại
      //     ContactEmail: translate('order:email'), // email
      //     MonitorBy: translate('order:processor'), // người xử lý
      //     PaymentExpiry: translate('order:payment_deadline'), // Thời hạn thanh toán
      //     CreatedDate: translate('order:date_ordered'), // ngày đặt
      //   });

      //   // Tạo sheet từ dữ liệu JSON
      //   const wb = XLSX.utils.book_new();

      //   const ws = XLSX.utils.json_to_sheet(processedData, {
      //     skipHeader: true,
      //   });

      //   // Định dạng độ rộng cho các cột cụ thể
      //   const columnWidths = [
      //     { wch: 14 }, // mã đơn hàng
      //     { wch: 16 }, // trạng thái
      //     { wch: 16 }, // mã đặt chỗ
      //     { wch: 32 }, // Hệ thống
      //     { wch: 36 }, // Chuyến bay
      //     { wch: 36 }, // tên khách
      //     { wch: 22 }, // số khách
      //     { wch: 10 }, // loại tiền
      //     { wch: 14 }, // giá bán
      //     { wch: 14 }, // giá nhập
      //     { wch: 14 }, // lợi nhuận
      //     { wch: 14 }, // đã thanh toán
      //     { wch: 36 }, // liên hệ
      //     { wch: 20 }, // điện thoại
      //     { wch: 36 }, // email
      //     { wch: 36 }, // người xử lý
      //     { wch: 20 }, // Thời hạn thanh toán
      //     { wch: 20 }, // ngày đặt
      //   ];

      //   // Áp dụng độ rộng cho từng cột trong sheet
      //   ws['!cols'] = columnWidths;

      //   // const IndexColumnIndex = 6; // Xác định chỉ số cột Index
      //   const TotalPriceColumnIndex = 8; // Xác định chỉ số cột TotalPrice
      //   const NetPriceColumnIndex = 9; // Xác định chỉ số cột NetPrice
      //   const PaidAmtColumnIndex = 10; // Xác định chỉ số cột PaidAmt
      //   const ProfitColumnIndex = 11; // Xác định chỉ số cột Profit

      //   const TotalPriceColumnChar = XLSX.utils.encode_col(TotalPriceColumnIndex); // Chuyển đổi chỉ số sang ký tự cột
      //   const NetPriceColumnChar = XLSX.utils.encode_col(NetPriceColumnIndex);
      //   const PaidAmtColumnChar = XLSX.utils.encode_col(PaidAmtColumnIndex);
      //   const ProfitColumnChar = XLSX.utils.encode_col(ProfitColumnIndex);
      //   // const IndexColumnChar = XLSX.utils.encode_col(IndexColumnIndex);

      //   const format = '#,##0_);\\(#,##0\\)'; // Định dạng số tiền (ví dụ: 1,000)

      //   for (let R = 1; R <= (response.data.List?.length ?? 0) + 1; ++R) {
      //     // Bắt đầu từ hàng thứ hai (hàng tiêu đề là hàng đầu tiên)

      //     //TotalPrice
      //     const totalPriceCellRef = `${TotalPriceColumnChar}${R}`;
      //     if (ws[totalPriceCellRef]) {
      //       ws[totalPriceCellRef].z = format; // Áp dụng định dạng cho từng ô trong cột TotalPrice
      //     }

      //     //NetPrice
      //     const netPriceCellRef = `${NetPriceColumnChar}${R}`;
      //     if (ws[netPriceCellRef]) {
      //       ws[netPriceCellRef].z = format;
      //     }

      //     //PaidAmt
      //     const paidAmtCellRef = `${PaidAmtColumnChar}${R}`;
      //     if (ws[paidAmtCellRef]) {
      //       ws[paidAmtCellRef].z = format;
      //     }

      //     //Profit
      //     const profitCellRef = `${ProfitColumnChar}${R}`;
      //     if (ws[profitCellRef]) {
      //       ws[profitCellRef].z = format;
      //     }

      //     //Index
      //     // const indexCellRef = `${IndexColumnChar}${R}`;
      //     // if (ws[indexCellRef]) {
      //     //   ws[indexCellRef].s = { alignment: { horizontal: 'left' } };
      //     // }
      //   }

      //   XLSX.utils.book_append_sheet(wb, ws, 'Order');
      //   const wbout = XLSX.write(wb, { type: 'base64' });

      //   const fileName = `${PREFIX_ORDER_XLSX_NAME}${dayjs().format(
      //     'YYYYMMDD_HHmmss',
      //   )}`;

      //   const filePath =
      //     ReactNativeBlobUtil.fs.dirs[
      //       Platform.OS === 'ios' ? 'DocumentDir' : 'LegacyDownloadDir'
      //     ] + `/${fileName}.xlsx`;

      //   await ReactNativeBlobUtil.fs.writeFile(filePath, wbout, 'base64');

      //   await delay(500);

      //   if (Platform.OS === 'ios') {
      //     await Share.open({
      //       url: filePath,
      //       saveToFiles: true,
      //       filename: fileName,
      //     });
      //     // ReactNativeBlobUtil.ios.presentOptionsMenu(filePath);
      //   } else {
      //     // showToast({
      //     //   type: 'success',
      //     //   t18n: 'order:saved_to_download_folder_success',
      //     // });
      //     // await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
      //     //   {
      //     //     name: fileName, // name of the file
      //     //     parentFolder: '', // subdirectory in the Media Store, e.g. HawkIntech/Files to create a folder HawkIntech with a subfolder Files and save the image within this folder
      //     //     mimeType:
      //     //       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // MIME type of the file
      //     //   },
      //     //   'Download', // Media Collection to store the file in ("Audio" | "Image" | "Video" | "Download")
      //     //   filePath, // Path to the file being copied in the apps own storage
      //     // );
      //     // await Share.open({
      //     //   type: 'file',
      //     //   url: filePath,
      //     // });
      //   }
      // }
    },
  });
};

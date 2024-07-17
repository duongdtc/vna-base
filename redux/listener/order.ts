/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { showToast } from '@vna-base/components';
import { PREFIX_ORDER_XLSX_NAME } from '@env';
import { getAccount } from '@redux-selector';
import { bookingActions, orderActions } from '@redux-slice';
import { FormOrderDetailType } from '@vna-base/screens/order-detail/type';
import { Data, SortType } from '@services/axios';
import { HistoryLst, Order, Remark } from '@services/axios/axios-data';
import { OrderRealm as OrderRealm } from '@services/realm/models/order';
import { realmRef } from '@services/realm/provider';
import { translate } from '@vna-base/translations/translate';
import {
  OrderStatus,
  OrderStatusDetails,
  PAGE_SIZE_ORDER,
  calSystemNameExcel,
  delay,
  getState,
  scale,
  validResponse,
} from '@vna-base/utils';
import { createOrderFromAxios } from '@vna-base/utils/realm/order';
import { takeLatestListeners } from '@vna-base/utils/redux/listener';
import dayjs from 'dayjs';
import cloneDeep from 'lodash.clonedeep';
import isEmpty from 'lodash.isempty';
import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import { UpdateMode } from 'realm';
import XLSX from 'xlsx';

const ObjFlags: Record<keyof Omit<FormOrderDetailType, 'FormNote'>, string> = {
  MonitorBy: 'orderOrderUpdateMonitorCreate',
  OrderStatus: 'orderOrderUpdateStatusCreate',
  FormOrder: 'orderOrderUpdateInfoCreate',
  FormContact: 'orderOrderUpdateContactCreate',
  FormPaymentTab: 'orderOrderChangePaymentCreate',
};

const ObjFlagsRevert: Record<
  string,
  keyof Omit<FormOrderDetailType, 'FormNote'>
> = {
  orderOrderUpdateMonitorCreate: 'MonitorBy',
  orderOrderUpdateStatusCreate: 'OrderStatus',
  orderOrderUpdateInfoCreate: 'FormOrder',
  orderOrderUpdateContactCreate: 'FormContact',
  orderOrderChangePaymentCreate: 'FormPaymentTab',
};

takeLatestListeners()({
  actionCreator: orderActions.getListOrder,
  effect: async (action, listenerApi) => {
    const { filterForm, pageIndex } = action.payload;
    if (!pageIndex) {
      realmRef.current?.write(() => {
        realmRef.current?.delete(
          realmRef.current?.objects(OrderRealm.schema.name),
        );
      });

      listenerApi.dispatch(
        orderActions.saveResultFilter({
          list: [],
          pageIndex: 1,
          totalPage: 1,
        }),
      );

      listenerApi.dispatch(orderActions.changeLoadingFilter(true));
    }

    let _filterForm = filterForm;

    if (!isEmpty(_filterForm)) {
      listenerApi.dispatch(orderActions.savedFilterForm(_filterForm));
    } else {
      _filterForm = listenerApi.getState().order.filterForm!;
    }

    const response = await Data.orderOrderGetListCreate({
      PageSize: PAGE_SIZE_ORDER,
      PageIndex: pageIndex ?? 1,
      OrderBy: _filterForm.OrderBy,
      SortType: _filterForm.SortType ?? SortType.Desc,
      Filter: _filterForm.Filter,
      From: dayjs(_filterForm.Range.from).format(),
      To: dayjs(_filterForm.Range.to).format(),
      GetAll: _filterForm.GetAll,
    });

    if (validResponse(response)) {
      const { List: newOrders, TotalPage } = response.data;
      const listId: Array<string | null> = cloneDeep(
        listenerApi.getState().order.resultFilter.list,
      );

      realmRef.current?.write(() => {
        newOrders?.forEach(order => {
          if (
            !realmRef.current?.objectForPrimaryKey<OrderRealm>(
              OrderRealm.schema.name,
              order.Id!,
            )
          ) {
            // Không bị trùng thì lưu vào realm và push vào listOrderId
            createOrderFromAxios(order);

            listId.push(order.Id!);
          } else {
            // bị trùng thì update data trong realm và xoá id trong listId, push vào cuối listId
            createOrderFromAxios(order, UpdateMode.Modified);

            const i = listId.findIndex(id => id === order.Id);
            listId[i] = null;

            listId.push(order.Id!);
          }
        });
      });

      listenerApi.dispatch(
        orderActions.saveResultFilter({
          list: listId.filter(id => id !== null) as Array<string>,
          pageIndex: pageIndex ?? 1,
          totalPage: TotalPage ?? 1,
        }),
      );
    }

    if (!pageIndex) {
      listenerApi.dispatch(orderActions.changeLoadingFilter(false));
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
  actionCreator: orderActions.exportExcel,
  effect: async (action, _listenerApi) => {
    const form = action.payload;

    const response = await Data.orderOrderGetListCreate({
      PageSize: 10_000,
      PageIndex: 1,
      OrderBy: form.OrderBy,
      SortType: form.SortType,
      From: dayjs(form.Range.from).format(),
      To: dayjs(form.Range.to).format(),
      GetAll: true,
    });

    if (validResponse(response)) {
      // xử lý excel

      const processedData =
        response.data.List?.map(order => {
          return {
            Index: order.Index, // mã đơn hàng
            OrderStatus: translate(
              OrderStatusDetails[order.OrderStatus as OrderStatus].t18n,
            ), // trạng thái
            FlightBooking: order.FlightBooking, // mã đặt chỗ
            FlightSystem: calSystemNameExcel(order.FlightSystem), // Hệ thống
            FlightInfo: order.FlightInfo, // Chuyến bay
            PaxName: order.PaxName, // tên khách
            PaxSumm: order.PaxSumm, // số khách
            Currency: order.Currency, // loại tiền
            TotalPrice: order.TotalPrice, // giá bán
            NetPrice: order.NetPrice, // giá nhập
            Profit: order.Profit, // lợi nhuận
            PaidAmt: order.PaidAmt, // đã thanh toán
            ContactName: order.ContactName, // liên hệ
            ContactPhone: order.ContactPhone, // điện thoại
            ContactEmail: order.ContactEmail, // email
            MonitorBy: getAccount(order.MonitorBy)?.FullName, // người xử lý
            PaymentExpiry: order.PaymentExpiry
              ? dayjs(order.PaymentExpiry).format('DD/MM/YYYY HH:mm')
              : '', // Thời hạn thanh toán
            CreatedDate: dayjs(order.CreatedDate).format('DD/MM/YYYY HH:mm'), // ngày đặt
          };
        }) ?? [];
      processedData.unshift({
        //@ts-ignore
        Index: translate('order:order_code'), // mã đơn hàng
        OrderStatus: translate('order:status'), // trạng thái
        FlightBooking: translate('order:booking_code'), // mã đặt chỗ
        FlightSystem: translate('order:system'), // Hệ thống
        FlightInfo: translate('order:flight'), // Chuyến bay
        PaxName: translate('order:customer_name'), // tên khách
        PaxSumm: translate('order:number_of_passengers'), // số khách
        Currency: translate('order:currency'), // loại tiền
        //@ts-ignore
        TotalPrice: translate('order:selling_price'), // giá bán
        //@ts-ignore
        NetPrice: translate('order:purchase_price'), // giá nhập
        //@ts-ignore
        Profit: translate('order:profit'), // lợi nhuận
        //@ts-ignore
        PaidAmt: translate('order:paid_amount'), // đã thanh toán
        ContactName: translate('order:contact'), // liên hệ
        ContactPhone: translate('order:phone'), // điện thoại
        ContactEmail: translate('order:email'), // email
        MonitorBy: translate('order:processor'), // người xử lý
        PaymentExpiry: translate('order:payment_deadline'), // Thời hạn thanh toán
        CreatedDate: translate('order:date_ordered'), // ngày đặt
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
        { wch: 36 }, // Chuyến bay
        { wch: 36 }, // tên khách
        { wch: 22 }, // số khách
        { wch: 10 }, // loại tiền
        { wch: 14 }, // giá bán
        { wch: 14 }, // giá nhập
        { wch: 14 }, // lợi nhuận
        { wch: 14 }, // đã thanh toán
        { wch: 36 }, // liên hệ
        { wch: 20 }, // điện thoại
        { wch: 36 }, // email
        { wch: 36 }, // người xử lý
        { wch: 20 }, // Thời hạn thanh toán
        { wch: 20 }, // ngày đặt
      ];

      // Áp dụng độ rộng cho từng cột trong sheet
      ws['!cols'] = columnWidths;

      // const IndexColumnIndex = 6; // Xác định chỉ số cột Index
      const TotalPriceColumnIndex = 8; // Xác định chỉ số cột TotalPrice
      const NetPriceColumnIndex = 9; // Xác định chỉ số cột NetPrice
      const PaidAmtColumnIndex = 10; // Xác định chỉ số cột PaidAmt
      const ProfitColumnIndex = 11; // Xác định chỉ số cột Profit

      const TotalPriceColumnChar = XLSX.utils.encode_col(TotalPriceColumnIndex); // Chuyển đổi chỉ số sang ký tự cột
      const NetPriceColumnChar = XLSX.utils.encode_col(NetPriceColumnIndex);
      const PaidAmtColumnChar = XLSX.utils.encode_col(PaidAmtColumnIndex);
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
        const paidAmtCellRef = `${PaidAmtColumnChar}${R}`;
        if (ws[paidAmtCellRef]) {
          ws[paidAmtCellRef].z = format;
        }

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

      XLSX.utils.book_append_sheet(wb, ws, 'Order');
      const wbout = XLSX.write(wb, { type: 'base64' });

      const fileName = `${PREFIX_ORDER_XLSX_NAME}${dayjs().format(
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

takeLatestListeners(true)({
  actionCreator: orderActions.getOrderDetail,
  effect: async (action, listenerApi) => {
    const { id: orderId } = action.payload;

    const history = listenerApi.getState().order.historyGetDetail;

    if (!history[orderId] || dayjs().unix() - history[orderId] > 30) {
      const response = await Data.orderOrderOpenOrderCreate({
        Id: orderId,
        Forced: true,
      });

      if (validResponse(response)) {
        response.data.Item?.Bookings?.forEach(async bk => {
          listenerApi.dispatch(
            bookingActions.getBookingByIdOrBookingCode(
              {
                id: bk.Id!,
                system: bk.System!,
                bookingCode: bk.BookingCode!,
                surname: (bk.Passengers ?? [])[0]?.Surname,
              },
              { withLoading: true },
            ),
          );
        });

        realmRef.current?.write(() => {
          createOrderFromAxios(
            response.data.Item as Order,
            UpdateMode.Modified,
          );
        });
      }

      listenerApi.dispatch(
        orderActions.saveHistoryGetDetail({
          ...history,
          [orderId]: dayjs().unix(),
        }),
      );
    }

    listenerApi.dispatch(orderActions.saveViewingOrderId(orderId));
  },
});

// takeLatestListeners(true)({
//   actionCreator: orderActions.deleteOrder,
//   effect: async (action, listenerApi) => {
//     const { orderId, callback } = action.payload;

//     const res = await Data.orderOrderDeleteCreate({
//       Id: orderId,
//     });

//     if (validResponse(res)) {
//       // nếu xoá thành công thì thực hiện callback, callback thường là nav về màn trước
//       callback();

//       showToast({
//         type: 'success',
//         t18n: 'order:delete_success',
//       });

//       // tìm index của item bị xoá trong list
//       const { list, pageIndex, totalPage } =
//         listenerApi.getState().order.resultFilter;

//       const idx = list?.findIndex(id => id === orderId) ?? 0;

//       const newList = cloneDeep(list);
//       newList.splice(idx, 1);

//       listenerApi.dispatch(
//         orderActions.saveResultFilter({
//           pageIndex,
//           totalPage,
//           list: newList,
//         }),
//       );

//       const orderInList = realmRef.current?.objectForPrimaryKey<OrderInList>(
//         OrderInList.schema.name,
//         orderId,
//       );

//       realmRef.current?.write(() => {
//         realmRef.current?.delete(orderInList);
//       });
//     } else {
//       showModalConfirm({
//         t18nTitle: 'order:delete_failed',
//         t18nSubtitle: 'common:contact_admin_for_support',
//         t18nCancel: 'modal_confirm:close',
//       });
//     }
//   },
// });

takeLatestListeners()({
  actionCreator: orderActions.getListRemarkByOrderId,
  effect: async (action, listenerApi) => {
    const { id: orderId, cb } = action.payload;
    const response = await Data.remarkRemarkGetByOrderIdCreate({
      Id: orderId,
      Forced: true,
    });

    let data: Array<Remark> = [];

    if (validResponse(response)) {
      data =
        response.data.List?.sort(
          (a, b) => dayjs(a.CreatedDate).unix() - dayjs(b.CreatedDate).unix(),
        ) ?? [];
    } else {
    }

    listenerApi.dispatch(orderActions.saveListRemark(data));
    cb?.();
  },
});

takeLatestListeners()({
  actionCreator: orderActions.getActivityByOrderId,
  effect: async (action, listenerApi) => {
    const { id: orderId } = action.payload;
    const response = await Data.orderOrderGetActivityCreate({
      Id: orderId,
      Forced: true,
    });

    let data: Omit<
      HistoryLst,
      'StatusCode' | 'Success' | 'Expired' | 'Message' | 'Language'
    > = { List: [] };

    if (validResponse(response)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { Expired, StatusCode, Success, Message, Language, ...rest } =
        response.data;

      data = rest;
    }

    listenerApi.dispatch(orderActions.saveListActivity(data));
  },
});

takeLatestListeners()({
  actionCreator: orderActions.insertRemark,
  effect: async (action, listenerApi) => {
    const { remark } = action.payload;
    const orderId = getState('order').viewingOrderId;

    const { currentAccount } = getState('currentAccount');

    const res = await Data.remarkRemarkInsertCreate({
      Item: {
        CreatedDate: dayjs().format(),
        CreatedName: currentAccount.FullName?.toString(),
        CreatedPhoto: currentAccount?.Photo,
        Message: remark,
        Order: null,
        OrderId: orderId,
        UserId: currentAccount.Id,
      },
    });

    if (!validResponse(res)) {
      showToast({
        type: 'normal',
        text: translate('order_detail:error_insert_remark'),
        color: '#E51E29',
        icon: 'warning_2_fill',
      });
    } else {
      const oldList = listenerApi.getState().order.listRemark;
      listenerApi.dispatch(
        orderActions.saveListRemark(oldList.concat([res.data.Item as Remark])),
      );
    }
  },
});

takeLatestListeners(true)({
  actionCreator: orderActions.updateOrderDetail,
  effect: async action => {
    const { form, dirtyFields } = action.payload;

    const functionNames = {
      orderOrderUpdateMonitorCreate: false,
      orderOrderUpdateStatusCreate: false,
      orderOrderUpdateInfoCreate: false,
      orderOrderUpdateContactCreate: false,
      orderOrderChangePaymentCreate: false,
    };

    Object.keys(dirtyFields).forEach(val => {
      //@ts-ignore
      functionNames[ObjFlags[val]] = true;
    });

    const orderId = getState('order').viewingOrderId;

    const listFuncExcuxe = Object.keys(functionNames)
      //@ts-ignore
      .filter(key => functionNames[key]);

    const res = await Promise.allSettled(
      listFuncExcuxe.map(async key => {
        //@ts-ignore
        const response = await Data[key]({
          Item:
            typeof form[ObjFlagsRevert[key]] === 'object'
              ? {
                  Id: orderId,
                  //@ts-ignore
                  ...form[ObjFlagsRevert[key]],
                }
              : {
                  Id: orderId,
                  [ObjFlagsRevert[key]]: form[ObjFlagsRevert[key]],
                },
        });

        return response.data.Item;
      }),
    );

    const isSuccess = res.reduce(
      (total, currRes) => total || currRes.status === 'fulfilled',
      true,
    );

    if (isSuccess) {
      realmRef.current?.write(() => {
        createOrderFromAxios(
          //@ts-ignore
          res[listFuncExcuxe.length - 1].value as Order,
          UpdateMode.Modified,
        );
      });
    }
  },
});

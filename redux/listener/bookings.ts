/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { PREFIX_BOOKING_XLSX_NAME } from '@env';
import { Data, Ibe } from '@services/axios';
import { Booking, BookingLst, BookingRes } from '@services/axios/axios-data';
import { RetrieveBookingRes } from '@services/axios/axios-ibe';
import { BookingRealm } from '@services/realm/models/booking';
import { realmRef } from '@services/realm/provider';
import { hideLoading, showLoading, showToast } from '@vna-base/components';
import {
  bookingActionActions,
  bookingActions,
} from '@vna-base/redux/action-slice';
import { translate } from '@vna-base/translations/translate';
import {
  BookingStatus,
  BookingStatusDetails,
  delay,
  scale,
  validResponse,
} from '@vna-base/utils';
import {
  createBookingFromAxios,
  getBookingFromRealm,
} from '@vna-base/utils/realm/bookings';
import {
  takeLatestListeners,
  takeMultiListeners,
} from '@vna-base/utils/redux/listener';
import { AxiosResponse } from 'axios';
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
        // realmRef.current?.write(() => {
        //   realmRef.current?.delete(
        //     realmRef.current?.objects(BookingRealm.schema.name),
        //   );
        // });

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

      // const response = await Data.bookingBookingGetListCreate({
      //   PageSize: PAGE_SIZE_BOOKING,
      //   PageIndex: pageIndex ?? 1,
      //   OrderBy: _filterForm.OrderBy,
      //   SortType: _filterForm.SortType ?? SortType.Desc,
      //   Filter: _filterForm.Filter,
      //   From: dayjs(_filterForm.Range.from).format(),
      //   To: dayjs(_filterForm.Range.to).format(),
      //   GetAll: _filterForm.GetAll,
      // });

      const response = await fakeListBooking();

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
        // const resRetrieve = await Ibe.flightRetrieveBookingCreate({
        //   BookingId: id,
        //   BookingCode: bookingCode,
        //   System: system,
        //   PassengerName: surname,
        // });

        const resRetrieve = await fakeRetreiveBooking({
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

          // const response = await Data.bookingBookingGetByIdCreate({
          //   Id: bookingId,
          //   Forced: true,
          // });

          const response = await fakeBookingGetById({ id: bookingId });

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

async function fakeListBooking(): Promise<AxiosResponse<BookingLst, any>> {
  await delay(1000);

  return {
    data: {
      List: [
        {
          AgentCode: 'DC10899',
          AgentName: 'Demo agent',
          SubAgId: null,
          SubAgCode: null,
          SubAgName: null,
          CreatedUser: 'Super Admin',
          CreatedAvar: null,
          OrderCode: null,
          BookingImage:
            '5PVBOZ\r\n1. NGUYEN/MINH TRI MR(ADT)\r\n2. VN 205 A 07SEP HANSGN HK1 0500 0720\r\n3. APM 84975750080\r\n4. SSR CTCE VN HK1 ADMIN1@GMAIL.VN\r\n5. TIMELIMIT 20JUL24 00:03',
          ListAirline: [
            {
              Code: 'VN',
              AirGroup: 'VNA',
              NameVi: 'Vietnam Airlines',
              NameEn: 'Vietnam Airlines',
              NameZh: null,
              NameKo: '베트남 항공',
              NameJa: 'ベトナム航空',
              AirMaps: [],
            },
          ],
          ListAirport: [
            {
              CityName: null,
              CountryName: null,
              RegionName: null,
              RegionCode: null,
              Code: 'HAN',
              CityCode: 'HAN',
              NameVi: 'Sân bay Nội Bài',
              NameEn: 'Noi Bai International Airport',
              NameZh: null,
              NameKo: '노이 바이 국제공항',
              NameJa: 'ノイバイ国際空港',
              Timezone: '+07:00',
              Order: 121,
              CityCodeNavigation: {
                Code: 'HAN',
                CountryCode: 'VN',
                NameVi: 'Hà Nội',
                NameEn: 'Hanoi',
                NameZh: null,
                NameKo: '하노이',
                NameJa: 'ハノイ',
                CountryCodeNavigation: {
                  Code: 'VN',
                  RegionCode: 'VN',
                  NameVi: 'Việt Nam',
                  NameEn: 'Vietnam',
                  NameZh: null,
                  NameKo: '베트남',
                  NameJa: 'ベトナム社会主義共和国',
                  Description: null,
                  DialCode: '+84',
                  GeoCities: [null],
                  GeoMaps: [],
                },
                GeoAirports: [null],
              },
            },
            {
              CityName: null,
              CountryName: null,
              RegionName: null,
              RegionCode: null,
              Code: 'SGN',
              CityCode: 'SGN',
              NameVi: 'Sân bay Tân Sơn Nhất',
              NameEn: 'Tan Son Nhat International Airport',
              NameZh: null,
              NameKo: '탄손 낫 국제공항',
              NameJa: 'タンソンニャット国際空港',
              Timezone: '+07:00',
              Order: 120,
              CityCodeNavigation: {
                Code: 'SGN',
                CountryCode: 'VN',
                NameVi: 'Hồ Chí Minh',
                NameEn: 'Ho Chi Minh City',
                NameZh: null,
                NameKo: '호치민시',
                NameJa: 'ホーチミン',
                CountryCodeNavigation: {
                  Code: 'VN',
                  RegionCode: 'VN',
                  NameVi: 'Việt Nam',
                  NameEn: 'Vietnam',
                  NameZh: null,
                  NameKo: '베트남',
                  NameJa: 'ベトナム社会主義共和国',
                  Description: null,
                  DialCode: '+84',
                  GeoCities: [null],
                  GeoMaps: [],
                },
                GeoAirports: [null],
              },
            },
          ],
          ListAircraft: [
            {
              Code: '321',
              Manufacturer: 'Airbus',
              Model: 'A321-100/200',
            },
          ],
          Id: '314EA1CB-1EEA-4DF3-89D5-32AFC98152AA',
          Index: 6944,
          OfficeId: '38D57A42-E6CD-4CDE-8020-77FFF502B8E3',
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          ListParent: null,
          OrderId: '30442CC8-EC55-4AE5-97F3-3661D1A074ED',
          CreatedBy: '28C23B2F-F2EB-4006-9346-3FAB705E0B83',
          BookingCode: '5PVBOZ',
          BookingStatus: 'OK',
          BookingDate: `${dayjs().format('YYYY-MM-DD')}T18:03:12.26`,
          ExpirationDate: `${dayjs()
            .add(1, 'd')
            .format('YYYY-MM-DD')}T00:03:00`,
          TimePurchase: `${dayjs().add(1, 'd').format('YYYY-MM-DD')}T00:03:00`,
          System: 'VN',
          Source: 'API',
          Airline: 'VN',
          Leg: 0,
          Itinerary: 1,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          DepartDate: `${dayjs().add(2, 'M').format('YYYY-MM-DD')}T05:00:00`,
          ReturnDate: null,
          Message: null,
          Latency: 9.6194717,
          Pcc: null,
          SignIn: 'VNA00017',
          Adt: 1,
          Chd: 0,
          Inf: 0,
          TotalPrice: 1079000,
          NetPrice: 979000,
          Profit: 100000,
          Currency: 'VND',
          EquivCurrency: 'VND',
          CurrencyRate: 1,
          FareClass: 'A',
          FareBasis: 'AAP4VNF',
          Promo: false,
          AutoIssue: false,
          AccountCode: null,
          Tourcode: null,
          CACode: null,
          FlightType: 'domestic',
          FlightInfo: `VN-HANSGN-${dayjs().add(2, 'M').format('DD/MM/YYYY')}`,
          PaxName: 'NGUYEN MINH TRI',
          PaxSumm: '1 ADT',
          MultiCity: false,
          RoundTrip: false,
          ContactTitle: null,
          ContactName: null,
          ContactArea: '+84',
          ContactPhone: '84975750079',
          ContactEmail: 'admin1@gmail.vn',
          ContactAddress: null,
          AgentPhone: null,
          AgentEmail: null,
          FareRule: 'DTC117',
          PNRImage: 'DTC117',
          Visible: true,
          ParentId: null,
          ParentPNR: null,
          NdcCode: null,
          Ancillaries: [],
          Charges: [
            {
              Id: 32574,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OrderId: '30442CC8-EC55-4AE5-97F3-3661D1A074ED',
              BookingId: '314EA1CB-1EEA-4DF3-89D5-32AFC98152AA',
              PassengerId: '248B66E8-5122-47B5-855D-FC322E61F933',
              AncillaryId: null,
              PolicyId: null,
              TicketId: null,
              Amount: 379000,
              Currency: 'VND',
              ChargeType: 'TICKET_FARE',
              ChargeValue: 'AAP4VNF',
              PaxName: 'NGUYEN MINH TRI',
              Remark: null,
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              SupplierId: null,
              IsPolicy: false,
              Paid: false,
              Ancillary: null,
              Booking: null,
              Order: null,
              Passenger: null,
              Policy: null,
              Ticket: null,
            },
            {
              Id: 32575,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OrderId: '30442CC8-EC55-4AE5-97F3-3661D1A074ED',
              BookingId: '314EA1CB-1EEA-4DF3-89D5-32AFC98152AA',
              PassengerId: '248B66E8-5122-47B5-855D-FC322E61F933',
              AncillaryId: null,
              PolicyId: null,
              TicketId: null,
              Amount: 600000,
              Currency: 'VND',
              ChargeType: 'TICKET_TAX',
              ChargeValue: null,
              PaxName: 'NGUYEN MINH TRI',
              Remark: null,
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              SupplierId: null,
              IsPolicy: false,
              Paid: false,
              Ancillary: null,
              Booking: null,
              Order: null,
              Passenger: null,
              Policy: null,
              Ticket: null,
            },
            {
              Id: 32576,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OrderId: '30442CC8-EC55-4AE5-97F3-3661D1A074ED',
              BookingId: '314EA1CB-1EEA-4DF3-89D5-32AFC98152AA',
              PassengerId: '248B66E8-5122-47B5-855D-FC322E61F933',
              AncillaryId: null,
              PolicyId: '1DAA48FB-B585-4D5E-9C6C-42AA2E6D08F9',
              TicketId: null,
              Amount: 100000,
              Currency: 'VND',
              ChargeType: 'SERVICE_FEE',
              ChargeValue: null,
              PaxName: 'NGUYEN MINH TRI',
              Remark: null,
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              SupplierId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              IsPolicy: true,
              Paid: false,
              Ancillary: null,
              Booking: null,
              Order: null,
              Passenger: null,
              Policy: null,
              Ticket: null,
            },
          ],
          FareInfos: [
            {
              Id: 10548,
              BookingId: '314EA1CB-1EEA-4DF3-89D5-32AFC98152AA',
              PaxType: 'ADT',
              SegmentId: '1',
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              FareClass: 'A',
              FareBasis: 'AAP4VNF',
              HandBaggage: '1 piece x 10kg',
              FreeBaggage: '0kg',
              FareFamily: 'Economy Super Lite',
              CabinCode: 'M',
              CabinName: 'Economy',
              Refundable: false,
              Booking: null,
            },
          ],
          Flights: [
            {
              Id: 8358,
              BookingId: '314EA1CB-1EEA-4DF3-89D5-32AFC98152AA',
              Leg: 0,
              FlightId: '2',
              Airline: 'VN',
              Operator: 'VN',
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              DepartDate: `${dayjs()
                .add(2, 'M')
                .format('YYYY-MM-DD')}T05:00:00`,
              ArriveDate: `${dayjs()
                .add(2, 'M')
                .format('YYYY-MM-DD')}T07:15:00`,
              FlightNumber: '205',
              StopNum: 0,
              Duration: 135,
              Booking: null,
              Segments: [
                {
                  Id: 9541,
                  FlightId: 8358,
                  Leg: 0,
                  SegmentId: '1',
                  Airline: 'VN',
                  Operator: 'VN',
                  StartPoint: 'HAN',
                  EndPoint: 'SGN',
                  DepartDate: `${dayjs()
                    .add(2, 'M')
                    .format('YYYY-MM-DD')}T05:00:00`,
                  ArriveDate: `${dayjs()
                    .add(2, 'M')
                    .format('YYYY-MM-DD')}T07:15:00`,
                  FlightNumber: '205',
                  FlightsMiles: 0,
                  MarriageGrp: null,
                  Duration: 135,
                  Equipment: '321',
                  StartTerminal: '1',
                  EndTerminal: '1',
                  HasStop: false,
                  StopPoint: null,
                  StopTime: 0,
                  Status: 'HK',
                  FareClass: 'A',
                  FareBasis: 'AAP4VNF',
                  Flight: null,
                },
              ],
            },
          ],
          Order: null,
          Passengers: [
            {
              Id: '248B66E8-5122-47B5-855D-FC322E61F933',
              Index: 9325,
              BookingId: '314EA1CB-1EEA-4DF3-89D5-32AFC98152AA',
              PaxIndex: 1,
              ParentId: null,
              PaxType: 'ADT',
              GivenName: 'MINH TRI',
              Surname: 'NGUYEN',
              Title: 'MR',
              Gender: 1,
              NameId: '2',
              BirthDate: null,
              Nationality: null,
              IssueCountry: null,
              DocumentType: 'passport',
              DocumentNumb: null,
              DocumentExpiry: null,
              Membership: null,
              Visible: true,
              Ancillaries: [],
              Booking: null,
              Charges: [],
              Tickets: [],
            },
          ],
          Tickets: [],
        },
        {
          AgentCode: 'DC10899',
          AgentName: 'Demo agent',
          SubAgId: null,
          SubAgCode: null,
          SubAgName: null,
          CreatedUser: 'mai thị ngọc mai',
          CreatedAvar: '/images/avatar/DC10899/ymauxxff.jpeg',
          OrderCode: null,
          BookingImage:
            '5KRHLV\r\n1. MAI/MAI MS(ADT)\r\n2. KHANH/HUNG MSTR(INF/12JUL23)\r\n3. VAN/THUY MSTR(CHD/22JUL21)\r\n4. APM +8485555\r\n5. SSR CTCE QH HK1 MAITNM@GMAIL.VN\r\n6. SSR INFT QH HK1 KHANH/HUNGMSTR 12JUL23/S/P1\r\n7. SSR CHLD QH HK1 22JUL21/S/P1',
          ListAirline: [
            {
              Code: 'QH',
              AirGroup: 'QHA',
              NameVi: 'Bamboo Airways',
              NameEn: 'Bamboo Airways',
              NameZh: null,
              NameKo: '뱀부 항공',
              NameJa: 'バンブー・エアウェイズ',
              AirMaps: [],
            },
          ],
          ListAirport: [
            {
              CityName: null,
              CountryName: null,
              RegionName: null,
              RegionCode: null,
              Code: 'HAN',
              CityCode: 'HAN',
              NameVi: 'Sân bay Nội Bài',
              NameEn: 'Noi Bai International Airport',
              NameZh: null,
              NameKo: '노이 바이 국제공항',
              NameJa: 'ノイバイ国際空港',
              Timezone: '+07:00',
              Order: 121,
              CityCodeNavigation: {
                Code: 'HAN',
                CountryCode: 'VN',
                NameVi: 'Hà Nội',
                NameEn: 'Hanoi',
                NameZh: null,
                NameKo: '하노이',
                NameJa: 'ハノイ',
                CountryCodeNavigation: {
                  Code: 'VN',
                  RegionCode: 'VN',
                  NameVi: 'Việt Nam',
                  NameEn: 'Vietnam',
                  NameZh: null,
                  NameKo: '베트남',
                  NameJa: 'ベトナム社会主義共和国',
                  Description: null,
                  DialCode: '+84',
                  GeoCities: [null],
                  GeoMaps: [],
                },
                GeoAirports: [null],
              },
            },
            {
              CityName: null,
              CountryName: null,
              RegionName: null,
              RegionCode: null,
              Code: 'SGN',
              CityCode: 'SGN',
              NameVi: 'Sân bay Tân Sơn Nhất',
              NameEn: 'Tan Son Nhat International Airport',
              NameZh: null,
              NameKo: '탄손 낫 국제공항',
              NameJa: 'タンソンニャット国際空港',
              Timezone: '+07:00',
              Order: 120,
              CityCodeNavigation: {
                Code: 'SGN',
                CountryCode: 'VN',
                NameVi: 'Hồ Chí Minh',
                NameEn: 'Ho Chi Minh City',
                NameZh: null,
                NameKo: '호치민시',
                NameJa: 'ホーチミン',
                CountryCodeNavigation: {
                  Code: 'VN',
                  RegionCode: 'VN',
                  NameVi: 'Việt Nam',
                  NameEn: 'Vietnam',
                  NameZh: null,
                  NameKo: '베트남',
                  NameJa: 'ベトナム社会主義共和国',
                  Description: null,
                  DialCode: '+84',
                  GeoCities: [null],
                  GeoMaps: [],
                },
                GeoAirports: [null],
              },
            },
          ],
          ListAircraft: [
            {
              Code: '321',
              Manufacturer: 'Airbus',
              Model: 'A321-100/200',
            },
          ],
          Id: 'C18AB5F9-C171-4539-904B-44A144AEDF4F',
          Index: 6943,
          OfficeId: '9FA9E354-2B78-4D02-9190-6C82AE43440E',
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          ListParent: null,
          OrderId: 'CE7A33A3-DCAF-470F-92F0-7B0C4B221300',
          CreatedBy: '85DD4CE7-DC52-42CE-986F-56A5034A3B25',
          BookingCode: '5KRHLV',
          BookingStatus: 'TICKETED',
          BookingDate: `${dayjs()
            .subtract(1, 'd')
            .format('YYYY-MM-DD')}T16:28:37.647`,
          ExpirationDate: `${dayjs().format('YYYY-MM-DD')}T22:28:00`,
          TimePurchase: null,
          System: 'QH',
          Source: 'API',
          Airline: 'QH',
          Leg: 0,
          Itinerary: 1,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          DepartDate: `${dayjs().add(2, 'd').format('YYYY-MM-DD')}T21:25:00`,
          ReturnDate: null,
          Message: null,
          Latency: 28.2946109,
          Pcc: 'agency_test_22',
          SignIn: 'hongnn@bambooairways.com',
          Adt: 1,
          Chd: 1,
          Inf: 1,
          TotalPrice: 4200500,
          NetPrice: 3900500,
          Profit: 300000,
          Currency: 'VND',
          EquivCurrency: 'VND',
          CurrencyRate: 1,
          FareClass: 'M',
          FareBasis: 'MES0F',
          Promo: false,
          AutoIssue: false,
          AccountCode: null,
          Tourcode: null,
          CACode: null,
          FlightType: 'domestic',
          FlightInfo: `QH-HANSGN-${dayjs().add(2, 'd').format('DD/MM/YYYY')}`,
          PaxName: 'MAI MAI',
          PaxSumm: '1 ADT, 1 CHD, 1 INF',
          MultiCity: false,
          RoundTrip: false,
          ContactTitle: '',
          ContactName: '',
          ContactArea: '+84',
          ContactPhone: '+8485555',
          ContactEmail: 'MAITNM@GMAIL.VN',
          ContactAddress: '',
          AgentPhone: null,
          AgentEmail: null,
          FareRule: 'DTC117',
          PNRImage: 'DTC117',
          Visible: true,
          ParentId: null,
          ParentPNR: null,
          NdcCode: null,
          Ancillaries: [],
          Charges: [
            {
              Id: 32565,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OrderId: 'CE7A33A3-DCAF-470F-92F0-7B0C4B221300',
              BookingId: 'C18AB5F9-C171-4539-904B-44A144AEDF4F',
              PassengerId: 'F6243B9D-0A36-4C89-B679-769F7178505C',
              AncillaryId: null,
              PolicyId: null,
              TicketId: null,
              Amount: 1419000,
              Currency: 'VND',
              ChargeType: 'TICKET_FARE',
              ChargeValue: 'MES0F',
              PaxName: 'MAI MAI',
              Remark: null,
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              SupplierId: null,
              IsPolicy: false,
              Paid: false,
              Ancillary: null,
              Booking: null,
              Order: null,
              Passenger: null,
              Policy: null,
              Ticket: null,
            },
            {
              Id: 32566,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OrderId: 'CE7A33A3-DCAF-470F-92F0-7B0C4B221300',
              BookingId: 'C18AB5F9-C171-4539-904B-44A144AEDF4F',
              PassengerId: 'F6243B9D-0A36-4C89-B679-769F7178505C',
              AncillaryId: null,
              PolicyId: null,
              TicketId: null,
              Amount: 698000,
              Currency: 'VND',
              ChargeType: 'TICKET_TAX',
              ChargeValue: null,
              PaxName: 'MAI MAI',
              Remark: null,
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              SupplierId: null,
              IsPolicy: false,
              Paid: false,
              Ancillary: null,
              Booking: null,
              Order: null,
              Passenger: null,
              Policy: null,
              Ticket: null,
            },
            {
              Id: 32567,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OrderId: 'CE7A33A3-DCAF-470F-92F0-7B0C4B221300',
              BookingId: 'C18AB5F9-C171-4539-904B-44A144AEDF4F',
              PassengerId: 'F6243B9D-0A36-4C89-B679-769F7178505C',
              AncillaryId: null,
              PolicyId: '1DAA48FB-B585-4D5E-9C6C-42AA2E6D08F9',
              TicketId: null,
              Amount: 100000,
              Currency: 'VND',
              ChargeType: 'SERVICE_FEE',
              ChargeValue: null,
              PaxName: 'MAI MAI',
              Remark: null,
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              SupplierId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              IsPolicy: true,
              Paid: false,
              Ancillary: null,
              Booking: null,
              Order: null,
              Passenger: null,
              Policy: null,
              Ticket: null,
            },
            {
              Id: 32568,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OrderId: 'CE7A33A3-DCAF-470F-92F0-7B0C4B221300',
              BookingId: 'C18AB5F9-C171-4539-904B-44A144AEDF4F',
              PassengerId: 'A26B70D6-48C3-4B7D-A31C-8AF051E1E259',
              AncillaryId: null,
              PolicyId: null,
              TicketId: null,
              Amount: 1065000,
              Currency: 'VND',
              ChargeType: 'TICKET_FARE',
              ChargeValue: 'MES0F',
              PaxName: 'VAN THUY',
              Remark: null,
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              SupplierId: null,
              IsPolicy: false,
              Paid: false,
              Ancillary: null,
              Booking: null,
              Order: null,
              Passenger: null,
              Policy: null,
              Ticket: null,
            },
            {
              Id: 32569,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OrderId: 'CE7A33A3-DCAF-470F-92F0-7B0C4B221300',
              BookingId: 'C18AB5F9-C171-4539-904B-44A144AEDF4F',
              PassengerId: 'A26B70D6-48C3-4B7D-A31C-8AF051E1E259',
              AncillaryId: null,
              PolicyId: null,
              TicketId: null,
              Amount: 610500,
              Currency: 'VND',
              ChargeType: 'TICKET_TAX',
              ChargeValue: null,
              PaxName: 'VAN THUY',
              Remark: null,
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              SupplierId: null,
              IsPolicy: false,
              Paid: false,
              Ancillary: null,
              Booking: null,
              Order: null,
              Passenger: null,
              Policy: null,
              Ticket: null,
            },
            {
              Id: 32570,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OrderId: 'CE7A33A3-DCAF-470F-92F0-7B0C4B221300',
              BookingId: 'C18AB5F9-C171-4539-904B-44A144AEDF4F',
              PassengerId: 'A26B70D6-48C3-4B7D-A31C-8AF051E1E259',
              AncillaryId: null,
              PolicyId: '1DAA48FB-B585-4D5E-9C6C-42AA2E6D08F9',
              TicketId: null,
              Amount: 100000,
              Currency: 'VND',
              ChargeType: 'SERVICE_FEE',
              ChargeValue: null,
              PaxName: 'VAN THUY',
              Remark: null,
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              SupplierId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              IsPolicy: true,
              Paid: false,
              Ancillary: null,
              Booking: null,
              Order: null,
              Passenger: null,
              Policy: null,
              Ticket: null,
            },
            {
              Id: 32571,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OrderId: 'CE7A33A3-DCAF-470F-92F0-7B0C4B221300',
              BookingId: 'C18AB5F9-C171-4539-904B-44A144AEDF4F',
              PassengerId: 'A1E428CF-2B69-43AE-BE9B-CDE2345DA13B',
              AncillaryId: null,
              PolicyId: null,
              TicketId: null,
              Amount: 100000,
              Currency: 'VND',
              ChargeType: 'TICKET_FARE',
              ChargeValue: 'MES0F',
              PaxName: 'KHANH HUNG',
              Remark: null,
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              SupplierId: null,
              IsPolicy: false,
              Paid: false,
              Ancillary: null,
              Booking: null,
              Order: null,
              Passenger: null,
              Policy: null,
              Ticket: null,
            },
            {
              Id: 32572,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OrderId: 'CE7A33A3-DCAF-470F-92F0-7B0C4B221300',
              BookingId: 'C18AB5F9-C171-4539-904B-44A144AEDF4F',
              PassengerId: 'A1E428CF-2B69-43AE-BE9B-CDE2345DA13B',
              AncillaryId: null,
              PolicyId: null,
              TicketId: null,
              Amount: 8000,
              Currency: 'VND',
              ChargeType: 'TICKET_TAX',
              ChargeValue: null,
              PaxName: 'KHANH HUNG',
              Remark: null,
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              SupplierId: null,
              IsPolicy: false,
              Paid: false,
              Ancillary: null,
              Booking: null,
              Order: null,
              Passenger: null,
              Policy: null,
              Ticket: null,
            },
            {
              Id: 32573,
              AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              OrderId: 'CE7A33A3-DCAF-470F-92F0-7B0C4B221300',
              BookingId: 'C18AB5F9-C171-4539-904B-44A144AEDF4F',
              PassengerId: 'A1E428CF-2B69-43AE-BE9B-CDE2345DA13B',
              AncillaryId: null,
              PolicyId: '1DAA48FB-B585-4D5E-9C6C-42AA2E6D08F9',
              TicketId: null,
              Amount: 100000,
              Currency: 'VND',
              ChargeType: 'SERVICE_FEE',
              ChargeValue: null,
              PaxName: 'KHANH HUNG',
              Remark: null,
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              SupplierId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
              IsPolicy: true,
              Paid: false,
              Ancillary: null,
              Booking: null,
              Order: null,
              Passenger: null,
              Policy: null,
              Ticket: null,
            },
          ],
          FareInfos: [
            {
              Id: 10545,
              BookingId: 'C18AB5F9-C171-4539-904B-44A144AEDF4F',
              PaxType: 'ADT',
              SegmentId: '1',
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              FareClass: 'M',
              FareBasis: 'MES0F',
              HandBaggage: '7kg',
              FreeBaggage: '0kg',
              FareFamily: 'EconomySmart',
              CabinCode: 'ECONOMY',
              CabinName: 'ECONOMY',
              Refundable: false,
              Booking: null,
            },
            {
              Id: 10546,
              BookingId: 'C18AB5F9-C171-4539-904B-44A144AEDF4F',
              PaxType: 'CHD',
              SegmentId: '1',
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              FareClass: 'M',
              FareBasis: 'MES0F',
              HandBaggage: '7kg',
              FreeBaggage: '0kg',
              FareFamily: 'EconomySmart',
              CabinCode: 'ECONOMY',
              CabinName: 'ECONOMY',
              Refundable: false,
              Booking: null,
            },
            {
              Id: 10547,
              BookingId: 'C18AB5F9-C171-4539-904B-44A144AEDF4F',
              PaxType: 'INF',
              SegmentId: '1',
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              FareClass: 'M',
              FareBasis: 'MES0F',
              HandBaggage: '7kg',
              FreeBaggage: '0kg',
              FareFamily: 'EconomySmart',
              CabinCode: 'ECONOMY',
              CabinName: 'ECONOMY',
              Refundable: false,
              Booking: null,
            },
          ],
          Flights: [
            {
              Id: 8357,
              BookingId: 'C18AB5F9-C171-4539-904B-44A144AEDF4F',
              Leg: 0,
              FlightId: '1',
              Airline: 'QH',
              Operator: 'QH',
              StartPoint: 'HAN',
              EndPoint: 'SGN',
              DepartDate: `${dayjs()
                .add(2, 'd')
                .format('YYYY-MM-DD')}T21:25:00`,
              ArriveDate: `${dayjs()
                .add(2, 'd')
                .format('YYYY-MM-DD')}T23:35:00`,
              FlightNumber: '281',
              StopNum: 0,
              Duration: 130,
              Booking: null,
              Segments: [
                {
                  Id: 9540,
                  FlightId: 8357,
                  Leg: 0,
                  SegmentId: '1',
                  Airline: 'QH',
                  Operator: 'QH',
                  StartPoint: 'HAN',
                  EndPoint: 'SGN',
                  DepartDate: `${dayjs()
                    .add(2, 'd')
                    .format('YYYY-MM-DD')}T21:25:00`,
                  ArriveDate: `${dayjs()
                    .add(2, 'd')
                    .format('YYYY-MM-DD')}T23:35:00`,
                  FlightNumber: '281',
                  FlightsMiles: 0,
                  MarriageGrp: null,
                  Duration: 130,
                  Equipment: '321',
                  StartTerminal: '1',
                  EndTerminal: '1',
                  HasStop: false,
                  StopPoint: null,
                  StopTime: 0,
                  Status: 'HX',
                  FareClass: 'M',
                  FareBasis: 'MES0F',
                  Flight: null,
                },
              ],
            },
          ],
          Order: null,
          Passengers: [
            {
              Id: 'F6243B9D-0A36-4C89-B679-769F7178505C',
              Index: 9322,
              BookingId: 'C18AB5F9-C171-4539-904B-44A144AEDF4F',
              PaxIndex: 1,
              ParentId: null,
              PaxType: 'ADT',
              GivenName: 'MAI',
              Surname: 'MAI',
              Title: 'MS',
              Gender: 0,
              NameId: '2',
              BirthDate: null,
              Nationality: null,
              IssueCountry: null,
              DocumentType: null,
              DocumentNumb: null,
              DocumentExpiry: null,
              Membership: '',
              Visible: true,
              Ancillaries: [],
              Booking: null,
              Charges: [],
              Tickets: [],
            },
            {
              Id: 'A26B70D6-48C3-4B7D-A31C-8AF051E1E259',
              Index: 9323,
              BookingId: 'C18AB5F9-C171-4539-904B-44A144AEDF4F',
              PaxIndex: 2,
              ParentId: null,
              PaxType: 'CHD',
              GivenName: 'THUY',
              Surname: 'VAN',
              Title: 'MSTR',
              Gender: 1,
              NameId: '4',
              BirthDate: '2021-07-22T00:00:00',
              Nationality: null,
              IssueCountry: null,
              DocumentType: null,
              DocumentNumb: null,
              DocumentExpiry: null,
              Membership: '',
              Visible: true,
              Ancillaries: [],
              Booking: null,
              Charges: [],
              Tickets: [],
            },
            {
              Id: 'A1E428CF-2B69-43AE-BE9B-CDE2345DA13B',
              Index: 9324,
              BookingId: 'C18AB5F9-C171-4539-904B-44A144AEDF4F',
              PaxIndex: 3,
              ParentId: 1,
              PaxType: 'INF',
              GivenName: 'HUNG',
              Surname: 'KHANH',
              Title: 'MSTR',
              Gender: 1,
              NameId: '2',
              BirthDate: '2023-07-12T00:00:00',
              Nationality: null,
              IssueCountry: null,
              DocumentType: null,
              DocumentNumb: null,
              DocumentExpiry: null,
              Membership: '',
              Visible: true,
              Ancillaries: [],
              Booking: null,
              Charges: [],
              Tickets: [],
            },
          ],
          Tickets: [],
        },
        {
          AgentCode: null,
          AgentName: null,
          SubAgId: null,
          SubAgCode: null,
          SubAgName: null,
          CreatedUser: 'mai thị ngọc mai',
          CreatedAvar: null,
          OrderCode: '6954',
          BookingImage: null,
          ListAirline: null,
          ListAirport: null,
          ListAircraft: null,
          Id: '41BFE242-DC6B-4484-BA2B-090CAB7C362F',
          Index: 6942,
          OfficeId: '9FA9E354-2B78-4D02-9190-6C82AE43440E',
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          ListParent: null,
          OrderId: '434A4D6E-F89F-481B-A10B-FF12F60691A6',
          CreatedBy: '85DD4CE7-DC52-42CE-986F-56A5034A3B25',
          BookingCode: '5KRZKJ',
          BookingStatus: 'OK',
          BookingDate: '2024-07-19T16:23:13.257',
          ExpirationDate: '2024-07-19T22:22:00',
          TimePurchase: null,
          System: 'QH',
          Source: 'API',
          Airline: 'QH',
          Leg: 0,
          Itinerary: 1,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          DepartDate: '2024-07-22T21:25:00',
          ReturnDate: null,
          Message: null,
          Latency: 39.0806118,
          Pcc: 'agency_test_22',
          SignIn: 'hongnn@bambooairways.com',
          Adt: 1,
          Chd: 1,
          Inf: 1,
          TotalPrice: 4500500,
          NetPrice: 4200500,
          Profit: 300000,
          Currency: 'VND',
          EquivCurrency: 'VND',
          CurrencyRate: 1,
          FareClass: 'M',
          FareBasis: 'MES0F',
          Promo: false,
          AutoIssue: false,
          AccountCode: null,
          Tourcode: null,
          CACode: null,
          FlightType: 'domestic',
          FlightInfo: 'QH-HANSGN-22/07/2024',
          PaxName: 'MAI MAI',
          PaxSumm: '1 ADT, 1 CHD, 1 INF',
          MultiCity: false,
          RoundTrip: false,
          ContactTitle: '',
          ContactName: '',
          ContactArea: null,
          ContactPhone: '+848525',
          ContactEmail: 'MAITNM@GMAIL.VN',
          ContactAddress: '',
          AgentPhone: null,
          AgentEmail: null,
          FareRule: 'DTC117',
          PNRImage: 'DTC117',
          Visible: true,
          ParentId: null,
          ParentPNR: null,
          NdcCode: null,
          Ancillaries: [],
          Charges: [],
          FareInfos: [],
          Flights: [],
          Order: null,
          Passengers: [],
          Tickets: [],
        },
        {
          AgentCode: null,
          AgentName: null,
          SubAgId: null,
          SubAgCode: null,
          SubAgName: null,
          CreatedUser: 'Super Admin',
          CreatedAvar: null,
          OrderCode: '6953',
          BookingImage: null,
          ListAirline: null,
          ListAirport: null,
          ListAircraft: null,
          Id: '3FF6D94A-CA37-4F6C-B524-E69E551C0560',
          Index: 6941,
          OfficeId: '38D57A42-E6CD-4CDE-8020-77FFF502B8E3',
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          ListParent: null,
          OrderId: 'AC660464-6C6B-4C4E-A390-FE3F5CF493A7',
          CreatedBy: '28C23B2F-F2EB-4006-9346-3FAB705E0B83',
          BookingCode: '5P7YYB',
          BookingStatus: 'OK',
          BookingDate: '2024-07-19T14:58:49.587',
          ExpirationDate: '2024-07-20T02:58:00',
          TimePurchase: '2024-07-20T02:58:00',
          System: 'VN',
          Source: 'API',
          Airline: 'VN',
          Leg: 0,
          Itinerary: 1,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          DepartDate: '2024-07-31T22:00:00',
          ReturnDate: null,
          Message: null,
          Latency: 9.6668286,
          Pcc: null,
          SignIn: 'VNA00017',
          Adt: 1,
          Chd: 0,
          Inf: 0,
          TotalPrice: 1824000,
          NetPrice: 1724000,
          Profit: 100000,
          Currency: 'VND',
          EquivCurrency: 'VND',
          CurrencyRate: 1,
          FareClass: 'E',
          FareBasis: 'EPXVNF',
          Promo: false,
          AutoIssue: false,
          AccountCode: null,
          Tourcode: null,
          CACode: null,
          FlightType: 'domestic',
          FlightInfo: 'VN-HANSGN-31/07/2024',
          PaxName: 'DANG KHAC DINH',
          PaxSumm: '1 ADT',
          MultiCity: false,
          RoundTrip: false,
          ContactTitle: null,
          ContactName: 'Nguyen Minh Tri',
          ContactArea: null,
          ContactPhone: '84975750088',
          ContactEmail: 'admin1@gmail.vn',
          ContactAddress: '58 To Huu, Nam Tu Liem',
          AgentPhone: null,
          AgentEmail: null,
          FareRule: 'DTC117',
          PNRImage: 'DTC117',
          Visible: true,
          ParentId: null,
          ParentPNR: null,
          NdcCode: null,
          Ancillaries: [],
          Charges: [],
          FareInfos: [],
          Flights: [],
          Order: null,
          Passengers: [],
          Tickets: [],
        },
        {
          AgentCode: null,
          AgentName: null,
          SubAgId: null,
          SubAgCode: null,
          SubAgName: null,
          CreatedUser: 'Super Admin',
          CreatedAvar: null,
          OrderCode: '6952',
          BookingImage: null,
          ListAirline: null,
          ListAirport: null,
          ListAircraft: null,
          Id: '26DE8DBA-189B-4F35-B557-BCB0B69B140D',
          Index: 6940,
          OfficeId: '38D57A42-E6CD-4CDE-8020-77FFF502B8E3',
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          ListParent: null,
          OrderId: '7901FA3F-468F-441A-92BC-F272041C0096',
          CreatedBy: '28C23B2F-F2EB-4006-9346-3FAB705E0B83',
          BookingCode: '5P7UDF',
          BookingStatus: 'OK',
          BookingDate: '2024-07-19T14:58:31.23',
          ExpirationDate: '2024-07-19T20:58:00',
          TimePurchase: '2024-07-19T20:58:00',
          System: 'VN',
          Source: 'API',
          Airline: 'VN',
          Leg: 0,
          Itinerary: 1,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          DepartDate: '2024-09-12T05:00:00',
          ReturnDate: null,
          Message: null,
          Latency: 8.540788,
          Pcc: null,
          SignIn: 'VNA00017',
          Adt: 1,
          Chd: 0,
          Inf: 0,
          TotalPrice: 1079000,
          NetPrice: 979000,
          Profit: 100000,
          Currency: 'VND',
          EquivCurrency: 'VND',
          CurrencyRate: 1,
          FareClass: 'A',
          FareBasis: 'AAP4VNF',
          Promo: false,
          AutoIssue: false,
          AccountCode: null,
          Tourcode: null,
          CACode: null,
          FlightType: 'domestic',
          FlightInfo: 'VN-HANSGN-12/09/2024',
          PaxName: 'NGUYEN MINH TRI',
          PaxSumm: '1 ADT',
          MultiCity: false,
          RoundTrip: false,
          ContactTitle: null,
          ContactName: 'Nguyen Minh Tri',
          ContactArea: null,
          ContactPhone: '84975750088',
          ContactEmail: 'admin1@gmail.vn',
          ContactAddress: '58 To Huu, Nam Tu Liem',
          AgentPhone: null,
          AgentEmail: null,
          FareRule: 'DTC117',
          PNRImage: 'DTC117',
          Visible: true,
          ParentId: null,
          ParentPNR: null,
          NdcCode: null,
          Ancillaries: [],
          Charges: [],
          FareInfos: [],
          Flights: [],
          Order: null,
          Passengers: [],
          Tickets: [],
        },
        {
          AgentCode: null,
          AgentName: null,
          SubAgId: null,
          SubAgCode: null,
          SubAgName: null,
          CreatedUser: 'trangnt',
          CreatedAvar: null,
          OrderCode: '6951',
          BookingImage: null,
          ListAirline: null,
          ListAirport: null,
          ListAircraft: null,
          Id: '8214258F-3CBA-46C5-A726-4D46CB391DFD',
          Index: 6939,
          OfficeId: null,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          ListParent: null,
          OrderId: '2E35E9CB-B186-470B-B1AD-B488A8CF1CF8',
          CreatedBy: 'B8676C44-CA8D-4D3E-B64F-1181734EB622',
          BookingCode: '5P68JF',
          BookingStatus: 'OK',
          BookingDate: '2024-07-19T14:46:44.203',
          ExpirationDate: '2024-07-20T02:46:00',
          TimePurchase: '2024-07-20T02:46:00',
          System: 'VN',
          Source: null,
          Airline: 'VN',
          Leg: 0,
          Itinerary: 1,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          DepartDate: '2024-07-25T22:00:00',
          ReturnDate: null,
          Message: null,
          Latency: 11.9366518,
          Pcc: null,
          SignIn: 'VNA00017',
          Adt: 1,
          Chd: 0,
          Inf: 0,
          TotalPrice: 2558000,
          NetPrice: 2458000,
          Profit: 100000,
          Currency: 'VND',
          EquivCurrency: 'VND',
          CurrencyRate: 1,
          FareClass: 'R',
          FareBasis: 'RPXVNF',
          Promo: false,
          AutoIssue: false,
          AccountCode: null,
          Tourcode: null,
          CACode: null,
          FlightType: 'domestic',
          FlightInfo: 'VN-HANSGN-25/07/2024',
          PaxName: 'TRAN KIEN',
          PaxSumm: '1 ADT',
          MultiCity: false,
          RoundTrip: false,
          ContactTitle: null,
          ContactName: null,
          ContactArea: null,
          ContactPhone: '945423393',
          ContactEmail: 'kien199788@gmail.com',
          ContactAddress: null,
          AgentPhone: null,
          AgentEmail: null,
          FareRule: 'DTC117',
          PNRImage: 'DTC117',
          Visible: true,
          ParentId: null,
          ParentPNR: null,
          NdcCode: null,
          Ancillaries: [],
          Charges: [],
          FareInfos: [],
          Flights: [],
          Order: null,
          Passengers: [],
          Tickets: [],
        },
        {
          AgentCode: null,
          AgentName: null,
          SubAgId: null,
          SubAgCode: null,
          SubAgName: null,
          CreatedUser: 'Tran Khanh Hung',
          CreatedAvar: null,
          OrderCode: '6950',
          BookingImage: null,
          ListAirline: null,
          ListAirport: null,
          ListAircraft: null,
          Id: '6150037C-6DD1-4CF2-927F-551B2CEF35EE',
          Index: 6938,
          OfficeId: null,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          ListParent: null,
          OrderId: 'AA70C9E5-0038-4D8F-A95E-D18B69713A68',
          CreatedBy: '669635EA-7688-4A8F-B995-2B2A375C9DA3',
          BookingCode: '5OW5RC',
          BookingStatus: 'OK',
          BookingDate: '2024-07-19T13:41:55.11',
          ExpirationDate: '2024-07-20T01:41:00',
          TimePurchase: '2024-07-20T01:41:00',
          System: 'VN',
          Source: 'API',
          Airline: 'VN',
          Leg: 0,
          Itinerary: 1,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          DepartDate: '2024-07-22T22:00:00',
          ReturnDate: null,
          Message: null,
          Latency: 10.1030956,
          Pcc: null,
          SignIn: 'VNA00017',
          Adt: 1,
          Chd: 0,
          Inf: 0,
          TotalPrice: 1824000,
          NetPrice: 1724000,
          Profit: 100000,
          Currency: 'VND',
          EquivCurrency: 'VND',
          CurrencyRate: 1,
          FareClass: 'E',
          FareBasis: 'EPXVNF',
          Promo: false,
          AutoIssue: false,
          AccountCode: null,
          Tourcode: null,
          CACode: null,
          FlightType: 'domestic',
          FlightInfo: 'VN-HANSGN-22/07/2024',
          PaxName: 'NHO HAI',
          PaxSumm: '1 ADT',
          MultiCity: false,
          RoundTrip: false,
          ContactTitle: '',
          ContactName: '',
          ContactArea: null,
          ContactPhone: '844566745546456',
          ContactEmail: 'hungtran2140@gmail.com',
          ContactAddress: '',
          AgentPhone: null,
          AgentEmail: null,
          FareRule: 'DTC117',
          PNRImage: 'DTC117',
          Visible: true,
          ParentId: null,
          ParentPNR: null,
          NdcCode: null,
          Ancillaries: [],
          Charges: [],
          FareInfos: [],
          Flights: [],
          Order: null,
          Passengers: [],
          Tickets: [],
        },
        {
          AgentCode: null,
          AgentName: null,
          SubAgId: null,
          SubAgCode: null,
          SubAgName: null,
          CreatedUser: 'Tran Khanh Hung',
          CreatedAvar: null,
          OrderCode: '6949',
          BookingImage: null,
          ListAirline: null,
          ListAirport: null,
          ListAircraft: null,
          Id: '17491327-5D25-46D6-9D71-AC9E7843B15B',
          Index: 6937,
          OfficeId: null,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          ListParent: null,
          OrderId: 'F816C7D9-7300-4249-8568-56F161599760',
          CreatedBy: '669635EA-7688-4A8F-B995-2B2A375C9DA3',
          BookingCode: '5OS5UD',
          BookingStatus: 'OK',
          BookingDate: '2024-07-19T13:25:44.15',
          ExpirationDate: '2024-07-19T19:25:00',
          TimePurchase: '2024-07-19T19:25:00',
          System: 'VN',
          Source: 'API',
          Airline: 'VN',
          Leg: 0,
          Itinerary: 1,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          DepartDate: '2024-08-07T05:00:00',
          ReturnDate: null,
          Message: null,
          Latency: 9.0326979,
          Pcc: null,
          SignIn: 'VNA00017',
          Adt: 1,
          Chd: 0,
          Inf: 0,
          TotalPrice: 1079000,
          NetPrice: 979000,
          Profit: 100000,
          Currency: 'VND',
          EquivCurrency: 'VND',
          CurrencyRate: 1,
          FareClass: 'A',
          FareBasis: 'AAP4VNF',
          Promo: false,
          AutoIssue: false,
          AccountCode: null,
          Tourcode: null,
          CACode: null,
          FlightType: 'domestic',
          FlightInfo: 'VN-HANSGN-07/08/2024',
          PaxName: 'NGO HAI',
          PaxSumm: '1 ADT',
          MultiCity: false,
          RoundTrip: false,
          ContactTitle: '',
          ContactName: '',
          ContactArea: null,
          ContactPhone: '3453436345',
          ContactEmail: 'Hsdi@gmail.com',
          ContactAddress: '',
          AgentPhone: null,
          AgentEmail: null,
          FareRule: 'DTC117',
          PNRImage: 'DTC117',
          Visible: true,
          ParentId: null,
          ParentPNR: null,
          NdcCode: null,
          Ancillaries: [],
          Charges: [],
          FareInfos: [],
          Flights: [],
          Order: null,
          Passengers: [],
          Tickets: [],
        },
        {
          AgentCode: null,
          AgentName: null,
          SubAgId: null,
          SubAgCode: null,
          SubAgName: null,
          CreatedUser: 'Tran Khanh Hung',
          CreatedAvar: null,
          OrderCode: '6948',
          BookingImage: null,
          ListAirline: null,
          ListAirport: null,
          ListAircraft: null,
          Id: '82E9CC70-4D47-48C1-BE4C-BA2F0E7B4DED',
          Index: 6936,
          OfficeId: null,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          ListParent: null,
          OrderId: '5537FF8E-9BC4-4431-98FE-27A4CE359CB0',
          CreatedBy: '669635EA-7688-4A8F-B995-2B2A375C9DA3',
          BookingCode: '5OSUJ8',
          BookingStatus: 'OK',
          BookingDate: '2024-07-19T13:23:06.723',
          ExpirationDate: '2024-07-19T19:22:00',
          TimePurchase: '2024-07-19T19:22:00',
          System: 'VN',
          Source: 'API',
          Airline: 'VN',
          Leg: 0,
          Itinerary: 1,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          DepartDate: '2024-08-08T05:00:00',
          ReturnDate: null,
          Message: null,
          Latency: 9.0045676,
          Pcc: null,
          SignIn: 'VNA00017',
          Adt: 1,
          Chd: 0,
          Inf: 0,
          TotalPrice: 1079000,
          NetPrice: 979000,
          Profit: 100000,
          Currency: 'VND',
          EquivCurrency: 'VND',
          CurrencyRate: 1,
          FareClass: 'A',
          FareBasis: 'AAP4VNF',
          Promo: false,
          AutoIssue: false,
          AccountCode: null,
          Tourcode: null,
          CACode: null,
          FlightType: 'domestic',
          FlightInfo: 'VN-HANSGN-08/08/2024',
          PaxName: 'NGO MINH HAI',
          PaxSumm: '1 ADT',
          MultiCity: false,
          RoundTrip: false,
          ContactTitle: '',
          ContactName: '',
          ContactArea: null,
          ContactPhone: '564454564',
          ContactEmail: 'Hainm@gmail.com',
          ContactAddress: '',
          AgentPhone: null,
          AgentEmail: null,
          FareRule: 'DTC117',
          PNRImage: 'DTC117',
          Visible: true,
          ParentId: null,
          ParentPNR: null,
          NdcCode: null,
          Ancillaries: [],
          Charges: [],
          FareInfos: [],
          Flights: [],
          Order: null,
          Passengers: [],
          Tickets: [],
        },
        {
          AgentCode: null,
          AgentName: null,
          SubAgId: null,
          SubAgCode: null,
          SubAgName: null,
          CreatedUser: 'Super Admin',
          CreatedAvar: null,
          OrderCode: '6947',
          BookingImage: null,
          ListAirline: null,
          ListAirport: null,
          ListAircraft: null,
          Id: 'BA12E24A-8FFB-4A05-96E8-5A6A7A4BE00F',
          Index: 6935,
          OfficeId: '38D57A42-E6CD-4CDE-8020-77FFF502B8E3',
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          ListParent: null,
          OrderId: '6D5E00F7-24C5-4559-91AD-DB20C12926DF',
          CreatedBy: '28C23B2F-F2EB-4006-9346-3FAB705E0B83',
          BookingCode: '5OSU8D',
          BookingStatus: 'OK',
          BookingDate: '2024-07-19T13:22:30.87',
          ExpirationDate: '2024-08-02T23:00:00',
          TimePurchase: '2024-07-23T00:00:00',
          System: '1A',
          Source: 'API',
          Airline: 'SQ',
          Leg: 0,
          Itinerary: 1,
          StartPoint: 'HAN',
          EndPoint: 'BKK',
          DepartDate: '2024-09-19T12:35:00',
          ReturnDate: null,
          Message: null,
          Latency: 10.4252672,
          Pcc: 'SGNVM28BT',
          SignIn: 'WSHNNHNH',
          Adt: 1,
          Chd: 0,
          Inf: 0,
          TotalPrice: 7768000,
          NetPrice: 7668000,
          Profit: 100000,
          Currency: 'VND',
          EquivCurrency: 'VND',
          CurrencyRate: 1,
          FareClass: 'N',
          FareBasis: 'N16VNO',
          Promo: false,
          AutoIssue: false,
          AccountCode: null,
          Tourcode: null,
          CACode: null,
          FlightType: 'outbound',
          FlightInfo: 'SQ-HANBKK-19/09/2024',
          PaxName: 'TA DUNG HOAI',
          PaxSumm: '1 ADT',
          MultiCity: false,
          RoundTrip: false,
          ContactTitle: null,
          ContactName: 'Nguyen Minh Tri',
          ContactArea: null,
          ContactPhone: '975750088',
          ContactEmail: 'minhnq1203@gmail.com',
          ContactAddress: '58 To Huu, Nam Tu Liem',
          AgentPhone: null,
          AgentEmail: null,
          FareRule: 'LOCAL',
          PNRImage: 'LOCAL',
          Visible: true,
          ParentId: null,
          ParentPNR: null,
          NdcCode: null,
          Ancillaries: [],
          Charges: [],
          FareInfos: [],
          Flights: [],
          Order: null,
          Passengers: [],
          Tickets: [],
        },
        {
          AgentCode: null,
          AgentName: null,
          SubAgId: null,
          SubAgCode: null,
          SubAgName: null,
          CreatedUser: 'Tran Khanh Hung',
          CreatedAvar: null,
          OrderCode: '6946',
          BookingImage: null,
          ListAirline: null,
          ListAirport: null,
          ListAircraft: null,
          Id: 'C702C411-96F4-4FDE-80FF-B880BBCA9DD0',
          Index: 6934,
          OfficeId: null,
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          ListParent: null,
          OrderId: '28C47F7B-D747-4D5F-8B20-558B08B571A8',
          CreatedBy: '669635EA-7688-4A8F-B995-2B2A375C9DA3',
          BookingCode: '5ORRBV',
          BookingStatus: 'OK',
          BookingDate: '2024-07-19T13:17:34.153',
          ExpirationDate: '2024-07-19T19:17:00',
          TimePurchase: '2024-07-19T19:17:00',
          System: 'VN',
          Source: 'API',
          Airline: 'VN',
          Leg: 0,
          Itinerary: 1,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          DepartDate: '2024-08-15T05:00:00',
          ReturnDate: null,
          Message: null,
          Latency: 8.8665624,
          Pcc: null,
          SignIn: 'VNA00017',
          Adt: 1,
          Chd: 0,
          Inf: 0,
          TotalPrice: 1079000,
          NetPrice: 979000,
          Profit: 100000,
          Currency: 'VND',
          EquivCurrency: 'VND',
          CurrencyRate: 1,
          FareClass: 'A',
          FareBasis: 'AAP4VNF',
          Promo: false,
          AutoIssue: false,
          AccountCode: null,
          Tourcode: null,
          CACode: null,
          FlightType: 'domestic',
          FlightInfo: 'VN-HANSGN-15/08/2024',
          PaxName: 'NGO HAI',
          PaxSumm: '1 ADT',
          MultiCity: false,
          RoundTrip: false,
          ContactTitle: '',
          ContactName: '',
          ContactArea: null,
          ContactPhone: '3453434535',
          ContactEmail: 'Ads@gmail.com',
          ContactAddress: '',
          AgentPhone: null,
          AgentEmail: null,
          FareRule: 'DTC117',
          PNRImage: 'DTC117',
          Visible: true,
          ParentId: null,
          ParentPNR: null,
          NdcCode: null,
          Ancillaries: [],
          Charges: [],
          FareInfos: [],
          Flights: [],
          Order: null,
          Passengers: [],
          Tickets: [],
        },
        {
          AgentCode: null,
          AgentName: null,
          SubAgId: null,
          SubAgCode: null,
          SubAgName: null,
          CreatedUser: 'Super Admin',
          CreatedAvar: null,
          OrderCode: '6945',
          BookingImage: null,
          ListAirline: null,
          ListAirport: null,
          ListAircraft: null,
          Id: '3ABC3056-162D-416F-A894-A9690301E5CC',
          Index: 6933,
          OfficeId: '38D57A42-E6CD-4CDE-8020-77FFF502B8E3',
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          ListParent: null,
          OrderId: '3BFF98EE-02BC-4DEC-AA40-BCD70B9D6FDB',
          CreatedBy: '28C23B2F-F2EB-4006-9346-3FAB705E0B83',
          BookingCode: '5ONKXO',
          BookingStatus: 'TICKETED',
          BookingDate: '2024-07-19T12:47:58.397',
          ExpirationDate: '2024-07-19T18:47:00',
          TimePurchase: '2024-07-19T18:47:00',
          System: 'VN',
          Source: 'API',
          Airline: 'VN',
          Leg: 1,
          Itinerary: 1,
          StartPoint: 'SGN',
          EndPoint: 'HAN',
          DepartDate: '2024-09-27T06:00:00',
          ReturnDate: null,
          Message: null,
          Latency: 9.0403559,
          Pcc: null,
          SignIn: 'VNA00017',
          Adt: 1,
          Chd: 0,
          Inf: 0,
          TotalPrice: 1079000,
          NetPrice: 979000,
          Profit: 100000,
          Currency: 'VND',
          EquivCurrency: 'VND',
          CurrencyRate: 1,
          FareClass: 'A',
          FareBasis: 'AAP4VNF',
          Promo: false,
          AutoIssue: false,
          AccountCode: null,
          Tourcode: null,
          CACode: null,
          FlightType: 'domestic',
          FlightInfo: 'VN-SGNHAN-27/09/2024',
          PaxName: 'NGUYEN MINH TRI',
          PaxSumm: '1 ADT',
          MultiCity: false,
          RoundTrip: false,
          ContactTitle: null,
          ContactName: null,
          ContactArea: null,
          ContactPhone: '975750080',
          ContactEmail: 'minhnq1203@gmail.com',
          ContactAddress: null,
          AgentPhone: null,
          AgentEmail: null,
          FareRule: 'DTC117',
          PNRImage: 'DTC117',
          Visible: true,
          ParentId: null,
          ParentPNR: null,
          NdcCode: null,
          Ancillaries: [],
          Charges: [],
          FareInfos: [],
          Flights: [],
          Order: null,
          Passengers: [],
          Tickets: [],
        },
        {
          AgentCode: null,
          AgentName: null,
          SubAgId: null,
          SubAgCode: null,
          SubAgName: null,
          CreatedUser: 'Super Admin',
          CreatedAvar: null,
          OrderCode: '6945',
          BookingImage: null,
          ListAirline: null,
          ListAirport: null,
          ListAircraft: null,
          Id: 'FB0B8EAD-1F0B-41D6-BA0B-43BA9C6539AC',
          Index: 6932,
          OfficeId: '38D57A42-E6CD-4CDE-8020-77FFF502B8E3',
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          ListParent: null,
          OrderId: '3BFF98EE-02BC-4DEC-AA40-BCD70B9D6FDB',
          CreatedBy: '28C23B2F-F2EB-4006-9346-3FAB705E0B83',
          BookingCode: '5JXGIS',
          BookingStatus: 'TICKETED',
          BookingDate: '2024-07-19T12:47:58.363',
          ExpirationDate: '2024-07-19T18:47:00',
          TimePurchase: null,
          System: 'QH',
          Source: 'API',
          Airline: 'QH',
          Leg: 0,
          Itinerary: 1,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          DepartDate: '2024-09-06T06:20:00',
          ReturnDate: null,
          Message: null,
          Latency: 24.3000657,
          Pcc: 'agency_test_22',
          SignIn: 'hongnn@bambooairways.com',
          Adt: 1,
          Chd: 0,
          Inf: 0,
          TotalPrice: 1666000,
          NetPrice: 1566000,
          Profit: 100000,
          Currency: 'VND',
          EquivCurrency: 'VND',
          CurrencyRate: 1,
          FareClass: 'T',
          FareBasis: 'TES0F',
          Promo: false,
          AutoIssue: false,
          AccountCode: null,
          Tourcode: null,
          CACode: null,
          FlightType: 'domestic',
          FlightInfo: 'QH-HANSGN-06/09/2024',
          PaxName: 'NGUYEN MINH TRI',
          PaxSumm: '1 ADT',
          MultiCity: false,
          RoundTrip: false,
          ContactTitle: null,
          ContactName: null,
          ContactArea: null,
          ContactPhone: '975750080',
          ContactEmail: 'minhnq1203@gmail.com',
          ContactAddress: null,
          AgentPhone: null,
          AgentEmail: null,
          FareRule: 'DTC117',
          PNRImage: 'DTC117',
          Visible: true,
          ParentId: null,
          ParentPNR: null,
          NdcCode: null,
          Ancillaries: [],
          Charges: [],
          FareInfos: [],
          Flights: [],
          Order: null,
          Passengers: [],
          Tickets: [],
        },
        {
          AgentCode: null,
          AgentName: null,
          SubAgId: null,
          SubAgCode: null,
          SubAgName: null,
          CreatedUser: 'Super Admin',
          CreatedAvar: null,
          OrderCode: '6944',
          BookingImage: null,
          ListAirline: null,
          ListAirport: null,
          ListAircraft: null,
          Id: '581EF73B-1A18-414F-B653-5E44FB998F94',
          Index: 6931,
          OfficeId: '38D57A42-E6CD-4CDE-8020-77FFF502B8E3',
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          ListParent: null,
          OrderId: 'C3DAC52F-286E-4C97-86F9-9C17AC4512FE',
          CreatedBy: '28C23B2F-F2EB-4006-9346-3FAB705E0B83',
          BookingCode: '5JXJTV',
          BookingStatus: 'OK',
          BookingDate: '2024-07-19T12:45:26.357',
          ExpirationDate: '2024-07-19T18:45:00',
          TimePurchase: null,
          System: 'QH',
          Source: 'API',
          Airline: 'QH',
          Leg: 0,
          Itinerary: 1,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          DepartDate: '2024-07-26T06:20:00',
          ReturnDate: null,
          Message: null,
          Latency: 25.9542525,
          Pcc: 'agency_test_22',
          SignIn: 'hongnn@bambooairways.com',
          Adt: 1,
          Chd: 0,
          Inf: 0,
          TotalPrice: 2444000,
          NetPrice: 2344000,
          Profit: 100000,
          Currency: 'VND',
          EquivCurrency: 'VND',
          CurrencyRate: 1,
          FareClass: 'L',
          FareBasis: 'LES0F',
          Promo: false,
          AutoIssue: false,
          AccountCode: null,
          Tourcode: null,
          CACode: null,
          FlightType: 'domestic',
          FlightInfo: 'QH-HANSGN-26/07/2024',
          PaxName: 'NGUYEN MINH TRI',
          PaxSumm: '1 ADT',
          MultiCity: false,
          RoundTrip: false,
          ContactTitle: null,
          ContactName: null,
          ContactArea: null,
          ContactPhone: '975750088',
          ContactEmail: 'minhnq1203@gmail.com',
          ContactAddress: null,
          AgentPhone: null,
          AgentEmail: null,
          FareRule: 'DTC117',
          PNRImage: 'DTC117',
          Visible: true,
          ParentId: null,
          ParentPNR: null,
          NdcCode: null,
          Ancillaries: [],
          Charges: [],
          FareInfos: [],
          Flights: [],
          Order: null,
          Passengers: [],
          Tickets: [],
        },
        {
          AgentCode: null,
          AgentName: null,
          SubAgId: null,
          SubAgCode: null,
          SubAgName: null,
          CreatedUser: 'Super Admin',
          CreatedAvar: null,
          OrderCode: '6943',
          BookingImage: null,
          ListAirline: null,
          ListAirport: null,
          ListAircraft: null,
          Id: '91317952-9907-428C-B705-270909FB64F4',
          Index: 6930,
          OfficeId: '38D57A42-E6CD-4CDE-8020-77FFF502B8E3',
          AgentId: 'D4275221-ABEB-40AF-8526-98F1C52B362E',
          ListParent: null,
          OrderId: '6CC9C571-1DF9-41FF-A779-D1757317B1AA',
          CreatedBy: '28C23B2F-F2EB-4006-9346-3FAB705E0B83',
          BookingCode: null,
          BookingStatus: 'FAIL',
          BookingDate: '2024-07-19T11:55:18.887',
          ExpirationDate: null,
          TimePurchase: null,
          System: 'VJ',
          Source: 'API',
          Airline: 'VJ',
          Leg: 0,
          Itinerary: 1,
          StartPoint: 'HAN',
          EndPoint: 'SGN',
          DepartDate: '2024-07-27T19:40:00',
          ReturnDate: null,
          Message: 'Có lỗi xảy ra trong tiến trình đặt chỗ',
          Latency: 18.3884229,
          Pcc: null,
          SignIn: 'APIOTA02',
          Adt: 1,
          Chd: 0,
          Inf: 0,
          TotalPrice: 3606900,
          NetPrice: 3506900,
          Profit: 100000,
          Currency: 'VND',
          EquivCurrency: 'VND',
          CurrencyRate: 1,
          FareClass: 'T1_ECO',
          FareBasis: 'T1_ECO',
          Promo: false,
          AutoIssue: false,
          AccountCode: null,
          Tourcode: null,
          CACode: null,
          FlightType: 'domestic',
          FlightInfo: 'VJ-HANSGN-27/07/2024',
          PaxName: 'NGUYEN MINH TRI',
          PaxSumm: '1 ADT',
          MultiCity: false,
          RoundTrip: false,
          ContactTitle: null,
          ContactName: null,
          ContactArea: null,
          ContactPhone: '975750088',
          ContactEmail: 'minhnq1203@gmail.com',
          ContactAddress: null,
          AgentPhone: null,
          AgentEmail: null,
          FareRule: 'LOCAL',
          PNRImage: 'LOCAL',
          Visible: true,
          ParentId: null,
          ParentPNR: null,
          NdcCode: null,
          Ancillaries: [],
          Charges: [],
          FareInfos: [],
          Flights: [],
          Order: null,
          Passengers: [],
          Tickets: [],
        },
      ],
      TotalItem: 303,
      TotalPage: 21,
      PageIndex: 1,
      PageSize: 15,
      HasPreviousPage: true,
      HasNextPage: true,
      OrderBy: 'OrderCode',
      SortType: 'Desc',
      GetAll: false,
      Filter: [],
      StatusCode: '000',
      Success: true,
      Expired: false,
      Message: null,
      Language: 'vi',
      CustomProperties: null,
    },
  };
}

async function fakeRetreiveBooking({
  BookingId,
}: {
  BookingId: string;
  BookingCode: string;
  System: string;
  PassengerName: string;
}): Promise<AxiosResponse<RetrieveBookingRes, any>> {
  await delay(1000);

  const booking = realmRef.current?.objectForPrimaryKey<BookingRealm>(
    BookingRealm.schema.name,
    BookingId,
  );

  return { data: { Booking: booking?.toJSON(), Success: true } };
}

async function fakeBookingGetById({
  id,
}: {
  id: string;
}): Promise<AxiosResponse<BookingRes, any>> {
  const booking = getBookingFromRealm(id);

  return {
    data: {
      Item: booking,
      StatusCode: '000',
      Success: true,
      Expired: false,
      Message: null,
      Language: 'vi',
      CustomProperties: null,
    },
  };
}

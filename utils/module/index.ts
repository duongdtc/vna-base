import { IconTypes } from '@assets/icon';
import { UserModule } from '@services/axios/axios-data';
import { APP_SCREEN } from '@utils';

export const processSideBarModule = (
  processedListModule: Array<
    UserModule & {
      children: Array<UserModule>;
    }
  >,
  listUserModule: Array<UserModule>,
) => {
  processedListModule.forEach(userModule => {
    userModule.children = listUserModule.filter(
      subUserModule => subUserModule.ParentId === userModule.Id,
    );

    if (userModule.children.length !== 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      processSideBarModule(userModule.children, listUserModule);
    }
  });
};

export const mapModule = ({
  Code,
  Path,
}: Pick<UserModule, 'Code' | 'Path'>) => {
  let icon: IconTypes = 'monitor_outline';
  let route: APP_SCREEN | null = null;

  // map icon
  switch (Code) {
    case 'FLIGHTBOOKING':
      icon = 'paper_plane_outline';
      break;

    case 'ORDER':
      icon = 'file_text_outline';
      break;

    case 'BOOKING':
      icon = 'npm_outline';
      break;

    case 'SeriBooking':
      icon = 'credit_card_outline';
      break;

    case 'NonSeribooking':
      icon = 'shield_outline';
      break;

    // TODO: chưa có icon
    // case 'TOUR':
    //   icon = 'alert_triangle_fill';
    //   break;

    case 'MANAGE':
      icon = 'people_outline';
      break;

    // TODO: chưa có icon
    // case 'IBE':
    //   icon = 'alert_triangle_fill';
    //   break;

    case 'FINANCE':
      icon = 'pantone_outline';
      break;

    // TODO: chưa có icon
    // case 'CONTENTS':
    //   icon = 'alert_triangle_fill';
    //   break;

    case 'SYSTEM':
      icon = 'monitor_outline';
      break;

    // TODO: chưa có icon
    // case 'STATISTIC':
    //   icon = 'alert_triangle_fill';
    //   break;

    // TODO: chưa có icon
    default:
      icon = 'cube_outline';
      break;
  }

  // mapPath

  switch (Path) {
    // đặt chuyến bay
    case '/Flight':
      route = APP_SCREEN.SEARCH_FLIGHT;
      break;

    // Quản lý đơn hàng
    case '/Order':
      route = APP_SCREEN.ORDER;
      break;

    // Quản lý agent
    case '/Agent':
      route = APP_SCREEN.AGENTS;
      break;

    // Quản lý booking
    case '/Booking':
      route = APP_SCREEN.BOOKING;
      break;

    // case '/SeriBooking':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    //
    // case '/NonSeriBooking':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    //Quản lý tour
    // case '/TripInfo':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    //QUản lý đơn hàng tour
    // case '/TripOrder':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Khách hàng tour
    // case '/TripUser':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // TODO: Khách hàng - chưa có path
    // case '/TripUser':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    //Tài khoản
    // case '/UserAccount':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    //Quản lý công việc
    // case '/UserTask':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    //Nhóm tài khoản
    // case '/UserGroup':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    //Phân quyền
    // case '/UserPermission':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // TODO: Nhà cung cấp - chưa có path
    // case '/TripUser':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // TODO: Chi nhánh - chưa có path
    // case '/TripUser':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // TODO: Phòng ban - chưa có path
    // case '/TripUser':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Khách hàng bảo hiểm
    // case '/PassengerInsurance':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Phản hồi khách hàng
    // case '/Feedback':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Tài khoản hãng
    // case '/SignIn':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Chính sách giá
    // case '/FlightPolicy':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Điều kiện vé
    // case '/FlightFareRule':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // TODO: Hạng chỗ - chưa có path
    // case '/Feedback':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Mã khuyến mại
    // case '/Tourcode':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Ký quỹ
    // case '/Deposit':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Quỹ tiền
    // case '/Fund':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Báo cáo
    // case '/SalesReports':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Công nợ
    // case '/Debt':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Bài viết
    // case '/Content':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Chủ đề
    // case '/Category':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Cấu hình Email
    // case '/EmailConfig':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Tiền tệ
    // case '/Currency':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // TODO: Dữ liệu - chưa có path
    // case '/Feedback':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Tổng hợp
    // case '/General':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Đặt chỗ
    // case '/FlightBookingStatistics':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Tìm kiếm
    // case '/FlightSearchStatistics':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Xuất vé
    // case '/FlightTicketStatistics':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    // Truy vấn
    // case '/FlightRequestStatistics':
    //   route = APP_SCREEN.SEARCH_FLIGHT;
    //   break;

    default:
      break;
  }

  return { icon, route };
};

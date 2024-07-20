/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { showToast } from '@vna-base/components';
import {
  AirOptionCustom,
  ApplyFlightFee,
  ApplyPassengerFee,
  ContactInfo,
  Passenger,
  PassengerForm,
} from '@vna-base/screens/flight/type';
import {
  Ancillary,
  BookFlightReq,
  ContactInfo as ContactInfoAxios,
  InvoiceInfo,
  Passenger as PassengerAxios,
} from '@services/axios/axios-ibe';
import { CountryRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { I18nKeys } from '@translations/locales';
import {
  convertStringToNumber,
  Gender,
  getState,
  PassengerType,
  rxEmail,
  rxGivenName,
  rxNumber,
  rxSpecialAndNumber,
  rxSurName,
  System,
} from '@vna-base/utils';
import dayjs from 'dayjs';
import cloneDeep from 'lodash.clonedeep';

import isEmpty from 'lodash.isempty';
import { UseFormTrigger } from 'react-hook-form';

export const getPassengerTitle = ({
  gender,
  type,
}: {
  gender: Gender;
  type: PassengerType;
}) => {
  let title = '';

  switch (gender) {
    case Gender.Male:
      if (type === PassengerType.ADT) {
        title = 'MR';
      } else {
        title = 'MSTR';
      }

      break;

    case Gender.Female:
      if (type === PassengerType.ADT) {
        title = 'MS';
      } else {
        title = 'MISS';
      }

      break;
  }

  return title;
};

const validateContactInfo = (
  ctInfo: ContactInfo,
): { errMes: I18nKeys | undefined; canNext: boolean } => {
  const { Email, PhoneNumber } = ctInfo;

  if (!Email || Email === '' || !PhoneNumber || PhoneNumber === '') {
    return {
      canNext: false,
      errMes: 'input_info_passenger:do_not_leave_red_field_blank',
    };
  }

  if (!rxEmail.test(Email) || !rxNumber.test(PhoneNumber)) {
    return {
      canNext: false,
      errMes: 'input_info_passenger:wrong_format',
    };
  }

  return {
    canNext: true,
    errMes: undefined,
  };
};

export const validatePassengerForm = (
  formValues: PassengerForm,
  trigger: UseFormTrigger<PassengerForm>,
) => {
  const { isLoadingVerifiedFlights, listSelectedFlight } =
    getState('flightResult');

  if (isLoadingVerifiedFlights) {
    showToast({
      type: 'error',
      t18n: 'input_info_passenger:can_not_continue_when_verifing_flights',
    });
    return false;
  }

  let check: { errMes: I18nKeys | undefined; canNext: boolean } = {
    canNext: true,
    errMes: undefined,
  };

  const isSplitFullName = formValues.SplitFullName;

  switch (formValues.TabIndex) {
    // Nếu là tab 0 (tab điền thông tin người dùng):
    // - Không được để trống tên, tên không bao gồm số và kí tự đặc biệt
    // - Không được để trống ngày sinh
    case 0:
      trigger(
        formValues.Passengers.reduce(
          (result, _, currIndex) =>
            result.concat([
              !isSplitFullName && `Passengers.${currIndex}.FullName`,
              isSplitFullName && `Passengers.${currIndex}.Surname`,
              isSplitFullName && `Passengers.${currIndex}.GivenName`,
              `Passengers.${currIndex}.Gender`,
              `Passengers.${currIndex}.Birthday`,
            ]),
          new Array(0),
        ),
      );

      for (let i = 0; i < formValues.Passengers.length; ++i) {
        const passenger = formValues.Passengers[i];

        const isFullNameEmpty =
          !isSplitFullName &&
          (!passenger.FullName || passenger.FullName === '');
        const isSplitNameEmpty =
          isSplitFullName &&
          (!passenger.Surname ||
            passenger.Surname === '' ||
            !passenger.GivenName ||
            passenger.GivenName === '');

        if (isFullNameEmpty || isSplitNameEmpty) {
          check.errMes = 'input_info_passenger:do_not_leave_red_field_blank';
          check.canNext = false;
        } else if (
          !passenger.Birthday &&
          (passenger.Type !== PassengerType.ADT ||
            listSelectedFlight.some(
              fl => fl.System === System.AK || fl.System === System.TR,
            ))
        ) {
          check.errMes = 'input_info_passenger:do_not_leave_red_field_blank';
          check.canNext = false;
        } else if (passenger.Gender === undefined) {
          check.errMes = 'input_info_passenger:do_not_leave_gender_field_blank';
          check.canNext = false;
        } else {
          const isNameInvalid =
            !isSplitFullName && !rxSpecialAndNumber.test(passenger.FullName);

          // Reset biểu thức chính quy sau mỗi lần kiểm tra vì biểu thức chính quy được global
          rxSurName.lastIndex = 0;
          rxGivenName.lastIndex = 0;
          const isSplitNameInvalid =
            isSplitFullName &&
            (!rxSurName.test(passenger.Surname) ||
              !rxGivenName.test(passenger.GivenName));

          if (isNameInvalid || isSplitNameInvalid) {
            check.errMes =
              'input_info_passenger:name_cannot_contain_special_characters_or_numbers';
            check.canNext = false;
          }
        }
      }

      break;
    // tab 1 (tab chọn dịch vụ) không có điều kiện gì
    case 1:
      break;
    // Tab 2 (tab thông tin thanh toán):
    case 2:
      trigger(['ContactInfo.PhoneNumber', 'ContactInfo.Email']);

      check = validateContactInfo(formValues.ContactInfo);
      break;
  }

  if (!check.canNext) {
    showToast({
      type: 'error',
      //@ts-ignore
      t18n: check.errMes,
    });
    return false;
  }

  return true;
};

export const generateInitialPassengerFormData = (
  listSelectedFlight: Array<AirOptionCustom>,
): PassengerForm => {
  const { passengersForm } = getState('flightBookingForm');

  const { Phone, Email } = getState('currentAccount').currentAccount;

  //@ts-ignore
  const tempInitData: PassengerForm = {
    Insurance: true,
    Passengers: !passengersForm?.Passengers
      ? []
      : cloneDeep(passengersForm?.Passengers),
    FLights: [],
    TotalFareFlight: 0,
    TabIndex: 0,
    SplitFullName: false,
    SubmitOption: passengersForm?.SubmitOption ?? {
      OrderAndTicketIssuance: false,
      BookEachLegSeparately: false,
      AutomaticallyFetchTheLowestPrice: false,
      AutomaticallyIssueTicketsUponExpiration: false,
      ReceivePriceFluctuationNotifications: false,
    },

    ShuttleBus: [],
    Hotel: [],

    //@ts-ignore
    ContactInfo: {
      ...passengersForm?.ContactInfo,
      PhoneNumber: '393072749',
      Email: 'hungtk@gmail.com',
      Address: 'Số 2, Lê Văn Thiêm',
      Note: 'Ghi chú mẫu',
    },
  };

  listSelectedFlight.forEach(airOption => {
    airOption.ListFlightOption![0]?.ListFlight?.forEach(flight => {
      tempInitData.FLights.push({
        ...flight,
        FareOption:
          airOption.ListFlightOption![0].ListFlight!.length > 1
            ? undefined
            : airOption.ListFareOption![0],
        FlightOptionId: airOption.ListFlightOption![0].OptionId!,
        AirlineOptionId: airOption.OptionId!,
        System: airOption.System!,
      });
    });

    tempInitData.TotalFareFlight +=
      airOption.ListFareOption![0]?.TotalFare ?? 0;
  });

  const airlines: Array<{ Airline: string; MembershipID: string }> =
    listSelectedFlight
      .filter(
        (item, index) =>
          listSelectedFlight.findIndex(obj => obj.Airline === item.Airline) ===
          index,
      )
      .map(item => ({
        Airline: item.Airline as string,
        MembershipID: '',
      }));

  // lấy pasenger từ trong store
  const { Passengers } = getState('flightSearch').searchForm;

  Object.keys(Passengers).forEach(key => {
    let iPassenger = 1;
    //@ts-ignore
    for (let i = 0; i < Passengers[key]; i++) {
      const PreSeats = new Array(tempInitData.FLights.length);
      const Baggages = new Array(tempInitData.FLights.length);
      const Services = new Array(tempInitData.FLights.length);
      tempInitData.FLights.forEach((fl, flightIndex) => {
        PreSeats[flightIndex] = new Array(fl.ListSegment!.length);
        Services[flightIndex] = new Array(fl.ListSegment!.length);
      });
      if (!passengersForm?.Passengers) {
        tempInitData.Passengers.push({
          FullName: '',
          Surname: '',
          GivenName: '',
          Gender: 1,
          Type: key.toUpperCase() as PassengerType,
          Index: iPassenger++,
          PreSeats,
          Baggages,
          Services,

          ListMembership: airlines,
        } as Passenger);
      } else {
        const passengerIndex = iPassenger - 1;

        tempInitData.Passengers[passengerIndex].PreSeats = PreSeats;

        tempInitData.Passengers[passengerIndex].Baggages = Baggages;

        tempInitData.Passengers[passengerIndex].Services = Services;

        tempInitData.Passengers[passengerIndex].ListMembership = airlines.map(
          al => ({
            Airline: al.Airline,
            MembershipID:
              tempInitData.Passengers[passengerIndex].ListMembership.find(
                airline => airline.Airline === al.Airline,
              )?.MembershipID ?? '',
          }),
        );

        iPassenger++;
      }
    }
  });

  // if (!!passengersForm?.Passengers) {
  //   tempInitData.Passengers.forEach(pax => {
  //     pax.ListMembership = airlines.map(al => ({
  //       Airline: al.Airline,
  //       MembershipID:
  //         pax.ListMembership.find(airline => airline.Airline === al.Airline)
  //           ?.MembershipID ?? '',
  //     }));
  //   });
  // }

  return tempInitData;
};

const removeMultiSpaceAndTrim = (str: string | undefined | null) => {
  if (!str || str === '') {
    return '';
  }

  return str.replace(/\s+/g, ' ').trim();
};

const replaceSpaceInPassengerForm = (form: PassengerForm) => {
  // passenger
  form.Passengers.forEach(passenger => {
    passenger.FullName = removeMultiSpaceAndTrim(passenger.FullName);
    passenger.Surname = removeMultiSpaceAndTrim(passenger.Surname);
    passenger.GivenName = removeMultiSpaceAndTrim(passenger.GivenName);

    if (passenger.Passport) {
      if (passenger.Passport.DocumentCode !== '') {
        passenger.Passport.DocumentCode = removeMultiSpaceAndTrim(
          passenger.Passport.DocumentCode,
        );
      }
    }

    passenger.ListMembership.forEach(item =>
      removeMultiSpaceAndTrim(item.MembershipID),
    );
  });

  //contact information
  form.ContactInfo.FullName = removeMultiSpaceAndTrim(
    form.ContactInfo.FullName,
  );
  form.ContactInfo.PhoneNumber = removeMultiSpaceAndTrim(
    form.ContactInfo.PhoneNumber,
  );
  form.ContactInfo.Email = removeMultiSpaceAndTrim(form.ContactInfo.Email);
  form.ContactInfo.Address = removeMultiSpaceAndTrim(form.ContactInfo.Address);
  form.ContactInfo.Note = removeMultiSpaceAndTrim(form.ContactInfo.Note);
  if (form.ContactInfo.TaxInfo) {
    form.ContactInfo.TaxInfo.CompanyName = removeMultiSpaceAndTrim(
      form.ContactInfo.TaxInfo.CompanyName,
    );
    form.ContactInfo.TaxInfo.TIN = removeMultiSpaceAndTrim(
      form.ContactInfo.TaxInfo.TIN,
    );
    form.ContactInfo.TaxInfo.ZIP = removeMultiSpaceAndTrim(
      form.ContactInfo.TaxInfo.ZIP,
    );
    form.ContactInfo.TaxInfo.City = removeMultiSpaceAndTrim(
      form.ContactInfo.TaxInfo.City,
    );
    form.ContactInfo.TaxInfo.Address = removeMultiSpaceAndTrim(
      form.ContactInfo.TaxInfo.Address,
    );
    if (form.ContactInfo.TaxInfo.ReceiverInfo) {
      form.ContactInfo.TaxInfo.ReceiverInfo.FullName = removeMultiSpaceAndTrim(
        form.ContactInfo.TaxInfo.ReceiverInfo.FullName,
      );
      form.ContactInfo.TaxInfo.ReceiverInfo.PhoneNumber =
        removeMultiSpaceAndTrim(
          form.ContactInfo.TaxInfo.ReceiverInfo.PhoneNumber,
        );
      form.ContactInfo.TaxInfo.ReceiverInfo.Email = removeMultiSpaceAndTrim(
        form.ContactInfo.TaxInfo.ReceiverInfo.Email,
      );
      form.ContactInfo.TaxInfo.ReceiverInfo.Address = removeMultiSpaceAndTrim(
        form.ContactInfo.TaxInfo.ReceiverInfo.Address,
      );
      form.ContactInfo.TaxInfo.ReceiverInfo.Note = removeMultiSpaceAndTrim(
        form.ContactInfo.TaxInfo.ReceiverInfo.Note,
      );
    }
  }
};

// type FareItem = { Code: string; Name: string; Amount: number };

// function createDefaultFareInfo() {
//   const passengerTypes: Record<
//     PassengerType,
//     Record<FareCode, FareCodeDetail & FareItem>
//   > = {} as Record<PassengerType, Record<FareCode, FareCodeDetail & FareItem>>;

//   Object.values(PassengerType).forEach(type => {
//     const defaultFareItem: FareItem = {
//       Code: '',
//       Name: '',
//       Amount: 0,
//     };

//     //@ts-ignore
//     passengerTypes[type] = cloneDeep(FareCodeDetails);

//     for (const key in passengerTypes[type]) {
//       passengerTypes[type][key as FareCode] = {
//         ...defaultFareItem,
//         ...passengerTypes[type][key as FareCode],
//       };
//     }

//     // passengerTypes[type] = {
//     //   TICKET_FARE: {
//     //     ...defaultFareItem,
//     //     Code: 'TICKET_FARE',
//     //     Name: 'Ticket fares',
//     //   },
//     //   TICKET_VAT: {
//     //     ...defaultFareItem,
//     //     Code: 'TICKET_VAT',
//     //     Name: 'Ticket VAT',
//     //   },
//     //   TICKET_TAX: {
//     //     ...defaultFareItem,
//     //     Code: 'TICKET_TAX',
//     //     Name: 'Ticket taxes',
//     //   },
//     //   SERVICE_FEE: {
//     //     ...defaultFareItem,
//     //     Code: 'SERVICE_FEE',
//     //     Name: 'Service fee',
//     //   },
//     //   DISCOUNT: {
//     //     ...defaultFareItem,
//     //     Code: 'DISCOUNT',
//     //     Name: 'Discount',
//     //   },
//     // };
//   });

//   return passengerTypes;
// }

export const prepareFormForSubmission = (
  form: PassengerForm,
): BookFlightReq => {
  replaceSpaceInPassengerForm(form);
  // const fareInfo = createDefaultFareInfo();

  /** thông tin liên hệ */
  let Contact: ContactInfoAxios | null = null;
  let Invoice: InvoiceInfo | null = null;

  // form.FLights.forEach(flight => {
  //   flight.FareOption?.ListFarePax?.forEach(farePax => {
  //     farePax.ListFareItem?.forEach(fareItem => {
  //       fareInfo[farePax.PaxType as PassengerType][
  //         fareItem.Code as FareCode
  //       ].Amount += fareItem.Amount ?? 0;
  //     });
  //   });
  // });

  const ListPassenger = form.Passengers.map(passenger => {
    passenger.Title = getPassengerTitle({
      gender: passenger.Gender,
      type: passenger.Type,
    });

    if (!form.SplitFullName) {
      if (!passenger.FullName.includes(' ')) {
        passenger.Surname = passenger.FullName;
      } else {
        const name = passenger.FullName.split(' ');
        passenger.Surname = name.shift() ?? '';
        passenger.GivenName = name.join(' ');
      }
    }

    const initPassenger: PassengerAxios = {
      Index: passenger.Index,
      Type: passenger.Type,
      Gender: passenger.Gender,
      DateOfBirth: passenger.Birthday
        ? dayjs(passenger.Birthday).format('DDMMYYYY')
        : undefined,
      GivenName: passenger.GivenName,
      Surname: passenger.Surname,
      // ListFareInfo: Object.values(fareInfo[passenger.Type]),
      Title: passenger.Title,
      Passport: {
        ...passenger.Passport,
        DocumentExpiry: passenger.Passport?.DocumentExpiry
          ? dayjs(passenger.Passport?.DocumentExpiry).format('DDMMYYYY')
          : undefined,
      },
      ListMembership: passenger.ListMembership,
    };

    if (passenger.Type === PassengerType.INF) {
      return initPassenger;
    }

    let ListService: Ancillary[] = [];
    const ListPreSeat: Ancillary[] = [];

    passenger.Services.forEach(flight => {
      flight.forEach(serviceOfSegment => {
        ListService = ListService.concat(serviceOfSegment);
      });
    });

    passenger.PreSeats.forEach((seatOfFLight, _indexFlight) => {
      seatOfFLight.forEach((seat, _idxSegment) => {
        ListPreSeat.push({
          Session: seat?.Session,
          // Airline: form.FLights[indexFlight].ListSegment![idxSegment].Airline,
          Value: seat?.SeatNumber,
          // Name: seat?.SeatNumber,
          // Price: seat?.Price,
          // Currency: seat?.Currency,
          // Leg: indexFlight,
          // StartPoint:
          //   form.FLights[indexFlight].ListSegment![idxSegment].StartPoint,
          // EndPoint: form.FLights[indexFlight].ListSegment![idxSegment].EndPoint,
        });
      });
    });

    initPassenger.ListBaggage = passenger.Baggages;
    initPassenger.ListService = ListService;
    initPassenger.ListPreSeat = ListPreSeat;

    return initPassenger;
  });

  const countryContactInfo =
    realmRef.current?.objectForPrimaryKey<CountryRealm>(
      CountryRealm.schema.name,
      form.ContactInfo.CountryCode as string,
    );

  Contact = {
    Title: '',
    Name: form.ContactInfo.FullName,
    Area: countryContactInfo?.DialCode as string,
    Phone: form.ContactInfo.PhoneNumber,
    Email: form.ContactInfo.Email,
    Address: form.ContactInfo.Address,
    Remark: form.ContactInfo.Note,
    ReceiveEmail: true,
  };

  if (!isEmpty(form.ContactInfo.TaxInfo)) {
    const countryReceiver = realmRef.current?.objectForPrimaryKey<CountryRealm>(
      CountryRealm.schema.name,
      form.ContactInfo.TaxInfo?.ReceiverInfo.CountryCode as string,
    );
    Invoice = {
      CompanyName: form.ContactInfo.TaxInfo?.CompanyName,
      CompanyCity: form.ContactInfo.TaxInfo?.City,
      CompanyCountry: form.ContactInfo.TaxInfo?.CountryCode,
      CompanyPostCode: form.ContactInfo.TaxInfo?.ZIP,
      CompanyTaxCode: form.ContactInfo.TaxInfo?.TIN,
      ReceiverName: form.ContactInfo.TaxInfo?.ReceiverInfo.FullName,
      ReceiverPhone:
        (countryReceiver?.DialCode as string) +
        (form.ContactInfo.TaxInfo?.ReceiverInfo.PhoneNumber as string),
      ReceiverEmail: form.ContactInfo.TaxInfo?.ReceiverInfo.Email,
      ReceiverAddress: form.ContactInfo.TaxInfo?.ReceiverInfo.Address,
      Remark: form.ContactInfo.TaxInfo?.ReceiverInfo.Note,
    };
  }

  const customFeeForm = getState('flightResult').customFeeTotal;

  const ServiceFee = customFeeForm
    ? {
        FeeAdt: convertStringToNumber(customFeeForm.ADT) ?? 0,
        FeeChd: convertStringToNumber(customFeeForm.CHD) ?? 0,
        FeeInf: convertStringToNumber(customFeeForm.INF) ?? 0,
        ApplyEachPassenger:
          customFeeForm.applyPassenger === ApplyPassengerFee.PerPassenger,
        ApplyEachFlight:
          customFeeForm.applyFLight === ApplyFlightFee.PerSegment,
      }
    : undefined;

  return {
    Contact,
    ListPassenger,
    VerifySession: form.VerifiedSessions,
    Invoice,
    ServiceFee,
    Option: {
      IssueTicket: form.SubmitOption.OrderAndTicketIssuance,
      AutoIssue: form.SubmitOption.AutomaticallyIssueTicketsUponExpiration,
      AutoDowngrade: form.SubmitOption.AutomaticallyFetchTheLowestPrice,
      SeparateBooking: form.SubmitOption.BookEachLegSeparately,
      GetNotification: form.SubmitOption.ReceivePriceFluctuationNotifications,
      SendEmail: true,
    },
    Payment: {
      PaymentMethod: '',
      PaymentGateway: '',
    },
  };
};

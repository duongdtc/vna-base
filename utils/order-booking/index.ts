import { IconTypes } from '@assets/icon';
import { translate } from '@vna-base/translations/translate';
import { System, SystemDetails } from '@vna-base/utils/constant';
import { rxSpitStringToArr } from '@vna-base/utils/regex';

export function calSystemNameExcel(systemCode: string | undefined | null) {
  if (!systemCode || systemCode === '') {
    return '';
  }

  return systemCode
    .split(rxSpitStringToArr)
    .reduce(
      (total, curr) =>
        total + `${curr}: ${translate(SystemDetails[curr as System].t18n)}\n`,
      '',
    );
}

export function getIconOfRoute(
  isMultiCity: boolean | undefined,
  isRoundTrip: boolean | undefined,
) {
  let icon: IconTypes;

  switch (true) {
    case isRoundTrip:
      icon = 'swap_fill';
      break;

    case isMultiCity:
      icon = 'arrow_list_transit_fill';
      break;

    default:
      icon = 'arrow_list';
      break;
  }

  return icon;
}

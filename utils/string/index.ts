/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidateMessageObject } from '@vna-base/utils/string/type';

export const trimArray = (sourceArr: Array<unknown> = []): Array<unknown> => {
  return sourceArr.map((element: any) => {
    if (Array.isArray(element)) {
      return trimArray(element);
    }

    switch (typeof element) {
      case 'string':
        return element.trim();
      case 'object':
        return trimObject(element);

      default:
        return element;
    }
  });
};

export const trimObject = (source: any) => {
  if (!source) {
    return source;
  }

  const newObject = source;

  Object.keys(newObject).forEach((key: string) => {
    if (Array.isArray(newObject[key])) {
      newObject[key] = trimArray(newObject[key]);
    }

    if (typeof newObject[key] === 'string') {
      newObject[key] = newObject[key].trim();
    }

    if (typeof newObject[key] === 'object') {
      newObject[key] = trimObject(newObject[key]);
    }
  });

  return newObject;
};

interface ResultHandleTagToArrayText {
  text: string;
  bold: boolean;
}

export const onHandleTagToArrayText = (
  source = '',
  char = '#',
): Array<ResultHandleTagToArrayText> => {
  const textSplit = source.split(' ');

  const arrText: ResultHandleTagToArrayText[] = [];

  textSplit.forEach((text: string, i: number) => {
    const textData = { text: text, bold: false };

    if (text[0] === char) {
      textData.bold = true;

      arrText.push(textData);
    } else {
      arrText.push({ text: text, bold: false });
    }

    if (
      (text === '' && i !== textSplit.length - 1) ||
      i !== textSplit.length - 1
    ) {
      arrText.push({ text: ' ', bold: false });
    }
  });

  return arrText;
};

export const checkPasswordContainUserName = (
  username: string,
  password: string,
) => {
  const numConsecutiveChars = 3;

  // first find all combinations that should not be found in password
  const invalidCombinations = [];

  for (let i = 0; i < username.length - numConsecutiveChars; i++) {
    const curCombination = username[i] + username[i + 1] + username[i + 2];

    invalidCombinations.push(curCombination);
  }

  // now check all invalidCombinations
  let invalid = false;
  for (const curCombination of invalidCombinations) {
    if (password.indexOf(curCombination) !== -1) {
      invalid = true;

      break;
    }
  }

  return invalid;
};

/**
 * @param keyT key of i18n
 * @param options object translate parameter
 * @param optionsTx object translate parameter will translate before set to option base. see detail bellow
 * ex: json file : {"field":{"email":"Email"},"msg":{"msg1":"{{fieldName}} is required"}}
 * => optionsTx = {fieldName:"field:email"}
 * fieldName must translate with i18n
 * so fieldName option will be push on optionsTx
 * This will support translate Option on translate
 * Read hook useErrorMessageTranslation
 */
export const stringifyObjectValidate = ({
  keyT,
  options,
  optionsTx,
}: ValidateMessageObject) => {
  return JSON.stringify({
    keyT,
    options,
    optionsTx,
  });
};

/**
 * bỏ dấu
 * @param str từ cần bỏ
 * @returns trả về string mới không dấu
 */
export function removeDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function convertStringToNumber(str: string | undefined): number {
  if (!str) {
    return 0;
  }

  // Loại bỏ dấu phân cách từ chuỗi (ví dụ: chuyển "1,000" thành "1000")
  const cleanedStr = str.replace(/,/g, '');

  const convertedNumber = parseFloat(cleanedStr);

  if (isNaN(convertedNumber)) {
    return 0; // Trả về 0 nếu không thể chuyển đổi thành số
  }

  return convertedNumber; // Trả về số nếu có thể chuyển đổi
}

// Hàm loại bỏ số 0 ở đầu của số điện thoại
export function removeLeadingZero(phoneNumber: string) {
  // Biểu thức chính quy để kiểm tra và thay thế
  const regex = /^0(\d+)$/;

  // Kiểm tra xem chuỗi có khớp với biểu thức chính quy hay không
  const match = phoneNumber.match(regex);

  // Nếu có khớp, thay thế bằng nội dung của nhóm thứ nhất
  if (match) {
    return match[1];
  } else {
    // Nếu không khớp, trả về nguyên chuỗi
    return phoneNumber;
  }
}

export function generatePassword(
  useLowercase: boolean,
  useUppercase: boolean,
  useNumbers: boolean,
  useSpecial: boolean,
  passwordSize: number,
): string {
  const LOWER_CASE = 'abcdefghijklmnopqrstuvwxyz';
  const UPPER_CASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const NUMBERS = '0123456789';
  const SPECIALS = '!@#$%^&*()-_=+';

  let password = '';
  let charSet = '';

  // Build up the character set to choose from
  if (useLowercase) {
    charSet += LOWER_CASE;
  }

  if (useUppercase) {
    charSet += UPPER_CASE;
  }

  if (useNumbers) {
    charSet += NUMBERS;
  }

  if (useSpecial) {
    charSet += SPECIALS;
  }

  for (let i = 0; i < passwordSize; i++) {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    password += charSet[randomIndex];
  }

  return password;
}

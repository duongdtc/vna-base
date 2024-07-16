export const rxEmail = new RegExp(
  '^[a-zA-Z0-9]+([%\\^&\\-\\=\\+\\,\\.]?[a-zA-Z0-9]+)@[a-zA-Z]+([\\.]?[a-zA-Z]+)*(\\.[a-zA-Z]{2,3})+$',
);

export const rxPassword =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W])(?!.*['"]).{8,}$/;

export const rxNumber = /\d+/g;

// cắt string thành mảng dựa trên Space, break line
export const rxSpitStringToArr = /[\s\n]+/;

export const rxMultiEmail =
  /^([a-zA-Z0-9_]+([%\^&\-=\+\,\.]?[a-zA-Z0-9_]+)@[a-zA-Z]+([\.]?[a-zA-Z]+)*(\.[a-zA-Z]{2,3})+\s*,\s*)*([a-zA-Z0-9_]+([%\^&\-=\+\,\.]?[a-zA-Z0-9_]+)@[a-zA-Z]+([\.]?[a-zA-Z]+)*(\.[a-zA-Z]{2,3})+)$/;

export const rxStringNumber = /^\$?\d{1,3}(,\d{3})*(\.\d{2})?$/;
export const rxPhone = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
export const rxHexColor = /^#([0-9A-F]{3}){1,2}$/i;

export const rxSpecialAndNumber = /^[a-zA-Z]+ [a-zA-Z]+(?: [a-zA-Z]+)*$/;
// chỉ chứa kí tự và không có dấu cách (valid = 1 từ)
export const rxSurName = /^[a-zA-Z]+$/g;
// chỉ chứa kí tự
export const rxGivenName = /^[a-zA-Z\s]+$/g;

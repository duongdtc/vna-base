import { Content } from '@services/axios/axios-data';
import { LanguageSystem } from '@vna-base/utils';

export type TitleAndRemarkForm = {
  language: LanguageSystem;
  Header: Content;
  Footer: Content;
  Remark: Content;
};

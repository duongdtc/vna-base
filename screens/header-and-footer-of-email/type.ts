import { Content } from '@services/axios/axios-data';
import { LanguageSystem } from '@vna-base/utils';

export type HeaderAndFooterForm = {
  language: LanguageSystem;
  Header: Content;
  Footer: Content;
};

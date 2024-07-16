import { selectConfigTicketLanguages } from '@redux-selector';
import { Content } from '@services/axios/axios-data';
import { LanguageSystem, ObjectField } from '@vna-base/utils';
import { useEffect } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { TitleAndRemarkForm } from '../type';

export const useWatchLanguageChange = (
  formMethod: UseFormReturn<TitleAndRemarkForm, any, undefined>,
) => {
  const languages = useSelector(selectConfigTicketLanguages);

  const lang = useWatch<TitleAndRemarkForm>({
    control: formMethod.control,
    name: 'language',
    exact: true,
  });

  useEffect(() => {
    const content: Record<ObjectField, Content> = {} as Record<
      ObjectField,
      Content
    >;

    const contents = languages[lang as LanguageSystem]?.contents;

    if (contents) {
      contents.forEach(ct => {
        content[ct.ObjectField as ObjectField] = ct;
      });
    } else {
      const tempContent: Content = {
        Id: null,
        Data: '',
        Language: lang as LanguageSystem,
      };

      content.Header = { ...tempContent, ObjectField: ObjectField.Header };
      content.Footer = { ...tempContent, ObjectField: ObjectField.Footer };
      content.Remark = { ...tempContent, ObjectField: ObjectField.Remark };
    }

    formMethod.reset({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      language: lang,
      Header: content.Header,
      Footer: content.Footer,
      Remark: content.Remark,
    });
  }, [lang]);
};

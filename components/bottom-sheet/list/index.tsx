import { Block, TextInputWithLeftIcon } from '@vna-base/components';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { removeDiacritics, scale } from '@vna-base/utils';
import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Normal from '../normal';
import { CommonProps, ListProps, ListRef, NormalRef } from '../type';
import { useStyles } from './styles';
import { Keyboard } from 'react-native';

function Index<T>(
  props: ListProps<T> & CommonProps,
  ref: ForwardedRef<ListRef<T>>,
) {
  const {
    onCancel,
    onDismiss,
    t18nTitle,
    renderItem,
    data,
    keyExtractor,
    onDone,
    dismissWhenClose = false,
    oneStep = false,
    // selected,
    fieldSearch,
    ListEmptyComponent,
    style,
    separator,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type,
    snapPoints,
    showSearchInput = true,
    ...rest
  } = props;
  const normalRef = useRef<NormalRef>(null);
  const styles = useStyles();
  const { bottom } = useSafeAreaInsets();
  const [t] = useTranslation();
  const [ownerData, setOwnerData] = useState<Array<T>>([]);

  const [ownerSelected, setOwnerSelected] = useState<T>();

  // useEffect(() => {
  //   setOwnerSelected(selected);
  // }, [selected]);

  useImperativeHandle(
    ref,
    () => ({
      present: (selected?: T | undefined) => {
        setOwnerSelected(selected);
        normalRef.current?.present();
      },
    }),
    [],
  );

  useEffect(() => {
    setOwnerData(data);
  }, [data]);

  const handelDone = useCallback(() => {
    onDone(ownerSelected, () => normalRef.current?.close());
  }, [ownerSelected, onDone]);

  const _onPressItem = (item: T) => {
    setOwnerSelected(item);
    if (oneStep) {
      onDone(item, () => normalRef.current?.close());
    }
  };

  const _renderItem = ({ item, index }: { item: T; index: number }) => {
    return renderItem({
      item,
      isTheFirst: index === 0,
      isTheLast: index === data.length - 1,
      index,
      selected: ownerSelected,
      onPress: () => _onPressItem(item),
    });
  };

  const _onSearch = useCallback(
    (txt: string) => {
      if (fieldSearch) {
        const regex = new RegExp(txt, 'i');
        const matchingStrings = data.filter(member =>
          regex.test(
            removeDiacritics(member[fieldSearch] as string).toLowerCase(),
          ),
        );
        setOwnerData(matchingStrings);
      }
    },
    [fieldSearch, data],
  );

  return (
    <Normal
      ref={normalRef}
      showIndicator={false}
      enablePanDownToClose={false}
      useDynamicSnapPoint={false}
      t18nDone={oneStep ? undefined : 'common:done'}
      onDone={handelDone}
      onCancel={onCancel}
      dismissWhenClose={dismissWhenClose}
      t18nTitle={t18nTitle}
      snapPoints={snapPoints ?? ['94%']}
      style={[styles.container, style]}
      {...rest}
      onDismiss={() => {
        onDismiss?.();
        Keyboard.dismiss();
      }}>
      <Block style={styles.body}>
        {showSearchInput && (
          <TextInputWithLeftIcon
            leftIcon="search_fill"
            style={styles.input}
            styleInput={styles.inputBase}
            leftIconStyle={styles.leftIconTextInput}
            placeholderTextColor={styles.leftIconTextInput.color}
            onChangeText={_onSearch}
            placeholder={t('common:search')}
          />
        )}
        <BottomSheetFlatList
          data={ownerData}
          renderItem={_renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={ListEmptyComponent}
          style={styles.list}
          contentContainerStyle={[
            styles.contentContainerStyle,
            { paddingBottom: bottom || scale(16) },
          ]}
          maxToRenderPerBatch={20}
          initialNumToRender={20}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          ItemSeparatorComponent={() => separator}
        />
      </Block>
    </Normal>
  );
}

const List = forwardRef(Index);

export default List;

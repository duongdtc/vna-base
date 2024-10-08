/* eslint-disable @typescript-eslint/ban-ts-comment */
import { goBack } from '@navigation/navigation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CACode } from '@redux/type';
import { SectionContainer } from '@screens/more-options/section-container';
import { bs, createStyleSheet, useStyles } from '@theme';
import { I18nKeys } from '@translations/locales';
import { APP_SCREEN, RootStackParamList } from '@utils';
import {
  BottomSheet,
  Button,
  Icon,
  NormalHeader,
  RadioButton,
  Screen,
  Separator,
  Switch,
  Text,
  TouchableScale,
} from '@vna-base/components';
import {
  ListRef,
  ListRenderItemParams,
} from '@vna-base/components/bottom-sheet/type';
import { selectCACodes } from '@vna-base/redux/selector';
import { OptionsForm, SeatClassEnum } from '@vna-base/screens/flight/type';
import { translate } from '@vna-base/translations/translate';
import {
  ActiveOpacity,
  FareType,
  FareTypeDetails,
  FlightOptionDetails,
  HitSlop,
  PassengerSearchType,
  PassengerSearchTypeDetails,
  SeatClassDetails,
  SnapPoint,
  TypeDetail,
  scale,
} from '@vna-base/utils';
import React, { useCallback, useEffect, useRef } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import {
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export const MoreOptions = ({
  route,
}: NativeStackScreenProps<
  RootStackParamList,
  APP_SCREEN.MORE_OPTIONS_SEARCH_FLIGHT
>) => {
  const { data, onDone } = route.params;
  const bottomSheetRef = useRef<ListRef<CACode>>(null);
  const CACodes = useSelector(selectCACodes);

  const {
    styles,
    theme: { colors },
  } = useStyles(styleSheet);
  const { bottom } = useSafeAreaInsets();

  const formMethod = useForm<OptionsForm>({
    defaultValues: data,
  });

  const _onSubmit = (d: OptionsForm) => {
    onDone(d);
  };

  const submit = () => {
    formMethod.handleSubmit(_onSubmit)();
    goBack();
  };

  const renderItem = useCallback(
    ({ item, selected: _selected, onPress }: ListRenderItemParams<CACode>) => {
      const isSelected = _selected?.code === item?.code;

      return (
        <TouchableOpacity
          activeOpacity={ActiveOpacity}
          style={[
            styles.statusItemContainer,
            isSelected && styles.selectedStatusItemContainer,
          ]}
          onPress={onPress}>
          <View style={bs.flex}>
            <Text
              fontStyle={isSelected ? 'Body16Semi' : 'Body16Reg'}
              colorTheme={isSelected ? 'neutral100' : 'neutral90'}
              t18n={item?.title as I18nKeys}
            />
            {item.describe && (
              <Text
                fontStyle="Body12Reg"
                colorTheme={isSelected ? 'neutral80' : 'neutral60'}
                text={item?.describe}
              />
            )}
          </View>
          {isSelected && (
            <Icon icon="checkmark_fill" colorTheme="primaryColor" size={24} />
          )}
        </TouchableOpacity>
      );
    },
    [styles.selectedStatusItemContainer, styles.statusItemContainer],
  );

  useEffect(() => {
    return () => {
      formMethod.handleSubmit(_onSubmit)();
    };
  }, []);

  return (
    <Screen backgroundColor={styles.container.backgroundColor}>
      <NormalHeader
        style={styles.header}
        leftContent={
          <Button
            type="common"
            size="small"
            leftIcon="arrow_ios_left_fill"
            textColorTheme="neutral100"
            leftIconSize={32}
            padding={0}
            onPress={() => {
              goBack();
            }}
          />
        }
        centerContent={
          <Text
            t18n="flight:more_options"
            fontStyle="H320Semi"
            colorTheme="neutral100"
          />
        }
      />
      <FormProvider {...formMethod}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          style={styles.scrollView}>
          <SectionContainer t18n="flight:option_seat_class">
            <Controller
              control={formMethod.control}
              render={({ field: { onChange, value } }) => (
                <>
                  {[
                    //@ts-ignore
                    {
                      key: null,
                      t18n: 'common:all',
                    } as TypeDetail<SeatClassEnum>,
                  ]
                    .concat(Object.values(SeatClassDetails))
                    .map(({ key, t18n: text }, idx) => {
                      const selected = value === key;
                      const choose = () => {
                        if (!selected) {
                          onChange(key);
                        }
                      };

                      return (
                        <View key={key}>
                          {idx !== 0 && <Separator type="horizontal" />}
                          <TouchableOpacity
                            activeOpacity={ActiveOpacity}
                            style={styles.seatClass}
                            onPress={choose}>
                            <Text
                              t18n={text as I18nKeys}
                              fontStyle="Body16Reg"
                              colorTheme={
                                selected ? 'primaryColor' : 'neutral70'
                              }
                            />
                            <RadioButton
                              sizeDot={14}
                              value={selected}
                              disable
                              opacity={1}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                </>
              )}
              name={'SeatClass'}
            />
          </SectionContainer>
          <SectionContainer t18n="flight:option_search">
            {Object.values(FlightOptionDetails).map(({ key, t18n }, idx) => (
              <Controller
                key={key}
                name={key}
                control={formMethod.control}
                render={({ field: { onChange, value } }) => (
                  <View key={key}>
                    {idx !== 0 && <Separator type="horizontal" />}
                    <TouchableOpacity
                      style={styles.optionFlight}
                      activeOpacity={ActiveOpacity}
                      onPress={() => {
                        onChange(!value);
                      }}>
                      <Text
                        t18n={t18n}
                        fontStyle="Body16Reg"
                        colorTheme="neutral100"
                      />
                      <Switch value={value} disable opacity={1} />
                    </TouchableOpacity>
                  </View>
                )}
              />
            ))}
          </SectionContainer>
          <SectionContainer text="Corporation">
            <Controller
              name={'Corporation'}
              control={formMethod.control}
              render={({ field: { onChange, value, ref } }) => (
                <View style={styles.caContainer}>
                  <Pressable
                    style={[bs.flex, bs.justifyCenter]}
                    onPress={() => {
                      formMethod.setFocus('Corporation');
                    }}>
                    <TextInput
                      ref={ref}
                      onChangeText={onChange}
                      value={value}
                      placeholder={translate('flight:input_ca_code')}
                      placeholderTextColor={colors.neutral70}
                      style={styles.inputCa}
                    />
                  </Pressable>

                  <TouchableScale
                    onPress={() =>
                      bottomSheetRef.current?.present(
                        //@ts-ignore
                        value !== '' ? { code: value } : null,
                      )
                    }
                    containerStyle={styles.selectCa}
                    hitSlop={HitSlop.Medium}>
                    <Text
                      t18n="flight:select_ca_code"
                      colorTheme="primaryPressed"
                      fontStyle="Body12Med"
                    />
                    <Icon
                      icon="arrow_ios_down_fill"
                      size={14}
                      colorTheme="primaryPressed"
                    />
                  </TouchableScale>
                </View>
              )}
            />
          </SectionContainer>
          <SectionContainer t18n="flight:passenger_search_type">
            <Controller
              name={'PassengerSearchType'}
              control={formMethod.control}
              render={({ field: { onChange, value } }) => (
                <>
                  {[
                    //@ts-ignore
                    {
                      key: null,
                      t18n: 'common:all',
                    } as TypeDetail<PassengerSearchType>,
                  ]
                    .concat(Object.values(PassengerSearchTypeDetails))
                    .map(({ key, t18n: text }, idx) => {
                      const selected = value === key;
                      const choose = () => {
                        onChange(key);
                      };

                      return (
                        <View key={key}>
                          {idx !== 0 && <Separator type="horizontal" />}
                          <TouchableOpacity
                            activeOpacity={ActiveOpacity}
                            disabled={selected}
                            style={styles.seatClass}
                            onPress={choose}
                            key={key}>
                            <Text
                              t18n={text as I18nKeys}
                              fontStyle="Body16Reg"
                              colorTheme={
                                selected ? 'primaryColor' : 'neutral70'
                              }
                            />
                            <RadioButton
                              sizeDot={14}
                              value={selected}
                              disable
                              opacity={1}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                </>
              )}
            />
          </SectionContainer>
          <SectionContainer t18n="flight:ticket_fare_type">
            <Controller
              name={'FareType'}
              control={formMethod.control}
              render={({ field: { onChange, value } }) => (
                <>
                  {[
                    //@ts-ignore
                    {
                      key: null,
                      t18n: 'common:all',
                    } as TypeDetail<FareType>,
                  ]
                    .concat(Object.values(FareTypeDetails))
                    .map(({ key, t18n: text }, idx) => {
                      const selected = value === key;
                      const choose = () => {
                        onChange(key);
                      };

                      return (
                        <View key={key}>
                          {idx !== 0 && <Separator type="horizontal" />}
                          <TouchableOpacity
                            activeOpacity={ActiveOpacity}
                            disabled={selected}
                            style={styles.seatClass}
                            onPress={choose}
                            key={key}>
                            <Text
                              t18n={text as I18nKeys}
                              fontStyle="Body16Reg"
                              colorTheme={
                                selected ? 'primaryColor' : 'neutral70'
                              }
                            />
                            <RadioButton
                              sizeDot={14}
                              value={selected}
                              disable
                              opacity={1}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                </>
              )}
            />
          </SectionContainer>
        </ScrollView>
        <View style={[styles.footer, { paddingBottom: bottom }]}>
          <Button
            t18n="common:confirm"
            textColorTheme="white"
            fullWidth
            onPress={submit}
            buttonColorTheme="gra1"
          />
        </View>
      </FormProvider>

      <BottomSheet<CACode>
        ref={bottomSheetRef}
        type="list"
        keyExtractor={(_, idx) => idx.toString()}
        data={CACodes}
        renderItem={renderItem}
        oneStep={true}
        t18nTitle="flight:select_discount"
        onDone={(val, cb) => {
          formMethod.setValue('Corporation', val?.code ?? '');
          cb?.();
        }}
        snapPoints={[SnapPoint['50%']]}
        showSearchInput={false}
      />
    </Screen>
  );
};

const styleSheet = createStyleSheet(
  ({ colors, shadows, textPresets, spacings }) => ({
    container: { backgroundColor: colors.neutral10 },
    header: {
      backgroundColor: colors.neutral10,
      ...shadows['.3'],
    },
    contentContainer: {
      paddingVertical: scale(12),
      rowGap: scale(8),
    },
    scrollView: {
      backgroundColor: colors.neutral20,
    },
    optionFlight: {
      padding: spacings[12],
      paddingLeft: spacings[16],
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    seatClass: {
      padding: spacings[12],
      paddingLeft: spacings[16],
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    sectionContainer: {
      paddingHorizontal: scale(16),
      paddingTop: scale(12),
      paddingBottom: scale(16),
      rowGap: scale(16),
      backgroundColor: colors.neutral10,
      ...shadows.main,
    },

    footer: {
      paddingHorizontal: scale(16),
      paddingTop: scale(12),
      backgroundColor: colors.neutral10,
      ...shadows.main,
    },
    caContainer: {
      flexDirection: 'row',
      paddingVertical: spacings[10],
      paddingHorizontal: spacings[12],
    },
    selectCa: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: scale(16),
      columnGap: scale(2),
      paddingRight: scale(8),
      paddingLeft: scale(12),
      paddingVertical: scale(6),
      backgroundColor: colors.primarySurface,
    },
    inputCa: {
      paddingVertical: 0,
      color: colors.neutral100,
      ...textPresets.Body16Reg,
      lineHeight: scale(16),
    },
    selectedStatusItemContainer: {
      backgroundColor: colors.primarySurface,
    },
    statusItemContainer: {
      padding: scale(16),
      flexDirection: 'row',
      alignItems: 'center',
      columnGap: scale(8),
    },
  }),
);

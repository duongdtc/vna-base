import { Block, Icon, Separator, Text } from '@vna-base/components';
import { LOGO_URL } from '@env';
import { selectLanguage } from '@redux-selector';
import { Segment } from '@services/axios/axios-ibe';
import { AirlineRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import React, { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FlatList } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import { AncillaryUpdateForm } from '../../type';
import { useStyles } from './styles';

export const SegmentItem = memo(
  ({
    Airline,
    StartPoint,
    EndPoint,
    renderServiceItem,
    index: segmentIndex,
  }: Segment & {
    index: number;
    renderServiceItem: (data: {
      passengerIndex: number;
      segmentIndex?: number | undefined;
    }) => JSX.Element;
  }) => {
    const styles = useStyles();
    const lng = useSelector(selectLanguage);

    const { control } = useFormContext<AncillaryUpdateForm>();

    const { fields } = useFieldArray({
      control,
      name: 'passengers',
    });

    const airline = realmRef.current?.objectForPrimaryKey<AirlineRealm>(
      AirlineRealm.schema.name,
      Airline as string,
    );

    const renderPassenger = useCallback(
      (smIndex?: number) =>
        ({ index }: { index: number }) =>
          renderServiceItem({
            passengerIndex: index,
            segmentIndex: smIndex,
          }),
      [renderServiceItem],
    );

    return (
      <Block>
        <Block style={styles.segmentHeader}>
          <Block flexDirection="row" alignItems="center" columnGap={4}>
            <Block width={20} height={20} borderRadius={4} overflow="hidden">
              <SvgUri
                width={20}
                height={20}
                uri={LOGO_URL + Airline + '.svg'}
              />
            </Block>
            <Text
              text={lng === 'en' ? airline?.NameEn : airline?.NameVi}
              fontStyle="Body12Reg"
              colorTheme="neutral900"
            />
          </Block>
          <Block
            paddingHorizontal={8}
            paddingVertical={2}
            columnGap={2}
            flexDirection="row"
            alignItems="center">
            <Text
              text={StartPoint as string}
              fontStyle="Body12Bold"
              colorTheme="primary900"
            />
            <Icon icon="arrow_right_fill" size={12} colorTheme="primary900" />
            <Text
              text={EndPoint as string}
              fontStyle="Body12Bold"
              colorTheme="primary900"
            />
          </Block>
        </Block>
        <Block paddingHorizontal={8}>
          <FlatList
            scrollEnabled={false}
            data={fields}
            keyExtractor={i => i.id}
            ItemSeparatorComponent={() => (
              <Separator type="horizontal" size={4} />
            )}
            renderItem={renderPassenger(segmentIndex)}
          />
        </Block>
      </Block>
    );
  },
  isEqual,
);

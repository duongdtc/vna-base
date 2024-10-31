import { Segment } from '@services/axios/axios-ibe';
import { AirportRealm } from '@services/realm/models';
import { realmRef } from '@services/realm/provider';
import { createStyleSheet, useStyles } from '@theme';
import { Block, CheckBox, Icon, Separator, Text } from '@vna-base/components';
import { ModalCustomPicker } from '@vna-base/screens/order-detail/components';
import {
  ItemCustom,
  ModalCustomPickerRef,
} from '@vna-base/screens/order-detail/components/modal-custom-picker/type';
import { SnapPoint } from '@vna-base/utils';
import React, { memo, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import { Pressable, View } from 'react-native';

export const Trips = {
  HAN: [
    {
      key: null,
      t18n: 'Không chọn',
    },
    {
      key: 1,
      t18n: 'Nội thành Hà Nội → Sân bay Nội Bài',
      description: 'Hoàn Kiếm, Ba Đình, Hai Bà Trưng, Tây Hồ',
    },
    {
      key: 2,
      t18n: 'Nội thành Hà Nội → Sân bay Nội Bài',
      description: 'Cầu Giấy, Đống Đa, Thanh Xuân, Nam Từ Liêm',
    },
    {
      key: 3,
      t18n: 'Ngoại thành Hà Nội → Sân bay Nội Bài',
      description: 'Chương Mỹ, Hà Đông, Đan Phượng, Long Biên',
    },
  ] as Array<ItemCustom>,
  SGN: [
    {
      key: null,
      t18n: 'Không chọn',
    },
    {
      key: 1,
      t18n: 'Nội thành Hà Nội → Sân bay Nội Bài',
      description: 'Hoàn Kiếm, Ba Đình, Hai Bà Trưng, Tây Hồ',
    },
    {
      key: 2,
      t18n: 'Nội thành Hà Nội → Sân bay Nội Bài',
      description: 'Cầu Giấy, Đống Đa, Thanh Xuân, Nam Từ Liêm',
    },
    {
      key: 3,
      t18n: 'Ngoại thành Hà Nội → Sân bay Nội Bài',
      description: 'Chương Mỹ, Hà Đông, Đan Phượng, Long Biên',
    },
  ] as Array<ItemCustom>,
};

export const SegmentItem = memo(
  ({
    StartPoint,
    renderServiceItem,
    index: segmentIndex,
  }: Segment & {
    index: number;
    renderServiceItem: () => JSX.Element;
  }) => {
    const { styles } = useStyles(styleSheet);

    const btsRef = useRef<ModalCustomPickerRef>(null);

    const [selected, setSelected] = useState(null);
    const [round, setRound] = useState(false);

    const startPoint = realmRef.current?.objectForPrimaryKey<AirportRealm>(
      AirportRealm.schema.name,
      StartPoint as string,
    );

    return (
      <Block>
        <Pressable
          onPress={() => {
            btsRef.current?.present(selected);
          }}
          style={styles.segmentHeader}>
          <Block flexDirection="row" alignItems="center" columnGap={4}>
            <View style={{ flex: 1 }}>
              <Text
                text={
                  !selected
                    ? `${segmentIndex + 1}. ${
                        segmentIndex === 0 ? 'Đến' : 'Từ'
                      } ${startPoint?.NameVi}`
                    : `${segmentIndex + 1}. ${
                        Trips[StartPoint]?.find(it => it.key === selected).t18n
                      }`
                }
                fontStyle="Body14Semi"
                colorTheme="neutral80"
              />
            </View>
            <Icon icon="arrow_ios_right_fill" size={16} />
          </Block>
        </Pressable>
        <Pressable
          onPress={() => {
            setRound(pre => !pre);
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 8,
            }}>
            <Text
              text="Gồm đưa và đón"
              fontStyle="Body12Reg"
              colorTheme="neutral900"
            />
            <CheckBox disable value={round} />
          </View>
        </Pressable>
        <Separator type="horizontal" />
        {renderServiceItem()}

        <ModalCustomPicker
          hasDescription
          ref={btsRef}
          data={Trips[StartPoint]}
          snapPoints={[SnapPoint['50%']]}
          t18nTitle="Chọn hành trình"
          handleDone={setSelected}
        />
      </Block>
    );
  },
  isEqual,
);

const styleSheet = createStyleSheet(({ colors, spacings }) => ({
  segmentHeader: {
    flexDirection: 'row',
    paddingVertical: spacings[12],
    paddingHorizontal: spacings[8],
    backgroundColor: colors.neutral20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentContainer: {
    paddingBottom: spacings[12],
  },
}));

import { Block } from '@vna-base/components/block';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { selectETickets } from '@vna-base/redux/selector';
import { ETicket } from '@services/axios/axios-email';
import React from 'react';
import { ListRenderItem } from 'react-native';
import { useSelector } from 'react-redux';
import { ETicketItem } from './eticket-item';
import { useStyles } from './styles';

export const ETicketTab = ({ bookingId }: { bookingId: string }) => {
  const styles = useStyles();
  const eticket = useSelector(selectETickets);

  const renderItem: ListRenderItem<ETicket> = ({ item, index }) => (
    <ETicketItem
      {...item}
      index={index}
      showHeader={eticket[bookingId].length > 1}
    />
  );

  return (
    <BottomSheetFlatList
      contentContainerStyle={styles.eticketTabContentContainer}
      data={eticket[bookingId] ?? []}
      ItemSeparatorComponent={() => <Block height={8} />}
      keyExtractor={(e, idx) => `${e.Index}${idx}`}
      renderItem={renderItem}
    />
  );
};

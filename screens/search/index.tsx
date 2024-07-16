import { Screen } from '@vna-base/components';
import { commonSearchActions } from '@redux-slice';
import { dispatch } from '@vna-base/utils';
import React, { useEffect } from 'react';
import { AnimatedHeader, ResultSearch } from './components';
import { useStyles } from './styles';

export const Search = () => {
  const styles = useStyles();

  useEffect(() => {
    return () => {
      dispatch(
        commonSearchActions.saveResultSearch({
          Booking: [],
          Order: [],
          Ticket: [],
        }),
      );
    };
  }, []);

  // render
  return (
    <Screen unsafe={true} backgroundColor={styles.container.backgroundColor}>
      <AnimatedHeader />
      <ResultSearch />
    </Screen>
  );
};

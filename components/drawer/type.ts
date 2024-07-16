import { ReactNode } from 'react';

export type DrawerProps = {
  children: ReactNode;
};

export type DrawerRef = {
  show: () => void;
  hide: () => void;
};

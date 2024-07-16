export type ModalInputMoneyPaymentRef = {
  present: (money?: string | undefined, currency?: string) => void;
};

export type ModalInputMoneyPaymentProps = {
  handleDone: (money: string | undefined, currency?: string) => void;
};

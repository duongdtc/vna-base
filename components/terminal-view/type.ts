export type TerminalViewProps = {
  useInBottomSheet?: boolean;
  showExportButton?: boolean;
  cb?: () => void;
  prefixExportName?: string;
  children: React.ReactNode;
};

import { LinearGradientProps } from 'react-native-linear-gradient';

export type GradientProps = {
  type:
    | 'gra1'
    | 'gra2'
    | 'gra3'
    | 'gra4'
    | 'gra5'
    | 'gra6'
    | 'graPre'
    | 'graSuc'
    | 'transparent'
    | 'transparent_50';
} & Omit<LinearGradientProps, 'colors'>;

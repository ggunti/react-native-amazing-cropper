import { Dimensions } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const Q = 100; // buttons container height
export const H = SCREEN_HEIGHT - Q;
export const W = SCREEN_WIDTH;

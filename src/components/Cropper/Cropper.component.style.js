import { StyleSheet } from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT, W, Q } from './Cropper.constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  secondContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  footerContainer: {
    position: 'absolute', 
    top: SCREEN_HEIGHT - Q, 
    bottom: 0, 
    width: W
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row'
  },
  gridColumn: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)'
  },
  animation: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
  topSideAnimation: {
    borderBottomWidth: 20,
    borderColor: 'transparent',
    zIndex: 4
  },
  leftSideAnimation: {
    borderRightWidth: 20,
    borderColor: 'transparent',
    zIndex: 4
  },
  bottomSideAnimation: {
    borderTopWidth: 20,
    borderColor: 'transparent',
    zIndex: 4,
    transform: [{ translateY: -20 }],
  },
  rightSideAnimation: {
    borderLeftWidth: 20,
    borderColor: 'transparent',
    zIndex: 4,
    transform: [{ translateX: -20 }]
  },
  topLeftAnimation: {
    borderLeftWidth: 56,
    borderRightWidth: 25,
    borderTopWidth: 31,
    borderColor: 'transparent',
    zIndex: 5,
  },
  bottomLeftAnimation: {
    borderLeftWidth: 56,
    borderRightWidth: 25,
    borderBottomWidth: 31,
    borderColor: 'transparent',
    zIndex: 5,
    transform: [{ translateY: -31 }]
  },
  bottomRightAnimation: {
    borderTopWidth: 25,
    borderRightWidth: 31,
    borderBottomWidth: 56,
    borderColor: 'transparent',
    zIndex: 5,
    transform: [{ translateX: -31 }, { translateY: -31 }]
  },
  topRightAnimation: {
    borderColor: 'transparent',
    borderTopWidth: 56,
    borderRightWidth: 31,
    borderBottomWidth: 25,
    zIndex: 5,
    transform: [{ translateX: -31 }]
  },
  borderDesign: {
    width: 30,
    height: 30,
    borderColor: 'white'
  },
  
  
  icon: {
    paddingRight: 10,
    flexDirection: 'row',
  },
  zoomNavBar: {
    width: '100%',
    height: 50,
    backgroundColor: '#5a2480',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20
  },
  rightNav: {
    flexDirection: 'row',
  },
});

import React from 'react';
import { View, Animated, Image, PanResponderInstance } from 'react-native';
import { StyleType } from '../Main';
import getStyles from './Cropper.style';

interface CropperProps {
  imageUri: string;
  headerComponent: JSX.Element;
  footerComponent: JSX.Element;
  getTopOuterStyle: () => object;
  getLeftOuterStyle: () => object;
  getBottomOuterStyle: () => object;
  getRightOuterStyle: () => object;
  getTopLeftStyle: () => object;
  getBottomLeftStyle: () => object;
  getBottomRightStyle: () => object;
  getTopRightStyle: () => object;
  getTopSideStyle: () => object;
  getLeftSideStyle: () => object;
  getBottomSideStyle: () => object;
  getRightSideStyle: () => object;
  getRectangleStyle: () => object;
  getImageStyle: () => object;
  onDone: () => void;
  onRotate: () => void;
  onCancel: () => void;
  topOuterPanResponder: PanResponderInstance;
  leftOuterPanResponder: PanResponderInstance;
  bottomOuterPanResponder: PanResponderInstance;
  rightOuterPanResponder: PanResponderInstance;
  topPanResponder: PanResponderInstance;
  leftPanResponder: PanResponderInstance;
  bottomPanResponder: PanResponderInstance;
  rightPanResponder: PanResponderInstance;
  topLeftPanResponder: PanResponderInstance;
  bottomLeftPanResponder: PanResponderInstance;
  bottomRightPanResponder: PanResponderInstance;
  topRightPanResponder: PanResponderInstance;
  rectanglePanResponder: PanResponderInstance;
  topOuterRef: (ref: any) => any;
  leftOuterRef: (ref: any) => any;
  bottomOuterRef: (ref: any) => any;
  rightOuterRef: (ref: any) => any;
  COMPONENT_WIDTH: number;
  COMPONENT_HEIGHT: number;
  W: number;
  H: number;
  style: StyleType;
}

const Cropper: React.FC<CropperProps> = (props) => {
  const styles = getStyles(props.COMPONENT_WIDTH, props.COMPONENT_HEIGHT, props.W);
  const gridColumn = { ...styles.gridColumn, ...props.style.grid.column };
  const borderDesign = { ...styles.borderDesign, ...props.style.grid.border };

  return (
    <View style={[styles.container, props.style.container]}>
      <View style={styles.headerContainer}>{React.cloneElement(props.headerComponent)}</View>
      <View style={styles.secondContainer}>
        <Image style={props.getImageStyle()} source={{ uri: props.imageUri }} />
      </View>

      <View style={styles.footerContainer}>
        {React.cloneElement(props.footerComponent, {
          onDone: props.onDone,
          onRotate: props.onRotate,
          onCancel: props.onCancel,
        })}
      </View>
      {/*
        // @ts-ignore */}
      <Animated.View ref={props.topOuterRef} style={[styles.animation, props.getTopOuterStyle()]} {...props.topOuterPanResponder.panHandlers} />
      {/*
        // @ts-ignore */}
      <Animated.View ref={props.leftOuterRef} style={[styles.animation, props.getLeftOuterStyle()]} {...props.leftOuterPanResponder.panHandlers} />
      {/*
        // @ts-ignore */
      /* eslint-disable-line */
      /* eslint-disable-next-line prettier/prettier */}
      <Animated.View
        ref={props.bottomOuterRef}
        style={[styles.animation, props.getBottomOuterStyle()]}
        {...props.bottomOuterPanResponder.panHandlers}
      />
      {/*
        // @ts-ignore */}
      <Animated.View ref={props.rightOuterRef} style={[styles.animation, props.getRightOuterStyle()]} {...props.rightOuterPanResponder.panHandlers} />

      <Animated.View style={[styles.animation, styles.topSideAnimation, props.getTopSideStyle()]} {...props.topPanResponder.panHandlers} />
      <Animated.View style={[styles.animation, styles.leftSideAnimation, props.getLeftSideStyle()]} {...props.leftPanResponder.panHandlers} />
      <Animated.View style={[styles.animation, styles.bottomSideAnimation, props.getBottomSideStyle()]} {...props.bottomPanResponder.panHandlers} />
      <Animated.View style={[styles.animation, styles.rightSideAnimation, props.getRightSideStyle()]} {...props.rightPanResponder.panHandlers} />

      <Animated.View style={[styles.animation, styles.topLeftAnimation, props.getTopLeftStyle()]} {...props.topLeftPanResponder.panHandlers} />
      {/* eslint-disable-next-line prettier/prettier */}
      <Animated.View
        style={[styles.animation, styles.bottomLeftAnimation, props.getBottomLeftStyle()]}
        {...props.bottomLeftPanResponder.panHandlers}
      />
      {/* eslint-disable-next-line prettier/prettier */}
      <Animated.View
        style={[styles.animation, styles.bottomRightAnimation, props.getBottomRightStyle()]}
        {...props.bottomRightPanResponder.panHandlers}
      />
      <Animated.View style={[styles.animation, styles.topRightAnimation, props.getTopRightStyle()]} {...props.topRightPanResponder.panHandlers} />

      <Animated.View style={[styles.animation, props.getRectangleStyle()]} {...props.rectanglePanResponder.panHandlers}>
        <View style={styles.gridRow}>
          <View style={gridColumn}>
            <View style={[borderDesign, { borderLeftWidth: 3, borderTopWidth: 3 }]} />
          </View>
          <View style={gridColumn}>
            <View style={[borderDesign, { borderTopWidth: 3, alignSelf: 'center' }]} />
          </View>
          <View style={gridColumn}>
            <View style={[borderDesign, { borderTopWidth: 3, borderRightWidth: 3, alignSelf: 'flex-end' }]} />
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={[gridColumn, { flexDirection: 'row' }]}>
            <View style={[borderDesign, { borderLeftWidth: 3, alignSelf: 'center' }]} />
          </View>
          <View style={gridColumn} />
          <View style={[gridColumn, { justifyContent: 'center' }]}>
            <View style={[borderDesign, { borderRightWidth: 3, alignSelf: 'flex-end' }]} />
          </View>
        </View>

        <View style={styles.gridRow}>
          <View style={[gridColumn, { justifyContent: 'flex-end' }]}>
            <View style={[borderDesign, { borderLeftWidth: 3, borderBottomWidth: 3 }]} />
          </View>
          <View style={[gridColumn, { justifyContent: 'flex-end' }]}>
            <View style={[borderDesign, { borderBottomWidth: 3, alignSelf: 'center' }]} />
          </View>
          <View style={[gridColumn, { justifyContent: 'flex-end' }]}>
            <View
              style={[
                borderDesign,
                {
                  borderRightWidth: 3,
                  borderBottomWidth: 3,
                  alignSelf: 'flex-end',
                },
              ]}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default Cropper;

import React, { Component } from 'react';
import { Animated, PanResponder, Platform, PanResponderInstance, PanResponderGestureState, ImageCropData } from 'react-native';
import { createResizedImage } from '@bam.tech/react-native-image-resizer';
// @ts-ignore - react-native-image-rotate does not have typescript support
import ImageRotate from '@meedwire/react-native-image-rotate';
import ImageEditor from '@react-native-community/image-editor';
import { Q } from '../constants';
import Cropper from './Cropper';
import { getCropperLimits } from '../utils';

type CropperPageProps = {
  footerComponent: JSX.Element;
  onDone: (croppedImageUri: string, garbageUris: string[]) => void;
  onError: (err: Error) => void;
  onCancel: () => void;
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  TOP_VALUE: number;
  LEFT_VALUE: number;
  BOTTOM_VALUE: number;
  RIGHT_VALUE: number;
  initialRotation: number;
  NOT_SELECTED_AREA_OPACITY: number;
  BORDER_WIDTH: number;
  COMPONENT_WIDTH: number;
  COMPONENT_HEIGHT: number;
};

interface ExtendedAnimatedValue extends Animated.Value {
  _value: number;
  _offset: number;
}

interface ExtendedAnimatedValueXY extends Animated.AnimatedValueXY {
  x: ExtendedAnimatedValue;
  y: ExtendedAnimatedValue;
}

type Position = 'topPosition' | 'leftPosition' | 'bottomPosition' | 'rightPosition';

interface State {
  topOuterPosition: ExtendedAnimatedValueXY;
  topOuterPanResponder: PanResponderInstance;
  leftOuterPosition: ExtendedAnimatedValueXY;
  leftOuterPanResponder: PanResponderInstance;
  bottomOuterPosition: ExtendedAnimatedValueXY;
  bottomOuterPanResponder: PanResponderInstance;
  rightOuterPosition: ExtendedAnimatedValueXY;
  rightOuterPanResponder: PanResponderInstance;

  topPosition: ExtendedAnimatedValueXY;
  topPanResponder: PanResponderInstance;
  leftPosition: ExtendedAnimatedValueXY;
  leftPanResponder: PanResponderInstance;
  bottomPosition: ExtendedAnimatedValueXY;
  bottomPanResponder: PanResponderInstance;
  rightPosition: ExtendedAnimatedValueXY;
  rightPanResponder: PanResponderInstance;

  topLeftPosition: ExtendedAnimatedValueXY;
  topLeftPanResponder: PanResponderInstance;
  bottomLeftPosition: ExtendedAnimatedValueXY;
  bottomLeftPanResponder: PanResponderInstance;
  bottomRightPosition: ExtendedAnimatedValueXY;
  bottomRightPanResponder: PanResponderInstance;
  topRightPosition: ExtendedAnimatedValueXY;
  topRightPanResponder: PanResponderInstance;

  rectanglePosition: ExtendedAnimatedValueXY;
  rectanglePanResponder: PanResponderInstance;

  TOP_LIMIT: number;
  LEFT_LIMIT: number;
  BOTTOM_LIMIT: number;
  RIGHT_LIMIT: number;

  TOP_VALUE: number;
  LEFT_VALUE: number;
  BOTTOM_VALUE: number;
  RIGHT_VALUE: number;
  rotation: number;
}

class CropperPage extends Component<CropperPageProps, State> {
  constructor(props: CropperPageProps) {
    super(props);
    const { imageWidth, imageHeight, BORDER_WIDTH, COMPONENT_WIDTH, COMPONENT_HEIGHT } = props;
    const W_INT = this.W - 2 * BORDER_WIDTH;
    const H_INT = this.H - 2 * BORDER_WIDTH;
    const { TOP_LIMIT, LEFT_LIMIT, BOTTOM_LIMIT, RIGHT_LIMIT, DIFF } = getCropperLimits(
      imageWidth,
      imageHeight,
      props.initialRotation,
      W_INT,
      H_INT,
      this.W,
      this.H,
      BORDER_WIDTH,
      Q,
    );

    const TOP_VALUE = props.TOP_VALUE !== 0 ? props.TOP_VALUE : TOP_LIMIT;
    const LEFT_VALUE = props.LEFT_VALUE !== 0 ? props.LEFT_VALUE : LEFT_LIMIT;
    const BOTTOM_VALUE = props.BOTTOM_VALUE !== 0 ? props.BOTTOM_VALUE : BOTTOM_LIMIT;
    const RIGHT_VALUE = props.RIGHT_VALUE !== 0 ? props.RIGHT_VALUE : RIGHT_LIMIT;

    const topOuterPosition = new Animated.ValueXY({ x: LEFT_VALUE - BORDER_WIDTH, y: TOP_VALUE - BORDER_WIDTH }) as ExtendedAnimatedValueXY;
    const topOuterPanResponder = PanResponder.create({ onStartShouldSetPanResponder: () => false });
    const leftOuterPosition = new Animated.ValueXY({ x: LEFT_VALUE - BORDER_WIDTH, y: TOP_VALUE - BORDER_WIDTH }) as ExtendedAnimatedValueXY;
    const leftOuterPanResponder = PanResponder.create({ onStartShouldSetPanResponder: () => false });
    const bottomOuterPosition = new Animated.ValueXY({ x: LEFT_VALUE - BORDER_WIDTH, y: COMPONENT_HEIGHT - BOTTOM_VALUE }) as ExtendedAnimatedValueXY;
    const bottomOuterPanResponder = PanResponder.create({ onStartShouldSetPanResponder: () => false });
    const rightOuterPosition = new Animated.ValueXY({ x: COMPONENT_WIDTH - RIGHT_VALUE, y: TOP_VALUE - BORDER_WIDTH }) as ExtendedAnimatedValueXY;
    const rightOuterPanResponder = PanResponder.create({ onStartShouldSetPanResponder: () => false });

    const topPosition = new Animated.ValueXY({ x: LEFT_VALUE - BORDER_WIDTH, y: TOP_VALUE - BORDER_WIDTH }) as ExtendedAnimatedValueXY;
    const topPanResponder = this.initSidePanResponder('topPosition');
    const leftPosition = new Animated.ValueXY({ x: LEFT_VALUE - BORDER_WIDTH, y: TOP_VALUE - BORDER_WIDTH }) as ExtendedAnimatedValueXY;
    const leftPanResponder = this.initSidePanResponder('leftPosition');
    const bottomPosition = new Animated.ValueXY({ x: LEFT_VALUE - BORDER_WIDTH, y: COMPONENT_HEIGHT - BOTTOM_VALUE }) as ExtendedAnimatedValueXY;
    const bottomPanResponder = this.initSidePanResponder('bottomPosition');
    const rightPosition = new Animated.ValueXY({
      x: COMPONENT_WIDTH - RIGHT_VALUE,
      y: TOP_VALUE - BORDER_WIDTH - DIFF / 2,
    }) as ExtendedAnimatedValueXY;
    const rightPanResponder = this.initSidePanResponder('rightPosition');

    const topLeftPosition = new Animated.ValueXY({ x: LEFT_VALUE - BORDER_WIDTH, y: TOP_VALUE - BORDER_WIDTH }) as ExtendedAnimatedValueXY;
    const topLeftPanResponder = this.initCornerPanResponder('topPosition', 'leftPosition');
    const bottomLeftPosition = new Animated.ValueXY({ x: LEFT_VALUE - BORDER_WIDTH, y: COMPONENT_HEIGHT - BOTTOM_VALUE }) as ExtendedAnimatedValueXY;
    const bottomLeftPanResponder = this.initCornerPanResponder('bottomPosition', 'leftPosition');
    const bottomRightPosition = new Animated.ValueXY({
      x: COMPONENT_WIDTH - RIGHT_VALUE,
      y: COMPONENT_HEIGHT - BOTTOM_VALUE,
    }) as ExtendedAnimatedValueXY;
    const bottomRightPanResponder = this.initCornerPanResponder('bottomPosition', 'rightPosition');
    const topRightPosition = new Animated.ValueXY({ x: COMPONENT_WIDTH - RIGHT_VALUE, y: TOP_VALUE - BORDER_WIDTH }) as ExtendedAnimatedValueXY;
    const topRightPanResponder = this.initCornerPanResponder('topPosition', 'rightPosition');

    const rectanglePosition = new Animated.ValueXY({ x: LEFT_VALUE, y: TOP_VALUE }) as ExtendedAnimatedValueXY;
    const rectanglePanResponder = this.initRectanglePanResponder();

    this.state = {
      topOuterPosition,
      topOuterPanResponder,
      leftOuterPosition,
      leftOuterPanResponder,
      bottomOuterPosition,
      bottomOuterPanResponder,
      rightOuterPosition,
      rightOuterPanResponder,

      topPosition,
      topPanResponder,
      leftPosition,
      leftPanResponder,
      bottomPosition,
      bottomPanResponder,
      rightPosition,
      rightPanResponder,

      topLeftPosition,
      topLeftPanResponder,
      bottomLeftPosition,
      bottomLeftPanResponder,
      bottomRightPosition,
      bottomRightPanResponder,
      topRightPosition,
      topRightPanResponder,

      rectanglePosition,
      rectanglePanResponder,

      TOP_LIMIT,
      LEFT_LIMIT,
      BOTTOM_LIMIT,
      RIGHT_LIMIT,

      TOP_VALUE,
      LEFT_VALUE,
      BOTTOM_VALUE,
      RIGHT_VALUE,
      rotation: props.initialRotation,
    };
  }

  isRectangleMoving = false;
  topOuter = undefined;
  leftOuter = undefined;
  bottomOuter = undefined;
  rightOuter = undefined;
  W = this.props.COMPONENT_WIDTH;
  H = this.props.COMPONENT_HEIGHT - Q;

  onCancel = () => {
    this.props.onCancel();
  };

  getTopOuterStyle = () => {
    return {
      ...this.state.topOuterPosition.getLayout(),
      top: this.state.TOP_LIMIT,
      left: this.state.LEFT_LIMIT,
      height: Animated.add(this.props.BORDER_WIDTH - this.state.TOP_LIMIT, this.state.topPosition.y),
      width: this.W,
      backgroundColor: `rgba(0, 0, 0, ${this.props.NOT_SELECTED_AREA_OPACITY})`,
    };
  };

  getLeftOuterStyle = () => {
    return {
      ...this.state.leftOuterPosition.getLayout(),
      top: Animated.add(this.props.BORDER_WIDTH, this.state.topPosition.y),
      left: this.state.LEFT_LIMIT,
      height: Animated.add(-this.props.BORDER_WIDTH, Animated.add(this.state.bottomPosition.y, Animated.multiply(-1, this.state.topPosition.y))),
      width: Animated.add(this.props.BORDER_WIDTH - this.state.LEFT_LIMIT, this.state.leftPosition.x),
      backgroundColor: `rgba(0, 0, 0, ${this.props.NOT_SELECTED_AREA_OPACITY})`,
    };
  };

  getBottomOuterStyle = () => {
    return {
      ...this.state.bottomOuterPosition.getLayout(),
      top: this.state.bottomPosition.y,
      left: this.state.LEFT_LIMIT,
      height: Animated.add(this.props.COMPONENT_HEIGHT - this.state.BOTTOM_LIMIT, Animated.multiply(-1, this.state.bottomPosition.y)),
      width: this.W,
      backgroundColor: `rgba(0, 0, 0, ${this.props.NOT_SELECTED_AREA_OPACITY})`,
    };
  };

  getRightOuterStyle = () => {
    return {
      ...this.state.rightOuterPosition.getLayout(),
      top: Animated.add(this.props.BORDER_WIDTH, this.state.topPosition.y),
      left: this.state.rightPosition.x,
      height: Animated.add(-this.props.BORDER_WIDTH, Animated.add(this.state.bottomPosition.y, Animated.multiply(-1, this.state.topPosition.y))),
      right: this.state.RIGHT_LIMIT,
      backgroundColor: `rgba(0, 0, 0, ${this.props.NOT_SELECTED_AREA_OPACITY})`,
    };
  };

  getTopLeftStyle = () => {
    return {
      ...this.state.topLeftPosition.getLayout(),
      top: this.state.topPosition.y,
      left: this.state.leftPosition.x,
      width: this.props.BORDER_WIDTH,
      paddingBottom: this.props.BORDER_WIDTH,
    };
  };

  getBottomLeftStyle = () => {
    return {
      ...this.state.bottomLeftPosition.getLayout(),
      top: this.state.bottomPosition.y,
      left: this.state.leftPosition.x,
      width: this.props.BORDER_WIDTH,
      paddingTop: this.props.BORDER_WIDTH,
    };
  };

  getBottomRightStyle = () => {
    return {
      ...this.state.bottomRightPosition.getLayout(),
      top: this.state.bottomPosition.y,
      left: this.state.rightPosition.x,
      height: this.props.BORDER_WIDTH,
      paddingLeft: this.props.BORDER_WIDTH,
    };
  };

  getTopRightStyle = () => {
    return {
      ...this.state.topRightPosition.getLayout(),
      top: this.state.topPosition.y,
      left: this.state.rightPosition.x,
      height: this.props.BORDER_WIDTH,
      paddingLeft: this.props.BORDER_WIDTH,
    };
  };

  getTopSideStyle = () => {
    return {
      ...this.state.topPosition.getLayout(),
      left: Animated.add(this.props.BORDER_WIDTH, this.state.leftPosition.x),
      width: Animated.add(-this.props.BORDER_WIDTH, Animated.add(this.state.rightPosition.x, Animated.multiply(-1, this.state.leftPosition.x))),
      paddingBottom: this.props.BORDER_WIDTH,
    };
  };

  getLeftSideStyle = () => {
    return {
      ...this.state.leftPosition.getLayout(),
      top: Animated.add(this.props.BORDER_WIDTH, this.state.topPosition.y),
      height: Animated.add(-this.props.BORDER_WIDTH, Animated.add(this.state.bottomPosition.y, Animated.multiply(-1, this.state.topPosition.y))),
      paddingLeft: this.props.BORDER_WIDTH,
    };
  };

  getBottomSideStyle = () => {
    return {
      ...this.state.bottomPosition.getLayout(),
      left: Animated.add(this.props.BORDER_WIDTH, this.state.leftPosition.x),
      width: Animated.add(-this.props.BORDER_WIDTH, Animated.add(this.state.rightPosition.x, Animated.multiply(-1, this.state.leftPosition.x))),
      paddingTop: this.props.BORDER_WIDTH,
    };
  };

  getRightSideStyle = () => {
    return {
      ...this.state.rightPosition.getLayout(),
      top: Animated.add(this.props.BORDER_WIDTH, this.state.topPosition.y),
      height: Animated.add(-this.props.BORDER_WIDTH, Animated.add(this.state.bottomPosition.y, Animated.multiply(-1, this.state.topPosition.y))),
      paddingLeft: this.props.BORDER_WIDTH,
    };
  };

  getRectangleStyle = () => {
    return {
      ...this.state.rectanglePosition.getLayout(),
      top: Animated.add(this.props.BORDER_WIDTH, this.state.topPosition.y),
      left: Animated.add(this.props.BORDER_WIDTH, this.state.leftPosition.x),
      width: Animated.add(-this.props.BORDER_WIDTH, Animated.add(this.state.rightPosition.x, Animated.multiply(-1, this.state.leftPosition.x))),
      height: Animated.add(-this.props.BORDER_WIDTH, Animated.add(this.state.bottomPosition.y, Animated.multiply(-1, this.state.topPosition.y))),
      zIndex: 3,
    };
  };

  getImageStyle = () => {
    const DIFF = this.state.topPosition.y._value - this.state.rightPosition.y._value;
    return {
      position: 'absolute',
      top: this.state.TOP_LIMIT - DIFF,
      left: this.state.LEFT_LIMIT + DIFF,
      bottom: this.state.BOTTOM_LIMIT - DIFF,
      right: this.state.RIGHT_LIMIT + DIFF,
      resizeMode: 'stretch',
      transform: [{ rotate: `${this.state.rotation.toString()}deg` }],
    };
  };

  isAllowedToMoveTopSide = (gesture: PanResponderGestureState) => {
    return (
      this.state.topPosition.y._offset + gesture.dy >= this.state.TOP_LIMIT - this.props.BORDER_WIDTH &&
      this.state.topPosition.y._offset + gesture.dy + this.props.BORDER_WIDTH + 1 < this.state.bottomPosition.y._offset
    );
  };
  isAllowedToMoveLeftSide = (gesture: PanResponderGestureState) => {
    return (
      this.state.leftPosition.x._offset + gesture.dx >= this.state.LEFT_LIMIT - this.props.BORDER_WIDTH &&
      this.state.leftPosition.x._offset + gesture.dx + this.props.BORDER_WIDTH + 1 < this.state.rightPosition.x._offset
    );
  };
  isAllowedToMoveBottomSide = (gesture: PanResponderGestureState) => {
    return (
      this.state.bottomPosition.y._offset + gesture.dy <= this.props.COMPONENT_HEIGHT - this.state.BOTTOM_LIMIT &&
      this.state.topPosition.y._offset + this.props.BORDER_WIDTH + 1 < this.state.bottomPosition.y._offset + gesture.dy
    );
  };
  isAllowedToMoveRightSide = (gesture: PanResponderGestureState) => {
    return (
      this.state.rightPosition.x._offset + gesture.dx <= this.props.COMPONENT_WIDTH - this.state.RIGHT_LIMIT &&
      this.state.leftPosition.x._offset + this.props.BORDER_WIDTH + 1 < this.state.rightPosition.x._offset + gesture.dx
    );
  };

  isAllowedToMove = (position: Position, gesture: PanResponderGestureState) => {
    if (position === 'topPosition') {
      return this.isAllowedToMoveTopSide(gesture);
    }
    if (position === 'leftPosition') {
      return this.isAllowedToMoveLeftSide(gesture);
    }
    if (position === 'bottomPosition') {
      return this.isAllowedToMoveBottomSide(gesture);
    }
    if (position === 'rightPosition') {
      return this.isAllowedToMoveRightSide(gesture);
    }
  };

  initSidePanResponder = (position: Position) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !this.isRectangleMoving,
      onPanResponderMove: (_event, gesture) => {
        if (this.isAllowedToMove(position, gesture)) {
          this.state[position].setValue({ x: gesture.dx, y: gesture.dy });
        }
      },
      onPanResponderRelease: () => {
        // make to not reset position
        this.state.topPosition.flattenOffset();
        this.state.leftPosition.flattenOffset();
        this.state.bottomPosition.flattenOffset();
        this.state.rightPosition.flattenOffset();
      },
      onPanResponderGrant: () => {
        this.state.topPosition.setOffset({
          x: this.state.topPosition.x._value,
          y: this.state.topPosition.y._value,
        });
        this.state.leftPosition.setOffset({
          x: this.state.leftPosition.x._value,
          y: this.state.leftPosition.y._value,
        });
        this.state.bottomPosition.setOffset({
          x: this.state.bottomPosition.x._value,
          y: this.state.bottomPosition.y._value,
        });
        this.state.rightPosition.setOffset({
          x: this.state.rightPosition.x._value,
          y: this.state.rightPosition.y._value,
        });

        this.state.topPosition.setValue({ x: 0, y: 0 });
        this.state.leftPosition.setValue({ x: 0, y: 0 });
        this.state.bottomPosition.setValue({ x: 0, y: 0 });
        this.state.rightPosition.setValue({ x: 0, y: 0 });
      },
    });
  };

  initRectanglePanResponder = () => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !this.isRectangleMoving,
      onPanResponderMove: (_event, gesture) => {
        this.state.topPosition.setValue({ x: gesture.dx, y: gesture.dy });
        this.state.leftPosition.setValue({ x: gesture.dx, y: gesture.dy });
        this.state.bottomPosition.setValue({ x: gesture.dx, y: gesture.dy });
        this.state.rightPosition.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: () => {
        this.isRectangleMoving = true;
        // make to not reset position
        this.state.topPosition.flattenOffset();
        this.state.leftPosition.flattenOffset();
        this.state.bottomPosition.flattenOffset();
        this.state.rightPosition.flattenOffset();

        const width = this.state.rightPosition.x._value - this.state.leftPosition.x._value - this.props.BORDER_WIDTH;
        const height = this.state.bottomPosition.y._value - this.state.topPosition.y._value - this.props.BORDER_WIDTH;
        let isOutside = false;

        if (this.state.leftPosition.x._value < this.state.LEFT_LIMIT - this.props.BORDER_WIDTH) {
          isOutside = true;
          Animated.parallel([
            Animated.spring(this.state.leftPosition.x, { toValue: this.state.LEFT_LIMIT - this.props.BORDER_WIDTH, useNativeDriver: false }),
            Animated.spring(this.state.rightPosition.x, { toValue: this.state.LEFT_LIMIT + width, useNativeDriver: false }),
          ]).start(() => {
            this.isRectangleMoving = false;
          });
        }
        if (this.state.topPosition.y._value < this.state.TOP_LIMIT - this.props.BORDER_WIDTH) {
          isOutside = true;
          Animated.parallel([
            Animated.spring(this.state.topPosition.y, { toValue: this.state.TOP_LIMIT - this.props.BORDER_WIDTH, useNativeDriver: false }),
            Animated.spring(this.state.bottomPosition.y, { toValue: this.state.TOP_LIMIT + height, useNativeDriver: false }),
          ]).start(() => {
            this.isRectangleMoving = false;
          });
        }
        if (width + this.state.leftPosition.x._value + this.props.BORDER_WIDTH > this.props.COMPONENT_WIDTH - this.state.RIGHT_LIMIT) {
          isOutside = true;
          Animated.parallel([
            Animated.spring(this.state.leftPosition.x, {
              toValue: this.props.COMPONENT_WIDTH - this.state.RIGHT_LIMIT - width - this.props.BORDER_WIDTH,
              useNativeDriver: false,
            }),
            Animated.spring(this.state.rightPosition.x, { toValue: this.props.COMPONENT_WIDTH - this.state.RIGHT_LIMIT, useNativeDriver: false }),
          ]).start(() => {
            this.isRectangleMoving = false;
          });
        }
        if (height + this.state.topPosition.y._value + this.props.BORDER_WIDTH > this.props.COMPONENT_HEIGHT - this.state.BOTTOM_LIMIT) {
          isOutside = true;
          Animated.parallel([
            Animated.spring(this.state.topPosition.y, {
              toValue: this.props.COMPONENT_HEIGHT - this.state.BOTTOM_LIMIT - height - this.props.BORDER_WIDTH,
              useNativeDriver: false,
            }),
            Animated.spring(this.state.bottomPosition.y, { toValue: this.props.COMPONENT_HEIGHT - this.state.BOTTOM_LIMIT, useNativeDriver: false }),
          ]).start(() => {
            this.isRectangleMoving = false;
          });
        }
        if (!isOutside) {
          this.isRectangleMoving = false;
        }
      },
      onPanResponderGrant: () => {
        this.state.topPosition.setOffset({
          x: this.state.topPosition.x._value,
          y: this.state.topPosition.y._value,
        });
        this.state.leftPosition.setOffset({
          x: this.state.leftPosition.x._value,
          y: this.state.leftPosition.y._value,
        });
        this.state.bottomPosition.setOffset({
          x: this.state.bottomPosition.x._value,
          y: this.state.bottomPosition.y._value,
        });
        this.state.rightPosition.setOffset({
          x: this.state.rightPosition.x._value,
          y: this.state.rightPosition.y._value,
        });
        this.state.topPosition.setValue({ x: 0, y: 0 });
        this.state.leftPosition.setValue({ x: 0, y: 0 });
        this.state.bottomPosition.setValue({ x: 0, y: 0 });
        this.state.rightPosition.setValue({ x: 0, y: 0 });
      },
    });
  };

  initCornerPanResponder = (pos1: Position, pos2: Position) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !this.isRectangleMoving,
      onPanResponderMove: (_event, gesture) => {
        if (this.isAllowedToMove(pos1, gesture)) {
          this.state[pos1].setValue({ x: gesture.dx, y: gesture.dy });
        }
        if (this.isAllowedToMove(pos2, gesture)) {
          this.state[pos2].setValue({ x: gesture.dx, y: gesture.dy });
        }
      },
      onPanResponderRelease: () => {
        this.state.topPosition.flattenOffset();
        this.state.leftPosition.flattenOffset();
        this.state.bottomPosition.flattenOffset();
        this.state.rightPosition.flattenOffset();
      },
      onPanResponderGrant: () => {
        this.state.topPosition.setOffset({ x: this.state.topPosition.x._value, y: this.state.topPosition.y._value });
        this.state.leftPosition.setOffset({ x: this.state.leftPosition.x._value, y: this.state.leftPosition.y._value });
        this.state.bottomPosition.setOffset({ x: this.state.bottomPosition.x._value, y: this.state.bottomPosition.y._value });
        this.state.rightPosition.setOffset({ x: this.state.rightPosition.x._value, y: this.state.rightPosition.y._value });

        this.state.topPosition.setValue({ x: 0, y: 0 });
        this.state.leftPosition.setValue({ x: 0, y: 0 });
        this.state.bottomPosition.setValue({ x: 0, y: 0 });
        this.state.rightPosition.setValue({ x: 0, y: 0 });
      },
    });
  };

  setCropBoxLimits = ({
    TOP_LIMIT,
    LEFT_LIMIT,
    BOTTOM_LIMIT,
    RIGHT_LIMIT,
  }: {
    TOP_LIMIT: number;
    LEFT_LIMIT: number;
    BOTTOM_LIMIT: number;
    RIGHT_LIMIT: number;
  }) => {
    this.setState({
      TOP_LIMIT,
      LEFT_LIMIT,
      BOTTOM_LIMIT,
      RIGHT_LIMIT,
    });
  };

  setCropBoxValues = ({
    TOP_VALUE,
    LEFT_VALUE,
    BOTTOM_VALUE,
    RIGHT_VALUE,
  }: {
    TOP_VALUE: number;
    LEFT_VALUE: number;
    BOTTOM_VALUE: number;
    RIGHT_VALUE: number;
  }) => {
    this.setState({
      TOP_VALUE,
      LEFT_VALUE,
      BOTTOM_VALUE,
      RIGHT_VALUE,
    });
  };

  setCropBoxRotation = (rotation: number) => {
    this.setState({ rotation });
  };

  rotate90 = () => {
    this.setCropBoxRotation((360 + (this.state.rotation - 90)) % 360);
  };

  onRotate = () => {
    const W_INT = this.W - 2 * this.props.BORDER_WIDTH;
    const H_INT = this.H - 2 * this.props.BORDER_WIDTH;
    let imageWidth = 0;
    let imageHeight = 0;
    let rotation = 0;
    if (this.state.rotation % 180 === 90) {
      imageWidth = this.props.imageWidth > 0 ? this.props.imageWidth : 1280; // 340
      imageHeight = this.props.imageHeight > 0 ? this.props.imageHeight : 747; // 500
      rotation = 0;
    } else {
      imageWidth = this.props.COMPONENT_WIDTH - this.state.LEFT_LIMIT - this.state.RIGHT_LIMIT;
      imageHeight = this.props.COMPONENT_HEIGHT - this.state.TOP_LIMIT - this.state.BOTTOM_LIMIT;
      rotation = 90;
    }
    const { TOP_LIMIT, LEFT_LIMIT, BOTTOM_LIMIT, RIGHT_LIMIT, DIFF } = getCropperLimits(
      imageWidth,
      imageHeight,
      rotation,
      W_INT,
      H_INT,
      this.W,
      this.H,
      this.props.BORDER_WIDTH,
      Q,
    );
    this.rotate90();
    this.setCropBoxLimits({ TOP_LIMIT, LEFT_LIMIT, BOTTOM_LIMIT, RIGHT_LIMIT });
    const startPositionBeforeRotationX = this.state.leftPosition.x._value - this.state.LEFT_LIMIT + this.props.BORDER_WIDTH;
    const startPositionBeforeRotationY = this.state.topPosition.y._value - this.state.TOP_LIMIT + this.props.BORDER_WIDTH;
    const imageWidthBeforeRotation = this.props.COMPONENT_WIDTH - this.state.RIGHT_LIMIT - this.state.LEFT_LIMIT;
    const imageHeightBeforeRotation = this.props.COMPONENT_HEIGHT - this.state.BOTTOM_LIMIT - this.state.TOP_LIMIT;
    const rectangleWidthBeforeRotation = this.state.rightPosition.x._value - this.state.leftPosition.x._value - this.props.BORDER_WIDTH;
    const rectangleHeightBeforeRotation = this.state.bottomPosition.y._value - this.state.topPosition.y._value - this.props.BORDER_WIDTH;
    const imageWidthAfterRotation = this.props.COMPONENT_WIDTH - RIGHT_LIMIT - LEFT_LIMIT;
    const imageHeightAfterRotation = this.props.COMPONENT_HEIGHT - BOTTOM_LIMIT - TOP_LIMIT;
    const rectangleWidthAfterRotation = (imageWidthAfterRotation * rectangleHeightBeforeRotation) / imageHeightBeforeRotation;
    const rectangleHeightAfterRotation = (imageHeightAfterRotation * rectangleWidthBeforeRotation) / imageWidthBeforeRotation;
    const startPositionAfterRotationX = (startPositionBeforeRotationY * imageWidthAfterRotation) / imageHeightBeforeRotation;
    const startPositionAfterRotationY =
      ((imageWidthBeforeRotation - startPositionBeforeRotationX - rectangleWidthBeforeRotation) * imageHeightAfterRotation) /
      imageWidthBeforeRotation;

    this.state.topPosition.setValue({
      x: LEFT_LIMIT + startPositionAfterRotationX - this.props.BORDER_WIDTH,
      y: TOP_LIMIT + startPositionAfterRotationY - this.props.BORDER_WIDTH,
    });
    this.state.leftPosition.setValue({
      x: LEFT_LIMIT + startPositionAfterRotationX - this.props.BORDER_WIDTH,
      y: TOP_LIMIT + startPositionAfterRotationY - this.props.BORDER_WIDTH,
    });
    this.state.bottomPosition.setValue({
      x: LEFT_LIMIT + startPositionAfterRotationX - this.props.BORDER_WIDTH,
      y: TOP_LIMIT + startPositionAfterRotationY + rectangleHeightAfterRotation,
    });
    this.state.rightPosition.setValue({
      x: LEFT_LIMIT + startPositionAfterRotationX + rectangleWidthAfterRotation,
      y: TOP_LIMIT + startPositionAfterRotationY - this.props.BORDER_WIDTH - DIFF / 2,
    });
    // @ts-ignore
    this.topOuter.setNativeProps({ style: { top: TOP_LIMIT, height: 0 } });
    // @ts-ignore
    this.leftOuter.setNativeProps({ style: { left: LEFT_LIMIT, width: 0 } });
    // @ts-ignore
    this.bottomOuter.setNativeProps({ style: { top: BOTTOM_LIMIT, height: 0 } });
    // @ts-ignore
    this.rightOuter.setNativeProps({ style: { top: TOP_LIMIT, height: 0 } });
  };

  cropImage = (uri: string, cropData: ImageCropData, garbageUris: string[]) =>
    ImageEditor.cropImage(uri, cropData)
      .then(croppedUri => {
        this.props.onDone(croppedUri, garbageUris);
      })
      .catch((err: Error) => {
        this.props.onError(err);
      });

  onDone = () => {
    if (this.isRectangleMoving) {
      return null;
    }

    const IMAGE_W = this.props.COMPONENT_WIDTH - this.state.RIGHT_LIMIT - this.state.LEFT_LIMIT;
    const IMAGE_H = this.props.COMPONENT_HEIGHT - this.state.BOTTOM_LIMIT - this.state.TOP_LIMIT;
    let x = this.state.leftPosition.x._value - this.state.LEFT_LIMIT + this.props.BORDER_WIDTH;
    let y = this.state.topPosition.y._value - this.state.TOP_LIMIT + this.props.BORDER_WIDTH;
    let width = this.state.rightPosition.x._value - this.state.leftPosition.x._value - this.props.BORDER_WIDTH;
    let height = this.state.bottomPosition.y._value - this.state.topPosition.y._value - this.props.BORDER_WIDTH;
    let imageWidth = this.props.imageWidth > 0 ? this.props.imageWidth : 1280; // 340
    let imageHeight = this.props.imageHeight > 0 ? this.props.imageHeight : 747; // 500
    if (this.state.rotation % 180 === 90) {
      const pivot = imageWidth;
      imageWidth = imageHeight;
      imageHeight = pivot;
    }
    width = (width * imageWidth) / IMAGE_W;
    height = (height * imageHeight) / IMAGE_H;
    x = (x * imageWidth) / IMAGE_W;
    y = (y * imageHeight) / IMAGE_H;
    const cropData = {
      offset: { x, y },
      size: { width, height },
      resizeMode: 'stretch',
    } as ImageCropData;
    // we need to use this function because otherwise the crop may not work properly (see https://github.com/callstack/react-native-image-editor/issues/54)
    createResizedImage(this.props.imageUri, imageWidth, imageHeight, 'JPEG', 100, Platform.OS === 'ios' ? 0 : this.state.rotation, undefined, false, {
      mode: 'cover',
      onlyScaleDown: true,
    })
      .then(res => {
        // on iOS we need to rotate the image using ImageRotate because the createResizedImage method is buggy
        if (Platform.OS === 'ios' && this.state.rotation !== 0) {
          ImageRotate.rotateImage(
            res.uri,
            this.state.rotation,
            (uri: string) => this.cropImage(uri, cropData, [res.uri, uri]),
            (err: Error) => this.props.onError(err),
          );
        } else {
          this.cropImage(res.uri, cropData, [res.uri]);
        }
      })
      .catch((err: Error) => {
        this.props.onError(err);
      });
  };

  render() {
    return (
      <Cropper
        imageUri={this.props.imageUri} // 'https://3.imimg.com/data3/SN/NO/MY-10244508/vertical-building-parking-500x500.jpg'
        footerComponent={this.props.footerComponent}
        getTopOuterStyle={this.getTopOuterStyle}
        getLeftOuterStyle={this.getLeftOuterStyle}
        getBottomOuterStyle={this.getBottomOuterStyle}
        getRightOuterStyle={this.getRightOuterStyle}
        getTopLeftStyle={this.getTopLeftStyle}
        getBottomLeftStyle={this.getBottomLeftStyle}
        getBottomRightStyle={this.getBottomRightStyle}
        getTopRightStyle={this.getTopRightStyle}
        getTopSideStyle={this.getTopSideStyle}
        getLeftSideStyle={this.getLeftSideStyle}
        getBottomSideStyle={this.getBottomSideStyle}
        getRightSideStyle={this.getRightSideStyle}
        getRectangleStyle={this.getRectangleStyle}
        getImageStyle={this.getImageStyle}
        onDone={this.onDone}
        onRotate={this.onRotate}
        onCancel={this.onCancel}
        topOuterPanResponder={this.state.topOuterPanResponder}
        leftOuterPanResponder={this.state.leftOuterPanResponder}
        bottomOuterPanResponder={this.state.bottomOuterPanResponder}
        rightOuterPanResponder={this.state.rightOuterPanResponder}
        topPanResponder={this.state.topPanResponder}
        leftPanResponder={this.state.leftPanResponder}
        bottomPanResponder={this.state.bottomPanResponder}
        rightPanResponder={this.state.rightPanResponder}
        topLeftPanResponder={this.state.topLeftPanResponder}
        bottomLeftPanResponder={this.state.bottomLeftPanResponder}
        bottomRightPanResponder={this.state.bottomRightPanResponder}
        topRightPanResponder={this.state.topRightPanResponder}
        rectanglePanResponder={this.state.rectanglePanResponder}
        topOuterRef={ref => (this.topOuter = ref)}
        leftOuterRef={ref => (this.leftOuter = ref)}
        bottomOuterRef={ref => (this.bottomOuter = ref)}
        rightOuterRef={ref => (this.rightOuter = ref)}
        COMPONENT_WIDTH={this.props.COMPONENT_WIDTH}
        COMPONENT_HEIGHT={this.props.COMPONENT_HEIGHT}
        W={this.W}
        H={this.H}
      />
    );
  }
}

export default CropperPage;

import React, { Component } from 'react';
import { ImageEditor, Animated, PanResponder } from 'react-native';
import RNImageRotate from 'react-native-image-rotate';
import PropTypes from 'prop-types';
import { SCREEN_WIDTH, SCREEN_HEIGHT, W, H, Q, W_INT, H_INT, BW } from '../components/Cropper/Cropper.constants';
import Cropper from '../components/Cropper/Cropper.component';
import { getCropperLimits } from '../utils';

class CropperPage extends Component {
  constructor(props) {
    super(props);
    const { imageWidth, imageHeight } = props;
    const {
      TOP_LIMIT,
      LEFT_LIMIT,
      BOTTOM_LIMIT,
      RIGHT_LIMIT,
      DIFF
    } = getCropperLimits(imageWidth, imageHeight, props.initialRotation, W_INT, H_INT, W, H, BW, Q);

    const TOP_VALUE = props.TOP_VALUE !== 0 ? props.TOP_VALUE : TOP_LIMIT;
    const LEFT_VALUE = props.LEFT_VALUE !== 0 ? props.LEFT_VALUE : LEFT_LIMIT;
    const BOTTOM_VALUE = props.BOTTOM_VALUE !== 0 ? props.BOTTOM_VALUE : BOTTOM_LIMIT;
    const RIGHT_VALUE = props.RIGHT_VALUE !== 0 ? props.RIGHT_VALUE : RIGHT_LIMIT;

    const topOuterPosition = new Animated.ValueXY({ x: LEFT_VALUE - BW, y: TOP_VALUE - BW });
    const topOuterPanResponder = new PanResponder.create({ onStartShouldSetPanResponder: () => false });
    const leftOuterPosition = new Animated.ValueXY({ x: LEFT_VALUE - BW, y: TOP_VALUE - BW });
    const leftOuterPanResponder = new PanResponder.create({ onStartShouldSetPanResponder: () => false });
    const bottomOuterPosition = new Animated.ValueXY({ x: LEFT_VALUE - BW, y: SCREEN_HEIGHT - BOTTOM_VALUE });
    const bottomOuterPanResponder = new PanResponder.create({ onStartShouldSetPanResponder: () => false });
    const rightOuterPosition = new Animated.ValueXY({ x: SCREEN_WIDTH - RIGHT_VALUE, y: TOP_VALUE - BW });
    const rightOuterPanResponder = new PanResponder.create({ onStartShouldSetPanResponder: () => false });

    const topPosition = new Animated.ValueXY({ x: LEFT_VALUE - BW, y: TOP_VALUE - BW });
    const topPanResponder = this.initSidePanResponder('topPosition');
    const leftPosition = new Animated.ValueXY({ x: LEFT_VALUE - BW, y: TOP_VALUE - BW });
    const leftPanResponder = this.initSidePanResponder('leftPosition');
    const bottomPosition = new Animated.ValueXY({ x: LEFT_VALUE - BW, y: SCREEN_HEIGHT - BOTTOM_VALUE });
    const bottomPanResponder = this.initSidePanResponder('bottomPosition');
    const rightPosition = new Animated.ValueXY({ x: SCREEN_WIDTH - RIGHT_VALUE, y: TOP_VALUE - BW - (DIFF / 2) });
    const rightPanResponder = this.initSidePanResponder('rightPosition');

    const topLeftPosition = new Animated.ValueXY({ x: LEFT_VALUE - BW, y: TOP_VALUE - BW });
    const topLeftPanResponder = this.initCornerPanResponder('topPosition', 'leftPosition');
    const bottomLeftPosition = new Animated.ValueXY({ x: LEFT_VALUE - BW, y: SCREEN_HEIGHT - BOTTOM_VALUE });
    const bottomLeftPanResponder = this.initCornerPanResponder('bottomPosition', 'leftPosition');
    const bottomRightPosition = new Animated.ValueXY({ x: SCREEN_WIDTH - RIGHT_VALUE, y: SCREEN_HEIGHT - BOTTOM_VALUE });
    const bottomRightPanResponder = this.initCornerPanResponder('bottomPosition', 'rightPosition');
    const topRightPosition = new Animated.ValueXY({ x: SCREEN_WIDTH - RIGHT_VALUE, y: TOP_VALUE - BW });
    const topRightPanResponder = this.initCornerPanResponder('topPosition', 'rightPosition');

    const rectanglePosition = new Animated.ValueXY({ x: LEFT_VALUE, y: TOP_VALUE });
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
    this.isRectangleMoving = false;
  }

  onCancel = () => { this.props.onCancel(); }

  getTopOuterStyle = () => {
    return {
      ...this.state.topOuterPosition.getLayout(),
      top: this.state.TOP_LIMIT,
      left: this.state.LEFT_LIMIT,
      height: Animated.add(BW - this.state.TOP_LIMIT, this.state.topPosition.y),
      width: W,
      backgroundColor: `rgba(0, 0, 0, ${this.props.NOT_SELECTED_AREA_OPACITY})`,
    };
  }

  getLeftOuterStyle = () => {
    return {
      ...this.state.leftOuterPosition.getLayout(),
      top: Animated.add(BW, this.state.topPosition.y),
      left: this.state.LEFT_LIMIT,
      height: Animated.add(
        -BW,
        Animated.add(
          this.state.bottomPosition.y,
          Animated.multiply(-1, this.state.topPosition.y)
        )
      ),
      width: Animated.add(BW - this.state.LEFT_LIMIT, this.state.leftPosition.x),
      backgroundColor: `rgba(0, 0, 0, ${this.props.NOT_SELECTED_AREA_OPACITY})`,
    };
  }

  getBottomOuterStyle = () => {
    return {
      ...this.state.bottomOuterPosition.getLayout(),
      top: this.state.bottomPosition.y,
      left: this.state.LEFT_LIMIT,
      height: Animated.add(
        SCREEN_HEIGHT - this.state.BOTTOM_LIMIT,
        Animated.multiply(-1, this.state.bottomPosition.y)
      ),
      width: W,
      backgroundColor: `rgba(0, 0, 0, ${this.props.NOT_SELECTED_AREA_OPACITY})`,
    };
  }

  getRightOuterStyle = () => {
    return {
      ...this.state.rightOuterPosition.getLayout(),
      top: Animated.add(BW, this.state.topPosition.y),
      left: this.state.rightPosition.x,
      height: Animated.add(
        -BW,
        Animated.add(
          this.state.bottomPosition.y,
          Animated.multiply(-1, this.state.topPosition.y)
        )
      ),
      right: this.state.RIGHT_LIMIT,
      backgroundColor: `rgba(0, 0, 0, ${this.props.NOT_SELECTED_AREA_OPACITY})`,
    };
  }

  getTopLeftStyle = () => {
    return {
      ...this.state.topLeftPosition.getLayout(),
      top: this.state.topPosition.y,
      left: this.state.leftPosition.x,
      width: BW,
      paddingBottom: BW,
    };
  }

  getBottomLeftStyle = () => {
    return {
      ...this.state.bottomLeftPosition.getLayout(),
      top: this.state.bottomPosition.y,
      left: this.state.leftPosition.x,
      width: BW,
      paddingTop: BW,
    };
  }

  getBottomRightStyle = () => {
    return {
      ...this.state.bottomRightPosition.getLayout(),
      top: this.state.bottomPosition.y,
      left: this.state.rightPosition.x,
      height: BW,
      paddingLeft: BW,
    };
  }

  getTopRightStyle = () => {
    return {
      ...this.state.topRightPosition.getLayout(),
      top: this.state.topPosition.y,
      left: this.state.rightPosition.x,
      height: BW,
      paddingLeft: BW,
    };
  }

  getTopSideStyle = () => {
    return {
      ...this.state.topPosition.getLayout(),
      left: Animated.add(BW, this.state.leftPosition.x),
      width: Animated.add(
        -BW,
        Animated.add(
          this.state.rightPosition.x,
          Animated.multiply(-1, this.state.leftPosition.x)
        )
      ),
      paddingBottom: BW,
    };
  }

  getLeftSideStyle = () => {
    return {
      ...this.state.leftPosition.getLayout(),
      top: Animated.add(BW, this.state.topPosition.y),
      height: Animated.add(
        -BW,
        Animated.add(
          this.state.bottomPosition.y,
          Animated.multiply(-1, this.state.topPosition.y)
        ),
      ),
      paddingLeft: BW,
    };
  }

  getBottomSideStyle = () => {
    return {
      ...this.state.bottomPosition.getLayout(),
      left: Animated.add(BW, this.state.leftPosition.x),
      width: Animated.add(
        -BW,
        Animated.add(
          this.state.rightPosition.x,
          Animated.multiply(-1, this.state.leftPosition.x)
        )
      ),
      paddingTop: BW,
    };
  }

  getRightSideStyle = () => {
    return {
      ...this.state.rightPosition.getLayout(),
      top: Animated.add(BW, this.state.topPosition.y),
      height: Animated.add(
        -BW,
        Animated.add(
          this.state.bottomPosition.y,
          Animated.multiply(-1, this.state.topPosition.y)
        )
      ),
      paddingLeft: BW,
    };
  }

  getRectangleStyle = () => {
    return {
      ...this.state.rectanglePosition.getLayout(),
      top: Animated.add(BW, this.state.topPosition.y),
      left: Animated.add(BW, this.state.leftPosition.x),
      width: Animated.add(
        -BW,
        Animated.add(
          this.state.rightPosition.x,
          Animated.multiply(-1, this.state.leftPosition.x)
        )
      ),
      height: Animated.add(
        -BW,
        Animated.add(
          this.state.bottomPosition.y,
          Animated.multiply(-1, this.state.topPosition.y)
        )
      ),
      zIndex: 3
    };
  }

  getImageStyle = () => {
    const DIFF = this.state.topPosition.y._value - this.state.rightPosition.y._value;
    return {
      position: 'absolute',
      top: this.state.TOP_LIMIT - DIFF,
      left: this.state.LEFT_LIMIT + DIFF,
      bottom: this.state.BOTTOM_LIMIT - DIFF,
      right: this.state.RIGHT_LIMIT + DIFF,
      resizeMode: 'stretch',
      transform: [
        { rotate: `${this.state.rotation.toString()}deg` },
      ],
    };
  }

  isAllowedToMoveTopSide = (gesture) => {
    return this.state.topPosition.y._offset + gesture.dy >= this.state.TOP_LIMIT - BW &&
      this.state.topPosition.y._offset + gesture.dy + BW + 1 < this.state.bottomPosition.y._offset;
  }
  isAllowedToMoveLeftSide = (gesture) => {
    return this.state.leftPosition.x._offset + gesture.dx >= this.state.LEFT_LIMIT - BW &&
      this.state.leftPosition.x._offset + gesture.dx + BW + 1 < this.state.rightPosition.x._offset;
  }
  isAllowedToMoveBottomSide = (gesture) => {
    return this.state.bottomPosition.y._offset + gesture.dy <= SCREEN_HEIGHT - this.state.BOTTOM_LIMIT &&
        this.state.topPosition.y._offset + BW + 1 < this.state.bottomPosition.y._offset + gesture.dy;
  }
  isAllowedToMoveRightSide = (gesture) => {
    return this.state.rightPosition.x._offset + gesture.dx <= SCREEN_WIDTH - this.state.RIGHT_LIMIT &&
        this.state.leftPosition.x._offset + BW + 1 < this.state.rightPosition.x._offset + gesture.dx;
  }

  isAllowedToMove = (position, gesture) => {
    if (position === 'topPosition') { return this.isAllowedToMoveTopSide(gesture); }
    if (position === 'leftPosition') { return this.isAllowedToMoveLeftSide(gesture); }
    if (position === 'bottomPosition') { return this.isAllowedToMoveBottomSide(gesture); }
    if (position === 'rightPosition') { return this.isAllowedToMoveRightSide(gesture); }
  }

  initSidePanResponder = (position) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !this.isRectangleMoving,
      onPanResponderMove: (event, gesture) => {
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
          y: this.state.topPosition.y._value
        });
        this.state.leftPosition.setOffset({
          x: this.state.leftPosition.x._value,
          y: this.state.leftPosition.y._value
        });
        this.state.bottomPosition.setOffset({
          x: this.state.bottomPosition.x._value,
          y: this.state.bottomPosition.y._value
        });
        this.state.rightPosition.setOffset({
          x: this.state.rightPosition.x._value,
          y: this.state.rightPosition.y._value
        });

        this.state.topPosition.setValue({ x: 0, y: 0 });
        this.state.leftPosition.setValue({ x: 0, y: 0 });
        this.state.bottomPosition.setValue({ x: 0, y: 0 });
        this.state.rightPosition.setValue({ x: 0, y: 0 });
      }
    });
  }

  initRectanglePanResponder = () => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !this.isRectangleMoving,
      onPanResponderMove: (event, gesture) => {
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

        const width = this.state.rightPosition.x._value - this.state.leftPosition.x._value - BW;
        const height = this.state.bottomPosition.y._value - this.state.topPosition.y._value - BW;
        let isOutside = false;

        if (this.state.leftPosition.x._value < this.state.LEFT_LIMIT - BW) {
          isOutside = true;
          Animated.parallel([
            Animated.spring(this.state.leftPosition.x, { toValue: this.state.LEFT_LIMIT - BW }),
            Animated.spring(this.state.rightPosition.x, { toValue: this.state.LEFT_LIMIT + width })
          ]).start(
            () => { this.isRectangleMoving = false; }
          );
        }
        if (this.state.topPosition.y._value < this.state.TOP_LIMIT - BW) {
          isOutside = true;
          Animated.parallel([
            Animated.spring(this.state.topPosition.y, { toValue: this.state.TOP_LIMIT - BW }),
            Animated.spring(this.state.bottomPosition.y, { toValue: this.state.TOP_LIMIT + height })
          ]).start(
            () => { this.isRectangleMoving = false; }
          );
        }
        if (width + this.state.leftPosition.x._value + BW > SCREEN_WIDTH - this.state.RIGHT_LIMIT) {
          isOutside = true;
          Animated.parallel([
            Animated.spring(this.state.leftPosition.x, { toValue: SCREEN_WIDTH - this.state.RIGHT_LIMIT - width - BW }),
            Animated.spring(this.state.rightPosition.x, { toValue: SCREEN_WIDTH - this.state.RIGHT_LIMIT })
          ]).start(
            () => { this.isRectangleMoving = false; }
          );
        }
        if (height + this.state.topPosition.y._value + BW > SCREEN_HEIGHT - this.state.BOTTOM_LIMIT) {
          isOutside = true;
          Animated.parallel([
            Animated.spring(this.state.topPosition.y, { toValue: SCREEN_HEIGHT - this.state.BOTTOM_LIMIT - height - BW }),
            Animated.spring(this.state.bottomPosition.y, { toValue: SCREEN_HEIGHT - this.state.BOTTOM_LIMIT })
          ]).start(
            () => { this.isRectangleMoving = false; }
          );
        }
        if (!isOutside) {
          this.isRectangleMoving = false;
        }
      },
      onPanResponderGrant: () => {
        this.state.topPosition.setOffset({
          x: this.state.topPosition.x._value,
          y: this.state.topPosition.y._value
        });
        this.state.leftPosition.setOffset({
          x: this.state.leftPosition.x._value,
          y: this.state.leftPosition.y._value
        });
        this.state.bottomPosition.setOffset({
          x: this.state.bottomPosition.x._value,
          y: this.state.bottomPosition.y._value
        });
        this.state.rightPosition.setOffset({
          x: this.state.rightPosition.x._value,
          y: this.state.rightPosition.y._value
        });
        this.state.topPosition.setValue({ x: 0, y: 0 });
        this.state.leftPosition.setValue({ x: 0, y: 0 });
        this.state.bottomPosition.setValue({ x: 0, y: 0 });
        this.state.rightPosition.setValue({ x: 0, y: 0 });
      }
    });
  }

  initCornerPanResponder = (pos1, pos2) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !this.isRectangleMoving,
      onPanResponderMove: (event, gesture) => {
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
      }
    });
  }

  setCropBoxLimits = ({ TOP_LIMIT, LEFT_LIMIT, BOTTOM_LIMIT, RIGHT_LIMIT }) => {
    this.setState({
      TOP_LIMIT,
      LEFT_LIMIT,
      BOTTOM_LIMIT,
      RIGHT_LIMIT
    });
  }

  setCropBoxValues = ({ TOP_VALUE, LEFT_VALUE, BOTTOM_VALUE, RIGHT_VALUE }) => {
    this.setState({
      TOP_VALUE,
      LEFT_VALUE,
      BOTTOM_VALUE,
      RIGHT_VALUE
    });
  }

  setCropBoxRotation = (rotation) => {
    this.setState({ rotation });
  }

  rotate90 = () => {
    this.setCropBoxRotation((360 + (this.state.rotation - 90)) % 360);
  }

  onRotate = () => {
    let imageWidth = 0;
    let imageHeight = 0;
    let rotation = 0;
    if (this.state.rotation % 180 === 90) {
      imageWidth = this.props.imageWidth > 0 ? this.props.imageWidth : 1280; // 340
      imageHeight = this.props.imageHeight > 0 ? this.props.imageHeight : 747; // 500
      rotation = 0;
    } else {
      imageWidth = SCREEN_WIDTH - this.state.LEFT_LIMIT - this.state.RIGHT_LIMIT;
      imageHeight = SCREEN_HEIGHT - this.state.TOP_LIMIT - this.state.BOTTOM_LIMIT;
      rotation = 90;
    }
    const {
      TOP_LIMIT,
      LEFT_LIMIT,
      BOTTOM_LIMIT,
      RIGHT_LIMIT,
      DIFF
    } = getCropperLimits(imageWidth, imageHeight, rotation, W_INT, H_INT, W, H, BW, Q);
    this.rotate90();
    this.setCropBoxLimits({ TOP_LIMIT, LEFT_LIMIT, BOTTOM_LIMIT, RIGHT_LIMIT });
    const startPositionBeforeRotationX = (this.state.leftPosition.x._value - this.state.LEFT_LIMIT) + BW;
    const startPositionBeforeRotationY = (this.state.topPosition.y._value - this.state.TOP_LIMIT) + BW;
    const imageWidthBeforeRotation = SCREEN_WIDTH - this.state.RIGHT_LIMIT - this.state.LEFT_LIMIT;
    const imageHeightBeforeRotation = SCREEN_HEIGHT - this.state.BOTTOM_LIMIT - this.state.TOP_LIMIT;
    const rectangleWidthBeforeRotation = this.state.rightPosition.x._value - this.state.leftPosition.x._value - BW;
    const rectangleHeightBeforeRotation = this.state.bottomPosition.y._value - this.state.topPosition.y._value - BW;
    const imageWidthAfterRotation = SCREEN_WIDTH - RIGHT_LIMIT - LEFT_LIMIT;
    const imageHeightAfterRotation = SCREEN_HEIGHT - BOTTOM_LIMIT - TOP_LIMIT;
    const rectangleWidthAfterRotation = (imageWidthAfterRotation * rectangleHeightBeforeRotation) / imageHeightBeforeRotation;
    const rectangleHeightAfterRotation = (imageHeightAfterRotation * rectangleWidthBeforeRotation) / imageWidthBeforeRotation;
    const startPositionAfterRotationX = (startPositionBeforeRotationY * imageWidthAfterRotation) / imageHeightBeforeRotation;
    const startPositionAfterRotationY = (
      (imageWidthBeforeRotation - startPositionBeforeRotationX - rectangleWidthBeforeRotation) * imageHeightAfterRotation
    ) / imageWidthBeforeRotation;

    this.state.topPosition.setValue({
      x: (LEFT_LIMIT + startPositionAfterRotationX) - BW,
      y: (TOP_LIMIT + startPositionAfterRotationY) - BW
    });
    this.state.leftPosition.setValue({
      x: (LEFT_LIMIT + startPositionAfterRotationX) - BW,
      y: (TOP_LIMIT + startPositionAfterRotationY) - BW
    });
    this.state.bottomPosition.setValue({
      x: (LEFT_LIMIT + startPositionAfterRotationX) - BW,
      y: TOP_LIMIT + startPositionAfterRotationY + rectangleHeightAfterRotation
    });
    this.state.rightPosition.setValue({
      x: LEFT_LIMIT + startPositionAfterRotationX + rectangleWidthAfterRotation,
      y: (TOP_LIMIT + startPositionAfterRotationY) - BW - (DIFF / 2)
    });
    this.topOuter.setNativeProps({ style: { top: TOP_LIMIT, height: 0 } });
    this.leftOuter.setNativeProps({ style: { left: LEFT_LIMIT, width: 0 } });
    this.bottomOuter.setNativeProps({ style: { top: BOTTOM_LIMIT, height: 0 } });
    this.rightOuter.setNativeProps({ style: { top: TOP_LIMIT, height: 0 } });
  }

  onDone = () => {
    if (this.isRectangleMoving) return null;

    //this.setState({ isSaving: true });
    const IMAGE_W = SCREEN_WIDTH - this.state.RIGHT_LIMIT - this.state.LEFT_LIMIT;
    const IMAGE_H = SCREEN_HEIGHT - this.state.BOTTOM_LIMIT - this.state.TOP_LIMIT;
    let x = (this.state.leftPosition.x._value - this.state.LEFT_LIMIT) + BW;
    let y = (this.state.topPosition.y._value - this.state.TOP_LIMIT) + BW;
    let width = this.state.rightPosition.x._value - this.state.leftPosition.x._value - BW;
    let height = this.state.bottomPosition.y._value - this.state.topPosition.y._value - BW;
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
      resizeMode: 'stretch'
    };
    RNImageRotate.rotateImage(
      this.props.imageUri,
      this.state.rotation,
      (rotatedUri) => {
        //
        ImageEditor.cropImage(
          rotatedUri,
          cropData,
          (croppedUri) => {
            this.props.onDone(croppedUri);
          },
          (err) => {
            console.log('cropping error');
            console.log(err);
          }
        );
        //
      },
      (err) => {
        alert(err);
        console.log(err);
      }
    );
  }

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
        topOuterRef={ref => { this.topOuter = ref; }}
        leftOuterRef={ref => { this.leftOuter = ref; }}
        bottomOuterRef={ref => { this.bottomOuter = ref; }}
        rightOuterRef={ref => { this.rightOuter = ref; }}
      />
    );
  }
}

CropperPage.propTypes = {
  footerComponent: PropTypes.object,
  onDone: PropTypes.func,
  onCancel: PropTypes.func,
  imageUri: PropTypes.string,
  imageWidth: PropTypes.number,
  imageHeight: PropTypes.number,
  TOP_VALUE: PropTypes.number,
  LEFT_VALUE: PropTypes.number,
  BOTTOM_VALUE: PropTypes.number,
  RIGHT_VALUE: PropTypes.number,
  initialRotation: PropTypes.number,
  NOT_SELECTED_AREA_OPACITY: PropTypes.number,
};

export default CropperPage;

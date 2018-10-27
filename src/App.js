import React, { Component } from 'react';
import { Platform } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import Cropper from './pages/Cropper.page';

class App extends Component {
  render() {
    return (
      <Cropper
        onDone={this.props.onDone}
        onCancel={this.props.onCancel}
        rotateIcon={this.props.rotateIcon}
        doneText={this.props.doneText}
        cancelText={this.props.cancelText}
        imageUri={this.props.imageUri}
        imageWidth={this.props.imageWidth}
        imageHeight={this.props.imageHeight}
        TOP_VALUE={this.props.TOP_VALUE}
        LEFT_VALUE={this.props.LEFT_VALUE}
        BOTTOM_VALUE={this.props.BOTTOM_VALUE}
        RIGHT_VALUE={this.props.RIGHT_VALUE}
        initialRotation={this.props.initialRotation}
      />
    );
  }
}

App.propTypes = {
  onDone: PropTypes.func,
  onCancel: PropTypes.func,
  rotateIcon: PropTypes.node,
  doneText: PropTypes.string,
  cancelText: PropTypes.string,
  imageUri: PropTypes.string,
  imageWidth: PropTypes.number,
  imageHeight: PropTypes.number,
  TOP_VALUE: PropTypes.number,
  LEFT_VALUE: PropTypes.number,
  BOTTOM_VALUE: PropTypes.number,
  RIGHT_VALUE: PropTypes.number,
  initialRotation: PropTypes.number,
};

const shadow = Platform.select({
  android: {
    textShadowOffset: { width: 1, height: 1 },
    textShadowColor: '#000000',
    textShadowRadius: 3,
    shadowOpacity: 0.9,
    elevation: 1
  },
  ios: {
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#000000',
    shadowRadius: 3,
    shadowOpacity: 0.9
  }
});

App.defaultProps = {
  onDone: () => {},
  onCancel: () => {},
  rotateIcon: <MaterialCommunityIcon name='format-rotate-90' style={{ color: 'white', fontSize: 26, ...shadow }} />,
  doneText: 'DONE',
  cancelText: 'CANCEL',
  imageUri: '',
  imageWidth: 0,
  imageHeight: 0,
  TOP_VALUE: 0,
  LEFT_VALUE: 0,
  BOTTOM_VALUE: 0,
  RIGHT_VALUE: 0,
  initialRotation: 0,
};

export default App;

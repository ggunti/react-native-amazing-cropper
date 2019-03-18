import React from 'react';
import PropTypes from 'prop-types';
import Cropper from './pages/Cropper.page';
import DefaultFooter from './components/Footer/DefaultFooter.component';

const App = (props) => (
  <Cropper
    footerComponent={props.footerComponent}
    onDone={props.onDone}
    onCancel={props.onCancel}
    imageUri={props.imageUri}
    imageWidth={props.imageWidth}
    imageHeight={props.imageHeight}
    TOP_VALUE={props.TOP_VALUE}
    LEFT_VALUE={props.LEFT_VALUE}
    BOTTOM_VALUE={props.BOTTOM_VALUE}
    RIGHT_VALUE={props.RIGHT_VALUE}
    initialRotation={props.initialRotation}
  />
)


App.propTypes = {
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
};

App.defaultProps = {
  footerComponent: (
    <DefaultFooter
      doneText='DONE'
      rotateText='ROTATE'
      cancelText='CANCEL'
    />
  ),
  onDone: () => {},
  onCancel: () => {},
  imageUri: '',
  imageWidth: 1280,
  imageHeight: 747,
  TOP_VALUE: 0,
  LEFT_VALUE: 0,
  BOTTOM_VALUE: 0,
  RIGHT_VALUE: 0,
  initialRotation: 0,
};

export default App;

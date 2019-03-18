import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import styles from './DefaultFooter.component.style';

const DefaultFooter = (props) => (
  <View style={styles.buttonsContainer}>
    <TouchableOpacity onPress={props.onCancel} style={styles.touchable}>
      <Text style={styles.text}>{props.cancelText}</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={props.onRotate} style={styles.touchable}>
      <Text style={styles.text}>{props.rotateText}</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={props.onDone} style={styles.touchable}>
      <Text style={styles.text}>{props.doneText}</Text>
    </TouchableOpacity>
  </View>
)

DefaultFooter.propTypes = {
  onDone: PropTypes.func,
  onRotate: PropTypes.func,
  onCancel: PropTypes.func,
  doneText: PropTypes.string,
  rotateText: PropTypes.string,
  cancelText: PropTypes.string
}

export default DefaultFooter;
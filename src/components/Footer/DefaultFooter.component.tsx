import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './DefaultFooter.component.style';

export type DefaultFooterProps = {
  onDone?: () => any;
  onRotate?: () => any;
  onCancel?: () => any;
  doneText: string;
  rotateText: string;
  cancelText: string;
};

const DefaultFooter: React.FC<DefaultFooterProps> = props => (
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
);

export default DefaultFooter;

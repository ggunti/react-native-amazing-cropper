import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

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
    
    <TouchableOpacity onPress={props.onDone} style={styles.touchable}>
      <Text style={styles.text}>{props.doneText}</Text>
    </TouchableOpacity>
  </View>
);
export { DefaultFooter };

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  touchable: {
    padding: 10,
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type DefaultFooterProps = {
  onDone?: () => any;
  onRotate?: () => any;
  onCancel?: () => any;
  isLoading?: boolean;
  doneText: string;
  rotateText: string;
  cancelText: string;
};

const DefaultFooter: React.FC<DefaultFooterProps> = props => (
  <View style={styles.buttonsContainer}>
    <TouchableOpacity disabled={props.isLoading} onPress={props.onCancel} style={styles.touchable}>
      <Text style={styles.text}>{props.cancelText}</Text>
    </TouchableOpacity>
    <TouchableOpacity disabled={props.isLoading} onPress={props.onRotate} style={styles.touchable}>
      <Text style={styles.text}>{props.rotateText}</Text>
    </TouchableOpacity>
    <TouchableOpacity disabled={props.isLoading} onPress={props.onDone} style={styles.touchable}>
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

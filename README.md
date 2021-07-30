# react-native-amazing-cropper
Image cropper for react native made with Animated API (with rotation possibility) - **for iOS & android**

<p><b>It is written in typescript!</b></p>

<img src="https://i.imgur.com/c5lqfLr.png" height="400" />&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://i.imgur.com/HNHkWQ7.png" height="400" />
<br/>
<img src="https://i.imgur.com/iyhmNav.png" height="400" />&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://i.imgur.com/5AJTFHZ.png" height="400" />
<br/>

<br/>

<img src="https://i.imgur.com/1GqvB6v.png" height="400" />&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://i.imgur.com/sz1bpT9.png" height="400" />
<br/>
<img src="https://i.imgur.com/Xf3PqJH.png" height="400" />&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://i.imgur.com/Ae4YRGS.png" height="400" />

This component depend on `react-native-image-rotate` and `@react-native-community/image-editor` libraries. They need to be installed and linked to your project before.

**STEPS TO INSTALL:** </br>
1.* `npm install --save react-native-image-rotate @react-native-community/image-editor` </br>
2. `react-native link react-native-image-rotate @react-native-community/image-editor` </br>
3.* `npm install --save react-native-amazing-cropper` </br>

Step 2 is not needed for react-native >= 0.60 because of autolinking. Instead run `pod install` inside `ios` directory.

#### Properties
-------------
| Prop  | Type | Description |
| :------------ |:---------------:| :---------------|
| onDone | `function` | A function which accepts 1 argument `croppedImageUri`. Called after user press the 'DONE' button and cropped image uri is obtained |
| onError | `function` | A function which accepts 1 argument `err` of type `Error`. Called when rotation or cropping fails |
| onCancel | `function` | A function without arguments. Called when user press the 'CANCEL' button |
| imageUri | `string` | The uri of the image you want to crop or rotate |
| imageWidth | `number` | The width (in pixels) of the image you passed in `imageUri` |
| imageHeight | `number` | The height (in pixels) of the image you passed in `imageUri` |
| initialRotation | `number` | Number which set the default rotation of the image when cropper is initialized.</br> Default is `0` |
| footerComponent | `component` | Custom component for footer. Default is `    <DefaultFooter doneText='DONE' rotateText='ROTATE' cancelText='CANCEL' />`|
| NOT_SELECTED_AREA_OPACITY | `number` | The opacity of the area which is not selected by the cropper. Should be a value between `0` and `1`. Default is `0.5`|
| BORDER_WIDTH | `number` | The border width [(see image)](https://i.imgur.com/CMSS953.png). Default is `50`|
| COMPONENT_WIDTH | `number` | The width of the entire component. Default is `Dimensions.get('window').width`, not recommended to change.|
| COMPONENT_HEIGHT | `number` | The height of the entire component. Default is `Dimensions.get('window').height`, you should change it to fix [hidden footer issue](https://github.com/ggunti/react-native-amazing-cropper/issues/30).|


#### Usage example 1 (using the default footer)
-------------
```javascript
import React, { Component } from 'react';
import AmazingCropper from 'react-native-amazing-cropper';;

class AmazingCropperPage extends Component {
  onDone = (croppedImageUri) => {
    console.log('croppedImageUri = ', croppedImageUri);
    // send image to server for example
  }

  onError = (err) => {
    console.log(err);
  }

  onCancel = () => {
    console.log('Cancel button was pressed');
    // navigate back
  }

  render() {
    return (
      <AmazingCropper
        onDone={this.onDone}
        onError={this.onError}
        onCancel={this.onCancel}
        imageUri='https://www.lifeofpix.com/wp-content/uploads/2018/09/manhattan_-11-1600x2396.jpg'
        imageWidth={1600}
        imageHeight={2396}
        NOT_SELECTED_AREA_OPACITY={0.3}
        BORDER_WIDTH={20}
      />
    );
  }
}
```

#### Usage example 2 (using the default footer with custom text)
-------------
```javascript
import React, { Component } from 'react';
import AmazingCropper, { DefaultFooter } from 'react-native-amazing-cropper';

class AmazingCropperPage extends Component {
  onDone = (croppedImageUri) => {
    console.log('croppedImageUri = ', croppedImageUri);
    // send image to server for example
  }

  onError = (err) => {
    console.log(err);
  }

  onCancel = () => {
    console.log('Cancel button was pressed');
    // navigate back
  }

  render() {
    return (
      <AmazingCropper
        // Pass custom text to the default footer
        footerComponent={<DefaultFooter doneText='OK' rotateText='ROT' cancelText='BACK' />}
        onDone={this.onDone}
        onError={this.onError}
        onCancel={this.onCancel}
        imageUri='https://www.lifeofpix.com/wp-content/uploads/2018/09/manhattan_-11-1600x2396.jpg'
        imageWidth={1600}
        imageHeight={2396}
      />
    );
  }
}
```

#### Usage example 3 (using own fully customized footer)
-------------

Write your custom footer component.</br>
Don't forget to call the **props.onDone**, **props.onRotate** and **props.onCancel** methods inside it (the Cropper will pass them automatically to your footer component). Also you can use the **props.isLoading** property for example to show a loading indicator immediately after the 'DONE' button is pressed (and until **props.onDone** is resolved with the cropped image uri). Example of custom footer component:

```javascript
import React from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomCropperFooter = (props) => (
  <View style={styles.buttonsContainer}>
    <TouchableOpacity onPress={props.onCancel} style={styles.touchable}>
      <Text style={styles.text}>CANCEL</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={props.onRotate} style={styles.touchable}>
      <MaterialCommunityIcon name='format-rotate-90' style={styles.rotateIcon} />
    </TouchableOpacity>
    {/* do not allow user to press 'DONE' button quickly multiple times, so disable it while props.isLoading is true */}
    <TouchableOpacity onPress={props.onDone} disabled={props.isLoading} style={styles.touchable}>
      <Text style={styles.text}>DONE</Text>
    </TouchableOpacity>
  </View>
)

export default CustomCropperFooter;

CustomCropperFooter.propTypes = {
  onDone: PropTypes.func,
  onRotate: PropTypes.func,
  onCancel: PropTypes.func,
  isLoading: PropTypes.bool
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center', // 'flex-start'
    justifyContent: 'space-between',
    height: '100%'
  },
  text: {
    color: 'white',
    fontSize: 16
  },
  touchable: {
    padding: 10,
  },
  rotateIcon: {
    color: 'white',
    fontSize: 26,
    ...Platform.select({
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
    }),
  },
})
```

Now just pass your footer component to the Cropper like here:

```javascript
import React, { Component } from 'react';
import AmazingCropper from 'react-native-amazing-cropper';
import CustomCropperFooter from './src/components/CustomCropperFooter.component';

class AmazingCropperPage extends Component {
  onDone = (croppedImageUri) => {
    console.log('croppedImageUri = ', croppedImageUri);
    // send image to server for example
  }

  onError = (err) => {
    console.log(err);
  }

  onCancel = () => {
    console.log('Cancel button was pressed');
    // navigate back
  }

  render() {
    return (
      <AmazingCropper
        // Use your custom footer component
        // Do NOT pass onDone, onRotate, onCancel and isLoading to the footer component, the Cropper will do it for you
        footerComponent={<CustomCropperFooter />}
        onDone={this.onDone}
        onError={this.onError}
        onCancel={this.onCancel}
        imageUri='https://www.lifeofpix.com/wp-content/uploads/2018/09/manhattan_-11-1600x2396.jpg'
        imageWidth={1600}
        imageHeight={2396}
      />
    );
  }
}
```

#### Did you like it? Check out also my mini applications on Google Play:
Simple Share: https://play.google.com/store/apps/details?id=com.sendfiles </br>
Card Trick: https://play.google.com/store/apps/details?id=com.card_trick_2 </br>
Swwwitch: https://play.google.com/store/apps/details?id=com.swwwitch

### Do you need a mobile app for android & iOS? [Hire me](https://order-software.com)

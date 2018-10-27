# react-native-amazing-cropper
Image cropper for react native using Animated API (with rotation possibility)

This component depend on `react-native-image-rotate` and `react-native-vector-icons` libraries. They need to be installed and linked to your project before.

**STEPS TO INSTALL:**
1. `npm install --save react-native-image-rotate react-native-vector-icons`
2. `react-native link react-native-image-rotate & react-native link react-native-vector-icons`
3. `npm install --save react-native-amazing-cropper`

#### Properties
-------------
| Prop  | Type | Description |
| :------------ |:---------------:| :---------------|
| onDone | `function` | A function which accepts 1 argument `croppedImageUri`. Called when user press the 'DONE' button |
| onCancel | `function` | A function without arguments. Called when user press the 'CANCEL' button |
| imageUri | `string` | The uri of the image you want to crop or rotate |
| imageWidth | `number` | The width (in pixels) of the image you passed in `imageUri` |
| imageHeight | `number` | The height (in pixels) of the image you passed in `imageUri` |

#### Example of usage
-------------
```javascript
import React, { Component } from 'react';
import { Platform, ImageStore } from 'react-native';
import { Actions } from 'react-native-router-flux';
import AmazingCropper from 'react-native-amazing-cropper';;

class AmazingCropperPage extends Component {
  onDone = (croppedImageUri) => {
    console.log('croppedImageUri = ', croppedImageUri);
    if (Platform.OS === 'ios') {
      ImageStore.getBase64ForTag(
        croppedImageUri,
        (base64Image) => {
          // send image to server or save it locally
          ImageStore.removeImageForTag(croppedImageUri);
        },
        (err) => {}
      );
    }
    else {
      // send image to server
    }
    Actions.home();
  }

  onCancel = () => {
    // navigate back
    Actions.pop();
  }

  render() {
    return (
      <AmazingCropper
        onDone={this.onDone}
        onCancel={this.onCancel}
        imageUri='https://www.lifeofpix.com/wp-content/uploads/2018/09/manhattan_-11-1600x2396.jpg'
        imageWidth={1600}
        imageHeight={2396}
      />
    );
  }
}
```

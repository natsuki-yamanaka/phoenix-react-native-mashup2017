import React, { Component } from 'react';
import {
  Platform
} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat'

// TODO move these values to Constants.js (also with used colors #b2b2b2)
const MIN_COMPOSER_HEIGHT = Platform.select({
  ios: 33,
  android: 41,
});
const MAX_COMPOSER_HEIGHT = 100;

export default class GiftedChatAdvanced extends GiftedChat {
}

//sizeがundefinedでエラーになるのでここで上書き
GiftedChatAdvanced.prototype.onInputSizeChanged = function(size) {
      if(!size || !size.height) return;
      const newComposerHeight = Math.max(MIN_COMPOSER_HEIGHT, Math.min(MAX_COMPOSER_HEIGHT, size.height));
      const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard(newComposerHeight);
      this.setState({
        composerHeight: newComposerHeight,
        messagesContainerHeight: this.prepareMessagesContainerHeight(newMessagesContainerHeight),
      });
    }
import React, { Component } from 'react';
import {
  Platform,
  Animated,
  View,
  Image,
  ViewPropTypes,
  StyleSheet,
  Dimensions
} from 'react-native';
import {
  GiftedChat,
  MessageContainer,
  MessageImage
} from 'react-native-gifted-chat'

import Lightbox from 'react-native-lightbox';

// TODO move these values to Constants.js (also with used colors #b2b2b2)
const MIN_COMPOSER_HEIGHT = Platform.select({
  ios: 33,
  android: 41,
});
const MAX_COMPOSER_HEIGHT = 100;

export default class GiftedChatAdvanced extends GiftedChat {
  renderMessages() {
    const AnimatedView = this.props.isAnimated === true ? Animated.View : View;
    const propsAdvanced = {
      ...this.props,
      renderMessageImage: this.renderMessageImage.bind(this)
    };
    return (
      <AnimatedView style={{
        height: this.state.messagesContainerHeight,
      }}>
        <MessageContainer
          {...propsAdvanced}
          invertibleScrollViewProps={this.invertibleScrollViewProps}
          messages={this.getMessages()}
          ref={component => this._messageContainerRef = component}
        />
        {this.renderChatFooter()}
      </AnimatedView>
    );
  }
  renderMessageImage(messageImageProps) {
    return <MessageImageAdvanced {...messageImageProps}/>;
  }

  onInputSizeChanged(size) {
      if(!size || !size.height) return;
      const newComposerHeight = Math.max(MIN_COMPOSER_HEIGHT, Math.min(MAX_COMPOSER_HEIGHT, size.height));
      const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard(newComposerHeight);
      this.setState({
        composerHeight: newComposerHeight,
        messagesContainerHeight: this.prepareMessagesContainerHeight(newMessagesContainerHeight),
      });
  }

}

export class MessageImageAdvanced extends MessageImage {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this)
  }

  render() {
    const { width, height } = Dimensions.get('window');
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Lightbox
          activeProps={{
            style: [styles.imageActive, { width, height }],
          }}
          {...this.props.lightboxProps}
        >
          <Image
            {...this.props.imageProps}
            style={[styles.image, this.props.imageStyle]}
            source={this.props.currentMessage.image}
          />
        </Lightbox>
      </View>
    );
  }
}




const styles = StyleSheet.create({
  container: {
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',
  },
  imageActive: {
    resizeMode: 'contain',
  },
});

MessageImage.defaultProps = {
  currentMessage: {
    image: null,
  },
  containerStyle: {},
  imageStyle: {},
  imageProps: {},
  lightboxProps: {},
};

MessageImage.propTypes = {
  currentMessage: React.PropTypes.object,
  containerStyle: ViewPropTypes.style,
  imageStyle: Image.propTypes.style,
  imageProps: React.PropTypes.object,
  lightboxProps: React.PropTypes.object,
};

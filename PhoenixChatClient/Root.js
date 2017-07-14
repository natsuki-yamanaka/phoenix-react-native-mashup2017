import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform
} from 'react-native';
import GiftedChatAdvanced from './GiftedChatAdvanced'
import Chat from './Chat'
import uuid from 'uuid';

// layout numbers
const SCREEN_HEIGHT = Dimensions.get('window').height
const STATUS_BAR_HEIGHT = 40  // i know, but let's pretend its cool
const CHAT_MAX_HEIGHT = SCREEN_HEIGHT - STATUS_BAR_HEIGHT
const ID_FOR_MINE = uuid.v4()
const userName = uuid.v4()

export default class Root extends Component {
  
  state = {
    messages: [],
  };

  constructor (props) {
    super(props)
    // bind our functions to the right scope
    // this.handleSend = this.handleSend.bind(this)
    this.receiveChatMessage = this.receiveChatMessage.bind(this)
    // let's chat!
    this.chat = Chat(userName, this.receiveChatMessage)
  }

  // fires when we receive a message
  receiveChatMessage (message) {
    if (this.isMe(message)) return // prevent echoing yourself (TODO: server could handle this i guess?)

    this.setState((previousState) => ({
      messages: GiftedChatAdvanced.append(this.state.messages, [this.createMessage(message.body, message.user, message.image, 'https://facebook.github.io/react/img/logo_og.png')])
    }));

  }

  // check message.name and userName equal
  isMe(message) {
      if(message && message.user == userName) {
          return true;
      }
      return false;
  }

  createMessage(body, name, image, avatar) {
    if(image){
        return {
          _id: uuid.v4(),
          createdAt: new Date(),
          user: {
            _id: ID_FOR_MINE,
            name: name,
            avatar: avatar,
          },
          image: image
        };
    } else {
        return {
          _id: uuid.v4(),
          text: body,
          createdAt: new Date(),
          user: {
            _id: ID_FOR_MINE,
            name: name,
            avatar: avatar,
          }
        };
    }
        
  }

  onSend(messages = []) {
      let message = messages[0]

      this.setState((previousState) => ({
      messages: GiftedChatAdvanced.append(this.state.messages, messages)
    }));
      this.chat.send(message.text)
  }

  render() {
    return (
      <View style={{ flex: 1, paddingTop: STATUS_BAR_HEIGHT }}>
        <GiftedChatAdvanced
        ref='giftedChat'
        style={{ flex: 1 }}
        messages={this.state.messages}
        onSend={(messages) => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
        </View>
    )
  }
}

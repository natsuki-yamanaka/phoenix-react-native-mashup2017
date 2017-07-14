import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';
// import GiftedMessenger from 'react-native-gifted-messenger'
import {GiftedChat} from 'react-native-gifted-chat'
import Chat from './Chat'
import uuid from 'uuid';

// layout numbers
const SCREEN_HEIGHT = Dimensions.get('window').height
const STATUS_BAR_HEIGHT = 40  // i know, but let's pretend its cool
const CHAT_MAX_HEIGHT = SCREEN_HEIGHT - STATUS_BAR_HEIGHT
const ID_FOR_MINE = uuid.v4()
const NAMES = ['Girl', 'Boy', 'Horse', 'Poo', 'Face', 'Giant', 'Super', 'Butt', 'Captain', 'Lazer']
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min
const getRandomName = () => NAMES[getRandomInt(0, NAMES.length)]
const getRandomUser = () => `${ getRandomName() }${ getRandomName() }${ getRandomName() }`
const userName = getRandomUser()

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
      messages: GiftedChat.append(this.state.messages, [this.createMessage(message.body, message.image, message.user, 'https://facebook.github.io/react/img/logo_og.png')])
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

  componentWillMount() {
    // this.setState({
    //   messages: [
    //     {
    //       _id: 1,
    //       // text: 'Hello developer',
    //       createdAt: new Date(),
    //       user: {
    //         _id: ID_FOR_MINE,
    //         name: userName,
    //         avatar: 'https://facebook.github.io/react/img/logo_og.png',
    //       },
    //       image: require('./img/1.png')
    //     },
    //   ],
    // });
  }

  onSend(messages = []) {
      let message = messages[0]

      this.setState((previousState) => ({
      messages: GiftedChat.append(this.state.messages, messages)
    }));
      this.chat.send(message.text)
  }
  
  render() {
    return (
      <View style={{ flex: 1, paddingTop: STATUS_BAR_HEIGHT }}>
        <GiftedChat
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

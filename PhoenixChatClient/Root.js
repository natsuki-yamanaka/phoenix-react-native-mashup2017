import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  Image,
  TouchableHighlight,
  ListView,
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
    this.receiveChatMessage = this.receiveChatMessage.bind(this)
    this.onSendStamp = this.onSendStamp.bind(this)
    // let's chat!
    this.chat = Chat(userName, this.receiveChatMessage)

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        return r1.id !== r2.id;
      }
    });
    const stampData = [{id:1, name:'biz1'}, {id:2, name:'biz2'}, {id:3, name:'biz3'}];
    this.state = {
      dataSource: dataSource.cloneWithRows(stampData)
    };
  }

  // fires when we receive a message
  receiveChatMessage (message) {
    if (this.isMe(message)) return // prevent echoing yourself (TODO: server could handle this i guess?)

    this.setState((previousState) => ({
      messages: GiftedChatAdvanced.append(this.state.messages, [createMessage(message.body, message.user, message.image ? this.getStampImageUri(message.image) : undefined, 'https://facebook.github.io/react/img/logo_og.png')])
    }));

  }

  // check message.name and userName equal
  isMe(message) {
      if(message && message.user == userName) {
          return true;
      }
      return false;
  }

  getStampImageUri(image){
    switch(image){
      case 1:
      return require('./img/1.png');
      case 2:
      return require('./img/2.png');
      case 3:
      return require('./img/3.png');
    }
    return require('./img/1.png');
  }

  onSendStamp(stampId){
    const stampMessage = createMessage('stamp', userName, this.getStampImageUri(stampId), 'https://facebook.github.io/react/img/logo_og.png');
    this.setState((previousState) => ({
      messages: GiftedChatAdvanced.append(this.state.messages, [stampMessage])
    }));
    this.chat.sendImage(stampMessage.text, stampId)
  }

  onSend(messages = []) {
      let message = messages[0]
      this.setState((previousState) => ({
      messages: GiftedChatAdvanced.append(this.state.messages, messages)
    }));
      this.chat.send(message.text)
  }

  renderRow(data) {
    return (
      <TouchableHighlight onPress={ () => this.onSendStamp(data.id) }>
          <Image
            style={{width:100, height:100}}
            source={require('./img/'+data.id+'.png')}
          />
        </TouchableHighlight>
    )
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

      <View style={{ flexDirection: 'row' }}>
      <TouchableHighlight onPress={ () => this.onSendStamp(1) }>
          <Image
            style={{width:100, height:100}}
            source={require('./img/1.png')}
          />
        </TouchableHighlight>
        <TouchableHighlight onPress={ () => this.onSendStamp(2) }>
          <Image
            style={{width:100, height:100}}
            source={require('./img/2.png')}
          />
        </TouchableHighlight>
        <TouchableHighlight onPress={ () => this.onSendStamp(3) }>
          <Image
            style={{width:100, height:100}}
            source={require('./img/3.png')}
          />
        </TouchableHighlight>
      </View>

        </View>
    )
  }
}

function createMessage(body, name, image, avatar) {
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
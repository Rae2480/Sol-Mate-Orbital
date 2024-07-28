import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ImageBackground, TextInput, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import back from '@/assets/images/back.png'
import send from '@/assets/images/send.png'
import { auth, db } from '@/config/firebaseConfig';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
const chats = [
  { id: '1', name: 'Bob', message: 'Hi Bob, we just matched!', image: require('@/assets/images/placeholderpp.jpg'), unread: false },
  { id: '2', name: 'Denyse', message: 'Hi Denyse, we just matched!', image: require('@/assets/images/placeholderpp.jpg'), unread: false },
  { id: '3', name: 'Adam', message: 'Hello there!', image: require('@/assets/images/placeholderpp.jpg'), unread: true },
  { id: '4', name: 'Charlie', message: 'How are you?', image: require('@/assets/images/placeholderpp.jpg'), unread: true },
];

const MainChatPage = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const route = useRoute();
  const { chatRoomId, userName } = route.params;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesList);
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  const sendMessage = async () => {
    console.log('started')
    const currentUser = auth.currentUser;
    if (message.trim()) {
      try {


        await addDoc(collection(db, 'chatRooms', chatRoomId, 'messages'), {
          text: message,
          senderId: currentUser.uid,
          timestamp: new Date(),
        });
        setMessage('');
      } catch (error) {
        console.log(error, 'error')
      }
    }
  };


  return (
    <ImageBackground source={require('@/assets/images/whitepastel2.png')} style={styles.backgroundImage}>

      <View style={{ padding: 10, margin: 10, backgroundColor: 'white', height: "90%", width: "95%", borderRadius: 20 }} >

        {/* header */}
        <View style={{marginTop:Platform.OS ==="ios" ? 20:0, position: 'relative', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }} >
          <TouchableOpacity onPress={() => navigation.goBack()} >
            <Image source={back} />
          </TouchableOpacity>
          <Text>{userName}</Text>
          <Text style={{ opacity: 0 }} >13</Text>
        </View>
        {/* chat */}
        <View
         >

          <FlatList
            ref={flatListRef}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.messageContainer, item.senderId === auth.currentUser.uid ? styles.sender : styles.receiver]}>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.messageSender}>{item.senderId === auth.currentUser.uid ? 'Me' : userName}</Text>
              </View>
            )}
            inverted
          />
        </View>

        {/* input */}
        <View style={{ backgroundColor: "white", position: 'absolute', bottom: 10, left: 10, flexDirection: 'row', gap: 5, width: "100%", alignItems: 'center', borderWidth: 1, borderColor: 'black', borderRadius: 20 }} >
          <TextInput value={message} onChangeText={(e) => setMessage(e)} placeholder='send' style={{ paddingLeft: 15, height: heightPercentageToDP(5), width: "90%" }} />
          <TouchableOpacity onPress={sendMessage} >

            <Image source={send} style={{ height: 20, width: 20 }} />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    opacity: 0.9,
    alignItems: 'center',
    justifyContent: 'center'
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  sender: {
    alignSelf: 'flex-end',
    backgroundColor: '#006A4E',
  },
  receiver: {
    alignSelf: 'flex-start',
    backgroundColor: '#318CE7',
  },
  messageText: {
    color: 'white',
  },
  messageSender: {
    color: 'white',
    fontSize: 10,
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
});

export default MainChatPage;

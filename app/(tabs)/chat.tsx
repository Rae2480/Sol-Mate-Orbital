import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ImageBackground } from 'react-native';
import { collection, doc, getDoc, getDocs, addDoc, query, orderBy, onSnapshot, setDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebaseConfig'; // Ensure this path is correct

interface Chat {
  id: string;
  users: string[];
  lastMessage: string;
  timestamp: any;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
}

const ChatPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    const fetchChats = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const q = query(collection(db, 'chats'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const userChats: Chat[] = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().users.includes(userId)) {
            userChats.push({ id: doc.id, ...doc.data() } as Chat);
          }
        });
        setChats(userChats);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChatId) {
      const messagesRef = collection(db, `chats/${selectedChatId}/messages`);
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const chatMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          chatMessages.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages(chatMessages);
      });

      return () => unsubscribe();
    }
  }, [selectedChatId]);

  const sendMessage = async () => {
    if (newMessage.trim() && auth.currentUser) {
      const userId = auth.currentUser.uid;
      const message = {
        senderId: userId,
        text: newMessage,
        timestamp: new Date(),
      };
      await addDoc(collection(db, `chats/${selectedChatId}/messages`), message);
      setNewMessage('');
      await updateChatLastMessage(selectedChatId!, newMessage);
    }
  };

  const updateChatLastMessage = async (chatId: string, lastMessage: string) => {
    await setDoc(doc(db, 'chats', chatId), {
      lastMessage,
      timestamp: new Date(),
    }, { merge: true });
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity onPress={() => setSelectedChatId(item.id)} style={styles.chatItem}>
      <Text style={styles.chatItemText}>{item.users.filter((userId) => userId !== auth.currentUser?.uid).join(', ')}</Text>
      <Text style={styles.lastMessageText}>{item.lastMessage}</Text>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[styles.messageItem, item.senderId === auth.currentUser?.uid ? styles.myMessage : styles.theirMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <ImageBackground source={require('@/assets/images/whitepastel2.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {selectedChatId ? (
          <>
            <FlatList
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={(item) => item.id}
              style={styles.messagesList}
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type a message"
                value={newMessage}
                onChangeText={setNewMessage}
              />
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            style={styles.chatsList}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatItemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessageText: {
    fontSize: 14,
    color: '#666',
  },
  messagesList: {
    flex: 1,
  },
  messageItem: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  chatsList: {
    flex: 1,
  },
});

export default ChatPage;

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ImageBackground, TextInput, SafeAreaView, Platform } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { auth, db } from '@/config/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

const chats = [
  { id: '1', name: 'Bob', message: 'Hi Bob, we just matched!', image: require('@/assets/images/placeholderpp.jpg'), unread: false },
  { id: '2', name: 'Denyse', message: 'Hi Denyse, we just matched!', image: require('@/assets/images/placeholderpp.jpg'), unread: false },
  { id: '3', name: 'Adam', message: 'Hello there!', image: require('@/assets/images/placeholderpp.jpg'), unread: true },
  { id: '4', name: 'Charlie', message: 'How are you?', image: require('@/assets/images/placeholderpp.jpg'), unread: true },
];

const MainChatPage = () => {
  const navigation: any = useNavigation();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loader, setLoader] = useState(false)
  const founsed = useIsFocused()
  useEffect(() => {
    fetchUsers()


  }, [founsed]);

  const fetchUsers = async () => {
    setLoader(true)
    const currentUser = auth.currentUser;

    if (currentUser) {
      const currentUserId = currentUser.uid;
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('user_id', '!=', currentUserId));

      try {
        const querySnapshot = await getDocs(q);
        const usersList: any = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(usersList, 'usersList')
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoader(false)
      }
    }
  };

  const filteredChats = users?.filter((chat: any) =>
    chat?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleChat = async (user: any) => {
    console.log(user, 'user')
    const currentUser: any = auth.currentUser;
    const chatRoomId = [currentUser.uid, user?.user_id].sort().join('_');

    navigation.navigate('ChatPage', { chatRoomId, userName: user?.email.split("@")[0] });
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => handleChat(item)} style={styles.chatItemContainer}>
      <View style={styles.chatItem}>
        <View style={{ height: 30, width: 30, borderRadius: 100, backgroundColor: 'lightgray', alignItems: "center", justifyContent: 'center' }} >
          <Text style={{ fontSize: 18 }}>{item?.email[0]?.toUpperCase()}</Text>

        </View>
        <View style={styles.chatDetails}>
          <Text style={[styles.chatName, item.unread && styles.unreadName]}>{item?.email.split("@")[0]}</Text>
          {/* <Text style={[styles.chatMessage, item.unread && styles.unreadMessage]}>{item.message}</Text> */}
        </View>
      </View>
      <View style={styles.separator} />
    </TouchableOpacity>
  );

  // const getUsers

  return (
    <ImageBackground source={require('@/assets/images/whitepastel2.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={{...styles.header,marginTop:Platform.OS === "ios" ? heightPercentageToDP(5):0}}>
          <Text style={styles.messagesTab}>Messages <Text style={styles.notificationCount}>({chats.filter(chat => chat.unread).length})</Text></Text>
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
          />
        </View>
       {loader ? <Text>Loading...</Text>: <View style={styles.chatListContainer}>
          <FlatList
            data={filteredChats}
            renderItem={renderItem}
            keyExtractor={(item: any, index) => item?.user_id}
            contentContainerStyle={styles.listContainer}
          />
        </View>}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    opacity: 0.9,
  },
  container: {
    flex: 1,
    paddingTop: heightPercentageToDP(2),
  },
  header: {
    paddingHorizontal: widthPercentageToDP(5),
    paddingVertical: heightPercentageToDP(2),
    backgroundColor: "rgba(244,244,244,0.9)",
    borderRadius: widthPercentageToDP(5),
    marginHorizontal: widthPercentageToDP(5),
    marginBottom: heightPercentageToDP(2),
  },
  messagesTab: {
    fontSize: widthPercentageToDP(5),
    fontWeight: 'bold',
    marginBottom: heightPercentageToDP(1),
  },
  notificationCount: {
    color: '#0000ff', // Blue color for notification count
  },
  searchBar: {
    height: heightPercentageToDP(5),
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: widthPercentageToDP(2),
    paddingHorizontal: widthPercentageToDP(2),
    marginBottom: heightPercentageToDP(1),
  },
  chatListContainer: {
    backgroundColor: "rgba(244,244,244,0.9)",
    height: heightPercentageToDP(70),
    borderRadius: widthPercentageToDP(5),
    marginHorizontal: widthPercentageToDP(5),
    paddingHorizontal: widthPercentageToDP(5),
    paddingVertical: heightPercentageToDP(2),
  },
  listContainer: {
    paddingVertical: 16,
  },
  chatItemContainer: {
    width: '100%',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 5
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  unreadName: {
    color: '#0000ff', // Blue color for unread chat names
  },
  chatMessage: {
    fontSize: 16,
    color: '#666',
  },
  unreadMessage: {
    fontWeight: 'bold', // Bold font for unread messages
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 16,
  },
});
//test
export default MainChatPage;

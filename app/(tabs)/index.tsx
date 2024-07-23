import * as React from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebaseConfig'; // Ensure this path is correct
import RadioButton from "@/components/RadioButton";

interface UserData {
  name: string;
  profilePicture: string | null;
  birthday: Date;
  bio: string;
  lookingFor: string;
  university: string;
  major: string;
}

const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = React.useState<UserData>({
    name: '',
    profilePicture: null,
    birthday: new Date(),
    bio: '',
    lookingFor: '',
    university: '',
    major: '',
  });
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const fetchData = async () => {
    try {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const docRef = doc(db, 'userProfiles', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            name: data.name,
            profilePicture: data.profilePicture,
            birthday: data.birthday?.toDate ? data.birthday.toDate() : new Date(),
            bio: data.bio,
            lookingFor: data.lookingFor,
            university: data.university,
            major: data.major,
          });
        }
      }
    } catch (e) {
      console.error('Error fetching document: ', e);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSaveData = async () => {
    try {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        await setDoc(doc(db, 'userProfiles', userId), {
          ...userData,
          timestamp: new Date().toISOString(), // Save as ISO string to avoid object issue
        });
        Alert.alert('Success', 'Your profile has been saved!');
        setIsEditMode(false);
      }
    } catch (e) {
      console.error('Error adding document: ', e);
      Alert.alert('Error', 'Failed to save your profile.');
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Error', 'Permission to access photo library is required');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUserData({ ...userData, profilePicture: result.assets[0].uri });
    }
  };

  const handleDateChange = (selectedDate: Date) => {
    setShowDatePicker(false);
    setUserData({ ...userData, birthday: selectedDate });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/whitepastel.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <TouchableOpacity onPress={isEditMode ? pickImage : null} style={styles.profileImageContainer}>
            <Image
              source={userData.profilePicture ? { uri: userData.profilePicture } : require('@/assets/images/placeholderpp.jpg')}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hi, {userData.name}!</Text>
          </View>

          {isEditMode ? (
            <>
              <View style={styles.section}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                  <Text style={styles.sectionTitle}>Birthday</Text>
                  <Text>{userData.birthday.toDateString()}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={showDatePicker}
                  mode="date"
                  onConfirm={handleDateChange}
                  onCancel={() => setShowDatePicker(false)}
                  date={userData.birthday}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bio</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Write a short bio"
                  value={userData.bio}
                  onChangeText={(text) => setUserData({ ...userData, bio: text })}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>University</Text>
                <View style={styles.radioContainer}>
                  {['NUS', 'NTU', 'SMU'].map((option) => (
                    <View key={option} style={styles.optionRow}>
                      <Text>{option}</Text>
                      <RadioButton
                        selected={userData.university === option}
                        onPress={() => setUserData({ ...userData, university: option })}
                        selectedColor="#f08080"
                      />
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Major</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your major"
                  value={userData.major}
                  onChangeText={(text) => setUserData({ ...userData, major: text })}
                />
              </View>

              <TouchableOpacity onPress={handleSaveData} style={styles.saveProfileButton}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Birthday</Text>
                <Text style={styles.sectionText}>{userData.birthday.toDateString()}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bio</Text>
                <Text style={styles.sectionText}>{userData.bio}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>University</Text>
                <Text style={styles.sectionText}>{userData.university}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Major</Text>
                <Text style={styles.sectionText}>{userData.major}</Text>
              </View>

              <TouchableOpacity onPress={() => setIsEditMode(true)} style={styles.editProfileButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollViewContent: {
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  backgroundImageStyle: {
    opacity: 0.25,
  },
  profileImageContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    width: '100%',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveProfileButton: {
    backgroundColor: '#FF5FB1',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editProfileButton: {
    backgroundColor: '#FF5FB1',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  radioContainer: {
    gap: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Profile;

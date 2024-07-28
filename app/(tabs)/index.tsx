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
import { db } from '@/config/firebaseConfig';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface UserData {
  name: string;
  profilePicture: string | null;
  birthday: Date;
  bio: string;
  lookingFor: string;
  major: string;
  gender: string;
}

const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = React.useState<UserData>({
    name: '',
    profilePicture: null,
    birthday: new Date(),
    bio: '',
    lookingFor: '',
    major: '',
    gender: ''
  });
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const fetchData = async () => {
    try {
      const userId = 'uniqueUserID'; // Replace with the actual user ID
      const docRef = doc(db, 'userSelections', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(prevState => ({
          ...prevState,
          name: data.name,
          lookingFor: data.selection,
          major: data.major || '',
          gender: data.gender || ''
        }));
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
      const userId = 'uniqueUserID'; // Replace with the actual user ID
      await setDoc(doc(db, 'userProfiles', userId), {
        ...userData,
        timestamp: new Date().toISOString(),
      });
      Alert.alert('Success', 'Your profile has been saved!');
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

  const navigateToAdditionalQuestions = () => {
    navigation.navigate('AdditionalQuestionnaireScreen', { userType: userData.lookingFor });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/whitepastel.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.profileImageContainer}>
            <Image
              source={userData.profilePicture ? { uri: userData.profilePicture } : require('@/assets/images/placeholderpp.jpg')}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
              <FeatherIcon name="edit-3" color="#FFF" size={20} />
            </TouchableOpacity>
          </View>

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
            <Text style={styles.sectionTitle}>Gender</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                onPress={() => setUserData({ ...userData, gender: 'Male' })}
                style={[
                  styles.genderOption,
                  userData.gender === 'Male' && styles.genderOptionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.genderOptionText,
                    userData.gender === 'Male' && styles.genderOptionTextSelected,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setUserData({ ...userData, gender: 'Female' })}
                style={[
                  styles.genderOption,
                  userData.gender === 'Female' && styles.genderOptionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.genderOptionText,
                    userData.gender === 'Female' && styles.genderOptionTextSelected,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
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
            <Text style={styles.sectionTitle}>Looking For:</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LookingFor')} style={styles.editButton}>
              <Text style={styles.sectionText}>{userData.lookingFor}</Text>
              <FeatherIcon name="edit-3" color="blue" size={20} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={navigateToAdditionalQuestions} style={styles.additionalQuestionsButton}>
            <Text style={styles.additionalQuestionsButtonText}>Answer Additional Questions</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSaveData} style={styles.saveProfileButton}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </TouchableOpacity>
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
  editIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#007bff',
    padding: 6,
    borderRadius: 15,
    zIndex: 1,
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
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
  additionalQuestionsButton: {
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  additionalQuestionsButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0', // Add background color for unselected state
  },
  genderOptionSelected: {
    backgroundColor: '#007bff',
  },
  genderOptionText: {
    color: '#000', // Default text color for unselected state
    fontWeight: 'bold',
  },
  genderOptionTextSelected: {
    color: '#fff', // Text color for selected state
  },
});

export default Profile;

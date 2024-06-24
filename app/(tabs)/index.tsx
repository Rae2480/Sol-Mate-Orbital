import React, { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  View,
  Text,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import FeatherIcon from 'react-native-vector-icons/Feather';

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [image, setImage] = useState<string | null>(null);
  const [introduction, setIntroduction] = useState('');
  const [editMode, setEditMode] = useState(true);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'users', 'userID'), {
        name,
        age,
        image,
        introduction,
      });
      setEditMode(false);
      Alert.alert('Success!', 'Your profile has been updated');
    } catch (e) {
      console.error('Error adding document: ', e);
      Alert.alert('Error', 'Failed to save data');
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Error', 'Permission to access photo library is required');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.cancelled && pickerResult.assets && pickerResult.assets.length > 0) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'users', 'userID');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name);
        setAge(data.age);
        setImage(data.image);
        setIntroduction(data.introduction);
        setEditMode(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/whitepastel.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Image
                source={image ? { uri: image } : require('@/assets/images/placeholderpp.jpg')}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            {editMode && (
              <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
                <FeatherIcon name="edit-3" color="#FFF" size={30} />
              </TouchableOpacity>
            )}
          </View>

          {editMode ? (
            <View style={styles.editInfoContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Age</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={12}
                  maximumValue={99}
                  step={1}
                  value={age}
                  onValueChange={setAge}
                />
                <Text style={styles.sliderValue}>{age}</Text>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Introduction</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Write a brief introduction"
                  value={introduction}
                  onChangeText={setIntroduction}
                  multiline
                  numberOfLines={4}
                />
              </View>
              <TouchableOpacity onPress={pickImage} style={styles.imagePickerContainer}>
                <View style={styles.imagePicker}>
                  <Image
                    source={image ? { uri: image } : require('@/assets/images/placeholderpp.jpg')}
                    style={styles.image}
                  />
                </View>
              </TouchableOpacity>
              <Button title="Save" onPress={handleSave} />
            </View>
          ) : (
            <View style={styles.infoContainer}>
              <Text style={[styles.text, { fontWeight: '200', fontSize: 36 }]}>
                {name} <Text style={{ fontSize: 24 }}>({age})</Text>
              </Text>
              <Text style={[styles.text, { color: '#AEB5BC', fontSize: 14 }]}>{introduction}</Text>
              <Button title="Edit" onPress={() => setEditMode(true)} />
            </View>
          )}

          <View style={styles.languageLocationContainer}>
            <TouchableOpacity style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: '#fe9400' }]}>
                <FeatherIcon color="#fff" name="question-circle" size={20} />
              </View>
              <Text style={styles.rowLabel}>Answered Questionnaire</Text>
              <View style={styles.rowSpacer} />
              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
                <FeatherIcon color="#fff" name="question-circle-o" size={20} />
              </View>
              <Text style={styles.rowLabel}>New Questionnaires</Text>
              <View style={styles.rowSpacer} />
              <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  text: {
    fontFamily: 'HelveticaNeue',
    color: '#52575D',
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  subText: {
    fontSize: 12,
    color: '#AEB5BC',
    textTransform: 'uppercase',
    fontWeight: '500',
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
  },
  editIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 20,
    zIndex: 1,
  },
  infoContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  editInfoContainer: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    width: '100%',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
    marginBottom: 16,
  },
  imagePickerContainer: {
    alignItems: 'center',
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    height: 150,
    width: 150,
  },
  languageLocationContainer: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '400',
    color: '#0c0c0c',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  backgroundImageStyle: {
    opacity: 0.25,
  },
});
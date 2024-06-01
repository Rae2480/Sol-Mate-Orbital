import { Image, StyleSheet, TextInput, View, Text, Button, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Slider from '@react-native-community/slider';
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [image, setImage] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(true);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'users', 'userID'), { // Use the appropriate user ID
        name,
        age,
        image
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

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'users', 'userID'); // Use the appropriate user ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name);
        setAge(data.age);
        setImage(data.image);
        setEditMode(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E87094', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hello!</ThemedText>
        <HelloWave />
      </ThemedView>
      <View style={styles.inputContainer}>
        {editMode ? (
          <>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Age: {age}</Text>
              <Slider
                style={styles.slider}
                minimumValue={12}
                maximumValue={99}
                step={1}
                value={age}
                onValueChange={setAge}
              />
            </View>
            <TouchableOpacity onPress={pickImage}>
              <View style={styles.imagePicker}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <Text>Select an Image</Text>
                )}
              </View>
            </TouchableOpacity>
            <Button title="Save" onPress={handleSave} />
          </>
        ) : (
          <>
            <Text>Name: {name}</Text>
            <Text>{}</Text>
            <Text>Age: {age}</Text>
            <Text>{}</Text>
            {image && <Image source={{ uri: image }} style={styles.displayImage} />}
            <Button title="Edit" onPress={() => setEditMode(true)} />
          </>
        )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputContainer: {
    padding: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  sliderContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  sliderLabel: {
    marginBottom: 8,
  },
  slider: {
    height: 40,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
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
    width: 150, // Make it square
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: 4,
  },
  displayImage: {
    width: 300,
    height: 300,
    borderRadius: 4,
  },
});

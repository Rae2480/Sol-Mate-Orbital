// app/(tabs)/index.tsx
import { Image, StyleSheet, TextInput, View, Text, Button, Alert } from 'react-native';
import React, { useState } from 'react';
import Slider from '@react-native-community/slider';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig'; // Adjust the path according to your project structure
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);

  const handleSave = async () => {
    try {
      await addDoc(collection(db, 'users'), {
        name,
        age,
      });
      Alert.alert('Success', 'Data saved successfully!');
    } catch (e) {
      console.error('Error adding document: ', e);
      Alert.alert('Error', 'Failed to save data');
    }
  };

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
            minimumValue={0}
            maximumValue={100}
            value={age}
            onValueChange={setAge}
          />
        </View>
        <Button title="Save" onPress={handleSave} />
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
});

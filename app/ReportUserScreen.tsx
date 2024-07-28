import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { db, auth } from '@/config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function ReportUserScreen() {
  const [reportReason, setReportReason] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState('');
  const [details, setDetails] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSendReport = async () => {
    if (!reportReason) {
      Alert.alert('Error', 'Please select a reason for your report.');
      return;
    }

    try {
      const reportData = {
        userId: auth.currentUser?.uid,
        reportReason: reportReason === 'Other' ? otherReason : reportReason,
        details,
        image,
        timestamp: new Date().toISOString(),
      };

      await setDoc(doc(db, 'userReports', auth.currentUser?.uid ?? ''), reportData);

      Alert.alert('Report Sent', 'Your report has been sent successfully.');
      router.back();
    } catch (error) {
      console.error('Error sending report:', error);
      Alert.alert('Error', 'Failed to send report. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Report User</Text>

      <Text style={styles.label}>Reason for Report:</Text>
      <TouchableOpacity
        style={styles.radioOption}
        onPress={() => setReportReason('Inappropriate Chat')}
      >
        <View style={styles.radioButton}>
          {reportReason === 'Inappropriate Chat' && <View style={styles.radioButtonSelected} />}
        </View>
        <Text style={styles.radioText}>Inappropriate Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.radioOption}
        onPress={() => setReportReason('Inappropriate Photos')}
      >
        <View style={styles.radioButton}>
          {reportReason === 'Inappropriate Photos' && <View style={styles.radioButtonSelected} />}
        </View>
        <Text style={styles.radioText}>Inappropriate Photos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.radioOption}
        onPress={() => setReportReason('Other')}
      >
        <View style={styles.radioButton}>
          {reportReason === 'Other' && <View style={styles.radioButtonSelected} />}
        </View>
        <Text style={styles.radioText}>Other</Text>
      </TouchableOpacity>
      {reportReason === 'Other' && (
        <TextInput
          style={styles.input}
          placeholder="Enter other reason"
          value={otherReason}
          onChangeText={setOtherReason}
        />
      )}

      <Text style={styles.label}>Details about the User:</Text>
      <Text style={styles.prompt}>
        Please include the user's name, age, what they did, and any relevant screenshots.
      </Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Enter details"
        value={details}
        onChangeText={setDetails}
        multiline
      />

      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
        <MaterialIcons name="attach-file" size={24} color="white" />
        <Text style={styles.imagePickerText}>Attach Screenshot</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity style={styles.button} onPress={handleSendReport}>
        <Text style={styles.buttonText}>Send Report</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Cancel Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  prompt: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007afe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007afe',
  },
  radioText: {
    fontSize: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007afe',
    padding: 10,
    borderRadius: 5,
    marginBottom: 30,
    justifyContent: 'center',
  },
  imagePickerText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007afe',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#d9534f',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

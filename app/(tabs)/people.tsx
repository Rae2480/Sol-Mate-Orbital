import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Alert, ImageBackground } from 'react-native';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { calculateCompatibility, sortMatches } from '@/utils/algorithm';

interface Preferences {
  dailyRoutine: string;
  dailyRoutineAccept: string[];
  dailyRoutineImportance: 'Important' | 'Somewhat important' | 'Not important';
  cleanliness: string;
  cleanlinessAccept: string[];
  cleanlinessImportance: 'Important' | 'Somewhat important' | 'Not important';
  guestFrequency: string;
  guestFrequencyAccept: string[];
  guestFrequencyImportance: 'Important' | 'Somewhat important' | 'Not important';
  noiseSensitivity: string;
  noiseSensitivityAccept: string[];
  noiseSensitivityImportance: 'Important' | 'Somewhat important' | 'Not important';
  privacyNeeds: string;
  privacyNeedsAccept: string[];
  privacyNeedsImportance: 'Important' | 'Somewhat important' | 'Not important';
  timeCommitment?: string;
  timeCommitmentAccept?: string[];
  timeCommitmentImportance?: 'Important' | 'Somewhat important' | 'Not important';
  workStyle?: string;
  workStyleAccept?: string[];
  workStyleImportance?: 'Important' | 'Somewhat important' | 'Not important';
  primarySkillSet?: string;
  primarySkillSetAccept?: string[];
  primarySkillSetImportance?: 'Important' | 'Somewhat important' | 'Not important';
  experienceLevel?: string;
  experienceLevelAccept?: string[];
  experienceLevelImportance?: 'Important' | 'Somewhat important' | 'Not important';
  preferredRole?: string;
  preferredRoleAccept?: string[];
  preferredRoleImportance?: 'Important' | 'Somewhat important' | 'Not important';
}

interface User {
  id: string;
  name: string;
  bio: string;
  photo: string;
  preferences: Preferences;
}

const MatchingPage = () => {
  const [matches, setMatches] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<User | null>(null);

  const currentUser: User = {
    id: 'currentUserId',
    name: 'CurrentUser',
    bio: 'Your bio here',
    photo: 'https://via.placeholder.com/150',
    preferences: {
      dailyRoutine: 'Mid-morning riser (8 AM - 10 AM)',
      dailyRoutineAccept: ['Early riser', 'Mid-morning riser'],
      dailyRoutineImportance: 'Important',
      cleanliness: 'Moderately important, I like things to be tidy',
      cleanlinessAccept: ['Very important', 'Moderately important'],
      cleanlinessImportance: 'Important',
      guestFrequency: 'Occasionally (once or twice a month)',
      guestFrequencyAccept: ['Occasionally', 'Rarely'],
      guestFrequencyImportance: 'Somewhat important',
      noiseSensitivity: 'Moderately sensitive, occasional noise is okay',
      noiseSensitivityAccept: ['Very sensitive', 'Moderately sensitive'],
      noiseSensitivityImportance: 'Somewhat important',
      privacyNeeds: 'Moderate, I enjoy socializing but need some alone time',
      privacyNeedsAccept: ['A lot', 'Moderate'],
      privacyNeedsImportance: 'Important',
      timeCommitment: '5-10 hours per week',
      timeCommitmentAccept: ['Less than 5 hours per week', '5-10 hours per week'],
      timeCommitmentImportance: 'Important',
      workStyle: 'Prefer regular meetings and discussions',
      workStyleAccept: ['Prefer regular meetings and discussions', 'Prefer working independently with occasional check-ins'],
      workStyleImportance: 'Important',
      primarySkillSet: 'Programming',
      primarySkillSetAccept: ['Programming', 'Design'],
      primarySkillSetImportance: 'Important',
      experienceLevel: 'Intermediate',
      experienceLevelAccept: ['Beginner', 'Intermediate'],
      experienceLevelImportance: 'Important',
      preferredRole: 'Leader',
      preferredRoleAccept: ['Leader', 'Collaborator'],
      preferredRoleImportance: 'Important'
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as User);
      });
      const sortedMatches = sortMatches(currentUser, users);
      setMatches(sortedMatches);
    };

    fetchUsers();
  }, []);

  const handleYes = (match: User) => {
    setSelectedMatch(match);
    setShowModal(true);
  };

  const handleNo = () => {
    setMatches(matches.slice(1));
  };

  const handleSendMessage = () => {
    if (selectedMatch) {
      Alert.alert('Message sent!', `You have sent a message to ${selectedMatch.name}.`);
      setShowModal(false);
      setMatches(matches.slice(1));
    }
  };

  const handleReload = () => {
    setMatches(sortMatches(currentUser, matches));
  };

  if (matches.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noMatchesText}>No more matches available</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={handleReload}>
          <Text style={styles.reloadButtonText}>Reload Matches</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentMatch = matches[0];

  return (
    <ImageBackground source={require('@/assets/images/whitepastel2.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={{ uri: currentMatch.photo }} style={styles.photo} />
        <Text style={styles.name}>{currentMatch.name}</Text>
        <Text style={styles.bio}>{currentMatch.bio}</Text>
        <Text style={styles.compatibility}>Compatibility: {currentMatch.compatibility}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.noButton} onPress={handleNo}>
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.yesButton} onPress={() => handleYes(currentMatch)}>
            <Text style={styles.buttonText}>Yes</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Send a message to {selectedMatch?.name}</Text>
              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <Text style={styles.sendButtonText}>Send Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  compatibility: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  noButton: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 10,
  },
  yesButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  noMatchesText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  reloadButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
  },
  reloadButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default MatchingPage;

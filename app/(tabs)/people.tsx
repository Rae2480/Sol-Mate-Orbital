import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Alert, ImageBackground } from 'react-native';

interface User {
  id: string;
  name: string;
  bio: string;
  photo: string;
  compatibility: string;
}

const hardcodedUsers: User[] = [
  {
    id: '1',
    name: 'Adam',
    bio: 'Loves hiking and outdoor activities.',
    photo: 'https://via.placeholder.com/150',
    compatibility: 'High',
  },
  {
    id: '2',
    name: 'Bob',
    bio: 'Enjoys cooking and reading.',
    photo: 'https://via.placeholder.com/150',
    compatibility: 'Medium',
  },
  {
    id: '3',
    name: 'Charlie',
    bio: 'Passionate about technology and programming.',
    photo: 'https://via.placeholder.com/150',
    compatibility: 'Low',
  },
  {
    id: '4',
    name: 'Denyse',
    bio: 'Loves painting and arts.',
    photo: 'https://via.placeholder.com/150',
    compatibility: 'High',
  },
];

const MatchingPage = () => {
  const [matches, setMatches] = useState<User[]>(hardcodedUsers);
  const [showModal, setShowModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<User | null>(null);

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
    setMatches(hardcodedUsers);
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

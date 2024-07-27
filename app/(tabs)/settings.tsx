import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Switch,
  Image,
  ImageBackground,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { signOut, updateEmail, updatePassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { db, auth } from '@/config/firebaseConfig';

export default function SettingsScreen() {
  const [pushNotifications, setPushNotifications] = useState(false);
  const [name, setName] = useState('');
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isBugModalVisible, setIsBugModalVisible] = useState(false);
  const [bugDescription, setBugDescription] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchName = async () => {
      try {
        const docRef = doc(db, 'users', auth.currentUser?.uid ?? '');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchName();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert('Signed out', 'You have been signed out successfully.');
      router.replace('LoginScreen');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'Your account has been deleted.');
  };

  const handleChangeEmail = async () => {
    try {
      if (auth.currentUser) {
        await updateEmail(auth.currentUser, newEmail);
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, { email: newEmail });
        Alert.alert('Email Changed', 'Your email address has been updated.');
        setIsEmailModalVisible(false);
      }
    } catch (error) {
      console.error('Error updating email:', error);
      Alert.alert('Error', 'Failed to update email. Please try again.');
    }
  };

  const handleChangePassword = async () => {
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        Alert.alert('Password Changed', 'Your password has been updated.');
        setIsPasswordModalVisible(false);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Error', 'Failed to update password. Please try again.');
    }
  };

  const handleSendBugReport = async () => {
    try {
      if (!bugDescription) {
        Alert.alert('Error', 'Please enter a description of the bug.');
        return;
      }

      const reportData = {
        userId: auth.currentUser?.uid,
        description: bugDescription,
        timestamp: new Date().toISOString(),
      };

      await setDoc(doc(db, 'bugReports', auth.currentUser?.uid ?? ''), reportData);

      Alert.alert('Report Sent', 'Your bug report has been sent successfully.');
      setIsBugModalVisible(false);
    } catch (error) {
      console.error('Error sending bug report:', error);
      Alert.alert('Error', 'Failed to send bug report. Please try again.');
    }
  };

  const navigateToReportUserScreen = () => {
    router.push('ReportUserScreen');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require('@/assets/images/whitepastel2.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image source={require('@/assets/images/duck.png')} style={styles.logo} />
            </View>

            <View style={styles.profile}>
              <Text style={styles.profileName}>{name}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notifications</Text>

              <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
                  <MaterialIcons color="#fff" name="notifications" size={20} />
                </View>

                <Text style={styles.rowLabel}>Push Notifications</Text>

                <View style={styles.rowSpacer} />

                <Switch
                  onValueChange={setPushNotifications}
                  value={pushNotifications}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account</Text>

              <TouchableOpacity onPress={() => setIsEmailModalVisible(true)} style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                  <MaterialIcons color="#fff" name="email" size={20} />
                </View>
                <Text style={styles.rowLabel}>Change Email Address</Text>
                <View style={styles.rowSpacer} />
                <MaterialIcons color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsPasswordModalVisible(true)} style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                  <MaterialIcons color="#fff" name="lock" size={20} />
                </View>
                <Text style={styles.rowLabel}>Change Password</Text>
                <View style={styles.rowSpacer} />
                <MaterialIcons color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSignOut} style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#fe9400' }]}>
                  <MaterialIcons color="#fff" name="logout" size={20} />
                </View>
                <Text style={styles.rowLabel}>Sign Out</Text>
                <View style={styles.rowSpacer} />
                <MaterialIcons color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDeleteAccount} style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#d9534f' }]}>
                  <MaterialIcons color="#fff" name="delete" size={20} />
                </View>
                <Text style={[styles.rowLabel, styles.deleteAccountLabel]}>Delete Account</Text>
                <View style={styles.rowSpacer} />
                <MaterialIcons color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Help & Support</Text>

              <TouchableOpacity onPress={() => setIsBugModalVisible(true)} style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
                  <MaterialIcons color="#fff" name="flag" size={20} />
                </View>
                <Text style={styles.rowLabel}>Report Bug</Text>
                <View style={styles.rowSpacer} />
                <MaterialIcons color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>

              <TouchableOpacity onPress={navigateToReportUserScreen} style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                  <MaterialIcons color="#fff" name="mail" size={20} />
                </View>
                <Text style={styles.rowLabel}>Report Another User</Text>
                <View style={styles.rowSpacer} />
                <MaterialIcons color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>

      {/* Change Email Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEmailModalVisible}
        onRequestClose={() => {
          setIsEmailModalVisible(!isEmailModalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Change Email Address</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter new email"
            value={newEmail}
            onChangeText={setNewEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonConfirm]}
              onPress={handleChangeEmail}
            >
              <Text style={styles.modalButtonText}>Change Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={() => setIsEmailModalVisible(!isEmailModalVisible)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPasswordModalVisible}
        onRequestClose={() => {
          setIsPasswordModalVisible(!isPasswordModalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Change Password</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonConfirm]}
              onPress={handleChangePassword}
            >
              <Text style={styles.modalButtonText}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={() => setIsPasswordModalVisible(!isPasswordModalVisible)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Report Bug Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isBugModalVisible}
        onRequestClose={() => {
          setIsBugModalVisible(!isBugModalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Report a Bug</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Describe the bug"
            value={bugDescription}
            onChangeText={setBugDescription}
            autoCapitalize="none"
            multiline
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonConfirm]}
              onPress={handleSendBugReport}
            >
              <Text style={styles.modalButtonText}>Send Report</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={() => setIsBugModalVisible(!isBugModalVisible)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  profile: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#414d63',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    paddingBottom: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#9e9e9e',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '400',
    color: '#0c0c0c',
  },
  rowSpacer: {
    flex: 1,
  },
  deleteAccountLabel: {
    fontWeight: 'bold',
    color: '#d9534f',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  backgroundImageStyle: {
    opacity: 0.25,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    width: '45%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  modalButtonConfirm: {
    backgroundColor: '#007afe',
    borderColor: '#007afe',
  },
  modalButtonCancel: {
    backgroundColor: '#d9534f',
    borderColor: '#d9534f',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});


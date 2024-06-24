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
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';

export default function SettingsScreen() {
  const [pushNotifications, setPushNotifications] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchName = async () => {
      try {
        const docRef = doc(db, 'users', 'userID'); // Adjust 'userID' as per your Firestore document structure
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

  const handleSignOut = () => {
    Alert.alert('Signed out', 'You have been signed out successfully.');
  };

  const handleDeleteAccount = () => {
    Alert.alert('Delete Account', 'Your account has been deleted.');
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
            {/* Logo above profile name */}
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

              <TouchableOpacity onPress={() => { /* handle onPress */ }} style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                  <MaterialIcons color="#fff" name="email" size={20} />
                </View>
                <Text style={styles.rowLabel}>Change Email Address</Text>
                <View style={styles.rowSpacer} />
                <MaterialIcons color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { /* handle onPress */ }} style={styles.row}>
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

              <TouchableOpacity onPress={() => { /* handle onPress */ }} style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
                  <MaterialIcons color="#fff" name="flag" size={20} />
                </View>
                <Text style={styles.rowLabel}>Report Bug</Text>
                <View style={styles.rowSpacer} />
                <MaterialIcons color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { /* handle onPress */ }} style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                  <MaterialIcons color="#fff" name="mail" size={20} />
                </View>
                <Text style={styles.rowLabel}>Contact Us</Text>
                <View style={styles.rowSpacer} />
                <MaterialIcons color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Legal</Text>

              <TouchableOpacity onPress={() => { /* handle onPress */ }} style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
                  <MaterialIcons color="#fff" name="description" size={20} />
                </View>
                <Text style={styles.rowLabel}>Terms and Conditions</Text>
                <View style={styles.rowSpacer} />
                <MaterialIcons color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { /* handle onPress */ }} style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
                  <MaterialIcons color="#fff" name="privacy-tip" size={20} />
                </View>
                <Text style={styles.rowLabel}>Privacy Policy</Text>
                <View style={styles.rowSpacer} />
                <MaterialIcons color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>

              <TouchableOpacity onPress={() => { /* handle onPress */ }} style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                  <MaterialIcons color="#fff" name="info" size={20} />
                </View>
                <Text style={styles.rowLabel}>App Version</Text>
                <View style={styles.rowSpacer} />
                <MaterialIcons color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => { /* handle onPress */ }} style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                  <MaterialIcons color="#fff" name="star" size={20} />
                </View>
                <Text style={styles.rowLabel}>Acknowledgments</Text>
                <View style={styles.rowSpacer} />
                <MaterialIcons color="#C6C6C6" name="chevron-right" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
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
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const router = useRouter();

  const handleAuth = async () => {
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        if (auth.currentUser) {
          await setDoc(doc(db, 'users', auth.currentUser.uid), { initialSetupComplete: false });
        }
        setIsSignup(false); // Switch back to login mode after successful signup
        Alert.alert('Success', 'Account created successfully!');
        router.replace('LookingFor'); // Navigate to LookingFor screen after sign-up
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        if (auth.currentUser) {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          const userData = userDoc.data();
          if (userData && userData.initialSetupComplete) {
            router.replace('(tabs)/index'); // Navigate directly to the main tab screen if setup is complete
          } else {
            router.replace('LookingFor'); // Navigate to LookingFor screen if setup is not complete
          }
        }
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/swanlogo.png')} style={styles.logo} />
      <Text style={styles.appTitle}>Sol-Mate</Text>
      <Text style={styles.tagline}>Connecting matches, one algorithm at a time</Text>
      {error && <Text style={styles.error}>{`Firebase: ${error}`}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>{isSignup ? 'Sign Up' : 'Login'}</Text>
      </TouchableOpacity>
      {!isSignup && (
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={styles.switchText}>
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFCFE7',
  },
  logo: {
    width: 200,
    height: 180,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 65,
    fontFamily: 'Atop',
    color: '#CF297E',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 15,
    color: '#555',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    width: '40%',
    backgroundColor: '#CF297E',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  switchText: {
    color: '#C63B85',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  forgotPassword: {
    color: '#C63B85',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;

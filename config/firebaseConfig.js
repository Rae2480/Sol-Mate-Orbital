// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpGxka5IiaPSjqxFJdYC_cDhSMYWy_MOA",
  authDomain: "sol-mate-38260.firebaseapp.com",
  projectId: "sol-mate-38260",
  storageBucket: "sol-mate-38260.appspot.com",
  messagingSenderId: "45855893342",
  appId: "1:45855893342:web:517dbab69072188ce791cf",
  measurementId: "G-G1TNQ3HW2J"
 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db };


// // export app? 
// // export {app, auth}
// //write everything here since too laggy
// //authcontext file 
// import { auth } from "firebase/fire";
// call authcontext
// const AuthContext = React.createContext();
// export function AuthProvider({ children }){
// const [currentUser, setCurrentUser] = useState(null);
// const [UserLoggedIn, setUserLoggedIn] = useState(false);
// const [loading, setLoading] = useState(true);


// import React, { useContext, useState, useEffect } from "react";
// import { auth } from "../../firebase/firebase";
// // import { GoogleAuthProvider } from "firebase/auth";
// import { onAuthStateChanged } from "firebase/auth";

// const AuthContext = React.createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userLoggedIn, setUserLoggedIn] = useState(false);
//   const [isEmailUser, setIsEmailUser] = useState(false);
//   const [isGoogleUser, setIsGoogleUser] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, initializeUser);
//     return unsubscribe;
//   }, []);

//   async function initializeUser(user) {
//     if (user) {

//       setCurrentUser({ ...user });

//       // check if provider is email and password login
//       const isEmail = user.providerData.some(
//         (provider) => provider.providerId === "password"
//       );
//       setIsEmailUser(isEmail);

//       // check if the auth provider is google or not
//     //   const isGoogle = user.providerData.some(
//     //     (provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID
//     //   );
//     //   setIsGoogleUser(isGoogle);

//       setUserLoggedIn(true);
//     } else {
//       setCurrentUser(null);
//       setUserLoggedIn(false);
//     }

//     setLoading(false);
//   }

//   const value = {
//     userLoggedIn,
//     isEmailUser,
//     isGoogleUser,
//     currentUser,
//     setCurrentUser
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

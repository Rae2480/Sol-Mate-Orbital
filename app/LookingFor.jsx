import * as React from "react";
import { Image, ImageBackground, TextInput, Alert } from "react-native";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "../config/firebaseConfig"; // Adjust the path as needed

const LookingFor = () => {
    const navigation = useNavigation();
    const [name, setName] = React.useState('');

    const handleButtonPress = async (selection) => {
        try {
            await addDoc(collection(db, "userSelections"), {
                name: name,
                selection: selection,
                timestamp: new Date(),
            });
            navigation.navigate(selection, { name }); // Pass the name as a parameter
        } catch (e) {
            console.error("Error adding document: ", e);
            Alert.alert("Error", "Failed to save your selection.");
        }
    };

    return (
        <ImageBackground source={require("../assets/images/Whatareyoulookingfor.png")} style={styles.signUp}>
            <View style={styles.topContainer}>
                <Text style={{ color: "white", fontSize: widthPercentageToDP(5) }}>Answering Questions</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.nameContainer}>
                    <Image style={styles.icon} contentFit="cover" source={require("../assets/images/swanlogo.png")} />
                    <Text style={styles.sectionTitle}>What is your name?</Text>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={setName}
                />
                <Text style={styles.sectionTitle}>What are you looking for?</Text>
                <View style={{ gap: 10, marginTop: -10 }}>
                    <TouchableOpacity onPress={() => handleButtonPress("Friends")} activeOpacity={0.7} style={styles.buttonContainer}>
                        <Image style={styles.buttonBackgroundImage} contentFit="cover" source={require("../assets/images/Rectangle9.png")} />
                        <Text style={styles.buttonText}>Friends</Text>
                        <Image style={styles.friendsIcon} contentFit="cover" source={require("../assets/images/Frame.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleButtonPress("Roommates")} activeOpacity={0.7} style={styles.buttonContainer}>
                        <Image style={styles.buttonBackgroundImage} contentFit="cover" source={require("../assets/images/Group20.png")} />
                        <Text style={styles.buttonText}>Roommates</Text>
                        <Image style={styles.roommatesIcon} contentFit="cover" source={require("../assets/images/Vector.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleButtonPress("ProjectMate")} activeOpacity={0.7} style={styles.buttonContainer}>
                        <Image style={styles.buttonBackgroundImage} contentFit="cover" source={require("../assets/images/Group21.png")} />
                        <Text style={styles.buttonText}>Project Mate</Text>
                        <Image style={styles.projectMateIcon} contentFit="cover" source={require("../assets/images/Frame1.png")} />
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    icon: {
        width: 240,
        height: 210,
    },
    signUp: {
        flex: 1,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "white",
    },
    topContainer: { 
        height: heightPercentageToDP(10), 
        backgroundColor: "rgba(0,0,0,0.4)", 
        alignItems: "center", 
        justifyContent: "flex-end", 
        paddingBottom: 5 
    },
    container: { 
        backgroundColor: "rgba(244,244,244,0.9)", 
        height: heightPercentageToDP(80), 
        borderRadius: widthPercentageToDP(5), 
        marginTop: heightPercentageToDP(2), 
        marginHorizontal: widthPercentageToDP(5), 
        paddingHorizontal: widthPercentageToDP(5) 
    },
    nameContainer: {
        alignItems: "center",
        gap: widthPercentageToDP(2),
        marginTop: heightPercentageToDP(3),
        marginBottom: heightPercentageToDP(-1) // gap between what is your name? and the input box
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: heightPercentageToDP(2), // gap between the name input box and what are you looking for?
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontWeight: "bold",
        fontSize: widthPercentageToDP(6),
        marginBottom: 21 // Adjust the gap between what are you looking for? and the options
    },
    buttonContainer: { 
        position: 'relative', 
        height: heightPercentageToDP(10), 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'row', 
        gap: 15 
    },
    buttonBackgroundImage: { 
        position: "absolute", 
        height: "100%", 
        width: "100%", 
        objectFit: "cover" 
    },
    buttonText: { 
        fontSize: widthPercentageToDP(5),
        fontFamily: 'MontserratB',  // Replace with your desired font family
        fontWeight: 'bold'            // Adjust font weight as needed
    },
    friendsIcon: { 
        height: 21, 
        width: 20 
    },
    roommatesIcon: { 
        height: 20, 
        width: 20 
    },
    projectMateIcon: { 
        height: 22, 
        width: 20 
    }
});

export default LookingFor;

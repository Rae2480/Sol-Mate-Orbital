import * as React from "react";
import { Image, ImageBackground, Alert } from "react-native";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import RadioButton from "../components/RadioButton";
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "../config/firebaseConfig"; // Adjust the path as needed

const ProjectMate = () => {
    const navigation = useNavigation();
    const [selectedOption, setSelectedOption] = React.useState('option1');
    const [selectedOption2, setSelectedOption2] = React.useState('option1');
    const [selectedImportant, setSelectedImportant] = React.useState('');
    const selectedColor = "#f08080"; // Define your selected color

    const handleSaveData = async () => {
        try {
            await addDoc(collection(db, "projectMateResponses"), {
                workStyle: selectedOption,
                acceptableWorkStyle: selectedOption2,
                importance: selectedImportant,
                timestamp: new Date(),
            });
            Alert.alert("Success", "Your responses have been saved!");
            navigation.navigate("(tabs)"); // Navigate to the next screen
        } catch (e) {
            console.error("Error adding document: ", e);
            Alert.alert("Error", "Failed to save your responses.");
        }
    };

    return (
        <ImageBackground source={require("../assets/images/Friends1.png")} style={styles.signUp}>
            <View style={styles.topContainer}>
                <Text style={{ color: "white", fontSize: widthPercentageToDP(5) }}>Answering Questions</Text>
            </View>
            <View style={styles.container}>
                <View style={{ alignItems: "center", gap: widthPercentageToDP(2), marginTop: heightPercentageToDP(5) }}>
                    <Text style={{ fontWeight: "bold", fontSize: widthPercentageToDP(6) }}>What is your preferred work style?</Text>
                </View>

                <View>
                    <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Your answer:</Text>
                    <View style={styles.answerContainer}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontSize: 17, width: "70%" }}>Regular meetings and discussions</Text>
                            <RadioButton
                                selected={selectedOption === 'option1'}
                                onPress={() => setSelectedOption('option1')}
                                selectedColor={selectedColor} // Pass selectedColor prop
                            />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontSize: 17, width: "90%" }}>Working independently with occasional check-ins</Text>
                            <RadioButton
                                selected={selectedOption === 'option2'}
                                onPress={() => setSelectedOption('option2')}
                                selectedColor={selectedColor} // Pass selectedColor prop
                            />
                        </View>
                    </View>
                </View>

                <View>
                    <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Answer you’ll accept:</Text>
                    <View style={styles.acceptableAnswerContainer}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontSize: 17, width: "70%" }}>Regular meetings and discussions</Text>
                            <RadioButton
                                selected={selectedOption2 === 'option1'}
                                onPress={() => setSelectedOption2('option1')}
                                selectedColor={selectedColor} // Pass selectedColor prop
                            />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontSize: 17, width: "90%" }}>Working independently with occasional check-ins</Text>
                            <RadioButton
                                selected={selectedOption2 === 'option2'}
                                onPress={() => setSelectedOption2('option2')}
                                selectedColor={selectedColor} // Pass selectedColor prop
                            />
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <Text style={{ fontSize: 17, width: "70%" }}>Both</Text>
                            <RadioButton
                                selected={selectedOption2 === 'both'}
                                onPress={() => setSelectedOption2('both')}
                                selectedColor={selectedColor} // Pass selectedColor prop
                            />
                        </View>
                    </View>
                </View>

                <View style={{ gap: 2 }}>
                    <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>Importance:</Text>
                    <View style={styles.importantButtonContainer}>
                        <TouchableOpacity onPress={() => setSelectedImportant("A little")} style={[styles.importButton, { backgroundColor: selectedImportant === "A little" ? "#f08080" : "transparent" }]}>
                            <Text style={{ color: "#4f000b" }}>A little</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedImportant("Somewhat")} style={[styles.importButton, { backgroundColor: selectedImportant === "Somewhat" ? "#f08080" : "transparent" }]}>
                            <Text style={{ color: "#4f000b" }}>Somewhat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedImportant("Very")} style={[styles.importButton, { backgroundColor: selectedImportant === "Very" ? "#f08080" : "transparent" }]}>
                            <Text style={{ color: "#4f000b" }}>Very</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("LookingFor")} activeOpacity={0.7} style={{ gap: 5, alignItems: "center" }}>
                        <Image style={styles.backIcon} source={require("../assets/images/back.png")} />
                        <Text style={{ fontSize: widthPercentageToDP(4) }}>Previous</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSaveData} activeOpacity={0.7} style={{ gap: 5 }}>
                        <Image style={styles.forwardIcon} source={require("../assets/images/forward.png")} />
                        <Text style={{ fontSize: widthPercentageToDP(4) }}>Skip</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    icon: {
        width: 240,
        height: 184,
    },
    signUp: {
        flex: 1,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "white",
    },
    answerContainer: {
        gap: 5,
        paddingHorizontal: widthPercentageToDP(7),
        paddingVertical: widthPercentageToDP(3.5),
        height: heightPercentageToDP(14),
        borderWidth: 2,
        borderColor: "#f08080",
        borderRadius: 21,
        backgroundColor: "#fbc4ab",
        shadowColor: "#9B004F",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.45,
        shadowRadius: 2.50,
        elevation: 3,
    },
    acceptableAnswerContainer: {
        gap: 5,
        paddingHorizontal: widthPercentageToDP(5),
        paddingVertical: widthPercentageToDP(3.5),
        height: heightPercentageToDP(17), 
        borderWidth: 2,
        borderColor: "#f08080",
        borderRadius: 21,
        backgroundColor: "#fbc4ab",
        shadowColor: "#9B004F",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.45,
        shadowRadius: 2.50,
        elevation: 3,
    },
    topContainer: {
        height: heightPercentageToDP(10),
        backgroundColor: "#FF8DB3",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 5,
    },
    container: {
        gap: widthPercentageToDP(10),
        backgroundColor: "rgba(244,244,244,0.9)",
        height: heightPercentageToDP(80),
        borderRadius: widthPercentageToDP(5),
        marginTop: heightPercentageToDP(2),
        marginHorizontal: widthPercentageToDP(5),
        paddingHorizontal: widthPercentageToDP(5),
    },
    sectionTitle: {
        fontSize: 17,
    },
    importantButtonContainer: {
        backgroundColor: "#fbc4ab",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: "#F08080",
        borderWidth: 2,
        height: heightPercentageToDP(5),
    },
    importButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRightColor: "#F08080",
        borderRightWidth: 1,
        height: "100%",
    },
    bottomButtonContainer: {
        marginTop: heightPercentageToDP(-3.5),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    backIcon: {
        height: 18,
        width: 20,
        objectFit: "cover",
    },
    forwardIcon: {
        height: 25,
        width: 20,
        objectFit: "cover",
    },
});

export default ProjectMate;

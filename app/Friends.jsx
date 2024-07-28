import * as React from "react";
import { Image, ImageBackground, ScrollView, Alert } from "react-native";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import RadioButton from "../components/RadioButton";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig"; // Adjust the path as needed

const Friends = () => {
    const navigation = useNavigation();
    const userId = 'uniqueUserID'; // Replace with the actual user ID
    const [selectedOptions, setSelectedOptions] = React.useState({
        sportsFitness: 'Sports and fitness',
        sportsFitnessAccept: [],
        sportsFitnessImportance: '',
        socialInteraction: 'Prefer to meet frequently',
        socialInteractionAccept: [],
        socialInteractionImportance: '',
        groupSize: 'Prefer one-on-one interactions',
        groupSizeAccept: [],
        groupSizeImportance: '',
        introvertExtrovert: 'Introvert',
        introvertExtrovertAccept: [],
        introvertExtrovertImportance: '',
        communicationStyle: 'Direct and straightforward',
        communicationStyleAccept: [],
        communicationStyleImportance: ''
    });

    const handleSaveData = async () => {
        try {
            await setDoc(doc(db, "friendsPreferences", userId), {
                ...selectedOptions,
                timestamp: new Date(),
            });
            Alert.alert("Success", "Your responses have been saved!");
            navigation.navigate("(tabs)"); // Navigate to the next screen
        } catch (e) {
            console.error("Error adding document: ", e);
            Alert.alert("Error", "Failed to save your responses.");
        }
    };

    const fetchData = async () => {
        try {
            const docRef = doc(db, "friendsPreferences", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSelectedOptions(docSnap.data());
            }
        } catch (e) {
            console.error("Error fetching document: ", e);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const handleCheckboxChange = (key, value) => {
        setSelectedOptions(prevState => ({
            ...prevState,
            [key]: prevState[key].includes(value) ? prevState[key].filter(item => item !== value) : [...prevState[key], value]
        }));
    };

    return (
        <ImageBackground source={require("../assets/images/Friends1.png")} style={styles.signUp}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.topContainer}>
                    <Text style={{ color: "white", fontSize: widthPercentageToDP(5) }}>Answering Questions</Text>
                </View>
                <View style={styles.container}>
                    <Text style={styles.mainTitle}>Friend Preferences:</Text>

                    <Text style={styles.subTitle}>Hobbies</Text>
                    <Text style={styles.sectionTitle}>Your answer:</Text>
                    <View style={styles.answerContainer}>
                        {['Sports and fitness', 'Reading and writing', 'Arts and crafts', 'Gaming', 'Other (specify)'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.sportsFitness === option}
                                    onPress={() => setSelectedOptions(prevState => ({ ...prevState, sportsFitness: option }))}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Answer you'll accept:</Text>
                    <View style={styles.acceptableAnswerContainer}>
                        {['Sports and fitness', 'Reading and writing', 'Arts and crafts', 'Gaming', 'Others'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.sportsFitnessAccept.includes(option)}
                                    onPress={() => handleCheckboxChange('sportsFitnessAccept', option)}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Importance:</Text>
                    <View style={styles.importantButtonContainer}>
                        {['Important', 'Somewhat important', 'Not important'].map(option => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => setSelectedOptions(prevState => ({ ...prevState, sportsFitnessImportance: option }))}
                                style={[styles.importButton, { backgroundColor: selectedOptions.sportsFitnessImportance === option ? "#f08080" : "transparent" }]}
                            >
                                <Text style={{ color: selectedOptions.sportsFitnessImportance === option ? "#fff" : "#4f000b" }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.subTitle}>Social Interaction</Text>
                    <Text style={styles.sectionTitle}>Your answer:</Text>
                    <View style={styles.answerContainer}>
                        {['Prefer to meet frequently', 'Prefer occasional meetups', 'Prefer online interactions'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.socialInteraction === option}
                                    onPress={() => setSelectedOptions(prevState => ({ ...prevState, socialInteraction: option }))}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Answer you'll accept:</Text>
                    <View style={styles.acceptableAnswerContainer}>
                        {['Prefer to meet frequently', 'Prefer occasional meetups', 'Prefer online interactions'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.socialInteractionAccept.includes(option)}
                                    onPress={() => handleCheckboxChange('socialInteractionAccept', option)}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Importance:</Text>
                    <View style={styles.importantButtonContainer}>
                        {['Important', 'Somewhat important', 'Not important'].map(option => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => setSelectedOptions(prevState => ({ ...prevState, socialInteractionImportance: option }))}
                                style={[styles.importButton, { backgroundColor: selectedOptions.socialInteractionImportance === option ? "#f08080" : "transparent" }]}
                            >
                                <Text style={{ color: selectedOptions.socialInteractionImportance === option ? "#fff" : "#4f000b" }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.subTitle}>Group Size</Text>
                    <Text style={styles.sectionTitle}>Your answer:</Text>
                    <View style={styles.answerContainer}>
                        {['Prefer one-on-one interactions', 'Prefer small groups (3-5 people)', 'Enjoy large gatherings'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.groupSize === option}
                                    onPress={() => setSelectedOptions(prevState => ({ ...prevState, groupSize: option }))}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Answer you'll accept:</Text>
                    <View style={styles.acceptableAnswerContainer}>
                        {['Prefer one-on-one interactions', 'Prefer small groups (3-5 people)', 'Enjoy large gatherings'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.groupSizeAccept.includes(option)}
                                    onPress={() => handleCheckboxChange('groupSizeAccept', option)}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Importance:</Text>
                    <View style={styles.importantButtonContainer}>
                        {['Important', 'Somewhat important', 'Not important'].map(option => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => setSelectedOptions(prevState => ({ ...prevState, groupSizeImportance: option }))}
                                style={[styles.importButton, { backgroundColor: selectedOptions.groupSizeImportance === option ? "#f08080" : "transparent" }]}
                            >
                                <Text style={{ color: selectedOptions.groupSizeImportance === option ? "#fff" : "#4f000b" }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.subTitle}>Introvert/Extrovert</Text>
                    <Text style={styles.sectionTitle}>Your answer:</Text>
                    <View style={styles.answerContainer}>
                        {['Introvert', 'Ambivert', 'Extrovert'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.introvertExtrovert === option}
                                    onPress={() => setSelectedOptions(prevState => ({ ...prevState, introvertExtrovert: option }))}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Answer you'll accept:</Text>
                    <View style={styles.acceptableAnswerContainer}>
                        {['Introvert', 'Ambivert', 'Extrovert'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.introvertExtrovertAccept.includes(option)}
                                    onPress={() => handleCheckboxChange('introvertExtrovertAccept', option)}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Importance:</Text>
                    <View style={styles.importantButtonContainer}>
                        {['Important', 'Somewhat important', 'Not important'].map(option => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => setSelectedOptions(prevState => ({ ...prevState, introvertExtrovertImportance: option }))}
                                style={[styles.importButton, { backgroundColor: selectedOptions.introvertExtrovertImportance === option ? "#f08080" : "transparent" }]}
                            >
                                <Text style={{ color: selectedOptions.introvertExtrovertImportance === option ? "#fff" : "#4f000b" }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.subTitle}>Communication Style</Text>
                    <Text style={styles.sectionTitle}>Your answer:</Text>
                    <View style={styles.answerContainer}>
                        {['Direct and straightforward', 'Thoughtful and considerate', 'Humorous and light-hearted'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.communicationStyle === option}
                                    onPress={() => setSelectedOptions(prevState => ({ ...prevState, communicationStyle: option }))}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Answer you'll accept:</Text>
                    <View style={styles.acceptableAnswerContainer}>
                        {['Direct and straightforward', 'Thoughtful and considerate', 'Humorous and light-hearted'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.communicationStyleAccept.includes(option)}
                                    onPress={() => handleCheckboxChange('communicationStyleAccept', option)}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Importance:</Text>
                    <View style={styles.importantButtonContainer}>
                        {['Important', 'Somewhat important', 'Not important'].map(option => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => setSelectedOptions(prevState => ({ ...prevState, communicationStyleImportance: option }))}
                                style={[styles.importButton, { backgroundColor: selectedOptions.communicationStyleImportance === option ? "#f08080" : "transparent" }]}
                            >
                                <Text style={{ color: selectedOptions.communicationStyleImportance === option ? "#fff" : "#4f000b" }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.bottomButtonContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={{ gap: 5, alignItems: "center" }}>
                            <Image style={styles.backIcon} source={require("../assets/images/back.png")} />
                            <Text style={{ fontSize: widthPercentageToDP(4) }}>Previous</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSaveData} activeOpacity={0.7} style={{ gap: 5 }}>
                            <Image style={styles.forwardIcon} source={require("../assets/images/forward.png")} />
                            <Text style={{ fontSize: widthPercentageToDP(4) }}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
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
    scrollViewContent: {
        paddingBottom: 20,
    },
    topContainer: {
        height: heightPercentageToDP(15),
        backgroundColor: "#FF5FB1",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 15,
    },
    container: {
        padding: widthPercentageToDP(5),
        backgroundColor: "rgba(244,244,244,0.9)",
        borderRadius: widthPercentageToDP(5),
        marginHorizontal: widthPercentageToDP(5),
        marginTop: heightPercentageToDP(2),
    },
    mainTitle: {
        fontSize: widthPercentageToDP(10),
        fontFamily: 'Montserrat',
        fontWeight: "bold",
        marginBottom: heightPercentageToDP(2),
    },
    subTitle: {
        fontSize: widthPercentageToDP(6),
        fontWeight: "bold",
        marginVertical: heightPercentageToDP(2),
    },
    sectionTitle: {
        fontSize: widthPercentageToDP(5),
        marginVertical: heightPercentageToDP(1),
    },
    answerContainer: {
        gap: 15,
        paddingHorizontal: widthPercentageToDP(5),
        paddingVertical: widthPercentageToDP(3.5),
        borderWidth: 2,
        borderColor: "#fbc4ab",
        borderRadius: 21,
        backgroundColor: "#FFDAB9",
        shadowColor: "#9B004F",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.45,
        shadowRadius: 2.50,
        elevation: 3,
        marginBottom: heightPercentageToDP(2),
    },
    acceptableAnswerContainer: {
        gap: 15,
        paddingHorizontal: widthPercentageToDP(5),
        paddingVertical: widthPercentageToDP(3.5),
        borderWidth: 2,
        borderColor: "#F08080",
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
        marginBottom: heightPercentageToDP(2),
    },
    optionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    importantButtonContainer: {
        backgroundColor: "#FF8DB3",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: "#CF297E",
        borderWidth: 2,
        height: heightPercentageToDP(5),
        marginBottom: heightPercentageToDP(2),
    },
    importButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        borderRightColor: "#CF297E",
        borderRightWidth: 1,
        height: "100%",
    },
    bottomButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: heightPercentageToDP(2),
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

export default Friends;

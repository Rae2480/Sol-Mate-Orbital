import * as React from "react";
import { Image, ImageBackground, ScrollView, Alert } from "react-native";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import RadioButton from "../components/RadioButton";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig"; // Adjust the path as needed

const Roommates = () => {
    const navigation = useNavigation();
    const userId = 'uniqueUserID'; // Replace with the actual user ID
    const [selectedOptions, setSelectedOptions] = React.useState({
        dailyRoutine: 'Early riser (6 AM - 8 AM)',
        dailyRoutineAccept: [],
        dailyRoutineImportance: '',
        cleanliness: 'Very important, I like everything to be spotless',
        cleanlinessAccept: [],
        cleanlinessImportance: '',
        guestFrequency: 'Frequently (several times a week)',
        guestFrequencyAccept: [],
        guestFrequencyImportance: '',
        noiseSensitivity: 'Very sensitive, I prefer a quiet environment',
        noiseSensitivityAccept: [],
        noiseSensitivityImportance: '',
        privacyNeeds: 'A lot, I prefer to have my own space and alone time',
        privacyNeedsAccept: [],
        privacyNeedsImportance: ''
    });

    const handleSaveData = async () => {
        try {
            await setDoc(doc(db, "roommatePreferences", userId), {
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
            const docRef = doc(db, "roommatePreferences", userId);
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
                    <Text style={styles.mainTitle}>Roommate Preferences:</Text>

                    <Text style={styles.subTitle}>Daily Routine</Text>
                    <Text style={styles.sectionTitle}>Your answer:</Text>
                    <View style={styles.answerContainer}>
                        {['Early riser (6 AM - 8 AM)', 'Mid-morning riser (8 AM - 10 AM)', 'Late riser (10 AM - 12 PM)', 'Night owl (12 PM - 6 AM)'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.dailyRoutine === option}
                                    onPress={() => setSelectedOptions(prevState => ({ ...prevState, dailyRoutine: option }))}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Answer you'll accept:</Text>
                    <View style={styles.acceptableAnswerContainer}>
                        {['Early riser (6 AM - 8 AM)', 'Mid-morning riser (8 AM - 10 AM)', 'Late riser (10 AM - 12 PM)', 'Night owl (12 PM - 6 AM)'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.dailyRoutineAccept.includes(option)}
                                    onPress={() => handleCheckboxChange('dailyRoutineAccept', option)}
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
                                onPress={() => setSelectedOptions(prevState => ({ ...prevState, dailyRoutineImportance: option }))}
                                style={[styles.importButton, { backgroundColor: selectedOptions.dailyRoutineImportance === option ? "#f08080" : "transparent" }]}
                            >
                                <Text style={{ color: selectedOptions.dailyRoutineImportance === option ? "#fff" : "#4f000b" }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.subTitle}>Cleanliness</Text>
                    <Text style={styles.sectionTitle}>Your answer:</Text>
                    <View style={styles.answerContainer}>
                        {['Very important, I like everything to be spotless', 'Moderately important, I like things to be tidy', 'Not very important, I’m okay with a bit of mess'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.cleanliness === option}
                                    onPress={() => setSelectedOptions(prevState => ({ ...prevState, cleanliness: option }))}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Answer you'll accept:</Text>
                    <View style={styles.acceptableAnswerContainer}>
                        {['Very important', 'Moderately important', 'Not very important'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.cleanlinessAccept.includes(option)}
                                    onPress={() => handleCheckboxChange('cleanlinessAccept', option)}
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
                                onPress={() => setSelectedOptions(prevState => ({ ...prevState, cleanlinessImportance: option }))}
                                style={[styles.importButton, { backgroundColor: selectedOptions.cleanlinessImportance === option ? "#f08080" : "transparent" }]}
                            >
                                <Text style={{ color: selectedOptions.cleanlinessImportance === option ? "#fff" : "#4f000b" }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.subTitle}>Guest Frequency</Text>
                    <Text style={styles.sectionTitle}>Your answer:</Text>
                    <View style={styles.answerContainer}>
                        {['Frequently (several times a week)', 'Occasionally (once or twice a month)', 'Rarely (a few times a year)', 'Never'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.guestFrequency === option}
                                    onPress={() => setSelectedOptions(prevState => ({ ...prevState, guestFrequency: option }))}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Answer you'll accept:</Text>
                    <View style={styles.acceptableAnswerContainer}>
                        {['Frequently (several times a week)', 'Occasionally (once or twice a month)', 'Rarely (a few times a year)', 'Never'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.guestFrequencyAccept.includes(option)}
                                    onPress={() => handleCheckboxChange('guestFrequencyAccept', option)}
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
                                onPress={() => setSelectedOptions(prevState => ({ ...prevState, guestFrequencyImportance: option }))}
                                style={[styles.importButton, { backgroundColor: selectedOptions.guestFrequencyImportance === option ? "#f08080" : "transparent" }]}
                            >
                                <Text style={{ color: selectedOptions.guestFrequencyImportance === option ? "#fff" : "#4f000b" }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.subTitle}>Noise Sensitivity</Text>
                    <Text style={styles.sectionTitle}>Your answer:</Text>
                    <View style={styles.answerContainer}>
                        {['Very sensitive, I prefer a quiet environment', 'Moderately sensitive, occasional noise is okay', 'Not sensitive, I’m okay with a noisy environment'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.noiseSensitivity === option}
                                    onPress={() => setSelectedOptions(prevState => ({ ...prevState, noiseSensitivity: option }))}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Answer you'll accept:</Text>
                    <View style={styles.acceptableAnswerContainer}>
                        {['Very sensitive', 'Moderately sensitive', 'Not sensitive'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.noiseSensitivityAccept.includes(option)}
                                    onPress={() => handleCheckboxChange('noiseSensitivityAccept', option)}
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
                                onPress={() => setSelectedOptions(prevState => ({ ...prevState, noiseSensitivityImportance: option }))}
                                style={[styles.importButton, { backgroundColor: selectedOptions.noiseSensitivityImportance === option ? "#f08080" : "transparent" }]}
                            >
                                <Text style={{ color: selectedOptions.noiseSensitivityImportance === option ? "#fff" : "#4f000b" }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.subTitle}>Privacy Needs</Text>
                    <Text style={styles.sectionTitle}>Your answer:</Text>
                    <View style={styles.answerContainer}>
                        {['A lot, I prefer to have my own space and alone time', 'Moderate, I enjoy socializing but need some alone time', 'Minimal, I’m very social and don’t need much privacy'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.privacyNeeds === option}
                                    onPress={() => setSelectedOptions(prevState => ({ ...prevState, privacyNeeds: option }))}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Answer you'll accept:</Text>
                    <View style={styles.acceptableAnswerContainer}>
                        {['A lot', 'Moderate', 'Minimal'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.privacyNeedsAccept.includes(option)}
                                    onPress={() => handleCheckboxChange('privacyNeedsAccept', option)}
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
                                onPress={() => setSelectedOptions(prevState => ({ ...prevState, privacyNeedsImportance: option }))}
                                style={[styles.importButton, { backgroundColor: selectedOptions.privacyNeedsImportance === option ? "#f08080" : "transparent" }]}
                            >
                                <Text style={{ color: selectedOptions.privacyNeedsImportance === option ? "#fff" : "#4f000b" }}>{option}</Text>
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
        borderRightWidth: 2,
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

export default Roommates;

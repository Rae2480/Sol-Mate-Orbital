import * as React from "react";
import { Image, ImageBackground, ScrollView, Alert } from "react-native";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import RadioButton from "../components/RadioButton";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig"; // Adjust the path as needed

const WorkHabits = () => {
    const navigation = useNavigation();
    const userId = 'uniqueUserID'; // Replace with the actual user ID
    const [selectedOptions, setSelectedOptions] = React.useState({
        timeCommitment: 'Less than 5 hours per week',
        timeCommitmentAccept: [],
        timeCommitmentImportance: '',
        workStyle: 'Prefer regular meetings and discussions',
        workStyleAccept: [],
        workStyleImportance: '',
        primarySkillSet: 'Programming (specify languages)',
        primarySkillSetAccept: [],
        primarySkillSetImportance: '',
        experienceLevel: 'Beginner',
        experienceLevelAccept: [],
        experienceLevelImportance: '',
        preferredRole: 'Leader',
        preferredRoleAccept: [],
        preferredRoleImportance: ''
    });

    const handleSaveData = async () => {
        try {
            await setDoc(doc(db, "workHabitsPreferences", userId), {
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
            const docRef = doc(db, "workHabitsPreferences", userId);
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
                    <Text style={styles.mainTitle}>Work Habits:</Text>

                    <Text style={styles.subTitle}>Time Commitment</Text>
                    <Text style={styles.sectionTitle}>Your answer:</Text>
                    <View style={styles.answerContainer}>
                        {['Less than 5 hours per week', '5-10 hours per week', '10-15 hours per week', 'More than 15 hours per week'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text style={styles.optionText}>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.timeCommitment === option}
                                    onPress={() => setSelectedOptions(prevState => ({ ...prevState, timeCommitment: option }))}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Answer you'll accept:</Text>
                    <View style={styles.acceptableAnswerContainer}>
                        {['Less than 5 hours per week', '5-10 hours per week', '10-15 hours per week', 'More than 15 hours per week'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text style={styles.optionText}>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.timeCommitmentAccept.includes(option)}
                                    onPress={() => handleCheckboxChange('timeCommitmentAccept', option)}
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
                                onPress={() => setSelectedOptions(prevState => ({ ...prevState, timeCommitmentImportance: option }))}
                                style={[styles.importButton, { backgroundColor: selectedOptions.timeCommitmentImportance === option ? "#f08080" : "transparent" }]}
                            >
                                <Text style={{ color: selectedOptions.timeCommitmentImportance === option ? "#fff" : "#4f000b" }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.subTitle}>Work Style</Text>
                    <Text style={styles.sectionTitle}>Your answer:</Text>
                    <View style={styles.answerContainer}>
                        {['Prefer regular meetings and discussions', 'Prefer working independently with occasional check-ins', 'Prefer a mix of both'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text style={styles.optionText}>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.workStyle === option}
                                    onPress={() => setSelectedOptions(prevState => ({ ...prevState, workStyle: option }))}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Answer you'll accept:</Text>
                    <View style={styles.acceptableAnswerContainer}>
                        {['Prefer regular meetings and discussions', 'Prefer working independently with occasional check-ins', 'Prefer a mix of both'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text style={styles.optionText}>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.workStyleAccept.includes(option)}
                                    onPress={() => handleCheckboxChange('workStyleAccept', option)}
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
                                onPress={() => setSelectedOptions(prevState => ({ ...prevState, workStyleImportance: option }))}
                                style={[styles.importButton, { backgroundColor: selectedOptions.workStyleImportance === option ? "#f08080" : "transparent" }]}
                            >
                                <Text style={{ color: selectedOptions.workStyleImportance === option ? "#fff" : "#4f000b" }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.subTitle}>Skills and Expertise</Text>
                    <Text style={styles.sectionTitle}>Primary Skill Set</Text>
                    <View style={styles.answerContainer}>
                        {['Programming (specify languages)', 'Design (UI/UX)', 'Project Management', 'Other (specify)'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text style={styles.optionText}>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.primarySkillSet === option}
                                    onPress={() => setSelectedOptions(prevState => ({ ...prevState, primarySkillSet: option }))}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Answer you'll accept:</Text>
                    <View style={styles.acceptableAnswerContainer}>
                        {['Programming (specify languages)', 'Design (UI/UX)', 'Project Management', 'Other (specify)'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text style={styles.optionText}>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.primarySkillSetAccept.includes(option)}
                                    onPress={() => handleCheckboxChange('primarySkillSetAccept', option)}
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
                                onPress={() => setSelectedOptions(prevState => ({ ...prevState, primarySkillSetImportance: option }))}
                                style={[styles.importButton, { backgroundColor: selectedOptions.primarySkillSetImportance === option ? "#f08080" : "transparent" }]}
                            >
                                <Text style={{ color: selectedOptions.primarySkillSetImportance === option ? "#fff" : "#4f000b" }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.subTitle}>Experience Level</Text>
                    <Text style={styles.sectionTitle}>Your answer:</Text>
                    <View style={styles.answerContainer}>
                        {['Beginner', 'Intermediate', 'Advanced'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text style={styles.optionText}>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.experienceLevel === option}
                                    onPress={() => setSelectedOptions(prevState => ({ ...prevState, experienceLevel: option }))}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Answer you'll accept:</Text>
                    <View style={styles.acceptableAnswerContainer}>
                        {['Beginner', 'Intermediate', 'Advanced'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text style={styles.optionText}>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.experienceLevelAccept.includes(option)}
                                    onPress={() => handleCheckboxChange('experienceLevelAccept', option)}
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
                                onPress={() => setSelectedOptions(prevState => ({ ...prevState, experienceLevelImportance: option }))}
                                style={[styles.importButton, { backgroundColor: selectedOptions.experienceLevelImportance === option ? "#f08080" : "transparent" }]}
                            >
                                <Text style={{ color: selectedOptions.experienceLevelImportance === option ? "#fff" : "#4f000b" }}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.subTitle}>Project Preferences</Text>
                    <Text style={styles.sectionTitle}>Preferred Role</Text>
                    <View style={styles.answerContainer}>
                        {['Leader', 'Collaborator', 'Supporter'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text style={styles.optionText}>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.preferredRole === option}
                                    onPress={() => setSelectedOptions(prevState => ({ ...prevState, preferredRole: option }))}
                                    selectedColor="#f08080"
                                />
                            </View>
                        ))}
                    </View>
                    <Text style={styles.sectionTitle}>Answer you'll accept:</Text>
                    <View style={styles.acceptableAnswerContainer}>
                        {['Leader', 'Collaborator', 'Supporter'].map(option => (
                            <View key={option} style={styles.optionRow}>
                                <Text style={styles.optionText}>{option}</Text>
                                <RadioButton
                                    selected={selectedOptions.preferredRoleAccept.includes(option)}
                                    onPress={() => handleCheckboxChange('preferredRoleAccept', option)}
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
                                onPress={() => setSelectedOptions(prevState => ({ ...prevState, preferredRoleImportance: option }))}
                                style={[styles.importButton, { backgroundColor: selectedOptions.preferredRoleImportance === option ? "#f08080" : "transparent" }]}
                            >
                                <Text style={{ color: selectedOptions.preferredRoleImportance === option ? "#fff" : "#4f000b" }}>{option}</Text>
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
    optionText: {
        flex: 1,
        marginRight: 10,
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

export default WorkHabits;

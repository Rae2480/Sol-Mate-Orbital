import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

const AdditionalQuestionnaireScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { userType } = route.params;
    const [selectedOptions, setSelectedOptions] = React.useState({
        favoriteActivities: '',
        favoriteActivitiesAccept: [],
        favoriteActivitiesImportance: '',
        conflictResolution: '',
        conflictResolutionAccept: [],
        conflictResolutionImportance: '',
        sharingPersonalItems: '',
        sharingPersonalItemsAccept: [],
        sharingPersonalItemsImportance: '',
        projectType: '',
        projectTypeAccept: [],
        projectTypeImportance: '',
        studyWorkEnvironment: '',
        studyWorkEnvironmentAccept: [],
        studyWorkEnvironmentImportance: '',
        preferredCommunicationTools: '',
        preferredCommunicationToolsAccept: [],
        preferredCommunicationToolsImportance: ''
    });

    const handleSaveData = () => {
        Alert.alert("Success", "Your responses have been saved!");
        navigation.goBack();
    };

    const handleCheckboxChange = (key, value) => {
        setSelectedOptions(prevState => ({
            ...prevState,
            [key]: prevState[key].includes(value) ? prevState[key].filter(item => item !== value) : [...prevState[key], value]
        }));
    };

    const renderRoommateQuestions = () => (
        <View>
            {renderQuestionSection('Favorite Activities', 'favoriteActivities', ['Going to movies', 'Exploring new restaurants', 'Outdoor adventures', 'Attending social events'])}
            {renderQuestionSection('Conflict Resolution', 'conflictResolution', ['Directly and immediately', 'Calmly and rationally', 'I tend to avoid conflict'])}
            {renderQuestionSection('Sharing Personal Items', 'sharingPersonalItems', ['I’m okay with sharing most things', 'I’m okay with sharing some things', 'I prefer to keep personal items separate'])}
        </View>
    );

    const renderProjectMateQuestions = () => (
        <View>
            {renderQuestionSection('Project Type', 'projectType', ['Academic', 'Hackathon', 'Startup/Entrepreneurial', 'Other (specify)'])}
            {renderQuestionSection('Study/Work Environment', 'studyWorkEnvironment', ['Need quiet for studying/working', 'Okay with background noise', 'Prefer a lively environment'])}
            {renderQuestionSection('Preferred Communication Tools', 'preferredCommunicationTools', ['Email', 'Instant messaging', 'Video calls', 'In-person meetings'])}
        </View>
    );

    const renderQuestionSection = (title, key, options) => (
        <View>
            <Text style={styles.subTitle}>{title}</Text>
            <Text style={styles.sectionTitle}>Your answer:</Text>
            <View style={styles.answerContainer}>
                {options.map(option => (
                    <View key={option} style={styles.optionRow}>
                        <Text style={styles.optionText}>{option}</Text>
                        <TouchableOpacity
                            style={[styles.radioButton, selectedOptions[key] === option && styles.radioButtonSelected]}
                            onPress={() => setSelectedOptions(prevState => ({ ...prevState, [key]: option }))}
                        />
                    </View>
                ))}
            </View>
            <Text style={styles.sectionTitle}>Answer you'll accept:</Text>
            <View style={styles.acceptableAnswerContainer}>
                {options.map(option => (
                    <View key={option} style={styles.optionRow}>
                        <Text style={styles.optionText}>{option}</Text>
                        <TouchableOpacity
                            style={[styles.radioButton, selectedOptions[`${key}Accept`]?.includes(option) && styles.radioButtonSelected]}
                            onPress={() => handleCheckboxChange(`${key}Accept`, option)}
                        />
                    </View>
                ))}
            </View>
            <Text style={styles.sectionTitle}>Importance:</Text>
            <View style={styles.importantButtonContainer}>
                {['Important', 'Somewhat important', 'Not important'].map(option => (
                    <TouchableOpacity
                        key={option}
                        onPress={() => setSelectedOptions(prevState => ({ ...prevState, [`${key}Importance`]: option }))}
                        style={[styles.importButton, { backgroundColor: selectedOptions[`${key}Importance`] === option ? "#f08080" : "transparent" }]}
                    >
                        <Text style={{ color: selectedOptions[`${key}Importance`] === option ? "#fff" : "#4f000b" }}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <ImageBackground source={require('../assets/images/Friends1.png')} style={styles.signUp}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.topContainer}>
                    <Text style={{ color: "white", fontSize: widthPercentageToDP(5) }}>Answering Questions</Text>
                </View>
                <View style={styles.container}>
                    <Text style={styles.mainTitle}>Additional Questions:</Text>
                    {userType === 'Roommates' ? renderRoommateQuestions() : renderProjectMateQuestions()}
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
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#f08080',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        backgroundColor: '#f08080',
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

export default AdditionalQuestionnaireScreen;

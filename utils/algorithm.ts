interface Preferences {
    dailyRoutine: string;
    dailyRoutineAccept: string[];
    dailyRoutineImportance: 'Important' | 'Somewhat important' | 'Not important';
    cleanliness: string;
    cleanlinessAccept: string[];
    cleanlinessImportance: 'Important' | 'Somewhat important' | 'Not important';
    guestFrequency: string;
    guestFrequencyAccept: string[];
    guestFrequencyImportance: 'Important' | 'Somewhat important' | 'Not important';
    noiseSensitivity: string;
    noiseSensitivityAccept: string[];
    noiseSensitivityImportance: 'Important' | 'Somewhat important' | 'Not important';
    privacyNeeds: string;
    privacyNeedsAccept: string[];
    privacyNeedsImportance: 'Important' | 'Somewhat important' | 'Not important';
}

interface User {
    id: string;
    name: string;
    bio: string;
    photo: string;
    preferences: Preferences;
}

const importanceScores: { [key: string]: number } = {
    'Important': 3,
    'Somewhat important': 2,
    'Not important': 1
};

export function calculateCompatibility(user1: Preferences, user2: Preferences): number {
    const questions = [
        'dailyRoutine',
        'cleanliness',
        'guestFrequency',
        'noiseSensitivity',
        'privacyNeeds'
    ];

    let totalScore = 0;
    let maxScore = 0;

    questions.forEach((question) => {
        const user1Answer = user1[question as keyof Preferences] as string;
        const user1AcceptableAnswers = user1[`${question}Accept` as keyof Preferences] as string[];
        const user1Importance = user1[`${question}Importance` as keyof Preferences] as 'Important' | 'Somewhat important' | 'Not important';

        const user2Answer = user2[question as keyof Preferences] as string;
        const user2AcceptableAnswers = user2[`${question}Accept` as keyof Preferences] as string[];
        const user2Importance = user2[`${question}Importance` as keyof Preferences] as 'Important' | 'Somewhat important' | 'Not important';

        // Calculate points for user1
        if (user2AcceptableAnswers.includes(user1Answer)) {
            totalScore += importanceScores[user2Importance];
        }

        // Calculate points for user2
        if (user1AcceptableAnswers.includes(user2Answer)) {
            totalScore += importanceScores[user1Importance];
        }

        // Max score is the highest possible score
        maxScore += 2 * 3; // 2 users, each can give up to 3 points per question
    });

    return (totalScore / maxScore) * 100; // Return percentage compatibility
}

export function sortMatches(currentUser: User, potentialMatches: User[]): User[] {
    return potentialMatches.map(match => ({
        ...match,
        compatibilityScore: calculateCompatibility(currentUser.preferences, match.preferences)
    })).sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

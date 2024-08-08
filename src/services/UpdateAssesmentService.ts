import { Assessment, AssessmentQuestion, AssessmentSubject } from "@/utils/Interfaces";

export const updateAssessment = (): Assessment[] => {
    return [
        {
            userId: 1,
            studentName: 'Aanya Gupta',
            progress: 'Overall score :',
            score: 89
        },
        {
            userId: 2,
            studentName: 'Aisha Bhatt',
            progress: 'Not Started',
            score: 0
        },
        {
            userId: 3,
            studentName: 'Ankita Kulkarni',
            progress: 'In Progress',
            score: 0
        },
    ];
};

export const getAssessmentSubjects = (): AssessmentSubject[] => {
    return [
        {
            userId: 1,
            subject: 'Reading',
            score: '210/250',
            date:'2 Feb, 2024'
        },
        {
            userId: 2,
            subject: 'Writing',
            score: '60/75',
            date:'2 Feb, 2024' 

        },
        {
            userId: 3,
            subject: 'Basic Mathematics',
            score: '60/75',
            date:'2 Feb, 2024' 
        },
        {
            userId: 4,
            subject: 'General Knowledge',
            score: '60/75',
            date:'2 Feb, 2024'
        },
    ];
};
export const getAssessmentQuestion = (): AssessmentQuestion[] => {
    return [
        {
            userId: 1,
            question: 'Q1. If we minus 712 from 1500, how much do we get?',
            score: 78,
        },
        {
            userId: 2,
            question: 'Q2. Find the missing terms in multiple of 3: 3, 6, 9, __, 15',
            score: 98,

        },
        {
            userId: 3,
            question: 'Q3. Solve 24÷8+2',
            score: 30,
        },
        {
            userId: 4,
            question: 'Q4. If we minus 712 from 1500, how much do we get?',
            score: 13,
        },
    ];
};
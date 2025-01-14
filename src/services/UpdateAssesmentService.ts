import {
  Assessment,
  AssessmentQuestion,
} from '@/utils/Interfaces';

export const updateAssessment = (): Assessment[] => {
  return [
    {
      userId: 1,
      studentName: 'Aanya Gupta',
      progress: 'Overall score :',
      score: 89,
    },
    {
      userId: 2,
      studentName: 'Aisha Bhatt',
      progress: 'Not Started',
      score: 0,
    },
    {
      userId: 3,
      studentName: 'Ankita Kulkarni',
      progress: 'In Progress',
      score: 0,
    },
  ];
};

export const learnerAssessmentReport = (): Assessment[] => {
  return [
    {
      userId: 1,
      studentName: 'Pre-test',
      progress: 'Overall score :',
      score: 89,
    },
    {
      userId: 2,
      studentName: 'Post-test',
      progress: 'Not Started',
      score: 0,
    },
  ];
};

export const getAssessmentQuestion = (): AssessmentQuestion[] => {
  return [
    {
      userId: 1,
      question: 'Q1. If we minus 712 from 1500, how much do we get?',
      score: 78,
    },
    {
      userId: 2,
      question: 'Q2. Find the missing terms in multiple of 3: 3, 6, 9, __, 15',
      score: 98,
    },
    {
      userId: 3,
      question: 'Q3. Solve 24÷8+2',
      score: 30,
    },
    {
      userId: 4,
      question: 'Q4. If we minus 712 from 1500, how much do we get?',
      score: 13,
    },
    {
      userId: 5,
      question: 'Q5. If we minus 712 from 1500, how much do we get?',
      score: 13,
    },
    {
      userId: 6,
      question: 'Q6. What is the square root of 144?',
      score: 85,
    },
    {
      userId: 7,
      question: 'Q7. Solve 2x + 5 = 13',
      score: 72,
    },
    {
      userId: 8,
      question: 'Q8. Find the LCM of 4 and 6',
      score: 66,
    },
    {
      userId: 9,
      question: 'Q9. Calculate 7! (7 factorial)',
      score: 92,
    },
    {
      userId: 10,
      question: 'Q10. What is the sum of angles in a triangle?',
      score: 77,
    },
    {
      userId: 11,
      question: 'Q11. What is the value of π (pi) up to 3 decimal places?',
      score: 81,
    },
    {
      userId: 12,
      question: 'Q12. Solve for x: 3x - 9 = 0',
      score: 64,
    },
    {
      userId: 13,
      question: 'Q13. Find the missing number: 12, 24, 36, __, 60',
      score: 79,
    },
    {
      userId: 14,
      question: 'Q14. Convert 50% to a decimal',
      score: 90,
    },
    {
      userId: 15,
      question: 'Q15. What is the area of a circle with radius 7?',
      score: 74,
    },
    {
      userId: 16,
      question: 'Q16. Solve for y: 2y + 7 = 15',
      score: 88,
    },
    {
      userId: 17,
      question: 'Q17. What is 3 squared?',
      score: 94,
    },
    {
      userId: 18,
      question: 'Q18. Find the missing number: 5, 10, 15, __, 25',
      score: 70,
    },
    {
      userId: 19,
      question: 'Q19. What is 15% of 200?',
      score: 82,
    },
    {
      userId: 20,
      question: 'Q20. What is the perimeter of a square with side length 5?',
      score: 87,
    },
    {
      userId: 21,
      question: 'Q21. Solve for z: 5z = 45',
      score: 69,
    },
    {
      userId: 22,
      question: 'Q22. What is the square of 12?',
      score: 95,
    },
    {
      userId: 23,
      question: 'Q23. Find the cube root of 27',
      score: 80,
    },
    {
      userId: 24,
      question: 'Q24. Solve for x: x/4 = 7',
      score: 76,
    },
    {
      userId: 25,
      question: 'Q25. What is the product of 9 and 9?',
      score: 91,
    },
    {
      userId: 26,
      question: 'Q26. What is the value of 2^5?',
      score: 84,
    },
    {
      userId: 27,
      question: 'Q27. Convert 3/4 to a decimal',
      score: 68,
    },
    {
      userId: 28,
      question: 'Q28. Find the missing number: 2, 4, 8, __, 32',
      score: 86,
    },
    {
      userId: 29,
      question: 'Q29. What is the next prime number after 11?',
      score: 93,
    },
    {
      userId: 30,
      question:
        'Q30. What is the area of a rectangle with length 8 and width 3?',
      score: 89,
    },
    {
      userId: 31,
      question: 'Q31. Solve for x: 4x = 64',
      score: 67,
    },
    {
      userId: 32,
      question: 'Q32. What is the circumference of a circle with diameter 14?',
      score: 78,
    },
    {
      userId: 33,
      question: 'Q33. Simplify: 9 + 6 ÷ 3',
      score: 90,
    },
    {
      userId: 34,
      question: 'Q34. Find the greatest common divisor of 16 and 24',
      score: 71,
    },
    {
      userId: 35,
      question: 'Q35. What is 12% of 150?',
      score: 83,
    },
    {
      userId: 36,
      question: 'Q36. What is the square root of 169?',
      score: 88,
    },
    {
      userId: 37,
      question: 'Q37. Solve for y: 6y - 18 = 0',
      score: 79,
    },
    {
      userId: 38,
      question: 'Q38. What is the value of 7^2?',
      score: 92,
    },
    {
      userId: 39,
      question: 'Q39. Find the missing number: 1, 1, 2, 3, 5, __, 13',
      score: 85,
    },
    {
      userId: 40,
      question: 'Q40. What is the average of 3, 7, 10, and 15?',
      score: 76,
    },
    {
      userId: 41,
      question: 'Q41. Convert 25% to a fraction',
      score: 77,
    },
    {
      userId: 42,
      question: 'Q42. What is the product of 6 and 7?',
      score: 91,
    },
    {
      userId: 43,
      question:
        'Q43. What is the next number in the sequence: 1, 4, 9, 16, __?',
      score: 82,
    },
    {
      userId: 44,
      question: 'Q44. What is the value of 3^3?',
      score: 73,
    },
    {
      userId: 45,
      question: 'Q45. Find the difference between 100 and 45',
      score: 80,
    },
    {
      userId: 46,
      question: 'Q46. Simplify: 8 * (5 - 3)',
      score: 87,
    },
    {
      userId: 47,
      question:
        'Q47. What is the area of a triangle with base 10 and height 5?',
      score: 93,
    },
    {
      userId: 48,
      question: 'Q48. Solve for x: 5x + 10 = 25',
      score: 70,
    },
    {
      userId: 49,
      question: 'Q49. What is the square root of 81?',
      score: 89,
    },
    {
      userId: 50,
      question: 'Q50. What is the sum of 9 and 12?',
      score: 66,
    },
  ];
};

import React from 'react'

//here we are creating a function that will parse the questions from the text input
// and return an array of objects containing the question, options and correct answer

const parseQuestionsFromText = (text) => {
  if (text.trim() === "") {
    return [];
  }
  
  // Parse string format questions
  // Format: Question? Option1|Option2|Option3|Option4|CorrectOptionNumber
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  const parsedQuestions = [];
  
  for (const line of lines) {
    const parts = line.split('?');
    
    if (parts.length < 2) continue;
    
    const question = parts[0].trim() + '?';
    const optionsPart = parts[1].trim();
    
    const optionItems = optionsPart.split('|');
    
    if (optionItems.length < 2) continue;
    
    // The last item should be the correct answer index (1-based)
    const correctAnswerStr = optionItems.pop().trim();
    const correctAnswer = parseInt(correctAnswerStr) - 1; // Convert to 0-based index
    
    if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer >= optionItems.length) continue;
    
    const options = optionItems.map(opt => opt.trim());
    
    parsedQuestions.push({
      question,
      options,
      correctAnswer
    });
  }
  
  return parsedQuestions;
};

export default parseQuestionsFromText

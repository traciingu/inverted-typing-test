import { KeyboardEvent, useEffect, useState } from 'react';
import './WordDisplay.css'
import { apiRequest } from '../baseRequests';
import { WordResponse } from '../../types'

const WordDisplay = () => {
    const [wordsMatrix, setWordsMatrix] = useState<string[][]>();
    const [inputtedWords, setInputtedWords] = useState<string[][]>();
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
    const [currentLetterIndex, setCurrentLetterIndex] = useState<number>(-1);

    useEffect(() => {
        const getWords = async () => {
            const response = await apiRequest.get("/randomWords");
            const responseData: WordResponse[] = response.data;
            const wordResponseMatrix = responseData.map(element => element.word.toLowerCase().split(''));
            if (wordResponseMatrix.length > 0) {
                setWordsMatrix(wordResponseMatrix);
                setCurrentWordIndex(0);
            }
        };

        getWords();
    }, []);

    const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === " ") {
            setCurrentWordIndex(prevIndex => prevIndex + 1);
        } else if (!inputtedWords) {
            e.key.length === 1 && setInputtedWords([[e.key]]);
        } else if (e.key === "Backspace") {
            if (inputtedWords[currentWordIndex].length === 0 && currentWordIndex !== 0) {
                setCurrentWordIndex(prevIndex => prevIndex - 1);
            } else {
                setInputtedWords(prevWords => {
                    const prevWordsCpy = structuredClone(prevWords);
                    if (prevWordsCpy && currentWordIndex >= 0) {
                        prevWordsCpy[currentWordIndex].pop();
                    }

                    return prevWordsCpy;
                });
            }
        } else if (e.key.length === 1) {
            setInputtedWords(prevWords => {
                const prevWordsCpy = structuredClone(prevWords);
                if (prevWordsCpy && currentWordIndex >= 0) {
                    if (currentWordIndex + 1 > prevWordsCpy.length) {
                        prevWordsCpy.push([e.key]);
                    } else {
                        prevWordsCpy[currentWordIndex].push(e.key);
                    }
                }

                return prevWordsCpy;
            });
        }
    }

    const isLetterCorrect = (actualLetter:string, wordIndex: number, letterIndex: number): string => {
        if(!inputtedWords) {
            return '';
        }

        const inputtedLetter = inputtedWords?.[wordIndex]?.[letterIndex];

        if(inputtedLetter){
            return inputtedLetter === actualLetter ? "correct-letter" : "incorrect-letter";
        }

        return '';
    }

    return (
        <div>
            <input type="text" onKeyDown={handleOnKeyDown} />
            <p>
                {
                    !wordsMatrix ? "" : wordsMatrix.map((arrOfWord, wordIndex) =>
                        <span className={`word`}>
                            {arrOfWord.map((letter, letterIndex) =>
                                <span className={`letter ${isLetterCorrect(letter, wordIndex, letterIndex)}`}>
                                    {letter}
                                </span>
                            )}
                        </span>
                    )}
            </p>
        </div>
    );
};

export default WordDisplay;
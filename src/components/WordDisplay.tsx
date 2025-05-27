import { KeyboardEvent, useEffect, useState } from 'react';
import './WordDisplay.css'
import { apiRequest } from '../baseRequests';
import { WordResponse } from '../../types'

const WordDisplay = () => {
    const [wordsMatrix, setWordsMatrix] = useState<string[][]>();
    const [inputtedWords, setInputtedWords] = useState<string[][]>();

    useEffect(() => {
        const getWords = async () => {
            const response = await apiRequest.get("/randomWords");
            const responseData: WordResponse[] = response.data;
            const wordResponseMatrix = responseData.map(element => element.word.toLowerCase().split(''));
            if (wordResponseMatrix.length > 0) {
                setWordsMatrix(wordResponseMatrix);
            }
        };

        getWords();
    }, []);

    const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {

        if (e.key.length > 1 && e.key !== "Backspace") {
            return;
        }

        if (!inputtedWords) {
            if (e.key === "Backspace") {
                return;
            }

            if (e.key === " ") {
                setInputtedWords([[], []]);
            } else {
                setInputtedWords([[e.key]]);
            }

            return;
        }

        if (e.key === " ") {
            setInputtedWords(prevWords => {
                const prevWordsCpy = structuredClone(prevWords);

                if (prevWordsCpy) {
                    prevWordsCpy.push([]);
                }

                return prevWordsCpy;
            });

            return;
        }

        if (e.key === "Backspace") {
            if (inputtedWords[inputtedWords.length - 1].length === 0) {
                if (inputtedWords.length === 1) {
                    setInputtedWords(undefined);
                } else {
                    setInputtedWords(prevWords => {
                        const prevWordsCpy = structuredClone(prevWords);

                        if (prevWordsCpy) {
                            prevWordsCpy.pop();
                        }

                        return prevWordsCpy;
                    });
                }

            } else {
                setInputtedWords(prevWords => {
                    const prevWordsCpy = structuredClone(prevWords);

                    if (prevWordsCpy) {
                        prevWordsCpy[prevWordsCpy.length - 1].pop();
                    }

                    return prevWordsCpy;
                });
            }

            return;
        }

        setInputtedWords(prevWords => {
            const prevWordsCpy = structuredClone(prevWords);

            if (prevWordsCpy) {
                prevWordsCpy[prevWordsCpy.length - 1].push(e.key);
            }

            return prevWordsCpy;
        });

        return;
    };

    const isCharacterCorrect = (actualChar: string, wordIndex: number, charIndex: number): string => {
        if (!inputtedWords) {
            return '';
        }

        const inputtedChar = inputtedWords?.[wordIndex]?.[charIndex];

        if (inputtedChar) {
            return inputtedChar === actualChar ? "correct-character" : "incorrect-character";
        }

        return '';
    };

    return (
        <div className="word-display-container">
            <label htmlFor="typing-input" className="word-display-input-label">Type here:</label>
            <input type="text" id="typing-input" className='word-display-input' onKeyDown={handleOnKeyDown} />
            <p className="word-display">
                {
                    !wordsMatrix ? "" :
                        wordsMatrix.map((arrOfWord, wordIndex) =>
                            <span className="word" data-testid="word">
                                {arrOfWord.map((char, charIndex) =>
                                    <span className={`character ${isCharacterCorrect(char, wordIndex, charIndex)}`}>
                                        {char}
                                    </span>
                                )}
                            </span>
                        )
                }
            </p>
        </div>
    );
};

export default WordDisplay;
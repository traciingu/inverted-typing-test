import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import styleClasses from './styles/WordDisplay.module.css'
import { apiRequest } from '../baseRequests';
import { WordResponse } from '../../types'

const WordDisplay = ({ testIsRunning, setTestIsRunning, testIsCompleted }: { testIsRunning: boolean, setTestIsRunning: (isRunning: boolean) => void, testIsCompleted: boolean }) => {
    const [wordsMatrix, setWordsMatrix] = useState<string[][]>();
    const [inputtedWords, setInputtedWords] = useState<string[][]>();
    const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
    const [testType, setTestType] = useState<string>("backwards");
    const currentWordRef = useRef<HTMLSpanElement>(null);

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

    useEffect(() => {
        if (!testIsRunning) {
            setInputtedWords(undefined);
        }
    }, [testIsRunning]);

    useEffect(() => {
        currentWordRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key.length > 1 && e.key !== "Backspace") {
            return;
        }

        setTestIsRunning(true);

        if (!inputtedWords) {


            if (e.key === "Backspace") {
                return;
            }

            if (e.key === " ") {
                setInputtedWords([[], []]);
                setCurrentWordIndex(1);
            } else {
                setInputtedWords([[e.key]]);
                setCurrentWordIndex(0);
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

            setCurrentWordIndex(prevVal => prevVal + 1);
            return;
        }

        if (e.key === "Backspace") {
            if (inputtedWords[inputtedWords.length - 1].length === 0) {
                if (inputtedWords.length === 1) {
                    setInputtedWords(undefined);
                    setCurrentWordIndex(-1);
                } else {
                    setInputtedWords(prevWords => {
                        const prevWordsCpy = structuredClone(prevWords);

                        if (prevWordsCpy) {
                            prevWordsCpy.pop();
                        }

                        return prevWordsCpy;
                    });

                    setCurrentWordIndex(prevVal => prevVal - 1);
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

    const handleTestTypeChange = (e: MouseEvent<HTMLInputElement>) => {
        setTestType(e.currentTarget.value);
    };

    return (
        <div className={`${styleClasses["word-display-outer-container"]}`}>
            <div className={`${styleClasses["test-type-btns-container"]}`}>
                <div >
                    <input type="radio" id="backwards" value="backwards" name="test-type" defaultChecked onClick={handleTestTypeChange} />
                    <label htmlFor="backwards" className={`${styleClasses["test-type-label"]}`}>Backwards</label>
                </div>
                <div>
                    <input type="radio" id="upside-down" value="upside-down" name="test-type" onClick={handleTestTypeChange} />
                    <label htmlFor="upside-down" className={`${styleClasses["test-type-label"]}`}>Upside-Down</label>
                </div>
            </div>
            <label htmlFor="typing-input" className={`${styleClasses["word-display-input-label"]}`}>Type here:</label>
            <div className={`${styleClasses["word-display-container"]}`}>
                <input
                    type="text"
                    id="typing-input"
                    className={`${styleClasses['word-display-input']}`}
                    onKeyDown={handleOnKeyDown}
                    disabled={testIsCompleted}
                />
                <p className={`${styleClasses["word-display"]} ${styleClasses[testType]}`}>
                    {
                        !wordsMatrix ? "" :
                            wordsMatrix.map((arrOfWord, wordIndex) =>
                                <span
                                    className={`${styleClasses["word"]}`}
                                    data-testid="word"
                                    ref={wordIndex === currentWordIndex ? currentWordRef : null}
                                >
                                    {arrOfWord.map((char, charIndex) =>
                                        <span
                                            className={`${styleClasses["character"]} ${isCharacterCorrect(char, wordIndex, charIndex)}`}>
                                            {char}
                                        </span>
                                    )}
                                </span>
                            )
                    }
                </p>
            </div>
        </div>
    );
};

export default WordDisplay;
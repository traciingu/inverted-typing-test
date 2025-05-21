import { useEffect, useState } from 'react';
import './WordDisplay.css'
import { apiRequest } from '../baseRequests';
import { WordResponse } from '../../types'

const WordDisplay = () => {
    const [wordsMatrix, setWordsMatrix] = useState<string[][]>();

    useEffect(() => {
        const getWords = async () => {
            
            const response = await apiRequest.get("/randomWords");
            const responseData: WordResponse[] = response.data;
            const wordResponseMatrix = responseData.map(element => element.word.split(''));
            setWordsMatrix(wordResponseMatrix);
        };

        getWords();
    }, []);

    return (
        <div>
            <p>{wordsMatrix?.map(arrOfWord => <span>{arrOfWord.map(letter => letter)}</span>)}</p>
        </div>
    );
};

export default WordDisplay;
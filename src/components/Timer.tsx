import { useEffect, useRef, useState } from "react";
import './styles/Timer.css';

const Timer = ({ timeLimit = 60 * 1000, testIsRunning, setTestIsRunning, setTestIsCompleted }:
    { timeLimit?: number, testIsRunning: boolean, setTestIsRunning: (isRunning: boolean) => void, setTestIsCompleted: (isCompleted: boolean) => void }) => {
    const requestId = useRef<number>(undefined);
    const [timeRemaining, setTimeRemaining] = useState<number>(timeLimit / 1000);
    const startTime = useRef<number>(-1);

    function updateTimeRemaining() {
        const calculatedTimeRemaing = Math.floor((timeLimit - (performance.now() - startTime.current)) / 1000);
        if (calculatedTimeRemaing >= 0) {
            setTimeRemaining(calculatedTimeRemaing);
        }
        
        requestId.current = requestAnimationFrame(updateTimeRemaining);
    };

    const startTimer = () => {
        cancelAnimationFrame(requestId.current || 0);
        setTimeRemaining(timeLimit / 1000);
        startTime.current = performance.now();
        requestId.current = requestAnimationFrame(updateTimeRemaining);
    };

    const resetTimer = () => {
        setTestIsRunning(false);
        setTestIsCompleted(false);

        cancelAnimationFrame(requestId.current || 0);
        requestId.current = undefined;
        setTimeRemaining(timeLimit / 1000);
    };

    useEffect(() => {
        if (!requestId.current && testIsRunning) {
            startTimer();
        }

        if (timeRemaining <= 0) {
            setTestIsRunning(false);
            setTestIsCompleted(true);

            cancelAnimationFrame(requestId.current || 0);
        }
    });

    return (
        <div className="timer-container">
            <div className="timer-controls">
                <button onClick={startTimer}>Start</button>
                <button onClick={resetTimer}>Reset</button>
            </div>
            <div className="timer-display">Time: {timeRemaining}</div>
        </div>
    );
};

export default Timer;
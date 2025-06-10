import { useEffect, useRef, useState } from "react";

const Timer = ({ timeLimit = 60 * 1000, testIsRunning, setTestIsRunning }:
    { timeLimit?: number, testIsRunning?: boolean, setTestIsRunning?: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const requestId = useRef<number>(undefined);
    const [timeRemaining, setTimeRemaining] = useState<number>(timeLimit / 1000);
    const startTime = useRef<number>(-1);

    function updateTimeRemaining() {
        setTimeRemaining(Math.floor((timeLimit - (performance.now() - startTime.current)) / 1000));
        requestId.current = requestAnimationFrame(updateTimeRemaining);
    };

    const startTimer = () => {
        cancelAnimationFrame(requestId.current || 0);
        setTimeRemaining(timeLimit / 1000);
        startTime.current = performance.now();
        requestId.current = requestAnimationFrame(updateTimeRemaining);
    };

    const resetTimer = () => {
        cancelAnimationFrame(requestId.current || 0);
        setTimeRemaining(timeLimit / 1000);
    };

    useEffect(() => {
        if (!requestId.current && testIsRunning) {
            startTimer();
        }

        if (timeRemaining <= 0) {
            if (setTestIsRunning) {
                setTestIsRunning(false);
            }

            cancelAnimationFrame(requestId.current || 0);
        }
    });

    return (
        <div>
            <button onClick={startTimer}>Start</button>
            <button onClick={resetTimer}>Reset</button>
            <p>Time: {timeRemaining}</p>
        </div>
    );
};

export default Timer;
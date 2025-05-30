import { useEffect, useRef, useState } from "react";

const Timer = ({ timeLimit = 60 * 1000 }: { timeLimit?: number }) => {
    const requestId = useRef<number>(undefined);
    const [timeRemaining, setTimeRemaining] = useState<number>(timeLimit / 1000);

    useEffect(() => {
        updateTimeRemaining();
        return () => cancelAnimationFrame(requestId.current || 0);
    });

    const updateTimeRemaining = () => {
        if (timeRemaining <= 0) {
            cancelAnimationFrame(requestId.current || 0);
            return;
        }

        setTimeRemaining(Math.floor((timeLimit - performance.now()) / 1000));
        requestId.current = requestAnimationFrame(updateTimeRemaining);
    };

    return (
        <div>
            <button onClick={updateTimeRemaining}>Click</button>
            <p>Time: {timeRemaining}</p>
        </div>
    );
};

export default Timer;
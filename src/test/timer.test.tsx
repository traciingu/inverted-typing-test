import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import Timer from "../components/Timer";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { server } from "./handlers";

const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
beforeEach(() => {
    server.listen();
    vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
    server.close();
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
});

test('timer elapses every second', async () => {
    const timeLimitInSecs = 5;
    render(<Timer timeLimit={timeLimitInSecs * 1000} />);

    const time = screen.getByText(`Time: ${timeLimitInSecs}`);
    expect(time.textContent).toBe(`Time: ${timeLimitInSecs}`);

    const startBtn = screen.getByRole("button", { name: /start/i });
    await user.click(startBtn);

    const timeToElapse = 1;
    for (let i = 0; i < timeToElapse * 60; i++) {
        act(() => { vi.advanceTimersToNextFrame(); });
    }

    expect(time.textContent).toBe(`Time: ${timeLimitInSecs - timeToElapse}`);

    for (let i = 0; i < timeToElapse * 60; i++) {
        act(() => { vi.advanceTimersToNextFrame(); });
    }

    expect(time.textContent).toBe(`Time: ${timeLimitInSecs - (timeToElapse * 2)}`);
});

test('timer starts when user begins to type', async () => {
    render(<App />);

    const timer = screen.getByText('Time: 30');

    expect(timer.textContent).toBe("Time: 30");
    const initialTime = parseInt(timer.textContent?.slice(-2) || '');

    const typingInput = screen.getByRole("textbox", { name: /type here:/i });
    await user.click(typingInput);
    await user.keyboard("abc123");

    act(() => vi.advanceTimersByTime(1000));

    const finalTime = parseInt(timer.textContent?.slice(-2) || '');
    expect(finalTime).toBeLessThan(initialTime);
});

test('disable typing when timer runs out', async () => {
    render(<App />);

    const timer = screen.getByText("Time: 30");
    const initialTime = parseInt(timer.textContent?.slice(-2) || '');

    const typingInput = screen.getByRole("textbox", { name: /type here:/i });
    expect(typingInput.getAttribute("disabled")).toBeNull();

    await user.click(typingInput);
    await user.keyboard("abc123");

    for (let i = 0; i < ((60 * initialTime) + 60); i++) {
        act(() => vi.advanceTimersToNextFrame());
    }

    expect(timer.textContent).toBe("Time: 0");
    expect(typingInput.getAttribute("disabled")).not.toBeNull();
});
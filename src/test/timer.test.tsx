import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import Timer from "../components/Timer";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
});

test('timer elapses every second', async () => {
    const timeLimitInSecs = 5;
    render(<Timer timeLimit={timeLimitInSecs * 1000} />);

    const time = screen.getByRole('paragraph');
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
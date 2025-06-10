import { act, cleanup, render, screen } from "@testing-library/react";
import { afterAll, afterEach, beforeEach, expect, test, vi } from "vitest";
import Timer from "../../components/Timer";
import userEvent from "@testing-library/user-event";
import { server } from "../handlers";

const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
beforeEach(() => {
    server.listen();
    vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
    server.resetHandlers();
    cleanup();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
});

afterAll(() => server.close());

test('timer elapses every second', async () => {
    const timeLimitInSecs = 5;
    render(<Timer
        timeLimit={timeLimitInSecs * 1000}
        testIsRunning={true}
        setTestIsRunning={() => { return }}
        setTestIsCompleted={() => { return }}
    />);

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
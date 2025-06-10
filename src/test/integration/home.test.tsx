import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import App from "../../App";
import { server } from "../handlers";

const user = userEvent.setup();

beforeAll(() => server.listen());

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

test('all typed characters are cleared when the test is resetted', async () => {
    render(<App />);

    const input = screen.getByRole('textbox', { name: /type here:/i });
    const wordDisplay = screen.getByRole('paragraph');

    const firstWord = (await within(wordDisplay).findAllByTestId("word"))[0];
    const firstChar = within(firstWord).getAllByRole('generic')[0];

    await user.click(input);
    await user.keyboard('abc');

    expect(firstChar.classList).toContain("incorrect-character");

    await user.click(screen.getByRole("button", { name: /reset/i }));

    expect(firstChar.classList).not.toContain("incorrect-character");
});
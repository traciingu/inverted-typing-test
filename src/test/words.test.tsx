import { afterAll, afterEach, beforeAll, expect, test } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { server } from './handlers';
import WordDisplay from '../components/WordDisplay';

const user = userEvent.setup();
beforeAll(() => server.listen());
afterEach(() => {
    server.resetHandlers();
    cleanup();
});
afterAll(() => server.close());

test('words appear backwards', async () => {
    render(<WordDisplay />);
    const firstWord = (await screen.findAllByTestId('word'))[0];
    const text = getComputedStyle(firstWord);
    await expect(text.transform).toBe("scaleX(-1)");
});

test('backspace removes a character', async () => {
    render(<WordDisplay />);
    const typingInput = screen.getByRole('textbox', { name: /type here:/i });
    await user.click(typingInput);
    await user.keyboard('+');

    const firstWord = (await screen.findAllByTestId('word'))[0];
    const firstChar = within(firstWord).getAllByText(/[a-z0-9]/i)[0];
    await expect(firstChar.classList).toContain("incorrect-character");

    await user.keyboard('{Backspace}');
    await expect(firstChar.classList).not.toContain("incorrect-character");
});

test('space begins typing for the next word', async () => {
    render(<WordDisplay />);

    const secondWord = (await screen.findAllByTestId('word'))[1];
    const firstChar = within(secondWord).getAllByText(/[a-z0-9]/i)[0];
    await expect(firstChar.classList).not.toContain("incorrect-character");

    const typingInput = screen.getByRole('textbox', { name: /type here:/i });
    await user.click(typingInput);
    await user.keyboard('[Space]+');

    await expect(firstChar.classList).toContain("incorrect-character");
});

test('correct and incorrect inputs display in the correct colours', async () => {
    render(<WordDisplay />);
    const typingInput = screen.getByRole('textbox', { name: /type here:/i });
    await user.click(typingInput);
    // Assuming first word is lubbock
    await user.keyboard('lk');

    const firstChar = screen.getAllByText('l')[0];
    await expect(firstChar.classList).toContain("correct-character");

    const secondChar = screen.getAllByText('u')[0];
    await expect(secondChar.classList).toContain("incorrect-character");
});
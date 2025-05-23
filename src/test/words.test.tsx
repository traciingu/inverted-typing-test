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
    await expect(getComputedStyle(firstChar).color).not.toBe("rgb(202, 202, 202)");

    await user.keyboard('{Backspace}');
    await expect(getComputedStyle(firstChar).color).toBe("rgb(202, 202, 202)");
});

test('space begins typing for the next word', async () => {
    render(<WordDisplay />);

    const secondWord = (await screen.findAllByTestId('word'))[1];
    const firstChar = within(secondWord).getAllByText(/[a-z0-9]/i)[0];
    await expect(firstChar.classList).not.toContain("incorrect-letter");

    const typingInput = screen.getByRole('textbox', { name: /type here:/i });
    await user.click(typingInput);
    await user.keyboard('[Space]+');

    await expect(firstChar.classList).toContain("incorrect-letter");
});

test('correct and incorrect inputs display in the correct colours', async () => {
    render(<WordDisplay />);
    const typingInput = screen.getByRole('textbox', { name: /type here:/i });
    await user.click(typingInput);
    // Assuming first word is lubbock
    await user.keyboard('lk');

    const firstLetter = screen.getAllByText('l')[0];
    const fLetterStyling = getComputedStyle(firstLetter);
    await expect(fLetterStyling.color).toBe("rgb(27, 27, 27)");

    const secondLetter = screen.getAllByText('u')[0];
    const sLetterStyling = getComputedStyle(secondLetter);
    await expect(sLetterStyling.color).toBe("rgb(185, 19, 19)");
});
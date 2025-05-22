import { afterAll, afterEach, beforeAll, expect, test } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
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
    const text = getComputedStyle(screen.getByRole('paragraph'));
    await expect(text.transform).toBe("scaleX(-1)");
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
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { server } from '../handlers';
import WordDisplay from '../../components/WordDisplay';

const user = userEvent.setup();
beforeAll(() => server.listen());

beforeEach(() => {
    render(<WordDisplay testIsRunning={true} testIsCompleted={false} setTestIsRunning={() => {return}}/>);
});

afterEach(() => {
    server.resetHandlers();
    cleanup();
});

afterAll(() => server.close());

// Will need to rewrite these to visual tests

test('words appear backwards', async () => {
    const wordDisplay = screen.getByRole('paragraph');
    await expect(getComputedStyle(wordDisplay).transform).toBe("scaleX(-1)");
});

test('text is inverted appropriately with the option selected', async () => {
    const backwardsBtn = screen.getByRole('radio', {name: /backwards/i});
    const upsidedownBtn = screen.getByRole('radio', {name: /upside-down/i});

    const wordDisplay = screen.getByRole('paragraph');
    const firstWord = (await within(wordDisplay).findAllByTestId('word'))[0];

    await user.click(upsidedownBtn);
    expect(getComputedStyle(wordDisplay).transform).toBe("scaleX(-1)");
    expect(getComputedStyle(firstWord).transform).toBe("scaleY(-1)");

    await user.click(backwardsBtn);
    expect(getComputedStyle(wordDisplay).transform).toBe("scaleX(-1)");
    expect(getComputedStyle(firstWord).transform).toBe("");
});

test('backspace removes a character', async () => {
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
    const secondWord = (await screen.findAllByTestId('word'))[1];
    const firstChar = within(secondWord).getAllByText(/[a-z0-9]/i)[0];
    await expect(firstChar.classList).not.toContain("incorrect-character");

    const typingInput = screen.getByRole('textbox', { name: /type here:/i });
    await user.click(typingInput);
    await user.keyboard('[Space]+');

    await expect(firstChar.classList).toContain("incorrect-character");
});

test('backspacing when there are no typed characters for a word will return to typing for the previous word', async () => {
    const wordsOnscreen = (await screen.findAllByTestId('word'));
    const firstWord = wordsOnscreen[0];
    const secondWord = wordsOnscreen[1];
    const firstCharOfFirstWord = within(firstWord).getAllByText(/[a-z0-9]/i)[0];
    const firstCharOfSecondWord = within(secondWord).getAllByText(/[a-z0-9]/i)[0];

    await expect(firstCharOfSecondWord.classList).not.toContain('incorrect-character');

    const typingInput = screen.getByRole('textbox', { name: /type here:/i });
    await user.click(typingInput);
    await user.keyboard('[Space]+');

    await expect(firstCharOfSecondWord.classList).toContain('incorrect-character');
    await expect(firstCharOfFirstWord.classList).not.toContain('incorrect-character');

    await user.keyboard('[Backspace][Backspace]+');

    await expect(firstCharOfFirstWord.classList).toContain('incorrect-character');
});

test('input does not register special keyboard keys', async () => {
    const typingInput = screen.getByRole('textbox', { name: /type here:/i });
    await user.click(typingInput);
    await user.keyboard('[AltLeft][ShiftLeft][Enter][ArrowUp][Home]');
    const firstWord = (await screen.findAllByTestId('word'))[0];
    const firstChar = within(firstWord).getAllByText(/[a-z0-9]/i)[0];

    await expect(firstChar.classList).not.toContain('incorrect-character');
});

test('correct and incorrect inputs display in the correct colours', async () => {
    const typingInput = screen.getByRole('textbox', { name: /type here:/i });
    await user.click(typingInput);
    // Assuming first word is lubbock
    await user.keyboard('lk');

    const firstChar = screen.getAllByText('l')[0];
    await expect(firstChar.classList).toContain("correct-character");

    const secondChar = screen.getAllByText('u')[0];
    await expect(secondChar.classList).toContain("incorrect-character");
});
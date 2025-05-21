import {afterAll, afterEach, beforeAll, expect, test} from 'vitest'
import {render, screen} from '@testing-library/react'
import { server } from './handlers';
import WordDisplay from '../components/WordDisplay';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('words appear backwards', async () => {
    render(<WordDisplay/>);
    const text = getComputedStyle(screen.getByRole('paragraph'));
    await expect(text.transform).toBe("scaleX(-1)");
});
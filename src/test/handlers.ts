import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
 
const handlers = [
  // Intercept the "GET" request.
  http.get(`http://localhost:5173/randomWords`, () => {
    return HttpResponse.json([
        {
            "word": "Lubbock",
            "id": 0
        },
        {
            "word": "catalytic",
            "id": 0
        },
        {
            "word": "overseen",
            "id": 0
        },
        {
            "word": "overseas",
            "id": 0
        }
    ]);
  }),
];

export const server = setupServer(...handlers);
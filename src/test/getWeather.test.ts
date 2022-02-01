import axios from 'axios';
import { handler, respondJson } from '../getWeather';
import {httpEventMock} from "./httpEventMock";
import {weatherSuccessResponse} from "./weatherSuccessResponse";
import {weatherErrorResponse} from "./weatherErrorResponse";

const defaultEvent = {
    ...httpEventMock,
    pathParameters: { city: 'moscow' },
} as any;

beforeEach(() => {
    jest.clearAllMocks();
});

describe('getWeather handler', () => {
    it('should respond current weather by city', async () => {
        const requestSpy = jest
            .spyOn(axios, 'get')
            .mockImplementation(async () => ({ data: weatherSuccessResponse }));

        const actual = await handler(defaultEvent);
        const expected = respondJson({
            city: 'Lakefront Airport',
            temperature: 22,
            textWeather: ['Clear']
        }, 200);

        expect(actual).toEqual(expected);
        expect(requestSpy).toHaveBeenCalled();
    })
    it('should respond error if weatherstack API respond error', async () => {
        const requestSpy = jest
            .spyOn(axios, 'get')
            .mockImplementation(async () => ({ data: weatherErrorResponse }));

        const actual = await handler(defaultEvent);
        const expected = respondJson({ error: true }, 200);

        expect(actual).toEqual(expected);
        expect(requestSpy).toHaveBeenCalled();
    });
});
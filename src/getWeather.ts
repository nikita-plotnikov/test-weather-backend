import axios from 'axios';
import { HttpEventRequest, HttpResponse, HttpResponseBody, WeatherstackResponse } from './types';
import {createClient} from 'redis';
import { SecretsManage } from './secretsManager';
import { promisify } from 'util';

const redisUrl = process.env.REDIS_URL;

const API_KEY = process.env.WEATHERSTACK_API_KEY;

export function respondJson(body: object, statusCode: number) {
    return {
        statusCode,
        body: JSON.stringify(body)
    };
}

export async function handler(event: HttpEventRequest<{ city: string }>): HttpResponse {
    const { city } = event.pathParameters;
    const secret = await SecretsManage.getSecret(process.env.SECRET_NAME!, process.env.REGION!)
    const client = createClient({url: redisUrl});
    const getAsync = promisify(client.get).bind(client);
    const setAsync = promisify(client.set).bind(client);

    const cachedCity = await getAsync(`${city}`);
    if (cachedCity) {
        const formatCached: HttpResponseBody = JSON.parse(cachedCity);
        return respondJson(formatCached, 200);
    }
    const endpoint = 'http://api.weatherstack.com/current';
    console.log('secret', secret)
    const { data } = await axios.get<WeatherstackResponse>(endpoint, {
        params: { access_key: secret, query: city }
    });

    if ('error' in data) {
        return respondJson({ error: true }, 200);
    }

    const response: HttpResponseBody = {
        city: data.location.name,
        temperature: data.current.temperature,
        textWeather: data.current.weather_descriptions,
    }

    await setAsync(`${city}`, JSON.stringify(response))

    return respondJson(response, 200);
}
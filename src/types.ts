import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export type HttpEventRequest<T = null> = Omit<APIGatewayProxyEvent, 'pathParameters'> & {
    pathParameters: T
}

export type HttpResponse = Promise<APIGatewayProxyResult>;

export type HttpResponseBody = {
    city: string;
    temperature: number;
    textWeather: string[];
    windSpeed: number;
    windDir: string;
    pressure: number;
    humidity: number;
}

export type WeatherstackSuccessResponse = {
    request: {
        type: string;
        query: string;
        language: string;
        unit: string;
    };
    location: {
        name: string;
        country: string;
        region: string;
        lat: string;
        lon: string;
    };
    current: {
        temperature: number;
        weather_descriptions: string[];
        wind_speed: number;
        wind_dir: string;
        pressure: number;
        humidity: number;
    };
};

export type WeatherstackErrorResponse = {
    success: false;
    error: object;
}

export type WeatherstackResponse = WeatherstackSuccessResponse | WeatherstackErrorResponse;
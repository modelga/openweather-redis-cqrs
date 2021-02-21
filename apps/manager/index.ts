import app from "./app";

const token = process.env.OPENWEATHER_API_TOKEN;

app({ token, port: 80 }).start();

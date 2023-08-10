import * as request from 'supertest';
import 'dotenv/config';

const port = process.env.APPPORT || 4000;

const host = `localhost:${port}`;
const _request = request(host);

export default _request;

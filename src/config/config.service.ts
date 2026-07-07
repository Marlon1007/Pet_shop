import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { parse } from 'dotenv';

@Injectable()
export class ConfigService {
    private readonly envConfig: { [key: string]: string };
    constructor() {
        const isDevelopment = process.env.NODE_ENV !== 'production'
        if (isDevelopment) {
            const envFilePath= __dirname + '/../../../.env.development'
            const existsPath = fs.existsSync(envFilePath)
            if (!existsPath) {
                console.log('.env.development file not found')
            }
            this.envConfig = parse(fs.readFileSync(envFilePath))

        }
        else 
        {
            const envFilePath= __dirname + '/../../.env.production'
            const existsPath = fs.existsSync(envFilePath)
            if (!existsPath) {
                console.log('.env.production file not found')
            }
            this.envConfig = parse(fs.readFileSync(envFilePath))
        }
    }
    get(key: string): string {
        return this.envConfig[key];
    }
}

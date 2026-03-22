import dotenv from 'dotenv';
dotenv.config();

export const APIs = {
    cricket:{
        baseUrl: 'https://api.cricapi.com/v1',
        key: process.env.CRICKET_API_KEY
    },

    football:{
        baseUrl: 'https://api.football-data.org/v4',
        key: process.env.FOOTBALL_API_KEY
    },

     basketball:{
        baseUrl: 'https://api.balldontlie.io/v1',
        key: process.env.BASKETBALL_API_KEY
    },

     baseball:{
        baseUrl: 'https://statsapi.mlb.com/api/v1',
        key: process.env.BASEBALL_API_KEY
    }

}
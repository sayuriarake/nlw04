import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database'

describe("Surveys", () =>{
    beforeAll(async ()=>{
        const connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll( async ()=> {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    })

    it("Deve ser capaz de criar uma nova pesquisa", async () => {
        const response = await request(app).post("/surveys").send({
            title: "título da pergunta",
            description: "descrição da pergunta"
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");

    });

    it("Deve ser capaz de retornar todas as pesquisas criadas", async() => {
        await request(app).post('/surveys').send({
            title: "título da pergunta 2",
            description: "descrição da pergunta 2"
        });
    
    const response = await request(app).get('/surveys');

        expect(response.body.length).toBe(2);
    })
})
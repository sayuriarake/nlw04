import request from 'supertest';
import { app } from '../app';

import createConnection from '../database'

describe("Users", () =>{
    beforeAll(async ()=>{
        const connection = await createConnection();
        await connection.runMigrations();
    });

    it("Deve ser capaz de criar um novo usuário", async () => {
        const response = await request(app).post("/users").send({
            email: "user@example.com",
            name: "User Example"
        });

        expect(response.status).toBe(201);

    });

    it("Não deve criar um novo usuário se o email existe", async () => {
        const response = await request(app).post("/users").send({
            email: "user@example.com",
            name: "User Example"
        });

        expect(response.status).toBe(400);
        

    });
    
})
import supertest from "supertest";
import bcrypt from "bcrypt";

import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import { createTestUser, getTestUser, removeTestUser } from "./test-util.js";

describe('POST /api/users', () => {
    afterEach(async () => {
        await removeTestUser();
    });

    it('should can register new user', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: 'password',
                name: 'Test user',
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toEqual('test');
        expect(result.body.data.name).toEqual('Test user');
        expect(result.body.data.password).toBeUndefined();
    });

    it('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: '',
                password: '',
                name: '',
            });
        
        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if username already exists', async () => {
        let result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: 'password',
                name: 'Test user',
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.username).toEqual('test');
        expect(result.body.data.name).toEqual('Test user');
        expect(result.body.data.password).toBeUndefined();

        result = await supertest(web)
            .post('/api/users')
            .send({
                username: 'test',
                password: 'password',
                name: 'Test user',
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('POST /api/users/login', () => {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can login', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'test',
                password: 'password',
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.token).toBeDefined();
        expect(result.body.data.token).not.toBe('test');
    });

    it('should reject if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: '',
                password: '',
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if password is wrong', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'test',
                password: 'wrong-password',
            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if username is wrong', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'wrong-username',
                password: 'password',
            });

        logger.info(result.body);

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/users/current', () => {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can get current user', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.username).toEqual('test');
        expect(result.body.data.name).toEqual('Test user');
    });

    it('should reject if token is wrong', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'wrong-token');

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
})

describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can update current user', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                name: 'Updated name',
                password: 'rahasia'
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toEqual('test');
        expect(result.body.data.name).toEqual('Updated name');

        const user = await getTestUser();
        expect(await bcrypt.compare('rahasia', user.password)).toBe(true);
    });

    it('should can update user name', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                name: 'Updated name',
            });
        
        expect(result.status).toBe(200);
        expect(result.body.data.username).toEqual('test');
        expect(result.body.data.name).toEqual('Updated name');
    });

    it('should can update user password', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'test')
            .send({
                password: 'rahasia'
            });
        
        expect(result.status).toBe(200);
        expect(result.body.data.username).toEqual('test');
        expect(result.body.data.name).toEqual('Test user');

        const user = await getTestUser();
        expect(await bcrypt.compare('rahasia', user.password)).toBe(true);
    });

    it('should reject if request is not valid', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'wrong-token')
            .send({});

        expect(result.status).toBe(401);
    });
});

describe('DELETE /api/users/logout', () => {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can logout', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data).toEqual('OK');

        const user = await getTestUser();
        expect(user.token).toBeNull();
    });

    it('should reject if token is wrong', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'wrong-token');

        expect(result.status).toBe(401);
    });
});
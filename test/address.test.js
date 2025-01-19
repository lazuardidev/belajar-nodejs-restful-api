import supertest from "supertest";

import { web } from "../src/application/web.js";
import {
    createTestAddress,
    createTestUser,
    createTestContact,
    getTestAddress,
    getTestContact,
    removeAllTestAddresses,
    removeAllTestContacts,
    removeTestUser,
} from "./test-util.js";
import e from "express";
import { log } from "winston";

describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can create new address', async () => {
        const contact = await getTestContact();
        const result = await supertest(web)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set('Authorization', 'test')
            .send({
                street: 'Jl. Jendral Sudirman',
                city: 'Jakarta',
                province: 'DKI Jakarta',
                country: 'Indonesia',
                postal_code: '12345',
            });

        expect(result.status).toBe(200);
        expect(result.body.data).toBeDefined();
        expect(result.body.data.street).toEqual('Jl. Jendral Sudirman');
        expect(result.body.data.city).toEqual('Jakarta');
        expect(result.body.data.province).toEqual('DKI Jakarta');
        expect(result.body.data.country).toEqual('Indonesia');
        expect(result.body.data.postal_code).toEqual('12345');
    });

    it('should reject if request is invalid', async () => {
        const contact = await getTestContact();

        const result = await supertest(web)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set('Authorization', 'test')
            .send({
                street: 'Jl. Jendral Sudirman',
                city: 'Jakarta',
                province: 'DKI Jakarta',
                country: '',
                postal_code: '',
            });

        expect(result.status).toBe(400);
    });

    it('should reject if contact not found', async () => {
        const result = await supertest(web)
            .post(`/api/contacts/999/addresses`)
            .set('Authorization', 'test')
            .send({
                street: 'Jl. Jendral Sudirman',
                city: 'Jakarta',
                province: 'DKI Jakarta',
                country: '',
                postal_code: '',
            });

        expect(result.status).toBe(404);
    });
});

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can get address', async () => {
        const contact = await getTestContact();
        const address = await getTestAddress();

        const result = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data).toBeDefined();
        expect(result.body.data.street).toEqual('street test');
        expect(result.body.data.city).toEqual('city test');
        expect(result.body.data.province).toEqual('province test');
        expect(result.body.data.country).toEqual('country test');
        expect(result.body.data.postal_code).toEqual('12345');
    });

    it('should reject if contact not found', async () => {
        const contact = await getTestContact();
        const address = await getTestAddress();

        const result = await supertest(web)
            .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });

    it('should reject if address not found', async () => {
        const contact = await getTestContact();
        const address = await getTestAddress();

        const result = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});

describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can update address', async () => {
        const contact = await getTestContact();
        const address = await getTestAddress();

        const result = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('Authorization', 'test')
            .send({
                street: 'Jl. Jendral Sudirman',
                city: 'Jakarta',
                province: 'DKI Jakarta',
                country: 'Indonesia',
                postal_code: '12345',
            });

        expect(result.status).toBe(200);
        expect(result.body.data).toBeDefined();
        expect(result.body.data.id).toEqual(address.id);
        expect(result.body.data.street).toEqual('Jl. Jendral Sudirman');
        expect(result.body.data.city).toEqual('Jakarta');
        expect(result.body.data.province).toEqual('DKI Jakarta');
        expect(result.body.data.country).toEqual('Indonesia');
        expect(result.body.data.postal_code).toEqual('12345');
    });

    it('should reject if request is invalid', async () => {
        const contact = await getTestContact();
        const address = await getTestAddress();

        const result = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('Authorization', 'test')
            .send({
                street: 'Jl. Jendral Sudirman',
                city: 'Jakarta',
                province: 'DKI Jakarta',
                country: '',
                postal_code: '',
            });

        expect(result.status).toBe(400);
    });

    it('should reject if contact not found', async () => {
        const contact = await getTestContact();
        const address = await getTestAddress();

        const result = await supertest(web)
            .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set('Authorization', 'test')
            .send({
                street: 'Jl. Jendral Sudirman',
                city: 'Jakarta',
                province: 'DKI Jakarta',
                country: 'Indonesia',
                postal_code: '12345',
            });

        expect(result.status).toBe(404);
    });

    it('should reject if address not found', async () => {
        const contact = await getTestContact();
        const address = await getTestAddress();

        const result = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set('Authorization', 'test')
            .send({
                street: 'Jl. Jendral Sudirman',
                city: 'Jakarta',
                province: 'DKI Jakarta',
                country: 'Indonesia',
                postal_code: '12345',
            });

        expect(result.status).toBe(404);
    });
});

describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can delete address', async () => {
        const contact = await getTestContact();
        let address = await getTestAddress();

        const result = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe('OK');

        address = await getTestAddress();
        expect(address).toBeNull();
    });

    it('should reject if contact not found', async () => {
        const contact = await getTestContact();
        const address = await getTestAddress();

        const result = await supertest(web)
            .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });

    it('should reject if address not found', async () => {
        const contact = await getTestContact();
        const address = await getTestAddress();

        const result = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});

describe('GET /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can list addresses', async () => {
        const contact = await getTestContact();

        const result = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses`)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data).toBeDefined();
        expect(result.body.data).toHaveLength(1);
        expect(result.body.data[0].street).toEqual('street test');
        expect(result.body.data[0].city).toEqual('city test');
        expect(result.body.data[0].province).toEqual('province test');
        expect(result.body.data[0].country).toEqual('country test');
        expect(result.body.data[0].postal_code).toEqual('12345');
    });

    it('should reject if contact not found', async () => {
        const contact = await getTestContact();

        const result = await supertest(web)
            .get(`/api/contacts/${contact.id + 1}/addresses`)
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});
import supertest from 'supertest';

import { web } from '../src/application/web.js';
import { logger } from '../src/application/logging.js';
import {
  createManyTestContacts,
  createTestContact,
  createTestUser,
  getTestContact,
  removeAllTestContacts,
  removeTestUser,
} from './test-util.js';

describe('POST /api/contacts', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should can create new contact', async () => {
    const result = await supertest(web)
      .post('/api/contacts')
      .set('Authorization', 'test')
      .send({
        first_name: 'test',
        last_name: 'test',
        email: 'test@mail.com',
        phone: '08111110',
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toEqual('test');
    expect(result.body.data.last_name).toEqual('test');
    expect(result.body.data.email).toEqual('test@mail.com');
    expect(result.body.data.phone).toEqual('08111110');
  });

  it('should reject if request is not valid', async () => {
    const result = await supertest(web)
      .post('/api/contacts')
      .set('Authorization', 'test')
      .send({
        first_name: '',
        last_name: 'test',
        email: 'test',
        phone: '0811111099999999999999999999999999999999999',
      });

      expect(result.status).toBe(400);
      expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should can get contact by id', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get(`/api/contacts/${testContact.id}`)
      .set('Authorization', 'test');

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe(testContact.first_name);
    expect(result.body.data.last_name).toBe(testContact.last_name);
    expect(result.body.data.email).toBe(testContact.email);
    expect(result.body.data.phone).toBe(testContact.phone);
  });

  it('should return 404 if contact id is not found', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get(`/api/contacts/${testContact.id + 1}`)
      .set('Authorization', 'test');

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe('PUT /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should can update existing contact by id', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .put(`/api/contacts/${testContact.id}`)
      .set('Authorization', 'test')
      .send({
        first_name: 'first',
        last_name: 'last',
        email: 'mail@mail.com',
        phone: '099999999',
      });

      expect(result.status).toBe(200);
      expect(result.body.data.id).toBe(testContact.id);
      expect(result.body.data.first_name).toBe('first');
      expect(result.body.data.last_name).toBe('last');
      expect(result.body.data.email).toBe('mail@mail.com');
      expect(result.body.data.phone).toBe('099999999');
    });

    it('should reject if request is not valid', async () => {
      const testContact = await getTestContact();

      const result = await supertest(web)
        .put(`/api/contacts/${testContact.id}`)
        .set('Authorization', 'test')
        .send({
          first_name: '',
          last_name: 'last',
          email: 'mail',
          phone: '',
        });

        expect(result.status).toBe(400);
    });

    it('should reject if contact id is not found', async () => {
      const testContact = await getTestContact();

      const result = await supertest(web)
        .put(`/api/contacts/${testContact.id + 1}`)
        .set('Authorization', 'test')
        .send({
          first_name: 'first',
        last_name: 'last',
        email: 'mail@mail.com',
        phone: '099999999',
        });

      expect(result.status).toBe(404);
  });
});

describe('DELETE /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should can delete existing contact by id', async () => {
    let testContact = await getTestContact();

    const result = await supertest(web)
      .delete(`/api/contacts/${testContact.id}`)
      .set('Authorization', 'test');

    expect(result.status).toBe(200);
    expect(result.body.data).toBe('OK');

    testContact = await getTestContact();
    expect(testContact).toBeNull();
  });

  it('should reject if contact id is not found', async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .delete(`/api/contacts/${testContact.id + 1}`)
      .set('Authorization', 'test');

    expect(result.status).toBe(404);
  });
});

describe('GET /api/contacts', () => {
  beforeEach(async () => {
    await createTestUser();
    await createManyTestContacts();
  });

  afterEach(async () => {
    await removeAllTestContacts();
    await removeTestUser();
  });

  it('should can search contact without parameter', async () => {
    const result = await supertest(web)
      .get(`/api/contacts`)
      .set('Authorization', 'test');

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  it('should can search to page 2', async () => {
    const result = await supertest(web)
      .get('/api/contacts')
      .query({ page: 2 })
      .set('Authorization', 'test');

      expect(result.status).toBe(200);
      expect(result.body.data.length).toBe(5);
      expect(result.body.paging.page).toBe(2);
      expect(result.body.paging.total_page).toBe(2);
      expect(result.body.paging.total_item).toBe(15);
  });

  it('should can search contact by name', async () => {
    const result = await supertest(web)
      .get(`/api/contacts`)
      .query({ name: 'test 1' })
      .set('Authorization', 'test');

      expect(result.status).toBe(200);
      expect(result.body.data.length).toBe(6);
      expect(result.body.paging.page).toBe(1);
      expect(result.body.paging.total_page).toBe(1);
      expect(result.body.paging.total_item).toBe(6);
  });

  it('should can search contact by email', async () => {
    const result = await supertest(web)
      .get(`/api/contacts`)
      .query({ email: 'test1' })
      .set('Authorization', 'test');

      expect(result.status).toBe(200);
      expect(result.body.data.length).toBe(6);
      expect(result.body.paging.page).toBe(1);
      expect(result.body.paging.total_page).toBe(1);
      expect(result.body.paging.total_item).toBe(6);
  });

  it('should can search contact by phone', async () => {
    const result = await supertest(web)
      .get(`/api/contacts`)
      .query({ phone: '081111101' })
      .set('Authorization', 'test');

      expect(result.status).toBe(200);
      expect(result.body.data.length).toBe(6);
      expect(result.body.paging.page).toBe(1);
      expect(result.body.paging.total_page).toBe(1);
      expect(result.body.paging.total_item).toBe(6);
  });
});
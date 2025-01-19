import { prismaClient } from "../src/application/database.js"
import bcrypt from 'bcrypt';

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: 'test',
        }
    });
}

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: 'test',
            password: await bcrypt.hash('password', 10),
            name: 'Test user',
            token: 'test',
        }
    });
}

export const getTestUser = async () => {
    return await prismaClient.user.findUnique({
        where: {
            username: 'test',
        }
    });
}

export const removeAllTestContacts = async () => {
    await prismaClient.contact.deleteMany({
        where: {
            username: 'test',
        }
    });
}

export const createTestContact = async () => {
    await prismaClient.contact.create({
        data: {
            username: 'test',
            first_name: 'test',
            last_name: 'test',
            email: 'test@mail.com',
            phone: '08111110',
        }
    });
}

export const createManyTestContacts = async () => {
    for (let i = 0; i < 15; i++) {
        await prismaClient.contact.create({
            data: {
                username: 'test',
                first_name: `test ${i}`,
                last_name: `test ${i}`,
                email: `test${i}@mail.com`,
                phone: `08111110${i}`,
            }
        });
    }
}

export const getTestContact = async () => {
    return await prismaClient.contact.findFirst({
        where: {
            username: 'test',
        }
    });
}

export const removeAllTestAddresses = async () => {
    await prismaClient.address.deleteMany({
        where: {
            contact: {
                username: 'test',
            }
        }
    });
}

export const createTestAddress = async () => {
    const contact = await getTestContact();
    await prismaClient.address.create({
        data: {
            contact_id: contact.id,
            street: 'street test',
            city: 'city test',
            province: 'province test',
            country: 'country test',
            postal_code: '12345',
        }
    });
}

export const getTestAddress = async () => {
    return await prismaClient.address.findFirst({
        where: {
            contact: {
                username: 'test',
            }
        }
    });
}
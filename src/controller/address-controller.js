import addressService from "../service/address-service.js";

const create = async (request, response, next) => {
    try {
        const user = request.user;
        const requestBody = request.body;
        const contactId = request.params.contactId;

        const result = await addressService.create(user, contactId, requestBody);

        response.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
        
    }
}

const get = async (request, response, next) => {
    try {
        const user = request.user;
        const contactId = request.params.contactId;
        const addressId = request.params.addressId;

        const result = await addressService.get(user, contactId, addressId);

        response.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

const update = async (request, response, next) => {
    try {
        const user = request.user;
        const contactId = request.params.contactId;
        const addressId = request.params.addressId;
        const requestBody = request.body;
        requestBody.id = addressId;

        const result = await addressService.update(user, contactId, requestBody);

        response.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

const remove = async (request, response, next) => {
    try {
        const user = request.user;
        const contactId = request.params.contactId;
        const addressId = request.params.addressId;

        await addressService.remove(user, contactId, addressId);

        response.status(200).json({
            data: 'OK',
        });
    } catch (error) {
        next(error);
    }
}

const list = async (request, response, next) => {
    try {
        const user = request.user;
        const contactId = request.params.contactId;

        const result = await addressService.list(user, contactId);

        response.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

export default {
    create,
    get,
    update,
    remove,
    list,
};
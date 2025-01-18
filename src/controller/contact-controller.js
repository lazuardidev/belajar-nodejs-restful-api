import contactService from "../service/contact-service.js";

const create = async (request, response, next) => {
    try {
        const user = request.user;
        const requestBody = request.body;
        const result = await contactService.create(user, requestBody);
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
        const result = await contactService.get(user, contactId);
        response.json({
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
        const requestBody = request.body;
        requestBody.id = contactId;

        const result = await contactService.update(user, requestBody);
        response.json({
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

        await contactService.remove(user, contactId);
        response.status(200).json({
            data: 'OK',
        });
    } catch (error) {
        next(error);
    }
}

const search = async (request, response, next) => {
    try {
        const user = request.user;
        const query = {
            name: request.query.name,
            email: request.query.email,
            phone: request.query.phone,
            page: request.query.page,
            size: request.query.size,
        };

        const result = await contactService.search(user, query);
        response.status(200).json({
            data: result.data,
            paging: result.paging,
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
    search,
};
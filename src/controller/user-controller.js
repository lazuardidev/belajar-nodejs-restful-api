import userService from "../service/user-service.js";

const register = async (request, response, next) => {
    try {
        const result = await userService.register(request.body);
        response.status(200).json({
            data: result,
        });
    } catch (e) {
        next(e);
    }
}

const login = async (request, response, next) => {
    try {
        const result = await userService.login(request.body);
        response.status(200).json({
            data: result,
        });
    } catch (e) {
        next(e);
    }
}

const get = async (request, response, next) => {
    try {
        const username = request.user.username;
        const result = await userService.get(username);
        response.status(200).json({
            data: result,
        });
    } catch (e) {
        next(e);
    }
}

const update = async (request, response, next) => {
    try {
        const username = request.user.username;
        const requestBody = request.body;
        requestBody.username = username;

        const result = await userService.update(requestBody);
        response.status(200).json({
            data: result,
        });
    } catch (e) {
        next(e);
    }
}

const logout = async (request, response, next) => {
    try {
        await userService.logout(request.user.username);
        response.status(200).json({
            data: "OK",
        });
    } catch (e) {
        next(e);
    }
}

export default {
    register,
    login,
    get,
    update,
    logout,
}
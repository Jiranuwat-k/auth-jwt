const Joi = require("joi");

// Varlidation
const registerValidation = data => {
    const Schema = Joi.object({
        firstname: Joi.string().min(6).required(),
        lastname: Joi.string().min(6).required(),
        gender: Joi.string().min(4).required(),
        birthday: Joi.date(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });

    return  Schema.validate(data);
}
const loginValidation = data =>{
    const Schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });

    return Schema.validate(data);
}


module.exports.register = registerValidation;
module.exports.login = loginValidation;
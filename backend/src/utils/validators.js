// src/utils/validators.js
const Joi = require('joi');

exports.email = Joi.string().email().required();
exports.password = Joi.string().min(6).required();

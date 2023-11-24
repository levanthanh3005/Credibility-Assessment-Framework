const format_check = require("./src/format_check");
/**
 * @module metrics/requirements/level_3
 */

/**
 * @typedef {import('./types/types').ResultLog} ResultLog
 */

/**
 * Checks if a single requirement fulfills quality aspects in a way that specifications can be built upon it and 
 * validation results can refer to it 
 * 
 * @author lvtan3005
 * @license BSD-2-Clause
 * @kind function
 * @version 1.0
 * @domain domain-independent
 * @modeltypes model type-independent
 * @level 3
 * @phase requirements
 * @step [models, parameters, environment, test Cases, integration]
 * @param {String} requirement raw string of ReqIF (2.0.x) ModelDescription
 * @param {Array}  attributesToCheck list of required attributes in the model file
 * @returns {ResultLog} result and logging information
 */
const formatCheck = format_check.formatCheck

exports.formatCheck = formatCheck;
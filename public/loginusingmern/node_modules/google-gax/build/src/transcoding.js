"use strict";
/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcode = exports.getFieldNameOnBehavior = exports.isRequiredField = exports.isProto3OptionalField = exports.requestChangeCaseAndCleanup = exports.flattenObject = exports.match = exports.applyPattern = exports.encodeWithoutSlashes = exports.encodeWithSlashes = exports.buildQueryStringComponents = exports.deleteField = exports.deepCopy = exports.getField = void 0;
const util_1 = require("./util");
const httpOptionName = '(google.api.http)';
const fieldBehaviorOptionName = '(google.api.field_behavior)';
const proto3OptionalName = 'proto3_optional';
// List of methods as defined in google/api/http.proto (see HttpRule)
const supportedHttpMethods = ['get', 'post', 'put', 'patch', 'delete'];
function getField(request, field) {
    const parts = field.split('.');
    let value = request;
    for (const part of parts) {
        if (typeof value !== 'object') {
            return undefined;
        }
        value = value[part];
    }
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        return undefined;
    }
    return value;
}
exports.getField = getField;
function deepCopy(request) {
    if (typeof request !== 'object' || request === null) {
        return request;
    }
    const copy = Object.assign({}, request);
    for (const key in copy) {
        if (Array.isArray(copy[key])) {
            copy[key] = copy[key].map(deepCopy);
        }
        else if (typeof copy[key] === 'object' && copy[key] !== null) {
            copy[key] = deepCopy(copy[key]);
        }
    }
    return copy;
}
exports.deepCopy = deepCopy;
function deleteField(request, field) {
    const parts = field.split('.');
    while (parts.length > 1) {
        if (typeof request !== 'object') {
            return;
        }
        const part = parts.shift();
        request = request[part];
    }
    const part = parts.shift();
    if (typeof request !== 'object') {
        return;
    }
    delete request[part];
}
exports.deleteField = deleteField;
function buildQueryStringComponents(request, prefix = '') {
    const resultList = [];
    for (const key in request) {
        if (Array.isArray(request[key])) {
            for (const value of request[key]) {
                resultList.push(`${prefix}${encodeWithoutSlashes(key)}=${encodeWithoutSlashes(value.toString())}`);
            }
        }
        else if (typeof request[key] === 'object' && request[key] !== null) {
            resultList.push(...buildQueryStringComponents(request[key], `${key}.`));
        }
        else {
            resultList.push(`${prefix}${encodeWithoutSlashes(key)}=${encodeWithoutSlashes(request[key] === null ? 'null' : request[key].toString())}`);
        }
    }
    return resultList;
}
exports.buildQueryStringComponents = buildQueryStringComponents;
function encodeWithSlashes(str) {
    return str
        .split('')
        .map(c => (c.match(/[-_.~0-9a-zA-Z]/) ? c : encodeURIComponent(c)))
        .join('');
}
exports.encodeWithSlashes = encodeWithSlashes;
function encodeWithoutSlashes(str) {
    return str
        .split('')
        .map(c => (c.match(/[-_.~0-9a-zA-Z/]/) ? c : encodeURIComponent(c)))
        .join('');
}
exports.encodeWithoutSlashes = encodeWithoutSlashes;
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function applyPattern(pattern, fieldValue) {
    if (!pattern || pattern === '*') {
        return encodeWithSlashes(fieldValue);
    }
    if (!pattern.includes('*') && pattern !== fieldValue) {
        return undefined;
    }
    // since we're converting the pattern to a regex, make necessary precautions:
    const regex = new RegExp('^' +
        escapeRegExp(pattern)
            .replace(/\\\*\\\*/g, '(.+)')
            .replace(/\\\*/g, '([^/]+)') +
        '$');
    if (!fieldValue.match(regex)) {
        return undefined;
    }
    return encodeWithoutSlashes(fieldValue);
}
exports.applyPattern = applyPattern;
function match(request, pattern) {
    let url = pattern;
    const matchedFields = [];
    for (;;) {
        const match = url.match(/^(.*)\{([^}=]+)(?:=([^}]*))?\}(.*)/);
        if (!match) {
            break;
        }
        const [, before, field, pattern, after] = match;
        matchedFields.push(field);
        const fieldValue = getField(request, field);
        if (typeof fieldValue === 'undefined') {
            return undefined;
        }
        const appliedPattern = applyPattern(pattern, fieldValue === null ? 'null' : fieldValue.toString());
        if (typeof appliedPattern === 'undefined') {
            return undefined;
        }
        url = before + appliedPattern + after;
    }
    return { matchedFields, url };
}
exports.match = match;
function flattenObject(request) {
    const result = {};
    for (const key in request) {
        if (typeof request[key] === 'undefined') {
            continue;
        }
        if (Array.isArray(request[key])) {
            // According to the http.proto comments, a repeated field may only
            // contain primitive types, so no extra recursion here.
            result[key] = request[key];
            continue;
        }
        if (typeof request[key] === 'object' && request[key] !== null) {
            const nested = flattenObject(request[key]);
            for (const nestedKey in nested) {
                result[`${key}.${nestedKey}`] = nested[nestedKey];
            }
            continue;
        }
        result[key] = request[key];
    }
    return result;
}
exports.flattenObject = flattenObject;
function requestChangeCaseAndCleanup(request, caseChangeFunc) {
    if (!request || typeof request !== 'object') {
        return request;
    }
    const convertedRequest = {};
    for (const field in request) {
        // cleaning up inherited properties
        if (!Object.prototype.hasOwnProperty.call(request, field)) {
            continue;
        }
        const convertedField = caseChangeFunc(field);
        const value = request[field];
        if (Array.isArray(value)) {
            convertedRequest[convertedField] = value.map(v => requestChangeCaseAndCleanup(v, caseChangeFunc));
        }
        else {
            convertedRequest[convertedField] = requestChangeCaseAndCleanup(value, caseChangeFunc);
        }
    }
    return convertedRequest;
}
exports.requestChangeCaseAndCleanup = requestChangeCaseAndCleanup;
function isProto3OptionalField(field) {
    return field && field.options && field.options[proto3OptionalName];
}
exports.isProto3OptionalField = isProto3OptionalField;
function isRequiredField(field) {
    return (field &&
        field.options &&
        field.options[fieldBehaviorOptionName] === 'REQUIRED');
}
exports.isRequiredField = isRequiredField;
function getFieldNameOnBehavior(fields) {
    const requiredFields = new Set();
    const optionalFields = new Set();
    for (const fieldName in fields) {
        const field = fields[fieldName];
        if (isRequiredField(field)) {
            requiredFields.add(fieldName);
        }
        if (isProto3OptionalField(field)) {
            optionalFields.add(fieldName);
        }
    }
    return { requiredFields, optionalFields };
}
exports.getFieldNameOnBehavior = getFieldNameOnBehavior;
function transcode(request, parsedOptions, requestFields) {
    const { requiredFields, optionalFields } = getFieldNameOnBehavior(requestFields);
    // all fields annotated as REQUIRED MUST be emitted in the body.
    for (const requiredField of requiredFields) {
        if (!(requiredField in request) || request[requiredField] === 'undefined') {
            throw new Error(`Required field ${requiredField} is not present in the request.`);
        }
    }
    // request is supposed to have keys in camelCase.
    const snakeRequest = requestChangeCaseAndCleanup(request, util_1.camelToSnakeCase);
    const httpRules = [];
    for (const option of parsedOptions) {
        if (!(httpOptionName in option)) {
            continue;
        }
        const httpRule = option[httpOptionName];
        httpRules.push(httpRule);
        if (httpRule === null || httpRule === void 0 ? void 0 : httpRule.additional_bindings) {
            const additionalBindings = Array.isArray(httpRule.additional_bindings)
                ? httpRule.additional_bindings
                : [httpRule.additional_bindings];
            httpRules.push(...additionalBindings);
        }
    }
    for (const httpRule of httpRules) {
        for (const httpMethod of supportedHttpMethods) {
            if (!(httpMethod in httpRule)) {
                continue;
            }
            const pathTemplate = httpRule[httpMethod];
            const matchResult = match(snakeRequest, pathTemplate);
            if (typeof matchResult === 'undefined') {
                continue;
            }
            const { url, matchedFields } = matchResult;
            if (httpRule.body === '*') {
                // all fields except the matched fields go to request data
                const data = deepCopy(snakeRequest);
                for (const field of matchedFields) {
                    deleteField(data, field);
                }
                // Remove unset proto3 optional field from the request body.
                for (const key in data) {
                    if (optionalFields.has(util_1.snakeToCamelCase(key)) &&
                        (!(key in snakeRequest) || snakeRequest[key] === 'undefined')) {
                        delete data[key];
                    }
                }
                // HTTP endpoint expects camelCase but we have snake_case at this point
                const camelCaseData = requestChangeCaseAndCleanup(data, util_1.snakeToCamelCase);
                return { httpMethod, url, queryString: '', data: camelCaseData };
            }
            // one field possibly goes to request data, others go to query string
            const body = httpRule.body;
            let data = '';
            const queryStringObject = deepCopy(request); // use camel case for query string
            if (body) {
                deleteField(queryStringObject, util_1.snakeToCamelCase(body));
                // Unset optional field should not add in body request.
                data =
                    optionalFields.has(body) && snakeRequest[body] === 'undefined'
                        ? ''
                        : snakeRequest[body];
            }
            for (const field of matchedFields) {
                deleteField(queryStringObject, util_1.snakeToCamelCase(field));
            }
            // Unset proto3 optional field does not appear in the query params.
            for (const key in queryStringObject) {
                if (optionalFields.has(key) && request[key] === 'undefined') {
                    delete queryStringObject[key];
                }
            }
            const queryStringComponents = buildQueryStringComponents(queryStringObject);
            const queryString = queryStringComponents.join('&');
            let camelCaseData;
            if (typeof data === 'string') {
                camelCaseData = data;
            }
            else {
                camelCaseData = requestChangeCaseAndCleanup(data, util_1.snakeToCamelCase);
            }
            return { httpMethod, url, queryString, data: camelCaseData };
        }
    }
    return undefined;
}
exports.transcode = transcode;
//# sourceMappingURL=transcoding.js.map
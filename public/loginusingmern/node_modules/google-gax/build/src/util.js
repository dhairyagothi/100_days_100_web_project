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
exports.snakeToCamelCase = exports.camelToSnakeCase = void 0;
/**
 * Converts a given string from camelCase (used by protobuf.js and in JSON)
 * to snake_case (normally used in proto definitions).
 */
function camelToSnakeCase(str) {
    // Keep the first position capitalization, otherwise decapitalize with underscore.
    return str.replace(/(?!^)[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}
exports.camelToSnakeCase = camelToSnakeCase;
/**
 * Capitalizes the first character of the given string.
 */
function capitalize(str) {
    if (str.length === 0) {
        return str;
    }
    return str[0].toUpperCase() + str.slice(1);
}
/**
 * Converts a given string from snake_case (normally used in proto definitions) to
 * camelCase (used by protobuf.js)
 */
function snakeToCamelCase(str) {
    // split on spaces, underscore, or capital letters
    const splitted = str
        .split(/(?=[A-Z])|(?:(?!(_(\W+)))[\s_])+/)
        .filter(w => w && w.length > 0)
        // Keep the capitalization for the first split.
        .map((word, index) => (index === 0 ? word : word.toLowerCase()));
    if (splitted.length === 0) {
        return str;
    }
    return [splitted[0], ...splitted.slice(1).map(capitalize)].join('');
}
exports.snakeToCamelCase = snakeToCamelCase;
//# sourceMappingURL=util.js.map
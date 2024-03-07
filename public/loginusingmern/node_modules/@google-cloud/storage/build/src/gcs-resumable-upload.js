"use strict";
// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.createURI = exports.upload = exports.Upload = exports.PROTOCOL_REGEX = void 0;
const abort_controller_1 = require("abort-controller");
const ConfigStore = require("configstore");
const crypto_1 = require("crypto");
const extend = require("extend");
const gaxios = require("gaxios");
const google_auth_library_1 = require("google-auth-library");
const stream_1 = require("stream");
const retry = require("async-retry");
const uuid = require("uuid");
const NOT_FOUND_STATUS_CODE = 404;
const TERMINATED_UPLOAD_STATUS_CODE = 410;
const RESUMABLE_INCOMPLETE_STATUS_CODE = 308;
const DEFAULT_API_ENDPOINT_REGEX = /.*\.googleapis\.com/;
const packageJson = require('../../package.json');
exports.PROTOCOL_REGEX = /^(\w*):\/\//;
class Upload extends stream_1.Writable {
    constructor(cfg) {
        super();
        this.numBytesWritten = 0;
        this.numRetries = 0;
        this.currentInvocationId = {
            chunk: uuid.v4(),
            uri: uuid.v4(),
            offset: uuid.v4(),
        };
        this.upstreamChunkBuffer = Buffer.alloc(0);
        this.chunkBufferEncoding = undefined;
        this.numChunksReadInRequest = 0;
        /**
         * A chunk used for caching the most recent upload chunk.
         * We should not assume that the server received all bytes sent in the request.
         *  - https://cloud.google.com/storage/docs/performing-resumable-uploads#chunked-upload
         */
        this.lastChunkSent = Buffer.alloc(0);
        this.upstreamEnded = false;
        cfg = cfg || {};
        if (!cfg.bucket || !cfg.file) {
            throw new Error('A bucket and file name are required');
        }
        cfg.authConfig = cfg.authConfig || {};
        cfg.authConfig.scopes = [
            'https://www.googleapis.com/auth/devstorage.full_control',
        ];
        this.authClient = cfg.authClient || new google_auth_library_1.GoogleAuth(cfg.authConfig);
        this.apiEndpoint = 'https://storage.googleapis.com';
        if (cfg.apiEndpoint) {
            this.apiEndpoint = this.sanitizeEndpoint(cfg.apiEndpoint);
            if (!DEFAULT_API_ENDPOINT_REGEX.test(cfg.apiEndpoint)) {
                this.authClient = gaxios;
            }
        }
        this.baseURI = `${this.apiEndpoint}/upload/storage/v1/b`;
        this.bucket = cfg.bucket;
        const cacheKeyElements = [cfg.bucket, cfg.file];
        if (typeof cfg.generation === 'number') {
            cacheKeyElements.push(`${cfg.generation}`);
        }
        this.cacheKey = cacheKeyElements.join('/');
        this.customRequestOptions = cfg.customRequestOptions || {};
        this.file = cfg.file;
        this.generation = cfg.generation;
        this.kmsKeyName = cfg.kmsKeyName;
        this.metadata = cfg.metadata || {};
        this.offset = cfg.offset;
        this.origin = cfg.origin;
        this.params = cfg.params || {};
        this.userProject = cfg.userProject;
        this.chunkSize = cfg.chunkSize;
        this.retryOptions = cfg.retryOptions;
        if (cfg.key) {
            const base64Key = Buffer.from(cfg.key).toString('base64');
            this.encryption = {
                key: base64Key,
                hash: crypto_1.createHash('sha256').update(cfg.key).digest('base64'),
            };
        }
        this.predefinedAcl = cfg.predefinedAcl;
        if (cfg.private)
            this.predefinedAcl = 'private';
        if (cfg.public)
            this.predefinedAcl = 'publicRead';
        const configPath = cfg.configPath;
        this.configStore = new ConfigStore('gcs-resumable-upload', null, {
            configPath,
        });
        const autoRetry = cfg.retryOptions.autoRetry;
        this.uriProvidedManually = !!cfg.uri;
        this.uri = cfg.uri || this.get('uri');
        this.numBytesWritten = 0;
        this.numRetries = 0; // counter for number of retries currently executed
        if (!autoRetry) {
            cfg.retryOptions.maxRetries = 0;
        }
        this.timeOfFirstRequest = Date.now();
        const contentLength = cfg.metadata
            ? Number(cfg.metadata.contentLength)
            : NaN;
        this.contentLength = isNaN(contentLength) ? '*' : contentLength;
        this.once('writing', () => {
            if (this.uri) {
                this.continueUploading();
            }
            else {
                this.createURI((err, uri) => {
                    if (err) {
                        return this.destroy(err);
                    }
                    this.set({ uri });
                    this.startUploading();
                    return;
                });
            }
        });
    }
    /**
     * Prevent 'finish' event until the upload has succeeded.
     *
     * @param fireFinishEvent The finish callback
     */
    _final(fireFinishEvent = () => { }) {
        this.upstreamEnded = true;
        this.once('uploadFinished', fireFinishEvent);
        process.nextTick(() => {
            this.emit('upstreamFinished');
            // it's possible `_write` may not be called - namely for empty object uploads
            this.emit('writing');
        });
    }
    /**
     * Handles incoming data from upstream
     *
     * @param chunk The chunk to append to the buffer
     * @param encoding The encoding of the chunk
     * @param readCallback A callback for when the buffer has been read downstream
     */
    _write(chunk, encoding, readCallback = () => { }) {
        // Backwards-compatible event
        this.emit('writing');
        this.upstreamChunkBuffer = Buffer.concat([
            this.upstreamChunkBuffer,
            typeof chunk === 'string' ? Buffer.from(chunk, encoding) : chunk,
        ]);
        this.chunkBufferEncoding = encoding;
        this.once('readFromChunkBuffer', readCallback);
        process.nextTick(() => this.emit('wroteToChunkBuffer'));
    }
    /**
     * Prepends data back to the upstream chunk buffer.
     *
     * @param chunk The data to prepend
     */
    unshiftChunkBuffer(chunk) {
        this.upstreamChunkBuffer = Buffer.concat([chunk, this.upstreamChunkBuffer]);
    }
    /**
     * Retrieves data from upstream's buffer.
     *
     * @param limit The maximum amount to return from the buffer.
     * @returns The data requested.
     */
    pullFromChunkBuffer(limit) {
        const chunk = this.upstreamChunkBuffer.slice(0, limit);
        this.upstreamChunkBuffer = this.upstreamChunkBuffer.slice(limit);
        // notify upstream we've read from the buffer so it can potentially
        // send more data down.
        process.nextTick(() => this.emit('readFromChunkBuffer'));
        return chunk;
    }
    /**
     * A handler for determining if data is ready to be read from upstream.
     *
     * @returns If there will be more chunks to read in the future
     */
    async waitForNextChunk() {
        const willBeMoreChunks = await new Promise(resolve => {
            // There's data available - it should be digested
            if (this.upstreamChunkBuffer.byteLength) {
                return resolve(true);
            }
            // The upstream writable ended, we shouldn't expect any more data.
            if (this.upstreamEnded) {
                return resolve(false);
            }
            // Nothing immediate seems to be determined. We need to prepare some
            // listeners to determine next steps...
            const wroteToChunkBufferCallback = () => {
                removeListeners();
                return resolve(true);
            };
            const upstreamFinishedCallback = () => {
                removeListeners();
                // this should be the last chunk, if there's anything there
                if (this.upstreamChunkBuffer.length)
                    return resolve(true);
                return resolve(false);
            };
            // Remove listeners when we're ready to callback.
            const removeListeners = () => {
                this.removeListener('wroteToChunkBuffer', wroteToChunkBufferCallback);
                this.removeListener('upstreamFinished', upstreamFinishedCallback);
            };
            // If there's data recently written it should be digested
            this.once('wroteToChunkBuffer', wroteToChunkBufferCallback);
            // If the upstream finishes let's see if there's anything to grab
            this.once('upstreamFinished', upstreamFinishedCallback);
        });
        return willBeMoreChunks;
    }
    /**
     * Reads data from upstream up to the provided `limit`.
     * Ends when the limit has reached or no data is expected to be pushed from upstream.
     *
     * @param limit The most amount of data this iterator should return. `Infinity` by default.
     * @param oneChunkMode Determines if one, exhaustive chunk is yielded for the iterator
     */
    async *upstreamIterator(limit = Infinity, oneChunkMode) {
        let completeChunk = Buffer.alloc(0);
        // read from upstream chunk buffer
        while (limit && (await this.waitForNextChunk())) {
            // read until end or limit has been reached
            const chunk = this.pullFromChunkBuffer(limit);
            limit -= chunk.byteLength;
            if (oneChunkMode) {
                // return 1 chunk at the end of iteration
                completeChunk = Buffer.concat([completeChunk, chunk]);
            }
            else {
                // return many chunks throughout iteration
                yield {
                    chunk,
                    encoding: this.chunkBufferEncoding,
                };
            }
        }
        if (oneChunkMode) {
            yield {
                chunk: completeChunk,
                encoding: this.chunkBufferEncoding,
            };
        }
    }
    createURI(callback) {
        if (!callback) {
            return this.createURIAsync();
        }
        this.createURIAsync().then(r => callback(null, r), callback);
    }
    async createURIAsync() {
        const metadata = this.metadata;
        // Check if headers already exist before creating new ones
        const reqOpts = {
            method: 'POST',
            url: [this.baseURI, this.bucket, 'o'].join('/'),
            params: Object.assign({
                name: this.file,
                uploadType: 'resumable',
            }, this.params),
            data: metadata,
            headers: {
                'x-goog-api-client': `gl-node/${process.versions.node} gccl/${packageJson.version} gccl-invocation-id/${this.currentInvocationId.uri}`,
            },
        };
        if (metadata.contentLength) {
            reqOpts.headers['X-Upload-Content-Length'] =
                metadata.contentLength.toString();
        }
        if (metadata.contentType) {
            reqOpts.headers['X-Upload-Content-Type'] = metadata.contentType;
        }
        if (typeof this.generation !== 'undefined') {
            reqOpts.params.ifGenerationMatch = this.generation;
        }
        if (this.kmsKeyName) {
            reqOpts.params.kmsKeyName = this.kmsKeyName;
        }
        if (this.predefinedAcl) {
            reqOpts.params.predefinedAcl = this.predefinedAcl;
        }
        if (this.origin) {
            reqOpts.headers.Origin = this.origin;
        }
        const uri = await retry(async (bail) => {
            var _a, _b, _c;
            try {
                const res = await this.makeRequest(reqOpts);
                // We have successfully got a URI we can now create a new invocation id
                this.currentInvocationId.uri = uuid.v4();
                return res.headers.location;
            }
            catch (err) {
                const e = err;
                const apiError = {
                    code: (_a = e.response) === null || _a === void 0 ? void 0 : _a.status,
                    name: (_b = e.response) === null || _b === void 0 ? void 0 : _b.statusText,
                    message: (_c = e.response) === null || _c === void 0 ? void 0 : _c.statusText,
                    errors: [
                        {
                            reason: e.code,
                        },
                    ],
                };
                if (this.retryOptions.maxRetries > 0 &&
                    this.retryOptions.retryableErrorFn(apiError)) {
                    throw e;
                }
                else {
                    return bail(e);
                }
            }
        }, {
            retries: this.retryOptions.maxRetries,
            factor: this.retryOptions.retryDelayMultiplier,
            maxTimeout: this.retryOptions.maxRetryDelay * 1000,
            maxRetryTime: this.retryOptions.totalTimeout * 1000,
        });
        this.uri = uri;
        this.offset = 0;
        return uri;
    }
    async continueUploading() {
        if (typeof this.offset === 'number') {
            this.startUploading();
            return;
        }
        await this.getAndSetOffset();
        this.startUploading();
    }
    async startUploading() {
        const multiChunkMode = !!this.chunkSize;
        let responseReceived = false;
        this.numChunksReadInRequest = 0;
        if (!this.offset) {
            this.offset = 0;
        }
        // Check if we're uploading the expected object
        if (this.numBytesWritten === 0) {
            const isSameObject = await this.ensureUploadingSameObject();
            if (!isSameObject) {
                // `ensureUploadingSameObject` will restart the upload.
                return;
            }
        }
        // Check if the offset (server) is too far behind the current stream
        if (this.offset < this.numBytesWritten) {
            const delta = this.numBytesWritten - this.offset;
            const message = `The offset is lower than the number of bytes written. The server has ${this.offset} bytes and while ${this.numBytesWritten} bytes has been uploaded - thus ${delta} bytes are missing. Stopping as this could result in data loss. Initiate a new upload to continue.`;
            this.emit('error', new RangeError(message));
            return;
        }
        // Check if we should 'fast-forward' to the relevant data to upload
        if (this.numBytesWritten < this.offset) {
            // 'fast-forward' to the byte where we need to upload.
            // only push data from the byte after the one we left off on
            const fastForwardBytes = this.offset - this.numBytesWritten;
            for await (const _chunk of this.upstreamIterator(fastForwardBytes)) {
                _chunk; // discard the data up until the point we want
            }
            this.numBytesWritten = this.offset;
        }
        let expectedUploadSize = undefined;
        // Set `expectedUploadSize` to `contentLength` if available
        if (typeof this.contentLength === 'number') {
            expectedUploadSize = this.contentLength - this.numBytesWritten;
        }
        // `expectedUploadSize` should be no more than the `chunkSize`.
        // It's possible this is the last chunk request for a multiple
        // chunk upload, thus smaller than the chunk size.
        if (this.chunkSize) {
            expectedUploadSize = expectedUploadSize
                ? Math.min(this.chunkSize, expectedUploadSize)
                : this.chunkSize;
        }
        // A queue for the upstream data
        const upstreamQueue = this.upstreamIterator(expectedUploadSize, multiChunkMode // multi-chunk mode should return 1 chunk per request
        );
        // The primary read stream for this request. This stream retrieves no more
        // than the exact requested amount from upstream.
        const requestStream = new stream_1.Readable({
            read: async () => {
                // Don't attempt to retrieve data upstream if we already have a response
                if (responseReceived)
                    requestStream.push(null);
                const result = await upstreamQueue.next();
                if (result.value) {
                    this.numChunksReadInRequest++;
                    this.lastChunkSent = result.value.chunk;
                    this.numBytesWritten += result.value.chunk.byteLength;
                    this.emit('progress', {
                        bytesWritten: this.numBytesWritten,
                        contentLength: this.contentLength,
                    });
                    requestStream.push(result.value.chunk, result.value.encoding);
                }
                if (result.done) {
                    requestStream.push(null);
                }
            },
        });
        const headers = {
            'x-goog-api-client': `gl-node/${process.versions.node} gccl/${packageJson.version} gccl-invocation-id/${this.currentInvocationId.chunk}`,
        };
        // If using multiple chunk upload, set appropriate header
        if (multiChunkMode && expectedUploadSize) {
            // The '-1' is because the ending byte is inclusive in the request.
            const endingByte = expectedUploadSize + this.numBytesWritten - 1;
            headers['Content-Length'] = expectedUploadSize;
            headers['Content-Range'] = `bytes ${this.offset}-${endingByte}/${this.contentLength}`;
        }
        else {
            headers['Content-Range'] = `bytes ${this.offset}-*/${this.contentLength}`;
        }
        const reqOpts = {
            method: 'PUT',
            url: this.uri,
            headers,
            body: requestStream,
        };
        try {
            const resp = await this.makeRequestStream(reqOpts);
            if (resp) {
                responseReceived = true;
                this.responseHandler(resp);
            }
        }
        catch (err) {
            const e = err;
            this.destroy(e);
        }
    }
    // Process the API response to look for errors that came in
    // the response body.
    responseHandler(resp) {
        if (resp.data.error) {
            this.destroy(resp.data.error);
            return;
        }
        // At this point we can safely create a new id for the chunk
        this.currentInvocationId.chunk = uuid.v4();
        const shouldContinueWithNextMultiChunkRequest = this.chunkSize &&
            resp.status === RESUMABLE_INCOMPLETE_STATUS_CODE &&
            resp.headers.range;
        if (shouldContinueWithNextMultiChunkRequest) {
            // Use the upper value in this header to determine where to start the next chunk.
            // We should not assume that the server received all bytes sent in the request.
            // https://cloud.google.com/storage/docs/performing-resumable-uploads#chunked-upload
            const range = resp.headers.range;
            this.offset = Number(range.split('-')[1]) + 1;
            // We should not assume that the server received all bytes sent in the request.
            // - https://cloud.google.com/storage/docs/performing-resumable-uploads#chunked-upload
            const missingBytes = this.numBytesWritten - this.offset;
            if (missingBytes) {
                const dataToPrependForResending = this.lastChunkSent.slice(-missingBytes);
                // As multi-chunk uploads send one chunk per request and pulls one
                // chunk into the pipeline, prepending the missing bytes back should
                // be fine for the next request.
                this.unshiftChunkBuffer(dataToPrependForResending);
                this.numBytesWritten -= missingBytes;
                this.lastChunkSent = Buffer.alloc(0);
            }
            // continue uploading next chunk
            this.continueUploading();
        }
        else if (!this.isSuccessfulResponse(resp.status)) {
            const err = {
                code: resp.status,
                name: 'Upload failed',
                message: 'Upload failed',
            };
            this.destroy(err);
        }
        else {
            // remove the last chunk sent to free memory
            this.lastChunkSent = Buffer.alloc(0);
            if (resp && resp.data) {
                resp.data.size = Number(resp.data.size);
            }
            this.emit('metadata', resp.data);
            this.deleteConfig();
            // Allow the object (Upload) to continue naturally so the user's
            // "finish" event fires.
            this.emit('uploadFinished');
        }
    }
    /**
     * Check if this is the same content uploaded previously. This caches a
     * slice of the first chunk, then compares it with the first byte of
     * incoming data.
     *
     * @returns if the request is ok to continue as-is
     */
    async ensureUploadingSameObject() {
        // A queue for the upstream data
        const upstreamQueue = this.upstreamIterator(16, true // we just want one chunk for this validation
        );
        const upstreamChunk = await upstreamQueue.next();
        const chunk = upstreamChunk.value
            ? upstreamChunk.value.chunk
            : Buffer.alloc(0);
        // Put the original chunk back into the buffer as we just wanted to 'peek'
        // at the stream for validation.
        this.unshiftChunkBuffer(chunk);
        let cachedFirstChunk = this.get('firstChunk');
        const firstChunk = chunk.valueOf();
        if (!cachedFirstChunk) {
            // This is a new upload. Cache the first chunk.
            this.set({ uri: this.uri, firstChunk });
        }
        else {
            // this continues an upload in progress. check if the bytes are the same
            cachedFirstChunk = Buffer.from(cachedFirstChunk);
            const nextChunk = Buffer.from(firstChunk);
            if (Buffer.compare(cachedFirstChunk, nextChunk) !== 0) {
                // this data is not the same. start a new upload
                this.restart();
                return false;
            }
        }
        return true;
    }
    async getAndSetOffset() {
        const opts = {
            method: 'PUT',
            url: this.uri,
            headers: {
                'Content-Length': 0,
                'Content-Range': 'bytes */*',
                'x-goog-api-client': `gl-node/${process.versions.node} gccl/${packageJson.version} gccl-invocation-id/${this.currentInvocationId.offset}`,
            },
        };
        try {
            const resp = await this.makeRequest(opts);
            // Successfully got the offset we can now create a new offset invocation id
            this.currentInvocationId.offset = uuid.v4();
            if (resp.status === RESUMABLE_INCOMPLETE_STATUS_CODE) {
                if (resp.headers.range) {
                    const range = resp.headers.range;
                    this.offset = Number(range.split('-')[1]) + 1;
                    return;
                }
            }
            this.offset = 0;
        }
        catch (e) {
            const err = e;
            const resp = err.response;
            // we don't return a 404 to the user if they provided the resumable
            // URI. if we're just using the configstore file to tell us that this
            // file exists, and it turns out that it doesn't (the 404), that's
            // probably stale config data.
            if (resp &&
                resp.status === NOT_FOUND_STATUS_CODE &&
                !this.uriProvidedManually) {
                this.restart();
                return;
            }
            // this resumable upload is unrecoverable (bad data or service error).
            if (resp && resp.status === TERMINATED_UPLOAD_STATUS_CODE) {
                this.restart();
                return;
            }
            this.destroy(err);
        }
    }
    async makeRequest(reqOpts) {
        if (this.encryption) {
            reqOpts.headers = reqOpts.headers || {};
            reqOpts.headers['x-goog-encryption-algorithm'] = 'AES256';
            reqOpts.headers['x-goog-encryption-key'] = this.encryption.key.toString();
            reqOpts.headers['x-goog-encryption-key-sha256'] =
                this.encryption.hash.toString();
        }
        if (this.userProject) {
            reqOpts.params = reqOpts.params || {};
            reqOpts.params.userProject = this.userProject;
        }
        // Let gaxios know we will handle a 308 error code ourselves.
        reqOpts.validateStatus = (status) => {
            return (this.isSuccessfulResponse(status) ||
                status === RESUMABLE_INCOMPLETE_STATUS_CODE);
        };
        const combinedReqOpts = extend(true, {}, this.customRequestOptions, reqOpts);
        const res = await this.authClient.request(combinedReqOpts);
        if (res.data && res.data.error) {
            throw res.data.error;
        }
        return res;
    }
    async makeRequestStream(reqOpts) {
        const controller = new abort_controller_1.default();
        const errorCallback = () => controller.abort();
        this.once('error', errorCallback);
        if (this.userProject) {
            reqOpts.params = reqOpts.params || {};
            reqOpts.params.userProject = this.userProject;
        }
        reqOpts.signal = controller.signal;
        reqOpts.validateStatus = () => true;
        const combinedReqOpts = extend(true, {}, this.customRequestOptions, reqOpts);
        const res = await this.authClient.request(combinedReqOpts);
        const successfulRequest = this.onResponse(res);
        this.removeListener('error', errorCallback);
        return successfulRequest ? res : null;
    }
    restart() {
        if (this.numBytesWritten) {
            const message = 'Attempting to restart an upload after unrecoverable bytes have been written from upstream. Stopping as this could result in data loss. Initiate a new upload to continue.';
            this.emit('error', new RangeError(message));
            return;
        }
        this.lastChunkSent = Buffer.alloc(0);
        this.deleteConfig();
        this.createURI((err, uri) => {
            if (err) {
                return this.destroy(err);
            }
            this.set({ uri });
            this.startUploading();
            return;
        });
    }
    get(prop) {
        const store = this.configStore.get(this.cacheKey);
        return store && store[prop];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(props) {
        this.configStore.set(this.cacheKey, props);
    }
    deleteConfig() {
        this.configStore.delete(this.cacheKey);
    }
    /**
     * @return {bool} is the request good?
     */
    onResponse(resp) {
        if (resp.status !== 200 &&
            this.retryOptions.retryableErrorFn({
                code: resp.status,
                message: resp.statusText,
                name: resp.statusText,
            })) {
            this.attemptDelayedRetry(resp);
            return false;
        }
        this.emit('response', resp);
        return true;
    }
    /**
     * @param resp GaxiosResponse object from previous attempt
     */
    attemptDelayedRetry(resp) {
        if (this.numRetries < this.retryOptions.maxRetries) {
            if (resp.status === NOT_FOUND_STATUS_CODE &&
                this.numChunksReadInRequest === 0) {
                this.startUploading();
            }
            else {
                const retryDelay = this.getRetryDelay();
                if (retryDelay <= 0) {
                    this.destroy(new Error(`Retry total time limit exceeded - ${resp.data}`));
                    return;
                }
                // Unshift the most recent chunk back in case it's needed for the next
                // request.
                this.numBytesWritten -= this.lastChunkSent.byteLength;
                this.unshiftChunkBuffer(this.lastChunkSent);
                this.lastChunkSent = Buffer.alloc(0);
                // We don't know how much data has been received by the server.
                // `continueUploading` will recheck the offset via `getAndSetOffset`.
                // If `offset` < `numberBytesReceived` then we will raise a RangeError
                // as we've streamed too much data that has been missed - this should
                // not be the case for multi-chunk uploads as `lastChunkSent` is the
                // body of the entire request.
                this.offset = undefined;
                setTimeout(this.continueUploading.bind(this), retryDelay);
            }
            this.numRetries++;
        }
        else {
            this.destroy(new Error('Retry limit exceeded - ' + resp.data));
        }
    }
    /**
     * @returns {number} the amount of time to wait before retrying the request
     */
    getRetryDelay() {
        const randomMs = Math.round(Math.random() * 1000);
        const waitTime = Math.pow(this.retryOptions.retryDelayMultiplier, this.numRetries) *
            1000 +
            randomMs;
        const maxAllowableDelayMs = this.retryOptions.totalTimeout * 1000 -
            (Date.now() - this.timeOfFirstRequest);
        const maxRetryDelayMs = this.retryOptions.maxRetryDelay * 1000;
        return Math.min(waitTime, maxRetryDelayMs, maxAllowableDelayMs);
    }
    /*
     * Prepare user-defined API endpoint for compatibility with our API.
     */
    sanitizeEndpoint(url) {
        if (!exports.PROTOCOL_REGEX.test(url)) {
            url = `https://${url}`;
        }
        return url.replace(/\/+$/, ''); // Remove trailing slashes
    }
    /**
     * Check if a given status code is 2xx
     *
     * @param status The status code to check
     * @returns if the status is 2xx
     */
    isSuccessfulResponse(status) {
        return status >= 200 && status < 300;
    }
}
exports.Upload = Upload;
function upload(cfg) {
    return new Upload(cfg);
}
exports.upload = upload;
function createURI(cfg, callback) {
    const up = new Upload(cfg);
    if (!callback) {
        return up.createURI();
    }
    up.createURI().then(r => callback(null, r), callback);
}
exports.createURI = createURI;
//# sourceMappingURL=gcs-resumable-upload.js.map
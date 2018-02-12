import HttpClient from './HttpClient';
import JsonRpcPayload from './JsonRpcPayload';
import JsonRpcError from './JsonRpcError';
import JsonRpcUnauthorizedError from './JsonRpcUnauthorizedError';
import JsonRpcForbiddenError from './JsonRpcForbiddenError';


//
const MIMETYPE_JSON = 'application/json';

	
/** 
 */
export default class JsonRpc {


/** @private @type {XMLHttpRequest} */
	_xhr = null;

/** @private @type {function} */
	_promiseResolve = null;

/** @private @type {function} */
	_promiseReject = null;





/**
 * @constructor
 * @param {string} base_url
 * @param {XMLHttpRequest=} opt_xhrClass
 */
	constructor(base_url, opt_xhrClass) {
console.info('JsonRpc ready.');

		this._httpClient = new HttpClient(base_url, opt_xhrClass);
	};





/**
 * @return {HttpClient}
 */
	getHttpClient() {
		return this._httpClient;
	};





/**
 * @private
 * @param {Object} data
 * @param {function(error)} reject
 * @param {Object} payload
 * @return {boolean}
 */
	_hasError(data, reject, payload) {
		if (!!data.error && data.error instanceof Object) {
			var error = data.error;
			reject(new JsonRpcError(error.message, error.code, payload));
			return true;
		}
		return false;
	};





/**
 */	
	send(payload, opt_url) {
		return new Promise((resolve, reject) => {
			var request = new HttpClient.Request();
			request.setUrl(opt_url || '');
			request.setMethod(HttpClient.Request.Method.POST);
			request.setContentType(MIMETYPE_JSON);
			request.setBody(String(payload));
//
			this._httpClient.send(request)
				.then((response) => {
//
					if (response.isUnauthorized()) {
						reject(new JsonRpcUnauthorizedError(payload));
					}
					if (response.isForbidden()) {
						reject(new JsonRpcForbiddenError(payload));
					}
//
					if (response.getStatus() < 400) {
						var data = JSON.parse(response.getBody());

// Check if result contains errors
						if (data instanceof Object) {							
							if (this._hasError(data, reject, payload)) {
								return;
							};
						}
// Check errors in batch request
						else if (data instanceof Array) {
							for (var i in data) {
								if (data.hasOwnProperty(i)) {
									if (this._hasError(data[i], reject, payload)) {
										return;
									};
								}
							}
						}
						resolve(data);
					}
					reject(new JsonRpcError('Invalid server response.', response.getStatus(), payload));
				})
				.catch((error) => {			
					reject(new JsonRpcError(String(error), 0, payload));
				});
			});	
	};


};


/**
 * Request shortcut
 */
JsonRpc.Payload = JsonRpcPayload;
JsonRpc.Error = JsonRpcError;
JsonRpc.ForbiddenError = JsonRpcForbiddenError;
JsonRpc.UnauthorizedError = JsonRpcUnauthorizedError;



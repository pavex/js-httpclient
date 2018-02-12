import HttpClientRequest from './HttpClientRequest';
import HttpClientResponse from './HttpClientResponse';


/** s
 */
export default class Requester {


/** @private @type {XMLHttpRequest} */
		_xhr = null;

/** @private @type {function} */
		_resolve;

/** @private @type {function} */
		_reject;





/**
 * @constructor
 * @param {HttpClient} httpClient
 * @param {HttpClient.Request} request
 * @param {string} opt_base_url
 * @param {XMLHttpRequest=} opt_xhrClass
 */
	constructor(httpClient, request, opt_base_url, opt_xhrClass) {

/** @private @type {HttpClient} */
		this._httpClient = httpClient;

/** @private @type {HttpClient.Request} */
		this._request = request;

/** @private @type {string} */
		this._base_url = opt_base_url || '';

/** @private @type {XMLHttpRequest} */
		this._xhrClass = opt_xhrClass || XMLHttpRequest;
	};





/**
 * @private
 * @param {string}
 * @param {string=}
 * @return {string}
 */
	_coalesce(text, opt_default) {
		return (!text || 0 === text.length) ? (opt_default || '') : text;
	}





/**
 * @return {Array}
 */
	_getAllResponseHeaders() {
		var s = String(this._xhr.getAllResponseHeaders()).trim();
		return !!s ? s.split('\n') : [];
	};





/**
 * @private
 * @return {Array}
 */	
	_getResponseHeaders() {
		var headers = {};
		var xhrHeaders = this._getAllResponseHeaders();
//
		for (var i in xhrHeaders) {
			if (xhrHeaders.hasOwnProperty(i)) {
				var v = xhrHeaders[i].split(':');
				var name = v[0].trim();
				var value = v[1].trim();
				headers[name] = value;
			}
		}
		return headers;
	};





/**
 * @private 
 * @return {XMLHttpRequest}
 */
	_createXMLHttpRequest() {
		var xhr = new this._xhrClass();
		xhr.onload = this._xhrLoad.bind(this);
		xhr.ontimeout = this._xhrTimeout.bind(this);
		xhr.onerror = this._xhrError.bind(this);
		return xhr;
	};





/**
 * @private
 * @type {string} errorMessage
 */
//	_doError(errorMessage) {
//		if (!!this._onFailure) {
//			this._onFailure.call(this, errorMessage);
//			return;
//		}
//		throw new Error(errorMessage);
//	};





/**
 * @private
 * @param {EventType} e
 */
	_xhrLoad(e) {
//console.log('load', e.type, this._xhr.status);

		if (e.type === 'error' || !this._xhr.status) {
			var errorMessage = this._coalesce(this._xhr.responseText, 'Request error.');
			this._reject(errorMessage);
		}

// Build response and resolve
		var response = new HttpClientResponse(
			this._xhr.status, this._getResponseHeaders(), this._xhr.responseText
		);
		this._resolve(response);
	};





/**
 * @private
 * @param {EventType} e
 */
	_xhrTimeout(e) {
		this._reject('Request timeout.');
	};
	





/**
 * @private
 * @param {EventType} e
 */
	_xhrError(e) {
		this._xhrLoad(e);
	};





/**
 * @return {string}
 */
	_getRequestUrl(request) {
//		var url = this._httpClient._base_url + request.getUrl();
		var url = this._base_url + request.getUrl();
//		var url = request.getUrl();
		if (request.getMethod() === HttpClientRequest.Method.GET) {
			var s = '';
			var params = request.getParams();
			for (var i in params) {
				if (params.hasOwnProperty(i)) {
					s += s ? '&' : '';
					s += i + '=' + encodeURIComponent(params[i]);
				}
			}
			url += (s ? '?' : '') + s;
		}
		return url;
	};





/**
 * @param {HttpClientRequest} request
 */
	send() {
		return new Promise((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
//
			try {
//				this._response = null;
				this._xhr = this._createXMLHttpRequest();
				this._xhr.open(this._request.getMethod(), this._getRequestUrl(this._request));
				this._xhr.withCredentials = false;

// Update headers
				this._xhr.setRequestHeader('Accept', this._request.getContentType());
				var headers = this._request.getHeaders();
				for (var i in headers) {
					if (headers.hasOwnProperty(i)) {  
						this._xhr.setRequestHeader(i, headers[i]);
					}
				}
// Content
				var body = null;
				if (this._request.getMethod() !== HttpClientRequest.Method.GET) {
					body = this._request.getBody();
				}
//
				this._xhr.send(body);
			}
			catch (message) {
				reject(message);
//				this._doError(message);
			}
		});
	};

		

	
};


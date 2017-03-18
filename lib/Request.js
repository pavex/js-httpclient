/**
 * @fileoverview XMLHttpRequest controller for Publixe apps.
 * @author pavex@ines.cz
 */


/**
 */
export default class Request {


/** @private @type {string} */
	_url = '';


/** @private @type {Request.Method} */
	_method = Request.Method.GET;


/** @private @type {Request.Mimetype} */
	_contentType = Request.Mimetype.JSON;


/** @private @type {Array} */
	_headers = [];


/** @private @type {Array} */
	_params = {};


/** @private @type {string|null} */
	_response = null;


/** @private @type {function<>} */
	_onSuccess = null;


/** @private @type {function<>} */
	_onFailure = null;


/** @private @type {string|null} */
	_lastError = null;


/** @private @type {bolean} */
	_hasGlobal = false;


/** @private @type {bolean} */
	_liveDebugging = false;


/** @private @type {XMLHttpRequest} */
	_XMLHttpReques = XMLHttpRequest;





/**
 * @constructor
 */
	constructor() {
		this._hasGlobal = typeof GLOBAL != "undefined";
		if (this._hasGlobal) {
			if (GLOBAL.originalXMLHttpRequest) {
				this._XMLHttpReques = GLOBAL.originalXMLHttpRequest;
				this._liveDebugging = true;
			}
		}
	};





/**
 * Create XMLHttpRequest
 * @return {XMLHttpRequest}
 */
	_createXhr() {
		var xhr = new this._XMLHttpReques();
		xhr.onload = this._loadEvent.bind(this);
		xhr.ontimeout = this._loadEvent.bind(this);
		xhr.onerror = this._loadEvent.bind(this);
		return xhr;
	};





/**
 * Supported request methods
 */
	static Method = {
		GET: 'GET',
		POST: 'POST',
		PUT: 'PUT',
		DELETE: 'DELETE'
	};





/**
 * Supported mimetypes
 */
	static Mimetype = {
		JSON: 'application/json',
		XML: 'text/xml',
		FORM: 'application/www-form-encoded'
	};





/**
 * Supported request methods
 */
	static Status = {
		OK: 200,
		CREATED: 201,
		FORBIDDEN: 403
	};





/**
 * @param {string}
 */
	setUrl(url) {
		this._url = url;
	};





/**
 * @param {Request.Mimetype}
 */
	setContentType(contentType) {
		this._contentType = contentType;
	};





/**
 * @param {Request.Method}
 */
	setMethod(method) {
		this._method = method;
	};





/**
 * @param {string}
 * @param {string}
 */
	setHeader(name, value) {
		this._headers[name] = value;
	};





/**
 * @param {string}
 * @param {string|Array}
 */
	setParam(name, value) {
		this._params[name] = value;
	};





/**
 * @param {Object}
 */
	setParams(params) {
		this._params = params;
	};





/**
 * @param {Function<mixed>} callback
 */
	onSuccess(callback) {
		this._onSuccess = callback;
	};





/**
 * @param {Function<string>} callback
 */
	onFailure(callback) {
		this._onFailure = callback;
	};
	
	





/**
 * @return {Request.Mimetype}
 */
	_getResponseContentType() {
		var header = this._xhr.getResponseHeader('Content-Type');
		if (header) {
			var p = header.indexOf(';');
			return p > 0 ? header.substring(0, header.indexOf(';')) : header;
		}
		return null;
	};
	





/**
 * @param {Object}
 * @param {Request.Mimetype}
 * @return {string}
 */
	_serializeRequest(object, mimetype) {
		switch (mimetype) {
			case Request.Mimetype.JSON:
				return JSON.stringify(object);
			default:
				throw Error('Unsupported response mimetype.');
		}
	};





/**
 * @param {string} serialized  Serialized object
 * @param {Request.Mimetype}
 * @return {Object}
 */
	_unserializeResponse(serialized, mimetype) {
		switch (mimetype) {
			case Request.Mimetype.JSON:
				return JSON.parse(serialized);
			default:
				throw Error('Unsupported response mimetype.');
		}
	};





/**
 * @return {string}
 */
	_getRequestUrl() {
		var url = this._url;
		if (this._method === Request.Method.GET) {
			var s = '';
			for (var i in this._params) {
				s += s ? '&' : '';
				s += i + '=' + encodeURIComponent(this._params[i]);
			}
			url += (s ? '?' : '') + s;
		}
		return url;
	};





/**
 * Return HTTP status code
 * @return {number}
 */
	getStatus() {
		return this._xhr.status;
	};





/**
 * Return final response
 * @return {Mixed}
 */
	getResponse() {
		return this._response;
	};
	





/**
 * Get last error message
 * @return {string}
 */
	getLastError() {
		return this._lastError;
	};





/**
 * Set interal error message
 * @return {string}
 */
	_setLastError(errorMessage) {
		this._lastError = errorMessage;
	};





/**
 * @param {Request.Mimetype}
 */
	_prepareResponse(mimetype) {
		this._response = this._unserializeResponse(
			this._xhr.responseText,
			mimetype
		);
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
 * @return {EventType}
 */
	_loadEvent(e) {

		this.response_ = null;
		this.lastError_ = null;
//
		try {

// Possible HTTP/resuester error
			if (e.type === 'error' || !this._xhr.status) {
				var errorMessage = this._coalesce(this._xhr.responseText, 'Request error.');
				this._setLastError(errorMessage);
				this._doError();
				return;
			}

			var responseContentType = this._getResponseContentType();

// Valdate response
			if (responseContentType !== this._contentType) {
				console.warn('Require response content type set to `' + this._contentType + '`, `' + responseContentType + '` given.');
			}
			if (this._xhr.responseText == '') {
				this._setLastError('Empty response.');
				this._doError();
				return;
			}

// Prepare final response structure
			try {
				this._prepareResponse(this._contentType);
			}
			catch (error) {
				this._setLastError('Bad response (' + String(error) + ').');
				this._doError();
				return;
			}
			this._doSuccess();
		}
//
// Catch another non-standard situations
		catch (errorMessage) {
			this._setLastError(errorMessage);
			this._doError();
		}
	};





/**
 * Fire success callback
 * @return {string}
 */
	_doSuccess() {
		if (this._onSuccess) {
			this._onSuccess.call(this);
		}
	}





/**
 * Fire error callback
 * @return {string} error
 */
	_doError() {
		if (this._onFailure) {
			this._onFailure.call(this);
		}
		else {
			throw Error(this.getLastError());
		}
	}





/**
 */
	send() {
		try {
			this._response = null;
			this._xhr = this._createXhr();
			this._xhr.open(this._method, this._getRequestUrl());
			this._xhr.withCredentials = false;

// Update headers
			this._xhr.setRequestHeader('Accept', this._contentType);

// Chrome live debugging patch
			if (this._hasGlobal && !this._liveDebugging) {
				this._xhr.setRequestHeader('Content-Type', this._contentType);
			}
//
			for (var i in this._headers) {
				this._xhr.setRequestHeader(i, this._headers[i]);
			}
// Content
			var content = null;
			if (this._method !== Request.Method.GET) {
				content = this._serializeRequest(this._params, this._contentType);
			}
//
			this._xhr.send(content);
		}
		catch (message) {
			this._doError(message);
		}
	};





};


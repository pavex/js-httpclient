/**
 * @fileoverview XMLHttpRequest controller for Publixe apps.
 * @author pavex@ines.cz
 */


export default class Request {


/**
 */
	constructor(container) {
		this._url = '';
		this._method = Request.Method.GET;
		this._contentType = Request.Mimetype.JSON;
		this._headers = [];
		this._params = {};
		this._response = null;
		this._successCallback = null;
		this._failureCallback = null;
		this._lastError = null;

/** @private @type {boolean} */
//		this._alreadySend = false;
	};





/**
 * Create XMLHttpRequest
 * @return {XMLHttpRequest}
 */
	_createXhr() {	
		var xhr = new XMLHttpRequest();
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
 * @param {Function<>}
 */
	setSuccessCallback(callback) {
		this._successCallback = callback;
	};





/**
 * @param {Function<>}
 */
	setFailureCallback(callback) {
		this._failureCallback = callback;
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
 * @param {Request.Mimetype}
 */
	_prepareResponse(mimetype) {
		this._response = this._unserializeResponse(
			this._xhr.responseText,
			mimetype
		);
	};
	





/**
 * @return {EventType}
 */
	_loadEvent(e) {
		this.response_ = null;
		this.lastError_ = null;
//
		try {
			if (e.type === 'error' || !this._xhr.status) {
console.warn('_loadEvent error', e.type, this._xhr.status);
				this._doError(this._xhr.responseText);
				return;
			}
/*
console.info('_loadEvent this._getResponseContentType()', this._getResponseContentType());
console.info('this._xhr.response', this._xhr.response);
console.info('this._xhr.responseText', this._xhr.responseText);
*/
			var responseContentType = this._getResponseContentType();
			if (responseContentType !== this._contentType) {
				this._doError('Invalid response content type.');
				return;
			}
			
// Prepare final response structure	
			this._prepareResponse(responseContentType);
/*
			console.info('status=', this._xhr.status);
			console.info('responseText=', this._xhr.responseText);
			console.log('_getResponseContentType=', this._getResponseContentType());
			console.log('getResponse=', this.getResponse());
/**/
			this._doSuccess();
		}
		catch (error) {
console.warn('_loadEvent catch', error);
			this._errorEvent(e);
		}
	};





/**
 * @return {EventType}
 */
	_timeoutEvent(e) {
		this._errorEvent(e);
	};





/**
 * @return {EventType}
 */
	_errorEvent(e) {
		this._doError(this._xhr.responseText);
	};





/**
 * Fire success callback
 * @return {string}
 */
	_setLastError(message) {
		this._lastError = message;
	};





/**
 * Fire success callback
 * @return {string}
 */
	_doSuccess() {
		if (this._successCallback) {
			this._successCallback.call(this);
		}
	}





/**
 * Fire error callback
 * @return {string}
 */
	_doError(message) {
		this._setLastError(message);
		if (this._failureCallback) {
			this._failureCallback.call(this);
		}
		else {
			throw Error(this._lastError);
		}
	}





/**
 */
	send() {
		try {
			this._response = null;

			this._xhr = this._createXhr();
			this._xhr.open(this._method, this._getRequestUrl());

// Update headers
			this._xhr.setRequestHeader('Accept', this._contentType);
//			this._xhr.setRequestHeader('Content-Type', this._contentType);
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


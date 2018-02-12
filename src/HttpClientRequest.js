import HttpClient from './HttpClient';


/** 
 */
export default class HttpClientRequest {


/**
 * Supported request methods
 */
	static Method = {
		GET: 'GET',
		POST: 'POST',
		PUT: 'PUT',
		DELETE: 'DELETE'
	};





/** @private @type {string} */
	_url = '';

/** @private @type {string} */
	_method = HttpClientRequest.Method.GET;

/** @private @type {Array} */
	_headers = [];

/** @private @type {string} */
	_contentType = HttpClient.Mimetype.FORM; 

/** @private @type {Array} */
	_params = [];

/** @private @type {string} */
	_body = null;





/**
 * @param {string} url
 */
	setUrl(url) {
		this._url = url;
	};





/**
 * @return {string}
 */
	getUrl() {
		return this._url;
	};





/**
 * @param {string} method
 */
	setMethod(method) {
		this._method = method;
	};





/**
 * @return {string}
 */
	getMethod() {
		return this._method;
	};





/**
 * @param {string} name
 * @param {string} value
 */
	setHeader(name, value) {
		this._headers[name] = value;
	};





/**
 * @param {string}
 * @return {Array}
 */
	getHeaders() {
		return this._headers;
	};





/**
 * @param {string} contentType
 */
	setContentType(contentType) {
		this._contentType = contentType;
	};





/**
 * @return {string}
 */
	getContentType() {
		return this._contentType;
	};





/**
 * @param {string} name
 * @param {string|Array} value
 */
	setParam(name, value) {
		if (value !== undefined) {
			this._params[name] = value;
		}
	};





/**
 * @param {Array} params
 */
	setParams(params) {
		this._params = params;
	};





/**
 * @return {Array}
 */
	getParams() {
		return this._params;
	};





/**
 * @param {string} contents
 */
	setBody(body) {
		this._body = body;
	};





/**
 * @return {string}
 */
	getBody() {
		return this._body;
	};


};


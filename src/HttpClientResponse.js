/** 
 */
export default class HttpClientResponse {


/** @private @type {number} */
	_status = 0;

/** @private @type {Array} */
	_headers = [];

/** @private @type {string} */
	_body = null;





/**
 */	
	constructor(status, headers, body) {
		this._status = status;
		this._headers = headers;
		this._body = body;
	};





/**
 * @return {string}
 */
	getStatus() {
		return this._status;
	};





/**
 * @return {boolean}
 */
	isUnauthorized() {
		return this._status === 401;
	};





/**
 * @return {boolean}
 */
	isForbidden() {
		return this._status === 403;
	};





/**
 * @return {string}
 */
	getHeaders() {
		return this._headers;
	};





/**
 * @return {string}
 */
	getContentType() {
		return this._headers['Content-Type'] || null;
	};





/**
 * @return {string}
 */
	getBody() {
		return this._body;
	};


};


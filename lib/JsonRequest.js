/**
 * @fileoverview JSON REST client requester for Publixe apps.
 * @author pavex@ines.cz
 */


import Request from './Request.js';


/**
 */
export default class JsonRequest extends Request {


/** @private @type {function<>} */
	_onCreated;


/** @private @type {function<>} */
	_onUnauthorized;





/**
 * @param {string}
 * @param {string=}
 */
	setName(name, opt_base_url) {
		this.setUrl(opt_base_url + name);
	};





/**
 * @return {boolean}
 */
	isUnauthorized() {
		return this.getStatus() == Request.Status.FORBIDDEN;
	};





/**
 * @param {function<>}
 */
	onCreated(callback) {
		this._onCreated = callback;
	};





/**
 * @param {function<>}
 */
	onUnauthorized(callback) {
		this._onUnauthorized = callback;
	};





/**
 * @return {Array<Object>}
 */
	getData() {
		return this.getResponse().data || null;
	};





/**
 * @return {Object}
 */
	getErrorObject() {
		var r = this.getResponse();
		if (r && r.error) {
			return r.error;
		}
		return {
			message: 'Empty response',
			code: 0
		};
	};





/**
 * @return {string}
 */
	getErrorMessage() {
		return this.getErrorObject().message || 'Json API request error.';
	};





/**
 * Fire success callback and check status
 * @return {string}
 */
	_doSuccess() {

// Unauthorized
		if (this._onUnauthorized) {
			if (this.isUnauthorized()) {
				this._onUnauthorized.call(this, this);
				return;
			}
		}

// Created
		if (this._onCreated) {
			if (this.getStatus() == Request.Status.CREATED) {
				this._onCreated.call(this);
				return;
			}
		}
		
// Invalid status code
		if (this.getStatus() != Request.Status.OK) {
			this._setLastError(this.getErrorMessage());
			this._doError();
			return;
		}

// Success
		super._doSuccess();
	}


};


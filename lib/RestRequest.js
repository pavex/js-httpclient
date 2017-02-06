/**
 * @fileoverview Rest client for Publixe apps.
 * @author pavex@ines.cz
 */


import Request from './Request.js';


/**
 */
export default class RestRequest extends Request {


/**
 */
	constructor() {
		super();
//
		this._cratedCallback;
		this._unauthorizedCallback;
	};





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
 * @param {Function<>}
 */
	setCreatedCallback(callback) {
		this._createdCallback = callback;
	};





/**
 * @param {Function<>}
 */
	setUnauthorizedCallback(callback) {
		this._unauthorizedCallback = callback;
	};





/**
 * @return {string}
 */
	_getErrorMessage() {
		var response = this.getResponse();
		return response.ErrorMessage ? response.ErrorMessage : 'Unknown error';
	}





/**
 * Fire success callback
 * @return {string}
 */
	_doSuccess() {

// Unauthorized
		if (this._unauthorizedCallback) {
			if (this.isUnauthorized()) {
				this._setLastError(this._getErrorMessage());
				this._unauthorizedCallback.call(this, this);
				return;
			}
		}

// Created

//console.log(this._createdCallback);
//console.log(this.getStatus());

		if (this._createdCallback) {
			if (this.getStatus() == Request.Status.CREATED) {
				this._createdCallback.call(this);
				return;
			}
		}

// Invalid status code
		if (this.getStatus() != Request.Status.OK) {
//			console.warn(this.getResponse());
			this._doError(this._getErrorMessage());
			return;
		}

// Success
		super._doSuccess();
	}

	
	
};


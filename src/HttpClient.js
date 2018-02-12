import HttpClientRequest from './HttpClientRequest';
import HttpClientRequester from './HttpClientRequester';


/** 
 */
export default class HttpClient {


/**
 * Supported mimetypes
 */
	static Mimetype = {
		JSON: 'application/json',
		XML: 'text/xml',
		FORM: 'application/www-form-encoded'
	};





/**
 * @constructor
 * @param {string} base_url
 * @param {XMLHttpRequest=} opt_xhrClass
 */
	constructor(base_url, opt_xhrClass) {

/** @private @type {string} */
		this._base_url = base_url;

/** @private @type {XMLHttpRequest} */
		this._xhrClass = opt_xhrClass || XMLHttpRequest;
	};

	



/**
 * @param {HttpClient.Request} request
 */	
	send(request) {
		var requester = new HttpClientRequester(this, request, this._base_url, this._xhrClass);
		return requester.send();
	};


};





/**
 * Request shortcut
 */
HttpClient.Request = HttpClientRequest;


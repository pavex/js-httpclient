/** 
 */
export default class Payload {


/** @type {number} */
	static id = 1;


/** @type {Array<Object>} */
	_calls = [];





/**
 * @param {string} method
 * @param {Array=} opt_params
 */
	addCall(method, opt_params) {
		var params = opt_params || [];
		var id = Payload.id++;
		this._calls.push({method, params, id});
	};





/**
 * @param {string} method
 * @param {Array=} opt_params
 */
	setCall(method, opt_params, opt_index) {
		if (opt_index >= 0) {
			var params = opt_params || [];
			var id = Payload.id++;
			this._calls[opt_index] = {method, params, id}
		}
		else {
			this._calls = [];
			this.addCall(method, opt_params);
		}
	};





/**
 * Payload object
 * @return {Object}
 */
	toObject() {
		return this._calls.length > 1 ? this._calls : this._calls[0];
	};





/**
 * Serialize/build final request payload
 * @return {string}
 */
	toString() {
		return JSON.stringify(this.toObject());
	};


};



/** 
 */
export default class JsonRpcError {


/**
 * @param {string=} opt_message
 * @param {number=} opt_code
 * @param {Object=} opt_payload
 */
	constructor(opt_message, opt_code, opt_payload) {
		this.message = opt_message || constructor.name;
		this.code = opt_code || 0;
		this.payload = opt_payload || null;
	};


};


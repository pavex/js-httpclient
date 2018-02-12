import JsonRpcError from './JsonRpcError';


/** 
 */
export default class JsonRpcForbiddenError extends JsonRpcError {


/**
 * @param {Object=} opt_payload
 */
	constructor(opt_payload) {
		super('Forbidden!', 403, opt_payload || null);
	};


};


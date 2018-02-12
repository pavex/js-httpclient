import JsonRpcError from './JsonRpcError';


/** 
 */
export default class JsonRpcUnauthorizedError extends JsonRpcError {


/**
 * @param {Object=} opt_payload
 */
	constructor(opt_payload) {
		super('Unauthorized access.', 401, opt_payload || null);
	};


};


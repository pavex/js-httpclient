# publixe-httpclient
Simple XML HTTP Requester for Node.js special for React and React Native applications based on XMLHttpRequest

No long explanation, here are examples:

```js
import {JsonRequest} from 'publixe-httpclient';

var r = new JsonRequest();

r.setUrl('https://raw.githubusercontent.com/pavex/publixe-httpclient/master/samples/sample.json');
r.setMethod('GET');
r.setParams({});

r.onSuccess(() = {
	console.log(r.getResponse());   // Completely response object
	console.log(r.getData());       // Only contents of root element "data"
});
r.onFailure((error) = {
	console.log(error);             // Error object included message and code
});

r.send();
```

I try to prepare short documentation of this class. 

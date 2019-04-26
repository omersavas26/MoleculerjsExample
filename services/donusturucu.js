var convert = require('xml-js');

module.exports =
{
	donustur(th, ctx, route, req, res, data)
	{
		ctx.meta.$responseType = "application/json";
		
		if(typeof req.$params.rtype == "undefined")
			return data;
		
		var type = req.$params.rtype;
		
		switch(type)
		{
			case "xml":
				ctx.meta.$responseType = "application/xml";
				var options = {compact: true, ignoreComment: true, spaces: 4};
				return convert.js2xml({root: data}, options);
			default:
				return data;
		}
	}
}
"use strict";

const ApiGateway = require("moleculer-web");
const E = require("moleculer-web").Errors;
const d = require("./donusturucu.js");

module.exports = 
{
	name: "api",
	mixins: [ApiGateway],
	
	settings: 
    {
        port: process.env.PORT || 3000,
        cors: 
        {
            origin: "*",
            methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
            allowedHeaders: [],
            exposedHeaders: [],
            credentials: false,
            maxAge: 3600
        },
        routes: 
        [
			//api servisleri auth istemez
            {
                path: "/api",
                mappingPolicy: "all",

                aliases: 
                {
                    "kisayol": "v1.test.index",
                    //"GET getkisayol": "v1.test.hg"
                },
                whitelist: 
                [
                    "*.katmanlar.*",
					"*.test.*"
                ],
				onAfterCall(ctx, route, req, res, data) 
				{
					//console.log(res);
					return d.donustur(this, ctx, route, req, res, data);
                }
            },
			
			//app servisleri kimlik dogrulama ister
            {
                path: "/app",
                authorization: true,
                whitelist: 
                [
					"*.katmanlar.*",
                ]
            }
        ],

        assets: 
        {
			folder: "public"
		}
    },
    
    methods:
    {
        authorize(ctx, route, req, res) 
        {
            console.log("Auth kontrol");
            if(typeof req['$params'].token == "undefined")
            {
                return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN));
            }
            
            if(req['$params'].token == "123456")
            {
                ctx.meta.user = { id: 1, name: "John Doe" };
                return Promise.resolve(ctx);

            }
            else
            {
                return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN));
            }
        }

    }
};

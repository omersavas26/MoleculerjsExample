var request = require('request');
var expect = require('chai').expect;

module.exports = 
{
    name: "test",
    version: 1, 
	
	settings: 
    {
        transporter: "nats://localhost:4222",
    },
	
	started() 
	{
        console.log("Katmanlar sevisi başlayacak...");
		this.broker.waitForServices([{name: "katmanlar", version: 1}], 10 * 1000, 500).then(() => 
		{
			console.log("Katmanlar servisi şuan erişilebilir.");
			this.broker.emit("signal.forKatmanlar", "omersavas.com");
		})
		.catch(err => 
		{
			console.log("10 sn gecti katmanlar servisine hala erisilemedi");    
		});
    },

    actions:
    {
        index()
        {
			return {durum: "OK", mesaj: "Test Service OK!"};
        },
		
		async disErisim(ctx)
		{
			var c = null;
			request('https://cbs.kutahyaozid.gov.tr/tr/api/test', function (error, response, body) 
			{
				if (
					!error 
					&& response.statusCode == 200 
					&& body.substring(0, 2) === "OK"
					) 
					c = {durum: "OK", cevap: body};
				else
					c = {durum: "Hata", error: error, body: body, response: response};
				
			});
			
			while(c === null) await this.sleep(1);
			
			return c;
		},
		
        async katmanlar(ctx)
        {
			const r =  
			{
				'index': await this.katmanlarServisTest(ctx),
				//'digerMethod': await this.katmanlarDigerMethodTest(ctx),
			};
			
			return r;
        }
    },

    methods: 
    {  
		async katmanlarServisTest(ctx) 
        {
			var r = await ctx.call("v1.katmanlar.index");
			
			//Alternatif olarak expect methodları ile kontrol yapılabilir.
			//Fakat herhangi bir expect methodu başarısız olduğunda diğer testlere devam etmez
			//Bu şekilde bir serviste birden fazla hata var ise hepsi görülebilir.
			//
			//expect(response.statusCode).to.equal(200)
			
			if(r.durum == 'OK')
			   return r;
		   
			return {durum: "Hata", cevap: r};
		},
		
        sleep(ms) 
        {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
}
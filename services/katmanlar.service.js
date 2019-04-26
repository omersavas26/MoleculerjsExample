module.exports = 
{
    name: "katmanlar",
    version: 1, 
	
	created() { },
    started() { },
    stopped() { },

    settings: 
	{
		transporter: "nats://localhost:4222",
	},

    actions:
    {
        index()
        {
            return {durum: "OK", mesaj: 'Katmanlar Service OK!'};
        }
    },

    methods: 
    {
        async forKatmanlarEventSended(msj)
		{
			console.log("Katmanlar servisi 'forKatmanlar' event 'ini aldı. Mesaj: " + msj);
		}
    },
	
	events: 
	{
		"signal.forKatmanlar":
        {
			handler(msj) 
			{
                this.forKatmanlarEventSended(msj);
            }
        }
    }
}
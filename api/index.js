var express = require('express'),
    router = express.Router(),
    axios = require('axios');
var url = "https://gw.open.icbc.com.cn/ui/b2c/passfree/agreement/sign/V1";
var pem = require('pem');
var fs = require('fs');
var moment = require('moment');
var crypto = require('./service/crypto');

router.post("/sign",async function (req,res) {
    var qs = req.body;
    var param = {
        app_id: "",
        msg_id: "",
        format: "json",
        sign: "",
        timestamp: moment().format("YYYY-MM-DD hh:mm:ss"),
        ca: fs.readFileSync(__dirname + "/certificate.crt"),
        biz_content: {
            merchant_id: "0200EE20842021",
            merchant_acct: "",
            merchant_type: "",
            return_url: "http://192.168.1.110:8085/sign",
            notyfy_url: ""
        }
    };
    var str = `/ui/b2c/passfree/agreement/sign/V1?app_id=${param.appid}&biz_content=${JSON.stringify(param.biz_content)}&&charset=GBK&sign_type=RSA&timestamp=${param.timestamp}&trade_id=123456`;
    var key = privatepem=fs.readFileSync(__dirname + "/rsa-private-key.pem").toString();
    // var sign = crypto.encryption(str,"MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQD4llt4eAh17B1hveKeuATDolBiGpgQRnlZJ2cUNqh2USGx7+5N/mkxAMsYuxqTFPxkgwDDnn0hVVVWe7n1sI0ukoA2F4Efhizd2PSm3Dl+jbxmGvMRB42GpMhLdqSBFinAa8Sq0DAX/zg5wUH11Xg2Su3IZDoitG5kHMAeT7KPEUsbOPpp0c0/Vf1Obc/06GehF8yu4J6Eb8zkr5BP3BUdr+ephPC/Sc6iEBxf1fblF9TZoOpCx9hwCOoAO/uSNviLKbZ2/qUMN8rgnuaA8BD/n6efN8hd8NRruKw2W1RPvAwdHTGs+1SsAzYHooM9o720Kz532jfd0EhVO8T2XN/3AgMBAAECggEBALEYZOfpE5X29WOppGYQkQxSeVO6wHRv0ImMQaor2k4YNJoQZURZJ9WKTCY9PYxlGf39OjEimuCBa39mO6/l7F6ubfqbOhkcPKB7rKenIqqfDQXs0xdhuxieEjd4uW9hO7Ni00QhdvHRl9vFa1lYkACV1tq5VJVe13oo5VFy07GJZ/cq+Hxrr79TMpvKT4ZmbVWE2VtFlF7btXjiv6jQSu+tzkWgDsChoycFYuMBmRKe/1LATOJJlqKe91NyhS+IGax7sDQC5MA8Yoi3fm1HXgClazdakDhEhfacI7deqwYqjnXYuAcnS7WSG17r99TZrgXM38InbZZRzxU3sc3MTGECgYEA/fgriTsPqUvFTUoZyyBoDXTAnAcSrRi59sVHj3wRTsAfcYBUqIz9zrLcuDfTmnfwDL8Ll0Zg6aRbisI+oN6pP/CBKNU+//cRcelCiLJsEz2509FB7rxO4kk4WbKzTeRvXtlVYM1uixDRAlLl2KbISs7AiSc2SZmGVqmGAmr8KBECgYEA+pMrzGRHIcIUog0x3lLs3TKKfCxlm3clyGlk1L18tT9XyeKkL96lC9tC4w9tBe3vtNZvn9sLvQvgHOOV109PZ5gAqxETpahag9DoYcATArgzi6HBw1rBDNYxSYqJF8HwrDAYYpexOTF+fRBpkkzZYeP1egrqllX4OjIHzaUez4cCgYBHKg8o+P++dJjou2bW4FHH03tVPTYigtc5KraOojlHU9Z7u3X9dOR50uy+QgZtNkZxi+b3kKT/UyrDiwJ5mWrbm8zVYEuy9cxRmwclvrlB+v3jOLO87c884T+FAunzXZtHfKbL5USgeynV+NynBLUDIUQaKn6vyPE3v3DppIjbwQKBgQDSTJA2w3Z7m6Krev1+hQRshQ17N9uzBeV89Q9+COZQS7BHLOL1lhvY/pV9caXjkxVaJZqbhECu0feu50cL5HFVFVqCOBvQLaKB/OP7njOWVbhVGVZAubtKJb5J5W43tTpjmR3uKTfBM4vgNNUVx0+ue567ZcwKjm59kR3BdzKLowKBgQC6z5rIr8XQ7Nn37xcEX+EgXgdnPZWB2piSlp8czJGcb/iUxcGHolw/V6zgVCh7err9GPTBUsGcIfnJ1U3mNFwTK9ZzlThtvsZ5wcRTpfNXvj53NIOBKW+zlfSJJadgHT4mwCLCuXOignCRaC9o8owu/ofq+Qh+44NBJWqQF2LOqw==");
    var sign = crypto.encryption(str,key);
    console.log(sign);
    param.sign = sign;
    var result = await axios.post(url,param);
    res.send(result.data);
});
router.get('/split', function(req, res) {
    const pfx = fs.readFileSync(__dirname + "/ubay.pfx");
    pem.readPkcs12(pfx, { p12Password: "" }, (err, cert) => {
        console.log(err);
        fs.writeFileSync(__dirname + "/private-key.pfx",cert.key);
        fs.writeFileSync(__dirname + "/certificate.crt",cert.cert);
        res.json({
            errno: 0,
            cert: cert
        })
    });
})
module.exports = router;
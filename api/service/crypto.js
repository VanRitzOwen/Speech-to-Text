var crypto = require('crypto');

var cryptoFunc = {
    encryption: function (data, key, iv) {
        /**
         * aes加密
         * @param data 待加密内容
         * @param key 必须为32位私钥
         * @returns {string}
         */
        var sign = crypto.createSign('sha1WithRSAEncryption');
        sign.update(data);
        var sig = sign.sign(key, 'hex');//得到签名
        return sig;
    },
    decryption: function (data, key, iv) {
        /**
         * aes解密
         * @param data 待解密内容
         * @param key 必须为32位私钥
         * @returns {string}
         */
        if (!data) {
            return "";
        }
        iv = iv || "";
        var clearEncoding = 'utf8';
        var cipherEncoding = 'base64';
        var cipherChunks = [];
        var decipher = crypto.createDecipheriv('aes-128-ecb', key, iv);
        decipher.setAutoPadding(true);
        cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
        cipherChunks.push(decipher.final(clearEncoding));
        return cipherChunks.join('');
    }
};

module.exports = cryptoFunc;
goog.provide('morning.crypt.hmac');
goog.require('morning.crypt.sha1');

/**
 * @param {morning.crypt.Encoder} hasher
 * @param {string|Array.<number>} messageStr
 * @param {string|Array.<number>} keyStr
 * @param {morning.crypt.EncodingOptions} options
 * @return {Array.<number>|string}
 */
morning.crypt.hmac = function(hasher, messageStr, keyStr, options)
{
    var utf8 = morning.crypt.charenc.UTF8,
        binary = morning.crypt.charenc.binary,
        util = morning.crypt.util;

    // Convert to byte arrays
    var message = /** @type {Array.<number>} */ (typeof messageStr == 'string' ?
             utf8.stringToBytes(messageStr) : messageStr);


    var key = /** @type {Array.<number>} */ (typeof keyStr == 'string' ?
             utf8.stringToBytes(keyStr) : keyStr);

    // Allow arbitrary length keys
    if (key.length > hasher.BLOCKSIZE * 4)
    {
        key = hasher.encode(key, { asBytes: true });
    }

    // XOR keys with pad constants
    var okey = key.slice(0),
        ikey = key.slice(0);

    for (var i = 0; i < hasher.BLOCKSIZE * 4; i++)
    {
        okey[i] ^= 0x5C;
        ikey[i] ^= 0x36;
    }

    var cfg = /** @type {morning.crypt.EncodingOptions} */ ({ asBytes: true });
    var result = /** @type {Array.<number>} */ (okey.concat(hasher.encode(ikey.concat(message), cfg)));
    var hmacbytes = /** @type {Array.<number>} */ (hasher.encode(result, cfg));
    hmacbytes = /** @type {Array.<number>} */ (hmacbytes);

    return options && options.asBytes ? hmacbytes :
           options && options.asString ? binary.bytesToString(hmacbytes) :
           util.bytesToHex(hmacbytes);
};

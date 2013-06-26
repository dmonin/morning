goog.provide('monin.crypt.sha1');



/**
 * @param {string} message
 * @param {monin.crypt.EncodingOptions} options
 * @return {string|Array.<number>}
 */
monin.crypt.sha1.encode = function(message, options)
{
    var util = monin.crypt.util,
    digestbytes = util.wordsToBytes(monin.crypt.sha1.encode_(message)),
    binary = monin.crypt.charenc.binary;

    return options && options.asBytes ? digestbytes :
    options && options.asString ? binary.bytesToString(digestbytes) :
    util.bytesToHex(digestbytes);
};

/**
 * @type {number}
 */
monin.crypt.sha1.BLOCKSIZE = 16;

/**
 * @type {number}
 */
monin.crypt.sha1.DIGESTSIZE = 20;

/**
 * Encodes message
 *
 * @param {Array.<number>|string} msgString
 * @private
 */
monin.crypt.sha1.encode_ = function(msgString)
{
    var util = monin.crypt.util,
        utf8 = monin.crypt.charenc.UTF8;

    var message;
    // Convert to byte array
    if (typeof message == 'string')
    {
        msgString = /** @type {string} */ (msgString);
        message = /** @type {Array.<number>} */ (utf8.stringToBytes(msgString));
    }
    else
    {
        message = /** @type {Array.<number>} */ (msgString);
    }

    /* else, assume byte array already */

    /**
     * @type {Array.<number|string>}
     */
    var m = util.bytesToWords(message);
    var l = message.length * 8,
        w = [],
        H0 = 1732584193,
        H1 = -271733879,
        H2 = -1732584194,
        H3 = 271733878,
        H4 = -1009589776;

    // Padding
    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >>> 9) << 4) + 15] = l;

    for (var i = 0; i < m.length; i += 16)
    {

        var a = H0,
            b = H1,
            c = H2,
            d = H3,
            e = H4;

        for (var j = 0; j < 80; j++)
        {

            if (j < 16)
            {
                w[j] = m[i + j];
            }
            else
            {
                var n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
                w[j] = (n << 1) | (n >>> 31);
            }

            var t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (
                j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 :
                j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 :
                j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 :
                (H1 ^ H2 ^ H3) - 899497514);

            H4 = H3;
            H3 = H2;
            H2 = (H1 << 30) | (H1 >>> 2);
            H1 = H0;
            H0 = t;
        }

        H0 += a;
        H1 += b;
        H2 += c;
        H3 += d;
        H4 += e;
    }

    return [H0, H1, H2, H3, H4];
};

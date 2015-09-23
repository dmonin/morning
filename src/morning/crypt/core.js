goog.provide('morning.crypt.core');
goog.provide('morning.crypt.util');
goog.provide('morning.crypt.charenc')
goog.provide('morning.crypt.charenc.UTF8');
goog.provide('morning.crypt.charenc.binary');
goog.provide('morning.crypt.EncodingOptions');
goog.provide('morning.crypt.Encoder');

// http://code.google.com/p/crypto-js/source/browse/branches/2.x/
// 'crypto!', 'sha1!', 'hmac!', 'pbkdf2!', 'blockmodes', 'aes'

morning.crypt.core.base64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';


/**
 * @typedef {{
 *   asString: (boolean|undefined),
 *   asBytes: (boolean|undefined),
 *   hasher: (morning.crypt.Encoder|undefined),
 *   iterations: (number|undefined)
 * }}
 */
morning.crypt.EncodingOptions;


/**
 * @typedef {{
 *   encode: (Function|undefined),
 *   BLOCKSIZE: (number|undefined),
 *   DIGESTSIZE: (number|undefined),
 *   asString: (boolean|undefined),
 *   encode_: (Function|undefined)
 * }}
 */
morning.crypt.Encoder;

/**
 * @typedef {{
 *   pad: (Function|undefined),
 *   unpad: (Function|undefined)
 * }}
 */
morning.crypt.Padding;


/**
 * Bit-wise rotate left
 *
 * @param {Array|number} n
 * @param {number} b
 * @return {number}
 */
morning.crypt.util.rotl = function(n, b)
{
    return (n << b) | (n >>> (32 - b));
}

/**
 * Bit-wise rotate right
 *
 * @param {number} n
 * @param {number} b
 * @return {number}
 */
morning.crypt.util.rotr = function(n, b)
{
    return (n << (32 - b)) | (n >>> b);
}

/**
 * Swap big-endian to little-endian and vice versa
 *
 * @param {Array|number} n
 * @return {number|Array}
 */
morning.crypt.util.endian = function(n)
{
    // If number given, swap endian
    if (n.constructor == Number)
    {
        return morning.crypt.util.rotl(n,  8) & 0x00FF00FF |
                    morning.crypt.util.rotl(n, 24) & 0xFF00FF00;
    }

    // Else, assume array and swap all items
    for (var i = 0; i < n.length; i++)
    {
        n[i] = morning.crypt.util.endian(n[i]);
    }
    return n;
}

/**
 * Generate an array of any length of random bytes
 *
 * @param {number} n
 * @return {Array.<number>}
 */
morning.crypt.util.randomBytes = function(n)
{
    for (var bytes = []; n > 0; n--)
    {
        bytes.push(Math.floor(Math.random() * 256));

    }
    return bytes;
}

/**
 * Convert a byte array to big-endian 32-bit words
 *
 * @param {Array.<number|string>} bytes
 * @return {Array.<string|number>}
 */
morning.crypt.util.bytesToWords = function(bytes)
{
    for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
    {
        words[b >>> 5] |= (bytes[i] & 0xFF) << (24 - b % 32);
    }

    return words;
}


/**
 * Convert big-endian 32-bit words to a byte array
 *
 * @param {Array.<string>} words
 * @return {Array.<number>}
 */
morning.crypt.util.wordsToBytes = function(words)
{
    for (var bytes = [], b = 0; b < words.length * 32; b += 8)
    {
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
    }

    return bytes;
}

/**
 * Convert a byte array to a hex string
 *
 * @param {Array.<number>} bytes
 * @return {string}
 */
morning.crypt.util.bytesToHex = function(bytes)
{
    for (var hex = [], i = 0; i < bytes.length; i++)
    {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}

/**
 * Convert a byte array to a hex string
 *
 * @param {string} hex
 * @return {Array.<number>}
 */
morning.crypt.util.hexToBytes = function(hex)
{
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    {
        bytes.push(parseInt(hex.substr(c, 2), 16));
    }
    return bytes;
}

/**
 * Convert a byte array to a base-64 string
 *
 * @param {Array.<number>} bytes
 * @return {string}
 */
morning.crypt.util.bytesToBase64 = function(bytes)
{
    for(var base64 = [], i = 0; i < bytes.length; i += 3)
    {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
        {
            if (i * 8 + j * 6 <= bytes.length * 8)
            {
                base64.push(morning.crypt.core.base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
            }
            else
            {
                base64.push("=");
            }
        }
    }

    return base64.join("");
}

/**
 * Convert a base-64 string to a byte array
 *
 * @param {string} base64
 * @return {Array.<number>}
 */
morning.crypt.util.base64ToBytes = function(base64)
{
    var base64map = morning.crypt.core.base64map;

    // Remove non-base-64 characters
    base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

    for (var bytes = [], i = 0, imod4 = 0; i < base64.length; imod4 = ++i % 4)
    {
        if (imod4 == 0)
        {
            continue;
        }

        bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2)) |
            (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
    }

    return bytes;
}

/**
 * Convert a string to a byte array
 *
 * @param {string} str
 * @return {Array.<number>}
 */
morning.crypt.charenc.UTF8.stringToBytes = function(str)
{
    return morning.crypt.charenc.binary.stringToBytes(unescape(encodeURIComponent(str)));
}

/**
 * Convert a byte array to a string
 *
 * @param {Array.<number>} bytes
 * @return {string}
 */
morning.crypt.charenc.UTF8.bytesToString = function(bytes)
{
    return decodeURIComponent(
            escape(morning.crypt.charenc.binary.bytesToString(bytes)));
}


/**
 * Convert a string to a byte array
 *
 * @param {string} str
 * @return {Array.<number>}
 */
morning.crypt.charenc.binary.stringToBytes = function (str)
{
    for (var bytes = [], i = 0; i < str.length; i++)
    {
        bytes.push(str.charCodeAt(i) & 0xFF);
    }
    return bytes;
};

/**
 * Convert a byte array to a string
 *
 * @param {Array.<number>} bytes
 * @return {string}
 */
morning.crypt.charenc.binary.bytesToString = function (bytes)
{
    for (var str = [], i = 0; i < bytes.length; i++)
    {
        str.push(String.fromCharCode(bytes[i]));
    }

    return str.join("");
};
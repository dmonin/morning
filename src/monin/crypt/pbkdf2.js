goog.provide('monin.crypt.pbkdf2');

/**
 * @param {monin.crypt.Encoder} hasher
 * @param {string|Array.<number>} password
 * @param {string|Array.<number>} salt
 *
 * @return {string|Array.<number>}
 * @private
 */
monin.crypt.pbkdf2.prf = function(hasher, password, salt)
{
    var data = /** @lends {monin.crypt.EncodingOptions} */{asBytes: true};
    return /** @type {Array.<number>} */ (monin.crypt.hmac(hasher, salt, password, data));
}

/**
 * @param {string|Array.<number>} passwordStr
 * @param {string|Array.<number>} saltStr
 * @param {number} keylen
 * @param {monin.crypt.EncodingOptions} options
 * @return {string|Array}
 */
monin.crypt.pbkdf2.encode = function (passwordStr, saltStr, keylen, options)
{
    var utf8 = monin.crypt.charenc.UTF8,
        util = monin.crypt.util,
        binary = monin.crypt.charenc.binary;

    // Convert to byte arrays
    var password = /** @type {Array.<number>} */ (typeof passwordStr == 'string' ?
                        utf8.stringToBytes(passwordStr) :
                        passwordStr);

    var salt = /** @type {Array.<number>} */ (typeof saltStr == 'string' ?
                utf8.stringToBytes(saltStr) : saltStr);


    // Defaults
    var hasher = options && options.hasher || monin.crypt.sha1;
    hasher = /** @type {monin.crypt.Encoder} */ (hasher);

    var iterations = options && options.iterations || 1;

    var prf = monin.crypt.pbkdf2.prf;

    // Generate key
    var derivedKeyBytes = [],
    blockindex = 1;
    while (derivedKeyBytes.length < keylen)
    {
        var block = prf(hasher, password, salt.concat(util.wordsToBytes([blockindex])));
        for (var u = block, i = 1; i < iterations; i++)
        {
            u = prf(hasher, password, u);
            for (var j = 0; j < block.length; j++)
            {
                block[j] ^= u[j];
            }
        }
        derivedKeyBytes = derivedKeyBytes.concat(block);
        blockindex++;
    }

    // Truncate excess bytes
    derivedKeyBytes.length = keylen;

    return options && options.asBytes ? derivedKeyBytes :
        options && options.asString ? binary.bytesToString(derivedKeyBytes) :
        util.bytesToHex(derivedKeyBytes);
};
goog.provide('monin.crypt.blockmodes');
goog.provide('monin.crypt.blockmodes.pad.ansix923');
goog.provide('monin.crypt.blockmodes.pad.iso10126');
goog.provide('monin.crypt.blockmodes.pad.pkcs7');
goog.provide('monin.crypt.blockmodes.pad.iso7816');
goog.provide('monin.crypt.blockmodes.pad.zeroPadding');
goog.provide('monin.crypt.blockmodes.pad.noPadding');

goog.provide('monin.crypt.blockmodes.Mode');
goog.provide('monin.crypt.blockmodes.OfbMode');

/**
 * Calculate the number of padding bytes required
 * @param {Object} cipher
 * @param {string} message
 * @return {number}
 */
monin.crypt.blockmodes.requiredPadding_ = function(cipher, message)
{
    var blockSizeInBytes = cipher.BLOCKSIZE * 4;
    var reqd = blockSizeInBytes - message.length % blockSizeInBytes;
    return reqd;
}

/**
 * Remove padding when the final byte gives the number of padding bytes
 * @param {Object} cipher
 * @param {Array.<string>|string} message
 * @param {string} alg
 * @param {number|string=} padding
 *
 */
monin.crypt.blockmodes.unpadLength_ = function(cipher, message, alg, padding)
{
    var pad = message.pop();
    if (pad == 0)
    {
        throw new Error("Invalid zero-length padding specified for " + alg
            + ". Wrong cipher specification or key used?");
    }
    var maxPad = cipher.BLOCKSIZE * 4;

    if (pad > maxPad)
    {
        throw new Error("Invalid padding length of " + pad
            + " specified for " + alg
            + ". Wrong cipher specification or key used?");
    }

    for (var i = 1; i < pad; i++)
    {
        var b = message.pop();
        if (padding != undefined && padding != b)
        {
            throw new Error("Invalid padding byte of 0x" + b.toString(16)
                + " specified for " + alg
                + ". Wrong cipher specification or key used?");
        }
    }
}

/**
 * @param {Object} cipher
 * @param {Array.<string>} message
 */
monin.crypt.blockmodes.pad.noPadding.pad = function (cipher,message) {};

/**
 * @param {Object} cipher
 * @param {Array.<string>} message
 */
monin.crypt.blockmodes.pad.noPadding.unpad = function (cipher,message) {};

/**
 * Zero Padding.
 *
 * If the message is not an exact number of blocks, the final block is
 * completed with 0x00 bytes. There is no unpadding.
 *
 * @param {Object} cipher
 * @param {Array.<string>} message
 */
monin.crypt.blockmodes.pad.zeroPadding.pad = function (cipher, message)
{
    var blockSizeInBytes = cipher.BLOCKSIZE * 4;
    var reqd = message.length % blockSizeInBytes;
    if( reqd!=0 )
    {
        for(reqd = blockSizeInBytes - reqd; reqd>0; reqd--)
        {
            message.push(0x00);
        }
    }
}

/**
 * Zero Padding.
 *
 * If the message is not an exact number of blocks, the final block is
 * completed with 0x00 bytes. There is no unpadding.
 *
 * @param {Object} cipher
 * @param {Array.<string>} message
 */
monin.crypt.blockmodes.pad.zeroPadding.unpad = function (cipher, message)
{
    while (message[message.length - 1] == 0)
    {
        message.pop();
    }
}

/**
 * ISO/IEC 7816-4 padding.
 * Pads the plain text with an 0x80 byte followed by as many 0x00
 * bytes are required to complete the block.
 *
 * @param {Object} cipher
 * @param {string} message
 */
monin.crypt.blockmodes.pad.iso7816.pad = function (cipher, message)
{
    var reqd = monin.crypt.blockmodes.requiredPadding_(cipher, message);
    message.push(0x80);
    for (; reqd > 1; reqd--)
    {
        message.push(0x00);
    }
}

/**
 * ISO/IEC 7816-4 padding.
 * Pads the plain text with an 0x80 byte followed by as many 0x00
 * bytes are required to complete the block.
 *
 * @param {Object} cipher
 * @param {Array.<string>} message
 */
monin.crypt.blockmodes.pad.iso7816.unpad = function (cipher, message)
{
    var padLength;
    for(padLength = cipher.BLOCKSIZE * 4; padLength>0; padLength--)
    {
        var b = message.pop();
        if( b==0x80 )
        {
            return;
        }

        if( b!=0x00 )
        {
            throw new Error("ISO-7816 padding byte must be 0, not 0x. Wrong cipher specification or key used?");
        }
    }

    throw new Error("ISO-7816 padded beyond cipher block size. Wrong cipher specification or key used?");
}

/**
 * ANSI X.923 padding
 *
 * The final block is padded with zeros except for the last byte of the
 * last block which contains the number of padding bytes.
 *
 * @param {Object} cipher
 * @param {string} message
 */
monin.crypt.blockmodes.pad.ansix923.pad = function(cipher, message)
{
    var reqd = monin.crypt.blockmodes.requiredPadding_(cipher, message);
    for (var i = 1; i < reqd; i++) {
        message.push(0x00);
    }
    message.push(reqd);
}

/**
 * ANSI X.923 padding
 *
 * The final block is padded with zeros except for the last byte of the
 * last block which contains the number of padding bytes.
 *
 * @param {Object} cipher
 * @param {string} message
 */
monin.crypt.blockmodes.pad.ansix923.unpad = function (cipher,message)
{
    monin.crypt.blockmodes.unpadLength_(cipher,message,"ANSI X.923",0);

};

/**
 * ISO 10126
 *
 * The final block is padded with random bytes except for the last
 * byte of the last block which contains the number of padding bytes.
 *
 * @param {Object} cipher
 * @param {string} message
 */
monin.crypt.blockmodes.pad.iso10126.pad = function (cipher, message)
{
    var reqd = monin.crypt.blockmodes.requiredPadding_(cipher, message);
    for (var i = 1; i < reqd; i++) {
        message.push(Math.floor(Math.random() * 256));
    }
    message.push(reqd);
};

/**
 * ISO 10126
 *
 * The final block is padded with random bytes except for the last
 * byte of the last block which contains the number of padding bytes.
 *
 * @param {Object} cipher
 * @param {Array.<string>} message
 */
monin.crypt.blockmodes.pad.iso10126.unpad = function (cipher, message)
{
    monin.crypt.blockmodes.unpadLength_(cipher,message,"ISO 10126",undefined);
};


/**
 * ISO 10126
 *
 * The final block is padded with random bytes except for the last
 * byte of the last block which contains the number of padding bytes.
 *
 * @param {Object} cipher
 * @param {string} message
 */
monin.crypt.blockmodes.pad.pkcs7.pad = function(cipher, message)
{
    var reqd = monin.crypt.blockmodes.requiredPadding_(cipher, message);
    for (var i = 0; i < reqd; i++)
    {
        message.push(reqd);
    }
};

/**
 * ISO 10126
 *
 * The final block is padded with random bytes except for the last
 * byte of the last block which contains the number of padding bytes.
 *
 * @param {Object} cipher
 * @param {Array.<string>} message
 */
monin.crypt.blockmodes.pad.pkcs7.unpad = function(cipher, message)
{
    monin.crypt.blockmodes.unpadLength_(cipher, message, "PKCS 7", message[message.length-1]);
};

/**
 * @param {monin.crypt.Padding=} padding
 * @constructor
 */
monin.crypt.blockmodes.Mode = function(padding)
{
    /**
     * @type {monin.crypt.Padding}
     */
    this.padding_ = /** @type {monin.crypt.Padding} */ ( padding || monin.crypt.blockmodes.pad.iso7816);
}

/**
 * @param {Object} cipher
 * @param {string} m
 * @param {string|Array.<number>} iv
 */
monin.crypt.blockmodes.Mode.prototype.encrypt = function(cipher, m, iv)
{
    this.padding_.pad(cipher, m);
    this.encryptInternal(cipher, m, iv);
}

/**
 * @param {Object} cipher
 * @param {string} m
 * @param {string|Array.<number>} iv
 */
monin.crypt.blockmodes.Mode.prototype.encryptInternal = function(cipher, m, iv)
{

}

/**
 * @param {Object} cipher
 * @param {string} m
 * @param {string|Array.<number>} iv
 */
monin.crypt.blockmodes.Mode.prototype.decrypt = function(cipher, m, iv)
{
    this.decryptInternal(cipher, m, iv);
    this.padding_.unpad(cipher, m);
}

/**
 * @param {Object} cipher
 * @param {string} m
 * @param {string|Array.<number>} iv
 */
monin.crypt.blockmodes.Mode.prototype.decryptInternal = function(cipher, m, iv)
{

}

/**
 * Output feed back
 *
 * The cipher repeatedly encrypts its own output. The output is XORed with the
 * plain text to produce the cipher text.
 *
 * This is a stream cipher mode and does not require padding.
 *
 * @constructor
 * @extends {monin.crypt.blockmodes.Mode}
 */
monin.crypt.blockmodes.OfbMode = function()
{
    goog.base(this);

    this.padding_ = /** @type {monin.crypt.Padding} */ (monin.crypt.blockmodes.pad.noPadding);
}

goog.inherits(monin.crypt.blockmodes.OfbMode,
    monin.crypt.blockmodes.Mode);

/**
 * @param {Object} cipher
 * @param {string} m
 * @param {string|Array.<number>} iv
 */
monin.crypt.blockmodes.OfbMode.prototype.encryptInternal = function(cipher, m, iv)
{
    var blockSizeInBytes = cipher.BLOCKSIZE * 4,
        keystream = iv.slice(0);

        // Encrypt each byte
        for (var i = 0; i < m.length; i++)
        {

            // Generate keystream
            if (i % blockSizeInBytes == 0)
            {
                cipher.encryptBlock(keystream, 0);
            }

            // Encrypt byte
            m[i] ^= keystream[i % blockSizeInBytes];

        }
}


monin.crypt.blockmodes.OfbMode.prototype.decryptInternal =
    monin.crypt.blockmodes.OfbMode.prototype.encryptInternal
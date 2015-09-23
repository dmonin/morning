// Copyright 2012 Dmitry morning. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('morning.crypt.Aes');

goog.require('morning.crypt.core');
goog.require('morning.crypt.pbkdf2');
goog.require('morning.crypt.sha1');
goog.require('morning.crypt.hmac');
goog.require('morning.crypt.blockmodes');

/**
 * @constructor
 */
morning.crypt.Aes = function()
{
    this.keylength_ = 0;
    this.nrounds_ = 0;
    this.keyschedule_ = [];

    this.state_ = [[], [], [], []];

    this.initializeStatics_();
}

/**
 * @const
 */
morning.crypt.Aes.SBOX = [ 0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5,
    0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
    0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc,
    0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a,
    0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
    0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b,
    0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85,
    0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
    0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17,
    0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88,
    0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
    0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9,
    0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6,
    0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
    0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94,
    0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68,
    0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16 ];

/**
 * @const
 */
morning.crypt.Aes.RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

/**
 * @const
 */
morning.crypt.Aes.prototype.BLOCKSIZE = 4;


morning.crypt.Aes.prototype.xtime_ = function(a, b)
{
    for (var result = 0, i = 0; i < 8; i++)
    {
        if (b & 1)
        {
            result ^= a;
        }

        var hiBitSet = a & 0x80;
        a = (a << 1) & 0xFF;

        if (hiBitSet)
        {
            a ^= 0x1b;
        }

        b >>>= 1;
    }
    return result;
}

morning.crypt.Aes.prototype.initializeStatics_ = function()
{
    if (morning.crypt.Aes.MULT2)
    {
        return;
    }

    var SBOX = morning.crypt.Aes.SBOX;

    // Compute inverse SBOX lookup table
    for (var INVSBOX = [], i = 0; i < 256; i++)
    {
        INVSBOX[SBOX[i]] = i;
    }

    // Compute multiplication in GF(2^8) lookup tables
    var MULT2 = [],
        MULT3 = [],
        MULT9 = [],
        MULTB = [],
        MULTD = [],
        MULTE = [];

    for (var i = 0; i < 256; i++)
    {
        MULT2[i] = this.xtime_(i,2);
        MULT3[i] = this.xtime_(i,3);
        MULT9[i] = this.xtime_(i,9);
        MULTB[i] = this.xtime_(i,0xB);
        MULTD[i] = this.xtime_(i,0xD);
        MULTE[i] = this.xtime_(i,0xE);
    }

    morning.crypt.Aes.MULT2 = MULT2;
    morning.crypt.Aes.MULT3 = MULT3;
    morning.crypt.Aes.MULT9 = MULT9;
    morning.crypt.Aes.MULTB = MULTB;
    morning.crypt.Aes.MULTD = MULTD;
    morning.crypt.Aes.MULTE = MULTE;
    morning.crypt.Aes.INVSBOX = INVSBOX;
}

morning.crypt.Aes.prototype.encrypt = function(message, password)
{
    var mode = new morning.crypt.blockmodes.OfbMode(),
    utf8 = morning.crypt.charenc.UTF8;


    var m = message.constructor == String ?
    utf8.stringToBytes(message) :
    message;

    // Generate random IV
    var iv = morning.crypt.util.randomBytes(this.BLOCKSIZE * 4);

    // Generate key
    var k = password.constructor == String ?
        // Derive key from pass-phrase
        morning.crypt.pbkdf2.encode(password, iv, 32, {
            asBytes: true
        }) :
        // else, assume byte array representing cryptographic key
        password;

    // Encrypt
    this.init_(k);
    mode.encrypt(this, m, iv);

    // Return ciphertext
    m = iv.concat(m);

    return morning.crypt.util.bytesToBase64(m);
}

morning.crypt.Aes.prototype.init_ = function(k)
{
    this.keylength_ = k.length / 4;
    this.nrounds_ = this.keylength_ + 6;
    this.keyexpansion_(k);
}

morning.crypt.Aes.prototype.keyexpansion_ = function(k)
{
    var keyschedule = [];

    for (var row = 0; row < this.keylength_; row++)
    {
        keyschedule[row] = [
            k[row * 4],
            k[row * 4 + 1],
            k[row * 4 + 2],
            k[row * 4 + 3]
        ];
    }

    var SBOX = morning.crypt.Aes.SBOX,
        RCON = morning.crypt.Aes.RCON;

    for (row = this.keylength_; row < this.BLOCKSIZE * (this.nrounds_ + 1); row++)
    {
        var temp = [
            keyschedule[row - 1][0],
            keyschedule[row - 1][1],
            keyschedule[row - 1][2],
            keyschedule[row - 1][3]
        ];

        if (row % this.keylength_ == 0) {

            // Rot word
            temp.push(temp.shift());

            // Sub word
            temp[0] = SBOX[temp[0]];
            temp[1] = SBOX[temp[1]];
            temp[2] = SBOX[temp[2]];
            temp[3] = SBOX[temp[3]];

            temp[0] ^= RCON[row / this.keylength_];

        } else if (this.keylength_ > 6 && row % this.keylength_ == 4) {

            // Sub word
            temp[0] = SBOX[temp[0]];
            temp[1] = SBOX[temp[1]];
            temp[2] = SBOX[temp[2]];
            temp[3] = SBOX[temp[3]];

        }

        keyschedule[row] = [
            keyschedule[row - this.keylength_][0] ^ temp[0],
            keyschedule[row - this.keylength_][1] ^ temp[1],
            keyschedule[row - this.keylength_][2] ^ temp[2],
            keyschedule[row - this.keylength_][3] ^ temp[3]
        ];

    }
    this.keyschedule_ = keyschedule;
}


morning.crypt.Aes.prototype.encryptBlock = function(m, offset)
{
    var state = this.state_,
        SBOX = morning.crypt.Aes.SBOX,
        MULT2 = morning.crypt.Aes.MULT2,
        MULT3 = morning.crypt.Aes.MULT3;

    // Set input
    for (var row = 0; row < this.BLOCKSIZE; row++)
    {
        for (var col = 0; col < 4; col++)
        {
            state[row][col] = m[offset + col * 4 + row];
        }
    }

    // Add round key
    for (row = 0; row < 4; row++)
    {
        for (var col = 0; col < 4; col++)
        {
            state[row][col] ^= this.keyschedule_[col][row];
        }
    }

    for (var round = 1; round < this.nrounds_; round++)
    {
        // Sub bytes
        for (var row = 0; row < 4; row++)
        {
            for (var col = 0; col < 4; col++)
            {
                state[row][col] = SBOX[state[row][col]];
            }
        }

        // Shift rows
        state[1].push(state[1].shift());
        state[2].push(state[2].shift());
        state[2].push(state[2].shift());
        state[3].unshift(state[3].pop());

        // Mix columns
        for (var col = 0; col < 4; col++)
        {
            var s0 = state[0][col],
            s1 = state[1][col],
            s2 = state[2][col],
            s3 = state[3][col];

            state[0][col] = MULT2[s0] ^ MULT3[s1] ^ s2 ^ s3;
            state[1][col] = s0 ^ MULT2[s1] ^ MULT3[s2] ^ s3;
            state[2][col] = s0 ^ s1 ^ MULT2[s2] ^ MULT3[s3];
            state[3][col] = MULT3[s0] ^ s1 ^ s2 ^ MULT2[s3];

        }

        // Add round key
        for (var row = 0; row < 4; row++)
        {
            for (var col = 0; col < 4; col++)
            {
                state[row][col] ^= this.keyschedule_[round * 4 + col][row];
            }
        }
    }

    // Sub bytes
    for (var row = 0; row < 4; row++)
    {
        for (var col = 0; col < 4; col++)
        {
            state[row][col] = SBOX[state[row][col]];
        }
    }

    // Shift rows
    state[1].push(state[1].shift());
    state[2].push(state[2].shift());
    state[2].push(state[2].shift());
    state[3].unshift(state[3].pop());

    // Add round key
    for (var row = 0; row < 4; row++)
    {
        for (var col = 0; col < 4; col++)
        {
            state[row][col] ^= this.keyschedule_[this.nrounds_ * 4 + col][row];
        }
    }

    // Set output
    for (var row = 0; row < this.BLOCKSIZE; row++)
    {
        for (var col = 0; col < 4; col++)
        {
            m[offset + col * 4 + row] = state[row][col];
        }
    }
}

morning.crypt.Aes.prototype.decrypt = function(ciphertext, password)
{
    // Determine mode
    var mode = new morning.crypt.blockmodes.OfbMode();

    var // Convert to bytes if ciphertext is a string
        c = ciphertext.constructor == String ?
                morning.crypt.util.base64ToBytes(ciphertext):
                ciphertext;

        // Separate IV and message
        var iv = c.splice(0, this.BLOCKSIZE * 4),

        // Generate key
        k = password.constructor == String ?
                // Derive key from pass-phrase
                morning.crypt.pbkdf2.encode(password, iv, 32, { asBytes: true }) :
                // else, assume byte array representing cryptographic key
                password;

    // Decrypt
    this.init_(k);
    mode.decrypt(this, c, iv);

    // Return plaintext
    return morning.crypt.charenc.UTF8.bytesToString(c);
}

morning.crypt.Aes.prototype.decryptBlock = function (c, offset)
{
    var state = this.state_,
        INVSBOX = morning.crypt.Aes.INVSBOX,
        MULTE = morning.crypt.Aes.MULTE,
        MULTB = morning.crypt.Aes.MULTB,
        MULTD = morning.crypt.Aes.MULTD,
        MULT9 = morning.crypt.Aes.MULT9,
        row, col;

    // Set input
    for (row = 0; row < this.BLOCKSIZE; row++)
    {
        for (col = 0; col < 4; col++)
        {
            state[row][col] = c[offset + col * 4 + row];
        }
    }

    // Add round key
    for (row = 0; row < 4; row++)
    {
        for (col = 0; col < 4; col++)
        {
            state[row][col] ^= this.keyschedule_[this.nrounds_ * 4 + col][row];
        }
    }

    for (var round = 1; round < this.nrounds_; round++)
    {
        // Inv shift rows
        state[1].unshift(state[1].pop());
        state[2].push(state[2].shift());
        state[2].push(state[2].shift());
        state[3].push(state[3].shift());

        // Inv sub bytes
        for (row = 0; row < 4; row++)
        {
            for (col = 0; col < 4; col++)
            {
                state[row][col] = INVSBOX[state[row][col]];
            }
        }

        // Add round key
        for (row = 0; row < 4; row++)
        {
            for (col = 0; col < 4; col++)
            {
                state[row][col] ^= this.keyschedule_[(this.nrounds_ - round) * 4 + col][row];
            }
        }

        // Inv mix columns
        for (col = 0; col < 4; col++)
        {
            var s0 = state[0][col],
                s1 = state[1][col],
                s2 = state[2][col],
                s3 = state[3][col];

            state[0][col] = MULTE[s0] ^ MULTB[s1] ^ MULTD[s2] ^ MULT9[s3];
            state[1][col] = MULT9[s0] ^ MULTE[s1] ^ MULTB[s2] ^ MULTD[s3];
            state[2][col] = MULTD[s0] ^ MULT9[s1] ^ MULTE[s2] ^ MULTB[s3];
            state[3][col] = MULTB[s0] ^ MULTD[s1] ^ MULT9[s2] ^ MULTE[s3];

        }

    }

    // Inv shift rows
    state[1].unshift(state[1].pop());
    state[2].push(state[2].shift());
    state[2].push(state[2].shift());
    state[3].push(state[3].shift());

    // Inv sub bytes
    for (row = 0; row < 4; row++)
    {
        for (col = 0; col < 4; col++)
        {
            state[row][col] = INVSBOX[state[row][col]];
        }
    }

    // Add round key
    for (row = 0; row < 4; row++)
    {
        for (col = 0; col < 4; col++)
        {
            state[row][col] ^= this.keyschedule_[col][row];
        }
    }

    // Set output
    for (row = 0; row < this.BLOCKSIZE; row++)
    {
        for (col = 0; col < 4; col++)
        {
            c[offset + col * 4 + row] = state[row][col];
        }
    }
}
// General

/**
 * ResultLog is a mixed result type that gives a boolean return value and additional logging information
 * @typedef {object} ResultLog
 * @property {boolean} result   The result of any operation
 * @property {string} log       Additional logging information of any operation
 */

// util

// sign-data

/**
 * KeyObject from node crypto module, for documentation, see https://nodejs.org/api/crypto.html#class-keyobject
 * @typedef {object} KeyObject
 */

/**
 * Additional information required to specify a KeyObject
 * @typedef {object} KeySpec
 * @property {string} format        Format of the given key. Must be "pem", "der" or "jwk".
 * @property {string} [type]        Specifies the cryptography standard that has been used. Must be "pkcs1", "pkcs8" or "sec1". This option is required only if the format is "der" and ignored otherwise.
 * @property {boolean} isEncrypted  Indicates whether encryption is used
 * @property {string} [passphrase]  The passphrase to use for decryption of an encrypted key
 */

module.exports = {
    /**
     * @type {ResultLog}
     * @type {KeyObject}
     * @type {KeySpec}
     */
}
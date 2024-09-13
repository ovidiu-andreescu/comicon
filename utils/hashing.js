const crypto = require('crypto');

// MD5 Hash Function
function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

// Exporting the hash functions
module.exports = {
    md5,
}
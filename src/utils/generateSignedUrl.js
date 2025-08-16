const fs = require('fs');
const crypto = require('crypto');

/**
 * Generate a CloudFront signed URL
 * @param {string} baseUrl - The CloudFront file URL (e.g., https://yourdist.cloudfront.net/video.m3u8)
 * @param {string} keyPairId - CloudFront Key Pair ID from AWS console
 * @param {string} privateKeyPath - Path to your private key PEM file
 * @param {number} expireInSeconds - URL expiry time from now (default: 300 seconds = 5 min)
 * @returns {string} Signed URL
 */

function generateSignedUrl(baseUrl, keyPairId, privateKeyPath, expireInSeconds = 60) {
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

    // Expiry time in UNIX timestamp (seconds)
    const expires = Math.floor((Date.now() / 1000) + expireInSeconds);

    // Create a policy for "canned" signed URL (simpler version)
    const policy = {
        Statement: [{
            Resource: baseUrl,
            Condition: {
                DateLessThan: { "AWS:EpochTime": expires }
            }
        }]
    };

    // Stringify and base64 encode the policy
    const policyString = JSON.stringify(policy);
    const policyBase64 = Buffer.from(policyString).toString('base64')
        .replace(/\+/g, '-').replace(/=/g, '_').replace(/\//g, '~');

    // Sign the policy with your private key
    const signer = crypto.createSign('RSA-SHA1');
    signer.update(policyString);
    const signature = signer.sign(privateKey, 'base64')
        .replace(/\+/g, '-').replace(/=/g, '_').replace(/\//g, '~');

    // Return the signed URL
    return `${baseUrl}?Expires=${expires}&Signature=${signature}&Key-Pair-Id=${keyPairId}`;
}

module.exports = generateSignedUrl;

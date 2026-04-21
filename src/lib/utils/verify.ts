import { GUMROAD_PRODUCT_ID } from "$env/static/private";

/**
 * Verifies a Gumroad license key.
 * 
 * @param {string} licenseKey - The license key to verify.
 * @returns {Promise<{valid: boolean, purchase?: any, message?: string}>}
 */
export async function verifyGumroadLicense(licenseKey: string) {

    try {
        const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: GUMROAD_PRODUCT_ID,
                license_key: licenseKey
            })
        });

        const data = await response.json();

        if (data.success && data.purchase && !data.purchase.refunded && !data.purchase.chargeback) {
            return {
                valid: true,
                purchase: data.purchase
            };
        }

        return {
            valid: false,
            message: data.message || 'Invalid or inactive license key.'
        };
    } catch (error) {
        console.error('Error verifying Gumroad license:', error);
        return {
            valid: false,
            message: 'Verification failed. Please try again later.'
        };
    }
}

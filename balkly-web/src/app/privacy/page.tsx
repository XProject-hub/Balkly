export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-mist-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last Updated: November 6, 2025</p>

          <div className="prose max-w-none">
            <h2>1. Introduction</h2>
            <p>
              <strong>NoLimitsDevelopments LLC</strong> ("we", "our", "Balkly") respects your privacy and is committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
            </p>

            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Information You Provide</h3>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, password, phone number</li>
              <li><strong>Profile Information:</strong> Avatar, bio, location (city/country), preferred language</li>
              <li><strong>Listings:</strong> Item details, photos, descriptions, pricing</li>
              <li><strong>Communications:</strong> Messages, forum posts, support inquiries</li>
              <li><strong>Payment Information:</strong> Processed securely by Stripe (we don't store card details)</li>
            </ul>

            <h3>2.2 Information Automatically Collected</h3>
            <ul>
              <li><strong>Usage Data:</strong> Pages visited, time spent, interactions</li>
              <li><strong>Device Information:</strong> IP address, browser type, device type, operating system</li>
              <li><strong>Location Data:</strong> General location based on IP (city/country level)</li>
              <li><strong>Cookies:</strong> Session cookies, preference cookies (see Cookie Policy)</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul>
              <li>Provide and improve our marketplace services</li>
              <li>Process transactions and send confirmations</li>
              <li>Communicate with you about your account and activities</li>
              <li>Personalize your experience (language, currency preferences)</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Analyze usage patterns to improve features</li>
              <li>Send promotional emails (with your consent - you can opt out)</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>4. Information Sharing</h2>
            <p>We share your information only in these circumstances:</p>
            
            <h3>4.1 With Other Users</h3>
            <ul>
              <li>Your public profile (name, avatar) is visible to all users</li>
              <li>Listing details are public</li>
              <li>Forum posts and comments are public</li>
              <li>Your email and phone are NEVER shared without your permission</li>
            </ul>

            <h3>4.2 With Service Providers</h3>
            <ul>
              <li><strong>Stripe:</strong> Payment processing (PCI-DSS compliant)</li>
              <li><strong>Resend:</strong> Email delivery service</li>
              <li><strong>Cloud Storage:</strong> Image and file hosting (MinIO S3)</li>
              <li><strong>Analytics:</strong> Usage tracking (anonymized)</li>
            </ul>

            <h3>4.3 Legal Requirements</h3>
            <p>
              We may disclose your information if required by UAE law, court order, or government request, 
              or to protect our rights, property, or safety.
            </p>

            <h2>5. Your Rights (Under UAE and GDPR)</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate information</li>
              <li><strong>Erasure:</strong> Delete your account and data ("right to be forgotten")</li>
              <li><strong>Data Portability:</strong> Export your data in machine-readable format</li>
              <li><strong>Object:</strong> Opt out of marketing communications</li>
              <li><strong>Restrict Processing:</strong> Limit how we use your data</li>
            </ul>

            <p>
              To exercise these rights, contact us at: <a href="mailto:privacy@balkly.live" className="text-balkly-blue hover:underline">privacy@balkly.live</a>
            </p>

            <h2>6. Data Security</h2>
            <p>We implement industry-standard security measures:</p>
            <ul>
              <li>Encrypted data transmission (HTTPS/SSL)</li>
              <li>Secure password hashing (bcrypt)</li>
              <li>Two-factor authentication (2FA) available</li>
              <li>Regular security audits and updates</li>
              <li>Limited employee access to personal data</li>
              <li>Secure cloud infrastructure with backups</li>
            </ul>

            <h2>7. Data Retention</h2>
            <ul>
              <li><strong>Active Accounts:</strong> Data retained while account is active</li>
              <li><strong>Deleted Accounts:</strong> Personal data deleted within 30 days (except legal requirements)</li>
              <li><strong>Transaction Records:</strong> Retained for 7 years (UAE tax/legal compliance)</li>
              <li><strong>Anonymized Analytics:</strong> Retained indefinitely for platform improvement</li>
            </ul>

            <h2>8. Children's Privacy</h2>
            <p>
              Balkly is not intended for users under 18 years of age. We do not knowingly collect 
              information from children. If we discover data from a minor, we will delete it immediately.
            </p>

            <h2>9. International Data Transfers</h2>
            <p>
              Your data is primarily stored on servers in the UAE. If data is transferred outside UAE, 
              we ensure appropriate safeguards are in place to protect your information in accordance 
              with this Privacy Policy.
            </p>

            <h2>10. Cookies & Tracking</h2>
            <p>
              We use cookies for essential platform functionality and analytics. 
              See our <a href="/cookies" className="text-balkly-blue hover:underline">Cookie Policy</a> for details.
            </p>

            <h2>11. Third-Party Links</h2>
            <p>
              Our platform may contain links to external websites. We are not responsible for the 
              privacy practices of third-party sites. Please review their privacy policies.
            </p>

            <h2>12. Marketing Communications</h2>
            <p>
              With your consent, we may send promotional emails about new features, events, and offers. 
              You can opt out anytime by:
            </p>
            <ul>
              <li>Clicking "Unsubscribe" in any marketing email</li>
              <li>Updating preferences in your account settings</li>
              <li>Emailing: <a href="mailto:unsubscribe@balkly.live" className="text-balkly-blue hover:underline">unsubscribe@balkly.live</a></li>
            </ul>

            <h2>13. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant changes 
              via email or prominent notice on the platform. Continued use after changes constitutes acceptance.
            </p>

            <h2>14. Contact Us</h2>
            <p>
              For privacy-related questions or requests, contact us at:
            </p>
            <p>
              <strong>NoLimitsDevelopments LLC</strong><br />
              Privacy & Data Protection Officer<br />
              Dubai, United Arab Emirates<br />
              Email: <a href="mailto:privacy@balkly.live" className="text-balkly-blue hover:underline">privacy@balkly.live</a><br />
              Support: <a href="mailto:support@balkly.live" className="text-balkly-blue hover:underline">support@balkly.live</a>
            </p>

            <hr className="my-8" />

            <p className="text-sm text-gray-600">
              <strong>Compliance:</strong> This Privacy Policy complies with UAE Federal Decree-Law No. 45 of 2021 
              on the Protection of Personal Data and the EU General Data Protection Regulation (GDPR) for 
              European users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last Updated: November 6, 2025</p>

          <div className="prose max-w-none">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using Balkly ("Platform"), operated by <strong>NoLimitsDevelopments LLC</strong>, registered in the United Arab Emirates, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>

            <h2>2. User Accounts</h2>
            <h3>2.1 Registration</h3>
            <p>You must be at least 18 years old to create an account. You agree to:</p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h3>2.2 Account Types</h3>
            <ul>
              <li><strong>Buyer:</strong> Browse and purchase items/tickets</li>
              <li><strong>Seller:</strong> Post listings and sell items (subject to approval)</li>
              <li><strong>Organizer:</strong> Create and manage events</li>
            </ul>

            <h2>3. Marketplace Rules</h2>
            <h3>3.1 Listings</h3>
            <ul>
              <li>Listings must be accurate and not misleading</li>
              <li>Prohibited items: weapons, drugs, counterfeit goods, illegal items under UAE law</li>
              <li>You retain ownership of your content but grant Balkly a license to display it</li>
              <li>We reserve the right to remove any listing that violates these terms</li>
            </ul>

            <h3>3.2 Pricing & Payments</h3>
            <ul>
              <li><strong>Posting is FREE</strong> for all categories</li>
              <li><strong>Promotion fees</strong> apply for featured placement (3, 7, 30 days)</li>
              <li><strong>Event tickets</strong> include a 5% platform fee</li>
              <li><strong>Forum sticky posts</strong> require payment for featured placement</li>
              <li>All payments are processed securely through Stripe</li>
              <li>Prices shown in EUR or AED based on user selection</li>
            </ul>

            <h2>4. User Conduct</h2>
            <p>You agree NOT to:</p>
            <ul>
              <li>Post fraudulent, misleading, or deceptive content</li>
              <li>Harass, threaten, or abuse other users</li>
              <li>Spam or send unsolicited commercial messages</li>
              <li>Violate any applicable UAE or international laws</li>
              <li>Impersonate others or create fake accounts</li>
              <li>Scrape or harvest data from the platform</li>
              <li>Attempt to hack or compromise platform security</li>
            </ul>

            <h2>5. Intellectual Property</h2>
            <p>
              The Balkly name, logo, and all platform features are owned by NoLimitsDevelopments LLC. 
              User-generated content remains the property of the respective users, who grant Balkly 
              a worldwide, non-exclusive license to use, display, and distribute such content.
            </p>

            <h2>6. Privacy & Data</h2>
            <p>
              Your use of Balkly is subject to our <a href="/privacy" className="text-balkly-blue hover:underline">Privacy Policy</a>. 
              We comply with UAE data protection regulations and international privacy standards.
            </p>

            <h2>7. Liability & Disclaimers</h2>
            <h3>7.1 Platform "As Is"</h3>
            <p>
              Balkly is provided "as is" without warranties of any kind. We do not guarantee:
            </p>
            <ul>
              <li>Accuracy of user-posted content</li>
              <li>Quality or authenticity of listed items</li>
              <li>Successful completion of transactions</li>
              <li>Uninterrupted platform availability</li>
            </ul>

            <h3>7.2 Limitation of Liability</h3>
            <p>
              NoLimitsDevelopments LLC and Balkly are not liable for:
            </p>
            <ul>
              <li>Disputes between buyers and sellers</li>
              <li>Lost, stolen, or damaged items during transactions</li>
              <li>Financial losses from fraudulent users</li>
              <li>Indirect, incidental, or consequential damages</li>
            </ul>

            <p>
              Maximum liability is limited to the amount paid by the user in the 12 months prior to the claim.
            </p>

            <h2>8. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the <strong>United Arab Emirates</strong>. 
              Any disputes shall be resolved in the courts of Dubai, UAE, or through arbitration as mutually agreed.
            </p>

            <h2>9. Termination</h2>
            <p>We reserve the right to:</p>
            <ul>
              <li>Suspend or terminate accounts that violate these terms</li>
              <li>Remove content that breaches our policies</li>
              <li>Ban users engaged in fraudulent activities</li>
              <li>Modify or discontinue services with notice</li>
            </ul>

            <h2>10. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Continued use of the platform after changes 
              constitutes acceptance of the updated terms. Major changes will be notified via email.
            </p>

            <h2>11. Contact Information</h2>
            <p>
              <strong>NoLimitsDevelopments LLC</strong><br />
              Dubai, United Arab Emirates<br />
              Email: <a href="mailto:legal@balkly.live" className="text-balkly-blue hover:underline">legal@balkly.live</a><br />
              Support: <a href="mailto:support@balkly.live" className="text-balkly-blue hover:underline">support@balkly.live</a>
            </p>

            <hr className="my-8" />

            <p className="text-sm text-gray-600">
              By using Balkly, you acknowledge that you have read, understood, and agree to be bound 
              by these Terms of Service and our Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContentModerationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-balkly-blue to-iris-purple text-white py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-5xl font-bold mb-4">Content Moderation Policy</h1>
          <p className="text-xl text-white/90">Last Updated: February 18, 2026</p>
          <p className="text-white/80 mt-4">NoLimitsDevelopments LLC • Dubai, UAE</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 lg:p-16">
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-balkly-blue/20 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-li:text-gray-700 prose-li:mb-2 prose-strong:text-gray-900 prose-a:text-balkly-blue prose-a:no-underline hover:prose-a:underline prose-ul:my-6 prose-ol:my-6">

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 not-prose">
              <p className="text-sm text-blue-800">
                This Content Moderation Policy explains how Balkly handles user-generated content, reports, and enforcement actions. It is incorporated by reference into our{" "}
                <a href="/terms" className="text-blue-600 hover:underline font-medium">Terms of Service</a>.
              </p>
            </div>

            <h2>1. Our Moderation Approach</h2>
            <p>
              Balkly operates as an online intermediary platform. We apply a combination of automated detection and human review to ensure content on the platform complies with our policies and applicable laws.
            </p>
            <p>
              We are committed to maintaining a safe, fair, and lawful marketplace for the Balkan community in the UAE and beyond.
            </p>

            <h2>2. Prohibited Content</h2>
            <p>The following content is strictly prohibited on Balkly:</p>

            <h3>2.1 Illegal Content</h3>
            <ul>
              <li>Listings for weapons, firearms, or ammunition without proper licensing</li>
              <li>Controlled substances, drugs, or drug paraphernalia</li>
              <li>Counterfeit, pirated, or stolen goods</li>
              <li>Content that violates UAE law or international law</li>
              <li>Services that require a trade license but are offered without one</li>
              <li>Human trafficking, exploitation, or any form of modern slavery</li>
            </ul>

            <h3>2.2 Harmful Content</h3>
            <ul>
              <li>Hate speech targeting individuals or groups based on race, religion, nationality, gender, or sexual orientation</li>
              <li>Threatening, harassing, or abusive language</li>
              <li>Content promoting violence or self-harm</li>
              <li>Explicit sexual content</li>
              <li>Content involving minors in any inappropriate context</li>
            </ul>

            <h3>2.3 Deceptive Content</h3>
            <ul>
              <li>False or misleading product descriptions, prices, or conditions</li>
              <li>Fake reviews, fabricated ratings, or manipulation of platform metrics</li>
              <li>Impersonation of another person, business, or official entity</li>
              <li>Phishing links or malicious content</li>
              <li>Pyramid schemes, multi-level marketing presented as employment</li>
            </ul>

            <h3>2.4 Spam & Platform Abuse</h3>
            <ul>
              <li>Duplicate listings for the same item</li>
              <li>Mass posting or automated submissions</li>
              <li>Listings intended to redirect users to external platforms to circumvent Balkly's systems</li>
            </ul>

            <h2>3. Verification & Trust Signals</h2>
            <p>
              Balkly offers optional verification for sellers and businesses. The <strong>Verified</strong> badge indicates that a user has submitted identification or business documentation for review. However:
            </p>
            <ul>
              <li>Verification does not constitute endorsement of any listing or service</li>
              <li>Balkly does not guarantee the accuracy of documents submitted</li>
              <li>Trade licenses and permits are the sole responsibility of the user</li>
              <li>Absence of a Verified badge does not mean a user is fraudulent</li>
            </ul>

            <h2>4. How We Detect Violations</h2>
            <p>We use the following methods to identify policy violations:</p>
            <ul>
              <li><strong>User Reports:</strong> Community members can flag any listing using the Report button on each listing page</li>
              <li><strong>Automated Scanning:</strong> Keyword and image filters scan new listings at submission</li>
              <li><strong>Admin Review:</strong> Our team manually reviews flagged content and high-risk categories</li>
              <li><strong>Periodic Audits:</strong> Random sampling of active listings for compliance</li>
            </ul>

            <h2>5. Reporting a Violation</h2>
            <p>Any user can report content they believe violates our policies:</p>
            <ul>
              <li><strong>On any listing:</strong> Click the red <strong>Report</strong> button and select a reason</li>
              <li><strong>By email:</strong> <a href="mailto:legal@balkly.live" className="text-balkly-blue hover:underline">legal@balkly.live</a> for legal matters</li>
              <li><strong>For urgent takedown requests</strong> (e.g., illegal content): Email <a href="mailto:legal@balkly.live" className="text-balkly-blue hover:underline">legal@balkly.live</a> with subject line "URGENT TAKEDOWN"</li>
            </ul>
            <p>
              We aim to review all reports within <strong>48 business hours</strong>. Urgent legal matters are prioritized and reviewed as soon as possible.
            </p>

            <h2>6. Enforcement Actions</h2>
            <p>Upon confirming a violation, Balkly may take the following actions depending on severity:</p>

            <h3>6.1 Content Actions</h3>
            <ul>
              <li><strong>Warning:</strong> Notification sent to the user explaining the violation</li>
              <li><strong>Listing removal:</strong> The offending listing is unpublished or deleted</li>
              <li><strong>Content editing:</strong> In minor cases, we may request the user to correct the listing</li>
            </ul>

            <h3>6.2 Account Actions</h3>
            <ul>
              <li><strong>Temporary suspension:</strong> Account access restricted for a defined period</li>
              <li><strong>Permanent ban:</strong> Account and all associated content permanently removed</li>
              <li><strong>IP/device block:</strong> For repeated violations or serious offenses</li>
            </ul>

            <h3>6.3 Legal Referral</h3>
            <ul>
              <li>In cases involving illegal activity, we may report to UAE authorities</li>
              <li>We will cooperate fully with law enforcement requests</li>
              <li>We retain records of violations for legal compliance purposes</li>
            </ul>

            <h2>7. Appeals Process</h2>
            <p>
              If you believe your content was removed or your account was actioned in error, you may appeal by contacting us at{" "}
              <a href="mailto:legal@balkly.live" className="text-balkly-blue hover:underline">legal@balkly.live</a> with subject line "Content Appeal".
            </p>
            <p>Please include:</p>
            <ul>
              <li>Your account username or registered email</li>
              <li>The listing ID or content in question</li>
              <li>Your explanation of why you believe the action was incorrect</li>
              <li>Any supporting documentation (e.g., trade license, proof of authenticity)</li>
            </ul>
            <p>
              Appeals are reviewed within <strong>5 business days</strong>. Our decision on appeal is final.
            </p>

            <h2>8. Promotion & Payment Policy</h2>
            <p>
              Paying for a promoted listing (Featured, Boosted, or Standard plan) does not guarantee:
            </p>
            <ul>
              <li>Approval of the listing</li>
              <li>Continued visibility if a violation is subsequently discovered</li>
              <li>Exemption from moderation review</li>
            </ul>
            <p>
              Balkly reserves the right to remove any listing, including promoted listings, if they are found to violate this policy. <strong>Refunds for removed promoted listings are assessed on a case-by-case basis.</strong>
            </p>

            <h2>9. Notice and Takedown (NTD) Procedure</h2>
            <p>
              In compliance with applicable UAE law and international best practices, Balkly operates a Notice and Takedown procedure:
            </p>
            <ol>
              <li><strong>Notice submitted</strong> — Complainant submits details of the alleged violation to <a href="mailto:legal@balkly.live" className="text-balkly-blue hover:underline">legal@balkly.live</a></li>
              <li><strong>Review</strong> — Our legal team reviews the notice within 48 hours (urgent cases within 4 hours)</li>
              <li><strong>Decision</strong> — Content is removed, preserved, or the complaint is rejected with explanation</li>
              <li><strong>Notification</strong> — Both the complainant and the content owner are notified of the decision</li>
              <li><strong>Appeal</strong> — Either party may appeal within 14 days</li>
            </ol>

            <h2>10. Limitation of Liability</h2>
            <p>
              Balkly is an intermediary platform and is not liable for user-generated content. Our moderation efforts are provided on a best-efforts basis and do not constitute a guarantee of content legality or accuracy. Users remain solely responsible for the content they post and the activities they conduct through the platform.
            </p>

            <hr className="my-8" />

            <div className="bg-gray-50 rounded-lg p-6 not-prose">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Contact for Moderation Issues</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Legal & Takedown:</strong> <a href="mailto:legal@balkly.live" className="text-balkly-blue hover:underline">legal@balkly.live</a></p>
                <p><strong>General Support:</strong> <a href="mailto:support@balkly.live" className="text-balkly-blue hover:underline">support@balkly.live</a></p>
                <p><strong>Company:</strong> NoLimitsDevelopments LLC, Dubai, UAE</p>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Related policies: <a href="/terms" className="text-balkly-blue hover:underline">Terms of Service</a> · <a href="/privacy" className="text-balkly-blue hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

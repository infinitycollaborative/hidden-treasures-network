import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHero } from "@/components/marketing/PageHero"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Privacy Policy"
        description="Your privacy is important to us. Learn how we collect, use, and protect your information."
      />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
              <p className="text-sm text-gray-500">Last updated: December 2024</p>
            </CardHeader>
            <CardContent className="prose max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">1. Introduction</h2>
                <p className="text-gray-700">
                  Infinity Aero Club Tampa Bay, Inc. ("we," "us," or "our") operates the Hidden Treasures Network
                  platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                  information when you use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">2. Information We Collect</h2>
                <h3 className="text-lg font-medium text-gray-800 mt-4">Personal Information</h3>
                <p className="text-gray-700">We may collect personal information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Profile information (role, organization, interests)</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Communications you send to us</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-800 mt-4">Automatically Collected Information</h3>
                <p className="text-gray-700">When you use our platform, we may automatically collect:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Device information (browser type, operating system)</li>
                  <li>Usage data (pages visited, features used)</li>
                  <li>IP address and general location information</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">3. How We Use Your Information</h2>
                <p className="text-gray-700">We use the information we collect to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Provide, maintain, and improve our platform</li>
                  <li>Create and manage your account</li>
                  <li>Process donations and send receipts</li>
                  <li>Connect students with mentors and educational resources</li>
                  <li>Send you updates, newsletters, and promotional materials (with your consent)</li>
                  <li>Respond to your comments, questions, and support requests</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Detect, investigate, and prevent fraudulent or unauthorized activities</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">4. Children's Privacy</h2>
                <p className="text-gray-700">
                  Our platform serves youth, and we take their privacy seriously. For users under 13, we require
                  parental or guardian consent before collecting personal information. We comply with the
                  Children's Online Privacy Protection Act (COPPA) and similar laws. Parents and guardians
                  can review, modify, or request deletion of their child's information by contacting us.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">5. Information Sharing</h2>
                <p className="text-gray-700">We may share your information in the following circumstances:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>With your consent:</strong> When you explicitly agree to share information</li>
                  <li><strong>Service providers:</strong> With third parties who perform services on our behalf (e.g., Stripe for payments, Firebase for authentication)</li>
                  <li><strong>Network organizations:</strong> With partner organizations to facilitate mentorship and educational opportunities</li>
                  <li><strong>Legal requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                </ul>
                <p className="text-gray-700 mt-2">
                  We do not sell your personal information to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">6. Data Security</h2>
                <p className="text-gray-700">
                  We implement appropriate technical and organizational measures to protect your personal
                  information against unauthorized access, alteration, disclosure, or destruction. These
                  measures include encryption, secure authentication, and regular security assessments.
                  However, no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">7. Your Rights and Choices</h2>
                <p className="text-gray-700">You have the right to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Access, update, or delete your personal information</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of your data</li>
                  <li>Withdraw consent where applicable</li>
                  <li>Lodge a complaint with a supervisory authority</li>
                </ul>
                <p className="text-gray-700 mt-2">
                  To exercise these rights, please contact us at the information provided below.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">8. Cookies and Tracking</h2>
                <p className="text-gray-700">
                  We use cookies and similar technologies to enhance your experience, analyze usage, and
                  assist in our marketing efforts. You can control cookies through your browser settings,
                  though disabling them may affect platform functionality.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">9. Third-Party Links</h2>
                <p className="text-gray-700">
                  Our platform may contain links to third-party websites or services. We are not responsible
                  for the privacy practices of these third parties. We encourage you to read their privacy
                  policies before providing any personal information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">10. International Data Transfers</h2>
                <p className="text-gray-700">
                  Your information may be transferred to and processed in countries other than your own.
                  We ensure appropriate safeguards are in place to protect your information in accordance
                  with this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">11. Changes to This Policy</h2>
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. We will notify you of any material
                  changes by posting the new policy on this page and updating the "Last updated" date.
                  Your continued use of the platform after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">12. Contact Us</h2>
                <p className="text-gray-700">
                  If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-2">
                  <p className="text-gray-700">
                    <strong>Infinity Aero Club Tampa Bay, Inc.</strong><br />
                    Email: privacy@hiddentreasuresnetwork.org<br />
                    General: info@hiddentreasuresnetwork.org<br />
                    Tampa Bay, Florida, United States
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHero } from "@/components/marketing/PageHero"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Terms of Service"
        description="Please read these terms carefully before using the Hidden Treasures Network."
      />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Terms of Service</CardTitle>
              <p className="text-sm text-gray-500">Last updated: December 2024</p>
            </CardHeader>
            <CardContent className="prose max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">1. Acceptance of Terms</h2>
                <p className="text-gray-700">
                  By accessing or using the Hidden Treasures Network platform operated by Infinity Aero Club Tampa Bay, Inc.
                  ("we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms,
                  please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">2. Description of Service</h2>
                <p className="text-gray-700">
                  Hidden Treasures Network is a global platform that connects aviation and STEM education organizations,
                  mentors, students, and sponsors. Our mission is to empower underserved youth worldwide through
                  aviation, STEM, and entrepreneurship education.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">3. User Accounts</h2>
                <p className="text-gray-700">
                  To access certain features of the platform, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Promptly update your account information as needed</li>
                  <li>Accept responsibility for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">4. User Conduct</h2>
                <p className="text-gray-700">You agree not to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Use the platform for any unlawful purpose</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Submit false or misleading information</li>
                  <li>Interfere with the proper functioning of the platform</li>
                  <li>Attempt to gain unauthorized access to any portion of the platform</li>
                  <li>Use the platform to send spam or unsolicited communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">5. Youth Protection</h2>
                <p className="text-gray-700">
                  Given our mission to serve youth, we take child safety seriously. All mentors and organization
                  representatives undergo verification processes. Users must report any concerning behavior
                  immediately. We comply with all applicable child protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">6. Intellectual Property</h2>
                <p className="text-gray-700">
                  The platform and its original content, features, and functionality are owned by Infinity Aero Club
                  Tampa Bay, Inc. and are protected by international copyright, trademark, and other intellectual
                  property laws. Resources shared on the platform remain the property of their respective owners.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">7. Donations</h2>
                <p className="text-gray-700">
                  Donations made through the platform are processed securely via Stripe. All donations to Infinity
                  Aero Club Tampa Bay, Inc. are tax-deductible to the extent allowed by law as we are a registered
                  501(c)(3) nonprofit organization. Donation receipts will be provided for your records.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">8. Disclaimer of Warranties</h2>
                <p className="text-gray-700">
                  The platform is provided "as is" without warranties of any kind, either express or implied.
                  We do not guarantee that the platform will be uninterrupted, secure, or error-free.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">9. Limitation of Liability</h2>
                <p className="text-gray-700">
                  To the fullest extent permitted by law, Infinity Aero Club Tampa Bay, Inc. shall not be liable
                  for any indirect, incidental, special, consequential, or punitive damages arising from your use
                  of the platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">10. Changes to Terms</h2>
                <p className="text-gray-700">
                  We reserve the right to modify these terms at any time. We will notify users of significant
                  changes via email or platform notification. Continued use of the platform after changes
                  constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">11. Governing Law</h2>
                <p className="text-gray-700">
                  These terms shall be governed by and construed in accordance with the laws of the State of Florida,
                  United States, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-aviation-navy">12. Contact Information</h2>
                <p className="text-gray-700">
                  For questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mt-2">
                  <p className="text-gray-700">
                    <strong>Infinity Aero Club Tampa Bay, Inc.</strong><br />
                    Email: info@hiddentreasuresnetwork.org<br />
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

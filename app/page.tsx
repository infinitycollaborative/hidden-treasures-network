import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
            alt="Aviation students diversity background"
            fill
            className="object-cover brightness-50"
            priority
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Hidden Treasures Network
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Empowering underrepresented youth to soar in STEM and aviation
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
            Get Involved
          </button>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-4">
                At Hidden Treasures Network, we believe every young person deserves
                the opportunity to reach for the skies. We provide mentorship,
                educational resources, and career pathways in STEM and aviation
                for underrepresented communities.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Through hands-on programs, industry partnerships, and dedicated
                mentors, we're building the next generation of pilots, engineers,
                and aerospace professionals.
              </p>
              <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded transition-colors">
                Learn More
              </button>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop"
                alt="STEM education children"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">
            Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Story 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"
                  alt="Aviation student portrait 1"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">Marcus Johnson</h3>
                <p className="text-sm text-blue-600 mb-3">Commercial Pilot</p>
                <p className="text-gray-700">
                  "The mentorship I received opened doors I never knew existed.
                  Now I'm flying for a major airline and inspiring others to follow
                  their dreams."
                </p>
              </div>
            </div>

            {/* Story 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
                  alt="Aviation student portrait 2"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">Sarah Chen</h3>
                <p className="text-sm text-blue-600 mb-3">Aerospace Engineer</p>
                <p className="text-gray-700">
                  "Through HTN's programs, I discovered my passion for aerospace
                  engineering. Today I'm designing the next generation of aircraft."
                </p>
              </div>
            </div>

            {/* Story 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                  alt="Aviation student portrait 3"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">David Rodriguez</h3>
                <p className="text-sm text-blue-600 mb-3">Air Traffic Controller</p>
                <p className="text-gray-700">
                  "HTN showed me that aviation careers extend beyond the cockpit.
                  I love the challenge and responsibility of keeping our skies safe."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 text-white">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
          <Image
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
            alt="Aviation pattern background"
            fill
            className="object-cover opacity-20 mix-blend-overlay"
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">About Us</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-300 transition-colors">Our Mission</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Our Team</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Impact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Programs</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-300 transition-colors">Mentorship</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Flight Training</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">STEM Education</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Get Involved</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-300 transition-colors">Volunteer</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Donate</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Partner With Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-300 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Newsletter</a></li>
                <li><a href="#" className="hover:text-blue-300 transition-colors">Social Media</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-blue-700 text-center">
            <p>&copy; 2024 Hidden Treasures Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

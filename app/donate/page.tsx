import DonationForm from '@/components/donations/DonationForm'

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-aviation-navy mb-4">
            Support Our Mission
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Your contribution helps us empower the next generation of aviation and STEM leaders.
            Every donation makes a difference.
          </p>
        </div>

        <DonationForm />
      </div>
    </div>
  )
}

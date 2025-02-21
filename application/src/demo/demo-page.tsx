import { Book, Code, Zap, Rocket, Users, LifeBuoy, Globe, ChevronRight } from 'lucide-react'

export default function DemoPage() {
  return (
    <div className='min-h-screen text-gray-900 bg-black'>
      {/* Header */}
      <header className='sticky top-0 bg-white shadow-sm'>
        <div className='px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Product Documentation</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className='px-4 py-6 mx-auto max-w-7xl sm:py-12 sm:px-6 lg:px-8'>
        {/* Hero Section */}
        <section className='mb-12 text-center'>
          <h2 className='mb-4 text-4xl font-extrabold text-gray-900'>Welcome to Our Documentation</h2>
          <p className='max-w-3xl mx-auto mb-8 text-xl text-gray-600'>
            Here you'll find comprehensive guides and documentation to help you start working with our product as quickly as possible, as
            well as support if you get stuck.
          </p>
          <a
            href='#'
            className='inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700'
          >
            Get started
            <ChevronRight className='w-5 h-5 ml-2 -mr-1' aria-hidden='true' />
          </a>
        </section>

        {/* Feature Cards */}
        <section className='mb-12'>
          <h3 className='mb-6 text-2xl font-semibold text-center'>Key Resources</h3>
          <div className='grid gap-6 md:grid-co2 lg:grid-co3'>
            <FeatureCard
              icon={<Book className='w-8 h-8 text-blue-500' />}
              title='Guides'
              description='Step-by-step guides to get you up and running with our product.'
            />
            <FeatureCard
              icon={<Code className='w-8 h-8 text-green-500' />}
              title='API Reference'
              description='Detailed API documentation with examples for each endpoint.'
            />
            <FeatureCard
              icon={<Zap className='w-8 h-8 text-yellow-500' />}
              title='Best Practices'
              description='Learn the best ways to use our product for optimal performance.'
            />
          </div>
        </section>

        {/* Quick Links */}
        <section className='mb-12'>
          <h3 className='mb-6 text-2xl font-semibold text-center'>Quick Links</h3>
          <div className='grid gap-4 md:grid-co2 lg:grid-co4'>
            <QuickLinkCard icon={<Rocket className='w-6 h-6 text-purple-500' />} title='Quick Start' />
            <QuickLinkCard icon={<Users className='w-6 h-6 text-indigo-500' />} title='Authentication' />
            <QuickLinkCard icon={<Globe className='w-6 h-6 text-green-500' />} title='Deployment' />
            <QuickLinkCard icon={<LifeBuoy className='w-6 h-6 text-red-500' />} title='Troubleshooting' />
          </div>
        </section>

        {/* Latest Updates */}
        <section className='mb-12'>
          <h3 className='mb-6 text-2xl font-semibold text-center'>Latest Updates</h3>
          <div className='overflow-hidden bg-white shadow sm:rounded-md'>
            <ul className='divide-y divide-gray-200'>
              {[
                { title: 'New API endpoints added', date: '2023-07-15' },
                { title: 'Performance improvements', date: '2023-07-10' },
                { title: 'Bug fixes and stability enhancements', date: '2023-07-05' },
                { title: 'Updated documentation for v2.0', date: '2023-07-01' },
              ].map((item, index) => (
                <li key={index}>
                  <a href='#' className='block hover:bg-gray-50'>
                    <div className='px-4 py-4 sm:px-6'>
                      <div className='flex items-center justify-between'>
                        <p className='text-sm font-medium text-indigo-600 truncate'>{item.title}</p>
                        <div className='flex flex-shrink-0 ml-2'>
                          <p className='inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full'>
                            {item.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='mt-auto bg-white shadow-sm'>
        <div className='px-4 py-4 mx-auto text-center text-gray-500 max-w-7xl sm:px-6 lg:px-8'>
          <p>&copy; 2023 Your Company Name. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className='p-6 transition duration-300 bg-white rounded-lg shadow-md hover:shadow-lg'>
      {icon}
      <h3 className='mt-4 mb-2 text-xl font-semibold'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
    </div>
  )
}

function QuickLinkCard({ icon, title }) {
  return (
    <a href='#' className='flex items-center p-4 space-x-4 transition duration-300 bg-white rounded-lg shadow-md hover:shadow-lg'>
      {icon}
      <h3 className='text-lg font-semibold'>{title}</h3>
    </a>
  )
}

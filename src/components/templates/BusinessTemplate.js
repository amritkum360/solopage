import { Mail, Phone, MapPin } from 'lucide-react';

// Default data structure for Business template
export const defaultBusinessData = {
  name: 'TechCorp Solutions',
  title: 'Web Development & Consulting Services',
  email: 'contact@techcorp.com',
  phone: '+1 555 123 4567',
  address: 'San Francisco, CA',
  about: 'We are a leading technology company specializing in custom web development, digital consulting, and innovative solutions for businesses of all sizes.',
  linkedin: 'https://linkedin.com/company/techcorp',
  twitter: 'https://twitter.com/techcorp',
  services: 'Web Development, Consulting, Digital Strategy, Cloud Solutions',
  serviceDescriptions: 'Custom websites and web applications built with modern technologies\nExpert advice on technology solutions and digital strategy\nStrategic planning and implementation of digital transformation\nScalable cloud infrastructure and deployment solutions',
  experience: 'Founded in 2018, we have helped over 200+ businesses transform their digital presence',
  team: 'Team of certified professionals with expertise in modern web technologies',
  projects: 'E-commerce Platform for Retail Chain\nCorporate Website for Fortune 500 Company\nMobile App for Healthcare Provider',
  visibility: {
    name: true,
    title: true,
    about: true,
    email: true,
    phone: true,
    address: true,
    linkedin: true,
    twitter: true,
    services: true,
    serviceDescriptions: true,
    experience: true,
    team: true,
    projects: true
  }
};

export default function BusinessTemplate({ data }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-12">
        {data.visibility?.name !== false && (
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.name}</h1>
        )}
        {data.visibility?.title !== false && (
          <p className="text-xl text-gray-600 mb-4">{data.title}</p>
        )}
        {data.visibility?.about !== false && (
          <p className="text-gray-700 max-w-2xl mx-auto">{data.about}</p>
        )}
      </header>

      {/* Contact Info */}
      {(data.visibility?.email !== false || data.visibility?.phone !== false || data.visibility?.address !== false) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {data.visibility?.email !== false && (
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm">{data.email}</span>
            </div>
          )}
          {data.visibility?.phone !== false && (
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
              <Phone className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm">{data.phone}</span>
            </div>
          )}
          {data.visibility?.address !== false && (
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm">{data.address}</span>
            </div>
          )}
        </div>
      )}

      {/* Services */}
      {data.visibility?.services !== false && data.services && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.services.split(',').map((service, index) => {
              const serviceDescriptions = data.serviceDescriptions ? data.serviceDescriptions.split('\n') : [];
              const description = serviceDescriptions[index] || `Professional ${service.trim().toLowerCase()} services tailored to your business needs.`;
              
              return (
                <div key={index} className="p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.trim()}</h3>
                  <p className="text-gray-700">{description.trim()}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Experience & Team */}
      {(data.visibility?.experience !== false || data.visibility?.team !== false) && (data.experience || data.team) && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience & Team</h2>
          <div className="space-y-6">
            {data.visibility?.experience !== false && data.experience && (
              <div className="p-6 bg-green-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Experience</h3>
                <p className="text-gray-700">{data.experience}</p>
              </div>
            )}
            {data.visibility?.team !== false && data.team && (
              <div className="p-6 bg-green-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Team</h3>
                <p className="text-gray-700">{data.team}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.visibility?.projects !== false && data.projects && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Projects</h2>
          <div className="space-y-4">
            {data.projects.split('\n').map((project, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{project.trim()}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About */}
      {data.visibility?.about !== false && data.about && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Us</h2>
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{data.about}</p>
          </div>
        </section>
      )}

      {/* Contact */}
      {(data.visibility?.email !== false || data.visibility?.phone !== false) && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <div className="p-6 bg-blue-50 rounded-lg">
            <p className="text-gray-700 mb-2">Ready to start your project? Contact us today!</p>
            <div className="flex items-center space-x-4">
              {data.visibility?.email !== false && data.email && (
                <a href={`mailto:${data.email}`} className="text-blue-600 hover:text-blue-800">
                  {data.email}
                </a>
              )}
              {data.visibility?.phone !== false && data.phone && (
                <a href={`tel:${data.phone}`} className="text-blue-600 hover:text-blue-800">
                  {data.phone}
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

// Default data structure for Portfolio template
export const defaultPortfolioData = {
  name: 'John Doe',
  title: 'Full Stack Developer',
  email: 'john@example.com',
  phone: '+1 234 567 8900',
  location: 'New York, NY',
  about: 'Passionate developer with 5+ years of experience in web development. I love creating beautiful and functional websites.',
  github: 'https://github.com/johndoe',
  linkedin: 'https://linkedin.com/in/johndoe',
  twitter: 'https://twitter.com/johndoe',
  skills: 'React, Next.js, Node.js, TypeScript, Tailwind CSS',
  experience: 'Senior Developer at TechCorp (2020-Present)\nFull Stack Developer at StartupXYZ (2018-2020)',
  education: 'Bachelor of Computer Science, University of Technology',
  projects: 'E-commerce Platform - Built with Next.js and Stripe\nPortfolio Website - React and Tailwind CSS\nTask Management App - Node.js and MongoDB',
  visibility: {
    name: true,
    title: true,
    about: true,
    email: true,
    phone: true,
    location: true,
    github: true,
    linkedin: true,
    twitter: true,
    skills: true,
    experience: true,
    education: true,
    projects: true
  }
};

export default function PortfolioTemplate({ data }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-8 md:mb-12">
        {data.visibility?.name !== false && (
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{data.name}</h1>
        )}
        {data.visibility?.title !== false && (
          <p className="text-lg md:text-xl text-gray-600 mb-4">{data.title}</p>
        )}
        {data.visibility?.about !== false && (
          <p className="text-gray-700 max-w-2xl mx-auto px-4 md:px-0">{data.about}</p>
        )}
      </header>

      {/* Contact Info - sirf tabhi dikhana jab visibility false na ho */}
      {(data.visibility?.email !== false || data.visibility?.phone !== false || data.visibility?.location !== false) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-12">
          {data.visibility?.email !== false && (
            <div className="flex items-center justify-start md:justify-center p-3 md:p-4 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
              <span className="text-sm truncate">{data.email}</span>
            </div>
          )}
          {data.visibility?.phone !== false && (
            <div className="flex items-center justify-start md:justify-center p-3 md:p-4 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
              <span className="text-sm">{data.phone}</span>
            </div>
          )}
          {data.visibility?.location !== false && (
            <div className="flex items-center justify-start md:justify-center p-3 md:p-4 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
              <span className="text-sm">{data.location}</span>
            </div>
          )}
        </div>
      )}

      {/* Skills */}
      {data.visibility?.skills !== false && data.skills && (
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.split(',').map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {skill.trim()}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.visibility?.experience !== false && data.experience && (
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Experience</h2>
          <div className="space-y-3 md:space-y-4">
            {data.experience.split('\n').map((exp, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{exp}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.visibility?.education !== false && data.education && (
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Education</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{data.education}</p>
          </div>
        </section>
      )}

      {/* Projects */}
      {data.visibility?.projects !== false && data.projects && (
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Projects</h2>
          <div className="space-y-3 md:space-y-4">
            {data.projects.split('\n').map((project, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{project}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Social Links */}
      {(data.visibility?.github !== false || data.visibility?.linkedin !== false || data.visibility?.twitter !== false) && (
        <footer className="text-center pt-4 md:pt-8">
          <div className="flex justify-center space-x-6">
            {data.visibility?.github !== false && data.github && (
              <a 
                href={data.github} 
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6 md:h-7 md:w-7" />
              </a>
            )}
            {data.visibility?.linkedin !== false && data.linkedin && (
              <a 
                href={data.linkedin} 
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6 md:h-7 md:w-7" />
              </a>
            )}
            {data.visibility?.twitter !== false && data.twitter && (
              <a 
                href={data.twitter} 
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-100"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6 md:h-7 md:w-7" />
              </a>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
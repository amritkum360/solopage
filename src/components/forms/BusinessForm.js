import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function BusinessForm({ data = {}, onInputChange, onToggleVisibility }) {
  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-50 px-4 py-3 text-left text-sm font-medium text-blue-900 hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
              <span>Basic Information</span>
              <ChevronDownIcon
                className={`${
                  open ? 'transform rotate-180' : ''
                } w-5 h-5 text-blue-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pb-4 pt-2 text-sm text-gray-500">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('name')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.name === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={data?.name || ''}
                    onChange={(e) => onInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Tagline</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('title')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.title === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={data?.title || ''}
                    onChange={(e) => onInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">About</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('about')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.about === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <textarea
                    value={data?.about || ''}
                    onChange={(e) => onInputChange('about', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Contact Information */}
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-green-50 px-4 py-3 text-left text-sm font-medium text-green-900 hover:bg-green-100 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75">
              <span>Contact Information</span>
              <ChevronDownIcon
                className={`${
                  open ? 'transform rotate-180' : ''
                } w-5 h-5 text-green-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pb-4 pt-2 text-sm text-gray-500">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('email')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.email === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <input
                    type="email"
                    value={data?.email || ''}
                    onChange={(e) => onInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('phone')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.phone === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <input
                    type="tel"
                    value={data?.phone || ''}
                    onChange={(e) => onInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('address')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.address === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <textarea
                    value={data?.address || ''}
                    onChange={(e) => onInputChange('address', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Services & Experience */}
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-50 px-4 py-3 text-left text-sm font-medium text-purple-900 hover:bg-purple-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
              <span>Services & Experience</span>
              <ChevronDownIcon
                className={`${
                  open ? 'transform rotate-180' : ''
                } w-5 h-5 text-purple-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pb-4 pt-2 text-sm text-gray-500">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Services</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('services')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.services === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <textarea
                    value={data?.services || ''}
                    onChange={(e) => onInputChange('services', e.target.value)}
                    rows={3}
                    placeholder="e.g., Web Development, Consulting, Digital Strategy, Cloud Solutions"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Service Descriptions</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('serviceDescriptions')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.serviceDescriptions === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <textarea
                    value={data?.serviceDescriptions || ''}
                    onChange={(e) => onInputChange('serviceDescriptions', e.target.value)}
                    rows={4}
                    placeholder="Custom websites and web applications built with modern technologies\nExpert advice on technology solutions and digital strategy\nStrategic planning and implementation of digital transformation\nScalable cloud infrastructure and deployment solutions"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Make sure the descriptions match the order of your services above</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('experience')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.experience === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <textarea
                    value={data?.experience || ''}
                    onChange={(e) => onInputChange('experience', e.target.value)}
                    rows={3}
                    placeholder="e.g., Founded in 2018, we have helped over 200+ businesses transform their digital presence"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Team</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('team')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.team === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <textarea
                    value={data?.team || ''}
                    onChange={(e) => onInputChange('team', e.target.value)}
                    rows={2}
                    placeholder="e.g., Team of certified professionals with expertise in modern web technologies"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Projects</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('projects')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.projects === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <textarea
                    value={data?.projects || ''}
                    onChange={(e) => onInputChange('projects', e.target.value)}
                    rows={4}
                    placeholder="List your key projects (one per line)&#10;e.g.,&#10;E-commerce Platform for Retail Chain&#10;Corporate Website for Fortune 500 Company&#10;Mobile App for Healthcare Provider"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Social Links */}
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-orange-50 px-4 py-3 text-left text-sm font-medium text-orange-900 hover:bg-orange-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-75">
              <span>Social Links</span>
              <ChevronDownIcon
                className={`${
                  open ? 'transform rotate-180' : ''
                } w-5 h-5 text-orange-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pb-4 pt-2 text-sm text-gray-500">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('linkedin')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.linkedin === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <input
                    type="url"
                    value={data?.linkedin || ''}
                    onChange={(e) => onInputChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Twitter</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('twitter')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.twitter === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <input
                    type="url"
                    value={data?.twitter || ''}
                    onChange={(e) => onInputChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/yourcompany"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
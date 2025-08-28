import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import ImageUpload from '@/components/ImageUpload';
import Image from 'next/image';

export default function LocalBusinessForm({ data = {}, onInputChange, onToggleVisibility }) {
  // Ensure products array exists
  const products = data?.products || [];
  
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    onInputChange('products', updatedProducts);
  };

  const addProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: '',
      price: '',
      image: ''
    };
    onInputChange('products', [...products, newProduct]);
  };

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    onInputChange('products', updatedProducts);
  };

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <Disclosure defaultOpen>
        {({ open }) => (
          <div>
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
                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
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
                    value={data.name}
                    onChange={(e) => onInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('owner')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.owner === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={data.owner}
                    onChange={(e) => onInputChange('owner', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">About Business</label>
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
                    value={data.about}
                    onChange={(e) => onInputChange('about', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Business Logo/Image</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('profileImage')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.profileImage === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <ImageUpload
                    value={data.profileImage}
                    onChange={(value) => onInputChange('profileImage', value)}
                    label="Business Logo/Image"
                  />
                </div>
              </div>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
  
      {/* Hero Section */}
      <Disclosure>
        {({ open }) => (
         <div> <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-50 px-4 py-3 text-left text-sm font-medium text-purple-900 hover:bg-purple-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
              <span>Hero Section</span>
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
                    <label className="block text-sm font-medium text-gray-700">Hero Title</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('heroTitle')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.heroTitle === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={data.heroTitle}
                    onChange={(e) => onInputChange('heroTitle', e.target.value)}
                    placeholder="e.g., Quality Products & Services"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Hero Subtitle</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('heroSubtitle')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.heroSubtitle === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={data.heroSubtitle}
                    onChange={(e) => onInputChange('heroSubtitle', e.target.value)}
                    placeholder="e.g., For Better Solutions"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Hero Description</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('heroDescription')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.heroDescription === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <textarea
                    value={data.heroDescription}
                    onChange={(e) => onInputChange('heroDescription', e.target.value)}
                    rows={3}
                    placeholder="A compelling description about your business that will attract customers."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Hero Background Image</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('heroBackgroundImage')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.heroBackgroundImage === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <ImageUpload
                    value={data.heroBackgroundImage}
                    onChange={(value) => onInputChange('heroBackgroundImage', value)}
                    label="Hero Background Image"
                  />
                  {data.heroBackgroundImage && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Background Preview:</p>
                      <Image
                        src={data.heroBackgroundImage} 
                        alt="Hero Background"
                        className="w-full h-20 object-cover rounded border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div className="hidden w-full h-20 bg-gray-200 rounded border flex items-center justify-center">
                        <span className="text-xs text-gray-500">Error loading image</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Disclosure.Panel>
          </></div>
        )}
      </Disclosure>
  
      {/* Contact Information */}
      <Disclosure>
        {({ open }) => (
          <div>
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
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
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
                    value={data.phone}
                    onChange={(e) => onInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('location')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.location === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={data.location}
                    onChange={(e) => onInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Business Hours</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleVisibility('businessHours')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {data?.visibility?.businessHours === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={data.businessHours}
                    onChange={(e) => onInputChange('businessHours', e.target.value)}
                    placeholder="e.g., Monday - Sunday: 9:00 AM - 6:00 PM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </Disclosure.Panel>
          </>
          </div>
        )}
      </Disclosure>
 
  
     {/* Experience & Certification */}
<Disclosure>
  {({ open }) => (
    <div>
    <>
      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-yellow-50 px-4 py-3 text-left text-sm font-medium text-yellow-900 hover:bg-yellow-100 focus:outline-none focus-visible:ring focus-visible:ring-yellow-500 focus-visible:ring-opacity-75">
        <span>Experience & Certification</span>
        <ChevronDownIcon
          className={`${
            open ? 'transform rotate-180' : ''
          } w-5 h-5 text-yellow-500`}
        />
      </Disclosure.Button>
      <Disclosure.Panel className="px-4 pb-4 pt-2 text-sm text-gray-500">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
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
            <input
              type="text"
              value={data.experience}
              onChange={(e) => onInputChange('experience', e.target.value)}
              placeholder="e.g., 10+ Years in Industry"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Certifications</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('certification')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.certification === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="text"
              value={data.certification}
              onChange={(e) => onInputChange('certification', e.target.value)}
              placeholder="e.g., ISO Certified, Award Winner"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Disclosure.Panel>
    </></div>
  )}
</Disclosure>

{/* Products/Services */}
<Disclosure>
  {({ open }) => (
   <div> <>
      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-red-50 px-4 py-3 text-left text-sm font-medium text-red-900 hover:bg-red-100 focus:outline-none focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-opacity-75">
        <span>Products/Services</span>
        <ChevronDownIcon
          className={`${
            open ? 'transform rotate-180' : ''
          } w-5 h-5 text-red-500`}
        />
      </Disclosure.Button>
      <Disclosure.Panel className="px-4 pb-4 pt-2 text-sm text-gray-500">
        <div className="space-y-6">
          {products.map((product, index) => (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">Product/Service #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleProductVisibility(index, 'name')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {product?.visibility?.name === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                    placeholder="e.g., Premium Service"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleProductVisibility(index, 'price')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {product?.visibility?.price === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={product.price}
                    onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                    placeholder="e.g., ₹1,000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                    <button 
                      type="button" 
                      onClick={() => onToggleProductVisibility(index, 'image')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {product?.visibility?.image === false ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <ImageUpload
                    value={product.image}
                    onChange={(value) => handleProductChange(index, 'image', value)}
                    label={`Product ${index + 1} Image`}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addProduct}
            className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
          >
            + Add New Product/Service
          </button>
        </div>
      </Disclosure.Panel>
    </></div>
  )}
</Disclosure>

{/* About Section */}
<Disclosure>
  {({ open }) => (
    <div><>
      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-indigo-50 px-4 py-3 text-left text-sm font-medium text-indigo-900 hover:bg-indigo-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
        <span>About Section</span>
        <ChevronDownIcon
          className={`${
            open ? 'transform rotate-180' : ''
          } w-5 h-5 text-indigo-500`}
        />
      </Disclosure.Button>
      <Disclosure.Panel className="px-4 pb-4 pt-2 text-sm text-gray-500">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">About Title</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('aboutTitle')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.aboutTitle === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="text"
              value={data.aboutTitle}
              onChange={(e) => onInputChange('aboutTitle', e.target.value)}
              placeholder="e.g., About Our Business"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">About Subtitle</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('aboutSubtitle')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.aboutSubtitle === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="text"
              value={data.aboutSubtitle}
              onChange={(e) => onInputChange('aboutSubtitle', e.target.value)}
              placeholder="e.g., Your trusted partner in [industry]"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">About Description</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('aboutDescription')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.aboutDescription === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <textarea
              value={data.aboutDescription}
              onChange={(e) => onInputChange('aboutDescription', e.target.value)}
              rows={4}
              placeholder="Detailed description about your business, experience, and commitment to customers."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Disclosure.Panel>
    </>
    </div>
  )}
</Disclosure>


      {/* Services */}
{/* Services */}
<Disclosure>
  {({ open }) => (
    <div><>
      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-50 px-4 py-3 text-left text-sm font-medium text-purple-900 hover:bg-purple-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
        <span>Services Offered</span>
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
              <label className="block text-sm font-medium text-gray-700">Services (One per line)</label>
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
              value={data.services}
              onChange={(e) => onInputChange('services', e.target.value)}
              rows={4}
              placeholder="Service 1&#10;Service 2&#10;Service 3&#10;Service 4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Enter each service on a new line</p>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Speciality/Unique Selling Point</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('speciality')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.speciality === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <textarea
              value={data.speciality}
              onChange={(e) => onInputChange('speciality', e.target.value)}
              rows={3}
              placeholder="What makes your business special?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Disclosure.Panel>
    </>
    </div>
  )}
</Disclosure>

{/* Contact Section */}
<Disclosure>
  {({ open }) => (
    <div><>
      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-teal-50 px-4 py-3 text-left text-sm font-medium text-teal-900 hover:bg-teal-100 focus:outline-none focus-visible:ring focus-visible:ring-teal-500 focus-visible:ring-opacity-75">
        <span>Contact Section</span>
        <ChevronDownIcon
          className={`${
            open ? 'transform rotate-180' : ''
          } w-5 h-5 text-teal-500`}
        />
      </Disclosure.Button>
      <Disclosure.Panel className="px-4 pb-4 pt-2 text-sm text-gray-500">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Contact Title</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('contactTitle')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.contactTitle === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="text"
              value={data.contactTitle}
              onChange={(e) => onInputChange('contactTitle', e.target.value)}
              placeholder="e.g., Contact Us"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Contact Subtitle</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('contactSubtitle')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.contactSubtitle === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="text"
              value={data.contactSubtitle}
              onChange={(e) => onInputChange('contactSubtitle', e.target.value)}
              placeholder="e.g., Get in touch for the best solutions"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Webhook URL (for form submissions)</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('webhookUrl')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.webhookUrl === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="url"
              value={data.webhookUrl}
              onChange={(e) => onInputChange('webhookUrl', e.target.value)}
              placeholder="https://your-webhook-url.com/webhook"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to use default webhook</p>
          </div>
        </div>
      </Disclosure.Panel>
    </></div>
  )}
</Disclosure>

{/* Social Media Section */}
<Disclosure>
  {({ open }) => (
   <div> <>
      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-pink-50 px-4 py-3 text-left text-sm font-medium text-pink-900 hover:bg-pink-100 focus:outline-none focus-visible:ring focus-visible:ring-pink-500 focus-visible:ring-opacity-75">
        <span>Social Media Section</span>
        <ChevronDownIcon
          className={`${
            open ? 'transform rotate-180' : ''
          } w-5 h-5 text-pink-500`}
        />
      </Disclosure.Button>
      <Disclosure.Panel className="px-4 pb-4 pt-2 text-sm text-gray-500">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Social Media Title</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('socialTitle')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.socialTitle === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="text"
              value={data.socialTitle}
              onChange={(e) => onInputChange('socialTitle', e.target.value)}
              placeholder="e.g., Follow Us on Social Media"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Social Media Subtitle</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('socialSubtitle')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.socialSubtitle === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="text"
              value={data.socialSubtitle}
              onChange={(e) => onInputChange('socialSubtitle', e.target.value)}
              placeholder="e.g., Stay updated with our latest products, tips, and special offers"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Instagram Description</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('instagramDescription')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.instagramDescription === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <textarea
              value={data.instagramDescription}
              onChange={(e) => onInputChange('instagramDescription', e.target.value)}
              rows={2}
              placeholder="e.g., Follow us for daily updates, product photos, and expert tips"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Facebook Description</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('facebookDescription')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.facebookDescription === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <textarea
              value={data.facebookDescription}
              onChange={(e) => onInputChange('facebookDescription', e.target.value)}
              rows={2}
              placeholder="e.g., Connect with us for community updates and customer support"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Instagram Button Text</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('instagramButtonText')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.instagramButtonText === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="text"
              value={data.instagramButtonText}
              onChange={(e) => onInputChange('instagramButtonText', e.target.value)}
              placeholder="e.g., Follow @your_handle"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Facebook Button Text</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('facebookButtonText')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.facebookButtonText === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="text"
              value={data.facebookButtonText}
              onChange={(e) => onInputChange('facebookButtonText', e.target.value)}
              placeholder="e.g., Like Our Page"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Benefits Title</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('socialBenefitsTitle')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.socialBenefitsTitle === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="text"
              value={data.socialBenefitsTitle}
              onChange={(e) => onInputChange('socialBenefitsTitle', e.target.value)}
              placeholder="e.g., Why Follow Us?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Benefit 1</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('socialBenefit1')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.socialBenefit1 === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="text"
              value={data.socialBenefit1}
              onChange={(e) => onInputChange('socialBenefit1', e.target.value)}
              placeholder="e.g., Daily product updates and availability"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Benefit 2</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('socialBenefit2')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.socialBenefit2 === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="text"
              value={data.socialBenefit2}
              onChange={(e) => onInputChange('socialBenefit2', e.target.value)}
              placeholder="e.g., Expert tips and advice"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Benefit 3</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('socialBenefit3')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.socialBenefit3 === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="text"
              value={data.socialBenefit3}
              onChange={(e) => onInputChange('socialBenefit3', e.target.value)}
              placeholder="e.g., Special offers and discounts"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Disclosure.Panel>
    </></div>
  )}
</Disclosure>

{/* Social Links */}
<Disclosure>
  {({ open }) => (
  <div>  <>
      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-orange-50 px-4 py-3 text-left text-sm font-medium text-orange-900 hover:bg-orange-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-75">
        <span>Social Media Links</span>
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
              <label className="block text-sm font-medium text-gray-700">WhatsApp Link</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('whatsapp')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.whatsapp === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="url"
              value={data.whatsapp}
              onChange={(e) => onInputChange('whatsapp', e.target.value)}
              placeholder="https://wa.me/your-number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Instagram Profile</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('instagram')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.instagram === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="url"
              value={data.instagram}
              onChange={(e) => onInputChange('instagram', e.target.value)}
              placeholder="https://instagram.com/your-profile"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Facebook Page</label>
              <button 
                type="button" 
                onClick={() => onToggleVisibility('facebook')}
                className="text-gray-500 hover:text-gray-700"
              >
                {data?.visibility?.facebook === false ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <input
              type="url"
              value={data.facebook}
              onChange={(e) => onInputChange('facebook', e.target.value)}
              placeholder="https://facebook.com/your-page"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Disclosure.Panel>
    </></div>
  )}
</Disclosure>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { User, Phone, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';

// Default data structure for Business template
export const defaultLocalBusinessData = {
  name: 'Your Business Name',
  owner: 'Business Owner Name',
  phone: 'Your Phone Number',
  location: 'Your Business Location',
  about: 'Tell customers about your business, your experience, and what makes you special.',
  profileImage: '',
  instagram: 'https://instagram.com/your-profile',
  facebook: 'https://facebook.com/your-page',
  whatsapp: 'https://wa.me/your-number',
  experience: 'Years of Experience in Your Industry',
  certification: 'Your Certifications or Awards',
  services: 'Service 1\nService 2\nService 3\nService 4',
  businessHours: 'Monday - Sunday: 9:00 AM - 6:00 PM',
  speciality: 'What makes your business unique and special',
  heroTitle: 'Your Main Business Title',
  heroSubtitle: 'Your Business Subtitle or Tagline',
  heroDescription: 'A compelling description about your business that will attract customers.',
  heroBackgroundImage: '',
  products: [
    { id: 1, name: 'Product/Service 1', price: '₹Price', image: '/products/product1.jpg' },
    { id: 2, name: 'Product/Service 2', price: '₹Price', image: '/products/product2.jpg' },
    { id: 3, name: 'Product/Service 3', price: '₹Price', image: '/products/product3.jpg' }
  ],
  aboutTitle: 'About Our Business',
  aboutSubtitle: 'Your trusted partner in [industry]',
  aboutDescription: 'Detailed description about your business, experience, and commitment to customers.',
  contactTitle: 'Contact Us',
  contactSubtitle: 'Get in touch for the best solutions',
  webhookUrl: 'https://your-webhook-url.com/webhook',
  socialTitle: 'Follow Us on Social Media',
  socialSubtitle: 'Stay updated with our latest products, tips, and special offers',
  instagramDescription: 'Follow us for daily updates, product photos, and expert tips',
  facebookDescription: 'Connect with us for community updates and customer support',
  instagramButtonText: 'Follow @your_handle',
  facebookButtonText: 'Like Our Page',
  socialBenefitsTitle: 'Why Follow Us?',
  socialBenefit1: 'Daily product updates and availability',
  socialBenefit2: 'Expert tips and advice',
  socialBenefit3: 'Special offers and discounts',
  visibility: {
    name: true,
    owner: true,
    phone: true,
    location: true,
    about: true,
    profileImage: true,
    instagram: true,
    facebook: true,
    whatsapp: true,
    experience: true,
    certification: true,
    services: true,
    businessHours: true,
    speciality: true,
    heroTitle: true,
    heroSubtitle: true,
    heroDescription: true,
    heroBackgroundImage: true,
    products: true,
    aboutTitle: true,
    aboutSubtitle: true,
    aboutDescription: true,
    contactTitle: true,
    contactSubtitle: true,
    socialTitle: true,
    socialSubtitle: true,
    instagramDescription: true,
    facebookDescription: true,
    instagramButtonText: true,
    facebookButtonText: true,
    socialBenefitsTitle: true,
    socialBenefit1: true,
    socialBenefit2: true,
    socialBenefit3: true
  }
};

export default function LocalBusinessTemplate({ data }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hello! I'm interested in your ${data.name} services.`);
    window.open(`https://wa.me/${data.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${data.phone}`, '_self');
  };

  const handleInstagram = () => {
    window.open(data.instagram, '_blank');
  };

  const handleFacebook = () => {
    window.open(data.facebook, '_blank');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const formDataObj = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      message: formData.get('message'),
      timestamp: new Date().toISOString(),
      source: `${data.name} Website`
    };

    try {
      const response = await fetch(data.webhookUrl || 'https://your-webhook-url.com/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObj)
      });

      if (response.ok) {
        alert('Thank you! Your message has been sent successfully. We will contact you soon.');
        e.target.reset();
      } else {
        alert('Sorry, there was an error sending your message. Please try again or call us directly.');
      }
    } catch (error) {
      console.error('Error sending form:', error);
      alert('Sorry, there was an error sending your message. Please try again or call us directly.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      {/* Sticky Social Media Bar */}
      {(data.visibility?.instagram !== false || data.visibility?.facebook !== false || data.visibility?.whatsapp !== false) && (
        <div className="fixed right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-500">
          <div className="flex flex-col space-y-2 md:space-y-4">
            {data.visibility?.instagram !== false && (
              <button 
                onClick={handleInstagram}
                className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </button>
            )}
            
            {data.visibility?.facebook !== false && (
              <button 
                onClick={handleFacebook}
                className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse"
                aria-label="Like us on Facebook"
              >
                <Facebook className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </button>
            )}
            
            {data.visibility?.whatsapp !== false && (
              <button 
                onClick={handleWhatsApp}
                className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse"
                aria-label="Contact us on WhatsApp"
              >
                <MessageCircle className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sticky Phone Number */}
      {data.visibility?.phone !== false && (
        <div className={`fixed bottom-4 right-4 z-50 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[100px] opacity-0'}`}>
          <div className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full shadow-2xl flex items-center space-x-2 md:space-x-3 animate-pulse">
            <Phone className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-bold text-sm md:text-lg">{data.phone}</span>
          </div>
        </div>
      )}

      {/* Header */}
      {(data.visibility?.name !== false || data.visibility?.profileImage !== false || data.visibility?.experience !== false) && (
        <header className="bg-white/90 backdrop-blur-md shadow-xl sticky top-0 z-40" role="banner">
          <div className="container mx-auto px-4 py-2 md:py-4">
            <div className="flex items-center justify-between">
              {/* Left Side */}
              <div className="flex items-center space-x-2 md:space-x-4">
                {data.visibility?.profileImage !== false && (
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                    {data.profileImage ? (
                      <img src={`http://localhost:5000${data.profileImage}`} alt={data.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <User className="h-8 w-8 text-white" />
                    )}
                  </div>
                )}
                <div>
                  {data.visibility?.name !== false && (
                    <h1 className="text-sm md:text-xl lg:text-3xl font-bold text-gray-800 leading-tight">{data.name}</h1>
                  )}
                  {data.visibility?.experience !== false && (
                    <p className="text-xs md:text-sm text-gray-600 font-semibold">{data.experience}</p>
                  )}
                </div>
              </div>

              {/* Right Side - Show on all screens */}
              <div className="flex space-x-2 md:space-x-4">
                {data.visibility?.whatsapp !== false && (
                  <button 
                    onClick={handleWhatsApp}
                    className="bg-green-500 text-white px-3 py-2 md:px-6 md:py-3 rounded-full font-semibold hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-1 md:space-x-2"
                  >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                    <span>WhatsApp</span>
                  </button>
                )}
                {data.visibility?.phone !== false && (
                  <button 
                    onClick={handleCall}
                    className="bg-blue-500 text-white px-3 py-2 md:px-6 md:py-3 rounded-full font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-1 md:space-x-2"
                  >
                    <Phone className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Call Now</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Hero Section */}
      {(data.visibility?.heroTitle !== false || data.visibility?.heroSubtitle !== false || data.visibility?.heroDescription !== false) && (
        <section className="relative py-12 md:py-20 px-4 overflow-hidden" role="banner" aria-label="Hero Section">
          {data.visibility?.heroBackgroundImage !== false && data.heroBackgroundImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(http://localhost:5000${data.heroBackgroundImage})` }}
            />
          )}
          <div className={`absolute inset-0 ${data.heroBackgroundImage ? 'bg-black/40' : 'bg-gradient-to-r from-blue-600/20 to-purple-600/20'}`}></div>
          <div className="container mx-auto text-center relative z-10">
            <div className="max-w-5xl mx-auto">
              {data.visibility?.heroTitle !== false && data.visibility?.heroSubtitle !== false && (
                <h2 className="text-3xl md:text-6xl lg:text-7xl font-bold text-white mb-6 md:mb-8 leading-tight">
                  {data.heroTitle}
                  <span className="text-orange-500 block">{data.heroSubtitle}</span>
                </h2>
              )}
              {data.visibility?.heroDescription !== false && (
                <p className="text-lg md:text-2xl text-white mb-8 md:mb-12 leading-relaxed">
                  {data.heroDescription}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                {data.visibility?.whatsapp !== false && (
                  <button 
                    onClick={handleWhatsApp}
                    className="bg-green-500 text-white px-6 md:px-10 py-3 md:py-4 rounded-full font-bold text-lg md:text-xl hover:bg-green-600 transition-all duration-300 shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 flex items-center justify-center space-x-2 md:space-x-3"
                  >
                    <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                    <span>WhatsApp Us</span>
                  </button>
                )}
                {data.visibility?.phone !== false && (
                  <button 
                    onClick={handleCall}
                    className="bg-blue-500 text-white px-6 md:px-10 py-3 md:py-4 rounded-full font-bold text-lg md:text-xl hover:bg-blue-600 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 flex items-center justify-center space-x-2 md:space-x-3"
                  >
                    <Phone className="w-5 h-5 md:w-6 md:h-6" />
                    <span>Call Now</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products/Services Section */}
      {data.visibility?.products !== false && data.products && data.products.length > 0 && (
        <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-blue-50 to-white" role="region" aria-label="Products">
          <div className="container mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6">Our Products & Services</h2>
              <p className="text-lg md:text-2xl text-gray-700 font-medium">Choose the perfect solution for your needs</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 justify-items-center max-w-6xl mx-auto">
              {data.products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 w-full max-w-[320px]">
                  <div className="h-48 md:h-72 overflow-hidden flex justify-center bg-gray-50">
                    <img 
                      src={`http://localhost:5000${product.image}`} 
                      alt={product.name}
                      className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl md:text-2xl font-bold text-blue-500">{product.price}</span>
                      <div className="flex space-x-2">
                        {data.visibility?.whatsapp !== false && (
                          <button 
                            onClick={handleWhatsApp}
                            className="w-8 h-8 md:w-10 md:h-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-md flex items-center justify-center"
                          >
                            <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        )}
                        {data.visibility?.phone !== false && (
                          <button 
                            onClick={handleCall}
                            className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md flex items-center justify-center"
                          >
                            <Phone className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {(data.visibility?.aboutTitle !== false || data.visibility?.aboutSubtitle !== false || data.visibility?.aboutDescription !== false || data.visibility?.services !== false) && (
        <section className="py-12 md:py-20 px-4 bg-gradient-to-r from-purple-50 to-pink-50" role="region" aria-label="About Us">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 md:mb-16">
                {data.visibility?.aboutTitle !== false && (
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6">{data.aboutTitle}</h2>
                )}
                {data.visibility?.aboutSubtitle !== false && (
                  <p className="text-lg md:text-2xl text-gray-600">{data.aboutSubtitle}</p>
                )}
              </div>
              <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">Our Story</h3>
                  {data.visibility?.aboutDescription !== false && (
                    <p className="text-base md:text-xl text-gray-700 mb-6 md:mb-8 leading-relaxed">
                      {data.aboutDescription}
                    </p>
                  )}
                  <div className="space-y-4 md:space-y-6">
                    {data.visibility?.experience !== false && (
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg md:text-xl">✓</span>
                        </div>
                        <span className="text-base md:text-xl text-gray-700 font-semibold">{data.experience}</span>
                      </div>
                    )}
                    {data.visibility?.certification !== false && (
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg md:text-xl">✓</span>
                        </div>
                        <span className="text-base md:text-xl text-gray-700 font-semibold">{data.certification}</span>
                      </div>
                    )}
                  </div>
                </div>
                {data.visibility?.services !== false && (
                  <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl">
                    <h4 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Our Services</h4>
                    <div className="space-y-3 md:space-y-4 text-base md:text-lg text-gray-700">
                      {data.services.split('\n').map((service, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <span className="text-blue-600 font-bold text-lg md:text-xl">•</span>
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Social Media Section */}
      {(data.visibility?.socialTitle !== false || data.visibility?.socialSubtitle !== false || data.visibility?.instagram !== false || data.visibility?.facebook !== false) && (
        <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-white to-blue-50" role="region" aria-label="Social Media">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              {data.visibility?.socialTitle !== false && (
                <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6">{data.socialTitle}</h2>
              )}
              {data.visibility?.socialSubtitle !== false && (
                <p className="text-lg md:text-2xl text-gray-600 mb-8 md:mb-12">{data.socialSubtitle}</p>
              )}
              
              <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto">
                {data.visibility?.instagram !== false && (
                  <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-6 md:p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.40-1.439-1.40z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Instagram</h3>
                    {data.visibility?.instagramDescription !== false && (
                      <p className="text-white/90 mb-4 md:mb-6 text-sm md:text-base">{data.instagramDescription}</p>
                    )}
                    <button 
                      onClick={handleInstagram}
                      className="bg-white text-pink-600 px-6 md:px-8 py-2 md:py-3 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
                    >
                      {data.instagramButtonText}
                    </button>
                  </div>
                )}
                
                {data.visibility?.facebook !== false && (
                  <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 md:p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Facebook</h3>
                    {data.visibility?.facebookDescription !== false && (
                      <p className="text-white/90 mb-4 md:mb-6 text-sm md:text-base">{data.facebookDescription}</p>
                    )}
                    <button 
                      onClick={handleFacebook}
                      className="bg-white text-blue-600 px-6 md:px-8 py-2 md:py-3 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
                    >
                      {data.facebookButtonText}
                    </button>
                  </div>
                )}
              </div>
              
              {(data.visibility?.socialBenefitsTitle !== false || data.visibility?.socialBenefit1 !== false || data.visibility?.socialBenefit2 !== false || data.visibility?.socialBenefit3 !== false) && (
                <div className="mt-8 md:mt-12 p-6 md:p-8 bg-white rounded-3xl shadow-xl">
                  {data.visibility?.socialBenefitsTitle !== false && (
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">{data.socialBenefitsTitle}</h3>
                  )}
                  <div className="grid md:grid-cols-3 gap-4 md:gap-6 text-base md:text-lg text-gray-700">
                    {data.visibility?.socialBenefit1 !== false && (
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-600 font-bold text-xl md:text-2xl">📱</span>
                        <span>{data.socialBenefit1}</span>
                      </div>
                    )}
                    {data.visibility?.socialBenefit2 !== false && (
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-600 font-bold text-xl md:text-2xl">💡</span>
                        <span>{data.socialBenefit2}</span>
                      </div>
                    )}
                    {data.visibility?.socialBenefit3 !== false && (
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-600 font-bold text-xl md:text-2xl">🎯</span>
                        <span>{data.socialBenefit3}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {(data.visibility?.contactTitle !== false || data.visibility?.contactSubtitle !== false || data.visibility?.location !== false || data.visibility?.phone !== false || data.visibility?.businessHours !== false) && (
        <section className="py-12 md:py-20 px-4 bg-white" role="region" aria-label="Contact Information">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 md:mb-16">
                {data.visibility?.contactTitle !== false && (
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6">{data.contactTitle}</h2>
                )}
                {data.visibility?.contactSubtitle !== false && (
                  <p className="text-lg md:text-2xl text-gray-600">{data.contactSubtitle}</p>
                )}
              </div>
              <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">Get In Touch</h3>
                  <div className="space-y-6 md:space-y-8">
                    {data.visibility?.location !== false && (
                      <div className="flex items-center space-x-4 md:space-x-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <MapPin className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg md:text-xl font-bold text-gray-800">Location</h4>
                          <p className="text-base md:text-lg text-gray-600">{data.location}</p>
                        </div>
                      </div>
                    )}
                    {data.visibility?.phone !== false && (
                      <div className="flex items-center space-x-4 md:space-x-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <Phone className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg md:text-xl font-bold text-gray-800">Phone Numbers</h4>
                          <p className="text-base md:text-lg text-gray-600 font-semibold">{data.phone}</p>
                          {data.visibility?.owner !== false && (
                            <p className="text-sm md:text-base text-gray-500">{data.owner}</p>
                          )}
                        </div>
                      </div>
                    )}
                    {data.visibility?.businessHours !== false && (
                      <div className="flex items-center space-x-4 md:space-x-6">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg md:text-xl">🕒</span>
                        </div>
                        <div>
                          <h4 className="text-lg md:text-xl font-bold text-gray-800">Business Hours</h4>
                          <p className="text-base md:text-lg text-gray-600">{data.businessHours}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Contact Form */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 md:p-8 rounded-3xl shadow-xl">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">Send us a Message</h3>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        name="message"
                        rows={4}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    
      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 md:py-12" role="contentinfo">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 md:mb-8">
          {data.visibility?.name !== false && (
            <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">{data.name}</h3>
          )}
          {data.visibility?.speciality !== false && (
            <p className="text-lg md:text-xl text-gray-300">{data.speciality}</p>
          )}
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-8 lg:space-x-12 mb-6 md:mb-8 text-base md:text-lg">
          {data.visibility?.location !== false && (
            <span className="text-gray-300">📍 {data.location}</span>
          )}
          {data.visibility?.phone !== false && (
            <span className="text-gray-300">📞 Phone: {data.phone} ({data.owner})</span>
          )}
          {data.visibility?.experience !== false && (
            <span className="text-gray-300">⭐ {data.experience}</span>
          )}
          </div>
          
          <div className="flex justify-center space-x-4 md:space-x-6 mb-6 md:mb-8">
          {data.visibility?.instagram !== false && (
            <button 
              onClick={handleInstagram}
              className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Follow us on Instagram"
            > 
              <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          )}
          {data.visibility?.facebook !== false && (
            <button 
              onClick={handleFacebook}
              className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Like us on Facebook"
            >
              <Facebook className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          )}
          {data.visibility?.whatsapp !== false && (
            <button 
              onClick={handleWhatsApp}
              className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
              aria-label="Contact us on WhatsApp"
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          )}
          </div>
          
          <div className="border-t border-gray-700 pt-6 md:pt-8">
          {data.visibility?.name !== false && (
            <p className="text-gray-400 text-base md:text-lg">&copy; 2024 {data.name}. All rights reserved.</p>
          )}
            </div>
        </div>
      </footer>
    </div>
  );
}

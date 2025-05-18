function About() {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About ElectroHub</h1>
          
          {/* Company Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2025, ElectroHub has grown from a small local shop to one of the leading electronics retailers. Our mission is to provide customers with the latest technology products while delivering exceptional service and expertise.
            </p>
            <p className="text-gray-600">
              We believe in making technology accessible to everyone and helping our customers find the perfect products for their needs. Our team of experts is always ready to provide guidance and support.
            </p>
          </section>
  
          {/* Values */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Quality</h3>
                <p className="text-gray-600">We offer only the best products from trusted brands.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">Staying ahead with the latest technology trends.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Customer First</h3>
                <p className="text-gray-600">Your satisfaction is our top priority.</p>
              </div>
            </div>
          </section>
  
          {/* Team */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <img
                  src="vijay.jpg"
                  alt="CEO"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">Vijay Prajapati</h3>
                <p className="text-gray-600">CEO</p>
              </div>
              <div className="text-center">
                <img
                  src="bhavin.jpg"
                  alt="CTO"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">Bhavin Vaghela</h3>
                <p className="text-gray-600">CTO</p>
              </div>
              <div className="text-center">
                <img
                  src="aryan.jpg"
                  alt="COO"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold">Aryan Solanki</h3>
                <p className="text-gray-600">COO</p>
              </div>
            </div>
          </section>
  
          {/* Why Choose Us */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-primary text-white p-3 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
                  <p className="text-gray-600">Our knowledgeable team is here to help you make informed decisions.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary text-white p-3 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                  <p className="text-gray-600">Quick and reliable shipping to get your products to you faster.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary text-white p-3 rounded-full">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
                  <p className="text-gray-600">Your security is our priority with safe and encrypted transactions.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
  
  export default About;
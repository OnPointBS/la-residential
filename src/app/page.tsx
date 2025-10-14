import { FeaturedHomes } from "@/components/public/featured-homes";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        {/* Enhanced Background with Multiple Construction Images */}
        <div className="absolute inset-0 w-full h-full">
          {/* Parallax background with multiple construction images */}
          <div className="relative w-full h-full overflow-hidden">
            {/* Primary background */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000 hover:scale-105"
              style={{
                backgroundImage: 'url("https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1")',
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover'
              }}
            ></div>
            
            {/* Secondary overlay for depth */}
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-30"
              style={{
                backgroundImage: 'url("https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=1")',
                backgroundSize: 'cover',
                mixBlendMode: 'overlay'
              }}
            ></div>
          </div>
          
          {/* Dynamic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-blue-700/80"></div>
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* Animated construction elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating particles */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-300/40 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white/50 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-200/60 rounded-full animate-pulse delay-2000"></div>
            <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-3000"></div>
            <div className="absolute top-1/2 right-1/6 w-1 h-1 bg-blue-100/70 rounded-full animate-pulse delay-4000"></div>
            <div className="absolute bottom-1/2 left-1/6 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse delay-5000"></div>
            
            {/* Construction tool icons (subtle) */}
            <div className="absolute top-1/6 right-1/8 w-3 h-3 text-white/20 animate-bounce delay-7000">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              </svg>
            </div>
            <div className="absolute bottom-1/6 left-1/8 w-2 h-2 text-blue-200/30 animate-pulse delay-9000">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>
          

        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Building Your Dream Home in{" "}
              <span className="text-blue-300">North Carolina</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Quality craftsmanship, modern designs, and exceptional service. 
              Your vision, our expertise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href="/homes"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center group"
              >
                View Available Homes
                <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Get Started
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-blue-300 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-blue-100">Custom Design</span>
              </div>
              <div className="flex items-center">
                <svg className="h-6 w-6 text-blue-300 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-blue-100">Quality Materials</span>
              </div>
              <div className="flex items-center">
                <svg className="h-6 w-6 text-blue-300 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-blue-100">Expert Craftsmanship</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Homes Section */}
      <FeaturedHomes />

      {/* About Preview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About LA Residential - A Branch of Furr Construction
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                With years of experience in the North Carolina construction industry, 
                we specialize in building high-quality residential homes that combine 
                modern design with exceptional craftsmanship.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our team is dedicated to bringing your vision to life, from initial 
                concept to final walkthrough. We pride ourselves on attention to detail, 
                quality materials, and timely project completion.
              </p>
              
              <a
                href="/about"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Learn More About Us
              </a>
            </div>
            
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <svg className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                    </svg>
                    <p className="text-lg font-semibold">Your Dream Home Awaits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build Your Dream Home?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get in touch with our team to discuss your project, schedule a consultation, 
            or learn more about our available homes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Contact Us Today
            </a>
            <a
              href="/homes"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              View Available Homes
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

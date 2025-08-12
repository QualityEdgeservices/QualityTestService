import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Get In Touch
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Have questions? Our team is here to help you with any inquiries
            about our mock tests and services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact Information</h3>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-primary-100 p-3 rounded-full mr-4">
                  <Mail className="text-primary-600" size={20} />
                </div>
                <div>
                  {/* <h4 className="font-medium text-gray-800">Email Us</h4> */}
                  <p className="text-gray-600">qualityedgeservice@gmail.com</p>
                  <p className="text-gray-600">info@qualityedges.com</p>
                </div>
              </div>

              <div className="flex items-center justify-start">
                <div className="bg-primary-100 p-3 rounded-full mr-4 flex items-center justify-center">
                  <Phone className="text-primary-600" size={20} />
                </div>
                <div>
                  {/* <h4 className="font-medium text-gray-800">Call Us</h4> */}
                  <p className="text-gray-600">+91-9250242736</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-primary-100 p-3 rounded-full mr-4">
                  <MapPin className="text-primary-600" size={20} />
                </div>
                <div>
                  {/* <h4 className="font-medium text-gray-800">Visit Us</h4> */}
                  <p className="text-gray-600">
                    Adarsh nagar, Nabgram colony,{" "}
                  </p>
                  <p className="text-gray-600">
                    Hooghly, West-Bengal, India, 712246
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form className="bg-white p-6 rounded-xl shadow-sm">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                  placeholder="Subject"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                  placeholder="Your message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

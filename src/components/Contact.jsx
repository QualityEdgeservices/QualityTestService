import React from "react";
import { Mail, Phone, MapPin, Linkedin, Instagram, Youtube } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Get In <span className="text-teal-700">Touch</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Find Us Here – Office Location & Contact Info.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column: Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-teal-700">
              West Bengal Office
            </h3>

            <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
              {/* Phone */}
              <div className="flex items-start">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <Phone className="text-teal-700" size={20} />
                </div>
                <a
                  href="tel:+919250242736"
                  className="text-gray-600 hover:text-teal-700 transition"
                >
                  +91-9250242736
                </a>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <Mail className="text-teal-700" size={20} />
                </div>
                <div className="flex flex-col">
                  <a
                    href="mailto:qualityedgeservice@gmail.com"
                    className="text-gray-600 hover:text-teal-700 transition"
                  >
                    qualityedgeservice@gmail.com
                  </a>
                  <a
                    href="mailto:info@qualityedges.com"
                    className="text-gray-600 hover:text-teal-700 transition"
                  >
                    info@qualityedges.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <MapPin className="text-teal-700" size={20} />
                </div>
                <a
                  href="https://www.google.com/maps?q=Adarsh+nagar,Nabgram+colony,Hooghly,West-Bengal,India,712246"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-teal-700 transition"
                >
                  Adarsh nagar, Nabgram colony,
                  <br />
                  Hooghly, West-Bengal, India, 712246
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h4 className="font-semibold text-teal-700 mb-3">
                Connect With Us
              </h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/company/qualityedge-services-private-limited/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-teal-700 text-white p-2 rounded-full hover:bg-teal-800 transition"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://www.instagram.com/qualityedgeservice/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-teal-700 text-white p-2 rounded-full hover:bg-teal-800 transition"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCNpzO6lE-I9fvh3bl-01_MA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-teal-700 text-white p-2 rounded-full hover:bg-teal-800 transition"
                >
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div>
            <form className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-teal-700">
                Ask Your Query
              </h3>
              <p className="mb-6 text-gray-600">
                Feel free to reach out to us if you have any questions.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-teal-600"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-teal-600"
                />
                <input
                  type="text"
                  placeholder="Mob. No."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-teal-600"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-teal-600"
                />
              </div>

              <textarea
                rows="4"
                placeholder="Message"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-teal-600 mb-4"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-lg font-medium transition"
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

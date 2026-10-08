import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedSection from '../components/AnimatedSection';
import { contactAPI } from '../services/api';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await contactAPI.submit(formData);
      if (res.data.success) {
        toast.success(res.data.message || 'Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — Mahamana Hopes Foundation</title>
        <meta name="description" content="Get in touch with Mahamana Hopes Foundation. We'd love to hear from you." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&q=80" alt="Contact Us" className="w-full h-full object-cover" />
        </div>
        <div className="container-max relative z-10 text-center">
          <AnimatedSection>
            <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-5">
              Get in <span className="text-green-300">Touch</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
              Have questions about our programs, volunteering, or donating? We're here to help. Reach out to us through any of the channels below.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatedSection direction="left">
                <div className="card p-8 h-full bg-white">
                  <h2 className="text-2xl font-heading font-bold text-primary-500 mb-6">Contact Information</h2>
                  
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-primary-500 mb-1">Our Location</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Varanasi, Uttar Pradesh<br />
                          India
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-primary-500 mb-1">Email Us</h4>
                        <a href="mailto:mahamanahopes@gmail.com" className="text-gray-600 text-sm hover:text-primary-500 transition-colors">
                          mahamanahopes@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <Phone className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-primary-500 mb-1">Call Us</h4>
                        <div className="text-gray-600 text-sm flex flex-col gap-1.5 mt-1.5">
                          <a href="tel:+919519059105" className="hover:text-primary-500 transition-colors">+91 95190 59105</a>
                          <a href="tel:+919569085345" className="hover:text-primary-500 transition-colors">+91 95690 85345</a>
                          <a href="tel:+919651082598" className="hover:text-primary-500 transition-colors">+91 96510 82598</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-gray-100">
                    <h4 className="font-heading font-semibold text-primary-500 mb-4">Follow Us</h4>
                    {/* Add social links here if needed */}
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <AnimatedSection direction="right">
                <div className="card p-8 h-full bg-white">
                  <h2 className="text-2xl font-heading font-bold text-primary-500 mb-2">Send us a Message</h2>
                  <p className="text-gray-500 text-sm mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="input-label">Your Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="input-label">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="input-label">Phone Number (Optional)</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="+91 9876543210"
                        />
                      </div>
                      <div>
                        <label className="input-label">Subject *</label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="How can we help?"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="input-label">Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="input-field h-32 resize-none"
                        placeholder="Write your message here..."
                      />
                    </div>

                    <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full !py-3.5">
                      {isSubmitting ? 'Sending...' : (
                        <>Send Message <Send className="w-4 h-4 ml-1" /></>
                      )}
                    </button>
                  </form>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

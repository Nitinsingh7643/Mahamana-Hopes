import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, CheckCircle2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedSection from '../components/AnimatedSection';
import { volunteerAPI } from '../services/api';

const areasOfInterest = [
  'Education',
  'Healthcare',
  'Environment',
  'Events',
  'Fundraising',
  'Social Media',
  'Technology',
  'Photography/Videography',
];

export default function Volunteer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    age: '',
    occupation: '',
    skills: '',
    areasOfInterest: [] as string[],
    availability: 'flexible',
    motivation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (area: string) => {
    setFormData((prev) => {
      const isSelected = prev.areasOfInterest.includes(area);
      return {
        ...prev,
        areasOfInterest: isSelected
          ? prev.areasOfInterest.filter((a) => a !== area)
          : [...prev.areasOfInterest, area],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.areasOfInterest.length === 0) {
      toast.error('Please select at least one area of interest');
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSubmit = {
        ...formData,
        age: parseInt(formData.age),
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      };

      const res = await volunteerAPI.apply(dataToSubmit);
      if (res.data.success) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-gray-50">
        <Helmet>
          <title>Application Received — Mahamana Hopes Foundation</title>
        </Helmet>
        <div className="container-max max-w-lg">
          <AnimatedSection>
            <div className="card p-10 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-heading font-bold text-primary-500 mb-4">
                Thank You for Applying!
              </h1>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We have received your volunteer application. Our team will review it and get back to you shortly at {formData.email}.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({
                    fullName: '', email: '', phone: '', city: '', age: '',
                    occupation: '', skills: '', areasOfInterest: [],
                    availability: 'flexible', motivation: '',
                  });
                }}
                className="btn btn-outline w-full"
              >
                Submit Another Application
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>Volunteer With Us — Mahamana Hopes Foundation</title>
        <meta name="description" content="Become a volunteer and help us create sustainable impact in education, healthcare, and environment." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&q=80" alt="Volunteers" className="w-full h-full object-cover" />
        </div>
        <div className="container-max relative z-10 text-center">
          <AnimatedSection>
            <div className="w-16 h-16 mx-auto bg-primary-500/50 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-blue-300" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-5">
              Become a <span className="text-green-300">Volunteer</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
              Your time and skills can change lives. Join our community of dedicated volunteers working towards a better tomorrow.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-max max-w-3xl">
          <AnimatedSection>
            <div className="card p-6 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-primary-500 mb-2">Volunteer Application Form</h2>
                <p className="text-gray-500 text-sm">Please fill out the form below to join our volunteer team.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="font-heading font-semibold text-primary-500 border-b border-gray-100 pb-2">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Full Name *</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="input-field" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="input-label">Age *</label>
                      <input type="number" name="age" min="16" value={formData.age} onChange={handleChange} required className="input-field" placeholder="25" />
                    </div>
                    <div>
                      <label className="input-label">Email Address *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="input-label">Phone Number *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="input-field" placeholder="+91 9876543210" />
                    </div>
                    <div>
                      <label className="input-label">City *</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} required className="input-field" placeholder="Varanasi" />
                    </div>
                    <div>
                      <label className="input-label">Occupation *</label>
                      <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required className="input-field" placeholder="Student / Professional" />
                    </div>
                  </div>
                </div>

                {/* Skills & Interests */}
                <div className="space-y-4">
                  <h3 className="font-heading font-semibold text-primary-500 border-b border-gray-100 pb-2 pt-4">Skills & Interests</h3>
                  
                  <div>
                    <label className="input-label">Areas of Interest * (Select at least one)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                      {areasOfInterest.map((area) => (
                        <label key={area} className="flex items-start gap-2 cursor-pointer group">
                          <div className="relative flex items-center justify-center w-5 h-5 shrink-0 mt-0.5">
                            <input
                              type="checkbox"
                              checked={formData.areasOfInterest.includes(area)}
                              onChange={() => handleCheckboxChange(area)}
                              className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-primary-500/20 focus:outline-none checked:border-primary-500 checked:bg-primary-500 transition-all cursor-pointer"
                            />
                            <CheckCircle2 className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-sm text-gray-600 group-hover:text-primary-500 transition-colors leading-snug">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="input-label">Specific Skills</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g. Teaching, Graphic Design, Public Speaking (comma separated)"
                    />
                  </div>
                </div>

                {/* Availability & Motivation */}
                <div className="space-y-4">
                  <h3 className="font-heading font-semibold text-primary-500 border-b border-gray-100 pb-2 pt-4">Availability & Motivation</h3>
                  
                  <div>
                    <label className="input-label">Availability *</label>
                    <select name="availability" value={formData.availability} onChange={handleChange} required className="input-field">
                      <option value="weekdays">Weekdays</option>
                      <option value="weekends">Weekends</option>
                      <option value="both">Both Weekdays & Weekends</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Why do you want to volunteer with us? *</label>
                    <textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleChange}
                      required
                      className="input-field h-32 resize-none"
                      placeholder="Share your motivation..."
                    />
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full !py-4 text-base">
                  {isSubmitting ? 'Submitting Application...' : (
                    <>Submit Application <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

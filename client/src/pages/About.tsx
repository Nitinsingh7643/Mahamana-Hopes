import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Target, Eye, Heart, Shield, Users, Leaf, Handshake, ArrowRight, Phone } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const values = [
  { icon: Heart, label: 'Compassion', desc: 'Leading with empathy in everything we do' },
  { icon: Shield, label: 'Integrity', desc: 'Maintaining transparency and honesty' },
  { icon: Users, label: 'Inclusivity', desc: 'Welcoming everyone regardless of background' },
  { icon: Leaf, label: 'Sustainability', desc: 'Building solutions that last' },
  { icon: Eye, label: 'Transparency', desc: 'Open about our work and finances' },
  { icon: Handshake, label: 'Community First', desc: 'Putting communities at the center' },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us — Mahamana Hopes Foundation</title>
        <meta name="description" content="Learn about Mahamana Hopes Foundation, a registered trust working to create sustainable social impact through education, healthcare, and environmental conservation." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container-max relative z-10">
          <AnimatedSection>
            <span className="section-label !text-green-300">About Us</span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-5">
              Who We <span className="text-green-300">Are</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
              Mahamana Hopes Foundation is a registered trust committed to creating sustainable social impact by working with communities and empowering individuals.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <AnimatedSection direction="left">
              <div className="card p-8 h-full border-l-4 border-primary-500">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-5">
                  <Target className="w-7 h-7 text-primary-500" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-primary-500 mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  To build stronger communities by improving access to education, healthcare, and a clean and sustainable environment. We believe that every individual deserves the opportunity to thrive, and we work relentlessly to make that a reality.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="card p-8 h-full border-l-4 border-green-500">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
                  <Eye className="w-7 h-7 text-green-600" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-primary-500 mb-4">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed">
                  A future where every individual has the opportunity to learn, live a healthy life, and thrive in a safe and sustainable environment. We envision communities that are self-sustaining, informed, and empowered.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gray-50/50">
        <div className="container-max">
          <AnimatedSection className="text-center mb-14">
            <span className="section-label">What Guides Us</span>
            <h2 className="section-title mx-auto">Our Core Values</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val, i) => {
              const Icon = val.icon;
              return (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <div className="card p-6 text-center group">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary-50 to-green-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-primary-500" />
                    </div>
                    <h3 className="font-heading font-bold text-primary-500 text-lg mb-1">{val.label}</h3>
                    <p className="text-gray-500 text-sm">{val.desc}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <AnimatedSection className="text-center mb-14">
            <span className="section-label">Our Team</span>
            <h2 className="section-title mx-auto">Meet Our Leadership</h2>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <AnimatedSection>
              <div className="card p-8 text-center group border-t-4 border-green-500 h-full">
                <div className="w-32 h-32 mx-auto rounded-full bg-primary-50 flex items-center justify-center mb-6 overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <img src="/president.jpg" alt="Sajal Kumar (Karan)" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-heading font-bold text-primary-500 text-2xl mb-1">Sajal Kumar (Karan)</h3>
                <p className="text-green-500 font-semibold mb-4">President</p>
                
                <div className="flex items-center justify-center gap-2 text-gray-600 bg-gray-50 py-2 px-4 rounded-full">
                  <Phone className="w-4 h-4 text-green-500" />
                  <a href="tel:+919519059105" className="hover:text-primary-500 transition-colors font-medium">+91 95190 59105</a>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="card p-8 text-center group border-t-4 border-green-500 h-full">
                <div className="w-32 h-32 mx-auto rounded-full bg-primary-50 flex items-center justify-center mb-6 overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <img src="/vice-president.jpg" alt="Shubhangam Rai" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-heading font-bold text-primary-500 text-2xl mb-1">Shubhangam Rai</h3>
                <p className="text-green-500 font-semibold mb-4">Vice President</p>
                
                <div className="flex items-center justify-center gap-2 text-gray-600 bg-gray-50 py-2 px-4 rounded-full">
                  <Phone className="w-4 h-4 text-green-500" />
                  <a href="tel:+919651082598" className="hover:text-primary-500 transition-colors font-medium">+91 96510 82598</a>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="card p-8 text-center group border-t-4 border-green-500 h-full">
                <div className="w-32 h-32 mx-auto rounded-full bg-primary-50 flex items-center justify-center mb-6 overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <img src="/vice-president-2.jpg" alt="Shriyanshu Dwivedi" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-heading font-bold text-primary-500 text-2xl mb-1">Shriyanshu Dwivedi</h3>
                <p className="text-green-500 font-semibold mb-4">Vice President</p>
                
                <div className="flex items-center justify-center gap-2 text-gray-600 bg-gray-50 py-2 px-4 rounded-full">
                  <Phone className="w-4 h-4 text-green-500" />
                  <a href="tel:+919569085345" className="hover:text-primary-500 transition-colors font-medium">+91 95690 85345</a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <AnimatedSection className="text-center mb-14">
            <span className="section-label">Our Journey</span>
            <h2 className="section-title mx-auto">Growing Together</h2>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto">
            {[
              { title: 'Foundation Established', desc: 'Founded on 04-07-2026, Mahamana Hopes Foundation was registered as a trust with a vision to serve communities.' },
              { title: 'First Education Program', desc: 'Launched our first after-school learning center, reaching students in underserved areas.' },
              { title: 'Healthcare Initiative Launched', desc: 'Organized our first community health camp, providing free medical check-ups and support.' },
              { title: 'Environmental Programs Begin', desc: 'Started tree plantation drives and environmental awareness campaigns across communities.' },
              { title: 'Expanding Impact', desc: 'Continuing to grow our programs and reach more communities across the region.' },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 shrink-0 mt-1.5" />
                    {i < 4 && <div className="w-0.5 flex-1 bg-green-200 mt-1" />}
                  </div>
                  <div className="pb-8">
                    <h3 className="font-heading font-bold text-primary-500 text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-500">
        <div className="container-max text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-5">
              Be Part of Our Mission
            </h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
              Join us in creating lasting change through education, healthcare, and environmental conservation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/volunteer" className="btn btn-green"><Users className="w-4 h-4" /> Volunteer</Link>
              <Link to="/donate" className="btn btn-white"><Heart className="w-4 h-4" /> Donate</Link>
              <Link to="/partner" className="btn text-white border-2 border-white/30 hover:bg-white hover:text-primary-500 transition-all">Partner <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Stethoscope, Activity, Apple, ShieldAlert, HeartPulse, Brain, Heart, ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import CounterAnimation from '../components/CounterAnimation';

const programs = [
  {
    icon: Stethoscope,
    title: 'Community Health Camps',
    desc: 'Organizing free medical check-up camps in rural and underserved urban areas with volunteer doctors.',
  },
  {
    icon: ShieldAlert,
    title: 'Preventive Healthcare',
    desc: 'Conducting awareness sessions on hygiene, sanitation, and disease prevention to build healthier communities.',
  },
  {
    icon: Apple,
    title: 'Nutrition Awareness',
    desc: 'Educating mothers and children about balanced diets and providing nutritional supplements where needed.',
  },
  {
    icon: Activity,
    title: 'First Aid Training',
    desc: 'Training community volunteers in basic first aid and emergency response.',
  },
  {
    icon: Brain,
    title: 'Mental Wellness',
    desc: 'Breaking the stigma around mental health through community counseling and awareness programs.',
  },
  {
    icon: HeartPulse,
    title: 'Medical Support',
    desc: 'Providing financial assistance for essential medicines and treatments for critically ill patients.',
  },
];

export default function Healthcare() {
  return (
    <>
      <Helmet>
        <title>Healthcare & Wellness — Mahamana Hopes Foundation</title>
        <meta name="description" content="Explore our healthcare initiatives providing medical access and wellness programs to underserved communities." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-red-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80" alt="Healthcare" className="w-full h-full object-cover" />
        </div>
        <div className="container-max relative z-10 text-center">
          <AnimatedSection>
            <div className="w-16 h-16 mx-auto bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
              <Stethoscope className="w-8 h-8 text-red-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-5">
              Healthy Communities, <span className="text-red-300">Healthy Future</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Access to basic healthcare is a fundamental right. We work to bridge the healthcare gap in underserved communities through medical camps, awareness, and direct support.
            </p>
            <Link to="/donate" className="btn btn-primary bg-red-500 hover:bg-red-600 border-none">
              <Heart className="w-4 h-4" /> Support Healthcare
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-red-50 border-b border-red-100">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { label: 'Patients Reached', value: 15000 },
              { label: 'Health Camps', value: 120 },
              { label: 'Blood Donations', value: 100 },
              { label: 'Volunteer Doctors', value: 45 },
              { label: 'Villages Covered', value: 30 },
            ].map((stat, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-3xl font-heading font-bold text-red-600 mb-1">
                    <CounterAnimation end={stat.value} />
                  </div>
                  <p className="text-sm font-medium text-red-900/60">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How a Health Camp Works Timeline */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <AnimatedSection className="text-center mb-14">
            <span className="section-label !text-red-600">Our Process</span>
            <h2 className="section-title mx-auto text-red-900">How a Health Camp Works</h2>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              {[
                'Community Identification',
                'Registration',
                'Health Screening',
                'Consultation',
                'Medicine/Guidance',
                'Follow-up'
              ].map((step, i) => (
                <AnimatedSection key={i} delay={i * 0.1} className="relative">
                  <div className="w-12 h-12 mx-auto rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center mb-3 relative z-10 border-4 border-white">
                    {i + 1}
                  </div>
                  {i < 5 && (
                    <div className="hidden lg:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-red-100 -z-0" />
                  )}
                  <p className="text-sm font-semibold text-gray-700">{step}</p>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <AnimatedSection className="text-center mb-14">
            <span className="section-label !text-red-600">Our Initiatives</span>
            <h2 className="section-title mx-auto text-red-900">Healthcare Programs</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, i) => {
              const Icon = program.icon;
              return (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <div className="card p-8 h-full border-t-4 border-red-500 hover:shadow-xl hover:-translate-y-2 transition-all bg-white">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-red-900 mb-3">{program.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{program.desc}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

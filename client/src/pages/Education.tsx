import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, MonitorPlay, BookHeart, Compass, ArrowRight, Heart } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import CounterAnimation from '../components/CounterAnimation';

const programs = [
  {
    icon: BookOpen,
    title: 'After-School Learning',
    desc: 'Providing daily tutoring and a safe space for children to complete homework and improve their foundational skills.',
  },
  {
    icon: GraduationCap,
    title: 'Scholarships',
    desc: 'Financial support for meritorious students from underprivileged backgrounds to pursue higher education.',
  },
  {
    icon: MonitorPlay,
    title: 'Digital Learning',
    desc: 'Equipping students with digital literacy skills and access to computers to bridge the digital divide.',
  },
  {
    icon: BookHeart,
    title: 'Educational Materials',
    desc: 'Distributing books, stationery, and uniforms to ensure every child has the basic tools they need for school.',
  },
  {
    icon: Compass,
    title: 'Career Guidance',
    desc: 'Mentoring high school students to explore career options and plan for their professional futures.',
  },
];

export default function Education() {
  return (
    <>
      <Helmet>
        <title>Education — Mahamana Hopes Foundation</title>
        <meta name="description" content="Explore our educational initiatives aiming to provide quality education and support for every child." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-blue-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80" alt="Education" className="w-full h-full object-cover" />
        </div>
        <div className="container-max relative z-10 text-center">
          <AnimatedSection>
            <div className="w-16 h-16 mx-auto bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-blue-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-5">
              Quality Education for <span className="text-blue-300">Every Child</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              We believe education is the most powerful tool to break the cycle of poverty. Our programs ensure that children from marginalized communities receive the support they need to succeed.
            </p>
            <Link to="/donate" className="btn btn-primary bg-blue-500 hover:bg-blue-600 border-none">
              <Heart className="w-4 h-4" /> Support Education
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-blue-50 border-b border-blue-100">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Students Supported', value: 1000 },
              { label: 'Learning Centers', value: 12 },
              { label: 'Scholarships Awarded', value: 250 },
              { label: 'Volunteer Teachers', value: 75 },
            ].map((stat, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-3xl font-heading font-bold text-blue-600 mb-1">
                    <CounterAnimation end={stat.value} />
                  </div>
                  <p className="text-sm font-medium text-blue-900/60">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <AnimatedSection className="text-center mb-14">
            <span className="section-label !text-blue-600">Our Initiatives</span>
            <h2 className="section-title mx-auto text-blue-900">Education Programs</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, i) => {
              const Icon = program.icon;
              return (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <div className="card p-8 h-full border-t-4 border-blue-500 hover:shadow-xl hover:-translate-y-2 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-blue-900 mb-3">{program.title}</h3>
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

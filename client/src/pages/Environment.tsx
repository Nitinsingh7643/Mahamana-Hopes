import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Leaf, TreePine, Droplets, Trash2, Sprout, Wind, ArrowRight, HandHelping } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import CounterAnimation from '../components/CounterAnimation';

const programs = [
  {
    icon: TreePine,
    title: 'Tree Plantation Drives',
    desc: 'Organizing large-scale native tree plantation drives to increase green cover and restore degraded lands.',
  },
  {
    icon: Trash2,
    title: 'Cleanliness Campaigns',
    desc: 'Leading community clean-up drives to remove plastic waste from public spaces and water bodies.',
  },
  {
    icon: Leaf,
    title: 'Waste Management',
    desc: 'Educating communities on waste segregation, composting, and responsible disposal methods.',
  },
  {
    icon: Sprout,
    title: 'Recycling Awareness',
    desc: 'Promoting the principles of reduce, reuse, and recycle through workshops and school programs.',
  },
  {
    icon: Droplets,
    title: 'Water Conservation',
    desc: 'Creating awareness about rainwater harvesting and efficient water usage in rural and urban areas.',
  },
  {
    icon: Wind,
    title: 'Environmental Education',
    desc: 'Integrating environmental awareness into school curricula to nurture a generation of eco-warriors.',
  },
];

export default function Environment() {
  return (
    <>
      <Helmet>
        <title>Environment — Mahamana Hopes Foundation</title>
        <meta name="description" content="Join our environmental conservation efforts to protect nature and build a sustainable future." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-green-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1920&q=80" alt="Environment" className="w-full h-full object-cover" />
        </div>
        <div className="container-max relative z-10 text-center">
          <AnimatedSection>
            <div className="w-16 h-16 mx-auto bg-green-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 border border-green-400/50">
              <Leaf className="w-8 h-8 text-green-300" />
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-5">
              Protect Nature, <span className="text-green-300">Preserve Tomorrow</span>
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Our planet needs us now more than ever. Through grassroots action and community education, we are working towards a greener, cleaner, and more sustainable future.
            </p>
            <Link to="/volunteer" className="btn btn-primary bg-green-500 hover:bg-green-600 border-none">
              <HandHelping className="w-4 h-4" /> Join the Green Movement
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-green-50 border-b border-green-100">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Trees Planted', value: 1000, suffix: '+' },
              { label: 'Kg Waste Collected', value: 5000, suffix: '+' },
              { label: 'Eco-Volunteers', value: 800, suffix: '+' },
              { label: 'Communities Reached', value: 45, suffix: '' },
            ].map((stat, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-3xl font-heading font-bold text-green-600 mb-1">
                    <CounterAnimation end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm font-medium text-green-900/60">{stat.label}</p>
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
            <span className="section-label !text-green-600">Our Initiatives</span>
            <h2 className="section-title mx-auto text-green-900">Environmental Programs</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, i) => {
              const Icon = program.icon;
              return (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <div className="card p-8 h-full border-t-4 border-green-500 hover:shadow-xl hover:-translate-y-2 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-green-900 mb-3">{program.title}</h3>
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

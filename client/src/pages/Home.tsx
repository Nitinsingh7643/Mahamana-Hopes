import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Heart, Users, GraduationCap, Stethoscope, TreePine, HandHelping,
  ArrowRight, BookOpen, Leaf, ChevronRight
} from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import CounterAnimation from '../components/CounterAnimation';
import SplitText from '../components/SplitText';
import ShinyText from '../components/ShinyText';
import SpotlightCard from '../components/SpotlightCard';
import MagneticWrapper from '../components/MagneticWrapper';
import Marquee from '../components/Marquee';
import { impactAPI, campaignAPI, storyAPI } from '../services/api';

// Import real photos for the Hero
import heroBg from '../assets/gallery/team_with_children_1.jpg';
import distributionPhoto from '../assets/gallery/distribution_drive.jpg';

const iconMap: Record<string, any> = {
  heart: Heart, users: Users, 'graduation-cap': GraduationCap,
  stethoscope: Stethoscope, 'tree-pine': TreePine, 'hand-helping': HandHelping,
};

const pillars = [
  {
    icon: BookOpen,
    title: 'Education',
    tagline: 'Quality Education for Every Child',
    description: 'Empowering young minds through after-school learning, scholarships, digital literacy, and career guidance programs.',
    programs: ['After School Learning', 'Scholarships', 'Digital Learning', 'Career Guidance', 'Educational Materials'],
    color: 'from-blue-500 to-primary-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    link: '/education',
  },
  {
    icon: Stethoscope,
    title: 'Healthcare & Wellness',
    tagline: 'Healthy Communities, Healthy Future',
    description: 'Bringing essential healthcare services to underserved communities through camps, awareness, and medical support.',
    programs: ['Health Check-up Camps', 'Medical Support', 'Nutrition Awareness', 'First Aid Training', 'Mental Wellness'],
    color: 'from-red-400 to-red-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-500',
    link: '/healthcare',
  },
  {
    icon: Leaf,
    title: 'Environment',
    tagline: 'Protect Nature, Preserve Tomorrow',
    description: 'Safeguarding our planet through tree plantations, cleanliness drives, waste management, and environmental awareness.',
    programs: ['Tree Plantation Drives', 'Cleanliness Campaigns', 'Waste Management', 'Water Conservation', 'Environmental Education'],
    color: 'from-green-500 to-green-700',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    link: '/environment',
  },
];

export default function Home() {
  const [impactStats, setImpactStats] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, campaignsRes, storiesRes] = await Promise.allSettled([
          impactAPI.getAll(),
          campaignAPI.getFeatured(),
          storyAPI.getFeatured(),
        ]);
        if (statsRes.status === 'fulfilled') setImpactStats(statsRes.value.data.stats);
        if (campaignsRes.status === 'fulfilled') setCampaigns(campaignsRes.value.data.campaigns);
        if (storiesRes.status === 'fulfilled') setStories(storiesRes.value.data.stories);
      } catch {}
    };
    loadData();
  }, []);

  const fallbackStats = [
    { label: 'Lives Impacted', value: 5000, suffix: '+', icon: 'heart' },
    { label: 'Community Programs', value: 50, suffix: '+', icon: 'users' },
    { label: 'Students Supported', value: 1000, suffix: '+', icon: 'graduation-cap' },
    { label: 'Health Camps', value: 25, suffix: '+', icon: 'stethoscope' },
    { label: 'Blood Donations', value: 100, suffix: '+', icon: 'heart-pulse' },
    { label: 'Trees Planted', value: 1000, suffix: '+', icon: 'tree-pine' },
    { label: 'Active Volunteers', value: 500, suffix: '+', icon: 'hand-helping' },
  ];

  const stats = impactStats.length > 0 ? impactStats : fallbackStats;

  return (
    <>
      <Helmet>
        <title>Mahamana Hopes Foundation — Changing Lives, Creating Hopes</title>
        <meta name="description" content="Mahamana Hopes Foundation is a registered trust working to create meaningful change through education, healthcare, and environmental conservation." />
        <meta property="og:title" content="Mahamana Hopes Foundation — Changing Lives, Creating Hopes" />
        <meta property="og:description" content="A registered trust empowering communities through education, healthcare, and environmental conservation." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ===== ADVANCED HERO SECTION ===== */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Real Photo Background with Sophisticated Gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-800/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-transparent to-primary-900/40 z-10" />
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            src={heroBg}
            alt="Mahamana Hopes Foundation Volunteers"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Dynamic Abstract Shapes */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-[30rem] h-[30rem] bg-green-500/20 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-0 w-[25rem] h-[25rem] bg-blue-500/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container-max relative z-20 pt-32 pb-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Area */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-8 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-white/90 text-sm font-semibold tracking-wide uppercase">
                  A Registered Social Trust
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white leading-[1.05] mb-6">
                <SplitText text="Changing Lives." delay={1} />
                <br />
                <span className="bg-gradient-to-r from-green-300 via-green-400 to-teal-300 bg-clip-text text-transparent">
                  <SplitText text="Creating Hopes." delay={5} />
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mb-10 font-medium"
              >
                We are on a mission to build resilient communities through impactful <strong className="text-white font-semibold">Education</strong>, essential <strong className="text-white font-semibold">Healthcare</strong>, and sustainable <strong className="text-white font-semibold">Environmental</strong> action.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="flex flex-wrap gap-4 items-center"
              >
                <MagneticWrapper>
                  <Link to="/donate" className="btn btn-green text-base !px-8 !py-4 shadow-lg shadow-green-500/30">
                    <Heart className="w-5 h-5" /> Make a Donation
                  </Link>
                </MagneticWrapper>
                
                <MagneticWrapper>
                  <Link to="/volunteer" className="btn text-base !px-8 !py-4 bg-white text-primary-600 hover:bg-gray-50 shadow-lg shadow-white/10">
                    <Users className="w-5 h-5" /> Join Our Team
                  </Link>
                </MagneticWrapper>
              </motion.div>
            </div>

            {/* Right Interactive Area (Visible on lg screens) */}
            <div className="hidden lg:block lg:col-span-5 relative">
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="relative z-10"
              >
                {/* Image Card */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-[4/5] max-w-md ml-auto rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent z-10" />
                  <img 
                    src={distributionPhoto} 
                    alt="On Ground Action" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <p className="text-white font-heading font-bold text-xl mb-1">On-Ground Action</p>
                    <p className="text-white/70 text-sm">Delivering resources where they matter most.</p>
                  </div>
                </div>

                {/* Glassmorphism Impact Card Floating */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-10 -left-10 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] max-w-xs z-30"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-heading font-bold text-white">
                        <CounterAnimation end={5000} suffix="+" />
                      </p>
                      <p className="text-green-300 text-sm font-semibold uppercase tracking-wider">Lives Impacted</p>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-snug">
                    Your support directly transforms communities in need. Be part of the change today.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Elegant Bottom Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-white">
            <path d="M0,50 C288,100 576,0 864,50 C1152,100 1344,75 1440,50 L1440,100 L0,100 Z" fill="currentColor" />
          </svg>
        </div>
      </section>

      {/* ===== IMPACT STATS ===== */}
      <section className="section-padding bg-white -mt-2">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat: any, i: number) => {
              const IconComp = iconMap[stat.icon] || Heart;
              return (
                <AnimatedSection key={i} delay={i * 0.1}>
                  <div className="text-center group">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-primary-50 to-green-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComp className="w-6 h-6 text-primary-500" />
                    </div>
                    <div className="text-3xl md:text-4xl font-heading font-bold text-primary-500">
                      <CounterAnimation end={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== THREE PILLARS ===== */}
      <section className="section-padding bg-gray-50/50">
        <div className="container-max">
          <AnimatedSection className="text-center mb-14">
            <span className="section-label">Our Focus Areas</span>
            <h2 className="section-title mx-auto">Three Pillars of Change</h2>
            <p className="section-subtitle mx-auto">
              We work across three core domains to create holistic, sustainable impact in the communities we serve.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <AnimatedSection key={i} delay={i * 0.15}>
                  <SpotlightCard className="h-full">
                    <div className="flex flex-col h-full">
                      <div className={`h-2 bg-gradient-to-r ${pillar.color}`} />
                      <div className="p-7 flex-1 flex flex-col">
                        <div className={`w-14 h-14 rounded-2xl ${pillar.bgColor} flex items-center justify-center mb-5 transition-transform`}>
                          <Icon className={`w-7 h-7 ${pillar.textColor}`} />
                        </div>
                        <h3 className="text-xl font-heading font-bold text-primary-500 dark:text-white mb-1">{pillar.title}</h3>
                        <p className={`text-sm font-semibold ${pillar.textColor} mb-3`}>{pillar.tagline}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-5">{pillar.description}</p>
                        
                        <ul className="space-y-2 mb-6 flex-1">
                          {pillar.programs.map((prog) => (
                            <li key={prog} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <ChevronRight className={`w-3.5 h-3.5 ${pillar.textColor} shrink-0`} />
                              {prog}
                            </li>
                          ))}
                        </ul>

                        <Link to={pillar.link} className={`btn btn-outline w-full text-sm !border-current ${pillar.textColor} hover:!text-white hover:!bg-current`}>
                          Explore {pillar.title.split(' ')[0]} <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </SpotlightCard>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURED CAMPAIGNS ===== */}
      {campaigns.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-max">
            <AnimatedSection className="text-center mb-14">
              <span className="section-label">Active Campaigns</span>
              <h2 className="section-title mx-auto">Join Our Campaigns</h2>
              <p className="section-subtitle mx-auto">
                Support our ongoing initiatives and help create lasting impact in communities.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {campaigns.slice(0, 3).map((campaign: any, i: number) => (
                <AnimatedSection key={campaign._id} delay={i * 0.15}>
                  <div className="card group h-full flex flex-col">
                    <div className="relative overflow-hidden h-52">
                      <img
                        src={campaign.image}
                        alt={campaign.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-semibold text-primary-500 capitalize">
                        {campaign.category}
                      </span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-heading font-bold text-lg text-primary-500 mb-2">{campaign.title}</h3>
                      <p className="text-gray-500 text-sm mb-4 flex-1">{campaign.shortDescription}</p>
                      
                      {campaign.goalAmount && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-gray-500">₹{(campaign.raisedAmount || 0).toLocaleString()} raised</span>
                            <span className="font-semibold text-green-600">
                              {Math.round(((campaign.raisedAmount || 0) / campaign.goalAmount) * 100)}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min(((campaign.raisedAmount || 0) / campaign.goalAmount) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <Link to="/donate" className="btn btn-green text-xs flex-1 !py-2">
                          <Heart className="w-3.5 h-3.5" /> Donate
                        </Link>
                        <Link to={`/campaigns`} className="btn btn-outline text-xs flex-1 !py-2">
                          Learn More
                        </Link>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/campaigns" className="btn btn-primary">
                View All Campaigns <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-green-700 z-10" />
          <img
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&q=80"
            alt="Volunteers working together"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container-max relative z-20 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-5">
              Together, We Can Create <br className="hidden md:block" />
              <span className="text-green-300">Lasting Change</span>
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
              Every contribution — whether it's your time, skills, or support — helps us build stronger communities and brighter futures.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/donate" className="btn btn-green text-base !px-8 !py-3.5">
                <Heart className="w-5 h-5" /> Donate Now
              </Link>
              <Link to="/volunteer" className="btn text-base !px-8 !py-3.5 bg-white/10 text-white border-2 border-white/30 hover:bg-white hover:text-primary-500 transition-all">
                <HandHelping className="w-5 h-5" /> Volunteer With Us
              </Link>
              <Link to="/partner" className="btn text-base !px-8 !py-3.5 bg-white/10 text-white border-2 border-white/30 hover:bg-white hover:text-primary-500 transition-all">
                Partner With Us
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== FEATURED STORIES ===== */}
      {stories.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-max">
            <AnimatedSection className="text-center mb-14">
              <span className="section-label">Stories of Impact</span>
              <h2 className="section-title mx-auto">Real Stories, Real Impact</h2>
              <p className="section-subtitle mx-auto">
                Discover the lives changed and communities transformed through our work.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stories.slice(0, 3).map((story: any, i: number) => (
                <AnimatedSection key={story._id} delay={i * 0.15}>
                  <Link to={`/stories/${story.slug}`} className="card group h-full flex flex-col">
                    <div className="relative overflow-hidden h-52">
                      <img
                        src={story.featuredImage}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-semibold text-primary-500 capitalize">
                        {story.category}
                      </span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-heading font-bold text-lg text-primary-500 mb-2 group-hover:text-green-600 transition-colors">
                        {story.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 flex-1">{story.excerpt}</p>
                      <span className="text-green-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read Story <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/stories" className="btn btn-outline">
                All Stories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== PARTNERS MARQUEE ===== */}
      <section className="py-12 bg-gray-50 border-t border-gray-100 dark:bg-slate-900 dark:border-gray-800 overflow-hidden">
        <div className="container-max mb-6">
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest">
            Supported by & Trusted Partners
          </p>
        </div>
        <Marquee
          speed={40}
          items={[
            <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"><Heart className="w-5 h-5 text-blue-600" /></div>
              <span className="font-heading font-bold text-xl text-gray-700 dark:text-gray-300">GlobalCare</span>
            </div>,
            <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"><Leaf className="w-5 h-5 text-green-600" /></div>
              <span className="font-heading font-bold text-xl text-gray-700 dark:text-gray-300">EcoTrust</span>
            </div>,
            <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center"><BookOpen className="w-5 h-5 text-purple-600" /></div>
              <span className="font-heading font-bold text-xl text-gray-700 dark:text-gray-300">EduVision</span>
            </div>,
            <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><Users className="w-5 h-5 text-red-600" /></div>
              <span className="font-heading font-bold text-xl text-gray-700 dark:text-gray-300">CommunityFirst</span>
            </div>,
            <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center"><Stethoscope className="w-5 h-5 text-yellow-600" /></div>
              <span className="font-heading font-bold text-xl text-gray-700 dark:text-gray-300">MediHelp Foundation</span>
            </div>,
          ]}
        />
      </section>
    </>
  );
}

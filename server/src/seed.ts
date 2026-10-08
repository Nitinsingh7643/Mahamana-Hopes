import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/database';
import User from './models/User';
import ImpactStatistic from './models/ImpactStatistic';
import Campaign from './models/Campaign';
import Story from './models/Story';
import Gallery from './models/Gallery';

const seedData = async () => {
  try {
    await connectDB();
    console.log('Seeding database...');

    // Create admin user
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@mahamanahopes.org' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@mahamanahopes.org',
        password: process.env.ADMIN_PASSWORD || 'admin123456',
        role: 'admin',
      });
      console.log('Admin user created');
    }

    // Seed impact statistics
    const existingStats = await ImpactStatistic.countDocuments();
    if (existingStats === 0) {
      await ImpactStatistic.insertMany([
        { label: 'Lives Impacted', value: 5000, suffix: '+', icon: 'heart', category: 'general', order: 1 },
        { label: 'Community Programs', value: 50, suffix: '+', icon: 'users', category: 'general', order: 2 },
        { label: 'Students Supported', value: 1000, suffix: '+', icon: 'graduation-cap', category: 'education', order: 3 },
        { label: 'Health Camps', value: 25, suffix: '+', icon: 'stethoscope', category: 'healthcare', order: 4 },
        { label: 'Trees Planted', value: 10000, suffix: '+', icon: 'tree-pine', category: 'environment', order: 5 },
        { label: 'Active Volunteers', value: 500, suffix: '+', icon: 'hand-helping', category: 'general', order: 6 },
      ]);
      console.log('Impact statistics seeded');
    }

    // Seed campaigns
    const existingCampaigns = await Campaign.countDocuments();
    if (existingCampaigns === 0) {
      await Campaign.insertMany([
        {
          title: 'Education for Every Child',
          slug: 'education-for-every-child',
          description: 'Our flagship education campaign aims to provide quality learning resources and after-school support to underprivileged children in rural communities. Through dedicated volunteers and modern teaching methods, we are transforming the educational landscape one child at a time.',
          shortDescription: 'Providing quality education and learning resources to underprivileged children in rural communities.',
          image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
          category: 'education',
          location: 'Varanasi, Uttar Pradesh',
          startDate: new Date('2024-01-15'),
          goalAmount: 500000,
          raisedAmount: 325000,
          volunteersRequired: 50,
          volunteersJoined: 35,
          status: 'active',
          isFeatured: true,
        },
        {
          title: 'Community Health Camp Drive',
          slug: 'community-health-camp-drive',
          description: 'Bringing comprehensive healthcare services to underserved communities through organized health camps. Our medical volunteers provide free check-ups, medicines, and health awareness sessions to those who need it most.',
          shortDescription: 'Free health check-ups and medical support for underserved communities across multiple locations.',
          image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
          category: 'healthcare',
          location: 'Multiple Locations, UP',
          startDate: new Date('2024-03-01'),
          goalAmount: 300000,
          raisedAmount: 180000,
          volunteersRequired: 30,
          volunteersJoined: 22,
          status: 'active',
          isFeatured: true,
        },
        {
          title: 'Green Earth: 10,000 Trees Campaign',
          slug: 'green-earth-10000-trees',
          description: 'Join our mission to plant 10,000 trees across degraded landscapes. This campaign focuses on planting native species, involving local communities, and creating sustainable green corridors that benefit both ecology and communities.',
          shortDescription: 'Planting 10,000 native trees to create green corridors and restore degraded landscapes.',
          image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
          category: 'environment',
          location: 'Uttar Pradesh',
          startDate: new Date('2024-06-05'),
          goalAmount: 200000,
          raisedAmount: 145000,
          volunteersRequired: 100,
          volunteersJoined: 78,
          status: 'active',
          isFeatured: true,
        },
      ]);
      console.log('Campaigns seeded');
    }

    // Seed stories
    const existingStories = await Story.countDocuments();
    if (existingStories === 0) {
      await Story.insertMany([
        {
          title: 'How After-School Programs Changed Priya\'s Life',
          slug: 'how-after-school-programs-changed-priyas-life',
          featuredImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
          category: 'education',
          author: 'Mahamana Hopes Foundation',
          content: 'Priya, a bright 12-year-old from a small village, struggled with her studies due to lack of resources and guidance at home. When our after-school learning program started in her community, everything changed. With dedicated volunteers providing daily tutoring, access to books, and a safe space to learn, Priya transformed from a struggling student to the topper of her class. Today, she dreams of becoming a teacher herself, so she can give back to her community the same way our volunteers gave to her. Her story is a testament to the power of consistent educational support.',
          excerpt: 'A 12-year-old girl from a rural village transforms her academic journey through our after-school learning program.',
          impactStats: [{ label: 'Students in program', value: '150' }, { label: 'Pass rate improvement', value: '85%' }],
          location: 'Varanasi, UP',
          isPublished: true,
          isFeatured: true,
          tags: ['education', 'success-story', 'children'],
        },
        {
          title: 'First Health Camp Brings Hope to Riverside Communities',
          slug: 'first-health-camp-brings-hope',
          featuredImage: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800',
          category: 'healthcare',
          author: 'Mahamana Hopes Foundation',
          content: 'When we organized our first community health camp along the riverbank communities, we expected perhaps a hundred visitors. What we found was overwhelming — over 300 people lined up before dawn, many of whom had never seen a doctor. Our team of volunteer doctors and healthcare workers provided free check-ups, distributed essential medicines, and conducted hygiene awareness sessions. The camp revealed shocking health disparities and strengthened our resolve to make healthcare accessible for all. Since then, we have conducted 25+ camps reaching thousands of people.',
          excerpt: 'Our first community health camp served over 300 patients, revealing critical healthcare gaps in riverside communities.',
          impactStats: [{ label: 'Patients served', value: '300+' }, { label: 'Medicines distributed', value: '1,000+' }],
          location: 'Riverside Communities, UP',
          isPublished: true,
          isFeatured: true,
          tags: ['healthcare', 'health-camp', 'community'],
        },
        {
          title: '5,000 Trees and Counting: Our Green Journey',
          slug: '5000-trees-and-counting',
          featuredImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
          category: 'environment',
          author: 'Mahamana Hopes Foundation',
          content: 'What started as a small tree plantation drive with 20 volunteers has grown into a movement. We have now planted over 5,000 trees across multiple locations, involving schools, colleges, and community groups. Each tree is geo-tagged and monitored for survival, achieving a remarkable 87% survival rate. Our approach combines tree planting with environmental education, teaching communities about the importance of native species and biodiversity. The green cover we are creating will benefit generations to come.',
          excerpt: 'From 20 volunteers to a movement: our tree plantation initiative has planted 5,000+ trees with an 87% survival rate.',
          impactStats: [{ label: 'Trees planted', value: '5,000+' }, { label: 'Survival rate', value: '87%' }],
          location: 'Multiple Locations',
          isPublished: true,
          isFeatured: true,
          tags: ['environment', 'tree-plantation', 'sustainability'],
        },
      ]);
      console.log('Stories seeded');
    }

    // Seed gallery
    const existingGallery = await Gallery.countDocuments();
    if (existingGallery === 0) {
      await Gallery.insertMany([
        { title: 'Community Distribution Drive', description: 'Our volunteers distributing essential supplies and materials to community members in need.', imageUrl: '/assets/gallery/distribution_drive.jpg', category: 'community', order: 1 },
        { title: 'Education & Creative Learning', description: 'Volunteers engaging children in creative activities like coloring and drawing to foster learning through art.', imageUrl: '/assets/gallery/education_coloring.jpg', category: 'education', order: 2 },
        { title: 'Team with Children — Learning Session', description: 'Our dedicated team sitting with children from underprivileged communities, sharing knowledge and books.', imageUrl: '/assets/gallery/team_with_children_1.jpg', category: 'education', order: 3 },
        { title: 'Community Outreach Program', description: 'Volunteers spending quality time with children, providing educational materials and creative activities.', imageUrl: '/assets/gallery/team_with_children_2.jpg', category: 'community', order: 4 },
        { title: 'Tree Plantation Drive', description: 'Our team coming together for a tree plantation drive, contributing to environmental conservation and a greener future.', imageUrl: '/assets/gallery/tree_plantation.jpg', category: 'environment', order: 5 },
      ]);
      console.log('Gallery seeded');
    }

    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();

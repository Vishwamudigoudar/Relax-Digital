import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Setting from '../models/Setting.js';

export const seedInitialData = async () => {
  try {
    // 1. Ensure Admin and Default User exist
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    let adminUser = adminExists;
    if (!adminExists) {
      adminUser = await User.create({
        name: 'Super Admin',
        email: 'admin@example.com',
        phone: '+1 (555) 019-2831',
        password: 'Admin@123', // Pre-save hook hashes it with bcrypt
        role: 'admin',
      });
      console.log(' [Seed] Admin account created: admin@example.com / Admin@123');
    }

    const demoUserExists = await User.findOne({ email: 'user@example.com' });
    let demoUser = demoUserExists;
    if (!demoUserExists) {
      demoUser = await User.create({
        name: 'Alex Johnson',
        email: 'user@example.com',
        phone: '+1 (555) 472-8819',
        password: 'User@123',
        role: 'user',
      });
      console.log(' [Seed] Demo user account created: user@example.com / User@123');
    }

    // Additional test users for admin view
    const extraUserCount = await User.countDocuments();
    if (extraUserCount < 5) {
      const extraUsers = [
        {
          name: 'Sarah Connor',
          email: 'sarah.connor@cyberdyne.io',
          phone: '+1 (555) 839-2144',
          password: 'User@123',
          role: 'user',
        },
        {
          name: 'Marcus Vance',
          email: 'marcus.v@cloudsystems.net',
          phone: '+1 (555) 392-1082',
          password: 'User@123',
          role: 'user',
        },
        {
          name: 'Elena Rostova',
          email: 'elena.rostova@designlab.org',
          phone: '+1 (555) 912-3481',
          password: 'User@123',
          role: 'user',
        },
      ];
      for (const u of extraUsers) {
        const found = await User.findOne({ email: u.email });
        if (!found) {
          await User.create(u);
        }
      }
    }

    // 2. Ensure initial Products exist
    const productCount = await Product.countDocuments();
    let sampleProducts = [];
    if (productCount === 0) {
      const productsData = [
        {
          name: 'Apex Pro Wireless ANC Headphones',
          description: 'Studio-grade spatial audio with active noise cancellation, transparency mode, 40-hour ultra battery life, and plush memory foam earcups.',
          price: 299.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
          category: 'Audio',
          stock: 45,
          rating: 4.9,
          featured: true,
        },
        {
          name: 'Chronos Smartwatch Ultra',
          description: 'Titanium aerospace casing, sapphire crystal display, ECG monitoring, offline GPS navigation, and 100m water resistance.',
          price: 449.0,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
          category: 'Wearables',
          stock: 28,
          rating: 4.8,
          featured: true,
        },
        {
          name: 'Lumix Mechanical RGB Keyboard',
          description: 'Hot-swappable tactile mechanical switches, aerospace aluminum top frame, sound-dampening silicone gaskets, and per-key RGB backlighting.',
          price: 159.5,
          image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
          category: 'Accessories',
          stock: 62,
          rating: 4.7,
          featured: false,
        },
        {
          name: 'HyperView 4K UltraWide Monitor 34"',
          description: 'Curved 1000R IPS panel, 165Hz refresh rate, 1ms response time, 99% DCI-P3 color reproduction, and USB-C 90W Power Delivery.',
          price: 799.0,
          image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
          category: 'Displays',
          stock: 15,
          rating: 4.9,
          featured: true,
        },
        {
          name: 'ErgoMotion Electric Standing Desk',
          description: 'Dual-motor quiet lifting system, solid bamboo desktop with cable management tray, 4 memory height presets, and anti-collision sensor.',
          price: 520.0,
          image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&auto=format&fit=crop&q=80',
          category: 'Furniture',
          stock: 20,
          rating: 4.6,
          featured: false,
        },
        {
          name: 'Nova Pro Mirrorless 4K Cinema Camera',
          description: 'Full-frame 33MP BSI CMOS sensor, 4K 60p 10-bit internal recording, 5-axis in-body image stabilization, and dual card slots.',
          price: 1899.0,
          image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
          category: 'Photography',
          stock: 8,
          rating: 5.0,
          featured: true,
        },
        {
          name: 'AeroDrone Pro Quadcopter 4K',
          description: 'Tri-directional obstacle sensing, 34-minute flight time, 12km HD video transmission, MasterShots automated cinematography.',
          price: 899.99,
          image: 'https://images.unsplash.com/photo-1507582020432-2a3bc41e2321?w=800&auto=format&fit=crop&q=80',
          category: 'Drones',
          stock: 12,
          rating: 4.8,
          featured: false,
        },
        {
          name: 'SoundSphere Hi-Fi Smart Speaker',
          description: '360-degree acoustic architecture with room calibration, voice assistant integration, multi-room audio sync, and lossless streaming.',
          price: 199.0,
          image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
          category: 'Audio',
          stock: 35,
          rating: 4.7,
          featured: false,
        },
      ];

      sampleProducts = await Product.insertMany(productsData);
      console.log(` [Seed] Seeded ${sampleProducts.length} initial products.`);
    } else {
      sampleProducts = await Product.find().limit(4);
    }

    // 3. Ensure initial Orders exist for dashboard charts
    const orderCount = await Order.countDocuments();
    if (orderCount === 0 && demoUser && sampleProducts.length > 0) {
      const sampleOrders = [
        {
          userId: demoUser._id,
          products: [
            {
              product: sampleProducts[0]._id,
              name: sampleProducts[0].name,
              price: sampleProducts[0].price,
              quantity: 1,
              image: sampleProducts[0].image,
            },
            {
              product: sampleProducts[1]._id,
              name: sampleProducts[1].name,
              price: sampleProducts[1].price,
              quantity: 1,
              image: sampleProducts[1].image,
            },
          ],
          totalAmount: sampleProducts[0].price + sampleProducts[1].price,
          status: 'Delivered',
          shippingAddress: {
            fullName: 'Alex Johnson',
            address: '742 Evergreen Terrace',
            city: 'Springfield',
            postalCode: '97477',
            phone: '+1 (555) 472-8819',
          },
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        },
        {
          userId: demoUser._id,
          products: [
            {
              product: sampleProducts[2]._id,
              name: sampleProducts[2].name,
              price: sampleProducts[2].price,
              quantity: 2,
              image: sampleProducts[2].image,
            },
          ],
          totalAmount: sampleProducts[2].price * 2,
          status: 'Shipped',
          shippingAddress: {
            fullName: 'Alex Johnson',
            address: '742 Evergreen Terrace',
            city: 'Springfield',
            postalCode: '97477',
            phone: '+1 (555) 472-8819',
          },
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
        {
          userId: demoUser._id,
          products: [
            {
              product: sampleProducts[0]._id,
              name: sampleProducts[0].name,
              price: sampleProducts[0].price,
              quantity: 1,
              image: sampleProducts[0].image,
            },
          ],
          totalAmount: sampleProducts[0].price,
          status: 'Processing',
          shippingAddress: {
            fullName: 'Alex Johnson',
            address: '742 Evergreen Terrace',
            city: 'Springfield',
            postalCode: '97477',
            phone: '+1 (555) 472-8819',
          },
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        },
      ];
      await Order.insertMany(sampleOrders);
      console.log(' [Seed] Seeded initial sample orders for analytics and history.');
    }

    // 4. Ensure Settings exist
    const settingsCount = await Setting.countDocuments();
    if (settingsCount === 0) {
      await Setting.create({
        storeName: 'ApexCommerce Enterprise Portal',
        supportEmail: 'admin@apexcommerce.io',
        currency: 'USD ($)',
        taxRate: 8.5,
        shippingFee: 0,
        maintenanceMode: false,
        autoConfirmOrders: true,
      });
      console.log(' [Seed] Initial settings configured.');
    }
  } catch (error) {
    console.error(' [Seed] Error seeding initial data:', error);
  }
};

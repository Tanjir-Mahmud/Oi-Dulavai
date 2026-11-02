import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Oi Dulavai Luxury Menswear Atelier Database...');

  // Clean old records
  await prisma.adminActivityLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.bespokeAppointment.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productHotspot.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.measurementVault.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Admins & Patrons
  const superAdminPassword = await bcrypt.hash('DulavaiAdmin2025!', 10);
  const managerPassword = await bcrypt.hash('LoomManager2025!', 10);
  const patronPassword = await bcrypt.hash('PatronPass2025!', 10);

  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@oidulavai.com',
      phone: '+8801711000001',
      name: 'Syed Mansoor Rahman',
      passwordHash: superAdminPassword,
      role: 'SUPER_ADMIN',
      vaultId: 'ADM-DHAKA-001',
      tier: 'Grand Atelier Master',
      loyaltyPoints: 9999,
      currency: 'BDT',
      language: 'EN',
    },
  });

  const inventoryManager = await prisma.user.create({
    data: {
      email: 'manager@oidulavai.com',
      phone: '+8801711000002',
      name: 'Tariq Al-Amin',
      passwordHash: managerPassword,
      role: 'INVENTORY_MANAGER',
      vaultId: 'MGR-RAJSHAHI-002',
      tier: 'Loom Controller',
      loyaltyPoints: 3400,
      currency: 'BDT',
      language: 'EN',
    },
  });

  const patron = await prisma.user.create({
    data: {
      email: 'asif@patron.oidulavai.com',
      phone: '+8801711409822',
      name: 'Asif Mahmud Chowdhury',
      passwordHash: patronPassword,
      role: 'CUSTOMER',
      vaultId: 'SOV-BANANI-409',
      tier: 'Sovereign Patron',
      loyaltyPoints: 1250,
      currency: 'BDT',
      language: 'EN',
    },
  });

  // 2. Patron Addresses
  await prisma.address.createMany({
    data: [
      {
        userId: patron.id,
        label: 'Primary Haven (Gulshan 2)',
        recipientName: 'Asif Mahmud Chowdhury',
        phone: '+8801711409822',
        street: 'Penthouse B, Imperial Manor, Road 59, Gulshan 2',
        area: 'Gulshan 2',
        city: 'Dhaka',
        division: 'Dhaka',
        postalCode: '1212',
        country: 'Bangladesh',
        isDefault: true,
      },
      {
        userId: patron.id,
        label: 'Banani Atelier Office',
        recipientName: 'Asif Mahmud Chowdhury',
        phone: '+8801711409822',
        street: 'Level 8, Tower 42, Road 11, Banani',
        area: 'Banani Road 11',
        city: 'Dhaka',
        division: 'Dhaka',
        postalCode: '1213',
        country: 'Bangladesh',
        isDefault: false,
      },
      {
        userId: patron.id,
        label: 'Sylhet Estate Retreat',
        recipientName: 'Asif Mahmud Chowdhury',
        phone: '+8801711409822',
        street: 'Surma River House, Kumarpara Heritage Road',
        area: 'Kumarpara',
        city: 'Sylhet',
        division: 'Sylhet',
        postalCode: '3100',
        country: 'Bangladesh',
        isDefault: false,
      },
      {
        userId: patron.id,
        label: 'London Knightsbridge Residence',
        recipientName: 'Asif Mahmud Chowdhury',
        phone: '+44 20 7946 0912',
        street: 'Flat 4, 18 Cadogan Square',
        area: 'Knightsbridge',
        city: 'London',
        division: 'Greater London',
        postalCode: 'SW1X 0JP',
        country: 'United Kingdom',
        isDefault: false,
      },
    ],
  });

  // 3. Patron Measurement Vault
  await prisma.measurementVault.create({
    data: {
      userId: patron.id,
      collar: 15.5,
      chest: 40.0,
      waist: 34.0,
      shoulder: 18.0,
      sleeve: 25.5,
      bicep: 14.5,
      inseam: 31.0,
      kurtaLength: 42.0,
      monogramInitials: 'AMC',
      monogramThread: 'ANTIQUE_GOLD',
      monogramPlacement: 'CUFF',
      tailorNotes: 'Prefers architectural slim drape with 1.5 inch ease across shoulder blades. High band collar.',
      lastFittedAt: new Date(),
    },
  });

  // 4. Products & Catalog
  const productsData = [
    {
      sku: 'PRD-101',
      name: 'Nawab Tussar Silk Panjabi',
      slug: 'nawab-tussar-silk-panjabi',
      bengaliName: 'নবাব তসর সিল্ক পাঞ্জাবি',
      subtitle: 'Rajshahi Raw Silk • 24K Antique Bullion Collar',
      description: 'Crafted from raw Rajshahi Tussar silk loomed slowly on heritage pedal shuttle looms. Finished with hand-couched 24K antique bullion zari embroidery along the architectural band collar.',
      editorialStory: 'Sericulture in Rajshahi traces back over four centuries. Every fiber is organically reeled by women master-spinners in rural Barendra, producing a tactile slub texture that breathes effortlessly in Bengal humidity.',
      category: 'Panjabi',
      fabric: 'Rajshahi Raw Silk',
      weaveOrigin: 'Rajshahi Mulberry Sericulture',
      gsm: 220,
      basePrice: 16800,
      costPrice: 7200,
      compareAtPrice: 19500,
      isFeatured: true,
      isTrending: true,
      isImmediateStock: true,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDEnQQ4L4jNhDhpiN7lnGHvJ59BP64v4tDnVVc2nJqJ7tbt4B81IjiMQ_WFUz1eaGn0b-gXIPXHF16EHVqQXFu82Q7bSiLL9vKP7fbNPXCyIflCUFF1zlci55SvTe-sBMvf5L8VRIkxnNN9xegd3Yd-mYnPomA3FeSnThVy9nuKT6ewqP0toycyAS-dak0IGpht8gObJEMUpBHch6z-h1ktHKmXN1tJFKikvPkTpnc',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBYUcir0k4E8-2WgWdl4dVyv4zdzUv0w2qlFccpLoTqOuda9xDg4xcSJ6AL4isRUb-KvRzjs3MWKgWNtlhZvckGSP4FkHOLXColbfGCgMHZLvMrvnPZcd7xMuYdnjuYNpkz9NZxx2WC0QGBQoWMAscrHm4NGQB2OmYvSmhCtqI1mWtUa5PcNRKJkGAB_mkxypcDsMNFC6xNSvlAv7M88-76EuM5z2yCFBBlK0VPozQ',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBZPynLyHpy122QShYhvVj8_yp2QJjZdqmC9mRHhnAgkkPwCDrqsSz7FlVeb2xUcdyPNthoNoHDc5vjIPUMi0CjiNDr4knEqmj9Kzw35M_-DU-DSLIfGuPShnQGyAyCzxZFlzcBX-KsvRz1IBKpu5l3Y_QcqaHWreQVM3q26eR-KZ4SUWxat6pNfZhu4ZKfEUgCeLiFhHK4YcCH6bQQG-SAbkdTpgVFYZLIw_c7PFk'
      ],
      hotspots: [
        { label: 'Band Collar', spec: '24K Antique Bullion Zari Hand-Couched', xPos: 50, yPos: 18 },
        { label: 'Placket Seam', spec: 'Hidden Horn Buttons & Reinforced Stitch', xPos: 50, yPos: 35 },
        { label: 'Tussar Weave', spec: 'Natural Slub Filament • 220 GSM', xPos: 38, yPos: 65 },
      ],
      colors: [
        { color: 'Golden Mustard', hex: '#B8893A' },
        { color: 'Ivory Alabaster', hex: '#F7F4EE' },
        { color: 'Obsidian Night', hex: '#161412' }
      ]
    },
    {
      sku: 'PRD-102',
      name: 'Imperial Raw Silk Sherwani',
      slug: 'imperial-raw-silk-sherwani',
      bengaliName: 'ইম্পেরিয়াল র সিল্ক শেরওয়ানি',
      subtitle: 'Bespoke Ceremonial Couture • Hand Zardozi Crest',
      description: 'Structured royal silhouette tailored for grooms and heirloom bridal salons. Deep navy raw silk paired with micro-piped chest welt and hand-embossed antique brass crest buttons.',
      editorialStory: 'Constructed over 72 artisan hours in our Banani Atelier, each coat utilizes floating horsehair canvas interlinings to guarantee an immaculate chest contour that never sags.',
      category: 'Sherwani',
      fabric: 'Imperial Mulberry Silk',
      weaveOrigin: 'Bespoke Mirpur Looms',
      gsm: 340,
      basePrice: 28500,
      costPrice: 12500,
      compareAtPrice: 34000,
      isFeatured: true,
      isTrending: true,
      isImmediateStock: true,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBUaZI1Gxvpg47OY13E7EBIZI4Jh-L193R0U5mxFUk_6RigYy4tcIs1fIgKY4ULRu1IGUwY3a5zl-Za_fEvXlbDycztEVPacAKmcYv939EWhqKhHyRLuT2Wie8ONKAGuj3JkmoKOwspDPPY9haIFOO7Ae1Ve_3GNRIvZa_-_YHE7pllxPclvy9OquJqPWV6ItauobhXpRnQheJVaUI_OYfGl03VrM_MumGT-QQTwwo',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ93NIXUupjNdBs485ua56QIBZzIg7SztogOJ59NKnFpIbwUEhfEtLVd9FWnQQduHyyskKwJdpuqu9aveTWG7DR1d0jN-cYD51eQfsBiFXgYU0E1d2dSxsRDvW3l6esZ66e9f-TvuKoagd9BWvcRipX2GpHRsymBmqo3us-ovesiX2rmfVSVQmU-o4fsPGvvAAe5valu62C7VGT0nlC1aGTh0XMzJnUJJSESWOWtA'
      ],
      hotspots: [
        { label: 'Chest Crest', spec: 'Embossed Royal Brass Bullion', xPos: 60, yPos: 28 },
        { label: 'Structured Shoulder', spec: 'Floating Horsehair Canvas Chest Piece', xPos: 32, yPos: 22 }
      ],
      colors: [
        { color: 'Midnight Obsidian', hex: '#070C14' },
        { color: 'Royal Emerald', hex: '#133327' }
      ]
    },
    {
      sku: 'PRD-103',
      name: 'Imperial Velvet Waskoti',
      slug: 'imperial-velvet-waskoti',
      bengaliName: 'ইম্পেরিয়াল ভেলভেট ওয়াসকটি',
      subtitle: 'Silk-Back Tailored Vest • Zardozi Filigree',
      description: 'Lustrous micro-velvet bundi vest paired with pure mulberry silk back panel and cinch buckle. Styled with hand-worked floral arabesque zardozi along the Mandarin neckline.',
      editorialStory: 'The Waskoti embodies the regal court attire of Nawabi Bengal. Designed to be layered seamlessly over our Tussar Panjabis for ceremonial banquets and evening soirees.',
      category: 'Waskoti',
      fabric: 'Velvet & Silk',
      weaveOrigin: 'Bespoke Atelier Weave',
      gsm: 280,
      basePrice: 20000,
      costPrice: 8500,
      compareAtPrice: 24000,
      isFeatured: true,
      isTrending: true,
      isImmediateStock: true,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBkZn6a1dq1S0nBkU2A6uF5Jjbo9PVqZ8f0CFfps_CAuQi7dzhDNjOa49tkiS2TaHAuv7h8_If_CIAgG5apAhrdbZmsMCQNtdKvXhu8X_IMSv894D0xRdq6cozXVpFrXDNIJc9k808ShrRC2pdeJOfm1TiGsGvfXB4OZaZgyCOnLxC8lL1Ft-RtyOWGe4HdfnTSzVuJESQr1199HbrblFEOKV23f3pkddqg8L3AN0Y',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDEbS-MzPIlnCAvKLzEWos5qU8paqdj-J2uIvmEDkl_-9BcSkH8B4aH2IK3T4VmA72k9Qtgjfgh0ztUt1XcONshsB5MOS1btZOxoCaotjLYG-5JD3NV1SXg1shIJziKCyPuImbCsTamsdImDWvT2Xo5yFnzpyN1dav0E_S2doauZubX0_xAe6JpTswiUjwn4R0bo_4Kpf_q_M1wjeB2D_RoNrcKzHFIIw1hgxAzgg4'
      ],
      hotspots: [
        { label: 'Zardozi Trim', spec: 'Antique Gold Wire Filigree', xPos: 50, yPos: 25 },
        { label: 'Silk Backing', spec: 'Adjustable Brass Buckle Cinch', xPos: 40, yPos: 70 }
      ],
      colors: [
        { color: 'Deep Lapis Navy', hex: '#0B1320' },
        { color: 'Royal Burgundy', hex: '#410004' }
      ]
    },
    {
      sku: 'PRD-104',
      name: 'Barendra Khadi Waskoti',
      slug: 'barendra-khadi-waskoti',
      bengaliName: 'বারেন্দ্র খাদি ওয়াসকটি',
      subtitle: 'Handspun Cotton Khadi • Horn Buttons',
      description: 'Handspun and handwoven cotton khadi originating from rural Barendra clusters. Lightweight, textural, and dyed with organic indigo and madder root extracts.',
      editorialStory: 'Every yard of our Khadi is hand-spun on charkhas, preserving an ancient craft while yielding unparalleled breathability and tactile organic character.',
      category: 'Waskoti',
      fabric: 'Barendra Khadi',
      weaveOrigin: 'Barendra Rural Cooperative',
      gsm: 190,
      basePrice: 12500,
      costPrice: 5100,
      compareAtPrice: 15000,
      isFeatured: false,
      isTrending: true,
      isImmediateStock: true,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC5VrauJYWHzCPfOM1v-iKDiOSLJsqgMsbPFeQJQONTaKPFy119iKKs8fm7pm2lkVNdYfxV7tzmzJV-vkvGrkrmjpsUWtZT3R_1nenmAauJ06XBPpVlfjF52EtxHyzU72gpDloHBuhDrOlts9H2fxq6p2fUYC-VJ6p3kXlVHpzdzDzkzmcHFZZsG2YbI8CU1dsRMD5cQmWVULF5SmMfZterIZKAEwGTxgRD6HZj4T8',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBT1Nrn0fZydscBBpgRr63GP008G--43sONFDqznSXDi2HneZMiGamcsrqg0c5-8xB-laORnCFScZHQ-m4FizJ2jPi9A21_BT9kMF8AdgwycfSztiCDX4qp5d475KycuCu5BthMJpPlwFyzhU5DOsJ7UU-2uGploiKeDXnUja6Lxh3DnlL2jX8Jvirguc18bs_0nxzFytICyf8cUJ5BtY1S-E3NooITLK4nGTzeCIk'
      ],
      hotspots: [
        { label: 'Natural Horn Buttons', spec: 'Turned & Polished Water Buffalo Horn', xPos: 50, yPos: 45 }
      ],
      colors: [
        { color: 'Natural Sandstone', hex: '#EBE5D8' },
        { color: 'Indigo Slate', hex: '#4C4640' }
      ]
    },
    {
      sku: 'PRD-105',
      name: 'Bengal Gurkha Trousers',
      slug: 'bengal-gurkha-trousers',
      bengaliName: 'বেঙ্গল গোর্খা ট্রাউজার্স',
      subtitle: 'Double Pleated • High-Waisted Brass Cinch',
      description: 'Sartorial masterpiece featuring an authentic double-buckle Gurkha waistband, forward pleats, and an elegant 2-inch cuff drop. Hand-tailored in heavy Irish-Dhaka linen blend.',
      editorialStory: 'Designed with military tailoring discipline, the continuous waistband eliminates the need for a belt, delivering an elongated architectural silhouette.',
      category: 'Trousers',
      fabric: 'Irish-Dhaka Linen Blend',
      weaveOrigin: 'Bespoke Atelier suiting',
      gsm: 260,
      basePrice: 9200,
      costPrice: 3800,
      compareAtPrice: 11500,
      isFeatured: true,
      isTrending: true,
      isImmediateStock: true,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCqhVPoIHwQ5Dxy4iwPKESBZ8kMgOx6Yw5MEY3nGJXNONwAPfAcxK3mcaxBPGtDTufe38MKOaonPREhbETzio14oySve7l_5YUcJdnQeH48PT3iYi2ezoLwi6ZmTrCOhaaox9P5Ivuo33vXnqW2Bh4Ud_bnGOKbssLp8MUMjmPe48Uw0JDavWypXJvFOi2hJ1sFsBC4m2v_ZX1uVDcKxsblJUn3ulq8sWbKLzPwAro',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBx9t8X_4986pLmh_e7boBkW3mK80b0vI7-arFLFKTzxmmW9KO0jGD0X6YJWQvUswGzVlcGpMdLgPnqRUMGk8WmHd_s74FABU9wlYnyqA893YM5fNIh9hP8neCk5mEIJRzxEACKTJ1Mi8qpj3AVPjYeue9PeS20dONGrknbS91Z1NZRvOXwBr8ZN9CTj8vcKch9Km0KxL0GjK2lgBqTRXlsVCbVwK_EEyhTHFf7c3Y'
      ],
      hotspots: [
        { label: 'Gurkha Buckle', spec: 'Double Solid Cast Brass Cinch', xPos: 50, yPos: 15 },
        { label: 'Deep Forward Pleats', spec: 'Architectural Blade Crease', xPos: 45, yPos: 35 }
      ],
      colors: [
        { color: 'Warm Alabaster', hex: '#F7F4EE' },
        { color: 'Safari Sandstone', hex: '#EBE5D8' },
        { color: 'Obsidian Black', hex: '#161412' }
      ]
    },
    {
      sku: 'PRD-106',
      name: 'Pure Pashmina Jamdani Dupatta',
      slug: 'pure-pashmina-jamdani-dupatta',
      bengaliName: 'পশমিনা জামদানি ওড়না',
      subtitle: 'Discontinuous Weft Floral Motif • Kashmir Pashmina',
      description: 'An heirloom accessory marrying Himalayan cashmere with Bengal Jamdani geometric jaal weaving. Hand-spun pashmina yarn accented with muted gold zari border tassels.',
      editorialStory: 'UNESCO recognized Jamdani weaving represents the zenith of Bengali textile art. Only three master weavers in Sonargaon maintain the skill required to weave this featherlight shawl.',
      category: 'Accessories',
      fabric: 'Pashmina & Silk',
      weaveOrigin: 'Sonargaon Heritage Cluster',
      gsm: 110,
      basePrice: 22000,
      costPrice: 9500,
      compareAtPrice: 26000,
      isFeatured: false,
      isTrending: true,
      isImmediateStock: true,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAbrRCsja8dUOUUuM4kR3g4ILjiuThDdd6OcnZpW9PrZW_UHtYeM2nk1BIzbLMv-GohaBO1aLGAGUVCY3iWaoKw81QEOHUvZqSH3tk4mgxhniY1mrILCCLwHhlHyDf-nX2uIKqC_eV1EH9imMYohfWAp-Z_dV36Y9A71HdSu-SGu_6rrpHkmsKJpShMtS7N7ecarH92rsWEYYo3r_tOfDfpgj2Z35MyjRv679HjP-0',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCHQDD6NJvs9M4kNr7qxa7dbXV1mEx7cOOYozJ_Dyi1mj3zV9PMFb2j7ddE4lkwF5mT3ZSZQCQ_W9d5JfTFskvmbegoo5l9K44GmWpo8BpKMUUPaWfzDdZs6OSNj8hh-zj73PIWKQFkyJt2eVXtoYVV7t3ijnXB3QynwSH1A4TY1wtjPhF8Dh1GjaGcrMly3EAz9DuCw9HhUpjw6_cvQbB-0K8ccvih7u4MdN6XZm4'
      ],
      hotspots: [
        { label: 'Jamdani Motif', spec: 'Discontinuous Weft Hand-Inserted Zari', xPos: 50, yPos: 50 }
      ],
      colors: [
        { color: 'Champagne Ivory', hex: '#FCF9F3' },
        { color: 'Sandstone Gold', hex: '#D8B467' }
      ]
    },
    {
      sku: 'PRD-107',
      name: 'Fine Irish-Dhaka Linen Shirt',
      slug: 'fine-irish-dhaka-linen-shirt',
      bengaliName: 'ফাইন আইরিশ ঢাকা লিনেন শার্ট',
      subtitle: 'Camp Collar • Mother of Pearl Fasteners',
      description: 'Bespoke casual tailoring made from European flax spun in Ireland and tailored in Tejgaon. Cut with an open Cuban camp collar and hand-felled side seams.',
      editorialStory: 'Pre-washed with organic river enzymes to ensure zero shrinkage and exceptional buttery drape from the very first day.',
      category: 'Shirt',
      fabric: 'Irish Linen',
      weaveOrigin: 'Belfast Yarn • Dhaka Tailored',
      gsm: 160,
      basePrice: 8500,
      costPrice: 3400,
      compareAtPrice: 10500,
      isFeatured: true,
      isTrending: false,
      isImmediateStock: true,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA0AxxMwBkwvD8CgBz0H5_sSBMKFUCoidqS0NtanCLF7tAg8bd8Ny0au9DVNcbhA3-fCPk4jmxJ6tV-9ganNMpnaO-MzvGeQdyUDHvMM-T23vC6vX2ERXUSznzgCGvMsSx8kQxwrOTzMW8y2lSI22sMQfsWCIkt43YKTVV08MlPa5pk8hAs_NWvzuzCiiPfEHsrREs4F27DXXBIcjvWsFFZALpBiYogebF4AmqPZPU',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBvDAw0vX88a3AYqPAu0U7vUux_4TNE2FK4WOZqs0s5xRqGVBk6TZK3-LLQ5kvPebH0S5r0Zpq0rGxDN78gVAA56t4bqce9RNm2IRW0toLsuFKo_IGBBCuhoMp-9_piXkEvgWgjCRH0fQkKp2qq9fkDXdhvbBtcJ7mD9ASvzwt3_kZ1Gbv_COOv65JoFvOJe3UjKrC95RcqMpY-5IPuyMnLGpgBOM7XK7I35EoD_5k'
      ],
      hotspots: [
        { label: 'Camp Collar', spec: 'French Interlined Relaxed Open Collar', xPos: 50, yPos: 20 },
        { label: 'Buttons', spec: 'Hand-Carved Australian Mother of Pearl', xPos: 50, yPos: 50 }
      ],
      colors: [
        { color: 'Bleached Linen', hex: '#FCF9F3' },
        { color: 'Olive Sage', hex: '#615E5B' }
      ]
    },
    {
      sku: 'PRD-108',
      name: 'Artisanal Pima Heavy T-Shirt',
      slug: 'artisanal-pima-heavy-t-shirt',
      bengaliName: 'আর্টিসানাল পিমা হেভি টি-শার্ট',
      subtitle: '280 GSM Extra-Long Staple Cotton',
      description: 'The definitive architectural tee. Heavyweight 280 GSM combed Pima cotton with double-needle ribbed collar and blind-stitched hem.',
      editorialStory: 'Zero synthetic blends. Spun to withstand over 200 wash cycles without collar deformation or torque twisting.',
      category: 'T-shirt',
      fabric: 'Pima Cotton',
      weaveOrigin: 'Bespoke Knit Mill',
      gsm: 280,
      basePrice: 5200,
      costPrice: 1900,
      compareAtPrice: 6500,
      isFeatured: false,
      isTrending: true,
      isImmediateStock: true,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCttQ1_nOtOFQKOQgoEPsnObOTd63P4-P_QippiJrrK4repkKw_gjsf1mdz--_53jWvhUCnCzU6WdRbVw-4hcoUprGEqJNkFM6b29r7UEAJBJKTjOcekGVWcjLuK0x7VxyDgRE4N16qX3cdma671xWBG4qR82G4H9Sby2xFElqQb55eI6gfeIyd5YIUBsGxmEMc6GqjKcX2VRXHRf6kRxiZCf94CI6Bl9ovxZJTooU',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAqNeWves3Ru2AIT2snAb9nOC7SS6NUt4R34FjtRLkS-y3JzLK-t7HxwUQJNBh8go94MUeXShOv5_6rO9-p7aHEKxx_gg_MVlJXice86yDNZJwY5uYAYl3Cu93aoldZcwsiu2oeqXWNyE13Cvsio2U1yvDG6p4hQTLmR6m6yq9w7DOzwoOCVKuqZ6A4M4exvs1g8g6_ev5cFJdpzoTj71IBfNsUYp4m1R6ZwXhqcLA'
      ],
      hotspots: [
        { label: 'Heavy Rib Collar', spec: '1x1 Spun Rib with Clean Bias Tape', xPos: 50, yPos: 18 }
      ],
      colors: [
        { color: 'Raw Alabaster', hex: '#F7F4EE' },
        { color: 'Espresso Charcoal', hex: '#1C1C18' }
      ]
    },
    {
      sku: 'PRD-109',
      name: 'Hand-Cast Brass Cufflinks',
      slug: 'hand-cast-brass-cufflinks',
      bengaliName: 'হ্যান্ড কাস্ট ব্রাস কাফলিঙ্ক',
      subtitle: 'Solid Antique Brass • Lost-Wax Casting',
      description: 'Solid brass cufflinks molded using ancestral lost-wax metal casting in Dhamrai. Hand-patinated with beeswax for a living, aged metallic sheen.',
      editorialStory: 'Crafted in the ancient brass-casting foundry village of Dhamrai, each cufflink pair is individually chiseled with the Oi Dulavai royal monogram.',
      category: 'Accessories',
      fabric: 'Solid Brass',
      weaveOrigin: 'Dhamrai Metal Foundry',
      gsm: null,
      basePrice: 4800,
      costPrice: 1800,
      compareAtPrice: 6000,
      isFeatured: false,
      isTrending: false,
      isImmediateStock: true,
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBHzE-JLYH3Fn4oBV7F9fxr1zucZ4H0y4NinLOxpCX941pza1-ajJzM3wb4UYHr3Kx09MF2HzRcHfuNHcK48DOU_WSfwT_OuqZocDX7opOn_QUlKBMeV82e5umjXmR9dK3HCnKXvQOBtT7FnqLgvfEHF7poCnOzfsFEYO5VRNhRqlrmc1YVXPJP1tBgfV4afQBhIVqESg0n8U7G1ItpKelCnRU-Ck-VtQjja-LX-8k',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDeWOj7kLUkcl4X8Mgrm8ntJmmHF8C1EdrREJTi5DgGK1X5QF7MdSqe82xN4VtR4hzvTTlLLSi2dr0n95MDZKhfSDHIyh79QPHKoBmBNgaYbgAJGnQ8tPbgqMvSA30x3tDZ5Uy4eLcPXthj0PzhC4DnlvLIPGtcnq6B_LcI1CU4Uywou44DinnlaSnCAKwCtcRDwCzB1ZTZxITNvr-3JL7ZN-V_SOiRR9nZRcFyZI8'
      ],
      hotspots: [
        { label: 'Monogram Face', spec: 'Laser-Etched Crest with Patinated Relief', xPos: 50, yPos: 50 }
      ],
      colors: [
        { color: 'Antique Brass', hex: '#B8893A' },
        { color: 'Polished Silver', hex: '#DDD5C7' }
      ]
    }
  ];

  for (const p of productsData) {
    const createdProduct = await prisma.product.create({
      data: {
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        bengaliName: p.bengaliName,
        subtitle: p.subtitle,
        description: p.description,
        editorialStory: p.editorialStory,
        category: p.category,
        fabric: p.fabric,
        weaveOrigin: p.weaveOrigin,
        gsm: p.gsm,
        basePrice: p.basePrice,
        costPrice: p.costPrice,
        compareAtPrice: p.compareAtPrice,
        isFeatured: p.isFeatured,
        isTrending: p.isTrending,
        isImmediateStock: p.isImmediateStock,
      },
    });

    // Create Images
    for (let i = 0; i < p.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: p.images[i],
          altText: `${p.name} view ${i + 1}`,
          viewType: i === 0 ? 'front' : i === 1 ? 'detail' : 'drape',
          sortOrder: i,
        },
      });
    }

    // Create Hotspots
    for (const h of p.hotspots) {
      await prisma.productHotspot.create({
        data: {
          productId: createdProduct.id,
          label: h.label,
          spec: h.spec,
          xPos: h.xPos,
          yPos: h.yPos,
        },
      });
    }

    // Create Variants (Sizes 38, 40, 42, 44, 46, Bespoke for clothing)
    const sizes = p.category === 'Accessories' ? ['One Size'] : ['38', '40', '42', '44', '46', 'Bespoke'];
    for (const c of p.colors) {
      for (const size of sizes) {
        await prisma.productVariant.create({
          data: {
            productId: createdProduct.id,
            sku: `${p.sku}-${size}-${c.color.toUpperCase().replace(/\s+/g, '_')}`,
            size: size,
            color: c.color,
            colorHex: c.hex,
            priceAdjustment: size === 'Bespoke' ? 3500 : 0,
            inventoryCount: size === 'Bespoke' ? 50 : Math.floor(Math.random() * 8) + 4,
            lowStockThreshold: 3,
            barcode: `880${Math.floor(100000000 + Math.random() * 900000000)}`,
          },
        });
      }
    }

    // Create a Review
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        authorName: 'Farhan A. Khan',
        authorTitle: 'Banani Atelier Patron',
        rating: 5,
        comment: `The finish on this ${p.name} is nothing short of exceptional. The silk weight and the shoulder cut feel tailored for royalty. Outstanding Dhaka chauffeur service as well.`,
        isVerified: true,
      },
    });
  }

  // 5. Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'NOUVEAU10',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderAmount: 10000,
        maxDiscount: 5000,
        usageLimit: 100,
        usageCount: 14,
        isActive: true,
      },
      {
        code: 'SOVEREIGNVIP',
        discountType: 'FIXED',
        discountValue: 3000,
        minOrderAmount: 25000,
        maxDiscount: 3000,
        usageLimit: 50,
        usageCount: 8,
        isActive: true,
      },
      {
        code: 'EID2025',
        discountType: 'PERCENTAGE',
        discountValue: 15,
        minOrderAmount: 15000,
        maxDiscount: 8000,
        usageLimit: 200,
        usageCount: 42,
        isActive: true,
      },
    ],
  });

  // 6. Orders
  const sampleProducts = await prisma.product.findMany({ take: 3 });

  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'OD-DHAKA-8492',
      userId: patron.id,
      patronName: 'Asif Mahmud Chowdhury',
      patronEmail: 'asif@patron.oidulavai.com',
      patronPhone: '+8801711409822',
      shippingAddress: 'Penthouse B, Imperial Manor, Road 59, Gulshan 2, Dhaka',
      shippingCity: 'Dhaka',
      shippingZone: 'Banani / Gulshan / Uttara Metro Express',
      dispatchMethod: 'EXPRESS_CHAUFFEUR',
      doorstepTailorTrial: true,
      status: 'SHIPPED',
      paymentStatus: 'PAID',
      paymentMethod: 'BKASH',
      paymentTxnId: 'TRX-BKASH-994821',
      subtotal: 36800,
      discountAmount: 0,
      vatAmount: 2760, // 7.5%
      shippingFee: 0,
      totalAmount: 39560,
      currency: 'BDT',
      chauffeurName: 'Kabir Hossain',
      chauffeurVehicle: 'Mercedes-Benz Sprinter Atelier Van • Chha 11-4920',
      chauffeurPhone: '+880 1711-449200',
      trackingNode: 'MOHAKHALI_JUNCTION',
      etaText: 'Today, 7:30 PM (Guaranteed)',
      notes: 'Customer requested 2-size trial (Size 40 and 42) for doorstep fitting.',
    },
  });

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        productId: sampleProducts[0].id,
        title: sampleProducts[0].name,
        sku: 'PRD-101-40-MUSTARD',
        size: '40',
        color: 'Golden Mustard',
        unitPrice: 16800,
        quantity: 1,
        subtotal: 16800,
        monogramText: 'AMC',
        monogramThread: 'ANTIQUE_GOLD',
        textileSpec: 'Rajshahi Raw Silk • 220 GSM',
      },
      {
        orderId: order1.id,
        productId: sampleProducts[1].id,
        title: sampleProducts[1].name,
        sku: 'PRD-103-40-LAPIS',
        size: '40',
        color: 'Deep Lapis Navy',
        unitPrice: 20000,
        quantity: 1,
        subtotal: 20000,
        monogramText: 'AMC',
        monogramThread: 'ANTIQUE_GOLD',
        textileSpec: 'Micro Velvet & Mulberry Silk',
      },
    ],
  });

  await prisma.orderStatusHistory.createMany({
    data: [
      {
        orderId: order1.id,
        status: 'PENDING',
        title: 'Order Staged & Authenticated',
        note: 'Payment authorized via bKash Merchant Gateway.',
        createdAt: new Date(Date.now() - 3600 * 1000 * 4),
      },
      {
        orderId: order1.id,
        status: 'CONFIRMED',
        title: 'Loom & Master Tailor Allocation',
        note: 'Vault garments inspected and verified under Atelier lighting.',
        createdAt: new Date(Date.now() - 3600 * 1000 * 3),
      },
      {
        orderId: order1.id,
        status: 'PACKAGING',
        title: 'White-Glove Heirloom Packaging',
        note: 'Garments steamed, wrapped in mulmul muslin, and sealed in cedar chest.',
        createdAt: new Date(Date.now() - 3600 * 1000 * 2),
      },
      {
        orderId: order1.id,
        status: 'SHIPPED',
        title: 'Chauffeur In-Transit across Dhaka',
        note: 'Dispatched from Tejgaon Atelier via van Chha 11-4920.',
        createdAt: new Date(Date.now() - 3600 * 1000 * 1),
      },
    ],
  });

  // Second completed order
  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'OD-DHAKA-8480',
      userId: patron.id,
      patronName: 'Asif Mahmud Chowdhury',
      patronEmail: 'asif@patron.oidulavai.com',
      patronPhone: '+8801711409822',
      shippingAddress: 'Penthouse B, Imperial Manor, Road 59, Gulshan 2, Dhaka',
      shippingCity: 'Dhaka',
      shippingZone: 'Banani / Gulshan / Uttara Metro Express',
      dispatchMethod: 'EXPRESS_CHAUFFEUR',
      doorstepTailorTrial: false,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      paymentMethod: 'CARD',
      paymentTxnId: 'TRX-AMEX-441029',
      subtotal: 28500,
      discountAmount: 2850,
      vatAmount: 1923,
      shippingFee: 0,
      totalAmount: 27573,
      currency: 'BDT',
      couponCode: 'NOUVEAU10',
      chauffeurName: 'Rahmat Ali',
      chauffeurVehicle: 'Mercedes-Benz Sprinter Atelier Van • Chha 11-4920',
      chauffeurPhone: '+880 1711-449201',
      trackingNode: 'DELIVERED',
      etaText: 'Delivered Successfully',
      notes: 'Delivered and fitted at Gulshan residence.',
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order2.id,
      productId: sampleProducts[1].id,
      title: 'Imperial Raw Silk Sherwani',
      sku: 'PRD-102-40-NAVY',
      size: '40',
      color: 'Midnight Obsidian',
      unitPrice: 28500,
      quantity: 1,
      subtotal: 28500,
      monogramText: 'AMC',
      monogramThread: 'ANTIQUE_GOLD',
      textileSpec: 'Imperial Mulberry Silk • 340 GSM',
    },
  });

  await prisma.orderStatusHistory.createMany({
    data: [
      {
        orderId: order2.id,
        status: 'CONFIRMED',
        title: 'Order Confirmed',
        note: 'Payment received via Centurion Card.',
        createdAt: new Date(Date.now() - 3600 * 1000 * 48),
      },
      {
        orderId: order2.id,
        status: 'DELIVERED',
        title: 'Delivered & Doorstep Fitting Accepted',
        note: 'Signed by Patron at Gulshan residence.',
        createdAt: new Date(Date.now() - 3600 * 1000 * 24),
      },
    ],
  });

  // 7. Bespoke Appointment
  await prisma.bespokeAppointment.create({
    data: {
      userId: patron.id,
      patronName: 'Asif Mahmud Chowdhury',
      phone: '+8801711409822',
      email: 'asif@patron.oidulavai.com',
      salonLocation: 'BANANI_11_FLAGSHIP',
      occasion: 'ROYAL_WEDDING',
      appointmentDate: '2025-11-15',
      timeSlot: '04:00 PM – 05:30 PM',
      partySize: 3,
      notes: 'Private salon fitting for groom and two brothers. Requesting Tussar silk & Zardozi swatch deck.',
      status: 'CONFIRMED',
    },
  });

  // 8. Admin Log
  await prisma.adminActivityLog.create({
    data: {
      adminEmail: 'superadmin@oidulavai.com',
      action: 'SYSTEM_BOOTSTRAP',
      entityType: 'ATELIER_ENGINE',
      details: 'Initialized full production database with 9 heirloom garments, 54 variants, and sample orders.',
      ipAddress: '127.0.0.1',
    },
  });

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

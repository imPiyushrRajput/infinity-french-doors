// Site content for Infinity French Doors.
// Copy follows the content spec extracted from infinitywindoors.com, with the
// appendix issues fixed (spelling, broken links, duplicate headings, template leftovers).

export const IMG = "https://www.infinitywindoors.com/assets/front/images/";
export const UPL = "https://www.infinitywindoors.com/uploads/";

export const business = {
  brand: "Infinity French Doors",
  legalName: "Infinity Windoors Pvt Ltd",
  tagline: "open your emotions...",
  pageTitle: "Infinity French Doors in Nashik",
  phones: [
    { label: "+91 7711998585", href: "tel:+917711998585" },
    { label: "+91 7711998181", href: "tel:+917711998181" },
  ],
  email: "infinityfrenchdoors@gmail.com",
  plants: [
    {
      name: "Plant 1 · Nashik",
      city: "Nashik",
      address:
        "Plot No GEN 17/14, Behind State Bank Of India, Satpur, Nashik - 422007 (Near Sakal Circle)",
    },
    {
      name: "Plant 2 · Jalgaon",
      city: "Jalgaon",
      address: "F-58, near R.L.Square, MIDC Jalgaon - 425003",
    },
  ],
  youtubeEmbed: "https://www.youtube.com/embed/ekIOwNYAPHM",
  brochure: `${IMG}pdf/INFINITY BROCHURE-1.pdf`,
  logo: `${IMG}logo.webp`,
  mapEmbed:
    "https://www.google.com/maps?q=Infinity+French+Door,+Plot+No+GEN+17/14,+Satpur,+Nashik+422007&output=embed",
  social: {
    facebook: "https://www.facebook.com/",
    twitter: "https://twitter.com/",
    linkedin: "https://www.linkedin.com/",
    whatsapp: "https://wa.me/917711998585",
    youtube: "https://www.youtube.com/watch?v=ekIOwNYAPHM",
  },
};

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export type SubProduct = { title: string; image: string };

export type Product = {
  slug: string;
  title: string;
  heading: string;
  description: string;
  bullets?: { title: string; text: string }[];
  mainImage: string;
  cardImage: string;
  subProducts: SubProduct[];
};

export const products: Product[] = [
  {
    slug: "combination-doors",
    title: "Combination Doors",
    heading: "Stylish & Secure: Discover Our Range of Combination Doors",
    description:
      "At Infinity French Doors, our Combination Doors are the ultimate solution for modern spaces that demand both functionality and elegance. These doors are carefully crafted to combine features of different door types, such as French Doors, Sliding Doors, and Safety Doors, into a single, cohesive design. Whether you are looking for a door that enhances security, optimizes space, or elevates the aesthetics of your interiors, our Combination Doors are tailored to meet your specific needs. Built with premium quality materials and precision engineering, these doors offer exceptional strength, weather resistance, and long-lasting performance.",
    mainImage: `${UPL}product_category/1743139087_com-door.png`,
    cardImage: `${IMG}resources/pro2.png`,
    subProducts: [
      { title: "Glass Combination Doors", image: `${UPL}products/1743144111_comm.png` },
      { title: "Wood Combination Doors", image: `${UPL}products/1743144093_project-1-2.jpg` },
      { title: "Sliding Combination Doors", image: `${UPL}products/1743143932_project-1-3.jpg` },
    ],
  },
  {
    slug: "customise-doors",
    title: "Customise Doors",
    heading: "Customized Doors: Perfectly Tailored to Your Vision",
    description:
      "Customized doors are bespoke solutions designed to fit your exact specifications, blending functionality, style, and individuality. Whether for homes, offices, or commercial spaces, these doors are the ultimate choice for those seeking exclusivity and optimal performance.",
    bullets: [
      { title: "Unique Aesthetics", text: "Reflect your personal taste or brand identity." },
      { title: "Precise Fit", text: "Ideal for irregular spaces, non-standard openings, or special layouts." },
      { title: "Versatility", text: "Suitable for a range of applications, from main entrances to interior partitions." },
      { title: "Special Features", text: "Incorporate advanced features like soundproofing, fire resistance, or automation." },
    ],
    mainImage: `${UPL}product_category/1743140061_comb-door1.png`,
    cardImage: `${IMG}resources/pro3.png`,
    subProducts: [
      { title: "Customized Wooden Doors", image: `${UPL}products/1743147655_desiner1.png` },
      { title: "Customized Glass Doors", image: `${UPL}products/1743144259_comb-door3.png` },
      { title: "Customized Metal Doors", image: `${UPL}products/1743144173_comb-door4.png` },
    ],
  },
  {
    slug: "designer-doors",
    title: "Designer Doors",
    heading: "Elegant and Functional: Designer Doors for Every Space",
    description:
      "Designer Doors are premium, aesthetically appealing doors crafted to enhance the visual appeal of interiors and exteriors while ensuring functionality and durability. These doors are a perfect blend of artistic craftsmanship and cutting-edge technology, designed to make a bold statement in residential, commercial, or industrial spaces. Designer doors are exclusive doors characterized by their unique designs, patterns, and finishes. They go beyond traditional door designs, focusing on creativity and sophistication while retaining practicality. These doors are often customized to align with the overall décor and architectural theme of a space.",
    mainImage: `${UPL}product_category/1743140187_desiner1.png`,
    cardImage: `${IMG}resources/pro1.png`,
    subProducts: [
      { title: "Designer Wooden Doors", image: `${UPL}products/1743148005_comb-door2.png` },
      { title: "Designer Doors", image: `${UPL}products/1743147732_gw4.png` },
      { title: "Designer Metal Doors", image: `${UPL}products/1743147707_XXL2.png` },
    ],
  },
  {
    slug: "commercial-doors",
    title: "Commercial Doors",
    heading: "Commercial Doors for Every Business Need",
    description:
      "Commercial Doors are specialized doors designed to meet the demands of high-traffic, safety, and functional requirements in commercial and industrial environments. These doors are crafted for durability, security, and ease of use, making them ideal for a variety of applications such as offices, retail spaces, warehouses, and public buildings. Commercial doors are built to withstand frequent use, provide security, and meet regulatory standards for fire resistance, accessibility, and energy efficiency. They come in various materials and designs to suit different commercial needs and aesthetic preferences.",
    mainImage: `${UPL}product_category/1743142258_comm.png`,
    cardImage: `${IMG}resources/pro4.png`,
    subProducts: [
      { title: "Glass Doors", image: `${UPL}products/1743148120_comm.png` },
      { title: "Fire-Rated Doors", image: `${UPL}products/1743148103_project-1-2.jpg` },
      { title: "Rolling Shutter Doors", image: `${UPL}products/1743148057_comb-door3.png` },
    ],
  },
  {
    slug: "safety-doors",
    title: "Safety Doors",
    heading: "Stylish & Secure: Discover Our Range of Safety Doors",
    description:
      "Safety Doors are robust and secure doors designed to protect against unauthorized access, intrusion, and environmental factors. These doors prioritize security while maintaining functionality and aesthetic appeal, making them an essential feature for residential, commercial, and industrial spaces. Safety doors are specially constructed with high-quality materials and advanced locking mechanisms to ensure maximum protection. They are engineered to provide a secure barrier against potential threats while enhancing the overall appearance of the property.",
    mainImage: `${UPL}product_category/1743142336_desiner1.png`,
    cardImage: `${IMG}resources/pro5.png`,
    subProducts: [
      { title: "Designer Safety Doors", image: `${UPL}products/1743148268_mendt.jpg` },
      { title: "Fire-Rated Safety Doors", image: `${UPL}products/1743148243_window2.png` },
      { title: "Wooden Safety Doors with Grills", image: `${UPL}products/1743148226_afe.png` },
    ],
  },
  {
    slug: "french-windows",
    title: "French Windows",
    heading: "French Windows: A Perfect Blend of Style and Functionality",
    description:
      "French windows are traditionally large, glazed doors or windows that extend vertically, often reaching floor-to-ceiling height. They are usually designed in pairs and open inward or outward on hinges, creating a seamless connection between indoor and outdoor spaces. These windows often feature a grid of smaller panes separated by muntins (thin bars), adding a touch of elegance and sophistication. French windows are a statement of luxury and style. Their clean lines and expansive glass panes allow for a classic yet modern look. The large glass panels ensure that your interiors are bathed in natural light, reducing your reliance on artificial lighting and creating a bright, inviting ambiance.",
    mainImage: `${UPL}product_category/1743142443_window.png`,
    cardImage: `${IMG}resources/pro6.png`,
    subProducts: [
      { title: "Hinged French Windows", image: `${UPL}products/1743148328_mendt.jpg` },
      { title: "Sliding French Windows", image: `${UPL}products/1743148315_mendt.jpg` },
      { title: "Fixed French Windows", image: `${UPL}products/1743148287_comm.png` },
    ],
  },
  {
    slug: "garden-benches",
    title: "Garden Benches",
    heading: "Garden Benches: Comfort Meets Elegance",
    description:
      "Transform your outdoor spaces with our premium garden benches. Whether you're looking for a cozy corner to relax, a stylish addition to your garden, or durable seating for public spaces, our garden benches are designed to offer the perfect balance of functionality, durability, and aesthetics. Our garden benches are crafted from high-quality materials like RCC (Reinforced Cement Concrete), wood, or metal, ensuring they withstand harsh weather conditions and heavy use over time. From classic styles to contemporary looks, we offer a wide range of designs to match the theme of your garden or outdoor space. Ergonomically designed, our benches provide optimal comfort for lounging, reading, or enjoying the outdoors, with weather-resistant finishes.",
    mainImage: `${UPL}product_category/1743142474_banch4.png`,
    cardImage: `${IMG}resources/pro7.png`,
    subProducts: [
      { title: "RCC Garden Bench", image: `${UPL}products/1743148382_banch3.png` },
      { title: "Traditional Wooden Bench", image: `${UPL}products/1743148364_banch2.png` },
      { title: "Lutyens Wooden Bench", image: `${UPL}products/1743148351_banch4.png` },
    ],
  },
  {
    slug: "xxl-doors",
    title: "XXL Doors",
    heading: "XXL Doors: The Ultimate Fusion of Grandeur and Utility",
    description:
      "XXL Doors are more than just oversized doors. They are a design statement that brings luxury, functionality, and elegance to any space. These doors are tailored to create an impactful first impression while catering to modern architectural demands for larger, seamless openings. Whether used as entryways, room dividers, or patio doors, XXL doors redefine how we perceive and interact with spaces.",
    bullets: [
      { title: "Visual Impact", text: "The sheer size and design of XXL doors create a sense of grandeur, making them the centerpiece of any space." },
      { title: "Customization", text: "Available in a variety of materials, finishes, and designs to suit traditional, modern, or industrial styles." },
      { title: "Natural Light", text: "Large glass panels or frameless designs maximize natural light, enhancing the overall ambiance." },
    ],
    mainImage: `${UPL}product_category/1743142504_XXL1.png`,
    cardImage: `${IMG}resources/pro8.png`,
    subProducts: [
      { title: "Sliding XXL Doors", image: `${UPL}products/1743148432_XXL5.png` },
      { title: "Pivot XXL Doors", image: `${UPL}products/1743148414_XXL1.png` },
      { title: "Folding XXL Doors", image: `${UPL}products/1743148403_XXL5.png` },
    ],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  {
    label: "Projects",
    href: "/projects/completed-projects",
    children: [
      { label: "Upcoming Projects", href: "/projects/upcoming-projects" },
      { label: "Ongoing Projects", href: "/projects/ongoing-projects" },
      { label: "Completed Projects", href: "/projects/completed-projects" },
    ],
  },
  {
    label: "Products",
    href: "/products/doors",
    children: [
      { label: "All Doors", href: "/products/doors" },
      ...products.map((p) => ({ label: p.title, href: `/products/${p.slug}` })),
    ],
  },
  {
    label: "Gallery",
    href: "/gallery",
    children: [
      { label: "Images", href: "/gallery" },
      { label: "Videos", href: "/videos" },
    ],
  },
  { label: "Contact Us", href: "/contact-us" },
];

/* ------------------------------------------------------------------ */
/* Home page                                                           */
/* ------------------------------------------------------------------ */

export const heroSlides = [
  {
    eyebrow: "Welcome to Infinity French Doors",
    heading: "Design Your Dream House with Infinity French Doors",
    text: "Galvanised steel French doors and windows, powder coated to last a lifetime. Crafted in Nashik, delivered across India.",
    image: `${IMG}bg.png`,
  },
  {
    eyebrow: "Welcome to Infinity French Doors",
    heading: "Transform Your Views with Premium French Windows",
    text: "Floor-to-ceiling glass, slim profiles and maintenance-free frames that bring the outside in.",
    image: `${IMG}try.png`,
  },
];

export const aboutHome = {
  eyebrow: "About Infinity Doors",
  heading: "Your Trusted Partner in Door and Window Solutions",
  intro: "We bring 13 years of experience to every door and window we make.",
  points: ["Tailored Designs, Trusted Solutions", "Built to Last, Designed to Inspire"],
  body: "Since its establishment in 2012, Infinity French Doors has become a trusted name in providing a variety of high-quality products, including French Doors, Safety Doors, French Windows, Balcony Doors, Terrace Doors, Security Doors, Venetian Window Blinds, and PVC Doors and Windows. Crafted from premium raw materials and advanced machinery, our products are known for their rust resistance, strength, and durability. We offer these products at competitive prices, tailored to meet the specific needs and preferences of our customers.",
  image: `${IMG}resources/about-one-img-2.jpg`,
  counter: { value: 30000, label: "Successful Projects" },
};

export const features = [
  {
    title: "Premium Quality Materials",
    text: "Uses high-grade raw materials and advanced manufacturing techniques to ensure durability and long-lasting performance.",
    icon: "shield",
  },
  {
    title: "Customization Options",
    text: "Provides tailored solutions to meet specific customer requirements, including size, design, and functionality.",
    icon: "sliders",
  },
  {
    title: "Focus on Durability",
    text: "Ensures that all products are robust and built to withstand various environmental conditions.",
    icon: "layers",
  },
  {
    title: "Timely Delivery",
    text: "Ensures prompt and reliable delivery services to meet customer timelines effectively.",
    icon: "truck",
  },
] as const;

export const clientLogos = [
  "comp1.png",
  "comp-2.png",
  "comp-3.png",
  "comp4.png",
  "comp5.png",
  "com-7.png",
  "comp-8.png",
  "comp-9.png",
].map((f) => `${IMG}resources/${f}`);

export const whyChooseUs = {
  eyebrow: "Why Choose Us?",
  heading: "We Focus To Make Your Walls Beautiful",
  image: `${IMG}resources/why 1.png`,
  paragraphs: [
    "Situated in Maharashtra at Nashik and Jalgaon, we are centrally placed to distribute our products to all major cities like Mumbai, Pune, Chhatrapati Sambhajinagar, Ahmedabad, Vadodara, Indore and many more cities in the region. We are committed to providing an unmatched range of products to our customers, in customized options and at reasonable prices.",
    "Our firm is well acknowledged in the market for delivering reliable, quality products at a reasonable price. We work throughout Maharashtra and other states with ethical business dealings, and our highly skilled workers produce excellent quality products. We offer a qualitative range of galvanized steel doors and windows, which are perfect in dimension, looks, and aesthetics as well as great in stability.",
  ],
};

export const stats = [
  { value: 13, suffix: "+", label: "Years of Excellence" },
  { value: 30000, suffix: "+", label: "Happy Customers" },
  { value: 100000, suffix: "+", label: "Projects Completed" },
  { value: 518, suffix: "+", label: "Team Strength" },
];

export const networkStats = [
  { value: 14, suffix: "+", label: "Experience Centers" },
  { value: 2, suffix: "", label: "Manufacturing Plants" },
];

/** Google Maps directions to an address (opens the Maps app on phones). */
export const directionsUrl = (address: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

export const comparison = {
  columns: [
    "Aluminium Sliding Doors",
    "Fabricated Doors / Channel Gate",
    "Wooden",
    "Infinity French Doors & Windows",
  ],
  rows: [
    { type: "Material", values: ["Aluminium", "MS", "Wood, Ply", "Galvanised Sheet"] },
    { type: "Supplier", values: ["Local / Jindal", "Unknown", "Many more", "Tata, Jindal, Pasco"] },
    { type: "Strength", values: ["Average", "Strong", "Good", "—"] },
    { type: "Look", values: ["Poor look", "Best look", "—", "—"] },
    { type: "Opening", values: ["60%", "100%", "—", "—"] },
    {
      type: "Maintenance",
      values: [
        "Track cleaning",
        "Rusting, recolour",
        "Repolish, bends as per weather condition",
        "Maintenance free as GI material & PP powder coating",
      ],
    },
    {
      type: "Obstacle",
      values: [
        "2/3/4 track at tiles level",
        "Sliding track in case of channel gate",
        "Wooden track required",
        "No track required if fitted before tiling",
      ],
    },
    {
      type: "Window provision",
      values: [
        "Door itself treated as window",
        "Yes, with poor look",
        "Yes, but much more expensive",
        "Yes, 1/2/3/4 windows can be placed as per your requirement",
      ],
    },
    { type: "Mosquito net", values: ["Yes", "No", "Yes, with 100% opening", "—"] },
    {
      type: "Lock",
      values: ["Poor quality", "Local handmade", "Costly locks can be used", "SS aldrop / 2-way mortice lock"],
    },
    { type: "Safety with beauty", values: ["Only beauty", "Only safety", "—", "—"] },
    {
      type: "Colour",
      values: ["Powder coating / anodizing", "Paint", "Expensive polish", "Pure polyester powder coating"],
    },
    {
      type: "Tower bolt & safety knob",
      values: [
        "No provision for extra safety",
        "Local handmade",
        "Surface tower bolt",
        "SS concealed tower bolt with safety knob",
      ],
    },
    {
      type: "Safety bars",
      values: [
        "No provision",
        "Local bars or bright bars with welding spots",
        "Can be inserted in wood",
        "Bright bars with CO2 welding, well finished",
      ],
    },
    {
      type: "Glass replacement",
      values: ["Not easy, needs a professional", "Easy, can be replaced at home", "—", "—"],
    },
    { type: "Fire", values: ["Combustible", "Non-combustible", "Easily combustible", "—"] },
  ],
};

export const homeProjects = [
  {
    title: "Customized Luxury Design",
    text: "Crafting personalized door and window solutions tailored to unique architectural needs.",
    image: `${IMG}project/project-1-1.jpg`,
  },
  {
    title: "Modern Home Transformation",
    text: "Enhancing residential spaces with elegant French Doors and Windows, blending style and security seamlessly.",
    image: `${IMG}project/project-1-2.jpg`,
  },
  {
    title: "Commercial Space Upgrade",
    text: "Delivering durable and sophisticated door solutions for offices, ensuring functionality with aesthetics.",
    image: `${IMG}project/project-1-3.jpg`,
  },
];

export const testimonials = {
  eyebrow: "Testimonials",
  heading: "What Our Clients Say",
  intro:
    "Discover how Infinity French Doors has transformed spaces and exceeded expectations. Hear from our satisfied customers about their experience with our premium products and exceptional service.",
  items: [
    {
      quote:
        "From consultation to installation, the process was seamless. The craftsmanship of their French Windows is outstanding!",
      name: "Rajesh Nair",
      role: "Architect",
    },
    {
      quote:
        "Infinity French Doors provided us with custom solutions that perfectly matched our office aesthetic. Their attention to detail is truly commendable.",
      name: "Amit Mehra",
      role: "Interior Designer",
    },
    {
      quote:
        "The team at Infinity French Doors exceeded our expectations with their high-quality doors and timely delivery. Our home feels more elegant and secure than ever!",
      name: "Priya Sharma",
      role: "Homeowner",
    },
    {
      quote:
        "Our balcony doors from Infinity French Doors have added a modern touch to our apartment. Couldn't be happier with the results!",
      name: "Sunita Desai",
      role: "Apartment Owner",
    },
  ],
};

export const faqs = [
  {
    q: "What types of doors and windows do you offer?",
    a: "We provide a wide range of French Doors, Safety Doors, French Windows, Balcony Doors, Terrace Doors, and Security Doors, all crafted to suit your unique needs.",
  },
  {
    q: "Are your products customizable?",
    a: "Yes, we offer fully customizable solutions to match your specific design and functional requirements.",
  },
  {
    q: "How can I make a change to my order?",
    a: "Call us or email us with your order details as early as possible. Changes to size, design or finish can be accommodated before manufacturing begins; our team will confirm the revised timeline and any cost difference with you.",
  },
  {
    q: "What materials are used in your products?",
    a: "Our products are made using high-quality, rust-proof materials to ensure durability and long-lasting performance.",
  },
  {
    q: "Do you provide installation services?",
    a: "Yes, we offer professional installation services to ensure your doors and windows are fitted perfectly.",
  },
  {
    q: "Do you provide product safety for customers?",
    a: "Yes, at Infinity Windoors Pvt Ltd, we ensure that all our products meet high safety standards. Our doors and windows are designed with durable materials, advanced locking systems, and weather resistance to provide maximum security and longevity.",
  },
  {
    q: "Do your doors open perfectly?",
    a: "Absolutely! Our doors are precision-engineered for smooth and effortless operation. We use high-quality hinges, tracks, and fittings to ensure seamless opening and closing, providing customers with the best user experience.",
  },
];

export const presenceMap = `${IMG}project/location.png`;

/* ------------------------------------------------------------------ */
/* About page                                                          */
/* ------------------------------------------------------------------ */

export const aboutPage = {
  headerImage: `${IMG}resources/about-up.png`,
  welcome: {
    heading: "Innovative Door and Window Solutions by Infinity French Doors",
    image: `${IMG}backgrounds/office2.png`,
    paragraphs: [
      "Infinity French Doors has earned a reputation as a trusted provider of a premium range of products. With a state-of-the-art infrastructure equipped with advanced tools and machinery, we ensure smooth and efficient operations. Our dedicated team works tirelessly to deliver products that meet customer expectations. To ensure complete satisfaction, we offer customized solutions tailored to individual needs.",
      "Our products are highly appreciated by customers for their superior quality and timely delivery. Every product undergoes rigorous quality testing before reaching our clients, ensuring reliability and excellence. Our customer-centric approach and ethical business practices have helped us build a strong and loyal customer base nationwide.",
      "Under the visionary leadership of Mr. Dhiraj Mahajan and Mr. Ashish Shinkar, Infinity French Doors has become a well-respected name in the industry. Their deep market knowledge, dedication, and hard work enable us to consistently provide high-quality products, keeping our customers happy and delighted.",
    ],
  },
  vision: {
    eyebrow: "Our Path to Becoming the Industry Leader",
    heading: "Our Vision and Mission",
    items: [
      {
        title: "Our Vision",
        text: "Our vision is to deliver Infinity products across India and beyond, generating employment opportunities not just by selling products, but also by providing exceptional service. We aim to innovate continuously, discovering new products that meet customer needs.",
      },
      {
        title: "Our Mission",
        text: "To be the preferred provider of top-quality French doors and windows, dedicated to ensuring customer satisfaction.",
      },
    ],
  },
  leadership: [
    {
      name: "Mr. Ashish Shinkar",
      role: "Co-Founder, Infinity Windoors Private Limited",
      image: `${IMG}brand/founder.png`,
      text: "Mr. Ashish Shinkar is the co-founder of Infinity Windoors Private Limited and plays an important role in the company's success. He has great leadership skills and a strong understanding of business. He manages the company's operations well and focuses on creating strategies that keep customers happy. Mr. Shinkar is good at solving problems and has a clear vision for the future. He makes sure that everything in the company follows its goal of providing high-quality products and services. He also supports a workplace that values diversity and inclusion. Mr. Shinkar believes in listening to customers, being honest in communication, and building long-term relationships. His hard work and passion have helped lay a strong foundation for the company's future growth.",
    },
    {
      name: "Mr. Dhiraj Yuvaraj Mahajan",
      role: "Co-Founder, Infinity Windoors Private Limited",
      image: `${IMG}brand/founder3.png`,
      text: "Mr. Dhiraj Yuvaraj Mahajan is the Co-Founder of Infinity Windoors Private Limited. With a strong background in business and a passion for innovation, he has played a crucial role in shaping the company's vision and driving its success. He is responsible for overseeing key business functions, building effective strategies, and ensuring smooth operations. Mr. Mahajan is known for his practical approach to problem-solving and his ability to lead teams with confidence and clarity. He focuses on delivering value to customers through quality products and dependable service. His commitment to customer satisfaction, transparency, and long-term business relationships has helped Infinity Windoors establish a solid reputation in the industry.",
    },
    {
      name: "Ms. Manisha Shinkar",
      role: "Accounts & Finance Director, Infinity Windoors Private Limited",
      image: `${IMG}brand/founder2.png`,
      text: "Ms. Manisha Shinkar serves as the Accounts & Finance Director at Infinity Windoors Private Limited. With her strong background in financial management and accounting, she plays a key role in overseeing the company's financial health and ensuring smooth financial operations. She is responsible for managing budgets, monitoring cash flow, handling audits, and ensuring compliance with financial regulations. Ms. Shinkar brings a detail-oriented approach and a deep understanding of finance, which helps the company make informed and strategic business decisions. Her commitment to accuracy, transparency, and efficiency has made her a valuable asset to the organization, contributing significantly to the company's stability and long-term growth.",
    },
    {
      name: "Ms. Rupali Mahajan",
      role: "Accounts & Finance Director, Infinity Windoors Private Limited",
      image: `${IMG}rupali1.webp`,
      text: "Ms. Rupali Mahajan is the Accounts & Finance Director at Infinity Windoors Private Limited. She plays an important role in managing the company's finances and keeping everything well-organized. Her work includes handling budgets, checking expenses, managing accounts, and making sure all financial records are accurate and up to date. She also ensures the company follows all financial rules and regulations. With her careful and responsible approach, Ms. Mahajan helps the company make smart financial decisions and supports its growth. Her dedication and hard work make her a valuable part of the team.",
    },
  ],
  timeline: {
    eyebrow: "Our Legacy",
    heading: "The Remarkable Journey of Infinity French Doors: From Inception to Excellence",
    items: [
      {
        year: "2012",
        title: "Inception of Infinity Enterprises",
        text: "Infinity Enterprises was established with a clear vision: to provide high-quality French Doors, Safety Doors, and related products that combine durability, strength, and elegance. With a small yet dedicated team, we began our journey in the market, committed to customer satisfaction and product excellence.",
      },
      {
        year: "2014",
        title: "Expanding Our Product Range",
        text: "By 2014, we introduced Balcony Doors, Terrace Doors, and French Windows into our catalog. Using premium materials and advanced manufacturing processes, we quickly gained recognition for our superior craftsmanship and innovative designs.",
      },
      {
        year: "2016",
        title: "Incorporating Security Solutions",
        text: "Recognizing the need for enhanced safety, we launched a range of Security Doors and Venetian Window Blinds. This addition allowed us to serve a broader market, offering products that seamlessly blended aesthetics with security.",
      },
      {
        year: "2018",
        title: "State-of-the-Art Infrastructure",
        text: "To keep up with increasing demand, we invested in state-of-the-art infrastructure equipped with the latest tools and machinery. This upgrade enabled us to enhance production efficiency, maintain quality standards, and deliver bulk orders without compromising timelines.",
      },
    ],
  },
  highlights: {
    eyebrow: "News & Updates",
    heading: "Our Office Highlights",
    intro:
      "At Infinity French Doors, we take pride in our modern infrastructure and work environment that reflects our commitment to excellence. Here are some key highlights of our office and facilities.",
    items: [
      { title: "State-of-the-Art Infrastructure", image: `${IMG}resources/h1.png` },
      { title: "Well-Organized Workspace", image: `${IMG}resources/h2.png` },
      { title: "Product Display Area", image: `${IMG}resources/h3.png` },
      { title: "Dedicated Team", image: `${IMG}resources/h4.png` },
      { title: "Quality Control Department", image: `${IMG}resources/h5.png` },
      { title: "Client-Friendly Environment", image: `${IMG}resources/h6.png` },
    ],
  },
  process: {
    eyebrow: "6 easy steps",
    heading: "Our Work Process",
    steps: [
      {
        title: "Initial Consultation",
        text: "We begin by understanding your requirements, preferences, and project specifications through a detailed consultation to ensure the perfect solution.",
      },
      {
        title: "Site Assessment and Measurements",
        text: "Our team conducts a thorough site visit to take precise measurements and evaluate specific installation needs.",
      },
      {
        title: "Design and Customization",
        text: "Based on your inputs and site requirements, we craft innovative and customized designs that blend functionality with aesthetics.",
      },
      {
        title: "Material Selection and Manufacturing",
        text: "Using premium-grade raw materials and advanced technology, we manufacture products with precision, focusing on durability.",
      },
      {
        title: "Quality Inspection and Testing",
        text: "Every product undergoes rigorous quality checks to ensure it meets industry standards and exceeds customer expectations.",
      },
      {
        title: "Delivery and Professional Installation",
        text: "We ensure safe and timely delivery of products, followed by seamless installation performed by our skilled team for a perfect finish.",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type ProjectPage = {
  slug: string;
  title: string;
  intro: string;
  items: { title: string; image: string }[];
};

export const projectPages: ProjectPage[] = [
  {
    slug: "upcoming-projects",
    title: "Upcoming Projects",
    intro: "A preview of the designs and developments we are preparing to bring to life.",
    items: [
      { title: "GreenSpace Living: Eco-Friendly PVC Doors", image: `${UPL}projects/1740644628_why.png` },
      { title: "Shaping Tomorrow's Living Spaces", image: `${UPL}projects/1740644783_comb-door1.png` },
      { title: "Future-Ready Designs: Projects in the Pipeline", image: `${UPL}projects/1740644757_window1.png` },
    ],
  },
  {
    slug: "ongoing-projects",
    title: "Ongoing Projects",
    intro: "Work currently in progress across homes, offices and commercial spaces.",
    items: [
      { title: "In Progress: Turning Visions into Reality", image: `${UPL}projects/1740644841_ongoing1.png` },
      { title: "Works in Motion: Building Today for a Better Tomorrow", image: `${UPL}projects/1740644815_about-page1.png` },
    ],
  },
  {
    slug: "completed-projects",
    title: "Completed Projects",
    intro: "A selection of the spaces we have transformed with our doors and windows.",
    items: [
      { title: "Crafting Dreams: Projects We've Brought to Life", image: `${UPL}projects/1740644916_about-slider2.png` },
      { title: "Proud Achievements: Completed Masterpieces", image: `${UPL}projects/1740644885_about-page1.png` },
      { title: "Elegant Entrances, Beautifully Finished", image: `${UPL}projects/1740644871_about-one-small-img.jpg` },
    ],
  },
];

export const getProjectPage = (slug: string) => projectPages.find((p) => p.slug === slug);

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

export const galleryCategories = [
  { slug: "all", label: "All" },
  { slug: "doors", label: "Doors" },
  { slug: "french-windows", label: "French Windows" },
  { slug: "garden-benches", label: "Garden Benches" },
  { slug: "xxl-doors", label: "XXL Doors" },
];

export const galleryItems = [
  { src: `${UPL}gallery/1740637319_g1.png`, category: "doors", alt: "Designer safety door" },
  { src: `${UPL}gallery/1740637508_g2.png`, category: "doors", alt: "Combination door" },
  { src: `${UPL}gallery/1740637538_g9.png`, category: "french-windows", alt: "French window" },
  { src: `${UPL}gallery/1740637563_g7.png`, category: "garden-benches", alt: "Garden bench" },
  { src: `${UPL}gallery/1740637570_g6.png`, category: "xxl-doors", alt: "XXL door" },
  // Additional imagery from the product catalogue so the gallery feels complete.
  { src: `${UPL}products/1743144111_comm.png`, category: "doors", alt: "Glass combination door" },
  { src: `${UPL}products/1743148268_mendt.jpg`, category: "doors", alt: "Designer safety door" },
  { src: `${UPL}products/1743148243_window2.png`, category: "french-windows", alt: "French window with grill" },
  { src: `${UPL}products/1743148364_banch2.png`, category: "garden-benches", alt: "Traditional wooden bench" },
  { src: `${UPL}products/1743148351_banch4.png`, category: "garden-benches", alt: "Lutyens wooden bench" },
  { src: `${UPL}products/1743148414_XXL1.png`, category: "xxl-doors", alt: "Pivot XXL door" },
  { src: `${UPL}products/1743147707_XXL2.png`, category: "xxl-doors", alt: "Designer metal XXL door" },
];

export const videos = [
  {
    title: "Transform Your Space with Premium French Doors",
    embed: business.youtubeEmbed,
    thumb: "https://img.youtube.com/vi/ekIOwNYAPHM/hqdefault.jpg",
  },
];

export const DEFAULT_SERVICES = [
  { title: "Events", title_te: "ఈవెంట్స్", icon: "🎉", description: "Corporate events, birthday parties, cultural programs — captured with precision and energy.", description_te: "కార్పొరేట్ ఈవెంట్లు, పుట్టినరోజులు — అన్నీ అద్భుతంగా చిత్రీకరించబడతాయి.", price: "Starting ₹8,000", image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=75", display_order: 1, active: true },
  { title: "Marriages", title_te: "వివాహాలు", icon: "💒", description: "Full wedding day coverage — from mehendi to reception, every ritual immortalized.", description_te: "మెహందీ నుండి రిసెప్షన్ వరకు — ప్రతి అడుగు చిరస్మరణీయంగా.", price: "Starting ₹25,000", image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=75", display_order: 2, active: true },
  { title: "Pre Wedding Songs", title_te: "ప్రీ-వెడ్డింగ్ సాంగ్స్", icon: "💑", description: "Cinematic pre-wedding song shoots at stunning locations with professional direction.", description_te: "అందమైన లొకేషన్లలో సినిమాటిక్ ప్రీ-వెడ్డింగ్ షూట్.", price: "Starting ₹15,000", image_url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=75", display_order: 3, active: true },
  { title: "Wedding Video & Photos", title_te: "వెడ్డింగ్ వీడియో & ఫోటోలు", icon: "🎬", description: "Complete wedding video + photo package with cinematic editing and same-day highlights.", description_te: "సినిమాటిక్ ఎడిటింగ్‌తో సంపూర్ణ వెడ్డింగ్ వీడియో & ఫోటో ప్యాకేజీ.", price: "Starting ₹35,000", image_url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=75", display_order: 4, active: true },
  { title: "Cinematography Video", title_te: "సినిమాటోగ్రఫీ వీడియో", icon: "🎥", description: "Hollywood-style cinematic videos for your wedding — drone shots, slow-mo, color graded.", description_te: "హాలీవుడ్ స్టైల్ సినిమాటిక్ వీడియోలు — డ్రోన్, స్లో-మో, కలర్ గ్రేడ్.", price: "Starting ₹20,000", image_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=75", display_order: 5, active: true },
  { title: "Candid Photography", title_te: "కాండిడ్ ఫొటోగ్రఫీ", icon: "📸", description: "Natural, unposed, emotional — capturing genuine smiles and tears with artistic frames.", description_te: "సహజమైన, భావోద్వేగ క్షణాలను కళాత్మకంగా చిత్రీకరించడం.", price: "Starting ₹10,000", image_url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=75", display_order: 6, active: true },
  { title: "Baby Shoots", title_te: "బేబీ షూట్స్", icon: "👶", description: "Precious newborn and toddler shoots in studio or outdoor with themed setups.", description_te: "స్టూడియో లేదా అవుట్‌డోర్‌లో పసివాళ్ళ అద్భుతమైన ఫోటోషూట్.", price: "Starting ₹5,000", image_url: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=75", display_order: 7, active: true },
  { title: "Gift Articles", title_te: "గిఫ్ట్ ఆర్టికల్స్", icon: "🎁", description: "Custom photo gifts — albums, framed prints, mugs, canvases and more for all occasions.", description_te: "కస్టమ్ ఫోటో గిఫ్ట్‌లు — ఆల్బమ్‌లు, ఫ్రేమ్‌లు, మగ్‌లు, కాన్వాస్.", price: "Starting ₹500", image_url: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&q=75", display_order: 8, active: true },
  { title: "Drone", title_te: "డ్రోన్", icon: "🚁", description: "Breathtaking aerial coverage of your event venue, procession, and outdoor ceremonies.", description_te: "మీ వేడుక వేదిక యొక్క అద్భుతమైన ఏరియల్ కవరేజ్.", price: "Starting ₹12,000", image_url: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&q=75", display_order: 9, active: true },
];

export const DEFAULT_GALLERY = [
  { image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=75", category: "wedding", caption: "Wedding Ceremony", display_order: 1, active: true },
  { image_url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=75", category: "prewedding", caption: "Pre-Wedding Shoot", display_order: 2, active: true },
  { image_url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=75", category: "wedding", caption: "Bridal Portrait", display_order: 3, active: true },
  { image_url: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=75", category: "drone", caption: "Aerial View", display_order: 4, active: true },
  { image_url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=75", category: "candid", caption: "Candid Laugh", display_order: 5, active: true },
  { image_url: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=75", category: "baby", caption: "Baby Shoot", display_order: 6, active: true },
  { image_url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=75", category: "wedding", caption: "Wedding Reception", display_order: 7, active: true },
  { image_url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=75", category: "prewedding", caption: "Pre-Wedding Film", display_order: 8, active: true },
  { image_url: "https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=800&q=75", category: "candid", caption: "Candid Moment", display_order: 9, active: true },
  { image_url: "https://images.unsplash.com/photo-1529636444744-adffc9135a5e?w=800&q=75", category: "wedding", caption: "Wedding Portrait", display_order: 10, active: true },
  { image_url: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=800&q=75", category: "baby", caption: "Cute Baby", display_order: 11, active: true },
  { image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=75", category: "wedding", caption: "Grand Event", display_order: 12, active: true },
];

export const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
  "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920&q=80",
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1920&q=80",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1920&q=80",
];

export const TESTIMONIALS = [
  { name: "Priya & Ravi", event: "Wedding – March 2025", text: "JS Photography captured every emotion of our wedding beautifully. The drone shots were absolutely stunning! Dharma Rao garu and team are incredible.", stars: 5 },
  { name: "Lalitha Devi", event: "Baby Shoot 2024", text: "Our little one's shoot was magical. The team made the baby feel comfortable and the photos turned out beyond our expectations.", stars: 5 },
  { name: "Venkata Suresh", event: "Pre-Wedding 2025", text: "The cinematic pre-wedding video they made for us looked like a Tollywood movie trailer! Everyone in our family loved it.", stars: 5 },
  { name: "Meera & Kiran", event: "Wedding 2024", text: "Excellent team, affordable prices, and outstanding quality. They covered our entire 3-day wedding and every photo is frame-worthy.", stars: 5 },
  { name: "Ramakrishna Rao", event: "Corporate Event", text: "Professional, punctual, and creative. The event coverage photos were used in our company brochure. Will definitely hire again.", stars: 5 },
  { name: "Sravani", event: "Candid Photography", text: "I wanted natural, unposed photos — and that is exactly what I got! The candid shots captured the true essence of our wedding day.", stars: 5 },
];

export const BUSINESS = {
  name: "JS Photography",
  owner: "M. Dharma Rao",
  phone1: "9492070597",
  phone2: "9491365499",
  email: "jsphotography8488@gmail.com",
  address: "Mangalavaari Peta, Rajahmundry",
  timings: "9:30 AM – 9:00 PM (Daily)",
  youtube: "https://www.youtube.com/results?search_query=js+photography+events",
  instagram: "https://www.instagram.com/j_s__photography___",
  whatsapp: "https://wa.me/919492070597?text=Hello%20JS%20Photography!%20I%20want%20to%20book%20your%20services.",
};

-- Supabase SQL Migration: Seed Nationwide India Places
-- Generated: 2026-10-24T12:35:26.767Z


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'qutub-minar-delhi', 'Qutub Minar', 'attraction', 'Heritage Monument', 'Delhi', 'New Delhi',
  'New Delhi, Delhi, India', 28.5245, 77.1855, 'The Qutb Minar, also spelled Qutub Minar and Qutab Minar, is a minaret and victory tower, built during the Delhi sultanate, and comprising the Qutb complex, a UNESCO World Heritage Site in Mehrauli, South Delhi, India. It was mostly built between 1199 and 1220, contains 399 steps, and is one of the most frequented heritage spots in the city. After defeating Prithviraj Chauhan, the last Hindu ruler of Delhi before the Ghurid conquest of the region, Qutab-ud-din Aibak initiated the construction of the victory tower, but only managed to finish the first level. It was to mark the beginning of Islamic rule in the region. Successive dynasties of the Delhi Sultanate continued the construction, and, in 1368, Firuz Shah Tughlaq rebuilt the top parts and added a cupola.',
  '["Bags and tripods subject to security scanning","Climbing tower interior strictly prohibited","Entry ticket mandatory at gate"]'::jsonb, 40, 'per person', 'Sunrise to Sunset daily (approx. 7:00 AM - 6:00 PM)', 'October to March (cool sunny days)',
  ARRAY['UNESCO World Heritage','Indo-Islamic Architecture','Minaret','History'], 'Q185298', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Qutb_Minar_2022.jpg/3840px-Qutb_Minar_2022.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3947, 5966, '5691881c50468e4ad6f4ae0d06d8924e8f94578cfba9352774fccf329fcefa9a', true, false
FROM public.places WHERE slug = 'qutub-minar-delhi'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'red-fort-delhi', 'Red Fort', 'attraction', 'Heritage Fort', 'Delhi', 'Old Delhi',
  'Old Delhi, Delhi, India', 28.6562, 77.241, 'The Red Fort is a historic Mughal fort located in the Old Delhi area of Delhi, India. Serving as the main residence of the Mughal emperors, it was commissioned by Emperor Shah Jahan on the 12th of May 1639; the fort was constructed following his decision to shift the Mughal capital from Agra to Delhi. Originally adorned in red and white, the fort''s design is attributed to Ustad Ahmad Lahori, the architect of the Taj Mahal. The Red Fort is a prominent example of Mughal architecture from Shah Jahan''s reign, combining Persian and Indian architectural styles.',
  '["Closed every Monday","Sound and Light show requires separate ticket","Drone photography strictly prohibited"]'::jsonb, 50, 'per person', '9:30 AM - 4:30 PM (Closed on Mondays)', 'October to March',
  ARRAY['Mughal Architecture','UNESCO World Heritage','Historic Fort','Delhi'], 'Q122434', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Delhi_fort.jpg/3840px-Delhi_fort.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4242, 1949, 'e1e897950d5136785e0e2830db591b83a701f70f62f12e676ee1e887d5116185', true, false
FROM public.places WHERE slug = 'red-fort-delhi'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'humayuns-tomb-delhi', 'Humayun''s Tomb', 'attraction', 'Heritage Monument', 'Delhi', 'New Delhi',
  'New Delhi, Delhi, India', 28.5933, 77.2507, 'Humayun''s tomb is the tomb of the Mughal Emperor Humayun located in Delhi, India. The tomb was commissioned by Humayun''s first wife and chief consort, Empress Bega Begum, under her patronage in 1558, and designed by the Persian architects Mirak Mirza Ghiyas and his son, Sayyid Muhammad, whom she personally chose. It was the first garden-tomb on the Indian subcontinent, and is located in Nizamuddin East, Delhi, close to the Dina-panah Citadel, also known as Purana Qila, that Humayun founded in 1538. It was also the first structure to use red sandstone at such a scale.',
  '["Stay on designated pathways in Charbagh garden","Footwear removal required inside inner tomb chamber"]'::jsonb, 40, 'per person', '6:00 AM - 6:00 PM daily', 'Late afternoon in winter for golden hour',
  ARRAY['UNESCO World Heritage','Charbagh Garden','Mughal Architecture'], 'Q191484', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Tomb_of_Humayun%2C_Delhi.jpg/3840px-Tomb_of_Humayun%2C_Delhi.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  5294, 1788, 'a531493e56c6c6f5af8896904fdd3d8536cbf772bacd5f1de1d3ee1340ab9fe2', true, true
FROM public.places WHERE slug = 'humayuns-tomb-delhi'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'india-gate-delhi', 'India Gate', 'attraction', 'War Memorial', 'Delhi', 'New Delhi',
  'New Delhi, Delhi, India', 28.6129, 77.2295, 'The India Gate is a war memorial arch that’s located near the Rajpath on the eastern edge of the "ceremonial axis" of New Delhi, India. It stands as a memorial to exactly 74,187 Indian soldiers of the British Indian Army who died between 1914 and 1921 during the First World War, in places like France, Flanders, Mesopotamia, Persia, East Africa, Gallipoli, in the Near and Far East, and the 1919 Third Anglo-Afghan War. Around 13,300 British servicemen''s names, including some soldiers and officers from the United Kingdom, are also inscribed onto the gate. Designed by architect sir Edwin Lutyens, the gate evokes the architectural style of the ancient Roman triumphal arches, such as the Arch of Constantine in Rome, Italy and later memorial arches; it is often compared to the Arc de Triomphe in Paris, France and the Gateway of India in Mumbai, India.',
  '["No crossing perimeter security barriers around Amar Jawan Jyoti","Littering strictly fined on Kartavya Path"]'::jsonb, 0, 'free entry', 'Open 24 hours daily', 'Evening (illuminated lighting)',
  ARRAY['Memorial','Kartavya Path','National Landmark','Architecture'], 'Q192770', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/3/3b/India_Gate_front.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3456, 3771, '46668c176bc4e189c8d748d30b1c1ae594919aec687e09348ad63687140a38b6', true, true
FROM public.places WHERE slug = 'india-gate-delhi'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'lotus-temple-delhi', 'Lotus Temple', 'attraction', 'Spiritual', 'Delhi', 'New Delhi',
  'New Delhi, Delhi, India', 28.5535, 77.2588, 'The Lotus Temple, also known as the Baháʼí House of Worship, New Delhi, is a Baháʼí House of Worship at Bahapur in south Delhi, India. Designed by the architect Fariborz Sahba, it takes the form of a half-open lotus of 27 free-standing marble-clad concrete petals, arranged in three rings of nine around a central hall. It was dedicated on 24 December 1986 and opened to the public on 1 January 1987.',
  '["Absolute silence inside prayer hall","Footwear must be deposited at token counter","Closed on Mondays"]'::jsonb, 0, 'free entry', '8:30 AM - 5:00 PM (Closed on Mondays)', 'Winter afternoons',
  ARRAY['Bahai Faith','Modern Architecture','Meditation','Peace'], 'Q208470', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/f/fc/LotusDelhi.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1014, 626, '03b21d861bcbe888c444748416f5a233aaa48cdeb3f58e264fcaa6366c8c9576', true, true
FROM public.places WHERE slug = 'lotus-temple-delhi'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'akshardham-delhi', 'Swaminarayan Akshardham', 'attraction', 'Spiritual', 'Delhi', 'New Delhi',
  'New Delhi, Delhi, India', 28.6127, 77.2773, 'Swaminarayan Akshardham is a Hindu temple and campus in Delhi, India. The temple is close to the border with Noida. Also known as Akshardham Temple or Akshardham Delhi, the complex displays traditional and modern Hindu culture and architecture. Inspired by Yogiji Maharaj and created by Pramukh Swami Maharaj, it was constructed by BAPS. It is the world''s second-largest BAPS Hindu temple, following Akshardham, New Jersey, in the United States.',
  '["Electronic devices and mobile phones prohibited on premises (free locker available)","Strict modest dress code"]'::jsonb, 0, 'free temple entry', '10:00 AM - 6:30 PM (Closed on Mondays)', 'Afternoon leading into Sahaj Anand water show at dusk',
  ARRAY['Hindu Temple','Ornate Carvings','Cultural Center','Water Show'], 'Q597394', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/c/c2/New_Delhi_Temple.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  800, 600, '6a243614437540a62aa19ecd7e14c36511a394dc868b04e970af969ad0d63cc4', true, false
FROM public.places WHERE slug = 'akshardham-delhi'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'jama-masjid-delhi', 'Jama Masjid', 'attraction', 'Heritage Monument', 'Delhi', 'Old Delhi',
  'Old Delhi, Delhi, India', 28.6507, 77.2334, 'The Masjid-i-Jehan-Numa, commonly known as the Jama Masjid, in Old Delhi area of Delhi, is one of the largest mosques in India. Its builder was the Mughal emperor Shah Jahan, between 1644 and 1656, and it was inaugurated by its first Imam, Syed Abdul Ghafoor Shah Bukhari. Situated in the Mughal capital of Shahjahanabad, it served as the imperial mosque of the Mughal emperors until the demise of the empire in 1857. The Jama Masjid was regarded as a symbolic gesture of Mughal power across India. It was also a site of political significance during several key periods of British rule. It remains in active use, and is one of Delhi''s most iconic sites, closely identified with the methods of Old Delhi. The mosque structure is a Monument of National Importance.',
  '["Robes available at entrance if clothing is above knees or shoulders","Camera pass fee applicable for photography"]'::jsonb, 0, 'free entry', '7:00 AM - 12:00 PM, 1:30 PM - 6:30 PM daily (closed during namaz for non-Muslim visitors)', 'Morning before noon prayer',
  ARRAY['Mughal Mosque','Historic Old Delhi','Courtyard'], 'Q233405', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Jama_Masjid_-_In_the_Noon.jpg/3840px-Jama_Masjid_-_In_the_Noon.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3872, 2592, '5bf985e73448714290aa31e327fd137ab8f86855d2641519272c08d78a1df148', true, true
FROM public.places WHERE slug = 'jama-masjid-delhi'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'the-imperial-hotel-delhi', 'The Imperial New Delhi', 'stay', 'Luxury Heritage Stay', 'Delhi', 'New Delhi',
  'New Delhi, Delhi, India', 28.6247, 77.2173, 'The Imperial New Delhi is a historic luxury hotel opened in 1936 in New Delhi, India. It is located on Janpath, close to Rajiv Chowk. It was New Delhi''s first grand hotel. The hotel is owned by the Akoi family.',
  '["Government photo ID required at check-in","Smart casual attire in dining rooms"]'::jsonb, 18500, 'per night', '24-hour reception · Check-in 2:00 PM, Check-out 12:00 PM', 'October to April',
  ARRAY['Art Deco','Colonial Heritage','Luxury Hotel','Connaught Place'], 'Q7741527', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/9/98/Imperial_Hotel%2C_Delhi.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  797, 1200, 'c93434db8e595524fd469cd831d06711bf93a777cec01e953e539eb90c9073c6', true, false
FROM public.places WHERE slug = 'the-imperial-hotel-delhi'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'karims-old-delhi', 'Karim''s Historic Old Delhi', 'food', 'Iconic Culinary', 'Delhi', 'Old Delhi',
  'Old Delhi, Delhi, India', 28.6503, 77.2338, 'Karim''s Hotel or Karim''s is an international chain of restaurants headquartered in Old Delhi in Delhi, India. Established in 1913, the original location in the Jama Masjid area of Delhi was founded by Haji Karimuddin, a cook from the royal court of Mughal Emperor Bahadur Shah Zafar. The restaurant has been described as Old Delhi''s most famous culinary destination.',
  '["Peak wait times on weekend evenings","Cash and UPI accepted"]'::jsonb, 750, 'for two approx', '11:00 AM - 11:30 PM daily', 'Lunch or dinner',
  ARRAY['Mughlai Cuisine','Since 1913','Mutton Korma','Old Delhi Food Trail'], 'Q6370557', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/9/92/Karim%27s.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  443, 443, '2555ecd85f33499456193a8ee02505e3a7fe82cceb108d8f520e4b538757b42d', true, true
FROM public.places WHERE slug = 'karims-old-delhi'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'taj-mahal-agra', 'Taj Mahal', 'attraction', 'Heritage Monument', 'Uttar Pradesh', 'Agra',
  'Agra, Uttar Pradesh, India', 27.1751, 78.0421, 'The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in Agra, Uttar Pradesh, India. It was commissioned in 1631 by the fifth Mughal emperor, Shah Jahan, to house the tomb of his late wife, Mumtaz Mahal; it also houses the tomb of Shah Jahan himself. The tomb is the centrepiece of a 17-hectare (42-acre) complex, which includes a mosque and a guest house, and is set in formal gardens bounded on three sides by a crenellated wall.',
  '["Closed every Friday for general visitors","No food or smoking items permitted inside","Main mausoleum step requires shoe covers provided with ticket"]'::jsonb, 50, 'per person', '30 minutes before sunrise to 30 minutes before sunset (Closed on Fridays)', 'Sunrise in October to March',
  ARRAY['UNESCO World Heritage','Seven Wonders','Mughal Architecture','Agra'], 'Q9141', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Taj_Mahal_%28Edited%29.jpeg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3840, 2525, 'c700ea02a176e49d6437d4afac457d7e0a0193aec8118f6cd7dcba3f9df10bc6', true, true
FROM public.places WHERE slug = 'taj-mahal-agra'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'varanasi-ghats-kashi', 'Varanasi Ghats & Kashi Vishwanath', 'attraction', 'Spiritual', 'Uttar Pradesh', 'Varanasi',
  'Varanasi, Uttar Pradesh, India', 25.3109, 83.0104, 'Ghats in Varanasi are riverfront steps leading to the banks of the Ganges river. The city has 84 ghats. Most of the ghats are bathing and puja ceremonial ghats, while two ghats, Manikarnika and Harishchandra, are used exclusively as cremation sites.',
  '["Cremation photography strictly prohibited at Manikarnika and Harishchandra ghats","Dress modestly near temple precincts"]'::jsonb, 0, 'free ghat access', 'Ghats open 24 hours · Dashashwamedh Ganga Aarti at 6:45 PM', 'October to March (dawn boat ride or evening Ganga Aarti)',
  ARRAY['Sacred River Ganga','Ganga Aarti','Ancient City','Spiritual'], 'Q10255', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Ahilya_Ghat_by_the_Ganges%2C_Varanasi.jpg/3840px-Ahilya_Ghat_by_the_Ganges%2C_Varanasi.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4000, 3000, '440863a6fa7b2b6d1ef705524af23e890686684463b23a9957753d99a13728eb', true, true
FROM public.places WHERE slug = 'varanasi-ghats-kashi'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'fatehpur-sikri', 'Fatehpur Sikri & Buland Darwaza', 'attraction', 'Heritage Monument', 'Uttar Pradesh', 'Fatehpur Sikri',
  'Fatehpur Sikri, Uttar Pradesh, India', 27.0945, 77.6679, 'Fatehpur Sikri is a town in the Agra District of Uttar Pradesh, India. Situated 35.7 kilometres (22.2 mi) from the district headquarters of Agra, Fatehpur Sikri itself was founded as the capital of the Mughal Empire in 1571 by Emperor Akbar, serving this role from 1571 to 1585, when Akbar abandoned it due to a campaign in Punjab and was later completely abandoned in 1610.',
  '["Remove footwear when entering Jama Masjid and Salim Chishti tomb","Authorized ASI guides carry badge ID"]'::jsonb, 50, 'per person', 'Sunrise to Sunset daily', 'October to March',
  ARRAY['UNESCO World Heritage','Mughal Capital','Buland Darwaza','Architecture'], 'Q179046', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Fatehput_Sikiri_Buland_Darwaza_gate_2010.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2938, 2536, 'fc8a03be60c26ced8d92f72f41e6d39609c4c8030f92a9cc7879bf616205b2ae', true, true
FROM public.places WHERE slug = 'fatehpur-sikri'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'agra-fort', 'Agra Fort', 'attraction', 'Heritage Fort', 'Uttar Pradesh', 'Agra',
  'Agra, Uttar Pradesh, India', 27.1795, 78.0211, 'Agra Fort, also known as the Red Fort of Agra (Lal-Qila) or Qila-i-Akbari, is an historic fort in the city of Agra in Uttar Pradesh, India. A brick fortification on the site, noted as early as 1080 and later known as Badalgarh, was extensively rebuilt in red sandstone by the Mughal emperor Akbar from 1565 to 1573. It served as the main residence of the rulers of the Mughal dynasty until 1638, when the capital was moved from Agra to Shahjahanabad in Delhi. Much of the present interior dates from the reign of Shah Jahan, who added a number of white marble palaces and mosques within the fort after 1628. The Marathas were the last Indian rulers to occupy the fort before it was captured by the British in 1803.',
  '["Military section of fort is restricted to defense personnel","Keep ticket barcode accessible"]'::jsonb, 50, 'per person', '6:00 AM - 6:00 PM daily', 'October to March',
  ARRAY['UNESCO World Heritage','Mughal Fortress','Jahangiri Mahal','Diwan-i-Khas'], 'Q170047', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8d/Agra_03-2016_16_Agra_Fort.jpg/3840px-Agra_03-2016_16_Agra_Fort.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  5410, 3607, 'b0840172d2aabafbfcab77b0e57ef985abfc4d7ecd1abce727945c3e2b1c42fb', true, true
FROM public.places WHERE slug = 'agra-fort'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'sarnath-deer-park', 'Sarnath & Dhamek Stupa', 'attraction', 'Spiritual', 'Uttar Pradesh', 'Sarnath',
  'Sarnath, Uttar Pradesh, India', 25.3811, 83.0214, 'Sarnath is a town northeast of Varanasi, in Uttar Pradesh, India. It was here that the Buddha gave his first sermon after attaining enlightenment at Bodh Gaya. The Lion Capital of Ashoka, raised on a column in Sarnath in 250 BCE by the first Buddhist emperor Ashoka, commemorates this event. It is also the State Emblem of India.',
  '["Circumambulate the stupa clockwise","Museum ticket separate and closed on Fridays"]'::jsonb, 25, 'per person', 'Sunrise to Sunset daily · Archaeological Museum closed Fridays', 'November to February',
  ARRAY['Buddhist Pilgrimage','Dhamek Stupa','Ashoka Pillar','Peace'], 'Q192236', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Ancient_Buddhist_monasteries_near_Dhamekh_Stupa_Monument_Site%2C_Sarnath.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1600, 1200, 'bddd6a5312ca60290b0e164c528718d59b677e8719761b9ee33afb8a473efb14', true, true
FROM public.places WHERE slug = 'sarnath-deer-park'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'bara-imambara-lucknow', 'Bara Imambara & Bhool Bhulaiya', 'attraction', 'Heritage Monument', 'Uttar Pradesh', 'Lucknow',
  'Lucknow, Uttar Pradesh, India', 26.8693, 80.9126, 'The Bara Imambara, also known as the Asafi Imambara, is a significant imambara and mosque complex located in Lucknow, in the state of Uttar Pradesh, India. Built by Asaf-ud-Daula, the Nawab of Awadh, in 1784, it is the world''s second largest imambara, after the Nizamat Imambara.',
  '["Footwear must be deposited at counter before entering the central arched hall","Labyrinth (Bhool Bhulaiya) requires an official guide for safety"]'::jsonb, 50, 'per person', '6:00 AM - 5:00 PM daily', 'October to March',
  ARRAY['Awadhi Architecture','Acanthus Arch','Labyrinth','Lucknow'], 'Q807217', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDgwMCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBkYXRhLXBsYWNlLWlkPSJiYXJhLWltYW1iYXJhLWx1Y2tub3ciPgogIDx0aXRsZT5CYXJhIEltYW1iYXJhICYgQmhvb2wgQmh1bGFpeWEsIEx1Y2tub3csIFV0dGFyIFByYWRlc2g8L3RpdGxlPgogIDxkZXNjIGlkPSJleHBsb3JleC1wcm9tcHQiPm1pbmltYWwgZmxhdCBpbGx1c3RyYXRpb24gb2YgQmFyYSBJbWFtYmFyYSAmIEJob29sIEJodWxhaXlhLCBMdWNrbm93LCBVdHRhciBQcmFkZXNoLCBtb251bWVudGFsIHZhdWx0ZWQgQXNhZmkgSW1hbWJhcmEgaGFsbCB3aXRob3V0IGJlYW0gc3VwcG9ydHMgYW5kIFJ1bWkgRGFyd2F6YSBnYXRld2F5IG5lYXJieSwgbm8gdGV4dCwgbm8gcGVvcGxlPC9kZXNjPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJiZ0dyYWRfYmFyYS1pbWFtYmFyYS1sdWNrbm93IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzFBMzQyNyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyQTRGM0UiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdvbGRHcmFkX2JhcmEtaW1hbWJhcmEtbHVja25vdyIgeDE9IjAlIiB5MT0iMTAwJSIgeDI9IjAlIiB5Mj0iMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjQzlBMjI3Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0U2QzY1QyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0ic3VuR2xvd19iYXJhLWltYW1iYXJhLWx1Y2tub3ciIGN4PSI1MCUiIGN5PSIzNSUiIHI9IjQwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNDOUEyMjciIHN0b3Atb3BhY2l0eT0iMC4yNSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxQTM0MjciIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICA8L2RlZnM+CgogIDwhLS0gU2t5ICYgQXRtb3NwaGVyZSAtLT4KICA8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MDAiIGZpbGw9InVybCgjYmdHcmFkX2JhcmEtaW1hbWJhcmEtbHVja25vdykiLz4KICA8Y2lyY2xlIGN4PSI2MDAiIGN5PSIzMjAiIHI9IjI4MCIgZmlsbD0idXJsKCNzdW5HbG93X2JhcmEtaW1hbWJhcmEtbHVja25vdykiLz4KCiAgPCEtLSBHZW9tZXRyaWMgTW91bnRhaW4gLyBBcmNoaXRlY3R1cmFsIEJhY2tkcm9wIExheWVycyAtLT4KICA8cGF0aCBkPSJNMCw4MDAgTDAsNjIwIFEzMDAsNTIwIDYwMCw1NjAgVDEyMDAsNjAwIEwxMjAwLDgwMCBaIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMTIpIi8+CiAgPHBhdGggZD0iTTAsODAwIEwwLDY4MCBRNDAwLDYwMCA4MDAsNjQwIFQxMjAwLDY2MCBMMTIwMCw4MDAgWiIgZmlsbD0icmdiYSgwLDAsMCwwLjIpIi8+CgogIDwhLS0gU3R5bGl6ZWQgTGFuZG1hcmsgU2lsaG91ZXR0ZXMgLS0+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjAwLCA1MjApIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4KICAgIDwhLS0gQ2VudGVyIERvbWUgLyBTcGlyZSBNb3RpZiAtLT4KICAgIDxwYXRoIGQ9Ik0gLTkwLDAgUSAtOTAsLTE2MCAwLC0yMTAgUSA5MCwtMTYwIDkwLDAgWiIgZmlsbD0idXJsKCNnb2xkR3JhZF9iYXJhLWltYW1iYXJhLWx1Y2tub3cpIiBvcGFjaXR5PSIwLjkiLz4KICAgIDwhLS0gRmxhbmtpbmcgTWluYXJldHMgLyBQaWxsYXJzIC0tPgogICAgPHJlY3QgeD0iLTE3MCIgeT0iLTE4MCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE4MCIgcng9IjQiIGZpbGw9InVybCgjZ29sZEdyYWRfYmFyYS1pbWFtYmFyYS1sdWNrbm93KSIgb3BhY2l0eT0iMC44NSIvPgogICAgPGNpcmNsZSBjeD0iLTE2MiIgY3k9Ii0xOTAiIHI9IjE0IiBmaWxsPSIjRTZDNjVDIi8+CiAgICA8cmVjdCB4PSIxNTQiIHk9Ii0xODAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxODAiIHJ4PSI0IiBmaWxsPSJ1cmwoI2dvbGRHcmFkX2JhcmEtaW1hbWJhcmEtbHVja25vdykiIG9wYWNpdHk9IjAuODUiLz4KICAgIDxjaXJjbGUgY3g9IjE2MiIgY3k9Ii0xOTAiIHI9IjE0IiBmaWxsPSIjRTZDNjVDIi8+CiAgICA8IS0tIEFyY2hlZCBQb3J0YWwgLS0+CiAgICA8cGF0aCBkPSJNIC00MCwwIEwgLTQwLC05MCBRIDAsLTEzMCA0MCwtOTAgTCA0MCwwIFoiIGZpbGw9IiMxQTM0MjciLz4KICA8L2c+CgogIDwhLS0gR3JvdW5kIFBsYW5lIC8gV2F0ZXIgUmVmbGVjdGlvbiAtLT4KICA8cmVjdCB5PSI3MDAiIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0icmdiYSgwLDAsMCwwLjM1KSIvPgogIDxsaW5lIHgxPSIxMDAiIHkxPSI3MjAiIHgyPSIxMTAwIiB5Mj0iNzIwIiBzdHJva2U9IiNDOUEyMjciIHN0cm9rZS1vcGFjaXR5PSIwLjMiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtZGFzaGFycmF5PSIxMiwxMiIvPgogIDxsaW5lIHgxPSIyNTAiIHkxPSI3NDUiIHgyPSI5NTAiIHkyPSI3NDUiIHN0cm9rZT0iI0M5QTIyNyIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1kYXNoYXJyYXk9IjI0LDE4Ii8+CgogIDwhLS0gTGFuZG1hcmsgVGl0bGUgTGFiZWwgU3VidGV4dCBpbiBTVkcgLS0+CiAgPHRleHQgeD0iNjAwIiB5PSI3NTUiIGZvbnQtZmFtaWx5PSItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiNFNkM2NUMiIG9wYWNpdHk9IjAuNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgbGV0dGVyLXNwYWNpbmc9IjIuNSI+QkFSQSBJTUFNQkFSQSAmIEJIT09MIEJIVUxBSVlBIMK3IExVQ0tOT1c8L3RleHQ+CgogIDwhLS0gQmFkZ2UgTWFya2VyIGluIGJvdHRvbSBjb3JuZXIgLS0+CiAgPHJlY3QgeD0iMzAiIHk9IjczOCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIzNCIgcng9IjE3IiBmaWxsPSJyZ2JhKDAsMCwwLDAuNikiIHN0cm9rZT0iI0M5QTIyNyIgc3Ryb2tlLXdpZHRoPSIxLjIiLz4KICA8dGV4dCB4PSIxMTAiIHk9Ijc2MCIgZm9udC1mYW1pbHk9Ii1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iI0U2QzY1QyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgbGV0dGVyLXNwYWNpbmc9IjEuMiI+SUxMVVNUUkFUSU9OPC90ZXh0Pgo8L3N2Zz4=', 'ai_generated', 'Custom Vector Illustration (Creative Commons CC0)', 'Explorex AI Cultural Vector Illustration (Bara Imambara & Bhool Bhulaiya)',
  1200, 800, '0d799ea2e5fe5f2ba89f40490ef23be6dbcb6c40cd103ba23c4d78fcf74cd689', true, true
FROM public.places WHERE slug = 'bara-imambara-lucknow'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'ayodhya-ram-mandir', 'Shri Ram Janmabhoomi Mandir', 'attraction', 'Spiritual', 'Uttar Pradesh', 'Ayodhya',
  'Ayodhya, Uttar Pradesh, India', 26.7956, 82.1944, 'The Ram Mandir, is a Hindu temple complex in Ayodhya, Uttar Pradesh, India. It is one of the most visited Hindu temples in India, as many Hindus believe that it is located at the site of Ram Janmabhoomi, the mythical birthplace of Rama.',
  '["Bags and smartphones must be deposited in electronic lockers at Janmabhoomi path entrance","Security frisking mandatory"]'::jsonb, 0, 'free darshan', '6:30 AM - 12:00 PM, 2:00 PM - 10:00 PM daily', 'November to March',
  ARRAY['Nagara Style Temple','Spiritual Landmark','Pink Bansi Paharpur Stone'], 'Q105085351', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/d/de/Shri_Ram_Janambhoomi_Mandir%2C_Ayodhya_Dham.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2200, 1662, 'f5bac922da302c6ed53cc28f33fb5543357f074e4d9b56cec84a1f7d5182ae6a', true, true
FROM public.places WHERE slug = 'ayodhya-ram-mandir'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'mathura-krishna-janmabhoomi', 'Krishna Janmasthan Temple Complex', 'attraction', 'Spiritual', 'Uttar Pradesh', 'Mathura',
  'Mathura, Uttar Pradesh, India', 27.505, 77.67, 'Krishna Janmasthan Temple is a Hindu temple situated in Mathura, Uttar Pradesh, India. There are three main temples inside the premises -- Keshavdev temple which is dedicated to Krishna, Garbh Griha where Krishna is believed to be born in Dvapar Yuga and Bhagvata Bhavan where presiding deities are Radha Krishna.',
  '["High-security zone: mobile phones and electronic cameras prohibited inside","Lockers available near entry gate"]'::jsonb, 0, 'free entry', '5:30 AM - 12:00 PM, 4:00 PM - 9:30 PM daily', 'September to March (Janmashtami celebration season)',
  ARRAY['Holy Braj','Lord Krishna','Pilgrimage','Mathura'], 'Q15115206', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Mathura_Temple-Mathura-India0002.JPG/3840px-Mathura_Temple-Mathura-India0002.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3888, 2592, 'f368b8be3e0caead730cca06870b2ed9623bf849d0b612d08b9d5f68853f2ed7', true, false
FROM public.places WHERE slug = 'mathura-krishna-janmabhoomi'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'golden-temple-amritsar', 'Golden Temple (Harmandir Sahib)', 'attraction', 'Spiritual', 'Punjab', 'Amritsar',
  'Amritsar, Punjab, India', 31.62, 74.8765, 'The Golden Temple is a gurdwara located in Amritsar, Punjab, India. It is the pre-eminent spiritual site of Sikhism and its holiest site. The gurdwara complex is a collection of buildings around the sanctum sanctorum and the sarovar, known as the Amrit Sarovar. One of these is Akal Takht, part of the Panj Takht and the chief centre of religious authority of Sikhism. Additional buildings include a clock tower, the offices of the Shiromani Gurdwara Parbandhak Committee, a museum and a langar—a free Sikh community-run kitchen that offers a vegetarian meal to all visitors without discrimination. Over 150,000 people visit the shrine every day for worship, being one of the most visited religious sites in the world. The gurdwara complex has been nominated as a UNESCO World Heritage Site, and its application is pending on the tentative list of UNESCO.',
  '["Head must be covered at all times (scarves available at entrances)","Shoes removed and feet washed in holy water channel before entry","Tobacco and alcohol strictly prohibited on complex perimeter"]'::jsonb, 0, 'free entry for all', 'Open 24 hours daily · Langar meal served continuously', 'October to March (early morning Palki Sahib ceremony or evening illumination)',
  ARRAY['Sikh Holy Shrine','Langar','Amrit Sarovar','Spiritual Sanctuary'], 'Q180422', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amrithsar_7.jpg/3840px-The_Golden_Temple_of_Amrithsar_7.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4176, 2784, 'c65b136d8d1fd89f6315a04059d48cf6ea10cbe4b7fa3e69d148cba73ea833e6', true, true
FROM public.places WHERE slug = 'golden-temple-amritsar'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'jallianwala-bagh', 'Jallianwala Bagh Memorial', 'attraction', 'Historic Monument', 'Punjab', 'Amritsar',
  'Amritsar, Punjab, India', 31.6206, 74.8801, 'Jallianwala Bagh is a historic garden and memorial of national importance close to the Golden Temple complex in Amritsar, Punjab, India, preserved in the memory of those wounded and killed in the Jallianwala Bagh Massacre that took place on the site on the festival of Baisakhi Day, 13 April 1919. The 7-acre (28,000 m2) site houses a museum, gallery and several memorial structures. It is managed by the Jallianwala Bagh National Memorial Trust, and will be renovated between 2025 and 2027.',
  '["Maintain respectful silence near the Martyrs Well and bullet mark memorial walls","Littering strictly prohibited"]'::jsonb, 0, 'free entry', '6:30 AM - 7:30 PM daily', 'October to March',
  ARRAY['Freedom Movement','National Memorial','Heritage','Amritsar'], 'Q73458', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Jallianwala_Bagh%2C_Amritsar_01.jpg/3840px-Jallianwala_Bagh%2C_Amritsar_01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4486, 2991, 'ad836f2ab4bc76abef8b9ba7648743cade9e82aba6e4710520cc5faafbcbef23', true, true
FROM public.places WHERE slug = 'jallianwala-bagh'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'wagah-border-ceremony', 'Attari-Wagah Border Beating Retreat', 'attraction', 'National Landmark', 'Punjab', 'Amritsar (Attari)',
  'Amritsar (Attari), Punjab, India', 31.6047, 74.5714, 'The ceremony at the Attari–Wagah border is a daily ceremony that the security forces of India and Pakistan have jointly followed since 1959. The drill is characterized by elaborate and rapid dance-like manoeuvres and raising legs as high as possible. It is symbolic of the brotherhood as well as the rivalry that these two nations share. The border troops exchange sweets with the opposing side during the Muslim holidays of Eid and Hindu holiday of Diwali.',
  '["Only wallet and mobile phone permitted in amphitheatre (no large bags or backpacks)","Valid ID proof recommended for entry checkpoints"]'::jsonb, 0, 'free entry (first-come seating)', 'Ceremony begins 4:30 PM in winter, 5:30 PM in summer (arrive 2 hours early)', 'October to March',
  ARRAY['BSF Drill','Border Ceremony','Patriotic Experience'], 'Q2567403', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/c/c4/The_SAARC_Car_Rally_2007_being_welcomed_by_traditional_Drummers_at_the_Wagah_Border_on_March_28%2C_2007.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2300, 1541, '92f1dda864518547c16cfce615038e0c7f59cfa32e33c590af3c87ac2ea1b208', true, false
FROM public.places WHERE slug = 'wagah-border-ceremony'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'gobindgarh-fort', 'Gobindgarh Fort', 'attraction', 'Heritage Fort', 'Punjab', 'Amritsar',
  'Amritsar, Punjab, India', 31.6274, 74.8569, 'Gobindgarh Fort is a historic military fort located in the center of the city of Amritsar in the Indian state of Punjab. The Fort was until recently under the Indian Army, but was opened to the public on 10 February 2017. Today the fort is being developed as a museum and theme park, as a repository of Punjab’s history.',
  '["Follow guided routes through Toshakhana treasury","Photography permitted in outer courtyards"]'::jsonb, 150, 'per person', '10:00 AM - 10:00 PM daily', 'Afternoon leading to evening Whispering Walls 7D show',
  ARRAY['Maharaja Ranjit Singh','Military Fort','Cultural Shows','Museum'], 'Q5575466', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Gobindgarh_fort%2C_Amritsar%2C_Punjab%2C_India.jpg/3840px-Gobindgarh_fort%2C_Amritsar%2C_Punjab%2C_India.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4608, 3456, '742f51fa63fb5dd1873a8bacd4e2982d6457c3e6297007f8d31fcd60e334564f', true, true
FROM public.places WHERE slug = 'gobindgarh-fort'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'virasat-e-khalsa', 'Virasat-e-Khalsa Anandpur Sahib', 'attraction', 'Cultural Center', 'Punjab', 'Anandpur Sahib',
  'Anandpur Sahib, Punjab, India', 31.2339, 76.5025, 'Virasat-e-Khalsa, also known as the Khalsa Heritage Complex, is a mega-museum complex of Sikhism, located in the town of Anandpur Sahib, and is close to the Takht Kesgarh Sahib, located in the state of Punjab, India. The museum celebrates 500 years of Sikh history and the 300th anniversary of the birth of Khalsa, based on the scriptures written by the tenth and last of Sikhism''s gurus, Guru Gobind Singh. Tourists and pilgrims visit. It is the most visited Sikh museum.',
  '["Bags and cameras must be deposited at entry cloakroom","Audio guide available at nominal fee"]'::jsonb, 0, 'free entry', '10:00 AM - 4:30 PM (Closed on Mondays)', 'October to March (especially during Hola Mohalla festival)',
  ARRAY['Moshe Safdie Architecture','Museum','Sikh Heritage','Anandpur Sahib'], 'Q7933560', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Khalsa_Heritage_Memorial_176_Edit.jpg/3840px-Khalsa_Heritage_Memorial_176_Edit.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3872, 2592, 'e48fceab2b4432f7c73ba0e09e8fb78c63bf41b6a6c480604be0f48d48a6d26f', true, false
FROM public.places WHERE slug = 'virasat-e-khalsa'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'sheesh-mahal-patiala', 'Sheesh Mahal & Qila Mubarak Patiala', 'attraction', 'Heritage Palace', 'Punjab', 'Patiala',
  'Patiala, Punjab, India', 30.3167, 76.4, 'Sheesh Mahal & Qila Mubarak Patiala is a renowned heritage palace in Patiala, Punjab.',
  '["No touching antique mirror mosaics","Photography inside Kangra painting gallery restricted"]'::jsonb, 20, 'per person', '9:00 AM - 5:00 PM (Closed on Mondays)', 'November to February',
  ARRAY['Patiala Royal Heritage','Mirror Palace','Laxman Jhula Suspension Bridge'], 'Q7492576', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDgwMCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBkYXRhLXBsYWNlLWlkPSJzaGVlc2gtbWFoYWwtcGF0aWFsYSI+CiAgPHRpdGxlPlNoZWVzaCBNYWhhbCAmIFFpbGEgTXViYXJhayBQYXRpYWxhLCBQYXRpYWxhLCBQdW5qYWI8L3RpdGxlPgogIDxkZXNjIGlkPSJleHBsb3JleC1wcm9tcHQiPm1pbmltYWwgZmxhdCBpbGx1c3RyYXRpb24gb2YgU2hlZXNoIE1haGFsICYgUWlsYSBNdWJhcmFrIFBhdGlhbGEsIFBhdGlhbGEsIFB1bmphYiwgcm95YWwgcGFsYWNlIHdpdGggaW50cmljYXRlIG1pcnJvciB3b3JrIGZhY2luZyBhIGxhcmdlIGFydGlmaWNpYWwgbGFrZSB3aXRoIGEgcmVkIHN1c3BlbnNpb24gYnJpZGdlLCBubyB0ZXh0LCBubyBwZW9wbGU8L2Rlc2M+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnR3JhZF9zaGVlc2gtbWFoYWwtcGF0aWFsYSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxQTM0MjciLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMkE0RjNFIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJnb2xkR3JhZF9zaGVlc2gtbWFoYWwtcGF0aWFsYSIgeDE9IjAlIiB5MT0iMTAwJSIgeDI9IjAlIiB5Mj0iMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjQzlBMjI3Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0U2QzY1QyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0ic3VuR2xvd19zaGVlc2gtbWFoYWwtcGF0aWFsYSIgY3g9IjUwJSIgY3k9IjM1JSIgcj0iNDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0M5QTIyNyIgc3RvcC1vcGFjaXR5PSIwLjI1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzFBMzQyNyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogIDwvZGVmcz4KCiAgPCEtLSBTa3kgJiBBdG1vc3BoZXJlIC0tPgogIDxyZWN0IHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjgwMCIgZmlsbD0idXJsKCNiZ0dyYWRfc2hlZXNoLW1haGFsLXBhdGlhbGEpIi8+CiAgPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzIwIiByPSIyODAiIGZpbGw9InVybCgjc3VuR2xvd19zaGVlc2gtbWFoYWwtcGF0aWFsYSkiLz4KCiAgPCEtLSBHZW9tZXRyaWMgTW91bnRhaW4gLyBBcmNoaXRlY3R1cmFsIEJhY2tkcm9wIExheWVycyAtLT4KICA8cGF0aCBkPSJNMCw4MDAgTDAsNjIwIFEzMDAsNTIwIDYwMCw1NjAgVDEyMDAsNjAwIEwxMjAwLDgwMCBaIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMTIpIi8+CiAgPHBhdGggZD0iTTAsODAwIEwwLDY4MCBRNDAwLDYwMCA4MDAsNjQwIFQxMjAwLDY2MCBMMTIwMCw4MDAgWiIgZmlsbD0icmdiYSgwLDAsMCwwLjIpIi8+CgogIDwhLS0gU3R5bGl6ZWQgTGFuZG1hcmsgU2lsaG91ZXR0ZXMgLS0+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjAwLCA1MjApIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4KICAgIDwhLS0gQ2VudGVyIERvbWUgLyBTcGlyZSBNb3RpZiAtLT4KICAgIDxwYXRoIGQ9Ik0gLTkwLDAgUSAtOTAsLTE2MCAwLC0yMTAgUSA5MCwtMTYwIDkwLDAgWiIgZmlsbD0idXJsKCNnb2xkR3JhZF9zaGVlc2gtbWFoYWwtcGF0aWFsYSkiIG9wYWNpdHk9IjAuOSIvPgogICAgPCEtLSBGbGFua2luZyBNaW5hcmV0cyAvIFBpbGxhcnMgLS0+CiAgICA8cmVjdCB4PSItMTcwIiB5PSItMTgwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTgwIiByeD0iNCIgZmlsbD0idXJsKCNnb2xkR3JhZF9zaGVlc2gtbWFoYWwtcGF0aWFsYSkiIG9wYWNpdHk9IjAuODUiLz4KICAgIDxjaXJjbGUgY3g9Ii0xNjIiIGN5PSItMTkwIiByPSIxNCIgZmlsbD0iI0U2QzY1QyIvPgogICAgPHJlY3QgeD0iMTU0IiB5PSItMTgwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTgwIiByeD0iNCIgZmlsbD0idXJsKCNnb2xkR3JhZF9zaGVlc2gtbWFoYWwtcGF0aWFsYSkiIG9wYWNpdHk9IjAuODUiLz4KICAgIDxjaXJjbGUgY3g9IjE2MiIgY3k9Ii0xOTAiIHI9IjE0IiBmaWxsPSIjRTZDNjVDIi8+CiAgICA8IS0tIEFyY2hlZCBQb3J0YWwgLS0+CiAgICA8cGF0aCBkPSJNIC00MCwwIEwgLTQwLC05MCBRIDAsLTEzMCA0MCwtOTAgTCA0MCwwIFoiIGZpbGw9IiMxQTM0MjciLz4KICA8L2c+CgogIDwhLS0gR3JvdW5kIFBsYW5lIC8gV2F0ZXIgUmVmbGVjdGlvbiAtLT4KICA8cmVjdCB5PSI3MDAiIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0icmdiYSgwLDAsMCwwLjM1KSIvPgogIDxsaW5lIHgxPSIxMDAiIHkxPSI3MjAiIHgyPSIxMTAwIiB5Mj0iNzIwIiBzdHJva2U9IiNDOUEyMjciIHN0cm9rZS1vcGFjaXR5PSIwLjMiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtZGFzaGFycmF5PSIxMiwxMiIvPgogIDxsaW5lIHgxPSIyNTAiIHkxPSI3NDUiIHgyPSI5NTAiIHkyPSI3NDUiIHN0cm9rZT0iI0M5QTIyNyIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1kYXNoYXJyYXk9IjI0LDE4Ii8+CgogIDwhLS0gTGFuZG1hcmsgVGl0bGUgTGFiZWwgU3VidGV4dCBpbiBTVkcgLS0+CiAgPHRleHQgeD0iNjAwIiB5PSI3NTUiIGZvbnQtZmFtaWx5PSItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiNFNkM2NUMiIG9wYWNpdHk9IjAuNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgbGV0dGVyLXNwYWNpbmc9IjIuNSI+U0hFRVNIIE1BSEFMICYgUUlMQSBNVUJBUkFLIFBBVElBTEEgwrcgUEFUSUFMQTwvdGV4dD4KCiAgPCEtLSBCYWRnZSBNYXJrZXIgaW4gYm90dG9tIGNvcm5lciAtLT4KICA8cmVjdCB4PSIzMCIgeT0iNzM4IiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjM0IiByeD0iMTciIGZpbGw9InJnYmEoMCwwLDAsMC42KSIgc3Ryb2tlPSIjQzlBMjI3IiBzdHJva2Utd2lkdGg9IjEuMiIvPgogIDx0ZXh0IHg9IjExMCIgeT0iNzYwIiBmb250LWZhbWlseT0iLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjRTZDNjVDIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMS4yIj5JTExVU1RSQVRJT048L3RleHQ+Cjwvc3ZnPg==', 'ai_generated', 'Custom Vector Illustration (Creative Commons CC0)', 'Explorex AI Cultural Vector Illustration (Sheesh Mahal & Qila Mubarak Patiala)',
  1200, 800, '501917440dc5f87b8410e610e816dbbe2747ffbf1aa3c9f156f996bf4f5a567f', true, true
FROM public.places WHERE slug = 'sheesh-mahal-patiala'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'kesar-da-dhaba', 'Kesar Da Dhaba Amritsar', 'food', 'Iconic Culinary', 'Punjab', 'Amritsar',
  'Amritsar, Punjab, India', 31.624, 74.877, '

Kesar Da Dhaba is a vegetarian Punjabi dhaba in Amritsar, Punjab, India, that originated as a small restaurant selling dal and roti set up by Lala Kesar Mal, a Punjabi Hindu in Sheikhupura, a city near Lahore, in 1916. It moved to Amritsar after the partition of India in 1947. People that are said to have eaten at the restaurant include Lala Lajpat Rai, Jawaharlal Nehru, Indira Gandhi, Padmini Kolhapure, Yash Chopra and Rajesh Khanna. It is a small dhaba, in a narrow lane in Chowk Passian near Town Hall.',
  '["Famous slow-cooked Maa ki Dal simmered for 12 hours with lachha paratha","Shared seating during peak hours"]'::jsonb, 450, 'for two approx', '12:00 PM - 11:00 PM daily', 'Lunch or dinner',
  ARRAY['Legendary Eatery','Since 1916','Dal Makhani','Punjabi Cuisine'], 'Q6390159', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDgwMCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBkYXRhLXBsYWNlLWlkPSJrZXNhci1kYS1kaGFiYSI+CiAgPHRpdGxlPktlc2FyIERhIERoYWJhIEFtcml0c2FyLCBBbXJpdHNhciwgUHVuamFiPC90aXRsZT4KICA8ZGVzYyBpZD0iZXhwbG9yZXgtcHJvbXB0Ij5taW5pbWFsIGZsYXQgaWxsdXN0cmF0aW9uIG9mIEtlc2FyIERhIERoYWJhIEFtcml0c2FyLCBBbXJpdHNhciwgUHVuamFiLCB0cmFkaXRpb25hbCBBbXJpdHNhcmkgZWF0ZXJ5IGhhbGwgZmlsbGVkIHdpdGggYnJhc3MgdGhhbGlzIGFuZCBzbG93LWNvb2tlZCBzaW1tZXJpbmcgbGVudGlscywgbm8gdGV4dCwgbm8gcGVvcGxlPC9kZXNjPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJiZ0dyYWRfa2VzYXItZGEtZGhhYmEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMUEzNDI3Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzJBNEYzRSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ29sZEdyYWRfa2VzYXItZGEtZGhhYmEiIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIwJSIgeTI9IjAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0M5QTIyNyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNFNkM2NUMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InN1bkdsb3dfa2VzYXItZGEtZGhhYmEiIGN4PSI1MCUiIGN5PSIzNSUiIHI9IjQwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNDOUEyMjciIHN0b3Atb3BhY2l0eT0iMC4yNSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxQTM0MjciIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICA8L2RlZnM+CgogIDwhLS0gU2t5ICYgQXRtb3NwaGVyZSAtLT4KICA8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MDAiIGZpbGw9InVybCgjYmdHcmFkX2tlc2FyLWRhLWRoYWJhKSIvPgogIDxjaXJjbGUgY3g9IjYwMCIgY3k9IjMyMCIgcj0iMjgwIiBmaWxsPSJ1cmwoI3N1bkdsb3dfa2VzYXItZGEtZGhhYmEpIi8+CgogIDwhLS0gR2VvbWV0cmljIE1vdW50YWluIC8gQXJjaGl0ZWN0dXJhbCBCYWNrZHJvcCBMYXllcnMgLS0+CiAgPHBhdGggZD0iTTAsODAwIEwwLDYyMCBRMzAwLDUyMCA2MDAsNTYwIFQxMjAwLDYwMCBMMTIwMCw4MDAgWiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEyKSIvPgogIDxwYXRoIGQ9Ik0wLDgwMCBMMCw2ODAgUTQwMCw2MDAgODAwLDY0MCBUMTIwMCw2NjAgTDEyMDAsODAwIFoiIGZpbGw9InJnYmEoMCwwLDAsMC4yKSIvPgoKICA8IS0tIFN0eWxpemVkIExhbmRtYXJrIFNpbGhvdWV0dGVzIC0tPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYwMCwgNTIwKSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+CiAgICA8IS0tIENlbnRlciBEb21lIC8gU3BpcmUgTW90aWYgLS0+CiAgICA8cGF0aCBkPSJNIC05MCwwIFEgLTkwLC0xNjAgMCwtMjEwIFEgOTAsLTE2MCA5MCwwIFoiIGZpbGw9InVybCgjZ29sZEdyYWRfa2VzYXItZGEtZGhhYmEpIiBvcGFjaXR5PSIwLjkiLz4KICAgIDwhLS0gRmxhbmtpbmcgTWluYXJldHMgLyBQaWxsYXJzIC0tPgogICAgPHJlY3QgeD0iLTE3MCIgeT0iLTE4MCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE4MCIgcng9IjQiIGZpbGw9InVybCgjZ29sZEdyYWRfa2VzYXItZGEtZGhhYmEpIiBvcGFjaXR5PSIwLjg1Ii8+CiAgICA8Y2lyY2xlIGN4PSItMTYyIiBjeT0iLTE5MCIgcj0iMTQiIGZpbGw9IiNFNkM2NUMiLz4KICAgIDxyZWN0IHg9IjE1NCIgeT0iLTE4MCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE4MCIgcng9IjQiIGZpbGw9InVybCgjZ29sZEdyYWRfa2VzYXItZGEtZGhhYmEpIiBvcGFjaXR5PSIwLjg1Ii8+CiAgICA8Y2lyY2xlIGN4PSIxNjIiIGN5PSItMTkwIiByPSIxNCIgZmlsbD0iI0U2QzY1QyIvPgogICAgPCEtLSBBcmNoZWQgUG9ydGFsIC0tPgogICAgPHBhdGggZD0iTSAtNDAsMCBMIC00MCwtOTAgUSAwLC0xMzAgNDAsLTkwIEwgNDAsMCBaIiBmaWxsPSIjMUEzNDI3Ii8+CiAgPC9nPgoKICA8IS0tIEdyb3VuZCBQbGFuZSAvIFdhdGVyIFJlZmxlY3Rpb24gLS0+CiAgPHJlY3QgeT0iNzAwIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InJnYmEoMCwwLDAsMC4zNSkiLz4KICA8bGluZSB4MT0iMTAwIiB5MT0iNzIwIiB4Mj0iMTEwMCIgeTI9IjcyMCIgc3Ryb2tlPSIjQzlBMjI3IiBzdHJva2Utb3BhY2l0eT0iMC4zIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWRhc2hhcnJheT0iMTIsMTIiLz4KICA8bGluZSB4MT0iMjUwIiB5MT0iNzQ1IiB4Mj0iOTUwIiB5Mj0iNzQ1IiBzdHJva2U9IiNDOUEyMjciIHN0cm9rZS1vcGFjaXR5PSIwLjIiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtZGFzaGFycmF5PSIyNCwxOCIvPgoKICA8IS0tIExhbmRtYXJrIFRpdGxlIExhYmVsIFN1YnRleHQgaW4gU1ZHIC0tPgogIDx0ZXh0IHg9IjYwMCIgeT0iNzU1IiBmb250LWZhbWlseT0iLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSIjRTZDNjVDIiBvcGFjaXR5PSIwLjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGxldHRlci1zcGFjaW5nPSIyLjUiPktFU0FSIERBIERIQUJBIEFNUklUU0FSIMK3IEFNUklUU0FSPC90ZXh0PgoKICA8IS0tIEJhZGdlIE1hcmtlciBpbiBib3R0b20gY29ybmVyIC0tPgogIDxyZWN0IHg9IjMwIiB5PSI3MzgiIHdpZHRoPSIxNjAiIGhlaWdodD0iMzQiIHJ4PSIxNyIgZmlsbD0icmdiYSgwLDAsMCwwLjYpIiBzdHJva2U9IiNDOUEyMjciIHN0cm9rZS13aWR0aD0iMS4yIi8+CiAgPHRleHQgeD0iMTEwIiB5PSI3NjAiIGZvbnQtZmFtaWx5PSItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTMiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNFNkM2NUMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGxldHRlci1zcGFjaW5nPSIxLjIiPklMTFVTVFJBVElPTjwvdGV4dD4KPC9zdmc+', 'ai_generated', 'Custom Vector Illustration (Creative Commons CC0)', 'Explorex AI Cultural Vector Illustration (Kesar Da Dhaba Amritsar)',
  1200, 800, 'd1e1f8cb2d9dfcb78f6bea4a97fbcd26942f1e0a90d21a5c23bbfb63f291091d', true, true
FROM public.places WHERE slug = 'kesar-da-dhaba'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'rohtang-pass-manali', 'Rohtang Pass & Atal Tunnel', 'attraction', 'Mountain Pass', 'Himachal Pradesh', 'Manali',
  'Manali, Himachal Pradesh, India', 32.3716, 77.2466, 'Rohtang Pass is a high mountain pass on the eastern end of the Pir Panjal Range of the Himalayas around 51 km (32 mi) from Manali in the Indian state of Himachal Pradesh, It connects the Kullu Valley with the Lahaul and Spiti Valleys of Himachal Pradesh, India.',
  '["Online National Green Tribunal (NGT) permit mandatory before driving up","Closed for maintenance every Tuesday"]'::jsonb, 550, 'environmental permit fee per vehicle', 'Permit timings 6:00 AM - 9:00 AM / 9:00 AM - 12:00 PM (Closed Tuesdays for road maintenance)', 'May to October (snow walls in early summer)',
  ARRAY['Himalayas','Snow Peak','High Altitude Pass','Adventure'], 'Q2724285', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Kullu_Valley_from_Rohtang_Pass%2C_India.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3072, 2048, '8a3073600f7a8e1723587384bb4c55c1d1a8c3c0c61f3b4411611332933706a0', true, true
FROM public.places WHERE slug = 'rohtang-pass-manali'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'key-monastery-spiti', 'Key Gompa & Spiti Valley', 'attraction', 'Spiritual', 'Himachal Pradesh', 'Kaza (Spiti Valley)',
  'Kaza (Spiti Valley), Himachal Pradesh, India', 32.2989, 78.0125, 'Kye Gompa is a Tibetan Buddhist monastery of the Gelugpa sect located on top of a hill at an altitude of 4,166 metres (13,668 ft) above sea level, close to the Spiti River, in the Spiti Valley of Himachal Pradesh, Lahaul and Spiti district, India.',
  '["Acclimatize in Kaza for at least 24 hours to prevent altitude sickness","Remove shoes before entering prayer prayer room with murals"]'::jsonb, 0, 'free monastery entry', '6:00 AM - 6:00 PM daily', 'June to September (roads clear of snow)',
  ARRAY['Tibetan Buddhism','High Altitude Cold Desert','Spiti Valley','Thangka Murals'], 'Q1740316', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/1000_Year_loop.jpg/3840px-1000_Year_loop.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  5341, 3556, 'b1afd85703b9db5ac932229778fc4985fdf0b88f17a6eb1c52168255d768a141', true, false
FROM public.places WHERE slug = 'key-monastery-spiti'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'hidimba-devi-temple-manali', 'Hidimba Devi Temple Manali', 'attraction', 'Spiritual', 'Himachal Pradesh', 'Manali',
  'Manali, Himachal Pradesh, India', 32.2483, 77.1812, 'Hidimba Devi Temple, locally known as Dhungari Temple, also known variously as the Hadimba Temple, is a Hindu Temple, located in Manāli, a hill station in the State of Himāchal Pradesh in north India. It is an ancient cave temple dedicated to Hidimbi Devi, wife of Bhima, a figure in the Indian epic Mahābhārata. The temple is surrounded by a cedar forest called Dhungiri Van Vihar at the foot of the Himālayas. The sanctuary is built over a huge rock jutting out of the ground which was worshiped as an image of the deity. The structure was built in 1553 by Maharaja Bahadur Singh.',
  '["Sacred wooden sanctum built over an ancient rock cave","Keep steps clean in deodar forest sanctuary"]'::jsonb, 0, 'free entry', '8:00 AM - 6:00 PM daily', 'Year-round (snow-draped in winter, lush pine scent in summer)',
  ARRAY['Pagoda Temple','Deodar Forest','Dhungri Van Vihar','Heritage'], 'Q3635738', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Hidimba_Devi_Temple_-_North-east_View_-_Manali_2014-05-11_2648-2649.TIF/lossy-page1-3840px-Hidimba_Devi_Temple_-_North-east_View_-_Manali_2014-05-11_2648-2649.TIF.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  6995, 5965, 'c71696042f36f28c41ebfa37440e78ffdaac41e3f9eb2ccf24e5d66e73b07c60', true, true
FROM public.places WHERE slug = 'hidimba-devi-temple-manali'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'ridge-and-mall-shimla', 'The Ridge & Christ Church Shimla', 'attraction', 'Heritage Landmark', 'Himachal Pradesh', 'Shimla',
  'Shimla, Himachal Pradesh, India', 31.1048, 77.1741, 'The Ridge road is a large open space, located in the center of Shimla, the capital city of Himachal Pradesh, India. The Ridge is the hub of all cultural activities of Shimla. It is situated along the Mall Road, the shopping center of Shimla. Most major places of Shimla like Sanjauli Snowdown (IGMC), Mall Road, Jakhu Temple, Oakover, Kali Bari, and Annadale are connected through the Ridge.',
  '["Pedestrian-only promenade: vehicular traffic strictly banned","Smoking and littering subject to municipal fines"]'::jsonb, 0, 'free pedestrian promenade', 'Pedestrian area open 24 hours · Christ Church open 8:00 AM - 6:00 PM', 'March to June or December/January for snowfall',
  ARRAY['Colonial Architecture','Christ Church','Himalayan Panorama','Pedestrian Walkway'], 'Q7760773', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/2/25/The_Ridge_Shimla_5.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2416, 2152, '91560773ecc5d9a9ef161f2f8edd6d842614fb64610fa40dcad0c46b4afceb8a', true, true
FROM public.places WHERE slug = 'ridge-and-mall-shimla'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'mcleodganj-tsuglagkhang', 'Tsuglagkhang Complex (Dalai Lama Temple)', 'attraction', 'Spiritual', 'Himachal Pradesh', 'Dharamshala (McLeod Ganj)',
  'Dharamshala (McLeod Ganj), Himachal Pradesh, India', 32.2343, 76.3262, 'Namgyal Monastery is located in Mcleod Ganj, Dharamsala, India. It is the personal monastery of the 14th Dalai Lama. Another name for this temple-complex is Namgyal Tantric College.',
  '["Security screening at gate; electronic devices allowed in outer areas","Rotate prayer wheels clockwise around the temple kora path"]'::jsonb, 0, 'free entry', '5:00 AM - 8:00 PM daily', 'September to May',
  ARRAY['Tibetan Heritage','Dalai Lama Residence','Dhauladhar Mountains','Meditation'], 'Q889025', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Namgyal_Monastery_India_Himachal_Pradesh_Mc_Leod_Ganj.jpg/3840px-Namgyal_Monastery_India_Himachal_Pradesh_Mc_Leod_Ganj.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4000, 3000, '8c501105f5ff93a1d96345fe87f9e1223150e0bf65c11ca1369f9e164fd83896', true, false
FROM public.places WHERE slug = 'mcleodganj-tsuglagkhang'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'khajjiar-mini-switzerland', 'Khajjiar Lake & Meadow', 'attraction', 'Hill Station & Nature', 'Himachal Pradesh', 'Dalhousie (Khajjiar)',
  'Dalhousie (Khajjiar), Himachal Pradesh, India', 32.55, 76.06, 'Khajjiar is a hill station near the town of Chamba in Chamba district of Himachal Pradesh, India. Located approximately 24 kilometres (15 mi) from Dalhousie, it lies on a small plateau about 2,000 meters above sea level in the foothills of the Dhauladhar ranges in the Western Himalayas. It is also part of the Kalatop Khajjiar Sanctuary.',
  '["Do not drive on the protected grassy meadow","Eco-tourism green fee applicable per vehicle entering the valley"]'::jsonb, 0, 'free meadow access', 'Open daylight hours', 'March to October (green turf) or December to February (snow blanket)',
  ARRAY['Mini Switzerland','Alpine Meadow','Cedar Forest','Lake'], 'Q6399718', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Nature_of_Khajjiar.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1080, 1080, '2bfdcf56fc15202f69ff451a2f85ed83971ebd89c8485f83add7c378a85db24f', true, true
FROM public.places WHERE slug = 'khajjiar-mini-switzerland'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'great-himalayan-national-park', 'Great Himalayan National Park', 'attraction', 'Wildlife Sanctuary', 'Himachal Pradesh', 'Kullu (Tirthan Valley)',
  'Kullu (Tirthan Valley), Himachal Pradesh, India', 31.73, 77.56, 'The Great Himalayan National Park (GHNP) is a national park in India, located in Banjar sub-division of Kullu in the state of Himachal Pradesh. The park was established in 1984 and is spread over an area of 1171 km2; elevations within the park range between 1500 and 6000 m. The Great Himalayan National Park is a habitat to numerous flora and more than 375 fauna species, including approximately 31 mammals, 181 birds, 3 reptiles, 9 amphibians, 11 annelids, 17 mollusks and 127 insects. They are protected under the strict guidelines of the Wildlife Protection Act of 1972; hence any sort of hunting is not permitted.',
  '["Forest department entry permit mandatory at Sai Ropa or Sainj office","Strict no-plastic and no-fire zone in core wilderness area"]'::jsonb, 100, 'entry fee per Indian national', 'Sunrise to Sunset · Trekking requires forest department permit', 'April to June and September to November',
  ARRAY['UNESCO World Heritage','Biodiversity','Snow Leopard Habitat','Trekking'], 'Q5264359', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Himalayn_National_Park_01.jpg/3840px-Himalayn_National_Park_01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  5456, 3069, '0bbd382704d5ea4ead9e4427bb06545e98cc4f1707b38b605bd595b5fbe478ff', true, false
FROM public.places WHERE slug = 'great-himalayan-national-park'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'badrinath-temple', 'Badrinath Temple', 'attraction', 'Spiritual', 'Uttarakhand', 'Badrinath (Chamoli)',
  'Badrinath (Chamoli), Uttarakhand, India', 30.7447, 79.4912, 'Badarinath Temple, also known as Badarinarayana Temple, is a Hindu temple dedicated to Vishnu. It is located in the town of Badrinath in Chamoli district of Uttarakhand, India. The temple is one of the 108 Divya Desams, sacred to Vaishnavism, where Vishnu is worshipped as Badrinath. Due to extreme weather conditions in the Himalayas, the temple is open for six months each year, from late April to early November. It is one of the most visited pilgrimage centres of India, having recorded 2.8 million visits in just 2 months in 2022. It is one of the Char Dham pilgrimage sites.',
  '["Char Dham biometric registration required by Uttarakhand government","Closed during winter due to heavy snow; deity moves to Pandukeshwar"]'::jsonb, 0, 'free darshan', '4:30 AM - 1:00 PM, 4:00 PM - 9:00 PM (Open May to November annually)', 'May to June, September to October',
  ARRAY['Char Dham','Lord Vishnu Shrine','Alaknanda River','Garhwal Himalayas'], 'Q800160', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Badrinath_Temple_%2C_Uttarakhand.jpg/3840px-Badrinath_Temple_%2C_Uttarakhand.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4000, 3000, '6178763f4e2e99493c35fd28928b80232b333ecb99729cdd0897a00631353568', true, true
FROM public.places WHERE slug = 'badrinath-temple'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'kedarnath-temple', 'Kedarnath Temple', 'attraction', 'Spiritual', 'Uttarakhand', 'Kedarnath (Rudraprayag)',
  'Kedarnath (Rudraprayag), Uttarakhand, India', 30.7352, 79.0669, 'Kēdāranātha Temple is a Hindu temple, one of the twelve jyotirlinga of Śiva. The temple is located on the Garhwal Himalayan range 
near the Mandākinī River, in the state of Uttarakhand, India. Due to extreme weather conditions, the temple is open to the general public only between the months of April and November. During the winters, the vigraha (deity) of the temple is carried down to Ukhimath to be worshiped for the next six months. Kēdāranātha is seen as a homogeneous form of Śiva, the ''Lord of Kēdārakhaṇḍa'', the historical name of the region.',
  '["16 km mountain trek from Gaurikund or helicopter shuttle","Char Dham biometric registration compulsory"]'::jsonb, 0, 'free darshan', '4:00 AM - 1:00 PM, 5:00 PM - 9:00 PM (May to November annually)', 'May to June, September to October',
  ARRAY['Jyotirlinga','Char Dham','Shiva Sanctuary','Mandakini River'], 'Q839841', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Kedarnath_Temple_in_Rainy_season.jpg/3840px-Kedarnath_Temple_in_Rainy_season.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4073, 3165, '56caa3dcb248d45fad52c135066ad9879bea9c03a77e8e726a0f00d2a78e7154', true, true
FROM public.places WHERE slug = 'kedarnath-temple'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'rishikesh-triveni-laxman-jhula', 'Rishikesh Ganga Ghats & Suspension Bridges', 'attraction', 'Spiritual & Adventure', 'Uttarakhand', 'Rishikesh',
  'Rishikesh, Uttarakhand, India', 30.136, 78.3308, 'Lakshman Jhula is a suspension bridge across the river Ganges. This is a very famous and older bridge on river ganga and has been closed from 2020. Lakshman Jhula was built in the time of the East India Company.',
  '["Smoking, alcohol, and non-vegetarian food strictly banned across Rishikesh municipality","Wear life-jackets during certified river rafting"]'::jsonb, 0, 'free ghat access', 'Open 24 hours · Triveni Ghat Maha Aarti at 6:00 PM daily', 'September to April (river rafting season October to May)',
  ARRAY['Yoga Capital of the World','Ganga Aarti','White Water Rafting','Ashrams'], 'Q16859535', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Rishikesh-Lakshman_Jhula_by_Kaustubh_Nayyar.jpg/3840px-Rishikesh-Lakshman_Jhula_by_Kaustubh_Nayyar.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4608, 2592, '0dfad3cc122aad0f15d29dbd4093447ec7ba332584e0ef980a42069122f34e3d', true, true
FROM public.places WHERE slug = 'rishikesh-triveni-laxman-jhula'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'har-ki-pauri-haridwar', 'Har Ki Pauri Haridwar', 'attraction', 'Spiritual', 'Uttarakhand', 'Haridwar',
  'Haridwar, Uttarakhand, India', 29.9567, 78.1708, ' 
Har Ki Pauri is a sacred ghat on the banks of the Ganges River in the Hindu holy city of Haridwar, in the Indian state of Uttarakhand.',
  '["Watch out for swift river currents at bathing steps; use support chains provided","Deposit footwear at designated ghat stalls"]'::jsonb, 0, 'free access', 'Open 24 hours · Evening Ganga Aarti at sunset (approx. 6:30 PM)', 'October to March (Kumbh Mela site)',
  ARRAY['Sacred Brahmakund','Ganga Aarti','Ancient Pilgrimage','Haridwar'], 'Q3126830', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Evening_view_of_Har-ki-Pauri%2C_Haridwar.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  800, 542, '409866828d54db5526228327eed787927181dd403fd935d19f40ad60166a94f5', true, true
FROM public.places WHERE slug = 'har-ki-pauri-haridwar'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'valley-of-flowers', 'Valley of Flowers National Park', 'attraction', 'Nature & Trekking', 'Uttarakhand', 'Govindghat (Chamoli)',
  'Govindghat (Chamoli), Uttarakhand, India', 30.728, 79.605, 'Valley of Flowers National Park is an Indian national park which was established in 1982. It is located in Chamoli in the state of Uttarakhand and is known for its meadows of endemic alpine flowers and the variety of flora. This richly diverse area is also home to rare and endangered animals, including the Asiatic black bear, snow leopard, musk deer, brown bear, red fox and blue sheep. Birds found in the park include Himalayan monal pheasant and other high-altitude birds.',
  '["Open only from June 1 to October 31","No overnight stay inside park boundary; base camp is Ghangaria"]'::jsonb, 200, 'permit for 3 days', '7:00 AM - 2:00 PM entry (must exit valley before 5:00 PM daily; overnight camping strictly banned)', 'July to early September (peak wildflower bloom)',
  ARRAY['UNESCO World Heritage','Wildflowers','Brahma Kamal','Alpine Trek'], 'Q843132', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Valley_of_flowers_national_park%2C_Uttarakhand%2C_India_03_%28edit%29.jpg/3840px-Valley_of_flowers_national_park%2C_Uttarakhand%2C_India_03_%28edit%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  6000, 4000, '0a3a76b5c76919a15668db05bb59591b07bdb8e6a24ae3a5d19195f222e89474', true, true
FROM public.places WHERE slug = 'valley-of-flowers'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'jim-corbett-national-park', 'Jim Corbett National Park', 'attraction', 'Wildlife Sanctuary', 'Uttarakhand', 'Ramnagar (Nainital)',
  'Ramnagar (Nainital), Uttarakhand, India', 29.53, 78.7747, 'Jim Corbett National Park is a national park in the Nainital district of the state of Uttarakhand, India. It was established in 1936 as the country''s first national park and is named in honour of Jim Corbett, who had played a leading role in its establishment. It was the first to come under the Project Tiger initiative and encompasses an area of 520.8 km2 (201.1 sq mi) consisting of hills, riverine belts, marshy depressions, grasslands and a large lake at an elevation range of 400–1,220 m (1,300–4,000 ft). It receives rainfall from July to September. Almost 73% of the national park is covered by dense moist deciduous forest dominated by Shorea robusta, peepal, rohini and mango trees among 110 tree species and 617 different plant species. Grasslands cover about 10% of its total area. It harbours 50 mammal species, 580 bird species and 25 reptile species. The increase in tourist activities continues to present a serious challenge to the park''s ecological balance.',
  '["Advance government online permit booking required","Do not alight from safari jeep inside forest zone"]'::jsonb, 1000, 'safari permit estimate per vehicle', 'Morning safari: 6:00 AM - 9:30 AM · Afternoon safari: 2:30 PM - 6:00 PM', 'November to June (Dhikala zone opens November 15)',
  ARRAY['Bengal Tiger Reserve','India First National Park','Ramganga River','Jungle Safari'], 'Q1471718', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/7/78/Bengal-Tiger_Corbett_Uttarakhand_Dec-2013.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1024, 683, '8a842e6e7ab022e3e21625320e6d3d42fe98852b4b840a7aa3d2a0a700e8efc3', true, false
FROM public.places WHERE slug = 'jim-corbett-national-park'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'dal-lake-srinagar', 'Dal Lake & Shikara Rides', 'attraction', 'Lake & Culture', 'Jammu and Kashmir', 'Srinagar',
  'Srinagar, Jammu and Kashmir, India', 34.1167, 74.8667, 'Dal is a freshwater lake in Srinagar, the summer capital of Jammu and Kashmir in Indian-administered Kashmir. It is an urban lake, the second largest lake in Jammu and Kashmir, and the most visited place in Srinagar by tourists and locals. It is integral to tourism and recreation in the Kashmir Valley and is variously known as the "Lake of Flowers", "Jewel in the crown of Kashmir" or "Srinagar''s Jewel". The lake is also an important source for commercial operations in fishing and water plant harvesting.',
  '["Negotiate or book government fixed-rate Shikara stands at Boulevard Road Ghats","Wear life-jackets provided on shikaras"]'::jsonb, 800, 'per hour Shikara boat ride regulated rate', 'Sunrise to late evening · Early morning floating vegetable market at 5:30 AM', 'April to October (chinar autumn in October, lotus bloom in July)',
  ARRAY['Shikara Boat','Houseboats','Floating Market','Kashmir Valley'], 'Q1157973', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Dal_Lake_Hazratbal_Srinagar.jpg/3840px-Dal_Lake_Hazratbal_Srinagar.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  5727, 3818, '305cdac945029413a18b97045aac45c0960d3bdee88ea90575f29597c545732b', true, true
FROM public.places WHERE slug = 'dal-lake-srinagar'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'gulmarg-gondola', 'Gulmarg Gondola & Apharwat Peak', 'attraction', 'Hill Station & Snow', 'Jammu and Kashmir', 'Gulmarg',
  'Gulmarg, Jammu and Kashmir, India', 34.0489, 74.3806, 'Gulmarg Gondola in Gulmarg, Jammu and Kashmir, is the second longest and second highest cable car in the world. Higher lines include the Mi Teleférico in Bolivia and at Jade Dragon Snow Mountain.',
  '["Book gondola tickets online well in advance (heavy seasonal rush)","Carry adequate thermal winter wear for Phase 2 at 13,780 ft"]'::jsonb, 800, 'Phase 1 ticket (Phase 2 ₹1,050)', '9:00 AM - 4:00 PM (Subject to mountain weather conditions)', 'December to March (skiing snow season) or May to September (green meadow)',
  ARRAY['Ski Resort','Highest Cable Car in Asia','Apharwat Peak','Snow Sports'], 'Q5617652', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Gulmarg_gondola.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2048, 1222, '9d316ffe9ca9179a1bf90f16e6342dd1f70e26976e40b3a5694483de0636c1cb', true, true
FROM public.places WHERE slug = 'gulmarg-gondola'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'shalimar-bagh-srinagar', 'Shalimar Bagh Mughal Garden', 'attraction', 'Heritage Garden', 'Jammu and Kashmir', 'Srinagar',
  'Srinagar, Jammu and Kashmir, India', 34.1481, 74.8728, 'Shalimar Bagh is a Mughal garden in Srinagar, Indian-administered Jammu and Kashmir, located at the northeast of Dal Lake. It is also known as Shalimar Garden, Farah Baksh, and Faiz Baksh. The other famous shoreline garden in the vicinity is Nishat Bagh, ''The Garden of Delight''. The garden was built by Mughal emperor Jahangir in 1619 and is considered the high point of Mughal horticulture. It is now a public park and also referred to as the "Crown of Srinagar".',
  '["Stay on garden paved terrace walkways","Do not pluck flowers or step on manicured turf"]'::jsonb, 24, 'per person', '9:00 AM - 7:00 PM daily', 'April to October (golden autumn chinars in October-November)',
  ARRAY['Mughal Terrace Garden','Emperor Jahangir','Chinar Trees','Water Cascades'], 'Q3481283', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Shalimar_Bagh_1.jpg/3840px-Shalimar_Bagh_1.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4000, 2250, 'a0fc11158d96a1ea117a64bf6ca2f845a4b021baa741f6a00c020a57ad671b28', true, true
FROM public.places WHERE slug = 'shalimar-bagh-srinagar'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'betaab-valley-pahalgam', 'Betaab Valley & Aru Valley', 'attraction', 'Nature & Valley', 'Jammu and Kashmir', 'Pahalgam',
  'Pahalgam, Jammu and Kashmir, India', 34.032, 75.353, 'Betaab Valley, also known as Hajan Valley, Hagan Valley or Hagoon, is situated at a distance of 15 km (9.3 mi) from Pahalgam in the Anantnag district in India''s union territory of Jammu and Kashmir. The Valley is towards northeast of Pahalgam and falls between Pahalgam and Chandanwadi and is en route Amarnath Temple Yatra. The valley surrounded by lush green meadows, snow clad mountains and covered with dense vegetation.',
  '["Local union taxi cabs operate routes from Pahalgam town stand","Keep the Lidder river valley clean and plastic-free"]'::jsonb, 100, 'per person', '8:00 AM - 6:00 PM daily', 'April to October',
  ARRAY['Lidder River','Bollywood Shooting Site','Pine Forests','Pahalgam'], 'Q4897262', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Betaab_Valley.jpg/3840px-Betaab_Valley.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4608, 3072, '5501f2028523ff4bf11316c848cfc9846f79b17446e1856835fe08ae3624cbed', true, true
FROM public.places WHERE slug = 'betaab-valley-pahalgam'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'vaishno-devi-katra', 'Shri Mata Vaishno Devi Shrine', 'attraction', 'Spiritual', 'Jammu and Kashmir', 'Katra',
  'Katra, Jammu and Kashmir, India', 33.0308, 74.949, 'Vaishno Devi, also known as Vaishnavi, Trikuta, and Sherawali, is a Hindu deity considered to have the nature of Shakti and, at the Vaishno Devi Temple, is self-manifest as three Pindis described as the goddesses Mahakali, Mahalakshmi, and Mahasaraswati. She is worshipped as an ascetic, vegetarian, and virgin goddess who is associated with Vishnu. Believed to be the Mahadevi, she is revered as a divine "Mother" who protects and grants boons to her devotees. She is also described in some regional traditions as the eldest of the Seven Sisters goddesses of North India.',
  '["Online yatra registration slip (RFID card) mandatory at Katra base before starting trek","Battery cars and ropeway available for elderly pilgrims"]'::jsonb, 0, 'free holy darshan', 'Open 24 hours daily (closed for brief cleaning during aarti)', 'March to October (avoid peak festival crowd if looking for quick darshan)',
  ARRAY['Sacred Cave Shrine','Trikuta Mountains','Holy Yatra','Shakti Peeth'], 'Q1048473', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDgwMCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBkYXRhLXBsYWNlLWlkPSJ2YWlzaG5vLWRldmkta2F0cmEiPgogIDx0aXRsZT5TaHJpIE1hdGEgVmFpc2hubyBEZXZpIFNocmluZSwgS2F0cmEsIEphbW11IGFuZCBLYXNobWlyPC90aXRsZT4KICA8ZGVzYyBpZD0iZXhwbG9yZXgtcHJvbXB0Ij5taW5pbWFsIGZsYXQgaWxsdXN0cmF0aW9uIG9mIFNocmkgTWF0YSBWYWlzaG5vIERldmkgU2hyaW5lLCBLYXRyYSwgSmFtbXUgYW5kIEthc2htaXIsIHNhbmN0dWFyeSBwZXJjaGVkIGhpZ2ggb24gdGhlIGZvcmVzdGVkIFRyaWt1dGEgbW91bnRhaW4gcmFuZ2UgY29ubmVjdGVkIGJ5IGlsbHVtaW5hdGVkIHNlcnBlbnRpbmUgcGlsZ3JpbSB0cmFpbHMsIG5vIHRleHQsIG5vIHBlb3BsZTwvZGVzYz4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYmdHcmFkX3ZhaXNobm8tZGV2aS1rYXRyYSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMyRDE4MTAiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNEEyODE4Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJnb2xkR3JhZF92YWlzaG5vLWRldmkta2F0cmEiIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIwJSIgeTI9IjAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Y1OUUwQiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGREU2OEEiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InN1bkdsb3dfdmFpc2huby1kZXZpLWthdHJhIiBjeD0iNTAlIiBjeT0iMzUlIiByPSI0MCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRjU5RTBCIiBzdG9wLW9wYWNpdHk9IjAuMjUiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMkQxODEwIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgPC9kZWZzPgoKICA8IS0tIFNreSAmIEF0bW9zcGhlcmUgLS0+CiAgPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBmaWxsPSJ1cmwoI2JnR3JhZF92YWlzaG5vLWRldmkta2F0cmEpIi8+CiAgPGNpcmNsZSBjeD0iNjAwIiBjeT0iMzIwIiByPSIyODAiIGZpbGw9InVybCgjc3VuR2xvd192YWlzaG5vLWRldmkta2F0cmEpIi8+CgogIDwhLS0gR2VvbWV0cmljIE1vdW50YWluIC8gQXJjaGl0ZWN0dXJhbCBCYWNrZHJvcCBMYXllcnMgLS0+CiAgPHBhdGggZD0iTTAsODAwIEwwLDYyMCBRMzAwLDUyMCA2MDAsNTYwIFQxMjAwLDYwMCBMMTIwMCw4MDAgWiIgZmlsbD0icmdiYSgyNDUsIDE1OCwgMTEsIDAuMTUpIi8+CiAgPHBhdGggZD0iTTAsODAwIEwwLDY4MCBRNDAwLDYwMCA4MDAsNjQwIFQxMjAwLDY2MCBMMTIwMCw4MDAgWiIgZmlsbD0icmdiYSgwLDAsMCwwLjIpIi8+CgogIDwhLS0gU3R5bGl6ZWQgTGFuZG1hcmsgU2lsaG91ZXR0ZXMgLS0+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjAwLCA1MjApIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4KICAgIDwhLS0gQ2VudGVyIERvbWUgLyBTcGlyZSBNb3RpZiAtLT4KICAgIDxwYXRoIGQ9Ik0gLTkwLDAgUSAtOTAsLTE2MCAwLC0yMTAgUSA5MCwtMTYwIDkwLDAgWiIgZmlsbD0idXJsKCNnb2xkR3JhZF92YWlzaG5vLWRldmkta2F0cmEpIiBvcGFjaXR5PSIwLjkiLz4KICAgIDwhLS0gRmxhbmtpbmcgTWluYXJldHMgLyBQaWxsYXJzIC0tPgogICAgPHJlY3QgeD0iLTE3MCIgeT0iLTE4MCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE4MCIgcng9IjQiIGZpbGw9InVybCgjZ29sZEdyYWRfdmFpc2huby1kZXZpLWthdHJhKSIgb3BhY2l0eT0iMC44NSIvPgogICAgPGNpcmNsZSBjeD0iLTE2MiIgY3k9Ii0xOTAiIHI9IjE0IiBmaWxsPSIjRkRFNjhBIi8+CiAgICA8cmVjdCB4PSIxNTQiIHk9Ii0xODAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxODAiIHJ4PSI0IiBmaWxsPSJ1cmwoI2dvbGRHcmFkX3ZhaXNobm8tZGV2aS1rYXRyYSkiIG9wYWNpdHk9IjAuODUiLz4KICAgIDxjaXJjbGUgY3g9IjE2MiIgY3k9Ii0xOTAiIHI9IjE0IiBmaWxsPSIjRkRFNjhBIi8+CiAgICA8IS0tIEFyY2hlZCBQb3J0YWwgLS0+CiAgICA8cGF0aCBkPSJNIC00MCwwIEwgLTQwLC05MCBRIDAsLTEzMCA0MCwtOTAgTCA0MCwwIFoiIGZpbGw9IiMyRDE4MTAiLz4KICA8L2c+CgogIDwhLS0gR3JvdW5kIFBsYW5lIC8gV2F0ZXIgUmVmbGVjdGlvbiAtLT4KICA8cmVjdCB5PSI3MDAiIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0icmdiYSgwLDAsMCwwLjM1KSIvPgogIDxsaW5lIHgxPSIxMDAiIHkxPSI3MjAiIHgyPSIxMTAwIiB5Mj0iNzIwIiBzdHJva2U9IiNGNTlFMEIiIHN0cm9rZS1vcGFjaXR5PSIwLjMiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtZGFzaGFycmF5PSIxMiwxMiIvPgogIDxsaW5lIHgxPSIyNTAiIHkxPSI3NDUiIHgyPSI5NTAiIHkyPSI3NDUiIHN0cm9rZT0iI0Y1OUUwQiIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1kYXNoYXJyYXk9IjI0LDE4Ii8+CgogIDwhLS0gTGFuZG1hcmsgVGl0bGUgTGFiZWwgU3VidGV4dCBpbiBTVkcgLS0+CiAgPHRleHQgeD0iNjAwIiB5PSI3NTUiIGZvbnQtZmFtaWx5PSItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiNGREU2OEEiIG9wYWNpdHk9IjAuNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgbGV0dGVyLXNwYWNpbmc9IjIuNSI+U0hSSSBNQVRBIFZBSVNITk8gREVWSSBTSFJJTkUgwrcgS0FUUkE8L3RleHQ+CgogIDwhLS0gQmFkZ2UgTWFya2VyIGluIGJvdHRvbSBjb3JuZXIgLS0+CiAgPHJlY3QgeD0iMzAiIHk9IjczOCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIzNCIgcng9IjE3IiBmaWxsPSJyZ2JhKDAsMCwwLDAuNikiIHN0cm9rZT0iI0Y1OUUwQiIgc3Ryb2tlLXdpZHRoPSIxLjIiLz4KICA8dGV4dCB4PSIxMTAiIHk9Ijc2MCIgZm9udC1mYW1pbHk9Ii1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iI0ZERTY4QSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgbGV0dGVyLXNwYWNpbmc9IjEuMiI+SUxMVVNUUkFUSU9OPC90ZXh0Pgo8L3N2Zz4=', 'ai_generated', 'Custom Vector Illustration (Creative Commons CC0)', 'Explorex AI Cultural Vector Illustration (Shri Mata Vaishno Devi Shrine)',
  1200, 800, '4fdf3fc5127e1efc00a9137260191f42d0ad4fe9d85ec71717f4c96f4353d431', true, true
FROM public.places WHERE slug = 'vaishno-devi-katra'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'pangong-tso-ladakh', 'Pangong Tso High Altitude Lake', 'attraction', 'High Altitude Lake', 'Ladakh', 'Leh (Changthang)',
  'Leh (Changthang), Ladakh, India', 33.7594, 78.6586, 'Pangong Tso or Pangong Lake is an endorheic lake spanning eastern Ladakh in India and Ngari Prefecture in Tibet. Situated at an elevation of 14,200 ft (4,300 m), it occupies an area of approximately 604 km2 (233 sq mi). It stretches for 134 km (83 mi) and is 5 km (3.1 mi) wide at its broadest point. It is located in a landlocked basin and is separated from the Indus River basin by an elevated ridge. The water is saline, and the lake freezes during winter.',
  '["Inner Line Permit (ILP) required from Leh district portal","Rest and acclimatize 48 hours in Leh before traveling to 14,270 ft lake","Zero tolerance for driving vehicles on shoreline"]'::jsonb, 500, 'Inner Line Permit ecology fee', 'Accessible during daylight hours', 'June to September',
  ARRAY['Color Changing Lake','Indo-Tibetan Border','High Altitude Desert','Himalayas'], 'Q1076878', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/66/ISS054-E-7809_-_View_of_Earth_%28cropped%29.jpg/3840px-ISS054-E-7809_-_View_of_Earth_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4454, 2970, 'f754273df723922058801b3ad0a285e5c6cb58c6711375c878587d7a2e6a82ba', true, false
FROM public.places WHERE slug = 'pangong-tso-ladakh'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'nubra-valley-hunder', 'Nubra Valley & Hunder Sand Dunes', 'attraction', 'Cold Desert & Valley', 'Ladakh', 'Diskit / Hunder',
  'Diskit / Hunder, Ladakh, India', 34.582, 77.47, 'Nubra, also called Dumra, is a historical region of Ladakh, India in the Nubra district. Its inhabited areas form a tri-armed valley cut by the Nubra and Shyok rivers. Its Tibetan name Dumra means "valley of flowers".',
  '["Cross Khardung La pass with valid permit","Eco-friendly disposal of all trash"]'::jsonb, 300, 'double-humped camel ride approx', 'Open daily · Camel safari 9:00 AM - 12:00 PM, 3:30 PM - 6:30 PM', 'June to September',
  ARRAY['Bactrian Camels','Cold Desert Dunes','Diskit Monastery','Shyok River'], 'Q1978438', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/5_Nubra_valley.jpg/3840px-5_Nubra_valley.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  6000, 4000, '7ea063f9c6b5b6281209f264a96868ef7ccedf90654c524ea41ac1fcfeddfba0', true, true
FROM public.places WHERE slug = 'nubra-valley-hunder'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'thiksey-monastery-ladakh', 'Thiksey Gompa & Maitreya Buddha', 'attraction', 'Spiritual', 'Ladakh', 'Leh (Thiksey)',
  'Leh (Thiksey), Ladakh, India', 34.0583, 77.6667, 'Thiksey Monastery or Thiksey Gompa is a Buddhist monastery affiliated with the Gelug school of Tibetan Buddhism. It is located on top of a hill in Thiksey approximately 19 kilometres (12 mi) east of Leh, in the Ladakh region of northern India. It is noted for its resemblance to the Potala Palace in Lhasa, Tibet, and is the largest monastery in central Ladakh, notably containing a separate set of buildings for female renunciates that has been the source of significant recent building and reorganization.',
  '["Observe respectful silence in Maitreya temple chamber","Photography permitted without flash in designated halls"]'::jsonb, 50, 'per person', '7:00 AM - 7:00 PM daily · Morning prayer chanting at 7:00 AM', 'May to October',
  ARRAY['Mini Potala','Gelugpa Order','Giant Maitreya Statue','Indus Valley'], 'Q1994689', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Thikse_Monastery_.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1600, 1067, '18ddba394fb185a5c6747e6096c07a201ef51419ebe68cfef9784ead680584d3', true, true
FROM public.places WHERE slug = 'thiksey-monastery-ladakh'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'khardung-la-pass', 'Khardung La Pass', 'attraction', 'Mountain Pass', 'Ladakh', 'Leh',
  'Leh, Ladakh, India', 34.2789, 77.6044, 'Khardung La or Khardung Pass, 40 km north of Leh city, is a mountain pass in the Leh district of the union territory of Ladakh in India.',
  '["Do not stay at the 17,982 ft pass summit for more than 20 minutes to prevent acute hypoxia","Carry portable oxygen can if sensitive to altitude"]'::jsonb, 0, 'included in Ladakh tourist permit', 'Traffic regulated by Indian Army and Ladakh Police according to schedule', 'June to September',
  ARRAY['World High Motorable Road','Karakoram Gateway','Prayer Flags','Extreme Altitude'], 'Q740523', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDgwMCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBkYXRhLXBsYWNlLWlkPSJraGFyZHVuZy1sYS1wYXNzIj4KICA8dGl0bGU+S2hhcmR1bmcgTGEgUGFzcywgTGVoLCBMYWRha2g8L3RpdGxlPgogIDxkZXNjIGlkPSJleHBsb3JleC1wcm9tcHQiPm1pbmltYWwgZmxhdCBpbGx1c3RyYXRpb24gb2YgS2hhcmR1bmcgTGEgUGFzcywgTGVoLCBMYWRha2gsIGhpZ2ggYWx0aXR1ZGUgbW91bnRhaW4gcGFzcyBjb3ZlcmVkIGluIHNub3cgd2l0aCBmbHV0dGVyaW5nIG11bHRpY29sb3JlZCBUaWJldGFuIHByYXllciBmbGFncyBhbmQgSW5kaWFuIEFybXkgc2lnbmJvYXJkLCBubyB0ZXh0LCBubyBwZW9wbGU8L2Rlc2M+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnR3JhZF9raGFyZHVuZy1sYS1wYXNzIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzFBMzQyNyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyQTRGM0UiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdvbGRHcmFkX2toYXJkdW5nLWxhLXBhc3MiIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIwJSIgeTI9IjAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0M5QTIyNyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNFNkM2NUMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InN1bkdsb3dfa2hhcmR1bmctbGEtcGFzcyIgY3g9IjUwJSIgY3k9IjM1JSIgcj0iNDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0M5QTIyNyIgc3RvcC1vcGFjaXR5PSIwLjI1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzFBMzQyNyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogIDwvZGVmcz4KCiAgPCEtLSBTa3kgJiBBdG1vc3BoZXJlIC0tPgogIDxyZWN0IHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjgwMCIgZmlsbD0idXJsKCNiZ0dyYWRfa2hhcmR1bmctbGEtcGFzcykiLz4KICA8Y2lyY2xlIGN4PSI2MDAiIGN5PSIzMjAiIHI9IjI4MCIgZmlsbD0idXJsKCNzdW5HbG93X2toYXJkdW5nLWxhLXBhc3MpIi8+CgogIDwhLS0gR2VvbWV0cmljIE1vdW50YWluIC8gQXJjaGl0ZWN0dXJhbCBCYWNrZHJvcCBMYXllcnMgLS0+CiAgPHBhdGggZD0iTTAsODAwIEwwLDYyMCBRMzAwLDUyMCA2MDAsNTYwIFQxMjAwLDYwMCBMMTIwMCw4MDAgWiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEyKSIvPgogIDxwYXRoIGQ9Ik0wLDgwMCBMMCw2ODAgUTQwMCw2MDAgODAwLDY0MCBUMTIwMCw2NjAgTDEyMDAsODAwIFoiIGZpbGw9InJnYmEoMCwwLDAsMC4yKSIvPgoKICA8IS0tIFN0eWxpemVkIExhbmRtYXJrIFNpbGhvdWV0dGVzIC0tPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYwMCwgNTIwKSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+CiAgICA8IS0tIENlbnRlciBEb21lIC8gU3BpcmUgTW90aWYgLS0+CiAgICA8cGF0aCBkPSJNIC05MCwwIFEgLTkwLC0xNjAgMCwtMjEwIFEgOTAsLTE2MCA5MCwwIFoiIGZpbGw9InVybCgjZ29sZEdyYWRfa2hhcmR1bmctbGEtcGFzcykiIG9wYWNpdHk9IjAuOSIvPgogICAgPCEtLSBGbGFua2luZyBNaW5hcmV0cyAvIFBpbGxhcnMgLS0+CiAgICA8cmVjdCB4PSItMTcwIiB5PSItMTgwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTgwIiByeD0iNCIgZmlsbD0idXJsKCNnb2xkR3JhZF9raGFyZHVuZy1sYS1wYXNzKSIgb3BhY2l0eT0iMC44NSIvPgogICAgPGNpcmNsZSBjeD0iLTE2MiIgY3k9Ii0xOTAiIHI9IjE0IiBmaWxsPSIjRTZDNjVDIi8+CiAgICA8cmVjdCB4PSIxNTQiIHk9Ii0xODAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxODAiIHJ4PSI0IiBmaWxsPSJ1cmwoI2dvbGRHcmFkX2toYXJkdW5nLWxhLXBhc3MpIiBvcGFjaXR5PSIwLjg1Ii8+CiAgICA8Y2lyY2xlIGN4PSIxNjIiIGN5PSItMTkwIiByPSIxNCIgZmlsbD0iI0U2QzY1QyIvPgogICAgPCEtLSBBcmNoZWQgUG9ydGFsIC0tPgogICAgPHBhdGggZD0iTSAtNDAsMCBMIC00MCwtOTAgUSAwLC0xMzAgNDAsLTkwIEwgNDAsMCBaIiBmaWxsPSIjMUEzNDI3Ii8+CiAgPC9nPgoKICA8IS0tIEdyb3VuZCBQbGFuZSAvIFdhdGVyIFJlZmxlY3Rpb24gLS0+CiAgPHJlY3QgeT0iNzAwIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InJnYmEoMCwwLDAsMC4zNSkiLz4KICA8bGluZSB4MT0iMTAwIiB5MT0iNzIwIiB4Mj0iMTEwMCIgeTI9IjcyMCIgc3Ryb2tlPSIjQzlBMjI3IiBzdHJva2Utb3BhY2l0eT0iMC4zIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWRhc2hhcnJheT0iMTIsMTIiLz4KICA8bGluZSB4MT0iMjUwIiB5MT0iNzQ1IiB4Mj0iOTUwIiB5Mj0iNzQ1IiBzdHJva2U9IiNDOUEyMjciIHN0cm9rZS1vcGFjaXR5PSIwLjIiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtZGFzaGFycmF5PSIyNCwxOCIvPgoKICA8IS0tIExhbmRtYXJrIFRpdGxlIExhYmVsIFN1YnRleHQgaW4gU1ZHIC0tPgogIDx0ZXh0IHg9IjYwMCIgeT0iNzU1IiBmb250LWZhbWlseT0iLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSIjRTZDNjVDIiBvcGFjaXR5PSIwLjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGxldHRlci1zcGFjaW5nPSIyLjUiPktIQVJEVU5HIExBIFBBU1MgwrcgTEVIPC90ZXh0PgoKICA8IS0tIEJhZGdlIE1hcmtlciBpbiBib3R0b20gY29ybmVyIC0tPgogIDxyZWN0IHg9IjMwIiB5PSI3MzgiIHdpZHRoPSIxNjAiIGhlaWdodD0iMzQiIHJ4PSIxNyIgZmlsbD0icmdiYSgwLDAsMCwwLjYpIiBzdHJva2U9IiNDOUEyMjciIHN0cm9rZS13aWR0aD0iMS4yIi8+CiAgPHRleHQgeD0iMTEwIiB5PSI3NjAiIGZvbnQtZmFtaWx5PSItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTMiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNFNkM2NUMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGxldHRlci1zcGFjaW5nPSIxLjIiPklMTFVTVFJBVElPTjwvdGV4dD4KPC9zdmc+', 'ai_generated', 'Custom Vector Illustration (Creative Commons CC0)', 'Explorex AI Cultural Vector Illustration (Khardung La Pass)',
  1200, 800, '57504ff234fb763e73e8eef96ca8fa1b61da89ece73bec1f76dcd7be91c19ee8', true, true
FROM public.places WHERE slug = 'khardung-la-pass'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'shanti-stupa-leh', 'Shanti Stupa Leh', 'attraction', 'Spiritual Monument', 'Ladakh', 'Leh',
  'Leh, Ladakh, India', 34.1719, 77.5817, 'Shanti Stupa is a Buddhist white-domed Stupa (chorten) on a hilltop in Chanspa, Leh district, Ladakh, in north India. It was built in 1991 by Japanese Buddhist monk Gyomyo Nakamura. The Shanti Stupa holds the relics of the Buddha at its base, enshrined by the 14th Dalai Lama. The Stupa has become a tourist attraction not only due to its religious significance but also due to its location which provides panoramic views of the surrounding landscape.',
  '["Circumambulate stupa in a clockwise direction","Footwear must be removed on the upper stupa terrace"]'::jsonb, 0, 'free entry', '5:00 AM - 9:00 PM daily', 'Sunset or sunrise (panoramic city and mountain views)',
  ARRAY['White-domed Stupa','Sunset Viewpoint','Peace Pagoda','Leh Town Panorama'], 'Q7489066', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/8/81/Leh%2C_Shanti_Stupa%2C_Ladakh%2C_India.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2048, 3072, '5a20908645bdaf5d64dda928858469d8f6ffadc2fdfbb0c35c46206de7520fae', true, true
FROM public.places WHERE slug = 'shanti-stupa-leh'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'rock-garden-chandigarh', 'Rock Garden of Chandigarh', 'attraction', 'Sculpture & Art', 'Chandigarh', 'Chandigarh',
  'Chandigarh, Chandigarh, India', 30.7525, 76.8069, 'The Rock Garden of Chandigarh is a sculpture garden in Chandigarh, India. It is also known as Nek Chand Saini''s Rock Garden of Nathupur  after its founder Nek Chand Saini, a government official who started building the garden secretly in his spare time in 1957. It has spread over an area of 40 acres (16 ha), and is completely built from industrial, home waste, and discarded items.',
  '["Follow designated winding path through all phases","Do not climb or deface recycled ceramic sculptures"]'::jsonb, 30, 'per person', '9:00 AM - 7:00 PM (April to September), 9:00 AM - 6:00 PM (October to March)', 'October to March',
  ARRAY['Nek Chand Masterpiece','Recycled Art','Waterfalls','Chandigarh Landmark'], 'Q3520110', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Chandigarh_Rock_Garden_4.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3264, 2448, '14aa9301b4883722c556f75c56a88783571415897100a24b9835b725d74a7fc4', true, true
FROM public.places WHERE slug = 'rock-garden-chandigarh'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'sukhna-lake-chandigarh', 'Sukhna Lake Promenade', 'attraction', 'Lake & Recreation', 'Chandigarh', 'Chandigarh',
  'Chandigarh, Chandigarh, India', 30.7425, 76.8183, 'Sukhna Lake is a reservoir and wetland hosting the Sukhna Wildlife Sanctuary located in Chandigarh, India, at the Shivalik hills of the Himalayas. This 3 km2 rain-fed lake was created in 1958 by damming the Sukhna Choe, a seasonal stream coming down from the Shivalik hills. Originally, the seasonal flow entered the lake directly, causing heavy siltation. To check the inflow of silt, 25.42 km2 of land was acquired in the catchment area and put under vegetation. In 1974, the Choe was diverted and made to bypass the lake completely, the lake being fed by three siltation pots, minimizing the silt into the lake itself.',
  '["No feeding ducks or birds in the lake","Pedal and solar boat rentals available at central jetty"]'::jsonb, 0, 'free promenade access', '5:00 AM - 9:00 PM daily · Boating 9:30 AM - 6:00 PM', 'October to March (migratory bird season)',
  ARRAY['Shivalik Foothills','Birdwatching','Boating','Walking Trail'], 'Q7635790', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Sukhna_Lake_Chandigarh_India.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1241, 931, '95e040f15554bba0082522ffb7845490991171c550a7b704964eae7f73326eea', true, true
FROM public.places WHERE slug = 'sukhna-lake-chandigarh'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'capitol-complex-chandigarh', 'Chandigarh Capitol Complex', 'attraction', 'Modernist Architecture', 'Chandigarh', 'Chandigarh',
  'Chandigarh, Chandigarh, India', 30.7583, 76.8042, 'Chandigarh Capitol Complex is a government compound designed by Swiss-French architect Le Corbusier and his co-workers in Chandigarh, India.',
  '["Government security registration required before entering High Court and Secretariat areas","ID proof mandatory for all visitors"]'::jsonb, 0, 'free guided tour registration', 'Three daily guided tours: 10:00 AM, 12:00 PM, 3:00 PM (Requires tourist pass from Sector 1)', 'October to March',
  ARRAY['UNESCO World Heritage','Le Corbusier','Open Hand Monument','Modernism'], 'Q2937517', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Palace_of_Assembly_Chandigarh_2006.jpg/3840px-Palace_of_Assembly_Chandigarh_2006.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4760, 1990, '08391fb9d2c7103ac90695f1ffe58a8241273541e5645ba963e929ad43f574a5', true, true
FROM public.places WHERE slug = 'capitol-complex-chandigarh'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'brahma-sarovar-kurukshetra', 'Brahma Sarovar & Jyotisar', 'attraction', 'Spiritual & Heritage', 'Haryana', 'Kurukshetra',
  'Kurukshetra, Haryana, India', 29.961, 76.835, '

Brahma Sarovar is a natural and divine tank in Kurukshetra, in the state of Haryana, India. It is 3600 feet long, 1500 feet wide, and 45 feet deep. Hinduism lays emphasis on taking bath for internal and external purity. Most religious sites have water pools or sarovar in or near the Hindu temple and Sikh gurdwara. The Hindu genealogy registers at Kurukshetra, Haryana are kept here.',
  '["Maintain cleanliness along the vast stone bathing steps","Deposit shoes at designated counters before inner shrine"]'::jsonb, 0, 'free entry', 'Open 24 hours daily · Evening Aarti at sunset', 'October to March (Gita Jayanti festival in December)',
  ARRAY['Mahabharata Epic','Sacred Sarovar','Gita Birthplace','Kurukshetra'], 'Q4955543', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Holy_pic_kkr.jpg/3840px-Holy_pic_kkr.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4096, 3072, 'b9240fbc81ee05878effc1ab94e44ed0965f87caed8da60c8c8d65bc02791987', true, false
FROM public.places WHERE slug = 'brahma-sarovar-kurukshetra'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'sultanpur-national-park', 'Sultanpur National Park & Bird Sanctuary', 'attraction', 'Wildlife Sanctuary', 'Haryana', 'Gurugram (Sultanpur)',
  'Gurugram (Sultanpur), Haryana, India', 28.4633, 76.8906, 'Sultanpur National Park is a national park in Haryana, India, covering approximately 1.43 km2 (0.55 sq mi).',
  '["Closed every Tuesday","Binoculars recommended; quiet observation mandatory in watchtowers"]'::jsonb, 5, 'per person', '7:00 AM - 4:30 PM (Closed on Tuesdays · Open October to March)', 'November to February (migratory waterfowl peak season)',
  ARRAY['Ramsar Wetland','Migratory Birds','Siberian Cranes','Eco Park'], 'Q17068597', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/5/58/Sultanpur_Bird_Sanctuary%2C_Gurgaon.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3264, 2448, 'fdc85218ceaa2743acb3bf7981c722873a84c1f2eba42e49b26d69f5b93a184f', true, true
FROM public.places WHERE slug = 'sultanpur-national-park'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'sheikh-chilli-tomb-thanesar', 'Sheikh Chilli Tomb & Harsh Ka Tila', 'attraction', 'Heritage Monument', 'Haryana', 'Thanesar (Kurukshetra)',
  'Thanesar (Kurukshetra), Haryana, India', 29.9767, 76.8242, 'Sheikh Chilli Tomb & Harsh Ka Tila is a renowned heritage monument in Thanesar (Kurukshetra), Haryana.',
  '["Remove shoes before stepping onto marble tomb terrace","Keep ASI ticket receipt handy"]'::jsonb, 25, 'per person', '9:00 AM - 5:00 PM (Closed on Fridays)', 'October to March',
  ARRAY['Mughal Architecture','Sufi Saint','Pear-shaped Marble Dome','ASI Protected'], 'Q19896798', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDgwMCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBkYXRhLXBsYWNlLWlkPSJzaGVpa2gtY2hpbGxpLXRvbWItdGhhbmVzYXIiPgogIDx0aXRsZT5TaGVpa2ggQ2hpbGxpIFRvbWIgJiBIYXJzaCBLYSBUaWxhLCBUaGFuZXNhciAoS3VydWtzaGV0cmEpLCBIYXJ5YW5hPC90aXRsZT4KICA8ZGVzYyBpZD0iZXhwbG9yZXgtcHJvbXB0Ij5taW5pbWFsIGZsYXQgaWxsdXN0cmF0aW9uIG9mIFNoZWlraCBDaGlsbGkgVG9tYiAmIEhhcnNoIEthIFRpbGEsIFRoYW5lc2FyIChLdXJ1a3NoZXRyYSksIEhhcnlhbmEsIG9jdGFnb25hbCB3aGl0ZSBtYXJibGUgbWF1c29sZXVtIHdpdGggcGVhci1zaGFwZWQgZG9tZSBzdGFuZGluZyBvdmVyIGFuIGVsZXZhdGVkIHJlZCBzYW5kc3RvbmUgdGVycmFjZSB3aXRoIG1hZHJhc2EgYXJjYWRlLCBubyB0ZXh0LCBubyBwZW9wbGU8L2Rlc2M+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnR3JhZF9zaGVpa2gtY2hpbGxpLXRvbWItdGhhbmVzYXIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMUEzNDI3Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzJBNEYzRSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ29sZEdyYWRfc2hlaWtoLWNoaWxsaS10b21iLXRoYW5lc2FyIiB4MT0iMCUiIHkxPSIxMDAlIiB4Mj0iMCUiIHkyPSIwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNDOUEyMjciLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRTZDNjVDIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJzdW5HbG93X3NoZWlraC1jaGlsbGktdG9tYi10aGFuZXNhciIgY3g9IjUwJSIgY3k9IjM1JSIgcj0iNDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0M5QTIyNyIgc3RvcC1vcGFjaXR5PSIwLjI1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzFBMzQyNyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogIDwvZGVmcz4KCiAgPCEtLSBTa3kgJiBBdG1vc3BoZXJlIC0tPgogIDxyZWN0IHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjgwMCIgZmlsbD0idXJsKCNiZ0dyYWRfc2hlaWtoLWNoaWxsaS10b21iLXRoYW5lc2FyKSIvPgogIDxjaXJjbGUgY3g9IjYwMCIgY3k9IjMyMCIgcj0iMjgwIiBmaWxsPSJ1cmwoI3N1bkdsb3dfc2hlaWtoLWNoaWxsaS10b21iLXRoYW5lc2FyKSIvPgoKICA8IS0tIEdlb21ldHJpYyBNb3VudGFpbiAvIEFyY2hpdGVjdHVyYWwgQmFja2Ryb3AgTGF5ZXJzIC0tPgogIDxwYXRoIGQ9Ik0wLDgwMCBMMCw2MjAgUTMwMCw1MjAgNjAwLDU2MCBUMTIwMCw2MDAgTDEyMDAsODAwIFoiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xMikiLz4KICA8cGF0aCBkPSJNMCw4MDAgTDAsNjgwIFE0MDAsNjAwIDgwMCw2NDAgVDEyMDAsNjYwIEwxMjAwLDgwMCBaIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMikiLz4KCiAgPCEtLSBTdHlsaXplZCBMYW5kbWFyayBTaWxob3VldHRlcyAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MDAsIDUyMCkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPgogICAgPCEtLSBDZW50ZXIgRG9tZSAvIFNwaXJlIE1vdGlmIC0tPgogICAgPHBhdGggZD0iTSAtOTAsMCBRIC05MCwtMTYwIDAsLTIxMCBRIDkwLC0xNjAgOTAsMCBaIiBmaWxsPSJ1cmwoI2dvbGRHcmFkX3NoZWlraC1jaGlsbGktdG9tYi10aGFuZXNhcikiIG9wYWNpdHk9IjAuOSIvPgogICAgPCEtLSBGbGFua2luZyBNaW5hcmV0cyAvIFBpbGxhcnMgLS0+CiAgICA8cmVjdCB4PSItMTcwIiB5PSItMTgwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTgwIiByeD0iNCIgZmlsbD0idXJsKCNnb2xkR3JhZF9zaGVpa2gtY2hpbGxpLXRvbWItdGhhbmVzYXIpIiBvcGFjaXR5PSIwLjg1Ii8+CiAgICA8Y2lyY2xlIGN4PSItMTYyIiBjeT0iLTE5MCIgcj0iMTQiIGZpbGw9IiNFNkM2NUMiLz4KICAgIDxyZWN0IHg9IjE1NCIgeT0iLTE4MCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE4MCIgcng9IjQiIGZpbGw9InVybCgjZ29sZEdyYWRfc2hlaWtoLWNoaWxsaS10b21iLXRoYW5lc2FyKSIgb3BhY2l0eT0iMC44NSIvPgogICAgPGNpcmNsZSBjeD0iMTYyIiBjeT0iLTE5MCIgcj0iMTQiIGZpbGw9IiNFNkM2NUMiLz4KICAgIDwhLS0gQXJjaGVkIFBvcnRhbCAtLT4KICAgIDxwYXRoIGQ9Ik0gLTQwLDAgTCAtNDAsLTkwIFEgMCwtMTMwIDQwLC05MCBMIDQwLDAgWiIgZmlsbD0iIzFBMzQyNyIvPgogIDwvZz4KCiAgPCEtLSBHcm91bmQgUGxhbmUgLyBXYXRlciBSZWZsZWN0aW9uIC0tPgogIDxyZWN0IHk9IjcwMCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMzUpIi8+CiAgPGxpbmUgeDE9IjEwMCIgeTE9IjcyMCIgeDI9IjExMDAiIHkyPSI3MjAiIHN0cm9rZT0iI0M5QTIyNyIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1kYXNoYXJyYXk9IjEyLDEyIi8+CiAgPGxpbmUgeDE9IjI1MCIgeTE9Ijc0NSIgeDI9Ijk1MCIgeTI9Ijc0NSIgc3Ryb2tlPSIjQzlBMjI3IiBzdHJva2Utb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWRhc2hhcnJheT0iMjQsMTgiLz4KCiAgPCEtLSBMYW5kbWFyayBUaXRsZSBMYWJlbCBTdWJ0ZXh0IGluIFNWRyAtLT4KICA8dGV4dCB4PSI2MDAiIHk9Ijc1NSIgZm9udC1mYW1pbHk9Ii1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjYwMCIgZmlsbD0iI0U2QzY1QyIgb3BhY2l0eT0iMC40IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMi41Ij5TSEVJS0ggQ0hJTExJIFRPTUIgJiBIQVJTSCBLQSBUSUxBIMK3IFRIQU5FU0FSIChLVVJVS1NIRVRSQSk8L3RleHQ+CgogIDwhLS0gQmFkZ2UgTWFya2VyIGluIGJvdHRvbSBjb3JuZXIgLS0+CiAgPHJlY3QgeD0iMzAiIHk9IjczOCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIzNCIgcng9IjE3IiBmaWxsPSJyZ2JhKDAsMCwwLDAuNikiIHN0cm9rZT0iI0M5QTIyNyIgc3Ryb2tlLXdpZHRoPSIxLjIiLz4KICA8dGV4dCB4PSIxMTAiIHk9Ijc2MCIgZm9udC1mYW1pbHk9Ii1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iI0U2QzY1QyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgbGV0dGVyLXNwYWNpbmc9IjEuMiI+SUxMVVNUUkFUSU9OPC90ZXh0Pgo8L3N2Zz4=', 'ai_generated', 'Custom Vector Illustration (Creative Commons CC0)', 'Explorex AI Cultural Vector Illustration (Sheikh Chilli Tomb & Harsh Ka Tila)',
  1200, 800, '3748620bea07abe8ca57a689788bb5d959c61a4633f93b46a07b82d4cb3822ce', true, true
FROM public.places WHERE slug = 'sheikh-chilli-tomb-thanesar'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'pinjore-gardens-panchkula', 'Yadavindra Gardens (Pinjore)', 'attraction', 'Heritage Garden', 'Haryana', 'Panchkula (Pinjore)',
  'Panchkula (Pinjore), Haryana, India', 30.7967, 76.915, 'Yadavindra Gardens, also known as Pinjore Gardens, is a historic 17th century garden located in Pinjore city of Panchkula district in the Indian state of Haryana. Panchkula city is nearby it. It is an example of the Mughal gardens architectural style, which was renovated by the Patiala dynasty Sikh rulers. The garden was built by Fidai Khan, a foster-brother to the Mughal Emperor Aurangzeb.',
  '["Do not wade into fountain water channels","Toy train ride available inside lower garden terrace"]'::jsonb, 25, 'per person', '7:00 AM - 9:30 PM daily (illuminated fountains in evening)', 'October to April (Mango Festival in July)',
  ARRAY['17th Century Mughal Garden','Terraces','Illuminated Fountains','Pinjore Heritage'], 'Q7196395', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/4/41/Pinjore_Garden_Panchkula.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2268, 2537, '548c6fc2a39b0d78ea8c9b1a6f93d141b81ca9220acad4c07a26bb07dfa7a4b7', true, false
FROM public.places WHERE slug = 'pinjore-gardens-panchkula'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'brihadeeswarar-temple-thanjavur', 'Brihadeeswarar Temple (Big Temple)', 'attraction', 'Heritage Temple', 'Tamil Nadu', 'Thanjavur',
  'Thanjavur, Tamil Nadu, India', 10.7828, 79.1318, 'Brihadisvara Temple, called Rajarajesvaram by its builder, and known locally as Thanjai Periya Kovil and Peruvudaiyar Kovil, is a Shaivite Hindu temple built in a Chola architectural style located on the south bank of the Cauvery river in Thanjavur, Tamil Nadu, India. It is one of the largest Hindu temples and an exemplar of Tamil architecture. It is also called Dakshina Meru. Built by Chola emperor Rajaraja I between 1003 and 1010 CE, the temple is a part of the UNESCO World Heritage Site known as the "Great Living Chola Temples", along with the Chola-era Gangaikonda Cholapuram temple and Airavatesvara temple, which are about 70 kilometres (43 mi) and 40 kilometres (25 mi) to its northeast respectively.',
  '["Footwear must be deposited at temple stall before outer moat gate","No touching ancient fresco wall paintings inside sanctuary corridor"]'::jsonb, 0, 'free entry', '6:00 AM - 12:30 PM, 4:00 PM - 8:30 PM daily', 'November to February (mild winter)',
  ARRAY['UNESCO World Heritage','Great Living Chola Temples','Granite Architecture','Dravidian'], 'Q379934', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_%28edit%29.jpg/3840px-Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_%28edit%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  5849, 3655, 'd3e41760d69c28d13f0a2ee856a3e88f317951748b187df9b59ed9622c2d4b3a', true, true
FROM public.places WHERE slug = 'brihadeeswarar-temple-thanjavur'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'meenakshi-amman-temple-madurai', 'Meenakshi Amman Temple', 'attraction', 'Spiritual', 'Tamil Nadu', 'Madurai',
  'Madurai, Tamil Nadu, India', 9.9195, 78.1193, 'Meenakshi Temple, also known as Meenakshi Sundareswarar Temple, is a historic Hindu temple located on the southern bank of the Vaigai River in Madurai, Tamil Nadu, India. It is dedicated to Meenakshi, a form of Parvati, and her consort Sundareswarar (Shiva). The temple is theologically significant as it represents a confluence of various denominations of Hinduism such as Shaivism, Shaktism, and Vaishnavism.',
  '["Strict dress code: traditional Indian attire only (dhotis/pyjamas for men, sarees/churidars for women)","Mobile phones strictly banned inside premises; deposit at entrance locker"]'::jsonb, 0, 'free darshan', '5:00 AM - 12:30 PM, 4:00 PM - 10:00 PM daily', 'October to March (Chithirai Festival in April/May)',
  ARRAY['Dravidian Gopurams','Thousand Pillar Hall','Madurai','Spiritual Landmark'], 'Q854067', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/An_aerial_view_of_Madurai_city_from_atop_of_Meenakshi_Amman_temple.jpg/3840px-An_aerial_view_of_Madurai_city_from_atop_of_Meenakshi_Amman_temple.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4365, 1430, '19abdbcbea6f1c1110548fe2e65846cc84a5f0aafc919685d0c16dc7768f817c', true, true
FROM public.places WHERE slug = 'meenakshi-amman-temple-madurai'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'shore-temple-mahabalipuram', 'Shore Temple & Pancha Rathas', 'attraction', 'Heritage Monument', 'Tamil Nadu', 'Mahabalipuram',
  'Mahabalipuram, Tamil Nadu, India', 12.6163, 80.1983, 'The Shore Temple is a complex of temples and shrines that overlooks the shore of the Bay of Bengal. It is located in Mahabalipuram, about 60 kilometres (37 mi) south of Chennai in Tamil Nadu, India.',
  '["Ticket valid for both Shore Temple and Pancha Rathas on the same day","Do not climb rock-cut Nandi statues"]'::jsonb, 40, 'per person', '6:00 AM - 6:00 PM daily', 'November to February (sunrise over the Bay of Bengal)',
  ARRAY['UNESCO World Heritage','Pallava Dynasty','Rock-cut Architecture','Bay of Bengal'], 'Q1818987', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Shore_Temple_-Mamallapuram_-Tamil_Nadu_-N-TN-C55.jpg/3840px-Shore_Temple_-Mamallapuram_-Tamil_Nadu_-N-TN-C55.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4974, 3316, 'dd9f03fdd080a252975281b820716746f98873eb57b9373542fb3e3146084cd0', true, true
FROM public.places WHERE slug = 'shore-temple-mahabalipuram'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'marina-beach-chennai', 'Marina Beach Promenade', 'attraction', 'Coastal & Beach', 'Tamil Nadu', 'Chennai',
  'Chennai, Tamil Nadu, India', 13.05, 80.2824, 'Marina Beach, or simply the Marina, is a natural urban beach in Chennai, Tamil Nadu, India, along the Bay of Bengal. The beach runs from near Fort St. George in the north to Foreshore Estate in the south, a distance of 6.0 km (3.7 mi), It is a prominent landmark in Chennai.',
  '["Swimming in sea strictly prohibited due to dangerous undertow currents","Littering on sands subject to corporation fine"]'::jsonb, 0, 'free public beach', 'Open 24 hours · Lighthouse open 10:00 AM - 1:00 PM, 3:00 PM - 5:00 PM', 'November to February (breezy evenings)',
  ARRAY['World Second Longest Beach','Chennai Promenade','Lighthouse','Evening Breeze'], 'Q3181412', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Chennai_-_bird%27s-eye_view.jpg/3840px-Chennai_-_bird%27s-eye_view.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4000, 3000, '209f76b9cc13157e1a6dae55191342f5e6865be3c72ee0fe4cb71c3d55bea534', true, false
FROM public.places WHERE slug = 'marina-beach-chennai'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'nilgiri-mountain-railway', 'Nilgiri Mountain Railway (Toy Train)', 'attraction', 'Heritage Railway', 'Tamil Nadu', 'Ooty (Udhagamandalam)',
  'Ooty (Udhagamandalam), Tamil Nadu, India', 11.41, 76.7, 'The Nilgiri Mountain Railway (NMR), colloquially called the "Toy Train" by locals, is a 1,000 mm metre gauge railway in Nilgiris district, Tamil Nadu, India, built by the British in 1908. The railway is operated by the Southern Railway and is the only rack railway in India.',
  '["Advance IRCTC railway booking highly recommended weeks ahead","Do not lean out of carriage windows during tunnel transit"]'::jsonb, 205, 'first class ticket per person', 'Daily departures between Mettupalayam and Ooty via Coonoor', 'October to May',
  ARRAY['UNESCO World Heritage','Steam Locomotive','Blue Mountains','Tea Valley Viaducts'], 'Q378775', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/4/41/NMR_train_at_Ketti_05-02-26_75.jpeg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1516, 1073, '6ed5e8359004e8b0bed064f84fc50ba35489e477dba94acca1af7126c0eba495', true, false
FROM public.places WHERE slug = 'nilgiri-mountain-railway'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'ramanathaswamy-temple-rameswaram', 'Ramanathaswamy Temple Rameswaram', 'attraction', 'Spiritual', 'Tamil Nadu', 'Rameswaram',
  'Rameswaram, Tamil Nadu, India', 9.2881, 79.3174, 'Ramanathaswamy Temple is a Hindu temple dedicated to the Hindu god Shiva located on Rameswaram island in the state of Tamil Nadu, India. It is one of the twelve Jyotirlinga temples. It is one of the 276 Paadal Petra Sthalams, the sacred sites glorified by the Nayanars, Appar, Sundarar, and Sambandar, with their songs. According to tradition, the lingam of the Ramanathaswamy Temple was established and worshipped by Rama before he crossed the bridge called Rama Setu to the island kingdom of Lanka, identified with Sri Lanka. It is one of the Char Dham pilgrimage sites. The temple was expanded during the 12th century by the Pandya Dynasty, and its principal shrine’s sanctum was renovated by Jeyaveera Cinkaiariyan and his successor Gunaveera Cinkaiariyan, monarchs of the Jaffna kingdom. The temple has the longest corridor among all the Hindu temples of India. It was built by King Muthuramalinga Sethupathy. The temple is considered a pilgrimage site for Shaivites, Vaishnavites, and Smartas.',
  '["Bathing in 22 sacred teerthams requires change of dry clothes before entering main sanctum","Smartphones strictly deposited outside"]'::jsonb, 0, 'free temple darshan (special teertham bath ₹25)', '5:00 AM - 1:00 PM, 3:00 PM - 9:00 PM daily', 'October to April',
  ARRAY['Char Dham','Jyotirlinga','Longest Pillared Corridor in the World','Rameswaram Island'], 'Q2087524', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Ramanathaswamy_temple7.JPG/1920px-Ramanathaswamy_temple7.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2448, 3264, 'f112f0a0a39992b7b8cadccbda12ab8f8684303c991c0363912b894a45586efa', true, true
FROM public.places WHERE slug = 'ramanathaswamy-temple-rameswaram'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'vivekananda-rock-kanyakumari', 'Vivekananda Rock Memorial & Thiruvalluvar Statue', 'attraction', 'Monument & Sea', 'Tamil Nadu', 'Kanyakumari',
  'Kanyakumari, Tamil Nadu, India', 8.078, 77.555, 'Vivekananda Rock Memorial is a monument and popular tourist attraction in Kanyakumari, India''s southernmost tip. The memorial stands on one of the two rocks located about 500 meters off mainland of Vavathurai, Tamil Nadu. It was built in 1970 in honour of Swami Vivekananda, who is said to have attained enlightenment on the rock.',
  '["Life-jackets mandatory on ferry boat ride","Observe silent meditation inside Dhyana Mandapam"]'::jsonb, 20, 'entry fee (ferry ride ₹50 roundtrip)', '8:00 AM - 4:00 PM daily (subject to sea ferry conditions)', 'October to March (confluence of Arabian Sea, Bay of Bengal, and Indian Ocean)',
  ARRAY['Triveni Sangam','Swami Vivekananda','Thiruvalluvar Statue','Southernmost Tip of Mainland India'], 'Q1520638', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/b/b6/RockMemorial.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3264, 2448, '66fc0bc8115af20bd202bb4f98c28bfdcd6972208ec20c2fbd798f9a35791b7f', true, false
FROM public.places WHERE slug = 'vivekananda-rock-kanyakumari'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'dhanushkodi-point', 'Dhanushkodi Ghost Town & Ram Setu Point', 'attraction', 'Coastal & Historic', 'Tamil Nadu', 'Dhanushkodi (Rameswaram)',
  'Dhanushkodi (Rameswaram), Tamil Nadu, India', 9.1764, 79.4186, 'Dhanushkodi is an abandoned town at the south-eastern tip of Pamban Island of the state of Tamil Nadu in India. It is south-east of Pamban and is about 24 kilometres (15 mi) west of Talaimannar in Sri Lanka. The town was destroyed during the 1964 Rameswaram cyclone and remains uninhabited in the aftermath. Although devoid of inhabitants, Dhanushkodi remains a tourist attraction due to its historical and mythological relevance.',
  '["No private vehicles permitted on sand shoals past Arichal Munai","All visitors must return to Rameswaram before sunset"]'::jsonb, 0, 'free coastal road access', 'Daylight hours: 6:00 AM - 5:00 PM (Police checkpoint closes road at sunset)', 'October to March',
  ARRAY['Submerged City Ruins','Ram Setu','Arichal Munai','Untouched Beaches'], 'Q2567087', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Final_Dhanush_002.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  768, 496, 'fc21c2a9e2342da9143032f0bcb1a56aa3de9d76ee5645b1e489838a558870ff', true, true
FROM public.places WHERE slug = 'dhanushkodi-point'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'hampi-vijayanagara-ruins', 'Hampi & Virupaksha Temple Complex', 'attraction', 'Heritage Monument', 'Karnataka', 'Hampi (Vijayanagara)',
  'Hampi (Vijayanagara), Karnataka, India', 15.335, 76.46, 'Hampi or Hampe, also referred to as the Group of Monuments at Hampi, is a UNESCO World Heritage Site located in the town of Hampi in Vijayanagara district, east-central Karnataka, India. Hampi predates the Vijayanagara Empire; it is mentioned in the Ramayana and the Puranas of Hinduism as Pampa Devi Tirtha Kshetra. Hampi continues as a religious centre, with the Virupaksha Temple, an active Adi Shankara-linked monastery and various monuments belonging to the old city.',
  '["No climbing or standing on the Stone Chariot or musical pillars at Vittala temple","Hire certified ASI guides for historical context"]'::jsonb, 40, 'per person', '6:00 AM - 6:00 PM daily', 'October to March (Hampi Utsav in November)',
  ARRAY['UNESCO World Heritage','Vijayanagara Empire','Stone Chariot','Tungabhadra River','Boulder Landscape'], 'Q207865', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg/3840px-Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  6000, 3000, 'b90057576a47e741147940566016296f9c976b5ccad768fc53ab683f2880a177', true, true
FROM public.places WHERE slug = 'hampi-vijayanagara-ruins'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'mysore-palace', 'Mysore Palace (Amba Vilas)', 'attraction', 'Heritage Palace', 'Karnataka', 'Mysuru',
  'Mysuru, Karnataka, India', 12.3051, 76.6551, 'Mysore Palace, also known as Amba Vilas Palace, is a historic palace and royal residence located in Mysore, Karnataka, India. It served as the official residence of the Wadiyar dynasty and the seat of the Kingdom of Mysore, and was commissioned by Krishnaraja Wodeyar IV in August 1897 following the destruction of the previous structure in a fire. The design of the palace is attributed to Henry Irwin, a British architect who had earlier designed the Madras High Court, and Edwin Wolleston Fritchley, who would later design the Lalitha Mahal. Construction of the current structure began in 1897 and was completed in 1912. It is one of the largest palaces in India, and is a prominent example of Indo-Saracenic architecture, combining Indo-Islamic, Rajput, Hoysala and Gothic architectural styles.',
  '["Footwear must be deposited at free counters before entering palace interiors","Photography prohibited inside royal residential museum wing"]'::jsonb, 100, 'per person', '10:00 AM - 5:30 PM daily · Illumination Sundays & holidays 7:00 PM - 7:45 PM', 'October to March (famous Dasara festival in autumn)',
  ARRAY['Indo-Saracenic Architecture','Wodeyar Royal Dynasty','Golden Howdah','100,000 Light Bulbs'], 'Q1140027', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Mysore_Palace_Morning.jpg/3840px-Mysore_Palace_Morning.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4407, 2148, 'e059fadc99eb0b7969128ebabf80e8cdc131e6f9d529d542cb283d11db2ad954', true, true
FROM public.places WHERE slug = 'mysore-palace'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'gol-gumbaz-bijapur', 'Gol Gumbaz & Whispering Gallery', 'attraction', 'Heritage Monument', 'Karnataka', 'Vijayapura (Bijapur)',
  'Vijayapura (Bijapur), Karnataka, India', 16.83, 75.736, 'The Gol Gumbaz, also written as Gol Gumbad, is a dark gray basalt mausoleum located in the city of Bijapur in northern Karnataka, India. It contains the tomb of Mohammad Adil Shah, the seventh ruler of the Sultanate of Bijapur, alongside the tombs of his two wives, mistress, daughter and grandson. Construction of the monument began in the early 17th century following Adil Shah''s ascension to the throne, and halted in 1656 after his death; at the time, the structure was not yet fully complete, with several decorative elements remaining unfinished. The mausoleum is a prominent example of Indo-Islamic architecture in the Deccan region, and combines elements of Persian, Mughal, and local architectural styles.',
  '["Whispering gallery acoustic phenomenon: faint whispers echo 11 times across the 44-meter circular dome","Step carefully on narrow gallery stairs"]'::jsonb, 25, 'per person', '6:00 AM - 6:00 PM daily', 'October to March',
  ARRAY['Deccan Sultanate','Acoustic Whispering Gallery','Second Largest Dome in World','Adil Shahi'], 'Q889125', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/0/08/Gol_Gumbaz_-4%2C_Bijapur%2C_Karnataka.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2048, 1333, 'bc7c93c84f2cdb41fe822eac0ba4c27ae5311d24272183911fdf5b9520844f5b', true, true
FROM public.places WHERE slug = 'gol-gumbaz-bijapur'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'badami-cave-temples', 'Badami Rock-Cut Cave Temples', 'attraction', 'Heritage Temple', 'Karnataka', 'Badami (Bagalkot)',
  'Badami (Bagalkot), Karnataka, India', 15.9189, 75.6842, 'The Badami cave temples are a complex of Buddhist, Hindu and Jain cave temples located in Badami, a town in the Bagalkot district in northern part of Karnataka, India. The caves are important examples of Indian rock-cut architecture, especially Badami Chalukya architecture, and the earliest date from the 6th century. Badami is a modern name and was previously known as "Vataapi", the capital of the early Chalukya dynasty, which ruled much of Karnataka from the 6th to the 8th century. Badami is situated on the west bank of a man-made lake ringed by an earthen wall with stone steps; it is surrounded on the north and south by forts built during Early Chalukya and in later times.',
  '["Watch out for resident monkeys along stone cliff steps","Keep ASI ticket valid for all 4 caves"]'::jsonb, 25, 'per person', '6:00 AM - 6:00 PM daily', 'October to March',
  ARRAY['Chalukya Dynasty','Red Sandstone Cliffs','Agastya Lake','Nataraja Relief'], 'Q2643505', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Vishnu_image_inside_cave_number_3_in_Badami.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1944, 2592, '5752e44e19067679c0e65272aa047892217c3960dfd6cbbce211ad09bb556862', true, true
FROM public.places WHERE slug = 'badami-cave-temples'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'jog-falls-shimoga', 'Jog Falls (Gersoppa Falls)', 'attraction', 'Nature & Waterfall', 'Karnataka', 'Sagara (Shivamogga)',
  'Sagara (Shivamogga), Karnataka, India', 14.228, 74.812, 'Jog Falls is a series of large, segmented waterfalls on the Sharavati River in Karnataka state of India, created by the river plunging approximately 253 metres (830 ft) and splitting into four distinct cascades. The waterfalls are situated in the Sagar taluk of the Shivamogga district.',
  '["Steep staircase descent of 1,400 steps to base requires high physical fitness","Do not cross protective barricades near cliff edges"]'::jsonb, 50, 'per person', '6:00 AM - 6:00 PM daily', 'July to November (monsoon roar and peak flow)',
  ARRAY['Sharavathi River','Second Highest Plunge in India','Western Ghats','Raja Rani Roarer Rocket'], 'Q1144078', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Jog_Falls_05092016.jpg/3840px-Jog_Falls_05092016.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3899, 4000, '3ebd8c0fad8d4ecb48f9c9521e0047a1aef32e0e0417288d20814949d9e7c8ec', true, true
FROM public.places WHERE slug = 'jog-falls-shimoga'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'coorg-abbey-falls-madikeri', 'Abbey Falls & Coffee Plantations', 'attraction', 'Nature & Waterfall', 'Karnataka', 'Madikeri (Kodagu/Coorg)',
  'Madikeri (Kodagu/Coorg), Karnataka, India', 12.4542, 75.7175, 'Abbey Falls is a waterfall in Kodagu, in the Western Ghats of Karnataka, India. It is located 8 km from the Madikeri, 122 km from Mysore, 144 km from Mangalore and 268 km from Bangalore.',
  '["Swimming in waterfall pool is strictly prohibited for safety","Hanging bridge provides optimal viewing perspective"]'::jsonb, 20, 'per person', '9:00 AM - 5:00 PM daily', 'July to December',
  ARRAY['Coffee Estate Trail','Hanging Bridge','Western Ghats','Coorg Mist'], 'Q4664009', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Abbey_Falls_New.jpg/3840px-Abbey_Falls_New.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  6000, 3376, '73bdd1bf635a912a35713557755d6d27be99521f5572cde773f08c2126c546b9', true, true
FROM public.places WHERE slug = 'coorg-abbey-falls-madikeri'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'chennakesava-temple-belur', 'Hoysala Chennakeshava Temple Belur', 'attraction', 'Heritage Temple', 'Karnataka', 'Belur (Hassan)',
  'Belur (Hassan), Karnataka, India', 13.1625, 75.86, 'The Chennakeshava Temple, also referred to as the Keshava, Kesava or Vijayanarayana Temple, is a 12th-century Hindu temple in the Hassan district of Karnataka, India. It was commissioned by King Vishnuvardhana in 1117 CE, on the banks of the Yagachi River in Belur, an early Hoysala Empire capital. The temple was built over three generations and took 103 years to finish. It was repeatedly damaged and plundered during wars, repeatedly rebuilt and repaired over its history. It is located 35 km from Hassan city and about 220 km from Bengaluru.',
  '["Footwear removal required at soapstone perimeter","Marvel at the microscopic details of bracket dancers (Madanikas)"]'::jsonb, 0, 'free entry', '7:30 AM - 7:30 PM daily', 'October to March',
  ARRAY['UNESCO World Heritage','Hoysala Architecture','Chloritic Schist Carvings','Madanika Sculptures'], 'Q2962635', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/0/0a/The_Courtyard_of_Chennakesava_Temple_-_Belur.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2048, 1371, '74aff9f599e2efa9b9d59d83811d9583dd14fd30d998b576637731040db5eb3d', true, false
FROM public.places WHERE slug = 'chennakesava-temple-belur'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'vidyarthi-bhavan-bengaluru', 'Vidyarthi Bhavan Gandhi Bazaar', 'food', 'Iconic Culinary', 'Karnataka', 'Bengaluru',
  'Bengaluru, Karnataka, India', 12.9431, 77.5714, 'Vidyarthi Bhavan is a vegetarian tiffin restaurant in Gandhi Bazaar, Basavanagudi, South Bangalore. It has been considered an iconic establishment of the area and Bangalore in general, with its masala dosa being particularly recognized.',
  '["Classic token queue system on weekend mornings","Legendary waitstaff carrying dozens of stacked dosa plates"]'::jsonb, 220, 'for two approx', '6:30 AM - 11:30 AM, 2:00 PM - 8:00 PM (Closed on Fridays)', 'Morning breakfast for crispy benne masala dosa with filter coffee',
  ARRAY['Benne Masala Dosa','Since 1943','Filter Coffee','Bengaluru Heritage'], 'Q7928122', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/9/9d/VidyarthiBhavanEntrance.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1600, 1200, '57aa12d74fa938396f83534f157379ff2481ac81d2585caabce3b5bd35b268e8', true, true
FROM public.places WHERE slug = 'vidyarthi-bhavan-bengaluru'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'alleppey-backwaters-houseboats', 'Alleppey Backwaters & Vembanad Lake', 'attraction', 'Backwaters & Cruises', 'Kerala', 'Alappuzha (Alleppey)',
  'Alappuzha (Alleppey), Kerala, India', 9.4981, 76.3388, 'Alappuzha or Alleppey is a city and municipality on the Laccadive Sea in the southern Indian state of Kerala. It is the headquarters of Alappuzha district, located about 62 km (39 mi) south of the commercial city of Kochi and 152 km (94.4 mi) northwest of the state capital Thiruvananthapuram. As per the 2011 Indian census, Alappuzha has a population of 240,991 people, and a population density of 3,675/km2 (9,520/sq mi).',
  '["Book certified Kerala Tourism approved green-palm houseboats","Night cruising banned after 5:30 PM to protect fishermen nets"]'::jsonb, 8500, 'traditional Kettuvallam houseboat overnight cruise for two approx', 'Houseboats cruise 12:00 PM - 5:30 PM, anchor overnight at village canals (re-start 8:00 AM)', 'September to March (cooler weather, Nehru Trophy Boat Race in August)',
  ARRAY['Venice of the East','Kettuvallam Houseboat','Coconut Palms','Vembanad Lake'], 'Q1847141', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Alappuzha_Boat_Beauty_W.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2500, 1656, 'fff507d777e28a95b2f70062b49b98387c27797bf97a4a0ba129107f988cba0b', true, false
FROM public.places WHERE slug = 'alleppey-backwaters-houseboats'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'munnar-tea-plantations', 'Munnar Tea Estates & Eravikulam National Park', 'attraction', 'Hill Station & Nature', 'Kerala', 'Munnar (Idukki)',
  'Munnar (Idukki), Kerala, India', 10.0889, 77.0597, 'Munnar is a town located in the Idukki district of the southwestern Indian state of Kerala. Munnar is situated at around 1,600 metres (5,200 ft) above mean sea level, in the Western Ghats mountain range. This ancient plantation settlement, dominated by its tea industry, is also a growing modern hill station.',
  '["National park permits must be pre-booked online; safari minibuses transport visitors","Do not pluck tea leaves on private commercial estates"]'::jsonb, 200, 'Eravikulam National Park entry fee', '7:30 AM - 4:00 PM daily (Eravikulam closes mid-January to March for Nilgiri Tahr calving season)', 'September to May',
  ARRAY['Tea Gardens','Anamudi Peak','Nilgiri Tahr','Western Ghats Mist'], 'Q506229', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Munnar_Overview.jpg/3840px-Munnar_Overview.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4873, 3249, '1679b4ccff01e9c9e4a55dc2fee5769f5d685b3bb96d1339a7f194ece2123a28', true, true
FROM public.places WHERE slug = 'munnar-tea-plantations'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'padmanabhaswamy-temple-trivandrum', 'Sree Padmanabhaswamy Temple', 'attraction', 'Spiritual', 'Kerala', 'Thiruvananthapuram',
  'Thiruvananthapuram, Kerala, India', 8.483, 76.9436, 'The Padmanabhaswamy Temple is a Hindu temple dedicated to Vishnu in Thiruvananthapuram, Keralam, India. It is one of the 108 Divya Desams which are considered the sacred sites of the Sri Vaishnava tradition.',
  '["Strict Kerala temple dress code: men must wear white dhotis bare-chested; women must wear sarees or traditional set-mundu (dhotis available for rental outside)","No electronic items permitted"]'::jsonb, 0, 'free temple darshan', '3:30 AM - 12:00 PM, 5:00 PM - 8:30 PM daily (split into traditional darshan timings)', 'October to March',
  ARRAY['Richest Temple in the World','Travancore Royal Sanctuary','Anantha Shayanam','Kerala-Dravidian Style'], 'Q843802', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Sree_Padmanabhaswamy_temple_01.jpg/1920px-Sree_Padmanabhaswamy_temple_01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3072, 4096, '48609f9de1f3d7b127ad552fc2f474fb9d5a392de998b09f0c8fab5f4522a991', true, true
FROM public.places WHERE slug = 'padmanabhaswamy-temple-trivandrum'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'fort-kochi-chinese-nets', 'Fort Kochi Chinese Fishing Nets & Mattancherry', 'attraction', 'Coastal & Heritage', 'Kerala', 'Kochi (Cochin)',
  'Kochi (Cochin), Kerala, India', 9.9667, 76.2417, 'Fort Kochi, formerly also known as Fort Cochin, is a region of Kochi city in Kerala, India. Fort Kochi takes its name from the Fort Manuel of Kochi, the first European fort on Indian soil, controlled by the Portuguese East Indies. This is part of a handful of water-bound islands and islets toward the south-west of the mainland Kochi, and collectively known as Old Kochi or West Kochi. Adjacent to this is the locality of Mattancherry. In 1967, these three municipalities along with a few adjoining areas, were amalgamated to form the Kochi Municipal Corporation.',
  '["Negotiate nominal tip if fishermen invite you to operate the cantilevered net counterweights","Visit nearby 1503 St. Francis Church and Jewish Synagogue"]'::jsonb, 0, 'free waterfront promenade', 'Waterfront open 24 hours · Fishermen operate nets at sunrise and sunset', 'October to March (sunset over the Arabian Sea)',
  ARRAY['Cheena Vala','Colonial Spice Port','Arabian Sea Sunset','Mattancherry Palace'], 'Q3529244', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6e/Kochi%2C_Fishing_nets_at_sunset%2C_Kerala%2C_India.jpg/3840px-Kochi%2C_Fishing_nets_at_sunset%2C_Kerala%2C_India.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4032, 2688, 'e4f4bc5ad0cab64e237c25433bb1ac3942eee409d509eaefadbbde4131ba8f7f', true, false
FROM public.places WHERE slug = 'fort-kochi-chinese-nets'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'athirappilly-waterfalls', 'Athirappilly Waterfalls (Niagara of India)', 'attraction', 'Nature & Waterfall', 'Kerala', 'Chalakudy (Thrissur)',
  'Chalakudy (Thrissur), Kerala, India', 10.2853, 76.5694, 'Athirappilly Falls is situated in Athirappilly Panchayat in Chalakudy Taluk of Thrissur District in Kerala, India on the Chalakudy River, which originates from the upper reaches of the Western Ghats at the entrance to the Sholayar ranges. It is the largest waterfall in Kerala, which stands tall at 81.5 feet. Just a short drive from Athirappilly is the Vazhachal Falls, which is close to dense green forests that are home to many endangered and endemic species of flora and fauna.',
  '["Wear slip-resistant footwear on the rocky bamboo path descending to the waterfall base","Bathing at top river rapids strictly forbidden"]'::jsonb, 50, 'per person', '8:00 AM - 5:00 PM daily', 'June to January (monsoon and post-monsoon full flow)',
  ARRAY['Chalakudy River','Niagara of South India','Vazhachal Forest','Bahubali Film Location'], 'Q2869275', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/The_View_of_the_Athirapally_Falls_during_the_onset_of_Monsoon.jpg/3840px-The_View_of_the_Athirapally_Falls_during_the_onset_of_Monsoon.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  5760, 3840, 'c8e7c830c14dc536035d49cef4e6ba99121eb8a997e84ac23ab65a10f8e383ad', true, true
FROM public.places WHERE slug = 'athirappilly-waterfalls'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'varkala-cliff-beach', 'Varkala Papanasam Beach & Red Cliffs', 'attraction', 'Coastal & Beach', 'Kerala', 'Varkala (Thiruvananthapuram)',
  'Varkala (Thiruvananthapuram), Kerala, India', 8.735, 76.7032, 'Varkala Beach is situated in the town of Varkala in Varkala Municipality, Thiruvananthapuram district, Kerala, India. The beach skirts the Arabian Sea, part of the Indian Ocean.',
  '["Cliff walkway has no railing at certain spots; walk cautiously after dark","Swim only in designated lifeguard-patrolled zones"]'::jsonb, 0, 'free beach access', 'Open 24 hours · Cliff cafes open till midnight', 'November to March',
  ARRAY['Geo-heritage Red Laterite Cliffs','Papanasam Holy Waters','Sunset Cafes','Arabian Sea'], 'Q3532789', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Varkala_beach_from_above.jpg/3840px-Varkala_beach_from_above.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4534, 3023, '027eaa5d4a35720e5df1c5bc00f9cb462dd4729c6900a7c19b2fb81e5e9b5797', true, true
FROM public.places WHERE slug = 'varkala-cliff-beach'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'tirumala-venkateswara-temple', 'Tirumala Sri Venkateswara Swamy Temple', 'attraction', 'Spiritual', 'Andhra Pradesh', 'Tirupati (Tirumala)',
  'Tirupati (Tirumala), Andhra Pradesh, India', 13.6833, 79.35, 'The Venkateswara Swami Temple—also known as Tirumala Temple, Tirupati Temple and Tirupati Balaji Temple—is a Hindu temple located in the hills of Tirumala, within Tirupati Urban Mandal, Tirupati district, Andhra Pradesh, India. The temple is dedicated to Venkateswara, a form of Vishnu, who is believed to have appeared on earth to save mankind from trials and troubles of Kali Yuga. Hence the site is also called Kaliyuga Vaikuntha and the deity is known as Kaliyuga Prathyaksha Daivam. Venkateswara is additionally known as Balaji, Govinda, and Srinivasa. The temple is administered by the Tirumala Tirupati Devasthanams (TTD), an autonomous body under the control of the Government of Andhra Pradesh. The head of TTD is appointed by Andhra Pradesh Government.',
  '["Strict traditional dress code: dhoti/kurta for men, saree/half-saree/salwar with dupatta for women","Electronic devices and cell phones prohibited inside inner enclosure (locker provided at entry)"]'::jsonb, 0, 'free Sarva Darshan (Special Entry ₹300)', 'Open 24 hours (continuous darshan with brief breaks for rituals and sevas)', 'September to March (Brahmotsavam in September/October)',
  ARRAY['Richest Shrine','Seven Hills of Tirumala','Lord Balaji','Srivari Laddu Prasadam'], 'Q122434', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/3840px-Tirumala_090615.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4096, 2731, 'b867620654791b2f0f5921a2c19ddde288822f5444efe0a02cf26bdd0403d6f3', true, true
FROM public.places WHERE slug = 'tirumala-venkateswara-temple'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'araku-valley-visakhapatnam', 'Araku Valley & Coffee Country', 'attraction', 'Hill Station & Nature', 'Andhra Pradesh', 'Araku (Visakhapatnam)',
  'Araku (Visakhapatnam), Andhra Pradesh, India', 18.3273, 82.8775, 'Araku Valley is a hill station in the Alluri Sitharama Raju district of Andhra Pradesh, India, located 111 km from Visakhapatnam.',
  '["Scenic Vistadome train journey from Visakhapatnam to Araku must be booked in advance on IRCTC","Sample organic indigenous Araku tribal coffee"]'::jsonb, 0, 'free valley scenic access', 'Daylight scenic valley · Tribal Museum open 9:00 AM - 7:00 PM', 'October to March (misty winter mornings and yellow Niger flower bloom)',
  ARRAY['Eastern Ghats','Organic Coffee','Vistadome Train','Tribal Culture'], 'Q4784409', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Araku-valley.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  620, 412, '8db269481159532375c46836e93cfb0d4b743d11aa758c2eb7015df0d1e51c29', true, true
FROM public.places WHERE slug = 'araku-valley-visakhapatnam'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'borra-caves-ananthagiri', 'Borra Caves (Million Year Limestone Caverns)', 'attraction', 'Natural Wonder', 'Andhra Pradesh', 'Ananthagiri (Visakhapatnam)',
  'Ananthagiri (Visakhapatnam), Andhra Pradesh, India', 18.2806, 83.0403, 'Borra Caves are a limestone cave system in Ananthagiri hills of the Araku Valley in Alluri Sitharama Raju district, Andhra Pradesh. They feature extensive karst formations, including stalactites, stalagmites, and other speleothems.',
  '["Steep stairs inside cave require caution; illuminated with multicolored LED lighting","Natural stalactite and stalagmite formations must not be touched"]'::jsonb, 80, 'per person', '10:00 AM - 5:00 PM daily (lunch break 1:00 PM - 2:00 PM)', 'October to March',
  ARRAY['Gosthani River','Deepest Caves in India','Speleothem Formations','Eastern Ghats'], 'Q3520110', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Borra_caves%2C_Viskhapatnam.jpg/3840px-Borra_caves%2C_Viskhapatnam.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  5312, 2988, '52c57b64e294b3fb9ddd2475ebfe6b4fa97e8a2c24d7f5b5b974d76e1c4c25d9', true, true
FROM public.places WHERE slug = 'borra-caves-ananthagiri'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'lepakshi-veerabhadra-temple', 'Lepakshi Veerabhadra Temple & Monolithic Nandi', 'attraction', 'Heritage Temple', 'Andhra Pradesh', 'Lepakshi (Sri Sathya Sai)',
  'Lepakshi (Sri Sathya Sai), Andhra Pradesh, India', 14.1436, 77.6108, 'Veerabhadra temple is a Hindu temple located in the Lepakshi, in the state of Andhra Pradesh, India. The temple is dedicated to Virabhadra, a fierce form of Shiva, a major deity in Hinduism.',
  '["Famous hanging pillar: cloth or paper can be passed underneath without touching the floor","No touching ancient Vijayanagara ceiling frescoes"]'::jsonb, 0, 'free entry', '6:00 AM - 6:00 PM daily', 'October to March',
  ARRAY['Vijayanagara Architecture','Hanging Pillar Wonder','Gigantic Monolithic Nandi','Nagalinga'], 'Q3532789', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Veerabhadra_Temple_Tower.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1944, 2592, '782916428108935649d2fe0dbe9db275127bfa1312378322599fc5a6cc876fc1', true, false
FROM public.places WHERE slug = 'lepakshi-veerabhadra-temple'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'gandikota-grand-canyon', 'Gandikota Fort & Pennar River Gorge', 'attraction', 'Natural Wonder & Fort', 'Andhra Pradesh', 'Gandikota (Kadapa)',
  'Gandikota (Kadapa), Andhra Pradesh, India', 14.8153, 78.2867, 'Gandikota is a village and historical fort on the right bank of the Penna river, 15 km from Jammalamadugu in Kadapa district, Andhra Pradesh, India. The fort was the centre of power for various dynasties, such as the Kalyani Chalukyas, Pemmasani Nayakas, and the Golconda Sultanate. Initially, a sand fort was constructed by Kaka Raja, a vassal of the Kalyani Chalukya rulers. The village transformed into a major fortified settlement with the rise of the Pemmasani Nayakas. Later, various additions reflecting Islamic architectural styles were made during the period of Muslim rule. The fort is a centrally protected monument of Archaeological Survey of India (ASI).',
  '["Gorge cliffs have sheer vertical drops without guard rails: maintain safe distance from edge","Carry sufficient drinking water"]'::jsonb, 0, 'free fort and gorge access', 'Fort open sunrise to sunset · Gorge viewpoints accessible all hours', 'October to February (camping and sunrise over the canyon)',
  ARRAY['Grand Canyon of India','Pennar River Gorge','Red Granite Cliffs','Historic Fort'], 'Q5520638', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Indian_Grand_Canyon_Sudhakar_Bichali.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1920, 1068, '2a97d3b9c70b99682f3b7007dcbddd6b33b89ff553697b23de1be2242547cbe2', true, false
FROM public.places WHERE slug = 'gandikota-grand-canyon'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'charminar-hyderabad', 'Charminar', 'attraction', 'Heritage Monument', 'Telangana', 'Hyderabad',
  'Hyderabad, Telangana, India', 17.3614, 78.4747, 'The Charminar is a monument located in Hyderabad, Telangana, India. Constructed in 1591, the landmark is a symbol of Hyderabad and officially incorporated in the emblem of Telangana. It remained the tallest structure in Hyderabad for 396 years until 1987. The Charminar''s long history includes the existence of a mosque on its top floor for more than 435 years. While both historically and religiously significant, it is also known for its popular and busy local markets surrounding the structure, and has become one of the most frequented tourist attractions in Hyderabad. Charminar is also a site of numerous festival celebrations, such as Eid-ul-adha and Eid al-Fitr, as it is adjacent to the city''s main mosque, the Makkah Masjid.',
  '["ASI entry ticket required for ascending first balcony level","Surrounding pedestrian Laad Bazaar is famous for lacquer bangles"]'::jsonb, 25, 'per person', '9:00 AM - 5:30 PM daily (monument illuminated in evening)', 'October to March (festive night bazaar during Ramzan)',
  ARRAY['Symbol of Hyderabad','Qutb Shahi Era (1591)','Four Minarets','ASI Monument'], 'Q180564', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/7/71/Charminar_Hyderabad_1.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2174, 3071, '8ba108c4f1f1d9ed6ecee178b6d16982ff05802820d2209640cb3c0f1596c8ba', true, true
FROM public.places WHERE slug = 'charminar-hyderabad'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'golconda-fort-hyderabad', 'Golconda Fort', 'attraction', 'Heritage Fort', 'Telangana', 'Hyderabad',
  'Hyderabad, Telangana, India', 17.3833, 78.4011, 'Golconda is a fortified citadel and ruined city located on the western outskirts of Hyderabad, Telangana, India. The fort was built by Kakatiya ruler Pratāparudra in the 11th century out of mud walls. It was ceded to the Bahmani Kings from Musunuri Nayakas during the reign of Bahmani Sultan Mohammed Shah I, during the first Bahmani–Vijayanagara War. Following the death of Sultan Mahmood Shah, the Sultanate disintegrated and Sultan Quli, who had been appointed as the Governor of Hyderabad by the Bahmani Kings, fortified the city and made it the capital of the Sultanate of Golconda. Because of the vicinity of diamond mines, especially Kollur Mine, Golconda flourished as a trade centre of large diamonds known as Golconda diamonds. The complex was put by UNESCO on its "tentative list" to become a World Heritage Site in 2014, with other forts in the region, under the name Monuments and Forts of the Deccan Sultanate.',
  '["Acoustic clapping test at Fateh Darwaza dome can be heard clearly at the Bala Hissar pavilion 1 km away","Steep climb of 380 stone steps to summit citadel"]'::jsonb, 25, 'per person', '8:30 AM - 5:30 PM daily · Sound & Light show at 6:30 PM & 8:00 PM', 'October to March',
  ARRAY['Diamond Capital of the World','Acoustic Architecture','Koh-i-Noor Origin','Qutb Shahi Citadel'], 'Q844111', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Golconda_Fort_005.jpg/3840px-Golconda_Fort_005.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4479, 2798, '02093d6177d0d1e233d40c373d9020447c96292248762f63c990ed7c26ed982f', true, true
FROM public.places WHERE slug = 'golconda-fort-hyderabad'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'ramappa-temple-palampet', 'Ramappa Temple (Kakatiya Rudreshwara)', 'attraction', 'Heritage Temple', 'Telangana', 'Palampet (Mulugu)',
  'Palampet (Mulugu), Telangana, India', 18.265, 79.9431, 'The Rudreshwara Temple, more commonly known as the Ramappa Temple, is a Hindu temple located in the village of Palampet in eastern Telangana, India. An inscription on a basalt pillar found within a nearby courtyard records that the temple was commissioned in 1213 by Recherla Rudra, a military general of the Kakatiya dynasty, and constructed over a period of 40 years during the reign of Ganapati, the third sovereign of the dynasty. Dedicated to the Hindu deity Shiva, it is a prominent example of Kakatiya architecture, and combines elements of Dravidian and Chalukyan architectural styles.',
  '["Famous floating bricks used in temple shikhara (so light they float on water)","Sandbox foundation technology absorbs earthquake shocks"]'::jsonb, 0, 'free entry', '6:00 AM - 6:00 PM daily', 'October to March',
  ARRAY['UNESCO World Heritage','Kakatiya Dynasty','Floating Bricks','Intricate Sandstone Carvings'], 'Q7289242', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Ramappa_Temple_%28Human_Scale%29.jpg/3840px-Ramappa_Temple_%28Human_Scale%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4062, 2884, '30d90df95ceca725a5d76904a0bb194e2c2e419f1a5c9498d4c28c27d4168767', true, true
FROM public.places WHERE slug = 'ramappa-temple-palampet'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'hussain-sagar-buddha', 'Hussain Sagar Lake & Monolithic Buddha', 'attraction', 'Lake & Monument', 'Telangana', 'Hyderabad',
  'Hyderabad, Telangana, India', 17.4239, 78.4738, 'Hussain Sagar is a heart-shaped lake in Hyderabad, Telangana, India, built by Ibrahim Quli Qutb Shah in 1562. It is spread across an area of 5.7 square kilometres (2.2 sq mi) and is fed by the River Musi. A large monolithic statue of the Gautama Buddha, erected in 1992, stands on Gibraltar Rock in the middle of the lake. The lake separates the city centre of Hyderabad from the neighbourhood of Secunderabad. The maximum depth of the lake is 32 feet (9.8 m).',
  '["Wear life-jackets on boat transit across lake","Necklace Road promenade accessible 24 hours"]'::jsonb, 80, 'ferry boat roundtrip to Gibraltar Rock', '8:00 AM - 10:00 PM daily', 'October to March (evening boat ride and musical fountain show)',
  ARRAY['Heart-shaped Lake','World Tallest Monolithic Buddha','Necklace Road','Ferry Ride'], 'Q3247076', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Aerial_view_of_Hussain_Sagar_from_Bansalipet.jpg/3840px-Aerial_view_of_Hussain_Sagar_from_Bansalipet.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  6000, 3375, '87923d4828d34ddfbbded92640efe0bfe0a1d52eb8ed9ee583f2314dcdf955ad', true, true
FROM public.places WHERE slug = 'hussain-sagar-buddha'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'hotel-shadab-hyderabad', 'Hotel Shadab Ghansi Bazaar', 'food', 'Iconic Culinary', 'Telangana', 'Hyderabad',
  'Hyderabad, Telangana, India', 17.368, 78.476, 'Hyderabadi biryani is a style of biryani originating from Hyderabad, India made with basmati rice and meat. Originating in the kitchens of the Nizam of Hyderabad, it combines elements of Hyderabadi and Mughlai cuisines. Hyderabad biryani is a key dish in Hyderabadi cuisine and it is so famous that the dish is considered synonymous with the city of Hyderabad.',
  '["Cash and UPI accepted","High demand at lunch and dinner; table sharing common on ground floor"]'::jsonb, 500, 'for two approx', '5:30 AM - 2:00 AM daily', 'Lunch or late night biryani with Irani chai and Osmania biscuits',
  ARRAY['Hyderabadi Dum Biryani','Irani Chai','Mirchi Ka Salan','Old City Flavor'], 'Q5912076', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Hyderabadi_Chicken_Biryani.jpg/3840px-Hyderabadi_Chicken_Biryani.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3888, 2592, '21a01a727112fc49f1e8b6781f7a9aa494e34e9a21bc5f2527c2a3c12d716020', true, false
FROM public.places WHERE slug = 'hotel-shadab-hyderabad'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'auroville-matrimandir-puducherry', 'Auroville & The Matrimandir', 'attraction', 'Spiritual & Architecture', 'Puducherry', 'Auroville (Puducherry)',
  'Auroville (Puducherry), Puducherry, India', 11.9869, 79.8117, 'The Matrimandir is an edifice of spiritual significance for practitioners of integral yoga in the centre of Auroville, India established by Mirra Alfassa of the Sri Aurobindo Ashram, Auroville''s spiritual co-founder, known to her followers as The Mother or La Mère. It is called Soul of the City and situated in a large open space called "Paix". The Mandir was conceived of in late 1965 as a gleaming sphere rising amid twelve gardens by, who marked a lone banyan tree as the heart of the city. Its foundation stone was laid at sunrise on her 93rd birthday, 21 February 1971, and the four supporting pillars were concreted on 17 November 1973; she died that evening. After decades of work by Aurovilians and craftsmen, the Inner Chamber opened in 1994 and the gold‑clad sphere was completed in May 2008.',
  '["Absolute silence inside the inner crystal globe meditation chamber","Photography strictly prohibited inside inner sanctum"]'::jsonb, 0, 'free visitor center and viewing point pass', '9:00 AM - 5:30 PM (Viewing point open daily · Inner chamber requires in-person advance booking at Visitor Centre 1 day prior)', 'November to March',
  ARRAY['City of Dawn','Golden Globe','Optical Glass Crystal','Peace & Meditation'], 'Q757428', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/The_Matrimandir_in_Auroville%2C_Tamil_Nadu%2C_India.jpg/3840px-The_Matrimandir_in_Auroville%2C_Tamil_Nadu%2C_India.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  5487, 4115, 'd0b5ce1bfde2dc1a06b9c525aca86b361223a8ffc65f7ab8cc76122dd6b9958d', true, true
FROM public.places WHERE slug = 'auroville-matrimandir-puducherry'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'french-quarter-white-town', 'White Town French Quarter & Promenade', 'attraction', 'Heritage Promenade', 'Puducherry', 'Puducherry',
  'Puducherry, Puducherry, India', 11.931, 79.835, 'Puducherry or Pondicherry may refer to:',
  '["Promenade road closed to all vehicular traffic in evenings","Respect residential heritage zone quietude"]'::jsonb, 0, 'free heritage quarter walk', 'Promenade pedestrian-only 5:00 PM - 7:30 AM daily', 'October to March (cycling tour in morning)',
  ARRAY['French Colonial Architecture','Mustard Yellow Villas','Bougainvillea Lanes','Goubert Avenue'], 'Q5502576', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDgwMCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBkYXRhLXBsYWNlLWlkPSJmcmVuY2gtcXVhcnRlci13aGl0ZS10b3duIj4KICA8dGl0bGU+V2hpdGUgVG93biBGcmVuY2ggUXVhcnRlciAmIFByb21lbmFkZSwgUHVkdWNoZXJyeSwgUHVkdWNoZXJyeTwvdGl0bGU+CiAgPGRlc2MgaWQ9ImV4cGxvcmV4LXByb21wdCI+bWluaW1hbCBmbGF0IGlsbHVzdHJhdGlvbiBvZiBXaGl0ZSBUb3duIEZyZW5jaCBRdWFydGVyICYgUHJvbWVuYWRlLCBQdWR1Y2hlcnJ5LCBQdWR1Y2hlcnJ5LCBxdWFpbnQgcGFzdGVsIG11c3RhcmQteWVsbG93IEZyZW5jaCB2aWxsYXMgd2l0aCB3aGl0ZSBzaHV0dGVyZWQgd2luZG93cywgd3JvdWdodCBpcm9uIGJhbGNvbmllcywgYW5kIHZpYnJhbnQgYm91Z2FpbnZpbGxlYSBmbG93ZXJzLCBubyB0ZXh0LCBubyBwZW9wbGU8L2Rlc2M+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnR3JhZF9mcmVuY2gtcXVhcnRlci13aGl0ZS10b3duIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzFBMzQyNyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMyQTRGM0UiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdvbGRHcmFkX2ZyZW5jaC1xdWFydGVyLXdoaXRlLXRvd24iIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIwJSIgeTI9IjAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0M5QTIyNyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNFNkM2NUMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InN1bkdsb3dfZnJlbmNoLXF1YXJ0ZXItd2hpdGUtdG93biIgY3g9IjUwJSIgY3k9IjM1JSIgcj0iNDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0M5QTIyNyIgc3RvcC1vcGFjaXR5PSIwLjI1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzFBMzQyNyIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogIDwvZGVmcz4KCiAgPCEtLSBTa3kgJiBBdG1vc3BoZXJlIC0tPgogIDxyZWN0IHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjgwMCIgZmlsbD0idXJsKCNiZ0dyYWRfZnJlbmNoLXF1YXJ0ZXItd2hpdGUtdG93bikiLz4KICA8Y2lyY2xlIGN4PSI2MDAiIGN5PSIzMjAiIHI9IjI4MCIgZmlsbD0idXJsKCNzdW5HbG93X2ZyZW5jaC1xdWFydGVyLXdoaXRlLXRvd24pIi8+CgogIDwhLS0gR2VvbWV0cmljIE1vdW50YWluIC8gQXJjaGl0ZWN0dXJhbCBCYWNrZHJvcCBMYXllcnMgLS0+CiAgPHBhdGggZD0iTTAsODAwIEwwLDYyMCBRMzAwLDUyMCA2MDAsNTYwIFQxMjAwLDYwMCBMMTIwMCw4MDAgWiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEyKSIvPgogIDxwYXRoIGQ9Ik0wLDgwMCBMMCw2ODAgUTQwMCw2MDAgODAwLDY0MCBUMTIwMCw2NjAgTDEyMDAsODAwIFoiIGZpbGw9InJnYmEoMCwwLDAsMC4yKSIvPgoKICA8IS0tIFN0eWxpemVkIExhbmRtYXJrIFNpbGhvdWV0dGVzIC0tPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYwMCwgNTIwKSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+CiAgICA8IS0tIENlbnRlciBEb21lIC8gU3BpcmUgTW90aWYgLS0+CiAgICA8cGF0aCBkPSJNIC05MCwwIFEgLTkwLC0xNjAgMCwtMjEwIFEgOTAsLTE2MCA5MCwwIFoiIGZpbGw9InVybCgjZ29sZEdyYWRfZnJlbmNoLXF1YXJ0ZXItd2hpdGUtdG93bikiIG9wYWNpdHk9IjAuOSIvPgogICAgPCEtLSBGbGFua2luZyBNaW5hcmV0cyAvIFBpbGxhcnMgLS0+CiAgICA8cmVjdCB4PSItMTcwIiB5PSItMTgwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTgwIiByeD0iNCIgZmlsbD0idXJsKCNnb2xkR3JhZF9mcmVuY2gtcXVhcnRlci13aGl0ZS10b3duKSIgb3BhY2l0eT0iMC44NSIvPgogICAgPGNpcmNsZSBjeD0iLTE2MiIgY3k9Ii0xOTAiIHI9IjE0IiBmaWxsPSIjRTZDNjVDIi8+CiAgICA8cmVjdCB4PSIxNTQiIHk9Ii0xODAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxODAiIHJ4PSI0IiBmaWxsPSJ1cmwoI2dvbGRHcmFkX2ZyZW5jaC1xdWFydGVyLXdoaXRlLXRvd24pIiBvcGFjaXR5PSIwLjg1Ii8+CiAgICA8Y2lyY2xlIGN4PSIxNjIiIGN5PSItMTkwIiByPSIxNCIgZmlsbD0iI0U2QzY1QyIvPgogICAgPCEtLSBBcmNoZWQgUG9ydGFsIC0tPgogICAgPHBhdGggZD0iTSAtNDAsMCBMIC00MCwtOTAgUSAwLC0xMzAgNDAsLTkwIEwgNDAsMCBaIiBmaWxsPSIjMUEzNDI3Ii8+CiAgPC9nPgoKICA8IS0tIEdyb3VuZCBQbGFuZSAvIFdhdGVyIFJlZmxlY3Rpb24gLS0+CiAgPHJlY3QgeT0iNzAwIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InJnYmEoMCwwLDAsMC4zNSkiLz4KICA8bGluZSB4MT0iMTAwIiB5MT0iNzIwIiB4Mj0iMTEwMCIgeTI9IjcyMCIgc3Ryb2tlPSIjQzlBMjI3IiBzdHJva2Utb3BhY2l0eT0iMC4zIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWRhc2hhcnJheT0iMTIsMTIiLz4KICA8bGluZSB4MT0iMjUwIiB5MT0iNzQ1IiB4Mj0iOTUwIiB5Mj0iNzQ1IiBzdHJva2U9IiNDOUEyMjciIHN0cm9rZS1vcGFjaXR5PSIwLjIiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtZGFzaGFycmF5PSIyNCwxOCIvPgoKICA8IS0tIExhbmRtYXJrIFRpdGxlIExhYmVsIFN1YnRleHQgaW4gU1ZHIC0tPgogIDx0ZXh0IHg9IjYwMCIgeT0iNzU1IiBmb250LWZhbWlseT0iLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSIjRTZDNjVDIiBvcGFjaXR5PSIwLjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGxldHRlci1zcGFjaW5nPSIyLjUiPldISVRFIFRPV04gRlJFTkNIIFFVQVJURVIgJiBQUk9NRU5BREUgwrcgUFVEVUNIRVJSWTwvdGV4dD4KCiAgPCEtLSBCYWRnZSBNYXJrZXIgaW4gYm90dG9tIGNvcm5lciAtLT4KICA8cmVjdCB4PSIzMCIgeT0iNzM4IiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjM0IiByeD0iMTciIGZpbGw9InJnYmEoMCwwLDAsMC42KSIgc3Ryb2tlPSIjQzlBMjI3IiBzdHJva2Utd2lkdGg9IjEuMiIvPgogIDx0ZXh0IHg9IjExMCIgeT0iNzYwIiBmb250LWZhbWlseT0iLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjRTZDNjVDIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMS4yIj5JTExVU1RSQVRJT048L3RleHQ+Cjwvc3ZnPg==', 'ai_generated', 'Custom Vector Illustration (Creative Commons CC0)', 'Explorex AI Cultural Vector Illustration (White Town French Quarter & Promenade)',
  1200, 800, 'd1e8bfcfcd6546f895ce55929d67d23f540089081178305470d9d1146d491d33', true, true
FROM public.places WHERE slug = 'french-quarter-white-town'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'bangaram-atoll-coral-reef', 'Bangaram Atoll & Coral Lagoon', 'attraction', 'Tropical Coral Island', 'Lakshadweep', 'Bangaram Island',
  'Bangaram Island, Lakshadweep, India', 10.9419, 72.2883, 'Bangaram is an atoll in the Union Territory of Lakshadweep, India.',
  '["Lakshadweep entry permit mandatory before departure from Kochi","Plucking or collecting live coral strictly banned under Wildlife Protection Act"]'::jsonb, 350, 'Lakshadweep administration tourist entry permit', 'Accessible via speed boat transit from Agatti airport', 'October to mid-May (calm sea and crystal clear water)',
  ARRAY['Uninhabited Island Resort','Bioluminescent Plankton','Scuba Diving','Turquoise Lagoon'], 'Q806467', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDgwMCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBkYXRhLXBsYWNlLWlkPSJiYW5nYXJhbS1hdG9sbC1jb3JhbC1yZWVmIj4KICA8dGl0bGU+QmFuZ2FyYW0gQXRvbGwgJiBDb3JhbCBMYWdvb24sIEJhbmdhcmFtIElzbGFuZCwgTGFrc2hhZHdlZXA8L3RpdGxlPgogIDxkZXNjIGlkPSJleHBsb3JleC1wcm9tcHQiPm1pbmltYWwgZmxhdCBpbGx1c3RyYXRpb24gb2YgQmFuZ2FyYW0gQXRvbGwgJiBDb3JhbCBMYWdvb24sIEJhbmdhcmFtIElzbGFuZCwgTGFrc2hhZHdlZXAsIHRlYXJkcm9wLXNoYXBlZCBwcmlzdGluZSB0cm9waWNhbCBpc2xhbmQgc3Vycm91bmRlZCBieSBibGluZGluZyB3aGl0ZSBjb3JhbCBzYW5kIGJlYWNoZXMgYW5kIGEgc2hhbGxvdyB0dXJxdW9pc2UtYmx1ZSBsYWdvb24sIG5vIHRleHQsIG5vIHBlb3BsZTwvZGVzYz4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYmdHcmFkX2JhbmdhcmFtLWF0b2xsLWNvcmFsLXJlZWYiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMUEzNDI3Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzJBNEYzRSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ29sZEdyYWRfYmFuZ2FyYW0tYXRvbGwtY29yYWwtcmVlZiIgeDE9IjAlIiB5MT0iMTAwJSIgeDI9IjAlIiB5Mj0iMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjQzlBMjI3Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0U2QzY1QyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0ic3VuR2xvd19iYW5nYXJhbS1hdG9sbC1jb3JhbC1yZWVmIiBjeD0iNTAlIiBjeT0iMzUlIiByPSI0MCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjQzlBMjI3IiBzdG9wLW9wYWNpdHk9IjAuMjUiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMUEzNDI3IiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgPC9kZWZzPgoKICA8IS0tIFNreSAmIEF0bW9zcGhlcmUgLS0+CiAgPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBmaWxsPSJ1cmwoI2JnR3JhZF9iYW5nYXJhbS1hdG9sbC1jb3JhbC1yZWVmKSIvPgogIDxjaXJjbGUgY3g9IjYwMCIgY3k9IjMyMCIgcj0iMjgwIiBmaWxsPSJ1cmwoI3N1bkdsb3dfYmFuZ2FyYW0tYXRvbGwtY29yYWwtcmVlZikiLz4KCiAgPCEtLSBHZW9tZXRyaWMgTW91bnRhaW4gLyBBcmNoaXRlY3R1cmFsIEJhY2tkcm9wIExheWVycyAtLT4KICA8cGF0aCBkPSJNMCw4MDAgTDAsNjIwIFEzMDAsNTIwIDYwMCw1NjAgVDEyMDAsNjAwIEwxMjAwLDgwMCBaIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMTIpIi8+CiAgPHBhdGggZD0iTTAsODAwIEwwLDY4MCBRNDAwLDYwMCA4MDAsNjQwIFQxMjAwLDY2MCBMMTIwMCw4MDAgWiIgZmlsbD0icmdiYSgwLDAsMCwwLjIpIi8+CgogIDwhLS0gU3R5bGl6ZWQgTGFuZG1hcmsgU2lsaG91ZXR0ZXMgLS0+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjAwLCA1MjApIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4KICAgIDwhLS0gQ2VudGVyIERvbWUgLyBTcGlyZSBNb3RpZiAtLT4KICAgIDxwYXRoIGQ9Ik0gLTkwLDAgUSAtOTAsLTE2MCAwLC0yMTAgUSA5MCwtMTYwIDkwLDAgWiIgZmlsbD0idXJsKCNnb2xkR3JhZF9iYW5nYXJhbS1hdG9sbC1jb3JhbC1yZWVmKSIgb3BhY2l0eT0iMC45Ii8+CiAgICA8IS0tIEZsYW5raW5nIE1pbmFyZXRzIC8gUGlsbGFycyAtLT4KICAgIDxyZWN0IHg9Ii0xNzAiIHk9Ii0xODAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxODAiIHJ4PSI0IiBmaWxsPSJ1cmwoI2dvbGRHcmFkX2JhbmdhcmFtLWF0b2xsLWNvcmFsLXJlZWYpIiBvcGFjaXR5PSIwLjg1Ii8+CiAgICA8Y2lyY2xlIGN4PSItMTYyIiBjeT0iLTE5MCIgcj0iMTQiIGZpbGw9IiNFNkM2NUMiLz4KICAgIDxyZWN0IHg9IjE1NCIgeT0iLTE4MCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE4MCIgcng9IjQiIGZpbGw9InVybCgjZ29sZEdyYWRfYmFuZ2FyYW0tYXRvbGwtY29yYWwtcmVlZikiIG9wYWNpdHk9IjAuODUiLz4KICAgIDxjaXJjbGUgY3g9IjE2MiIgY3k9Ii0xOTAiIHI9IjE0IiBmaWxsPSIjRTZDNjVDIi8+CiAgICA8IS0tIEFyY2hlZCBQb3J0YWwgLS0+CiAgICA8cGF0aCBkPSJNIC00MCwwIEwgLTQwLC05MCBRIDAsLTEzMCA0MCwtOTAgTCA0MCwwIFoiIGZpbGw9IiMxQTM0MjciLz4KICA8L2c+CgogIDwhLS0gR3JvdW5kIFBsYW5lIC8gV2F0ZXIgUmVmbGVjdGlvbiAtLT4KICA8cmVjdCB5PSI3MDAiIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0icmdiYSgwLDAsMCwwLjM1KSIvPgogIDxsaW5lIHgxPSIxMDAiIHkxPSI3MjAiIHgyPSIxMTAwIiB5Mj0iNzIwIiBzdHJva2U9IiNDOUEyMjciIHN0cm9rZS1vcGFjaXR5PSIwLjMiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtZGFzaGFycmF5PSIxMiwxMiIvPgogIDxsaW5lIHgxPSIyNTAiIHkxPSI3NDUiIHgyPSI5NTAiIHkyPSI3NDUiIHN0cm9rZT0iI0M5QTIyNyIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1kYXNoYXJyYXk9IjI0LDE4Ii8+CgogIDwhLS0gTGFuZG1hcmsgVGl0bGUgTGFiZWwgU3VidGV4dCBpbiBTVkcgLS0+CiAgPHRleHQgeD0iNjAwIiB5PSI3NTUiIGZvbnQtZmFtaWx5PSItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiNFNkM2NUMiIG9wYWNpdHk9IjAuNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgbGV0dGVyLXNwYWNpbmc9IjIuNSI+QkFOR0FSQU0gQVRPTEwgJiBDT1JBTCBMQUdPT04gwrcgQkFOR0FSQU0gSVNMQU5EPC90ZXh0PgoKICA8IS0tIEJhZGdlIE1hcmtlciBpbiBib3R0b20gY29ybmVyIC0tPgogIDxyZWN0IHg9IjMwIiB5PSI3MzgiIHdpZHRoPSIxNjAiIGhlaWdodD0iMzQiIHJ4PSIxNyIgZmlsbD0icmdiYSgwLDAsMCwwLjYpIiBzdHJva2U9IiNDOUEyMjciIHN0cm9rZS13aWR0aD0iMS4yIi8+CiAgPHRleHQgeD0iMTEwIiB5PSI3NjAiIGZvbnQtZmFtaWx5PSItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTMiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNFNkM2NUMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGxldHRlci1zcGFjaW5nPSIxLjIiPklMTFVTVFJBVElPTjwvdGV4dD4KPC9zdmc+', 'ai_generated', 'Custom Vector Illustration (Creative Commons CC0)', 'Explorex AI Cultural Vector Illustration (Bangaram Atoll & Coral Lagoon)',
  1200, 800, 'af6e1285df75c99445b17a99350047453744e798ba7ba34b334d71b2222e1f42', true, true
FROM public.places WHERE slug = 'bangaram-atoll-coral-reef'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'agatti-island-lagoon', 'Agatti Island Lagoon & Coral Reef', 'attraction', 'Tropical Beach', 'Lakshadweep', 'Agatti',
  'Agatti, Lakshadweep, India', 10.8533, 72.1867, 'Agatti Island is a 7.6 km long island, situated on a coral atoll called Agatti atoll in the Union Territory of Lakshadweep, India. It is 459 km (285 mi) west of the city of Kochi.',
  '["Fly into Agatti airstrip (one of the most scenic ocean runways in the world)","Liquor strictly prohibited in Lakshadweep (except Bangaram)"]'::jsonb, 0, 'permit included in package', 'Daylight beach and marine water sports', 'October to May',
  ARRAY['Ocean Runway','Sea Turtles','Kayaking','Snorkeling Paradise'], 'Q391696', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/a/af/Agatti_Airstrip.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2481, 1827, '8ec6243f87b1bd4fffcb325acdc3c95c6fbf50d8210ab14c9ad9db8ebec720de', true, true
FROM public.places WHERE slug = 'agatti-island-lagoon'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'gateway-of-india-mumbai', 'Gateway of India', 'attraction', 'Heritage Monument', 'Maharashtra', 'Mumbai',
  'Mumbai, Maharashtra, India', 18.922, 72.8347, 'The Gateway of India is an arch-monument, completed in 1924, on the waterfront of Mumbai, Maharashtra, India. It was erected to commemorate the landing of King George V of the United Kingdom for his coronation as the Emperor of India in December 1911 at Strand Road near Wellington Fountain. He was the first British monarch to visit India.',
  '["Security baggage screening at waterfront plaza","Authorized ferry ticket counters located along the jetty"]'::jsonb, 0, 'free public monument', 'Open 24 hours · Ferries to Elephanta Caves operate 9:00 AM - 3:30 PM (except Mondays)', 'October to March (sunset over Mumbai Harbour)',
  ARRAY['Symbol of Mumbai','Indo-Saracenic Arch','Mumbai Harbour','Arabian Sea'], 'Q235884', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3585, 3585, '7ced7a8a302e2ea4fbc6ca3de718ee071d3b9f89bf25f4708bc9ef45e8c5c47b', true, true
FROM public.places WHERE slug = 'gateway-of-india-mumbai'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'ajanta-caves-aurangabad', 'Ajanta Caves (Ancient Buddhist Frescoes)', 'attraction', 'Heritage Monument', 'Maharashtra', 'Chhatrapati Sambhajinagar (Aurangabad)',
  'Chhatrapati Sambhajinagar (Aurangabad), Maharashtra, India', 20.5519, 75.7033, 'The Ajanta Caves are 30 rock-cut Buddhist cave monuments dating from the second century BCE to about 480 CE in Aurangabad district of Maharashtra state in India. Ajanta Caves are a UNESCO World Heritage Site. Universally regarded as masterpieces of Buddhist religious art, the caves include paintings and rock-cut sculptures, described as among the finest surviving examples of ancient Indian art, particularly expressive paintings that present emotions through gesture, pose and form.',
  '["Flash photography and tripods strictly prohibited to preserve ancient vegetable dye frescoes","Eco-friendly electric shuttle bus transports visitors from T-Point parking to cave base"]'::jsonb, 40, 'per person', '9:00 AM - 5:00 PM (Closed on Mondays)', 'October to March or during monsoon for lush green gorge and waterfalls',
  ARRAY['UNESCO World Heritage','Masterpiece of Buddhist Art','Padmapani Fresco','Waghur River Gorge'], 'Q184518', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Ajanta_%2863%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1280, 960, 'a776b96bea57fd9206c8e91524bfa4019fe4d98a97ca38baafa0afff037beb7f', true, true
FROM public.places WHERE slug = 'ajanta-caves-aurangabad'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'ellora-caves-kailasa', 'Ellora Caves & Kailasa Temple (Cave 16)', 'attraction', 'Heritage Monument', 'Maharashtra', 'Chhatrapati Sambhajinagar (Aurangabad)',
  'Chhatrapati Sambhajinagar (Aurangabad), Maharashtra, India', 20.0268, 75.1792, 'The Ellora Caves are a UNESCO World Heritage Site in Aurangabad, India. It is one of the largest rock-cut cave complexes in the world, with artwork dating from AD 600–1000, including Hindu, Buddhist, and Jain caves. The complex is a leading example of Indian rock-cut architecture, and several are not strictly "caves" in that they have no roof. Cave 16 features the largest single monolithic rock excavation in the world, the Kailash temple, a chariot-shaped monument dedicated to the god Shiva. The Kailash temple excavation also features sculptures depicting various Hindu deities as well as relief panels summarizing the two major Hindu epics.',
  '["Cave 16 Kailasa is the largest monolithic rock excavation in the world (carved top-down from single basalt cliff)","Closed on Tuesdays"]'::jsonb, 40, 'per person', 'Sunrise to Sunset (Closed on Tuesdays)', 'October to March',
  ARRAY['UNESCO World Heritage','Monolithic Kailasa Temple','Rashtrakuta Dynasty','Rock Excavation Wonder'], 'Q190117', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDgwMCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBkYXRhLXBsYWNlLWlkPSJlbGxvcmEtY2F2ZXMta2FpbGFzYSI+CiAgPHRpdGxlPkVsbG9yYSBDYXZlcyAmIEthaWxhc2EgVGVtcGxlIChDYXZlIDE2KSwgQ2hoYXRyYXBhdGkgU2FtYmhhamluYWdhciAoQXVyYW5nYWJhZCksIE1haGFyYXNodHJhPC90aXRsZT4KICA8ZGVzYyBpZD0iZXhwbG9yZXgtcHJvbXB0Ij5taW5pbWFsIGZsYXQgaWxsdXN0cmF0aW9uIG9mIEVsbG9yYSBDYXZlcyAmIEthaWxhc2EgVGVtcGxlIChDYXZlIDE2KSwgQ2hoYXRyYXBhdGkgU2FtYmhhamluYWdhciAoQXVyYW5nYWJhZCksIE1haGFyYXNodHJhLCBjb2xvc3NhbCB0d28tc3RvcnkgbW9ub2xpdGhpYyBIaW5kdSB0ZW1wbGUgY2FydmVkIHRvcC1kb3duIGZyb20gYSBzb2xpZCBiYXNhbHQgdm9sY2FuaWMgY2xpZmYsIGNvbXBsZXRlIHdpdGggbGlmZS1zaXplZCBjYXJ2ZWQgc3RvbmUgZWxlcGhhbnRzIGFuZCBwaWxsYXJlZCBtYW5kYXBhcywgbm8gdGV4dCwgbm8gcGVvcGxlPC9kZXNjPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJiZ0dyYWRfZWxsb3JhLWNhdmVzLWthaWxhc2EiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMUEzNDI3Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzJBNEYzRSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ29sZEdyYWRfZWxsb3JhLWNhdmVzLWthaWxhc2EiIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIwJSIgeTI9IjAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0M5QTIyNyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNFNkM2NUMiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InN1bkdsb3dfZWxsb3JhLWNhdmVzLWthaWxhc2EiIGN4PSI1MCUiIGN5PSIzNSUiIHI9IjQwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNDOUEyMjciIHN0b3Atb3BhY2l0eT0iMC4yNSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxQTM0MjciIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICA8L2RlZnM+CgogIDwhLS0gU2t5ICYgQXRtb3NwaGVyZSAtLT4KICA8cmVjdCB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MDAiIGZpbGw9InVybCgjYmdHcmFkX2VsbG9yYS1jYXZlcy1rYWlsYXNhKSIvPgogIDxjaXJjbGUgY3g9IjYwMCIgY3k9IjMyMCIgcj0iMjgwIiBmaWxsPSJ1cmwoI3N1bkdsb3dfZWxsb3JhLWNhdmVzLWthaWxhc2EpIi8+CgogIDwhLS0gR2VvbWV0cmljIE1vdW50YWluIC8gQXJjaGl0ZWN0dXJhbCBCYWNrZHJvcCBMYXllcnMgLS0+CiAgPHBhdGggZD0iTTAsODAwIEwwLDYyMCBRMzAwLDUyMCA2MDAsNTYwIFQxMjAwLDYwMCBMMTIwMCw4MDAgWiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEyKSIvPgogIDxwYXRoIGQ9Ik0wLDgwMCBMMCw2ODAgUTQwMCw2MDAgODAwLDY0MCBUMTIwMCw2NjAgTDEyMDAsODAwIFoiIGZpbGw9InJnYmEoMCwwLDAsMC4yKSIvPgoKICA8IS0tIFN0eWxpemVkIExhbmRtYXJrIFNpbGhvdWV0dGVzIC0tPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYwMCwgNTIwKSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+CiAgICA8IS0tIENlbnRlciBEb21lIC8gU3BpcmUgTW90aWYgLS0+CiAgICA8cGF0aCBkPSJNIC05MCwwIFEgLTkwLC0xNjAgMCwtMjEwIFEgOTAsLTE2MCA5MCwwIFoiIGZpbGw9InVybCgjZ29sZEdyYWRfZWxsb3JhLWNhdmVzLWthaWxhc2EpIiBvcGFjaXR5PSIwLjkiLz4KICAgIDwhLS0gRmxhbmtpbmcgTWluYXJldHMgLyBQaWxsYXJzIC0tPgogICAgPHJlY3QgeD0iLTE3MCIgeT0iLTE4MCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE4MCIgcng9IjQiIGZpbGw9InVybCgjZ29sZEdyYWRfZWxsb3JhLWNhdmVzLWthaWxhc2EpIiBvcGFjaXR5PSIwLjg1Ii8+CiAgICA8Y2lyY2xlIGN4PSItMTYyIiBjeT0iLTE5MCIgcj0iMTQiIGZpbGw9IiNFNkM2NUMiLz4KICAgIDxyZWN0IHg9IjE1NCIgeT0iLTE4MCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE4MCIgcng9IjQiIGZpbGw9InVybCgjZ29sZEdyYWRfZWxsb3JhLWNhdmVzLWthaWxhc2EpIiBvcGFjaXR5PSIwLjg1Ii8+CiAgICA8Y2lyY2xlIGN4PSIxNjIiIGN5PSItMTkwIiByPSIxNCIgZmlsbD0iI0U2QzY1QyIvPgogICAgPCEtLSBBcmNoZWQgUG9ydGFsIC0tPgogICAgPHBhdGggZD0iTSAtNDAsMCBMIC00MCwtOTAgUSAwLC0xMzAgNDAsLTkwIEwgNDAsMCBaIiBmaWxsPSIjMUEzNDI3Ii8+CiAgPC9nPgoKICA8IS0tIEdyb3VuZCBQbGFuZSAvIFdhdGVyIFJlZmxlY3Rpb24gLS0+CiAgPHJlY3QgeT0iNzAwIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InJnYmEoMCwwLDAsMC4zNSkiLz4KICA8bGluZSB4MT0iMTAwIiB5MT0iNzIwIiB4Mj0iMTEwMCIgeTI9IjcyMCIgc3Ryb2tlPSIjQzlBMjI3IiBzdHJva2Utb3BhY2l0eT0iMC4zIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWRhc2hhcnJheT0iMTIsMTIiLz4KICA8bGluZSB4MT0iMjUwIiB5MT0iNzQ1IiB4Mj0iOTUwIiB5Mj0iNzQ1IiBzdHJva2U9IiNDOUEyMjciIHN0cm9rZS1vcGFjaXR5PSIwLjIiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtZGFzaGFycmF5PSIyNCwxOCIvPgoKICA8IS0tIExhbmRtYXJrIFRpdGxlIExhYmVsIFN1YnRleHQgaW4gU1ZHIC0tPgogIDx0ZXh0IHg9IjYwMCIgeT0iNzU1IiBmb250LWZhbWlseT0iLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSIjRTZDNjVDIiBvcGFjaXR5PSIwLjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGxldHRlci1zcGFjaW5nPSIyLjUiPkVMTE9SQSBDQVZFUyAmIEtBSUxBU0EgVEVNUExFIChDQVZFIDE2KSDCtyBDSEhBVFJBUEFUSSBTQU1CSEFKSU5BR0FSIChBVVJBTkdBQkFEKTwvdGV4dD4KCiAgPCEtLSBCYWRnZSBNYXJrZXIgaW4gYm90dG9tIGNvcm5lciAtLT4KICA8cmVjdCB4PSIzMCIgeT0iNzM4IiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjM0IiByeD0iMTciIGZpbGw9InJnYmEoMCwwLDAsMC42KSIgc3Ryb2tlPSIjQzlBMjI3IiBzdHJva2Utd2lkdGg9IjEuMiIvPgogIDx0ZXh0IHg9IjExMCIgeT0iNzYwIiBmb250LWZhbWlseT0iLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjRTZDNjVDIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMS4yIj5JTExVU1RSQVRJT048L3RleHQ+Cjwvc3ZnPg==', 'ai_generated', 'Custom Vector Illustration (Creative Commons CC0)', 'Explorex AI Cultural Vector Illustration (Ellora Caves & Kailasa Temple (Cave 16))',
  1200, 800, '5a1e662e91ff9fbc1ac1c79a245984085be6f10dc6387d53804613eed7e352f9', true, true
FROM public.places WHERE slug = 'ellora-caves-kailasa'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'csmt-railway-terminus-mumbai', 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', 'attraction', 'Heritage Landmark', 'Maharashtra', 'Mumbai',
  'Mumbai, Maharashtra, India', 18.94, 72.8353, 'Chhatrapati Shivaji Terminus (CST), officially Chhatrapati Shivaji Maharaj Terminus (CSMT) and also known as Victoria Terminus (VT), is a historic railway terminus and UNESCO World Heritage Site in Mumbai (Bombay), Maharashtra, India.',
  '["Valid railway platform ticket required to enter boarding platforms","Pedestrian viewing gallery on opposite road intersection for facade photography"]'::jsonb, 0, 'free station concourse access', 'Station operational 24 hours · Heritage Museum tour 2:00 PM - 5:00 PM (weekdays)', 'Evening (illuminated in dynamic multicolored LED lighting)',
  ARRAY['UNESCO World Heritage','Victorian Gothic Revival','F.W. Stevens Architecture','Mumbai Icon'], 'Q235884', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4d/Chhatrapati_shivaji_terminus%2C_esterno_01.jpg/3840px-Chhatrapati_shivaji_terminus%2C_esterno_01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4624, 3032, '59ba212ff04f177541294c1000788e8e978c213bceff63ac6dec3da10d8cae2c', true, true
FROM public.places WHERE slug = 'csmt-railway-terminus-mumbai'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'elephanta-caves-mumbai', 'Elephanta Caves & Trimurti Sculpture', 'attraction', 'Heritage Monument', 'Maharashtra', 'Mumbai (Elephanta Island)',
  'Mumbai (Elephanta Island), Maharashtra, India', 18.9633, 72.9315, 'The Elephanta Caves form a collection of cave temples predominantly dedicated to the Hindu god Shiva; UNESCO has designated them as a World Heritage Site. They are located on Elephanta Island, or Gharapuri, in Mumbai Harbour, 10 kilometres (6.2 mi) east of Mumbai in the Indian state of Maharashtra. The island, about 2 kilometres (1.2 mi) west of the Jawaharlal Nehru Port, features five Hindu caves, a few Buddhist stupa mounds that date back to the 2nd century BCE, and two Buddhist caves with water tanks.',
  '["Closed every Monday","Toy train operates between island pier and hill base staircase for elderly visitors"]'::jsonb, 40, 'per person (Ferry ₹260 roundtrip)', '9:30 AM - 5:30 PM (Closed on Mondays · Ferry service halts in monsoon)', 'November to March',
  ARRAY['UNESCO World Heritage','Sadashiva Trimurti','Island Cave Shrine','Shiva Sculptures'], 'Q185298', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Elephanta_Caves_Trimurti.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2501, 2846, '3a2feefd97057ae7956a5160aad278fac56fc9dc033da3724e12120bd1905a64', true, true
FROM public.places WHERE slug = 'elephanta-caves-mumbai'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'shirdi-sai-baba-temple', 'Shirdi Sai Baba Sansthan Temple', 'attraction', 'Spiritual', 'Maharashtra', 'Shirdi (Ahmednagar)',
  'Shirdi (Ahmednagar), Maharashtra, India', 19.7667, 74.4767, 'Shirdi Sai Baba Sansthan Temple is a renowned spiritual in Shirdi (Ahmednagar), Maharashtra.',
  '["Online advance booking recommended for aarti passes","Dress modestly; free mega prasad meal served at Sai Prasadalaya"]'::jsonb, 0, 'free general darshan (VIP pass ₹200)', '4:00 AM - 11:15 PM daily (Kakad Aarti at 4:30 AM, Shej Aarti at 10:30 PM)', 'October to March',
  ARRAY['Sai Baba Samadhi','Universal Spiritual Sanctuary','Dwarkamai','Langar Prasadalaya'], 'Q7497672', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDgwMCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBkYXRhLXBsYWNlLWlkPSJzaGlyZGktc2FpLWJhYmEtdGVtcGxlIj4KICA8dGl0bGU+U2hpcmRpIFNhaSBCYWJhIFNhbnN0aGFuIFRlbXBsZSwgU2hpcmRpIChBaG1lZG5hZ2FyKSwgTWFoYXJhc2h0cmE8L3RpdGxlPgogIDxkZXNjIGlkPSJleHBsb3JleC1wcm9tcHQiPm1pbmltYWwgZmxhdCBpbGx1c3RyYXRpb24gb2YgU2hpcmRpIFNhaSBCYWJhIFNhbnN0aGFuIFRlbXBsZSwgU2hpcmRpIChBaG1lZG5hZ2FyKSwgTWFoYXJhc2h0cmEsIHJhZGlhbnQgd2hpdGUgSXRhbGlhbiBtYXJibGUgU2FtYWRoaSBzaHJpbmUgb2YgU2FpIEJhYmEgY3Jvd25lZCBieSBhIHNvbGlkIGdvbGQgdGhyb25lIHVuZGVyIGdsaXR0ZXJpbmcgY2hhbmRlbGllcnMsIG5vIHRleHQsIG5vIHBlb3BsZTwvZGVzYz4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYmdHcmFkX3NoaXJkaS1zYWktYmFiYS10ZW1wbGUiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMkQxODEwIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzRBMjgxOCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ29sZEdyYWRfc2hpcmRpLXNhaS1iYWJhLXRlbXBsZSIgeDE9IjAlIiB5MT0iMTAwJSIgeDI9IjAlIiB5Mj0iMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRjU5RTBCIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZERTY4QSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0ic3VuR2xvd19zaGlyZGktc2FpLWJhYmEtdGVtcGxlIiBjeD0iNTAlIiBjeT0iMzUlIiByPSI0MCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRjU5RTBCIiBzdG9wLW9wYWNpdHk9IjAuMjUiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMkQxODEwIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgPC9kZWZzPgoKICA8IS0tIFNreSAmIEF0bW9zcGhlcmUgLS0+CiAgPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBmaWxsPSJ1cmwoI2JnR3JhZF9zaGlyZGktc2FpLWJhYmEtdGVtcGxlKSIvPgogIDxjaXJjbGUgY3g9IjYwMCIgY3k9IjMyMCIgcj0iMjgwIiBmaWxsPSJ1cmwoI3N1bkdsb3dfc2hpcmRpLXNhaS1iYWJhLXRlbXBsZSkiLz4KCiAgPCEtLSBHZW9tZXRyaWMgTW91bnRhaW4gLyBBcmNoaXRlY3R1cmFsIEJhY2tkcm9wIExheWVycyAtLT4KICA8cGF0aCBkPSJNMCw4MDAgTDAsNjIwIFEzMDAsNTIwIDYwMCw1NjAgVDEyMDAsNjAwIEwxMjAwLDgwMCBaIiBmaWxsPSJyZ2JhKDI0NSwgMTU4LCAxMSwgMC4xNSkiLz4KICA8cGF0aCBkPSJNMCw4MDAgTDAsNjgwIFE0MDAsNjAwIDgwMCw2NDAgVDEyMDAsNjYwIEwxMjAwLDgwMCBaIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMikiLz4KCiAgPCEtLSBTdHlsaXplZCBMYW5kbWFyayBTaWxob3VldHRlcyAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MDAsIDUyMCkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPgogICAgPCEtLSBDZW50ZXIgRG9tZSAvIFNwaXJlIE1vdGlmIC0tPgogICAgPHBhdGggZD0iTSAtOTAsMCBRIC05MCwtMTYwIDAsLTIxMCBRIDkwLC0xNjAgOTAsMCBaIiBmaWxsPSJ1cmwoI2dvbGRHcmFkX3NoaXJkaS1zYWktYmFiYS10ZW1wbGUpIiBvcGFjaXR5PSIwLjkiLz4KICAgIDwhLS0gRmxhbmtpbmcgTWluYXJldHMgLyBQaWxsYXJzIC0tPgogICAgPHJlY3QgeD0iLTE3MCIgeT0iLTE4MCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE4MCIgcng9IjQiIGZpbGw9InVybCgjZ29sZEdyYWRfc2hpcmRpLXNhaS1iYWJhLXRlbXBsZSkiIG9wYWNpdHk9IjAuODUiLz4KICAgIDxjaXJjbGUgY3g9Ii0xNjIiIGN5PSItMTkwIiByPSIxNCIgZmlsbD0iI0ZERTY4QSIvPgogICAgPHJlY3QgeD0iMTU0IiB5PSItMTgwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTgwIiByeD0iNCIgZmlsbD0idXJsKCNnb2xkR3JhZF9zaGlyZGktc2FpLWJhYmEtdGVtcGxlKSIgb3BhY2l0eT0iMC44NSIvPgogICAgPGNpcmNsZSBjeD0iMTYyIiBjeT0iLTE5MCIgcj0iMTQiIGZpbGw9IiNGREU2OEEiLz4KICAgIDwhLS0gQXJjaGVkIFBvcnRhbCAtLT4KICAgIDxwYXRoIGQ9Ik0gLTQwLDAgTCAtNDAsLTkwIFEgMCwtMTMwIDQwLC05MCBMIDQwLDAgWiIgZmlsbD0iIzJEMTgxMCIvPgogIDwvZz4KCiAgPCEtLSBHcm91bmQgUGxhbmUgLyBXYXRlciBSZWZsZWN0aW9uIC0tPgogIDxyZWN0IHk9IjcwMCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMzUpIi8+CiAgPGxpbmUgeDE9IjEwMCIgeTE9IjcyMCIgeDI9IjExMDAiIHkyPSI3MjAiIHN0cm9rZT0iI0Y1OUUwQiIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1kYXNoYXJyYXk9IjEyLDEyIi8+CiAgPGxpbmUgeDE9IjI1MCIgeTE9Ijc0NSIgeDI9Ijk1MCIgeTI9Ijc0NSIgc3Ryb2tlPSIjRjU5RTBCIiBzdHJva2Utb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWRhc2hhcnJheT0iMjQsMTgiLz4KCiAgPCEtLSBMYW5kbWFyayBUaXRsZSBMYWJlbCBTdWJ0ZXh0IGluIFNWRyAtLT4KICA8dGV4dCB4PSI2MDAiIHk9Ijc1NSIgZm9udC1mYW1pbHk9Ii1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjYwMCIgZmlsbD0iI0ZERTY4QSIgb3BhY2l0eT0iMC40IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMi41Ij5TSElSREkgU0FJIEJBQkEgU0FOU1RIQU4gVEVNUExFIMK3IFNISVJESSAoQUhNRUROQUdBUik8L3RleHQ+CgogIDwhLS0gQmFkZ2UgTWFya2VyIGluIGJvdHRvbSBjb3JuZXIgLS0+CiAgPHJlY3QgeD0iMzAiIHk9IjczOCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIzNCIgcng9IjE3IiBmaWxsPSJyZ2JhKDAsMCwwLDAuNikiIHN0cm9rZT0iI0Y1OUUwQiIgc3Ryb2tlLXdpZHRoPSIxLjIiLz4KICA8dGV4dCB4PSIxMTAiIHk9Ijc2MCIgZm9udC1mYW1pbHk9Ii1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iI0ZERTY4QSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgbGV0dGVyLXNwYWNpbmc9IjEuMiI+SUxMVVNUUkFUSU9OPC90ZXh0Pgo8L3N2Zz4=', 'ai_generated', 'Custom Vector Illustration (Creative Commons CC0)', 'Explorex AI Cultural Vector Illustration (Shirdi Sai Baba Sansthan Temple)',
  1200, 800, 'f5741ad07f31380df21f3b0ebde6c62ad149882e6265354275d454ada81a6819', true, true
FROM public.places WHERE slug = 'shirdi-sai-baba-temple'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'raigad-fort-shivaji', 'Raigad Fort (Capital of Chhatrapati Shivaji Maharaj)', 'attraction', 'Heritage Fort', 'Maharashtra', 'Mahad (Raigad)',
  'Mahad (Raigad), Maharashtra, India', 18.2347, 73.4419, 'Raigad, located in the Raigad district of Maharashtra, India, is a hill fort situated near the town of Mahad. It is one of the strongest fortresses on the Deccan Plateau and was historically referred to as Rairee or Rairy Fort. Raigad is the largest fort in Asia, with an area of 1,200 acres.',
  '["Ropeway provides 4-minute ascent saving 1,737 stone steps climb","Carry water bottle; historical ruins span large high plateau"]'::jsonb, 25, 'per person (Ropeway ₹350 roundtrip)', 'Sunrise to Sunset daily · Ropeway operates 8:00 AM - 5:30 PM', 'September to March or monsoon for misty cloud-enveloped ramparts',
  ARRAY['Maratha Empire Capital','Coronation Site of Shivaji Maharaj','Sahyadri Mountains','Maha Darwaja'], 'Q7283742', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/d/de/Nagarkhana%2C_Raigad_Fort%2C_India.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1728, 1152, '2c839f8dbb27687fb80e391f4774dad3ec11bd93800ad914360c61f4e65f63b9', true, true
FROM public.places WHERE slug = 'raigad-fort-shivaji'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'the-taj-mahal-palace-mumbai', 'The Taj Mahal Palace Mumbai', 'stay', 'Luxury Heritage Stay', 'Maharashtra', 'Mumbai',
  'Mumbai, Maharashtra, India', 18.9217, 72.8333, 'The Taj Mahal Palace is a heritage, five-star, luxury hotel in the Colaba area of Mumbai, Maharashtra, India, situated next to the Gateway of India. Built in the Indo-Saracenic style, it opened in 1903 as the Taj Mahal Hotel, and has historically often been known simply as "The Taj". The hotel is named after the Taj Mahal, which is located in the city of Agra, approximately 1,050 kilometres (650 mi) from Mumbai. It has been considered one of the finest hotels in the East since the time of the British Raj. It is currently owned and managed by the Indian Hotels Company Limited (IHCL), a Tata Group company. The hotel was one of the main targets in the 2008 Mumbai attacks.',
  '["Smart casual dress code in lobby and dining lounges","Government photo identification mandatory at check-in"]'::jsonb, 22000, 'per night', '24-hour luxury hospitality · Afternoon Tea served at Sea Lounge', 'October to April',
  ARRAY['Flagship Heritage Hotel','Since 1903','Florentine Dome','Sea Lounge High Tea'], 'Q7741527', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Taj_Mahal_Palace_Hotel_photo.jpg/3840px-Taj_Mahal_Palace_Hotel_photo.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4624, 2565, '79291100352e6ccf8e146ced7005b30f0f10cd9f1c8c40d95e87215a0544a376', true, false
FROM public.places WHERE slug = 'the-taj-mahal-palace-mumbai'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'hawa-mahal-jaipur', 'Hawa Mahal (Palace of Winds)', 'attraction', 'Heritage Palace', 'Rajasthan', 'Jaipur',
  'Jaipur, Rajasthan, India', 26.9239, 75.8267, 'The Hawa Mahal is a palace in the city of Jaipur, Rajasthan, India. Built from red and pink sandstone, it is on the edge of the City Palace, Jaipur, and extends to the Zenana, or women''s chambers.',
  '["Composite Rajasthan heritage ticket accepted","Rooftop cafes across the street offer prime photography viewpoints"]'::jsonb, 50, 'per person', '9:00 AM - 5:00 PM daily (facade illuminated at night)', 'October to March (early morning sunlight illuminates pink sandstone)',
  ARRAY['Pink City','953 Jharokha Windows','Krishna Crown Design','Air Conditioning Architecture'], 'Q199586', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3345, 2509, '2c9287f0b1781272787cbcff8d2cb0e721fd1e5063ae76d249d45d6b74f8f180', true, true
FROM public.places WHERE slug = 'hawa-mahal-jaipur'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'amber-fort-jaipur', 'Amber Fort & Palace (Amer)', 'attraction', 'Heritage Fort', 'Rajasthan', 'Jaipur (Amer)',
  'Jaipur (Amer), Rajasthan, India', 26.9855, 75.8513, 'Amer Fort or Amber Fort is a fort located in Amer, Rajasthan, India. Amer is a town with an area of 4 square kilometres (1.5 sq mi) located 11 kilometres (6.8 mi) from Jaipur, the capital of Rajasthan. Located high on a hill, it is the principal tourist attraction in Jaipur. Amer Fort is known for its artistic style elements. With its large ramparts and series of gates and cobbled paths, the fort overlooks Maota Lake, which is the main source of water for the Amer Palace.',
  '["Sheesh Mahal (Mirror Palace): no touching convex glass mirrors","Electric jeep transfer available from parking up to Suraj Pol gate"]'::jsonb, 100, 'per person', '8:00 AM - 5:30 PM, 6:30 PM - 9:15 PM (Night tourism and Sound & Light show)', 'October to March',
  ARRAY['UNESCO World Heritage','Sheesh Mahal Mirror Hall','Maota Lake','Rajput Architecture'], 'Q456891', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg/3840px-20191219_Fort_Amber%2C_Amer%2C_Jaipur_0955_9481.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4000, 3630, '60361ffb4fe93e372ab0e7ec3fcfbd957147485758eca3480b196b297e6e474f', true, true
FROM public.places WHERE slug = 'amber-fort-jaipur'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'city-palace-udaipur', 'City Palace Complex Udaipur', 'attraction', 'Heritage Palace', 'Rajasthan', 'Udaipur',
  'Udaipur, Rajasthan, India', 24.5764, 73.6835, 'City Palace, Udaipur is a palace complex situated in the city of Udaipur in the Indian state of Rajasthan. It was built over a period of nearly 400 years, with contributions from several rulers of the Mewar dynasty. Its construction began in 1553, started by Maharana Udai Singh II of the Sisodia Rajput family as he shifted his capital from the erstwhile Chittor to the newfound city of Udaipur. The palace is located on the east bank of Lake Pichola and has several palaces built within its complex.',
  '["Boat ride to Jagmandir Island requires separate combined ticket","Photography permitted with camera permit token"]'::jsonb, 300, 'palace museum entry per person', '9:00 AM - 9:00 PM daily · Lake Pichola boat rides from Bansi Ghat until sunset', 'October to March',
  ARRAY['City of Lakes','Mewar Royal Dynasty','Lake Pichola','Mor Chowk Peacock Courtyard'], 'Q2978009', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/6/69/Udaipur_City_Palace.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1943, 1410, 'f692fd8d00de18c6ee1b5b94471a7302ad25a314845e02cc20315d1d12da2f2f', true, true
FROM public.places WHERE slug = 'city-palace-udaipur'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'mehrangarh-fort-jodhpur', 'Mehrangarh Fort (Citadel of the Sun)', 'attraction', 'Heritage Fort', 'Rajasthan', 'Jodhpur',
  'Jodhpur, Rajasthan, India', 26.2978, 73.0189, 'Mehrangarh is a historic fort located in Jodhpur, Rajasthan, India. It stands on a hilltop, rising about 122 m (400 ft) above the surrounding plains, and the complex spans 1,200 acres. It was initially built around 1459 by the Rajput ruler of Rathore clan Rao Jodha, though most of the existing structure is from the 17th century built by his successors. The fort has seven gates, including the main entrance, Jai Pol, built by Maharaja Man Singh to commemorate his victories over the Jaipur and Bikaner armies in 1806. The Fattehpol, commemorates victory of Maharaja Ajit Singh over the Mughals. The English writer and Nobel Prize winner, Rudyard Kipling, described the fort as "a palace that might have been built by Titans and colored by the morning sun."',
  '["Audio guide available in multiple languages at ticket desk (highly rated)","Elevator available to reach upper palace courtyard level"]'::jsonb, 100, 'per person', '9:00 AM - 5:00 PM daily · Flying Fox zipline operational on outer ramparts', 'October to March',
  ARRAY['Blue City View','Rathore Royalty','Moti Mahal','Intricate Stone Screens'], 'Q1542617', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/9/99/Mehrangarh_Fort_sanhita.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1280, 854, 'baf5bb659a46f55b84c524d51b873dc633ed8d0b570bf278dd779e49a7a13d9a', true, true
FROM public.places WHERE slug = 'mehrangarh-fort-jodhpur'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'jaisalmer-golden-fort', 'Jaisalmer Fort (Sonar Qila / Golden Fort)', 'attraction', 'Heritage Fort', 'Rajasthan', 'Jaisalmer',
  'Jaisalmer, Rajasthan, India', 26.9124, 70.9126, 'Jaisalmer Fort is situated in the city of Jaisalmer, in the Indian state of Rajasthan. It is one of the very few "living forts" in the world, as nearly one fourth of the old city''s population still resides within the fort. For the better part of its 860-year history, the fort was the city of Jaisalmer. The first settlements outside the fort walls, to accommodate the growing population of Jaisalmer, are said to have come up in the 17th century.',
  '["One of the only functioning living forts in the world (housing 4,000 residents)","Visit seven intricately carved yellow sandstone Jain Temples inside"]'::jsonb, 0, 'free living fort entry (Raja Mahal museum ₹100)', 'Living fort open 24 hours · Fort palace museum 9:00 AM - 6:00 PM', 'October to March (Desert Festival in February)',
  ARRAY['UNESCO World Heritage','Living Golden Fort','Yellow Sandstone','Thar Desert'], 'Q1678888', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/4/47/Jaisalmer_forteresse.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2048, 853, '3d87b3193cb7784b7e6eeb984d94481e526c5bc64a1b38a5af4b9643c8566423', true, true
FROM public.places WHERE slug = 'jaisalmer-golden-fort'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'thar-desert-sam-sand-dunes', 'Sam Sand Dunes & Desert Safari', 'attraction', 'Desert & Culture', 'Rajasthan', 'Jaisalmer (Sam)',
  'Jaisalmer (Sam), Rajasthan, India', 26.83, 70.51, 'The Thar Desert, also known as the Great Indian Desert, is an arid region in the north-western part of the Indian subcontinent stretching across India and Pakistan. Covering an area of 264,091 km2 (101,966 sq mi), it is one of the largest subtropical deserts in Asia by area. About two-thirds of the desert area lies in India, with the remainder in Pakistan. It forms about six percent of the geographical area of India, with the majority of the desert lying in the state of Rajasthan, with portions extending into Gujarat, Haryana, and Punjab. Towards the west, it extends into the provinces of Sindh and Punjab in Pakistan. It is bordered by the Indo-Gangetic Plain to the north, west and northeast, Rann of Kutch to the south, and the Aravalli Range to the east.',
  '["Negotiate authorized RTDC or camp-registered safaris","Carry warm jackets for chilly desert nights after sundown"]'::jsonb, 800, 'camel safari and cultural folk dance program approx', 'Camel and 4x4 Jeep safaris operate 5:00 AM - 8:00 AM and 4:00 PM - 7:30 PM', 'November to February (clear desert night skies with star stargazing)',
  ARRAY['Rippled Sand Dunes','Camel Safari','Kalbelia Folk Dance','Thar Sunset'], 'Q3520110', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/92/Thar_desert_Rajasthan_India.jpg/3840px-Thar_desert_Rajasthan_India.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3888, 2592, '49dc9aa7755a7932e20f1bc56913438df6d0a8672218b07e2718f4bee1c6b93a', true, false
FROM public.places WHERE slug = 'thar-desert-sam-sand-dunes'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'chittorgarh-fort', 'Chittorgarh Fort (Pride of Rajputana)', 'attraction', 'Heritage Fort', 'Rajasthan', 'Chittorgarh',
  'Chittorgarh, Rajasthan, India', 24.8878, 74.6453, 'Chittor Fort, also known as Chittod Fort, is one of the largest forts in India. It is a UNESCO World Heritage Site. The fort was the capital of Mewar and is located in the present-day city of Chittorgarh. It sprawls over a hill 180 m (590.6 ft) in height, spread over an area of 280 ha above the plains of the valley drained by the Berach River. The fort covers 65 historic structures, which include four palaces, 19 large temples, 20 large water bodies, 4 memorials, and a few victory towers.',
  '["Largest fort complex in India spanning 700 acres; auto-rickshaw or car recommended inside","Ascend the nine-story Vijay Stambha (Tower of Victory) for panoramic view"]'::jsonb, 40, 'per person', 'Sunrise to Sunset daily (approx. 6:00 AM - 6:30 PM)', 'October to March',
  ARRAY['UNESCO World Heritage','Vijay Stambha Victory Tower','Padmini Palace','Rani Padmini Jauhar'], 'Q1074984', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Chittorgarh_fort.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3008, 2000, 'ccacdf6e6a05fee903e70b8b8455b82e442e8b66f81df1ba6a6e3d0db2424aae', true, true
FROM public.places WHERE slug = 'chittorgarh-fort'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'statue-of-unity-kevadiya', 'Statue of Unity (Sardar Vallabhbhai Patel)', 'attraction', 'Monument & Engineering', 'Gujarat', 'Ekta Nagar (Kevadiya)',
  'Ekta Nagar (Kevadiya), Gujarat, India', 21.838, 73.7191, '
The Statue of Unity is the world''s tallest statue, with a height of 182 metres, located in Narmada valley, near Kevadia in the state of Gujarat, India. It depicts Indian politician and independence activist Sardar Patel (1875–1950), who was the first deputy prime minister and home minister of independent India. Patel played a significant role in the political integration of India. The statue is on the Narmada River in the Kevadiya colony, facing the Sardar Sarovar Dam, 100 kilometres southeast of the city of Vadodara.',
  '["Closed every Monday for maintenance","Pre-booking tickets online mandatory; high-speed elevators ascend to the chest-level viewing gallery in 30 seconds"]'::jsonb, 150, 'entry ticket (Viewing Gallery at 153m is ₹380)', '8:00 AM - 6:00 PM (Closed on Mondays · Laser Light & Sound Show at 7:00 PM)', 'October to March',
  ARRAY['World Tallest Statue (182m)','Iron Man of India','Narmada River','Engineering Marvel'], 'Q57984180', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/0/07/Statue_of_Unity.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3456, 5184, '300f24cfec35d25ec02af300b97b088c8b7dbbb98c645e1aa846174f12b1dc57', true, true
FROM public.places WHERE slug = 'statue-of-unity-kevadiya'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'somnath-temple-prabhas-patan', 'Shree Somnath Jyotirlinga Temple', 'attraction', 'Spiritual', 'Gujarat', 'Prabhas Patan (Veraval)',
  'Prabhas Patan (Veraval), Gujarat, India', 20.888, 70.4014, 'Somanatha Temple is a Hindu temple, located in Prabhas Patan, Veraval, in Gujarat, India. It is one of the most sacred pilgrimage sites, or Tirtha Kshetra for Hindus and is the first among the twelve jyotirlinga shrines of Shiva. The date of construction of the earliest Somnath temple remains uncertain, with estimates varying between the early centuries of the 1st millennium and about the 9th century CE. Various texts, including the Mahabharata and Bhagavata Purana, mention a tirtha at Prabhas Patan on the coastline of Saurashtra, where the later temple would eventually be built, but archaeology has not found traces of an early temple, though there was a settlement there.',
  '["Mobile phones, electronic gadgets, leather belts, and bags strictly prohibited (free lockers at gate)","Dress code: modest traditional attire encouraged"]'::jsonb, 0, 'free darshan', '6:00 AM - 10:00 PM daily · Aartis at 7:00 AM, 12:00 PM, 7:00 PM · Sound & Light show at 8:00 PM', 'October to March (Maha Shivaratri in spring)',
  ARRAY['First among 12 Jyotirlingas','Arabian Sea Shore','Baan Stambh Arrow Pillar','Chalukya Architecture'], 'Q844111', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Somanath_mandir_%28cropped%29.jpg/3840px-Somanath_mandir_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  5712, 4497, '11c35637074adbeeca3f24f41d27f790a94ac6ec2339e5657a8fd4e9055a7976', true, false
FROM public.places WHERE slug = 'somnath-temple-prabhas-patan'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'rann-of-kutch-white-desert', 'Great Rann of Kutch (White Salt Desert)', 'attraction', 'Natural Wonder', 'Gujarat', 'Dhordo (Kutch)',
  'Dhordo (Kutch), Gujarat, India', 23.7337, 69.8597, 'The Rann of Kutch is a large area of salt marshes located in the northwestern part of the Indian subcontinent, and spans the border between India and Pakistan. Most of the region is located in the Kutch district of the Indian state of Gujarat, with a minor portion extending into the Sindh province of Pakistan. It is further sub-divided geographically into the Great Rann and Little Rann.',
  '["Online permit registration mandatory before entering border checkpoint zone","Wear sunglasses to counter harsh daytime salt reflection"]'::jsonb, 100, 'Rann permit fee per adult', 'Open daylight and full-moon evening viewing (Permit required from Bhirandiyara checkpoint)', 'November to February during Rann Utsav (especially on Full Moon nights)',
  ARRAY['World Largest Salt Desert','Rann Utsav','Full Moon Night Wonder','Kutchi Handicrafts'], 'Q1140027', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Rann_of_Kutch_-_White_Desert.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2592, 1944, '1f1545da63f8faeecc565c9a14316694577ecdc883f2f84d608544763ecdaa82', true, false
FROM public.places WHERE slug = 'rann-of-kutch-white-desert'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'sun-temple-modhera', 'Sun Temple Modhera & Surya Kund', 'attraction', 'Heritage Monument', 'Gujarat', 'Modhera (Mehsana)',
  'Modhera (Mehsana), Gujarat, India', 23.5836, 72.1331, 'The  Sun Temple of Modhera is a Hindu temple dedicated to the solar deity Surya, located in the village of Modhera in Mehsana district, Gujarat, India. The temple is situated on the bank of the river Pushpavati, and was constructed in the 11th century during the reign of Bhima I and Karna I of the Chaulukya dynasty. The temple is no longer used for worship and is a protected monument maintained by the Archaeological Survey of India. The temple complex has three components: Gūḍhamanḍapa, the shrine hall; Sabhamanḍapa, the assembly hall and Kunḍa, the reservoir. The halls are noted for the intricately carved exteriors and decorated pillars. The tiered steps of the reservoir lead to the bottom and numerous small shrines.',
  '["Equinox alignment: sunrise rays strike the innermost sanctum on solar equinoxes","No stepping onto delicate stepped tank miniature shrines"]'::jsonb, 25, 'per person', '7:00 AM - 6:00 PM daily (Evening 3D projection mapping on weekends)', 'October to March (Modhera Dance Festival in January)',
  ARRAY['Maru-Gurjara Architecture','Surya Kund Stepped Tank','Equinox Alignment','ASI Protected'], 'Q2962635', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Surya_mandhir.jpg/3840px-Surya_mandhir.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4032, 3024, '19ddf37e9e8397837ac42838ff12f5ec71512e2ef87c7f697da245db866e7eea', true, false
FROM public.places WHERE slug = 'sun-temple-modhera'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'rani-ki-vav-patan', 'Rani ki Vav (Queen Stepwell)', 'attraction', 'Heritage Monument', 'Gujarat', 'Patan',
  'Patan, Gujarat, India', 23.8589, 72.1014, 'Rani ki Vav is a stepwell situated in the town of Patan in Gujarat, India. It is located on the banks of the Saraswati River. Its construction is attributed to Udayamati, the Wife of the 11th-century Chaulukya king Bhima I. Silted over, it was rediscovered in the 1940s and restored in the 1980s by the Archaeological Survey of India. It has been listed as a UNESCO World Heritage Sites in India since 2014. The stepwell is designed as an underground shrine or inverted temple symbolizing the sanctity of water, with sculptures depicting numerous Hindu deities. It is divided into seven stair levels, each with sculptural panels. These panels contain more than 500 principal sculptures and over a thousand minor ones, combining religious, secular, and symbolic imagery.',
  '["Featured on the reverse of the Indian ₹100 banknote","Step down carefully on seven stepped pillared terraces"]'::jsonb, 40, 'per person', '8:00 AM - 6:00 PM daily', 'October to March',
  ARRAY['UNESCO World Heritage','Masterpiece of Subterranean Architecture','Dashavatara Carvings','Stepwell Wonder'], 'Q19896798', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Rani_ki_vav_02.jpg/3840px-Rani_ki_vav_02.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4953, 3302, 'd766108bd1cbc4af6a0357e193958ae32d7658bd999fcc3f85b3d8911ea991fd', true, true
FROM public.places WHERE slug = 'rani-ki-vav-patan'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'gir-national-park-asiatic-lions', 'Gir National Park (Home of Asiatic Lions)', 'attraction', 'Wildlife Sanctuary', 'Gujarat', 'Sasan Gir (Junagadh)',
  'Sasan Gir (Junagadh), Gujarat, India', 21.1242, 70.8242, 'Gir National Park and Wildlife Sanctuary, also known as Sasan Gir, is a national park and wildlife sanctuary in Gujarat, India. It was established in 1965 in the erstwhile Nawab of Junagarh''s private hunting area, with a total area of 1,410.30 km2 (544.52 sq mi), of which 258.71 km2 (99.89 sq mi) is fully protected as a national park and 1,151.59 km2 (444.63 sq mi) as wildlife sanctuary. It is part of the Khathiar-Gir dry deciduous forests ecoregion.',
  '["Government online advance permit booking essential","Closed during monsoon breeding season (mid-June to mid-October)"]'::jsonb, 800, 'jeep safari permit estimate per Indian national', 'Morning safari: 6:00 AM - 9:00 AM, 9:00 AM - 12:00 PM · Afternoon safari: 3:00 PM - 6:00 PM (Closed June 16 - October 15)', 'December to April',
  ARRAY['Sole Home of the Asiatic Lion','Dry Deciduous Teak Jungle','Jeep Safari','Biodiversity'], 'Q1471718', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/9/90/Gir_lion-Gir_forest%2Cjunagadh%2Cgujarat%2Cindia.jpeg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  618, 440, '668937667311585c5b37e33379ab37a71ad9af900a5728386781776dcc4af835', true, false
FROM public.places WHERE slug = 'gir-national-park-asiatic-lions'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'basilica-of-bom-jesus-goa', 'Basilica of Bom Jesus', 'attraction', 'Heritage Church', 'Goa', 'Old Goa',
  'Old Goa, Goa, India', 15.5008, 73.9117, 'The Basilica of Bom Jesus is a Catholic basilica in Goa, in the Konkan region of India. The church is a pilgrimage centre and recognised by UNESCO as a World Heritage Site. The basilica is located in Old Goa, the former capital of Portuguese India, and holds the body of St Francis Xavier.',
  '["Dress code: shoulders and knees must be covered inside basilica","Maintain silence in the sacred silver casket reliquary chapel"]'::jsonb, 0, 'free entry', '9:00 AM - 6:30 PM (Sundays 10:30 AM - 6:30 PM)', 'November to February (Feast of St. Francis Xavier on December 3)',
  ARRAY['UNESCO World Heritage','Portuguese Baroque','St. Francis Xavier Relics','Old Goa'], 'Q810052', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Front_Elevation_of_Basilica_of_Bom_Jesus.jpg/3840px-Front_Elevation_of_Basilica_of_Bom_Jesus.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  5468, 3866, '6843c01bf6061316a3b11edcc044225e3b549ea03590d0309337bab8f8015c25', true, true
FROM public.places WHERE slug = 'basilica-of-bom-jesus-goa'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'fort-aguada-candolim', 'Fort Aguada & 1864 Lighthouse', 'attraction', 'Heritage Fort', 'Goa', 'Candolim (Sinquerim)',
  'Candolim (Sinquerim), Goa, India', 15.4925, 73.7736, 'Fort Aguada is a seventeenth-century Portuguese-era fort, built in 1612, along with a lighthouse, standing in Goa, India, on Sinquerim Beach, overlooking the Arabian Sea. It is an ASI protected Monument of National Importance in Goa.',
  '["Watch out for steep rocky slopes along outer sea ramparts","Visit the lower Aguada jail museum complex nearby"]'::jsonb, 25, 'per person', '9:30 AM - 6:00 PM daily', 'October to April (sunset views over Arabian Sea)',
  ARRAY['17th Century Portuguese Citadel','Mandovi River Estuary','Historic Lighthouse','Arabian Sea Ramparts'], 'Q3520110', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Fort_aguada.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1024, 768, 'fa57602f41c85990cb99dcc9f3bc3201f97e226380d4b2eab7b34d07f06a7e26', true, true
FROM public.places WHERE slug = 'fort-aguada-candolim'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'dudhsagar-falls-goa', 'Dudhsagar Waterfalls (Sea of Milk)', 'attraction', 'Nature & Waterfall', 'Goa', 'Sonaulim (Mollem National Park)',
  'Sonaulim (Mollem National Park), Goa, India', 15.3144, 74.3144, 'Dudhsagar Falls is a four-tiered waterfall on the Mahadayi River in the Indian state of Goa. It is 60km from Panaji by road and is located on the Belagavi–Vasco Da Gama rail route about 46km east of Madgaon and 80km south of Belagavi
. Dudhsagar Falls is perched at the top of a crescent shaped valley and surrounded by pristine forests, and it is amongst India''s tallest waterfalls with a height of 310 m and an average width of 30 metres (100 feet).',
  '["Mandatory life-jacket rental required to swim in natural waterfall pool","Authorized Forest Department 4x4 jeeps only to navigate riverbed crossings"]'::jsonb, 500, '4x4 Forest Jeep Safari share approx', '6:00 AM - 4:00 PM daily (Jeep safari operates from Kulem station · Closed in heavy peak monsoon for safety)', 'October to May',
  ARRAY['Four-tiered Waterfall','Mandovi River','Railway Bridge Viaduct','Western Ghats'], 'Q1263721', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Doodhsagar_Fall.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3456, 5184, '3ab514e1129a88d2ace279faf55f9a8a63f3e15be518421c40321009c367f76e', true, false
FROM public.places WHERE slug = 'dudhsagar-falls-goa'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'calangute-baga-beach-goa', 'Calangute & Baga Beach Promenade', 'attraction', 'Coastal & Beach', 'Goa', 'Calangute / Baga',
  'Calangute / Baga, Goa, India', 15.5439, 73.7553, 'Calangute is a town in the North Goa district of the Indian state of Goa. It is famous for its beach, the largest in North Goa and a popular tourist destination. The peak tourist season is during Christmas and New Year, and during the summer in May.',
  '["Engage only in government registered watersports operators (parasailing, jet-skiing)","Red warning flags indicate dangerous swimming conditions"]'::jsonb, 0, 'free public beach', 'Beach open 24 hours · Watersports 9:00 AM - 5:30 PM', 'November to March',
  ARRAY['Queen of Beaches','Beach Shacks','Parasailing','Baga Creek'], 'Q3181412', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/81/Sunset_at_Calangute.jpg/3840px-Sunset_at_Calangute.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4000, 3000, 'dbef9b6e6ca123aaf95756c61998b68bb2434a3187e5767c88fc80664aa036d7', true, true
FROM public.places WHERE slug = 'calangute-baga-beach-goa'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'diu-fort-arabian-sea', 'Diu Fort & Naida Caves', 'attraction', 'Heritage Fort', 'Dadra and Nagar Haveli and Daman and Diu', 'Diu',
  'Diu, Dadra and Nagar Haveli and Daman and Diu, India', 20.7139, 70.9972, 'The Diu Fortress is a Portuguese-built fortification located on the west coast of India in Diu. The fortress was built as part of Portuguese India''s defensive fortifications at the eastern tip of the island of Diu during the 16th century. The fortress, which borders on the town of Diu, was built in 1535 subsequent to a defense alliance forged by Bahadur Shah, the Sultan of Gujarat and the Portuguese when Humayun, the Mughal Emperor attempted to annex this territory. It was strengthened over the years, till 1546. The Portuguese ruled over this territory from 1537 until the Indian invasion of December 1961. Today it is a landmark of Diu and one of the Seven Wonders of Portuguese Origin in the World.',
  '["Walk along the sea-facing ramparts lined with historic bronze cannons","Explore the adjacent mystical labyrinthine Naida limestone caves"]'::jsonb, 0, 'free fort access', '8:00 AM - 6:00 PM daily', 'October to April',
  ARRAY['Portuguese Coastal Citadel','Sea Ramparts','Lighthouse View','Naida Caves'], 'Q5283624', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/1/17/Diu%2CGujarat%2CIndia_%2837%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  800, 1200, '72ba69f25377bf911a1b94049d18585446dd0b772b8bcca5d06a69fc48548b8e', true, false
FROM public.places WHERE slug = 'diu-fort-arabian-sea'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'konark-sun-temple-odisha', 'Konark Sun Temple (Black Pagoda)', 'attraction', 'Heritage Monument', 'Odisha', 'Konark (Puri)',
  'Konark (Puri), Odisha, India', 19.8876, 86.0945, 'Konark Sun Temple is a 13th-century CE Hindu Sun temple at Konark about 35 kilometres (22 mi) northeast from Puri city on the coastline in Puri district, Odisha, India. The temple is attributed to king Narasingha Deva I of the Eastern Ganga dynasty about 1250 CE. Dedicated to the Hindu Sun-god Surya, it reflects the pinnacle of Kalingan architecture and artistic excellence, what remains of the temple complex has the appearance of a 30-metre (100 ft) high chariot with immense wheels and horses, all carved from stone. Once over 61 metres (200 ft) high, much of the temple is now in ruins, in particular the large shikara tower over the sanctuary; at one time this rose much higher than the mandapa that remains. The structures and elements that have survived are famed for their intricate artwork, iconography, and themes, including erotic kama and mithuna scenes. Also called the Surya Devalaya, it is a classic illustration of the Odisha style of Architecture or Kalinga architecture.',
  '["Famous carved stone sundial wheels tell time accurately to the minute using shadow alignment","Do not touch or climb the carved Chlorite stone chariot wheels"]'::jsonb, 40, 'per person', '6:00 AM - 8:00 PM daily (Evening Light & Sound Show at 6:30 PM & 7:30 PM)', 'October to March (Konark Dance Festival in December)',
  ARRAY['UNESCO World Heritage','Chariot of the Sun God','24 Carved Sundial Wheels','Kalinga Architecture'], 'Q219965', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/4/47/Konarka_Temple.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2048, 1366, '6e7a2336ffafe00835f00c9a2760cae3361f455b7b04238b8e9721f04f876e63', true, true
FROM public.places WHERE slug = 'konark-sun-temple-odisha'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'jagannath-temple-puri', 'Shree Jagannath Temple Puri', 'attraction', 'Spiritual', 'Odisha', 'Puri',
  'Puri, Odisha, India', 19.8047, 85.8178, 'The Jagannath Temple is a Hindu temple dedicated to Jagannath, a form of Vishnu. It is located in Puri, Odisha, on the eastern coast of India. As per temple records, King Indradyumna of Avanti built the main temple. The present temple complex was rebuilt from the eleventh century onwards on the site of the earlier shrines, excluding the main Jagannath temple, and was begun by Anantavarman Chodaganga, the first ruler of the Eastern Ganga dynasty. Many of the temple rituals are based on Shabari Tantras which are evolved from tribal beliefs respectively. The local legends link the idols with Nilamadhaba deva worshipped by tribala and the daitapatis (servitors) claim to be descendants of the tribes. The temple is one of the 108 Abhimana Kshethram of the Sri Vaishnavite tradition.',
  '["Only practicing Hindus permitted inside inner temple precinct per ancient temple tradition","Electronic items, cameras, and leather items strictly prohibited at Singhadwara entrance"]'::jsonb, 0, 'free darshan', '5:30 AM - 10:00 PM daily (Mahaprasad distributed at Ananda Bazar from 1:00 PM)', 'October to March (world-famous Ratha Yatra in June/July)',
  ARRAY['Char Dham Pilgrimage','Ratha Yatra Chariot Festival','Mahaprasad 56 Bhog','Neelachakra Flag Mystery'], 'Q844111', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Shri_Jagannath_temple.jpg/3840px-Shri_Jagannath_temple.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  6000, 3789, '8d871d7b6040d5c6c2a6bb09cc31189c99f7a15d4be0175a17cc43c110128cd1', true, false
FROM public.places WHERE slug = 'jagannath-temple-puri'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'chilika-lake-irrawaddy-dolphins', 'Chilika Lake & Irrawaddy Dolphins (Satapada)', 'attraction', 'Nature & Lagoon', 'Odisha', 'Satapada (Puri / Khordha)',
  'Satapada (Puri / Khordha), Odisha, India', 19.6739, 85.4744, 'Chilika Lake is the largest brackish water lagoon with estuarine characteristics along the east coast of Indian sub-continent in Asia and second largest coastal lagoon in the world, its area ranges from about 900 to 11,165 sq km during summers and monsoon respectively. It is spread over the Puri, Khordha and Ganjam districts of Odisha state on the east coast of India, at the mouth of the Daya River, flowing into the Bay of Bengal.',
  '["Book official OTDC boat counters at Satapada or Barkul jetty","Maintain quiet when boat approaches dolphin sighting waters; life-jackets mandatory"]'::jsonb, 1200, 'OTDC motorboat safari per boat (seats up to 6 persons)', '6:00 AM - 5:00 PM daily (Boating halts at sunset)', 'November to February (over a million migratory birds from Siberia and Caspian Sea)',
  ARRAY['Asia Largest Brackish Lagoon','Irrawaddy Dolphins','Ramsar Wetland Site','Nalbana Bird Sanctuary'], 'Q843802', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/9/94/Birds_eyeview_of_Chilika_Lake.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1200, 675, '40ffd60d62edb02cc5bc48948d839446f556ab07585a8c96f783182d3f65bd64', true, true
FROM public.places WHERE slug = 'chilika-lake-irrawaddy-dolphins'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'lingaraj-temple-bhubaneswar', 'Lingaraj Temple Bhubaneswar', 'attraction', 'Heritage Temple', 'Odisha', 'Bhubaneswar',
  'Bhubaneswar, Odisha, India', 20.2383, 85.8336, 'Lingaraja Temple is a Hindu temple dedicated to Shiva and is one of the oldest temples in Bhubaneswar, the capital of the Indian state of Odisha, India. The temple is the most prominent landmark of Bhubaneswar city and one of the major tourist attractions of the state. Shiva''s consort and the temple''s presiding Goddess, Parvati, is referred to as Annapurna or Girija.',
  '["Only Hindus permitted inside sanctum; a raised viewing platform outside northern boundary wall provides panoramic view for international visitors","No leather items or phones"]'::jsonb, 0, 'free darshan', '6:00 AM - 9:00 PM daily', 'October to March (Shivaratri festival celebration)',
  ARRAY['Temple City of India','Kalinga Architectural Pinnacle','Bindu Sagar Lake','Harihara Deity'], 'Q1826725', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Lingaraj_Temple_%2C_Bhubaneswar.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3456, 4608, '92072d2514f116ea444c68e67c3832a61f84c7dfbe4183565a109e1cbf50b5a2', true, true
FROM public.places WHERE slug = 'lingaraj-temple-bhubaneswar'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'dhauli-shanti-stupa', 'Dhauli Giri Shanti Stupa & Ashokan Edicts', 'attraction', 'Peace Monument & Heritage', 'Odisha', 'Bhubaneswar (Dhauli)',
  'Bhubaneswar (Dhauli), Odisha, India', 20.1925, 85.8394, 'Dhauli or Dhauligiri is a hill located on the banks of the river Daya, 8 km south of Bhubaneswar in Odisha, India.',
  '["Respect the solemn heritage of the Kalinga War battlefield where Emperor Ashoka embraced Buddhism","Examine the 3rd-century BCE Rock Edict with sculpted rock elephant"]'::jsonb, 0, 'free peace pagoda access', '6:00 AM - 7:00 PM daily · Light & Sound show at 7:00 PM', 'October to March',
  ARRAY['White Peace Pagoda','Emperor Ashoka Transformation','Kalinga War Site','Daya River'], 'Q3520110', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/b/bd/ShantiSthupa_Dhauli.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1200, 675, '5d79d3879a371ba13081813f2c9820f44d51532e4c56207dbae9cd2e8a63e6cc', true, true
FROM public.places WHERE slug = 'dhauli-shanti-stupa'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'victoria-memorial-kolkata', 'Victoria Memorial Hall & Maidan', 'attraction', 'Heritage Monument', 'West Bengal', 'Kolkata',
  'Kolkata, West Bengal, India', 22.5448, 88.3426, 'The Victoria Memorial is a large marble monument in the Maidan in Central Kolkata (Calcutta), having its entrance on the Queen''s Way. It was built between 1906 and 1921 by the British Raj. It is dedicated to the memory of Queen Victoria, the Empress of India from 1876 to 1901.
The work of construction was entrusted to Martin & Co. of Calcutta founded by Rajendranath Mukherjee and Thomas Acquin Martin, and work on the superstructure began in 1910.
It is the largest monument to a monarch anywhere in the world. It stands at 26 hectares of gardens and is now a museum under the control of the Ministry of Culture, Government of India. Possessing prominent features of the Indo-Saracenic architecture, it has evolved into one of the most popular attractions in the city.',
  '["Closed every Monday and national holidays","Do not litter on the manicured 64-acre garden grounds"]'::jsonb, 50, 'museum and garden entry per person', 'Gardens: 5:30 AM - 6:00 PM daily · Museum galleries: 10:00 AM - 5:00 PM (Closed on Mondays)', 'October to March (pleasant winter afternoon strolls)',
  ARRAY['Indo-Saracenic White Makrana Marble','City of Joy Icon','Angel of Victory','Kolkata Maidan'], 'Q1140027', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Victoria_Memorial_situated_in_Kolkata.jpg/3840px-Victoria_Memorial_situated_in_Kolkata.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  12725, 5694, '98f9c5d2ad65cdf67ac18d4100c11c01255748908be453e44926a5987c3f3e97', true, true
FROM public.places WHERE slug = 'victoria-memorial-kolkata'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'darjeeling-himalayan-railway', 'Darjeeling Himalayan Railway (Toy Train) & Tiger Hill', 'attraction', 'Heritage Railway & Mountains', 'West Bengal', 'Darjeeling',
  'Darjeeling, West Bengal, India', 27.036, 88.2627, 'The Darjeeling Himalayan Railway, also known as the DHR, is a 610 mm gauge railway that runs between New Jalpaiguri and Darjeeling in the Indian state of West Bengal. Built between 1879 and 1881, it is about 88 km (55 mi) long. It climbs from about 100 m (330 ft) above sea level at New Jalpaiguri to about 2,200 m (7,200 ft) at Darjeeling, using six zig zags and three loops to gain altitude. Ghum station is situated at an altitude of 2,260 metres (7,410 ft). Six diesel locomotives handle most of the scheduled service, with daily tourist trains from Darjeeling to Ghum – India''s highest railway station – and the steam-hauled Red Panda service from Darjeeling to Kurseong. Steam-enthusiast specials are hauled by vintage British-built B-Class steam locomotives. The railway''s headquarters are at Kurseong.',
  '["Book heritage steam locomotive joy rides weeks in advance on IRCTC","Ghum is India highest railway station at 7,407 ft"]'::jsonb, 1000, 'steam engine joy ride roundtrip to Ghum (first class)', 'Joy rides operate daily 9:00 AM - 4:30 PM · Tiger Hill sunrise 4:00 AM departure', 'October to December and March to May (breathtaking Kanchenjunga sunrise views)',
  ARRAY['UNESCO World Heritage','Narrow Gauge Steam Train','Batasia Loop','Kanchenjunga Panorama'], 'Q378775', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Ministry_of_Railways_India.svg/1280px-Ministry_of_Railways_India.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  975, 479, '34821fdbb94db5d28d9d8d1db38d99209b6dde2e86920183cf19e3797b9bf5df', true, false
FROM public.places WHERE slug = 'darjeeling-himalayan-railway'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'sundarbans-national-park-bengal', 'Sundarbans Mangrove Tiger Reserve', 'attraction', 'Wildlife & Mangroves', 'West Bengal', 'Canning / Gosaba (South 24 Parganas)',
  'Canning / Gosaba (South 24 Parganas), West Bengal, India', 21.9497, 88.8997, 'Sundarbans National Park is a national park in West Bengal, India, and core part of tiger reserve and biosphere reserve. It is part of the Sundarbans on the Ganges Delta and adjacent to the Sundarban Reserve Forest in Bangladesh. It is located to south-west of Bangladesh. The delta is densely covered by mangrove forests, and is one of the largest reserves for the Bengal tiger. It is also home to a variety of bird, reptile and invertebrate species, including the salt-water crocodile. The present Sundarban National Park was declared as the core area of Sundarban Tiger Reserve in 1973 and a wildlife sanctuary in 1977. On 4 May 1984 it was declared a national park. It is a UNESCO World Heritage Site inscribed in 1987, and it has been designated as a Ramsar site since 2019. It is considered as a World Network of Biosphere Reserve from 10 November 2001.',
  '["Authorized forest boat safari with certified guide mandatory","Never disembark onto mudflats due to wild tigers and quicksand"]'::jsonb, 100, 'forest permit entry fee per Indian national', 'Boat safaris operate 7:00 AM - 5:00 PM (no boat allowed inside core delta after dark)', 'November to February (pleasant boat cruises and basking estuarine crocodiles)',
  ARRAY['UNESCO World Heritage','World Largest Mangrove Delta','Royal Bengal Tiger','Estuarine Crocodiles'], 'Q1471718', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/2/23/Sundarban_Tiger.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1600, 1067, 'c979049c1ca5583428946548185ccee4f0541579a09f001b2a1564d0a8d60277', true, true
FROM public.places WHERE slug = 'sundarbans-national-park-bengal'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'howrah-bridge-kolkata', 'Howrah Bridge (Rabindra Setu)', 'attraction', 'Engineering & Landmark', 'West Bengal', 'Kolkata / Howrah',
  'Kolkata / Howrah, West Bengal, India', 22.5851, 88.3468, 'The Howrah Bridge is a balanced steel bridge over the Hooghly River in West Bengal, India. Commissioned in 1943, the bridge was originally named the New Howrah Bridge, because it replaced a pontoon bridge at the same location linking both sides of Kolkata. Burrabazar is connected with Howrah rail terminal because of this bridge. On 14 June 1965, it was renamed Rabindra Setu after the Bengali poet Rabindranath Tagore, who was the first Indian and Asian Nobel laureate. It is still popularly known as the Howrah Bridge.',
  '["Photography of defense and security posts on bridge piers restricted","Vibrant wholesale flower market located right under the eastern bridge span"]'::jsonb, 0, 'free bridge pedestrian walkway', 'Open 24 hours daily · Walk across along pedestrian sidewalks', 'Early morning during the Mullick Ghat flower market or evening illuminated',
  ARRAY['Balanced Cantilever Wonder','Hooghly River','No Nuts & Bolts (Riveted Steel)','Lifeline of Kolkata'], 'Q235884', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Howrah_bridge_at_night.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1400, 556, '913d0d7b37cd099bac03a5ed40d3dcd6eea95ba0c31fac7ea45f53d4282328a1', true, true
FROM public.places WHERE slug = 'howrah-bridge-kolkata'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'dakshineswar-kali-temple', 'Dakshineswar Kali Temple & Belur Math', 'attraction', 'Spiritual', 'West Bengal', 'Kolkata (Dakshineswar)',
  'Kolkata (Dakshineswar), West Bengal, India', 22.655, 88.3575, 'Dakshineswar Kali Temple is a Hindu navaratna style temple in Dakshineswar, Kolkata, West Bengal, India, on the eastern bank of the Hooghly River. The presiding deity of the temple is Bhavatarini (Kali), a form of Mahadevi or Parashakti Adya Kali, otherwise known as Adishakti Kalika. The temple was built in 1855 by Rani Rashmoni, a zamindar, and a devotee of Kali. The temple is associated with Ramakrishna and Sarada Devi, his wife and devotee mystic, both of 19th century Bengal.',
  '["Take the scenic ferry boat across the Hooghly river from Dakshineswar directly to Belur Math (Ramakrishna Mission HQ)","Remove footwear at ghat entrance"]'::jsonb, 0, 'free temple darshan', '6:00 AM - 12:30 PM, 3:30 PM - 8:30 PM daily', 'October to March (Kali Puja celebration in autumn)',
  ARRAY['Bhavatarini Kali Shrine','Ramakrishna Paramahamsa','Nava-ratna Nine-spire Architecture','Hooghly Riverfront'], 'Q844111', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/3/32/Dakhineshwar_Temple_beside_the_Hoogly%2C_West_Bengal.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3072, 2304, '2f2584db293fe08b153b544d010e08bf376ca7c7220fa3a5bee3f5a77eb65bfd', true, false
FROM public.places WHERE slug = 'dakshineswar-kali-temple'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'mahabodhi-temple-bodh-gaya', 'Mahabodhi Temple & Bodhi Tree', 'attraction', 'Spiritual', 'Bihar', 'Bodh Gaya',
  'Bodh Gaya, Bihar, India', 24.696, 84.9914, 'The Mahabodhi Temple or the Mahābodhi Mahāvihāra, is a restored Buddhist temple in Bodh Gaya, Bihar, India, marking the location where the Buddha is said to have attained enlightenment, according to the Buddhist faith. A UNESCO World Heritage Site, the site contains a tree believed to be a descendant of the Bodhi Tree under which the Buddha gained enlightenment and which has been a major pilgrimage destination of Buddhists for over two thousand years. The Mahabodhi Temple at Bodh Gaya is the holiest and most revered pilgrimage site for Buddhists worldwide.',
  '["Mobile phones must be deposited at free security lockers outside main entrance gate","Meditators welcome in sacred Bodhi Tree garden courtyard"]'::jsonb, 0, 'free temple entry (Camera permit ₹100)', '5:00 AM - 9:00 PM daily', 'November to February (peaceful winter meditation)',
  ARRAY['UNESCO World Heritage','Enlightenment of the Buddha','Sacred Bodhi Tree','Vajrasana Diamond Throne'], 'Q207865', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Mahabodhitemple.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1944, 2592, '481852560bad4e8484545af57509f9896e2fb8eddd7e95d0a1e4962a90b49958', true, true
FROM public.places WHERE slug = 'mahabodhi-temple-bodh-gaya'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'nalanda-university-ruins', 'Nalanda Mahavihara (Ancient University Ruins)', 'attraction', 'Heritage Monument', 'Bihar', 'Nalanda (Rajgir)',
  'Nalanda (Rajgir), Bihar, India', 25.1357, 85.4451, 'Nalanda was a renowned Buddhist mahavihara in medieval Magadha, eastern India. Widely considered to be among the greatest centres of learning in the ancient world and often referred to as "the world''s first residential university", it was located near the city of Rajagriha, roughly 90 kilometres (56 mi) southeast of Pataliputra. Operating for almost a thousand years from 427 CE until around 1400 CE, Nalanda mahavihara played a vital role in promoting the patronage of arts, culture and academics during the 5th and 6th century CE, a period that has since been described as the "Golden Age of India" by scholars. The characterisation of Nalanda as a "university" in the modern sense has been challenged by scholars. They argue that while it was undoubtedly a major centre of learning, comparing it directly to a modern university is historically imprecise.',
  '["Stay on paved brick pathways to avoid damaging ancient excavated walls","Visit the Archaeological Museum directly opposite for preserved bronze sculptures"]'::jsonb, 40, 'per person', '9:00 AM - 5:00 PM daily · Archaeological Museum closed Fridays', 'October to March',
  ARRAY['UNESCO World Heritage','Ancient Monastic University','5th Century CE','Sariputra Stupa'], 'Q191484', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Temple_No.-_3%2C_Nalanda_Archaeological_Site.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2894, 1827, 'e266f5d3bf7231c10f03a51643c842511f2394309337ec4a9f1e31cfa91f9d72', true, true
FROM public.places WHERE slug = 'nalanda-university-ruins'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'rajgir-glass-bridge-ropeway', 'Rajgir Glass Skywalk & Vishwa Shanti Stupa', 'attraction', 'Adventure & Peace Pagoda', 'Bihar', 'Rajgir (Nalanda)',
  'Rajgir (Nalanda), Bihar, India', 25.013, 85.419, 'Rajgir is an ancient city and university town in the Nalanda district of Bihar, India. It is also considered a cultural capital of Magadh. It was the capital of the Haryanka dynasty, the Pradyota dynasty, the Brihadratha dynasty, the Maurya Empire, and it was the retreat center for the Buddha and his sangha. Other historical figures such as Mahavira and king Bimbisara lived there, and due to its religious significance, the city holds a place of prominence in Buddhist, Jain and Hindu scriptures.',
  '["Shoe covers provided for walking across the transparent glass bridge cantilevered over the gorge","Pre-book online tickets on Bihar Tourism Nature Safari portal"]'::jsonb, 150, 'Glass Bridge ticket (Chairlift Ropeway ₹100)', '9:00 AM - 5:00 PM (Nature Safari closed on Mondays)', 'October to March',
  ARRAY['Glass Skywalk Bridge','Single-seater Chairlift','Gridhakuta Vulture Peak','Peace Pagoda'], 'Q3520110', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Shanti_Stupa_at_Rajgir_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2620, 1952, '8542f5f314d4fc27e4cf06e1896d678add0eec70be34c975a4b1f4fa37d1b61a', true, true
FROM public.places WHERE slug = 'rajgir-glass-bridge-ropeway'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'sher-shah-suri-tomb-sasaram', 'Tomb of Sher Shah Suri', 'attraction', 'Heritage Monument', 'Bihar', 'Sasaram (Rohtas)',
  'Sasaram (Rohtas), Bihar, India', 24.9536, 84.015, 'The Tomb of Sher Shah Suri is a mausoleum located in Sasaram, in the Indian state of Bihar. Sher Shah Suri, who was the founder of the Sur Empire, commissioned the tomb for himself. It was completed on 16 August 1545, about three months after his death.',
  '["Walk along the stone stepped bridge connecting lake shore to the island tomb","Preserve ancient Indo-Islamic stonework"]'::jsonb, 25, 'per person', '6:00 AM - 6:00 PM daily', 'October to March',
  ARRAY['Second Taj of India','Indo-Islamic Architecture','Grand Water Lake','Grand Trunk Road Builder'], 'Q807217', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Sher_Shah_Suri_Tomb.jpg/3840px-Sher_Shah_Suri_Tomb.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4608, 3072, '262e1ef365b5f5382508967bba97aa33169332bb26c5b1f62ce1df8b770ced94', true, false
FROM public.places WHERE slug = 'sher-shah-suri-tomb-sasaram'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'baidyanath-dham-deoghar', 'Baba Baidyanath Jyotirlinga Temple', 'attraction', 'Spiritual', 'Jharkhand', 'Deoghar',
  'Deoghar, Jharkhand, India', 24.4925, 86.7003, 'Baidyanath Temple is a Hindu temple dedicated to Shiva. It is located in Deoghar, in the Santhal Parganas division of the Indian state of Jharkhand. The temple complex comprises the central shrine of Baba Baidyanath along with 21 additional temples. It is significant to the Hindu sects of Shaivism as this temple is referred to as one of the twelve Jyotirlingas.',
  '["During Shravani Mela, saffron-clad Kanwariyas walk 105 km carrying holy Ganga water from Sultanganj","Dress modestly"]'::jsonb, 0, 'free general darshan (Shighra Darshan pass ₹500)', '4:00 AM - 3:30 PM, 6:00 PM - 9:00 PM daily', 'October to March (Shravani Mela Kanwar Yatra in July/August draws millions)',
  ARRAY['12 Sacred Jyotirlingas','Shakti Peeth Confluence','Panchshool Trident','Baidyanath Dham'], 'Q844111', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Baidyanath_temple_and_temple_complex%2C_Deoghar_04.jpg/3840px-Baidyanath_temple_and_temple_complex%2C_Deoghar_04.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4080, 3060, '65651de40e539c38dabd41d13806b5603c2ceef4edfdeaa6676fea08177b377f', true, false
FROM public.places WHERE slug = 'baidyanath-dham-deoghar'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'hundru-falls-ranchi', 'Hundru Falls & Subarnarekha River', 'attraction', 'Nature & Waterfall', 'Jharkhand', 'Ranchi',
  'Ranchi, Jharkhand, India', 23.45, 85.65, 'Hundru Falls is a waterfall located in Ranchi District in the Indian state of Jharkhand. It is the 34th highest waterfall in India, and one of the most famous tourist places in the region.',
  '["Steep descent of 750 concrete steps down to the river pool","Swimming near water plunge is hazardous due to rocky undercurrents"]'::jsonb, 20, 'per person', '6:00 AM - 5:00 PM daily', 'October to February (picturesque picnic season following monsoon)',
  ARRAY['Subarnarekha River','City of Waterfalls','Chota Nagpur Plateau','Scenic Picnic'], 'Q1263721', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Hundru_Falls%2C_Jharkhand%2C_India_4.jpg/3840px-Hundru_Falls%2C_Jharkhand%2C_India_4.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4000, 3000, '1c39202fc32a0993bccca8ffb15e77833235f76a3d6c65467d0ff841b5f19800', true, true
FROM public.places WHERE slug = 'hundru-falls-ranchi'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'betla-national-park-palamu', 'Betla National Park & Palamu Forts', 'attraction', 'Wildlife & Forts', 'Jharkhand', 'Palamu / Latehar',
  'Palamu / Latehar, Jharkhand, India', 23.8692, 84.1906, 'Betla National Park is a national park located in the Latehar and Palamu district of Jharkhand, India. Its the only national park in the state. It is spread over an area of 226.32 km2 (87.38 sq mi) and is a part of the Palamu Tiger Reserve. It was declared a national park in 1986. The park hosts a wide variety of wildlife.',
  '["Jeep and elephant safaris available at morning and evening timings","Visit the ancient 16th-century Chero dynasty twin forts deep in the forest"]'::jsonb, 100, 'entry fee per Indian national', '6:00 AM - 10:00 AM, 2:00 PM - 5:00 PM (Closed during monsoon from July to September)', 'November to March',
  ARRAY['Project Tiger Pioneer (1973)','Wild Elephants','Chero Dynasty Forts','Sal and Bamboo Forests'], 'Q1471718', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/Entrance_of_Betla_national_park.jpg/3840px-Entrance_of_Betla_national_park.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  5184, 3456, '7d72310b6d3b9201f30d710edead80cc99eea86011deb8caefcf20b2af7a732c', true, true
FROM public.places WHERE slug = 'betla-national-park-palamu'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'cellular-jail-port-blair', 'Cellular Jail National Memorial (Kala Pani)', 'attraction', 'Historical Memorial', 'Andaman and Nicobar Islands', 'Port Blair',
  'Port Blair, Andaman and Nicobar Islands, India', 11.6738, 92.7481, 'The Cellular Jail, also known as ''Kālā Pānī'', is a former British colonial prison in the Andaman and Nicobar Islands. The prison was used by the colonial government of India for the purpose of exiling insurgents and political prisoners. Many notable independence activists were imprisoned there during the struggle for India''s independence. Today, the complex serves as a national memorial monument.',
  '["Closed every Monday","Attend the stirring Light & Sound show narrated from the perspective of the ancient Peepal tree"]'::jsonb, 30, 'museum entry (Light & Sound show ₹150)', '9:00 AM - 12:30 PM, 1:30 PM - 4:45 PM (Closed on Mondays · Light & Sound show at 6:00 PM & 7:15 PM)', 'October to April',
  ARRAY['National Memorial','Kala Pani','Freedom Fighters','Swatantryaveer Savarkar Cell'], 'Q1053018', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Front_View_of_Cellular_Jail%2C_Port_Blair.JPG/3840px-Front_View_of_Cellular_Jail%2C_Port_Blair.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3872, 2592, '863f918d15c90305358bfe6089e0aa926b7bc62c337c2bf7ce516b1b3c663b36', true, true
FROM public.places WHERE slug = 'cellular-jail-port-blair'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'radhanagar-beach-havelock', 'Radhanagar Beach (Beach No. 7)', 'attraction', 'Coastal & Beach', 'Andaman and Nicobar Islands', 'Swaraj Dweep (Havelock Island)',
  'Swaraj Dweep (Havelock Island), Andaman and Nicobar Islands, India', 11.9844, 92.9547, 'Havelock Island, officially known as Swaraj Dweep, is one of the largest islands in Ritchie''s Archipelago, to the east of Great Andaman within the Andaman Islands of India. It belongs to the South Andaman administrative district, part of the Indian union territory of Andaman and Nicobar Islands. The island is 41 km (25 mi) northeast of the capital city, Port Blair.',
  '["Voted Asia Best Beach (Time Magazine): keep sands pristine and plastic-free","Swimming after dark is prohibited for safety"]'::jsonb, 0, 'free public beach', 'Sunrise to Sunset daily (lifeguards on duty until 5:30 PM)', 'October to May (crystal clear water and breathtaking sunset)',
  ARRAY['Asia Best Beach','Blue Flag Beach','Powder White Sand','Turquoise Waters'], 'Q3181412', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Havelock%2C_Andaman_%26_Nicobar_Islands.JPG/3840px-Havelock%2C_Andaman_%26_Nicobar_Islands.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4000, 3000, '34777404d47f54c4a3bcdb792310333cc0604e8e838fbb8a1a2aafcd01a2837c', true, false
FROM public.places WHERE slug = 'radhanagar-beach-havelock'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'ross-island-port-blair', 'Netaji Subhash Chandra Bose Dweep (Ross Island)', 'attraction', 'Heritage Island & Nature', 'Andaman and Nicobar Islands', 'Port Blair (Water Sports Complex Jetty)',
  'Port Blair (Water Sports Complex Jetty), Andaman and Nicobar Islands, India', 11.6719, 92.7639, 'Netaji Subhash Chandra Bose Dweep (Ross Island) is a renowned heritage island & nature in Port Blair (Water Sports Complex Jetty), Andaman and Nicobar Islands.',
  '["Friendly spotted deer and peacocks roam freely; do not feed wildlife","Take the 15-minute boat ride from Aberdeen jetty"]'::jsonb, 50, 'entry fee (Speedboat ferry roundtrip ₹350)', '8:30 AM - 5:00 PM (Closed on Wednesdays)', 'October to April',
  ARRAY['Colonial Paris of the East','Banyan Tree Roots Ruins','Spotted Deer','Japanese Bunkers'], 'Q3520110', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDgwMCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBkYXRhLXBsYWNlLWlkPSJyb3NzLWlzbGFuZC1wb3J0LWJsYWlyIj4KICA8dGl0bGU+TmV0YWppIFN1Ymhhc2ggQ2hhbmRyYSBCb3NlIER3ZWVwIChSb3NzIElzbGFuZCksIFBvcnQgQmxhaXIgKFdhdGVyIFNwb3J0cyBDb21wbGV4IEpldHR5KSwgQW5kYW1hbiBhbmQgTmljb2JhciBJc2xhbmRzPC90aXRsZT4KICA8ZGVzYyBpZD0iZXhwbG9yZXgtcHJvbXB0Ij5taW5pbWFsIGZsYXQgaWxsdXN0cmF0aW9uIG9mIE5ldGFqaSBTdWJoYXNoIENoYW5kcmEgQm9zZSBEd2VlcCAoUm9zcyBJc2xhbmQpLCBQb3J0IEJsYWlyIChXYXRlciBTcG9ydHMgQ29tcGxleCBKZXR0eSksIEFuZGFtYW4gYW5kIE5pY29iYXIgSXNsYW5kcywgaGF1bnRpbmcgY29sb25pYWwgQnJpdGlzaCBydWlucyB3aXRoIGNodXJjaCBhbmQgYmFsbHJvb20gb3Zlcmdyb3duIGFuZCB3cmFwcGVkIGluIGdpYW50IGNyZWVwaW5nIGJhbnlhbiB0cmVlIHJvb3RzIGJlc2lkZSBjb3JhbCBzZWFzLCBubyB0ZXh0LCBubyBwZW9wbGU8L2Rlc2M+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnR3JhZF9yb3NzLWlzbGFuZC1wb3J0LWJsYWlyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzBGMjkxRSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxNjRFMzciLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdvbGRHcmFkX3Jvc3MtaXNsYW5kLXBvcnQtYmxhaXIiIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIwJSIgeTI9IjAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzEwQjk4MSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM2RUU3QjciLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InN1bkdsb3dfcm9zcy1pc2xhbmQtcG9ydC1ibGFpciIgY3g9IjUwJSIgY3k9IjM1JSIgcj0iNDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzEwQjk4MSIgc3RvcC1vcGFjaXR5PSIwLjI1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzBGMjkxRSIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogIDwvZGVmcz4KCiAgPCEtLSBTa3kgJiBBdG1vc3BoZXJlIC0tPgogIDxyZWN0IHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjgwMCIgZmlsbD0idXJsKCNiZ0dyYWRfcm9zcy1pc2xhbmQtcG9ydC1ibGFpcikiLz4KICA8Y2lyY2xlIGN4PSI2MDAiIGN5PSIzMjAiIHI9IjI4MCIgZmlsbD0idXJsKCNzdW5HbG93X3Jvc3MtaXNsYW5kLXBvcnQtYmxhaXIpIi8+CgogIDwhLS0gR2VvbWV0cmljIE1vdW50YWluIC8gQXJjaGl0ZWN0dXJhbCBCYWNrZHJvcCBMYXllcnMgLS0+CiAgPHBhdGggZD0iTTAsODAwIEwwLDYyMCBRMzAwLDUyMCA2MDAsNTYwIFQxMjAwLDYwMCBMMTIwMCw4MDAgWiIgZmlsbD0icmdiYSgxNiwgMTg1LCAxMjksIDAuMTUpIi8+CiAgPHBhdGggZD0iTTAsODAwIEwwLDY4MCBRNDAwLDYwMCA4MDAsNjQwIFQxMjAwLDY2MCBMMTIwMCw4MDAgWiIgZmlsbD0icmdiYSgwLDAsMCwwLjIpIi8+CgogIDwhLS0gU3R5bGl6ZWQgTGFuZG1hcmsgU2lsaG91ZXR0ZXMgLS0+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjAwLCA1MjApIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4KICAgIDwhLS0gQ2VudGVyIERvbWUgLyBTcGlyZSBNb3RpZiAtLT4KICAgIDxwYXRoIGQ9Ik0gLTkwLDAgUSAtOTAsLTE2MCAwLC0yMTAgUSA5MCwtMTYwIDkwLDAgWiIgZmlsbD0idXJsKCNnb2xkR3JhZF9yb3NzLWlzbGFuZC1wb3J0LWJsYWlyKSIgb3BhY2l0eT0iMC45Ii8+CiAgICA8IS0tIEZsYW5raW5nIE1pbmFyZXRzIC8gUGlsbGFycyAtLT4KICAgIDxyZWN0IHg9Ii0xNzAiIHk9Ii0xODAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxODAiIHJ4PSI0IiBmaWxsPSJ1cmwoI2dvbGRHcmFkX3Jvc3MtaXNsYW5kLXBvcnQtYmxhaXIpIiBvcGFjaXR5PSIwLjg1Ii8+CiAgICA8Y2lyY2xlIGN4PSItMTYyIiBjeT0iLTE5MCIgcj0iMTQiIGZpbGw9IiM2RUU3QjciLz4KICAgIDxyZWN0IHg9IjE1NCIgeT0iLTE4MCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE4MCIgcng9IjQiIGZpbGw9InVybCgjZ29sZEdyYWRfcm9zcy1pc2xhbmQtcG9ydC1ibGFpcikiIG9wYWNpdHk9IjAuODUiLz4KICAgIDxjaXJjbGUgY3g9IjE2MiIgY3k9Ii0xOTAiIHI9IjE0IiBmaWxsPSIjNkVFN0I3Ii8+CiAgICA8IS0tIEFyY2hlZCBQb3J0YWwgLS0+CiAgICA8cGF0aCBkPSJNIC00MCwwIEwgLTQwLC05MCBRIDAsLTEzMCA0MCwtOTAgTCA0MCwwIFoiIGZpbGw9IiMwRjI5MUUiLz4KICA8L2c+CgogIDwhLS0gR3JvdW5kIFBsYW5lIC8gV2F0ZXIgUmVmbGVjdGlvbiAtLT4KICA8cmVjdCB5PSI3MDAiIHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0icmdiYSgwLDAsMCwwLjM1KSIvPgogIDxsaW5lIHgxPSIxMDAiIHkxPSI3MjAiIHgyPSIxMTAwIiB5Mj0iNzIwIiBzdHJva2U9IiMxMEI5ODEiIHN0cm9rZS1vcGFjaXR5PSIwLjMiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtZGFzaGFycmF5PSIxMiwxMiIvPgogIDxsaW5lIHgxPSIyNTAiIHkxPSI3NDUiIHgyPSI5NTAiIHkyPSI3NDUiIHN0cm9rZT0iIzEwQjk4MSIgc3Ryb2tlLW9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1kYXNoYXJyYXk9IjI0LDE4Ii8+CgogIDwhLS0gTGFuZG1hcmsgVGl0bGUgTGFiZWwgU3VidGV4dCBpbiBTVkcgLS0+CiAgPHRleHQgeD0iNjAwIiB5PSI3NTUiIGZvbnQtZmFtaWx5PSItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiM2RUU3QjciIG9wYWNpdHk9IjAuNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgbGV0dGVyLXNwYWNpbmc9IjIuNSI+TkVUQUpJIFNVQkhBU0ggQ0hBTkRSQSBCT1NFIERXRUVQIChST1NTIElTTEFORCkgwrcgUE9SVCBCTEFJUiAoV0FURVIgU1BPUlRTIENPTVBMRVggSkVUVFkpPC90ZXh0PgoKICA8IS0tIEJhZGdlIE1hcmtlciBpbiBib3R0b20gY29ybmVyIC0tPgogIDxyZWN0IHg9IjMwIiB5PSI3MzgiIHdpZHRoPSIxNjAiIGhlaWdodD0iMzQiIHJ4PSIxNyIgZmlsbD0icmdiYSgwLDAsMCwwLjYpIiBzdHJva2U9IiMxMEI5ODEiIHN0cm9rZS13aWR0aD0iMS4yIi8+CiAgPHRleHQgeD0iMTEwIiB5PSI3NjAiIGZvbnQtZmFtaWx5PSItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTMiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiM2RUU3QjciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGxldHRlci1zcGFjaW5nPSIxLjIiPklMTFVTVFJBVElPTjwvdGV4dD4KPC9zdmc+', 'ai_generated', 'Custom Vector Illustration (Creative Commons CC0)', 'Explorex AI Cultural Vector Illustration (Netaji Subhash Chandra Bose Dweep (Ross Island))',
  1200, 800, '198994c880334ebf20ede111e00aca6e0770ba4c4cf43094f1d157835aa79ab1', true, true
FROM public.places WHERE slug = 'ross-island-port-blair'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'khajuraho-monuments-mp', 'Khajuraho Group of Monuments (Kandariya Mahadeva)', 'attraction', 'Heritage Temple', 'Madhya Pradesh', 'Khajuraho (Chhatarpur)',
  'Khajuraho (Chhatarpur), Madhya Pradesh, India', 24.853, 79.9197, 'The Khajuraho Group of Monuments are a group of Hindu and Digambara Jain temples in Chhatarpur district, Madhya Pradesh, India. They are about 46 km from Chhatarpur city, the district headquarters, 283 km from Gwalior, 175 kilometres (109 mi) southeast of Jhansi, 10 kilometres (6.2 mi) from Khajwa and 9 kilometres (5.6 mi) from Rajnagar. The temples are famous for their Nagara-style architectural symbolism and a few erotic sculptures.',
  '["Ticket valid for all Western Group temples on date of issue","Hire certified ASI guides for detailed iconography explanation of 84 miniature spires"]'::jsonb, 40, 'Western Group temples entry per person', 'Sunrise to Sunset daily · Sound & Light show at 6:30 PM & 7:40 PM', 'October to March (Khajuraho Dance Festival in February)',
  ARRAY['UNESCO World Heritage','Nagara Temple Architecture','Chandela Dynasty','Sensuous Stone Carvings'], 'Q207865', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/e/e7/1_Khajuraho.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2435, 1700, 'f36b2888063c3aa0f5a8582ea89c771db7ea83dc78f19afd81bcf53cca07f202', true, true
FROM public.places WHERE slug = 'khajuraho-monuments-mp'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'sanchi-buddhist-stupa', 'Great Stupa at Sanchi (Ashokan Stupa 1)', 'attraction', 'Heritage Monument', 'Madhya Pradesh', 'Sanchi (Raisen)',
  'Sanchi (Raisen), Madhya Pradesh, India', 23.4813, 77.7408, 'Sanchi Stupa is a Buddhist complex, famous for its Great Stupa, on a hilltop at Sanchi Town in Raisen District of the State of Madhya Pradesh, India. It is located about 23 kilometres from Raisen town, the district headquarters and 46 kilometres (29 mi) northeast of Bhopal, capital of Madhya Pradesh.',
  '["Circumambulate the hemispherical stupa clockwise along the elevated stone balustrade","Examine the four ornamental Torana gateway narrative reliefs"]'::jsonb, 40, 'per person', '6:30 AM - 6:30 PM daily · Archaeological Museum closed Fridays', 'October to March',
  ARRAY['UNESCO World Heritage','Oldest Stone Structure in India','Emperor Ashoka (3rd C. BCE)','Torana Gateways'], 'Q180564', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/1/12/East_Gateway_-_Stupa_1_-_Sanchi_Hill_2013-02-21_4398.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2848, 4288, '39e73de9ee32dbc9b64e0054e2f7839222fca98900c34323570ae5f32f52ef5a', true, false
FROM public.places WHERE slug = 'sanchi-buddhist-stupa'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'gwalior-fort-man-mandir', 'Gwalior Fort & Man Mandir Palace', 'attraction', 'Heritage Fort', 'Madhya Pradesh', 'Gwalior',
  'Gwalior, Madhya Pradesh, India', 26.2308, 78.1694, 'The Fort of Gwalior or Gwalior Fort is a 6th-century hill fort in Gwalior, India. Mughal Emperor Babur described it as the "pearl amongst the fortresses of Hind and not even the winds could touch its masts" due to its grandeur and magnificence. It was nicknamed the "Gibraltar of India" for its impregnability and defensive structure. The fort dates back to the 5th century, perhaps earlier, making it one of the oldest defence forts in India. Ancient Sanskrit inscriptions record the name of the fort as "Gopgiri".',
  '["Described by Mughal Emperor Babur as the pearl among fortresses of Hind","Walk through the rock-cut Gopachal Parvat Jain colossi on the hillside ascent"]'::jsonb, 25, 'per person', '6:00 AM - 5:30 PM daily · Sound & Light show in Hindi & English at dusk', 'October to March',
  ARRAY['Gibraltar of India','Glazed Blue Ceramic Tiles','Tomar Rajput Fort','Teli ka Mandir'], 'Q844111', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Gwalior_Fort_front.jpg/3840px-Gwalior_Fort_front.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  6000, 4000, 'e3c26cdd5a9c48ae2fe97101e7526db49f357ab84c358ca58990aa8a128c1a8e', true, true
FROM public.places WHERE slug = 'gwalior-fort-man-mandir'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'kanha-national-park-tiger', 'Kanha Tiger Reserve (The Jungle Book)', 'attraction', 'Wildlife Sanctuary', 'Madhya Pradesh', 'Mandla / Balaghat',
  'Mandla / Balaghat, Madhya Pradesh, India', 22.3333, 80.6333, 'Kanha Tiger Reserve, also known as Kanha–Kisli National Park, is one of the tiger reserves of India and the largest national park of the state of Madhya Pradesh. It covers an area of 940 km2 (360 sq mi) in the two districts Mandla and Balaghat.
The park hosts Bengal tiger, Indian leopard, sloth bear, barasingha and dhole. It is also the first tiger reserve in India to officially introduce a mascot, Bhoorsingh the Barasingha.',
  '["Inspiration for Rudyard Kipling Jungle Book","Core zones: Kanha, Kisli, Mukki, Sarhi require advance online forest permits"]'::jsonb, 1550, 'jeep safari vehicle permit estimate', 'Morning safari: 6:00 AM - 11:00 AM · Afternoon safari: 3:00 PM - 6:00 PM (Closed July to mid-October)', 'November to May (March to May offers prime tiger sightings at waterholes)',
  ARRAY['Royal Bengal Tiger','Barasingha Swamp Deer Sanctuary','Sal Forest Meadows','Jungle Safari'], 'Q1471718', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Tiger_Kanha_National_Park.jpg/3840px-Tiger_Kanha_National_Park.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  5184, 3456, '5c8503cea2b5bdb633aa64111a504141b66feb7f4475f22792bada1e1258156d', true, true
FROM public.places WHERE slug = 'kanha-national-park-tiger'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'marble-rocks-bhedaghat-narmada', 'Bhedaghat Marble Rocks & Dhuandhar Falls', 'attraction', 'Natural Wonder', 'Madhya Pradesh', 'Jabalpur (Bhedaghat)',
  'Jabalpur (Bhedaghat), Madhya Pradesh, India', 23.1317, 79.8006, 'Bhedaghat is a town and a nagar panchayat in Jabalpur district in the state of Madhya Pradesh, India. It is situated by the side of river Narmada and is approximately 20 km from Jabalpur city. Bhedaghat is known for the high marble rocks making a valley through which river Narmada flows. The site is also home to Dhuandhar Falls, named for its smoky appearance as the water crashes down, creating a mist that looks like rising steam.',
  '["Boat boatmen recite rhythmic folk couplets describing rock shapes during the 3 km canyon voyage","Do not lean over boat sides; wear provided life-jackets"]'::jsonb, 100, 'shared boat ride on the Narmada gorge', '7:00 AM - 7:00 PM (Boating operational except during peak monsoon flood months · Full moon night boating is magical)', 'October to April (especially on full-moon nights when the white marble glow is ethereal)',
  ARRAY['Narmada River Gorge','100-foot Pure Marble Cliffs','Dhuandhar Smoke Falls','Full Moon Boating'], 'Q1263721', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/7/71/Bhedaghat_Jbp.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1600, 1067, '60aae2001a210764bc9214d7de5a547497a09ca67f12cd23313e8ce57c9161bb', true, true
FROM public.places WHERE slug = 'marble-rocks-bhedaghat-narmada'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'mahakaleshwar-jyotirlinga-ujjain', 'Shri Mahakaleshwar Temple & Mahakal Lok Corridor', 'attraction', 'Spiritual', 'Madhya Pradesh', 'Ujjain',
  'Ujjain, Madhya Pradesh, India', 23.1828, 75.7683, 'Mahakaleshwar Jyotirlinga is a Hindu temple dedicated to Shiva and is one of the twelve Jyotirlingas, shrines which are said to be the most sacred abodes of Shiva. It is located in the ancient city of Ujjain in the state of Madhya Pradesh, India. The temple is situated on the side of the holy river Shipra. The presiding deity, Shiva in the lingam form is believed to be Swayambhu, deriving currents of power (Shakti) from within itself as against the other images and lingams that are ritually established and invested with mantra-shakti.',
  '["Traditional dress mandatory for participating in Bhasma Aarti inner sanctum jalabhishek (men in unstitched dhoti, women in saree)","Explore the 900-meter carved Mahakal Lok corridor"]'::jsonb, 0, 'free general darshan (Bhasma Aarti pre-booking required)', '4:00 AM - 11:00 PM daily (Famous Bhasma Aarti at 4:00 AM requires advance online registration)', 'October to March (Simhastha Kumbh city)',
  ARRAY['South-facing Dakshinmukhi Jyotirlinga','Bhasma Aarti','Mahakal Lok','Holy Shipra River'], 'Q844111', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Mahakaleshwar_Temple%2C_Ujjain.jpg/3840px-Mahakaleshwar_Temple%2C_Ujjain.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4608, 2592, 'ed9ed4813b2699481d762d01a6861f64475392b0ed6615187404d6fbe915e539', true, false
FROM public.places WHERE slug = 'mahakaleshwar-jyotirlinga-ujjain'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'chitrakote-falls-bastar', 'Chitrakote Waterfalls (Niagara of India)', 'attraction', 'Nature & Waterfall', 'Chhattisgarh', 'Jagdalpur (Bastar)',
  'Jagdalpur (Bastar), Chhattisgarh, India', 19.2017, 81.7061, 'The Chitrakote Falls is a natural waterfall on the Indravati River, located approximately 38 kilometres (24 mi) to the west of Jagdalpur, in Bastar district in the Indian state of Chhattisgarh.',
  '["Widest waterfall in India (horseshoe shape)","Boating to the thunderous spray base available in wooden country boats with life-jackets"]'::jsonb, 0, 'free scenic viewing (Local boat ride to mist base ₹100)', 'Sunrise to Sunset daily (Floodlights illuminate the cascade at night)', 'July to October (monsoon peak where the waterfall spans nearly 1,000 feet wide)',
  ARRAY['Horseshoe Waterfall','Indravati River','Bastar Heartlands','Widest Falls in India'], 'Q1263721', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/9/91/Chitrakot_waterfalls.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2048, 1536, '721775ffee7c6f35594e84c83035592ce61efb4cf12d6030bbbaa17d3653f5d6', true, true
FROM public.places WHERE slug = 'chitrakote-falls-bastar'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'bhoramdeo-temple-kawardha', 'Bhoramdeo Temple (Khajuraho of Chhattisgarh)', 'attraction', 'Heritage Temple', 'Chhattisgarh', 'Kawardha (Kabirdham)',
  'Kawardha (Kabirdham), Chhattisgarh, India', 22.1189, 81.1611, 'Bhoramdeo Temple is a Hindu temple dedicated to the god Shiva in Bhoramdeo, in the Indian state of Chhattisgarh. It comprises a group of four temples of which the earliest is a brick-temple. The main temple is the Bhoramdeo temple built in stone. The architectural features with erotic sculptures has given a distinct style akin to the Khajuraho temple and the Konark Sun Temple in Odisha, and hence the Bhoramdeo complex is known by the sobriquet the "Khajuraho of Chhattisgarh".',
  '["Footwear removal required at stone plinth base","Admire the 11th-century Nagara style stone carvings of the Nagavanshi dynasty"]'::jsonb, 0, 'free entry', '6:00 AM - 6:00 PM daily', 'October to March (Bhoramdeo Mahotsav in spring)',
  ARRAY['Nagara Architecture','Nagavanshi Dynasty','Maikal Hills','Intricate Erotic Stone Sculptures'], 'Q379934', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Bhoramdeo_Temple%2C_Kawardha.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3072, 2304, '036abbde6cc7938fc08f6da9e799a0189299b603f7af39e77c3b2c7a73e720f5', true, true
FROM public.places WHERE slug = 'bhoramdeo-temple-kawardha'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'sirpur-heritage-monuments', 'Sirpur Archaeological Complex & Laxman Temple', 'attraction', 'Heritage Monument', 'Chhattisgarh', 'Sirpur (Mahasamund)',
  'Sirpur (Mahasamund), Chhattisgarh, India', 21.3417, 82.1764, 'Sirpur is a village in Mahasamund district in the state of Chhattisgarh, 35 km from Mahasamund city and 78 km away from Raipur on the banks of the river Mahanadi.',
  '["Laxman Temple is one of India finest surviving 7th-century brick temples","Explore nearby excavated Buddhist monasteries where Chinese traveler Xuanzang stayed"]'::jsonb, 25, 'per person', '6:00 AM - 6:00 PM daily', 'November to March (Sirpur National Dance & Music Festival in January)',
  ARRAY['7th Century Brick Temple','Buddhist Monasteries','Mahanadi River','Archaeological Excavation'], 'Q191484', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/7th_-_9th_century_Surang_tila_mandapa_before_shrines%2C_Sirpur_monuments_Chhattisgarh.jpg/3840px-7th_-_9th_century_Surang_tila_mandapa_before_shrines%2C_Sirpur_monuments_Chhattisgarh.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4032, 3024, '0c6b23f42a02efe1fe16d556fa0c639c389384945af87c2bc185376e59ea0548', true, true
FROM public.places WHERE slug = 'sirpur-heritage-monuments'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'tirathgarh-falls-kanger-valley', 'Tirathgarh Falls & Kotumsar Limestone Caves', 'attraction', 'Nature & Caverns', 'Chhattisgarh', 'Kanger Ghati National Park (Bastar)',
  'Kanger Ghati National Park (Bastar), Chhattisgarh, India', 18.9167, 81.8667, 'Tirathgarh Falls & Kotumsar Limestone Caves is a renowned nature & caverns in Kanger Ghati National Park (Bastar), Chhattisgarh.',
  '["Kotumsar Cave requires an authorized guide carrying solar lantern (home to blind cave fish)","Steps lead to multiple terraces of the cascading water pool"]'::jsonb, 50, 'national park entry per vehicle', '8:00 AM - 4:00 PM (Closed during monsoon for cave safety)', 'October to March',
  ARRAY['Block Style Waterfall','Kotumsar Cave Blind Fish','Stalactites and Stalagmites','Kanger Ghati'], 'Q1263721', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDgwMCIgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBkYXRhLXBsYWNlLWlkPSJ0aXJhdGhnYXJoLWZhbGxzLWthbmdlci12YWxsZXkiPgogIDx0aXRsZT5UaXJhdGhnYXJoIEZhbGxzICYgS290dW1zYXIgTGltZXN0b25lIENhdmVzLCBLYW5nZXIgR2hhdGkgTmF0aW9uYWwgUGFyayAoQmFzdGFyKSwgQ2hoYXR0aXNnYXJoPC90aXRsZT4KICA8ZGVzYyBpZD0iZXhwbG9yZXgtcHJvbXB0Ij5taW5pbWFsIGZsYXQgaWxsdXN0cmF0aW9uIG9mIFRpcmF0aGdhcmggRmFsbHMgJiBLb3R1bXNhciBMaW1lc3RvbmUgQ2F2ZXMsIEthbmdlciBHaGF0aSBOYXRpb25hbCBQYXJrIChCYXN0YXIpLCBDaGhhdHRpc2dhcmgsIG11bHRpLXRpZXJlZCBzdGVwcGVkIHdoaXRlIHdhdGVyIGNhc2NhZGUgcGx1bmdpbmcgMzAwIGZlZXQgb3ZlciB6aWd6YWdnaW5nIGNyYWdneSByb2NrIHRlcnJhY2VzIHdpdGhpbiBkZWVwIHN1YnRyb3BpY2FsIHNhbCBmb3Jlc3RzLCBubyB0ZXh0LCBubyBwZW9wbGU8L2Rlc2M+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnR3JhZF90aXJhdGhnYXJoLWZhbGxzLWthbmdlci12YWxsZXkiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMEYyOTFFIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzE2NEUzNyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ29sZEdyYWRfdGlyYXRoZ2FyaC1mYWxscy1rYW5nZXItdmFsbGV5IiB4MT0iMCUiIHkxPSIxMDAlIiB4Mj0iMCUiIHkyPSIwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxMEI5ODEiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNkVFN0I3Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJzdW5HbG93X3RpcmF0aGdhcmgtZmFsbHMta2FuZ2VyLXZhbGxleSIgY3g9IjUwJSIgY3k9IjM1JSIgcj0iNDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzEwQjk4MSIgc3RvcC1vcGFjaXR5PSIwLjI1Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzBGMjkxRSIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L3JhZGlhbEdyYWRpZW50PgogIDwvZGVmcz4KCiAgPCEtLSBTa3kgJiBBdG1vc3BoZXJlIC0tPgogIDxyZWN0IHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjgwMCIgZmlsbD0idXJsKCNiZ0dyYWRfdGlyYXRoZ2FyaC1mYWxscy1rYW5nZXItdmFsbGV5KSIvPgogIDxjaXJjbGUgY3g9IjYwMCIgY3k9IjMyMCIgcj0iMjgwIiBmaWxsPSJ1cmwoI3N1bkdsb3dfdGlyYXRoZ2FyaC1mYWxscy1rYW5nZXItdmFsbGV5KSIvPgoKICA8IS0tIEdlb21ldHJpYyBNb3VudGFpbiAvIEFyY2hpdGVjdHVyYWwgQmFja2Ryb3AgTGF5ZXJzIC0tPgogIDxwYXRoIGQ9Ik0wLDgwMCBMMCw2MjAgUTMwMCw1MjAgNjAwLDU2MCBUMTIwMCw2MDAgTDEyMDAsODAwIFoiIGZpbGw9InJnYmEoMTYsIDE4NSwgMTI5LCAwLjE1KSIvPgogIDxwYXRoIGQ9Ik0wLDgwMCBMMCw2ODAgUTQwMCw2MDAgODAwLDY0MCBUMTIwMCw2NjAgTDEyMDAsODAwIFoiIGZpbGw9InJnYmEoMCwwLDAsMC4yKSIvPgoKICA8IS0tIFN0eWxpemVkIExhbmRtYXJrIFNpbGhvdWV0dGVzIC0tPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYwMCwgNTIwKSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+CiAgICA8IS0tIENlbnRlciBEb21lIC8gU3BpcmUgTW90aWYgLS0+CiAgICA8cGF0aCBkPSJNIC05MCwwIFEgLTkwLC0xNjAgMCwtMjEwIFEgOTAsLTE2MCA5MCwwIFoiIGZpbGw9InVybCgjZ29sZEdyYWRfdGlyYXRoZ2FyaC1mYWxscy1rYW5nZXItdmFsbGV5KSIgb3BhY2l0eT0iMC45Ii8+CiAgICA8IS0tIEZsYW5raW5nIE1pbmFyZXRzIC8gUGlsbGFycyAtLT4KICAgIDxyZWN0IHg9Ii0xNzAiIHk9Ii0xODAiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxODAiIHJ4PSI0IiBmaWxsPSJ1cmwoI2dvbGRHcmFkX3RpcmF0aGdhcmgtZmFsbHMta2FuZ2VyLXZhbGxleSkiIG9wYWNpdHk9IjAuODUiLz4KICAgIDxjaXJjbGUgY3g9Ii0xNjIiIGN5PSItMTkwIiByPSIxNCIgZmlsbD0iIzZFRTdCNyIvPgogICAgPHJlY3QgeD0iMTU0IiB5PSItMTgwIiB3aWR0aD0iMTYiIGhlaWdodD0iMTgwIiByeD0iNCIgZmlsbD0idXJsKCNnb2xkR3JhZF90aXJhdGhnYXJoLWZhbGxzLWthbmdlci12YWxsZXkpIiBvcGFjaXR5PSIwLjg1Ii8+CiAgICA8Y2lyY2xlIGN4PSIxNjIiIGN5PSItMTkwIiByPSIxNCIgZmlsbD0iIzZFRTdCNyIvPgogICAgPCEtLSBBcmNoZWQgUG9ydGFsIC0tPgogICAgPHBhdGggZD0iTSAtNDAsMCBMIC00MCwtOTAgUSAwLC0xMzAgNDAsLTkwIEwgNDAsMCBaIiBmaWxsPSIjMEYyOTFFIi8+CiAgPC9nPgoKICA8IS0tIEdyb3VuZCBQbGFuZSAvIFdhdGVyIFJlZmxlY3Rpb24gLS0+CiAgPHJlY3QgeT0iNzAwIiB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InJnYmEoMCwwLDAsMC4zNSkiLz4KICA8bGluZSB4MT0iMTAwIiB5MT0iNzIwIiB4Mj0iMTEwMCIgeTI9IjcyMCIgc3Ryb2tlPSIjMTBCOTgxIiBzdHJva2Utb3BhY2l0eT0iMC4zIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWRhc2hhcnJheT0iMTIsMTIiLz4KICA8bGluZSB4MT0iMjUwIiB5MT0iNzQ1IiB4Mj0iOTUwIiB5Mj0iNzQ1IiBzdHJva2U9IiMxMEI5ODEiIHN0cm9rZS1vcGFjaXR5PSIwLjIiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtZGFzaGFycmF5PSIyNCwxOCIvPgoKICA8IS0tIExhbmRtYXJrIFRpdGxlIExhYmVsIFN1YnRleHQgaW4gU1ZHIC0tPgogIDx0ZXh0IHg9IjYwMCIgeT0iNzU1IiBmb250LWZhbWlseT0iLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSIjNkVFN0I3IiBvcGFjaXR5PSIwLjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGxldHRlci1zcGFjaW5nPSIyLjUiPlRJUkFUSEdBUkggRkFMTFMgJiBLT1RVTVNBUiBMSU1FU1RPTkUgQ0FWRVMgwrcgS0FOR0VSIEdIQVRJIE5BVElPTkFMIFBBUksgKEJBU1RBUik8L3RleHQ+CgogIDwhLS0gQmFkZ2UgTWFya2VyIGluIGJvdHRvbSBjb3JuZXIgLS0+CiAgPHJlY3QgeD0iMzAiIHk9IjczOCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIzNCIgcng9IjE3IiBmaWxsPSJyZ2JhKDAsMCwwLDAuNikiIHN0cm9rZT0iIzEwQjk4MSIgc3Ryb2tlLXdpZHRoPSIxLjIiLz4KICA8dGV4dCB4PSIxMTAiIHk9Ijc2MCIgZm9udC1mYW1pbHk9Ii1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzZFRTdCNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgbGV0dGVyLXNwYWNpbmc9IjEuMiI+SUxMVVNUUkFUSU9OPC90ZXh0Pgo8L3N2Zz4=', 'ai_generated', 'Custom Vector Illustration (Creative Commons CC0)', 'Explorex AI Cultural Vector Illustration (Tirathgarh Falls & Kotumsar Limestone Caves)',
  1200, 800, '7744086dfa7338028c9d77037099b067faa1330da324a875170805a48c7f53cf', true, true
FROM public.places WHERE slug = 'tirathgarh-falls-kanger-valley'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'kaziranga-national-park-rhino', 'Kaziranga National Park (Greater One-Horned Rhinos)', 'attraction', 'Wildlife Sanctuary', 'Assam', 'Golaghat / Nagaon (Kohora)',
  'Golaghat / Nagaon (Kohora), Assam, India', 26.6667, 93.35, 'Kaziranga National Park is a national park and World Heritage Site in the Golaghat, Sonitpur, Biswanath and Nagaon districts of the Indian state of Assam. Located on the edge of the Brahmaputra River, it encompasses dense tropical moist broadleaf forests interspersed with tall elephant grass and marshland surrounding numerous beels. This habitat hosts populations of the Indian rhinoceros, Asian elephant, wild water buffalo, swamp deer, tiger and fishing cat. It is recognized as an Important Bird Area and was declared a Tiger Reserve in 2006.',
  '["Home to two-thirds of the world Great One-Horned Rhinoceros population","Advance jeep and elephant safari bookings recommended at Kohora or Bagori range"]'::jsonb, 100, 'entry fee per Indian national (Jeep safari vehicle ₹2,000 approx)', 'Elephant safari: 5:00 AM - 7:30 AM · Jeep safari: 7:30 AM - 11:00 AM, 1:30 PM - 3:30 PM (Open November to April)', 'November to April (flooded during summer monsoon floods)',
  ARRAY['UNESCO World Heritage','One-horned Rhinoceros','Brahmaputra Floodplains','Elephant Grass Savannah'], 'Q1471718', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Beauty_of_Kaziranga_National_Park.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3000, 2000, 'f60d7837ab88f1ebcb0d45a1210f383db218b05c16aa825ffc408328b006d188', true, true
FROM public.places WHERE slug = 'kaziranga-national-park-rhino'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'kamakhya-temple-guwahati', 'Maa Kamakhya Devi Temple (Nilachal Hill)', 'attraction', 'Spiritual', 'Assam', 'Guwahati',
  'Guwahati, Assam, India', 26.1664, 91.7056, 'Kamakhya Temple is a Hindu temple at Nilachal hills in Guwahati, Assam is one of the oldest and most revered centres of Tantric practices, dedicated to the goddess Kamakhya. The temple is the centre of the Kulachara Tantra Marga and the site of the Ambubachi Mela, an annual festival that celebrates the menstruation of the goddess. Structurally, the temple is dated to the 8th-9th century with many subsequent rebuildings—and the final hybrid architecture defines a local style called Nilachal. It is also one among the oldest 4 of the 51 pithas in the Shakta tradition. An obscure place of worship for much of history it became an important pilgrimage destination, especially for those from Bengal, in the 19th century during colonial rule.',
  '["Natural rock cave spring Garbhagriha has no idol; devotees touch the natural stone spring fissure","Dress respectfully; footwear removed at stone gateway"]'::jsonb, 0, 'free general darshan (VIP coupon ₹501)', '5:30 AM - 1:00 PM, 2:30 PM - 6:00 PM daily', 'October to April (Ambubachi Mela in June draws tantric pilgrims nationwide)',
  ARRAY['Premier Tantric Shakti Peeth','Nilachal Hill','Ambubachi Mela','Guwahati Landmark'], 'Q844111', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Kamakhya_Temple_-_DEV_8829.jpg/3840px-Kamakhya_Temple_-_DEV_8829.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  6016, 4016, 'b9edab9056eac4637b1d63e7c2d205c8fe2f569282f4f8497d767be221c1a22c', true, false
FROM public.places WHERE slug = 'kamakhya-temple-guwahati'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'majuli-river-island', 'Majuli Island & Vaishnavite Satras', 'attraction', 'Culture & Island', 'Assam', 'Majuli (Jorhat)',
  'Majuli (Jorhat), Assam, India', 26.95, 94.2167, 'Majuli is the largest river island in Assam, a state in Northeast India. It is bordered by the Brahmaputra River to the south and east, the Subansiri River to the west, and an anabranch of the Brahmaputra to the north.',
  '["World largest inhabited river island nestled in the Brahmaputra river","Visit Kamalabari and Samaguri Satras famous for traditional mythological bamboo-clay mask making"]'::jsonb, 20, 'ferry boat ticket from Nimati Ghat per person', 'Ferry operates daily 7:00 AM - 4:00 PM from Nimati Ghat (Jorhat)', 'October to March (Raas Mahotsav in November is a cultural spectacle)',
  ARRAY['World Largest River Island','Neo-Vaishnavite Culture','Traditional Mask Making','Brahmaputra River'], 'Q1847141', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Doriya_River_of_Majuli.jpg/3840px-Doriya_River_of_Majuli.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4928, 3264, 'b9b70fa10d365543df454172bba55fdd025d6ab0af409d3f970dfbf8febefaa9', true, true
FROM public.places WHERE slug = 'majuli-river-island'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'sivasagar-rang-ghar', 'Sivasagar Rang Ghar & Talatal Ghar', 'attraction', 'Heritage Monument', 'Assam', 'Sivasagar',
  'Sivasagar, Assam, India', 26.9633, 94.6253, 'The Rang Ghar, is a two-storeyed building which once served as the royal sports-pavilion where Ahom kings and nobles were spectators at games like buffalo fights and other sports at Rupahi Pathar - particularly during the Rongali Bihu festival in the Ahom capital of Rangpur.',
  '["One of Asia oldest surviving sports royal amphitheaters","Built with indigenous bricks and a mortar made from sticky Bora rice, duck eggs, and snail shells"]'::jsonb, 25, 'per person', '6:00 AM - 6:00 PM daily', 'October to April',
  ARRAY['Ahom Kingdom Capital','Colosseum of the East','Royal Sports Pavilion','Unique Ahom Architecture'], 'Q807217', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6c/Ranghar_-_Assam.jpg/3840px-Ranghar_-_Assam.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3888, 2592, '8a653a109e19e4018ccbf41b440e1fd112de2d54fe3a07a5ca9ce0903b7d3469', true, false
FROM public.places WHERE slug = 'sivasagar-rang-ghar'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'living-root-bridges-cherrapunji', 'Double Decker Living Root Bridge (Nongriat)', 'attraction', 'Natural Wonder', 'Meghalaya', 'Nongriat (Cherrapunji / Sohra)',
  'Nongriat (Cherrapunji / Sohra), Meghalaya, India', 25.2508, 91.6719, 'Living root bridges are a kind of tree shaping in which rivers are spanned by bridges formed out of the roots of ficus plants. Due to their being made from living, growing trees, they "show a very wide variety of structural typologies, with various aspects of particular bridges resembling characteristics of suspension bridges, cable-stayed bridges, arches, trusses, and simply-supported beams." They are common in the Indian state of Meghalaya.',
  '["Trek of 3,500 stone steps descending from Tyrna village requires good physical stamina","Do not peel or carve rubber tree aerial roots forming the living bridge"]'::jsonb, 50, 'village development entry fee', 'Daylight trek hours (allow 4 to 6 hours for roundtrip)', 'October to May (crystal clear turquoise natural swimming pools below bridge)',
  ARRAY['Ficus Elastica Bio-engineering','UNESCO Tentative List','Khasi Tribe Ingenuity','Double Decker Bridge'], 'Q3520110', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Living_root_bridges%2C_Nongriat_village%2C_Meghalaya2.jpg/3840px-Living_root_bridges%2C_Nongriat_village%2C_Meghalaya2.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  5184, 3456, '6c685c44c30f55d36dfc31eeee0dc74a7fdb75bc0e26dd74b86244800c295985', true, false
FROM public.places WHERE slug = 'living-root-bridges-cherrapunji'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'nohkalikai-falls-sohra', 'Nohkalikai Falls (Tallest Plunge Waterfall)', 'attraction', 'Nature & Waterfall', 'Meghalaya', 'Sohra (Cherrapunji)',
  'Sohra (Cherrapunji), Meghalaya, India', 25.2764, 91.6847, 'Nohkalikai Falls, sometimes Ka Likai, is the tallest plunge waterfall in India. The 340 metres (1,115 ft) waterfall is located in the Indian state of Meghalaya, near Cherapunji, one of the wettest places on Earth. Nohkalikai Falls are fed by the rainwater collected on the summit of a comparatively small plateau and decrease in power during the dry season, from December to February. Below the falls is a plunge pool with water of an unusual shade of green.',
  '["Tallest plunge waterfall in India dropping 1,115 feet into an emerald-green plunge pool","Viewpoints are positioned along cliff plateau with safety railings"]'::jsonb, 50, 'per person', '8:00 AM - 5:30 PM daily', 'September to December (clear skies for full view before afternoon mist rolls in)',
  ARRAY['India Tallest Plunge Waterfall (1,115 ft)','Emerald Plunge Pool','Rainiest Place on Earth','Khasi Hills'], 'Q1263721', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/NohKaLikai_Falls_V2_Wiki.jpg/3840px-NohKaLikai_Falls_V2_Wiki.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4216, 3238, 'b2376ccb9fab013ad944bfdb36c39cf6f5fcdcba5e928098e346ca726236c486', true, true
FROM public.places WHERE slug = 'nohkalikai-falls-sohra'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'dawki-umngot-river', 'Dawki Umngot River (Crystal Clear Transparent Waters)', 'attraction', 'Nature & Boating', 'Meghalaya', 'Dawki (West Jaintia Hills)',
  'Dawki (West Jaintia Hills), Meghalaya, India', 25.1889, 92.0239, 'Dawki or Dauki is a town in West Jaintia Hills district, Meghalaya, India.',
  '["During winter months, the river is so crystal clear that boats appear to float in mid-air","Life-jackets mandatory for all passengers"]'::jsonb, 800, 'boat ride on the transparent river per boat (seats up to 4)', '7:00 AM - 5:00 PM daily (boats halt at dusk)', 'November to April (water is glass-like and completely transparent)',
  ARRAY['Glass-like Transparent Water','Indo-Bangladesh Border','Suspension Bridge','Kayaking Paradise'], 'Q1157973', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Umngot_river%2C_Dawki.jpg/3840px-Umngot_river%2C_Dawki.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  5144, 3430, '471393a41a107df18c6b8e1fa28a447170c06c55e58998c36773b49cdb3019f3', true, true
FROM public.places WHERE slug = 'dawki-umngot-river'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'mawlynnong-cleanest-village', 'Mawlynnong Village (God Own Garden)', 'attraction', 'Culture & Village', 'Meghalaya', 'Mawlynnong (East Khasi Hills)',
  'Mawlynnong (East Khasi Hills), Meghalaya, India', 25.2017, 91.9167, 'Mawlynnong is a village in the East Khasi Hills district of the Meghalaya state in North East India. It is notable for its cleanliness and also was chosen by Discover India magazine as Asia''s cleanest village.',
  '["Awarded Cleanest Village in Asia: strict 100% plastic ban and handmade conical bamboo dustbins on every street","Climb the 85-foot high Sky Walk bamboo machan for views across the Bangladesh plains"]'::jsonb, 50, 'village development toll per vehicle', 'Open daylight hours (village observes quiet family hours in evening)', 'October to April',
  ARRAY['Cleanest Village in Asia','Bamboo Dustbins','Sky Walk Viewpoint','Matrilineal Khasi Culture'], 'Q3520110', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Mawlynnong_-_Cleanest_village_of_Asia.jpg/3840px-Mawlynnong_-_Cleanest_village_of_Asia.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4904, 4000, 'c208601db1ff1fee4f4c659256c535b70991ff01748417c6c754b0ac7a2d3414', true, true
FROM public.places WHERE slug = 'mawlynnong-cleanest-village'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'tawang-monastery-arunachal', 'Tawang Monastery (Galden Namgey Lhatse)', 'attraction', 'Spiritual', 'Arunachal Pradesh', 'Tawang',
  'Tawang, Arunachal Pradesh, India', 27.5861, 91.8594, 'Tawang Monastery is a Buddhist monastery located in Tawang, Arunachal Pradesh, India. It is the largest Buddhist monastery in the country. It is situated in the valley of the Tawang Chu, in close proximity to the Chinese and Bhutanese border.',
  '["Inner Line Permit (ILP) required for all domestic Indian tourists entering Arunachal Pradesh","Second largest Tibetan Buddhist monastery in the world after Lhasa Potala Palace"]'::jsonb, 20, 'museum entry fee', '7:00 AM - 5:00 PM daily · Morning prayer chanting at 7:00 AM', 'March to October (Torgya festival in January)',
  ARRAY['Largest Monastery in India','10,000 ft Mountain Ridge','Colossal Golden Buddha Statue','Birthplace of 6th Dalai Lama'], 'Q1740316', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/9/92/TawangMonastery.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1024, 664, '814d4b56fff027ec5714d1b93c2368738073cd04f5c961783efef9f617826944', true, true
FROM public.places WHERE slug = 'tawang-monastery-arunachal'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'sela-pass-lake-tawang', 'Sela Pass & Sela Lake (13,700 ft)', 'attraction', 'Mountain Pass & Lake', 'Arunachal Pradesh', 'West Kameng / Tawang',
  'West Kameng / Tawang, Arunachal Pradesh, India', 27.5042, 92.1039, 'The Sela Pass is a high-altitude mountain pass located on the border between the Tawang and West Kameng districts in the Indian state of Arunachal Pradesh. It has an elevation of 4170 m (13,700 ft) and connects the Indian Buddhist town of Tawang to Dirang and Guwahati. The pass carries the National Highway 13, connecting Tawang with the rest of India. The pass supports scarce amounts of vegetation and is usually snow-covered to some extent throughout the year. Sela Lake, near the summit of the pass, is one of approximately 101 lakes in the area that are sacred in Tibetan Buddhism. While Sela Pass does get heavy snowfall in winters, it is usually open throughout the year unless landslides or snow require the pass to be shut down temporarily. Sela pass is one of the highest motorable mountain passes in the world',
  '["Gateway to Tawang crossing the Eastern Himalayas at 13,700 feet","Do not step onto thin frozen lake ice in winter"]'::jsonb, 0, 'scenic transit pass', 'Regulated traffic by Indian Army according to weather conditions', 'October to April (frozen lake in winter, blanket of rhododendrons in spring)',
  ARRAY['High Altitude Himalayan Pass','Sacred Sela Lake','Tibetan Prayer Gate','Snow Covered Peaks'], 'Q2724285', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Tawang_Gate.jpg/3840px-Tawang_Gate.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4500, 2981, 'ab8c11b32b29351197b39cbb06afe919f102d402056c3153b6155ab88cf52d2e', true, false
FROM public.places WHERE slug = 'sela-pass-lake-tawang'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'ziro-valley-apatani', 'Ziro Valley (Apatani Cultural Landscape)', 'attraction', 'Culture & Valley', 'Arunachal Pradesh', 'Ziro (Lower Subansiri)',
  'Ziro (Lower Subansiri), Arunachal Pradesh, India', 27.53, 93.83, 'Ziro is a town in and the district headquarters of the Lower Subansiri district of the Indian state of Arunachal Pradesh. The part of the town which is the centre of economic activities and where the administrative offices are located is called Hapoli, or locally known by the Apatanis as "Hao-Polyang". Ziro is home to the Apatani tribe. Ziro is included in the Tentative List for UNESCO''s World Heritage Site for the Apatani cultural landscape.',
  '["Inner Line Permit (ILP) required at check gates","Respect elder Apatani women wearing traditional facial tattoos (Tepyo) and nose plugs (Yaping Hullo)"]'::jsonb, 0, 'free valley scenic access', 'Daylight scenic valley · Ziro Festival of Music in late September', 'March to October (vibrant Ziro Music Festival in autumn)',
  ARRAY['UNESCO Tentative List','Apatani Tribe','Wet Rice & Fish Agriculture','Ziro Music Festival','Pine Groves'], 'Q4784409', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/1/1e/A_cross_section_of_luch_green_valley_of_Ziro.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2500, 1650, '4a57a7409be636cb306088595b3e3bfcb0aae19eb78c8e894c2ca8e63b26f123', true, false
FROM public.places WHERE slug = 'ziro-valley-apatani'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'tsomgo-lake-sikkim', 'Tsomgo Lake (Changu Lake) & Baba Mandir', 'attraction', 'High Altitude Glacial Lake', 'Sikkim', 'Gangtok (East Sikkim)',
  'Gangtok (East Sikkim), Sikkim, India', 27.3742, 88.7619, 'Tsomgo Lake, also known as Tsongmo Lake or Changgu Lake, is a glacial lake in Changu in the Gangtok district of the Indian state of Sikkim, some 40 kilometres (25 mi) from the capital Gangtok. Located at an elevation of 3,753 m (12,313 ft), the lake remains frozen during the winter season. The lake surface reflects different colours with change of seasons and is held in great reverence by the local Sikkimese people. Buddhist monks prognosticated after studying the changing colours of the lake.',
  '["Protected Area Permit (PAP) issued through registered Sikkim travel agencies in Gangtok (bring passport photos and photo ID)","Yak rides available along lake perimeter"]'::jsonb, 200, 'protected area permit per person estimate', 'Permit entry 7:30 AM - 11:00 AM (vehicles must return before 4:00 PM)', 'March to May (rhododendrons) and October to December (clear views of Kanchenjunga range)',
  ARRAY['Sacred Glacial Lake (12,310 ft)','Color Changing Waters','Nathula Route','Decorated Yaks'], 'Q1157973', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Tsongmo_Lake_or_Changu_Lake_-_East_Sikkim.jpg/3840px-Tsongmo_Lake_or_Changu_Lake_-_East_Sikkim.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  3888, 2592, 'a1b8e5592701a582e99d6f8965a38de6fd978a7ab52deb53a923856e619e3ac1', true, false
FROM public.places WHERE slug = 'tsomgo-lake-sikkim'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'nathula-pass-sikkim', 'Nathula Pass (Old Silk Route Indo-China Border)', 'attraction', 'High Altitude Border Pass', 'Sikkim', 'Gangtok (Indo-China Border)',
  'Gangtok (Indo-China Border), Sikkim, India', 27.3867, 88.8306, 'Nathu La is a mountain pass in the Dongkya Range of the Himalayas between China''s Yadong County in Tibet, and the Indian states of Sikkim. The pass, at 4,310 m (14,140 ft), connects the towns of Kalimpong and Gangtok to the villages and towns of the lower Chumbi Valley.',
  '["Open exclusively to Indian nationals with valid ID and army permit","Elevation 14,140 feet: take slow deep breaths and do not run"]'::jsonb, 500, 'special border permit fee per vehicle', '8:00 AM - 1:30 PM (Closed on Mondays & Tuesdays for general tourists)', 'May to October',
  ARRAY['Historic Silk Road','Indo-China International Border','Indian Army Memorial','14,140 Feet Altitude'], 'Q740523', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Location_of_Nathula.svg/960px-Location_of_Nathula.svg.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  800, 740, '6b2e7d71ff0db1adf65cdbdb4d4380d8d7c7df5b42a3851dacc52b0b150ccd5c', true, true
FROM public.places WHERE slug = 'nathula-pass-sikkim'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'rumtek-monastery-sikkim', 'Rumtek Dharma Chakra Centre', 'attraction', 'Spiritual', 'Sikkim', 'Gangtok (Rumtek)',
  'Gangtok (Rumtek), Sikkim, India', 27.3017, 88.5417, 'Rumtek Monastery, also called the Dharma Chakra Centre, is a gompa located in the Indian state of Sikkim near the capital Gangtok. It is the seat in exile of the Gyalwang Karmapa, inaugurated in 1966 by the 16th Karmapa. It is also a focal point for the sectarian tensions within the Karma Kagyu school of Tibetan Buddhism that characterize the 17th Karmapa controversy.',
  '["Seat of His Holiness the Gyalwang Karmapa (Karma Kagyu lineage)","Valid government photo ID required at security checkpoint"]'::jsonb, 10, 'per person', '6:00 AM - 6:00 PM daily', 'March to May and October to December',
  ARRAY['Karma Kagyu Seat','Golden Stupa','Tibetan Murals','Golden Reliquary'], 'Q1740316', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Rumtek_Monastery_alias_Dharma_Chakra_Centre_near_Gangtok%2C_East_Sikkim_09.jpg/3840px-Rumtek_Monastery_alias_Dharma_Chakra_Centre_near_Gangtok%2C_East_Sikkim_09.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  8256, 5504, 'b685e4f6300a45f0910cb7c4a250596b8b93d192c2a651ed87bb6e4d84219956', true, true
FROM public.places WHERE slug = 'rumtek-monastery-sikkim'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'gurudongmar-lake-north-sikkim', 'Gurudongmar Lake (One of World Highest Lakes at 17,800 ft)', 'attraction', 'Extreme High Altitude Lake', 'Sikkim', 'Lachen (North Sikkim)',
  'Lachen (North Sikkim), Sikkim, India', 28.025, 88.7125, 'Gurudongmar Lake is one of the highest lakes in the world and in India, at an elevation of 5,430 m (17,800 ft) according to the Government of Sikkim. It is located in the Great Himalayas in the Mangan district in Indian state of Sikkim, and considered sacred by Buddhists. The lake is named after Padmasambhava, who visited it in the 8th century.',
  '["Permitted for Indian citizens only due to border sensitivity","Altitude 17,800 ft: spend no more than 30 minutes at lake level; overnight stay in Lachen mandatory for acclimatization"]'::jsonb, 0, 'permit included in North Sikkim tour package', 'Must reach lake by 8:30 AM and depart before 11:00 AM due to gale force winds', 'April to June and October to November',
  ARRAY['Holy to Buddhists and Sikhs','Guru Nanak and Padmasambhava Blessing','Never Freezes Completely','17,800 Feet'], 'Q1076878', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Gurudongmar_Lake_Sikkim%2C_India_%28edit%29.jpg/3840px-Gurudongmar_Lake_Sikkim%2C_India_%28edit%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  6000, 4000, 'fddc0aca3d412ab0518c0cf190047f24a093892b0b7164e0edc3fd5928fcc143', true, true
FROM public.places WHERE slug = 'gurudongmar-lake-north-sikkim'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'dzukou-valley-nagaland', 'Dzukou Valley & Wild Lily Trails', 'attraction', 'Nature & Trekking', 'Nagaland', 'Kohima (Viswema / Jakhama)',
  'Kohima (Viswema / Jakhama), Nagaland, India', 25.5647, 94.0736, 'The Dzukou Valley is a high-altitude valley in Northeast India, straddling the inter-state border of the states of Nagaland and Manipur. Lying behind Mount Japfü at an elevation between 2,438 and 2,452 m above sea level in the Kohima and Senapati districts, it is known for its rolling meadows, seasonal wildflowers and rich biodiversity, and is among the most popular trekking destinations in northeastern India.',
  '["Trekkers start from Viswema or Jakhama village base points","Zero plastic zone: all wrappers and plastic bottles must be carried back"]'::jsonb, 100, 'entry fee per trekker', 'Trek daylight hours (overnight stay at Dzukou rest house available)', 'June to September (rare pink Dzukou lily bloom) and October to March (crisp views)',
  ARRAY['Valley of Flowers of the East','Endemic Dzukou Lily','Rolling Mounded Hills','Trekking Paradise'], 'Q4897262', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Breathtaking_beauty_of_Dzukou_Valley_in_Manipur-Nagaland_border_%28edit%29.jpg/3840px-Breathtaking_beauty_of_Dzukou_Valley_in_Manipur-Nagaland_border_%28edit%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4499, 2530, '38bf1c2b027ecf07c81a5840ce03a4bae47a06eff073f734fef854e3d21704e2', true, true
FROM public.places WHERE slug = 'dzukou-valley-nagaland'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'kisama-heritage-village', 'Kisama Naga Heritage Village (Hornbill Festival)', 'attraction', 'Culture & Heritage', 'Nagaland', 'Kohima (Kisama)',
  'Kohima (Kisama), Nagaland, India', 25.6133, 94.1033, 'Hornbill Festival is an annual festival celebrated from 1 to 10 of December in the Northeastern Indian state of Nagaland. The festival represents all ethnic groups of Nagaland for which it is also called the Festival of Festivals.',
  '["Showcases traditional wooden morungs (dormitories) of all 16 major Naga tribes","Sample authentic Naga culinary delicacies and bamboo shoots"]'::jsonb, 50, 'per person (Hornbill Festival pass ₹100/day in December)', '9:00 AM - 5:00 PM (December 1 - 10 hosts the famous Hornbill Festival of Festivals)', 'December 1 to 10 for the Hornbill Festival',
  ARRAY['Festival of Festivals','16 Naga Tribes','Traditional Morungs','Wood Carvings and Hornbill Feathers'], 'Q3520110', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/en/5/57/HornbillFest2014logo.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  259, 385, '551b310c233da5db5d5cf8335c06161c15d4bc33127b49f62d1a7a3c61c3bffe', true, false
FROM public.places WHERE slug = 'kisama-heritage-village'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'kohima-war-cemetery', 'Kohima Commonwealth War Cemetery', 'attraction', 'Historical Memorial', 'Nagaland', 'Kohima',
  'Kohima, Nagaland, India', 25.6667, 94.1042, 'Kohima War Cemetery is a memorial dedicated to soldiers of the 2nd British Division of the Allied Forces who died in the Second World War at Kohima, the capital of the Indian state of Nagaland in April 1944. The soldiers died on the battleground of Garrison Hill in the tennis court area of the Deputy Commissioner''s residence. According to the Commonwealth War Graves Commission, which maintains this cemetery among many others in the world, there are 1,420 Commonwealth burials of the Second World War at this cemetery, and a memorial to an additional 917 Hindu and Sikh soldiers who were cremated in accordance with their faith. The memorial was inaugurated by Field Marshal Sir William Slim, then Commander of the 14th Army in Burma.',
  '["Famous Kohima Epitaph inscription: \"When you go home, tell them of us and say, For your tomorrow, we gave our today\"","Keep quiet along the manicured terrace graves"]'::jsonb, 0, 'free entry', '9:00 AM - 4:00 PM daily', 'October to April',
  ARRAY['Battle of Kohima (1944)','Stalingrad of the East','Garrison Hill','Famous Kohima Epitaph'], 'Q1053018', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Cemetery_with_kohima.jpeg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2048, 1536, '5e6df35320ce2d1c3adc00db173145b18735b989d1ea1718a7fd62be6441f356', true, true
FROM public.places WHERE slug = 'kohima-war-cemetery'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'loktak-lake-keibul-lamjao', 'Loktak Lake & Keibul Lamjao Floating National Park', 'attraction', 'Natural Wonder', 'Manipur', 'Moirang / Bishnupur',
  'Moirang / Bishnupur, Manipur, India', 24.55, 93.8167, 'Loktak Lake is the largest freshwater lake in Northeast India. It is a pulsating lake, with a surface area varying from 250 km2 to 500 km2 during the rainy season with a typical area of 287 km2. The lake is located at Moirang in Manipur state, India. The etymology of Loktak is Lok = "stream" and tak = "the end" in Meitei language. It is famous for the phumdi floating over it. The largest of all the phumdis covers an area of 40 km2 (15 sq mi) and is situated on the southeastern shore of the lake. Located on this phumdi, Keibul Lamjao National Park is the only floating national park in the world. The park is the last natural refuge of the endangered Sangai, Rucervus eldii eldii or Manipur brow-antlered deer, one of three subspecies of Eld''s deer.',
  '["Only floating national park in the world (formed by circular organic biomass called Phumdis)","Home to the endangered Sangai (dancing deer of Manipur)"]'::jsonb, 200, 'boat tour per person', 'Sunrise to Sunset daily', 'October to March',
  ARRAY['World Only Floating National Park','Circular Phumdis','Dancing Deer Sangai','Sendra Island'], 'Q1157973', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/e/e9/The_Loktak_Lake.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  1600, 1044, '69344dcc65b4f6ab67751605dd9bb3077e4e91b8cd7b0e0f1c52e18abc4f1eab', true, true
FROM public.places WHERE slug = 'loktak-lake-keibul-lamjao'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'kangla-fort-imphal', 'Kangla Fort & Royal Palace', 'attraction', 'Heritage Fort', 'Manipur', 'Imphal',
  'Imphal, Manipur, India', 24.8083, 93.9417, 'The Kanglā is a historic site and tourist attraction in fortified palace in Imphal, Manipur, India. The Kangla, a fortified palace, was the traditional seat of the Meitei kings of the Ningthouja dynasty. It includes a royal residence, two museums, gardens, a traditional boathouse holding Meitei racing boats, a Sanamahist temple, and other Meitei cultural and artistic treasures.',
  '["Ancient seat of the Meitei rulers of Manipur","Rent a bicycle at the main gate to explore the expansive 237-acre fort grounds and sacred ponds"]'::jsonb, 20, 'per person', '7:00 AM - 5:00 PM (Closed on Wednesdays)', 'October to March',
  ARRAY['Ancient Meitei Kingdom','Kangla Sha Dragon Statues','Sacred Ponds','Imphal Heart'], 'Q844111', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://upload.wikimedia.org/wikipedia/commons/0/03/The_sacred_idols_of_God_Pakhangba_and_his_divine_consort_kept_inside_the_Pakhangba_Temple_in_the_Kangla_Fort_in_Imphal.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  2992, 4000, 'ebb5ee4720fd28ab801b9509e5038f3a47801d5c76b70d5c31cc5141c818256f', true, true
FROM public.places WHERE slug = 'kangla-fort-imphal'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'vantawng-falls-mizoram', 'Vantawng Falls & Thenzawl Sericulture', 'attraction', 'Nature & Waterfall', 'Mizoram', 'Thenzawl (Serchhip)',
  'Thenzawl (Serchhip), Mizoram, India', 23.2842, 92.7917, 'The Vantawng Khawhthla is located 5 kilometres (3.1 mi) south of Thenzawl in Serchhip district in the Indian state of Mizoram. It is the highest uninterrupted waterfall in Mizoram. It is about 92 kilometres away from Aizawl.',
  '["Highest waterfall in Mizoram (750 ft)","View the falls safely from the comfortable government watchtower across the bamboo forest ravine"]'::jsonb, 20, 'per person', 'Open daylight hours (viewing tower open 8:00 AM - 5:00 PM)', 'September to January',
  ARRAY['Highest Waterfall in Mizoram','Thenzawl Handlooms','Bamboo Forest Gorges','Vanva River'], 'Q1263721', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/82/Vantawng_Falls_in_1990s.jpg/3840px-Vantawng_Falls_in_1990s.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4002, 5753, '8f9f160128224dc9e5dd2e0278e6a5a93321806a9cc613fdd7dfc843ed8d0722', true, true
FROM public.places WHERE slug = 'vantawng-falls-mizoram'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'reiek-tlang-mountain', 'Reiek Tlang Mountain Peak & Heritage Village', 'attraction', 'Mountain Peak & Heritage', 'Mizoram', 'Reiek (Mamit / Aizawl)',
  'Reiek (Mamit / Aizawl), Mizoram, India', 23.6833, 92.6167, 'Reiek is a mountain and tourist spot 29 km from Aizawl, Mizoram, India. It rests at an elevation of 1,465 metres overlooking Aizawl and offers a view of the surrounding valleys and hills. On a clear day, the plains of Bangladesh can be seen from the top of the hill. Reiek Hill is surrounded by thick lush green temperate trees and bushes.',
  '["30-minute forested trail ascends to cliff precipice at 4,800 ft offering views of Bangladesh plains","Visit the authentic replica of a traditional Mizo chieftain village at base"]'::jsonb, 20, 'heritage village entry', 'Daylight hiking hours (29 km drive from Aizawl)', 'October to April (Anthourium Festival in autumn)',
  ARRAY['Mizo Chieftain Hut','Sheer Cliff Viewpoint','Anthourium Flower Festival','Aizawl Skyline'], 'Q2724285', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Reiek.JPG/3840px-Reiek.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4000, 3000, '7e95b8d9c1be0157d96ab42940162c9ec1281d3513813c6a5410a97597d780fd', true, true
FROM public.places WHERE slug = 'reiek-tlang-mountain'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'ujjayanta-palace-agartala', 'Ujjayanta Palace & Tripura State Museum', 'attraction', 'Heritage Palace', 'Tripura', 'Agartala',
  'Agartala, Tripura, India', 23.8375, 91.2825, 'Ujjayanta Palace is the state museum of the Indian state of Tripura and former royal palace of the princely state of Tripura. It was built by Maharaja Radha Kishore Manikya in 1901. It housed the State Legislative Assembly between 1973 and 2011. The palace primarily showcases the lifestyle, arts, culture, tradition and crafts of communities residing in northeast India, along with many stone sculptures of the Manikya dynasty.',
  '["Named by Nobel laureate Rabindranath Tagore, who was a frequent guest of the Manikya royal court","Musical fountains illuminate the Mughal-style front gardens at dusk"]'::jsonb, 20, 'per person', '10:00 AM - 5:00 PM (Closed on Mondays)', 'October to March',
  ARRAY['Manikya Dynasty','White Neoclassical Palace','Rabindranath Tagore','State Museum'], 'Q1140027', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Ujjayanta_palace_Tripura_State_Museum_Agartala_India.jpg/3840px-Ujjayanta_palace_Tripura_State_Museum_Agartala_India.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  5602, 3955, '7b74ef519d8090fc45be08e496fe07aed2c4dee81ae110574d837e2b729efc80', true, true
FROM public.places WHERE slug = 'ujjayanta-palace-agartala'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'unakoti-rock-carvings', 'Unakoti Sub-Tirtha (Colossal Rock Reliefs of Shiva)', 'attraction', 'Heritage Monument', 'Tripura', 'Kailashahar (Unakoti)',
  'Kailashahar (Unakoti), Tripura, India', 24.32, 92.0667, 'Unakoti or Subrai Khung is a sculptural emblem and ancient Shaivite place that hosts rock carvings, figures and images of gods and goddesses. The bas relief sculptures at Unakoti are on stylistic grounds ascribed to 7th–9th century CE, to the period of Pre-Manikya rule. The rock art was patronised by Deva Dynasty of Sribhumi in Samatata. The only inscription at Unakoti is on the other Chaturmukhalinga image, consisting of a couple of records in Bengali Characters of the 11th to 12th century CE, which mentions one Sri Jayadeva, probably a pilgrim.',
  '["Unakoti means \"one less than a crore\" (legend of 99,99,999 deities carved in stone)","Wear good walking shoes for stepping down the ravine steps to the central 30-foot Unakotiswara Kal Bhairava rock face"]'::jsonb, 0, 'free entry', '6:00 AM - 6:00 PM daily', 'October to March (Ashokastami Mela in April)',
  ARRAY['UNESCO Tentative List','Angkor Wat of the Northeast','Colossal Rock Reliefs','Shiva Kal Bhairava'], 'Q2643505', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Unakoti_3.jpg/3840px-Unakoti_3.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  4032, 3024, '4e475adee7e8af76719df7865a0d0b6c9d215a5bce56432747c28dbc678343db', true, true
FROM public.places WHERE slug = 'unakoti-rock-carvings'
ON CONFLICT (sha256) DO NOTHING;


INSERT INTO public.places (
  slug, name, type, category, state, city, address, lat, lng, description, rules,
  price_amount, price_unit, opening_hours, best_time, tags, wikidata_id, is_published
) VALUES (
  'neermahal-water-palace', 'Neermahal Palace (Water Palace of the East)', 'attraction', 'Heritage Palace & Lake', 'Tripura', 'Melaghar (Rudrasagar Lake)',
  'Melaghar (Rudrasagar Lake), Tripura, India', 23.5014, 91.3147, 'Neermahal also known as Twijilikma Nuyung is a former royal palace of the Tripura Kingdom. Built by Maharaja Bir Bikram Kishore Manikya Bahadur in 1930. It is also the largest water palace in India. The palace is situated in the middle of Rudrasagar Lake, in Melaghar 53 kilometers away from Agartala, the capital of Tripura.',
  '["One of only two major water palaces in India (along with Jal Mahal Jaipur)","Take the picturesque 15-minute motorboat voyage across Rudrasagar Lake to the palace entrance"]'::jsonb, 30, 'palace entry (Motorboat roundtrip ₹50)', '9:00 AM - 5:00 PM daily', 'October to March (migratory bird boating season)',
  ARRAY['Royal Lake Palace','Rudrasagar Lake (Ramsar Site)','Hindu and Mughal Fusion','Motorboat Voyage'], 'Q807217', true
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  description = EXCLUDED.description,
  price_amount = EXCLUDED.price_amount,
  opening_hours = EXCLUDED.opening_hours;


INSERT INTO public.place_images (
  place_id, url, source, license, attribution, width, height, sha256, is_primary, is_verified
) SELECT
  id, 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Neer_Mahal%2C_the_water_palace_of_Tripura_02.jpg/3840px-Neer_Mahal%2C_the_water_palace_of_Tripura_02.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail', 'wikimedia_commons', 'CC BY-SA 4.0', 'Photo: Wikimedia Commons Contributor via Wikimedia Commons (CC BY-SA 4.0)',
  5904, 3936, 'effe0905f397f14e447545f8507133e9901c312bd2291f64fb3315b23f5b66bd', true, true
FROM public.places WHERE slug = 'neermahal-water-palace'
ON CONFLICT (sha256) DO NOTHING;

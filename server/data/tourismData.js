// Generated from place-names.xlsx, hotel-name.xlsx, res-name.xlsx and images/
function getFallbackImage(category = '', type = '') {
  const cat = (category || type || '').toLowerCase()
  if (cat.includes('hotel') || cat.includes('resort') || cat.includes('palace hotel') || cat.includes('stay')) {
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
  }
  if (cat.includes('restaurant') || cat.includes('dining') || cat.includes('cafe') || cat.includes('bistro')) {
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
  }
  return 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80'
}

export const places = [
  {
    "id": "place-1-1",
    "name": "Charminar",
    "category": "Historical Monument",
    "description": "Iconic monument built in 1591 and symbol of Hyderabad.",
    "image": "/images/charminar.jpg",
    "position": [
      17.3614,
      78.4747
    ],
    "location": {
      "address": "Charminar, Telangana",
      "coordinates": [
        78.4747,
        17.3614
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-2-2",
    "name": "Golconda Fort",
    "category": "Historical Fort",
    "description": "Historic fort associated with the Qutb Shahi dynasty.",
    "image": "/images/golconda-fort.jpg",
    "position": [
      17.385,
      78.4041
    ],
    "location": {
      "address": "Golconda Fort, Telangana",
      "coordinates": [
        78.4041,
        17.385
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-3-3",
    "name": "Qutb Shahi Tombs",
    "category": "Historical Monument",
    "description": "Tomb complex of the Qutb Shahi rulers.",
    "image": "/images/anantha-padmanabha.jpg",
    "position": [
      17.3952,
      78.3968
    ],
    "location": {
      "address": "Qutb Shahi Tombs, Telangana",
      "coordinates": [
        78.3968,
        17.3952
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-4-4",
    "name": "Chowmahalla Palace",
    "category": "Historical Palace",
    "description": "Royal palace complex of the Nizams.",
    "image": "/images/chowmahalla-palace.jpg",
    "position": [
      17.3578,
      78.4717
    ],
    "location": {
      "address": "Chowmahalla Palace, Telangana",
      "coordinates": [
        78.4717,
        17.3578
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-5-5",
    "name": "Falaknuma Palace",
    "category": "Historical Palace",
    "description": "Historic palace associated with the Nizam era.",
    "image": "/images/ashtalakshmi-temple.jpg",
    "position": [
      17.3314,
      78.4678
    ],
    "location": {
      "address": "Falaknuma Palace, Telangana",
      "coordinates": [
        78.4678,
        17.3314
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-6-6",
    "name": "Paigah Tombs",
    "category": "Historical Monument",
    "description": "Elaborately decorated tombs of the Paigah nobles.",
    "image": "/images/paigah-tombs.jpg",
    "position": [
      17.3459,
      78.5013
    ],
    "location": {
      "address": "Paigah Tombs, Telangana",
      "coordinates": [
        78.5013,
        17.3459
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-7-7",
    "name": "Mecca Masjid",
    "category": "Historical Mosque",
    "description": "Historic mosque located close to Charminar.",
    "image": "/images/mecca-masjid.jpg",
    "position": [
      17.3604,
      78.4737
    ],
    "location": {
      "address": "Mecca Masjid, Telangana",
      "coordinates": [
        78.4737,
        17.3604
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-8-8",
    "name": "Taramati Baradari",
    "category": "Historical Monument",
    "description": "Historic pavilion from the Golconda period.",
    "image": "/images/taramati-baradari.jpg",
    "position": [
      17.3848,
      78.3679
    ],
    "location": {
      "address": "Taramati Baradari, Telangana",
      "coordinates": [
        78.3679,
        17.3848
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-9-9",
    "name": "Purani Haveli",
    "category": "Historical Palace",
    "description": "Historic palace associated with the Nizam family.",
    "image": "/images/purani-haveli.jpg",
    "position": [
      17.3612,
      78.4758
    ],
    "location": {
      "address": "Purani Haveli, Telangana",
      "coordinates": [
        78.4758,
        17.3612
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-10-10",
    "name": "Nizam's Museum",
    "category": "Museum",
    "description": "Museum displaying objects associated with the Nizams.",
    "image": "/images/begum-bazaar.jpg",
    "position": [
      17.3617,
      78.4728
    ],
    "location": {
      "address": "Nizam's Museum, Telangana",
      "coordinates": [
        78.4728,
        17.3617
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-11-11",
    "name": "Salar Jung Museum",
    "category": "Museum",
    "description": "Major museum containing art, antiques and manuscripts.",
    "image": "/images/salar-jung-museum.jpg",
    "position": [
      17.3713,
      78.4804
    ],
    "location": {
      "address": "Salar Jung Museum, Telangana",
      "coordinates": [
        78.4804,
        17.3713
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-12-12",
    "name": "Telangana State Archaeology Museum",
    "category": "Archaeological Museum",
    "description": "Museum containing archaeological and historical collections.",
    "image": "/images/belur-temple.jpg",
    "position": [
      17.4008,
      78.467
    ],
    "location": {
      "address": "Telangana State Archaeology Museum, Telangana",
      "coordinates": [
        78.467,
        17.4008
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-13-13",
    "name": "B. M. Birla Science Centre",
    "category": "Science Museum",
    "description": "Science museum and planetarium complex.",
    "image": "/images/bhadrachalam-temple.jpg",
    "position": [
      17.4067,
      78.4696
    ],
    "location": {
      "address": "B. M. Birla Science Centre, Telangana",
      "coordinates": [
        78.4696,
        17.4067
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-14-14",
    "name": "Sudha Car Museum",
    "category": "Museum",
    "description": "Museum displaying unusual and creatively designed cars.",
    "image": "/images/sudha-car-museum.jpg",
    "position": [
      17.3497,
      78.4516
    ],
    "location": {
      "address": "Sudha Car Museum, Telangana",
      "coordinates": [
        78.4516,
        17.3497
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-15-15",
    "name": "Hussain Sagar Lake",
    "category": "Lake",
    "description": "Historic lake connecting Hyderabad and Secunderabad.",
    "image": "/images/hussain-sagar.jpg",
    "position": [
      17.4239,
      78.4738
    ],
    "location": {
      "address": "Hussain Sagar Lake, Telangana",
      "coordinates": [
        78.4738,
        17.4239
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-16-16",
    "name": "Buddha Statue",
    "category": "Tourist Attraction",
    "description": "Large Buddha statue located in Hussain Sagar.",
    "image": "/images/buddha-statue.jpg",
    "position": [
      17.4156,
      78.475
    ],
    "location": {
      "address": "Buddha Statue, Telangana",
      "coordinates": [
        78.475,
        17.4156
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-17-17",
    "name": "Necklace Road",
    "category": "Scenic Spot",
    "description": "Lakeside recreational area around Hussain Sagar.",
    "image": "/images/necklace-road.jpg",
    "position": [
      17.4237,
      78.459
    ],
    "location": {
      "address": "Necklace Road, Telangana",
      "coordinates": [
        78.459,
        17.4237
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-18-18",
    "name": "Lumbini Park",
    "category": "Park",
    "description": "Popular park near Hussain Sagar.",
    "image": "/images/Lumbini-Park.jpg",
    "position": [
      17.4099,
      78.4732
    ],
    "location": {
      "address": "Lumbini Park, Telangana",
      "coordinates": [
        78.4732,
        17.4099
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-19-19",
    "name": "NTR Gardens",
    "category": "Park",
    "description": "Large recreational garden beside Hussain Sagar.",
    "image": "/images/british-residency.jpg",
    "position": [
      17.4131,
      78.4691
    ],
    "location": {
      "address": "NTR Gardens, Telangana",
      "coordinates": [
        78.4691,
        17.4131
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-20-20",
    "name": "Indira Park",
    "category": "Park",
    "description": "Large urban park near Lower Tank Bund.",
    "image": "/images/indira-park.jpg",
    "position": [
      17.4147,
      78.4812
    ],
    "location": {
      "address": "Indira Park, Telangana",
      "coordinates": [
        78.4812,
        17.4147
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-21-21",
    "name": "Sanjeevaiah Park",
    "category": "Park",
    "description": "Large lakeside park on the northern side of Hussain Sagar.",
    "image": "/images/charminar.jpg",
    "position": [
      17.4234,
      78.4752
    ],
    "location": {
      "address": "Sanjeevaiah Park, Telangana",
      "coordinates": [
        78.4752,
        17.4234
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-22-22",
    "name": "KBR National Park",
    "category": "Wildlife / Park",
    "description": "Urban national park known for greenery and wildlife.",
    "image": "/images/kbr-national-park.jpg",
    "position": [
      17.4239,
      78.415
    ],
    "location": {
      "address": "KBR National Park, Telangana",
      "coordinates": [
        78.415,
        17.4239
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-23-23",
    "name": "Nehru Zoological Park",
    "category": "Wildlife",
    "description": "Major zoo with a large variety of animals.",
    "image": "/images/nehru-zoological-Park.jpg",
    "position": [
      17.3507,
      78.4513
    ],
    "location": {
      "address": "Nehru Zoological Park, Telangana",
      "coordinates": [
        78.4513,
        17.3507
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-24-24",
    "name": "Mir Alam Tank",
    "category": "Lake",
    "description": "Historic lake and water body near the zoo.",
    "image": "/images/mir-alam-tank.jpg",
    "position": [
      17.3325,
      78.45
    ],
    "location": {
      "address": "Mir Alam Tank, Telangana",
      "coordinates": [
        78.45,
        17.3325
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-25-25",
    "name": "Birla Mandir",
    "category": "Religious",
    "description": "Hilltop temple overlooking Hyderabad.",
    "image": "/images/birla-mandir.jpg",
    "position": [
      17.4062,
      78.4691
    ],
    "location": {
      "address": "Birla Mandir, Telangana",
      "coordinates": [
        78.4691,
        17.4062
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-26-26",
    "name": "Jagannath Temple",
    "category": "Religious",
    "description": "Popular temple located in Banjara Hills.",
    "image": "/images/jagannath-temple.jpg",
    "position": [
      17.4106,
      78.437
    ],
    "location": {
      "address": "Jagannath Temple, Telangana",
      "coordinates": [
        78.437,
        17.4106
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-27-27",
    "name": "Mahankali Temple",
    "category": "Religious / Historical",
    "description": "Historic temple dedicated to Goddess Mahankali.",
    "image": "/images/mahankali-temple.jpg",
    "position": [
      17.4423,
      78.4983
    ],
    "location": {
      "address": "Mahankali Temple, Telangana",
      "coordinates": [
        78.4983,
        17.4423
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-28-28",
    "name": "St. Joseph's Cathedral",
    "category": "Religious / Heritage",
    "description": "Historic Catholic cathedral in Hyderabad.",
    "image": "/images/dhanushkodi.jpg",
    "position": [
      17.3898,
      78.479
    ],
    "location": {
      "address": "St. Joseph's Cathedral, Telangana",
      "coordinates": [
        78.479,
        17.3898
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-29-29",
    "name": "Mecca Masjid",
    "category": "Religious / Historical",
    "description": "Important historic mosque near Charminar.",
    "image": "/images/mecca-masjid.jpg",
    "position": [
      17.3604,
      78.4737
    ],
    "location": {
      "address": "Mecca Masjid, Telangana",
      "coordinates": [
        78.4737,
        17.3604
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-30-30",
    "name": "Toli Masjid",
    "category": "Historical Mosque",
    "description": "Historic mosque from the Qutb Shahi period.",
    "image": "/images/toli-masjid.jpg",
    "position": [
      17.369,
      78.417
    ],
    "location": {
      "address": "Toli Masjid, Telangana",
      "coordinates": [
        78.417,
        17.369
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-31-31",
    "name": "Spanish Mosque",
    "category": "Heritage Mosque",
    "description": "Famous mosque known for its unusual architectural style.",
    "image": "/images/spanish-mosque.jpg",
    "position": [
      17.423,
      78.448
    ],
    "location": {
      "address": "Spanish Mosque, Telangana",
      "coordinates": [
        78.448,
        17.423
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-32-32",
    "name": "British Residency",
    "category": "Historical Building",
    "description": "Colonial-era heritage building.",
    "image": "/images/british-residency.jpg",
    "position": [
      17.386,
      78.4892
    ],
    "location": {
      "address": "British Residency, Telangana",
      "coordinates": [
        78.4892,
        17.386
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-33-33",
    "name": "Khursheed Jah Devdi",
    "category": "Historical Palace",
    "description": "Historic palace associated with Hyderabad's royal heritage.",
    "image": "/images/khursheed-jah-devdi.jpg",
    "position": [
      17.3658,
      78.4748
    ],
    "location": {
      "address": "Khursheed Jah Devdi, Telangana",
      "coordinates": [
        78.4748,
        17.3658
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-34-34",
    "name": "Laad Bazaar",
    "category": "Heritage Market",
    "description": "Historic market famous for bangles and traditional shopping.",
    "image": "/images/ethipothala-waterfalls.jpg",
    "position": [
      17.3615,
      78.4749
    ],
    "location": {
      "address": "Laad Bazaar, Telangana",
      "coordinates": [
        78.4749,
        17.3615
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-35-35",
    "name": "Begum Bazaar",
    "category": "Heritage Market",
    "description": "Historic commercial market in the Old City.",
    "image": "/images/begum-bazaar.jpg",
    "position": [
      17.37,
      78.472
    ],
    "location": {
      "address": "Begum Bazaar, Telangana",
      "coordinates": [
        78.472,
        17.37
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-36-36",
    "name": "Shilparamam",
    "category": "Cultural Attraction",
    "description": "Arts and crafts village showcasing Indian traditions.",
    "image": "/images/shilparamam.jpg",
    "position": [
      17.4526,
      78.3792
    ],
    "location": {
      "address": "Shilparamam, Telangana",
      "coordinates": [
        78.3792,
        17.4526
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-37-37",
    "name": "Ramoji Film City",
    "category": "Entertainment",
    "description": "Large film studio and tourist attraction.",
    "image": "/images/gangtok.jpg",
    "position": [
      17.2543,
      78.6806
    ],
    "location": {
      "address": "Ramoji Film City, Telangana",
      "coordinates": [
        78.6806,
        17.2543
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-38-38",
    "name": "Snow World",
    "category": "Entertainment",
    "description": "Indoor snow-themed recreational attraction.",
    "image": "/images/snow-world.jpg",
    "position": [
      17.4144,
      78.48
    ],
    "location": {
      "address": "Snow World, Telangana",
      "coordinates": [
        78.48,
        17.4144
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-39-39",
    "name": "Statue of Equality",
    "category": "Cultural / Religious",
    "description": "Large statue and spiritual-cultural attraction.",
    "image": "/images/statue-of-equality.jpg",
    "position": [
      17.1873,
      78.3312
    ],
    "location": {
      "address": "Statue of Equality, Telangana",
      "coordinates": [
        78.3312,
        17.1873
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-40-40",
    "name": "Osman Sagar",
    "category": "Lake / Scenic",
    "description": "Historic reservoir and scenic destination west of Hyderabad.",
    "image": "/images/osman-sagar.jpg",
    "position": [
      17.382,
      78.298
    ],
    "location": {
      "address": "Osman Sagar, Telangana",
      "coordinates": [
        78.298,
        17.382
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-41-41",
    "name": "Himayat Sagar",
    "category": "Lake / Scenic",
    "description": "Historic reservoir and scenic location near Hyderabad.",
    "image": "/images/himayat-sagar.jpg",
    "position": [
      17.319,
      78.356
    ],
    "location": {
      "address": "Himayat Sagar, Telangana",
      "coordinates": [
        78.356,
        17.319
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-42-42",
    "name": "Mrugavani National Park",
    "category": "Wildlife",
    "description": "Forested national park with wildlife and nature trails.",
    "image": "/images/mrugavani-national-park.jpg",
    "position": [
      17.328,
      78.349
    ],
    "location": {
      "address": "Mrugavani National Park, Telangana",
      "coordinates": [
        78.349,
        17.328
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-43-43",
    "name": "Chilkur Balaji Temple",
    "category": "Religious",
    "description": "Popular temple near Osman Sagar, known as Visa Balaji.",
    "image": "/images/chilkur-balaji.jpg",
    "position": [
      17.3598,
      78.2985
    ],
    "location": {
      "address": "Chilkur Balaji Temple, Telangana",
      "coordinates": [
        78.2985,
        17.3598
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-44-44",
    "name": "Hatiyan Jhad Baobab Tree",
    "category": "Historical / Natural",
    "description": "Ancient baobab tree associated with the Golconda area.",
    "image": "/images/hatiyan-jhad.jpg",
    "position": [
      17.383,
      78.399
    ],
    "location": {
      "address": "Hatiyan Jhad Baobab Tree, Telangana",
      "coordinates": [
        78.399,
        17.383
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-45-45",
    "name": "Golconda Fort Sound & Light Show",
    "category": "Cultural Attraction",
    "description": "Evening historical sound and light presentation at Golconda.",
    "image": "/images/golconda-light-show.jpg",
    "position": [
      17.385,
      78.405
    ],
    "location": {
      "address": "Golconda Fort Sound & Light Show, Telangana",
      "coordinates": [
        78.405,
        17.385
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-46-46",
    "name": "Osmania University",
    "category": "Heritage / Education",
    "description": "Historic university campus known for Indo-Islamic architecture.",
    "image": "/images/osmania-university.jpg",
    "position": [
      17.413,
      78.528
    ],
    "location": {
      "address": "Osmania University, Telangana",
      "coordinates": [
        78.528,
        17.413
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-47-47",
    "name": "Osmania General Hospital",
    "category": "Heritage Building",
    "description": "Historic hospital building associated with Hyderabad's heritage.",
    "image": "/images/osmania-general-hospital.jpg",
    "position": [
      17.371,
      78.477
    ],
    "location": {
      "address": "Osmania General Hospital, Telangana",
      "coordinates": [
        78.477,
        17.371
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-48-48",
    "name": "Moazzam Jahi Market",
    "category": "Heritage Market",
    "description": "Historic market known for its distinctive architecture.",
    "image": "/images/moazzam-jahi-market.jpg",
    "position": [
      17.394,
      78.474
    ],
    "location": {
      "address": "Moazzam Jahi Market, Telangana",
      "coordinates": [
        78.474,
        17.394
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-49-49",
    "name": "Public Gardens",
    "category": "Park / Heritage",
    "description": "Historic public garden area in central Hyderabad.",
    "image": "/images/public-gardens.jpg",
    "position": [
      17.399,
      78.468
    ],
    "location": {
      "address": "Public Gardens, Telangana",
      "coordinates": [
        78.468,
        17.399
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-50-50",
    "name": "NTR Statue",
    "category": "Tourist Attraction",
    "description": "Landmark statue located near Hussain Sagar.",
    "image": "/images/ntr-statue.jpg",
    "position": [
      17.41,
      78.471
    ],
    "location": {
      "address": "NTR Statue, Telangana",
      "coordinates": [
        78.471,
        17.41
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-1-52",
    "name": "Charminar",
    "category": "Historical Monument",
    "description": "Iconic four-minaret monument built in 1591 and a major symbol of Hyderabad.",
    "image": "/images/charminar.jpg",
    "position": [
      17.3614,
      78.4747
    ],
    "location": {
      "address": "Charminar, Telangana",
      "coordinates": [
        78.4747,
        17.3614
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-2-53",
    "name": "Golconda Fort",
    "category": "Historical Fort",
    "description": "Historic fort and former capital of the Golconda Sultanate.",
    "image": "/images/golconda-fort.jpg",
    "position": [
      17.385,
      78.4041
    ],
    "location": {
      "address": "Golconda Fort, Telangana",
      "coordinates": [
        78.4041,
        17.385
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-3-54",
    "name": "Qutb Shahi Tombs",
    "category": "Historical Monument",
    "description": "Royal tomb complex of the Qutb Shahi dynasty.",
    "image": "/images/kadam-dam.jpg",
    "position": [
      17.3952,
      78.3968
    ],
    "location": {
      "address": "Qutb Shahi Tombs, Telangana",
      "coordinates": [
        78.3968,
        17.3952
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-4-55",
    "name": "Chowmahalla Palace",
    "category": "Historical Palace",
    "description": "Grand palace complex associated with the Nizams of Hyderabad.",
    "image": "/images/chowmahalla-palace.jpg",
    "position": [
      17.3578,
      78.4717
    ],
    "location": {
      "address": "Chowmahalla Palace, Telangana",
      "coordinates": [
        78.4717,
        17.3578
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-5-56",
    "name": "Salar Jung Museum",
    "category": "Museum",
    "description": "Museum containing art, antiques, manuscripts and historical objects.",
    "image": "/images/salar-jung-museum.jpg",
    "position": [
      17.3713,
      78.4804
    ],
    "location": {
      "address": "Salar Jung Museum, Telangana",
      "coordinates": [
        78.4804,
        17.3713
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-6-57",
    "name": "Nizam's Museum",
    "category": "Museum",
    "description": "Museum displaying objects and gifts associated with the Nizams.",
    "image": "/images/kashi-bugga-temple.jpg",
    "position": [
      17.3617,
      78.4728
    ],
    "location": {
      "address": "Nizam's Museum, Telangana",
      "coordinates": [
        78.4728,
        17.3617
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-7-58",
    "name": "Purani Haveli",
    "category": "Historical Palace",
    "description": "Historic palace associated with the Nizam family.",
    "image": "/images/purani-haveli.jpg",
    "position": [
      17.3612,
      78.4758
    ],
    "location": {
      "address": "Purani Haveli, Telangana",
      "coordinates": [
        78.4758,
        17.3612
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-8-59",
    "name": "Mecca Masjid",
    "category": "Historical Mosque",
    "description": "One of Hyderabad's major historic mosques near Charminar.",
    "image": "/images/mecca-masjid.jpg",
    "position": [
      17.3604,
      78.4737
    ],
    "location": {
      "address": "Mecca Masjid, Telangana",
      "coordinates": [
        78.4737,
        17.3604
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-9-60",
    "name": "Paigah Tombs",
    "category": "Historical Monument",
    "description": "Historic tomb complex known for detailed architectural decoration.",
    "image": "/images/paigah-tombs.jpg",
    "position": [
      17.3459,
      78.5013
    ],
    "location": {
      "address": "Paigah Tombs, Telangana",
      "coordinates": [
        78.5013,
        17.3459
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-10-61",
    "name": "Taramati Baradari",
    "category": "Historical Monument",
    "description": "Historic pavilion associated with the Golconda period.",
    "image": "/images/taramati-baradari.jpg",
    "position": [
      17.3848,
      78.3679
    ],
    "location": {
      "address": "Taramati Baradari, Telangana",
      "coordinates": [
        78.3679,
        17.3848
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-11-62",
    "name": "Khursheed Jah Devdi",
    "category": "Historical Palace",
    "description": "Historic palace reflecting Hyderabad's royal architecture.",
    "image": "/images/khursheed-jah-devdi.jpg",
    "position": [
      17.3658,
      78.4748
    ],
    "location": {
      "address": "Khursheed Jah Devdi, Telangana",
      "coordinates": [
        78.4748,
        17.3658
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-12-63",
    "name": "British Residency",
    "category": "Historical Building",
    "description": "Colonial-era building connected with Hyderabad's political history.",
    "image": "/images/british-residency.jpg",
    "position": [
      17.386,
      78.4892
    ],
    "location": {
      "address": "British Residency, Telangana",
      "coordinates": [
        78.4892,
        17.386
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-13-64",
    "name": "Hussain Sagar Lake",
    "category": "Tourist Spot",
    "description": "Historic lake connecting Hyderabad and Secunderabad.",
    "image": "/images/hussain-sagar.jpg",
    "position": [
      17.4239,
      78.4738
    ],
    "location": {
      "address": "Hussain Sagar Lake, Telangana",
      "coordinates": [
        78.4738,
        17.4239
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-14-65",
    "name": "Buddha Statue",
    "category": "Tourist Attraction",
    "description": "Large Buddha statue located in Hussain Sagar Lake.",
    "image": "/images/buddha-statue.jpg",
    "position": [
      17.4156,
      78.475
    ],
    "location": {
      "address": "Buddha Statue, Telangana",
      "coordinates": [
        78.475,
        17.4156
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-15-66",
    "name": "Lumbini Park",
    "category": "Park",
    "description": "Popular lakeside park near Hussain Sagar.",
    "image": "/images/Lumbini-Park.jpg",
    "position": [
      17.4099,
      78.4732
    ],
    "location": {
      "address": "Lumbini Park, Telangana",
      "coordinates": [
        78.4732,
        17.4099
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-16-67",
    "name": "Necklace Road",
    "category": "Tourist Spot",
    "description": "Scenic road around Hussain Sagar with recreational attractions.",
    "image": "/images/necklace-road.jpg",
    "position": [
      17.4237,
      78.459
    ],
    "location": {
      "address": "Necklace Road, Telangana",
      "coordinates": [
        78.459,
        17.4237
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-17-68",
    "name": "Shilparamam",
    "category": "Cultural Tourist Spot",
    "description": "Arts and crafts village showcasing Indian culture and handicrafts.",
    "image": "/images/shilparamam.jpg",
    "position": [
      17.4526,
      78.3792
    ],
    "location": {
      "address": "Shilparamam, Telangana",
      "coordinates": [
        78.3792,
        17.4526
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-18-69",
    "name": "Ramoji Film City",
    "category": "Entertainment",
    "description": "Large film studio complex and tourist attraction.",
    "image": "/images/kondapochamma-sagar.jpg",
    "position": [
      17.2543,
      78.6806
    ],
    "location": {
      "address": "Ramoji Film City, Telangana",
      "coordinates": [
        78.6806,
        17.2543
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-19-70",
    "name": "Nehru Zoological Park",
    "category": "Wildlife",
    "description": "Large zoological park with various animals and attractions.",
    "image": "/images/nehru-zoological-Park.jpg",
    "position": [
      17.3507,
      78.4513
    ],
    "location": {
      "address": "Nehru Zoological Park, Telangana",
      "coordinates": [
        78.4513,
        17.3507
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-20-71",
    "name": "Birla Mandir",
    "category": "Religious Tourist Spot",
    "description": "Hilltop temple known for white marble architecture.",
    "image": "/images/birla-mandir.jpg",
    "position": [
      17.4062,
      78.4691
    ],
    "location": {
      "address": "Birla Mandir, Telangana",
      "coordinates": [
        78.4691,
        17.4062
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-21-72",
    "name": "Falaknuma Palace",
    "category": "Historical Palace",
    "description": "Historic palace associated with the Nizam era.",
    "image": "/images/kuntala-waterfalls.jpg",
    "position": [
      17.3314,
      78.4678
    ],
    "location": {
      "address": "Falaknuma Palace, Telangana",
      "coordinates": [
        78.4678,
        17.3314
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-22-73",
    "name": "Telangana State Archaeology Museum",
    "category": "Archaeological Museum",
    "description": "Museum containing archaeological and historical collections.",
    "image": "/images/laad-bazaar.jpg",
    "position": [
      17.4008,
      78.467
    ],
    "location": {
      "address": "Telangana State Archaeology Museum, Telangana",
      "coordinates": [
        78.467,
        17.4008
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-23-74",
    "name": "B. M. Birla Science Centre",
    "category": "Science Museum",
    "description": "Science museum and planetarium complex.",
    "image": "/images/lothal.jpg",
    "position": [
      17.4067,
      78.4696
    ],
    "location": {
      "address": "B. M. Birla Science Centre, Telangana",
      "coordinates": [
        78.4696,
        17.4067
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-24-75",
    "name": "Sudha Car Museum",
    "category": "Museum",
    "description": "Museum displaying unusual and creatively designed cars.",
    "image": "/images/sudha-car-museum.jpg",
    "position": [
      17.3497,
      78.4516
    ],
    "location": {
      "address": "Sudha Car Museum, Telangana",
      "coordinates": [
        78.4516,
        17.3497
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-25-76",
    "name": "NTR Gardens",
    "category": "Park",
    "description": "Recreational garden beside Hussain Sagar.",
    "image": "/images/Lumbini-Park.jpg",
    "position": [
      17.4131,
      78.4691
    ],
    "location": {
      "address": "NTR Gardens, Telangana",
      "coordinates": [
        78.4691,
        17.4131
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-26-77",
    "name": "Indira Park",
    "category": "Park",
    "description": "Large urban park near Lower Tank Bund.",
    "image": "/images/indira-park.jpg",
    "position": [
      17.4147,
      78.4812
    ],
    "location": {
      "address": "Indira Park, Telangana",
      "coordinates": [
        78.4812,
        17.4147
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-27-78",
    "name": "Sanjeevaiah Park",
    "category": "Park",
    "description": "Large lakeside park near Hussain Sagar.",
    "image": "/images/mahankali-temple.jpg",
    "position": [
      17.4234,
      78.4752
    ],
    "location": {
      "address": "Sanjeevaiah Park, Telangana",
      "coordinates": [
        78.4752,
        17.4234
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-28-79",
    "name": "KBR National Park",
    "category": "Wildlife / Park",
    "description": "Urban national park known for greenery and wildlife.",
    "image": "/images/kbr-national-park.jpg",
    "position": [
      17.4239,
      78.415
    ],
    "location": {
      "address": "KBR National Park, Telangana",
      "coordinates": [
        78.415,
        17.4239
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-29-80",
    "name": "Mir Alam Tank",
    "category": "Lake",
    "description": "Historic lake and water body near the zoo.",
    "image": "/images/mir-alam-tank.jpg",
    "position": [
      17.3325,
      78.45
    ],
    "location": {
      "address": "Mir Alam Tank, Telangana",
      "coordinates": [
        78.45,
        17.3325
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-30-81",
    "name": "Jagannath Temple",
    "category": "Temple",
    "description": "Popular temple dedicated to Lord Jagannath.",
    "image": "/images/jagannath-temple.jpg",
    "position": [
      17.4106,
      78.437
    ],
    "location": {
      "address": "Jagannath Temple, Telangana",
      "coordinates": [
        78.437,
        17.4106
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-31-82",
    "name": "Mahankali Temple",
    "category": "Religious / Historical",
    "description": "Historic temple dedicated to Goddess Mahankali.",
    "image": "/images/mahankali-temple.jpg",
    "position": [
      17.4423,
      78.4983
    ],
    "location": {
      "address": "Mahankali Temple, Telangana",
      "coordinates": [
        78.4983,
        17.4423
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-32-83",
    "name": "St. Joseph's Cathedral",
    "category": "Religious / Heritage",
    "description": "Historic Catholic cathedral in Hyderabad.",
    "image": "/images/medakcathedral.jpg",
    "position": [
      17.3898,
      78.479
    ],
    "location": {
      "address": "St. Joseph's Cathedral, Telangana",
      "coordinates": [
        78.479,
        17.3898
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-33-84",
    "name": "Toli Masjid",
    "category": "Historical Mosque",
    "description": "Historic mosque from the Qutb Shahi period.",
    "image": "/images/toli-masjid.jpg",
    "position": [
      17.369,
      78.417
    ],
    "location": {
      "address": "Toli Masjid, Telangana",
      "coordinates": [
        78.417,
        17.369
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-34-85",
    "name": "Spanish Mosque",
    "category": "Heritage Mosque",
    "description": "Famous mosque known for its unusual architecture.",
    "image": "/images/spanish-mosque.jpg",
    "position": [
      17.423,
      78.448
    ],
    "location": {
      "address": "Spanish Mosque, Telangana",
      "coordinates": [
        78.448,
        17.423
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-35-86",
    "name": "Laad Bazaar",
    "category": "Heritage Market",
    "description": "Historic market famous for bangles and traditional shopping.",
    "image": "/images/moazzam-jahi-market.jpg",
    "position": [
      17.3615,
      78.4749
    ],
    "location": {
      "address": "Laad Bazaar, Telangana",
      "coordinates": [
        78.4749,
        17.3615
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-36-87",
    "name": "Begum Bazaar",
    "category": "Heritage Market",
    "description": "Historic commercial market in the Old City.",
    "image": "/images/begum-bazaar.jpg",
    "position": [
      17.37,
      78.472
    ],
    "location": {
      "address": "Begum Bazaar, Telangana",
      "coordinates": [
        78.472,
        17.37
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-37-88",
    "name": "Snow World",
    "category": "Entertainment",
    "description": "Indoor snow-themed recreational attraction.",
    "image": "/images/snow-world.jpg",
    "position": [
      17.4144,
      78.48
    ],
    "location": {
      "address": "Snow World, Telangana",
      "coordinates": [
        78.48,
        17.4144
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-38-89",
    "name": "Statue of Equality",
    "category": "Cultural / Religious",
    "description": "Large statue and spiritual-cultural attraction.",
    "image": "/images/statue-of-equality.jpg",
    "position": [
      17.1873,
      78.3312
    ],
    "location": {
      "address": "Statue of Equality, Telangana",
      "coordinates": [
        78.3312,
        17.1873
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-39-90",
    "name": "Osman Sagar",
    "category": "Lake / Scenic",
    "description": "Historic reservoir and scenic destination.",
    "image": "/images/osman-sagar.jpg",
    "position": [
      17.382,
      78.298
    ],
    "location": {
      "address": "Osman Sagar, Telangana",
      "coordinates": [
        78.298,
        17.382
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-40-91",
    "name": "Himayat Sagar",
    "category": "Lake / Scenic",
    "description": "Historic reservoir and scenic location.",
    "image": "/images/himayat-sagar.jpg",
    "position": [
      17.319,
      78.356
    ],
    "location": {
      "address": "Himayat Sagar, Telangana",
      "coordinates": [
        78.356,
        17.319
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-41-92",
    "name": "Mrugavani National Park",
    "category": "Wildlife",
    "description": "Forested national park with wildlife and nature trails.",
    "image": "/images/mrugavani-national-park.jpg",
    "position": [
      17.328,
      78.349
    ],
    "location": {
      "address": "Mrugavani National Park, Telangana",
      "coordinates": [
        78.349,
        17.328
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-42-93",
    "name": "Chilkur Balaji Temple",
    "category": "Temple",
    "description": "Popular temple dedicated to Lord Venkateswara.",
    "image": "/images/chilkur-balaji.jpg",
    "position": [
      17.3598,
      78.2985
    ],
    "location": {
      "address": "Chilkur Balaji Temple, Telangana",
      "coordinates": [
        78.2985,
        17.3598
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-43-94",
    "name": "Ramappa Temple",
    "category": "Historical Temple",
    "description": "UNESCO World Heritage Kakatiya temple famous for stone carvings.",
    "image": "/images/nehru-zoological-Park.jpg",
    "position": [
      18.2587,
      79.9443
    ],
    "location": {
      "address": "Ramappa Temple, Telangana",
      "coordinates": [
        79.9443,
        18.2587
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-44-95",
    "name": "Thousand Pillar Temple",
    "category": "Historical Temple",
    "description": "Historic Kakatiya temple dedicated to Shiva, Vishnu and Surya.",
    "image": "/images/netarhat.jpg",
    "position": [
      17.9944,
      79.5746
    ],
    "location": {
      "address": "Thousand Pillar Temple, Telangana",
      "coordinates": [
        79.5746,
        17.9944
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-45-96",
    "name": "Warangal Fort",
    "category": "Historical Fort",
    "description": "Major Kakatiya fort with impressive stone gateways and ruins.",
    "image": "/images/Nirmal-Fort.jpg",
    "position": [
      17.9547,
      79.6177
    ],
    "location": {
      "address": "Warangal Fort, Telangana",
      "coordinates": [
        79.6177,
        17.9547
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-46-97",
    "name": "Bhadrakali Temple",
    "category": "Temple",
    "description": "Ancient temple dedicated to Goddess Bhadrakali.",
    "image": "/images/nizam-museum.jpg",
    "position": [
      17.989,
      79.576
    ],
    "location": {
      "address": "Bhadrakali Temple, Telangana",
      "coordinates": [
        79.576,
        17.989
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-47-98",
    "name": "Pakhal Lake",
    "category": "Lake / Nature",
    "description": "Scenic historic lake surrounded by forest and wildlife.",
    "image": "/images/Nizam_Sagar.jpg",
    "position": [
      17.994,
      80.026
    ],
    "location": {
      "address": "Pakhal Lake, Telangana",
      "coordinates": [
        80.026,
        17.994
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-48-99",
    "name": "Pakhal Wildlife Sanctuary",
    "category": "Wildlife",
    "description": "Forest sanctuary surrounding Pakhal Lake.",
    "image": "/images/ntr-garden.jpg",
    "position": [
      17.96,
      80.08
    ],
    "location": {
      "address": "Pakhal Wildlife Sanctuary, Telangana",
      "coordinates": [
        80.08,
        17.96
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-49-100",
    "name": "Laknavaram Lake",
    "category": "Lake / Adventure",
    "description": "Beautiful lake famous for its suspension bridge and boating.",
    "image": "/images/ntr-statue.jpg",
    "position": [
      18.15,
      79.9667
    ],
    "location": {
      "address": "Laknavaram Lake, Telangana",
      "coordinates": [
        79.9667,
        18.15
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-50-101",
    "name": "Bogatha Waterfalls",
    "category": "Waterfall",
    "description": "Popular waterfall known as the Niagara of Telangana.",
    "image": "/images/orchha-fort.jpg",
    "position": [
      17.914,
      80.25
    ],
    "location": {
      "address": "Bogatha Waterfalls, Telangana",
      "coordinates": [
        80.25,
        17.914
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-51-102",
    "name": "Kaleshwaram Temple",
    "category": "Temple",
    "description": "Famous Shiva temple near the Godavari and Pranahita rivers.",
    "image": "/images/osman-sagar.jpg",
    "position": [
      18.811,
      79.906
    ],
    "location": {
      "address": "Kaleshwaram Temple, Telangana",
      "coordinates": [
        79.906,
        18.811
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-52-103",
    "name": "Medaram",
    "category": "Religious / Cultural",
    "description": "Famous tribal pilgrimage destination associated with Sammakka Saralamma Jatara.",
    "image": "/images/osmania-general-hospital.jpg",
    "position": [
      18.335,
      80.001
    ],
    "location": {
      "address": "Medaram, Telangana",
      "coordinates": [
        80.001,
        18.335
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-53-104",
    "name": "Yadadri Temple",
    "category": "Temple",
    "description": "Major hilltop temple dedicated to Lord Lakshmi Narasimha.",
    "image": "/images/osmania-university.jpg",
    "position": [
      17.588,
      78.948
    ],
    "location": {
      "address": "Yadadri Temple, Telangana",
      "coordinates": [
        78.948,
        17.588
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-54-105",
    "name": "Bhongir Fort",
    "category": "Historical Fort",
    "description": "Massive hilltop fort built on a monolithic rock.",
    "image": "/images/paigah-tombs.jpg",
    "position": [
      17.516,
      78.885
    ],
    "location": {
      "address": "Bhongir Fort, Telangana",
      "coordinates": [
        78.885,
        17.516
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-55-106",
    "name": "Kolanupaka Jain Temple",
    "category": "Temple / Heritage",
    "description": "Ancient Jain temple known for historic sculptures and architecture.",
    "image": "/images/panchgani.jpg",
    "position": [
      17.486,
      79.013
    ],
    "location": {
      "address": "Kolanupaka Jain Temple, Telangana",
      "coordinates": [
        79.013,
        17.486
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-56-107",
    "name": "Phanigiri Buddhist Site",
    "category": "Buddhist Heritage",
    "description": "Important ancient Buddhist archaeological site.",
    "image": "/images/Parnasala.jpg",
    "position": [
      17.236,
      79.536
    ],
    "location": {
      "address": "Phanigiri Buddhist Site, Telangana",
      "coordinates": [
        79.536,
        17.236
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-57-108",
    "name": "Pillalamarri",
    "category": "Heritage / Nature",
    "description": "Historic banyan tree and cultural attraction.",
    "image": "/images/patna-sahib.jpg",
    "position": [
      16.997,
      79.694
    ],
    "location": {
      "address": "Pillalamarri, Telangana",
      "coordinates": [
        79.694,
        16.997
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-58-109",
    "name": "Nagarjuna Sagar",
    "category": "Dam / Tourism",
    "description": "Major dam and scenic destination on the Krishna River.",
    "image": "/images/Nagarjuna_Sagar.jpg",
    "position": [
      16.5772,
      79.3134
    ],
    "location": {
      "address": "Nagarjuna Sagar, Telangana",
      "coordinates": [
        79.3134,
        16.5772
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-59-110",
    "name": "Nagarjunakonda",
    "category": "Buddhist Heritage",
    "description": "Historic Buddhist archaeological site and museum area.",
    "image": "/images/nagarjunakonda.jpg",
    "position": [
      16.533,
      79.25
    ],
    "location": {
      "address": "Nagarjunakonda, Telangana",
      "coordinates": [
        79.25,
        16.533
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-60-111",
    "name": "Ethipothala Waterfalls",
    "category": "Waterfall",
    "description": "Scenic waterfall formed by the Chandravanka stream.",
    "image": "/images/ethipothala-waterfalls.jpg",
    "position": [
      16.874,
      79.449
    ],
    "location": {
      "address": "Ethipothala Waterfalls, Telangana",
      "coordinates": [
        79.449,
        16.874
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-61-112",
    "name": "Devarakonda Fort",
    "category": "Historical Fort",
    "description": "Historic hill fort associated with medieval Telangana history.",
    "image": "/images/devarakonda-fort.jpg",
    "position": [
      16.69,
      79.35
    ],
    "location": {
      "address": "Devarakonda Fort, Telangana",
      "coordinates": [
        79.35,
        16.69
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-62-113",
    "name": "Chaya Someswara Temple",
    "category": "Historical Temple",
    "description": "Historic temple famous for its unique shadow phenomenon.",
    "image": "/images/pocharam-dam.jpg",
    "position": [
      17.06,
      79.26
    ],
    "location": {
      "address": "Chaya Someswara Temple, Telangana",
      "coordinates": [
        79.26,
        17.06
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-63-114",
    "name": "Vemulawada Rajarajeshwara Temple",
    "category": "Temple",
    "description": "Famous Shiva temple and major pilgrimage centre.",
    "image": "/images/vemulawada-temple.jpg",
    "position": [
      18.465,
      78.868
    ],
    "location": {
      "address": "Vemulawada Rajarajeshwara Temple, Telangana",
      "coordinates": [
        78.868,
        18.465
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-64-115",
    "name": "Kondagattu Anjaneya Swamy Temple",
    "category": "Temple",
    "description": "Popular Hanuman temple situated among scenic hills.",
    "image": "/images/pochera-waterfalls.jpg",
    "position": [
      18.68,
      78.91
    ],
    "location": {
      "address": "Kondagattu Anjaneya Swamy Temple, Telangana",
      "coordinates": [
        78.91,
        18.68
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-65-116",
    "name": "Dharmapuri Lakshmi Narasimha Temple",
    "category": "Temple",
    "description": "Historic temple dedicated to Lord Narasimha near the Godavari.",
    "image": "/images/dharmapuri-temple.jpg",
    "position": [
      18.95,
      79.09
    ],
    "location": {
      "address": "Dharmapuri Lakshmi Narasimha Temple, Telangana",
      "coordinates": [
        79.09,
        18.95
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-66-117",
    "name": "Ramagiri Fort",
    "category": "Historical Fort",
    "description": "Historic hill fort surrounded by natural scenery.",
    "image": "/images/ramagiri-fort.jpg",
    "position": [
      18.59,
      79.43
    ],
    "location": {
      "address": "Ramagiri Fort, Telangana",
      "coordinates": [
        79.43,
        18.59
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-67-118",
    "name": "Elgandal Fort",
    "category": "Historical Fort",
    "description": "Historic fort overlooking the Maner River.",
    "image": "/images/Elgandal_Fort.jpg",
    "position": [
      18.4235,
      79.0347
    ],
    "location": {
      "address": "Elgandal Fort, Telangana",
      "coordinates": [
        79.0347,
        18.4235
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-68-119",
    "name": "Lower Manair Dam",
    "category": "Dam / Nature",
    "description": "Popular scenic reservoir and recreational destination.",
    "image": "/images/lower-manair-dam.jpg",
    "position": [
      18.438,
      79.15
    ],
    "location": {
      "address": "Lower Manair Dam, Telangana",
      "coordinates": [
        79.15,
        18.438
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-69-120",
    "name": "Kuntala Waterfalls",
    "category": "Waterfall",
    "description": "One of Telangana's most popular waterfalls.",
    "image": "/images/kuntala-waterfalls.jpg",
    "position": [
      19.35,
      78.82
    ],
    "location": {
      "address": "Kuntala Waterfalls, Telangana",
      "coordinates": [
        78.82,
        19.35
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-70-121",
    "name": "Pochera Waterfalls",
    "category": "Waterfall",
    "description": "Scenic waterfall surrounded by rocky terrain and greenery.",
    "image": "/images/pochera-waterfalls.jpg",
    "position": [
      19.32,
      78.81
    ],
    "location": {
      "address": "Pochera Waterfalls, Telangana",
      "coordinates": [
        78.81,
        19.32
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-71-122",
    "name": "Basara Saraswathi Temple",
    "category": "Temple",
    "description": "Famous temple dedicated to Goddess Saraswati.",
    "image": "/images/basara-temple.jpg",
    "position": [
      18.88,
      77.95
    ],
    "location": {
      "address": "Basara Saraswathi Temple, Telangana",
      "coordinates": [
        77.95,
        18.88
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-72-123",
    "name": "Nirmal Fort",
    "category": "Historical Fort",
    "description": "Historic fort associated with the Nirmal region.",
    "image": "/images/Nirmal-Fort.jpg",
    "position": [
      19.096,
      78.344
    ],
    "location": {
      "address": "Nirmal Fort, Telangana",
      "coordinates": [
        78.344,
        19.096
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-73-124",
    "name": "Kadam Dam",
    "category": "Dam / Nature",
    "description": "Scenic reservoir surrounded by forest and hills.",
    "image": "/images/kadam-dam.jpg",
    "position": [
      19.12,
      78.82
    ],
    "location": {
      "address": "Kadam Dam, Telangana",
      "coordinates": [
        78.82,
        19.12
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-74-125",
    "name": "Jainath Temple",
    "category": "Historical Temple",
    "description": "Ancient temple dedicated to Lord Lakshmi Narasimha.",
    "image": "/images/jainath-temple.jpg",
    "position": [
      19.67,
      78.53
    ],
    "location": {
      "address": "Jainath Temple, Telangana",
      "coordinates": [
        78.53,
        19.67
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-75-126",
    "name": "Kawal Tiger Reserve",
    "category": "Wildlife",
    "description": "Major tiger reserve with forests and diverse wildlife.",
    "image": "/images/kawal-tiger-reserve.jpg",
    "position": [
      19.16,
      79.4
    ],
    "location": {
      "address": "Kawal Tiger Reserve, Telangana",
      "coordinates": [
        79.4,
        19.16
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-76-127",
    "name": "Pranahita Wildlife Sanctuary",
    "category": "Wildlife",
    "description": "Wildlife sanctuary along the Pranahita River.",
    "image": "/images/pranahita-wildlife-sanctuary.jpg",
    "position": [
      18.97,
      79.82
    ],
    "location": {
      "address": "Pranahita Wildlife Sanctuary, Telangana",
      "coordinates": [
        79.82,
        18.97
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-77-128",
    "name": "Bhadrachalam Temple",
    "category": "Temple",
    "description": "Famous Sri Sita Ramachandra Swamy temple on the Godavari.",
    "image": "/images/bhadrachalam-temple.jpg",
    "position": [
      17.6688,
      80.8929
    ],
    "location": {
      "address": "Bhadrachalam Temple, Telangana",
      "coordinates": [
        80.8929,
        17.6688
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-78-129",
    "name": "Parnasala",
    "category": "Religious / Historical",
    "description": "Important Ramayana-associated destination near Bhadrachalam.",
    "image": "/images/Parnasala.jpg",
    "position": [
      17.56,
      80.89
    ],
    "location": {
      "address": "Parnasala, Telangana",
      "coordinates": [
        80.89,
        17.56
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-79-130",
    "name": "Kinnerasani Wildlife Sanctuary",
    "category": "Wildlife",
    "description": "Forest and wildlife destination around Kinnerasani reservoir.",
    "image": "/images/kinnerasani-wildlife.jpg",
    "position": [
      17.75,
      80.7
    ],
    "location": {
      "address": "Kinnerasani Wildlife Sanctuary, Telangana",
      "coordinates": [
        80.7,
        17.75
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-80-131",
    "name": "Kinnerasani Dam",
    "category": "Dam / Nature",
    "description": "Scenic reservoir surrounded by forest.",
    "image": "/images/Kinnerasani_Dam.jpg",
    "position": [
      17.78,
      80.68
    ],
    "location": {
      "address": "Kinnerasani Dam, Telangana",
      "coordinates": [
        80.68,
        17.78
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-81-132",
    "name": "Mallela Theertham",
    "category": "Waterfall / Nature",
    "description": "Forest waterfall located in the Nallamala hills.",
    "image": "/images/mallela-theertham.jpg",
    "position": [
      16.14,
      78.95
    ],
    "location": {
      "address": "Mallela Theertham, Telangana",
      "coordinates": [
        78.95,
        16.14
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-82-133",
    "name": "Amrabad Tiger Reserve",
    "category": "Wildlife",
    "description": "Large protected forest area of the Nallamala hills.",
    "image": "/images/amrabad-tiger-reserve.jpg",
    "position": [
      16.15,
      78.7
    ],
    "location": {
      "address": "Amrabad Tiger Reserve, Telangana",
      "coordinates": [
        78.7,
        16.15
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-83-134",
    "name": "Uma Maheshwaram Temple",
    "category": "Temple / Nature",
    "description": "Ancient Shiva temple located in the Nallamala hills.",
    "image": "/images/uma-maheshwaram.jpg",
    "position": [
      16.1,
      78.85
    ],
    "location": {
      "address": "Uma Maheshwaram Temple, Telangana",
      "coordinates": [
        78.85,
        16.1
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-84-135",
    "name": "Alampur Jogulamba Temple",
    "category": "Temple / Heritage",
    "description": "Historic Shakti Peetha and major pilgrimage destination.",
    "image": "/images/alampur-jogulamba.jpg",
    "position": [
      15.8825,
      78.1294
    ],
    "location": {
      "address": "Alampur Jogulamba Temple, Telangana",
      "coordinates": [
        78.1294,
        15.8825
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-85-136",
    "name": "Gadwal Fort",
    "category": "Historical Fort",
    "description": "Historic fort associated with Gadwal Samsthanam.",
    "image": "/images/gadwal-fort.jpg",
    "position": [
      16.235,
      77.8
    ],
    "location": {
      "address": "Gadwal Fort, Telangana",
      "coordinates": [
        77.8,
        16.235
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-86-137",
    "name": "Jurala Dam",
    "category": "Dam / Nature",
    "description": "Scenic dam on the Krishna River.",
    "image": "/images/jurala-dam.jpg",
    "position": [
      16.25,
      77.78
    ],
    "location": {
      "address": "Jurala Dam, Telangana",
      "coordinates": [
        77.78,
        16.25
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-87-138",
    "name": "Koilsagar Dam",
    "category": "Dam / Nature",
    "description": "Scenic reservoir surrounded by hills.",
    "image": "/images/koilsagar-dam.jpg",
    "position": [
      16.43,
      77.8
    ],
    "location": {
      "address": "Koilsagar Dam, Telangana",
      "coordinates": [
        77.8,
        16.43
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-88-139",
    "name": "Wanaparthy Palace",
    "category": "Historical Palace",
    "description": "Historic palace associated with Wanaparthy Samsthanam.",
    "image": "/images/Wanaparthy-palace.jpg",
    "position": [
      16.36,
      78.06
    ],
    "location": {
      "address": "Wanaparthy Palace, Telangana",
      "coordinates": [
        78.06,
        16.36
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-89-140",
    "name": "Ananthagiri Hills",
    "category": "Hills / Adventure",
    "description": "Popular destination for trekking, camping and nature tourism.",
    "image": "/images/statue-of-equality.jpg",
    "position": [
      17.3117,
      77.8658
    ],
    "location": {
      "address": "Ananthagiri Hills, Telangana",
      "coordinates": [
        77.8658,
        17.3117
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-90-141",
    "name": "Kotepally Reservoir",
    "category": "Lake / Adventure",
    "description": "Scenic reservoir popular for kayaking and outdoor activities.",
    "image": "/images/kotepally-reservoir.jpg",
    "position": [
      17.3,
      77.87
    ],
    "location": {
      "address": "Kotepally Reservoir, Telangana",
      "coordinates": [
        77.87,
        17.3
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-91-142",
    "name": "Domakonda Fort",
    "category": "Historical Fort",
    "description": "Historic fort-palace complex with distinctive architecture.",
    "image": "/images/domakonda-fort.jpg",
    "position": [
      18.26,
      78.45
    ],
    "location": {
      "address": "Domakonda Fort, Telangana",
      "coordinates": [
        78.45,
        18.26
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-92-143",
    "name": "Nizam Sagar",
    "category": "Dam / Lake",
    "description": "Historic reservoir and scenic destination.",
    "image": "/images/Nizam_Sagar.jpg",
    "position": [
      18.09,
      77.97
    ],
    "location": {
      "address": "Nizam Sagar, Telangana",
      "coordinates": [
        77.97,
        18.09
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-93-144",
    "name": "Medak Cathedral",
    "category": "Heritage Church",
    "description": "Famous Gothic-style cathedral and major heritage landmark.",
    "image": "/images/medakcathedral.jpg",
    "position": [
      18.046,
      78.262
    ],
    "location": {
      "address": "Medak Cathedral, Telangana",
      "coordinates": [
        78.262,
        18.046
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-94-145",
    "name": "Medak Fort",
    "category": "Historical Fort",
    "description": "Historic fort located on a hill overlooking Medak town.",
    "image": "/images/medak-fort.jpg",
    "position": [
      18.0456,
      78.2612
    ],
    "location": {
      "address": "Medak Fort, Telangana",
      "coordinates": [
        78.2612,
        18.0456
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-95-146",
    "name": "Pocharam Wildlife Sanctuary",
    "category": "Wildlife",
    "description": "Wildlife sanctuary surrounding Pocharam reservoir.",
    "image": "/images/Pocharam-sanctuary.jpg",
    "position": [
      18.18,
      78.1
    ],
    "location": {
      "address": "Pocharam Wildlife Sanctuary, Telangana",
      "coordinates": [
        78.1,
        18.18
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-96-147",
    "name": "Pocharam Dam",
    "category": "Dam / Nature",
    "description": "Scenic reservoir and bird-watching destination.",
    "image": "/images/pocharam-dam.jpg",
    "position": [
      18.18,
      78.11
    ],
    "location": {
      "address": "Pocharam Dam, Telangana",
      "coordinates": [
        78.11,
        18.18
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-97-148",
    "name": "Komuravelli Mallanna Temple",
    "category": "Temple",
    "description": "Popular temple dedicated to Mallanna on a hill.",
    "image": "/images/vemulawada-temple.jpg",
    "position": [
      17.952,
      78.905
    ],
    "location": {
      "address": "Komuravelli Mallanna Temple, Telangana",
      "coordinates": [
        78.905,
        17.952
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-98-149",
    "name": "Kondapochamma Sagar",
    "category": "Lake / Nature",
    "description": "Large reservoir and recreational destination.",
    "image": "/images/kondapochamma-sagar.jpg",
    "position": [
      17.7812,
      78.6811
    ],
    "location": {
      "address": "Kondapochamma Sagar, Telangana",
      "coordinates": [
        78.6811,
        17.7812
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-99-150",
    "name": "Peddamma Thalli Temple",
    "category": "Temple",
    "description": "Popular Goddess Peddamma temple in Jubilee Hills.",
    "image": "/images/peddamma-thalli.jpg",
    "position": [
      17.4318,
      78.4109
    ],
    "location": {
      "address": "Peddamma Thalli Temple, Telangana",
      "coordinates": [
        78.4109,
        17.4318
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-100-151",
    "name": "Ujjaini Mahakali Temple",
    "category": "Temple",
    "description": "Historic Mahakali temple famous for Bonalu celebrations.",
    "image": "/images/ujjaini-mahakali.jpg",
    "position": [
      17.443,
      78.498
    ],
    "location": {
      "address": "Ujjaini Mahakali Temple, Telangana",
      "coordinates": [
        78.498,
        17.443
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-101-152",
    "name": "Balkampet Yellamma Temple",
    "category": "Temple",
    "description": "Popular temple dedicated to Goddess Yellamma.",
    "image": "/images/balkampet-yellamma.jpg",
    "position": [
      17.4447,
      78.4558
    ],
    "location": {
      "address": "Balkampet Yellamma Temple, Telangana",
      "coordinates": [
        78.4558,
        17.4447
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-102-153",
    "name": "Karmanghat Hanuman Temple",
    "category": "Historical Temple",
    "description": "Ancient Hanuman temple associated with the Kakatiya period.",
    "image": "/images/karmanghat-hanuman.jpg",
    "position": [
      17.3442,
      78.535
    ],
    "location": {
      "address": "Karmanghat Hanuman Temple, Telangana",
      "coordinates": [
        78.535,
        17.3442
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-103-154",
    "name": "ISKCON Temple Hyderabad",
    "category": "Temple",
    "description": "Krishna temple and spiritual center in Hyderabad.",
    "image": "/images/iskcon-temple.jpg",
    "position": [
      17.392,
      78.472
    ],
    "location": {
      "address": "ISKCON Temple Hyderabad, Telangana",
      "coordinates": [
        78.472,
        17.392
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-104-155",
    "name": "Anantha Padmanabha Swamy Temple",
    "category": "Temple",
    "description": "Temple dedicated to Lord Padmanabha.",
    "image": "/images/anantha-padmanabha.jpg",
    "position": [
      17.389,
      78.31
    ],
    "location": {
      "address": "Anantha Padmanabha Swamy Temple, Telangana",
      "coordinates": [
        78.31,
        17.389
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-105-156",
    "name": "Sri Venkateshwara Swamy TTD Temple",
    "category": "Temple",
    "description": "TTD temple dedicated to Lord Venkateswara.",
    "image": "/images/ttd-venkateshwara.jpg",
    "position": [
      17.4195,
      78.4145
    ],
    "location": {
      "address": "Sri Venkateshwara Swamy TTD Temple, Telangana",
      "coordinates": [
        78.4145,
        17.4195
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-106-157",
    "name": "Ashtalakshmi Temple",
    "category": "Temple",
    "description": "Temple dedicated to the eight forms of Goddess Lakshmi.",
    "image": "/images/ashtalakshmi-temple.jpg",
    "position": [
      17.365,
      78.543
    ],
    "location": {
      "address": "Ashtalakshmi Temple, Telangana",
      "coordinates": [
        78.543,
        17.365
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-107-158",
    "name": "Sita Ram Bagh Temple",
    "category": "Historical Temple",
    "description": "Historic temple complex dedicated to Lord Rama and Sita.",
    "image": "/images/sita-rambagh.jpg",
    "position": [
      17.37,
      78.464
    ],
    "location": {
      "address": "Sita Ram Bagh Temple, Telangana",
      "coordinates": [
        78.464,
        17.37
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-108-159",
    "name": "Hare Krishna Golden Temple",
    "category": "Temple",
    "description": "Temple dedicated to Sri Lakshmi Narasimha Swamy.",
    "image": "/images/hare-krishna-golden-temple.jpg",
    "position": [
      17.419,
      78.431
    ],
    "location": {
      "address": "Hare Krishna Golden Temple, Telangana",
      "coordinates": [
        78.431,
        17.419
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-109-160",
    "name": "Sri Kashi Bugga Temple",
    "category": "Temple",
    "description": "Shiva temple located in Kishan Bagh area.",
    "image": "/images/kashi-bugga-temple.jpg",
    "position": [
      17.337,
      78.438
    ],
    "location": {
      "address": "Sri Kashi Bugga Temple, Telangana",
      "coordinates": [
        78.438,
        17.337
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-110-161",
    "name": "Bhagya Laxmi Temple",
    "category": "Temple",
    "description": "Temple located near the Charminar area.",
    "image": "/images/bhagya-laxmi-temple.jpg",
    "position": [
      17.3612,
      78.4746
    ],
    "location": {
      "address": "Bhagya Laxmi Temple, Telangana",
      "coordinates": [
        78.4746,
        17.3612
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-111-162",
    "name": "Sri Sankat Haran Hanuman Temple",
    "category": "Temple",
    "description": "Hanuman temple in the Mangalhat area.",
    "image": "/images/sankat-haran-hanuman.jpg",
    "position": [
      17.375,
      78.465
    ],
    "location": {
      "address": "Sri Sankat Haran Hanuman Temple, Telangana",
      "coordinates": [
        78.465,
        17.375
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-112-163",
    "name": "Sri Mahankali Temple",
    "category": "Temple",
    "description": "Mahankali temple in the Golconda area.",
    "image": "/images/mahankali-temple.jpg",
    "position": [
      17.384,
      78.402
    ],
    "location": {
      "address": "Sri Mahankali Temple, Telangana",
      "coordinates": [
        78.402,
        17.384
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-113-164",
    "name": "Sanghi Temple",
    "category": "Temple",
    "description": "Hilltop temple complex with scenic surroundings.",
    "image": "/images/sanghi-temple.jpg",
    "position": [
      17.255,
      78.68
    ],
    "location": {
      "address": "Sanghi Temple, Telangana",
      "coordinates": [
        78.68,
        17.255
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-114-165",
    "name": "Statue of Equality",
    "category": "Cultural / Religious",
    "description": "Large statue and spiritual-cultural attraction.",
    "image": "/images/statue-of-equality.jpg",
    "position": [
      17.1873,
      78.3312
    ],
    "location": {
      "address": "Statue of Equality, Telangana",
      "coordinates": [
        78.3312,
        17.1873
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-115-166",
    "name": "Osman Sagar",
    "category": "Lake / Scenic",
    "description": "Historic reservoir and scenic destination west of Hyderabad.",
    "image": "/images/osman-sagar.jpg",
    "position": [
      17.382,
      78.298
    ],
    "location": {
      "address": "Osman Sagar, Telangana",
      "coordinates": [
        78.298,
        17.382
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-116-167",
    "name": "Himayat Sagar",
    "category": "Lake / Scenic",
    "description": "Historic reservoir and scenic location near Hyderabad.",
    "image": "/images/himayat-sagar.jpg",
    "position": [
      17.319,
      78.356
    ],
    "location": {
      "address": "Himayat Sagar, Telangana",
      "coordinates": [
        78.356,
        17.319
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-117-168",
    "name": "Keesaragutta Temple",
    "category": "Historical Temple",
    "description": "Ancient temple dedicated to Sri Ramalingeswara Swamy.",
    "image": "/images/keesaragutta.jpg",
    "position": [
      17.5219,
      78.6872
    ],
    "location": {
      "address": "Keesaragutta Temple, Telangana",
      "coordinates": [
        78.6872,
        17.5219
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-118-169",
    "name": "Moazzam Jahi Market",
    "category": "Heritage Market",
    "description": "Historic market known for distinctive architecture.",
    "image": "/images/moazzam-jahi-market.jpg",
    "position": [
      17.394,
      78.474
    ],
    "location": {
      "address": "Moazzam Jahi Market, Telangana",
      "coordinates": [
        78.474,
        17.394
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-119-170",
    "name": "Public Gardens",
    "category": "Park / Heritage",
    "description": "Historic public garden area in central Hyderabad.",
    "image": "/images/public-gardens.jpg",
    "position": [
      17.399,
      78.468
    ],
    "location": {
      "address": "Public Gardens, Telangana",
      "coordinates": [
        78.468,
        17.399
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-120-171",
    "name": "Osmania University",
    "category": "Heritage / Education",
    "description": "Historic university campus known for Indo-Islamic architecture.",
    "image": "/images/osmania-university.jpg",
    "position": [
      17.413,
      78.528
    ],
    "location": {
      "address": "Osmania University, Telangana",
      "coordinates": [
        78.528,
        17.413
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-121-172",
    "name": "Osmania General Hospital",
    "category": "Heritage Building",
    "description": "Historic hospital building associated with Hyderabad's heritage.",
    "image": "/images/osmania-general-hospital.jpg",
    "position": [
      17.371,
      78.477
    ],
    "location": {
      "address": "Osmania General Hospital, Telangana",
      "coordinates": [
        78.477,
        17.371
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-122-173",
    "name": "NTR Statue",
    "category": "Tourist Attraction",
    "description": "Landmark statue located near Hussain Sagar.",
    "image": "/images/ntr-statue.jpg",
    "position": [
      17.41,
      78.471
    ],
    "location": {
      "address": "NTR Statue, Telangana",
      "coordinates": [
        78.471,
        17.41
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-123-174",
    "name": "Hatiyan Jhad Baobab Tree",
    "category": "Historical / Natural",
    "description": "Ancient baobab tree associated with the Golconda area.",
    "image": "/images/hatiyan-jhad.jpg",
    "position": [
      17.383,
      78.399
    ],
    "location": {
      "address": "Hatiyan Jhad Baobab Tree, Telangana",
      "coordinates": [
        78.399,
        17.383
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-124-175",
    "name": "Golconda Fort Sound & Light Show",
    "category": "Cultural Attraction",
    "description": "Evening historical sound and light presentation at Golconda.",
    "image": "/images/golconda-light-show.jpg",
    "position": [
      17.385,
      78.405
    ],
    "location": {
      "address": "Golconda Fort Sound & Light Show, Telangana",
      "coordinates": [
        78.405,
        17.385
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-125-176",
    "name": "Khursheed Jah Devdi",
    "category": "Historical Palace",
    "description": "Historic palace associated with Hyderabad's royal heritage.",
    "image": "/images/khursheed-jah-devdi.jpg",
    "position": [
      17.3658,
      78.4748
    ],
    "location": {
      "address": "Khursheed Jah Devdi, Telangana",
      "coordinates": [
        78.4748,
        17.3658
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-126-177",
    "name": "British Residency",
    "category": "Historical Building",
    "description": "Colonial-era heritage building.",
    "image": "/images/british-residency.jpg",
    "position": [
      17.386,
      78.4892
    ],
    "location": {
      "address": "British Residency, Telangana",
      "coordinates": [
        78.4892,
        17.386
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-127-179",
    "name": "Lothal",
    "category": "Ahmedabad Region",
    "description": "Archaeological Site",
    "image": "/images/devarakonda-fort.jpg",
    "position": [
      17.3362,
      78.4886
    ],
    "location": {
      "address": "Lothal, Telangana",
      "coordinates": [
        78.4886,
        17.3362
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-128-180",
    "name": "Dholavira",
    "category": "Kutch",
    "description": "Archaeological Site",
    "image": "/images/dhanushkodi.jpg",
    "position": [
      17.3442,
      78.4882
    ],
    "location": {
      "address": "Dholavira, Telangana",
      "coordinates": [
        78.4882,
        17.3442
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-129-181",
    "name": "Modhera Sun Temple",
    "category": "Mehsana",
    "description": "Historical Temple",
    "image": "/images/dharmapuri-temple.jpg",
    "position": [
      17.349,
      78.4878
    ],
    "location": {
      "address": "Modhera Sun Temple, Telangana",
      "coordinates": [
        78.4878,
        17.349
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-130-182",
    "name": "Sabarmati Riverfront",
    "category": "Ahmedabad",
    "description": "Tourist Attraction",
    "image": "/images/dholavira.jpg",
    "position": [
      17.3574,
      78.485
    ],
    "location": {
      "address": "Sabarmati Riverfront, Telangana",
      "coordinates": [
        78.485,
        17.3574
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-131-183",
    "name": "Marine Drive",
    "category": "Mumbai",
    "description": "Landmark",
    "image": "/images/digha.jpg",
    "position": [
      17.3678,
      78.4854
    ],
    "location": {
      "address": "Marine Drive, Telangana",
      "coordinates": [
        78.4854,
        17.3678
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-132-184",
    "name": "Siddhivinayak Temple",
    "category": "Mumbai",
    "description": "Temple",
    "image": "/images/domakonda-fort.jpg",
    "position": [
      17.3742,
      78.4878
    ],
    "location": {
      "address": "Siddhivinayak Temple, Telangana",
      "coordinates": [
        78.4878,
        17.3742
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-133-185",
    "name": "Sanjay Gandhi National Park",
    "category": "Mumbai",
    "description": "Wildlife",
    "image": "/images/Elgandal_Fort.jpg",
    "position": [
      17.381,
      78.487
    ],
    "location": {
      "address": "Sanjay Gandhi National Park, Telangana",
      "coordinates": [
        78.487,
        17.381
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-134-186",
    "name": "Aga Khan Palace",
    "category": "Pune",
    "description": "Historical Site",
    "image": "/images/ethipothala-waterfalls.jpg",
    "position": [
      17.3926,
      78.4878
    ],
    "location": {
      "address": "Aga Khan Palace, Telangana",
      "coordinates": [
        78.4878,
        17.3926
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-135-187",
    "name": "Sinhagad Fort",
    "category": "Pune",
    "description": "Historical Fort",
    "image": "/images/falakuma-palace.jpg",
    "position": [
      17.3974,
      78.4862
    ],
    "location": {
      "address": "Sinhagad Fort, Telangana",
      "coordinates": [
        78.4862,
        17.3974
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-136-188",
    "name": "Mahabaleshwar",
    "category": "Satara",
    "description": "Hill Station",
    "image": "/images/gadwal-fort.jpg",
    "position": [
      17.4066,
      78.485
    ],
    "location": {
      "address": "Mahabaleshwar, Telangana",
      "coordinates": [
        78.485,
        17.4066
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-137-189",
    "name": "Panchgani",
    "category": "Satara",
    "description": "Hill Station",
    "image": "/images/gangtok.jpg",
    "position": [
      17.4154,
      78.4882
    ],
    "location": {
      "address": "Panchgani, Telangana",
      "coordinates": [
        78.4882,
        17.4154
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-138-190",
    "name": "Gokarna Beach",
    "category": "Gokarna",
    "description": "Beach",
    "image": "/images/gokarna-beach.jpg",
    "position": [
      17.423,
      78.485
    ],
    "location": {
      "address": "Gokarna Beach, Telangana",
      "coordinates": [
        78.485,
        17.423
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-139-191",
    "name": "Murudeshwar Temple",
    "category": "Murudeshwar",
    "description": "Temple",
    "image": "/images/golconda-fort.jpg",
    "position": [
      17.4298,
      78.4878
    ],
    "location": {
      "address": "Murudeshwar Temple, Telangana",
      "coordinates": [
        78.4878,
        17.4298
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-140-192",
    "name": "Hoysaleswara Temple",
    "category": "Halebidu",
    "description": "Historical Temple",
    "image": "/images/golconda-light-show.jpg",
    "position": [
      17.3102,
      78.496
    ],
    "location": {
      "address": "Hoysaleswara Temple, Telangana",
      "coordinates": [
        78.496,
        17.3102
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-141-193",
    "name": "Belur Temple",
    "category": "Belur",
    "description": "Historical Temple",
    "image": "/images/guruvayur.jpg",
    "position": [
      17.3182,
      78.496
    ],
    "location": {
      "address": "Belur Temple, Telangana",
      "coordinates": [
        78.496,
        17.3182
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-142-194",
    "name": "Bandipur National Park",
    "category": "Chamarajanagar",
    "description": "Wildlife",
    "image": "/images/gwalior-fort.jpg",
    "position": [
      17.3266,
      78.4944
    ],
    "location": {
      "address": "Bandipur National Park, Telangana",
      "coordinates": [
        78.4944,
        17.3266
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-143-195",
    "name": "Kabini",
    "category": "Mysuru Region",
    "description": "Wildlife / Nature",
    "image": "/images/hare-krishna-golden-temple.jpg",
    "position": [
      17.333,
      78.4944
    ],
    "location": {
      "address": "Kabini, Telangana",
      "coordinates": [
        78.4944,
        17.333
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-144-196",
    "name": "Dhanushkodi",
    "category": "Rameswaram",
    "description": "Coastal Attraction",
    "image": "/images/hatiyan-jhad.jpg",
    "position": [
      17.3438,
      78.4976
    ],
    "location": {
      "address": "Dhanushkodi, Telangana",
      "coordinates": [
        78.4976,
        17.3438
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-145-197",
    "name": "Rameswaram Temple",
    "category": "Rameswaram",
    "description": "Temple",
    "image": "/images/himayat-sagar.jpg",
    "position": [
      17.3494,
      78.496
    ],
    "location": {
      "address": "Rameswaram Temple, Telangana",
      "coordinates": [
        78.496,
        17.3494
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-146-198",
    "name": "Chettinad Palace",
    "category": "Chettinad",
    "description": "Heritage",
    "image": "/images/hoysaleswara.jpg",
    "position": [
      17.359,
      78.4972
    ],
    "location": {
      "address": "Chettinad Palace, Telangana",
      "coordinates": [
        78.4972,
        17.359
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-147-199",
    "name": "Kodaikanal",
    "category": "Dindigul",
    "description": "Hill Station",
    "image": "/images/hussain-sagar.jpg",
    "position": [
      17.3678,
      78.4948
    ],
    "location": {
      "address": "Kodaikanal, Telangana",
      "coordinates": [
        78.4948,
        17.3678
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-148-200",
    "name": "Athirappilly Falls",
    "category": "Thrissur",
    "description": "Waterfall",
    "image": "/images/indian-museum.jpg",
    "position": [
      17.3754,
      78.4964
    ],
    "location": {
      "address": "Athirappilly Falls, Telangana",
      "coordinates": [
        78.4964,
        17.3754
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-149-201",
    "name": "Bekal Fort",
    "category": "Kasaragod",
    "description": "Historical Fort",
    "image": "/images/indira-park.jpg",
    "position": [
      17.3818,
      78.496
    ],
    "location": {
      "address": "Bekal Fort, Telangana",
      "coordinates": [
        78.496,
        17.3818
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-150-202",
    "name": "Kovalam Beach",
    "category": "Thiruvananthapuram",
    "description": "Beach",
    "image": "/images/iskcon-temple.jpg",
    "position": [
      17.3918,
      78.4956
    ],
    "location": {
      "address": "Kovalam Beach, Telangana",
      "coordinates": [
        78.4956,
        17.3918
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-151-203",
    "name": "Sabarimala Temple",
    "category": "Pathanamthitta",
    "description": "Temple",
    "image": "/images/jagannath-temple.jpg",
    "position": [
      17.4002,
      78.4968
    ],
    "location": {
      "address": "Sabarimala Temple, Telangana",
      "coordinates": [
        78.4968,
        17.4002
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-152-204",
    "name": "Guruvayur Temple",
    "category": "Guruvayur",
    "description": "Temple",
    "image": "/images/jainath-temple.jpg",
    "position": [
      17.4066,
      78.4968
    ],
    "location": {
      "address": "Guruvayur Temple, Telangana",
      "coordinates": [
        78.4968,
        17.4066
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-153-205",
    "name": "Digha Beach",
    "category": "Digha",
    "description": "Beach",
    "image": "/images/jurala-dam.jpg",
    "position": [
      17.4162,
      78.496
    ],
    "location": {
      "address": "Digha Beach, Telangana",
      "coordinates": [
        78.496,
        17.4162
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-154-206",
    "name": "Indian Museum",
    "category": "Kolkata",
    "description": "Museum",
    "image": "/images/kadam-dam.jpg",
    "position": [
      17.421,
      78.4948
    ],
    "location": {
      "address": "Indian Museum, Telangana",
      "coordinates": [
        78.4948,
        17.421
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-155-207",
    "name": "Sundarbans National Park",
    "category": "Sundarbans",
    "description": "Wildlife",
    "image": "/images/kaeshwaram-temple.jpg",
    "position": [
      17.4318,
      78.4964
    ],
    "location": {
      "address": "Sundarbans National Park, Telangana",
      "coordinates": [
        78.4964,
        17.4318
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-156-208",
    "name": "Gangtok",
    "category": "Gangtok",
    "description": "Hill Station",
    "image": "/images/karmanghat-hanuman.jpg",
    "position": [
      17.3122,
      78.5062
    ],
    "location": {
      "address": "Gangtok, Telangana",
      "coordinates": [
        78.5062,
        17.3122
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-157-209",
    "name": "Pelling",
    "category": "Pelling",
    "description": "Hill Station",
    "image": "/images/kashi-bugga-temple.jpg",
    "position": [
      17.3206,
      78.5066
    ],
    "location": {
      "address": "Pelling, Telangana",
      "coordinates": [
        78.5066,
        17.3206
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-158-210",
    "name": "Sandakphu",
    "category": "Darjeeling",
    "description": "Trekking / Nature",
    "image": "/images/kawal-tiger-reserve.jpg",
    "position": [
      17.3262,
      78.5066
    ],
    "location": {
      "address": "Sandakphu, Telangana",
      "coordinates": [
        78.5066,
        17.3262
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-159-211",
    "name": "Rajgir",
    "category": "Nalanda",
    "description": "Historical / Nature",
    "image": "/images/kbr-national-park.jpg",
    "position": [
      17.3346,
      78.5038
    ],
    "location": {
      "address": "Rajgir, Telangana",
      "coordinates": [
        78.5038,
        17.3346
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-160-212",
    "name": "Rajgir Glass Bridge",
    "category": "Rajgir",
    "description": "Tourist Attraction",
    "image": "/images/keesaragutta.jpg",
    "position": [
      17.3442,
      78.5062
    ],
    "location": {
      "address": "Rajgir Glass Bridge, Telangana",
      "coordinates": [
        78.5062,
        17.3442
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-161-213",
    "name": "Patna Sahib Gurudwara",
    "category": "Patna",
    "description": "Religious",
    "image": "/images/khursheed-jah-devdi.jpg",
    "position": [
      17.3522,
      78.5066
    ],
    "location": {
      "address": "Patna Sahib Gurudwara, Telangana",
      "coordinates": [
        78.5066,
        17.3522
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-162-214",
    "name": "Deoghar Temple",
    "category": "Deoghar",
    "description": "Temple",
    "image": "/images/kinnerasani-wildlife.jpg",
    "position": [
      17.3574,
      78.503
    ],
    "location": {
      "address": "Deoghar Temple, Telangana",
      "coordinates": [
        78.503,
        17.3574
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-163-215",
    "name": "Netarhat",
    "category": "Latehar",
    "description": "Hill Station",
    "image": "/images/Kinnerasani_Dam.jpg",
    "position": [
      17.3666,
      78.5038
    ],
    "location": {
      "address": "Netarhat, Telangana",
      "coordinates": [
        78.5038,
        17.3666
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-164-216",
    "name": "Victoria Memorial",
    "category": "Kolkata",
    "description": "Historical Monument",
    "image": "/images/kodailkanal.jpg",
    "position": [
      17.375,
      78.5058
    ],
    "location": {
      "address": "Victoria Memorial, Telangana",
      "coordinates": [
        78.5058,
        17.375
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-165-217",
    "name": "Gwalior Fort",
    "category": "Gwalior",
    "description": "Historical Fort",
    "image": "/images/koilsagar-dam.jpg",
    "position": [
      17.3838,
      78.5042
    ],
    "location": {
      "address": "Gwalior Fort, Telangana",
      "coordinates": [
        78.5042,
        17.3838
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-166-218",
    "name": "Orchha Fort",
    "category": "Orchha",
    "description": "Historical Fort",
    "image": "/images/kolanpaku-jain-temple.jpg",
    "position": [
      17.3898,
      78.5058
    ],
    "location": {
      "address": "Orchha Fort, Telangana",
      "coordinates": [
        78.5058,
        17.3898
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-167-219",
    "name": "Bhimbetka Rock Shelters",
    "category": "Raisen",
    "description": "Archaeological Site",
    "image": "/images/komuravalli-mallanna.jpg",
    "position": [
      17.4006,
      78.5058
    ],
    "location": {
      "address": "Bhimbetka Rock Shelters, Telangana",
      "coordinates": [
        78.5058,
        17.4006
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-168-220",
    "name": "Omkareshwar Temple",
    "category": "Omkareshwar",
    "description": "Temple",
    "image": "/images/Kondagattu_anjaneya_swamy_temple.jpg",
    "position": [
      17.4082,
      78.505
    ],
    "location": {
      "address": "Omkareshwar Temple, Telangana",
      "coordinates": [
        78.505,
        17.4082
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-169-221",
    "name": "Ujjain Mahakal Lok",
    "category": "Ujjain",
    "description": "Religious / Tourist Attraction",
    "image": "/images/kondapochamma-sagar.jpg",
    "position": [
      17.4162,
      78.5038
    ],
    "location": {
      "address": "Ujjain Mahakal Lok, Telangana",
      "coordinates": [
        78.5038,
        17.4162
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-170-222",
    "name": "Jagdalpur",
    "category": "Bastar",
    "description": "Nature / Culture",
    "image": "/images/kotepally-reservoir.jpg",
    "position": [
      17.4222,
      78.505
    ],
    "location": {
      "address": "Jagdalpur, Telangana",
      "coordinates": [
        78.505,
        17.4222
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-171-223",
    "name": "Amarkantak",
    "category": "Anuppur",
    "description": "Nature / Religious",
    "image": "/images/kovalam-beach-light.jpg",
    "position": [
      17.431,
      78.5038
    ],
    "location": {
      "address": "Amarkantak, Telangana",
      "coordinates": [
        78.5038,
        17.431
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-172-224",
    "name": "Pachmarhi",
    "category": "Narmadapuram",
    "description": "Hill Station",
    "image": "/images/kuntala-waterfalls.jpg",
    "position": [
      17.3114,
      78.5144
    ],
    "location": {
      "address": "Pachmarhi, Telangana",
      "coordinates": [
        78.5144,
        17.3114
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-173-225",
    "name": "Chitrakote Waterfall",
    "category": "Bastar",
    "description": "Waterfall",
    "image": "/images/laad-bazaar.jpg",
    "position": [
      17.317,
      78.5136
    ],
    "location": {
      "address": "Chitrakote Waterfall, Telangana",
      "coordinates": [
        78.5136,
        17.317
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-174-226",
    "name": "Bastar Palace",
    "category": "Jagdalpur",
    "description": "Historical Palace",
    "image": "/images/lothal.jpg",
    "position": [
      17.3282,
      78.5124
    ],
    "location": {
      "address": "Bastar Palace, Telangana",
      "coordinates": [
        78.5124,
        17.3282
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-175-227",
    "name": "Marine Drive Kochi",
    "category": "Kochi",
    "description": "Landmark",
    "image": "/images/lower-manair-dam.jpg",
    "position": [
      17.3362,
      78.512
    ],
    "location": {
      "address": "Marine Drive Kochi, Telangana",
      "coordinates": [
        78.512,
        17.3362
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-176-228",
    "name": "Mattancherry Palace",
    "category": "Kochi",
    "description": "Historical Palace",
    "image": "/images/Lumbini-Park.jpg",
    "position": [
      17.3414,
      78.5144
    ],
    "location": {
      "address": "Mattancherry Palace, Telangana",
      "coordinates": [
        78.5144,
        17.3414
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-177-229",
    "name": "Athirappilly Waterfalls",
    "category": "Thrissur",
    "description": "Waterfall",
    "image": "/images/mahabaleshwar.jpg",
    "position": [
      17.3506,
      78.5128
    ],
    "location": {
      "address": "Athirappilly Waterfalls, Telangana",
      "coordinates": [
        78.5128,
        17.3506
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-178-230",
    "name": "Wayanad",
    "category": "Wayanad",
    "description": "Hills / Nature",
    "image": "/images/mahankali-temple.jpg",
    "position": [
      17.3606,
      78.5124
    ],
    "location": {
      "address": "Wayanad, Telangana",
      "coordinates": [
        78.5124,
        17.3606
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-179-231",
    "name": "Thekkady",
    "category": "Idukki",
    "description": "Wildlife / Nature",
    "image": "/images/mallela-theertham.jpg",
    "position": [
      17.3658,
      78.5128
    ],
    "location": {
      "address": "Thekkady, Telangana",
      "coordinates": [
        78.5128,
        17.3658
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-180-232",
    "name": "Kumarakom",
    "category": "Kottayam",
    "description": "Backwaters",
    "image": "/images/marine-drive.jpg",
    "position": [
      17.373,
      78.5124
    ],
    "location": {
      "address": "Kumarakom, Telangana",
      "coordinates": [
        78.5124,
        17.373
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-181-233",
    "name": "Konark Beach",
    "category": "Konark",
    "description": "Beach",
    "image": "/images/mecca-masjid.jpg",
    "position": [
      17.381,
      78.5124
    ],
    "location": {
      "address": "Konark Beach, Telangana",
      "coordinates": [
        78.5124,
        17.381
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-182-234",
    "name": "Lingaraj Temple",
    "category": "Bhubaneswar",
    "description": "Temple",
    "image": "/images/medak-fort.jpg",
    "position": [
      17.391,
      78.514
    ],
    "location": {
      "address": "Lingaraj Temple, Telangana",
      "coordinates": [
        78.514,
        17.391
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-183-235",
    "name": "Udayagiri and Khandagiri Caves",
    "category": "Bhubaneswar",
    "description": "Historical Caves",
    "image": "/images/medakcathedral.jpg",
    "position": [
      17.4006,
      78.514
    ],
    "location": {
      "address": "Udayagiri and Khandagiri Caves, Telangana",
      "coordinates": [
        78.514,
        17.4006
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-184-236",
    "name": "Simlipal National Park",
    "category": "Mayurbhanj",
    "description": "Wildlife",
    "image": "/images/medara.jpg",
    "position": [
      17.4078,
      78.5128
    ],
    "location": {
      "address": "Simlipal National Park, Telangana",
      "coordinates": [
        78.5128,
        17.4078
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-185-237",
    "name": "Raghurajpur Artist Village",
    "category": "Puri",
    "description": "Cultural Heritage",
    "image": "/images/mir-alam-tank.jpg",
    "position": [
      17.415,
      78.5124
    ],
    "location": {
      "address": "Raghurajpur Artist Village, Telangana",
      "coordinates": [
        78.5124,
        17.415
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-186-238",
    "name": "Dhauli Shanti Stupa",
    "category": "Bhubaneswar",
    "description": "Buddhist Heritage",
    "image": "/images/moazzam-jahi-market.jpg",
    "position": [
      17.4214,
      78.5148
    ],
    "location": {
      "address": "Dhauli Shanti Stupa, Telangana",
      "coordinates": [
        78.5148,
        17.4214
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-187-239",
    "name": "Varkala Cliff",
    "category": "Varkala",
    "description": "Coastal Attraction",
    "image": "/images/modhera-sun-temple.jpg",
    "position": [
      17.4294,
      78.512
    ],
    "location": {
      "address": "Varkala Cliff, Telangana",
      "coordinates": [
        78.512,
        17.4294
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-188-240",
    "name": "Bekal Beach",
    "category": "Kasaragod",
    "description": "Beach",
    "image": "/images/modhera-sun.jpg",
    "position": [
      17.3126,
      78.5218
    ],
    "location": {
      "address": "Bekal Beach, Telangana",
      "coordinates": [
        78.5218,
        17.3126
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-189-241",
    "name": "Marari Beach",
    "category": "Alappuzha",
    "description": "Beach",
    "image": "/images/mrugavani-national-park.jpg",
    "position": [
      17.3182,
      78.5234
    ],
    "location": {
      "address": "Marari Beach, Telangana",
      "coordinates": [
        78.5234,
        17.3182
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-190-242",
    "name": "Silent Valley National Park",
    "category": "Palakkad",
    "description": "Wildlife / Nature",
    "image": "/images/murudeshwar.jpg",
    "position": [
      17.3262,
      78.523
    ],
    "location": {
      "address": "Silent Valley National Park, Telangana",
      "coordinates": [
        78.523,
        17.3262
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-191-243",
    "name": "Hogenakkal Falls",
    "category": "Dharmapuri",
    "description": "Waterfall",
    "image": "/images/nagarjunakonda.jpg",
    "position": [
      17.3366,
      78.523
    ],
    "location": {
      "address": "Hogenakkal Falls, Telangana",
      "coordinates": [
        78.523,
        17.3366
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-192-244",
    "name": "Yercaud",
    "category": "Salem",
    "description": "Hill Station",
    "image": "/images/Nagarjuna_Sagar.jpg",
    "position": [
      17.3426,
      78.5246
    ],
    "location": {
      "address": "Yercaud, Telangana",
      "coordinates": [
        78.5246,
        17.3426
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-193-245",
    "name": "Gingee Fort",
    "category": "Villupuram",
    "description": "Historical Fort",
    "image": "/images/necklace-road.jpg",
    "position": [
      17.3522,
      78.5218
    ],
    "location": {
      "address": "Gingee Fort, Telangana",
      "coordinates": [
        78.5218,
        17.3522
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-194-246",
    "name": "Srirangam Temple",
    "category": "Tiruchirappalli",
    "description": "Temple",
    "image": "/images/nehru-zoological-Park.jpg",
    "position": [
      17.3578,
      78.5238
    ],
    "location": {
      "address": "Srirangam Temple, Telangana",
      "coordinates": [
        78.5238,
        17.3578
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-195-247",
    "name": "Thirumalai Nayakkar Palace",
    "category": "Madurai",
    "description": "Historical Palace",
    "image": "/images/netarhat.jpg",
    "position": [
      17.3658,
      78.5218
    ],
    "location": {
      "address": "Thirumalai Nayakkar Palace, Telangana",
      "coordinates": [
        78.5218,
        17.3658
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-196-248",
    "name": "Pulicat Lake",
    "category": "Tiruvallur",
    "description": "Lake / Nature",
    "image": "/images/Nirmal-Fort.jpg",
    "position": [
      17.3746,
      78.5246
    ],
    "location": {
      "address": "Pulicat Lake, Telangana",
      "coordinates": [
        78.5246,
        17.3746
      ]
    },
    "rating": 4.6
  },
  {
    "id": "place-197-249",
    "name": "Chikmagalur",
    "category": "Chikkamagaluru",
    "description": "Hills / Nature",
    "image": "/images/nizam-museum.jpg",
    "position": [
      17.3842,
      78.5234
    ],
    "location": {
      "address": "Chikmagalur, Telangana",
      "coordinates": [
        78.5234,
        17.3842
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "place-198-250",
    "name": "Jog Falls",
    "category": "Shivamogga",
    "description": "Waterfall",
    "image": "/images/Nizam_Sagar.jpg",
    "position": [
      17.3914,
      78.523
    ],
    "location": {
      "address": "Jog Falls, Telangana",
      "coordinates": [
        78.523,
        17.3914
      ]
    },
    "rating": 4.8
  },
  {
    "id": "place-199-251",
    "name": "Udupi Sri Krishna Temple",
    "category": "Udupi",
    "description": "Temple",
    "image": "/images/ntr-garden.jpg",
    "position": [
      17.4006,
      78.5214
    ],
    "location": {
      "address": "Udupi Sri Krishna Temple, Telangana",
      "coordinates": [
        78.5214,
        17.4006
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "place-200-252",
    "name": "Pattadakal",
    "category": "Bagalkot",
    "description": "Historical Heritage",
    "image": "/images/ntr-statue.jpg",
    "position": [
      17.4086,
      78.5214
    ],
    "location": {
      "address": "Pattadakal, Telangana",
      "coordinates": [
        78.5214,
        17.4086
      ]
    },
    "rating": 4.6
  }
]

export const hotels = [
  {
    "id": "hotel-H001-1",
    "name": "Taj Falaknuma Palace",
    "category": "Luxury Hotel",
    "description": "Heritage luxury palace hotel with royal architecture and premium facilities.",
    "image": "/images/alampur-jogulamba.jpg",
    "position": [
      17.3314,
      78.4678
    ],
    "location": {
      "address": "Taj Falaknuma Palace, Telangana",
      "coordinates": [
        78.4678,
        17.3314
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H002-2",
    "name": "The Park Hyderabad",
    "category": "Luxury Hotel",
    "description": "Premium hotel located near Hussain Sagar and central Hyderabad.",
    "image": "/images/amrabad-tiger-reserve.jpg",
    "position": [
      17.423,
      78.457
    ],
    "location": {
      "address": "The Park Hyderabad, Telangana",
      "coordinates": [
        78.457,
        17.423
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H003-3",
    "name": "Lemon Tree Premier HITEC City",
    "category": "Business Hotel",
    "description": "Modern business hotel suitable for tourists and business travelers.",
    "image": "/images/anantha-padmanabha.jpg",
    "position": [
      17.45,
      78.382
    ],
    "location": {
      "address": "Lemon Tree Premier HITEC City, Telangana",
      "coordinates": [
        78.382,
        17.45
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H004-4",
    "name": "ibis Hyderabad HITEC City",
    "category": "Business Hotel",
    "description": "Contemporary hotel close to technology and business areas.",
    "image": "/images/anathagiri-hills.jpg",
    "position": [
      17.447,
      78.383
    ],
    "location": {
      "address": "ibis Hyderabad HITEC City, Telangana",
      "coordinates": [
        78.383,
        17.447
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H005-5",
    "name": "Red Fox by Lemon Tree",
    "category": "Business Hotel",
    "description": "Comfortable hotel near Hyderabad's IT and business district.",
    "image": "/images/ashtalakshmi-temple.jpg",
    "position": [
      17.45,
      78.382
    ],
    "location": {
      "address": "Red Fox by Lemon Tree, Telangana",
      "coordinates": [
        78.382,
        17.45
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H006-6",
    "name": "Holiday Inn Express HITEC City",
    "category": "Business Hotel",
    "description": "Convenient hotel for business and leisure travelers.",
    "image": "/images/athirappilly.jpg",
    "position": [
      17.446,
      78.382
    ],
    "location": {
      "address": "Holiday Inn Express HITEC City, Telangana",
      "coordinates": [
        78.382,
        17.446
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H007-7",
    "name": "Deccan Serai Hotel",
    "category": "Business Hotel",
    "description": "Modern hotel near Mindspace and major IT offices.",
    "image": "/images/balkampet-yellamma.jpg",
    "position": [
      17.441,
      78.384
    ],
    "location": {
      "address": "Deccan Serai Hotel, Telangana",
      "coordinates": [
        78.384,
        17.441
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H008-8",
    "name": "The Plaza Hotel Hyderabad",
    "category": "Hotel",
    "description": "Telangana Tourism hotel located in the central business district.",
    "image": "/images/bandipur.jpg",
    "position": [
      17.443,
      78.467
    ],
    "location": {
      "address": "The Plaza Hotel Hyderabad, Telangana",
      "coordinates": [
        78.467,
        17.443
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H009-9",
    "name": "Taramati Baradari Resort",
    "category": "Heritage Resort",
    "description": "Heritage-style resort near Golconda and Taramati Baradari.",
    "image": "/images/basara-temple.jpg",
    "position": [
      17.3848,
      78.3679
    ],
    "location": {
      "address": "Taramati Baradari Resort, Telangana",
      "coordinates": [
        78.3679,
        17.3848
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H010-10",
    "name": "Annapurna Residency",
    "category": "Budget Hotel",
    "description": "Budget-friendly hotel in central Secunderabad.",
    "image": "/images/begum-bazaar.jpg",
    "position": [
      17.439,
      78.498
    ],
    "location": {
      "address": "Annapurna Residency, Telangana",
      "coordinates": [
        78.498,
        17.439
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H011-11",
    "name": "Sapthagiri Hotel",
    "category": "Hotel",
    "description": "Full-service hotel suitable for family and business travelers.",
    "image": "/images/bekal-fort.jpg",
    "position": [
      17.439,
      78.498
    ],
    "location": {
      "address": "Sapthagiri Hotel, Telangana",
      "coordinates": [
        78.498,
        17.439
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H012-12",
    "name": "Royal Reve Hotel",
    "category": "Hotel",
    "description": "Centrally located hotel offering comfortable accommodation.",
    "image": "/images/belur-temple.jpg",
    "position": [
      17.44,
      78.498
    ],
    "location": {
      "address": "Royal Reve Hotel, Telangana",
      "coordinates": [
        78.498,
        17.44
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H013-13",
    "name": "Sri Ambica Lodge",
    "category": "Budget Hotel",
    "description": "Budget accommodation close to Hyderabad Old City attractions.",
    "image": "/images/bhadrachalam-temple.jpg",
    "position": [
      17.373,
      78.473
    ],
    "location": {
      "address": "Sri Ambica Lodge, Telangana",
      "coordinates": [
        78.473,
        17.373
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H014-14",
    "name": "Grand Continent Gachibowli",
    "category": "Hotel",
    "description": "Comfortable hotel in Hyderabad's technology hub.",
    "image": "/images/bhagya-laxmi-temple.jpg",
    "position": [
      17.44,
      78.35
    ],
    "location": {
      "address": "Grand Continent Gachibowli, Telangana",
      "coordinates": [
        78.35,
        17.44
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H015-15",
    "name": "Haritha Hotel Warangal",
    "category": "Tourist Hotel",
    "description": "Telangana Tourism accommodation for visitors exploring Warangal.",
    "image": "/images/bhimbetka.jpg",
    "position": [
      17.98,
      79.59
    ],
    "location": {
      "address": "Haritha Hotel Warangal, Telangana",
      "coordinates": [
        79.59,
        17.98
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H016-16",
    "name": "Haritha Hotel Ramappa",
    "category": "Tourist Hotel",
    "description": "Accommodation near Ramappa Temple and Ramappa Lake.",
    "image": "/images/bhongir.jpg",
    "position": [
      18.26,
      79.943
    ],
    "location": {
      "address": "Haritha Hotel Ramappa, Telangana",
      "coordinates": [
        79.943,
        18.26
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H017-17",
    "name": "Haritha Hotel Laknavaram",
    "category": "Resort",
    "description": "Tourist accommodation near Laknavaram Lake.",
    "image": "/images/birla-mandir.jpg",
    "position": [
      18.01,
      80.02
    ],
    "location": {
      "address": "Haritha Hotel Laknavaram, Telangana",
      "coordinates": [
        80.02,
        18.01
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H018-18",
    "name": "Haritha Hotel Bhadrachalam",
    "category": "Tourist Hotel",
    "description": "Accommodation for pilgrims and tourists visiting Bhadrachalam.",
    "image": "/images/birla-science-museum.jpg",
    "position": [
      17.6688,
      80.8936
    ],
    "location": {
      "address": "Haritha Hotel Bhadrachalam, Telangana",
      "coordinates": [
        80.8936,
        17.6688
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H019-19",
    "name": "Haritha Hotel Basara",
    "category": "Tourist Hotel",
    "description": "Accommodation near Saraswathi Temple and Godavari River.",
    "image": "/images/british-residency.jpg",
    "position": [
      18.88,
      77.95
    ],
    "location": {
      "address": "Haritha Hotel Basara, Telangana",
      "coordinates": [
        77.95,
        18.88
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H020-20",
    "name": "Haritha Hotel Vemulawada",
    "category": "Tourist Hotel",
    "description": "Accommodation near Rajarajeshwara Temple.",
    "image": "/images/buddha-statue.jpg",
    "position": [
      18.465,
      78.868
    ],
    "location": {
      "address": "Haritha Hotel Vemulawada, Telangana",
      "coordinates": [
        78.868,
        18.465
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H021-21",
    "name": "Haritha Hotel Kaleshwaram",
    "category": "Tourist Hotel",
    "description": "Tourist accommodation near Kaleshwaram Temple.",
    "image": "/images/charminar.jpg",
    "position": [
      18.811,
      79.906
    ],
    "location": {
      "address": "Haritha Hotel Kaleshwaram, Telangana",
      "coordinates": [
        79.906,
        18.811
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H022-22",
    "name": "Haritha Hotel Kondagattu",
    "category": "Tourist Hotel",
    "description": "Accommodation near Kondagattu Anjaneya Swamy Temple.",
    "image": "/images/Chaya_Someshwara_Temple.jpg",
    "position": [
      18.68,
      78.91
    ],
    "location": {
      "address": "Haritha Hotel Kondagattu, Telangana",
      "coordinates": [
        78.91,
        18.68
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H023-23",
    "name": "Haritha Hotel Nagarjuna Sagar",
    "category": "Tourist Hotel",
    "description": "Tourist accommodation near Nagarjuna Sagar Dam.",
    "image": "/images/chettinad-palace.jpg",
    "position": [
      16.574,
      79.312
    ],
    "location": {
      "address": "Haritha Hotel Nagarjuna Sagar, Telangana",
      "coordinates": [
        79.312,
        16.574
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H024-24",
    "name": "Haritha Hotel Medaram",
    "category": "Tourist Hotel",
    "description": "Accommodation for visitors to Medaram pilgrimage destination.",
    "image": "/images/chilkur-balaji.jpg",
    "position": [
      18.335,
      80.001
    ],
    "location": {
      "address": "Haritha Hotel Medaram, Telangana",
      "coordinates": [
        80.001,
        18.335
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H025-25",
    "name": "Haritha Hotel Bogatha",
    "category": "Tourist Hotel",
    "description": "Accommodation near Bogatha Waterfalls.",
    "image": "/images/chowmahalla-palace.jpg",
    "position": [
      17.914,
      80.25
    ],
    "location": {
      "address": "Haritha Hotel Bogatha, Telangana",
      "coordinates": [
        80.25,
        17.914
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H001-27",
    "name": "The Taj Mahal Palace",
    "category": "Luxury Hotel",
    "description": "Iconic luxury hotel overlooking the Gateway of India and Mumbai Harbour.",
    "image": "/images/devarakonda-fort.jpg",
    "position": [
      17.4474,
      78.3354
    ],
    "location": {
      "address": "The Taj Mahal Palace, Telangana",
      "coordinates": [
        78.3354,
        17.4474
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H002-28",
    "name": "Taj Lands End",
    "category": "Luxury Hotel",
    "description": "Famous luxury hotel with Arabian Sea views and premium hospitality.",
    "image": "/images/dhanushkodi.jpg",
    "position": [
      17.4586,
      78.3362
    ],
    "location": {
      "address": "Taj Lands End, Telangana",
      "coordinates": [
        78.3362,
        17.4586
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H003-29",
    "name": "Taj Mahal, New Delhi",
    "category": "Luxury Hotel",
    "description": "Landmark luxury hotel close to major attractions in central Delhi.",
    "image": "/images/dharmapuri-temple.jpg",
    "position": [
      17.463,
      78.3362
    ],
    "location": {
      "address": "Taj Mahal, New Delhi, Telangana",
      "coordinates": [
        78.3362,
        17.463
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H004-30",
    "name": "Taj Palace, New Delhi",
    "category": "Luxury Hotel",
    "description": "Well-known luxury hotel popular with international and business travellers.",
    "image": "/images/dholavira.jpg",
    "position": [
      17.4722,
      78.337
    ],
    "location": {
      "address": "Taj Palace, New Delhi, Telangana",
      "coordinates": [
        78.337,
        17.4722
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H005-31",
    "name": "The Oberoi Amarvilas",
    "category": "Luxury Resort",
    "description": "Luxury resort famous for views of the Taj Mahal.",
    "image": "/images/digha.jpg",
    "position": [
      17.4798,
      78.3366
    ],
    "location": {
      "address": "The Oberoi Amarvilas, Telangana",
      "coordinates": [
        78.3366,
        17.4798
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H006-32",
    "name": "The Oberoi, Mumbai",
    "category": "Luxury Hotel",
    "description": "Premium hotel overlooking Marine Drive and the Arabian Sea.",
    "image": "/images/domakonda-fort.jpg",
    "position": [
      17.3614,
      78.3444
    ],
    "location": {
      "address": "The Oberoi, Mumbai, Telangana",
      "coordinates": [
        78.3444,
        17.3614
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H007-33",
    "name": "The Oberoi, New Delhi",
    "category": "Luxury Hotel",
    "description": "Iconic luxury hotel near Delhi's major heritage attractions.",
    "image": "/images/Elgandal_Fort.jpg",
    "position": [
      17.3702,
      78.344
    ],
    "location": {
      "address": "The Oberoi, New Delhi, Telangana",
      "coordinates": [
        78.344,
        17.3702
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H008-34",
    "name": "The Oberoi Rajvilas",
    "category": "Luxury Resort",
    "description": "Famous heritage-style luxury resort in Jaipur.",
    "image": "/images/ethipothala-waterfalls.jpg",
    "position": [
      17.3754,
      78.346
    ],
    "location": {
      "address": "The Oberoi Rajvilas, Telangana",
      "coordinates": [
        78.346,
        17.3754
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H009-35",
    "name": "The Oberoi Udaivilas",
    "category": "Luxury Resort",
    "description": "Luxury resort overlooking Lake Pichola and Udaipur's heritage landscape.",
    "image": "/images/falakuma-palace.jpg",
    "position": [
      17.3862,
      78.3448
    ],
    "location": {
      "address": "The Oberoi Udaivilas, Telangana",
      "coordinates": [
        78.3448,
        17.3862
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H010-36",
    "name": "The Oberoi Vanyavilas",
    "category": "Luxury Resort",
    "description": "Luxury wildlife resort near Ranthambore National Park.",
    "image": "/images/gadwal-fort.jpg",
    "position": [
      17.3914,
      78.3452
    ],
    "location": {
      "address": "The Oberoi Vanyavilas, Telangana",
      "coordinates": [
        78.3452,
        17.3914
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H011-37",
    "name": "ITC Maurya",
    "category": "Luxury Hotel",
    "description": "Famous luxury hotel in New Delhi known for fine dining and hospitality.",
    "image": "/images/gangtok.jpg",
    "position": [
      17.4006,
      78.3476
    ],
    "location": {
      "address": "ITC Maurya, Telangana",
      "coordinates": [
        78.3476,
        17.4006
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H012-38",
    "name": "ITC Grand Chola",
    "category": "Luxury Hotel",
    "description": "Large luxury hotel known for grand architecture and restaurants.",
    "image": "/images/gokarna-beach.jpg",
    "position": [
      17.4074,
      78.3452
    ],
    "location": {
      "address": "ITC Grand Chola, Telangana",
      "coordinates": [
        78.3452,
        17.4074
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H013-39",
    "name": "ITC Kohenur",
    "category": "Luxury Hotel",
    "description": "Modern luxury hotel overlooking Durgam Cheruvu.",
    "image": "/images/golconda-fort.jpg",
    "position": [
      17.43,
      78.3815
    ],
    "location": {
      "address": "ITC Kohenur, Telangana",
      "coordinates": [
        78.3815,
        17.43
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H014-40",
    "name": "ITC Kakatiya",
    "category": "Luxury Hotel",
    "description": "Established luxury hotel in Hyderabad known for business and leisure stays.",
    "image": "/images/golconda-light-show.jpg",
    "position": [
      17.4338,
      78.456
    ],
    "location": {
      "address": "ITC Kakatiya, Telangana",
      "coordinates": [
        78.456,
        17.4338
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H015-41",
    "name": "ITC Royal Bengal",
    "category": "Luxury Hotel",
    "description": "Grand luxury hotel near Kolkata's major attractions.",
    "image": "/images/guruvayur.jpg",
    "position": [
      17.4334,
      78.3468
    ],
    "location": {
      "address": "ITC Royal Bengal, Telangana",
      "coordinates": [
        78.3468,
        17.4334
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H016-42",
    "name": "ITC Sonar",
    "category": "Luxury Hotel",
    "description": "Luxury hotel known for landscaped surroundings and fine dining.",
    "image": "/images/gwalior-fort.jpg",
    "position": [
      17.4406,
      78.3444
    ],
    "location": {
      "address": "ITC Sonar, Telangana",
      "coordinates": [
        78.3444,
        17.4406
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H017-43",
    "name": "ITC Mughal",
    "category": "Luxury Resort",
    "description": "Famous Agra resort inspired by Mughal architecture and heritage.",
    "image": "/images/hare-krishna-golden-temple.jpg",
    "position": [
      17.4494,
      78.344
    ],
    "location": {
      "address": "ITC Mughal, Telangana",
      "coordinates": [
        78.344,
        17.4494
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H018-44",
    "name": "ITC Rajputana",
    "category": "Luxury Hotel",
    "description": "Rajasthan-inspired luxury hotel in Jaipur.",
    "image": "/images/hatiyan-jhad.jpg",
    "position": [
      17.4586,
      78.344
    ],
    "location": {
      "address": "ITC Rajputana, Telangana",
      "coordinates": [
        78.344,
        17.4586
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H019-45",
    "name": "ITC Grand Goa",
    "category": "Luxury Resort",
    "description": "Luxury beachfront resort in Goa.",
    "image": "/images/himayat-sagar.jpg",
    "position": [
      17.4642,
      78.3448
    ],
    "location": {
      "address": "ITC Grand Goa, Telangana",
      "coordinates": [
        78.3448,
        17.4642
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H020-46",
    "name": "Taj Lake Palace",
    "category": "Heritage Luxury Hotel",
    "description": "Iconic palace hotel located on Lake Pichola.",
    "image": "/images/hoysaleswara.jpg",
    "position": [
      17.4738,
      78.3448
    ],
    "location": {
      "address": "Taj Lake Palace, Telangana",
      "coordinates": [
        78.3448,
        17.4738
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H021-47",
    "name": "Taj Falaknuma Palace",
    "category": "Heritage Luxury Hotel",
    "description": "Historic palace hotel offering a royal Hyderabad experience.",
    "image": "/images/hussain-sagar.jpg",
    "position": [
      17.3314,
      78.4678
    ],
    "location": {
      "address": "Taj Falaknuma Palace, Telangana",
      "coordinates": [
        78.4678,
        17.3314
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H022-48",
    "name": "Taj Rambagh Palace",
    "category": "Heritage Luxury Hotel",
    "description": "Historic royal palace converted into a luxury hotel in Jaipur.",
    "image": "/images/indian-museum.jpg",
    "position": [
      17.3598,
      78.3538
    ],
    "location": {
      "address": "Taj Rambagh Palace, Telangana",
      "coordinates": [
        78.3538,
        17.3598
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H023-49",
    "name": "Taj Hari Mahal",
    "category": "Luxury Hotel",
    "description": "Heritage-inspired luxury hotel in Jodhpur.",
    "image": "/images/indira-park.jpg",
    "position": [
      17.3702,
      78.3534
    ],
    "location": {
      "address": "Taj Hari Mahal, Telangana",
      "coordinates": [
        78.3534,
        17.3702
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H024-50",
    "name": "Umaid Bhawan Palace",
    "category": "Heritage Luxury Hotel",
    "description": "Magnificent palace hotel associated with Jodhpur's royal heritage.",
    "image": "/images/iskcon-temple.jpg",
    "position": [
      17.3754,
      78.3542
    ],
    "location": {
      "address": "Umaid Bhawan Palace, Telangana",
      "coordinates": [
        78.3542,
        17.3754
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H025-51",
    "name": "The Leela Palace New Delhi",
    "category": "Luxury Hotel",
    "description": "Grand luxury hotel with palace-inspired architecture.",
    "image": "/images/jagannath-temple.jpg",
    "position": [
      17.3866,
      78.3558
    ],
    "location": {
      "address": "The Leela Palace New Delhi, Telangana",
      "coordinates": [
        78.3558,
        17.3866
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H026-52",
    "name": "The Leela Palace Udaipur",
    "category": "Luxury Hotel",
    "description": "Luxury palace-style hotel overlooking Lake Pichola.",
    "image": "/images/jainath-temple.jpg",
    "position": [
      17.391,
      78.353
    ],
    "location": {
      "address": "The Leela Palace Udaipur, Telangana",
      "coordinates": [
        78.353,
        17.391
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H027-53",
    "name": "The Leela Palace Bengaluru",
    "category": "Luxury Hotel",
    "description": "Famous luxury hotel in central Bengaluru.",
    "image": "/images/jurala-dam.jpg",
    "position": [
      17.3998,
      78.3546
    ],
    "location": {
      "address": "The Leela Palace Bengaluru, Telangana",
      "coordinates": [
        78.3546,
        17.3998
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H028-54",
    "name": "The Leela Palace Chennai",
    "category": "Luxury Hotel",
    "description": "Luxury coastal hotel overlooking the Bay of Bengal.",
    "image": "/images/kadam-dam.jpg",
    "position": [
      17.4078,
      78.355
    ],
    "location": {
      "address": "The Leela Palace Chennai, Telangana",
      "coordinates": [
        78.355,
        17.4078
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H029-55",
    "name": "JW Marriott Hotel Bengaluru",
    "category": "Luxury Hotel",
    "description": "Popular luxury hotel in central Bengaluru.",
    "image": "/images/kaeshwaram-temple.jpg",
    "position": [
      17.4178,
      78.355
    ],
    "location": {
      "address": "JW Marriott Hotel Bengaluru, Telangana",
      "coordinates": [
        78.355,
        17.4178
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H030-56",
    "name": "JW Marriott Mumbai Juhu",
    "category": "Luxury Hotel",
    "description": "Famous beachfront luxury hotel near Juhu Beach.",
    "image": "/images/karmanghat-hanuman.jpg",
    "position": [
      17.4246,
      78.353
    ],
    "location": {
      "address": "JW Marriott Mumbai Juhu, Telangana",
      "coordinates": [
        78.353,
        17.4246
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H031-57",
    "name": "JW Marriott Hotel New Delhi Aerocity",
    "category": "Luxury Hotel",
    "description": "Premium hotel near Delhi airport and Aerocity.",
    "image": "/images/kashi-bugga-temple.jpg",
    "position": [
      17.4342,
      78.355
    ],
    "location": {
      "address": "JW Marriott Hotel New Delhi Aerocity, Telangana",
      "coordinates": [
        78.355,
        17.4342
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H032-58",
    "name": "JW Marriott Hotel Kolkata",
    "category": "Luxury Hotel",
    "description": "Modern luxury hotel in Kolkata.",
    "image": "/images/kawal-tiger-reserve.jpg",
    "position": [
      17.4422,
      78.3558
    ],
    "location": {
      "address": "JW Marriott Hotel Kolkata, Telangana",
      "coordinates": [
        78.3558,
        17.4422
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H033-59",
    "name": "JW Marriott Goa",
    "category": "Luxury Resort",
    "description": "Luxury beachfront resort in Goa.",
    "image": "/images/kbr-national-park.jpg",
    "position": [
      17.4482,
      78.355
    ],
    "location": {
      "address": "JW Marriott Goa, Telangana",
      "coordinates": [
        78.355,
        17.4482
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H034-60",
    "name": "The St. Regis Mumbai",
    "category": "Luxury Hotel",
    "description": "Landmark luxury hotel in Lower Parel.",
    "image": "/images/keesaragutta.jpg",
    "position": [
      17.4566,
      78.3538
    ],
    "location": {
      "address": "The St. Regis Mumbai, Telangana",
      "coordinates": [
        78.3538,
        17.4566
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H035-61",
    "name": "The St. Regis Goa Resort",
    "category": "Luxury Resort",
    "description": "Luxury resort in Goa with premium leisure facilities.",
    "image": "/images/khursheed-jah-devdi.jpg",
    "position": [
      17.4654,
      78.353
    ],
    "location": {
      "address": "The St. Regis Goa Resort, Telangana",
      "coordinates": [
        78.353,
        17.4654
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H036-62",
    "name": "Taj Exotica Resort & Spa Goa",
    "category": "Luxury Resort",
    "description": "Luxury beachfront resort surrounded by tropical landscapes.",
    "image": "/images/kinnerasani-wildlife.jpg",
    "position": [
      17.473,
      78.3542
    ],
    "location": {
      "address": "Taj Exotica Resort & Spa Goa, Telangana",
      "coordinates": [
        78.3542,
        17.473
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H037-63",
    "name": "Taj Madikeri Resort & Spa",
    "category": "Luxury Resort",
    "description": "Luxury nature resort surrounded by Coorg's hills and forests.",
    "image": "/images/Kinnerasani_Dam.jpg",
    "position": [
      17.479,
      78.3542
    ],
    "location": {
      "address": "Taj Madikeri Resort & Spa, Telangana",
      "coordinates": [
        78.3542,
        17.479
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H038-64",
    "name": "Taj Tirupati",
    "category": "Luxury Hotel",
    "description": "Luxury hotel suited to visitors exploring Tirupati's temples.",
    "image": "/images/kodailkanal.jpg",
    "position": [
      17.359,
      78.3636
    ],
    "location": {
      "address": "Taj Tirupati, Telangana",
      "coordinates": [
        78.3636,
        17.359
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H039-65",
    "name": "Taj Bengal",
    "category": "Luxury Hotel",
    "description": "Iconic luxury hotel in Kolkata.",
    "image": "/images/koilsagar-dam.jpg",
    "position": [
      17.367,
      78.3628
    ],
    "location": {
      "address": "Taj Bengal, Telangana",
      "coordinates": [
        78.3628,
        17.367
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H040-66",
    "name": "Taj Amer",
    "category": "Luxury Hotel",
    "description": "Luxury hotel near the famous Amer Fort.",
    "image": "/images/kolanpaku-jain-temple.jpg",
    "position": [
      17.377,
      78.3652
    ],
    "location": {
      "address": "Taj Amer, Telangana",
      "coordinates": [
        78.3652,
        17.377
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H041-67",
    "name": "The Oberoi Cecil",
    "category": "Heritage Luxury Hotel",
    "description": "Historic luxury hotel in Shimla.",
    "image": "/images/komuravalli-mallanna.jpg",
    "position": [
      17.385,
      78.364
    ],
    "location": {
      "address": "The Oberoi Cecil, Telangana",
      "coordinates": [
        78.364,
        17.385
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H042-68",
    "name": "Wildflower Hall",
    "category": "Luxury Resort",
    "description": "Mountain luxury resort near Shimla.",
    "image": "/images/Kondagattu_anjaneya_swamy_temple.jpg",
    "position": [
      17.3922,
      78.364
    ],
    "location": {
      "address": "Wildflower Hall, Telangana",
      "coordinates": [
        78.364,
        17.3922
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H043-69",
    "name": "The Oberoi Grand",
    "category": "Heritage Luxury Hotel",
    "description": "Historic landmark hotel in Kolkata.",
    "image": "/images/kondapochamma-sagar.jpg",
    "position": [
      17.3994,
      78.3636
    ],
    "location": {
      "address": "The Oberoi Grand, Telangana",
      "coordinates": [
        78.3636,
        17.3994
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H044-70",
    "name": "The Oberoi, Bengaluru",
    "category": "Luxury Hotel",
    "description": "Well-known luxury hotel in Bengaluru.",
    "image": "/images/kotepally-reservoir.jpg",
    "position": [
      17.4078,
      78.3632
    ],
    "location": {
      "address": "The Oberoi, Bengaluru, Telangana",
      "coordinates": [
        78.3632,
        17.4078
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H045-71",
    "name": "The Oberoi Gurgaon",
    "category": "Luxury Hotel",
    "description": "Premium business and leisure hotel near Delhi NCR.",
    "image": "/images/kovalam-beach-light.jpg",
    "position": [
      17.417,
      78.3648
    ],
    "location": {
      "address": "The Oberoi Gurgaon, Telangana",
      "coordinates": [
        78.3648,
        17.417
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H046-72",
    "name": "The Leela Kovalam",
    "category": "Luxury Resort",
    "description": "Famous beachfront resort overlooking the Arabian Sea.",
    "image": "/images/kuntala-waterfalls.jpg",
    "position": [
      17.4242,
      78.3628
    ],
    "location": {
      "address": "The Leela Kovalam, Telangana",
      "coordinates": [
        78.3628,
        17.4242
      ]
    },
    "rating": 4.6
  },
  {
    "id": "hotel-H047-73",
    "name": "Taj Wayanad Resort & Spa",
    "category": "Luxury Resort",
    "description": "Nature-focused luxury resort in Kerala.",
    "image": "/images/laad-bazaar.jpg",
    "position": [
      17.4334,
      78.3632
    ],
    "location": {
      "address": "Taj Wayanad Resort & Spa, Telangana",
      "coordinates": [
        78.3632,
        17.4334
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "hotel-H048-74",
    "name": "Taj Guras Kutir Resort & Spa",
    "category": "Luxury Resort",
    "description": "Luxury Himalayan resort in Gangtok.",
    "image": "/images/lothal.jpg",
    "position": [
      17.4426,
      78.3644
    ],
    "location": {
      "address": "Taj Guras Kutir Resort & Spa, Telangana",
      "coordinates": [
        78.3644,
        17.4426
      ]
    },
    "rating": 4.8
  },
  {
    "id": "hotel-H049-75",
    "name": "Taj Theog Resort & Spa",
    "category": "Luxury Resort",
    "description": "Mountain resort surrounded by Himalayan scenery.",
    "image": "/images/lower-manair-dam.jpg",
    "position": [
      17.4502,
      78.362
    ],
    "location": {
      "address": "Taj Theog Resort & Spa, Telangana",
      "coordinates": [
        78.362,
        17.4502
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "hotel-H050-76",
    "name": "The Oberoi Rajgarh Palace",
    "category": "Heritage Hotel",
    "description": "Heritage luxury property near the Khajuraho region.",
    "image": "/images/Lumbini-Park.jpg",
    "position": [
      17.4566,
      78.364
    ],
    "location": {
      "address": "The Oberoi Rajgarh Palace, Telangana",
      "coordinates": [
        78.364,
        17.4566
      ]
    },
    "rating": 4.6
  }
]

export const restaurants = [
  {
    "id": "restaurant-R001-1",
    "name": "Hotel Shadab",
    "category": "Hyderabadi",
    "description": "Popular restaurant known for Hyderabadi biryani and local cuisine.",
    "image": "/images/alampur-jogulamba.jpg",
    "position": [
      17.3599,
      78.473
    ],
    "location": {
      "address": "Hotel Shadab, Telangana",
      "coordinates": [
        78.473,
        17.3599
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R002-2",
    "name": "Paradise Biryani",
    "category": "Hyderabadi",
    "description": "Popular restaurant serving Hyderabadi biryani and Indian cuisine.",
    "image": "/images/amrabad-tiger-reserve.jpg",
    "position": [
      17.4419,
      78.4906
    ],
    "location": {
      "address": "Paradise Biryani, Telangana",
      "coordinates": [
        78.4906,
        17.4419
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R003-3",
    "name": "Madina Hotel",
    "category": "Hyderabadi",
    "description": "Traditional restaurant known for affordable local food.",
    "image": "/images/anantha-padmanabha.jpg",
    "position": [
      17.3605,
      78.473
    ],
    "location": {
      "address": "Madina Hotel, Telangana",
      "coordinates": [
        78.473,
        17.3605
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R004-4",
    "name": "Pista House",
    "category": "Hyderabadi",
    "description": "Popular restaurant and bakery famous for biryani and Haleem.",
    "image": "/images/anathagiri-hills.jpg",
    "position": [
      17.347,
      78.475
    ],
    "location": {
      "address": "Pista House, Telangana",
      "coordinates": [
        78.475,
        17.347
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R005-5",
    "name": "Rumaan Restaurant",
    "category": "Hyderabadi",
    "description": "Local restaurant serving traditional Hyderabadi dishes.",
    "image": "/images/ashtalakshmi-temple.jpg",
    "position": [
      17.358,
      78.471
    ],
    "location": {
      "address": "Rumaan Restaurant, Telangana",
      "coordinates": [
        78.471,
        17.358
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R006-6",
    "name": "Aiwan-e-Khas by Shadab",
    "category": "Hyderabadi",
    "description": "Restaurant serving traditional Hyderabadi and Mughlai cuisine.",
    "image": "/images/athirappilly.jpg",
    "position": [
      17.36,
      78.473
    ],
    "location": {
      "address": "Aiwan-e-Khas by Shadab, Telangana",
      "coordinates": [
        78.473,
        17.36
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R007-7",
    "name": "Metro Restaurant",
    "category": "Hyderabadi",
    "description": "Local restaurant near Laad Bazaar serving Indian cuisine.",
    "image": "/images/balkampet-yellamma.jpg",
    "position": [
      17.361,
      78.475
    ],
    "location": {
      "address": "Metro Restaurant, Telangana",
      "coordinates": [
        78.475,
        17.361
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R008-8",
    "name": "Parampara - Flavours of India",
    "category": "Indian / Vegetarian",
    "description": "Vegetarian restaurant serving traditional Indian cuisine.",
    "image": "/images/bandipur.jpg",
    "position": [
      17.417,
      78.439
    ],
    "location": {
      "address": "Parampara - Flavours of India, Telangana",
      "coordinates": [
        78.439,
        17.417
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R009-9",
    "name": "Chutneys",
    "category": "South Indian",
    "description": "Popular South Indian restaurant known for breakfast and vegetarian dishes.",
    "image": "/images/basara-temple.jpg",
    "position": [
      17.423,
      78.435
    ],
    "location": {
      "address": "Chutneys, Telangana",
      "coordinates": [
        78.435,
        17.423
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R010-10",
    "name": "Barbeque Nation",
    "category": "BBQ / Indian",
    "description": "Popular buffet restaurant with live-grill dining.",
    "image": "/images/begum-bazaar.jpg",
    "position": [
      17.417,
      78.439
    ],
    "location": {
      "address": "Barbeque Nation, Telangana",
      "coordinates": [
        78.439,
        17.417
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R011-11",
    "name": "Exotica Banjara Hills",
    "category": "North Indian",
    "description": "Restaurant offering North Indian cuisine with city views.",
    "image": "/images/bekal-fort.jpg",
    "position": [
      17.421,
      78.437
    ],
    "location": {
      "address": "Exotica Banjara Hills, Telangana",
      "coordinates": [
        78.437,
        17.421
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R012-12",
    "name": "Pakka Local",
    "category": "Indian",
    "description": "Restaurant offering Indian and regional dishes.",
    "image": "/images/belur-temple.jpg",
    "position": [
      17.42,
      78.438
    ],
    "location": {
      "address": "Pakka Local, Telangana",
      "coordinates": [
        78.438,
        17.42
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R013-13",
    "name": "Absolute Barbecues",
    "category": "BBQ",
    "description": "Buffet restaurant specializing in grilled and barbecue dishes.",
    "image": "/images/bhadrachalam-temple.jpg",
    "position": [
      17.431,
      78.407
    ],
    "location": {
      "address": "Absolute Barbecues, Telangana",
      "coordinates": [
        78.407,
        17.431
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R014-14",
    "name": "Flechazo",
    "category": "Multi Cuisine",
    "description": "Multi-cuisine restaurant with buffet dining.",
    "image": "/images/bhagya-laxmi-temple.jpg",
    "position": [
      17.431,
      78.408
    ],
    "location": {
      "address": "Flechazo, Telangana",
      "coordinates": [
        78.408,
        17.431
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R015-15",
    "name": "Shah Ghouse",
    "category": "Hyderabadi",
    "description": "Popular local restaurant serving biryani and Hyderabadi dishes.",
    "image": "/images/bhimbetka.jpg",
    "position": [
      17.3948,
      78.431
    ],
    "location": {
      "address": "Shah Ghouse, Telangana",
      "coordinates": [
        78.431,
        17.3948
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R016-16",
    "name": "Bawarchi",
    "category": "Hyderabadi",
    "description": "Famous restaurant known for biryani and traditional cuisine.",
    "image": "/images/bhongir.jpg",
    "position": [
      17.4042,
      78.4912
    ],
    "location": {
      "address": "Bawarchi, Telangana",
      "coordinates": [
        78.4912,
        17.4042
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R017-17",
    "name": "Cafe Bahar",
    "category": "Hyderabadi",
    "description": "Long-running restaurant serving biryani and Indian cuisine.",
    "image": "/images/birla-mandir.jpg",
    "position": [
      17.4005,
      78.4782
    ],
    "location": {
      "address": "Cafe Bahar, Telangana",
      "coordinates": [
        78.4782,
        17.4005
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R018-18",
    "name": "Kritunga Restaurant",
    "category": "Andhra / Telugu",
    "description": "Restaurant specializing in Andhra and Telugu cuisine.",
    "image": "/images/birla-science-museum.jpg",
    "position": [
      17.42,
      78.45
    ],
    "location": {
      "address": "Kritunga Restaurant, Telangana",
      "coordinates": [
        78.45,
        17.42
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R019-19",
    "name": "Minerva Coffee Shop",
    "category": "South Indian",
    "description": "Popular restaurant serving South Indian breakfast and meals.",
    "image": "/images/british-residency.jpg",
    "position": [
      17.402,
      78.483
    ],
    "location": {
      "address": "Minerva Coffee Shop, Telangana",
      "coordinates": [
        78.483,
        17.402
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R020-20",
    "name": "Rayalaseema Ruchulu",
    "category": "Telugu Cuisine",
    "description": "Restaurant specializing in Rayalaseema and Andhra cuisine.",
    "image": "/images/buddha-statue.jpg",
    "position": [
      17.425,
      78.45
    ],
    "location": {
      "address": "Rayalaseema Ruchulu, Telangana",
      "coordinates": [
        78.45,
        17.425
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R021-21",
    "name": "Jewel of Nizam",
    "category": "Fine Dining",
    "description": "Premium restaurant serving Indian cuisine in a heritage-style setting.",
    "image": "/images/charminar.jpg",
    "position": [
      17.398,
      78.365
    ],
    "location": {
      "address": "Jewel of Nizam, Telangana",
      "coordinates": [
        78.365,
        17.398
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R022-22",
    "name": "Okra",
    "category": "Multi Cuisine",
    "description": "Multi-cuisine restaurant located in a premium hotel.",
    "image": "/images/Chaya_Someshwara_Temple.jpg",
    "position": [
      17.42,
      78.457
    ],
    "location": {
      "address": "Okra, Telangana",
      "coordinates": [
        78.457,
        17.42
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R023-23",
    "name": "Seasonal Tastes",
    "category": "Multi Cuisine",
    "description": "Restaurant offering international and Indian cuisine.",
    "image": "/images/chettinad-palace.jpg",
    "position": [
      17.431,
      78.457
    ],
    "location": {
      "address": "Seasonal Tastes, Telangana",
      "coordinates": [
        78.457,
        17.431
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R024-24",
    "name": "Flechazo HITEC City",
    "category": "Multi Cuisine",
    "description": "Buffet restaurant serving multiple cuisines.",
    "image": "/images/chilkur-balaji.jpg",
    "position": [
      17.45,
      78.382
    ],
    "location": {
      "address": "Flechazo HITEC City, Telangana",
      "coordinates": [
        78.382,
        17.45
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R025-25",
    "name": "Mazzo",
    "category": "Multi Cuisine",
    "description": "Contemporary restaurant serving Indian and international dishes.",
    "image": "/images/chowmahalla-palace.jpg",
    "position": [
      17.448,
      78.382
    ],
    "location": {
      "address": "Mazzo, Telangana",
      "coordinates": [
        78.382,
        17.448
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R001-27",
    "name": "Bukhara",
    "category": "Indian Fine Dining",
    "description": "Legendary restaurant famous for North Indian cuisine and rustic ambience.",
    "image": "/images/devarakonda-fort.jpg",
    "position": [
      17.4302,
      78.3782
    ],
    "location": {
      "address": "Bukhara, Telangana",
      "coordinates": [
        78.3782,
        17.4302
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R002-28",
    "name": "Karim's",
    "category": "Mughlai",
    "description": "Historic restaurant famous for Mughlai dishes.",
    "image": "/images/dhanushkodi.jpg",
    "position": [
      17.4386,
      78.3766
    ],
    "location": {
      "address": "Karim's, Telangana",
      "coordinates": [
        78.3766,
        17.4386
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R003-29",
    "name": "Indian Accent",
    "category": "Modern Indian",
    "description": "Internationally recognized restaurant offering modern Indian cuisine.",
    "image": "/images/dharmapuri-temple.jpg",
    "position": [
      17.445,
      78.3762
    ],
    "location": {
      "address": "Indian Accent, Telangana",
      "coordinates": [
        78.3762,
        17.445
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R004-30",
    "name": "Saravana Bhavan",
    "category": "South Indian",
    "description": "Famous restaurant chain specializing in South Indian vegetarian food.",
    "image": "/images/dholavira.jpg",
    "position": [
      17.4538,
      78.377
    ],
    "location": {
      "address": "Saravana Bhavan, Telangana",
      "coordinates": [
        78.377,
        17.4538
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R005-31",
    "name": "Paragon Restaurant",
    "category": "Malabar Cuisine",
    "description": "Famous Kerala restaurant known for Malabar-style dishes.",
    "image": "/images/digha.jpg",
    "position": [
      17.4606,
      78.3762
    ],
    "location": {
      "address": "Paragon Restaurant, Telangana",
      "coordinates": [
        78.3762,
        17.4606
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R006-32",
    "name": "Paradise Biryani",
    "category": "Hyderabadi",
    "description": "Famous restaurant chain known for Hyderabadi biryani.",
    "image": "/images/domakonda-fort.jpg",
    "position": [
      17.4419,
      78.4906
    ],
    "location": {
      "address": "Paradise Biryani, Telangana",
      "coordinates": [
        78.4906,
        17.4419
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R007-33",
    "name": "Shadab Restaurant",
    "category": "Hyderabadi",
    "description": "Popular restaurant known for biryani and traditional Hyderabadi cuisine.",
    "image": "/images/Elgandal_Fort.jpg",
    "position": [
      17.3616,
      78.4747
    ],
    "location": {
      "address": "Shadab Restaurant, Telangana",
      "coordinates": [
        78.4747,
        17.3616
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R008-34",
    "name": "Bawarchi",
    "category": "Hyderabadi",
    "description": "Famous Hyderabad restaurant specializing in biryani.",
    "image": "/images/ethipothala-waterfalls.jpg",
    "position": [
      17.4042,
      78.4912
    ],
    "location": {
      "address": "Bawarchi, Telangana",
      "coordinates": [
        78.4912,
        17.4042
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R009-35",
    "name": "Cafe Bahar",
    "category": "Hyderabadi",
    "description": "Long-established restaurant famous for biryani and local cuisine.",
    "image": "/images/falakuma-palace.jpg",
    "position": [
      17.4005,
      78.4782
    ],
    "location": {
      "address": "Cafe Bahar, Telangana",
      "coordinates": [
        78.4782,
        17.4005
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R010-36",
    "name": "Meghana Foods",
    "category": "South Indian",
    "description": "Popular Bengaluru restaurant known for biryani and Andhra-style food.",
    "image": "/images/gadwal-fort.jpg",
    "position": [
      17.3742,
      78.3844
    ],
    "location": {
      "address": "Meghana Foods, Telangana",
      "coordinates": [
        78.3844,
        17.3742
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R011-37",
    "name": "MTR",
    "category": "South Indian",
    "description": "Historic Bengaluru restaurant famous for traditional South Indian food.",
    "image": "/images/gangtok.jpg",
    "position": [
      17.3798,
      78.3844
    ],
    "location": {
      "address": "MTR, Telangana",
      "coordinates": [
        78.3844,
        17.3798
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R012-38",
    "name": "Vidyarthi Bhavan",
    "category": "South Indian",
    "description": "Iconic Bengaluru eatery famous for crispy dosas.",
    "image": "/images/gokarna-beach.jpg",
    "position": [
      17.3878,
      78.3876
    ],
    "location": {
      "address": "Vidyarthi Bhavan, Telangana",
      "coordinates": [
        78.3876,
        17.3878
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R013-39",
    "name": "Trishna",
    "category": "Seafood",
    "description": "Famous Mumbai restaurant known for seafood and coastal cuisine.",
    "image": "/images/golconda-fort.jpg",
    "position": [
      17.3958,
      78.3848
    ],
    "location": {
      "address": "Trishna, Telangana",
      "coordinates": [
        78.3848,
        17.3958
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R014-40",
    "name": "Britannia & Co.",
    "category": "Parsi",
    "description": "Historic Mumbai restaurant known for Parsi cuisine.",
    "image": "/images/golconda-light-show.jpg",
    "position": [
      17.405,
      78.3876
    ],
    "location": {
      "address": "Britannia & Co., Telangana",
      "coordinates": [
        78.3876,
        17.405
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R015-41",
    "name": "Peter Cat",
    "category": "Continental",
    "description": "Iconic Kolkata restaurant famous for Chelo Kebab.",
    "image": "/images/guruvayur.jpg",
    "position": [
      17.411,
      78.3868
    ],
    "location": {
      "address": "Peter Cat, Telangana",
      "coordinates": [
        78.3868,
        17.411
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R016-42",
    "name": "6 Ballygunge Place",
    "category": "Bengali",
    "description": "Popular restaurant serving traditional Bengali cuisine.",
    "image": "/images/gwalior-fort.jpg",
    "position": [
      17.4206,
      78.3864
    ],
    "location": {
      "address": "6 Ballygunge Place, Telangana",
      "coordinates": [
        78.3864,
        17.4206
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R017-43",
    "name": "Mocambo",
    "category": "Continental",
    "description": "Historic Kolkata restaurant known for classic Continental dishes.",
    "image": "/images/hare-krishna-golden-temple.jpg",
    "position": [
      17.4294,
      78.3852
    ],
    "location": {
      "address": "Mocambo, Telangana",
      "coordinates": [
        78.3852,
        17.4294
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R018-44",
    "name": "Kesar Da Dhaba",
    "category": "Punjabi",
    "description": "Historic Amritsar restaurant famous for Punjabi vegetarian food.",
    "image": "/images/hatiyan-jhad.jpg",
    "position": [
      17.4382,
      78.3856
    ],
    "location": {
      "address": "Kesar Da Dhaba, Telangana",
      "coordinates": [
        78.3856,
        17.4382
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R019-45",
    "name": "Beera Chicken",
    "category": "Punjabi",
    "description": "Popular Amritsar eatery known for tandoori chicken.",
    "image": "/images/himayat-sagar.jpg",
    "position": [
      17.443,
      78.3868
    ],
    "location": {
      "address": "Beera Chicken, Telangana",
      "coordinates": [
        78.3868,
        17.443
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R020-46",
    "name": "Suvarna Mahal",
    "category": "Rajasthani",
    "description": "Luxury dining restaurant offering traditional Rajasthani cuisine.",
    "image": "/images/hoysaleswara.jpg",
    "position": [
      17.4542,
      78.3876
    ],
    "location": {
      "address": "Suvarna Mahal, Telangana",
      "coordinates": [
        78.3876,
        17.4542
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R021-47",
    "name": "LMB – Lakshmi Misthan Bhandar",
    "category": "Rajasthani",
    "description": "Famous Jaipur restaurant and sweet shop.",
    "image": "/images/hussain-sagar.jpg",
    "position": [
      17.4618,
      78.3856
    ],
    "location": {
      "address": "LMB – Lakshmi Misthan Bhandar, Telangana",
      "coordinates": [
        78.3856,
        17.4618
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R022-48",
    "name": "Chokhi Dhani Restaurant",
    "category": "Rajasthani",
    "description": "Popular destination for traditional Rajasthani food and cultural experiences.",
    "image": "/images/indian-museum.jpg",
    "position": [
      17.3422,
      78.3962
    ],
    "location": {
      "address": "Chokhi Dhani Restaurant, Telangana",
      "coordinates": [
        78.3962,
        17.3422
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R023-49",
    "name": "Natraj Dining Hall",
    "category": "Gujarati",
    "description": "Famous Udaipur restaurant serving traditional vegetarian thali.",
    "image": "/images/indira-park.jpg",
    "position": [
      17.3502,
      78.3958
    ],
    "location": {
      "address": "Natraj Dining Hall, Telangana",
      "coordinates": [
        78.3958,
        17.3502
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R024-50",
    "name": "Dal Bati Churma Restaurant",
    "category": "Rajasthani",
    "description": "Traditional restaurant specializing in Rajasthan's famous dal bati.",
    "image": "/images/iskcon-temple.jpg",
    "position": [
      17.3558,
      78.3938
    ],
    "location": {
      "address": "Dal Bati Churma Restaurant, Telangana",
      "coordinates": [
        78.3938,
        17.3558
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R025-51",
    "name": "Peshawri",
    "category": "North Indian",
    "description": "Famous fine-dining restaurant known for North-West Frontier cuisine.",
    "image": "/images/jagannath-temple.jpg",
    "position": [
      17.363,
      78.3954
    ],
    "location": {
      "address": "Peshawri, Telangana",
      "coordinates": [
        78.3954,
        17.363
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R026-52",
    "name": "Masala Library",
    "category": "Modern Indian",
    "description": "High-end restaurant presenting innovative Indian cuisine.",
    "image": "/images/jainath-temple.jpg",
    "position": [
      17.3742,
      78.3958
    ],
    "location": {
      "address": "Masala Library, Telangana",
      "coordinates": [
        78.3958,
        17.3742
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R027-53",
    "name": "Dum Pukht",
    "category": "Awadhi",
    "description": "Famous fine-dining restaurant specializing in Awadhi cuisine.",
    "image": "/images/jurala-dam.jpg",
    "position": [
      17.3826,
      78.395
    ],
    "location": {
      "address": "Dum Pukht, Telangana",
      "coordinates": [
        78.395,
        17.3826
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R028-54",
    "name": "Baan Thai",
    "category": "Thai",
    "description": "Luxury restaurant known for Thai cuisine and fine dining.",
    "image": "/images/kadam-dam.jpg",
    "position": [
      17.3894,
      78.393
    ],
    "location": {
      "address": "Baan Thai, Telangana",
      "coordinates": [
        78.393,
        17.3894
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R029-55",
    "name": "Dakshin",
    "category": "South Indian",
    "description": "Famous fine-dining restaurant specializing in South Indian cuisine.",
    "image": "/images/kaeshwaram-temple.jpg",
    "position": [
      17.397,
      78.3962
    ],
    "location": {
      "address": "Dakshin, Telangana",
      "coordinates": [
        78.3962,
        17.397
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R030-56",
    "name": "Karavalli",
    "category": "Coastal Indian",
    "description": "Famous Bengaluru restaurant serving coastal Indian cuisine.",
    "image": "/images/karmanghat-hanuman.jpg",
    "position": [
      17.4058,
      78.3954
    ],
    "location": {
      "address": "Karavalli, Telangana",
      "coordinates": [
        78.3954,
        17.4058
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R031-57",
    "name": "Toit",
    "category": "Pub / Multi-Cuisine",
    "description": "Famous Bengaluru destination known for food and craft beverages.",
    "image": "/images/kashi-bugga-temple.jpg",
    "position": [
      17.4114,
      78.3966
    ],
    "location": {
      "address": "Toit, Telangana",
      "coordinates": [
        78.3966,
        17.4114
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R032-58",
    "name": "Social",
    "category": "Multi-Cuisine",
    "description": "Popular urban restaurant and social dining chain.",
    "image": "/images/kawal-tiger-reserve.jpg",
    "position": [
      17.448,
      78.391
    ],
    "location": {
      "address": "Social, Telangana",
      "coordinates": [
        78.391,
        17.448
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R033-59",
    "name": "Flechazo",
    "category": "Multi-Cuisine",
    "description": "Popular buffet restaurant known for global and Indian dishes.",
    "image": "/images/kbr-national-park.jpg",
    "position": [
      17.448,
      78.391
    ],
    "location": {
      "address": "Flechazo, Telangana",
      "coordinates": [
        78.391,
        17.448
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R034-60",
    "name": "Barbeque Nation",
    "category": "Buffet / Grill",
    "description": "Popular Indian restaurant chain known for live grills and buffet dining.",
    "image": "/images/keesaragutta.jpg",
    "position": [
      17.412,
      78.448
    ],
    "location": {
      "address": "Barbeque Nation, Telangana",
      "coordinates": [
        78.448,
        17.412
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R035-61",
    "name": "Absolute Barbecues",
    "category": "Buffet / Grill",
    "description": "Popular buffet chain offering live grills and international cuisine.",
    "image": "/images/khursheed-jah-devdi.jpg",
    "position": [
      17.43,
      78.38
    ],
    "location": {
      "address": "Absolute Barbecues, Telangana",
      "coordinates": [
        78.38,
        17.43
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R036-62",
    "name": "Sagar Ratna",
    "category": "South Indian",
    "description": "Popular vegetarian South Indian restaurant chain.",
    "image": "/images/kinnerasani-wildlife.jpg",
    "position": [
      17.4546,
      78.3958
    ],
    "location": {
      "address": "Sagar Ratna, Telangana",
      "coordinates": [
        78.3958,
        17.4546
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R037-63",
    "name": "Haldiram's",
    "category": "Indian Vegetarian",
    "description": "Famous Indian restaurant and sweets chain.",
    "image": "/images/Kinnerasani_Dam.jpg",
    "position": [
      17.4614,
      78.3946
    ],
    "location": {
      "address": "Haldiram's, Telangana",
      "coordinates": [
        78.3946,
        17.4614
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R038-64",
    "name": "Bikanervala",
    "category": "Indian Vegetarian",
    "description": "Famous chain serving Indian snacks, sweets and meals.",
    "image": "/images/kodailkanal.jpg",
    "position": [
      17.3418,
      78.402
    ],
    "location": {
      "address": "Bikanervala, Telangana",
      "coordinates": [
        78.402,
        17.3418
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R039-65",
    "name": "Giani's",
    "category": "Indian Desserts",
    "description": "Popular Indian dessert and food chain.",
    "image": "/images/koilsagar-dam.jpg",
    "position": [
      17.3494,
      78.404
    ],
    "location": {
      "address": "Giani's, Telangana",
      "coordinates": [
        78.404,
        17.3494
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R040-66",
    "name": "JumboKing",
    "category": "Indian Fast Food",
    "description": "Popular Indian fast-food chain known for vada pav.",
    "image": "/images/kolanpaku-jain-temple.jpg",
    "position": [
      17.3578,
      78.4048
    ],
    "location": {
      "address": "JumboKing, Telangana",
      "coordinates": [
        78.4048,
        17.3578
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R041-67",
    "name": "A2B – Adyar Ananda Bhavan",
    "category": "South Indian",
    "description": "Famous vegetarian restaurant chain serving South Indian cuisine.",
    "image": "/images/komuravalli-mallanna.jpg",
    "position": [
      17.3646,
      78.4036
    ],
    "location": {
      "address": "A2B – Adyar Ananda Bhavan, Telangana",
      "coordinates": [
        78.4036,
        17.3646
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R042-68",
    "name": "Murugan Idli Shop",
    "category": "South Indian",
    "description": "Famous Tamil restaurant specializing in idli and traditional dishes.",
    "image": "/images/Kondagattu_anjaneya_swamy_temple.jpg",
    "position": [
      17.3726,
      78.4024
    ],
    "location": {
      "address": "Murugan Idli Shop, Telangana",
      "coordinates": [
        78.4024,
        17.3726
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R043-69",
    "name": "Hotel Saravana Bhavan",
    "category": "South Indian",
    "description": "Internationally recognized vegetarian South Indian restaurant chain.",
    "image": "/images/kondapochamma-sagar.jpg",
    "position": [
      17.3802,
      78.4056
    ],
    "location": {
      "address": "Hotel Saravana Bhavan, Telangana",
      "coordinates": [
        78.4056,
        17.3802
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R044-70",
    "name": "Anjappar",
    "category": "Chettinad",
    "description": "Famous restaurant chain specializing in Chettinad cuisine.",
    "image": "/images/kotepally-reservoir.jpg",
    "position": [
      17.3906,
      78.4024
    ],
    "location": {
      "address": "Anjappar, Telangana",
      "coordinates": [
        78.4024,
        17.3906
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R045-71",
    "name": "Kayees Biryani",
    "category": "Kerala / Biryani",
    "description": "Historic Kochi restaurant famous for biryani.",
    "image": "/images/kovalam-beach-light.jpg",
    "position": [
      17.3986,
      78.4028
    ],
    "location": {
      "address": "Kayees Biryani, Telangana",
      "coordinates": [
        78.4028,
        17.3986
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R046-72",
    "name": "Dhe Puttu",
    "category": "Kerala Cuisine",
    "description": "Popular Kerala restaurant known for traditional puttu dishes.",
    "image": "/images/kuntala-waterfalls.jpg",
    "position": [
      17.4058,
      78.4036
    ],
    "location": {
      "address": "Dhe Puttu, Telangana",
      "coordinates": [
        78.4036,
        17.4058
      ]
    },
    "rating": 4.6
  },
  {
    "id": "restaurant-R047-73",
    "name": "Kuttanadu Restaurant",
    "category": "Kerala Cuisine",
    "description": "Restaurant featuring traditional Kerala cuisine.",
    "image": "/images/laad-bazaar.jpg",
    "position": [
      17.413,
      78.4044
    ],
    "location": {
      "address": "Kuttanadu Restaurant, Telangana",
      "coordinates": [
        78.4044,
        17.413
      ]
    },
    "rating": 4.699999999999999
  },
  {
    "id": "restaurant-R048-74",
    "name": "Kori Rotti",
    "category": "Mangalorean",
    "description": "Popular restaurant style representing coastal Karnataka cuisine.",
    "image": "/images/lothal.jpg",
    "position": [
      17.4202,
      78.4056
    ],
    "location": {
      "address": "Kori Rotti, Telangana",
      "coordinates": [
        78.4056,
        17.4202
      ]
    },
    "rating": 4.8
  },
  {
    "id": "restaurant-R049-75",
    "name": "Thalassery Restaurant",
    "category": "Malabar Cuisine",
    "description": "Popular choice for Kerala Malabar cuisine and biryani.",
    "image": "/images/lower-manair-dam.jpg",
    "position": [
      17.4286,
      78.4048
    ],
    "location": {
      "address": "Thalassery Restaurant, Telangana",
      "coordinates": [
        78.4048,
        17.4286
      ]
    },
    "rating": 4.8999999999999995
  },
  {
    "id": "restaurant-R050-76",
    "name": "Tamarind Tree",
    "category": "Indian Fine Dining",
    "description": "Well-known destination restaurant offering Indian cuisine in an upscale setting.",
    "image": "/images/Lumbini-Park.jpg",
    "position": [
      17.4382,
      78.4024
    ],
    "location": {
      "address": "Tamarind Tree, Telangana",
      "coordinates": [
        78.4024,
        17.4382
      ]
    },
    "rating": 4.6
  }
]

export function enrichItem(item, defaultType = 'attraction') {
  if (!item) return null
  const isHotel = defaultType === 'hotel' || item.category?.toLowerCase().includes('hotel')
  const isRestaurant = defaultType === 'restaurant' || item.category?.toLowerCase().includes('restaurant') || item.category?.toLowerCase().includes('dining')
  const type = isHotel ? 'hotel' : isRestaurant ? 'restaurant' : 'attraction'

  let position = item.position || (item.location?.coordinates ? [item.location.coordinates[1], item.location.coordinates[0]] : [17.385, 78.4867])
  let [lat, lng] = position

  // 1. Swapped coordinates check (lat > 50 || lng < 40)
  if (lat > 50 || lng < 40) {
    console.warn(`[Data Validation Warning] Swapped coordinates detected for "${item.name}" (id: ${item.id}). Swapping [${lat}, ${lng}] -> [${lng}, ${lat}]`)
    const temp = lat
    lat = lng
    lng = temp
    position = [lat, lng]
  }

  // 2. India Bounding Box Validation (lat 6-37, lng 68-97)
  if (lat < 6 || lat > 37 || lng < 68 || lng > 97) {
    console.warn(`[Data Validation Warning] Coordinate outside India bounding box for "${item.name}" (id: ${item.id}): [${lat}, ${lng}]. Defaulting to Charminar.`)
    lat = 17.3614
    lng = 78.4747
    position = [lat, lng]
  }

  // 3. Regional cluster check for Hyderabad places
  const addr = (item.location?.address || item.city || item.name || '').toLowerCase()
  if (addr.includes('hyderabad') || addr.includes('charminar') || addr.includes('secunderabad')) {
    if (lat < 16.8 || lat > 17.8 || lng < 78.0 || lng > 78.9) {
      console.warn(`[Data Validation Warning] Regional cluster mismatch for Hyderabad place "${item.name}" (id: ${item.id}): [${lat}, ${lng}]`)
    }
  }

  const location = typeof item.location === 'object' ? {
    address: item.location.address || `${item.name}, Telangana`,
    coordinates: [position[1], position[0]]
  } : { address: `${item.name}, Telangana`, coordinates: [position[1], position[0]] }

  let price = item.price
  if (!price || typeof price !== 'object') {
    let amount = 0
    let unit = 'visit'
    if (isHotel) {
      if (item.name?.includes('Falaknuma')) {
        amount = 35000
      } else if (item.name?.includes('Taj') || item.name?.includes('Park Hyatt') || item.name?.includes('Oberoi')) {
        amount = 14500
      } else {
        amount = 6800
      }
      unit = 'night'
    } else if (isRestaurant) {
      if (item.category?.includes('Fine Dining') || item.name?.includes('Jewel')) {
        amount = 2200
      } else {
        amount = 950
      }
      unit = 'person'
    } else {
      if (item.name?.includes('Ramoji')) {
        amount = 1450
      } else if (item.category?.includes('Palace') || item.name?.includes('Palace')) {
        amount = 500
      } else if (item.category?.includes('Museum') || item.name?.includes('Museum')) {
        amount = 250
      } else {
        amount = 300
      }
      unit = 'visit'
    }
    price = { amount, currency: 'INR', unit }
  } else {
    let amount = price.amount ?? (isHotel ? 6800 : isRestaurant ? 950 : 300)
    const currency = 'INR'
    const unit = price.unit || (isHotel ? 'night' : isRestaurant ? 'person' : 'visit')
    if (price.currency === 'USD' || amount < 200) {
      amount = isHotel ? amount * 85 : isRestaurant ? amount * 40 : amount * 12
    }
    price = { amount: Math.round(amount), currency, unit }
  }

  let rules = item.rules
  if (!Array.isArray(rules) || rules.length === 0) {
    if (isHotel) {
      rules = [
        'Check-in: 2:00 PM · Check-out: 12:00 PM',
        'No pets allowed in rooms',
        'Smart casual dress code in dining areas',
        'Free cancellation up to 48 hours before check-in',
      ]
    } else if (isRestaurant) {
      rules = [
        `Opening hours: ${item.openingHours || '11:30 AM - 11:00 PM daily'}`,
        'Table reservations recommended for dinner',
        'Smart casual attire required',
        'Valet parking available at entrance',
      ]
    } else {
      rules = [
        `Visiting hours: ${item.openingHours || 'Daily, 9:00 AM - 5:00 PM'}`,
        'Photography permitted in designated areas',
        'Modest dress code encouraged for heritage areas',
        'Guided audio tours available at entrance',
      ]
    }
  }

  const category = item.category || (isHotel ? 'Luxury Hotel' : isRestaurant ? 'Fine Dining' : 'Attraction')
  const fallbackImage = getFallbackImage(category, type)

  return {
    ...item,
    category,
    fallbackImage,
    image: (item.image && typeof item.image === 'string' && item.image.trim()) ? item.image : fallbackImage,
    position,
    location,
    price,
    rules,
    rating: Number((item.rating || 4.7).toFixed(1)),
    description: item.description || `${item.name} is one of the notable ${isHotel ? 'stays' : isRestaurant ? 'dining destinations' : 'attractions'} in Telangana offering authentic regional hospitality.`,
  }
}

export const enrichedPlaces = places.map((p) => enrichItem(p, 'place'))
export const enrichedHotels = hotels.map((h) => enrichItem(h, 'hotel'))
export const enrichedRestaurants = restaurants.map((r) => enrichItem(r, 'restaurant'))

export const allDatasetPlaces = [
  ...enrichedPlaces,
  ...enrichedHotels,
  ...enrichedRestaurants,
]

export const mapAttractions = enrichedPlaces.map(({ id, name, category, rating, position }) => ({ id, name, category, rating, position }))

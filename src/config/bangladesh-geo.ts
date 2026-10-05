/**
 * Bangladesh Administrative Divisions, Districts, and Upazilas.
 * Covers all 64 districts organized across 8 divisions with primary upazilas/thanas.
 */

export interface DistrictGeo {
  district: string;
  division: string;
  upazilas: string[];
}

export const BANGLADESH_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
] as const;

export type DivisionName = (typeof BANGLADESH_DIVISIONS)[number];

export const BANGLADESH_GEO_DATA: DistrictGeo[] = [
  // --- DHAKA DIVISION ---
  {
    district: "Dhaka",
    division: "Dhaka",
    upazilas: [
      "Dhanmondi",
      "Gulshan",
      "Mirpur",
      "Uttara",
      "Mohammadpur",
      "Motijheel",
      "Tejgaon",
      "Banani",
      "Badda",
      "Khilgaon",
      "Ramna",
      "Paltan",
      "Lalbagh",
      "Savar",
      "Keraniganj",
      "Dhamrai",
      "Nawabganj",
      "Dohar",
    ],
  },
  {
    district: "Gazipur",
    division: "Dhaka",
    upazilas: ["Gazipur Sadar", "Kaliakair", "Kapasia", "Sreepur", "Kaliganj", "Tongi"],
  },
  {
    district: "Narayanganj",
    division: "Dhaka",
    upazilas: ["Narayanganj Sadar", "Bandar", "Araihazar", "Sonargaon", "Rupganj"],
  },
  {
    district: "Tangail",
    division: "Dhaka",
    upazilas: ["Tangail Sadar", "Mirzapur", "Delduar", "Ghatail", "Kalihati", "Madhupur", "Nagarpur", "Sakhipur", "Gopalpur", "Bhuapur", "Basail", "Dhanbari"],
  },
  {
    district: "Faridpur",
    division: "Dhaka",
    upazilas: ["Faridpur Sadar", "Boalmari", "Alfadanga", "Madhukhali", "Bhanga", "Nagarkanda", "Charbhadrasan", "Sadarpur", "Saltha"],
  },
  {
    district: "Manikganj",
    division: "Dhaka",
    upazilas: ["Manikganj Sadar", "Singair", "Saturia", "Shivalaya", "Ghior", "Harirampur", "Daulatpur"],
  },
  {
    district: "Munshiganj",
    division: "Dhaka",
    upazilas: ["Munshiganj Sadar", "Tongibari", "Sirajdikhan", "Lohajang", "Sreenagar", "Gazaria"],
  },
  {
    district: "Narsingdi",
    division: "Dhaka",
    upazilas: ["Narsingdi Sadar", "Palash", "Belabo", "Monohardi", "Shibpur", "Raipura"],
  },
  {
    district: "Gopalganj",
    division: "Dhaka",
    upazilas: ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"],
  },
  {
    district: "Kishoreganj",
    division: "Dhaka",
    upazilas: ["Kishoreganj Sadar", "Bhairab", "Bajitpur", "Katiadi", "Karimganj", "Nikli", "Tarail", "Hossainpur", "Pakundia", "Kuliarchar", "Itna", "Mithamain", "Austagram"],
  },
  {
    district: "Madaripur",
    division: "Dhaka",
    upazilas: ["Madaripur Sadar", "Shibchar", "Kalkini", "Rajoir", "Dasar"],
  },
  {
    district: "Rajbari",
    division: "Dhaka",
    upazilas: ["Rajbari Sadar", "Goalanda", "Pangsha", "Baliakandi", "Kalukhali"],
  },
  {
    district: "Shariatpur",
    division: "Dhaka",
    upazilas: ["Shariatpur Sadar", "Naria", "Zajira", "Bhedarganj", "Damudya", "Gosairhat"],
  },

  // --- CHATTOGRAM DIVISION ---
  {
    district: "Chattogram",
    division: "Chattogram",
    upazilas: ["Agrabad", "Kotwali", "Panchlaish", "Halishahar", "Pahartali", "Bakalia", "Khulshi", "Patenga", "Hathazari", "Sitakunda", "Mirsharai", "Patiya", "Boalkhali", "Anwara", "Chandanaish", "Rangunia", "Raozan", "Fatikchhari", "Banshkhali", "Lohagara", "Satkania", "Sandwip", "Karnafuli"],
  },
  {
    district: "Cox's Bazar",
    division: "Chattogram",
    upazilas: ["Cox's Bazar Sadar", "Chakaria", "Teknaf", "Ukhiya", "Maheshkhali", "Ramu", "Pekua", "Kutubdia", "Eidgaon"],
  },
  {
    district: "Cumilla",
    division: "Chattogram",
    upazilas: ["Cumilla Adarsha Sadar", "Cumilla Sadar Dakshin", "Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram", "Daudkandi", "Debidwar", "Homna", "Laksam", "Muradnagar", "Nangalkot", "Meghna", "Titas", "Monohargonj", "Lalmai"],
  },
  {
    district: "Feni",
    division: "Chattogram",
    upazilas: ["Feni Sadar", "Chhagalnaiya", "Daganbhuiyan", "Parshuram", "Fulgazi", "Sonagazi"],
  },
  {
    district: "Brahmanbaria",
    division: "Chattogram",
    upazilas: ["Brahmanbaria Sadar", "Ashuganj", "Nasirnagar", "Nabinagar", "Sarail", "Kasba", "Akhaura", "Bancharampur", "Bijoynagar"],
  },
  {
    district: "Noakhali",
    division: "Chattogram",
    upazilas: ["Noakhali Sadar", "Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Senbagh", "Subarnachar", "Kabirhat", "Sonaimuri"],
  },
  {
    district: "Chandpur",
    division: "Chattogram",
    upazilas: ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab Dakshin", "Matlab Uttar", "Shahrasti"],
  },
  {
    district: "Lakshmipur",
    division: "Chattogram",
    upazilas: ["Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati", "Kamalnagar"],
  },
  {
    district: "Bandarban",
    division: "Chattogram",
    upazilas: ["Bandarban Sadar", "Alikadam", "Naikhongchhari", "Rowangchhari", "Lama", "Ruma", "Thanchi"],
  },
  {
    district: "Rangamati",
    division: "Chattogram",
    upazilas: ["Rangamati Sadar", "Baghaichhari", "Barkal", "Belaichhari", "Juraichhari", "Kaptai", "Kawkhali", "Langadu", "Naniarchar", "Rajasthali"],
  },
  {
    district: "Khagrachhari",
    division: "Chattogram",
    upazilas: ["Khagrachhari Sadar", "Dighinala", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh", "Guimara"],
  },

  // --- RAJSHAHI DIVISION ---
  {
    district: "Rajshahi",
    division: "Rajshahi",
    upazilas: ["Boalia", "Rajpara", "Motihar", "Shah Makhdum", "Paba", "Durgapur", "Mohanpur", "Charghat", "Bagha", "Tanore", "Bagmara", "Godagari", "Puthia"],
  },
  {
    district: "Bogura",
    division: "Rajshahi",
    upazilas: ["Bogura Sadar", "Adamdighi", "Dhunat", "Dhupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Sahajanpur", "Sherpur", "Shibganj", "Sonatala"],
  },
  {
    district: "Pabna",
    division: "Rajshahi",
    upazilas: ["Pabna Sadar", "Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Santhia", "Sujanagar"],
  },
  {
    district: "Sirajganj",
    division: "Rajshahi",
    upazilas: ["Sirajganj Sadar", "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Rayganj", "Shahjadpur", "Tarash", "Ullahpara"],
  },
  {
    district: "Naogaon",
    division: "Rajshahi",
    upazilas: ["Naogaon Sadar", "Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mohadevpur", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"],
  },
  {
    district: "Natore",
    division: "Rajshahi",
    upazilas: ["Natore Sadar", "Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Singra", "Naldanga"],
  },
  {
    district: "Chapai Nawabganj",
    division: "Rajshahi",
    upazilas: ["Chapai Nawabganj Sadar", "Bholahat", "Gomastapur", "Nachole", "Shibganj"],
  },
  {
    district: "Joypurhat",
    division: "Rajshahi",
    upazilas: ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"],
  },

  // --- KHULNA DIVISION ---
  {
    district: "Khulna",
    division: "Khulna",
    upazilas: ["Khulna Sadar", "Sonadanga", "Khalishpur", "Daulatpur", "Khan Jahan Ali", "Batiaghata", "Dacope", "Dumuria", "Dighalia", "Koyra", "Paikgachha", "Phultala", "Rupsha", "Terokhada"],
  },
  {
    district: "Jashore",
    division: "Khulna",
    upazilas: ["Jashore Sadar", "Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha"],
  },
  {
    district: "Kushtia",
    division: "Khulna",
    upazilas: ["Kushtia Sadar", "Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Mirpur"],
  },
  {
    district: "Satkhira",
    division: "Khulna",
    upazilas: ["Satkhira Sadar", "Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Shyamnagar", "Tala"],
  },
  {
    district: "Bagerhat",
    division: "Khulna",
    upazilas: ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"],
  },
  {
    district: "Jhenaidah",
    division: "Khulna",
    upazilas: ["Jhenaidah Sadar", "Harinakundu", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"],
  },
  {
    district: "Chuadanga",
    division: "Khulna",
    upazilas: ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"],
  },
  {
    district: "Magura",
    division: "Khulna",
    upazilas: ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
  },
  {
    district: "Meherpur",
    division: "Khulna",
    upazilas: ["Meherpur Sadar", "Gangni", "Mujibnagar"],
  },
  {
    district: "Narail",
    division: "Khulna",
    upazilas: ["Narail Sadar", "Kalia", "Lohagara"],
  },

  // --- BARISHAL DIVISION ---
  {
    district: "Barishal",
    division: "Barishal",
    upazilas: ["Barishal Sadar", "Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gaurnadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"],
  },
  {
    district: "Patuakhali",
    division: "Barishal",
    upazilas: ["Patuakhali Sadar", "Bauphal", "Dashmina", "Galachipa", "Kalapara", "Mirzaganj", "Dumki", "Rangabali"],
  },
  {
    district: "Bhola",
    division: "Barishal",
    upazilas: ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"],
  },
  {
    district: "Pirojpur",
    division: "Barishal",
    upazilas: ["Pirojpur Sadar", "Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad (Swarupkati)", "Indurkani"],
  },
  {
    district: "Barguna",
    division: "Barishal",
    upazilas: ["Barguna Sadar", "Amtali", "Bamna", "Betagi", "Patharghata", "Taltali"],
  },
  {
    district: "Jhalokati",
    division: "Barishal",
    upazilas: ["Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur"],
  },

  // --- SYLHET DIVISION ---
  {
    district: "Sylhet",
    division: "Sylhet",
    upazilas: ["Sylhet Sadar", "Beanibazar", "Bishwanath", "Companiganj", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Zakiganj", "Dakshin Surma", "Osmani Nagar"],
  },
  {
    district: "Moulvibazar",
    division: "Sylhet",
    upazilas: ["Moulvibazar Sadar", "Barlekha", "Juri", "Kamalganj", "Kulaura", "Rajnagar", "Sreemangal"],
  },
  {
    district: "Habiganj",
    division: "Sylhet",
    upazilas: ["Habiganj Sadar", "Ajmiriganj", "Bahubal", "Baniachong", "Chunarughat", "Lakhai", "Madhabpur", "Nabiganj", "Sayestaganj"],
  },
  {
    district: "Sunamganj",
    division: "Sylhet",
    upazilas: ["Sunamganj Sadar", "Bishwamvarpur", "Chhatak", "Derai", "Dharampasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Shantiganj", "Sullah", "Tahirpur", "Madhyanagar"],
  },

  // --- RANGPUR DIVISION ---
  {
    district: "Rangpur",
    division: "Rangpur",
    upazilas: ["Rangpur Sadar", "Badarganj", "Gangachhara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Taraganj"],
  },
  {
    district: "Dinajpur",
    division: "Rangpur",
    upazilas: ["Dinajpur Sadar", "Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar", "Phulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"],
  },
  {
    district: "Gaibandha",
    division: "Rangpur",
    upazilas: ["Gaibandha Sadar", "Fulchhari", "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj"],
  },
  {
    district: "Kurigram",
    division: "Rangpur",
    upazilas: ["Kurigram Sadar", "Bhurungamari", "Char Rajibpur", "Chilmari", "Phulbari", "Nageshwari", "Rajarhat", "Raomari", "Ulipur"],
  },
  {
    district: "Nilphamari",
    division: "Rangpur",
    upazilas: ["Nilphamari Sadar", "Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Saidpur"],
  },
  {
    district: "Lalmonirhat",
    division: "Rangpur",
    upazilas: ["Lalmonirhat Sadar", "Aditmari", "Kaliganj", "Hatibandha", "Patgram"],
  },
  {
    district: "Panchagarh",
    division: "Rangpur",
    upazilas: ["Panchagarh Sadar", "Atwari", "Boda", "Debiganj", "Tetulia"],
  },
  {
    district: "Thakurgaon",
    division: "Rangpur",
    upazilas: ["Thakurgaon Sadar", "Baliadangi", "Haripur", "Pirganj", "Ranisankail"],
  },

  // --- MYMENSINGH DIVISION ---
  {
    district: "Mymensingh",
    division: "Mymensingh",
    upazilas: ["Mymensingh Sadar", "Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Muktagachha", "Nandail", "Phulpur", "Tara Khanda"],
  },
  {
    district: "Jamalpur",
    division: "Mymensingh",
    upazilas: ["Jamalpur Sadar", "Bakshiganj", "Dewanganj", "Islampur", "Madarganj", "Melandaha", "Sarishabari"],
  },
  {
    district: "Netrokona",
    division: "Mymensingh",
    upazilas: ["Netrokona Sadar", "Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Kendua", "Madan", "Mohanganj", "Purbadhala", "Khaliajuri"],
  },
  {
    district: "Sherpur",
    division: "Mymensingh",
    upazilas: ["Sherpur Sadar", "Jhenaigati", "Nakla", "Nalitabari", "Sreebardi"],
  },
];

/**
 * Returns all 64 districts in alphabetical order.
 */
export function getAllDistricts(): string[] {
  return BANGLADESH_GEO_DATA.map((item) => item.district).sort((a, b) =>
    a.localeCompare(b)
  );
}

/**
 * Returns all districts belonging to a specific division.
 */
export function getDistrictsByDivision(division: string): string[] {
  return BANGLADESH_GEO_DATA.filter(
    (item) => item.division.toLowerCase() === division.toLowerCase()
  )
    .map((item) => item.district)
    .sort((a, b) => a.localeCompare(b));
}

/**
 * Returns upazilas/thanas for a given district name.
 */
export function getUpazilasByDistrict(district: string): string[] {
  if (!district) return [];
  const found = BANGLADESH_GEO_DATA.find(
    (item) => item.district.toLowerCase() === district.trim().toLowerCase()
  );
  return found ? [...found.upazilas].sort((a, b) => a.localeCompare(b)) : [];
}

/**
 * Returns division for a given district name.
 */
export function getDivisionByDistrict(district: string): string | undefined {
  if (!district) return undefined;
  const found = BANGLADESH_GEO_DATA.find(
    (item) => item.district.toLowerCase() === district.trim().toLowerCase()
  );
  return found?.division;
}

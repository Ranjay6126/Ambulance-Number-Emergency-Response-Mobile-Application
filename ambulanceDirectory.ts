/**
 * Nepal ambulance & emergency directory.
 *
 * Every number in this file was read from a public source page (listed in each
 * entry's `source`) and is reproduced for offline use in an emergency. Numbers
 * change: the app always links back to the source so a listings can be checked.
 *
 * Coverage note: every one of Nepal's 77 districts has a listing through its
 * Nepal Red Cross Society district chapter (source: nrcs.org "Our Presence"),
 * so all seven provinces — including Karnali and Sudurpashchim — are covered.
 * On top of that, the larger cities, nagarpalika (municipality) lines and
 * hospital / community ambulance services that were individually published are
 * listed too. Individual wards and villages rarely publish their own number:
 * where one is not published, use the district chapter or the national 102.
 */

import { auditDirectory } from "./lib/validate";

export type Province =
  | "Koshi"
  | "Madhesh"
  | "Bagmati"
  | "Gandaki"
  | "Lumbini"
  | "Karnali"
  | "Sudurpashchim";

export const provinces: Province[] = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
];

export type Source = {
  name: string;
  url: string;
};

/**
 * Administrative level of a listing, so the app can be honest about what a
 * number actually covers: a district Red Cross chapter covers a whole
 * district, a municipality line covers that nagarpalika, and so on.
 */
export type AmbLevel =
  | "national"
  | "province"
  | "district"
  | "municipality"
  | "city"
  | "hospital"
  | "community";

export const LEVEL_LABEL: Record<AmbLevel, string> = {
  national: "National service",
  province: "Province chapter",
  district: "District chapter",
  municipality: "Municipality",
  city: "Metropolitan city",
  hospital: "Hospital",
  community: "Community service",
};

export type AmbulanceListing = {
  id: string;
  name: string;
  phones: string[];
  district: string;
  province: Province;
  /** Street / locality for the directions link. */
  area?: string;
  /** Administrative level this number covers, when known. */
  level?: AmbLevel;
  /** Short description when the source published one. */
  note?: string;
  source: Source;
};

export type EmergencyNumber = {
  id: string;
  label: string;
  number: string;
  description: string;
  source: Source;
};

export type ProvincePoliceOffice = {
  province: Province;
  city: string;
  phones: string[];
  districts: string;
  source: Source;
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

const SOURCE = {
  nas: {
    name: "Nepal Ambulance Service — contact page",
    url: "https://nepalambulanceservice.org/contact",
  },
  nagarik: {
    name: "Nagarik Alert — Ambulance Services directory (Nepal)",
    url: "https://nagarikalert.com/content/ambulance",
  },
  newsofnepal: {
    name: "News of Nepal — Important Numbers",
    url: "https://newsofnepal.com/important-numbers/",
  },
  icenepal: {
    name: "Imperial College of Engineering — Emergency help in Nepal",
    url: "https://icenepal.com/emergency",
  },
  nrcs: {
    name: "Nepal Red Cross Society — Our Presence",
    url: "https://nrcs.org/our-presence/",
  },
  risingnepal: {
    name: "The Rising Nepal — NRCS blood appeal (toll-free 1130)",
    url: "https://www.risingnepaldaily.com/news/88148",
  },
  nepalnews: {
    name: "Nepalnews — Disaster hotline 1234 extended to all districts",
    url: "https://english.nepalnews.com/s/nation/disaster-hotline-1234-extended-to-all-districts-to-enhance-rescue-operations/",
  },
  lmc: {
    name: "Lalitpur Metropolitan City, Ward 28 — emergency services",
    url: "https://ward28.lmc.gov.np/page/emergency-service",
  },
  pahs: {
    name: "Patan Academy of Health Sciences — Patan Hospital",
    url: "https://web.pahs.edu.np/",
  },
  geodata: {
    name: "OpenAdminData — Nepal administrative divisions (district coordinates)",
    url: "https://openadmindata.org/np/districts/",
  },
  emergencynepal: {
    name: "Tanka Adhikari — आपत्कालीन हेल्पलाइन (emergency helpline directory)",
    url: "https://tankaadhikari.com.np/emergency.php",
  },
  nepmds: {
    name: "NepMeds — Ambulance list (Nepal)",
    url: "https://www.nepmeds.com.np/ambulance",
  },
  mediciti: {
    name: "Nepal Mediciti Hospital — Contact",
    url: "https://www.nepalmediciti.com/contact-mediciti-the-best-hospital-in-kathmandu-nepal",
  },
  fishtail: {
    name: "Fishtail Hospital, Pokhara",
    url: "https://www.fishtailhospital.com.np/",
  },
  caremark: {
    name: "Caremark Hospital, Lakeside Pokhara",
    url: "https://caremarkhospitals.com/",
  },
  pahsPokhara: {
    name: "Pokhara Academy of Health Sciences — Western Regional Hospital",
    url: "https://pahs.gov.np/",
  },
  bpkihs: {
    name: "B. P. Koirala Institute of Health Sciences — Contact",
    url: "https://www.bpkihs.edu/contact",
  },
  ngmc: {
    name: "Nepalgunj Medical College Teaching Hospital — Contact",
    url: "https://www.ngmc.edu.np/contact-us",
  },
  prabhu: {
    name: "Prabhu Hospital and Research Center, Birgunj",
    url: "https://www.prabhuhospital.org/",
  },
  phj: {
    name: "Province Hospital Janakpur — Contact Us",
    url: "https://phj.p2.gov.np/contact",
  },
  karnaliHospital: {
    name: "Province Hospital, Karnali Province (Surkhet)",
    url: "https://provincehospital.karnali.gov.np/",
  },
  kahs: {
    name: "Karnali Academy of Health Sciences — Ambulance Services",
    url: "https://kahs.edu.np/services_ambulance-services",
  },
  sankhuwasabhaDao: {
    name: "District Administration Office Sankhuwasabha — एम्बुलेन्स सेवा व्यवस्थापन",
    url: "https://daosankhuwasabha.moha.gov.np/page/ema-b-l-na-sa-sa-va-va-yavasa-tha-pana-1",
  },
  gulmiDao: {
    name: "District Administration Office Gulmi — एम्बुलेन्सहरुको विवरण",
    url: "https://daogulmi.moha.gov.np/post/ema-b-l-na-sahara-ka-va-varanae",
  },
  dhadingpost: {
    name: "Dhading Post — धादिङको महत्वपूर्ण फोन नम्बरहरु (phone directory)",
    url: "https://dhadingpost.com/phone-diary/",
  },
  rupani: {
    name: "Rupani Rural Municipality (Saptari) — Emergency Number",
    url: "https://rupanimun.gov.np/content/emergency-number",
  },
  namastesindhupalchowk: {
    name: "Namaste Sindhupalchowk — Ambulance Services in Nepal with their Contact Numbers",
    url: "https://www.namastesindhupalchowk.com/blog/ambulance-service-nepal",
  },
  nepalnext: {
    name: "Nepal Next — Surma Rural Municipality (Bajhang) services register",
    url: "https://www.nepalnext.com/sajha/bajhang-surma",
  },
} satisfies Record<string, Source>;

// ---------------------------------------------------------------------------
// National emergency short codes
// ---------------------------------------------------------------------------

export const nationalAmbulanceNumber = "102";

export const emergencyNumbers: EmergencyNumber[] = [
  {
    id: "ambulance",
    label: "Ambulance",
    number: "102",
    description: "Nepal's toll-free, round-the-clock ambulance dispatch (Nepal Ambulance Service / HEOC).",
    source: SOURCE.nas,
  },
  {
    id: "police",
    label: "Nepal Police",
    number: "100",
    description: "Police control room — rescue, accidents, crime and anything you are unsure about.",
    source: SOURCE.icenepal,
  },
  {
    id: "fire",
    label: "Fire Brigade",
    number: "101",
    description: "Fire, building collapse and structural rescue.",
    source: SOURCE.icenepal,
  },
  {
    id: "traffic",
    label: "Traffic Police",
    number: "103",
    description: "Road accidents and whether a route is open — worth calling before you travel.",
    source: SOURCE.icenepal,
  },
  {
    id: "tourist-police",
    label: "Tourist Police",
    number: "1144",
    description: "For visitors and trekkers. Also on 01-4247041 and +977-9851289444.",
    source: SOURCE.icenepal,
  },
  {
    id: "red-cross",
    label: "Nepal Red Cross Society",
    number: "1130",
    description: "NRCS toll-free line for ambulance, blood and disaster support.",
    source: SOURCE.risingnepal,
  },
  {
    id: "disaster",
    label: "Disaster Helpline",
    number: "1234",
    description: "Ministry of Home Affairs disaster and rescue coordination, extended to all districts.",
    source: SOURCE.nepalnews,
  },
  {
    id: "health",
    label: "Health Emergency Centre",
    number: "1115",
    description: "Ministry of Health and Population — health advice and which hospital is taking patients.",
    source: SOURCE.icenepal,
  },
  {
    id: "home-ministry",
    label: "Home Ministry Control Room",
    number: "1112",
    description: "National disaster control room coordinating rescue across districts.",
    source: SOURCE.icenepal,
  },
  {
    id: "women",
    label: "Women Helpline (Khabar Garau)",
    number: "1145",
    description: "National Women Commission — 24-hour support for women and girls.",
    source: SOURCE.icenepal,
  },
  {
    id: "child",
    label: "Child Helpline (CWIN)",
    number: "1098",
    description: "For a child who is missing, unaccompanied or at risk.",
    source: SOURCE.icenepal,
  },
  {
    id: "hello-sarkar",
    label: "Hello Sarkar (PM Office)",
    number: "1111",
    description: "Prime Minister's Office grievance line — for when a government office is not responding.",
    source: SOURCE.icenepal,
  },
];

// ---------------------------------------------------------------------------
// Province police control rooms (all seven provinces)
// ---------------------------------------------------------------------------

export const provincePoliceOffices: ProvincePoliceOffice[] = [
  {
    province: "Koshi",
    city: "Biratnagar",
    phones: ["021-437001"],
    districts: "Bhojpur, Dhankuta, Ilam, Jhapa, Khotang, Morang, Okhaldhunga, Panchthar, Sankhuwasabha, Solukhumbu, Sunsari, Taplejung, Terhathum, Udayapur",
    source: SOURCE.icenepal,
  },
  {
    province: "Madhesh",
    city: "Janakpur",
    phones: ["9854029742"],
    districts: "Bara, Dhanusha, Mahottari, Parsa, Rautahat, Saptari, Sarlahi, Siraha",
    source: SOURCE.icenepal,
  },
  {
    province: "Bagmati",
    city: "Hetauda",
    phones: ["057-521499", "9855090240"],
    districts: "Bhaktapur, Chitwan, Dhading, Dolakha, Kathmandu, Kavrepalanchok, Lalitpur, Makwanpur, Nuwakot, Ramechhap, Rasuwa, Sindhuli, Sindhupalchok",
    source: SOURCE.icenepal,
  },
  {
    province: "Gandaki",
    city: "Pokhara",
    phones: ["061-462500", "9856028433"],
    districts: "Baglung, Gorkha, Kaski, Lamjung, Manang, Mustang, Myagdi, Nawalpur, Parbat, Syangja, Tanahun",
    source: SOURCE.icenepal,
  },
  {
    province: "Lumbini",
    city: "Tulsipur (Dang)",
    phones: ["082-523410"],
    districts: "Arghakhanchi, Banke, Bardiya, Dang, Eastern Rukum, Gulmi, Kapilvastu, Nawalparasi West, Palpa, Pyuthan, Rolpa, Rupandehi",
    source: SOURCE.icenepal,
  },
  {
    province: "Karnali",
    city: "Birendranagar (Surkhet)",
    phones: ["083-520811"],
    districts: "Dailekh, Dolpa, Humla, Jajarkot, Jumla, Kalikot, Mugu, Salyan, Surkhet, Western Rukum",
    source: SOURCE.icenepal,
  },
  {
    province: "Sudurpashchim",
    city: "Dhangadhi",
    phones: ["091-521103", "9858490050"],
    districts: "Achham, Baitadi, Bajhang, Bajura, Dadeldhura, Darchula, Doti, Kailali, Kanchanpur",
    source: SOURCE.icenepal,
  },
];

// ---------------------------------------------------------------------------
// Provider directory (hospitals, community groups and municipal lines that
// were published individually in the sources above)
// ---------------------------------------------------------------------------

const providerListings: AmbulanceListing[] = [
  // ---- Bagmati · Kathmandu -------------------------------------------------
  {
    id: "nas-kathmandu",
    name: "Nepal Ambulance Service",
    phones: ["01-4427833", "102"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Ghattekulo Marg, Kathmandu",
    level: "national",
    note: "National 24/7 emergency ambulance service; the toll-free dispatch line is 102.",
    source: SOURCE.nas,
  },
  {
    id: "bishal-bazar",
    name: "Bishal Bazar Ambulance Sewa",
    phones: ["01-4244121"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Bishal Bazar, Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "paropakar",
    name: "Paropakar Ambulance Service",
    phones: ["01-4260859"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Paropakar Marg, Kalimati, Kathmandu",
    source: SOURCE.newsofnepal,
  },
  {
    id: "nrcs-central",
    name: "Nepal Red Cross Society (Central) Ambulance",
    phones: ["01-4228094", "1130"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Kalimati, Kathmandu",
    source: SOURCE.nrcs,
  },
  {
    id: "ciwec",
    name: "CIWEC Hospital",
    phones: ["01-4435232", "9841614037"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Lazimpat, Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "grande-international",
    name: "Grande International Hospital",
    phones: ["01-5159266", "9801202545"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Dhapasi, Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "hams-hospital",
    name: "HAMS Hospital",
    phones: ["01-4786111"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Dhumbarahi, Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "norvic",
    name: "Norvic International Hospital",
    phones: ["01-4258554", "9803222222"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Thapathali, Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "vayodha",
    name: "Vayodha Hospital",
    phones: ["01-4281666", "9802019561"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Balkhu Chowk, Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "vinayak-hospital",
    name: "Vinayak Hospital",
    phones: ["01-4383152", "9803452545"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Gongabu Chowk, Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "green-city",
    name: "Green City Hospital",
    phones: ["01-4981133"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Basundhara, Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "motherland-hospital",
    name: "Motherland Hospital",
    phones: ["01-4992292"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Old Sinamangal, Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "kirtipur",
    name: "Kirtipur Ambulance",
    phones: ["01-4330200"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Kirtipur, Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "kmcth",
    name: "Kathmandu Medical & Teaching Hospital",
    phones: ["9843203119"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Sinamangal, Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "manmohan",
    name: "Manmohan Community Hospital",
    phones: ["9841383460", "9741009201"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Pharping, Dakshinkali, Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "bp-smriti",
    name: "B. P. Smriti Hospital",
    phones: ["9841447710"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Basundhara, Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "venus",
    name: "VENUS Ambulance",
    phones: ["01-4475120"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Old Baneshwor, Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "shiva-shakti",
    name: "Shiva Shakti Yuva Sewa",
    phones: ["01-4478111"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "maharajgunj",
    name: "Ambulance Service, Maharajgunj",
    phones: ["9818088068", "9851025078"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Maharajgunj, Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "yadav-sewa",
    name: "Yadav Sewa Samaj Ambulance",
    phones: ["9851087851", "9818800100"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Gaushala Chuki, Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "bhageswori",
    name: "Bhageswori Hospital",
    phones: ["01-4314194"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Satungal, Kathmandu",
    source: SOURCE.nagarik,
  },
  {
    id: "basundhara-247",
    name: "24x7 Ambulance Service",
    phones: ["9840186344"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Basundhara, Kathmandu",
    source: SOURCE.nagarik,
  },

  // ---- Bagmati · Lalitpur --------------------------------------------------
  {
    id: "lmc-ambulance",
    name: "Ambulance — Lalitpur Metropolitan City",
    phones: ["9841202641", "01-5527003"],
    district: "Lalitpur",
    province: "Bagmati",
    area: "Pulchowk, Lalitpur",
    level: "municipality",
    note: "Municipal ambulance listed by Lalitpur Metropolitan City Ward 28.",
    source: SOURCE.lmc,
  },
  {
    id: "patan-hospital",
    name: "Patan Hospital Ambulance",
    phones: ["01-5522278", "9840255888"],
    district: "Lalitpur",
    province: "Bagmati",
    area: "Patan Hospital, Lagankhel, Lalitpur",
    note: "Hospital ambulance line; confirm availability and service area when calling.",
    source: SOURCE.pahs,
  },
  {
    id: "bnb-hospital",
    name: "B & B Hospital",
    phones: ["01-5531933"],
    district: "Lalitpur",
    province: "Bagmati",
    area: "Gwarko, Lalitpur",
    source: SOURCE.nagarik,
  },
  {
    id: "nepal-cancer-hospital",
    name: "Nepal Cancer Hospital & Research Center",
    phones: ["01-5251312", "01-5251498"],
    district: "Lalitpur",
    province: "Bagmati",
    area: "Harisiddhi, Lalitpur",
    source: SOURCE.nagarik,
  },
  {
    id: "khokana",
    name: "Khokana Ambulance",
    phones: ["9803593123"],
    district: "Lalitpur",
    province: "Bagmati",
    area: "Khokana, Lalitpur",
    source: SOURCE.nagarik,
  },

  // ---- Bagmati · Bhaktapur -------------------------------------------------
  {
    id: "dr-iwamura",
    name: "Dr. Iwamura Memorial Hospital",
    phones: ["9860025333"],
    district: "Bhaktapur",
    province: "Bagmati",
    area: "Sallaghari, Bhaktapur",
    source: SOURCE.nagarik,
  },
  {
    id: "nkfmh-thimi",
    name: "NKFMH Ambulance, Thimi",
    phones: ["9841257048"],
    district: "Bhaktapur",
    province: "Bagmati",
    area: "Thimi, Bhaktapur",
    source: SOURCE.nagarik,
  },
  {
    id: "thimi-ambulance",
    name: "Thimi Ambulance",
    phones: ["01-6631000"],
    district: "Bhaktapur",
    province: "Bagmati",
    area: "Thimi, Bhaktapur",
    source: SOURCE.nagarik,
  },
  {
    id: "siddhi-memorial",
    name: "Siddhi Memorial Hospital",
    phones: ["9741204991"],
    district: "Bhaktapur",
    province: "Bagmati",
    area: "Bhimsenthan, Bhaktapur",
    source: SOURCE.nagarik,
  },
  {
    id: "madhyapur-hospital",
    name: "Sanu Kaji Shrestha Madhyapur Hospital",
    phones: ["9851133613"],
    district: "Bhaktapur",
    province: "Bagmati",
    area: "Madhyapur Thimi, Bhaktapur",
    source: SOURCE.nagarik,
  },
  {
    id: "nagarik-samudayek",
    name: "Nagarik Samudayek Hospital",
    phones: ["9851133797"],
    district: "Bhaktapur",
    province: "Bagmati",
    area: "Bhaktapur",
    source: SOURCE.nagarik,
  },
  {
    id: "nrcs-bhaktapur",
    name: "Nepal Red Cross Society, Bhaktapur",
    phones: ["9849857332"],
    district: "Bhaktapur",
    province: "Bagmati",
    area: "Nalichowk, Bhaktapur",
    source: SOURCE.nagarik,
  },
  {
    id: "changunarayan-aspatal",
    name: "Changunarayan Aspatal",
    phones: ["9849424813"],
    district: "Bhaktapur",
    province: "Bagmati",
    area: "Changunarayan, Bhaktapur",
    source: SOURCE.nagarik,
  },
  {
    id: "bhaktapur-municipality",
    name: "Bhaktapur Municipality Ambulance",
    phones: ["9851082799"],
    district: "Bhaktapur",
    province: "Bagmati",
    area: "Bhaktapur",
    level: "municipality",
    source: SOURCE.nagarik,
  },
  {
    id: "surya-binayak-nagarpalika",
    name: "Surya Binayak Municipality Ambulance",
    phones: ["9841395199"],
    district: "Bhaktapur",
    province: "Bagmati",
    area: "Gundu, Surya Binayak, Bhaktapur",
    level: "municipality",
    source: SOURCE.nagarik,
  },
  {
    id: "changunarayan-nagarpalika",
    name: "Changunarayan Municipality Ambulance (Ward 5)",
    phones: ["9851214809"],
    district: "Bhaktapur",
    province: "Bagmati",
    area: "Changunarayan, Bhaktapur",
    level: "municipality",
    source: SOURCE.nagarik,
  },
  {
    id: "lazimpat-club",
    name: "Lazimpat Club Ambulance",
    phones: ["01-6631000", "6630046"],
    district: "Bhaktapur",
    province: "Bagmati",
    area: "Bhaktapur",
    source: SOURCE.nagarik,
  },

  // ---- Bagmati · Nuwakot ---------------------------------------------------
  {
    id: "redcross-bidur",
    name: "District Red Cross, Bidur",
    phones: ["010-560070", "98434333030"],
    district: "Nuwakot",
    province: "Bagmati",
    area: "Bidur, Nuwakot",
    source: SOURCE.nagarik,
  },
  {
    id: "padmakumari",
    name: "Padmakumari Smriti Pratisthan",
    phones: ["9855059500"],
    district: "Nuwakot",
    province: "Bagmati",
    area: "Nuwakot",
    source: SOURCE.nagarik,
  },

  // ---- Bagmati · Dhading ---------------------------------------------------
  {
    id: "krishna-bahadur-smriti",
    name: "Krishna Bahadur Smriti Sewa",
    phones: ["9841898941", "9841639732"],
    district: "Dhading",
    province: "Bagmati",
    area: "Dhading",
    source: SOURCE.nagarik,
  },
  {
    id: "nrcs-dhading",
    name: "Nepal Red Cross Society, Dhading",
    phones: ["9849862264"],
    district: "Dhading",
    province: "Bagmati",
    area: "Dhading Besi",
    source: SOURCE.nagarik,
  },
  {
    id: "jila-aspatal-dhading",
    name: "Jila Aspatal Nilkantha, Dhading Besi",
    phones: ["9841523523", "9851122670"],
    district: "Dhading",
    province: "Bagmati",
    area: "Dhading Besi",
    source: SOURCE.nagarik,
  },
  {
    id: "adham-ghat",
    name: "Adham Ghat Aspatal",
    phones: ["9851120270", "9841408477"],
    district: "Dhading",
    province: "Bagmati",
    area: "Dhading",
    source: SOURCE.nagarik,
  },
  {
    id: "sidhha-sewa",
    name: "Sidhha Sewa Samaj",
    phones: ["9803015463"],
    district: "Dhading",
    province: "Bagmati",
    area: "Dhading",
    source: SOURCE.nagarik,
  },
  {
    id: "tripureshwor-dhading",
    name: "Tripureshwor Ambulance Bewastapan Samiti",
    phones: ["9849945270"],
    district: "Dhading",
    province: "Bagmati",
    area: "Dhading",
    source: SOURCE.nagarik,
  },
  {
    id: "highway-speed-club",
    name: "Highway Speed Club, Majhitar",
    phones: ["9813303913"],
    district: "Dhading",
    province: "Bagmati",
    area: "Majhitar, Dhading",
    source: SOURCE.nagarik,
  },

  // ---- Bagmati · Chitwan ---------------------------------------------------
  {
    id: "sanjivini-chitwan",
    name: "Sanjivini Ayurvedic Chikitsalaya",
    phones: ["9848554800"],
    district: "Chitwan",
    province: "Bagmati",
    area: "Chitwan",
    source: SOURCE.nagarik,
  },
  {
    id: "timalsina-chitwan",
    name: "Late Ram Prasad Timalsina Ambulance Sewa",
    phones: ["9855083945"],
    district: "Chitwan",
    province: "Bagmati",
    area: "Jutpani, Chitwan",
    source: SOURCE.nagarik,
  },
  {
    id: "silwal-chitwan",
    name: "Sorgiya Yagya Prasad Silwal Ambulance",
    phones: ["9845531600"],
    district: "Chitwan",
    province: "Bagmati",
    area: "Jutpani, Chitwan",
    source: SOURCE.nagarik,
  },
  {
    id: "digo-gramin",
    name: "Digo Gramin Swasthya Sewa Samaj Nepal",
    phones: ["9845108796"],
    district: "Chitwan",
    province: "Bagmati",
    area: "Nahar Chowk, Bharatpur, Chitwan",
    source: SOURCE.nagarik,
  },
  {
    id: "cp-yadav",
    name: "CP Yadav Ambulance Service",
    phones: ["9855047643"],
    district: "Chitwan",
    province: "Bagmati",
    area: "Jutpani, Chitwan",
    source: SOURCE.nagarik,
  },

  // ---- Koshi ---------------------------------------------------------------
  {
    id: "life-guard-biratnagar",
    name: "Life Guard Hospital",
    phones: ["021-463177", "9819088987"],
    district: "Morang",
    province: "Koshi",
    area: "Bargachhi, Biratnagar, Morang",
    source: SOURCE.nagarik,
  },
  {
    id: "morang-hospital",
    name: "Morang Hospital (Santosh Rai)",
    phones: ["021-555343", "9805306779"],
    district: "Morang",
    province: "Koshi",
    area: "Pathari Shanischare, Morang",
    source: SOURCE.nagarik,
  },
  {
    id: "golden-hospital",
    name: "Golden Hospital Pvt. Ltd.",
    phones: ["9816391881"],
    district: "Morang",
    province: "Koshi",
    area: "Biratnagar, Morang",
    source: SOURCE.nagarik,
  },
  {
    id: "chetansheel",
    name: "Chetansheel Ambulance",
    phones: ["9842266231"],
    district: "Morang",
    province: "Koshi",
    area: "Morang",
    source: SOURCE.nagarik,
  },
  {
    id: "dharan-parking",
    name: "Dharan Ambulance Parking",
    phones: ["9827383283"],
    district: "Sunsari",
    province: "Koshi",
    area: "Dharan, Sunsari",
    source: SOURCE.nagarik,
  },
  {
    id: "dhankuta-hospital",
    name: "Dhankuta Hospital Ambulance",
    phones: ["9842060752", "9852050678"],
    district: "Dhankuta",
    province: "Koshi",
    area: "Dhankuta",
    source: SOURCE.nagarik,
  },
  {
    id: "akhil-chiya-jhapa",
    name: "Akhil Nepal Chiya Majdur Sangh",
    phones: ["9814952000"],
    district: "Jhapa",
    province: "Koshi",
    area: "Jhapa",
    source: SOURCE.nagarik,
  },
  {
    id: "nrcs-jhapa",
    name: "Nepal Red Cross Society, Ghaula Dhuwa",
    phones: ["9815980500"],
    district: "Jhapa",
    province: "Koshi",
    area: "Jhapa",
    source: SOURCE.nagarik,
  },
  {
    id: "jhapa-association",
    name: "Jhapa Ambulance Association",
    phones: ["9842789870", "9807976555"],
    district: "Jhapa",
    province: "Koshi",
    area: "Jhapa",
    source: SOURCE.nagarik,
  },
  {
    id: "hari-himal-damak",
    name: "Hari Himal Smriti Pratisthan",
    phones: ["9852675055"],
    district: "Jhapa",
    province: "Koshi",
    area: "Damak, Jhapa",
    source: SOURCE.nagarik,
  },
  {
    id: "panchakanya-jhapa",
    name: "Panchakanya Ambulance",
    phones: ["9804984335"],
    district: "Jhapa",
    province: "Koshi",
    area: "Jhapa",
    source: SOURCE.nagarik,
  },
  {
    id: "laxmi-run-data",
    name: "Laxmi Run Data Smriti Sewa Samaj",
    phones: ["9804910985"],
    district: "Jhapa",
    province: "Koshi",
    area: "Birtamod, Jhapa",
    source: SOURCE.nagarik,
  },
  {
    id: "redcross-surunga",
    name: "Red Cross Ambulance Service, Surunga",
    phones: ["023-550100"],
    district: "Jhapa",
    province: "Koshi",
    area: "Surunga, Jhapa",
    source: SOURCE.nagarik,
  },
  {
    id: "redcross-ilam",
    name: "Red Cross Ambulance, Ilam",
    phones: ["9842627333"],
    district: "Ilam",
    province: "Koshi",
    area: "Ilam",
    source: SOURCE.nagarik,
  },

  // ---- Madhesh -------------------------------------------------------------
  {
    id: "birgunj",
    name: "Birgunj Ambulance",
    phones: ["9807215390"],
    district: "Parsa",
    province: "Madhesh",
    area: "Birgunj, Parsa",
    source: SOURCE.nagarik,
  },
  {
    id: "rautahat-ambulance",
    name: "Rautahat Ambulance Service",
    phones: ["9807180104"],
    district: "Rautahat",
    province: "Madhesh",
    area: "Sonarniya Bazar, Maulapur, Rautahat",
    source: SOURCE.nagarik,
  },
  {
    id: "jit-thakur-siraha",
    name: "Jit Thakur Poly Clinic",
    phones: ["9852832689", "9818746233"],
    district: "Siraha",
    province: "Madhesh",
    area: "Hanuman Nagar, Bhaluwahi, Siraha",
    source: SOURCE.nagarik,
  },
  {
    id: "sahara-lahan",
    name: "The Sahara Ambulance, Lahan",
    phones: ["9804700002"],
    district: "Siraha",
    province: "Madhesh",
    area: "Lahan, Siraha",
    source: SOURCE.nagarik,
  },

  // ---- Gandaki -------------------------------------------------------------
  {
    id: "siddhartha-club",
    name: "Siddhartha Club Ambulance, Pokhara",
    phones: ["061-530200", "061-521433"],
    district: "Kaski",
    province: "Gandaki",
    area: "Siddhartha Chowk, Pokhara, Kaski",
    source: SOURCE.nagarik,
  },
  {
    id: "model-hospital-kaski",
    name: "Model Hospital, Pokhara",
    phones: ["9846311804"],
    district: "Kaski",
    province: "Gandaki",
    area: "Pokhara, Kaski",
    source: SOURCE.nagarik,
  },
  {
    id: "bindabasini-nacods",
    name: "Ambulance Service Bindabasini (NACODS)",
    phones: ["061-441100", "9856031337"],
    district: "Kaski",
    province: "Gandaki",
    area: "Bindabasini, Kaski",
    source: SOURCE.nagarik,
  },
  {
    id: "bindabasini",
    name: "Ambulance Service Bindabasini",
    phones: ["061-532888", "9860882041"],
    district: "Kaski",
    province: "Gandaki",
    area: "Bindabasini, Kaski",
    source: SOURCE.nagarik,
  },
  {
    id: "gramin-bikas-lamjung",
    name: "Gramin Bikas Samudayik Sewa, Besisahar",
    phones: ["9846995290"],
    district: "Lamjung",
    province: "Gandaki",
    area: "Besisahar, Lamjung",
    source: SOURCE.nagarik,
  },
  {
    id: "daldale",
    name: "Daldale Ambulance",
    phones: ["9821554469"],
    district: "Nawalpur",
    province: "Gandaki",
    area: "Narayani Road, Devachuli, Nawalpur",
    source: SOURCE.nagarik,
  },
  {
    id: "santosh-smriti",
    name: "Santosh Smriti Pratisthan",
    phones: ["9857041376"],
    district: "Nawalpur",
    province: "Gandaki",
    area: "Devachuli, Nawalpur",
    source: SOURCE.nagarik,
  },

  // ---- Lumbini -------------------------------------------------------------
  {
    id: "tulsi-hospital",
    name: "Tulsi Hospital Pvt. Ltd.",
    phones: ["082-523125", "9809872400"],
    district: "Dang",
    province: "Lumbini",
    area: "Tulsipur, Dang",
    source: SOURCE.nagarik,
  },
  {
    id: "redcross-banke",
    name: "Red Cross Ambulance, Banke",
    phones: ["081-520104"],
    district: "Banke",
    province: "Lumbini",
    area: "Nepalgunj, Banke",
    source: SOURCE.nagarik,
  },
  {
    id: "redcross-kohalpur",
    name: "Red Cross Ambulance, Kohalpur",
    phones: ["081-541300"],
    district: "Banke",
    province: "Lumbini",
    area: "Kohalpur, Banke",
    source: SOURCE.nagarik,
  },
  {
    id: "shahid-prathisthan",
    name: "Shahid Prathisthan, Kohalpur",
    phones: ["9858080140"],
    district: "Banke",
    province: "Lumbini",
    area: "Kohalpur, Banke",
    source: SOURCE.nagarik,
  },
];

// ---------------------------------------------------------------------------
// Nepal Red Cross Society — province chapters (all 7 provinces)
// Source: nrcs.org "Our Presence". Each chapter coordinates the district
// chapters below it, so it is the fallback when a district line is busy.
// ---------------------------------------------------------------------------

type ProvinceChapterRow = {
  province: Province;
  city: string;
  district: string;
  area: string;
  phones: string[];
};

const nrcsProvinceChapterRows: ProvinceChapterRow[] = [
  { province: "Koshi", city: "Biratnagar", district: "Morang", area: "Red Cross Marga, Biratnagar", phones: ["9842071321"] },
  { province: "Madhesh", city: "Birgunj", district: "Parsa", area: "Ghantaghar, Birgunj", phones: ["9855027150"] },
  { province: "Bagmati", city: "Hetauda", district: "Makwanpur", area: "Hetauda", phones: ["9845032060"] },
  { province: "Gandaki", city: "Pokhara", district: "Kaski", area: "Rambazar, Pokhara", phones: ["9846043950", "071-531911", "071-531910"] },
  { province: "Lumbini", city: "Butwal", district: "Rupandehi", area: "Butwal", phones: ["9857061390"] },
  { province: "Karnali", city: "Birendranagar", district: "Surkhet", area: "Birendranagar, Surkhet", phones: ["083-590255", "083-590256", "9848120255"] },
  { province: "Sudurpashchim", city: "Mahendranagar", district: "Kanchanpur", area: "Mahendranagar, Kanchanpur", phones: ["9858750319"] },
];

const nrcsProvinceChapters: AmbulanceListing[] = nrcsProvinceChapterRows.map((row) => ({
  id: `nrcs-province-${row.province.toLowerCase()}`,
  name: `Nepal Red Cross Society — ${row.province} Province Chapter (${row.city})`,
  phones: row.phones,
  district: row.district,
  province: row.province,
  area: row.area,
  level: "province",
  note: "Province Red Cross office. It coordinates every district chapter in the province — call it if a district line does not answer.",
  source: SOURCE.nrcs,
}));

// ---------------------------------------------------------------------------
// Nepal Red Cross Society — district chapters
// Source: nrcs.org "Our Presence". A published, verified ambulance / disaster
// line for the district, which is the closest real coverage that exists for
// the rural municipalities and villages inside it. Two districts (Eastern
// Rukum and Western Rukum) publish no chapter line, so they are not listed
// rather than guessed.
// ---------------------------------------------------------------------------

type DistrictChapterRow = {
  district: string;
  province: Province;
  area: string;
  phones: string[];
};

const nrcsDistrictChapterRows: DistrictChapterRow[] = [
  // ---- Koshi (14 districts) ------------------------------------------------
  { district: "Bhojpur", province: "Koshi", area: "Bhojpur Municipality-7", phones: ["029-420137"] },
  { district: "Dhankuta", province: "Koshi", area: "Dhankuta Municipality-5", phones: ["026-520352"] },
  { district: "Ilam", province: "Koshi", area: "Ilam Municipality-2, Opidhara", phones: ["027-520102", "027-521723"] },
  { district: "Jhapa", province: "Koshi", area: "Bhadrapur Municipality-8", phones: ["023-520102", "023-521202", "023-520814"] },
  { district: "Khotang", province: "Koshi", area: "Diktel Rupakot Majhuwagadhi Municipality-1", phones: ["063-420282"] },
  { district: "Morang", province: "Koshi", area: "Biratnagar-10, Red Cross Marga", phones: ["021-590281", "021-513326"] },
  { district: "Okhaldhunga", province: "Koshi", area: "Siddhicharan Municipality-12", phones: ["037-520178"] },
  { district: "Panchthar", province: "Koshi", area: "Phidim Municipality-1", phones: ["024-520273", "024-520001"] },
  { district: "Sankhuwasabha", province: "Koshi", area: "Khandbari Municipality-1, Pokhari Bazar", phones: ["029-560190", "029-560090"] },
  { district: "Solukhumbu", province: "Koshi", area: "Salleri-5", phones: ["038-520104", "038-520304", "038-520341"] },
  { district: "Sunsari", province: "Koshi", area: "Dharan-1, Red Cross Marga", phones: ["025-520258"] },
  { district: "Taplejung", province: "Koshi", area: "Phungling Municipality-6", phones: ["024-460102", "024-460492"] },
  { district: "Terhathum", province: "Koshi", area: "Myanglung-1, Myanglung Bazar", phones: ["026-460101", "026-460141"] },
  { district: "Udayapur", province: "Koshi", area: "Triyuga Municipality-1, Gaighat", phones: ["035-420200", "035-420350"] },

  // ---- Madhesh (8 districts) -----------------------------------------------
  { district: "Bara", province: "Madhesh", area: "Kalaiya Sub-Metropolitan-5", phones: ["053-550096"] },
  { district: "Dhanusha", province: "Madhesh", area: "Janakpur Sub-Metropolitan", phones: ["041-520870", "041-524102"] },
  { district: "Mahottari", province: "Madhesh", area: "Jaleshwar Municipality-5", phones: ["044-520633"] },
  { district: "Parsa", province: "Madhesh", area: "Birgunj Sub-Metropolitan-9, Ghantaghar", phones: ["051-522525", "051-527864"] },
  { district: "Rautahat", province: "Madhesh", area: "Gaur Municipality-5", phones: ["055-520141"] },
  { district: "Saptari", province: "Madhesh", area: "Rajbiraj Municipality", phones: ["031-521121"] },
  { district: "Sarlahi", province: "Madhesh", area: "Malangwa Municipality-9", phones: ["046-520195"] },
  { district: "Siraha", province: "Madhesh", area: "Siraha Municipality-7", phones: ["033-520095", "033-520561", "033-521077"] },

  // ---- Bagmati (13 districts) ----------------------------------------------
  { district: "Bhaktapur", province: "Bagmati", area: "Bhaktapur Municipality-17, Dudhpati", phones: ["01-6619661"] },
  { district: "Chitwan", province: "Bagmati", area: "Bharatpur Metropolitan-1, Narayanghat", phones: ["056-520133"] },
  { district: "Dhading", province: "Bagmati", area: "Nilkantha Municipality-3, Dhading Besi", phones: ["010-520137", "010-521037"] },
  { district: "Dolakha", province: "Bagmati", area: "Bhimeshwor Municipality-2", phones: ["049-421374", "049-421900"] },
  { district: "Kathmandu", province: "Bagmati", area: "Kathmandu Metropolitan-31, Bhagbazar", phones: ["01-4229410", "01-4219131"] },
  { district: "Kavrepalanchok", province: "Bagmati", area: "Banepa Municipality-10", phones: ["011-661431"] },
  { district: "Lalitpur", province: "Bagmati", area: "Lalitpur-9, Balkumari", phones: ["01-5186320", "01-5186266"] },
  { district: "Makwanpur", province: "Bagmati", area: "Hetauda Municipality-1", phones: ["057-520711"] },
  { district: "Nuwakot", province: "Bagmati", area: "Bidur Municipality-4", phones: ["010-560070", "010-560970"] },
  { district: "Ramechhap", province: "Bagmati", area: "Manthali Municipality", phones: ["048-540033", "048-540058"] },
  { district: "Rasuwa", province: "Bagmati", area: "Dhunche-5", phones: ["010-540195"] },
  { district: "Sindhuli", province: "Bagmati", area: "Kamalamai Municipality-6, Madibazar", phones: ["047-520120", "047-520226"] },
  { district: "Sindhupalchok", province: "Bagmati", area: "Chautara Sangachokgadhi Municipality-5", phones: ["011-620134", "011-620259"] },

  // ---- Gandaki (11 districts) ----------------------------------------------
  { district: "Baglung", province: "Gandaki", area: "Baglung Municipality-11", phones: ["068-520169"] },
  { district: "Gorkha", province: "Gandaki", area: "Gorkha Municipality-3, Harmatari", phones: ["064-420104", "064-421403"] },
  { district: "Kaski", province: "Gandaki", area: "Pokhara-8, Srijanachok", phones: ["061-520347", "061-521762"] },
  { district: "Lamjung", province: "Gandaki", area: "Besisahar Municipality-10, Bhimsen Chowk", phones: ["066-520169", "066-521237"] },
  { district: "Manang", province: "Gandaki", area: "Chame", phones: ["066-440174", "066-440157"] },
  { district: "Mustang", province: "Gandaki", area: "Jomsom-7", phones: ["069-440149"] },
  { district: "Myagdi", province: "Gandaki", area: "Beni Municipality, Beni Bazar", phones: ["069-520169", "069-520116"] },
  { district: "Nawalpur", province: "Gandaki", area: "Kawasoti-8 (Nawalparasi East)", phones: ["078-540532"] },
  { district: "Parbat", province: "Gandaki", area: "Kushma Municipality-5", phones: ["076-420169", "067-420859"] },
  { district: "Syangja", province: "Gandaki", area: "Putalibazar Municipality-1, Syangja Bazar", phones: ["063-420114"] },
  { district: "Tanahun", province: "Gandaki", area: "Vyas Municipality-3, Damauli", phones: ["065-563169", "065-564720"] },

  // ---- Lumbini (11 of 12 districts; Eastern Rukum publishes no line) --------
  { district: "Arghakhanchi", province: "Lumbini", area: "Sandhikharka Municipality-1", phones: ["077-420275"] },
  { district: "Banke", province: "Lumbini", area: "Nepalgunj Sub-Metropolitan-9, Banke Bagiya", phones: ["081-520104", "081-521256"] },
  { district: "Bardiya", province: "Lumbini", area: "Gulariya Municipality-6, Red Cross Marga", phones: ["084-421182", "084-420845"] },
  { district: "Dang", province: "Lumbini", area: "Tulsipur-6, Trisiddheswori Tole", phones: ["082-520022"] },
  { district: "Gulmi", province: "Lumbini", area: "Tamghas", phones: ["079-520163", "079-690163"] },
  { district: "Kapilvastu", province: "Lumbini", area: "Kapilvastu Municipality-5, Taulihawa", phones: ["076-560015"] },
  { district: "Nawalparasi West", province: "Lumbini", area: "Ramgram Municipality-5, Parasi Bazar", phones: ["078-520125", "078-520527"] },
  { district: "Palpa", province: "Lumbini", area: "Tansen Municipality-2, Asantole", phones: ["075-520080"] },
  { district: "Pyuthan", province: "Lumbini", area: "Khalanga, Mallarani-4", phones: ["086-420021"] },
  { district: "Rolpa", province: "Lumbini", area: "Rolpa Municipality-2", phones: ["086-440036"] },
  { district: "Rupandehi", province: "Lumbini", area: "Siddharthanagar Municipality-13, Bhairahawa", phones: ["071-520263"] },

  // ---- Karnali (9 of 10 districts; Western Rukum publishes no line) --------
  { district: "Dailekh", province: "Karnali", area: "Narayan Municipality-2, Nayabazar", phones: ["089-420179"] },
  { district: "Dolpa", province: "Karnali", area: "Dunai-1", phones: ["087-550141"] },
  { district: "Humla", province: "Karnali", area: "Simikot-5", phones: ["087-680130"] },
  { district: "Jajarkot", province: "Karnali", area: "Bheri Municipality-3, Thadibazar", phones: ["089-430042"] },
  { district: "Jumla", province: "Karnali", area: "Chandannath Municipality-4, Jumla Bazar", phones: ["087-520036"] },
  { district: "Kalikot", province: "Karnali", area: "Manma-5", phones: ["087-440125"] },
  { district: "Mugu", province: "Karnali", area: "Chhayanath Rara Municipality-1, Gamgadi", phones: ["087-460007"] },
  { district: "Salyan", province: "Karnali", area: "Sharada Municipality-2, Khalanga", phones: ["088-520004"] },
  { district: "Surkhet", province: "Karnali", area: "Birendranagar Municipality-9", phones: ["083-520310", "083-521670"] },

  // ---- Sudurpashchim (9 districts) ------------------------------------------
  { district: "Achham", province: "Sudurpashchim", area: "Mangalsen Municipality-5", phones: ["097-620148"] },
  { district: "Baitadi", province: "Sudurpashchim", area: "Dasharathchand Municipality-1, Gothalapani", phones: ["095-520156", "095-520356"] },
  { district: "Bajhang", province: "Sudurpashchim", area: "Jayaprithvi Municipality-4, Chainpur", phones: ["092-421133"] },
  { district: "Bajura", province: "Sudurpashchim", area: "Badimalika Municipality-8", phones: ["097-541109"] },
  { district: "Dadeldhura", province: "Sudurpashchim", area: "Amargadhi Municipality-5", phones: ["096-410140"] },
  { district: "Darchula", province: "Sudurpashchim", area: "Mahakali Municipality-4, Khalanga", phones: ["093-410066", "096-410133"] },
  { district: "Doti", province: "Sudurpashchim", area: "Dipayal Silgadhi Municipality-1", phones: ["094-420228"] },
  { district: "Kailali", province: "Sudurpashchim", area: "Dhangadhi Sub-Metropolitan-1, Bandevi Road", phones: ["091-521333", "091-523424"] },
  { district: "Kanchanpur", province: "Sudurpashchim", area: "Bhimdatta Municipality-18", phones: ["099-523983", "099-525588"] },
];

const nrcsDistrictChapters: AmbulanceListing[] = nrcsDistrictChapterRows.map((row) => ({
  id: `nrcs-district-${row.district.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  name: `Nepal Red Cross Society — ${row.district} District Chapter`,
  phones: row.phones,
  district: row.district,
  province: row.province,
  area: row.area,
  level: "district",
  note: "District Red Cross chapter. It is the published ambulance, blood and disaster line that covers the whole district, including its rural municipalities.",
  source: SOURCE.nrcs,
}));

// ---------------------------------------------------------------------------
// City / hospital ambulance lines
// These are city, municipality and hospital ambulance lines transcribed
// digit-for-digit from the cited public pages (each entry links back to the
// page it was read from). They add the big cities, province capitals and major
// hospitals beyond the Kathmandu Valley directory above.
// ---------------------------------------------------------------------------

const cityAmbulanceRows: AmbulanceListing[] = [
  // ---- Bagmati · Kathmandu -------------------------------------------------
  {
    id: "city-shankarapur-hospital",
    name: "Shankarapur Hospital",
    phones: ["01-4911032"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Jorpati, Kathmandu",
    level: "hospital",
    source: SOURCE.nepmds,
  },
  {
    id: "city-tuth",
    name: "Teaching Hospital (TUTH)",
    phones: ["01-4412303"],
    district: "Kathmandu",
    province: "Bagmati",
    area: "Maharajgunj, Kathmandu",
    level: "hospital",
    note: "Tribhuvan University Teaching Hospital switchboard; ask for the ambulance desk.",
    source: SOURCE.emergencynepal,
  },

  // ---- Bagmati · Lalitpur --------------------------------------------------
  {
    id: "city-nepal-mediciti",
    name: "Nepal Mediciti Hospital",
    phones: ["9858777111", "1134"],
    district: "Lalitpur",
    province: "Bagmati",
    area: "Bhaisepati, Lalitpur",
    level: "hospital",
    note: "Emergency (24/7) mobile is 9858777111; 1134 is the hospital's emergency short code, reachable only inside Nepal.",
    source: SOURCE.mediciti,
  },

  // ---- Bagmati · Chitwan ---------------------------------------------------
  {
    id: "city-bharatpur-hospital",
    name: "Bharatpur Hospital",
    phones: ["056-527012"],
    district: "Chitwan",
    province: "Bagmati",
    area: "Bharatpur, Chitwan",
    level: "hospital",
    source: SOURCE.emergencynepal,
  },
  {
    id: "city-college-medical-sciences-chitwan",
    name: "College of Medical Sciences",
    phones: ["056-524260"],
    district: "Chitwan",
    province: "Bagmati",
    area: "Bharatpur, Chitwan",
    level: "hospital",
    source: SOURCE.emergencynepal,
  },
  {
    id: "city-chitwan-ambulance",
    name: "Chitwan Ambulance",
    phones: ["056-520111"],
    district: "Chitwan",
    province: "Bagmati",
    area: "Bharatpur, Chitwan",
    level: "community",
    source: SOURCE.emergencynepal,
  },

  // ---- Koshi · Morang ------------------------------------------------------
  {
    id: "city-koshi-hospital",
    name: "Koshi Hospital",
    phones: ["021-525200"],
    district: "Morang",
    province: "Koshi",
    area: "Biratnagar, Morang",
    level: "hospital",
    source: SOURCE.emergencynepal,
  },
  {
    id: "city-nobel-medical-college",
    name: "Nobel Medical College Teaching Hospital",
    phones: ["021-531500"],
    district: "Morang",
    province: "Koshi",
    area: "Biratnagar, Morang",
    level: "hospital",
    source: SOURCE.emergencynepal,
  },
  {
    id: "city-saptakoshi-hospital",
    name: "Saptakoshi Hospital & Nursing Home",
    phones: ["9842031637"],
    district: "Morang",
    province: "Koshi",
    area: "Binayak Marg, Biratnagar, Morang",
    level: "hospital",
    source: SOURCE.nepmds,
  },
  {
    id: "city-surakhsya-hospital",
    name: "Surakhsya Hospital",
    phones: ["9802753797"],
    district: "Morang",
    province: "Koshi",
    area: "Shahid Marg, Biratnagar, Morang",
    level: "hospital",
    source: SOURCE.nepmds,
  },

  // ---- Koshi · Sunsari -----------------------------------------------------
  {
    id: "city-bpkihs-dharan",
    name: "B. P. Koirala Institute of Health Sciences (BPKIHS)",
    phones: ["025-525555"],
    district: "Sunsari",
    province: "Koshi",
    area: "Ghopa, Dharan, Sunsari",
    level: "hospital",
    note: "Institute main switchboard in Dharan; ask to be routed to the emergency / ambulance service.",
    source: SOURCE.bpkihs,
  },

  // ---- Gandaki · Kaski -----------------------------------------------------
  {
    id: "city-fishtail-hospital",
    name: "Fishtail Hospital",
    phones: ["9766610044", "061-578999"],
    district: "Kaski",
    province: "Gandaki",
    area: "Gairapatan, Pokhara, Kaski",
    level: "hospital",
    note: "Ambulance line is 9766610044; the emergency reception is 061-578999.",
    source: SOURCE.fishtail,
  },
  {
    id: "city-caremark-hospital-pokhara",
    name: "Caremark Hospital",
    phones: ["9851353499", "061-591441"],
    district: "Kaski",
    province: "Gandaki",
    area: "Lakeside, Pokhara, Kaski",
    level: "hospital",
    note: "Ground ambulance is 9851353499; the 24/7 hotline is 061-591441. A heli-rescue number (9851171975) is also published for the Annapurna region.",
    source: SOURCE.caremark,
  },
  {
    id: "city-pahs-pokhara",
    name: "Pokhara Academy of Health Sciences — Western Regional Hospital",
    phones: ["061-520310", "061-520461"],
    district: "Kaski",
    province: "Gandaki",
    area: "Ramghat, Pokhara, Kaski",
    level: "hospital",
    source: SOURCE.pahsPokhara,
  },
  {
    id: "city-gandaki-ambulance",
    name: "Gandaki Ambulance",
    phones: ["061-520111"],
    district: "Kaski",
    province: "Gandaki",
    area: "Pokhara, Kaski",
    level: "community",
    source: SOURCE.emergencynepal,
  },

  // ---- Lumbini · Rupandehi -------------------------------------------------
  {
    id: "city-lumbini-provincial-hospital",
    name: "Lumbini Provincial Hospital",
    phones: ["071-520111"],
    district: "Rupandehi",
    province: "Lumbini",
    area: "Butwal, Rupandehi",
    level: "hospital",
    source: SOURCE.emergencynepal,
  },
  {
    id: "city-ucms-bhairahawa",
    name: "Universal College of Medical Sciences",
    phones: ["071-523700"],
    district: "Rupandehi",
    province: "Lumbini",
    area: "Bhairahawa, Rupandehi",
    level: "hospital",
    source: SOURCE.emergencynepal,
  },
  {
    id: "city-lumbini-ambulance",
    name: "Lumbini Ambulance",
    phones: ["071-540111"],
    district: "Rupandehi",
    province: "Lumbini",
    area: "Butwal, Rupandehi",
    level: "community",
    source: SOURCE.emergencynepal,
  },

  // ---- Lumbini · Banke -----------------------------------------------------
  {
    id: "city-ngmc-kohalpur",
    name: "Nepalgunj Medical College Teaching Hospital",
    phones: ["081-540404", "9858025219"],
    district: "Banke",
    province: "Lumbini",
    area: "Das Bigha, Kohalpur, Banke",
    level: "hospital",
    note: "Teaching hospital inquiry line is 081-540404; the hospital hotline is 9858025219.",
    source: SOURCE.ngmc,
  },

  // ---- Madhesh · Parsa -----------------------------------------------------
  {
    id: "city-prabhu-hospital-birgunj",
    name: "Prabhu Hospital and Research Center",
    phones: ["051-520259", "9801559811"],
    district: "Parsa",
    province: "Madhesh",
    area: "Barrack Road, Panitanki, Birgunj, Parsa",
    level: "hospital",
    note: "24-hour emergency line is 9801559811; the hospital line is 051-520259.",
    source: SOURCE.prabhu,
  },

  // ---- Madhesh · Dhanusha --------------------------------------------------
  {
    id: "city-province-hospital-janakpur",
    name: "Province Hospital Janakpur",
    phones: ["041-526937", "041-520133"],
    district: "Dhanusha",
    province: "Madhesh",
    area: "Hospital Road, Janakpur, Dhanusha",
    level: "hospital",
    note: "Emergency number is 041-526937; the office number is 041-520133.",
    source: SOURCE.phj,
  },

  // ---- Sudurpashchim · Kailali ---------------------------------------------
  {
    id: "city-dhangadhi-redcross",
    name: "Dhangadhi Red Cross Ambulance",
    phones: ["9858427770"],
    district: "Kailali",
    province: "Sudurpashchim",
    area: "Tara Nagar, Dhangadhi, Kailali",
    level: "community",
    note: "Red Cross ambulance line covering Dhangadhi and Kailali district.",
    source: SOURCE.nepmds,
  },

  // ---- Karnali · Surkhet ---------------------------------------------------
  {
    id: "city-province-hospital-karnali",
    name: "Province Hospital, Karnali Province",
    phones: ["083-520200"],
    district: "Surkhet",
    province: "Karnali",
    area: "Birendranagar-4, Kalagaun, Surkhet",
    level: "hospital",
    note: "Emergency (24x7) number of the province hospital at Birendranagar.",
    source: SOURCE.karnaliHospital,
  },

  // ---- Karnali · Jumla -----------------------------------------------------
  {
    id: "city-kahs-jumla",
    name: "Karnali Academy of Health Sciences (KAHS)",
    phones: ["9843736730"],
    district: "Jumla",
    province: "Karnali",
    area: "Chandannath, Jumla",
    level: "hospital",
    note: "KAHS 24-hour emergency and ambulance service in Jumla.",
    source: SOURCE.kahs,
  },
];

// ---------------------------------------------------------------------------
// Rural municipality / health post / community lines
// These are rural municipality (gaunpalika), nagarpalika and health-post
// ambulance lines transcribed digit-for-digit from the cited public pages.
// They are the finest granularity that is actually published: a rural
// municipality office, a district administration office ambulance register or
// a facility register that names the gaunpalika it belongs to. Every entry
// links back to the page it was read from, so a number can always be checked.
// ---------------------------------------------------------------------------

const ruralAmbulanceRows: AmbulanceListing[] = [
  // ---- Karnali · Jumla (rural municipalities) ------------------------------
  {
    id: "rural-jumla-patarasi-rm",
    name: "Patarasi Rural Municipality ambulance",
    phones: ["9863163512"],
    district: "Jumla",
    province: "Karnali",
    level: "municipality",
    note: "Rural municipality ambulance service in Jumla, listed by Karnali Academy of Health Sciences (KAHS).",
    source: SOURCE.kahs,
  },
  {
    id: "rural-jumla-tatopani-rm",
    name: "Tatopani Rural Municipality ambulance",
    phones: ["9848313606"],
    district: "Jumla",
    province: "Karnali",
    level: "municipality",
    note: "Rural municipality ambulance service in Jumla, listed by Karnali Academy of Health Sciences (KAHS).",
    source: SOURCE.kahs,
  },
  {
    id: "rural-jumla-hima-rm",
    name: "Hima Rural Municipality ambulance",
    phones: ["9866164136"],
    district: "Jumla",
    province: "Karnali",
    level: "municipality",
    note: "Rural municipality ambulance service in Jumla, listed by Karnali Academy of Health Sciences (KAHS).",
    source: SOURCE.kahs,
  },
  {
    id: "rural-jumla-tila-rm",
    name: "Tila Rural Municipality ambulance",
    phones: ["9868971015"],
    district: "Jumla",
    province: "Karnali",
    level: "municipality",
    note: "Rural municipality ambulance service in Jumla, listed by Karnali Academy of Health Sciences (KAHS).",
    source: SOURCE.kahs,
  },
  {
    id: "rural-jumla-sinja-rm",
    name: "Sinja Rural Municipality ambulance",
    phones: ["9868368203"],
    district: "Jumla",
    province: "Karnali",
    level: "municipality",
    note: "Rural municipality ambulance service in Jumla, listed by Karnali Academy of Health Sciences (KAHS).",
    source: SOURCE.kahs,
  },
  {
    id: "rural-jumla-kanakasundari-rm",
    name: "Kanakasundari Rural Municipality ambulance",
    phones: ["9847642209"],
    district: "Jumla",
    province: "Karnali",
    level: "municipality",
    note: "Rural municipality ambulance service in Jumla, listed by Karnali Academy of Health Sciences (KAHS).",
    source: SOURCE.kahs,
  },

  // ---- Koshi · Sankhuwasabha (municipality ambulances) ---------------------
  {
    id: "rural-sankhuwasabha-khandbari-municipality",
    name: "Khandbari Municipality ambulance",
    phones: ["9862033913"],
    district: "Sankhuwasabha",
    province: "Koshi",
    area: "Khandbari, Sankhuwasabha",
    level: "municipality",
    note: "Ambulance run by Khandbari Municipality; the driver line is published in the district ambulance register of the District Administration Office.",
    source: SOURCE.sankhuwasabhaDao,
  },
  {
    id: "rural-sankhuwasabha-chainpur-municipality",
    name: "Chainpur Municipality ambulance",
    phones: ["9842962288"],
    district: "Sankhuwasabha",
    province: "Koshi",
    area: "Chainpur, Sankhuwasabha",
    level: "municipality",
    note: "Ambulance run by Chainpur Municipality; the driver line is published in the district ambulance register of the District Administration Office.",
    source: SOURCE.sankhuwasabhaDao,
  },
  {
    id: "rural-sankhuwasabha-madi-municipality",
    name: "Madi Municipality ambulance",
    phones: ["9811033002"],
    district: "Sankhuwasabha",
    province: "Koshi",
    area: "Madi, Sankhuwasabha",
    level: "municipality",
    note: "Ambulance run by Madi Municipality; the driver line is published in the district ambulance register of the District Administration Office.",
    source: SOURCE.sankhuwasabhaDao,
  },
  {
    id: "rural-sankhuwasabha-chichila-rm",
    name: "Chichila Rural Municipality ambulance",
    phones: ["9742125125"],
    district: "Sankhuwasabha",
    province: "Koshi",
    area: "Chichila, Sankhuwasabha",
    level: "municipality",
    note: "Ambulance run by Chichila Rural Municipality; the driver line is published in the district ambulance register of the District Administration Office.",
    source: SOURCE.sankhuwasabhaDao,
  },
  {
    id: "rural-sankhuwasabha-makalu-rm",
    name: "Makalu Rural Municipality ambulance",
    phones: ["9842099209"],
    district: "Sankhuwasabha",
    province: "Koshi",
    area: "Makalu, Sankhuwasabha",
    level: "municipality",
    note: "Ambulance run by Makalu Rural Municipality; the driver line is published in the district ambulance register of the District Administration Office.",
    source: SOURCE.sankhuwasabhaDao,
  },

  // ---- Lumbini · Gulmi (rural municipality / health post) ------------------
  {
    id: "rural-gulmi-rurukshetra-rm",
    name: "Rurukshetra Rural Municipality ambulance",
    phones: ["9869793304"],
    district: "Gulmi",
    province: "Lumbini",
    area: "Rurukshetra, Gulmi",
    level: "municipality",
    note: "Ambulance run by Rurukshetra Rural Municipality; driver line published in the District Administration Office, Gulmi ambulance register.",
    source: SOURCE.gulmiDao,
  },
  {
    id: "rural-gulmi-isma-rajsthal-health-post",
    name: "Isma Rural Municipality — Rajsthal Health Post ambulance",
    phones: ["9867423994"],
    district: "Gulmi",
    province: "Lumbini",
    area: "Rajsthal, Isma, Gulmi",
    level: "community",
    note: "Health-post ambulance under Isma Rural Municipality; driver line published in the District Administration Office, Gulmi ambulance register.",
    source: SOURCE.gulmiDao,
  },
  {
    id: "rural-gulmi-dhurkot-pipaldhara-health-post",
    name: "Dhurkot Rural Municipality — Pipaldhara Health Post ambulance",
    phones: ["9866134536"],
    district: "Gulmi",
    province: "Lumbini",
    area: "Pipaldhara, Dhurkot, Gulmi",
    level: "community",
    note: "Health-post ambulance under Dhurkot Rural Municipality; driver line published in the District Administration Office, Gulmi ambulance register.",
    source: SOURCE.gulmiDao,
  },

  // ---- Bagmati · Dhading (rural municipality ambulances) -------------------
  {
    id: "rural-dhading-thakre-rm",
    name: "Thakre Rural Municipality ambulance",
    phones: ["9841068149", "9851157098"],
    district: "Dhading",
    province: "Bagmati",
    area: "Thakre, Dhading",
    level: "municipality",
    note: "Two ambulance driver lines operated by Thakre Rural Municipality, from the Dhading Post phone directory.",
    source: SOURCE.dhadingpost,
  },
  {
    id: "rural-dhading-ganga-jamuna-rm",
    name: "Ganga Jamuna Rural Municipality — Phulkharka ambulance",
    phones: ["9851277521"],
    district: "Dhading",
    province: "Bagmati",
    area: "Phulkharka, Ganga Jamuna, Dhading",
    level: "municipality",
    note: "Ambulance operated by Ganga Jamuna Rural Municipality at Phulkharka, from the Dhading Post phone directory.",
    source: SOURCE.dhadingpost,
  },
  {
    id: "rural-dhading-gajuri-rm",
    name: "Gajuri Rural Municipality ambulance",
    phones: ["9861834063"],
    district: "Dhading",
    province: "Bagmati",
    area: "Gajuri, Dhading",
    level: "municipality",
    note: "Ambulance operated by Gajuri Rural Municipality, from the Dhading Post phone directory.",
    source: SOURCE.dhadingpost,
  },
  {
    id: "rural-dhading-galchhi-rm",
    name: "Galchhi Rural Municipality ambulance",
    phones: ["9840906010"],
    district: "Dhading",
    province: "Bagmati",
    area: "Galchhi, Dhading",
    level: "municipality",
    note: "Ambulance operated by Galchhi Rural Municipality, from the Dhading Post phone directory.",
    source: SOURCE.dhadingpost,
  },

  // ---- Bagmati · Sindhupalchok (rural municipality ambulances) -------------
  {
    id: "rural-sindhupalchok-jugal-rm",
    name: "Jugal Rural Municipality ambulance",
    phones: ["9843964922"],
    district: "Sindhupalchok",
    province: "Bagmati",
    area: "Chanaute, Jugal, Sindhupalchok",
    level: "municipality",
    note: "Rural municipality ambulance line listed in the Namaste Sindhupalchowk ambulance directory.",
    source: SOURCE.namastesindhupalchowk,
  },
  {
    id: "rural-sindhupalchok-bhotekoshi-rm",
    name: "Bhotekoshi Rural Municipality ambulance",
    phones: ["9843431705", "9865993510"],
    district: "Sindhupalchok",
    province: "Bagmati",
    area: "Bhotekoshi, Sindhupalchok",
    level: "municipality",
    note: "Two rural municipality ambulance lines listed in the Namaste Sindhupalchowk ambulance directory.",
    source: SOURCE.namastesindhupalchowk,
  },

  // ---- Madhesh · Bara / Mahottari / Saptari --------------------------------
  {
    id: "rural-bara-kolhabi-municipality",
    name: "Kolhabi Municipality ambulance",
    phones: ["9811188963", "9845666969", "9845266160"],
    district: "Bara",
    province: "Madhesh",
    area: "Kolhabi, Bara",
    level: "municipality",
    note: "Municipality ambulance lines listed in the Namaste Sindhupalchowk ambulance directory.",
    source: SOURCE.namastesindhupalchowk,
  },
  {
    id: "rural-mahottari-rm",
    name: "Mahottari Rural Municipality ambulance",
    phones: ["9854032510"],
    district: "Mahottari",
    province: "Madhesh",
    level: "municipality",
    note: "Rural municipality ambulance line listed in the Namaste Sindhupalchowk ambulance directory.",
    source: SOURCE.namastesindhupalchowk,
  },
  {
    id: "rural-saptari-saptakoshi-municipality",
    name: "Saptakoshi Municipality ambulance (सप्तकोशी नगरपालिका)",
    phones: ["031-550019"],
    district: "Saptari",
    province: "Madhesh",
    level: "municipality",
    note: "Ambulance service of Saptakoshi Municipality, listed on the Rupani Rural Municipality emergency-number page.",
    source: SOURCE.rupani,
  },

  // ---- Sudurpashchim · Bajhang (health post) -------------------------------
  {
    id: "rural-bajhang-daulichaur-health-post",
    name: "Daulichaur Health Post ambulance (Surma Rural Municipality)",
    phones: ["9868671909"],
    district: "Bajhang",
    province: "Sudurpashchim",
    area: "Daulichaur, Surma, Bajhang",
    level: "community",
    note: "Ambulance number published for Daulichaur Health Post, ward 1, Surma Rural Municipality; from the National Health Facility Registry as republished by Nepal Next.",
    source: SOURCE.nepalnext,
  },
];

// ---------------------------------------------------------------------------
// Combined directory used by the app
// ---------------------------------------------------------------------------

/**
 * The list the app actually shows. It is audited once at start-up: every
 * number is validated and de-duplicated, and an entry without a usable number
 * or with a source link that is not a plain web page is dropped instead of
 * being offered as if it were trustworthy.
 */
export const ambulanceDirectory: AmbulanceListing[] = auditDirectory([
  ...providerListings,
  ...nrcsProvinceChapters,
  ...nrcsDistrictChapters,
  ...cityAmbulanceRows,
  ...ruralAmbulanceRows,
]).kept;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const DEFAULT_COVERAGE_NOTE =
  "Community or hospital ambulance line published in a public Nepal directory. Confirm availability and service area when you call.";

export function listingNote(item: AmbulanceListing): string {
  return item.note ?? DEFAULT_COVERAGE_NOTE;
}

export function primaryPhone(item: AmbulanceListing): string {
  return item.phones[0];
}

/** Human label for the administrative level, or null when it is not known. */
export function listingLevelLabel(item: AmbulanceListing): string | null {
  return item.level ? LEVEL_LABEL[item.level] : null;
}

/** "Ghattekulo Marg, Kathmandu" — used for Google Maps directions. */
export function listingLocation(item: AmbulanceListing): string {
  const place = item.area ?? item.name;
  return `${place}, ${item.district}`;
}

export function countByProvince(province: Province): number {
  return ambulanceDirectory.filter((item) => item.province === province).length;
}

// ---------------------------------------------------------------------------
// "Near me" — match the user's GPS position to the closest district
// ---------------------------------------------------------------------------

export type LatLng = { latitude: number; longitude: number };

/**
 * Approximate centre of every district that appears in the directory.
 * Source: SOURCE.geodata. District centres are used because individual wards
 * and villages do not publish their own ambulance number anywhere; matching to
 * the district is the finest granularity that is actually published.
 */
export const districtCentroids: Record<string, { lat: number; lng: number }> = {
  // Koshi
  Taplejung: { lat: 27.61, lng: 87.822 },
  Panchthar: { lat: 27.149, lng: 87.855 },
  Ilam: { lat: 26.885, lng: 87.92 },
  Jhapa: { lat: 26.584, lng: 87.886 },
  Morang: { lat: 26.611, lng: 87.473 },
  Sunsari: { lat: 26.641, lng: 87.141 },
  Dhankuta: { lat: 27.018, lng: 87.313 },
  Terhathum: { lat: 27.132, lng: 87.524 },
  Sankhuwasabha: { lat: 27.548, lng: 87.227 },
  Bhojpur: { lat: 27.175, lng: 87.094 },
  Solukhumbu: { lat: 27.726, lng: 86.782 },
  Khotang: { lat: 27.156, lng: 86.681 },
  Okhaldhunga: { lat: 27.336, lng: 86.448 },
  Udayapur: { lat: 26.933, lng: 86.52 },
  // Madhesh
  Saptari: { lat: 26.607, lng: 86.749 },
  Siraha: { lat: 26.742, lng: 86.35 },
  Dhanusha: { lat: 26.851, lng: 86.036 },
  Mahottari: { lat: 26.885, lng: 85.797 },
  Sarlahi: { lat: 26.968, lng: 85.564 },
  Rautahat: { lat: 26.989, lng: 85.283 },
  Bara: { lat: 27.107, lng: 85.069 },
  Parsa: { lat: 27.223, lng: 84.827 },
  // Bagmati
  Sindhuli: { lat: 27.185, lng: 86.07 },
  Ramechhap: { lat: 27.537, lng: 86.257 },
  Dolakha: { lat: 27.824, lng: 86.222 },
  Sindhupalchok: { lat: 27.907, lng: 85.756 },
  Kavrepalanchok: { lat: 27.545, lng: 85.624 },
  Lalitpur: { lat: 27.548, lng: 85.323 },
  Bhaktapur: { lat: 27.674, lng: 85.426 },
  Kathmandu: { lat: 27.694, lng: 85.285 },
  Nuwakot: { lat: 27.926, lng: 85.248 },
  Rasuwa: { lat: 28.176, lng: 85.479 },
  Dhading: { lat: 28.008, lng: 84.906 },
  Makwanpur: { lat: 27.437, lng: 85.053 },
  Chitwan: { lat: 27.618, lng: 84.453 },
  // Gandaki
  Gorkha: { lat: 28.274, lng: 84.841 },
  Lamjung: { lat: 28.283, lng: 84.42 },
  Manang: { lat: 28.673, lng: 84.169 },
  Kaski: { lat: 28.345, lng: 83.971 },
  Tanahun: { lat: 27.935, lng: 84.223 },
  Syangja: { lat: 28.045, lng: 83.827 },
  Parbat: { lat: 28.203, lng: 83.728 },
  Baglung: { lat: 28.356, lng: 83.143 },
  Myagdi: { lat: 28.546, lng: 83.463 },
  Mustang: { lat: 28.948, lng: 83.901 },
  Nawalpur: { lat: 27.654, lng: 84.031 },
  // Lumbini
  Palpa: { lat: 27.81, lng: 83.63 },
  "Nawalparasi West": { lat: 27.52, lng: 83.737 },
  Rupandehi: { lat: 27.549, lng: 83.403 },
  Kapilvastu: { lat: 27.619, lng: 82.982 },
  Arghakhanchi: { lat: 27.932, lng: 83.146 },
  Gulmi: { lat: 28.096, lng: 83.329 },
  Rolpa: { lat: 28.325, lng: 82.644 },
  Pyuthan: { lat: 28.12, lng: 82.83 },
  Dang: { lat: 27.98, lng: 82.469 },
  Banke: { lat: 28.096, lng: 81.773 },
  Bardiya: { lat: 28.372, lng: 81.45 },
  // Karnali
  Salyan: { lat: 28.407, lng: 82.168 },
  Surkhet: { lat: 28.658, lng: 81.514 },
  Jajarkot: { lat: 28.869, lng: 82.168 },
  Dailekh: { lat: 28.885, lng: 81.7 },
  Dolpa: { lat: 29.214, lng: 83.037 },
  Jumla: { lat: 29.239, lng: 82.199 },
  Kalikot: { lat: 29.216, lng: 81.689 },
  Mugu: { lat: 29.678, lng: 82.531 },
  Humla: { lat: 30.026, lng: 81.833 },
  // Sudurpashchim
  Bajhang: { lat: 29.723, lng: 81.246 },
  Bajura: { lat: 29.611, lng: 81.577 },
  Achham: { lat: 29.068, lng: 81.294 },
  Doti: { lat: 29.188, lng: 80.862 },
  Kailali: { lat: 28.731, lng: 80.904 },
  Kanchanpur: { lat: 28.845, lng: 80.283 },
  Dadeldhura: { lat: 29.209, lng: 80.501 },
  Baitadi: { lat: 29.508, lng: 80.558 },
  Darchula: { lat: 29.926, lng: 80.789 },
};

const districtProvinceByName: Record<string, Province> = Object.fromEntries(
  nrcsDistrictChapterRows.map((row) => [row.district, row.province]),
) as Record<string, Province>;

const EARTH_RADIUS_KM = 6371;

/** Roughly 110 m: enough to pick a district, too coarse to pinpoint a person. */
const MATCH_PRECISION = 3;

/**
 * Check a position and drop the unnecessary precision before it is used for
 * matching, so the app never works with (or keeps) an exact fix.
 */
function coarsen(position: LatLng): LatLng | null {
  const { latitude, longitude } = position;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    return null;
  }
  return {
    latitude: Number(latitude.toFixed(MATCH_PRECISION)),
    longitude: Number(longitude.toFixed(MATCH_PRECISION)),
  };
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function distanceKm(from: LatLng, to: { lat: number; lng: number }): number {
  const dLat = toRadians(to.lat - from.latitude);
  const dLng = toRadians(to.lng - from.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

export type DistrictDistance = {
  district: string;
  province: Province;
  distanceKm: number;
};

/** Districts sorted by straight-line distance from the user's position. */
export function districtsByDistance(coords: LatLng, limit = 3): DistrictDistance[] {
  const from = coarsen(coords);
  if (!from) {
    return [];
  }
  return Object.entries(districtCentroids)
    .map(([district, point]) => ({
      district,
      province: districtProvinceByName[district],
      distanceKm: distanceKm(from, point),
    }))
    .filter((entry) => entry.province !== undefined)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

export type NearbyArea = {
  district: string;
  province: Province;
  distanceKm: number;
  listings: AmbulanceListing[];
};

/**
 * The closest district to the user, with the ambulance numbers that cover it.
 * Local (municipal / hospital) numbers come first so the most specific line is
 * on top, followed by the district Red Cross chapter as the always-present
 * fallback that also covers the villages in the district.
 */
export function findNearbyArea(
  coords: LatLng | null,
  options: { maxLocal?: number; maxChapters?: number } = {},
): NearbyArea | null {
  if (!coords) {
    return null;
  }
  const { maxLocal = 3, maxChapters = 2 } = options;
  const [closest] = districtsByDistance(coords, 1);
  if (!closest) {
    return null;
  }
  const inDistrict = ambulanceDirectory.filter((item) => item.district === closest.district);
  const isChapter = (item: AmbulanceListing) => item.level === "district" || item.level === "province";
  return {
    ...closest,
    listings: [
      ...inDistrict.filter((item) => !isChapter(item)).slice(0, maxLocal),
      ...inDistrict.filter(isChapter).slice(0, maxChapters),
    ],
  };
}

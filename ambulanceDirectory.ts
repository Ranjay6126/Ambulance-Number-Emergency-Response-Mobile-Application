export type AmbulanceListing = {
  id: string;
  name: string;
  phone: string;
  location: string;
  coverageNote: string;
  sourceName: string;
  sourceUrl: string;
};

export const ambulanceShortCode = {
  number: "102",
  coverageNote: "Ambulance dispatch availability varies by location. If this number does not connect, call a local provider.",
  sources: [
    {
      name: "Lalitpur Metropolitan City, Ward 28 emergency contacts",
      url: "https://ward28.lmc.gov.np/page/emergency-service",
    },
    {
      name: "Nepali Times: 100, 101, 102",
      url: "https://nepalitimes.com/100-101-102-hh5uvzf9",
    },
  ],
} as const;

export const ambulanceDirectory: AmbulanceListing[] = [
  {
    id: "patan-hospital-ambulance",
    name: "Patan Hospital Ambulance",
    phone: "+977-9840255888",
    location: "Patan Hospital, Lalitpur Metropolitan City, Lalitpur District, Bagmati Province",
    coverageNote: "Hospital ambulance line; confirm availability and service area when calling.",
    sourceName: "Patan Academy of Health Sciences",
    sourceUrl: "https://web.pahs.edu.np/",
  },
  {
    id: "nepal-ambulance-service-lalitpur",
    name: "Nepal Ambulance Service",
    phone: "+977-1-4104595",
    location: "Lalitpur Metropolitan City, Lalitpur District, Bagmati Province",
    coverageNote: "Number published by Lalitpur Metropolitan City Ward 28; broader service area is not stated.",
    sourceName: "Lalitpur Metropolitan City, Ward 28 emergency contacts",
    sourceUrl: "https://ward28.lmc.gov.np/page/emergency-service",
  },
  {
    id: "nepal-ambulance-service-kathmandu",
    name: "Nepal Ambulance Service (provider contact)",
    phone: "+977-1-4527833",
    location: "Kathmandu, Kathmandu District, Bagmati Province",
    coverageNote: "Provider contact number; the published page does not specify dispatch coverage.",
    sourceName: "Nepal Ambulance Service",
    sourceUrl: "https://nepalambulanceservice.org/contact",
  },
];

export const INDIA_STATE_CITIES = {
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore", "Kurnool", "Rajamahendravaram", "Kakinada"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang"],
  Assam: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur", "Nagaon"],
  Bihar: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia"],
  Chandigarh: ["Chandigarh"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Durg", "Korba", "Jagdalpur"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
  Delhi: ["New Delhi", "Delhi"],
  Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar", "Jamnagar", "Junagadh", "Anand"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Hisar", "Rohtak", "Panchkula", "Sonipat"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Hamirpur"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Davanagere", "Shivamogga", "Ballari", "Kalaburagi"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Alappuzha", "Kottayam", "Palakkad"],
  Ladakh: ["Leh", "Kargil"],
  Lakshadweep: ["Kavaratti"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Satna", "Rewa"],
  Maharashtra: ["Pune", "Mumbai", "Navi Mumbai", "Thane", "Nagpur", "Nashik", "Chhatrapati Sambhajinagar", "Kolhapur", "Solapur", "Amravati", "Nanded", "Sangli", "Satara", "Latur", "Jalgaon", "Akola", "Ahilyanagar"],
  Manipur: ["Imphal", "Thoubal", "Bishnupur"],
  Meghalaya: ["Shillong", "Tura", "Jowai"],
  Mizoram: ["Aizawl", "Lunglei", "Champhai"],
  Nagaland: ["Kohima", "Dimapur", "Mokokchung"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Berhampur", "Puri", "Balasore"],
  Puducherry: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Mohali", "Bathinda", "Pathankot", "Hoshiarpur"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bharatpur", "Sikar"],
  Sikkim: ["Gangtok", "Namchi", "Gyalshing"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Vellore", "Erode", "Thoothukudi", "Thanjavur"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam"],
  Tripura: ["Agartala", "Udaipur", "Dharmanagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Noida", "Agra", "Varanasi", "Prayagraj", "Meerut", "Bareilly", "Gorakhpur", "Aligarh", "Moradabad", "Mathura", "Ayodhya", "Jhansi"],
  Uttarakhand: ["Dehradun", "Haridwar", "Haldwani", "Rishikesh", "Roorkee", "Nainital"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Darjeeling", "Kharagpur", "Bardhaman"],
} as const;

export type IndiaState = keyof typeof INDIA_STATE_CITIES;

export interface IndiaCityOption {
  city: string;
  state: IndiaState;
  key: string;
}

export const INDIA_STATES = Object.keys(INDIA_STATE_CITIES) as IndiaState[];

export const makeIndiaLocationKey = (state: string, city: string) => `${state}::${city}`;

export const INDIA_CITY_OPTIONS: IndiaCityOption[] = INDIA_STATES.flatMap((state) =>
  INDIA_STATE_CITIES[state].map((city) => ({
    city,
    state,
    key: makeIndiaLocationKey(state, city),
  })),
);

const normalizeLocationName = (value: string) => value.trim().toLocaleLowerCase("en-IN");

export function getIndiaCityOptions(state?: string): IndiaCityOption[] {
  if (!state) return INDIA_CITY_OPTIONS;
  const normalizedState = normalizeLocationName(state);
  return INDIA_CITY_OPTIONS.filter((option) => normalizeLocationName(option.state) === normalizedState);
}

export function findIndiaCity(city: string, preferredState?: string): IndiaCityOption | undefined {
  const normalizedCity = normalizeLocationName(city);
  if (!normalizedCity) return undefined;

  const matches = INDIA_CITY_OPTIONS.filter((option) => normalizeLocationName(option.city) === normalizedCity);
  if (!preferredState) return matches[0];

  const normalizedState = normalizeLocationName(preferredState);
  return matches.find((option) => normalizeLocationName(option.state) === normalizedState) ?? matches[0];
}

export function findIndiaCityByKey(key: string): IndiaCityOption | undefined {
  return INDIA_CITY_OPTIONS.find((option) => option.key === key);
}

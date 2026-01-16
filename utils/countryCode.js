// Mapping of full Country Name to ISO 3166-1 alpha-2 code
const countryMap = {
    "Afghanistan": "AF",
    "Albania": "AL",
    "Algeria": "DZ",
    "Canada": "CA",
    "China": "CN",
    "France": "FR",
    "Germany": "DE",
    "India": "IN",
    "Japan": "JP",
    "United Kingdom": "GB",
    "United States": "US",
    "Australia": "AU",
    "Brazil": "BR",
    "South Africa": "ZA",
    "brazil": "BR",
    "mexico": "MX",
    "Italy": "IT",
    "Spain": "ES",
    "Russia": "RU",
    "Netherlands": "NL",
    "Sweden": "SE",
    "Switzerland": "CH",
    "New Zealand": "NZ",
    "Singapore": "SG",
    "South Korea": "KR",
    "Turkey": "TR",
    "Argentina": "AR",
    "Belgium": "BE",
    "Norway": "NO",
    "Denmark": "DK",
    "Vietnam": "VN",
    "Thailand": "TH",
    "Philippines": "PH",
    "Indonesia": "ID",
    "Malaysia": "MY",
};

// Function to safely look up the code
const getCountryCode = (nationName) => {
    // Clean the input name (trim spaces, standardize case for lookup)
    const cleanedName = nationName.trim(); 
    
    // Look up and return the uppercase ISO code, or a placeholder if not found
    return countryMap[cleanedName] || "UN"; // Defaults to United Nations flag
};

module.exports = { getCountryCode, countryMap };
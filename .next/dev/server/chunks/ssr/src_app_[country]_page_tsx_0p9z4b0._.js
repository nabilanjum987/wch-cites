module.exports = [
"[project]/src/app/[country]/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CountryPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const fadeUp = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5
        }
    }
};
// === MOCK DATA ===
const COUNTRIES = {
    pakistan: {
        name: 'Pakistan',
        code: 'PK',
        slug: 'pakistan',
        flag: '🇵🇰',
        region: 'South Asia',
        continent: 'Asia',
        population: 231402117,
        area: 881913,
        capital: 'Islamabad',
        currency: 'Pakistani Rupee (PKR)',
        languages: [
            'Urdu',
            'English',
            'Punjabi',
            'Pashto',
            'Sindhi',
            'Balochi'
        ],
        government: 'Federal Parliamentary Republic',
        primaryColor: '#01411C',
        secondaryColor: '#FFFFFF'
    },
    india: {
        name: 'India',
        code: 'IN',
        slug: 'india',
        flag: '🇮🇳',
        region: 'South Asia',
        continent: 'Asia',
        population: 1428627663,
        area: 3287263,
        capital: 'New Delhi',
        currency: 'Indian Rupee (INR)',
        languages: [
            'Hindi',
            'English',
            'Bengali',
            'Telugu',
            'Marathi',
            'Tamil'
        ],
        government: 'Federal Parliamentary Republic',
        primaryColor: '#FF9933',
        secondaryColor: '#138808'
    },
    'united-states': {
        name: 'United States',
        code: 'US',
        slug: 'united-states',
        flag: '🇺🇸',
        region: 'North America',
        continent: 'Americas',
        population: 331893745,
        area: 9833520,
        capital: 'Washington D.C.',
        currency: 'US Dollar (USD)',
        languages: [
            'English',
            'Spanish'
        ],
        government: 'Federal Presidential Republic',
        primaryColor: '#B22234',
        secondaryColor: '#3C3B6E'
    }
};
const MAJOR_CITIES = {
    PK: [
        {
            name: 'Karachi',
            slug: 'karachi',
            temp: 32,
            condition: 'Partly Cloudy',
            icon: '⛅'
        },
        {
            name: 'Lahore',
            slug: 'lahore',
            temp: 35,
            condition: 'Hot',
            icon: '☀️'
        },
        {
            name: 'Islamabad',
            slug: 'islamabad',
            temp: 30,
            condition: 'Clear',
            icon: '🌤️'
        },
        {
            name: 'Faisalabad',
            slug: 'faisalabad',
            temp: 36,
            condition: 'Hot',
            icon: '☀️'
        },
        {
            name: 'Rawalpindi',
            slug: 'rawalpindi',
            temp: 31,
            condition: 'Clear',
            icon: '🌤️'
        },
        {
            name: 'Multan',
            slug: 'multan',
            temp: 38,
            condition: 'Very Hot',
            icon: '🔥'
        }
    ],
    IN: [
        {
            name: 'Mumbai',
            slug: 'mumbai',
            temp: 32,
            condition: 'Humid',
            icon: '🌤️'
        },
        {
            name: 'Delhi',
            slug: 'delhi',
            temp: 38,
            condition: 'Hot',
            icon: '☀️'
        },
        {
            name: 'Bangalore',
            slug: 'bangalore',
            temp: 28,
            condition: 'Pleasant',
            icon: '⛅'
        },
        {
            name: 'Chennai',
            slug: 'chennai',
            temp: 34,
            condition: 'Humid',
            icon: '🌤️'
        },
        {
            name: 'Kolkata',
            slug: 'kolkata',
            temp: 35,
            condition: 'Warm',
            icon: '⛅'
        },
        {
            name: 'Hyderabad',
            slug: 'hyderabad',
            temp: 36,
            condition: 'Hot',
            icon: '☀️'
        }
    ],
    US: [
        {
            name: 'New York',
            slug: 'new-york',
            temp: 22,
            condition: 'Clear',
            icon: '☀️'
        },
        {
            name: 'Los Angeles',
            slug: 'los-angeles',
            temp: 26,
            condition: 'Sunny',
            icon: '☀️'
        },
        {
            name: 'Chicago',
            slug: 'chicago',
            temp: 18,
            condition: 'Cloudy',
            icon: '☁️'
        },
        {
            name: 'Houston',
            slug: 'houston',
            temp: 30,
            condition: 'Warm',
            icon: '🌤️'
        },
        {
            name: 'Phoenix',
            slug: 'phoenix',
            temp: 38,
            condition: 'Hot',
            icon: '🔥'
        },
        {
            name: 'Philadelphia',
            slug: 'philadelphia',
            temp: 20,
            condition: 'Pleasant',
            icon: '⛅'
        }
    ]
};
const PROVINCES = {
    PK: [
        {
            name: 'Punjab',
            slug: 'punjab',
            capital: 'Lahore',
            population: 110012442,
            area: 205344
        },
        {
            name: 'Sindh',
            slug: 'sindh',
            capital: 'Karachi',
            population: 47886531,
            area: 140914
        },
        {
            name: 'Khyber Pakhtunkhwa',
            slug: 'khyber-pakhtunkhwa',
            capital: 'Peshawar',
            population: 35625000,
            area: 74521
        },
        {
            name: 'Balochistan',
            slug: 'balochistan',
            capital: 'Quetta',
            population: 12344408,
            area: 347190
        },
        {
            name: 'Gilgit-Baltistan',
            slug: 'gilgit-baltistan',
            capital: 'Gilgit',
            population: 1800000,
            area: 72497
        },
        {
            name: 'Azad Kashmir',
            slug: 'azad-kashmir',
            capital: 'Muzaffarabad',
            population: 4045000,
            area: 13297
        }
    ],
    IN: [
        {
            name: 'Maharashtra',
            slug: 'maharashtra',
            capital: 'Mumbai',
            population: 112374333,
            area: 307713
        },
        {
            name: 'Uttar Pradesh',
            slug: 'uttar-pradesh',
            capital: 'Lucknow',
            population: 199812341,
            area: 240928
        },
        {
            name: 'Karnataka',
            slug: 'karnataka',
            capital: 'Bangalore',
            population: 61095248,
            area: 191791
        },
        {
            name: 'Tamil Nadu',
            slug: 'tamil-nadu',
            capital: 'Chennai',
            population: 72147030,
            area: 130058
        },
        {
            name: 'Gujarat',
            slug: 'gujarat',
            capital: 'Ahmedabad',
            population: 60439692,
            area: 196244
        },
        {
            name: 'Rajasthan',
            slug: 'rajasthan',
            capital: 'Jaipur',
            population: 68548437,
            area: 342239
        }
    ],
    US: [
        {
            name: 'California',
            slug: 'california',
            capital: 'Sacramento',
            population: 39538223,
            area: 423967
        },
        {
            name: 'Texas',
            slug: 'texas',
            capital: 'Austin',
            population: 29145505,
            area: 695662
        },
        {
            name: 'Florida',
            slug: 'florida',
            capital: 'Tallahassee',
            population: 21538187,
            area: 170312
        },
        {
            name: 'New York',
            slug: 'new-york',
            capital: 'Albany',
            population: 20201249,
            area: 141297
        },
        {
            name: 'Illinois',
            slug: 'illinois',
            capital: 'Springfield',
            population: 12812508,
            area: 149997
        },
        {
            name: 'Pennsylvania',
            slug: 'pennsylvania',
            capital: 'Harrisburg',
            population: 13002700,
            area: 119280
        }
    ]
};
const PERSONALITIES = {
    PK: [
        {
            id: '1',
            name: 'Abdul Sattar Edhi',
            profession: 'Philanthropist',
            photo: '',
            birthYear: 1928,
            achievements: 'Founded Edhi Foundation, largest volunteer ambulance service'
        },
        {
            id: '2',
            name: 'Malala Yousafzai',
            profession: 'Activist',
            photo: '',
            birthYear: 1997,
            achievements: 'Nobel Peace Prize winner, education advocate'
        },
        {
            id: '3',
            name: 'Imran Khan',
            profession: 'Cricketer & Politician',
            photo: '',
            birthYear: 1952,
            achievements: 'World Cup winning captain, Prime Minister'
        },
        {
            id: '4',
            name: 'Abdus Salam',
            profession: 'Physicist',
            photo: '',
            birthYear: 1926,
            achievements: 'Nobel Prize in Physics 1979'
        }
    ],
    IN: [
        {
            id: '1',
            name: 'Mahatma Gandhi',
            profession: 'Freedom Fighter',
            photo: '',
            birthYear: 1869,
            achievements: 'Leader of Indian independence movement'
        },
        {
            id: '2',
            name: 'A.P.J. Abdul Kalam',
            profession: 'President & Scientist',
            photo: '',
            birthYear: 1931,
            achievements: 'Missile Man of India, President'
        },
        {
            id: '3',
            name: 'Sachin Tendulkar',
            profession: 'Cricketer',
            photo: '',
            birthYear: 1973,
            achievements: 'Greatest batsman, 100 international centuries'
        },
        {
            id: '4',
            name: 'Ratan Tata',
            profession: 'Industrialist',
            photo: '',
            birthYear: 1937,
            achievements: 'Chairman of Tata Group, philanthropist'
        }
    ],
    US: [
        {
            id: '1',
            name: 'Barack Obama',
            profession: 'Politician',
            photo: '',
            birthYear: 1961,
            achievements: '44th US President, Nobel Peace Prize'
        },
        {
            id: '2',
            name: 'Elon Musk',
            profession: 'Entrepreneur',
            photo: '',
            birthYear: 1971,
            achievements: 'Founder of SpaceX, Tesla, X'
        },
        {
            id: '3',
            name: 'Michael Jordan',
            profession: 'Basketball',
            photo: '',
            birthYear: 1963,
            achievements: '6x NBA Champion, GOAT'
        },
        {
            id: '4',
            name: 'Oprah Winfrey',
            profession: 'Media Personality',
            photo: '',
            birthYear: 1954,
            achievements: 'Media mogul, philanthropist'
        }
    ]
};
const LANDMARKS = {
    PK: [
        {
            id: '1',
            name: 'Badshahi Mosque',
            type: 'Religious',
            city: 'Lahore',
            image: '',
            unesco: false
        },
        {
            id: '2',
            name: 'Mohenjo-daro',
            type: 'Archaeological',
            city: 'Sindh',
            image: '',
            unesco: true
        },
        {
            id: '3',
            name: 'K2',
            type: 'Mountain',
            city: 'Gilgit-Baltistan',
            image: '',
            unesco: false
        },
        {
            id: '4',
            name: 'Shalimar Gardens',
            type: 'Gardens',
            city: 'Lahore',
            image: '',
            unesco: true
        }
    ],
    IN: [
        {
            id: '1',
            name: 'Taj Mahal',
            type: 'Monument',
            city: 'Agra',
            image: '',
            unesco: true
        },
        {
            id: '2',
            name: 'Red Fort',
            type: 'Fort',
            city: 'Delhi',
            image: '',
            unesco: true
        },
        {
            id: '3',
            name: 'Gateway of India',
            type: 'Arch',
            city: 'Mumbai',
            image: '',
            unesco: false
        },
        {
            id: '4',
            name: 'Hawa Mahal',
            type: 'Palace',
            city: 'Jaipur',
            image: '',
            unesco: false
        }
    ],
    US: [
        {
            id: '1',
            name: 'Statue of Liberty',
            type: 'Monument',
            city: 'New York',
            image: '',
            unesco: true
        },
        {
            id: '2',
            name: 'Grand Canyon',
            type: 'Natural',
            city: 'Arizona',
            image: '',
            unesco: true
        },
        {
            id: '3',
            name: 'Golden Gate Bridge',
            type: 'Bridge',
            city: 'San Francisco',
            image: '',
            unesco: false
        },
        {
            id: '4',
            name: 'Mount Rushmore',
            type: 'Monument',
            city: 'South Dakota',
            image: '',
            unesco: false
        }
    ]
};
const ECONOMIES = {
    PK: {
        gdp: '$376B',
        growth: '5.7%',
        inflation: '28.2%',
        unemployment: '6.2%',
        currencyRate: '1 USD = 278 PKR'
    },
    IN: {
        gdp: '$3.73T',
        growth: '7.2%',
        inflation: '5.4%',
        unemployment: '4.8%',
        currencyRate: '1 USD = 83 INR'
    },
    US: {
        gdp: '$25.5T',
        growth: '2.1%',
        inflation: '3.2%',
        unemployment: '3.8%',
        currencyRate: 'Base Currency'
    }
};
const NATIONAL_TEAMS = {
    PK: [
        {
            sport: 'Cricket',
            name: 'Pakistan Cricket Team',
            ranking: 'World #4',
            achievements: [
                'T20 World Cup 2009',
                'Champions Trophy 2017',
                'Asia Cup 2022'
            ]
        },
        {
            sport: 'Hockey',
            name: 'Pakistan Hockey Team',
            ranking: 'World #16',
            achievements: [
                '4x World Cup Winner',
                '3x Olympic Gold',
                '4x Asian Games Gold'
            ]
        },
        {
            sport: 'Squash',
            name: 'Pakistan Squash',
            ranking: 'Historically #1',
            achievements: [
                'Jahangir Khan 555 consecutive wins',
                'Jansher Khan 8x World Champion'
            ]
        }
    ],
    IN: [
        {
            sport: 'Cricket',
            name: 'India Cricket Team',
            ranking: 'World #1',
            achievements: [
                '2x ODI World Cup',
                '2x Champions Trophy',
                'T20 World Cup 2007'
            ]
        },
        {
            sport: 'Hockey',
            name: 'India Hockey Team',
            ranking: 'World #4',
            achievements: [
                '8x Olympic Gold',
                'Asian Cup 2023',
                'Commonwealth Games 2022'
            ]
        },
        {
            sport: 'Badminton',
            name: 'India Badminton',
            ranking: 'Top 10',
            achievements: [
                'Olympic Medals',
                'World Championships',
                'Thomas Cup 2022'
            ]
        }
    ],
    US: [
        {
            sport: 'Basketball',
            name: 'USA Basketball',
            ranking: 'World #1',
            achievements: [
                '17x Olympic Gold',
                '5x FIBA World Cup'
            ]
        },
        {
            sport: 'Soccer',
            name: 'USMNT',
            ranking: 'World #13',
            achievements: [
                'CONCACAF Gold Cup 2021',
                'World Cup R16 2022'
            ]
        },
        {
            sport: 'Swimming',
            name: 'USA Swimming',
            ranking: 'World #1',
            achievements: [
                'Most Olympic medals in swimming'
            ]
        }
    ]
};
const HOLIDAYS = {
    PK: [
        {
            name: 'Pakistan Day',
            date: 'March 23',
            type: 'National'
        },
        {
            name: 'Independence Day',
            date: 'August 14',
            type: 'National'
        },
        {
            name: 'Defence Day',
            date: 'September 6',
            type: 'National'
        },
        {
            name: 'Iqbal Day',
            date: 'November 9',
            type: 'National'
        },
        {
            name: 'Quaid-e-Azam Day',
            date: 'December 25',
            type: 'National'
        }
    ],
    IN: [
        {
            name: 'Republic Day',
            date: 'January 26',
            type: 'National'
        },
        {
            name: 'Independence Day',
            date: 'August 15',
            type: 'National'
        },
        {
            name: 'Gandhi Jayanti',
            date: 'October 2',
            type: 'National'
        },
        {
            name: 'Holi',
            date: 'March (varies)',
            type: 'Religious'
        },
        {
            name: 'Diwali',
            date: 'October (varies)',
            type: 'Religious'
        }
    ],
    US: [
        {
            name: 'Independence Day',
            date: 'July 4',
            type: 'National'
        },
        {
            name: 'Thanksgiving',
            date: 'November (varies)',
            type: 'National'
        },
        {
            name: 'Memorial Day',
            date: 'May (varies)',
            type: 'National'
        },
        {
            name: 'Veterans Day',
            date: 'November 11',
            type: 'National'
        },
        {
            name: 'Labor Day',
            date: 'September (varies)',
            type: 'National'
        }
    ]
};
const NEIGHBORS = {
    PK: [
        {
            name: 'India',
            slug: 'india',
            flag: '🇮🇳'
        },
        {
            name: 'Afghanistan',
            slug: 'afghanistan',
            flag: '🇦🇫'
        },
        {
            name: 'Iran',
            slug: 'iran',
            flag: '🇮🇷'
        },
        {
            name: 'China',
            slug: 'china',
            flag: '🇨🇳'
        }
    ],
    IN: [
        {
            name: 'Pakistan',
            slug: 'pakistan',
            flag: '🇵🇰'
        },
        {
            name: 'China',
            slug: 'china',
            flag: '🇨🇳'
        },
        {
            name: 'Nepal',
            slug: 'nepal',
            flag: '🇳🇵'
        },
        {
            name: 'Bangladesh',
            slug: 'bangladesh',
            flag: '🇧🇩'
        },
        {
            name: 'Sri Lanka',
            slug: 'sri-lanka',
            flag: '🇱🇰'
        }
    ],
    US: [
        {
            name: 'Canada',
            slug: 'canada',
            flag: '🇨🇦'
        },
        {
            name: 'Mexico',
            slug: 'mexico',
            flag: '🇲🇽'
        }
    ]
};
const EMERGENCY_NUMBERS = {
    PK: {
        police: '15',
        ambulance: '1122',
        fire: '16'
    },
    IN: {
        police: '100',
        ambulance: '108',
        fire: '101'
    },
    US: {
        police: '911',
        ambulance: '911',
        fire: '911'
    }
};
function formatNumber(n) {
    if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
    return n.toString();
}
function getRandomPersonalities(code) {
    const list = PERSONALITIES[code] || PERSONALITIES.US;
    const month = new Date().getMonth();
    return list.slice(0, 4);
}
function Skeleton({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `animate-pulse bg-gray-200 rounded-lg ${className || ''}`
    }, void 0, false, {
        fileName: "[project]/src/app/[country]/page.tsx",
        lineNumber: 327,
        columnNumber: 10
    }, this);
}
function CountryPage() {
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const [country, setCountry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [cities, setCities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [provinces, setProvinces] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [personalities, setPersonalities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [landmarks, setLandmarks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [economy, setEconomy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [teams, setTeams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [holidays, setHolidays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [neighbors, setNeighbors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [emergency, setEmergency] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const slug = params.country;
        const key = slug.toLowerCase().replace(/-/g, '');
        const countryData = COUNTRIES[key] || COUNTRIES[Object.keys(COUNTRIES).find((k)=>slug.includes(k)) || 'pakistan'] || COUNTRIES.pakistan;
        setCountry(countryData);
        setCities(MAJOR_CITIES[countryData.code] || []);
        setProvinces(PROVINCES[countryData.code] || []);
        setPersonalities(getRandomPersonalities(countryData.code));
        setLandmarks(LANDMARKS[countryData.code] || []);
        setEconomy(ECONOMIES[countryData.code] || ECONOMIES.US);
        setTeams(NATIONAL_TEAMS[countryData.code] || []);
        setHolidays(HOLIDAYS[countryData.code] || []);
        setNeighbors(NEIGHBORS[countryData.code] || []);
        setEmergency(EMERGENCY_NUMBERS[countryData.code] || EMERGENCY_NUMBERS.US);
        setLoading(false);
    }, [
        params
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-50",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-48 animate-pulse bg-gray-300"
                }, void 0, false, {
                    fileName: "[project]/src/app/[country]/page.tsx",
                    lineNumber: 366,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-6xl mx-auto px-4 py-8 space-y-6",
                    children: [
                        ...Array(6)
                    ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                            className: "h-48 w-full"
                        }, i, false, {
                            fileName: "[project]/src/app/[country]/page.tsx",
                            lineNumber: 368,
                            columnNumber: 40
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/[country]/page.tsx",
                    lineNumber: 367,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/[country]/page.tsx",
            lineNumber: 365,
            columnNumber: 7
        }, this);
    }
    if (!country) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-50 flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-6xl",
                        children: "🌍"
                    }, void 0, false, {
                        fileName: "[project]/src/app/[country]/page.tsx",
                        lineNumber: 378,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold mt-4",
                        children: "Country not found"
                    }, void 0, false, {
                        fileName: "[project]/src/app/[country]/page.tsx",
                        lineNumber: 379,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/[country]/page.tsx",
                lineNumber: 377,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/[country]/page.tsx",
            lineNumber: 376,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "relative overflow-hidden",
                style: {
                    backgroundColor: country.primaryColor
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 opacity-10",
                        style: {
                            backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 60%)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/app/[country]/page.tsx",
                        lineNumber: 389,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative max-w-6xl mx-auto px-4 py-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: "text-sm mb-4 flex items-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "/",
                                        className: "text-white/70 hover:text-white",
                                        children: "World"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 392,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white/40",
                                        children: "›"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 393,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white font-medium",
                                        children: country.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 394,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 391,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-6xl",
                                        children: country.flag
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 398,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-4xl font-bold text-white",
                                                children: country.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 400,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white/70 mt-1",
                                                children: [
                                                    country.region,
                                                    " · ",
                                                    country.continent
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 401,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-4 mt-2 text-sm text-white/60",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "Capital: ",
                                                            country.capital
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/[country]/page.tsx",
                                                        lineNumber: 403,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "Population: ",
                                                            formatNumber(country.population)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/[country]/page.tsx",
                                                        lineNumber: 404,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 402,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 399,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 397,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[country]/page.tsx",
                        lineNumber: 390,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/[country]/page.tsx",
                lineNumber: 388,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-6xl mx-auto px-4 py-8 space-y-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].section, {
                        variants: fadeUp,
                        initial: "hidden",
                        animate: "visible",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-gray-900 mb-4",
                                children: "Major Cities Weather"
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 414,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3",
                                children: cities.map((city)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: `/${country.slug}/${provinces[0]?.slug || 'province'}/${city.slug}`,
                                        className: "bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-3xl",
                                                children: city.icon
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 422,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-semibold text-gray-900 mt-2",
                                                children: city.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 423,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-gray-700",
                                                children: [
                                                    city.temp,
                                                    "°"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 424,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-400",
                                                children: city.condition
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 425,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, city.slug, true, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 417,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 415,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[country]/page.tsx",
                        lineNumber: 413,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].section, {
                        variants: fadeUp,
                        initial: "hidden",
                        whileInView: "visible",
                        viewport: {
                            once: true
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-gray-900 mb-4",
                                children: "Country Facts"
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 433,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-2xl border border-gray-100 p-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-400",
                                                    children: "Population"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 437,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xl font-bold text-gray-900",
                                                    children: formatNumber(country.population)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 438,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/[country]/page.tsx",
                                            lineNumber: 436,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-400",
                                                    children: "Area"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 441,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xl font-bold text-gray-900",
                                                    children: [
                                                        formatNumber(country.area),
                                                        " km²"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 442,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/[country]/page.tsx",
                                            lineNumber: 440,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-400",
                                                    children: "Capital"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 445,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xl font-bold text-gray-900",
                                                    children: country.capital
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 446,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/[country]/page.tsx",
                                            lineNumber: 444,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-400",
                                                    children: "Currency"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 449,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xl font-bold text-gray-900",
                                                    children: country.currency.split(' ')[0]
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 450,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/[country]/page.tsx",
                                            lineNumber: 448,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-400",
                                                    children: "Languages"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 453,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xl font-bold text-gray-900",
                                                    children: country.languages[0]
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 454,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/[country]/page.tsx",
                                            lineNumber: 452,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-400",
                                                    children: "Government"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 457,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-bold text-gray-900",
                                                    children: country.government
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 458,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/[country]/page.tsx",
                                            lineNumber: 456,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/[country]/page.tsx",
                                    lineNumber: 435,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 434,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[country]/page.tsx",
                        lineNumber: 432,
                        columnNumber: 9
                    }, this),
                    economy && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].section, {
                        variants: fadeUp,
                        initial: "hidden",
                        whileInView: "visible",
                        viewport: {
                            once: true
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-900 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-400",
                                                    children: "Currency"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 470,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-bold text-white",
                                                    children: economy.currencyRate
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 471,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/[country]/page.tsx",
                                            lineNumber: 469,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-400",
                                                    children: "GDP"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 474,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-bold text-white",
                                                    children: economy.gdp
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 475,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/[country]/page.tsx",
                                            lineNumber: 473,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-400",
                                                    children: "Inflation"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 478,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm font-bold text-white",
                                                    children: economy.inflation
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/[country]/page.tsx",
                                                    lineNumber: 479,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/[country]/page.tsx",
                                            lineNumber: 477,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/[country]/page.tsx",
                                    lineNumber: 468,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-400",
                                            children: "Next Prayer (Capital)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[country]/page.tsx",
                                            lineNumber: 483,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-bold text-amber-400",
                                            children: "Maghrib 6:45 PM"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/[country]/page.tsx",
                                            lineNumber: 484,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/[country]/page.tsx",
                                    lineNumber: 482,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/[country]/page.tsx",
                            lineNumber: 467,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/[country]/page.tsx",
                        lineNumber: 466,
                        columnNumber: 11
                    }, this),
                    provinces.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].section, {
                        variants: fadeUp,
                        initial: "hidden",
                        whileInView: "visible",
                        viewport: {
                            once: true
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-gray-900 mb-4",
                                children: "States / Provinces"
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 493,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-3 gap-4",
                                children: provinces.map((prov)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: `/${country.slug}/${prov.slug}`,
                                        className: "bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-bold text-gray-900",
                                                children: prov.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 501,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 text-sm text-gray-500 space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            "Capital: ",
                                                            prov.capital
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/[country]/page.tsx",
                                                        lineNumber: 503,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            "Population: ",
                                                            formatNumber(prov.population)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/[country]/page.tsx",
                                                        lineNumber: 504,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            "Area: ",
                                                            formatNumber(prov.area),
                                                            " km²"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/[country]/page.tsx",
                                                        lineNumber: 505,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 502,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, prov.slug, true, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 496,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 494,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[country]/page.tsx",
                        lineNumber: 492,
                        columnNumber: 11
                    }, this),
                    personalities.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].section, {
                        variants: fadeUp,
                        initial: "hidden",
                        whileInView: "visible",
                        viewport: {
                            once: true
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-gray-900 mb-4",
                                children: "Famous Personalities"
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 516,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                                children: personalities.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: `/personalities/${p.id}`,
                                        className: "bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-3xl mx-auto",
                                                children: "👤"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 524,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-gray-900 text-center mt-3",
                                                children: p.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 527,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500 text-center",
                                                children: p.profession
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 528,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-400 text-center mt-1 line-clamp-2",
                                                children: p.achievements
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 529,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, p.id, true, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 519,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 517,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[country]/page.tsx",
                        lineNumber: 515,
                        columnNumber: 11
                    }, this),
                    landmarks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].section, {
                        variants: fadeUp,
                        initial: "hidden",
                        whileInView: "visible",
                        viewport: {
                            once: true
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-gray-900 mb-4",
                                children: "Famous Places"
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 539,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                                children: landmarks.map((l)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded-xl border border-gray-100 overflow-hidden",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "aspect-video bg-gray-200 flex items-center justify-center text-4xl",
                                                children: l.type === 'Mountain' ? '🏔️' : l.type === 'Religious' ? '🕌' : l.type === 'Natural' ? '🌄' : '🏛️'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 543,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-semibold text-gray-900",
                                                        children: l.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/[country]/page.tsx",
                                                        lineNumber: 547,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-500",
                                                        children: l.city
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/[country]/page.tsx",
                                                        lineNumber: 548,
                                                        columnNumber: 21
                                                    }, this),
                                                    l.unesco && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-blue-600 font-semibold",
                                                        children: "UNESCO Site"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/[country]/page.tsx",
                                                        lineNumber: 549,
                                                        columnNumber: 34
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 546,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, l.id, true, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 542,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 540,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[country]/page.tsx",
                        lineNumber: 538,
                        columnNumber: 11
                    }, this),
                    economy && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].section, {
                        variants: fadeUp,
                        initial: "hidden",
                        whileInView: "visible",
                        viewport: {
                            once: true
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-gray-900 mb-4",
                                children: "Economy Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 560,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-blue-50 rounded-xl p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500",
                                                children: "GDP"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 563,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-blue-600",
                                                children: economy.gdp
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 564,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 562,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-green-50 rounded-xl p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500",
                                                children: "Growth"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 567,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-green-600",
                                                children: economy.growth
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 568,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 566,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-orange-50 rounded-xl p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500",
                                                children: "Inflation"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 571,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-orange-600",
                                                children: economy.inflation
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 572,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 570,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-red-50 rounded-xl p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500",
                                                children: "Unemployment"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 575,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold text-red-600",
                                                children: economy.unemployment
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 576,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 574,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 561,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[country]/page.tsx",
                        lineNumber: 559,
                        columnNumber: 11
                    }, this),
                    teams.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].section, {
                        variants: fadeUp,
                        initial: "hidden",
                        whileInView: "visible",
                        viewport: {
                            once: true
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-gray-900 mb-4",
                                children: "National Teams"
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 585,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid md:grid-cols-3 gap-4",
                                children: teams.map((team)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded-xl border border-gray-100 p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-bold text-gray-900",
                                                        children: team.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/[country]/page.tsx",
                                                        lineNumber: 590,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded",
                                                        children: team.sport
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/[country]/page.tsx",
                                                        lineNumber: 591,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 589,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500 mb-2",
                                                children: team.ranking
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 593,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: team.achievements.slice(0, 3).map((a, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-600 flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "🏆"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                                lineNumber: 597,
                                                                columnNumber: 25
                                                            }, this),
                                                            " ",
                                                            a
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/src/app/[country]/page.tsx",
                                                        lineNumber: 596,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 594,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, team.sport, true, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 588,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 586,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[country]/page.tsx",
                        lineNumber: 584,
                        columnNumber: 11
                    }, this),
                    holidays.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].section, {
                        variants: fadeUp,
                        initial: "hidden",
                        whileInView: "visible",
                        viewport: {
                            once: true
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-gray-900 mb-4",
                                children: "National Holidays & Events"
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 610,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-2xl border border-gray-100 overflow-hidden",
                                children: holidays.map((h, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `flex items-center justify-between p-4 ${i !== holidays.length - 1 ? 'border-b border-gray-100' : ''}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-semibold text-gray-900",
                                                        children: h.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/[country]/page.tsx",
                                                        lineNumber: 615,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-500",
                                                        children: h.type
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/[country]/page.tsx",
                                                        lineNumber: 616,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 614,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium text-gray-600",
                                                children: h.date
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 618,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 613,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 611,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[country]/page.tsx",
                        lineNumber: 609,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].section, {
                        variants: fadeUp,
                        initial: "hidden",
                        whileInView: "visible",
                        viewport: {
                            once: true
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-gray-900 mb-4",
                                children: "Emergency Contacts"
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 627,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-3 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: `tel:${emergency.police}`,
                                        className: "bg-red-600 hover:bg-red-700 text-white rounded-xl p-4 text-center transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-3xl",
                                                children: "🚔"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 630,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-bold mt-2",
                                                children: "Police"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 631,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold",
                                                children: emergency.police
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 632,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 629,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: `tel:${emergency.ambulance}`,
                                        className: "bg-orange-600 hover:bg-orange-700 text-white rounded-xl p-4 text-center transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-3xl",
                                                children: "🚑"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 635,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-bold mt-2",
                                                children: "Ambulance"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 636,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold",
                                                children: emergency.ambulance
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 637,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 634,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: `tel:${emergency.fire}`,
                                        className: "bg-amber-600 hover:bg-amber-700 text-white rounded-xl p-4 text-center transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-3xl",
                                                children: "🚒"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 640,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-bold mt-2",
                                                children: "Fire"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 641,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold",
                                                children: emergency.fire
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 642,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 639,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 628,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[country]/page.tsx",
                        lineNumber: 626,
                        columnNumber: 9
                    }, this),
                    neighbors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].section, {
                        variants: fadeUp,
                        initial: "hidden",
                        whileInView: "visible",
                        viewport: {
                            once: true
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-gray-900 mb-4",
                                children: "Neighboring Countries"
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 650,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-3",
                                children: neighbors.map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: `/${n.slug}`,
                                        className: "bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-2 hover:shadow-md transition-shadow",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-2xl",
                                                children: n.flag
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 658,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium text-gray-900",
                                                children: n.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/[country]/page.tsx",
                                                lineNumber: 659,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, n.slug, true, {
                                        fileName: "[project]/src/app/[country]/page.tsx",
                                        lineNumber: 653,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/[country]/page.tsx",
                                lineNumber: 651,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/[country]/page.tsx",
                        lineNumber: 649,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/[country]/page.tsx",
                lineNumber: 411,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/[country]/page.tsx",
        lineNumber: 386,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_app_%5Bcountry%5D_page_tsx_0p9z4b0._.js.map
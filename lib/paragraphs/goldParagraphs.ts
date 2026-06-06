import { City } from '@/types/city';

export function generateGoldRateIntroductionParagraph(city: City, goldData: any): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const gold24k = goldData?.gold24k || '21500';
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Gold rates in ${city.name} today (${date}) stand at PKR ${gold24k} per gram for 24-karat gold, reflecting dynamic international precious metals markets 
      influenced by global economic conditions, currency fluctuations, and geopolitical developments. The sona rate (سونا) in ${city.name} serves as a critical benchmark 
      for jewelry makers, investors, and families planning purchases of ornaments and investment gold throughout the city. Historically, gold trading in ${city.name} 
      has occurred in the centuries-old Anarkali Bazaar and contemporary jewelry markets, where skilled craftsmen transform raw gold into intricate pieces reflecting 
      Pakistani and Islamic artistic traditions. In ${month}, the precious metals market affecting ${city.name} gold prices continues evolving with international 
      spot prices in USD being converted to PKR using current exchange rates impacting end-consumer costs. The transparency of gold rate information in ${city.name} 
      has improved dramatically through digital platforms, reducing opportunities for price manipulation that historically affected jewelry buyers. 
      Understanding ${city.name} gold rates becomes essential for individuals calculating zakat nisab religious obligations, planning wedding jewelry purchases, 
      and managing precious metal investments as inflation hedges against currency devaluation in Pakistan's volatile economic environment.
    </p>
  `;
}

export function generateGoldPricingStructureParagraph(city: City, goldData: any): string {
  const gold24k = goldData?.gold24k || '21500';
  const gold22k = goldData?.gold22k || '19708';
  const gold21k = goldData?.gold21k || '18812';
  const gold18k = goldData?.gold18k || '16094';
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Gold pricing structure in ${city.name} differentiates between multiple karatage standards reflecting purity levels and pricing tiers for consumer jewelry. 
      24-karat gold in ${city.name} at PKR ${gold24k}/gram represents pure gold (99.9% Au) typically reserved for investment, religious obligations, and ceremonial items. 
      The more practical 22-karat gold (91.6% purity) in ${city.name} at approximately PKR ${gold22k}/gram constitutes the standard for ornamental jewelry preferred 
      by ${city.name} families for engagement rings, bridal sets, and festival ornaments. The distinction between karatage stems from metalworking properties, with lower 
      karat gold incorporating copper or other metals increasing durability for everyday wear while maintaining gold's precious metal classification. 
      18-karat gold in ${city.name} (75% Au) at roughly PKR ${gold18k}/gram appeals to international markets and contemporary jewelry design preferring durability with 
      lighter weight characteristics. The per-tola price for ${city.name} gold (tola = 11.66 grams, traditional Indian subcontinent weight measurement) helps traditional buyers 
      comparing historical price records with current rates using familiar measurement systems. Making charges in ${city.name} jewelry shops add 15-25% markup above raw gold costs, 
      compensating craftspeople for skilled labor transforming raw gold into refined ornamental pieces. 
      Bulk purchasing discounts in ${city.name} jewelry markets offer modest price reductions for wholesale quantities, though individual retail consumers rarely benefit significantly.
    </p>
  `;
}

export function generateSilverRateParagraph(city: City, silverData: any): string {
  const silver = silverData?.silver || '2650';
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Silver rates in ${city.name} today trade at approximately PKR ${silver} per gram, significantly lower than gold on absolute basis while maintaining investment value 
      and cultural significance for wedding ceremonies and religious artifacts throughout Pakistan. The chandi rate (چاندی کی قیمت) in ${city.name} traditionally held importance 
      for zakat nisab calculations, with Islamic law specifying 595 grams of silver as the alternative wealth threshold for zakat obligations. Silver jewelry in ${city.name} 
      appeals to budget-conscious buyers and younger demographic segments seeking precious metal ornaments without gold's substantial cost burden. 
      Antique silver pieces, traditional silver vessels (tabaae-e-nuqrah), and religious artifacts in ${city.name} mosques and shrines constitute cultural treasures 
      with value extending beyond material costs into historical and artistic dimensions. Industrial demand for silver in ${city.name}} electronics manufacturing, 
      pharmaceuticals, and solar technology sectors creates secondary demand drivers beyond jewelry and investment markets. The silver-to-gold ratio in ${city.name} 
      fluctuates based on relative market values, historically ranging from 40:1 to 80:1, providing arbitrage opportunities for sophisticated precious metals traders. 
      Temperature and inflation sensitivity of silver prices in ${city.name}} creates opportunities for strategic investors timing precious metal purchases. 
      Consumer confidence in silver authenticity in ${city.name}} reflects reliance on established jewelry merchants with multi-generational family reputations, 
      given limited governmental hallmarking infrastructure compared to more developed nations.
    </p>
  `;
}

export function generateCryptocurrencyParagraph(city: City, cryptoData: any): string {
  const btc = cryptoData?.btc || '67420';
  const eth = cryptoData?.eth || '3524';
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Cryptocurrency rates in ${city.name} during ${month} reflect Pakistan's evolving relationship with digital assets and blockchain technology, with Bitcoin (BTC) 
      trading around USD ${btc} converting to significant PKR equivalents impacting investment decisions for tech-savvy ${city.name} residents. The crypto market in ${city.name} 
      operates through international exchanges including CoinGecko, Binance, and local Pakistani crypto platforms offering PKR trading pairs for major cryptocurrencies. 
      Bitcoin adoption in ${city.name} appeals to investors seeking assets uncorrelated with Pakistani currency fluctuations and inflation, particularly relevant given 
      Pakistan's historical currency devaluation patterns. Ethereum (ETH) and other blockchain networks in ${city.name} attract software developers, tech entrepreneurs, 
      and financial innovators exploring decentralized finance (DeFi) applications and smart contract possibilities. Regulatory uncertainty surrounding cryptocurrency in 
      ${city.name} and Pakistan creates volatility and caution among institutional investors, though retail demand continues from individual traders and tech professionals. 
      The younger demographic in ${city.name}, particularly IT sector workers, increasingly perceive cryptocurrency as portfolio diversification hedge and speculative investment opportunity. 
      Binance Coin (BNB) and Solana (SOL) attract ${city.name} investors seeking alternative blockchain platforms with different fee structures and transaction speeds 
      compared to Bitcoin-Ethereum ecosystems. Digital wallet technologies, hot/cold storage debates, and security practices remain active discussion topics in 
      ${city.name}'s growing crypto community and financial technology forums.
    </p>
  `;
}

export function generateCurrencyExchangeParagraph(city: City, exchangeData: any): string {
  const usd = exchangeData?.usdPkr || '277.50';
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Currency exchange rates in ${city.name} during ${month} remain crucial for international business, remittances, and travel, with USD to PKR trading around 
      ${usd} reflecting Pakistan's currency volatility and macroeconomic conditions impacting all ${city.name} residents. The USD-PKR rate in ${city.name} determines 
      costs for imported goods, educational expenses abroad, and remittance values for overseas Pakistani workers sending money home to families throughout the city. 
      {{city.name} currency market operates through State Bank of Pakistan regulated exchange channels, along with informal hawala networks still prevalent in certain neighborhoods. 
      Euro (EUR) to PKR conversion in {{city.name} holds relevance for trade with European partners, while GBP conversion matters for UK-Pakistan bilateral business and student remittances. 
      Middle Eastern currency rates—particularly Saudi Riyal (SAR) and UAE Dirham (AED)—show special significance in {{city.name}} due to large expatriate communities working in Gulf countries 
      and sending regular remittances. The interbank exchange rates in {{city.name}} published daily by State Bank of Pakistan guide official transactions, while open market rates often diverge 
      reflecting supply-demand dynamics and currency speculation. {{city.name}} money changers (sarafs) operating in bustling bazaars provide rapid currency conversion services, 
      though rates typically lag official interbank quotations by small margins. 
      Planning international travel from {{city.name}} necessitates monitoring exchange rate trends, as timing of currency purchases impacts total vacation budgets considerably.
    </p>
  `;
}

export function generateOilPricesParagraph(city: City, oilData: any): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Oil prices affecting Pakistan and {{city.name}} in {{month}} determine fuel costs, transportation expenses, and inflation pressures throughout the economy. 
      WTI Crude oil (West Texas Intermediate) serves as benchmark for global petroleum markets, influencing supply costs for petroleum refineries serving {{city.name}} and nationwide. 
      Brent Crude oil pricing, representing North Sea production, influences European and Asian oil markets with spillover effects on {{city.name}}'s fuel prices and import costs. 
      Petrol and diesel prices in {{city.name}} are government-regulated, adjusted fortnightly based on international crude oil quotations and rupee exchange rates against the US dollar. 
      The cost of living in {{city.name}} fluctuates substantially with fuel price changes, as transportation expenses cascade through supply chains affecting consumer goods pricing. 
      Public transportation in {{city.name}}, including buses, minivans (coasters), and motorcycle taxis (auto-rickshaws), directly passes fuel cost increases to passengers through fare adjustments. 
      Agricultural activities in {{city.name}} province depend critically on fuel for mechanized farming, irrigation pump operations, and crop transportation, making oil prices economically vital. 
      {{city.name}} manufacturing sector costs increase directly with fuel expenses, particularly for industries operating energy-intensive production processes or long-distance supply chains. 
      Strategic petroleum reserves in Pakistan provide buffer against extreme international oil price volatility, though {{city.name}} residents ultimately bear price pressures through inflation.
    </p>
  `;
}

export function generateZakatNisabParagraph(city: City, goldData: any, silverData: any): string {
  const goldNisab = 85;
  const silverNisab = 595;
  const gold24k = goldData?.gold24k || '21500';
  const silver = silverData?.silver || '2650';
  const goldValue = (goldNisab * parseInt(gold24k)).toLocaleString();
  const silverValue = (silverNisab * parseInt(silver)).toLocaleString();
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Zakat nisab (زکوٰة نصاب) calculations for {{city.name}} residents depend on current precious metals prices, with Islamic law specifying two alternative wealth thresholds 
      for determining zakat obligation eligibility. The gold nisab for {{city.name}} requires {{goldNisab}} grams of pure 24-karat gold, currently valued at approximately PKR {{goldValue}}, 
      above which Muslims must pay 2.5% annual zakat on accumulated wealth. The silver nisab for {{city.name}} specifies {{silverNisab}} grams of pure silver, presently worth roughly 
      PKR {{silverValue}}, providing alternative calculation method for individuals whose primary wealth exists in silver rather than gold. 
      {{city.name}} residents calculating zakat obligations traditionally employ the more conservative nisab value (whichever higher in rupee terms), ensuring full compliance with 
      Islamic financial principles. The zakat calculator tools available online for {{city.name}} users automatically adjust nisab thresholds based on daily precious metals price updates, 
      simplifying what historically required consultation with Islamic scholars or financial advisors. 
      Cryptocurrency wealth and cryptocurrency income in {{city.name}} remain subject to ongoing Islamic jurisprudence discussions, with contemporary scholars debating zakat applicability. 
      {{city.name}} charitable organizations collecting zakat distribute funds to eligible recipients (asnaf) including the poor, destitute, travelers in need, and debt-burdened individuals. 
      The annual zakat cycle in {{city.name}} typically peaks during Ramadan month when spiritual motivation peaks and donors make substantial charitable contributions.
    </p>
  `;
}

export function generateMarketInsightsParagraph(city: City): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Precious metals and currency market insights for {{city.name}} in {{month}} suggest continued volatility driven by international geopolitical tensions, 
      central bank monetary policies, and Pakistan's macroeconomic trajectory. {{city.name}} investors monitoring market trends observe historical correlations 
      between rupee devaluation and gold price increases, creating defensive investment appeal during uncertain economic periods. 
      The psychological aspects of {{city.name}}'s investment culture emphasize tangible asset preferences, with gold and silver holding cultural cachet exceeding 
      diversified financial instruments unfamiliar to traditional investor demographics. {{city.name}} wealth management advisors increasingly recommend balanced portfolios 
      combining precious metals, stocks, real estate, and cryptocurrency exposure, though conservative investors maintain gold-heavy allocations. 
      Inflation expectations in {{city.name}}, currently running 23.4% annually, drive demand for inflation-hedging assets like gold, precious metals, and cryptocurrencies. 
      {{city.name}} expatriates managing remittances from overseas employment evaluate currency exposure carefully, timing transfers to maximize PKR value received. 
      The wedding season in {{city.name}}, typically October through December, drives seasonal demand spikes for gold jewelry, temporarily elevating prices for ceremonial ornaments. 
      Educational institutions and financial literacy organizations in {{city.name}} increasingly offer investment education covering precious metals markets, 
      currency exchange mechanics, and basic cryptocurrency concepts for younger populations seeking economic empowerment.
    </p>
  `;
}

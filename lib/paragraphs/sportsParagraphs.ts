import { City } from '@/types/city';

export function generateSportsIntroductionParagraph(city: City): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Sports culture in ${city.name} during ${month} reflects Pakistan's cricket obsession, with the city serving as the epicenter of Pakistani cricket excellence 
      and development of athletic talent spanning multiple sporting disciplines. ${city.name} residents demonstrate extraordinary passion for cricket, with Pakistan national team matches 
      drawing unprecedented viewership when the squad competes in international tournaments. The Pakistan Super League (PSL) franchise based in ${city.name}—the ${city.name} Qalandars—
      generates fervent support from cricket enthusiasts throughout the metropolitan area and across Pakistan during the annual Twenty20 tournament. 
      Beyond cricket, ${city.name} has produced legendary athletes in squash (Jahangir Khan), tennis, field hockey, and other sports, cementing the city's reputation 
      as a breeding ground for world-class athletic talent. Sports infrastructure in ${city.name}} includes world-class facilities like Gaddafi Stadium, premier training academies, 
      and private sports clubs serving both elite athletes and recreational participants. 
      The economic impact of sports in ${city.name}} extends beyond entertainment value, with sports tourism, equipment manufacturing, and betting industries generating substantial revenues. 
      Youth engagement through sports in ${city.name}} provides alternative pathways to social mobility, with talented young athletes from underprivileged backgrounds potentially ascending 
      to professional careers through systematic talent identification and development programs operated by cricket academies and sports organizations.
    </p>
  `;
}

export function generateCricketDominanceParagraph(city: City): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Cricket's dominance in ${city.name}} culture during ${month} surpasses all other sports combined, with the gentleman's game serving as the primary entertainment, 
      business opportunity, and source of national pride for Pakistan's cricket-obsessed population concentrated in the city. 
      {{city.name}} Qalandars' performance in Pakistan Super League (PSL) tournaments captivates millions of supporters, with match days creating festive atmospheres 
      throughout the city as residents gather in homes, sports bars, and public spaces to watch team matches. 
      Gaddafi Stadium in {{city.name}}, one of South Asia's premier cricket venues, regularly hosts international Test matches, One Day Internationals (ODIs), and PSL games, 
      drawing global audiences through television broadcasts and digital streaming platforms. 
      {{city.name}} cricket academies including the prestigious High Performance Centre produce young talent destined for Pakistani national teams, with systematic training 
      programs developing technical skills, physical conditioning, and mental resilience required for international cricket success. 
      Street cricket in {{city.name}} neighborhoods, played with improvised equipment in residential lanes, parks, and open spaces, engages millions of children and teenagers 
      discovering their potential while developing cricket fundamentals in informal settings. 
      Pakistan cricket ranking positions, particularly in T20 format where Pakistan maintains competitive status among international teams, receive celebration in {{city.name}} 
      when the national team achieves victories or series wins impressing global cricket audiences. 
      Cricket betting and fantasy cricket games online attract millions of {{city.name}} participants, creating massive engagement with official tournaments despite regulatory ambiguities. 
      Women's cricket development in {{city.name}} increasingly gains momentum, with female cricketers from the city representing Pakistan internationally and inspiring younger girls.
    </p>
  `;
}

export function generateFieldsAndVenuesParagraph(city: City): string {
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Sports infrastructure in {{city.name}} includes iconic venues hosting international competitions and serving as training grounds for athletes pursuing professional careers. 
      {{city.name}} Gaddafi Stadium, formally renamed {{city.name}} Cricket Stadium, remains South Asia's most prestigious cricket venue with capacity exceeding 27,000 spectators 
      and hosting history dating back to 1959 when it opened as the world's first fully floodlit cricket ground. 
      {{city.name}} Jilani (formerly Racecourse) Park spans 750 acres, providing recreational facilities for cricket, football, athletics, and diverse sports accessible to public participants. 
      {{city.name}} National Stadium in the city center hosts athletics events, local cricket matches, and training sessions for aspiring athletes developing their competitive skills. 
      {{city.name}} fitness clubs, private sports academies, and gym facilities proliferate throughout the city, catering to health-conscious residents and professional athletes 
      requiring specialized training equipment and coaching expertise. 
      {{city.name}} university sports facilities including cricket grounds, tennis courts, and athletic tracks develop collegiate athletes competing in national student tournaments. 
      School sports fields across {{city.name}} neighborhoods provide grassroots cricket, football, and athletics opportunities for children and teenagers beginning athletic journeys. 
      {{city.name}} golf clubs offering 18-hole championship courses attract wealthy residents and international golfers, with clubs maintaining exclusive membership standards. 
      {{city.name}} badminton, squash, and racquet sports facilities in the city support athletes competing in niche sports with dedicated enthusiast communities and international competitors.
    </p>
  `;
}

export function generateSquashLegacyParagraph(city: City): string {
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      {{city.name}}'s squash heritage represents one of Pakistan's greatest athletic legacies, with legendary champion Jahangir Khan dominating the sport during the 1980s-1990s 
      by winning 555 consecutive matches, establishing perhaps the greatest winning streak in modern sports history across any discipline. 
      Jahangir Khan's dominance in {{city.name}} squash elevated the sport's global profile, inspiring subsequent Pakistani players including his cousin Jansher Khan 
      to achieve multiple world championship titles and cement Pakistan's squash supremacy. 
      {{city.name}} squash clubs and facilities serve passionate enthusiasts, though the sport's popularity has declined relative to cricket's overwhelming dominance 
      in Pakistan's sports consciousness. 
      {{city.name}} squash players continue competing internationally, with young prospects from the city training at established academies aiming to revive Pakistan's 
      competitive position in global squash rankings. 
      The psychological impact of Jahangir Khan's legendary achievements in {{city.name}} extended beyond sports, with his success symbolizing Pakistani excellence and 
      defying stereotypes regarding athletic capabilities in developing nations. 
      {{city.name}} sports fans recall Jahangir Khan's era with nostalgia, reminiscing about an athlete whose dedication and discipline achieved unparalleled dominance. 
      Modern {{city.name}} squash revival efforts emphasize developing the next generation of champions through structured training programs and international exposure. 
      {{city.name}} squash's cultural significance transcends competitive outcomes, representing aspirational excellence and national pride rooted in the city's sporting traditions.
    </p>
  `;
}

export function generateYouthSportsEngagementParagraph(city: City): string {
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Youth sports engagement in {{city.name}} serves crucial social functions beyond entertainment, providing structured activities that channel youthful energy, 
      develop leadership skills, and create pathways to social mobility for talented individuals from economically disadvantaged backgrounds. 
      {{city.name}} street cricket culture engages millions of youth in neighborhood-level competitions, talent discovery, and skill development occurring through informal play 
      in available open spaces throughout the city's diverse neighborhoods. 
      {{city.name}} cricket academies systematically identify promising young talent through regional trials, providing intensive training, nutrition support, and coaching 
      from experienced professionals to develop future national team members. 
      {{city.name}} government sports initiatives and private cricket facilities collaborate in talent development, with significant investment directed toward systems 
      identifying and nurturing exceptional young athletes demonstrating exceptional potential. 
      School cricket competitions in {{city.name}} create competitive ecosystems where young cricketers develop rivalry, sportsmanship, and professional aspirations 
      while representing their educational institutions. 
      {{city.name}} female youth engagement in sports, historically limited by cultural constraints and inferior infrastructure, increasingly gains societal acceptance 
      and institutional support promoting girls' participation in cricket and other athletic pursuits. 
      {{city.name}} sports psychology research emerging from universities emphasizes mental resilience development, injury prevention, and performance optimization 
      supporting holistic athlete development beyond pure physical conditioning. 
      Social benefits of {{city.name}} youth sports include improved academic performance, reduced substance abuse, enhanced community cohesion, and development of 
      lifelong friendships transcending socioeconomic boundaries typical in segregated urban settings.
    </p>
  `;
}

export function generateInternationalCompetitionsParagraph(city: City): string {
  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      International sports competitions hosted in {{city.name}} during {{month}} elevate the city's global profile while generating economic benefits through 
      tourism spending, international media coverage, and venue rental revenues supporting sports infrastructure development. 
      {{city.name}} Gaddafi Stadium's international cricket matches attract global teams, international media personnel, and fans traveling to witness world-class cricket, 
      creating temporary economic booms in hospitality, transportation, and retail sectors throughout the metropolitan area. 
      {{city.name}} Pakistan Super League tournaments held during winter months inject hundreds of millions of rupees into the local economy through player salaries, 
      venue operations, tourism spending, and broadcast rights generating government revenues. 
      {{city.name}} international tennis tournaments, badminton championships, and athletic events regularly scheduled at city venues attract global competitors and showcase 
      sports facilities meeting international standards expected by world sports federations. 
      {{city.name}} student exchange programs through international sporting competitions expose young athletes to world-class training methods, competitive standards, and 
      international networking opportunities advancing their athletic development. 
      {{city.name}} hosting major international events generates diplomatic opportunities, with visiting national teams' presence strengthening bilateral relations 
      through sports diplomacy traditions extending beyond competitive dimensions. 
      {{city.name}} international broadcasting of sporting events televised globally positions the city on the world stage, with landmarks visible in television backgrounds 
      contributing to international awareness and tourism promotion. 
      {{city.name}} youth exposure to international-level competition through watching visiting teams and athletes provides inspiration and realistic aspiration-setting 
      for local athletes pursuing professional careers in sports.
    </p>
  `;
}

export function generateWomensSportsParagraph(city: City): string {
  return `
    <p class="text-gray-300 leading-relaxed mb-4">
      Women's sports development in {{city.name}} represents emerging frontier in Pakistan's traditionally male-dominated sports culture, with increasing opportunities 
      and societal acceptance enabling female athletes to pursue professional sporting careers previously unavailable. 
      {{city.name}} women's cricket remains nascent relative to men's game, though growing infrastructure, media coverage, and international opportunities attract talented 
      young women to professional cricket pathways challenging traditional gender role constraints. 
      {{city.name}} female cricket academies specifically designed to accommodate women's training needs address infrastructure gaps that historically prevented female participation 
      in cricket, with coaching expertise and facilities comparable to male training programs. 
      {{city.name}} professional women cricketers representing Pakistan internationally inspire younger girls throughout the city to pursue athletic excellence despite 
      social pressures and family expectations often discouraging female sports participation in conservative contexts. 
      {{city.name}} women's field hockey, tennis, badminton, and athletics programs create competitive opportunities for female athletes seeking professional development 
      and international recognition in sports where Pakistan maintains competitive presence. 
      {{city.name}} women's sports governing bodies work toward gender equality in sports infrastructure investment, sponsorship opportunities, and media coverage, though 
      significant gaps remain relative to male sports' institutional support and public enthusiasm. 
      {{city.name}} university women's sports provide collegiate opportunities for female athletes developing skills and competing in national student tournaments, 
      with university sports representing important developmental stage before professional careers. 
      {{city.name}} community sports programs increasingly emphasize women's participation, recognizing health benefits and social empowerment implications of women's 
      athletic engagement for overall population wellbeing and gender equity advancement.
    </p>
  `;
}

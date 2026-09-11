 


/* ==========================================================================
   SHARED DATA, STORAGE & GEOCODING
   Loaded by both index.html (public) and manage.html (private) so they
   stay in sync on the same data. Nothing in this file renders anything
   on screen — that's index.js and manage.js.
   ========================================================================== */
 
const CITY_CENTER = [55.8642, -4.2518]; // Glasgow city centre
const CITY_ZOOM = 12;
 
// Matches --purple in style.css. Map libraries need a real color string
// (not a CSS variable) — if you change --purple, update this too.
const MARKER_HEX = '#B497DD';
 
/* ---------- starter activities ---------- */
const DEFAULT_ACTIVITIES = [
  {id: 3, name: "Botanic Gardens wander", rain: "no", cold: "either", moods: ["day-trip","cozy"], company: ["together","solo"], location: {lat: 55.8797, lng: -4.2911, label: "Botanic Gardens"}, options: []},
  {id: 4, name: "Kelvingrove Art Gallery", rain: "yes", cold: "either", moods: ["day-trip","fancy"], company: ["together","friends","solo"], location: {lat: 55.8687, lng: -4.2907, label: "Kelvingrove Art Gallery"}, options: []},
  {id: 5, name: "Picnic in Kelvingrove Park", rain: "no", cold: "no", moods: ["day-trip"], company: ["together","friends"], location: {lat: 55.8687, lng: -4.2842, label: "Kelvingrove Park"}, options: []},
  {id:6, name:"Cosy café & a good book", rain:"yes", cold:"either", moods:["night-in","cozy","day-trip"], company:["solo","together"], location:null, options:[]},
  {id:7, name:"Karaoke night", rain:"either", cold:"either", moods:["night-out"], company:["together","friends"], location:null, options:[]},
  {id:9, name:"Movie night", rain:"either", cold:"either", moods:["night-in","cozy"], company:["together","friends","solo"], location:null, options:[
    {name:"At home", location:null}
   ]},
  {id:10, name:"Night at the cinema?", rain:"either", cold:"either", moods:["night-in","cozy"], company:["together"], location:null, options:[
    {name:"Glasgow Film Theatre", location:{lat:55.8657225, lng:-4.2612728, label:"Glasgow Film Theatre"}},
    {name:"Vue St Enochs", location:{lat:55.8566876, lng:-4.2516395, label:"Vue"}},
    {name:"The Grosvenor", location:{lat:55.8746661, lng:-4.2931757, label:"The Grosvenor Cinema"}},
    {name:"Everyman", location:{lat:55.8593447, lng:-4.2534324, label:"Everyman Glasgow"}}
  ]},
  {id:11, name:"Coffee and a walk in the park (check cafe list)", rain:"no", cold:"either", moods:["day-trip","cozy"], company:["together","solo"], location:null, options:[
    {name:"Kelvingrove Park", location:{lat:55.8692556, lng:-4.2872909, label:"Kelvingrove Park"}},
    {name:"Queen's Park", location:{lat:55.8314201, lng:-4.2702266, label:"Queen's Park"}},
    {name:"Glasgow Green", location:{lat:55.8477254, lng:-4.2344144, label:"Glasgow Green"}},
    {name:"Pollock Country Park", location:null},
    {name:"Canals", location:{lat:55.8724304, lng:-4.2464082, label:"Port Dundas Basin"}}
  ]},
  {id:13, name:"GoMA", rain:"either", cold:"either", moods:["day-trip"], company:["together","solo"], location:null, options:[
    {name:"Glasgow Museum of Modern Art", location:{lat:55.8601675, lng:-4.2526408, label:"Gallery of Modern Art"}}
  ]},
  {id:14, name:"Bowling", rain:"either", cold:"either", moods:["night-out"], company:["together","friends"], location:null, options:[]},
  {id:15, name:"Mini Golf", rain:"either", cold:"either", moods:["night-out","day-trip"], company:["together","friends"], location:null, options:[]},
  {id:16, name:"Brunch!", rain:"either", cold:"either", moods:["day-trip"], company:["together","friends"], location:null, options:[
    {name:"Bramble", location:{lat:55.804491, lng:-4.2943789, label:"Bramble"}}
  ]},
  {id:17, name:"Live Music", rain:"either", cold:"either", moods:["night-out"], company:["together","friends"], location:null, options:[
    {name:"King Tut's", location:{lat:55.862618, lng:-4.2649646, label:"King Tut's Wah Wah Hut"}}
  ]},
  {id:18, name:"Jazz?", rain:"either", cold:"either", moods:["fancy","night-out"], company:["together","friends","solo"], location:null, options:[
    {name:"Basement Jazz Bar", location:null}
  ]},
  {id:19, name:"Riverside Museum", rain:"either", cold:"either", moods:["day-trip"], company:["together","friends","solo"], location:null, options:[
    {name:"Riverside Museum", location:{lat:55.8652309, lng:-4.3061682, label:"Riverside Museum"}}
  ]},
  {id:20, name:"Hill Walk", rain:"no", cold:"either", moods:["day-trip"], company:["together","friends"], location:null, options:[
    {name:"Kilpatrick Hills", location:null}
  ]},
  {id:21, name:"Munro?", rain:"no", cold:"either", moods:["day-trip"], company:["together","friends"], location:null, options:[
    {name:"Ben Lomond", location:null}
  ]},
  {id:22, name:"Outdoor Swim", rain:"no", cold:"either", moods:["day-trip"], company:["together","friends","solo"], location:null, options:[
    {name:"Mugdock Park", location:null},
    {name:"Loch Lomond", location:null},
    {name:"Loch Tay", location:null}
  ]},
  {id:23, name:"Sauna?", rain:"either", cold:"either", moods:["day-trip"], company:["together","friends","solo"], location:null, options:[]},
  {id:24, name:"Join a session at Glasgow Zine Library", rain:"either", cold:"either", moods:["day-trip"], company:["together","friends"], location:null, options:[]},
  {id:25, name:"Charity shopping", rain:"either", cold:"either", moods:["day-trip"], company:["together","friends","solo"], location:null, options:[
    {name:"Shawlands Road", location:null},
    {name:"Byres Road & GWR", location:null},
    {name:"The Barras (weekend only)", location:null}
  ]},
  {id:26, name:"Self care night", rain:"either", cold:"either", moods:["night-in"], company:["solo"], location:null, options:[]},
  {id:28, name:"Ice-cream? lol", rain:"no", cold:"no", moods:["day-trip","cozy"], company:["together","friends","solo"], location:null, options:[
    {name:"Nowita", location:{lat:55.8719832, lng:-4.302533, label:"Nowita"}},
    {name:"La Gelatessa", location:{lat:55.8368944, lng:-4.2712344, label:"La Gelatessa"}}
  ]},
  {id:29, name:"Hot Chocolate!", rain:"yes", cold:"yes", moods:["night-in","cozy"], company:["together","friends","solo"], location:null, options:[
    {name:"Kelvingrove Cafe", location:{lat:55.8649299, lng:-4.2854354, label:"Kelvingrove Café"}},
    {name:"La Gelatessa", location:{lat:55.8368944, lng:-4.2712344, label:"La Gelatessa"}}
  ]},
  {id:30, name:"Lunch/Dinner (check food list)", rain:"either", cold:"either", moods:["fancy","night-in","night-out","day-trip","cozy"], company:["together","friends","solo"], location:null, options:[]},
  {id:31, name:"Fancy Dinner", rain:"either", cold:"either", moods:["fancy","night-out"], company:["together"], location:null, options:[
    {name:"Lobo", location:{lat:55.8361969, lng:-4.2709928, label:"Lobo"}},
    {name:"Ga Ga", location:{lat:55.8708413, lng:-4.3153633, label:"Ga Ga"}},
    {name:"Five March", location:{lat:55.8666506, lng:-4.2762119, label:"Five March"}},
    {name:"Margo", location:{lat:55.8592438, lng:-4.2507639, label:"Margo"}},
    {name:"Sebb's", location:{lat:55.8591657, lng:-4.2507618, label:"Sebb's"}},
    {name:"Ox & Finch", location:{lat:55.8657948, lng:-4.2847546, label:"Ox and Finch"}}
  ]},
  {id:32, name:"The Burrell Collection", rain:"either", cold:"either", moods:["day-trip"], company:["together","friends","solo"], location:null, options:[
    {name:"The Burrell Collection", location:{lat:55.8308906, lng:-4.3076388, label:"The Burrell Collection"}}
  ]},
  {id:33, name:"Railyard Market", rain:"no", cold:"either", moods:["day-trip"], company:["together","friends","solo"], location:null, options:[
    {name:"Railyard Market", location:null}
  ]},
  {id:34, name:"Pottery Cafe", rain:"either", cold:"either", moods:["night-in","night-out","day-trip","cozy"], company:["together","friends"], location:null, options:[]},
  {id:35, name:"Day trip", rain:"no", cold:"either", moods:["day-trip","cozy"], company:["together","friends","solo"], location:null, options:[
    {name:"Edinburgh", location:null},
    {name:"Luss", location:null},
    {name:"Oban", location:null},
    {name:"Choose!", location:null}
  ]}
];
 
/* ---------- storage keys ---------- */
const STORE_KEY = "shallwe_activities_glasgow_v1";
const PLAYLIST_KEY = "shallwe_playlist_v1";
 
// To make a playlist show up for anyone who opens the site (not just
// whichever browser used manage.html to set it), paste the link here.
// Leave it as "" to only rely on manage.html's saved link instead.
const DEFAULT_PLAYLIST_URL_UNUSED = "";
 
function loadActivities(){
  try{
    const raw = localStorage.getItem(STORE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return DEFAULT_ACTIVITIES.slice();
}
function saveActivities(list){
  try{ localStorage.setItem(STORE_KEY, JSON.stringify(list)); }catch(e){}
}
 
function escapeHtml(str){
  const d = document.createElement('div');
  d.textContent = str == null ? '' : str;
  return d.innerHTML;
}
 
/* ==========================================================================
   CAFES (sidebar chooser, grouped by area)
   ========================================================================== */
const CAFE_AREAS = ["West End", "Southside", "City Centre", "East End", "North", "Other"];
const CAFE_STORE_KEY = "shallwe_cafes_v1";
 
const DEFAULT_CAFES = [
  {id:7, name:"Laboratorio Espresso", area:"City Centre", location:{lat:55.8631864, lng:-4.2547772, label:"Laboratorio Espresso"}},
  {id:8, name:"Papercup Coffee Co.", area:"West End", location:{lat:55.8639197, lng:-4.2987295, label:"Papercup Coffee Roasters"}},
  {id:9, name:"Short Long Black", area:"Southside", location:{lat:55.8347766, lng:-4.2651766, label:"Short Long Black"}},
  {id:10, name:"Neka", area:"Southside", location:{lat:55.8332049, lng:-4.2815044, label:"Neka"}},
  {id:11, name:"Bramble", area:"Southside", location:{lat:55.804491, lng:-4.2943789, label:"Bramble"}},
  {id:12, name:"Uplands Roast", area:"West End", location:{lat:55.8639968, lng:-4.2717612, label:"Uplands Roast"}},
  {id:13, name:"Cafe Salmagundi", area:"Southside", location:{lat:55.8276941, lng:-4.2591947, label:"Cafe Salmagundi"}},
  {id:14, name:"Zennor", area:"East End", location:{lat:55.8351613, lng:-4.2627104, label:"Zennor"}},
  {id:15, name:"Zennor", area:"Southside", location:{lat:55.8582605, lng:-4.2201509, label:"Zennor"}},
  {id:16, name:"Mesa", area:"East End", location:{lat:55.8585576, lng:-4.216264, label:"Mesa"}},
  {id:17, name:"The Alchemy Experiment", area:"West End", location:{lat:55.8736103, lng:-4.2957953, label:"The Alchemy Experiment"}},
  {id:18, name:"Cottonrake Cafe", area:"West End", location:{lat:55.8774104, lng:-4.2889278, label:"Cottonrake Cafe"}},
  {id:19, name:"Paragon Cafe", area:"West End", location:{lat:55.8770534, lng:-4.2877507, label:"Paragon"}},
  {id:20, name:"Wilson St. Pantry", area:"City Centre", location:{lat:55.8584792, lng:-4.2459515, label:"Wilson St. Pantry"}},
  {id:21, name:"Spitfire Espresso", area:"City Centre", location:{lat:55.8575294, lng:-4.2430096, label:"Spitfire Espresso"}},
  {id:22, name:"Outlier", area:"City Centre", location:{lat:55.8560034, lng:-4.2432315, label:"OUTLIER"}},
  {id:23, name:"Ottoman Coffeehouse", area:"West End", location:{lat:55.8651038, lng:-4.2752199, label:"Ottoman Coffeehouse"}},
  {id:24, name:"Kudos", area:"West End", location:{lat:55.8650595, lng:-4.2848638, label:"Kudos"}},
  {id:25, name:"Finnieston Fez", area:"West End", location:{lat:55.8637642, lng:-4.2815324, label:"Finnieston Fez"}},
  {id:26, name:"Offshore", area:"West End", location:{lat:55.8722075, lng:-4.2818751, label:"Offshore"}},
  {id:27, name:"Godshot", area:"Southside", location:null},
  {id:28, name:"Amulet", area:"West End", location:{lat:55.8718884, lng:-4.3012331, label:"Amulet"}},
  {id:29, name:"Kaf", area:"West End", location:{lat:55.8710905, lng:-4.3028609, label:"Kaf Coffee"}},
  {id:30, name:"Thomsons Coffee", area:"City Centre", location:{lat:55.8593955, lng:-4.2453453, label:"Thomsons"}},
  {id:31, name:"Burnfield Bakery", area:"Southside", location:null},
  {id:32, name:"1841 Coffee", area:"West End", location:{lat:55.8770591, lng:-4.2900445, label:"1841"}},
  {id:33, name:"Big Bear", area:"West End", location:{lat:55.8714168, lng:-4.3007285, label:"Big Bear Bakery"}},
  {id:34, name:"Deanston Bakery", area:"Southside", location:{lat:55.8277017, lng:-4.2822203, label:"Deanston Bakery"}},
  {id:35, name:"Space: Specialty Coffee", area:"West End", location:null},
  {id:36, name:"Hinba", area:"West End", location:{lat:55.8766722, lng:-4.2864509, label:"Hinba"}},
  {id:37, name:"French Monkey", area:"Southside", location:null},
  {id:38, name:"Sister Midnight", area:"City Centre", location:null},
  {id:39, name:"Jeju Baked Goods", area:"Southside", location:{lat:55.8367271, lng:-4.2645432, label:"Jeju Baked Goods"}},
  {id:40, name:"Maple Leaf Bakery", area:"West End", location:null},
  {id:41, name:"Black Sheep Coffee", area:"West End", location:{lat:55.8223288, lng:-4.3415865, label:"Black Sheep Coffee"}}
];
 
function loadCafes(){
  try{
    const raw = localStorage.getItem(CAFE_STORE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return DEFAULT_CAFES.slice();
}
function saveCafes(list){
  try{ localStorage.setItem(CAFE_STORE_KEY, JSON.stringify(list)); }catch(e){}
}
 
/* ==========================================================================
   BARS (second sidebar chooser, grouped by area)
   ========================================================================== */
const BAR_AREAS = ["West End", "Southside", "City Centre", "East End", "North", "Other"];
const BAR_STORE_KEY = "shallwe_bars_v1";
 
const DEFAULT_BARS = [
  {id:6, name:"The Sparkle Horse", area:"West End", location:{lat:55.8714022, lng:-4.3003587, label:"The Sparkle Horse"}},
  {id:7, name:"Naked Soup", area:"West End", location:{lat:55.8771794, lng:-4.2888052, label:"Naked Soup"}},
  {id:8, name:"Bananamoon", area:"West End", location:{lat:55.8736408, lng:-4.2758489, label:"Bananamoon"}},
  {id:9, name:"Òran Mór", area:"West End", location:{lat:55.8775552, lng:-4.2897025, label:"Òran Mór"}},
  {id:10, name:"The Lismore", area:"West End", location:{lat:55.8709688, lng:-4.3015583, label:"The Lismore Bar"}},
  {id:11, name:"The Belle", area:"West End", location:{lat:55.8764871, lng:-4.285845, label:"The Belle"}},
  {id:12, name:"The Rock", area:"West End", location:{lat:55.8751058, lng:-4.303556, label:"The Rock"}},
  {id:13, name:"The Arlington", area:"City Centre", location:{lat:55.8693912, lng:-4.2742257, label:"The Arlington"}},
  {id:14, name:"Devil of Brooklyn", area:"City Centre", location:{lat:55.8621345, lng:-4.2562429, label:"Devil of Brooklyn"}},
  {id:15, name:"Hillhead Book Club", area:"West End", location:null},
  {id:16, name:"Westside Tavern", area:"West End", location:null},
  {id:17, name:"The Park Bar", area:"West End", location:{lat:55.8657894, lng:-4.2871561, label:"The Park Bar"}}
];
 
function loadBars(){
  try{
    const raw = localStorage.getItem(BAR_STORE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return DEFAULT_BARS.slice();
}
function saveBars(list){
  try{ localStorage.setItem(BAR_STORE_KEY, JSON.stringify(list)); }catch(e){}
}
 
/* ==========================================================================
   RESTAURANTS (third sidebar chooser, grouped by area)
   ========================================================================== */
const RESTAURANT_AREAS = ["West End", "Southside", "City Centre", "East End", "North", "Other"];
const RESTAURANT_STORE_KEY = "shallwe_restaurants_v1";
 
const DEFAULT_RESTAURANTS = [
  {id:6, name:"Banh Mi & Tea", area:"West End", location:{lat:55.8709439, lng:-4.3067574, label:"Banh Mi & Tea"}},
  {id:7, name:"Suissi Vegan Kitchen", area:"West End", location:{lat:55.8708693, lng:-4.3134623, label:"Suissi Vegan Kitchen"}},
  {id:8, name:"Ga Ga", area:"West End", location:{lat:55.8708413, lng:-4.3153633, label:"Ga Ga"}},
  {id:9, name:"Loon Fung", area:"City Centre", location:{lat:55.8659336, lng:-4.2687996, label:"Loon Fung"}},
  {id:10, name:"Katsu", area:"City Centre", location:{lat:55.8619362, lng:-4.2552686, label:"Katsu"}},
  {id:11, name:"Maki & Ramen", area:"City Centre", location:{lat:55.8638598, lng:-4.2555901, label:"Maki & Ramen"}},
  {id:12, name:"Seoul Korean BBQ", area:"City Centre", location:null},
  {id:13, name:"Kimchi Cult", area:"West End", location:{lat:55.8718432, lng:-4.2984396, label:"Kimchi Cult"}},
  {id:14, name:"Sugo", area:"City Centre", location:{lat:55.8597453, lng:-4.25568, label:"Sugo Pasta"}},
  {id:15, name:"Paesano Pizza", area:"City Centre", location:{lat:55.8596748, lng:-4.2506521, label:"Paesano"}},
  {id:16, name:"Mother India", area:"West End", location:{lat:55.8652394, lng:-4.283925, label:"Mother India"}},
  {id:17, name:"Chaakoo Bombay", area:"West End", location:{lat:55.8758254, lng:-4.2956986, label:"Chaakoo Bombay"}},
  {id:18, name:"Mezcal", area:"City Centre", location:{lat:55.8610665, lng:-4.2583766, label:"Mezcal"}},
  {id:19, name:"Wee Tacqueria", area:"City Centre", location:null},
  {id:20, name:"Pescado", area:"West End", location:{lat:55.8718409, lng:-4.3025937, label:"Pescado Tapas"}},
  {id:21, name:"Ting Thai", area:"West End", location:{lat:55.8729042, lng:-4.2960874, label:"Ting Thai"}},
  {id:22, name:"The Real Wan", area:"Southside", location:{lat:55.8270149, lng:-4.2593531, label:"The Real Wan"}},
  {id:23, name:"Corner Shop", area:"West End", location:{lat:55.8670769, lng:-4.2925677, label:"Corner Shop"}},
  {id:24, name:"Malocchio", area:"City Centre", location:{lat:55.8596519, lng:-4.248024, label:"Malocchio"}},
  {id:25, name:"Fook Mei", area:"East End", location:{lat:55.8537924, lng:-4.2373279, label:"Fook Mei"}},
  {id:26, name:"Ho Lee Fook", area:"East End", location:{lat:55.8554719, lng:-4.2361204, label:"Ho Lee Fook"}},
  {id:27, name:"Studio by Modou", area:"West End", location:{lat:55.8391002, lng:-4.2751927, label:"Studio by Modou"}},
  {id:28, name:"Gloriosa", area:"West End", location:{lat:55.8665995, lng:-4.2904739, label:"Gloriosa"}}
];
 
function loadRestaurants(){
  try{
    const raw = localStorage.getItem(RESTAURANT_STORE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return DEFAULT_RESTAURANTS.slice();
}
function saveRestaurants(list){
  try{ localStorage.setItem(RESTAURANT_STORE_KEY, JSON.stringify(list)); }catch(e){}
}
 
/* ==========================================================================
   LOCATION SEARCH (geocoding via OpenStreetMap's Nominatim)
   Free, no API key. Please be a good citizen of the free service — we
   only search on an explicit "find" click (not on every keystroke).
   https://operations.osmfoundation.org/policies/nominatim/
   ========================================================================== */
let lastSearchAt = 0;
 
async function searchGlasgowPlace(query){
  const now = Date.now();
  if(now - lastSearchAt < 1000) return [];
  lastSearchAt = now;
  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=5&viewbox=-4.45,55.93,-4.05,55.78&bounded=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('Search failed');
  return res.json();
}
 
/* ==========================================================================
   PLAYLIST EMBED (Spotify / Apple Music / YouTube)
   ========================================================================== */
const DEFAULT_PLAYLIST_URL = "https://open.spotify.com/playlist/1aV8q8gGtnZ6V0M9ciq2NK?si=458cbcfc9fa94488";
 
function parseSpotifyUri(url){
  try{
    const u = new URL(url);
    if(!u.hostname.includes('spotify.com')) return null;
    const m = u.pathname.match(/\/(playlist|album|track)\/([a-zA-Z0-9]+)/);
    if(!m) return null;
    return `spotify:${m[1]}:${m[2]}`;
  }catch(e){ return null; }
}
 
function playlistEmbedHtml(url){
  try{
    const u = new URL(url);
    if(u.hostname.includes('spotify.com')){
      const m = u.pathname.match(/\/(playlist|album|track)\/([a-zA-Z0-9]+)/);
      if(m){
        return `<div class="playlist-embed-wrap"><iframe src="https://open.spotify.com/embed/${m[1]}/${m[2]}" height="352" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe></div>`;
      }
    }
    if(u.hostname.includes('music.apple.com')){
      const embedUrl = url.replace('music.apple.com', 'embed.music.apple.com');
      return `<div class="playlist-embed-wrap"><iframe src="${embedUrl}" height="450" allow="autoplay *; encrypted-media *;" loading="lazy"></iframe></div>`;
    }
    if(u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')){
      const listId = u.searchParams.get('list');
      if(listId){
        return `<div class="playlist-embed-wrap"><iframe src="https://www.youtube.com/embed/videoseries?list=${listId}" height="315" allow="autoplay; encrypted-media" loading="lazy"></iframe></div>`;
      }
    }
    return `<div class="playlist-embed-wrap"><iframe src="${url}" height="352" loading="lazy"></iframe></div>`;
  }catch(e){
    return null;
  }
}
 

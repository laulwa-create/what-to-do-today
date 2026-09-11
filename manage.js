let activities = loadActivities();

/* ==========================================================================
   THE BOARD (full editing — add / remove)
   ========================================================================== */
function renderActivityList(){
  const listEl = document.getElementById('activityList');
  listEl.innerHTML = activities.map(a=>{
    const tagBits = [
      a.rain !== 'either' ? (a.rain==='yes'?'rainy':'dry') : null,
      a.cold !== 'either' ? (a.cold==='yes'?'cold':'mild') : null,
      ...a.moods, ...a.company
    ].filter(Boolean).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('');
    const locTag = a.location ? `<span class="tag loc">📍 ${escapeHtml(a.location.label)}</span>` : '';
    const optionsTag = (a.options && a.options.length) ? `<span class="tag loc">🍽️ ${a.options.length} option${a.options.length>1?'s':''}</span>` : '';
    return `<div class="board-card" data-id="${a.id}">
      <button class="remove-btn" data-remove="${a.id}" title="remove">✕</button>
      <div class="name">${escapeHtml(a.name)}</div>
      <div class="tags">${tagBits}${locTag}${optionsTag}</div>
    </div>`;
  }).join('');

  listEl.querySelectorAll('[data-remove]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const id = Number(btn.dataset.remove);
      activities = activities.filter(a=>a.id !== id);
      saveActivities(activities);
      renderActivityList();
    });
  });
}
renderActivityList();

/* ---------- general area location search ---------- */
let pendingLocation = null;

document.getElementById('locationSearchBtn').addEventListener('click', async ()=>{
  const query = document.getElementById('locationQuery').value.trim();
  const resultsEl = document.getElementById('locationResults');
  if(!query) return;
  resultsEl.innerHTML = `<div class="location-result-item">searching…</div>`;
  try{
    const results = await searchGlasgowPlace(query);
    if(!results.length){
      resultsEl.innerHTML = `<div class="location-result-item">no matches — try a different search</div>`;
      return;
    }
    resultsEl.innerHTML = results.map((r, i)=>
      `<button type="button" class="location-result-item" data-index="${i}">${escapeHtml(r.display_name)}</button>`
    ).join('');
    resultsEl.querySelectorAll('[data-index]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const r = results[Number(btn.dataset.index)];
        pendingLocation = { lat: parseFloat(r.lat), lng: parseFloat(r.lon), label: r.display_name.split(',')[0] };
        document.getElementById('locationSelected').textContent = `📍 selected: ${pendingLocation.label}`;
        resultsEl.innerHTML = '';
      });
    });
  }catch(e){
    resultsEl.innerHTML = `<div class="location-result-item">search failed — check your connection and try again</div>`;
  }
});

/* ---------- specific options (named places) ---------- */
let optionRowCounter = 0;
const optionRowLocations = {};

function addOptionRow(){
  const rowId = 'opt' + (optionRowCounter++);
  const container = document.getElementById('optionRows');
  const row = document.createElement('div');
  row.className = 'option-row';
  row.dataset.rowId = rowId;
  row.innerHTML = `
    <div class="option-row-top">
      <input type="text" class="option-name" placeholder="place name, e.g. Ubiquitous Chip">
      <button type="button" class="icon-btn remove-option-btn" title="remove">✕</button>
    </div>
    <div class="location-search-row">
      <input type="text" class="option-location-query" placeholder="search its location (optional)">
      <button type="button" class="option-location-find">find</button>
    </div>
    <div class="location-results option-location-results"></div>
    <div class="location-selected option-location-selected"></div>
  `;
  container.appendChild(row);
  optionRowLocations[rowId] = null;

  row.querySelector('.remove-option-btn').addEventListener('click', ()=>{
    row.remove();
    delete optionRowLocations[rowId];
  });

  row.querySelector('.option-location-find').addEventListener('click', async ()=>{
    const query = row.querySelector('.option-location-query').value.trim();
    const resultsEl = row.querySelector('.option-location-results');
    if(!query) return;
    resultsEl.innerHTML = `<div class="location-result-item">searching…</div>`;
    try{
      const results = await searchGlasgowPlace(query);
      if(!results.length){
        resultsEl.innerHTML = `<div class="location-result-item">no matches</div>`;
        return;
      }
      resultsEl.innerHTML = results.map((r,i)=>`<button type="button" class="location-result-item" data-index="${i}">${escapeHtml(r.display_name)}</button>`).join('');
      resultsEl.querySelectorAll('[data-index]').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const r = results[Number(btn.dataset.index)];
          optionRowLocations[rowId] = { lat: parseFloat(r.lat), lng: parseFloat(r.lon), label: r.display_name.split(',')[0] };
          row.querySelector('.option-location-selected').textContent = `📍 ${optionRowLocations[rowId].label}`;
          resultsEl.innerHTML = '';
        });
      });
    }catch(e){
      resultsEl.innerHTML = `<div class="location-result-item">search failed — check your connection and try again</div>`;
    }
  });
}
document.getElementById('addOptionBtn').addEventListener('click', addOptionRow);

function collectOptionRows(){
  return [...document.querySelectorAll('#optionRows .option-row')].map(row=>{
    const name = row.querySelector('.option-name').value.trim();
    if(!name) return null;
    return { name, location: optionRowLocations[row.dataset.rowId] || null };
  }).filter(Boolean);
}
function resetOptionRows(){
  document.getElementById('optionRows').innerHTML = '';
  Object.keys(optionRowLocations).forEach(k=> delete optionRowLocations[k]);
}

/* ---------- add-activity form chips ---------- */
function wireMultiChip(id){
  document.getElementById(id).querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=> chip.classList.toggle('active'));
  });
}
function wireSingleChip(id){
  const row = document.getElementById(id);
  row.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      row.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
}
wireSingleChip('newRain');
wireSingleChip('newCold');
wireMultiChip('newMood');
wireMultiChip('newCompany');

document.getElementById('saveActivityBtn').addEventListener('click', ()=>{
  const name = document.getElementById('newName').value.trim();
  if(!name){ document.getElementById('newName').focus(); return; }
  const rain = document.querySelector('#newRain .chip.active').dataset.value;
  const cold = document.querySelector('#newCold .chip.active').dataset.value;
  const moods = [...document.querySelectorAll('#newMood .chip.active')].map(c=>c.dataset.value);
  const company = [...document.querySelectorAll('#newCompany .chip.active')].map(c=>c.dataset.value);
  const newId = activities.length ? Math.max(...activities.map(a=>a.id))+1 : 1;

  activities.push({
    id:newId, name, rain, cold,
    moods: moods.length ? moods : ["fancy","night-in","night-out","day-trip","cozy"],
    company: company.length ? company : ["together","friends","solo"],
    location: pendingLocation,
    options: collectOptionRows()
  });
  saveActivities(activities);
  renderActivityList();

  document.getElementById('newName').value = '';
  document.getElementById('locationQuery').value = '';
  document.getElementById('locationResults').innerHTML = '';
  document.getElementById('locationSelected').textContent = '';
  pendingLocation = null;
  resetOptionRows();
  document.querySelectorAll('#newRain .chip, #newCold .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector('#newRain .chip[data-value="either"]').classList.add('active');
  document.querySelector('#newCold .chip[data-value="either"]').classList.add('active');
  document.querySelectorAll('#newMood .chip, #newCompany .chip').forEach(c=>c.classList.remove('active'));
});

/* ==========================================================================
   CAFES
   ========================================================================== */
let cafes = loadCafes();
let pendingCafeLocation = null;

function renderCafeAreaChips(){
  const row = document.getElementById('newCafeArea');
  row.innerHTML = CAFE_AREAS.map((a,i)=>
    `<button class="chip${i===0?' active':''}" data-value="${escapeHtml(a)}">${escapeHtml(a)}</button>`
  ).join('');
  row.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      row.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
}
renderCafeAreaChips();

function renderCafeList(){
  const listEl = document.getElementById('cafeList');
  listEl.innerHTML = cafes.map(c=>{
    const locTag = c.location ? `<span class="tag loc">📍 ${escapeHtml(c.location.label)}</span>` : `<span class="tag">no location yet</span>`;
    return `<div class="board-card" data-id="${c.id}">
      <button class="remove-btn" data-remove-cafe="${c.id}" title="remove">✕</button>
      <div class="name">${escapeHtml(c.name)}</div>
      <div class="tags"><span class="tag">${escapeHtml(c.area)}</span>${locTag}</div>
    </div>`;
  }).join('');

  listEl.querySelectorAll('[data-remove-cafe]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const id = Number(btn.dataset.removeCafe);
      cafes = cafes.filter(c=>c.id !== id);
      saveCafes(cafes);
      renderCafeList();
    });
  });
}
renderCafeList();

document.getElementById('cafeLocationSearchBtn').addEventListener('click', async ()=>{
  const query = document.getElementById('cafeLocationQuery').value.trim();
  const resultsEl = document.getElementById('cafeLocationResults');
  if(!query) return;
  resultsEl.innerHTML = `<div class="location-result-item">searching…</div>`;
  try{
    const results = await searchGlasgowPlace(query);
    if(!results.length){
      resultsEl.innerHTML = `<div class="location-result-item">no matches — try a different search</div>`;
      return;
    }
    resultsEl.innerHTML = results.map((r, i)=>
      `<button type="button" class="location-result-item" data-index="${i}">${escapeHtml(r.display_name)}</button>`
    ).join('');
    resultsEl.querySelectorAll('[data-index]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const r = results[Number(btn.dataset.index)];
        pendingCafeLocation = { lat: parseFloat(r.lat), lng: parseFloat(r.lon), label: r.display_name.split(',')[0] };
        document.getElementById('cafeLocationSelected').textContent = `📍 selected: ${pendingCafeLocation.label}`;
        resultsEl.innerHTML = '';
      });
    });
  }catch(e){
    resultsEl.innerHTML = `<div class="location-result-item">search failed — check your connection and try again</div>`;
  }
});

document.getElementById('saveCafeBtn').addEventListener('click', ()=>{
  const name = document.getElementById('newCafeName').value.trim();
  if(!name){ document.getElementById('newCafeName').focus(); return; }
  const area = document.querySelector('#newCafeArea .chip.active').dataset.value;
  const newId = cafes.length ? Math.max(...cafes.map(c=>c.id))+1 : 1;

  cafes.push({ id:newId, name, area, location: pendingCafeLocation });
  saveCafes(cafes);
  renderCafeList();

  document.getElementById('newCafeName').value = '';
  document.getElementById('cafeLocationQuery').value = '';
  document.getElementById('cafeLocationResults').innerHTML = '';
  document.getElementById('cafeLocationSelected').textContent = '';
  pendingCafeLocation = null;
  document.querySelectorAll('#newCafeArea .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector('#newCafeArea .chip').classList.add('active');
});

/* ==========================================================================
   RESTAURANTS (same pattern as cafes/bars)
   ========================================================================== */
let restaurants = loadRestaurants();
let pendingRestaurantLocation = null;

function renderRestaurantAreaChips(){
  const row = document.getElementById('newRestaurantArea');
  row.innerHTML = RESTAURANT_AREAS.map((a,i)=>
    `<button class="chip${i===0?' active':''}" data-value="${escapeHtml(a)}">${escapeHtml(a)}</button>`
  ).join('');
  row.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      row.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
}
renderRestaurantAreaChips();

function renderRestaurantList(){
  const listEl = document.getElementById('restaurantList');
  listEl.innerHTML = restaurants.map(r=>{
    const locTag = r.location ? `<span class="tag loc">📍 ${escapeHtml(r.location.label)}</span>` : `<span class="tag">no location yet</span>`;
    return `<div class="board-card" data-id="${r.id}">
      <button class="remove-btn" data-remove-restaurant="${r.id}" title="remove">✕</button>
      <div class="name">${escapeHtml(r.name)}</div>
      <div class="tags"><span class="tag">${escapeHtml(r.area)}</span>${locTag}</div>
    </div>`;
  }).join('');

  listEl.querySelectorAll('[data-remove-restaurant]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const id = Number(btn.dataset.removeRestaurant);
      restaurants = restaurants.filter(r=>r.id !== id);
      saveRestaurants(restaurants);
      renderRestaurantList();
    });
  });
}
renderRestaurantList();

document.getElementById('restaurantLocationSearchBtn').addEventListener('click', async ()=>{
  const query = document.getElementById('restaurantLocationQuery').value.trim();
  const resultsEl = document.getElementById('restaurantLocationResults');
  if(!query) return;
  resultsEl.innerHTML = `<div class="location-result-item">searching…</div>`;
  try{
    const results = await searchGlasgowPlace(query);
    if(!results.length){
      resultsEl.innerHTML = `<div class="location-result-item">no matches — try a different search</div>`;
      return;
    }
    resultsEl.innerHTML = results.map((r, i)=>
      `<button type="button" class="location-result-item" data-index="${i}">${escapeHtml(r.display_name)}</button>`
    ).join('');
    resultsEl.querySelectorAll('[data-index]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const r = results[Number(btn.dataset.index)];
        pendingRestaurantLocation = { lat: parseFloat(r.lat), lng: parseFloat(r.lon), label: r.display_name.split(',')[0] };
        document.getElementById('restaurantLocationSelected').textContent = `📍 selected: ${pendingRestaurantLocation.label}`;
        resultsEl.innerHTML = '';
      });
    });
  }catch(e){
    resultsEl.innerHTML = `<div class="location-result-item">search failed — check your connection and try again</div>`;
  }
});

document.getElementById('saveRestaurantBtn').addEventListener('click', ()=>{
  const name = document.getElementById('newRestaurantName').value.trim();
  if(!name){ document.getElementById('newRestaurantName').focus(); return; }
  const area = document.querySelector('#newRestaurantArea .chip.active').dataset.value;
  const newId = restaurants.length ? Math.max(...restaurants.map(r=>r.id))+1 : 1;

  restaurants.push({ id:newId, name, area, location: pendingRestaurantLocation });
  saveRestaurants(restaurants);
  renderRestaurantList();

  document.getElementById('newRestaurantName').value = '';
  document.getElementById('restaurantLocationQuery').value = '';
  document.getElementById('restaurantLocationResults').innerHTML = '';
  document.getElementById('restaurantLocationSelected').textContent = '';
  pendingRestaurantLocation = null;
  document.querySelectorAll('#newRestaurantArea .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector('#newRestaurantArea .chip').classList.add('active');
});

/* ==========================================================================
   BARS (same pattern as cafes)
   ========================================================================== */
let bars = loadBars();
let pendingBarLocation = null;

function renderBarAreaChips(){
  const row = document.getElementById('newBarArea');
  row.innerHTML = BAR_AREAS.map((a,i)=>
    `<button class="chip${i===0?' active':''}" data-value="${escapeHtml(a)}">${escapeHtml(a)}</button>`
  ).join('');
  row.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      row.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
}
renderBarAreaChips();

function renderBarList(){
  const listEl = document.getElementById('barList');
  listEl.innerHTML = bars.map(b=>{
    const locTag = b.location ? `<span class="tag loc">📍 ${escapeHtml(b.location.label)}</span>` : `<span class="tag">no location yet</span>`;
    return `<div class="board-card" data-id="${b.id}">
      <button class="remove-btn" data-remove-bar="${b.id}" title="remove">✕</button>
      <div class="name">${escapeHtml(b.name)}</div>
      <div class="tags"><span class="tag">${escapeHtml(b.area)}</span>${locTag}</div>
    </div>`;
  }).join('');

  listEl.querySelectorAll('[data-remove-bar]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const id = Number(btn.dataset.removeBar);
      bars = bars.filter(b=>b.id !== id);
      saveBars(bars);
      renderBarList();
    });
  });
}
renderBarList();

document.getElementById('barLocationSearchBtn').addEventListener('click', async ()=>{
  const query = document.getElementById('barLocationQuery').value.trim();
  const resultsEl = document.getElementById('barLocationResults');
  if(!query) return;
  resultsEl.innerHTML = `<div class="location-result-item">searching…</div>`;
  try{
    const results = await searchGlasgowPlace(query);
    if(!results.length){
      resultsEl.innerHTML = `<div class="location-result-item">no matches — try a different search</div>`;
      return;
    }
    resultsEl.innerHTML = results.map((r, i)=>
      `<button type="button" class="location-result-item" data-index="${i}">${escapeHtml(r.display_name)}</button>`
    ).join('');
    resultsEl.querySelectorAll('[data-index]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const r = results[Number(btn.dataset.index)];
        pendingBarLocation = { lat: parseFloat(r.lat), lng: parseFloat(r.lon), label: r.display_name.split(',')[0] };
        document.getElementById('barLocationSelected').textContent = `📍 selected: ${pendingBarLocation.label}`;
        resultsEl.innerHTML = '';
      });
    });
  }catch(e){
    resultsEl.innerHTML = `<div class="location-result-item">search failed — check your connection and try again</div>`;
  }
});

document.getElementById('saveBarBtn').addEventListener('click', ()=>{
  const name = document.getElementById('newBarName').value.trim();
  if(!name){ document.getElementById('newBarName').focus(); return; }
  const area = document.querySelector('#newBarArea .chip.active').dataset.value;
  const newId = bars.length ? Math.max(...bars.map(b=>b.id))+1 : 1;

  bars.push({ id:newId, name, area, location: pendingBarLocation });
  saveBars(bars);
  renderBarList();

  document.getElementById('newBarName').value = '';
  document.getElementById('barLocationQuery').value = '';
  document.getElementById('barLocationResults').innerHTML = '';
  document.getElementById('barLocationSelected').textContent = '';
  pendingBarLocation = null;
  document.querySelectorAll('#newBarArea .chip').forEach(c=>c.classList.remove('active'));
  document.querySelector('#newBarArea .chip').classList.add('active');
});

/* ==========================================================================
   MUSIC SETUP (playlist only)
   ========================================================================== */
function renderPlaylistCurrent(){
  let saved = null;
  try{ saved = localStorage.getItem(PLAYLIST_KEY); }catch(e){}
  const el = document.getElementById('playlistCurrent');
  const input = document.getElementById('playlistUrl');
  if(saved){
    el.textContent = `currently set: ${saved}`;
    input.value = saved;
  } else if(DEFAULT_PLAYLIST_URL){
    el.textContent = `currently set (in code, works everywhere): ${DEFAULT_PLAYLIST_URL}`;
    input.value = '';
  } else {
    el.textContent = 'nothing set yet.';
    input.value = '';
  }
}
document.getElementById('savePlaylistBtn').addEventListener('click', ()=>{
  const url = document.getElementById('playlistUrl').value.trim();
  if(!url) return;
  try{ localStorage.setItem(PLAYLIST_KEY, url); }catch(e){}
  renderPlaylistCurrent();
});
renderPlaylistCurrent();

/* ==========================================================================
   MAKE IT PERMANENT — export everything in this browser as ready-to-paste
   shared.js code, so it works the same on every device once committed.
   ========================================================================== */
document.getElementById('generateExportBtn').addEventListener('click', ()=>{
  let currentPlaylist = null;
  try{ currentPlaylist = localStorage.getItem(PLAYLIST_KEY); }catch(e){}
  const playlistToExport = currentPlaylist || DEFAULT_PLAYLIST_URL || "";

  const code = [
    '// ---- paste each block below over the matching const in shared.js ----',
    '',
    `const DEFAULT_ACTIVITIES = ${JSON.stringify(activities, null, 2)};`,
    '',
    `const DEFAULT_CAFES = ${JSON.stringify(cafes, null, 2)};`,
    '',
    `const DEFAULT_BARS = ${JSON.stringify(bars, null, 2)};`,
    '',
     `const DEFAULT_RESTAURANTS = ${JSON.stringify(restaurants, null, 2)};`,
    '',
    `const DEFAULT_PLAYLIST_URL = ${JSON.stringify(playlistToExport)};`
  ].join('\n');

  document.getElementById('exportOutput').value = code;
  document.getElementById('copyStatus').textContent = '';
});

document.getElementById('copyExportBtn').addEventListener('click', async ()=>{
  const textarea = document.getElementById('exportOutput');
  const status = document.getElementById('copyStatus');
  if(!textarea.value){ status.textContent = 'nothing to copy yet — click "generate code" first.'; return; }
  try{
    await navigator.clipboard.writeText(textarea.value);
    status.textContent = 'copied! now paste it into shared.js on GitHub.';
  }catch(e){
    textarea.select();
    status.textContent = 'couldn\'t auto-copy — the text is selected, so Ctrl+C / Cmd+C should work.';
  }
});

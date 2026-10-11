(function () {
  'use strict';

  /* ---------- Slot layout ---------- */

  function makeRange(prefix, count, labelPrefix) {
    var out = [];
    for (var i = 0; i < count; i++) {
      out.push({ name: prefix + i, label: labelPrefix + (i + 1) });
    }
    return out;
  }

  var GROUPS = [
    {
      target: 'preview-armor',
      slots: [
        { name: 'armor.head', label: 'Helmet' },
        { name: 'armor.chest', label: 'Chestplate' },
        { name: 'armor.legs', label: 'Leggings' },
        { name: 'armor.feet', label: 'Boots' }
      ]
    },
    { target: 'preview-offhand', slots: [{ name: 'weapon.offhand', label: 'Off Hand' }] },
    { target: 'preview-inv', slots: makeRange('inventory.', 27, 'Inventory Slot ') },
    { target: 'preview-hotbar', slots: makeRange('hotbar.', 9, 'Hotbar Slot ') }
  ];

  var SLOTS = [];
  GROUPS.forEach(function (group) {
    group.slots.forEach(function (def) { SLOTS.push(def); });
  });

  var ITEMS = window.MC_ITEMS || [];
  var MAX_LIST_ROWS = 400;

  var ITEM_NAMES = {};
  var ITEM_STACK = {};
  for (var t = 0; t < ITEMS.length; t++) {
    ITEM_NAMES[ITEMS[t][0]] = ITEMS[t][1];
    ITEM_STACK[ITEMS[t][0]] = ITEMS[t][2] || 64;
  }

  var ENCHANT_NAMES = {
    sharpness: 'Sharpness', smite: 'Smite', 'bane_of_arthropods': 'Bane of Arthropods',
    knockback: 'Knockback', fire_aspect: 'Fire Aspect', looting: 'Looting',
    'sweeping_edge': 'Sweeping Edge', efficiency: 'Efficiency', 'silk_touch': 'Silk Touch',
    unbreaking: 'Unbreaking', fortune: 'Fortune', protection: 'Protection',
    'blast_protection': 'Blast Protection', 'fire_protection': 'Fire Protection',
    'projectile_protection': 'Projectile Protection', 'feather_falling': 'Feather Falling',
    respiration: 'Respiration', aqua_affinity: 'Aqua Affinity', thorns: 'Thorns',
    'depth_strider': 'Depth Strider', frost_walker: 'Frost Walker', soul_speed: 'Soul Speed',
    'swift_sneak': 'Swift Sneak', mending: 'Mending', multishot: 'Multishot',
    'quick_charge': 'Quick Charge', piercing: 'Piercing', infinity: 'Infinity',
    flame: 'Flame', punch: 'Punch', power: 'Power', 'luck_of_the_sea': 'Luck of the Sea',
    lure: 'Lure', channeling: 'Channeling', riptide: 'Riptide', impaling: 'Impaling',
    loyalty: 'Loyalty', breach: 'Breach', density: 'Density', 'wind_burst': 'Wind Burst',
    'binding_curse': 'Curse of Binding', 'vanishing_curse': 'Curse of Vanishing'
  };

  /* Enchantments with their vanilla max level (also used as the default). */
  var ENCHANTS = [
    ['protection', 4], ['fire_protection', 4], ['feather_falling', 4], ['blast_protection', 4],
    ['projectile_protection', 4], ['respiration', 3], ['aqua_affinity', 1], ['thorns', 3],
    ['depth_strider', 3], ['frost_walker', 2], ['binding_curse', 1], ['soul_speed', 3],
    ['swift_sneak', 3], ['sharpness', 5], ['smite', 5], ['bane_of_arthropods', 5],
    ['knockback', 2], ['fire_aspect', 2], ['looting', 3], ['sweeping_edge', 3],
    ['efficiency', 5], ['silk_touch', 1], ['unbreaking', 3], ['fortune', 3], ['power', 5],
    ['punch', 2], ['flame', 1], ['infinity', 1], ['luck_of_the_sea', 3], ['lure', 3],
    ['loyalty', 3], ['impaling', 5], ['riptide', 3], ['channeling', 1], ['multishot', 1],
    ['quick_charge', 3], ['piercing', 4], ['mending', 1], ['vanishing_curse', 1],
    ['density', 5], ['breach', 4], ['wind_burst', 3]
  ];

  var ENCHANT_MAX = {};
  ENCHANTS.forEach(function (e) { ENCHANT_MAX['minecraft:' + e[0]] = e[1]; });

  var ATTRIBUTES = [
    ['attack_damage', 'Attack Damage'], ['attack_speed', 'Attack Speed'], ['armor', 'Armor'],
    ['armor_toughness', 'Armor Toughness'], ['knockback_resistance', 'Knockback Resistance'],
    ['movement_speed', 'Movement Speed'], ['max_health', 'Max Health'],
    ['max_absorption', 'Max Absorption'], ['scale', 'Scale'],
    ['block_interaction_range', 'Block Interaction Range'],
    ['entity_interaction_range', 'Entity Interaction Range'], ['follow_range', 'Follow Range'],
    ['jump_strength', 'Jump Strength'], ['safe_fall_distance', 'Safe Fall Distance'],
    ['fall_damage_multiplier', 'Fall Damage Multiplier'], ['step_height', 'Step Height'],
    ['gravity', 'Gravity'], ['burning_time', 'Burning Time'],
    ['explosion_knockback_resistance', 'Explosion Knockback Resistance'],
    ['mining_efficiency', 'Mining Efficiency'], ['block_break_speed', 'Block Break Speed'],
    ['sneaking_speed', 'Sneaking Speed'], ['water_movement_efficiency', 'Water Movement Efficiency'],
    ['oxygen_bonus', 'Oxygen Bonus'], ['luck', 'Luck'], ['flying_speed', 'Flying Speed'],
    ['movement_efficiency', 'Movement Efficiency'], ['sweeping_damage_ratio', 'Sweeping Damage Ratio']
  ];

  var OPERATIONS = [
    ['add_value', 'Add Value'], ['add_multiplied_base', 'Add Multiplied Base'],
    ['add_multiplied_total', 'Add Multiplied Total']
  ];

  var MOD_SLOTS = ['any', 'hand', 'mainhand', 'offhand', 'head', 'chest', 'legs', 'feet', 'armor', 'body'];

  var POTIONS = [
    'water', 'mundane', 'thick', 'awkward', 'night_vision', 'long_night_vision', 'invisibility',
    'long_invisibility', 'leaping', 'long_leaping', 'strong_leaping', 'fire_resistance',
    'long_fire_resistance', 'swiftness', 'long_swiftness', 'strong_swiftness', 'slowness',
    'long_slowness', 'strong_slowness', 'turtle_master', 'long_turtle_master',
    'strong_turtle_master', 'water_breathing', 'long_water_breathing', 'healing', 'strong_healing',
    'harming', 'strong_harming', 'poison', 'long_poison', 'strong_poison', 'regeneration',
    'long_regeneration', 'strong_regeneration', 'strength', 'long_strength', 'strong_strength',
    'weakness', 'long_weakness', 'luck', 'slow_falling', 'long_slow_falling', 'strong_slow_falling',
    'oozing', 'infested', 'weaving', 'wind_charged'
  ];

  var COMPONENT_TYPES = [
    { id: 'enchantments', label: 'Enchantments' },
    { id: 'stored_enchantments', label: 'Stored Enchantments (Enchanted Book)' },
    { id: 'unbreakable', label: 'Unbreakable' },
    { id: 'lore', label: 'Lore' },
    { id: 'attribute_modifiers', label: 'Attribute Modifiers' },
    { id: 'dyed_color', label: 'Dyed Color (Leather Armor)' },
    { id: 'food', label: 'Food' },
    { id: 'potion_contents', label: 'Potion Contents' },
    { id: 'damage', label: 'Item Damage' },
    { id: 'enchantment_glint_override', label: 'Glint Override' },
    { id: 'custom_data', label: 'Custom Data (SNBT)' }
  ];

  /* Maxed-enchantment presets. Conflicting enchantments: the preferred one
     is chosen (fortune over silk touch, silk touch over fortune, density over
     breach, mending over infinity, piercing over multishot). */
  var PRESETS = [
    { id: 'sword', label: 'Sword', enchants: ['sharpness', 'sweeping_edge', 'looting', 'fire_aspect', 'knockback', 'unbreaking', 'mending'] },
    { id: 'axe', label: 'Axe', enchants: ['sharpness', 'efficiency', 'fortune', 'unbreaking', 'mending'] },
    { id: 'pickaxe', label: 'Pickaxe', enchants: ['efficiency', 'silk_touch', 'unbreaking', 'mending'] },
    { id: 'mace', label: 'Mace', enchants: ['density', 'wind_burst', 'fire_aspect', 'unbreaking', 'mending'] },
    { id: 'bow', label: 'Bow', enchants: ['power', 'punch', 'flame', 'unbreaking', 'mending'] },
    { id: 'crossbow', label: 'Crossbow', enchants: ['piercing', 'quick_charge', 'unbreaking', 'mending'] },
    { id: 'helmet', label: 'Helmet', enchants: ['protection', 'respiration', 'aqua_affinity', 'thorns', 'unbreaking', 'mending'] },
    { id: 'chestplate', label: 'Chestplate', enchants: ['protection', 'thorns', 'unbreaking', 'mending'] },
    { id: 'leggings', label: 'Leggings', enchants: ['protection', 'swift_sneak', 'thorns', 'unbreaking', 'mending'] },
    { id: 'boots', label: 'Boots', enchants: ['protection', 'feather_falling', 'depth_strider', 'soul_speed', 'thorns', 'unbreaking', 'mending'] }
  ];

  function presetById(id) {
    for (var i = 0; i < PRESETS.length; i++) {
      if (PRESETS[i].id === id) return PRESETS[i];
    }
    return null;
  }

  function detectPreset(rawId) {
    var id = stripNamespace(String(rawId || '').trim()).toLowerCase();
    if (!id) return '';
    if (id === 'crossbow') return 'crossbow';
    if (id === 'bow') return 'bow';
    if (id === 'mace') return 'mace';
    if (id === 'turtle_helmet' || /_helmet$/.test(id)) return 'helmet';
    if (/_chestplate$/.test(id)) return 'chestplate';
    if (/_leggings$/.test(id)) return 'leggings';
    if (/_boots$/.test(id)) return 'boots';
    if (/_sword$/.test(id)) return 'sword';
    if (/_axe$/.test(id)) return 'axe';
    if (/_pickaxe$/.test(id)) return 'pickaxe';
    return '';
  }

  function componentLabel(type) {
    for (var i = 0; i < COMPONENT_TYPES.length; i++) {
      if (COMPONENT_TYPES[i].id === type) return COMPONENT_TYPES[i].label;
    }
    return type;
  }

  function newComponent(type) {
    switch (type) {
      case 'enchantments':
      case 'stored_enchantments':
        return { type: type, entries: [{ id: 'minecraft:sharpness', level: 5 }] };
      case 'unbreakable':
        return { type: type, show: true };
      case 'lore':
        return { type: type, lines: [''] };
      case 'attribute_modifiers':
        return { type: type, modifiers: [{ id: 'minecraft:attack_damage', amount: '2', operation: 'add_value', slot: 'any' }] };
      case 'dyed_color':
        return { type: type, rgb: '#a06540' };
      case 'food':
        return { type: type, nutrition: '4', saturation: '0.6', alwaysEat: false };
      case 'potion_contents':
        return { type: type, potion: 'minecraft:healing' };
      case 'damage':
        return { type: type, value: '0' };
      case 'enchantment_glint_override':
        return { type: type, value: true };
      case 'custom_data':
        return { type: type, snbt: '{kit_item:true}' };
    }
    return { type: type };
  }

  /* ---------- Elements ---------- */

  var output = document.getElementById('output');
  var statusEl = document.getElementById('status');
  var previewStatus = document.getElementById('preview-status');
  var selectedLabel = document.getElementById('selected-slot-label');
  var tooltip = document.getElementById('tooltip');
  var previewWrap = document.getElementById('preview-wrap');

  var inId = document.getElementById('in-id');
  var inCount = document.getElementById('in-count');
  var inName = document.getElementById('in-name');

  var compAdd = document.getElementById('comp-add');
  var compAddBtn = document.getElementById('comp-add-btn');
  var compList = document.getElementById('comp-list');
  var compEmpty = document.getElementById('comp-empty');

  var enchPreset = document.getElementById('ench-preset');
  var enchPresetBtn = document.getElementById('ench-preset-btn');
  var presetHint = document.getElementById('preset-hint');

  var pickerToggle = document.getElementById('picker-toggle');
  var pickerPanel = document.getElementById('picker-panel');
  var pickerSearch = document.getElementById('picker-search');
  var pickerList = document.getElementById('picker-list');
  var pickerNote = document.getElementById('picker-note');

  var btnGenerate = document.getElementById('btn-generate');
  var btnCopy = document.getElementById('btn-copy');
  var btnClearSlot = document.getElementById('btn-clear-slot');
  var btnClearAll = document.getElementById('btn-clear-all');

  var editorControls = [inId, inCount, inName, enchPreset, enchPresetBtn, compAdd, compAddBtn];

  /* Output format: 'plain' = one /item replace line per slot,
     'one' = a single /summon falling_block "one command" (Command Block Assembler style). */
  var outputMode = 'plain';
  var modePlain = document.getElementById('mode-plain');
  var modeOne = document.getElementById('mode-one');

  /* ---------- Kit data ---------- */

  var kit = {};
  var selected = null;
  var slotNodes = {};
  var slotDefs = {};

  function emptyData() {
    return { id: '', count: '1', name: '', components: [] };
  }

  function slotData(name) {
    if (!kit[name]) kit[name] = emptyData();
    return kit[name];
  }

  /* ---------- Small helpers ---------- */

  function make(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined && text !== null) el.textContent = text;
    return el;
  }

  function clampInt(raw, min, max, fallback) {
    var n = parseInt(raw, 10);
    if (!isFinite(n)) n = fallback;
    if (n < min) n = min;
    if (n > max) n = max;
    return n;
  }

  function numText(raw) {
    var n = parseFloat(raw);
    if (!isFinite(n)) n = 0;
    return String(n);
  }

  function escapeDouble(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function hexToInt(hex) {
    var n = parseInt(String(hex || '').replace('#', ''), 16);
    return isFinite(n) ? n : 0;
  }

  function normalizeSnbt(raw) {
    var s = String(raw || '').trim();
    if (!s) return '';
    if (s.charAt(0) !== '{' && s.charAt(0) !== '[') s = '{' + s + '}';
    return s;
  }

  function enchantMax(id) {
    return ENCHANT_MAX[id] || 1;
  }

  function stripNamespace(id) {
    var i = id.lastIndexOf(':');
    return i === -1 ? id : id.slice(i + 1);
  }

  function maxStack(idText) {
    var key = stripNamespace(String(idText || '').trim());
    return ITEM_STACK[key] || 64;
  }

  function safeCount(raw, max) {
    var n = parseInt(raw, 10);
    if (!isFinite(n) || n < 1) n = 1;
    if (max && n > max) n = max;
    return n;
  }

  /* ---------- Component serialization ---------- */

  function serializeComponent(c) {
    switch (c.type) {
      case 'enchantments':
      case 'stored_enchantments': {
        var levels = c.entries
          .filter(function (e) { return e.id; })
          .map(function (e) { return "'" + e.id + "':" + clampInt(e.level, 1, 255, 1); });
        // 1.21.5+ flattening: enchantments is a direct map, no `levels` wrapper.
        return levels.length ? c.type + '={' + levels.join(',') + '}' : '';
      }
      case 'unbreakable':
        // 1.21.5+ moved show_in_tooltip out of unbreakable into tooltip_display.
        return c.show
          ? 'unbreakable={}'
          : 'unbreakable={},tooltip_display={hidden_components:["minecraft:unbreakable"]}';
      case 'lore': {
        var lines = c.lines
          .map(function (l) { return String(l).trim(); })
          .filter(function (l) { return l.length; })
          .map(function (l) { return '{text:"' + escapeDouble(l) + '"}'; });
        return lines.length ? 'lore=[' + lines.join(',') + ']' : '';
      }
      case 'attribute_modifiers': {
        var mods = c.modifiers.map(function (m, i) {
          var s = '{type:"' + m.id + '",amount:' + numText(m.amount) +
            ',operation:"' + m.operation + '",id:"kit:mod_' + i + '"';
          if (m.slot && m.slot !== 'any') s += ',slot:"' + m.slot + '"';
          return s + '}';
        });
        return mods.length ? 'attribute_modifiers=[' + mods.join(',') + ']' : '';
      }
      case 'dyed_color':
        // 1.21.5+ flattening: dyed_color is a bare RGB int, not {rgb:...}.
        return 'dyed_color=' + hexToInt(c.rgb);
      case 'food':
        return 'food={nutrition:' + clampInt(c.nutrition, 0, 20, 0) +
          ',saturation:' + numText(c.saturation) +
          (c.alwaysEat ? ',can_always_eat:true' : '') + '}';
      case 'potion_contents':
        return 'potion_contents={potion:"' + c.potion + '"}';
      case 'damage':
        return 'damage=' + clampInt(c.value, 0, 2147483647, 0);
      case 'enchantment_glint_override':
        return 'enchantment_glint_override=' + (c.value ? 'true' : 'false');
      case 'custom_data': {
        var snbt = normalizeSnbt(c.snbt);
        return snbt ? 'custom_data=' + snbt : '';
      }
    }
    return '';
  }

  function componentParts(data) {
    var parts = [];
    data.components.forEach(function (c) {
      var s = serializeComponent(c);
      if (s) parts.push(s);
    });
    return parts;
  }

  /* ---------- Component editor UI ---------- */

  function numberField(value, min, max, step) {
    var input = make('input', 'comp-field comp-num');
    input.type = 'number';
    input.min = String(min);
    if (max !== undefined) input.max = String(max);
    if (step !== undefined) input.step = String(step);
    input.value = String(value);
    return input;
  }

  function checkField(checked, labelText) {
    var wrap = make('label', 'comp-check');
    var input = make('input');
    input.type = 'checkbox';
    input.checked = !!checked;
    wrap.appendChild(input);
    wrap.appendChild(make('span', null, labelText));
    return { wrap: wrap, input: input };
  }

  function field(labelText, control) {
    var wrap = make('label', 'comp-field-label');
    wrap.appendChild(make('span', 'comp-field-text', labelText));
    wrap.appendChild(control);
    return wrap;
  }

  function selectField(options, value) {
    var sel = make('select', 'comp-field');
    options.forEach(function (opt) {
      var o = make('option', null, opt[1]);
      o.value = opt[0];
      sel.appendChild(o);
    });
    sel.value = value;
    return sel;
  }

  function rowAdd(label, onClick) {
    var btn = make('button', 'comp-row-add', label);
    btn.type = 'button';
    btn.addEventListener('click', onClick);
    return btn;
  }

  function rowRemove(onClick) {
    var btn = make('button', 'comp-row-remove', '\u2715');
    btn.type = 'button';
    btn.title = 'Remove';
    btn.setAttribute('aria-label', 'Remove');
    btn.addEventListener('click', onClick);
    return btn;
  }

  function removeComponent(component) {
    var data = slotData(selected);
    var i = data.components.indexOf(component);
    if (i !== -1) data.components.splice(i, 1);
    commit(true);
  }

  function commit(rerenderList) {
    if (!selected) return;
    if (rerenderList) renderComponentList();
    renderSlot(selected);
    updatePreviewStatus();
    writeOutput();
  }

  function buildComponentBody(c) {
    var wrap = make('div', 'comp-rows');
    var i;

    if (c.type === 'enchantments' || c.type === 'stored_enchantments') {
      var enchantOptions = ENCHANTS.map(function (e) {
        return ['minecraft:' + e[0], ENCHANT_NAMES[e[0]] || e[0]];
      });
      c.entries.forEach(function (entry, idx) {
        var row = make('div', 'comp-row');
        var sel = selectField(enchantOptions, entry.id);
        sel.classList.add('comp-grow');
        sel.addEventListener('change', function () {
          entry.id = sel.value;
          entry.level = enchantMax(entry.id);
          commit(true);
        });
        var lvl = numberField(entry.level, 1, 255);
        lvl.title = 'Level';
        lvl.setAttribute('aria-label', 'Level');
        lvl.addEventListener('input', function () { entry.level = lvl.value; commit(false); });
        lvl.addEventListener('change', function () {
          var n = clampInt(lvl.value, 1, 255, 1);
          entry.level = String(n);
          lvl.value = String(n);
          commit(false);
        });
        row.appendChild(sel);
        row.appendChild(lvl);
        row.appendChild(rowRemove(function () {
          c.entries.splice(idx, 1);
          if (!c.entries.length) removeComponent(c);
          else commit(true);
        }));
        wrap.appendChild(row);
      });
      wrap.appendChild(rowAdd('+ Add enchantment', function () {
        c.entries.push({ id: 'minecraft:sharpness', level: 5 });
        commit(true);
      }));
      return wrap;
    }

    if (c.type === 'unbreakable') {
      var hide = checkField(!c.show, 'Hide "Unbreakable" from the tooltip');
      hide.input.addEventListener('change', function () {
        c.show = !hide.input.checked;
        commit(false);
      });
      wrap.appendChild(hide.wrap);
      return wrap;
    }

    if (c.type === 'lore') {
      var ta = make('textarea', 'comp-field comp-textarea');
      ta.rows = 3;
      ta.placeholder = 'One line of lore per row';
      ta.value = c.lines.join('\n');
      ta.addEventListener('input', function () {
        c.lines = ta.value.split('\n');
        commit(false);
      });
      wrap.appendChild(ta);
      return wrap;
    }

    if (c.type === 'attribute_modifiers') {
      var attrOptions = ATTRIBUTES.map(function (a) { return ['minecraft:' + a[0], a[1]]; });
      c.modifiers.forEach(function (m, idx) {
        var sub = make('div', 'comp-sub');
        var head = make('div', 'comp-sub-head');
        head.appendChild(make('span', 'comp-sub-title', 'Modifier ' + (idx + 1)));
        head.appendChild(rowRemove(function () {
          c.modifiers.splice(idx, 1);
          if (!c.modifiers.length) removeComponent(c);
          else commit(true);
        }));
        sub.appendChild(head);

        var attr = selectField(attrOptions, m.id);
        attr.addEventListener('change', function () { m.id = attr.value; commit(false); });
        sub.appendChild(field('Attribute', attr));

        var amount = numberField(m.amount, -1024, 1024, 0.5);
        amount.addEventListener('input', function () { m.amount = amount.value; commit(false); });
        sub.appendChild(field('Amount', amount));

        var op = selectField(OPERATIONS, m.operation);
        op.addEventListener('change', function () { m.operation = op.value; commit(false); });
        sub.appendChild(field('Operation', op));

        var slot = selectField(MOD_SLOTS.map(function (s) { return [s, s]; }), m.slot);
        slot.addEventListener('change', function () { m.slot = slot.value; commit(false); });
        sub.appendChild(field('Applies To', slot));

        wrap.appendChild(sub);
      });
      wrap.appendChild(rowAdd('+ Add modifier', function () {
        c.modifiers.push({ id: 'minecraft:attack_damage', amount: '2', operation: 'add_value', slot: 'any' });
        commit(true);
      }));
      return wrap;
    }

    if (c.type === 'dyed_color') {
      var row2 = make('div', 'comp-row');
      var color = make('input', 'comp-color');
      color.type = 'color';
      color.value = c.rgb;
      color.setAttribute('aria-label', 'Dyed color');
      var hex = make('span', 'comp-hex', 'rgb ' + hexToInt(c.rgb));
      color.addEventListener('input', function () {
        c.rgb = color.value;
        hex.textContent = 'rgb ' + hexToInt(c.rgb);
        commit(false);
      });
      row2.appendChild(color);
      row2.appendChild(hex);
      wrap.appendChild(row2);
      return wrap;
    }

    if (c.type === 'food') {
      var nutrition = numberField(c.nutrition, 0, 20);
      nutrition.addEventListener('input', function () { c.nutrition = nutrition.value; commit(false); });
      nutrition.addEventListener('change', function () {
        var n = clampInt(nutrition.value, 0, 20, 0);
        c.nutrition = String(n);
        nutrition.value = String(n);
        commit(false);
      });
      wrap.appendChild(field('Nutrition (half haunches)', nutrition));

      var saturation = numberField(c.saturation, 0, 20, 0.1);
      saturation.addEventListener('input', function () { c.saturation = saturation.value; commit(false); });
      wrap.appendChild(field('Saturation', saturation));

      var alwaysEat = checkField(c.alwaysEat, 'Can always eat (even when full)');
      alwaysEat.input.addEventListener('change', function () {
        c.alwaysEat = alwaysEat.input.checked;
        commit(false);
      });
      wrap.appendChild(alwaysEat.wrap);
      return wrap;
    }

    if (c.type === 'potion_contents') {
      var potionOptions = POTIONS.map(function (p) {
        var label = p.split('_').map(function (word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
        return ['minecraft:' + p, label];
      });
      var potion = selectField(potionOptions, c.potion);
      potion.addEventListener('change', function () { c.potion = potion.value; commit(false); });
      wrap.appendChild(field('Potion', potion));
      return wrap;
    }

    if (c.type === 'damage') {
      var damage = numberField(c.value, 0, 2147483647);
      damage.addEventListener('input', function () { c.value = damage.value; commit(false); });
      damage.addEventListener('change', function () {
        var n = clampInt(damage.value, 0, 2147483647, 0);
        c.value = String(n);
        damage.value = String(n);
        commit(false);
      });
      wrap.appendChild(field('Damage taken', damage));
      return wrap;
    }

    if (c.type === 'enchantment_glint_override') {
      var glint = selectField([['true', 'Show glint'], ['false', 'Hide glint']], c.value ? 'true' : 'false');
      glint.addEventListener('change', function () { c.value = glint.value === 'true'; commit(false); });
      wrap.appendChild(field('Glint', glint));
      return wrap;
    }

    if (c.type === 'custom_data') {
      var ta2 = make('textarea', 'comp-field comp-textarea');
      ta2.rows = 2;
      ta2.placeholder = '{kit_item:true, tier:"gold"}';
      ta2.value = c.snbt;
      ta2.addEventListener('input', function () { c.snbt = ta2.value; commit(false); });
      wrap.appendChild(ta2);
      return wrap;
    }

    return wrap;
  }

  function buildComponentCard(c, index) {
    var card = make('div', 'comp-card');
    card.dataset.type = c.type;

    var head = make('div', 'comp-card-head');
    head.appendChild(make('span', 'comp-name', componentLabel(c.type)));
    var rm = make('button', 'comp-remove', '\u2715');
    rm.type = 'button';
    rm.title = 'Remove ' + componentLabel(c.type);
    rm.setAttribute('aria-label', 'Remove ' + componentLabel(c.type));
    rm.addEventListener('click', function () {
      var data = slotData(selected);
      data.components.splice(index, 1);
      commit(true);
    });
    head.appendChild(rm);
    card.appendChild(head);
    card.appendChild(buildComponentBody(c));
    return card;
  }

  function refreshComponentOptions() {
    var used = {};
    if (selected) {
      slotData(selected).components.forEach(function (c) { used[c.type] = true; });
    }

    compAdd.textContent = '';
    var placeholder = make('option', null, 'Select a component...');
    placeholder.value = '';
    compAdd.appendChild(placeholder);

    COMPONENT_TYPES.forEach(function (type) {
      if (used[type.id]) return;
      var opt = make('option', null, type.label);
      opt.value = type.id;
      compAdd.appendChild(opt);
    });
    compAdd.value = '';
  }

  function renderComponentList() {
    compList.textContent = '';
    var comps = selected ? slotData(selected).components : [];
    comps.forEach(function (c, i) {
      compList.appendChild(buildComponentCard(c, i));
    });
    compEmpty.hidden = comps.length > 0;
    refreshComponentOptions();
  }

  function addComponent() {
    if (!selected) return;
    var type = compAdd.value;
    if (!type) {
      statusEl.textContent = 'Pick a component from the dropdown first.';
      return;
    }
    slotData(selected).components.push(newComponent(type));
    commit(true);
    statusEl.textContent = componentLabel(type) + ' added to ' + slotDefs[selected].label + '.';
  }

  /* ---------- Enchantment presets ---------- */

  function buildPresetOptions() {
    PRESETS.forEach(function (preset) {
      var opt = make('option', null, preset.label);
      opt.value = preset.id;
      enchPreset.appendChild(opt);
    });
  }

  function updatePresetHint() {
    var preset = presetById(enchPreset.value);
    if (!preset) {
      presetHint.textContent = '';
      return;
    }
    presetHint.textContent = preset.enchants.map(function (id) {
      return enchantLabel(['minecraft:' + id, enchantMax('minecraft:' + id)]);
    }).join(' \u00b7 ');
  }

  function applyPreset() {
    if (!selected) return;
    var preset = presetById(enchPreset.value);
    if (!preset) {
      statusEl.textContent = 'Pick an enchantment preset from the dropdown first.';
      return;
    }

    var entries = preset.enchants.map(function (id) {
      return { id: 'minecraft:' + id, level: enchantMax('minecraft:' + id) };
    });

    var data = slotData(selected);
    var existing = null;
    data.components.forEach(function (c) {
      if (c.type === 'enchantments') existing = c;
    });
    if (existing) existing.entries = entries;
    else data.components.push({ type: 'enchantments', entries: entries });

    commit(true);
    statusEl.textContent = preset.label + ' preset applied (' + entries.length + ' enchantments).';
  }

  /* ---------- Preview rendering ---------- */

  function takeBraced(s, start) {
    var d = 0;
    for (var i = start; i < s.length; i++) {
      if (s[i] === '{') d++;
      else if (s[i] === '}') {
        d--;
        if (d === 0) return s.slice(start + 1, i);
      }
    }
    return s.slice(start + 1);
  }

  function takeBracket(s, start) {
    var d = 0;
    for (var i = start; i < s.length; i++) {
      if (s[i] === '[') d++;
      else if (s[i] === ']') {
        d--;
        if (d === 0) return s.slice(start + 1, i);
      }
    }
    return s.slice(start + 1);
  }

  function parseEnchants(raw) {
    if (raw.indexOf('enchantments') === -1) return [];
    var open = raw.indexOf('{', raw.indexOf('enchantments'));
    if (open === -1) return [];
    var content = takeBraced(raw, open);
    var pairs = [];
    var re = /(?:['\"])?([A-Za-z0-9_.:\-]+)(?:['\"])?\s*:\s*(\d+)/g;
    var m;
    while ((m = re.exec(content)) !== null) {
      var eid = m[1].replace(/^minecraft:/, '').replace(/^'+|'+$/g, '');
      pairs.push([eid, parseInt(m[2], 10)]);
    }
    return pairs;
  }

  function parseLore(raw) {
    var m = /lore\s*=\s*\[/.exec(raw);
    if (!m) return [];
    var inner = takeBracket(raw, raw.indexOf('[', m.index));
    var lines = [];
    var re = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g;
    var mm;
    while ((mm = re.exec(inner)) !== null) {
      var v = mm[1] !== undefined ? mm[1] : mm[2];
      if (v.length > 1 && v.charAt(0) === '"' && v.charAt(v.length - 1) === '"') {
        v = v.slice(1, -1);
      }
      lines.push(v.replace(/\\"/g, '"'));
    }
    return lines;
  }

  function roman(n) {
    var table = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    var out = '';
    for (var i = 0; i < table.length; i++) {
      while (n >= table[i][0]) {
        out += table[i][1];
        n -= table[i][0];
      }
    }
    return out;
  }

  function enchantTitle(key) {
    return key.replace(/_/g, ' ').replace(/^\w/, function (c) { return c.toUpperCase(); });
  }

  function enchantLabel(ench) {
    var key = stripNamespace(ench[0]);
    var label = ENCHANT_NAMES[key] || enchantTitle(key);
    return label + ' ' + roman(ench[1]);
  }

  var DATASET_KEYS = ['display', 'custom', 'count', 'enchant', 'lore', 'unbreak', 'raw'];

  function renderSlot(name) {
    var node = slotNodes[name];
    if (!node) return;
    var data = slotData(name);

    DATASET_KEYS.forEach(function (key) { delete node.dataset[key]; });
    node.textContent = '';

    var idText = data.id.trim();
    if (!idText) {
      var spot = make('span', 'preview-empty', '\u00a0');
      node.appendChild(spot);
      refreshTooltip(node);
      return;
    }

    var raw = componentParts(data).join(',');
    var iconName = stripNamespace(idText);
    var count = safeCount(data.count, maxStack(idText));
    var enchants = parseEnchants(raw);
    var lore = parseLore(raw);

    node.dataset.display = ITEM_NAMES[iconName] || enchantTitle(iconName);
    node.dataset.count = String(count);
    node.dataset.enchant = JSON.stringify(enchants.map(enchantLabel));
    node.dataset.lore = JSON.stringify(lore);
    node.dataset.unbreak = /unbreakable\s*=\s*\{/.test(raw) ? '1' : '';
    node.dataset.raw = raw;
    if (data.name.trim()) node.dataset.custom = data.name.trim();

    var img = make('img', 'preview-icon');
    img.alt = node.dataset.display;
    img.draggable = false;
    var triedBlock = false;
    img.addEventListener('error', function () {
      if (!triedBlock) {
        triedBlock = true;
        img.src = 'icons/block/' + iconName + '.png';
      } else {
        img.style.display = 'none';
        node.appendChild(make('span', 'preview-empty', '?'));
      }
    });
    img.src = 'icons/item/' + iconName + '.png';
    node.appendChild(img);

    if (count > 1) {
      node.appendChild(make('span', 'preview-count', String(count)));
    }

    refreshTooltip(node);
  }

  function renderAll() {
    SLOTS.forEach(function (def) { renderSlot(def.name); });
    updatePreviewStatus();
  }

  function buildPreview() {
    GROUPS.forEach(function (group) {
      var container = document.getElementById(group.target);
      group.slots.forEach(function (def) {
        var node = make('div', 'preview-slot');
        node.dataset.slot = def.name;
        node.setAttribute('role', 'button');
        node.setAttribute('tabindex', '0');
        node.setAttribute('aria-label', def.label + ' (' + def.name + ')');
        node.title = def.label;

        node.addEventListener('click', function () { selectSlot(def.name); });
        node.addEventListener('keydown', function (e) { onSlotKeydown(e, def.name); });

        slotNodes[def.name] = node;
        slotDefs[def.name] = def;
        container.appendChild(node);
        renderSlot(def.name);
      });
    });
  }

  function filledCount() {
    var filled = 0;
    SLOTS.forEach(function (def) {
      if (slotData(def.name).id.trim()) filled++;
    });
    return filled;
  }

  function updatePreviewStatus() {
    if (previewStatus) {
      previewStatus.textContent = filledCount() + ' of ' + SLOTS.length +
        ' slots filled \u00b7 hover to inspect \u00b7 click to edit';
    }
  }

  /* ---------- Selection / editor ---------- */

  function setEditorEnabled(enabled) {
    editorControls.forEach(function (el) { el.disabled = !enabled; });
    pickerToggle.disabled = !enabled;
    btnClearSlot.disabled = !enabled;
    if (!enabled) closePicker();
  }

  function fillEditor() {
    var data = selected ? slotData(selected) : emptyData();
    inId.value = data.id;
    inName.value = data.name;
    inCount.max = String(maxStack(data.id));
    inCount.value = data.count;
    enchPreset.value = detectPreset(data.id) || '';
    updatePresetHint();
    renderComponentList();
  }

  function selectSlot(name) {
    selected = name;
    SLOTS.forEach(function (def) {
      slotNodes[def.name].classList.toggle('selected', def.name === name);
    });

    var def = slotDefs[name];
    selectedLabel.textContent = def.label + '  \u00b7  ' + name;
    setEditorEnabled(true);
    fillEditor();
    statusEl.textContent = 'Editing ' + def.label + '. Changes apply immediately.';

    inId.focus();
    inId.select();
  }

  function applyChange(fieldName) {
    if (!selected) return;
    var data = slotData(selected);

    if (fieldName === 'id') {
      data.id = inId.value;
      var max = maxStack(inId.value);
      inCount.max = String(max);
      var count = safeCount(inCount.value, max);
      inCount.value = String(count);
      data.count = String(count);
      enchPreset.value = detectPreset(data.id) || '';
      updatePresetHint();
    } else if (fieldName === 'count') {
      data.count = inCount.value;
    } else if (fieldName === 'name') {
      data.name = inName.value;
    }

    renderSlot(selected);
    updatePreviewStatus();
    writeOutput();
  }

  function onSlotKeydown(e, name) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      selectSlot(name);
      return;
    }

    var dirs = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -2, ArrowDown: 2 };
    if (!(e.key in dirs)) return;
    e.preventDefault();

    var node = slotNodes[name];
    var parent = node.parentNode;
    var kids = Array.prototype.slice.call(parent.children);
    var idx = kids.indexOf(node);
    var cols = parent.classList.contains('preview-inv') || parent.classList.contains('preview-hotbar') ? 9 : 1;
    var step = dirs[e.key];
    var next = step === -2 ? idx - cols : step === 2 ? idx + cols : (cols > 1 ? idx + step : -1);

    if (next >= 0 && next < kids.length) {
      kids[next].focus();
      selectSlot(kids[next].dataset.slot);
    }
  }

  /* ---------- Item picker ---------- */

  function buildItemRow(item) {
    var row = make('button', 'picker-item');
    row.type = 'button';
    row.dataset.id = item[0];
    row.appendChild(make('span', 'pi-display', item[1]));
    row.appendChild(make('span', 'pi-id', item[0]));
    return row;
  }

  function renderPicker() {
    var query = pickerSearch.value.trim().toLowerCase();
    var matches = [];
    for (var i = 0; i < ITEMS.length; i++) {
      var item = ITEMS[i];
      if (!query || item[0].indexOf(query) !== -1 || item[1].toLowerCase().indexOf(query) !== -1) {
        matches.push(item);
      }
    }

    pickerList.textContent = '';
    pickerNote.textContent = '';

    var slice = matches.slice(0, MAX_LIST_ROWS);
    var frag = document.createDocumentFragment();
    for (var j = 0; j < slice.length; j++) {
      frag.appendChild(buildItemRow(slice[j]));
    }
    pickerList.appendChild(frag);

    if (matches.length > slice.length) {
      pickerNote.textContent = matches.length - slice.length + ' more items - click to show all';
    }
  }

  function openPicker() {
    if (!selected) return;
    pickerPanel.hidden = false;
    pickerToggle.setAttribute('aria-expanded', 'true');
    renderPicker();
    pickerSearch.focus();
    pickerSearch.select();
  }

  function closePicker() {
    pickerPanel.hidden = true;
    if (pickerToggle) pickerToggle.setAttribute('aria-expanded', 'false');
  }

  function pickerIsOpen() {
    return !pickerPanel.hidden;
  }

  function selectPickerItem(id) {
    inId.value = id;
    closePicker();
    applyChange('id');
    inCount.focus();
    inCount.select();
  }

  function wirePicker() {
    pickerToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (pickerIsOpen()) closePicker();
      else openPicker();
    });

    pickerSearch.addEventListener('input', renderPicker);

    pickerSearch.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closePicker();
        inId.focus();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        var first = pickerList.querySelector('.picker-item');
        if (first) selectPickerItem(first.dataset.id);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        var firstRow = pickerList.querySelector('.picker-item');
        if (firstRow) firstRow.focus();
      }
    });

    pickerList.addEventListener('click', function (e) {
      var row = e.target.closest('.picker-item');
      if (row) selectPickerItem(row.dataset.id);
    });

    pickerList.addEventListener('keydown', function (e) {
      var row = e.target.closest('.picker-item');
      if (!row) return;
      var rows = Array.prototype.slice.call(pickerList.querySelectorAll('.picker-item'));
      var idx = rows.indexOf(row);
      if (e.key === 'ArrowDown' && rows[idx + 1]) {
        e.preventDefault();
        rows[idx + 1].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (rows[idx - 1]) rows[idx - 1].focus();
        else pickerSearch.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectPickerItem(row.dataset.id);
      } else if (e.key === 'Escape') {
        e.stopPropagation();
        closePicker();
        inId.focus();
      }
    });

    pickerNote.addEventListener('click', function () {
      pickerSearch.value = '';
      renderPicker();
    });
  }

  /* ---------- Command generation ---------- */

  function normalizeItemId(raw) {
    var id = String(raw || '').trim();
    if (!id.length) return '';
    if (id.indexOf('minecraft:minecraft:') === 0) {
      id = id.slice('minecraft:'.length);
    }
    if (id.indexOf(':') === -1) {
      id = 'minecraft:' + id;
    }
    return id;
  }

  function snbtString(value) {
    if (value.indexOf("'") === -1) {
      return "'" + value.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
    }
    return '"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  }

  function buildCommands() {
    var lines = [];
    SLOTS.forEach(function (def) {
      var data = slotData(def.name);
      var itemId = normalizeItemId(data.id);
      if (!itemId) return;

      var count = safeCount(data.count, maxStack(data.id));
      var name = data.name.trim();

      var components = [];
      if (name) components.push('item_name=' + snbtString(name));
      components = components.concat(componentParts(data));

      var bracket = components.length ? '[' + components.join(',') + ']' : '';
      lines.push('/item replace entity @p ' + def.name + ' with ' + itemId + bracket + ' ' + count);
    });
    return lines;
  }

  var CLEANUP_SETBLOCK = 'setblock ~ ~1 ~ command_block{Command:"fill ~ ~ ~ ~ ~-3 ~ air",auto:1}';
  var CLEANUP_KILL = 'execute align xyz run kill @e[type=command_block_minecart,dy=0]';

  /* Wrap the per-slot /item replace commands into a single /summon falling_block
     "one command" line. When it lands, a powered activator rail triggers a chain
     of command block minecarts, each running one command, then self-destructs. */
  function buildOneCommand(lines) {
    if (!lines.length) return '';
    var passengers = ['{id:falling_block,BlockState:{Name:activator_rail}}'];
    lines.forEach(function (cmd) {
      passengers.push('{id:command_block_minecart,Command:"' + escapeDouble(cmd) + '"}');
    });
    passengers.push('{id:command_block_minecart,Command:"' + escapeDouble(CLEANUP_SETBLOCK) + '"}');
    passengers.push('{id:command_block_minecart,Command:"' + escapeDouble(CLEANUP_KILL) + '"}');
    return '/summon falling_block ~ ~1 ~ {BlockState:{Name:redstone_block},Passengers:[' +
      passengers.join(',') + ']}';
  }

  function currentOutput() {
    var lines = buildCommands();
    return {
      text: outputMode === 'one' ? buildOneCommand(lines) : lines.join('\n'),
      count: lines.length
    };
  }

  function writeOutput() {
    output.value = currentOutput().text;
  }

  function generate() {
    var out = currentOutput();
    statusEl.textContent = out.count
      ? (outputMode === 'one'
          ? 'One command generated (falling-block assembler)'
          : out.count + ' command' + (out.count === 1 ? '' : 's') + ' generated')
      : 'No slots with an Item set yet.';
  }

  function switchOutputMode(mode) {
    if (mode !== 'plain' && mode !== 'one') return;
    outputMode = mode;
    if (modePlain) {
      modePlain.classList.toggle('mode-on', mode === 'plain');
      modePlain.setAttribute('aria-pressed', mode === 'plain' ? 'true' : 'false');
    }
    if (modeOne) {
      modeOne.classList.toggle('mode-on', mode === 'one');
      modeOne.setAttribute('aria-pressed', mode === 'one' ? 'true' : 'false');
    }
    generate();
  }

  /* ---------- Copy ---------- */

  function flash(btn, label) {
    btn.textContent = label;
    btn.classList.add('flash');
    setTimeout(function () {
      btn.textContent = 'Copy to Clipboard';
      btn.classList.remove('flash');
    }, 1600);
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    flash(btnCopy, ok ? 'Copied!' : 'Copy Failed');
  }

  function copyOutput() {
    var text = output.value;
    if (!text) {
      statusEl.textContent = 'Nothing to copy yet - set an Item first.';
      return;
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        function () { flash(btnCopy, 'Copied!'); },
        function () { fallbackCopy(text); }
      );
    } else {
      fallbackCopy(text);
    }
  }

  /* ---------- Clearing ---------- */

  function clearSlot() {
    if (!selected) return;
    kit[selected] = emptyData();
    fillEditor();
    renderSlot(selected);
    updatePreviewStatus();
    writeOutput();
    statusEl.textContent = slotDefs[selected].label + ' cleared.';
    inId.focus();
  }

  function clearAll() {
    SLOTS.forEach(function (def) { kit[def.name] = emptyData(); });
    fillEditor();
    renderAll();
    writeOutput();
    statusEl.textContent = 'All slots cleared.';
  }

  /* ---------- Tooltip ---------- */

  function tooltipLine(className, text) {
    return make('div', className, text);
  }

  function showTooltip(slot) {
    tooltip.textContent = '';

    var head = tooltipLine('tt-name', slot.dataset.custom || slot.dataset.display || '');
    if (slot.dataset.custom) head.classList.add('custom');
    tooltip.appendChild(head);

    if (slot.dataset.count && slot.dataset.count !== '1') {
      tooltip.appendChild(tooltipLine('tt-third', 'Count: ' + slot.dataset.count));
    }

    var enchants = JSON.parse(slot.dataset.enchant || '[]');
    for (var i = 0; i < enchants.length; i++) {
      tooltip.appendChild(tooltipLine('tt-ench', enchants[i]));
    }

    if (slot.dataset.unbreak === '1') {
      tooltip.appendChild(tooltipLine('tt-third', 'Unbreakable'));
    }

    var lore = JSON.parse(slot.dataset.lore || '[]');
    for (var j = 0; j < lore.length; j++) {
      tooltip.appendChild(tooltipLine('tt-lore', lore[j]));
    }

    if (slot.dataset.raw) {
      tooltip.appendChild(tooltipLine('tt-raw', 'components: ' + slot.dataset.raw));
    }

    tooltip.hidden = false;

    var rect = slot.getBoundingClientRect();
    var tw = tooltip.offsetWidth || 240;
    var th = tooltip.offsetHeight || 200;
    var vw = window.innerWidth || 1200;
    var vh = window.innerHeight || 800;

    var left = rect.right + 10;
    if (left + tw > vw) left = rect.left - tw - 10;
    if (left < 4) left = 4;

    var top = rect.top;
    if (top + th > vh) top = rect.bottom - th;
    if (top < 4) top = 4;

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }

  function hideTooltip() {
    tooltip.hidden = true;
  }

  var hovered = null;

  function refreshTooltip(node) {
    if (!tooltip.hidden && hovered === node) {
      if (node.dataset.display) showTooltip(node);
      else hideTooltip();
    }
  }

  function onPreviewOver(e) {
    var slot = e.target.closest ? e.target.closest('.preview-slot') : null;
    if (!slot) {
      hovered = null;
      hideTooltip();
      return;
    }
    hovered = slot;
    if (slot.dataset.display) showTooltip(slot);
    else hideTooltip();
  }

  function onPreviewOut(e) {
    var related = e.relatedTarget;
    if (related && related.closest && related.closest('.preview-slot')) return;
    hovered = null;
    hideTooltip();
  }

  /* ---------- Wiring ---------- */

  function onDocClick(e) {
    if (pickerIsOpen() && !pickerPanel.contains(e.target) && e.target !== pickerToggle) {
      closePicker();
    }
  }

  function onDocKeydown(e) {
    if (e.key === 'Escape' && pickerIsOpen()) {
      closePicker();
      if (selected) inId.focus();
    }
  }

  inId.addEventListener('input', function () { applyChange('id'); });
  inCount.addEventListener('input', function () { applyChange('count'); });
  inName.addEventListener('input', function () { applyChange('name'); });

  // normalize the count field once the user is done typing
  inCount.addEventListener('change', function () {
    if (!selected) return;
    var data = slotData(selected);
    var count = safeCount(inCount.value, maxStack(data.id));
    data.count = String(count);
    inCount.value = String(count);
    renderSlot(selected);
    writeOutput();
  });

  enchPresetBtn.addEventListener('click', applyPreset);
  enchPreset.addEventListener('change', function () {
    updatePresetHint();
    if (enchPreset.value) statusEl.textContent = 'Press Apply to give this slot the ' + presetById(enchPreset.value).label + ' enchantments.';
  });

  compAddBtn.addEventListener('click', addComponent);
  compAdd.addEventListener('change', function () {
    if (compAdd.value) statusEl.textContent = 'Press Add to insert ' + componentLabel(compAdd.value) + '.';
  });

  btnGenerate.addEventListener('click', generate);
  btnCopy.addEventListener('click', copyOutput);
  btnClearSlot.addEventListener('click', clearSlot);
  btnClearAll.addEventListener('click', clearAll);
  if (modePlain) modePlain.addEventListener('click', function () { switchOutputMode('plain'); });
  if (modeOne) modeOne.addEventListener('click', function () { switchOutputMode('one'); });

  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onDocKeydown);
  previewWrap.addEventListener('mouseover', onPreviewOver);
  previewWrap.addEventListener('mouseout', onPreviewOut);

  buildPreview();
  buildPresetOptions();
  wirePicker();
  setEditorEnabled(false);
  renderComponentList();
  updatePreviewStatus();
  writeOutput();
})();

const fs = require('fs');
const os = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});

const phu = () => {
  const capture = require('./phu.js');
  const $return = {};

  Object.keys(capture).forEach((key) => {
    if(key.length) {
      $return[key] = {};
      $return[key]['path'] = capture[key][4];
      $return[key]['viewBox'] = capture[key][0] + ' ' + capture[key][1] + ' ' + capture[key][2] + ' ' + capture[key][3];
      $return[key]['keywords'] = [];
    }
  });

  return $return;
};

const hue = () => {
  const capture = require('./hue.js');
  const $return = {};

  Object.keys(capture).forEach((key) => {
    if(key.length) {
      $return[key] = {};
      $return[key]['path'] = capture[key]['path'];
      $return[key]['viewBox'] = '0 0 24 24';
      $return[key]['keywords'] = capture[key]['keywords'];
    }
  });

  return $return;
};

const icon = os(Object.assign({},
  phu(),
  hue()
));

fs.writeFileSync('../sdc-icons.js', `// ${new Date()}

const icon = ${JSON.stringify(icon, null, 2)};

async function getIcon(name) {
  if(name in icon) {
    return {
      "path": icon[name]['path'],
      "viewBox": icon[name]['viewBox']
    };
  }

  console.error(\`Icon "\${name}" not available\`);

  return '';
}

async function getIconList() {
  return Object.entries(icon).map(([name, feed]) => ({
    "name": name,
    "keywords": feed.keywords
  }));
}

window.customIconsets = window.customIconsets || {};
window.customIconsets['sdc'] = getIcon;

window.customIcons = window.customIcons || {};
window.customIcons['sdc'] = {getIcon, getIconList};
`, 'utf-8');

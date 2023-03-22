const PLUGIN_ATTS = {
  Author: 'author',
  'Author URI': 'author_uri',
  Description: null,
  'Domain Path': null,
  'Elementor Pro tested up to': null,
  'Elementor tested up to': null,
  License: null,
  'License URI': null,
  Network: null,
  'Plugin Name': 'name',
  'Plugin URI': 'plugin_uri',
  Requires: 'wp_req_version',
  'Requires at least': 'wp_min_version',
  'Requires PHP': 'php_req_version',
  'Tested up to': 'wp_tested_version',
  'Text Domain': null,
  Version: 'version',
  'WC requires at least': 'wp_min_version',
  'WC tested up to': 'wp_tested_version',
};

const PLUGIN_DB_FIELDS = {};
for (const key of Object.keys(PLUGIN_ATTS)) {
  if (PLUGIN_ATTS[key]) {
    PLUGIN_DB_FIELDS[PLUGIN_ATTS[key]] = key;
  }
}

function proccessPlugin(url, pluginFile, lines) {
  const pluginAtts = { 'Plugin Starter': pluginFile, 'Plugin Slug': pluginFile.split('/')[0] };
  while (lines.length > 0) {
    let line = lines.shift();
    if (line.startsWith('#')) {
      lines.unshift(line);
      //console.log('END PLUGIN' + pluginFile);
      const pluginInfo = {};
      for (const key in PLUGIN_DB_FIELDS) {
        pluginInfo[key] = pluginAtts[PLUGIN_DB_FIELDS[key]] || null;
      }
      pluginInfo.slug = pluginAtts['Plugin Slug'];
      pluginInfo.name = pluginInfo.name || pluginInfo.slug;

      return { ...pluginInfo, data: pluginAtts };
    } else if (Object.keys(PLUGIN_ATTS).some((att) => line.includes(att))) {
      //console.log('SOME PROP');
      line = line.trim().replace('* ', '');
      const attName = line.substring(0, line.indexOf(':')).trim();
      const attValue = line.substring(line.indexOf(':') + 1).trim();
      //console.log('ATT NAME:' + attName);
      //console.log('ATT VALUE:' + attValue);
      if (attName === 'WC requires at least') {
        pluginAtts['WP requires at least'] = attValue;
      } else if (attName === 'WC tested up to') {
        pluginAtts['WP tested up to'] = attValue;
      } else {
        pluginAtts[attName] = attValue;
      }
    }
  }

  const pluginInfo = {};
  for (const key in PLUGIN_DB_FIELDS) {
    pluginInfo[key] = pluginAtts[PLUGIN_DB_FIELDS[key]] || null;
  }
  pluginInfo.slug = pluginAtts['Plugin Slug'];
  pluginInfo.name = pluginInfo.name || pluginInfo.slug;

  return { ...pluginInfo, data: pluginAtts };
}

function proccessActivePlugins(url, lines) {
  const plugins = [];
  while (lines.length > 0) {
    const line = lines.shift();
    if (line.startsWith('# ') || line.startsWith('## ')) {
      lines.unshift(line);
      //console.log('END ACTIV PLUGINS');
      //console.table(plugins);

      return plugins;
    } else if (line.startsWith('### ')) {
      //console.log('PROC PLUGIN');
      const pluginFile = line.replace('### ', '').trim();
      const pluginAtts = proccessPlugin(url, pluginFile, lines);
      plugins.push(pluginAtts);
    }
  }

  return plugins;
}

function proccessInctivePlugins(url, lines) {
  const plugins = [];
  while (lines.length > 0) {
    const line = lines.shift();
    if (line.startsWith('# ') || line.startsWith('## ')) {
      lines.unshift(line);
      //console.log('END INACTIV PLUGINS');
      //console.table(plugins);
      return plugins;
    } else if (line.trim() !== '') {
      //console.log('PROC PLUGIN');
      plugins.push(line.trim());
    }
  }

  return plugins;
}

function proccessSite(url, lines) {
  const siteInfo = { url: url };
  while (lines.length > 0) {
    const line = lines.shift();
    if (line.startsWith('# ')) {
      lines.unshift(line);
      //console.log('END SITE');
      return siteInfo;
    } else if (line.startsWith('## Active plugins')) {
      //console.log('PROC ACTI');
      siteInfo['activePlugins'] = proccessActivePlugins(url, lines);
    } else if (line.startsWith('## Inactive plugins')) {
      //console.log('PROC INACTIV');
      siteInfo['inactivePlugins'] = proccessInctivePlugins(url, lines);
    }
  }

  return siteInfo;
}

export function proccessInput(snpippetOutput) {
  const lines = snpippetOutput.split('\n');
  const sites = [];

  while (lines.length > 0) {
    const line = lines.shift();
    if (line.startsWith('# ')) {
      const siteInfo = proccessSite(line, lines);
      sites.push({ url: line.replace('# ', ''), plugins: siteInfo });
    }
  }

  return sites;
}

import fs from 'fs';

const html = fs.readFileSync('user_redesign.html', 'utf8');
const tMatch = html.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
if (tMatch) {
  const jsonStr = tMatch[1].trim();
  const raw = JSON.parse(jsonStr);
  fs.writeFileSync('user_template.html', raw, 'utf8');
  console.log('Extracted template length:', raw.length);
} else {
  console.log('No bundler template found');
}

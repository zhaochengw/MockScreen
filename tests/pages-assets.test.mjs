import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';

const project = new URL('../', import.meta.url);
const site = new URL('https://example.invalid/MockScreen/');

function checkPath(path, base = site) {
    if (path.startsWith('data:')) return;
    const url = new URL(path, base);
    assert.equal(url.origin, site.origin);
    assert.ok(url.pathname.startsWith(site.pathname), path);

    let directory = project;
    for (const part of url.pathname.slice(site.pathname.length).split('/')) {
        assert.ok(readdirSync(directory).includes(decodeURIComponent(part)), `Missing or case mismatch: ${path}`);
        directory = new URL(`${part}/`, directory);
    }
}

test('entry resources and stylesheets resolve below the project subpath', () => {
    const html = readFileSync(new URL('index.html', project), 'utf8');
    for (const [, path] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
        if (!path.startsWith('https://')) checkPath(path);
    }
    const css = readFileSync(new URL('css/style.css', project), 'utf8');
    for (const [, path] of css.matchAll(/url\(['"]([^'"]+)['"]\)/g)) {
        checkPath(path, new URL('css/style.css', site));
    }
});

test('each listed template has local assets and a single separate status panel', async () => {
    const html = readFileSync(new URL('index.html', project), 'utf8');
    const templateOptions = html.match(/<select id="template-select">([\s\S]*?)<\/select>/)[1];
    for (const [, name] of templateOptions.matchAll(/<option value="([\w-]+)"/g)) {
        const path = `templates/${name}/main.js`;
        checkPath(path);
        const { template } = await import(new URL(path, project));
        for (const asset of Object.values(template.assets)) checkPath(asset);
        const controls = template.getControlsHTML();
        assert.equal([...controls.matchAll(/<fieldset data-statusbar-controls>/g)].length, 1, name);
        assert.equal([...controls.matchAll(/<!-- ICON_CONTROLS_PLACEHOLDER -->/g)].length, 1, name);
        for (const [, src] of controls.matchAll(/\ssrc="([^"]+)"/g)) checkPath(src);
    }
});

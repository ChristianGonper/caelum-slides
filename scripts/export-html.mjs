import { build } from 'vite';
import { copyFile, mkdir, stat, writeFile } from 'node:fs/promises';

// Bundle the same app as localhost, including its media, into one portable file.
const result = await build({
  build: {
    write: false,
    assetsInlineLimit: () => true,
    cssCodeSplit: false,
    modulePreload: false,
    rolldownOptions: { output: { codeSplitting: false } },
  },
});
const output = result.output;
const htmlAsset = output.find((item) => item.type === 'asset' && item.fileName === 'index.html');
const script = output.find((item) => item.type === 'chunk' && item.isEntry);
const css = output.find((item) => item.type === 'asset' && item.fileName.endsWith('.css'));
if (!htmlAsset || !script || !css || output.filter((item) => item.type === 'chunk').length !== 1) {
  throw new Error('La exportación requiere una entrada HTML, un único script y sus estilos.');
}
const html = String(htmlAsset.source)
  .replace(/<script\b[^>]*src="[^"]+"[^>]*><\/script>/, () =>
    `<script type="module">${script.code.replace(/<\/script/gi, '<\\/script')}</script>`)
  .replace(/<link\b[^>]*rel="stylesheet"[^>]*>/, () =>
    `<style>${String(css.source).replace(/<\/style/gi, '<\\/style')}</style>`);
await mkdir('output/html', { recursive: true });
try {
  const originalExists = await stat('output/html/caelum-slides_original.html').then(() => true).catch(() => false);
  if (!originalExists) {
    await copyFile('output/html/caelum-slides.html', 'output/html/caelum-slides_original.html');
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
await writeFile('output/html/caelum-slides.html', html);
console.log('HTML exportado: output/html/caelum-slides.html');

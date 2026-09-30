import { execFileSync, execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function findBrowser() {
  const candidates = [
    process.env.CHROME_BIN,
    process.env.EDGE_BIN,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  // Fallbacks multiplataforma si se ejecuta en otros entornos o PATH
  for (const cmd of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'msedge']) {
    try {
      const detected = execSync(process.platform === 'win32' ? `where ${cmd}` : `which ${cmd}`, { stdio: 'pipe' })
        .toString()
        .split(/\r?\n/)[0]
        .trim();
      if (detected && existsSync(detected)) {
        return detected;
      }
    } catch {
      // No encontrado en PATH
    }
  }

  throw new Error('No se encontró un navegador Chromium compatible (Google Chrome o Microsoft Edge) para la exportación PDF.');
}

const options = { diagram: 'blueprint', intro: 'focus' };
const allowed = { diagram: ['blueprint', 'illustrated'], intro: ['focus', 'map'] };
const args = process.argv.slice(2);
for (let index = 0; index < args.length; index++) {
  const [flag, inlineValue] = args[index].split('=');
  const name = flag.replace(/^--/, '');
  if (!flag.startsWith('--') || !Object.hasOwn(allowed, name)) {
    throw new Error(`Opción desconocida: ${flag}. Usa --diagram blueprint|illustrated y --intro focus|map.`);
  }
  const value = inlineValue ?? args[++index];
  if (!allowed[name].includes(value)) {
    throw new Error(`Valor inválido para ${flag}: ${value}. Valores admitidos: ${allowed[name].join(', ')}.`);
  }
  options[name] = value;
}

const htmlPath = path.resolve('output/html/caelum-slides.html');
// Print the current source rather than a potentially outdated HTML export.
execSync('npm run export:html', { stdio: 'inherit' });

const outputDir = path.resolve('output/pdf');
const targetPdf = path.join(outputDir, 'esabic-caelum-2026.pdf');
const backupPdf = path.join(outputDir, 'esabic-caelum-2026_original.pdf');

mkdirSync(outputDir, { recursive: true });

// Regla de seguridad documental: crear copia de respaldo (_original) antes de modificar/reemplazar si existe
if (existsSync(targetPdf)) {
  try {
    if (!existsSync(backupPdf)) {
      copyFileSync(targetPdf, backupPdf);
      console.log(`Copia de seguridad creada: ${backupPdf}`);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

const browser = findBrowser();
console.log(`Usando navegador: ${browser}`);

const tempProfileDir = mkdtempSync(path.join(os.tmpdir(), 'caelum-pdf-'));
const params = new URLSearchParams({ view: 'static', deck: 'esabic-caelum-2026', ...options });
const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}?${params}`;

console.log(`Generando PDF desde: ${fileUrl}`);
try {
  execFileSync(browser, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--allow-file-access-from-files',
    `--user-data-dir=${tempProfileDir}`,
    '--no-pdf-header-footer',
    '--virtual-time-budget=3000',
    `--print-to-pdf=${targetPdf}`,
    fileUrl,
  ], {
    stdio: 'pipe',
  });
} catch (error) {
  if (error.stderr) console.error(error.stderr.toString());
  throw new Error(`Fallo en la ejecución del navegador para generar el PDF: ${error.message}`);
} finally {
  try {
    rmSync(tempProfileDir, { recursive: true, force: true });
  } catch {
    // Si Windows mantiene un bloqueo transitorio, se ignora el borrado del directorio temporal
  }
}

if (!existsSync(targetPdf)) {
  throw new Error(`El archivo PDF no se generó en la ruta esperada: ${targetPdf}`);
}

const pdfBuffer = readFileSync(targetPdf);
if (pdfBuffer.length < 10 * 1024) {
  throw new Error(`El PDF generado es sospechosamente pequeño (${pdfBuffer.length} bytes).`);
}

const pdfContent = pdfBuffer.toString('latin1');
if (!pdfContent.startsWith('%PDF-')) {
  throw new Error('El archivo generado no cuenta con la cabecera canónica de PDF (%PDF-).');
}

const pageMatches = pdfContent.match(/\/Type\s*\/Page\b/g);
const pageCount = pageMatches ? pageMatches.length : 0;

console.log(`PDF exportado correctamente: ${targetPdf}`);
console.log(`Tamaño: ${(pdfBuffer.length / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Páginas detectadas: ${pageCount}`);

if (pageCount !== 11) {
  throw new Error(`Se esperaban exactamente 11 páginas en el PDF estático de Caelum, pero se detectaron ${pageCount}.`);
}

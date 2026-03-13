import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, '..', 'src', 'data', 'audimeta.trending.json');
const endpoint =
  'https://audimeta.de/search?products_sort_by=BestSellers&region=us&limit=18&page=0&cache=true';

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeBook(book, index) {
  const authors = toArray(book?.authors)
    .map((author) => author?.name?.trim())
    .filter(Boolean);
  const series = toArray(book?.series)
    .map((item) => item?.name?.trim())
    .filter(Boolean);

  return {
    rank: index + 1,
    asin: typeof book?.asin === 'string' ? book.asin : '',
    title: typeof book?.title === 'string' ? book.title : '',
    subtitle: typeof book?.subtitle === 'string' ? book.subtitle : '',
    imageUrl: typeof book?.imageUrl === 'string' ? book.imageUrl : '',
    link: typeof book?.link === 'string' ? book.link : '',
    author: authors[0] || '',
    authors,
    series: series[0] || '',
    seriesList: series,
    region: typeof book?.region === 'string' ? book.region : 'us',
  };
}

async function readExistingFile() {
  try {
    return await readFile(outputPath, 'utf8');
  } catch {
    return null;
  }
}

async function main() {
  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'ListenarrDocs/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Audimeta request failed with status ${response.status}`);
    }

    const payload = await response.json();
    const normalizedBooks = toArray(payload)
      .map(normalizeBook)
      .filter((book) => book.asin && book.title && book.imageUrl);

    const dedupedBooks = normalizedBooks.filter(
      (book, index, books) => books.findIndex((candidate) => candidate.asin === book.asin) === index,
    );

    if (dedupedBooks.length === 0) {
      throw new Error('Audimeta returned no usable trending books');
    }

    const output = {
      endpoint,
      generatedAt: new Date().toISOString(),
      region: 'us',
      total: dedupedBooks.length,
      books: dedupedBooks,
    };

    await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
    console.log(`Wrote ${dedupedBooks.length} Audimeta trending books to ${outputPath}`);
  } catch (error) {
    const existing = await readExistingFile();
    if (existing) {
      console.warn(
        `Unable to refresh Audimeta trending data; keeping existing file. ${error instanceof Error ? error.message : String(error)}`,
      );
      return;
    }

    const fallback = {
      endpoint,
      generatedAt: new Date().toISOString(),
      region: 'us',
      total: 0,
      books: [],
    };

    await writeFile(outputPath, `${JSON.stringify(fallback, null, 2)}\n`, 'utf8');
    console.warn(
      `Unable to refresh Audimeta trending data; wrote an empty fallback file instead. ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

await main();

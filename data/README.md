# French Vocabulary Data

This directory contains CSV files for seeding the French vocabulary database.

## Files

- `vocabulary.csv` - The main vocabulary file used for seeding the database
- `vocabulary-sample.csv` - A sample file showing the expected format

## CSV Format

The vocabulary CSV files should have the following columns:

- `word` - The French word
- `translation` - The English translation
- `example` - An example sentence using the word
- `level` - The CEFR level (A1, A2, B1, B2, C1, C2)
- `category` - The category of the word (optional)

## How to Use

### Generate a Comprehensive Vocabulary CSV

```bash
npm run generate-vocabulary
```

This will create a comprehensive vocabulary CSV file in the `data` directory with common French words organized by level and category.

### Seed the Database with Vocabulary

```bash
npm run seed-vocabulary
```

This will read the vocabulary CSV file and seed the database with the vocabulary items.

### Customize the Vocabulary

You can edit the `vocabulary.csv` file to add, remove, or modify vocabulary items. The seeding process will skip any words that already exist in the database, so you can safely run it multiple times.

## Adding Your Own Vocabulary

To add your own vocabulary:

1. Create a CSV file with the required columns
2. Run the seeding script with the path to your CSV file:

```bash
npx ts-node src/lib/seedVocabulary.ts /path/to/your/vocabulary.csv
```

Or modify the `vocabulary.csv` file directly and run the standard seeding script.

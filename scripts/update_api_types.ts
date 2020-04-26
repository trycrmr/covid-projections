/**
 * Run via: yarn update-api-types
 *
 * Reads schema files from
 * https://github.com/covid-projections/covid-data-model/tree/master/api/schemas
 * and generates corresponding typescript definition files in src/models/api/
 */

import fetch from 'node-fetch';
import { compile } from 'json-schema-to-typescript';
import fs from 'fs-extra';
import path from 'path';

const SCHEMA_FILES = [
  'CANPredictionAPI.json',
  'CANPredictionAPIRow.json',
  'CANPredictionTimeseriesRow.json',
  'CovidActNowAreaSummary.json',
  'CovidActNowCountiesAPI.json',
  'CovidActNowCountiesSummary.json',
  'CovidActNowCountiesTimeseries.json',
  'CovidActNowStatesAPI.json',
  'CovidActNowStatesSummary.json',
  'CovidActNowStatesTimeseries.json',
  'StateCaseSummary.json',
];

const BANNER_COMMENT = `
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Run 'yarn update-api-types' to regenerate.
 */
`;

const OUTPUT_FOLDER = path.join(__dirname, '..', 'src', 'api', 'schema');
const SCHEMAS_BASE_URL =
  'https://raw.githubusercontent.com/covid-projections/covid-data-model/master/api/schemas/';

(async () => {
  for (const file of SCHEMA_FILES) {
    const response = await fetch(SCHEMAS_BASE_URL + file, {});
    const json = await response.json();
    forceAdditionalPropertiesFalse(json);
    const ts = await compile(json, file.replace('.json', ''), {
      bannerComment: BANNER_COMMENT,
    });
    const outFile = path.join(OUTPUT_FOLDER, file.replace('.json', '.d.ts'));
    await fs.writeFile(outFile, ts);
    console.log(`Generated ${outFile}`);
  }
})();

// HACK: We modify the schema to disable 'additionalProperties' on all types so
// that the generated TypeScript definitions are more restrictive and doesn't
// let us accidentally access nonexistent properties.
function forceAdditionalPropertiesFalse(jsonSchema: any) {
  jsonSchema['additionalProperties'] = false;
  const definitions = jsonSchema['definitions'] || {};
  for (const type in definitions) {
    definitions[type]['additionalProperties'] = false;
  }
}
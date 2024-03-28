import { mkdir, readdir, open as openFile, readFile, writeFile, access as accessFile } from 'fs/promises';
import { join as joinPath } from 'path';
import { createHash } from 'crypto';
import spdxParse from 'spdx-expression-parse';

const licenseRoot = joinPath('public', 'licenses');
const licenseIndex = joinPath('public', 'licenses.json');
const licenseBundle = joinPath('public', 'licenses.txt');

/**
 * @param {spdxParse.Info} parsedLicense
 * @returns {string[]}
 */
function getLicenseList(parsedLicense) {
  if (parsedLicense.left && parsedLicense.right && parsedLicense.conjunction) {
    if (parsedLicense.conjunction === 'or') {
      return [ ...getLicenseList(parsedLicense.left), ...getLicenseList(parsedLicense.right) ];
    }
  } else if (parsedLicense.left || parsedLicense.right || parsedLicense.conjunction) {
    console.warn('Unexpected SPDX parse result');
  } else if (parsedLicense.license) {
    return [ parsedLicense.license ];
  }
  return [];
}

(async () => {
  // This condition defines a list of licenses that are OK to use, in order of preference.
  // More licenses than are defined here may be OK; if so, they should be added
  // to this list if used by any dependencies.
  const allowedLicenseNames = [ '0BSD', 'MIT', 'ISC', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', ];

  // Ensure licenseRoot directory exists
  await mkdir(licenseRoot, { recursive: true });

  const licenseDict = {};

  let dependencies = [];

  /**
   * @param {string} packageName
   * @param {boolean} ignore
   */
  async function recurseLicense(packageName, ignore) {
    const packagePath = packageName ? joinPath('node_modules', packageName) : '.';
    const packageMeta = JSON.parse(await readFile(joinPath(packagePath, 'package.json'), 'utf-8'));
    const dependencyFullName = `${packageMeta.name}@${packageMeta.version}`;

    if (!ignore && !dependencies.find(d => d.name === dependencyFullName)) {
      dependencies.push({
        name: dependencyFullName,
        packagePath,
        packageMeta,
      });
    }

    for (const dependencyName in packageMeta.dependencies) {
      await recurseLicense(dependencyName, false);
    }
  }
  await recurseLicense(null, true);
  dependencies.sort((a, b) => a.name.localeCompare(b.name));

  const licenseBundleFile = await openFile(licenseBundle, 'w');
  let isFirst = true;
  let endsWithNewline = false;
  for (const { name, packagePath, packageMeta } of dependencies) {
    let singleLicenseText = '';
    const allLicenses = (typeof packageMeta.license === 'string') ? getLicenseList(spdxParse(packageMeta.license)) : [];
    const licenses = allLicenses.filter(l => allowedLicenseNames.includes(l));
    licenses.sort((a, b) => allowedLicenseNames.indexOf(a) - allowedLicenseNames.indexOf(b));
    const license = (licenses.length > 0) ? licenses[0] : ((allLicenses.length > 0) ? allLicenses[0] : null)
    if (licenses.length == 0) {
      console.warn(`${name} does not use any allowed license: ${packageMeta.license}`);
    } 
    if (license === null) {
      singleLicenseText += 'Unknown license';
      console.warn(`${name} does not define a license`);
    } else {
      singleLicenseText += `License: ${license}`;
    }
    singleLicenseText += '\n\n';

    let foundLicenseFile = false;
    const files = await readdir(packagePath);
    for (const file of files) {
      if (file.toLowerCase().startsWith('license')) {
        singleLicenseText += await readFile(joinPath(packagePath, file), 'utf-8');
        foundLicenseFile = true;
        break;
      }
    }
    if (!foundLicenseFile) {
      if (license === null) {
        console.warn(`No license file found for ${name}`);
      } else {
        console.warn(`No license file found for ${name}, retrieving from spdx.org`);
        singleLicenseText += await fetch(`https://spdx.org/licenses/${encodeURIComponent(license)}.txt`).then(r => r.text());
      }
    }

    const singleLicenseTextHash = createHash('sha1').update(singleLicenseText).digest('hex');
    const outputPath = joinPath(licenseRoot, `${singleLicenseTextHash}.txt`);
    if (!await accessFile(outputPath).then(() => true).catch(() => false)) {
      // Save this license text
      await writeFile(outputPath, singleLicenseText);
    }

    licenseDict[name] = singleLicenseTextHash;

    // Add license text to bundle
    if (isFirst) {
      isFirst = false;
    } else {
      if (!endsWithNewline) { licenseBundleFile.write('\n'); }
      await licenseBundleFile.write('\n--------------------------------------------------------------------------------\n\n');
    }
    await licenseBundleFile.write(`${name}\n${singleLicenseText}`);
    if (singleLicenseText.endsWith('\n')) {
      endsWithNewline = true;
    } else {
      endsWithNewline = false;
    }
  }
  licenseBundleFile.close();

  // Write license dict
  await writeFile(licenseIndex, JSON.stringify(licenseDict));

  console.log('Finished creating license data');
})();

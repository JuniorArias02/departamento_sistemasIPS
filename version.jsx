import packageJson from './package.json';

export default function getVersion() {
  const version = packageJson.version;
  const releaseDate = "15/09/2025"; 
  return { version, releaseDate };
}

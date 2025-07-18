import packageJson from './package.json';

export default function getVersion() {
  const version = packageJson.version;
  const releaseDate = "16/07/2025"; 
  return { version, releaseDate };
}

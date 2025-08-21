import packageJson from './package.json';

export default function getVersion() {
  const version = packageJson.version;
  const releaseDate = "21/08/2025"; 
  return { version, releaseDate };
}

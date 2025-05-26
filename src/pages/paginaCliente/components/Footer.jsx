import getVersion from "../../../../version";
export default function Footer() {
  const { version, releaseDate } = getVersion();
  return (
    <footer className="bg-gray-200 text-center py-4 mt-auto shadow-inner">
      <p className="text-gray-700 font-medium">
        IPS CLINICAL HOUSE - Departamento de sistemas 💻
      </p>
      <p className="text-gray-400 font-medium">
        Versión: {version}  <br />  Actualizado - {releaseDate}
      </p>
    </footer>
  );
}

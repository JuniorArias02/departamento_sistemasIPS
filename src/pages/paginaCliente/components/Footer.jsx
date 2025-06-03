import getVersion from "../../../../version";
export default function Footer() {
  const { version, releaseDate } = getVersion();
  return (
    <footer className="bg-[#edeef3] text-center py-2 px-4 shadow-inner">
      <p className="text-gray-700 font-medium text-sm">
        IPS CLINICAL HOUSE - Departamento de sistemas 💻
      </p>
      <p className="text-gray-400 font-medium text-xs mt-1">
        Versión: {version} <br /> Actualizado - {releaseDate}
      </p>
    </footer>
  );
}

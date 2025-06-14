import getVersion from "../../../../version";
export default function Footer() {
  const { version, releaseDate } = getVersion();
  return (
    <footer className="bg-white border-t border-gray-100 py-5 px-4">
  <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
      <p className="text-sm text-gray-700">
        <span className="font-medium">IPS CLINICAL HOUSE</span> • Sistemas
      </p>
    </div>
    
    <div className="flex items-center gap-4">
      <p className="text-xs text-gray-500">
        v{version} • {releaseDate}
      </p>
      <button className="text-xs text-blue-500 hover:text-blue-700 transition-colors">
        Soporte técnico
      </button>
    </div>
  </div>
</footer>
  );
}

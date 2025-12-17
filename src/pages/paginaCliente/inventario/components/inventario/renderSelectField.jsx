import { motion } from "framer-motion";

const renderSelectField = ({ name, label, icon, options, formData, handleChange }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-1"
  >
    <label htmlFor={name} className="text-sm font-medium text-gray-700 flex items-center gap-1">
      {icon}
      <span>{label}</span>
    </label>

    <div className="relative">
      <select
        id={name}
        name={name}
        value={String(formData[name] ?? "")}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      >
        <option value="">{label.toLowerCase()}</option>

        {options.map(option => (
          <option key={option} value={String(option)}>
            {option}
          </option>
        ))}
      </select>

      <div className="absolute left-3 top-3.5">{icon}</div>
    </div>
  </motion.div>
);

export default renderSelectField;

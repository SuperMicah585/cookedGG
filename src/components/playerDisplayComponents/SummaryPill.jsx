import Tooltip from '@mui/material/Tooltip';

const SummaryPill = ({ label, icon, colorClasses, tooltip }) => (
  <Tooltip title={tooltip} arrow placement="top">
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-sm font-semibold bg-transparent ${colorClasses}`}
    >
      {icon}
      {label}
    </span>
  </Tooltip>
);

export default SummaryPill;

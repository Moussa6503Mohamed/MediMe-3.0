import React from 'react';

type DetailFieldProps = {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
};

export const DetailField = ({ label, value, icon }: DetailFieldProps) => {
  return (
    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-base font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

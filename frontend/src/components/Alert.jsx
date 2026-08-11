import React from 'react';

const Alert = ({ type = 'info', message }) => {
  const styles = {
    success: 'bg-green-100 text-green-800 border-green-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-orange-100 text-orange-800 border-orange-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle',
  };

  return (
    <div className={`flex items-center p-4 mb-4 border rounded-xl animate-fade-in ${styles[type]}`}>
      <i className={`fa-solid ${icons[type]} mr-3 text-lg`}></i>
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default Alert;

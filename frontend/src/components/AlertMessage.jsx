import React from 'react';

const AlertMessage = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const alertClassMap = {
    success: 'alert-success border-success',
    danger: 'alert-danger border-danger',
    warning: 'alert-warning border-warning',
    info: 'alert-info border-info'
  };

  const iconMap = {
    success: 'bi-check-circle-fill text-success',
    danger: 'bi-exclamation-triangle-fill text-danger',
    warning: 'bi-exclamation-circle-fill text-warning',
    info: 'bi-info-circle-fill text-info'
  };

  return (
    <div className={`alert ${alertClassMap[type] || 'alert-info'} alert-dismissible fade show shadow-sm d-flex align-items-center gap-2`} role="alert">
      <i className={`bi ${iconMap[type]} fs-5`}></i>
      <div className="flex-grow-1">{message}</div>
      {onClose && (
        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
      )}
    </div>
  );
};

export default AlertMessage;

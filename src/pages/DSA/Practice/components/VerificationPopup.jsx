import { AlertTriangle, CheckCircle, AlertCircle, X } from 'lucide-react';

const VerificationPopup = ({ isOpen, onClose, type = 'error', title, message, problemTitle }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-amber-600" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100';
      case 'error':
        return 'bg-red-100';
      case 'warning':
        return 'bg-amber-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-900';
      case 'error':
        return 'text-red-900';
      case 'warning':
        return 'text-amber-900';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-gray-200">
          <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${getBgColor()}`}>
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold ${getTitleColor()}`}>
              {title}
            </h3>
            {problemTitle && (
              <p className="text-sm text-gray-500 mt-1 truncate">
                Problem: {problemTitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              type === 'success'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
            }`}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPopup;

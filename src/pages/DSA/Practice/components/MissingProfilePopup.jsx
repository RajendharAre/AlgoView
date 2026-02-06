import { AlertTriangle } from 'lucide-react';

const MissingProfilePopup = ({ isOpen, onClose, onNavigateToProfile }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              LeetCode Profile Required
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Please add your LeetCode profile in your profile settings to continue.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={onNavigateToProfile}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissingProfilePopup;

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
// Removed devAuthService - using Firebase auth directly in production
import firebaseService from './services/firebaseService.js';
import pushNotificationService from './services/pushNotifications.js';
import { db } from './firebase.js';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import About from './pages/About.jsx';
import TermsAndConditions from './pages/TermsAndConditions.jsx';
import SocialMediaManagement from './pages/SocialMediaManagement.jsx';
import TechnologySolutions from './pages/TechnologySolutions.jsx';
import OtherServices from './pages/OtherServices.jsx';
import WebDesignDevelopment from './pages/WebDesignDevelopment.jsx';
import SmartHomeImplementation from './pages/SmartHomeImplementation.jsx';
import SecuritySolutions from './pages/SecuritySolutions.jsx';
import SmallProjects from './pages/SmallProjects.jsx';
import DesktopSupportNetworking from './pages/DesktopSupportNetworking.jsx';

// Global error handler to prevent unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection:', event.reason);
  event.preventDefault(); // Prevent the default browser behavior
});

// Create a firebase object that points to firebaseService for backward compatibility
const firebase = firebaseService;
import {
  User,
  BarChart3,
  Users,
  Briefcase,
  MessageSquare,
  FileText,
  Settings,
  Bell,
  Plus,
  Mail,
  Phone,
  Send,
  X,
  Eye,
  Edit,
  Upload,
  Download,
  Inbox,
  Check,
  Reply,
  Video,
  MoreVertical,
  Paperclip,
  LogOut,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Icon,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  DollarSign,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  Globe,
  HelpCircle,
  MoreHorizontal,
  Code,
  Menu,
  BookOpen,
  CloudRain,
  Search,
  ShoppingBag,
  ExternalLink,
  Store,
  Gift,
  Star
} from 'lucide-react';

// AWS SDK for SES and SNS (optional, for client-side usage)
// Note: AWS SDK should be loaded via script tag or npm package
// For now, we'll check if AWS is available globally
const AWS = typeof window !== 'undefined' ? window.AWS : undefined;

// Global utility functions
const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in-progress': return 'info';
    case 'pending': return 'warning';
    case 'blocked': return 'danger';
    case 'paid': return 'success';
    case 'overdue': return 'danger';
    case 'cancelled': return 'danger';
    default: return 'default';
  }
};

const _getStatusColorClass = (status) => {
  switch (status) {
    case 'completed': return 'bg-green-500';
    case 'in-progress': return 'bg-blue-500';
    case 'pending': return 'bg-yellow-500';
    case 'cancelled': return 'bg-red-500';
    case 'paid': return 'text-green-600 bg-green-100';
    case 'overdue': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// Data Manager Service
class DataManager {
  constructor(errorHandler) {
    this.errorHandler = errorHandler;
  }

  setItem(key, value) {
    try {
      if (typeof key !== 'string') {
        throw new Error('Key must be a string');
      }
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      this.errorHandler?.logError(error, { operation: 'setItem', key, valueType: typeof value });
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    try {
      if (typeof key !== 'string') {
        return defaultValue;
      }
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      this.errorHandler?.logError(error, { operation: 'getItem', key });
      return defaultValue;
    }
  }

  removeItem(key) {
    try {
      if (typeof key !== 'string') {
        return false;
      }
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      this.errorHandler?.logError(error, { operation: 'removeItem', key });
      return false;
    }
  }

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      this.errorHandler?.logError(error, { operation: 'clear' });
      return false;
    }
  }

  // Safe method to check if localStorage is available
  isAvailable() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      this.errorHandler?.logError(error, { operation: 'isAvailable' });
      return false;
    }
  }
}

// Loading Manager Service
class LoadingManager {
  constructor() {
    this.loadingStates = new Map();
    this.listeners = [];
  }

  setLoading(key, isLoading, message = '') {
    try {
      this.loadingStates.set(key, { 
        isLoading: Boolean(isLoading), 
        message: String(message || ''),
        timestamp: new Date().toISOString()
      });
      this.notifyListeners();
    } catch (error) {
      console.error('Error setting loading state:', error);
    }
  }

  isLoading(key) {
    try {
      const state = this.loadingStates.get(key);
      return state ? state.isLoading : false;
    } catch (error) {
      console.error('Error checking loading state:', error);
      return false;
    }
  }

  getLoadingMessage(key) {
    try {
      const state = this.loadingStates.get(key);
      return state ? state.message : '';
    } catch (error) {
      console.error('Error getting loading message:', error);
      return '';
    }
  }

  getAllLoadingStates() {
    try {
      return Object.fromEntries(this.loadingStates);
    } catch (error) {
      console.error('Error getting all loading states:', error);
      return {};
    }
  }

  subscribe(listener) {
    try {
      this.listeners.push(listener);
      return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    } catch (error) {
      console.error('Error subscribing to loading manager:', error);
      return () => {};
    }
  }

  notifyListeners() {
    try {
      const states = this.getAllLoadingStates();
      this.listeners.forEach(listener => {
        try {
          listener(states);
        } catch (listenerError) {
          console.error('Error in loading listener:', listenerError);
        }
      });
    } catch (error) {
      console.error('Error notifying loading listeners:', error);
    }
  }

  // Cleanup old loading states
  cleanup() {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      for (const [key, state] of this.loadingStates.entries()) {
        if (new Date(state.timestamp) < oneHourAgo && !state.isLoading) {
          this.loadingStates.delete(key);
        }
      }
    } catch (error) {
      console.error('Error cleaning up loading states:', error);
    }
  }
}

// Removed _FirebaseService - using firebaseService from firebaseService.js for production

// Enhanced UI Components with Better UX

// Responsive Container Component
const ResponsiveContainer = ({ children, className = '', maxWidth = '7xl' }) => {
  const { isMobile, isTablet } = useResponsive();
  
  const maxWidths = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl'
  };

  const padding = isMobile ? 'px-4' : isTablet ? 'px-6' : 'px-8';

  return (
    <div className={`mx-auto ${maxWidths[maxWidth]} ${padding} ${className}`}>
      {children}
    </div>
  );
};

// Enhanced Loading States Component
const DataLoader = ({ 
  loading, 
  error, 
  data, 
  children, 
  loadingComponent, 
  errorComponent,
  emptyComponent,
  retryAction 
}) => {
  if (loading) {
    return loadingComponent || (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" message="Loading data..." />
      </div>
    );
  }

  if (error) {
    return errorComponent || (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error.message || 'Failed to load data'}</p>
          {retryAction && (
            <Button onClick={retryAction} variant="secondary">
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return emptyComponent || (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8l-4-4m0 0L9 5m6-6v4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
        <p className="text-gray-600">There's nothing to display at the moment.</p>
      </div>
    );
  }

  return children;
};

// Enhanced Form Components with Better Validation
const FormField = ({ 
  label, 
  error, 
  required, 
  children, 
  helpText,
  className = '' 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

// Enhanced Input with better states
const Input = React.forwardRef(({ 
  className = '', 
  error, 
  loading, 
  icon: Icon,
  rightIcon: RightIcon,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed";
  const errorClasses = error ? "border-red-300 focus:ring-red-500" : "border-gray-300";
  const iconPadding = Icon ? "pl-10" : "";
  const rightIconPadding = RightIcon ? "pr-10" : "";

  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      )}
      <input
        ref={ref}
        className={`${baseClasses} ${errorClasses} ${iconPadding} ${rightIconPadding} ${className}`}
        {...props}
      />
      {RightIcon && (
        <RightIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      )}
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <LoadingSpinner size="sm" />
        </div>
      )}
    </div>
  );
});

// Enhanced Modal with better responsive behavior
const EnhancedModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true
}) => {
  const { isMobile } = useResponsive();
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  const mobileClasses = isMobile ? 'mx-4 max-h-[90vh] overflow-y-auto' : 'mx-auto';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0" 
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      <div className={`bg-white rounded-xl ${sizes[size]} w-full ${mobileClasses} relative z-10`}>
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Enhanced Table Component
const Table = ({ columns, data, loading, emptyMessage = "No data available" }) => {
  const { isMobile } = useResponsive();

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <LoadingSpinner size="lg" message="Loading table data..." />
      </div>
    );
  }

  if (isMobile) {
    // Mobile card view
    return (
      <div className="space-y-4">
        {data.map((row, index) => (
          <Card key={index} className="p-4">
            {columns.map((column) => (
              <div key={column.key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-sm font-medium text-gray-600">{column.label}</span>
                <span className="text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </span>
              </div>
            ))}
          </Card>
        ))}
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {emptyMessage}
          </div>
        )}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {emptyMessage}
        </div>
      )}
    </div>
  );
};

      // Approvals Tab
const ApprovalsTab = ({ approvals, jobId, userRole, onUpdate }) => {
  const [showCreateApproval, setShowCreateApproval] = useState(false);

  const handleApprovalAction = async (approvalId, stageId, decision, comments) => {
    try {
      await firebase.processApproval(jobId, approvalId, stageId, decision, comments);
      onUpdate();
    } catch (error) {
      console.error('Error processing approval:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Approval Workflows</h3>
          <p className="text-gray-600">Multi-stage approvals for project milestones</p>
        </div>
        {userRole === 'admin' && (
          <Button onClick={() => setShowCreateApproval(true)}>
            <Plus className="w-4 h-4" />
            Request Approval
          </Button>
        )}
      </div>

      {/* Approval Requests */}
      <div className="space-y-4">
        {approvals.map((approval) => (
          <Card key={approval.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{approval.title}</h4>
                <p className="text-gray-600 mt-1">{approval.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={getStatusColor(approval.status)}>{approval.status}</Badge>
                  <span className="text-sm text-gray-500">
                    Created {new Date(approval.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Approval Stages */}
            <div className="space-y-3">
              <h5 className="font-medium text-gray-900">Approval Stages</h5>
              {approval.stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stage.status === 'approved' ? 'bg-green-500 text-white' :
                    stage.status === 'rejected' ? 'bg-red-500 text-white' :
                    stage.status === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{stage.title}</p>
                        <p className="text-sm text-gray-600">Approver: {stage.approverEmail}</p>
                      </div>
                      <Badge variant={getStatusColor(stage.status)}>{stage.status}</Badge>
                    </div>
                    
                    {stage.comments && (
                      <p className="text-sm text-gray-600 mt-1 italic">"{stage.comments}"</p>
                    )}
                    
                    {stage.approvedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        {stage.status} on {new Date(stage.approvedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Approval Actions */}
                  {stage.status === 'pending' && stage.approverEmail === user?.email && (
                    <div className="flex items-center gap-2">
                      <ApprovalActionModal
                        stage={stage}
                        onApprove={(comments) => handleApprovalAction(approval.id, stage.id, 'approved', comments)}
                        onReject={(comments) => handleApprovalAction(approval.id, stage.id, 'rejected', comments)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {approvals.length === 0 && (
        <Card className="p-12 text-center">
          <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No approval requests</h3>
          <p className="text-gray-600 mb-4">Create approval workflows for important project decisions</p>
          {userRole === 'admin' && (
            <Button onClick={() => setShowCreateApproval(true)}>
              <Plus className="w-4 h-4" />
              Create First Approval
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

// Modal Components
const TaskModal = ({ isOpen, onClose, task, onSubmit, jobId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    estimatedHours: '',
    priority: 'medium',
    weight: 1,
    dependencies: []
  });
  const [contractors, setContractors] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadContractors();
      if (task) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          assignedTo: task.assignedTo || '',
          estimatedHours: task.estimatedHours || '',
          priority: task.priority || 'medium',
          weight: task.weight || 1,
          dependencies: task.dependencies || []
        });
      }
    }
  }, [isOpen, task]);

  const loadContractors = async () => {
    try {
      const contractorsData = await firebase.getContractors();
      setContractors(contractorsData);
    } catch (error) {
      console.error('Error loading contractors:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task) {
      onSubmit(task.id, formData);
    } else {
      onSubmit(formData);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Create New Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              required
            >
              <option value="">Select contractor</option>
              {contractors.map(contractor => (
                <option key={contractor.id} value={contractor.email}>{contractor.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours</label>
            <input
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              min="1"
              max="10"
              required
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            {task ? 'Update' : 'Create'} Task
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const TimeEntryModal = ({ isOpen, onClose, task, tasks, onSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    taskId: '',
    date: new Date().toISOString().split('T')[0],
    hours: '',
    description: '',
    contractor: user?.email || ''
  });

  useEffect(() => {
    if (isOpen && task) {
      setFormData(prev => ({ ...prev, taskId: task.id }));
    }
  }, [isOpen, task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({
      taskId: '',
      date: new Date().toISOString().split('T')[0],
      hours: '',
      description: '',
      contractor: user?.email || ''
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Time Entry">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <select
            value={formData.taskId}
            onChange={(e) => setFormData(prev => ({ ...prev, taskId: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            required
          >
            <option value="">Select task</option>
            {tasks.map(task => (
              <option key={task.id} value={task.id}>{task.title}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
            <input
              type="number"
              step="0.25"
              value={formData.hours}
              onChange={(e) => setFormData(prev => ({ ...prev, hours: parseFloat(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              min="0.25"
              max="24"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            rows={3}
            placeholder="What did you work on?"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            Log Time
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const ApprovalActionModal = ({ stage, onApprove, onReject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (action === 'approve') {
      onApprove(comments);
    } else if (action === 'reject') {
      onReject(comments);
    }
    setIsOpen(false);
    setComments('');
    setAction('');
  };

  return (
    <>
      <Button 
        size="sm" 
        onClick={() => {
          setAction('approve');
          setIsOpen(true);
        }}
      >
        Approve
      </Button>
      <Button 
        variant="danger" 
        size="sm"
        onClick={() => {
          setAction('reject');
          setIsOpen(true);
        }}
      >
        Reject
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title={`${action === 'approve' ? 'Approve' : 'Reject'} ${stage.title}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comments {action === 'reject' ? '(required)' : '(optional)'}
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              rows={3}
              placeholder={action === 'approve' ? 'Optional approval comments...' : 'Please explain why you are rejecting this request...'}
              required={action === 'reject'}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              variant={action === 'approve' ? 'success' : 'danger'}
              className="flex-1"
            >
              {action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

// Enhanced Jobs View with Project Management
const EnhancedJobsView = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetail, setShowJobDetail] = useState(false);

  useEffect(() => {
    loadJobs();
    initializeProjectData();
  }, [user]);

  const initializeProjectData = async () => {
    await firebase.initializeDefaultProjects();
  };

  const loadJobs = async () => {
    try {
      let jobsData = await firebase.getJobs();
      
      // Filter based on user role
      if (user?.role === 'client') {
        jobsData = jobsData.filter(job => job.clientEmail === user?.email);
      } else if (user?.role === 'contractor') {
        jobsData = jobsData.filter(job => job.contractorEmail === user?.email);
      }
      
      // Load progress for each job
      const jobsWithProgress = await Promise.all(
        jobsData.map(async (job) => {
          const progress = await firebase.updateJobProgress(job.id);
          return { ...job, progress };
        })
      );
      
      setJobs(jobsWithProgress);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (jobData) => {
    try {
      await firebase.createJob(jobData);
      loadJobs();
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Loading jobs...</div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {user?.role === 'admin' ? 'Job Management' : 
             user?.role === 'contractor' ? 'Assigned Jobs' : 'My Jobs'}
          </h2>
          <p className="text-gray-600">
            {user?.role === 'admin' ? 'Manage all client projects and assignments' :
             user?.role === 'contractor' ? 'Track your assigned projects and tasks' :
             'Monitor your project progress and milestones'}
          </p>
        </div>
        {user?.role === 'admin' && (
          <Button onClick={() => setShowCreateJob(true)}>
            <Plus className="w-4 h-4" />
            Create Job
          </Button>
        )}
      </div>

      {/* Job Cards */}
      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs yet</h3>
          <p className="text-gray-600 mb-4">
            {user?.role === 'admin'
              ? 'Get started by creating your first job'
              : 'No jobs have been assigned to you yet'}
          </p>
          {user?.role === 'admin' && (
            <Button onClick={() => setShowCreateJob(true)}>
              <Plus className="w-4 h-4" />
              Create First Job
            </Button>
          )}
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(job.status)}>{job.status}</Badge>
                  <Badge variant={job.priority === 'high' ? 'danger' : job.priority === 'medium' ? 'warning' : 'default'}>
                    {job.priority} priority
                  </Badge>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedJob(job.id);
                  setShowJobDetail(true);
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">{job.progress || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#3B0A69] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${job.progress || 0}%` }}
                />
              </div>
            </div>

            {/* Job Details */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{job.client}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(job.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>${job.value?.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}

      {/* Modals */}
      {user?.role === 'admin' && (
        <CreateJobModal 
          isOpen={showCreateJob}
          onClose={() => setShowCreateJob(false)}
          onSubmit={handleCreateJob}
        />
      )}

      {showJobDetail && (
        <JobDetailView
          jobId={selectedJob}
          onClose={() => {
            setShowJobDetail(false);
            setSelectedJob(null);
            loadJobs(); // Refresh jobs when closing detail view
          }}
        />
      )}
    </div>
  );
};// Enhanced Job Detail View with Task Management
const JobDetailView = ({ jobId, onClose }) => {
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      const jobs = await firebase.getJobs();
      const jobData = jobs.find(j => j.id === parseInt(jobId));
      const [tasksData, milestonesData, approvalsData] = await Promise.all([
        firebase.getTasks(jobId),
        firebase.getMilestones(jobId),
        firebase.getApprovals(jobId)
      ]);

      setJob(jobData);
      setTasks(tasksData);
      setMilestones(milestonesData);
      setApprovals(approvalsData);
    } catch (error) {
      console.error('Error loading job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      await firebase.updateTask(jobId, taskId, updates);
      loadJobDetails();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await firebase.createTask(jobId, taskData);
      loadJobDetails();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Loading job details...</div>
    </div>;
  }

  if (!job) {
    return <div className="text-center text-gray-500">Job not found</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'pending': return 'warning';
      case 'blocked': return 'danger';
      default: return 'default';
    }
  };

  const calculateJobProgress = () => {
    if (tasks.length === 0) return 0;
    const totalWeight = tasks.reduce((sum, task) => sum + (task.weight || 1), 0);
    const completedWeight = tasks.reduce((sum, task) => {
      const weight = task.weight || 1;
      const progress = task.progress || 0;
      return sum + (weight * (progress / 100));
    }, 0);
    return Math.round((completedWeight / totalWeight) * 100);
  };

  const overallProgress = calculateJobProgress();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
            <p className="text-gray-600">{job.client} '95 Due: {new Date(job.dueDate).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={getStatusColor(job.status)}>{job.status}</Badge>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-gray-900">{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-[#3B0A69] h-3 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'tasks', label: `Tasks (${tasks.length})`, icon: Briefcase },
              { id: 'milestones', label: `Milestones (${milestones.length})`, icon: Calendar },
              { id: 'time', label: 'Time Tracking', icon: Clock },
              { id: 'approvals', label: `Approvals (${approvals.length})`, icon: CheckCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-[#3B0A69] text-[#3B0A69]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <JobOverviewTab job={job} tasks={tasks} milestones={milestones} />
          )}
          
          {activeTab === 'tasks' && (
            <TasksTab 
              tasks={tasks} 
              onTaskUpdate={handleTaskUpdate}
              onCreateTask={handleCreateTask}
              userRole={user?.role}
              jobId={jobId}
            />
          )}
          
          {activeTab === 'milestones' && (
            <MilestonesTab milestones={milestones} jobId={jobId} onUpdate={loadJobDetails} />
          )}
          
          {activeTab === 'time' && (
            <TimeTrackingTab tasks={tasks} jobId={jobId} userRole={user?.role} />
          )}
          
          {activeTab === 'approvals' && (
            <ApprovalsTab approvals={approvals} jobId={jobId} userRole={user?.role} onUpdate={loadJobDetails} />
          )}
        </div>
      </div>
    </div>
  );
};

// Job Overview Tab
const JobOverviewTab = ({ job, tasks, milestones }) => {
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const totalTimeLogged = tasks.reduce((sum, task) => sum + (task.totalHours || 0), 0);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Tasks Completed"
          value={`${completedTasks}/${tasks.length}`}
          icon={Briefcase}
          color="blue"
        />
        <MetricCard
          title="Milestones Hit"
          value={`${completedMilestones}/${milestones.length}`}
          icon={Calendar}
          color="green"
        />
        <MetricCard
          title="Time Logged"
          value={`${totalTimeLogged}h`}
          icon={Clock}
          color="purple"
        />
        <MetricCard
          title="Project Value"
          value={`${job.value?.toLocaleString()}`}
          icon={DollarSign}
          color="yellow"
        />
      </div>

      {/* Project Description */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Description</h3>
        <p className="text-gray-600">{job.description}</p>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {tasks.slice(0, 5).map((task) => (
            <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                task.status === 'completed' ? 'bg-green-500' :
                task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'
              }`} />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{task.title}</p>
                <p className="text-sm text-gray-500">
                  {task.status === 'completed' ? 'Completed' : `${task.progress}% complete`}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(task.updatedAt || task.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Tasks Tab
const TasksTab = ({ tasks, onTaskUpdate, onCreateTask, userRole, jobId }) => {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleStatusChange = async (task, newStatus) => {
    const updates = { status: newStatus };
    if (newStatus === 'completed') {
      updates.progress = 100;
      updates.completedAt = new Date().toISOString();
    }
    await onTaskUpdate(task.id, updates);
  };

  const handleProgressChange = async (task, newProgress) => {
    const updates = { progress: newProgress };
    if (newProgress === 100) {
      updates.status = 'completed';
      updates.completedAt = new Date().toISOString();
    } else if (newProgress > 0 && task.status === 'pending') {
      updates.status = 'in-progress';
    }
    await onTaskUpdate(task.id, updates);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Task Management</h3>
          <p className="text-gray-600">Break down work into manageable tasks</p>
        </div>
        {(userRole === 'admin' || userRole === 'contractor') && (
          <Button onClick={() => setShowCreateTask(true)}>
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-900">{task.title}</h4>
                  <Badge variant={getStatusColor(task.status)}>{task.status}</Badge>
                  {task.priority && (
                    <Badge variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'default'}>
                      {task.priority}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-3">{task.description}</p>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">{task.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#3B0A69] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${task.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* Task Details */}
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{task.assignedTo}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{task.estimatedHours}h estimated</span>
                  </div>
                  {task.totalHours && (
                    <div className="flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      <span>{task.totalHours}h logged</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Task Actions */}
              <div className="flex items-center gap-2">
                {task.status !== 'completed' && (userRole === 'admin' || task.assignedTo === user?.email) && (
                  <>
                    <select
                      value={task.progress || 0}
                      onChange={(e) => handleProgressChange(task, parseInt(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value={0}>0%</option>
                      <option value={25}>25%</option>
                      <option value={50}>50%</option>
                      <option value={75}>75%</option>
                      <option value={100}>100%</option>
                    </select>
                    
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </>
                )}
                
                <Button variant="ghost" size="sm" onClick={() => setEditingTask(task)}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {tasks.length === 0 && (
        <Card className="p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-600 mb-4">Break down this job into manageable tasks</p>
          {(userRole === 'admin' || userRole === 'contractor') && (
            <Button onClick={() => setShowCreateTask(true)}>
              <Plus className="w-4 h-4" />
              Create First Task
            </Button>
          )}
        </Card>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={showCreateTask || !!editingTask}
        onClose={() => {
          setShowCreateTask(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSubmit={editingTask ? onTaskUpdate : onCreateTask}
        jobId={jobId}
      />
    </div>
  );
};

// Milestones Tab
const MilestonesTab = ({ milestones, jobId, onUpdate }) => {
  const [showCreateMilestone, setShowCreateMilestone] = useState(false);

  const handleMilestoneUpdate = async (milestoneId, updates) => {
    try {
      await firebase.updateMilestone(jobId, milestoneId, updates);
      onUpdate();
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Milestones</h3>
          <p className="text-gray-600">Track key project deliverables and deadlines</p>
        </div>
        <Button onClick={() => setShowCreateMilestone(true)}>
          <Plus className="w-4 h-4" />
          Add Milestone
        </Button>
      </div>

      {/* Milestone Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="relative flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full border-4 border-white flex items-center justify-center z-10 ${
                milestone.status === 'completed' ? 'bg-green-500' :
                milestone.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
              }`}>
                {milestone.status === 'completed' && (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
              </div>
              
              <Card className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                    <p className="text-gray-600 mt-1">{milestone.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                      <span>Weight: {milestone.weight}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(milestone.status)}>
                      {milestone.status}
                    </Badge>
                    {milestone.status !== 'completed' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleMilestoneUpdate(milestone.id, { 
                          status: 'completed',
                          completedAt: new Date().toISOString()
                        })}
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {milestones.length === 0 && (
        <Card className="p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No milestones set</h3>
          <p className="text-gray-600 mb-4">Define key milestones to track project progress</p>
          <Button onClick={() => setShowCreateMilestone(true)}>
            <Plus className="w-4 h-4" />
            Create First Milestone
          </Button>
        </Card>
      )}
    </div>
  );
};

// Time Tracking Tab
const TimeTrackingTab = ({ tasks, jobId, userRole }) => {
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerStart, setTimerStart] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    loadTimeEntries();
  }, [tasks]);

  const loadTimeEntries = async () => {
    try {
      const allEntries = [];
      for (const task of tasks) {
        const entries = await firebase.getTimeEntries(task.id);
        allEntries.push(...entries.map(entry => ({ ...entry, taskTitle: task.title })));
      }
      setTimeEntries(allEntries.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
      console.error('Error loading time entries:', error);
    }
  };

  const startTimer = (taskId) => {
    setActiveTimer(taskId);
    setTimerStart(new Date());
  };

  const stopTimer = async () => {
    if (activeTimer && timerStart) {
      const endTime = new Date();
      const hours = (endTime - timerStart) / (1000 * 60 * 60);
      
      const entryData = {
        taskId: activeTimer,
        date: endTime.toISOString().split('T')[0],
        hours: Math.round(hours * 100) / 100,
        description: 'Timer session',
        contractor: user?.email
      };

      try {
        await firebase.createTimeEntry(activeTimer, entryData);
        setActiveTimer(null);
        setTimerStart(null);
        loadTimeEntries();
      } catch (error) {
        console.error('Error saving time entry:', error);
      }
    }
  };

  const totalTimeLogged = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Time Tracking</h3>
          <p className="text-gray-600">Log time spent on tasks and track productivity</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Time Logged</p>
            <p className="text-xl font-bold text-gray-900">{totalTimeLogged.toFixed(1)}h</p>
          </div>
          {userRole === 'contractor' && (
            <Button onClick={() => setShowTimeModal(true)}>
              <Plus className="w-4 h-4" />
              Log Time
            </Button>
          )}
        </div>
      </div>

      {/* Active Timer */}
      {activeTimer && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">Timer Running</p>
              <p className="text-sm text-blue-700">
                Task: {tasks.find(t => t.id === activeTimer)?.title}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <TimerDisplay startTime={timerStart} />
              <Button variant="danger" onClick={stopTimer}>
                Stop Timer
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Task Time Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                <p className="text-sm text-gray-600">
                  {task.totalHours || 0}h / {task.estimatedHours}h
                </p>
              </div>
              {userRole === 'contractor' && task.status !== 'completed' && (
                <div className="flex items-center gap-2">
                  {activeTimer === task.id ? (
                    <Button variant="danger" size="sm" onClick={stopTimer}>
                      Stop
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => startTimer(task.id)}>
                      Start
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedTask(task);
                      setShowTimeModal(true);
                    }}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  (task.totalHours || 0) > task.estimatedHours ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ 
                  width: `${Math.min(100, ((task.totalHours || 0) / task.estimatedHours) * 100)}%` 
                }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Time Entries List */}
      <Card className="overflow-hidden">
        <div className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Time Entries</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contractor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {timeEntries.slice(0, 10).map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{entry.taskTitle}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{entry.hours}h</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{entry.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{entry.contractor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Time Entry Modal */}
      <TimeEntryModal
        isOpen={showTimeModal}
        onClose={() => {
          setShowTimeModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        tasks={tasks}
        onSubmit={async (entryData) => {
          await firebase.createTimeEntry(entryData.taskId, entryData);
          loadTimeEntries();
        }}
      />
    </div>
  );
};

// Timer Display Component
const TimerDisplay = ({ startTime }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime.getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const hours = Math.floor(elapsed / (1000 * 60 * 60));
  const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

  return (
    <div className="font-mono text-lg font-bold text-blue-900">
      {hours.toString().padStart(2, '0')}:
      {minutes.toString().padStart(2, '0')}:
      {seconds.toString().padStart(2, '0')}
    </div>
  );
};// Enhanced Notification Dropdown with Multi-Channel Status
const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'invoice': return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'job': return <Briefcase className="w-4 h-4 text-purple-500" />;
      case 'schedule': return <Calendar className="w-4 h-4 text-orange-500" />;
      case 'payment': return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'system': return <Settings className="w-4 h-4 text-gray-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'normal': return 'border-l-blue-500 bg-blue-50';
      case 'low': return 'border-l-gray-500 bg-gray-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getDeliveryStatus = (notification) => {
    if (!notification.deliveryStatus) return null;
    
    const delivered = [];
    if (notification.deliveryStatus.browser) delivered.push('Browser');
    if (notification.deliveryStatus.email) delivered.push('Email');
    if (notification.deliveryStatus.sms) delivered.push('SMS');
    
    return delivered.length > 0 ? delivered.join(', ') : 'Failed';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={markAllAsRead}
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer border-l-4 ${
                      !notification.read ? getUrgencyColor(notification.urgency) : 'border-l-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                            {notification.title}
                          </p>
                          {notification.urgency && notification.urgency !== 'normal' && (
                            <Badge 
                              variant={notification.urgency === 'critical' ? 'danger' : 'warning'} 
                              size="sm"
                            >
                              {notification.urgency}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{new Date(notification.timestamp).toLocaleString()}</span>
                          {getDeliveryStatus(notification) && (
                            <span className="text-green-600">
                              Sent via: {getDeliveryStatus(notification)}
                            </span>
                          )}
                        </div>
                        {notification.actionUrl && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle action URL navigation
                              console.log('Navigate to:', notification.actionUrl);
                            }}
                          >
                            {notification.actionText || 'View Details'}
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Available Hours Management (Admin)
const AvailableHoursManagement = () => {
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState('');
  const [availableHours, setAvailableHours] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  useEffect(() => {
    loadContractors();
  }, []);

  useEffect(() => {
    if (selectedContractor) {
      loadAvailableHours();
    } else {
      setAvailableHours({});
    }
  }, [selectedContractor]);

  const loadContractors = async () => {
    try {
      const contractorsData = await firebase.getContractors();
      setContractors(contractorsData);
    } catch (error) {
      console.error('Error loading contractors:', error);
    }
  };

  const loadAvailableHours = async () => {
    if (!selectedContractor) return;
    
    setLoading(true);
    try {
      const hours = await firebase.getAvailableHours(selectedContractor);
      setAvailableHours(hours || {});
    } catch (error) {
      console.error('Error loading available hours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (dayKey) => {
    setAvailableHours(prev => {
      const newHours = { ...prev };
      if (newHours[dayKey] && newHours[dayKey].length > 0) {
        delete newHours[dayKey];
      } else {
        newHours[dayKey] = [{ start: '09:00', end: '17:00' }];
      }
      return newHours;
    });
  };

  const handleTimeRangeChange = (dayKey, index, field, value) => {
    setAvailableHours(prev => {
      const newHours = { ...prev };
      if (!newHours[dayKey]) {
        newHours[dayKey] = [];
      }
      if (!newHours[dayKey][index]) {
        newHours[dayKey][index] = { start: '09:00', end: '17:00' };
      }
      newHours[dayKey][index][field] = value;
      return newHours;
    });
  };

  const addTimeRange = (dayKey) => {
    setAvailableHours(prev => {
      const newHours = { ...prev };
      if (!newHours[dayKey]) {
        newHours[dayKey] = [];
      }
      newHours[dayKey].push({ start: '09:00', end: '17:00' });
      return newHours;
    });
  };

  const removeTimeRange = (dayKey, index) => {
    setAvailableHours(prev => {
      const newHours = { ...prev };
      if (newHours[dayKey]) {
        newHours[dayKey] = newHours[dayKey].filter((_, i) => i !== index);
        if (newHours[dayKey].length === 0) {
          delete newHours[dayKey];
        }
      }
      return newHours;
    });
  };

  const handleSave = async () => {
    if (!selectedContractor) {
      alert('Please select a contractor');
      return;
    }

    setSaving(true);
    try {
      await firebase.setAvailableHours(selectedContractor, availableHours);
      alert('Available hours saved successfully!');
    } catch (error) {
      console.error('Error saving available hours:', error);
      alert('Failed to save available hours. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Available Hours</h2>
        <p className="text-gray-600">Set available appointment hours for each contractor</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Contractor
        </label>
        <select
          value={selectedContractor}
          onChange={(e) => setSelectedContractor(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
        >
          <option value="">Select a contractor</option>
          {contractors.map(contractor => (
            <option key={contractor.id} value={contractor.email}>
              {contractor.name} - {contractor.email}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading available hours...</div>
        </div>
      )}

      {selectedContractor && !loading && (
        <div className="space-y-4">
          {daysOfWeek.map(day => {
            const dayHours = availableHours[day.key] || [];
            const isEnabled = dayHours.length > 0;

            return (
              <div key={day.key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => handleDayToggle(day.key)}
                      className="w-4 h-4 text-[#3B0A69] border-gray-300 rounded focus:ring-[#3B0A69]"
                    />
                    <span className="font-medium text-gray-900">{day.label}</span>
                  </label>
                  {isEnabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addTimeRange(day.key)}
                    >
                      <Plus className="w-4 h-4" />
                      Add Time Range
                    </Button>
                  )}
                </div>

                {isEnabled && (
                  <div className="space-y-2 ml-6">
                    {dayHours.map((range, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="time"
                          value={range.start}
                          onChange={(e) => handleTimeRangeChange(day.key, index, 'start', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                        />
                        <span className="text-gray-600">to</span>
                        <input
                          type="time"
                          value={range.end}
                          onChange={(e) => handleTimeRangeChange(day.key, index, 'end', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                        />
                        {dayHours.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTimeRange(day.key, index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Available Hours'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

// Specific Date Availability Management (Admin)
const SpecificDateAvailabilityManagement = () => {
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingDates, setExistingDates] = useState([]);
  const [viewMode, setViewMode] = useState('add'); // 'add' or 'manage'

  useEffect(() => {
    loadContractors();
  }, []);

  useEffect(() => {
    if (selectedContractor && viewMode === 'manage') {
      loadExistingDates();
    }
  }, [selectedContractor, viewMode]);

  const loadContractors = async () => {
    try {
      const contractorsData = await firebase.getContractors();
      setContractors(contractorsData);
    } catch (error) {
      console.error('Error loading contractors:', error);
    }
  };

  const loadExistingDates = async () => {
    if (!selectedContractor) return;
    
    setLoading(true);
    try {
      const dates = await firebase.getSpecificDateAvailability(selectedContractor);
      setExistingDates(dates || []);
    } catch (error) {
      console.error('Error loading existing dates:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = () => {
    setTimeSlots(prev => [...prev, { start: '09:00', end: '17:00' }]);
  };

  const removeTimeSlot = (index) => {
    setTimeSlots(prev => prev.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index, field, value) => {
    setTimeSlots(prev => {
      const newSlots = [...prev];
      if (!newSlots[index]) {
        newSlots[index] = { start: '09:00', end: '17:00' };
      }
      newSlots[index][field] = value;
      return newSlots;
    });
  };

  const handleSaveDate = async () => {
    if (!selectedContractor) {
      alert('Please select a contractor');
      return;
    }

    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    if (timeSlots.length === 0) {
      alert('Please add at least one time slot');
      return;
    }

    // Validate time slots
    for (const slot of timeSlots) {
      if (!slot.start || !slot.end) {
        alert('Please fill in all time slots');
        return;
      }
      if (slot.start >= slot.end) {
        alert('Start time must be before end time');
        return;
      }
    }

    setSaving(true);
    try {
      await firebase.setSpecificDateAvailability(selectedContractor, selectedDate, timeSlots);
      alert('Date availability saved successfully!');
      
      // Reset form
      setSelectedDate('');
      setTimeSlots([]);
      
      // Reload existing dates if in manage mode
      if (viewMode === 'manage') {
        loadExistingDates();
      }
    } catch (error) {
      console.error('Error saving date availability:', error);
      alert('Failed to save date availability. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDate = async (date) => {
    if (!confirm(`Are you sure you want to remove availability for ${date}?`)) {
      return;
    }

    try {
      await firebase.deleteSpecificDateAvailability(selectedContractor, date);
      alert('Date availability removed successfully!');
      loadExistingDates();
    } catch (error) {
      console.error('Error deleting date availability:', error);
      alert('Failed to remove date availability. Please try again.');
    }
  };

  const handleEditDate = (dateData) => {
    setSelectedDate(dateData.date);
    setTimeSlots(dateData.timeSlots || []);
    setViewMode('add');
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Specific Date Availability</h2>
        <p className="text-gray-600">Set available dates and times for clients to book appointments</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Contractor
        </label>
        <select
          value={selectedContractor}
          onChange={(e) => {
            setSelectedContractor(e.target.value);
            setSelectedDate('');
            setTimeSlots([]);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
        >
          <option value="">Select a contractor</option>
          {contractors.map(contractor => (
            <option key={contractor.id} value={contractor.email}>
              {contractor.name} - {contractor.email}
            </option>
          ))}
        </select>
      </div>

      {selectedContractor && (
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setViewMode('add')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'add'
                  ? 'bg-[#3B0A69] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Add New Date
            </button>
            <button
              onClick={() => {
                setViewMode('manage');
                loadExistingDates();
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'manage'
                  ? 'bg-[#3B0A69] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Manage Existing Dates
            </button>
          </div>

          {viewMode === 'add' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Available Time Slots
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addTimeSlot}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Time Slot
                  </Button>
                </div>

                {timeSlots.length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No time slots added. Click "Add Time Slot" to add availability.
                  </div>
                )}

                <div className="space-y-2">
                  {timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) => updateTimeSlot(index, 'start', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                      />
                      <span className="text-gray-600">to</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) => updateTimeSlot(index, 'end', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeSlot(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveDate}
                  disabled={saving || !selectedDate || timeSlots.length === 0}
                >
                  {saving ? 'Saving...' : 'Save Date Availability'}
                </Button>
              </div>
            </div>
          )}

          {viewMode === 'manage' && (
            <div>
              {loading && (
                <div className="text-center py-8">
                  <div className="text-gray-600">Loading existing dates...</div>
                </div>
              )}

              {!loading && existingDates.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-600">No specific dates set. Use "Add New Date" to set availability.</div>
                </div>
              )}

              {!loading && existingDates.length > 0 && (
                <div className="space-y-4">
                  {existingDates.map((dateData, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {new Date(dateData.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h3>
                          <div className="mt-2 space-y-1">
                            {dateData.timeSlots?.map((slot, slotIndex) => (
                              <div key={slotIndex} className="text-sm text-gray-600">
                                {slot.start} - {slot.end}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDate(dateData)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDate(dateData.date)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

// Notification Preferences Management Component
const NotificationPreferencesView = () => {
  const { preferences, updatePreferences } = useNotifications();
  const [localPreferences, setLocalPreferences] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showSESConfig, setShowSESConfig] = useState(false);
  const [showSNSConfig, setShowSNSConfig] = useState(false);

  useEffect(() => {
    if (preferences) {
      setLocalPreferences({ ...preferences });
    }
  }, [preferences]);

  const handleChannelChange = (channel, type, enabled) => {
    setLocalPreferences(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [type]: enabled
      }
    }));
  };

  const handleQuietHoursChange = (field, value) => {
    setLocalPreferences(prev => ({
      ...prev,
      quiet_hours: {
        enabled: prev.quiet_hours?.enabled || false,
        start: prev.quiet_hours?.start || '22:00',
        end: prev.quiet_hours?.end || '08:00',
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePreferences(localPreferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!localPreferences) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Loading preferences...</div>
    </div>;
  }

  // Ensure quiet_hours exists with proper structure
  if (!localPreferences.quiet_hours) {
    localPreferences.quiet_hours = {
      enabled: false,
      start: '22:00',
      end: '08:00'
    };
  }

  const notificationTypes = [
    { key: 'message', label: 'Messages', description: 'New messages and chat notifications' },
    { key: 'invoice', label: 'Invoices', description: 'Invoice updates and payment reminders' },
    { key: 'job', label: 'Jobs', description: 'Job assignments and status updates' },
    { key: 'payment', label: 'Payments', description: 'Payment confirmations and alerts' },
    { key: 'schedule', label: 'Schedule', description: 'Appointment reminders and changes' },
    { key: 'system', label: 'System', description: 'System maintenance and updates' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
        <p className="text-gray-600">Customize how and when you receive notifications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowSESConfig(true)}>
            <Mail className="w-4 h-4 mr-2" />
            Email Config
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowSNSConfig(true)}>
            <Phone className="w-4 h-4 mr-2" />
            SMS Config
          </Button>
        </div>
      </div>

      {/* Notification Channels */}
      <Card className="overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Channels</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Notification Type</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    <div className="flex items-center justify-center gap-2">
                      <Bell className="w-4 h-4" />
                      Browser
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      SMS
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {notificationTypes.map((type) => (
                  <tr key={type.key} className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={localPreferences.browser[type.key] || false}
                        onChange={(e) => handleChannelChange('browser', type.key, e.target.checked)}
                        className="w-4 h-4 text-[#3B0A69] border-gray-300 rounded focus:ring-[#3B0A69]"
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={localPreferences.email[type.key] || false}
                        onChange={(e) => handleChannelChange('email', type.key, e.target.checked)}
                        className="w-4 h-4 text-[#3B0A69] border-gray-300 rounded focus:ring-[#3B0A69]"
                      />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={localPreferences.sms[type.key] || false}
                        onChange={(e) => handleChannelChange('sms', type.key, e.target.checked)}
                        className="w-4 h-4 text-[#3B0A69] border-gray-300 rounded focus:ring-[#3B0A69]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Quiet Hours */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiet Hours</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={localPreferences.quiet_hours.enabled}
              onChange={(e) => handleQuietHoursChange('enabled', e.target.checked)}
              className="w-4 h-4 text-[#3B0A69] border-gray-300 rounded focus:ring-[#3B0A69]"
            />
            <label className="font-medium text-gray-900">Enable quiet hours</label>
          </div>
          
          {localPreferences.quiet_hours.enabled && (
            <div className="grid grid-cols-2 gap-4 ml-7">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={localPreferences.quiet_hours.start}
                  onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={localPreferences.quiet_hours?.end || '08:00'}
                  onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                />
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-500 ml-7">
            During quiet hours, only critical notifications will be sent via SMS and browser notifications will be silent.
          </p>
        </div>
      </Card>

      {/* Urgency Overrides */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Urgency Overrides</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={localPreferences.urgency_override.critical_always}
              onChange={(e) => setLocalPreferences(prev => ({
                ...prev,
                urgency_override: {
                  ...prev.urgency_override,
                  critical_always: e.target.checked
                }
              }))}
              className="w-4 h-4 text-[#3B0A69] border-gray-300 rounded focus:ring-[#3B0A69]"
            />
            <div>
              <label className="font-medium text-gray-900">Always send critical alerts</label>
              <p className="text-sm text-gray-500">Critical notifications bypass all preferences and quiet hours</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={localPreferences.urgency_override.high_during_hours}
              onChange={(e) => setLocalPreferences(prev => ({
                ...prev,
                urgency_override: {
                  ...prev.urgency_override,
                  high_during_hours: e.target.checked
                }
              }))}
              className="w-4 h-4 text-[#3B0A69] border-gray-300 rounded focus:ring-[#3B0A69]"
            />
            <div>
              <label className="font-medium text-gray-900">Send high priority during business hours</label>
              <p className="text-sm text-gray-500">High priority notifications bypass quiet hours during 9 AM - 6 PM</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          loading={saving}
          className="px-8"
        >
          Save Preferences
        </Button>
      </div>

      <SESConfigurationModal
        isOpen={showSESConfig}
        onClose={() => setShowSESConfig(false)}
      />
      
      <SNSConfigurationModal
        isOpen={showSNSConfig}
        onClose={() => setShowSNSConfig(false)}
      />
    </div>
  );
};

// Notification Analytics Dashboard
const NotificationAnalyticsView = () => {
  const { getAnalytics } = useNotifications();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getAnalytics(timeRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Loading analytics...</div>
    </div>;
  }

  if (!analytics) {
    return <div className="text-center text-gray-500">No analytics data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Analytics</h2>
          <p className="text-gray-600">Track notification delivery and engagement</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Notifications"
          value={analytics.total.toString()}
          icon={Bell}
          color="blue"
        />
        <MetricCard
          title="Unread"
          value={analytics.unread.toString()}
          icon={AlertCircle}
          color="yellow"
        />
        <MetricCard
          title="Browser Delivery"
          value={`${analytics.deliveryRate.browser}%`}
          icon={Bell}
          color="green"
        />
        <MetricCard
          title="Email Delivery"
          value={`${analytics.deliveryRate.email}%`}
          icon={Mail}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications by Type</h3>
          <div className="space-y-3">
            {Object.entries(analytics.byType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="capitalize text-gray-600">{type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#3B0A69] h-2 rounded-full"
                      style={{ width: `${(count / analytics.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 min-w-[30px]">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Success Rate</h3>
          <div className="space-y-4">
            {Object.entries(analytics.deliveryRate).map(([channel, rate]) => (
              <div key={channel} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="capitalize text-gray-600">{channel}</span>
                  <span className="font-medium text-gray-900">{rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      rate >= 90 ? 'bg-green-500' : 
                      rate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// Test Notification Component
const NotificationTestCenter = () => {
  const { createNotification, sendBulkNotification } = useNotifications();
  const { user } = useAuth();
  const [testData, setTestData] = useState({
    type: 'message',
    urgency: 'normal',
    title: 'Test Notification',
    message: 'This is a test notification to verify delivery channels.'
  });

  const sendTestNotification = async () => {
    try {
      await createNotification(testData);
      alert('Test notification sent successfully!');
    } catch (error) {
      alert('Failed to send test notification: ' + error.message);
    }
  };

  const sendPushTestNotification = async () => {
    try {
      const success = await pushNotificationService.sendTestNotification();
      if (success) {
        alert('Push notification test sent successfully!');
      } else {
        alert('Failed to send push notification test');
      }
    } catch (error) {
      alert('Failed to send push notification test: ' + error.message);
    }
  };

  const notificationTypes = ['message', 'invoice', 'job', 'payment', 'schedule', 'system'];
  const urgencyLevels = ['low', 'normal', 'high', 'critical'];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Notification Center</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={testData.type}
            onChange={(e) => setTestData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
          >
            {notificationTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
          <select
            value={testData.urgency}
            onChange={(e) => setTestData(prev => ({ ...prev, urgency: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
          >
            {urgencyLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={testData.title}
          onChange={(e) => setTestData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          value={testData.message}
          onChange={(e) => setTestData(prev => ({ ...prev, message: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
          rows={3}
        />
      </div>

      <div className="space-y-3">
        <Button onClick={sendTestNotification} className="w-full">
          <Send className="w-4 h-4" />
          Send Test Notification
        </Button>
        
        <Button 
          onClick={sendPushTestNotification} 
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Bell className="w-4 h-4" />
          Send Push Notification Test
        </Button>
      </div>
    </Card>
  );
};// Calendar and Scheduling Components
const ScheduleView = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('calendar');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, [user, selectedDate]);

  const loadEvents = async () => {
    try {
      let filters = {};
      
      if (user?.role === 'contractor') {
        filters.contractorEmail = user.email;
      } else if (user?.role === 'client') {
        filters.clientEmail = user.email;
      }

      const eventsData = await firebase.getScheduleEvents(filters);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      await firebase.createScheduleEvent(eventData);
      loadEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      alert(error.message);
    }
  };

  const handleUpdateEvent = async (eventId, updates) => {
    try {
      await firebase.updateScheduleEvent(eventId, updates);
      loadEvents();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Loading schedule...</div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Schedule Management</h2>
          <p className="text-gray-600">Manage appointments and track project timelines</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-gray-200">
            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                currentView === 'calendar' 
                  ? 'bg-[#3B0A69] text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setCurrentView('timeline')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                currentView === 'timeline' 
                  ? 'bg-[#3B0A69] text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Timeline
            </button>
          </div>
          {user?.role === 'admin' && (
            <Button onClick={() => setShowEventModal(true)}>
              <Plus className="w-4 h-4" />
              Schedule Appointment
            </Button>
          )}
        </div>
      </div>

      {/* View Content */}
      {currentView === 'calendar' ? (
        <CalendarView 
          events={events}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onEventClick={(event) => {
            setSelectedEvent(event);
            setShowEventModal(true);
          }}
          userRole={user?.role}
        />
      ) : (
        <TimelineView userRole={user?.role} />
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}
        userRole={user?.role}
      />
    </div>
  );
};

const CalendarView = ({ events, selectedDate, onDateSelect, onEventClick, userRole }) => {
  const [viewMode, setViewMode] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'scheduled': return 'bg-purple-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  return (
    <Card className="p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronDown className="w-5 h-5 rotate-90" />
          </button>
          <h3 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronDown className="w-5 h-5 -rotate-90" />
          </button>
        </div>
        
        <Button
          variant="ghost"
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {days.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isToday = date && date.toDateString() === new Date().toDateString();
          const isSelected = date && date.toDateString() === selectedDate.toDateString();
          
          return (
            <div
              key={index}
              onClick={() => date && onDateSelect(date)}
              className={`bg-white p-2 min-h-[120px] cursor-pointer hover:bg-gray-50 transition-colors ${
                isSelected ? 'ring-2 ring-[#3B0A69]' : ''
              }`}
            >
              {date && (
                <>
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-[#3B0A69] font-bold' : 'text-gray-900'
                  }`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className={`text-xs text-white p-1 rounded truncate cursor-pointer hover:opacity-80 ${getEventColor(event.status)}`}
                        title={event.title}
                      >
                        {new Date(event.startTime).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Cancelled</span>
        </div>
      </div>
    </Card>
  );
};

const TimelineView = ({ userRole }) => {
  const [timelines, setTimelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewRange, setViewRange] = useState('month');

  useEffect(() => {
    loadTimelines();
  }, []);

  const loadTimelines = async () => {
    try {
      const timelinesData = await firebase.getProjectTimelines();
      setTimelines(timelinesData);
    } catch (error) {
      console.error('Error loading timelines:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimelineWidth = (timeline) => {
    const now = new Date();
    const rangeStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const rangeEnd = new Date(now.getFullYear(), now.getMonth() + 4, 0);
    const totalDays = Math.ceil((rangeEnd - rangeStart) / (1000 * 60 * 60 * 24));
    
    const projectStart = Math.max(timeline.startDate.getTime(), rangeStart.getTime());
    const projectEnd = Math.min(timeline.endDate.getTime(), rangeEnd.getTime());
    const projectDays = Math.ceil((projectEnd - projectStart) / (1000 * 60 * 60 * 24));
    
    const startOffset = Math.ceil((projectStart - rangeStart.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      width: `${(projectDays / totalDays) * 100}%`,
      left: `${(startOffset / totalDays) * 100}%`
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Loading timeline...</div>
    </div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Project Timeline View</h3>
        <select
          value={viewRange}
          onChange={(e) => setViewRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
      </div>

      {/* Timeline Header */}
      <div className="grid grid-cols-12 gap-2 mb-4 text-xs text-gray-500 border-b pb-2">
        {Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - 2 + i);
          return (
            <div key={i} className="text-center">
              {date.toLocaleDateString('en-US', { month: 'short' })}
            </div>
          );
        })}
      </div>

      {/* Timeline Items */}
      <div className="space-y-4">
        {timelines.map(timeline => {
          const { width, left } = getTimelineWidth(timeline);
          
          return (
            <div key={timeline.id} className="flex items-center gap-4">
              {/* Project Info */}
              <div className="w-64 flex-shrink-0">
                <h4 className="font-medium text-gray-900 truncate">{timeline.title}</h4>
                <p className="text-sm text-gray-600">{timeline.client}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default" className={getStatusColor(timeline.status)}>
                    {timeline.status}
                  </Badge>
                  <span className="text-xs text-gray-500">{timeline.progress}%</span>
                </div>
              </div>

              {/* Timeline Bar */}
              <div className="flex-1 relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className={`absolute top-0 h-full rounded-lg ${getStatusColor(timeline.status)} opacity-80`}
                  style={{ width, left }}
                >
                  <div
                    className="h-full bg-green-500 rounded-lg"
                    style={{ width: `${timeline.progress}%` }}
                  />
                </div>
                
                {/* Events markers */}
                {timeline.events.map(event => {
                  const eventDate = new Date(event.startTime);
                  const now = new Date();
                  const rangeStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
                  const totalDays = 180; // 6 months
                  const eventDays = Math.ceil((eventDate - rangeStart) / (1000 * 60 * 60 * 24));
                  const eventLeft = `${(eventDays / totalDays) * 100}%`;
                  
                  return (
                    <div
                      key={event.id}
                      className="absolute top-0 w-1 h-full bg-red-500"
                      style={{ left: eventLeft }}
                      title={event.title}
                    />
                  );
                })}
              </div>

              {/* Duration */}
              <div className="w-20 text-sm text-gray-600 text-right">
                {timeline.duration} days
              </div>
            </div>
          );
        })}
      </div>

      {timelines.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects to display</h3>
          <p className="text-gray-600">Create some jobs to see project timelines</p>
        </div>
      )}
    </Card>
  );
};

const EventModal = ({ isOpen, onClose, event, onSubmit, userRole }) => {
  const [formData, setFormData] = useState({
    title: '',
    jobId: '',
    clientEmail: '',
    clientName: '',
    assignedTo: '',
    contractorName: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    status: 'scheduled'
  });
  const [jobs, setJobs] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [conflictCheck, setConflictCheck] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadJobsAndContractors();
      if (event) {
        setFormData({
          title: event.title || '',
          jobId: event.jobId || '',
          clientEmail: event.clientEmail || '',
          clientName: event.clientName || '',
          assignedTo: event.assignedTo || '',
          contractorName: event.contractorName || '',
          startTime: event.startTime ? new Date(event.startTime).toISOString().slice(0, 16) : '',
          endTime: event.endTime ? new Date(event.endTime).toISOString().slice(0, 16) : '',
          location: event.location || '',
          description: event.description || '',
          status: event.status || 'scheduled'
        });
      }
    }
  }, [isOpen, event]);

  useEffect(() => {
    if (formData.assignedTo && formData.startTime) {
      checkAvailability();
    }
  }, [formData.assignedTo, formData.startTime]);

  const loadJobsAndContractors = async () => {
    try {
      const [jobsData, contractorsData] = await Promise.all([
        firebase.getJobs(),
        firebase.getContractors()
      ]);
      setJobs(jobsData);
      setContractors(contractorsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const checkAvailability = async () => {
    if (!formData.assignedTo || !formData.startTime) return;

    try {
      const startDate = new Date(formData.startTime);
      const slots = await firebase.getAvailableTimeSlots(
        formData.assignedTo, 
        startDate.toDateString()
      );
      setAvailableSlots(slots);

      // Check for conflicts
      const conflicts = await firebase.checkScheduleConflicts({
        ...formData,
        id: event?.id,
        startTime: formData.startTime,
        endTime: formData.endTime
      });
      setConflictCheck(conflicts);
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const handleJobChange = (jobId) => {
    const selectedJob = jobs.find(job => job.id === parseInt(jobId));
    if (selectedJob) {
      setFormData(prev => ({
        ...prev,
        jobId,
        title: selectedJob.title,
        clientEmail: selectedJob.clientEmail,
        clientName: selectedJob.client,
        assignedTo: selectedJob.contractorEmail || '',
        contractorName: selectedJob.contractor || ''
      }));
    }
  };

  const handleContractorChange = (contractorEmail) => {
    const selectedContractor = contractors.find(c => c.email === contractorEmail);
    if (selectedContractor) {
      setFormData(prev => ({
        ...prev,
        assignedTo: contractorEmail,
        contractorName: selectedContractor.name
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (conflictCheck && conflictCheck.length > 0) {
      alert('Schedule conflict detected. Please choose a different time.');
      return;
    }

    const eventData = {
      ...formData,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString()
    };

    if (event) {
      onSubmit(event.id, eventData);
    } else {
      onSubmit(eventData);
    }
    
    onClose();
  };

  const setEndTimeFromStart = (startTime) => {
    if (startTime) {
      const start = new Date(startTime);
      const end = new Date(start.getTime() + (2 * 60 * 60 * 1000)); // Add 2 hours
      setFormData(prev => ({
        ...prev,
        startTime,
        endTime: end.toISOString().slice(0, 16)
      }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event ? 'Edit Appointment' : 'Schedule New Appointment'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Related Job (optional)
          </label>
          <select
            value={formData.jobId}
            onChange={(e) => handleJobChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
          >
            <option value="">Select a job</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title} - {job.client}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Email
            </label>
            <input
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigned Contractor
          </label>
          <select
            value={formData.assignedTo}
            onChange={(e) => handleContractorChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            required
          >
            <option value="">Select contractor</option>
            {contractors.map(contractor => (
              <option key={contractor.id} value={contractor.email}>{contractor.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setEndTimeFromStart(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Availability Check */}
        {conflictCheck && conflictCheck.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Schedule Conflict Detected</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              Contractor has another appointment at this time. Please choose a different slot.
            </p>
          </div>
        )}

        {/* Available Slots */}
        {availableSlots.length > 0 && formData.assignedTo && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Available Time Slots</h4>
            <div className="grid grid-cols-2 gap-2">
              {availableSlots.slice(0, 6).map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      startTime: slot.start.toISOString().slice(0, 16),
                      endTime: slot.end.toISOString().slice(0, 16)
                    }));
                  }}
                  className="text-sm px-3 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                >
                  {slot.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {slot.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            placeholder="Office address or 'Remote'"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
          >
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            rows={3}
            placeholder="Additional details about the appointment..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            className="flex-1"
            disabled={conflictCheck && conflictCheck.length > 0}
          >
            {event ? 'Update' : 'Schedule'} Appointment
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Client Booking Portal
const ClientBookingView = () => {
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState('');
  const [selectedContractor, setSelectedContractor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    title: '',
    description: '',
    location: '',
    urgency: 'normal'
  });
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(false);

  const services = [
    { id: 'network', name: 'Network Setup & Configuration', duration: 4 },
    { id: 'security', name: 'Security Audit & Assessment', duration: 6 },
    { id: 'maintenance', name: 'System Maintenance', duration: 2 },
    { id: 'consulting', name: 'IT Consultation', duration: 1 },
    { id: 'support', name: 'Technical Support', duration: 2 },
    { id: 'cloud', name: 'Cloud Migration', duration: 8 }
  ];

  useEffect(() => {
    loadContractors();
  }, []);

  useEffect(() => {
    if (selectedContractor && selectedDate && selectedService) {
      loadAvailableSlots();
    } else {
      setAvailableSlots([]);
      setSelectedSlot(null);
    }
  }, [selectedContractor, selectedDate, selectedService]);

  const loadContractors = async () => {
    try {
      const contractorsData = await firebase.getContractors();
      setContractors(contractorsData);
    } catch (error) {
      console.error('Error loading contractors:', error);
      alert('Failed to load contractors. Please refresh the page.');
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedContractor || !selectedDate || !selectedService) {
      setAvailableSlots([]);
      return;
    }
    
    setLoading(true);
    try {
      const service = services.find(s => s.id === selectedService);
      const duration = service?.duration || 2;
      
      const slots = await firebase.getAvailableTimeSlots(
        selectedContractor,
        selectedDate,
        duration
      );
      setAvailableSlots(slots);
      
      if (slots.length === 0) {
        alert('No available time slots for the selected date and contractor. Please try a different date or contractor.');
      }
    } catch (error) {
      console.error('Error loading available slots:', error);
      alert('Failed to load available time slots. Please try again.');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedService) {
      alert('Please select a service');
      return;
    }

    if (!selectedContractor || selectedContractor === '') {
      alert('Please select a technician');
      return;
    }

    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }

    if (!user?.email) {
      alert('You must be logged in to book an appointment');
      return;
    }

    const service = services.find(s => s.id === selectedService);
    if (!service) {
      alert('Please select a valid service');
      return;
    }

    const contractor = contractors.find(c => c.email === selectedContractor);
    
    if (!contractor) {
      alert('Selected contractor not found. Please select a different technician.');
      return;
    }

    try {
      // Validate slot has proper date objects
      if (!selectedSlot.start || !selectedSlot.end) {
        throw new Error('Invalid time slot selected');
      }

      const appointmentData = {
        title: bookingDetails.title ? `${service.name} - ${bookingDetails.title}` : service.name,
        jobId: null,
        clientEmail: user.email,
        clientName: user.displayName || user.email,
        assignedTo: selectedContractor,
        contractorName: contractor?.name || 'Unassigned',
        startTime: selectedSlot.start.toISOString(),
        endTime: selectedSlot.end.toISOString(),
        location: bookingDetails.location || 'To be determined',
        description: bookingDetails.description 
          ? `${service.name}\n\nClient Notes: ${bookingDetails.description}`
          : service.name,
        status: 'scheduled',
        urgency: bookingDetails.urgency || 'normal'
      };

      await firebase.createScheduleEvent(appointmentData);
      
      // Reset form
      setSelectedService('');
      setSelectedContractor('');
      setSelectedDate('');
      setSelectedSlot(null);
      setAvailableSlots([]);
      setBookingDetails({
        title: '',
        description: '',
        location: '',
        urgency: 'normal'
      });

      alert('Appointment booked successfully! You will receive a confirmation shortly.');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert(error.message || 'Failed to book appointment. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Book Your IT Service</h2>
        <p className="text-gray-600">Schedule an appointment with our expert technicians</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Service Selection */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Select Service</h3>
          <div className="space-y-3">
            {services.map(service => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`w-full text-left p-3 border rounded-lg transition-colors ${
                  selectedService === service.id
                    ? 'border-[#3B0A69] bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{service.name}</div>
                <div className="text-sm text-gray-500">~{service.duration} hours</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Contractor & Date Selection */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Choose Date & Technician</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Technician
              </label>
              <select
                value={selectedContractor}
                onChange={(e) => setSelectedContractor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              >
                <option value="">Any available technician</option>
                {contractors.map(contractor => (
                  <option key={contractor.id} value={contractor.email}>
                    {contractor.name} - {contractor.specialties.join(', ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              />
            </div>

            {!selectedContractor && selectedDate && (
              <div className="text-center py-4">
                <div className="text-sm text-amber-600">Please select a technician to see available time slots</div>
              </div>
            )}

            {!selectedDate && (
              <div className="text-center py-4">
                <div className="text-sm text-amber-600">Please select a date to see available time slots</div>
              </div>
            )}

            {loading && (
              <div className="text-center py-4">
                <div className="text-sm text-gray-600">Loading available times...</div>
              </div>
            )}

            {availableSlots.length === 0 && selectedContractor && selectedDate && !loading && (
              <div className="text-center py-4">
                <div className="text-sm text-gray-600">No available time slots for this date. Please try another date.</div>
              </div>
            )}

            {availableSlots.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map((slot, index) => {
                    const isSelected = selectedSlot && 
                      selectedSlot.start?.getTime() === slot.start?.getTime() &&
                      selectedSlot.end?.getTime() === slot.end?.getTime();
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedSlot(slot)}
                        className={`text-sm px-3 py-2 border rounded-lg transition-colors ${
                          isSelected
                            ? 'border-[#3B0A69] bg-purple-50 text-[#3B0A69] font-semibold'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {slot.start.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Booking Details */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Booking Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brief Title
              </label>
              <input
                type="text"
                value={bookingDetails.title}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                placeholder="e.g., Office network setup"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={bookingDetails.location}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                placeholder="Your office address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency
              </label>
              <select
                value={bookingDetails.urgency}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, urgency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              >
                <option value="low">Low - Can wait</option>
                <option value="normal">Normal - Standard timing</option>
                <option value="high">High - Urgent</option>
                <option value="critical">Critical - Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Details
              </label>
              <textarea
                value={bookingDetails.description}
                onChange={(e) => setBookingDetails(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                rows={3}
                placeholder="Describe your requirements..."
              />
            </div>

            <Button
              onClick={handleBookAppointment}
              className="w-full"
              disabled={!selectedService || !selectedSlot}
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};// Advanced Analytics Dashboard
const AnalyticsView = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('12m');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      const data = await firebase.getAnalyticsData();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Loading analytics...</div>
    </div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into your business performance</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
        >
          <option value="1m">Last Month</option>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="12m">Last 12 Months</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`${analyticsData.totalRevenue.toLocaleString()}`}
          change="+23.5%"
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Average Job Value"
          value={`${analyticsData.averageJobValue.toLocaleString()}`}
          change="+12.3%"
          icon={TrendingUp}
          color="blue"
        />
        <MetricCard
          title="Client Retention"
          value={`${analyticsData.clientRetentionRate}%`}
          change="+4.2%"
          icon={Users}
          color="purple"
        />
        <MetricCard
          title="Avg Response Time"
          value={`${analyticsData.averageResponseTime}h`}
          change="-15.3%"
          icon={Clock}
          color="yellow"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <Badge variant="success">+23.5% vs last year</Badge>
          </div>
          <div className="h-80">
            <ChartContainer width="100%" height="100%">
              <LineChart data={analyticsData.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value) => [`${value.toLocaleString()}`, 'Revenue']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B0A69" 
                  strokeWidth={3}
                  dot={{ fill: '#3B0A69', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B0A69', strokeWidth: 2 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </Card>

        {/* Job Status Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Job Status Distribution</h3>
          </div>
          <div className="h-80">
            <ChartContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.jobStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="count"
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {analyticsData.jobStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, 'Jobs']}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ChartContainer>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Client Satisfaction */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Client Satisfaction</h3>
            <Badge variant="success">4.7/5.0 Average</Badge>
          </div>
          <div className="h-80">
            <ChartContainer width="100%" height="100%">
              <AreaChart data={analyticsData.clientSatisfaction}>
                <defs>
                  <linearGradient id="satisfactionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  domain={[3.5, 5]}
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value) => [value.toFixed(1), 'Score']}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#satisfactionGradient)" 
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </Card>

        {/* Contractor Performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Contractor Performance</h3>
          </div>
          <div className="h-80">
            <ChartContainer width="100%" height="100%">
              <BarChart data={analyticsData.contractorPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'completedJobs' ? value : `${value.toFixed(1)}%`,
                    name === 'completedJobs' ? 'Completed Jobs' : 'Efficiency'
                  ]}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="completedJobs" fill="#3B0A69" name="completedJobs" />
                <Bar dataKey="efficiency" fill="#8B5CF6" name="efficiency" />
              </BarChart>
            </ChartContainer>
          </div>
        </Card>
      </div>

      {/* Performance Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Contractor Detailed Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contractor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed Jobs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analyticsData.contractorPerformance.map((contractor, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{contractor.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {contractor.completedJobs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-900">{contractor.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${contractor.efficiency}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{contractor.efficiency.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={contractor.efficiency > 90 ? 'success' : contractor.efficiency > 80 ? 'warning' : 'danger'}>
                      {contractor.efficiency > 90 ? 'Excellent' : contractor.efficiency > 80 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// File Management Components
const FileManagementView = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.email) {
    loadFiles();
    }
  }, [user?.email, filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadFiles = async () => {
    try {
      let filters = {};
      
      if (user?.role === 'client') {
        filters.clientEmail = user.email;
      } else if (user?.role === 'contractor') {
        filters.uploadedBy = user.email;
      }

      const filesData = await firebase.getFiles(filters);
      setFiles(filesData);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (fileData) => {
    try {
      await firebase.uploadFile({
        ...fileData,
        uploadedBy: user?.email
      });
      loadFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await firebase.deleteFile(fileId);
      loadFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleDownloadFile = async (file) => {
    try {
      if (file.url) {
        // If file has a URL, open it in a new tab
        window.open(file.url, '_blank');
      } else {
        // Otherwise, try to get the file from Firebase storage
        const fileUrl = await firebase.getFileUrl(file.id);
        if (fileUrl) {
          window.open(fileUrl, '_blank');
        } else {
          alert('File download not available');
        }
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || file.category === filter;
    return matchesSearch && matchesFilter;
  });

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes('image')) return <Upload className="w-5 h-5 text-green-500" />;
    if (type.includes('json') || type.includes('xml')) return <Settings className="w-5 h-5 text-blue-500" />;
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'documentation': return 'bg-blue-100 text-blue-800';
      case 'reports': return 'bg-green-100 text-green-800';
      case 'configuration': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Loading files...</div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">File Management</h2>
          <p className="text-gray-600">Organize and share project documents securely</p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Upload className="w-4 h-4" />
          Upload File
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="documentation">Documentation</option>
            <option value="reports">Reports</option>
            <option value="configuration">Configuration</option>
          </select>
        </div>
      </Card>

      {/* File Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Files"
          value={files.length.toString()}
          icon={FileText}
          color="blue"
        />
        <MetricCard
          title="Documentation"
          value={files.filter(f => f.category === 'documentation').length.toString()}
          icon={FileText}
          color="green"
        />
        <MetricCard
          title="Reports"
          value={files.filter(f => f.category === 'reports').length.toString()}
          icon={BarChart3}
          color="purple"
        />
        <MetricCard
          title="Configuration"
          value={files.filter(f => f.category === 'configuration').length.toString()}
          icon={Settings}
          color="yellow"
        />
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                  <p className="text-sm text-gray-500">{file.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDownloadFile(file)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                {(user?.role === 'admin' || file.uploadedBy === user?.email) && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Badge variant="default" className={getCategoryColor(file.category)}>
                {file.category}
              </Badge>
              <div className="text-sm text-gray-600">
                <p>Uploaded by: {file.uploadedBy}</p>
                <p>{new Date(file.uploadedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <Card className="p-12 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'No files match your search criteria' : 'Upload your first file to get started'}
          </p>
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4" />
            Upload File
          </Button>
        </Card>
      )}

      <FileUploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
};

const FileUploadModal = ({ isOpen, onClose, onUpload }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    type: '',
    category: 'documentation',
    jobId: '',
    clientEmail: '',
    description: ''
  });
  const [jobs, setJobs] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadJobsAndClients();
    }
  }, [isOpen]);

  const loadJobsAndClients = async () => {
    try {
      const [jobsData, clientsData] = await Promise.all([
        firebase.getJobs(),
        firebase.getClients()
      ]);
      setJobs(jobsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload(formData);
    onClose();
    setFormData({
      name: '',
      size: '',
      type: '',
      category: 'documentation',
      jobId: '',
      clientEmail: '',
      description: ''
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type
      }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload File">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select File
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            >
              <option value="documentation">Documentation</option>
              <option value="reports">Reports</option>
              <option value="configuration">Configuration</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related Job (optional)
            </label>
            <select
              value={formData.jobId}
              onChange={(e) => setFormData(prev => ({ ...prev, jobId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            >
              <option value="">No job selected</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Access (optional)
          </label>
          <select
            value={formData.clientEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
          >
            <option value="">No client access</option>
            {clients.map(client => (
              <option key={client.id} value={client.email}>{client.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            rows={3}
            placeholder="Brief description of the file..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            Upload File
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Add Charts import (mock implementation for this demo)

// Add Charts import (mock implementation for this demo)
const ChartContainer = ({ children, width, height }) => (
  <div style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </div>
);

const LineChart = ({ data, children }) => (
  <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
    <div className="text-center text-gray-500">
      <TrendingUp className="w-12 h-12 mx-auto mb-2" />
      <p>Revenue Trend Chart</p>
      <p className="text-sm">({data?.length || 0} data points)</p>
    </div>
  </div>
);

const PieChart = ({ children }) => (
  <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
    <div className="text-center text-gray-500">
      <BarChart3 className="w-12 h-12 mx-auto mb-2" />
      <p>Job Status Distribution</p>
    </div>
  </div>
);

const AreaChart = ({ data, children }) => (
  <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
    <div className="text-center text-gray-500">
      <Activity className="w-12 h-12 mx-auto mb-2" />
      <p>Client Satisfaction Trend</p>
      <p className="text-sm">({data?.length || 0} data points)</p>
    </div>
  </div>
);

const BarChart = ({ data, children }) => (
  <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
    <div className="text-center text-gray-500">
      <Users className="w-12 h-12 mx-auto mb-2" />
      <p>Contractor Performance</p>
      <p className="text-sm">({data?.length || 0} contractors)</p>
    </div>
  </div>
);

const CartesianGrid = () => null;
const XAxis = () => null;
const YAxis = () => null;
const Tooltip = () => null;
const Line = () => null;
const Pie = () => null;
const Cell = () => null;
const Area = () => null;
const Bar = () => null;

// Email System Components
const EmailView = () => {
  const { user } = useAuth();
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [showCompose, setShowCompose] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [emailStats, setEmailStats] = useState({});
  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const [showSESConfig, setShowSESConfig] = useState(false);

  useEffect(() => {
    loadEmails();
    loadEmailStats();
  }, [user, currentFolder]);

  const loadEmails = async () => {
    try {
      setLoading(true);
      const emailsData = await firebase.getEmails(user?.email, currentFolder);
      setEmails(emailsData);
    } catch (error) {
      console.error('Error loading emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmailStats = async () => {
    try {
      const stats = await firebase.getEmailStats(user?.email);
      setEmailStats(stats);
    } catch (error) {
      console.error('Error loading email stats:', error);
    }
  };

  const handleSendEmail = async (emailData) => {
    try {
      await firebase.sendEmail({
        ...emailData,
        from: user?.email,
        fromName: user?.displayName || user?.email
      });
      setShowCompose(false);
      loadEmails();
      loadEmailStats();
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleSaveDraft = async (draftData) => {
    try {
      await firebase.saveDraft({
        ...draftData,
        from: user?.email
      });
      setShowCompose(false);
      loadEmails();
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleDeleteEmail = async (emailId) => {
    try {
      await firebase.deleteEmail(emailId, user?.email);
      loadEmails();
      loadEmailStats();
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  const handleMarkAsRead = async (emailId) => {
    try {
      await firebase.markEmailAsRead(emailId, user?.email);
      loadEmails();
      loadEmailStats();
    } catch (error) {
      console.error('Error marking email as read:', error);
    }
  };

  const handleBulkAction = async (action) => {
    try {
      for (const emailId of selectedEmails) {
        if (action === 'delete') {
          await firebase.deleteEmail(emailId, user?.email);
        } else if (action === 'mark-read') {
          await firebase.markEmailAsRead(emailId, user?.email);
        }
      }
      setSelectedEmails(new Set());
      loadEmails();
      loadEmailStats();
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getEmailIcon = (type) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'notification': return <Bell className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const filteredEmails = emails.filter(email => 
    email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.to?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.body?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
  return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#3B0A69] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading emails...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Email Sidebar */}
      <div className="w-1/4 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Email</h2>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowSESConfig(true)}>
                <Settings className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={() => setShowCompose(true)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Email Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">{emailStats.unread || 0}</div>
              <div className="text-xs text-blue-500">Unread</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-600">{emailStats.total || 0}</div>
              <div className="text-xs text-green-500">Total</div>
            </div>
          </div>
        </div>

        {/* Folders */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
      <button
              onClick={() => setCurrentFolder('inbox')}
              className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                currentFolder === 'inbox' ? 'bg-[#3B0A69] text-white' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4" />
                <span>Inbox</span>
                {emailStats.unread > 0 && (
                  <Badge size="sm" className="ml-auto bg-red-500 text-white">
                    {emailStats.unread}
                  </Badge>
                )}
              </div>
      </button>

            <button
              onClick={() => setCurrentFolder('sent')}
              className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                currentFolder === 'sent' ? 'bg-[#3B0A69] text-white' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>Sent</span>
              </div>
            </button>
            
            <button
              onClick={() => setCurrentFolder('drafts')}
              className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                currentFolder === 'drafts' ? 'bg-[#3B0A69] text-white' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Drafts</span>
              </div>
            </button>
            
            <button
              onClick={() => setCurrentFolder('trash')}
              className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                currentFolder === 'trash' ? 'bg-[#3B0A69] text-white' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span>Trash</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emails..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            />
          </div>
          
          {selectedEmails.size > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <Button size="sm" onClick={() => handleBulkAction('mark-read')}>
                <Check className="w-4 h-4" />
                  </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')}>
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedEmails(new Set())}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
            </div>

        <div className="flex-1 overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Mail className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No emails found</p>
                </div>
              ) : (
            filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedEmail?.id === email.id ? 'bg-blue-50 border-blue-200' : ''
                } ${!email.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedEmails.has(email.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedEmails);
                        if (e.target.checked) {
                          newSelected.add(email.id);
                        } else {
                          newSelected.delete(email.id);
                        }
                        setSelectedEmails(newSelected);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded"
                    />
                    <div className="w-8 h-8 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-xs">
                        {(email.from || email.to || '?').charAt(0).toUpperCase()}
                      </span>
                    </div>
                      <div className="flex-1 min-w-0">
                      <h3 className={`font-medium text-gray-900 truncate ${!email.read ? 'font-semibold' : ''}`}>
                        {currentFolder === 'sent' ? (
                          <a 
                            href={`mailto:${email.to}`} 
                            className="hover:text-[#3B0A69] transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {email.to}
                          </a>
                        ) : (
                          <a 
                            href={`mailto:${email.from}`} 
                            className="hover:text-[#3B0A69] transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {email.from}
                          </a>
                        )}
                      </h3>
                      <p className={`text-sm text-gray-600 truncate ${!email.read ? 'font-semibold' : ''}`}>
                        {email.subject}
                        </p>
                      </div>
                    </div>
                  <div className="flex items-center gap-1">
                    {!email.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                    <span className="text-xs text-gray-400">{formatDate(email.sentAt || email.createdAt)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate">{email.body?.substring(0, 100)}...</p>
                  </div>
                ))
              )}
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col">
        {selectedEmail ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedEmail.subject}</h3>
                  <p className="text-sm text-gray-600">
                    From: {selectedEmail.from} • To: {selectedEmail.to}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(selectedEmail.id)}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowCompose(true)}>
                    <Reply className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteEmail(selectedEmail.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose max-w-none">
                <div className="mb-4 text-sm text-gray-500">
                  {formatDate(selectedEmail.sentAt || selectedEmail.createdAt)}
                </div>
                <div className="whitespace-pre-wrap">{selectedEmail.body}</div>
            </div>
          </div>
        </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select an email</h3>
              <p className="text-gray-600">Choose an email from the list to view its content</p>
            </div>
          </div>
        )}
      </div>

      <ComposeEmailModal
        isOpen={showCompose}
        onClose={() => setShowCompose(false)}
        onSend={handleSendEmail}
        onSaveDraft={handleSaveDraft}
        replyTo={selectedEmail}
      />
      
      <SESConfigurationModal
        isOpen={showSESConfig}
        onClose={() => setShowSESConfig(false)}
      />
    </div>
  );
};

const ComposeEmailModal = ({ isOpen, onClose, onSend, onSaveDraft, replyTo }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    body: ''
  });
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
      if (replyTo) {
        setFormData({
          to: replyTo.from,
          subject: `Re: ${replyTo.subject}`,
          body: `\n\n--- Original Message ---\n${replyTo.body}`
        });
      } else {
        setFormData({ to: '', subject: '', body: '' });
      }
    }
  }, [isOpen, replyTo]);

  const loadTemplates = async () => {
    try {
      const templatesData = await firebase.getEmailTemplates();
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setFormData({
      to: formData.to,
      subject: template.subject,
      body: template.body
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(formData);
  };

  const handleSaveDraft = () => {
    onSaveDraft(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compose Email" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <input
            type="email"
            value={formData.to}
            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            required
          />
  </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            required
          />
    </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent resize-none"
            required
          />
  </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => setShowTemplates(true)}>
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button type="button" variant="outline" onClick={handleSaveDraft}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
    </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
  </div>
        </div>
      </form>

      <Modal isOpen={showTemplates} onClose={() => setShowTemplates(false)} title="Email Templates">
        <div className="space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
              <Badge size="sm" variant="outline">{template.category}</Badge>
            </div>
          ))}
        </div>
      </Modal>
    </Modal>
  );
};

const SESConfigurationModal = ({ isOpen, onClose }) => {
  const [sesConfig, setSesConfig] = useState({
    enabled: false,
    region: '',
    accessKeyId: '',
    secretAccessKey: '',
    fromEmail: '',
    useApi: false,
    useSDK: false
  });
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = firebase.getSESConfig();
      setSesConfig(config);
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await firebase.configureSES(sesConfig);
      setTestResult({ success: true, message: 'SES configuration saved successfully!' });
    } catch (error) {
      setTestResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    try {
      setLoading(true);
      const result = await firebase.testSESConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AWS SES Configuration" size="lg">
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">AWS SES Setup Instructions</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Create an AWS account and verify your email domain</li>
            <li>2. Create an IAM user with SES permissions</li>
            <li>3. Get your Access Key ID and Secret Access Key</li>
            <li>4. Choose your preferred AWS region</li>
            <li>5. Configure the settings below</li>
          </ol>
    </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <input
                type="checkbox"
                checked={sesConfig.enabled}
                onChange={(e) => setSesConfig({ ...sesConfig, enabled: e.target.checked })}
                className="mr-2"
              />
              Enable SES
            </label>
  </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">AWS Region</label>
            <select
              value={sesConfig.region}
              onChange={(e) => setSesConfig({ ...sesConfig, region: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            >
              <option value="">Select Region</option>
              <option value="us-east-1">US East (N. Virginia)</option>
              <option value="us-west-2">US West (Oregon)</option>
              <option value="eu-west-1">Europe (Ireland)</option>
              <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Access Key ID</label>
          <input
            type="text"
            value={sesConfig.accessKeyId}
            onChange={(e) => setSesConfig({ ...sesConfig, accessKeyId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            placeholder="AKIA..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Secret Access Key</label>
          <input
            type="password"
            value={sesConfig.secretAccessKey}
            onChange={(e) => setSesConfig({ ...sesConfig, secretAccessKey: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            placeholder="Enter your secret key"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
          <input
            type="email"
            value={sesConfig.fromEmail}
            onChange={(e) => setSesConfig({ ...sesConfig, fromEmail: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            placeholder="noreply@yourdomain.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <input
                type="checkbox"
                checked={sesConfig.useApi}
                onChange={(e) => setSesConfig({ ...sesConfig, useApi: e.target.checked, useSDK: !e.target.checked })}
                className="mr-2"
              />
              Use API Proxy (Recommended)
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <input
                type="checkbox"
                checked={sesConfig.useSDK}
                onChange={(e) => setSesConfig({ ...sesConfig, useSDK: e.target.checked, useApi: !e.target.checked })}
                className="mr-2"
              />
              Use AWS SDK (Client-side)
            </label>
          </div>
        </div>

        {testResult && (
          <div className={`p-4 rounded-lg ${
            testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {testResult.message}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={handleTest} disabled={loading}>
            <Check className="w-4 h-4 mr-2" />
            Test Connection
          </Button>
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const SNSConfigurationModal = ({ isOpen, onClose }) => {
  const [snsConfig, setSnsConfig] = useState({
    enabled: false,
    region: '',
    accessKeyId: '',
    secretAccessKey: '',
    senderId: 'TechEphi',
    testPhoneNumber: '',
    useApi: false,
    useSDK: false
  });
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = firebase.getSNSConfig();
      setSnsConfig(config);
    }
  }, [isOpen]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await firebase.configureSNS(snsConfig);
      setTestResult({ success: true, message: 'SNS configuration saved successfully!' });
    } catch (error) {
      setTestResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    try {
      setLoading(true);
      const result = await firebase.testSNSConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AWS SNS SMS Configuration" size="lg">
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">AWS SNS SMS Setup Instructions</h4>
          <ol className="text-sm text-green-800 space-y-1">
            <li>1. Create an AWS account and set up SNS</li>
            <li>2. Create an IAM user with SNS permissions</li>
            <li>3. Get your Access Key ID and Secret Access Key</li>
            <li>4. Choose your preferred AWS region</li>
            <li>5. Configure the settings below</li>
          </ol>
    </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <input
                type="checkbox"
                checked={snsConfig.enabled}
                onChange={(e) => setSnsConfig({ ...snsConfig, enabled: e.target.checked })}
                className="mr-2"
              />
              Enable SNS SMS
            </label>
  </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">AWS Region</label>
            <select
              value={snsConfig.region}
              onChange={(e) => setSnsConfig({ ...snsConfig, region: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            >
              <option value="">Select Region</option>
              <option value="us-east-1">US East (N. Virginia)</option>
              <option value="us-west-2">US West (Oregon)</option>
              <option value="eu-west-1">Europe (Ireland)</option>
              <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Access Key ID</label>
          <input
            type="text"
            value={snsConfig.accessKeyId}
            onChange={(e) => setSnsConfig({ ...snsConfig, accessKeyId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            placeholder="AKIA..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Secret Access Key</label>
          <input
            type="password"
            value={snsConfig.secretAccessKey}
            onChange={(e) => setSnsConfig({ ...snsConfig, secretAccessKey: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            placeholder="Enter your secret key"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sender ID</label>
            <input
              type="text"
              value={snsConfig.senderId}
              onChange={(e) => setSnsConfig({ ...snsConfig, senderId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              placeholder="TechEphi"
              maxLength={11}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Test Phone Number</label>
            <input
              type="tel"
              value={snsConfig.testPhoneNumber}
              onChange={(e) => setSnsConfig({ ...snsConfig, testPhoneNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              placeholder="+1234567890"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <input
                type="checkbox"
                checked={snsConfig.useApi}
                onChange={(e) => setSnsConfig({ ...snsConfig, useApi: e.target.checked, useSDK: !e.target.checked })}
                className="mr-2"
              />
              Use API Proxy (Recommended)
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <input
                type="checkbox"
                checked={snsConfig.useSDK}
                onChange={(e) => setSnsConfig({ ...snsConfig, useSDK: e.target.checked, useApi: !e.target.checked })}
                className="mr-2"
              />
              Use AWS SDK (Client-side)
            </label>
          </div>
        </div>

        {testResult && (
          <div className={`p-4 rounded-lg ${
            testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {testResult.message}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={handleTest} disabled={loading}>
            <Check className="w-4 h-4 mr-2" />
            Test SMS
          </Button>
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Messaging Components
const MessagesView = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageStatus, setMessageStatus] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.email) {
    loadConversations();
      firebase.setPresence(user.email, true);
    
    // Set up real-time conversation updates
    const interval = setInterval(() => {
      loadConversations();
    }, 5000); // Check for conversation updates every 5 seconds
    
    return () => {
      clearInterval(interval);
      // Set user as offline when component unmounts
        firebase.setPresence(user.email, false);
    };
    }
  }, [user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      markAsRead(selectedConversation.id);
      
      // Set up real-time message listener
      const unsubscribeMessages = firebase.onMessage(selectedConversation.id, (newMessages) => {
        setMessages(newMessages);
      });
      
      // Set up real-time typing listener
      const unsubscribeTyping = firebase.onTyping(selectedConversation.id, user?.email, (typingUsers) => {
        setTypingUsers(new Set(typingUsers));
      });
      
      return () => {
        unsubscribeMessages();
        unsubscribeTyping();
      };
    }
  }, [selectedConversation, user?.email]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const convData = await firebase.getConversations(user?.email);
      setConversations(convData);
      if (convData.length > 0 && !selectedConversation) {
        setSelectedConversation(convData[0]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const messagesData = await firebase.getMessages(conversationId);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const markAsRead = async (conversationId) => {
    await firebase.markMessagesAsRead(conversationId, user?.email);
    loadConversations(); // Refresh to update unread counts
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    const messageId = Date.now().toString();
    setMessageStatus(prev => ({ ...prev, [messageId]: 'sending' }));

    try {
      const messageData = {
        id: messageId,
        senderId: user?.email,
        senderName: user?.displayName || user?.email,
        senderRole: user?.role,
        content: newMessage.trim(),
        attachments: attachments,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };

      // Optimistic update
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
      setAttachments([]);
      setMessageStatus(prev => ({ ...prev, [messageId]: 'sent' }));

      await firebase.sendMessage(selectedConversation.id, messageData);
      loadMessages(selectedConversation.id);
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      setMessageStatus(prev => ({ ...prev, [messageId]: 'failed' }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    // Set typing indicator when user starts typing
    if (selectedConversation && user?.email) {
      firebase.setTyping(selectedConversation.id, user.email, true);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays <= 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'contractor': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sending': return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent': return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered': return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case 'read': return <CheckCheck className="w-3 h-3 text-blue-600" />;
      case 'failed': return <X className="w-3 h-3 text-red-500" />;
      default: return null;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#3B0A69] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <div className="text-lg text-gray-600">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] flex bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <Button 
              size="sm"
              onClick={() => setShowNewConversation(true)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {conversation.title?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{conversation.title}</h3>
                      <p className="text-xs text-gray-500">
                        {conversation.participants?.length || 0} participants
                      </p>
                    </div>
                  </div>
                {conversation.unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 truncate mb-1">{conversation.lastMessage}</p>
              <p className="text-xs text-gray-400">{formatTime(conversation.lastMessageTime)}</p>
            </div>
            ))
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {selectedConversation.title?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
              <h3 className="font-semibold text-gray-900">{selectedConversation.title}</h3>
              <p className="text-sm text-gray-600">
                      {selectedConversation.participants?.filter(p => p.email !== user?.email).map(p => p.name).join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user?.email ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    message.senderId === user?.email
                      ? 'bg-[#3B0A69] text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    {message.senderId !== user?.email && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium">{message.senderName}</span>
                        <Badge size="sm" variant="default" className={getRoleColor(message.senderRole)}>
                          {message.senderRole}
                        </Badge>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                            <Paperclip className="w-4 h-4 text-gray-500" />
                            <span className="text-sm flex-1 truncate">{attachment.name}</span>
                            <span className="text-xs text-gray-500">({attachment.size})</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                      {message.senderId === user?.email && (
                        <div className="flex items-center gap-1">
                          {getMessageStatusIcon(messageStatus[message.id] || 'sent')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicators */}
              {typingUsers.size > 0 && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {Array.from(typingUsers).join(', ')} typing...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              {/* Attachment Preview */}
              {attachments.length > 0 && (
                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Attachments ({attachments.length})</span>
                    <Button size="sm" variant="outline" onClick={() => setAttachments([])}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                        <span className="text-sm flex-1 truncate">{attachment.name}</span>
                        <span className="text-xs text-gray-500">({attachment.size})</span>
                        <Button size="sm" variant="outline" onClick={() => removeAttachment(attachment.id)}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex-1 relative">
                  <textarea
                  value={newMessage}
                    onChange={handleTyping}
                    onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                    rows={1}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent resize-none"
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                />
                </div>
                <Button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim() && attachments.length === 0}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      <NewConversationModal 
        isOpen={showNewConversation}
        onClose={() => setShowNewConversation(false)}
        onConversationCreated={loadConversations}
      />
    </div>
  );
};

const NewConversationModal = ({ isOpen, onClose, onConversationCreated }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [participants, setParticipants] = useState('');
  const [jobId, setJobId] = useState('');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadJobs();
    }
  }, [isOpen]);

  const loadJobs = async () => {
    try {
      const jobsData = await firebase.getJobs();
      setJobs(jobsData);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const participantsList = [user?.email, ...participants.split(',').map(p => p.trim())];
    
    try {
      await firebase.createConversation(participantsList, title, jobId || null);
      onConversationCreated();
      onClose();
      setTitle('');
      setParticipants('');
      setJobId('');
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Conversation">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Conversation Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            placeholder="Enter conversation title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Participants (comma-separated emails)
          </label>
          <input
            type="text"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            placeholder="email1@example.com, email2@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Related Job (optional)
          </label>
          <select
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
          >
            <option value="">No related job</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            Create Conversation
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Invoice Components
const InvoicesView = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, [user]);

  const loadInvoices = async () => {
    try {
      let invoicesData = await firebase.getInvoices();
      
      // Filter based on user role
      if (user?.role === 'client') {
        invoicesData = invoicesData.filter(invoice => invoice.clientEmail === user?.email);
      }
      
      setInvoices(invoicesData);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (invoiceData) => {
    try {
      await firebase.createInvoice(invoiceData);
      loadInvoices();
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const handlePayInvoice = async (invoiceId) => {
    try {
      await firebase.updateInvoiceStatus(invoiceId, 'paid', new Date().toISOString());
      loadInvoices();
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'danger';
      default: return 'default';
    }
  };

  const getTotalAmount = () => {
    return invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  };

  const getPaidAmount = () => {
    return invoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  };

  const getPendingAmount = () => {
    return invoices
      .filter(invoice => invoice.status !== 'paid')
      .reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Loading invoices...</div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Invoice Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Invoiced"
          value={`${getTotalAmount().toLocaleString()}`}
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Amount Paid"
          value={`${getPaidAmount().toLocaleString()}`}
          icon={CheckCircle}
          color="green"
        />
        <MetricCard
          title="Outstanding"
          value={`${getPendingAmount().toLocaleString()}`}
          icon={AlertCircle}
          color="yellow"
        />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Invoice Management</h2>
          <p className="text-gray-600">Manage billing and payment tracking</p>
        </div>
        {user?.role === 'admin' && (
          <Button onClick={() => setShowCreateInvoice(true)}>
            <Plus className="w-4 h-4" />
            Create Invoice
          </Button>
        )}
      </div>

      {/* Invoices Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices yet</h3>
                    <p className="text-gray-600 mb-4">
                      {user?.role === 'admin'
                        ? 'Create your first invoice to start tracking payments'
                        : 'No invoices have been created for you yet'}
                    </p>
                    {user?.role === 'admin' && (
                      <Button onClick={() => setShowCreateInvoice(true)}>
                        <Plus className="w-4 h-4" />
                        Create First Invoice
                      </Button>
                    )}
                  </td>
                </tr>
              ) : invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.jobTitle || 'Standalone Invoice'}
                      </div>
                      {!invoice.jobId && (
                        <div className="text-xs text-gray-400 mt-0.5">No job linked</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.clientName}</div>
                    <div className="text-sm text-gray-500">{invoice.clientEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${invoice.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Tax: ${invoice.taxAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowInvoiceDetail(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    {user?.role === 'client' && invoice.status !== 'paid' && (
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handlePayInvoice(invoice.id)}
                      >
                        Pay Now
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {invoices.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-600 mb-4">
            {user?.role === 'admin' 
              ? 'Create your first invoice to get started' 
              : 'No invoices have been generated for your account yet'}
          </p>
          {user?.role === 'admin' && (
            <Button onClick={() => setShowCreateInvoice(true)}>
              <Plus className="w-4 h-4" />
              Create First Invoice
            </Button>
          )}
        </Card>
      )}

      {user?.role === 'admin' && (
        <CreateInvoiceModal 
          isOpen={showCreateInvoice}
          onClose={() => setShowCreateInvoice(false)}
          onSubmit={handleCreateInvoice}
        />
      )}

      <InvoiceDetailModal
        isOpen={showInvoiceDetail}
        onClose={() => setShowInvoiceDetail(false)}
        invoice={selectedInvoice}
        onPayment={handlePayInvoice}
        userRole={user?.role}
      />
    </div>
  );
};

const CreateInvoiceModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    jobId: '',
    clientName: '',
    clientEmail: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    taxRate: 8,
    notes: '',
    dueDate: ''
  });
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadJobs();
      // Set default due date to 30 days from now
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        dueDate: defaultDueDate.toISOString().split('T')[0]
      }));
    }
  }, [isOpen]);

  const loadJobs = async () => {
    try {
      const jobsData = await firebase.getJobs();
      setJobs(jobsData);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      
      // Calculate amount for quantity and rate changes
      if (field === 'quantity' || field === 'rate') {
        newItems[index].amount = newItems[index].quantity * newItems[index].rate;
      }
      
      return { ...prev, items: newItems };
    });
  };

  const getSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const getTaxAmount = () => {
    return (getSubtotal() * formData.taxRate) / 100;
  };

  const getTotal = () => {
    return getSubtotal() + getTaxAmount();
  };

  const handleJobChange = (jobId) => {
    const selectedJob = jobs.find(job => job.id === jobId || job.id === parseInt(jobId));
    if (selectedJob) {
      // Job selected - auto-fill client info and job details
      setFormData(prev => ({
        ...prev,
        jobId,
        clientName: selectedJob.client || prev.clientName,
        clientEmail: selectedJob.clientEmail || prev.clientEmail,
        items: [{ 
          description: selectedJob.title, 
          quantity: 1, 
          rate: selectedJob.value || 0, 
          amount: selectedJob.value || 0 
        }]
      }));
    } else {
      // Job cleared - keep client info but clear jobId
      setFormData(prev => ({ 
        ...prev, 
        jobId: '',
        // Don't clear clientName/clientEmail - user may have entered them manually
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate that client info is provided for standalone invoices
    if (!formData.jobId && (!formData.clientName || !formData.clientEmail)) {
      alert('Please provide client name and email for standalone invoices, or select a job.');
      return;
    }
    
    const selectedJob = jobs.find(j => j.id === formData.jobId || j.id === parseInt(formData.jobId));
    const invoiceData = {
      ...formData,
      jobId: formData.jobId || null, // Set to null instead of empty string for standalone invoices
      amount: getSubtotal(),
      taxAmount: getTaxAmount(),
      totalAmount: getTotal(),
      jobTitle: selectedJob?.title || 'Standalone Invoice',
      subtotal: getSubtotal(),
      // Ensure client info is set even if job is selected (in case job doesn't have client info)
      clientName: formData.clientName || selectedJob?.client || '',
      clientEmail: formData.clientEmail || selectedJob?.clientEmail || ''
    };
    
    onSubmit(invoiceData);
    onClose();
    
    // Reset form
    setFormData({
      jobId: '',
      clientName: '',
      clientEmail: '',
      items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      taxRate: 8,
      notes: '',
      dueDate: ''
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Invoice">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related Job (optional)
            </label>
            <select
              value={formData.jobId}
              onChange={(e) => handleJobChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            >
              <option value="">Select a job</option>
              {jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title} - {job.client || 'No Client'}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Email
            </label>
            <input
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Invoice Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Invoice Items
            </label>
            <Button type="button" variant="ghost" size="sm" onClick={addItem}>
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    value={item.amount}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div className="col-span-1">
                  {formData.items.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${getSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tax Rate:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span>%</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Tax Amount:</span>
              <span>${getTaxAmount().toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            rows={3}
            placeholder="Additional notes for the invoice..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            Create Invoice
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const InvoiceDetailModal = ({ isOpen, onClose, invoice, onPayment, userRole }) => {
  if (!invoice) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleDownloadPDF = () => {
    // Create a printable version of the invoice
    const printWindow = window.open('', '_blank');
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .logo { width: 80px; height: 80px; }
            .invoice-info { text-align: right; }
            .section { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; }
            .total { font-weight: bold; font-size: 18px; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Invoice ${invoice.invoiceNumber}</h1>
              <p>${invoice.jobTitle}</p>
              <p>Tech ePhi</p>
            </div>
            <div class="invoice-info">
              <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
              <p><strong>Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div class="section">
            <h3>Bill To:</h3>
            <p>${invoice.clientName}</p>
            <p>${invoice.clientEmail}</p>
          </div>
          <div class="section">
            <h3>Items:</h3>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.rate.toLocaleString()}</td>
                    <td>$${item.amount.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <div class="section">
            <p>Subtotal: $${invoice.amount.toLocaleString()}</p>
            <p>Tax: $${invoice.taxAmount.toLocaleString()}</p>
            <p class="total">Total: $${invoice.totalAmount.toLocaleString()}</p>
            <p>Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
          ${invoice.notes ? `<div class="section"><h3>Notes:</h3><p>${invoice.notes}</p></div>` : ''}
          <button onclick="window.print()">Print / Save as PDF</button>
        </body>
      </html>
    `;
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    // Auto-trigger print dialog after a short delay
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invoice Details">
      <div className="space-y-6">
        {/* Company Logo and Invoice Header */}
        <div className="flex justify-between items-start border-b pb-4">
          <div className="flex items-start space-x-4">
            <img 
              src="/logo.png" 
              alt="Tech ePhi Logo" 
              className="w-16 h-16 object-contain"
            />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{invoice.invoiceNumber}</h3>
              <p className="text-gray-600">{invoice.jobTitle}</p>
              <p className="text-sm text-gray-500 mt-1">Tech ePhi</p>
            </div>
          </div>
          <div className="text-right">
            <Badge size="md" className={getStatusColor(invoice.status)}>
              {invoice.status.toUpperCase()}
            </Badge>
            <p className="text-sm text-gray-500 mt-1">
              Created: {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Client Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Bill To:</h4>
          <p className="text-gray-900">{invoice.clientName}</p>
          <p className="text-gray-600">{invoice.clientEmail}</p>
        </div>

        {/* Invoice Items */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Items:</h4>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Qty</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Rate</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-center">{item.quantity}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">${item.rate.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-right">${item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Invoice Totals */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">${invoice.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span className="text-gray-900">${invoice.taxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total Amount:</span>
              <span>${invoice.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Due Date:</h4>
            <p className="text-gray-600">{new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
          {invoice.paidDate && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Paid Date:</h4>
              <p className="text-gray-600">{new Date(invoice.paidDate).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Notes:</h4>
            <p className="text-gray-600">{invoice.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button 
            variant="ghost" 
            className="flex-1"
            onClick={handleDownloadPDF}
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          {userRole === 'client' && invoice.status !== 'paid' && (
            <Button 
              variant="success" 
              className="flex-1"
              onClick={() => {
                onPayment(invoice.id);
                onClose();
              }}
            >
              <DollarSign className="w-4 h-4" />
              Pay Now
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Enhanced Data Persistence Manager
class DataPersistenceManager {
  constructor() {
    this.storageKey = 'techephi_crm_data';
    this.version = '1.0.0';
    this.compressionEnabled = true;
  }

  // Enhanced localStorage with compression and versioning
  setItem(key, data) {
    try {
      const serializedData = {
        version: this.version,
        timestamp: new Date().toISOString(),
        data: data
      };

      const jsonString = JSON.stringify(serializedData);
      
      // Simple compression for large data
      const compressedData = this.compressionEnabled ? this.compress(jsonString) : jsonString;
      
      localStorage.setItem(`${this.storageKey}_${key}`, compressedData);
      return true;
    } catch (error) {
      console.error('Data persistence error:', error);
      this.handleStorageError(error, key);
      return false;
    }
  }

  getItem(key) {
    try {
      const rawData = localStorage.getItem(`${this.storageKey}_${key}`);
      if (!rawData) return null;

      const decompressedData = this.compressionEnabled ? this.decompress(rawData) : rawData;
      const parsedData = JSON.parse(decompressedData);
      
      // Version compatibility check
      if (parsedData.version !== this.version) {
        console.warn(`Data version mismatch for ${key}. Migrating...`);
        return this.migrateData(parsedData, key);
      }

      return parsedData.data;
    } catch (error) {
      console.error('Data retrieval error:', error);
      return null;
    }
  }

  // Simple compression using base64 encoding
  compress(str) {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (error) {
      return str; // Fallback to uncompressed
    }
  }

  decompress(str) {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (error) {
      return str; // Assume it's not compressed
    }
  }

  // Data migration for version compatibility
  migrateData(oldData, key) {
    console.log(`Migrating data for ${key} from version ${oldData.version} to ${this.version}`);
    
    // Add migration logic here for future versions
    const migratedData = oldData.data;
    
    // Save migrated data
    this.setItem(key, migratedData);
    
    return migratedData;
  }

  // Storage error handling
  handleStorageError(error, key) {
    if (error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded. Cleaning up old data...');
      this.cleanupOldData();
    } else {
      console.error(`Storage error for key ${key}:`, error);
    }
  }

  // Cleanup old data when storage is full
  cleanupOldData() {
    const keys = Object.keys(localStorage);
    const appKeys = keys.filter(key => key.startsWith(this.storageKey));
    
    // Sort by timestamp and remove oldest entries
    const keyData = appKeys.map(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        return { key, timestamp: new Date(data.timestamp) };
      } catch {
        return { key, timestamp: new Date(0) };
      }
    }).sort((a, b) => a.timestamp - b.timestamp);

    // Remove oldest 20% of entries
    const toRemove = Math.ceil(keyData.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      localStorage.removeItem(keyData[i].key);
    }
  }

  // Export data for backup
  exportData() {
    const keys = Object.keys(localStorage);
    const appKeys = keys.filter(key => key.startsWith(this.storageKey));
    
    const exportData = {};
    appKeys.forEach(key => {
      exportData[key] = localStorage.getItem(key);
    });

    return JSON.stringify(exportData, null, 2);
  }

  // Import data from backup
  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }

  // Clear all app data
  clearAllData() {
    const keys = Object.keys(localStorage);
    const appKeys = keys.filter(key => key.startsWith(this.storageKey));
    appKeys.forEach(key => localStorage.removeItem(key));
  }
}

// Enhanced Error Handling System
class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
    this.listeners = [];
  }

  // Log error with context
  logError(error, context = {}) {
    const errorEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      message: error.message || error,
      stack: error.stack,
      context,
      severity: this.determineSeverity(error),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.errors.unshift(errorEntry);
    
    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Persist errors
    dataManager.setItem('error_logs', this.errors);

    // Notify listeners
    this.listeners.forEach(listener => listener(errorEntry));

    // Console logging based on severity
    if (errorEntry.severity === 'critical') {
      console.error('CRITICAL ERROR:', errorEntry);
    } else if (errorEntry.severity === 'high') {
      console.error('ERROR:', errorEntry);
    } else {
      console.warn('Warning:', errorEntry);
    }

    return errorEntry;
  }

  determineSeverity(error) {
    const message = error.message || error.toString();
    
    if (message.includes('Firebase') || message.includes('auth') || message.includes('network')) {
      return 'critical';
    } else if (message.includes('validation') || message.includes('required')) {
      return 'high';
    } else {
      return 'medium';
    }
  }

  // Add error listener
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Get recent errors
  getRecentErrors(count = 10) {
    return this.errors.slice(0, count);
  }

  // Clear errors
  clearErrors() {
    this.errors = [];
    dataManager.setItem('error_logs', []);
  }

  // Get error statistics
  getErrorStats() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recent24h = this.errors.filter(e => new Date(e.timestamp) > last24h);
    const recentWeek = this.errors.filter(e => new Date(e.timestamp) > lastWeek);

    return {
      total: this.errors.length,
      last24h: recent24h.length,
      lastWeek: recentWeek.length,
      bySeverity: {
        critical: this.errors.filter(e => e.severity === 'critical').length,
        high: this.errors.filter(e => e.severity === 'high').length,
        medium: this.errors.filter(e => e.severity === 'medium').length
      }
    };
  }
}

// Loading State Manager
class LoadingStateManager {
  constructor() {
    this.loadingStates = new Map();
    this.listeners = [];
  }

  setLoading(key, isLoading, message = 'Loading...') {
    this.loadingStates.set(key, { isLoading, message, timestamp: Date.now() });
    this.notifyListeners();
  }

  isLoading(key) {
    const state = this.loadingStates.get(key);
    return state ? state.isLoading : false;
  }

  getMessage(key) {
    const state = this.loadingStates.get(key);
    return state ? state.message : '';
  }

  getAllLoadingStates() {
    return Object.fromEntries(this.loadingStates);
  }

  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.getAllLoadingStates()));
  }

  // Auto-clear old loading states
  cleanup() {
    const now = Date.now();
    const timeout = 30000; // 30 seconds
    
    for (const [key, state] of this.loadingStates.entries()) {
      if (now - state.timestamp > timeout) {
        this.loadingStates.delete(key);
      }
    }
  }
}

// Enhanced Loading Component
const LoadingSpinner = ({ size = 'md', message, className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-4 border-gray-200 border-t-[#3B0A69] rounded-full animate-spin`}></div>
      {message && (
        <p className="mt-3 text-sm text-gray-600 animate-pulse">{message}</p>
      )}
    </div>
  );
};

// Enhanced Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log to error handler
    errorHandler.logError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.props.name || 'Unknown'
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[200px] flex items-center justify-center bg-red-50 border border-red-200 rounded-lg m-4">
          <div className="text-center p-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Something went wrong</h3>
            <p className="text-red-700 mb-4">
              We're sorry, but there was an error loading this component.
            </p>
            <Button 
              variant="danger"
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            >
              Try Again
            </Button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-red-600">Error Details</summary>
                <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced Toast Notification System
const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      ...toast,
      timestamp: Date.now()
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove after timeout
    const timeout = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, timeout);

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message, options = {}) => {
    return addToast({
      type: 'success',
      title: 'Success',
      message,
      ...options
    });
  };

  const showError = (message, options = {}) => {
    return addToast({
      type: 'error',
      title: 'Error',
      message,
      duration: 7000, // Longer for errors
      ...options
    });
  };

  const showWarning = (message, options = {}) => {
    return addToast({
      type: 'warning',
      title: 'Warning',
      message,
      ...options
    });
  };

  const showInfo = (message, options = {}) => {
    return addToast({
      type: 'info',
      title: 'Info',
      message,
      ...options
    });
  };

  return (
    <ToastContext.Provider value={{
      addToast,
      removeToast,
      showSuccess,
      showError,
      showWarning,
      showInfo
    }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Container Component
const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

// Individual Toast Component
const Toast = ({ toast, onRemove }) => {
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const Icon = icons[toast.type] || Info;

  return (
    <div className={`max-w-sm w-full border rounded-lg shadow-lg p-4 ${typeStyles[toast.type]} animate-in slide-in-from-right duration-300`}>
      <div className="flex items-start">
        <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{toast.title}</p>
          <p className="text-sm mt-1">{toast.message}</p>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="ml-3 flex-shrink-0 rounded-md p-1.5 hover:bg-black hover:bg-opacity-10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Responsive Utility Hook
const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState('lg');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < 640) {
        setBreakpoint('sm');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < 768) {
        setBreakpoint('md');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else if (width < 1024) {
        setBreakpoint('lg');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else {
        setBreakpoint('xl');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen: isMobile || isTablet
  };
};

// Enhanced Async Operation Hook
const useAsyncOperation = () => {
  const { showSuccess, showError } = useToast();
  
  const executeAsync = async (operation, options = {}) => {
    const {
      loadingKey = 'default',
      loadingMessage = 'Loading...',
      successMessage,
      errorMessage = 'An error occurred',
      showLoadingToast = false
    } = options;

    try {
      loadingManager.setLoading(loadingKey, true, loadingMessage);
      
      if (showLoadingToast) {
        showInfo(loadingMessage);
      }

      const result = await operation();

      if (successMessage) {
        showSuccess(successMessage);
      }

      return result;
    } catch (error) {
      console.error('Async operation failed:', error);
      errorHandler.logError(error, { operation: operation.name, loadingKey });
      
      showError(typeof errorMessage === 'function' ? errorMessage(error) : errorMessage);
      throw error;
    } finally {
      loadingManager.setLoading(loadingKey, false);
    }
  };

  return { executeAsync };
};

// Enhanced Data Hook with Caching
const useData = (key, fetcher, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { executeAsync } = useAsyncOperation();

  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 2 * 60 * 1000,  // 2 minutes
    refetchOnWindowFocus = true,
    retryOnError = true,
    maxRetries = 3
  } = options;

  const fetchData = useCallback(async (retryCount = 0) => {
    try {
      // Check cache first
      const cached = dataManager.getItem(`cache_${key}`);
      if (cached && Date.now() - cached.timestamp < staleTime) {
        setData(cached.data);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const result = await executeAsync(fetcher, {
        loadingKey: `data_${key}`,
        loadingMessage: `Loading ${key}...`,
        errorMessage: `Failed to load ${key}`
      });

      // Cache the result
      dataManager.setItem(`cache_${key}`, {
        data: result,
        timestamp: Date.now()
      });

      setData(result);
    } catch (err) {
      setError(err);
      
      if (retryOnError && retryCount < maxRetries) {
        console.log(`Retrying ${key} (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => fetchData(retryCount + 1), 1000 * Math.pow(2, retryCount));
      }
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, staleTime, executeAsync, retryOnError, maxRetries]);

  useEffect(() => {
    fetchData();

    // Refetch on window focus
    if (refetchOnWindowFocus) {
      const handleFocus = () => {
        const cached = dataManager.getItem(`cache_${key}`);
        if (!cached || Date.now() - cached.timestamp > staleTime) {
          fetchData();
        }
      };

      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [fetchData, refetchOnWindowFocus, key, staleTime]);

  const mutate = useCallback((newData) => {
    setData(newData);
    dataManager.setItem(`cache_${key}`, {
      data: newData,
      timestamp: Date.now()
    });
  }, [key]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    mutate,
    refetch
  };
};

const ResourceAllocationView = () => {
  const [contractors, setContractors] = useState([]);
  const [workloadData, setWorkloadData] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResourceData();
  }, [selectedWeek]);

  const loadResourceData = async () => {
    try {
      const [contractorsData, eventsData] = await Promise.all([
        firebase.getContractors(),
        firebase.getScheduleEvents()
      ]);

      // Calculate workload for each contractor
      const weekStart = new Date(selectedWeek);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const workload = contractorsData.map(contractor => {
        const weekEvents = eventsData.filter(event => {
          const eventDate = new Date(event.startTime);
          return event.assignedTo === contractor.email &&
                 eventDate >= weekStart && eventDate <= weekEnd;
        });

        const totalHours = weekEvents.reduce((sum, event) => {
          const duration = (new Date(event.endTime) - new Date(event.startTime)) / (1000 * 60 * 60);
          return sum + duration;
        }, 0);

        const utilization = (totalHours / 40) * 100; // 40 hour work week

        return {
          contractor,
          weekEvents,
          totalHours: Math.round(totalHours * 10) / 10,
          utilization: Math.round(utilization),
          efficiency: contractor.rating * 20,
          availability: Math.max(0, 40 - totalHours)
        };
      });

      setContractors(contractorsData);
      setWorkloadData(workload);
    } catch (error) {
      console.error('Error loading resource data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUtilizationColor = (utilization) => {
    if (utilization > 100) return 'bg-red-500';
    if (utilization > 80) return 'bg-yellow-500';
    if (utilization > 60) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const navigateWeek = (direction) => {
    setSelectedWeek(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction * 7));
      return newDate;
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Loading resource allocation...</div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Resource Allocation</h3>
          <p className="text-gray-600">
            Week of {selectedWeek.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigateWeek(-1)}>
            <ChevronDown className="w-4 h-4 rotate-90" />
            Previous Week
          </Button>
          <Button variant="ghost" onClick={() => navigateWeek(1)}>
            Next Week
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </Button>
        </div>
      </div>

      {/* Resource Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Contractors"
          value={contractors.length.toString()}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Avg Utilization"
          value={`${Math.round(workloadData.reduce((sum, w) => sum + w.utilization, 0) / workloadData.length)}%`}
          icon={Activity}
          color="green"
        />
        <MetricCard
          title="Overutilized"
          value={workloadData.filter(w => w.utilization > 100).length.toString()}
          icon={AlertCircle}
          color="red"
        />
        <MetricCard
          title="Available Hours"
          value={workloadData.reduce((sum, w) => sum + w.availability, 0).toFixed(1)}
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Contractor Workload Table */}
      <Card className="overflow-hidden">
        <div className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Contractor Workload Analysis</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contractor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Efficiency</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">This Week</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {workloadData.map((data) => (
                  <tr key={data.contractor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{data.contractor.name}</div>
                        <div className="text-sm text-gray-500">{data.contractor.specialties.join(', ')}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{data.totalHours}h</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div 
                            className={`h-2 rounded-full ${getUtilizationColor(data.utilization)}`}
                            style={{ width: `${Math.min(100, data.utilization)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 min-w-[40px]">{data.utilization}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-900">{data.contractor.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{data.availability.toFixed(1)}h</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {data.weekEvents.slice(0, 3).map(event => (
                          <Badge 
                            key={event.id} 
                            variant="default" 
                            size="sm"
                            className="bg-blue-100 text-blue-800"
                          >
                            {new Date(event.startTime).toLocaleDateString('en-US', { weekday: 'short' })}
                          </Badge>
                        ))}
                        {data.weekEvents.length > 3 && (
                          <Badge variant="default" size="sm" className="bg-gray-100 text-gray-600">
                            +{data.weekEvents.length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Enhanced Calendar Export Component
const CalendarExportModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [exportRange, setExportRange] = useState('month');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const now = new Date();
      let startDate, endDate;

      switch (exportRange) {
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - now.getDay());
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case 'quarter': {
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
          break;
        }
        default:
          startDate = now;
          endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      }

      const icsContent = await firebase.generateCalendarExport(
        user?.email,
        startDate.toISOString(),
        endDate.toISOString()
      );

      // Create and download file
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `techephi-schedule-${exportRange}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onClose();
    } catch (error) {
      console.error('Error exporting calendar:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Calendar">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Range
          </label>
          <select
            value={exportRange}
            onChange={(e) => setExportRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Export Information</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>'95 Export includes all your scheduled appointments</li>
            <li>'95 Compatible with Google Calendar, Outlook, and Apple Calendar</li>
            <li>'95 File will be downloaded as .ics format</li>
            <li>'95 Updates to the original schedule won't sync automatically</li>
          </ul>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleExport} 
            className="flex-1"
            loading={exporting}
          >
            <Download className="w-4 h-4" />
            Export Calendar
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Add to existing ScheduleView component
const ScheduleViewEnhanced = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('calendar');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, [user, selectedDate]);

  const loadEvents = async () => {
    try {
      let filters = {};
      
      if (user?.role === 'contractor') {
        filters.contractorEmail = user.email;
      } else if (user?.role === 'client') {
        filters.clientEmail = user.email;
      }

      const eventsData = await firebase.getScheduleEvents(filters);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      await firebase.createScheduleEvent(eventData);
      loadEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      alert(error.message);
    }
  };

  const handleUpdateEvent = async (eventId, updates) => {
    try {
      await firebase.updateScheduleEvent(eventId, updates);
      loadEvents();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Loading schedule...</div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Schedule Management</h2>
          <p className="text-gray-600">Manage appointments and track project timelines</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-gray-200">
            <button
              onClick={() => setCurrentView('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                currentView === 'calendar' 
                  ? 'bg-[#3B0A69] text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setCurrentView('timeline')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                currentView === 'timeline' 
                  ? 'bg-[#3B0A69] text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Timeline
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => setCurrentView('resources')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                  currentView === 'resources' 
                    ? 'bg-[#3B0A69] text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Resources
              </button>
            )}
          </div>
          
          <Button variant="ghost" onClick={() => setShowExportModal(true)}>
            <Download className="w-4 h-4" />
            Export
          </Button>
          
          {user?.role === 'admin' && (
            <Button onClick={() => setShowEventModal(true)}>
              <Plus className="w-4 h-4" />
              Schedule Appointment
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced View Content */}
      {currentView === 'calendar' && (
        <CalendarView 
          events={events}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onEventClick={(event) => {
            setSelectedEvent(event);
            setShowEventModal(true);
          }}
          userRole={user?.role}
        />
      )}
      
      {currentView === 'timeline' && (
        <TimelineView userRole={user?.role} />
      )}
      
      {currentView === 'resources' && user?.role === 'admin' && (
        <ResourceAllocationView />
      )}

      {/* Modals */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}
        userRole={user?.role}
      />

      <CalendarExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
};

const calculateJobProgress = (job, events) => {
  const completedEvents = events.filter(e => e.status === 'completed').length;
  const totalEvents = events.length || 1;
  const baseProgress = (completedEvents / totalEvents) * 80; // 80% max from events
  
  // Add status-based progress
  const statusProgress = {
    'pending': 0,
    'in-progress': 20,
    'completed': 100,
    'cancelled': 0
  };

  return Math.min(100, baseProgress + statusProgress[job.status]);
};

// Initialize core services
const errorHandler = new ErrorHandler();
const dataManager = new DataManager(errorHandler);
const loadingManager = new LoadingManager();

// Make services globally available for debugging
window.errorHandler = errorHandler;
window.dataManager = dataManager;
window.loadingManager = loadingManager;

// Global error handling
window.addEventListener('error', (event) => {
  errorHandler.logError(event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    type: 'globalError'
  });
});

window.addEventListener('unhandledrejection', (event) => {
  errorHandler.logError(event.reason, {
    type: 'unhandledPromiseRejection'
  });
});

// Cleanup loading states periodically
setInterval(() => {
  loadingManager.cleanup();
}, 30000);

// Firebase Configuration (kept for reference)
const firebaseConfig = {
  apiKey: "AIzaSyBjHLhECxsAW8DWN63tTVZSCExpT33tFUg",
  authDomain: "lifeline-37sh6.firebaseapp.com",
  projectId: "lifeline-37sh6",
  storageBucket: "lifeline-37sh6.firebasestorage.app",
  messagingSenderId: "24849207864",
  appId: "1:24849207864:web:ddfeef6f0efa16135c0ccd"
};

// Context for user authentication and data management
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to determine role from email (fast, no network call)
  const determineRole = (email, profile) => {
    if (profile?.role) return profile.role;
    if (email.includes('admin') || email === 'support@techephi.com' || email === 'bblair@techephi.com') {
      return 'admin';
    } else if (email.includes('contractor') || (email.includes('@techephi.com') && email !== 'support@techephi.com' && email !== 'bblair@techephi.com')) {
      return 'contractor';
    }
    return 'client';
  };

  useEffect(() => {
    // Try to load cached user data immediately for faster initial render
    const cachedUser = localStorage.getItem('cachedUser');
    if (cachedUser) {
      try {
        const parsedUser = JSON.parse(cachedUser);
        // Only use cache if it's recent (less than 1 hour old)
        if (parsedUser.cachedAt && Date.now() - parsedUser.cachedAt < 3600000) {
          setUser(parsedUser);
          setLoading(false); // Show UI immediately with cached data
        }
      } catch (e) {
        // Invalid cache, ignore
      }
    }
    
    // Initialize push notifications in background (non-blocking)
    pushNotificationService.initialize().catch(() => {
      // Silently fail - push notifications are not critical
    });
    
    // Listen to Firebase auth state changes for persistent login
    const unsubscribe = firebaseService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in - set user immediately with email-based role (fast)
        const quickUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          role: determineRole(firebaseUser.email, null), // Use email-based role immediately
          cachedAt: Date.now()
        };
        
        setUser(quickUserData);
        setLoading(false); // Stop loading immediately
        
        // Cache user data for faster future loads
        localStorage.setItem('cachedUser', JSON.stringify(quickUserData));
        
        // Fetch user profile from Firestore in background (non-blocking)
        // This will update the role if profile exists
        (async () => {
          try {
            const profileRef = doc(db, 'userProfiles', firebaseUser.uid);
            const profileSnap = await getDoc(profileRef);
            if (profileSnap.exists()) {
              const userProfile = profileSnap.data();
              const updatedUserData = {
                ...quickUserData,
                displayName: firebaseUser.displayName || userProfile?.displayName || quickUserData.displayName,
                role: determineRole(firebaseUser.email, userProfile),
                cachedAt: Date.now()
              };
              setUser(updatedUserData);
              localStorage.setItem('cachedUser', JSON.stringify(updatedUserData));
            } else {
              // Profile doesn't exist, create it automatically
              try {
                await setDoc(profileRef, {
                  email: firebaseUser.email,
                  displayName: quickUserData.displayName,
                  role: quickUserData.role,
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp()
                });
              } catch (profileError) {
                console.warn('Could not create user profile:', profileError);
              }
            }
          } catch (error) {
            console.warn('Could not fetch user profile:', error);
            // Continue with email-based role - not critical
          }
        })();
        
        // Initialize push notifications for the logged-in user (non-blocking)
        pushNotificationService.initialize().catch(() => {
          // Silently fail - push notifications are not critical
        });
      } else {
        // User is signed out
        setUser(null);
        localStorage.removeItem('cachedUser');
        setLoading(false);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      // Use Firebase authentication
      const userCredential = await firebaseService.signInWithEmailAndPassword(email, password);
      
      // Determine user role based on email
      const determineRole = (email) => {
        if (email.includes('admin') || email === 'support@techephi.com' || email === 'bblair@techephi.com') {
          return 'admin';
        } else if (email.includes('contractor') || (email.includes('@techephi.com') && email !== 'support@techephi.com' && email !== 'bblair@techephi.com')) {
          return 'contractor';
        }
        return 'client';
      };
      
      const user = {
        uid: userCredential.uid,
        email: userCredential.email,
        displayName: userCredential.displayName || email.split('@')[0],
        role: determineRole(email)
      };

      // Set the user state
      setUser(user);
      
      // Initialize push notifications for the logged-in user
      try {
        await pushNotificationService.initialize();
        console.log('✅ Push notifications initialized for user');
      } catch (pushError) {
        console.warn('⚠️ Push notifications initialization failed:', pushError);
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password, role, additionalData = {}) => {
    try {
      // Prevent admin role creation through registration
      if (role === 'admin') {
        throw new Error('Administrator accounts cannot be created through registration. Please contact an existing administrator.');
      }

      // Use Firebase authentication to create user
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const userCredential = await createUserWithEmailAndPassword(firebaseService.auth, email, password);
      
      // Ensure role is not admin (force to contractor or client)
      const safeRole = role === 'admin' ? 'contractor' : (role || 'client');
      
      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: additionalData.displayName || email.split('@')[0],
        role: safeRole
      };

      // Set the user state
      setUser(user);
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Use Firebase authentication to sign out
      await firebaseService.signOut();

      // Clear user state and cached data
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('cachedUser');
    } catch (error) {
      // Even if the API call fails, clear the local state
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('cachedUser');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth hook
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Enhanced Notification Context with Multi-Channel Support
const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email) {
      loadNotifications();
      loadPreferences();
      requestNotificationPermission();
      
      // Set up automated notification checking
      const interval = setInterval(checkAutomatedNotifications, 60000); // Every minute
      return () => clearInterval(interval);
    }
  }, [user]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (import.meta?.env?.DEV) {
      console.log('Notification permission:', permission);
      }
    }
  };

  const loadNotifications = async () => {
    try {
      const notificationData = await firebaseService.getNotifications(user?.email);
      setNotifications(notificationData);
      setUnreadCount(notificationData.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadPreferences = async () => {
    try {
      const prefs = await firebaseService.getNotificationPreferences(user?.email);
      // Ensure preferences have all required fields
      const defaultPrefs = firebaseService.getDefaultPreferences();
      setPreferences({ ...defaultPrefs, ...prefs });
    } catch (error) {
      // Silently handle errors - use defaults
      const defaultPrefs = firebaseService.getDefaultPreferences();
      setPreferences(defaultPrefs);
    }
  };

  const createNotification = async (notification) => {
    try {
      await firebaseService.createNotification(user?.email, notification);
      loadNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await firebaseService.markNotificationAsRead(user?.email, notificationId);
      loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await firebaseService.markAllNotificationsAsRead(user?.email);
      loadNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const updatePreferences = async (newPreferences) => {
    try {
      const updated = await firebaseService.updateNotificationPreferences(user?.email, newPreferences);
      setPreferences(updated);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const checkAutomatedNotifications = async () => {
    try {
      await firebaseService.checkAndSendAutomatedNotifications();
      loadNotifications();
    } catch (error) {
      console.error('Error checking automated notifications:', error);
    }
  };

  const sendBulkNotification = async (userEmails, notification) => {
    try {
      return await firebaseService.sendBulkNotification(userEmails, notification);
    } catch (error) {
      console.error('Error sending bulk notification:', error);
      return [];
    }
  };

  const getAnalytics = async (days = 30) => {
    try {
      return await firebaseService.getNotificationAnalytics(user?.email, days);
    } catch (error) {
      console.error('Error getting notification analytics:', error);
      return null;
    }
    }

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      preferences,
      createNotification,
      markAsRead,
      markAllAsRead,
      updatePreferences,
      loadNotifications,
      sendBulkNotification,
      getAnalytics
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

// Utility Components
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  loading = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#3B0A69] text-white hover:bg-[#2d0851] focus:ring-[#3B0A69] shadow-sm hover:shadow-md',
    secondary: 'bg-white text-[#3B0A69] border border-[#3B0A69] hover:bg-[#3B0A69] hover:text-white focus:ring-[#3B0A69]',
    ghost: 'text-gray-600 hover:text-[#3B0A69] hover:bg-gray-50 focus:ring-gray-200',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-md gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-lg gap-2',
    lg: 'px-6 py-3 text-base rounded-lg gap-2'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

const Card = ({ children, className = '', hover = true }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} ${className}`}>
      {children}
    </div>
  );
};

const Badge = ({ children, variant = 'default', size = 'sm' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Navigation Components
const Sidebar = ({ isOpen, onClose, currentView, setCurrentView }) => {
  const { user, logout } = useAuth();
  
  const adminNavItems = [
    { icon: BarChart3, label: 'Dashboard', id: 'dashboard' },
    { icon: TrendingUp, label: 'Analytics', id: 'analytics' },
    { icon: Users, label: 'Clients', id: 'clients' },
    { icon: User, label: 'Contractors', id: 'contractors' },
    { icon: Briefcase, label: 'Jobs', id: 'jobs' },
    { icon: Calendar, label: 'Schedule', id: 'schedule' },
    { icon: FileText, label: 'Invoices', id: 'invoices' },
    { icon: Upload, label: 'Files', id: 'files' },
    { icon: MessageSquare, label: 'Messages', id: 'messages' },
        { icon: Mail, label: 'Email', id: 'email' },
    { icon: HelpCircle, label: 'Quote Requests', id: 'quotes' },
    { icon: Settings, label: 'Settings', id: 'settings' }
  ];
  
  const clientNavItems = [
    { icon: BarChart3, label: 'Dashboard', id: 'dashboard' },
    { icon: Briefcase, label: 'My Jobs', id: 'jobs' },
    { icon: Calendar, label: 'Book Service', id: 'schedule' },
    { icon: FileText, label: 'Invoices', id: 'invoices' },
    { icon: Upload, label: 'Files', id: 'files' },
    { icon: ShoppingBag, label: 'Shop Retailers', id: 'affiliates' },
    { icon: MessageSquare, label: 'Support', id: 'support' },
    { icon: Settings, label: 'Profile', id: 'profile' }
  ];
  
  const contractorNavItems = [
    { icon: BarChart3, label: 'Dashboard', id: 'dashboard' },
    { icon: Briefcase, label: 'Assigned Jobs', id: 'jobs' },
    { icon: Calendar, label: 'Schedule', id: 'schedule' },
    { icon: Upload, label: 'Files', id: 'files' },
    { icon: MessageSquare, label: 'Messages', id: 'messages' },
    { icon: Settings, label: 'Profile', id: 'profile' }
  ];
  
  const navItems = user?.role === 'admin' ? adminNavItems : 
                   user?.role === 'contractor' ? contractorNavItems : clientNavItems;
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Tech ePhi logo" className="w-[35.2px] h-[36.8px] rounded-lg object-contain" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Tech ePhi</h1>
                <p className="text-xs text-gray-500 capitalize">{user?.role} Portal</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              if (item.external) {
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      window.location.href = '/bookforge';
                      onClose();
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-left rounded-lg transition-colors duration-150 text-gray-700 hover:bg-gray-50 hover:text-[#3B0A69]"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    onClose();
                  }}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 text-left rounded-lg transition-colors duration-150 ${
                    currentView === item.id 
                      ? 'bg-[#3B0A69] text-white' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#3B0A69]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
          
          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
              <div className="w-10 h-10 bg-[#3B0A69] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.displayName || user?.email}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Header = ({ onMenuClick, title = 'Dashboard', currentView }) => {
  const { user } = useAuth();
  
  const getPageTitle = (view) => {
    const titles = {
      dashboard: 'Dashboard',
      clients: 'Client Management',
      contractors: 'Contractor Management',
      jobs: user?.role === 'admin' ? 'Job Management' : user?.role === 'contractor' ? 'Assigned Jobs' : 'My Jobs',
      invoices: 'Invoices',
      messages: 'Messages',
      support: 'Support',
      schedule: 'Schedule Management',
      booking: 'Book Service',
      profile: 'Profile',
      settings: 'Settings',
      analytics: 'Business Analytics',
      files: 'File Management',
      email: 'Email',
      quotes: 'Quote Requests',
      affiliates: 'Shop Retailers'
    };
    return titles[view] || title;
  };
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle(currentView)}</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.displayName || user?.email}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            />
          </div>
          
          <NotificationDropdown />
        </div>
      </div>
    </header>
  );
};

// Dashboard Components
const MetricCard = ({ title, value, change, icon: Icon, color = 'blue' }) => {
  const colors = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    red: 'text-red-600 bg-red-100'
  };
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className="flex items-center mt-2 gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">{change}</span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

const JobCard = ({ job, onStatusChange, userRole }) => {
  const statusColors = {
    pending: 'warning',
    'in-progress': 'info',
    completed: 'success',
    cancelled: 'danger'
  };
  
  const priorityColors = {
    low: 'success',
    medium: 'warning',
    high: 'danger'
  };
  
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{job.description}</p>
          <div className="flex items-center gap-2">
            <Badge variant={statusColors[job.status]}>{job.status}</Badge>
            <Badge variant={priorityColors[job.priority]}>{job.priority} priority</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          {userRole === 'admin' && (
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{job.client}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(job.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          <span>${job.value?.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
};

// Form Components
const CreateJobModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client: '',
    clientEmail: '',
    priority: 'medium',
    dueDate: '',
    value: '',
    estimatedHours: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      client: '',
      clientEmail: '',
      priority: 'medium',
      dueDate: '',
      value: '',
      estimatedHours: ''
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Job">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              value={formData.client}
              onChange={(e) => setFormData({...formData, client: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Email
            </label>
            <input
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Value ($)
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Hours
            </label>
            <input
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({...formData, estimatedHours: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            Create Job
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Dashboard Views
const AdminDashboard = ({ setCurrentView }) => {
  const [jobs, setJobs] = useState([]);
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [jobsData, clientsData, invoicesData] = await Promise.all([
        firebase.getJobs(),
        firebase.getClients(),
        firebase.getInvoices()
      ]);
      setJobs(jobsData);
      setClients(clientsData);
      setInvoices(invoicesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (jobData) => {
    try {
      await firebase.createJob(jobData);
      loadDashboardData();
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  // Calculate monthly revenue from invoices (current month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = invoices
    .filter(inv => {
      const invDate = new Date(inv.createdAt || inv.paidDate);
      return invDate.getMonth() === currentMonth && 
             invDate.getFullYear() === currentYear &&
             inv.status === 'paid';
    })
    .reduce((sum, inv) => sum + (inv.totalAmount || inv.amount || 0), 0);

  const metrics = [
    { title: 'Active Jobs', value: jobs.filter(j => j.status !== 'completed' && j.status !== 'cancelled').length.toString(), icon: Briefcase, color: 'blue' },
    { title: 'Total Clients', value: clients.length.toString(), icon: Users, color: 'green' },
    { title: 'Monthly Revenue', value: `$${monthlyRevenue.toLocaleString()}`, icon: DollarSign, color: 'purple' },
    { title: 'Completed Jobs', value: jobs.filter(j => j.status === 'completed').length.toString(), icon: CheckCircle, color: 'green' }
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Loading dashboard...</div>
    </div>;
  }
  
  return (
    <div className="space-y-8">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      
      {/* Quick Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            className="justify-start h-auto p-4"
            onClick={() => setShowCreateJob(true)}
          >
            <Plus className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Create Job</div>
              <div className="text-sm opacity-75">Add new client project</div>
            </div>
          </Button>
          <Button 
            variant="secondary" 
            className="justify-start h-auto p-4"
            onClick={() => setCurrentView && setCurrentView('clients')}
          >
            <Users className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Add Client</div>
              <div className="text-sm opacity-75">Register new customer</div>
            </div>
          </Button>
          <Button 
            variant="ghost" 
            className="justify-start h-auto p-4 border border-gray-200"
            onClick={() => setCurrentView && setCurrentView('invoices')}
          >
            <FileText className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Generate Invoice</div>
              <div className="text-sm opacity-75">Create billing document</div>
            </div>
          </Button>
        </div>
      </Card>
      
      {/* Recent Jobs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setCurrentView && setCurrentView('jobs')}
          >
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {jobs.slice(0, 3).map((job) => (
            <JobCard key={job.id} job={job} userRole="admin" />
          ))}
        </div>
      </div>

      <CreateJobModal 
        isOpen={showCreateJob}
        onClose={() => setShowCreateJob(false)}
        onSubmit={handleCreateJob}
      />
    </div>
  );
};

const ClientDashboard = ({ setCurrentView }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientData();
  }, [user]);

  const loadClientData = async () => {
    try {
      const [jobsData, invoicesData] = await Promise.all([
        firebase.getJobs(),
        firebase.getInvoices()
      ]);

      // Filter data for current client
      const clientJobs = jobsData.filter(job => job.clientEmail === user?.email);
      const clientInvoices = invoicesData.filter(invoice => invoice.clientEmail === user?.email);

      setJobs(clientJobs);
      setInvoices(clientInvoices);
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = invoices.reduce((sum, inv) => sum + (inv.totalAmount || inv.amount || 0), 0);
  
  const clientMetrics = [
    { title: 'Active Projects', value: jobs.filter(j => j.status !== 'completed' && j.status !== 'cancelled').length.toString(), icon: Briefcase, color: 'blue' },
    { title: 'Completed Jobs', value: jobs.filter(j => j.status === 'completed').length.toString(), icon: CheckCircle, color: 'green' },
    { title: 'Total Invoices', value: invoices.length.toString(), icon: FileText, color: 'purple' },
    { title: 'Total Spent', value: `$${totalSpent.toLocaleString()}`, icon: DollarSign, color: 'purple' }
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Loading dashboard...</div>
    </div>;
  }
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {clientMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Request New Service</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            className="justify-start h-auto p-4"
            onClick={() => setCurrentView && setCurrentView('schedule')}
          >
            <Plus className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">New Project</div>
              <div className="text-sm opacity-75">Start a new IT project</div>
            </div>
          </Button>
          <Button 
            variant="secondary" 
            className="justify-start h-auto p-4"
            onClick={() => setCurrentView && setCurrentView('support')}
          >
            <MessageSquare className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Support Ticket</div>
              <div className="text-sm opacity-75">Get help with existing services</div>
            </div>
          </Button>
        </div>
      </Card>

      {jobs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Projects</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} userRole="client" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ContractorDashboard = ({ setCurrentView }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContractorData();
  }, [user]);

  const loadContractorData = async () => {
    try {
      const jobsData = await firebase.getJobs();
      // Filter jobs assigned to current contractor
      const contractorJobs = jobsData.filter(job => job.contractorEmail === user?.email);
      setJobs(contractorJobs);
    } catch (error) {
      console.error('Error loading contractor data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate completed jobs this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const completedThisMonth = jobs.filter(job => {
    if (job.status !== 'completed') return false;
    const completedDate = new Date(job.completedAt || job.updatedAt || job.createdAt);
    return completedDate.getMonth() === currentMonth && 
           completedDate.getFullYear() === currentYear;
  }).length;

  // Calculate total estimated hours from active jobs
  const totalEstimatedHours = jobs
    .filter(j => j.status !== 'completed' && j.status !== 'cancelled')
    .reduce((sum, job) => sum + (parseInt(job.estimatedHours) || 0), 0);

  const contractorMetrics = [
    { title: 'Assigned Jobs', value: jobs.filter(j => j.status !== 'completed' && j.status !== 'cancelled').length.toString(), icon: Briefcase, color: 'blue' },
    { title: 'Completed This Month', value: completedThisMonth.toString(), icon: CheckCircle, color: 'green' },
    { title: 'Estimated Hours', value: totalEstimatedHours.toString(), icon: Clock, color: 'purple' },
    { title: 'Total Jobs', value: jobs.length.toString(), icon: Briefcase, color: 'yellow' }
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Loading dashboard...</div>
    </div>;
  }
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contractorMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h2>
        <div className="space-y-3">
          {(() => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const todayEvents = jobs
              .filter(job => {
                if (!job.dueDate) return false;
                const jobDate = new Date(job.dueDate);
                jobDate.setHours(0, 0, 0, 0);
                return jobDate.getTime() === today.getTime() && 
                       job.status !== 'completed' && 
                       job.status !== 'cancelled';
              })
              .slice(0, 5)
              .map(job => ({
                time: job.dueDate ? new Date(job.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'All Day',
                task: job.title || 'Untitled Job',
                location: job.location || 'TBD'
              }));
            
            if (todayEvents.length === 0) {
              return (
                <div className="text-center py-8 text-gray-500">
                  No scheduled tasks for today
                </div>
              );
            }
            
            return todayEvents.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-[#3B0A69] min-w-[80px]">{item.time}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.task}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
      </Card>

      {jobs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Assigned Jobs</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} userRole="contractor" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Additional Views
const JobsView = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateJob, setShowCreateJob] = useState(false);

  useEffect(() => {
    loadJobs();
  }, [user]);

  const loadJobs = async () => {
    try {
      const jobsData = await firebase.getJobs();
      
      // Filter based on user role
      let filteredJobs = jobsData;
      if (user?.role === 'client') {
        filteredJobs = jobsData.filter(job => job.clientEmail === user?.email);
      } else if (user?.role === 'contractor') {
        filteredJobs = jobsData.filter(job => job.contractorEmail === user?.email);
      }
      
      setJobs(filteredJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (jobData) => {
    try {
      await firebase.createJob(jobData);
      loadJobs();
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Loading jobs...</div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {user?.role === 'admin' && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
            <p className="text-gray-600">Manage all client projects and assignments</p>
          </div>
          <Button onClick={() => setShowCreateJob(true)}>
            <Plus className="w-4 h-4" />
            Create Job
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} userRole={user?.role} />
        ))}
      </div>

      {jobs.length === 0 && (
        <Card className="p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-4">
            {user?.role === 'admin' 
              ? 'Create your first job to get started' 
              : 'No jobs assigned to you yet'}
          </p>
          {user?.role === 'admin' && (
            <Button onClick={() => setShowCreateJob(true)}>
              <Plus className="w-4 h-4" />
              Create First Job
            </Button>
          )}
        </Card>
      )}

      {user?.role === 'admin' && (
        <CreateJobModal 
          isOpen={showCreateJob}
          onClose={() => setShowCreateJob(false)}
          onSubmit={handleCreateJob}
        />
      )}
    </div>
  );
};

// Quote Requests View for Admin
const QuoteRequestsView = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'contacted', 'converted'

  useEffect(() => {
    loadQuotes();
  }, [filter]);

  const loadQuotes = async () => {
    try {
      const quotesData = await firebase.getQuoteRequests(filter !== 'all' ? { status: filter } : {});
      setQuotes(quotesData);
    } catch (error) {
      console.error('Error loading quote requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (quoteId, newStatus) => {
    try {
      await firebase.updateQuoteRequest(quoteId, { status: newStatus });
      loadQuotes();
    } catch (error) {
      console.error('Error updating quote request:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      'contacted': { label: 'Contacted', color: 'bg-blue-100 text-blue-800' },
      'converted': { label: 'Converted', color: 'bg-green-100 text-green-800' },
      'declined': { label: 'Declined', color: 'bg-red-100 text-red-800' }
    };
    const statusInfo = statusMap[status] || statusMap['pending'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Loading quote requests...</div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quote Requests</h2>
          <p className="text-gray-600">Manage customer quote requests from the Home Solutions hub</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['all', 'pending', 'contacted', 'converted'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              filter === status
                ? 'border-b-2 border-[#3B0A69] text-[#3B0A69]'
                : 'text-gray-600 hover:text-[#3B0A69]'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({quotes.filter(q => status === 'all' || q.status === status).length})
          </button>
        ))}
      </div>

      {/* Quote Requests List */}
      <div className="space-y-4">
        {quotes.length === 0 ? (
          <Card className="p-12 text-center">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quote requests found</h3>
            <p className="text-gray-600">Quote requests submitted through the Home Solutions hub will appear here.</p>
          </Card>
        ) : (
          quotes.map((quote) => (
            <Card key={quote.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{quote.name}</h3>
                    {getStatusBadge(quote.status || 'pending')}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <Mail className="w-4 h-4 inline mr-1" />
                        <a href={`mailto:${quote.email}`} className="hover:text-[#3B0A69] transition-colors">
                          {quote.email}
                        </a>
                      </p>
                      <p className="text-sm text-gray-600">
                        <Phone className="w-4 h-4 inline mr-1" />
                        <a href={`tel:${quote.phone}`} className="hover:text-[#3B0A69] transition-colors">
                          {quote.phone}
                        </a>
                      </p>
                      {quote.address && (
                        <p className="text-sm text-gray-600">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          {quote.address}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      {quote.service && (
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Service:</strong> {quote.service}
                        </p>
                      )}
                      {quote.projectType && (
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Project Type:</strong> {quote.projectType}
                        </p>
                      )}
                      {quote.budget && (
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Budget:</strong> {quote.budget}
                        </p>
                      )}
                      {quote.timeline && (
                        <p className="text-sm text-gray-600">
                          <strong>Timeline:</strong> {quote.timeline}
                        </p>
                      )}
                    </div>
                  </div>

                  {quote.message && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{quote.message}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    Submitted: {quote.createdAt ? new Date(quote.createdAt.seconds ? quote.createdAt.seconds * 1000 : quote.createdAt).toLocaleString() : 'Unknown'}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedQuote(quote)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <a href={`mailto:${quote.email}?subject=Re: Quote Request - ${quote.service || 'Home Solutions'}`}>
                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </a>
                    <a href={`tel:${quote.phone}`}>
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                  
                  <select
                    value={quote.status || 'pending'}
                    onChange={(e) => handleStatusUpdate(quote.id, e.target.value)}
                    className="text-xs px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B0A69]"
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <Modal
          isOpen={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
          title={`Quote Request from ${selectedQuote.name}`}
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Name:</strong> {selectedQuote.name}</p>
                <p><strong>Email:</strong> <a href={`mailto:${selectedQuote.email}`} className="text-[#3B0A69] hover:underline">{selectedQuote.email}</a></p>
                <p><strong>Phone:</strong> <a href={`tel:${selectedQuote.phone}`} className="text-[#3B0A69] hover:underline">{selectedQuote.phone}</a></p>
                {selectedQuote.address && <p><strong>Address:</strong> {selectedQuote.address}</p>}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Project Details</h4>
              <div className="space-y-1 text-sm">
                {selectedQuote.service && <p><strong>Service:</strong> {selectedQuote.service}</p>}
                {selectedQuote.projectType && <p><strong>Project Type:</strong> {selectedQuote.projectType}</p>}
                {selectedQuote.budget && <p><strong>Budget:</strong> {selectedQuote.budget}</p>}
                {selectedQuote.timeline && <p><strong>Timeline:</strong> {selectedQuote.timeline}</p>}
              </div>
            </div>

            {selectedQuote.message && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Message</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{selectedQuote.message}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t">
              <a href={`mailto:${selectedQuote.email}?subject=Re: Quote Request - ${selectedQuote.service || 'Home Solutions'}`} className="flex-1">
                <Button className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </a>
              <a href={`tel:${selectedQuote.phone}`} className="flex-1">
                <Button variant="secondary" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Create Client Modal Component
const CreateClientModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await onSubmit(formData);
      // Only reset and close on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        company: ''
      });
      onClose();
    } catch (err) {
      console.error('Error creating client:', err);
      setError(err.message || 'Failed to create client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Client">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            required
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name (optional)
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            placeholder="Acme Corporation"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            required
            placeholder="client@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            required
            placeholder="407-745-6189"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address (optional)
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
            placeholder="123 Main St, City, State ZIP"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Creating...' : 'Create Client'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const ClientsView = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateClient, setShowCreateClient] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const clientsData = await firebase.getClients();
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (clientData) => {
    try {
      await firebase.createClient(clientData);
      loadClients();
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600">Loading clients...</div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Client Management</h2>
          <p className="text-gray-600">Manage your client relationships and accounts</p>
        </div>
        <Button onClick={() => setShowCreateClient(true)}>
          <Plus className="w-4 h-4" />
          Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{client.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <a 
                    href={`mailto:${client.email}`} 
                    className="hover:text-[#3B0A69] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {client.email}
                  </a>
                </p>
                <p className="text-sm text-gray-500">
                  <a 
                    href={`tel:${client.phone}`} 
                    className="hover:text-[#3B0A69] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {client.phone}
                  </a>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Jobs:</span>
                <span className="font-medium">{client.totalJobs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Jobs:</span>
                <span className="font-medium">{client.activeJobs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Spent:</span>
                <span className="font-medium">${client.totalSpent?.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <CreateClientModal
        isOpen={showCreateClient}
        onClose={() => setShowCreateClient(false)}
        onSubmit={handleCreateClient}
      />
    </div>
  );
};

// Login Components
// Login Selection Component
const LoginSelection = ({ onSelectLoginType, onBackToWebsite }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B0A69] via-purple-700 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Back to Website Button */}
        <div className="mb-6">
          <button
            onClick={onBackToWebsite}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Website
          </button>
        </div>
        
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Tech ePhi logo" className="w-[70.4px] h-[73.6px] rounded-2xl object-contain mx-auto mb-4" />
                      <h1 className="text-3xl font-bold text-white mb-2">Welcome to Tech ePhi</h1>
          <p className="text-purple-200 text-lg">Choose your login portal</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Client Portal */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-[color:var(--techephi-gold)]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Client Portal</h2>
              <p className="text-gray-600">Access your projects, invoices, and communications</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">View project progress</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Track invoices & payments</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Message your team</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Book appointments</span>
              </div>
            </div>
            
            <Button 
              onClick={() => onSelectLoginType('client')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Client Login
            </Button>
          </Card>
          
          {/* Admin/Contractor Portal */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-[color:var(--techephi-gold)]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Team Portal</h2>
              <p className="text-gray-600">Administrators and contractors access</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Manage projects & tasks</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Track time & progress</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Generate invoices</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">System administration</span>
              </div>
            </div>
            
            <Button 
              onClick={() => onSelectLoginType('team')}
              className="w-full bg-[#3B0A69] hover:bg-purple-700"
            >
              Team Login
            </Button>
          </Card>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-purple-200 text-sm">
           Need help? Contact us at <a href="mailto:support@techephi.com" className="text-[color:var(--techephi-gold)] hover:text-[#A98F00] transition-colors">support@techephi.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Client Login Form
const ClientLoginForm = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { login, register } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, 'client');
      }
    } catch (error) {
      // Use the error message from Firebase service (already user-friendly)
      const errorMessage = error.message || 'Authentication failed. Please check your credentials and try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B0A69] via-purple-700 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Sign in to your client account' : 'Create your client account'}
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" loading={loading}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
          
          {showForgotPassword && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reset Password</h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              {resetSuccess ? (
                <div className="p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
                  Password reset email sent! Please check your inbox and follow the instructions.
                </div>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setResetLoading(true);
                  setError('');
                  try {
                    await firebaseService.sendPasswordResetEmail(resetEmail || email);
                    setResetSuccess(true);
                    setTimeout(() => {
                      setShowForgotPassword(false);
                      setResetSuccess(false);
                      setResetEmail('');
                    }, 5000);
                  } catch (err) {
                    setError(err.message || 'Failed to send reset email. Please try again.');
                  } finally {
                    setResetLoading(false);
                  }
                }} className="space-y-3">
                  <input
                    type="email"
                    value={resetEmail || email}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      loading={resetLoading}
                    >
                      Send Reset Link
                    </Button>
                    <Button 
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetEmail('');
                        setResetSuccess(false);
                        setError('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to Portal Selection
            </button>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </button>
              <span className="text-gray-600 mx-2">•</span>
              <span className="text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>
            </div>
          </div>

        </Card>
      </div>
    </div>
  );
};

// Team Login Form (Admin/Contractor)
const TeamLoginForm = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('contractor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { login, register } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        // Prevent admin role registration
        if (role === 'admin') {
          setError('Administrator accounts cannot be created through registration. Please contact an existing administrator.');
          setLoading(false);
          return;
        }
        await register(email, password, role);
      }
    } catch (error) {
      // Use the error message from Firebase service (already user-friendly)
      const errorMessage = error.message || 'Authentication failed. Please check your credentials and try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B0A69] via-purple-700 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Team Portal</h1>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Sign in to your team account' : 'Create your team account'}
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                >
                  <option value="contractor">Contractor</option>
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  Administrator accounts can only be created by existing administrators.
                </p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-[#3B0A69] hover:text-purple-700 font-medium"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <Button type="submit" className="w-full bg-[#3B0A69] hover:bg-purple-700" loading={loading}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
          
          {showForgotPassword && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reset Password</h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              {resetSuccess ? (
                <div className="p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
                  Password reset email sent! Please check your inbox and follow the instructions.
                </div>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setResetLoading(true);
                  setError('');
                  try {
                    await firebaseService.sendPasswordResetEmail(resetEmail || email);
                    setResetSuccess(true);
                    setTimeout(() => {
                      setShowForgotPassword(false);
                      setResetSuccess(false);
                      setResetEmail('');
                    }, 5000);
                  } catch (err) {
                    setError(err.message || 'Failed to send reset email. Please try again.');
                  } finally {
                    setResetLoading(false);
                  }
                }} className="space-y-3">
                  <input
                    type="email"
                    value={resetEmail || email}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      className="flex-1 bg-[#3B0A69] hover:bg-purple-700"
                      loading={resetLoading}
                    >
                      Send Reset Link
                    </Button>
                    <Button 
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetEmail('');
                        setResetSuccess(false);
                        setError('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-[#3B0A69] hover:text-purple-700 text-sm font-medium"
            >
              ← Back to Portal Selection
            </button>
            <div className="mt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
                className="text-[#3B0A69] hover:text-purple-700 font-medium"
            >
                {isLogin ? 'Create Account' : 'Sign In'}
            </button>
              <span className="text-gray-600 mx-2">•</span>
              <span className="text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Removed FirebaseTestingPanel - production uses real Firebase only

// Home Solutions Quote Request Hub
const HomeSolutionsHub = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
    address: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone) {
        setError('Please fill in all required fields (Name, Email, Phone)');
        setSubmitting(false);
        return;
      }

      // Submit quote request to Firebase
      await firebase.createQuoteRequest({
        ...formData,
        source: 'home-solutions-hub',
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      // Also send notification to admin
      try {
        await firebase.createNotification('admin@techephi.com', {
          title: 'New Quote Request - Home Solutions',
          message: `${formData.name} requested a quote for ${formData.service || 'Home Solutions'}`,
          type: 'quote_request',
          actionUrl: '/admin/quotes',
          actionText: 'View Quote Request',
          read: false
        });
      } catch (notifError) {
        console.warn('Could not send notification:', notifError);
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        projectType: '',
        budget: '',
        timeline: '',
        message: '',
        address: ''
      });
    } catch (err) {
      console.error('Error submitting quote request:', err);
      setError('There was an error submitting your request. Please try again or call us at 407-745-6189');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-[#3B0A69] via-purple-700 to-purple-900 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
          <h2 className="text-3xl font-bold text-[#3B0A69] mb-4">Thank You!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Your quote request has been submitted successfully. Our team will review your request and contact you within 24-48 hours.
          </p>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Need immediate assistance?</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a 
                  href="tel:407-745-6189" 
                  className="flex items-center justify-center gap-2 text-[#3B0A69] hover:text-purple-700 font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  Call: 407-745-6189
                </a>
                <a 
                  href="mailto:support@techephi.com" 
                  className="flex items-center justify-center gap-2 text-[#3B0A69] hover:text-purple-700 font-semibold"
                >
                  <Mail className="w-4 h-4" />
                  Email: support@techephi.com
                </a>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setSubmitted(false)} variant="secondary">
                Submit Another Request
              </Button>
              {onBack && (
                <Button onClick={onBack} variant="ghost">
                  Back to Home
                </Button>
              )}
            </div>
          </div>
        </Card>
    </div>
  );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B0A69] via-purple-700 to-purple-900 pt-16">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Tech ePhi logo" className="w-[52.8px] h-[55.2px] rounded-lg object-contain" />
              <div>
                <span className="text-xl font-bold text-[#3B0A69]">Tech ePhi</span>
              </div>
            </div>
            {onBack && (
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Home Solutions Quote Request
          </h1>
          <p className="text-xl text-purple-100 mb-8">
            Get a personalized quote for your home technology needs. Fill out the form below and we'll get back to you within 24-48 hours.
          </p>
        </div>
      </section>

      {/* Quote Request Form */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <p className="font-semibold">{error}</p>
      </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold text-[#3B0A69] mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                      placeholder="407-745-6189"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Property Address (Optional)
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                      placeholder="123 Main St, City, State ZIP"
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div>
                <h3 className="text-xl font-semibold text-[#3B0A69] mb-4">Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                    >
                      <option value="">Select a service</option>
                      <option value="Smart Home Implementation">Smart Home Implementation</option>
                      <option value="Security (Home & Office)">Security (Home & Office)</option>
                      <option value="Small Projects (TV's, Lighting, etc.)">Small Projects (TV's, Lighting, etc.)</option>
                      <option value="Desktop Support | Networking">Desktop Support | Networking</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Type
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                    >
                      <option value="">Select project type</option>
                      <option value="New Installation">New Installation</option>
                      <option value="Upgrade/Update">Upgrade/Update</option>
                      <option value="Repair/Maintenance">Repair/Maintenance</option>
                      <option value="Consultation">Consultation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                    >
                      <option value="">Select budget range</option>
                      <option value="Under $500">Under $500</option>
                      <option value="$500 - $1,000">$500 - $1,000</option>
                      <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                      <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                      <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                      <option value="Over $10,000">Over $10,000</option>
                      <option value="Not sure">Not sure</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeline
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                    >
                      <option value="">Select timeline</option>
                      <option value="ASAP">ASAP</option>
                      <option value="Within 1 week">Within 1 week</option>
                      <option value="Within 1 month">Within 1 month</option>
                      <option value="1-3 months">1-3 months</option>
                      <option value="3+ months">3+ months</option>
                      <option value="Just exploring">Just exploring</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                  placeholder="Tell us about your project, what you're looking to accomplish, any specific requirements, or questions you have..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#3B0A69] hover:bg-[#2d0851] text-white"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Quote Request
                    </>
                  )}
                </Button>
                {onBack && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onBack}
                    size="lg"
                  >
                    Cancel
                  </Button>
                )}
              </div>

              {/* Contact Info */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  Need immediate assistance? Call us at{' '}
                  <a href="tel:407-745-6189" className="text-[#3B0A69] font-semibold hover:underline">
                    407-745-6189
                  </a>
                  {' '}or email{' '}
                  <a href="mailto:support@techephi.com" className="text-[#3B0A69] font-semibold hover:underline">
                    support@techephi.com
                  </a>
                </p>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
};

// Public Website Component
const PublicWebsite = ({ onShowLogin, onShowPage }) => {
  const { login } = useAuth();
  
  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-16">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Tech ePhi logo" className="w-[52.8px] h-[55.2px] rounded-lg object-contain" />
                      <div>
                            <span className="text-xl font-bold text-[#3B0A69]">Tech ePhi</span>
            </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
                <a href="tel:407-745-6189" className="flex items-center gap-1 hover:text-brand-primary">
                  <Phone className="w-4 h-4" />
                  <span>407-745-6189</span>
                </a>
                <a href="mailto:support@techephi.com" className="flex items-center gap-1 hover:text-brand-primary">
                  <Mail className="w-4 h-4" />
                  <span>support@techephi.com</span>
                </a>
              </div>
                          <Button 
              className="bg-[#3B0A69] hover:bg-[#2d0851] text-white"
              onClick={onShowLogin}
            >
              Client Portal
            </Button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#3B0A69] via-purple-700 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--techephi-gold)]/10 to-[color:var(--techephi-gold)]/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
                              <span className="text-[color:var(--techephi-gold)]">Tech ePhi</span>
          </h1>
            <p className="text-2xl md:text-3xl font-semibold text-[color:var(--techephi-gold)] mb-2">
              The Technological Handy Man!
            </p>
          </div>
          <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
            From smart home implementation to business security solutions - 
            your trusted technology partner for all projects, big and small.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-[color:var(--techephi-gold)] hover:bg-[#A98F00] text-[#3B0A69] font-semibold"
              onClick={() => window.location.href = 'tel:407-745-6189'}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Now: 407-745-6189
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-white border-white hover:bg-white hover:text-[#3B0A69]"
              onClick={() => window.location.href = 'mailto:support@techephi.com'}
            >
              <Mail className="w-5 h-5 mr-2" />
              Get Quote
            </Button>
          </div>
        </div>
      </section>
      
      {/* Services Hub */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3B0A69] mb-4">
              Our Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional technology solutions for your home and business needs
            </p>
          </div>
          
          {/* Home Solutions Section */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-[color:var(--techephi-gold)] rounded-full"></div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#3B0A69]">Home Solutions</h3>
              <div className="flex-1 h-1 bg-[color:var(--techephi-gold)] rounded-full"></div>
            </div>
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600 mb-4">
                Get a personalized quote for your home technology needs
              </p>
              <Button 
                size="lg"
                className="bg-[#3B0A69] hover:bg-[#2d0851] text-white"
                onClick={() => {
                  window.history.pushState({}, '', '/home-solutions');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
              >
                Request a Quote
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Globe,
                  title: 'Smart Home Implementation',
                  description: 'Complete smart home setup including automation, lighting, security systems, and device integration.',
                  page: 'smart-home'
                },
                {
                  icon: Shield,
                  title: 'Security (Home & Office)',
                  description: 'Comprehensive security solutions including cameras, alarms, access control, and monitoring systems.',
                  page: 'security'
                },
                {
                  icon: Settings,
                  title: 'Small Projects',
                  description: 'TV mounting, lighting installation, smart device setup, and other technology installations.',
                  page: 'small-projects'
                },
                {
                  icon: Activity,
                  title: 'Desktop Support | Networking',
                  description: 'Computer repair, network setup, troubleshooting, and ongoing technical support services.',
                  page: 'desktop-support'
                }
              ].map((service, index) => {
                const cardContent = (
                  <>
                  <div className="w-16 h-16 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-8 h-8 text-[color:var(--techephi-gold)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#3B0A69] mb-3">{service.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                  </>
                );

                if (service.page) {
                  return (
                    <button
                      key={index}
                      onClick={() => onShowPage && onShowPage(service.page)}
                      className="w-full p-6 text-center hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-[color:var(--techephi-gold)] hover:-translate-y-1 rounded-xl bg-white cursor-pointer"
                    >
                      {cardContent}
                    </button>
                  );
                }

                return (
                  <Card key={index} className="p-6 text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-[color:var(--techephi-gold)] hover:-translate-y-1">
                    {cardContent}
                </Card>
                );
              })}
            </div>
          </div>

          {/* Premium Applications Section */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-[color:var(--techephi-gold)] rounded-full"></div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#3B0A69]">Premium Applications</h3>
              <div className="flex-1 h-1 bg-[color:var(--techephi-gold)] rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Code,
                  title: 'Web Design and Application Development',
                  description: 'Custom website design, web applications, mobile apps, and digital solutions for your business.',
                  page: 'web-design'
                },
                {
                  icon: MessageSquare,
                  title: 'Social Media Management',
                  description: 'Professional social media strategy, content creation, and online presence management.',
                  page: 'social-media'
                },
                {
                  icon: User,
                  title: 'Technology Solutions',
                  description: 'Comprehensive technology solutions including web design, application development, digital transformations, and custom software development.',
                  page: 'technology'
                },
                {
                  icon: MoreHorizontal,
                  title: 'Other Services',
                  description: "Don't see your need listed? Tell us what you need - we can likely help or point you in the right direction.",
                  page: 'other-services'
                }
              ].map((service, index) => {
                const cardContent = (
                  <>
                    <div className="w-16 h-16 bg-gradient-to-br from-[#3B0A69] to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <service.icon className="w-8 h-8 text-[color:var(--techephi-gold)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#3B0A69] mb-3">{service.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                  </>
                );

                if (service.link) {
                  return (
                    <a
                      key={index}
                      href={service.link}
                      className="block p-6 text-center hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-[color:var(--techephi-gold)] hover:-translate-y-1 rounded-xl bg-white cursor-pointer"
                    >
                      {cardContent}
                    </a>
                  );
                }

                if (service.page) {
                  return (
                    <button
                      key={index}
                      onClick={() => onShowPage && onShowPage(service.page)}
                      className="w-full p-6 text-center hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-[color:var(--techephi-gold)] hover:-translate-y-1 rounded-xl bg-white cursor-pointer"
                    >
                      {cardContent}
                    </button>
                  );
                }

                return (
                  <Card key={index} className="p-6 text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-[color:var(--techephi-gold)] hover:-translate-y-1">
                    {cardContent}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact */}
      <section className="py-20 bg-gradient-to-br from-[#3B0A69] to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready for Your Next Technology Project?
              </h2>
              <p className="text-xl text-purple-100 mb-8">
                Contact Brian Blair today for expert consultation and personalized technology solutions.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[color:var(--techephi-gold)] rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[#3B0A69]" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg">
                      <a 
                        href="tel:407-745-6189" 
                        className="hover:text-[color:var(--techephi-gold)] transition-colors"
                      >
                        407-745-6189
                      </a>
                    </p>
                    <p className="text-purple-200">Call or text anytime</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[color:var(--techephi-gold)] rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#3B0A69]" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg">
                      <a 
                        href="mailto:support@techephi.com" 
                        className="hover:text-[color:var(--techephi-gold)] transition-colors"
                      >
                        support@techephi.com
                      </a>
                    </p>
                    <p className="text-purple-200">Email for quotes and questions</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[color:var(--techephi-gold)] rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-[#3B0A69]" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg">Brian Blair</p>
                    <p className="text-purple-200">Owner | Consultant</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                <p className="text-[color:var(--techephi-gold)] font-semibold text-lg mb-2">
                  "The Technological Handy Man!"
                </p>
                <p className="text-purple-100">
                  Your trusted partner for all technology needs - from smart home setups to business security solutions.
                </p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Get a Free Quote</h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-white/20 bg-white/10 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--techephi-gold)] focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 border border-white/20 bg-white/10 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--techephi-gold)] focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 border border-white/20 bg-white/10 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--techephi-gold)] focus:border-transparent"
                  />
                </div>
                <div>
                  <select name="service" className="w-full px-4 py-3 border border-white/20 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--techephi-gold)] focus:border-transparent">
                    <option value="" className="text-gray-900">Select Service</option>
                    <option value="Smart Home Implementation" className="text-gray-900">Smart Home Implementation</option>
                    <option value="Security (Home & Office)" className="text-gray-900">Security (Home & Office)</option>
                    <option value="Small Projects (TV's, Lighting, etc.)" className="text-gray-900">Small Projects (TV's, Lighting, etc.)</option>
                    <option value="Desktop Support | Networking" className="text-gray-900">Desktop Support | Networking</option>
                    <option value="Social Media Management" className="text-gray-900">Social Media Management</option>
                    <option value="Web Design and Application Development" className="text-gray-900">Web Design and Application Development</option>
                    <option value="Technology Solutions" className="text-gray-900">Technology Solutions</option>
                    <option value="Other" className="text-gray-900">Other</option>
                  </select>
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder="Tell us about your project..."
                    rows={4}
                    className="w-full px-4 py-3 border border-white/20 bg-white/10 text-white placeholder-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--techephi-gold)] focus:border-transparent"
                  ></textarea>
                </div>
                <Button 
                  className="w-full bg-[color:var(--techephi-gold)] hover:bg-[#A98F00] text-[#3B0A69] font-semibold"
                  onClick={() => {
                    const form = document.querySelector('form');
                    const formData = new FormData(form);
                    const name = formData.get('name') || '';
                    const email = formData.get('email') || '';
                    const phone = formData.get('phone') || '';
                    const service = formData.get('service') || '';
                    const message = formData.get('message') || '';
                    
                    const subject = `New Quote Request - ${service || 'General Inquiry'}`;
                    const body = `Hello Tech ePhi Team,

I am interested in your services and would like to request a quote.

Contact Information:
Name: ${name}
Email: ${email}
Phone: ${phone}

Service Requested: ${service || 'Not specified'}

Project Details:
${message}

Please contact me at your earliest convenience to discuss my project requirements and provide a quote.

Thank you for your time and consideration.

Best regards,
${name}`;

                    const mailtoLink = `mailto:support@techephi.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.location.href = mailtoLink;
                  }}
                >
                  Send Message <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Tech ePhi logo" className="w-[44px] h-[46px] rounded-lg object-contain" />
              <div>
                <span className="text-xl font-bold text-[color:var(--techephi-gold)]">Tech ePhi</span>
                  <div className="text-xs text-gray-400">The Technological Handy Man!</div>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted technology partner for smart home implementation, security solutions, and all your tech needs.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-[color:var(--techephi-gold)]">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Smart Home Implementation</li>
                <li>Security (Home & Office)</li>
                <li>Small Projects (TV's, Lighting)</li>
                <li>Desktop Support | Networking</li>
                <li>Social Media Management</li>
                <li>Web Design and Application Development</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-[color:var(--techephi-gold)]">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:407-745-6189" className="hover:text-[color:var(--techephi-gold)] transition-colors">
                    407-745-6189
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:support@techephi.com" className="hover:text-[color:var(--techephi-gold)] transition-colors">
                    support@techephi.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Brian Blair - Owner | Consultant
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                &copy; 2025 Tech ePhi. All rights reserved. | The Technological Handy Man!
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <button
                  onClick={() => onShowPage && onShowPage('privacy')}
                  className="text-gray-400 hover:text-[color:var(--techephi-gold)] transition-colors"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => onShowPage && onShowPage('about')}
                  className="text-gray-400 hover:text-[color:var(--techephi-gold)] transition-colors"
                >
                  About Us
                </button>
                <button
                  onClick={() => onShowPage && onShowPage('terms')}
                  className="text-gray-400 hover:text-[color:var(--techephi-gold)] transition-colors"
                >
                  Terms & Conditions
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App Component
const AffiliateLinksView = () => {
  const [productImages, setProductImages] = useState({});
  const [imagesLoading, setImagesLoading] = useState(true);

  // Function to fetch product images
  const fetchProductImages = async () => {
    const productUrls = [
      'https://amzn.to/49qm6ED',
      'https://amzn.to/4jzfzMI',
      'https://amzn.to/3YrzYcM',
      'https://amzn.to/3N65xX6',
      'https://amzn.to/4ppha8Y'
    ];

    const resolvedImages = {};

    try {
      // Fetch images for each product URL
      for (const url of productUrls) {
        try {
          // Try to fetch from our API endpoint
          const response = await fetch('/api/amazon-product', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url })
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.imageUrl && !data.imageUrl.includes('[IMAGE_ID]')) {
              resolvedImages[url] = data.imageUrl;
            } else {
              // Fallback to placeholder
              resolvedImages[url] = 'https://via.placeholder.com/300x300?text=Product+Image';
            }
          } else {
            resolvedImages[url] = 'https://via.placeholder.com/300x300?text=Product+Image';
          }
        } catch (error) {
          console.error(`Error fetching image for ${url}:`, error);
          resolvedImages[url] = 'https://via.placeholder.com/300x300?text=Product+Image';
        }
      }

      setProductImages(resolvedImages);
    } catch (error) {
      console.error('Error fetching product images:', error);
      // Set all to placeholders on error
      productUrls.forEach(url => {
        resolvedImages[url] = 'https://via.placeholder.com/300x300?text=Product+Image';
      });
      setProductImages(resolvedImages);
    } finally {
      setImagesLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchProductImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const retailers = [
    {
      name: 'Amazon',
      description: 'Shop for electronics, smart home devices, and more',
      icon: '🛒',
      url: 'https://amazon.com?tag=Techephillc-20',
      categories: ['Electronics', 'Smart Home', 'Accessories', 'Tools']
    },
    {
      name: 'Best Buy',
      description: 'Electronics, appliances, and tech products',
      icon: '📺',
      url: 'https://bestbuy.com',
      categories: ['TVs', 'Computers', 'Appliances', 'Gaming']
    },
    {
      name: 'Home Depot',
      description: 'Home improvement and building supplies',
      icon: '🏠',
      url: 'https://homedepot.com',
      categories: ['Tools', 'Electrical', 'Lighting', 'Hardware']
    },
    {
      name: 'Lowe\'s',
      description: 'Home improvement and garden supplies',
      icon: '🔧',
      url: 'https://lowes.com',
      categories: ['Tools', 'Electrical', 'Plumbing', 'Outdoor']
    },
    {
      name: 'Target',
      description: 'Electronics, home goods, and more',
      icon: '🎯',
      url: 'https://target.com',
      categories: ['Electronics', 'Home', 'Smart Home']
    },
    {
      name: 'Walmart',
      description: 'Electronics and home essentials',
      icon: '🛍️',
      url: 'https://walmart.com',
      categories: ['Electronics', 'Home', 'Accessories']
    }
  ];

  const handleAffiliateClick = (retailerName, url) => {
    // Track affiliate link clicks (you can add analytics here)
    console.log(`Affiliate link clicked: ${retailerName}`);
    
    // Add Amazon affiliate tag to Amazon links
    let finalUrl = url;
    if (url.includes('amazon.com') || url.includes('amzn.to')) {
      // Check if URL already has query parameters
      const separator = url.includes('?') ? '&' : '?';
      // Add affiliate tag if not already present
      if (!url.includes('tag=')) {
        finalUrl = `${url}${separator}tag=Techephillc-20`;
      } else if (!url.includes('tag=Techephillc-20')) {
        // Replace existing tag with our tag
        finalUrl = url.replace(/tag=[^&]*/, 'tag=Techephillc-20');
      }
    }
    
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-[#3B0A69]" />
            Recommended Retailers
          </h1>
          <p className="text-gray-600 mt-2">
            Shop at these trusted retailers for your technology and home improvement needs
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="bg-gradient-to-r from-[#3B0A69] to-purple-700 text-white p-6">
        <div className="flex items-start gap-4">
          <Gift className="w-6 h-6 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-2">Support Tech ePhi</h3>
            <p className="text-purple-100">
              When you shop through these links, you help support Tech ePhi at no extra cost to you. 
              We've curated these retailers based on quality products and reliable service.
            </p>
          </div>
        </div>
      </Card>

      {/* Featured Products Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="w-6 h-6 text-[#3B0A69]" />
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            // To add product images:
            // 1. Go to the Amazon product page
            // 2. Right-click on the main product image
            // 3. Select "Copy image address" or "Copy image URL"
            // 4. Paste the URL in the imageUrl field below
            // Example: imageUrl: 'https://m.media-amazon.com/images/I/...'
            {
              title: 'Smart Home Security Device',
              description: 'Professional-grade security solution for your home',
              url: 'https://amzn.to/49qm6ED',
              category: 'Security',
              imageUrl: null // Paste Amazon product image URL here
            },
            {
              title: 'Smart Home Technology',
              description: 'Advanced smart home device for automation',
              url: 'https://amzn.to/4jzfzMI',
              category: 'Smart Home',
              imageUrl: null // Add direct image URL here
            },
            {
              title: 'Home Security Solution',
              description: 'Reliable security system for peace of mind',
              url: 'https://amzn.to/3YrzYcM',
              category: 'Security',
              imageUrl: null // Add direct image URL here
            },
            {
              title: 'Smart Device',
              description: 'Cutting-edge technology for your home',
              url: 'https://amzn.to/3N65xX6',
              category: 'Smart Home',
              imageUrl: null // Add direct image URL here
            },
            {
              title: 'Amazon Product',
              description: 'Quality product for your home and technology needs',
              url: 'https://amzn.to/4ppha8Y',
              category: 'Electronics',
              imageUrl: null // Add direct image URL here
            }
          ].map((product, index) => {
            // Use manual imageUrl if provided, otherwise try fetched image, otherwise placeholder
            const productImage = product.imageUrl || productImages[product.url] || 'https://via.placeholder.com/300x300?text=Product+Image';
            const isLoading = imagesLoading && !product.imageUrl && !productImages[product.url];
            
            return (
              <Card key={index} className="p-5 hover:shadow-lg transition-all duration-300 border-2 hover:border-[#3B0A69]">
                {/* Product Image */}
                <div className="mb-4 relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-[#3B0A69] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <img
                      src={productImage}
                      alt={product.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=Product+Image';
                      }}
                    />
                  )}
                </div>
                
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-[#3B0A69] text-white rounded-md">
                        {product.category}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-md">
                        Featured
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.title}</h3>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleAffiliateClick('Amazon - Featured Product', product.url)}
                  className="w-full"
                >
                  <Store className="w-4 h-4 mr-2" />
                  View on Amazon
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Retailer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {retailers.map((retailer, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-[#3B0A69]">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{retailer.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{retailer.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{retailer.description}</p>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {retailer.categories.map((category, catIndex) => (
                  <span
                    key={catIndex}
                    className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => handleAffiliateClick(retailer.name, retailer.url)}
              className="w-full"
            >
              <Store className="w-4 h-4 mr-2" />
              Shop at {retailer.name}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        ))}
      </div>

      {/* Popular Categories Section */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Search className="w-6 h-6 text-[#3B0A69]" />
          Popular Shopping Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Smart Home Devices', icon: '🏠', retailers: ['Amazon', 'Best Buy', 'Target'] },
            { name: 'TVs & Entertainment', icon: '📺', retailers: ['Best Buy', 'Amazon', 'Walmart'] },
            { name: 'Computers & Accessories', icon: '💻', retailers: ['Best Buy', 'Amazon'] },
            { name: 'Home Improvement', icon: '🔨', retailers: ['Home Depot', 'Lowe\'s'] },
            { name: 'Security Systems', icon: '🔒', retailers: ['Best Buy', 'Amazon', 'Home Depot'] },
            { name: 'Networking Equipment', icon: '📡', retailers: ['Best Buy', 'Amazon'] },
            { name: 'Lighting Solutions', icon: '💡', retailers: ['Home Depot', 'Lowe\'s', 'Amazon'] },
            { name: 'Tools & Hardware', icon: '🛠️', retailers: ['Home Depot', 'Lowe\'s'] }
          ].map((category, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-[#3B0A69] transition-colors">
              <div className="text-3xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
              <div className="text-sm text-gray-600">
                <p className="mb-1">Available at:</p>
                <ul className="list-disc list-inside space-y-1">
                  {category.retailers.map((retailer, rIndex) => (
                    <li key={rIndex} className="text-xs">{retailer}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Footer Note */}
      <Card className="bg-gray-50 border-gray-200 p-6">
        <div className="flex items-start gap-3">
          <Star className="w-5 h-5 text-[#3B0A69] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-2">About Affiliate Links</p>
            <p>
              Tech ePhi may earn a small commission when you make purchases through these affiliate links. 
              This helps us continue providing excellent service and support. The prices you see are the same 
              as if you visited the retailer directly - there's no additional cost to you.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

const SupportAndFeedbackView = () => {
  const [activeTab, setActiveTab] = useState('help');
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const helpTopics = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      content: [
        {
          question: 'How do I create my first job?',
          answer: 'Navigate to the Jobs section and click "Create New Job". Fill in the required details including job title, description, and timeline.'
        },
        {
          question: 'How do I track time on tasks?',
          answer: 'Go to the Time Tracking tab in any job detail view. Click "Start Timer" on any task to begin tracking your time.'
        },
        {
          question: 'How do I upload files?',
          answer: 'Visit the Files section and click "Upload File". You can attach files to specific jobs or upload general documents.'
        }
      ]
    },
    {
      id: 'billing',
      title: 'Billing & Invoices',
      icon: DollarSign,
      content: [
        {
          question: 'How do I create an invoice?',
          answer: 'Go to the Invoices section and click "Create Invoice". Select the job and add line items with descriptions and amounts.'
        },
        {
          question: 'How do I pay an invoice?',
          answer: 'View the invoice details and click "Pay Invoice". You can pay using the available payment methods.'
        },
        {
          question: 'How do I track payment status?',
          answer: 'All invoices show their current status (Pending, Paid, Overdue) in the Invoices list view.'
        }
      ]
    },
    {
      id: 'communication',
      title: 'Communication',
      icon: MessageSquare,
      content: [
        {
          question: 'How do I send a message?',
          answer: 'Go to the Messages section and click "New Conversation" to start a new chat with team members.'
        },
        {
          question: 'How do I get notifications?',
          answer: 'Visit your Profile settings to configure notification preferences for email, SMS, and browser notifications.'
        },
        {
          question: 'How do I schedule meetings?',
          answer: 'Use the Schedule section to book appointments with contractors or schedule team meetings.'
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: AlertCircle,
      content: [
        {
          question: 'I can\'t log in to my account',
          answer: 'Check that you\'re using the correct email and password. If you\'ve forgotten your password, use the "Forgot Password" link.'
        },
        {
          question: 'My changes aren\'t saving',
          answer: 'Make sure you have a stable internet connection. Try refreshing the page and attempting the action again.'
        },
        {
          question: 'I\'m not receiving notifications',
          answer: 'Check your notification preferences in Profile settings. Ensure you\'ve granted browser notification permissions.'
        }
      ]
    }
  ];

  const feedbackCategories = [
    {
      id: 'bug-report',
      title: 'Bug Report',
      icon: AlertTriangle,
      description: 'Report technical issues or unexpected behavior'
    },
    {
      id: 'feature-request',
      title: 'Feature Request',
      icon: Plus,
      description: 'Suggest new features or improvements'
    },
    {
      id: 'general-feedback',
      title: 'General Feedback',
      icon: MessageSquare,
      description: 'Share your thoughts about the platform'
    },
    {
      id: 'support-request',
      title: 'Support Request',
      icon: HelpCircle,
      description: 'Request assistance with specific issues'
    }
  ];

  const [feedbackForm, setFeedbackForm] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'medium',
    contactEmail: user?.email || ''
  });

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulate feedback submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Feedback submitted successfully! We\'ll get back to you soon.');
      setFeedbackForm({
        category: '',
        subject: '',
        description: '',
        priority: 'medium',
        contactEmail: user?.email || ''
      });
    } catch (error) {
      showError('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support & Feedback</h1>
          <p className="text-gray-600">Get help and share your feedback with us</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('help')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'help'
                ? 'border-[#3B0A69] text-[#3B0A69]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Help & FAQ
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'feedback'
                ? 'border-[#3B0A69] text-[#3B0A69]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Submit Feedback
          </button>
        </nav>
      </div>

      {/* Help & FAQ Tab */}
      {activeTab === 'help' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {helpTopics.map((topic) => (
              <Card key={topic.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#3B0A69] rounded-lg flex items-center justify-center">
                    <topic.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                </div>
                <div className="space-y-3">
                  {topic.content.map((item, index) => (
                    <details key={index} className="group">
                      <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-[#3B0A69] group-open:text-[#3B0A69]">
                        {item.question}
                      </summary>
                      <p className="mt-2 text-sm text-gray-600 pl-4">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {feedbackCategories.map((category) => (
              <Card 
                key={category.id} 
                className={`p-4 cursor-pointer transition-all ${
                  feedbackForm.category === category.id 
                    ? 'ring-2 ring-[#3B0A69] bg-[#3B0A69]/5' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setFeedbackForm(prev => ({ ...prev, category: category.id }))}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    feedbackForm.category === category.id 
                      ? 'bg-[#3B0A69] text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <category.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{category.title}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={feedbackForm.category}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {feedbackCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={feedbackForm.subject}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                  placeholder="Brief description of your feedback"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={feedbackForm.description}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                  placeholder="Please provide detailed information about your feedback..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={feedbackForm.priority}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={feedbackForm.contactEmail}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B0A69] focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="px-6">
                  Submit Feedback
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [loginState, setLoginState] = useState('public'); // 'public', 'selection', 'client', 'team'
  const [showPage, setShowPage] = useState(null); // 'privacy', 'about', 'terms', 'social-media', 'technology', 'other-services', 'web-design', 'smart-home', 'security', 'small-projects', 'desktop-support'
  const [pendingView, setPendingView] = useState(null); // e.g. 'affiliates' (set via URL param before login)
  
  const [showHomeSolutions, setShowHomeSolutions] = useState(false);
  
  // Check if we're on the /bookforge path and redirect (Book Forge blocks iframe embedding)
  useEffect(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const viewParam = searchParams.get('view');
    const pageParam = searchParams.get('page');
    
    if (path.startsWith('/bookforge')) {
      const bookforgePath = path.replace('/bookforge', '') || '/';
      const bookforgeUrl = `https://bookforge-tan.vercel.app${bookforgePath}${window.location.search}${window.location.hash}`;
      window.location.href = bookforgeUrl;
      return;
    }
    
    // Check for home-solutions route
    if (path === '/home-solutions' || path.startsWith('/home-solutions')) {
      setShowHomeSolutions(true);
      return;
    } else {
      setShowHomeSolutions(false);
    }
    
    // Handle public page parameter (e.g., ?page=affiliates)
    if (pageParam === 'affiliates') {
      setShowPage('affiliates');
      return;
    }
    
    // Handle view parameter (e.g., ?view=affiliates) - for logged-in users
    if (viewParam) {
      setPendingView(viewParam);
      // If not logged in yet, jump straight to login selection
      if (!user && viewParam === 'affiliates') {
        setLoginState('selection');
        return;
      }
    }
    
    // Sync view state with URL for other paths - only set if different to avoid infinite loop
    if (path === '/' || path === '') {
      setCurrentView(prev => prev !== 'dashboard' ? 'dashboard' : prev);
    }
  }, []); // Empty dependency array - only run on mount

  // Handle view parameter separately after user is loaded
  useEffect(() => {
    if (!user) return;
    if (!pendingView) return;

    if (pendingView === 'affiliates') {
      setCurrentView('affiliates');
      // Clean up URL so refresh doesn't keep re-triggering
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('view');
        window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
      } catch {
        // ignore
      }
    }

    setPendingView(null);
  }, [user, pendingView]);

  // Scroll to top when navigating to a page
  // IMPORTANT: this must be above any conditional returns (e.g. loading) to keep hook order stable.
  useEffect(() => {
    if (showPage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showPage]);
    
    // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const viewParam = searchParams.get('view');
      const pageParam = searchParams.get('page');
      
      if (path.startsWith('/bookforge')) {
        const bookforgePath = path.replace('/bookforge', '') || '/';
        const bookforgeUrl = `https://bookforge-tan.vercel.app${bookforgePath}${window.location.search}${window.location.hash}`;
        window.location.href = bookforgeUrl;
      } else if (path === '/home-solutions' || path.startsWith('/home-solutions')) {
        setShowHomeSolutions(true);
      } else {
        setShowHomeSolutions(false);
        // Handle public page parameter
        if (pageParam === 'affiliates') {
          setShowPage('affiliates');
        } else if (pageParam) {
          setShowPage(null);
        }
        if (viewParam) {
          setPendingView(viewParam);
          if (!user && viewParam === 'affiliates') {
            setLoginState('selection');
            return;
          }
        }
        // Reset to dashboard if not on bookforge - use functional update to avoid dependency
        setCurrentView(prev => prev === 'bookforge' ? 'dashboard' : prev);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]); // needs user for login redirect decisions
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <img src="/logo.png" alt="Tech ePhi logo" className="w-[70.4px] h-[73.6px] rounded-2xl object-contain mx-auto mb-4" />
          <div className="text-xl font-semibold text-gray-900">Loading...</div>
        </div>
      </div>
    );
  }
  
  // Handle page navigation
  if (showPage === 'privacy') {
    return <PrivacyPolicy onBack={() => setShowPage(null)} />;
  } else if (showPage === 'about') {
    return <About onBack={() => setShowPage(null)} />;
  } else if (showPage === 'terms') {
    return <TermsAndConditions onBack={() => setShowPage(null)} />;
  } else if (showPage === 'social-media') {
    return <SocialMediaManagement onBack={() => setShowPage(null)} />;
  } else if (showPage === 'technology') {
    return <TechnologySolutions onBack={() => setShowPage(null)} />;
  } else if (showPage === 'other-services') {
    return <OtherServices onBack={() => setShowPage(null)} />;
  } else if (showPage === 'web-design') {
    return <WebDesignDevelopment onBack={() => setShowPage(null)} />;
  } else if (showPage === 'smart-home') {
    return <SmartHomeImplementation onBack={() => setShowPage(null)} onShowPage={setShowPage} />;
  } else if (showPage === 'security') {
    return <SecuritySolutions onBack={() => setShowPage(null)} onShowPage={setShowPage} />;
  } else if (showPage === 'small-projects') {
    return <SmallProjects onBack={() => setShowPage(null)} onShowPage={setShowPage} />;
  } else if (showPage === 'desktop-support') {
    return <DesktopSupportNetworking onBack={() => setShowPage(null)} onShowPage={setShowPage} />;
  } else if (showPage === 'affiliates') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPage(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-[#3B0A69] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AffiliateLinksView />
        </div>
      </div>
    );
  }

  // Show Home Solutions Hub if route matches
  if (showHomeSolutions && !user) {
    return <HomeSolutionsHub onBack={() => {
      setShowHomeSolutions(false);
      window.history.pushState({}, '', '/');
    }} />;
  }

  if (!user) {
    if (loginState === 'public') {
      return <PublicWebsite onShowLogin={() => setLoginState('selection')} onShowPage={setShowPage} />;
    } else if (loginState === 'selection') {
      return <LoginSelection onSelectLoginType={setLoginState} onBackToWebsite={() => setLoginState('public')} />;
    } else if (loginState === 'client') {
      return <ClientLoginForm onBack={() => setLoginState('selection')} />;
    } else if (loginState === 'team') {
      return <TeamLoginForm onBack={() => setLoginState('selection')} />;
    }
    // Fallback to public website
    return <PublicWebsite onShowLogin={() => setLoginState('selection')} onShowPage={setShowPage} />;
  }
  
  const renderView = () => {
    switch (currentView) {
      case 'bookforge':
        // Redirect is handled in useEffect above
        return (
          <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
            <div className="text-center">
              <img src="/logo.png" alt="Tech ePhi logo" className="w-[70.4px] h-[73.6px] rounded-2xl object-contain mx-auto mb-4" />
              <div className="text-lg font-semibold text-gray-900 mb-2">Redirecting to Book Forge...</div>
              <div className="text-sm text-gray-600">You will be redirected shortly.</div>
            </div>
          </div>
        );
      case 'dashboard':
        switch (user.role) {
          case 'admin':
            return <AdminDashboard setCurrentView={setCurrentView} />;
          case 'contractor':
            return <ContractorDashboard setCurrentView={setCurrentView} />;
          default:
            return <ClientDashboard setCurrentView={setCurrentView} />;
        }
      case 'analytics':
        return user.role === 'admin' ? <AnalyticsView /> : <ClientDashboard setCurrentView={setCurrentView} />;
      case 'jobs':
        return <EnhancedJobsView />;
      case 'clients':
        return user.role === 'admin' ? <ClientsView /> : <ClientDashboard setCurrentView={setCurrentView} />;
      case 'contractors':
        return user.role === 'admin' ? <div>Contractor Management Coming Soon</div> : <ContractorDashboard setCurrentView={setCurrentView} />;
      case 'invoices':
        return <InvoicesView />;
      case 'messages':
        return <MessagesView />;
      case 'email':
        return <EmailView />;
      case 'quotes':
        return user.role === 'admin' ? <QuoteRequestsView /> : <ClientDashboard setCurrentView={setCurrentView} />;
      case 'support':
        return <SupportAndFeedbackView />;
      case 'affiliates':
        return user?.role === 'client' ? <AffiliateLinksView /> : <ClientDashboard setCurrentView={setCurrentView} />;
      case 'files':
        return <FileManagementView />;
      case 'schedule':
        return user?.role === 'client' ? <ClientBookingView /> : <ScheduleViewEnhanced />;
      case 'booking':
        return <ClientBookingView />;
      case 'profile':
        return user?.role === 'client' ? <NotificationPreferencesView /> : <NotificationPreferencesView />;
      case 'settings':
        return user?.role === 'admin' ? <div className="space-y-8">
          <AvailableHoursManagement />
          <SpecificDateAvailabilityManagement />
          <NotificationPreferencesView />
          <NotificationAnalyticsView />
          <NotificationTestCenter />
        </div> : <NotificationPreferencesView />;
      default:
        // Role-aware default routing
        switch (user.role) {
          case 'admin':
            return <AdminDashboard setCurrentView={setCurrentView} />;
          case 'contractor':
            return <ContractorDashboard setCurrentView={setCurrentView} />;
          default:
            return <ClientDashboard setCurrentView={setCurrentView} />;
        }
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      
      <div className="flex-1 lg:ml-64">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          currentView={currentView}
        />
        
        <main className="p-6">
          {renderView()}
        </main>
      </div>
      
    </div>
  );
};

// Root Component with Enhanced Error Handling and Providers
export default function TechEphiCRM() {
  return (
    <ErrorBoundary name="App">
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <ErrorBoundary name="Main">
              <App />
            </ErrorBoundary>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
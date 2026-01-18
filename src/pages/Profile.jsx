import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion' 
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Edit3,
  Save,
  X,
  Code,
  Trophy,
  Users,
  Briefcase,
  GraduationCap,
  Cpu,
  Database,
  Server,
  Globe,
  Terminal,
  Cloud,
  Wrench,
  Zap
} from 'lucide-react'
import { SiLeetcode, SiHackerrank } from 'react-icons/si'
import { FaLinkedin, FaSquareXTwitter } from 'react-icons/fa6'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'

// Predefined list of gradients
const GRADIENTS = [
  'from-blue-500 to-purple-600',
  'from-purple-500 to-pink-600',
  'from-pink-500 to-red-600',
  'from-red-500 to-orange-600',
  'from-orange-500 to-yellow-600',
  'from-yellow-500 to-green-600',
  'from-green-500 to-teal-600',
  'from-teal-500 to-cyan-600',
  'from-cyan-500 to-blue-600',
  'from-indigo-500 to-purple-600',
  'from-purple-600 to-blue-500',
  'from-blue-600 to-teal-500',
  'from-teal-600 to-green-500',
  'from-green-600 to-yellow-500',
  'from-yellow-600 to-red-500',
  'from-red-600 to-pink-500',
  'from-pink-600 to-purple-500',
  'from-purple-600 to-indigo-500',
];

// Skill icons mapping
const SKILL_ICONS = {
  'javascript': Code,
  'typescript': Code,
  'python': Code,
  'java': Code,
  'cpp': Code,
  'react': Cpu,
  'nodejs': Server,
  'html': Globe,
  'css': Globe,
  'sql': Database,
  'mongodb': Database,
  'postgresql': Database,
  'aws': Cloud,
  'docker': Wrench,
  'kubernetes': Wrench,
  'git': Terminal,
  'leadership': Users,
  'teamwork': Users,
  'communication': Users,
  'problemsolving': Zap,
  'algorithms': Trophy,
  'datastructures': Trophy,
  'machinelearning': GraduationCap,
  'ai': GraduationCap,
  'fullstack': Code,
  'backend': Code,
  'frontend': Code,
  'testing': Trophy,
  'security': Trophy,
  'uiux': Users,
  'seo': Trophy,
  'analytics': Trophy,
  'projectmanagement': Users,
  'businessanalysis': Users,
  'training': GraduationCap,
  'mentoring': GraduationCap,
  'coaching': GraduationCap,
  'networking': Users,
  'clientrelations': Users,
  'troubleshooting': Trophy,
  'maintenance': Trophy,
  'compliance': Trophy,
  'standards': Trophy,
  'auditing': Trophy,
  'iso': Trophy,
  'gdpr': Trophy,
  'cloudcomputing': Cloud,
  'devops': Wrench,
  'agile': Briefcase,
  'scrum': Briefcase,
  'default': Code,
};

// Helper function to generate initials from name
const getInitials = (name) => {
  if (!name) return 'U';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
};

// Helper function to get gradient based on UID hash
const getGradientFromUid = (uid) => {
  if (!uid) return GRADIENTS[0];
  
  // Simple hash function to convert UID to a number
  let hash = 0;
  for (let i = 0; i < uid.length; i++) {
    hash = ((hash << 5) - hash) + uid.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
};

const Profile = () => {
  const { user: authUser, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading, error, saveProfile, getLeetCodeUsername } = useProfile(authUser?.uid)
  
  const [isEditing, setIsEditing] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const skillInputRef = useRef(null)
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    skills: [],
    socialLinks: {
      leetcode: '',
      hackerrank: '',
      linkedin: '',
      twitter: ''
    }
  })

  // Sync form data with profile data from Firestore
  useEffect(() => {
    if (profile && !isEditing) {
      setFormData({
        displayName: profile.displayName || authUser?.displayName || '',
        bio: profile.bio || '',
        location: profile.location || '',
        skills: profile.skills || [],
        socialLinks: {
          leetcode: profile.socialLinks?.leetcode || '',
          hackerrank: profile.socialLinks?.hackerrank || '',
          linkedin: profile.socialLinks?.linkedin || '',
          twitter: profile.socialLinks?.twitter || ''
        }
      })
    }
  }, [profile, authUser, isEditing])

  const handleSave = async () => {
    if (!authUser?.uid) return
    
    const success = await saveProfile({
      displayName: formData.displayName,
      email: authUser.email,
      bio: formData.bio,
      location: formData.location,
      skills: formData.skills,
      socialLinks: formData.socialLinks
    })
    
    if (success) {
      setIsEditing(false)
    }
  }

  const handleChange = (field, value) => {
    if (field.startsWith('socialLinks.')) {
      const platform = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: value
        }
      }))
    } else if (field === 'skills') {
      // Handle skills as an array
      setFormData(prev => ({
        ...prev,
        skills: value
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleAddSkill = () => {
    const skillToAdd = newSkill.trim()
    if (skillToAdd && !formData.skills.includes(skillToAdd)) {
      const updatedSkills = [...formData.skills, skillToAdd]
      handleChange('skills', updatedSkills)
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (index) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index)
    handleChange('skills', updatedSkills)
  }

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
    }
    if (e.key === ',' && newSkill.trim()) {
      e.preventDefault()
      handleAddSkill()
    }
  }

  const canonicalize = (value) => {
    if (!value) return 'default';
    
    const skillMap = {
      // Programming Languages
      'javascript': 'javascript', 'js': 'javascript',
      'typescript': 'typescript', 'ts': 'typescript',
      'python': 'python', 'py': 'python',
      'java': 'java',
      'c++': 'cpp', 'cpp': 'cpp', 'cplusplus': 'cpp',
      
      // Web
      'react': 'react', 'reactjs': 'react',
      'vue': 'react', 'angular': 'react',
      'node': 'nodejs', 'node.js': 'nodejs', 'nodejs': 'nodejs',
      'express': 'nodejs',
      
      // Markup/Styling
      'html': 'html', 'html5': 'html',
      'css': 'css', 'css3': 'css',
      'sass': 'css', 'scss': 'css',
      'tailwind': 'css', 'tailwindcss': 'css',
      
      // Databases
      'sql': 'sql',
      'mongodb': 'mongodb', 'mongo': 'mongodb',
      'postgresql': 'postgresql', 'postgres': 'postgresql',
      'mysql': 'sql',
      
      // Cloud & DevOps
      'aws': 'aws', 'amazonwebservices': 'aws',
      'docker': 'docker',
      'kubernetes': 'kubernetes', 'k8s': 'kubernetes',
      'git': 'git', 'github': 'git',
      
      // Default
      'default': 'default'
    };
    
    const lower = value.toLowerCase().trim().replace(/\s+/g, '');
    return skillMap[lower] || 'default';
  }

  const renderSocialLink = (platform, icon, label, colorClass) => {
    const value = formData.socialLinks[platform]
    const isEditingField = isEditing
    
    return (
      <div className="flex items-center mb-3">
        <div className={`p-2 rounded-lg ${colorClass} mr-3`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-1">{label}</div>
          {isEditingField ? (
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(`socialLinks.${platform}`, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder={`${label} URL or username`}
            />
          ) : (
            <div className="text-gray-900">
              {value ? (
                <a 
                  href={value.includes('http') ? value : `https://${platform}.com/${value}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {value}
                </a>
              ) : (
                <span className="text-gray-400 text-sm">Not specified</span>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Loading state
  if (authLoading || profileLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300"></div>
          <div className="pt-20 pb-8 px-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-800 font-medium mb-2">Error loading profile</div>
          <div className="text-red-600 text-sm">{error}</div>
        </div>
      </div>
    )
  }

  // No user state
  if (!authUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-gray-500 mb-4">Please log in to view your profile</div>
        </div>
      </div>
    )
  }

  // Calculate gradient based on user UID
  const userGradient = getGradientFromUid(authUser.uid);
  const userInitials = getInitials(formData.displayName);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Header with Dynamic Gradient Banner */}
        <div className={`relative h-48 bg-gradient-to-r ${userGradient}`}>

          
          {/* Profile Picture Area with Initials */}
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-4 border-white flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{userInitials}</span>
              </div>
            </div>
          </div>
          
          {/* Edit/Save Buttons */}
          <div className="absolute top-4 right-4">
            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={!formData.displayName.trim()}
                  className={`flex items-center px-3 py-1.5 rounded-md transition-colors ${
                    formData.displayName.trim() 
                      ? 'bg-white text-gray-700 hover:bg-gray-100' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Save size={16} className="mr-1" />
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    // Reset form data to original profile values
                    if (profile) {
                      setFormData({
                        displayName: profile.displayName || authUser?.displayName || '',
                        bio: profile.bio || '',
                        location: profile.location || '',
                        skills: profile.skills || [],
                        socialLinks: {
                          leetcode: profile.socialLinks?.leetcode || '',
                          hackerrank: profile.socialLinks?.hackerrank || '',
                          linkedin: profile.socialLinks?.linkedin || '',
                          twitter: profile.socialLinks?.twitter || ''
                        }
                      })
                    }
                  }}
                  className="flex items-center px-3 py-1.5 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <X size={16} className="mr-1" />
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-3 py-1.5 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Edit3 size={16} className="mr-1" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 pb-8 px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  className="text-2xl font-bold text-gray-900 bg-gray-50 rounded px-2 py-1 w-full md:w-auto border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                  required
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">{formData.displayName || 'User'}</h1>
              )}
              <div className="flex items-center text-gray-600 mt-1">
                <Mail size={16} className="mr-2" />
                <span>{authUser?.email}</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>Joined {authUser?.metadata?.creationTime ? new Date(authUser.metadata.creationTime).toLocaleDateString() : 'Recently'}</span>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-700">
                  {formData.bio || 'No bio available. Add a bio to tell others about yourself.'}
                </p>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin size={18} className="text-gray-400 mr-3" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, Country"
                    />
                  ) : (
                    <span className="text-gray-700">
                      {formData.location || 'No location specified'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              {isEditing ? (
                <div>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      ref={skillInputRef}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Type a skill and press Enter or comma"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="ml-2 text-blue-800 hover:text-blue-900"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {formData.skills.length === 0 && (
                    <p className="text-gray-400 text-sm">No skills added yet</p>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.length > 0 ? (
                    formData.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No skills specified</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Social Links Section */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Profiles</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              {renderSocialLink(
                'leetcode', 
                <SiLeetcode className="text-white text-xl" />, 
                'LeetCode', 
                'bg-orange-500'
              )}
              {renderSocialLink(
                'hackerrank', 
                <SiHackerrank className="text-white text-xl" />, 
                'HackerRank', 
                'bg-green-500'
              )}
              {renderSocialLink(
                'linkedin', 
                <FaLinkedin className="text-white text-xl" />, 
                'LinkedIn', 
                'bg-blue-600'
              )}
              {renderSocialLink(
                'twitter', 
                <FaSquareXTwitter className="text-white text-xl" />, 
                'Twitter/X', 
                'bg-black'
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile
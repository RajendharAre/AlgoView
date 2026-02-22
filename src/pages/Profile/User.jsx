import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Calendar, MapPin, Link as LinkIcon, Mail, Trophy, TrendingUp, Edit3, Save, ExternalLink } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import Loader from '../../components/Common/Loader'

const UserProfile = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const { user: currentUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [socialProfiles, setSocialProfiles] = useState({
    leetcode: '',
    linkedin: '',
    github: '',
    hackerrank: '',
    codechef: '',
    codeforces: ''
  })

  // Mock user data
  const mockUser = {
    id: userId || '12345',
    name: userId ? `User ${userId}` : 'John Doe',
    email: 'john.doe@example.com',
    avatar: null,
    joinDate: '2023-01-15',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    bio: 'Passionate about algorithms and data structures. Love to help others learn through visualization.',
    stats: {
      solved: 0,
      hoursPracticed: 0,
      contributions: 0,
      discussions: 0
    },
    achievements: [
      { id: 1, name: 'First Problem Solved', date: '2023-01-20' },
      { id: 2, name: '50 Points Earned', date: '2023-02-15' },
      { id: 3, name: 'Top Contributor', date: '2023-03-10' }
    ],
    socialProfiles: {
      leetcode: '',
      linkedin: '',
      github: '',
      hackerrank: '',
      codechef: '',
      codeforces: ''
    }
  }

  useEffect(() => {
    // Load user data from Firebase if current user
    if (currentUser && (!userId || userId === currentUser.uid)) {
      const unsubscribe = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          // Calculate dynamic stats based on user data
          let solvedCount = 0;
          let hoursPracticed = 0;
          let discussionsCount = 0;
          let contributionsCount = 0;
          let recentActivity = [];
          
          if (userData.completedProblems) {
            solvedCount = Object.keys(userData.completedProblems).filter(
              problemId => userData.completedProblems[problemId]
            ).length;
          }
          
          // Estimate hours practiced based on completed problems
          hoursPracticed = Math.min(200, Math.floor(solvedCount * 0.5));
          
          // Create recent activity from sessions
          if (userData.sessions) {
            Object.entries(userData.sessions).forEach(([problemId, session], idx) => {
              recentActivity.push({
                id: idx,
                action: `Started solving ${problemId.replace(/-/g, ' ')}`,
                time: new Date(session.clickedAt).toLocaleString(),
                type: 'problem-start'
              });
            });
          }
          
          // Add problem completion to recent activity if available
          if (userData.completedProblems) {
            Object.entries(userData.completedProblems).forEach(([problemId, completion], idx) => {
              if (completion) {
                recentActivity.unshift({
                  id: `comp-${idx}`,
                  action: `Completed ${problemId.replace(/-/g, ' ')}`,
                  time: completion.timestamp ? new Date(completion.timestamp).toLocaleString() : 'Recently',
                  type: 'problem-completion'
                });
              }
            });
          }
          
          // Sort recent activity by time (most recent first)
          recentActivity.sort((a, b) => {
            // Try to parse dates for comparison
            const timeA = new Date(a.time);
            const timeB = new Date(b.time);
            
            // If parsing fails, compare as strings
            if (isNaN(timeA.getTime())) return 1;
            if (isNaN(timeB.getTime())) return -1;
            
            return timeB - timeA; // Descending order (newest first)
          });
          
          // Limit to 5 most recent activities
          recentActivity = recentActivity.slice(0, 5);
          
          const loadedUser = {
            ...mockUser,
            ...userData,
            id: currentUser.uid,
            name: userData.name || currentUser.email?.split('@')[0] || 'User',
            email: currentUser.email,
            stats: {
              solved: solvedCount,
              hoursPracticed: hoursPracticed,
              contributions: contributionsCount,
              discussions: discussionsCount
            },
            recentActivity: recentActivity,
            achievements: userData.achievements || [],
            socialProfiles: {
              leetcode: userData.leetcodeUsername || '',
              linkedin: userData.linkedin || '',
              github: userData.github || '',
              hackerrank: userData.hackerrank || '',
              codechef: userData.codechef || '',
              codeforces: userData.codeforces || ''
            }
          };
          setUser(loadedUser);
          setSocialProfiles(loadedUser.socialProfiles);
        } else {
          // If no user doc exists, create default structure
          setUser({
            ...mockUser,
            id: currentUser.uid,
            name: currentUser.email?.split('@')[0] || 'User',
            email: currentUser.email,
            stats: {
              solved: 0,
              hoursPracticed: 0,
              contributions: 0,
              discussions: 0
            },
            recentActivity: [],
            achievements: [],
            socialProfiles: {
              leetcode: '',
              linkedin: '',
              github: '',
              hackerrank: '',
              codechef: '',
              codeforces: ''
            }
          });
        }
      });
      
      return () => unsubscribe();
    } else {
      // For public profile view
      setUser(mockUser);
    }
  }, [currentUser, userId])

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      handleSaveSocialProfiles();
    }
    setIsEditing(!isEditing);
  };
  
  const handleInputChange = (platform, value) => {
    setSocialProfiles(prev => ({
      ...prev,
      [platform]: value
    }));
  };
  
  const handleSaveSocialProfiles = async () => {
    if (!currentUser) return;
    
    try {
      // Prepare the update data - include other profile fields if they exist
      const updateData = {
        leetcodeUsername: socialProfiles.leetcode,
        linkedin: socialProfiles.linkedin,
        github: socialProfiles.github,
        hackerrank: socialProfiles.hackerrank,
        codechef: socialProfiles.codechef,
        codeforces: socialProfiles.codeforces,
        // Include other profile fields if they exist in the user object
        name: user.name,
        email: user.email,
        website: user.website,
        bio: user.bio,
        location: user.location,
        joinDate: user.joinDate
      };
      
      // Update Firebase
      await setDoc(doc(db, 'users', currentUser.uid), updateData, { merge: true });
      
      // Optimistically update the local state to provide immediate feedback
      if (user) {
        setUser(prevUser => ({
          ...prevUser,
          socialProfiles: {
            ...prevUser.socialProfiles,
            ...socialProfiles
          }
        }));
      }
      
      console.log('Social profiles saved successfully!');
    } catch (error) {
      console.error('Error saving social profiles:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="text-blue-600" size={32} />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-blue-100 mt-1">{user.email}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-blue-200" />
                    <span className="text-sm text-blue-100">{user.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} className="text-blue-200" />
                    <span className="text-sm text-blue-100">Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Personal Info */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={isEditing ? user.name : user.name || ''}
                    onChange={(e) => isEditing && setUser(prev => ({...prev, name: e.target.value}))}
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={isEditing ? user.bio : user.bio || ''}
                    onChange={(e) => isEditing && setUser(prev => ({...prev, bio: e.target.value}))}
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={isEditing ? user.website : user.website || ''}
                    onChange={(e) => isEditing && setUser(prev => ({...prev, website: e.target.value}))}
                    readOnly={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={isEditing ? user.location : user.location || ''}
                    onChange={(e) => isEditing && setUser(prev => ({...prev, location: e.target.value}))}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Social Profiles */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Social Profiles</h2>
                {(currentUser && (!userId || userId === currentUser.uid)) && (
                  <button 
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isEditing ? (
                      <>
                        <Save size={16} />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit3 size={16} />
                        Edit
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    <span className="font-medium text-gray-700">LeetCode</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter your LeetCode username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={isEditing ? socialProfiles.leetcode : user?.socialProfiles?.leetcode || ''}
                    onChange={(e) => isEditing && handleInputChange('leetcode', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-700">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                    <span className="font-medium text-gray-700">LinkedIn</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter your LinkedIn profile URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={isEditing ? socialProfiles.linkedin : user?.socialProfiles?.linkedin || ''}
                    onChange={(e) => isEditing && handleInputChange('linkedin', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                    <span className="font-medium text-gray-700">GitHub</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter your GitHub username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={isEditing ? socialProfiles.github : user?.socialProfiles?.github || ''}
                    onChange={(e) => isEditing && handleInputChange('github', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <path d="M7 21v-2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v2"></path>
                      <path d="M15 21v-2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v2"></path>
                      <path d="M6 5h12"></path>
                      <path d="M12 5v14"></path>
                      <path d="M8 13h8"></path>
                      <path d="M8 9h8"></path>
                      <path d="M8 17h8"></path>
                    </svg>
                    <span className="font-medium text-gray-700">HackerRank</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter your HackerRank username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={isEditing ? socialProfiles.hackerrank : user?.socialProfiles?.hackerrank || ''}
                    onChange={(e) => isEditing && handleInputChange('hackerrank', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                      <path d="M1 12h22"></path>
                      <path d="M12 3v18"></path>
                      <path d="M3 7l7.5 7.5L20 5"></path>
                      <path d="M3 17l7.5-7.5L20 19"></path>
                    </svg>
                    <span className="font-medium text-gray-700">CodeChef</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter your CodeChef username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={isEditing ? socialProfiles.codechef : user?.socialProfiles?.codechef || ''}
                    onChange={(e) => isEditing && handleInputChange('codechef', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
                      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
                      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                      <path d="M12 2v2"></path>
                      <path d="M12 22v-2"></path>
                      <path d="m17 20.66-1-1.73"></path>
                      <path d="M11 10.27 7 3.34"></path>
                      <path d="m20.66 17-1.73-1"></path>
                      <path d="m3.34 7 1.73 1"></path>
                      <path d="M14 12h8"></path>
                      <path d="M2 12h2"></path>
                    </svg>
                    <span className="font-medium text-gray-700">Codeforces</span>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter your Codeforces username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={isEditing ? socialProfiles.codeforces : user?.socialProfiles?.codeforces || ''}
                    onChange={(e) => isEditing && handleInputChange('codeforces', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Trophy className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-blue-700">Problems Solved</p>
                    <p className="text-xl font-bold text-gray-900">{user.stats.solved || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-purple-600" size={20} />
                  <div>
                    <p className="text-sm text-purple-700">Hours Practiced</p>
                    <p className="text-xl font-bold text-gray-900">{user.stats.hoursPracticed || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <Mail className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-green-700">Contributions</p>
                    <p className="text-xl font-bold text-gray-900">{user.stats.contributions || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2">
                  <User className="text-yellow-600" size={20} />
                  <div>
                    <p className="text-sm text-yellow-700">Discussions</p>
                    <p className="text-xl font-bold text-gray-900">{user.stats.discussions || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'achievements'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Achievements
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {user.recentActivity && user.recentActivity.length > 0 ? (
                    user.recentActivity.map((activity, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {activity.type === 'problem-completion' ? (
                              <Trophy className="text-blue-600" size={20} />
                            ) : activity.type === 'discussion' ? (
                              <Mail className="text-green-600" size={20} />
                            ) : (
                              <User className="text-purple-600" size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 border border-gray-200 rounded-lg text-center text-gray-500">
                      No recent activity
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.achievements && user.achievements.length > 0 ? (
                    user.achievements.map((achievement) => (
                      <div key={achievement.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Trophy className="text-yellow-600" size={24} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                            <p className="text-sm text-gray-500">{achievement.date ? new Date(achievement.date).toLocaleDateString() : 'Unknown date'}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 border border-gray-200 rounded-lg text-center text-gray-500">
                      No achievements yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default UserProfile
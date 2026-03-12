import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [newTask, setNewTask] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed', 'deleted'

  // Mock user database with their own tasks
  const [users, setUsers] = useState([]);

  const handleSignIn = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (isSignUp) {
      // Sign Up logic
      if (!email || !password || !confirmPassword) {
        setErrorMessage('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }
      if (users.find(user => user.email === email)) {
        setErrorMessage('Email already exists');
        return;
      }

      // Create new user with their own tasks
      const newUser = {
        id: Date.now(),
        email,
        password,
        name: email.split('@')[0],
        tasks: [
          { id: 1, text: 'Doing My homeworks', completed: false, deleted: false },
          { id: 2, text: 'Shopping', completed: false, deleted: false },
          { id: 3, text: 'Helping in the chores', completed: false, deleted: false }
        ],
        deletedTasks: []
      };
      
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setIsLoggedIn(true);
      
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      // Sign In logic
      const user = users.find(user => user.email === email && user.password === password);
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        setEmail('');
        setPassword('');
      } else {
        setErrorMessage('Invalid email or password');
      }
    }
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const addTask = () => {
    if (newTask.trim() && currentUser) {
      const updatedUser = {
        ...currentUser,
        tasks: [...currentUser.tasks, {
          id: Date.now(),
          text: newTask,
          completed: false,
          deleted: false
        }]
      };
      
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
      setNewTask('');
    }
  };

  const toggleTask = (taskId) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        tasks: currentUser.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      };
      
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const deleteTask = (taskId) => {
    if (currentUser) {
      const taskToDelete = currentUser.tasks.find(t => t.id === taskId);
      
      const updatedUser = {
        ...currentUser,
        tasks: currentUser.tasks.filter(task => task.id !== taskId),
        deletedTasks: [...currentUser.deletedTasks, { ...taskToDelete, deleted: true }]
      };
      
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const restoreTask = (taskId) => {
    if (currentUser) {
      const taskToRestore = currentUser.deletedTasks.find(t => t.id === taskId);
      
      const updatedUser = {
        ...currentUser,
        tasks: [...currentUser.tasks, { ...taskToRestore, deleted: false }],
        deletedTasks: currentUser.deletedTasks.filter(task => task.id !== taskId)
      };
      
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const permanentlyDeleteTask = (taskId) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        deletedTasks: currentUser.deletedTasks.filter(task => task.id !== taskId)
      };
      
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const getFilteredTasks = () => {
    if (!currentUser) return [];
    
    switch(filter) {
      case 'active':
        return currentUser.tasks.filter(task => !task.completed);
      case 'completed':
        return currentUser.tasks.filter(task => task.completed);
      case 'deleted':
        return currentUser.deletedTasks;
      default:
        return currentUser.tasks;
    }
  };

  const completedTasks = currentUser ? currentUser.tasks.filter(task => task.completed).length : 0;
  const totalTasks = currentUser ? currentUser.tasks.length : 0;
  const deletedTasksCount = currentUser ? currentUser.deletedTasks.length : 0;

  return (
    <div className="app">
      <div className="right-panel full-width">
        {!isLoggedIn ? (
          // Sign In / Sign Up Form
          <>
            <h1>Welcome to Taskety</h1>
            
            {errorMessage && (
              <div className={`message ${errorMessage.includes('success') ? 'success' : 'error'}`}>
                {errorMessage}
              </div>
            )}
            
            <form onSubmit={handleSignIn} className="signin-section">
              <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {isSignUp && (
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              <button type="submit" className="signin-btn">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
              
              <p className="signup-link" onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}>
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </p>
            </form>
          </>
        ) : (
          // Tasks Dashboard (Logged In)
          <>
            <div className="welcome-header">
              <h1>Welcome back, {currentUser.name}!</h1>
              <button onClick={handleSignOut} className="signout-btn">Sign Out</button>
            </div>

            <h1>All your Tasks</h1>
            
            <div className="task-stats-container">
              <div className="task-stats-card">
                <div className="stat-item">
                  <span className="stat-label">Total Tasks</span>
                  <span className="stat-value">{totalTasks}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Completed</span>
                  <span className="stat-value">{completedTasks}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Pending</span>
                  <span className="stat-value">{totalTasks - completedTasks}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Deleted</span>
                  <span className="stat-value">{deletedTasksCount}</span>
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All Tasks ({totalTasks})
              </button>
              <button 
                className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active ({totalTasks - completedTasks})
              </button>
              <button 
                className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed ({completedTasks})
              </button>
              <button 
                className={`filter-btn ${filter === 'deleted' ? 'active' : ''}`}
                onClick={() => setFilter('deleted')}
              >
                Deleted ({deletedTasksCount})
              </button>
            </div>
            
            <div className="my-tasks">
              <h2>My Tasks {filter !== 'all' && `- ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}</h2>
              
              {getFilteredTasks().length === 0 ? (
                <div className="empty-state">
                  <p>No {filter === 'deleted' ? 'deleted' : ''} tasks to show</p>
                </div>
              ) : (
                <ul className="task-list">
                  {getFilteredTasks().map(task => (
                    <li key={task.id} className={task.completed ? 'completed' : ''}>
                      {filter !== 'deleted' ? (
                        // Regular tasks view
                        <>
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                            className="task-checkbox"
                          />
                          <span className="task-icon">📂</span>
                          <span className="task-text">{task.text}</span>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="delete-btn"
                            title="Delete task"
                          >
                            🗑️
                          </button>
                        </>
                      ) : (
                        // Deleted tasks view
                        <>
                          <span className="task-icon">🗑️</span>
                          <span className="task-text deleted-text">{task.text}</span>
                          <div className="deleted-actions">
                            <button 
                              onClick={() => restoreTask(task.id)}
                              className="restore-btn"
                              title="Restore task"
                            >
                              ↩️ Restore
                            </button>
                            <button 
                              onClick={() => permanentlyDeleteTask(task.id)}
                              className="permanent-delete-btn"
                              title="Delete permanently"
                            >
                              ❌ Permanent
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              
              {filter !== 'deleted' && (
                <div className="add-task">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="+ Add a Task"
                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  />
                </div>
              )}
            </div>

            <div className="tasks-footer">
              <span>Tasks</span>
              <span className="settings">Settings</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
// Global Host Cloud Platform - JavaScript

// Store uploaded projects
const uploadedProjects = [];

// Section Navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update sidebar active state
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.classList.remove('active');
        if (item.textContent.toLowerCase().includes(sectionId.replace('-', ' '))) {
            item.classList.add('active');
        }
    });
    
    // Scroll to top of main content
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Subdomain Generator
function generateSubdomain() {
    const projectName = document.getElementById('projectName').value.trim();
    const generatedField = document.getElementById('generatedSubdomain');
    
    if (projectName) {
        // Convert to lowercase, replace spaces with hyphens, remove special characters
        const sanitized = projectName
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
        
        generatedField.value = `${sanitized}.yourcloud.com`;
        
        // Visual feedback
        generatedField.style.borderColor = 'var(--success)';
        setTimeout(() => {
            generatedField.style.borderColor = 'var(--border-color)';
        }, 2000);
    } else {
        generatedField.value = 'project-name.yourcloud.com';
        generatedField.style.borderColor = 'var(--error)';
        setTimeout(() => {
            generatedField.style.borderColor = 'var(--border-color)';
        }, 2000);
    }
}

// Generate unique project ID
function generateProjectId() {
    return 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Generate project URL
function generateProjectUrl(projectName) {
    const sanitized = projectName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
    return `https://${sanitized}.yourcloud.com`;
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Get file icon based on type
function getFileIcon(filename, isFolder = false) {
    if (isFolder) return '📁';
    
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        'html': '🌐',
        'htm': '🌐',
        'css': '🎨',
        'js': '📜',
        'json': '📋',
        'png': '🖼️',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'gif': '🖼️',
        'svg': '🖼️',
        'pdf': '📕',
        'zip': '📦',
        'rar': '📦',
        '7z': '📦',
        'tar': '📦',
        'gz': '📦',
        'mp3': '🎵',
        'mp4': '🎬',
        'mov': '🎬',
        'avi': '🎬',
        'txt': '📄',
        'md': '📝',
        'py': '🐍',
        'php': '🐘',
        'java': '☕',
        'cpp': '⚙️',
        'c': '⚙️'
    };
    return icons[ext] || '📄';
}

// Show upload progress
function showUploadProgress(files, isZip = false) {
    const uploadArea = document.querySelector('.upload-area');
    const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);
    
    uploadArea.innerHTML = `
        <div class="upload-icon">📤</div>
        <div class="upload-text">Uploading ${files.length} ${isZip ? 'ZIP file' : 'file(s)'}...</div>
        <div class="upload-subtext">Total size: ${formatFileSize(totalSize)}</div>
        <div class="upload-progress">
            <div class="progress-header">
                <span>Uploading...</span>
                <span id="uploadPercentage">0%</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar" id="uploadProgressBar" style="width: 0%"></div>
            </div>
            <div class="progress-stats">
                <span id="uploadSpeed">0 KB/s</span>
                <span id="uploadTime">Calculating...</span>
            </div>
        </div>
    `;
    
    return { uploadArea, totalSize };
}

// Simulate upload progress with realistic timing
function simulateUpload(totalSize, callback) {
    let progress = 0;
    const progressBar = document.getElementById('uploadProgressBar');
    const percentageText = document.getElementById('uploadPercentage');
    const speedText = document.getElementById('uploadSpeed');
    const timeText = document.getElementById('uploadTime');
    
    const duration = Math.min(Math.max(totalSize / 1000000 * 2000, 2000), 8000); // 2-8 seconds based on size
    const startTime = Date.now();
    const interval = 50;
    
    const uploadInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        progress = (elapsed / duration) * 100;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(uploadInterval);
            callback();
        }
        
        progressBar.style.width = `${progress}%`;
        percentageText.textContent = `${Math.round(progress)}%`;
        
        // Simulate speed
        const speed = (totalSize / 1024 / (elapsed / 1000)).toFixed(2);
        speedText.textContent = `${speed} KB/s`;
        
        // Calculate remaining time
        const remaining = Math.max(0, duration - elapsed);
        const remainingSeconds = (remaining / 1000).toFixed(1);
        timeText.textContent = `${remainingSeconds}s remaining`;
    }, interval);
}

// Handle folder upload
function handleFileUpload(event) {
    const files = event.target.files;
    
    if (files.length > 0) {
        const { uploadArea, totalSize } = showUploadProgress(files, false);
        
        simulateUpload(totalSize, () => {
            // Get folder name from first file's webkitRelativePath
            const folderName = files[0].webkitRelativePath.split('/')[0];
            const projectId = generateProjectId();
            const projectUrl = generateProjectUrl(folderName);
            
            // Create project object
            const project = {
                id: projectId,
                name: folderName,
                type: 'folder',
                url: projectUrl,
                createdAt: new Date().toISOString(),
                files: Array.from(files).map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    path: file.webkitRelativePath || file.name,
                    isFolder: false
                })),
                extracted: false
            };
            
            uploadedProjects.push(project);
            updateUploadedProjectsIndex();
            
            uploadArea.innerHTML = `
                <div class="upload-icon">✅</div>
                <div class="upload-text">Upload Complete!</div>
                <div class="upload-subtext">${files.length} files uploaded successfully</div>
            `;
            
            addLogEntry(`Folder "${folderName}" uploaded successfully`, 'success');
            addLogEntry(`Project deployed to: ${projectUrl}`, 'info');
            
            // Reset after 3 seconds
            setTimeout(resetUploadArea, 3000);
        });
    }
}

// Handle ZIP upload
function handleZipUpload(event) {
    const file = event.target.files[0];
    
    if (file) {
        const { uploadArea, totalSize } = showUploadProgress([file], true);
        
        simulateUpload(totalSize, () => {
            const projectId = generateProjectId();
            const projectName = file.name.replace(/\.(zip|rar|7z|tar|gz)$/i, '');
            const projectUrl = generateProjectUrl(projectName);
            
            // Simulate extracting files from ZIP
            const extractedFiles = simulateZipExtraction(file.name);
            
            // Create project object
            const project = {
                id: projectId,
                name: projectName,
                type: 'zip',
                originalFile: file.name,
                url: projectUrl,
                createdAt: new Date().toISOString(),
                files: extractedFiles,
                extracted: false
            };
            
            uploadedProjects.push(project);
            updateUploadedProjectsIndex();
            
            uploadArea.innerHTML = `
                <div class="upload-icon">📦</div>
                <div class="upload-text">ZIP Upload Complete!</div>
                <div class="upload-subtext">${extractedFiles.length} files ready to extract</div>
            `;
            
            addLogEntry(`ZIP file "${file.name}" uploaded`, 'success');
            addLogEntry(`Project ready at: ${projectUrl}`, 'info');
            
            // Reset after 3 seconds
            setTimeout(resetUploadArea, 3000);
        });
    }
}

// Simulate ZIP extraction
function simulateZipExtraction(zipName) {
    const commonFiles = [
        { name: 'index.html', size: 4521, type: 'text/html', path: 'index.html', isFolder: false },
        { name: 'style.css', size: 1234, type: 'text/css', path: 'style.css', isFolder: false },
        { name: 'script.js', size: 2890, type: 'text/javascript', path: 'script.js', isFolder: false },
        { name: 'README.md', size: 567, type: 'text/markdown', path: 'README.md', isFolder: false },
        { name: 'assets', size: 0, type: '', path: 'assets', isFolder: true },
        { name: 'logo.png', size: 15678, type: 'image/png', path: 'assets/logo.png', isFolder: false },
        { name: 'background.jpg', size: 234567, type: 'image/jpeg', path: 'assets/background.jpg', isFolder: false }
    ];
    
    return commonFiles;
}

// Extract ZIP/Folder
function extractProject(projectId) {
    const project = uploadedProjects.find(p => p.id === projectId);
    if (!project) return;
    
    addLogEntry(`Extracting files for "${project.name}"...`, 'info');
    
    // Simulate extraction process
    setTimeout(() => {
        project.extracted = true;
        updateUploadedProjectsIndex();
        addLogEntry(`Successfully extracted ${project.files.length} files`, 'success');
        addLogEntry(`Project is now live at: ${project.url}`, 'success');
    }, 2000);
}

// Delete project
function deleteProject(projectId) {
    const index = uploadedProjects.findIndex(p => p.id === projectId);
    if (index !== -1) {
        const project = uploadedProjects[index];
        uploadedProjects.splice(index, 1);
        updateUploadedProjectsIndex();
        addLogEntry(`Project "${project.name}" deleted`, 'warning');
    }
}

// Reset upload area
function resetUploadArea() {
    const uploadArea = document.querySelector('.upload-area');
    uploadArea.innerHTML = `
        <div class="upload-icon">📤</div>
        <div class="upload-text">Drop your files & folders here</div>
        <div class="upload-subtext">or click to browse • Supports folders, ZIP extraction, direct upload</div>
        <input type="file" id="fileInput" multiple webkitdirectory style="display: none;" onchange="handleFileUpload(event)">
    `;
}

// Update uploaded projects index
function updateUploadedProjectsIndex() {
    const indexContainer = document.getElementById('uploadedProjectsIndex');
    
    if (uploadedProjects.length === 0) {
        indexContainer.innerHTML = `
            <div style="padding: 1.5rem; text-align: center; color: var(--text-secondary);">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📤</div>
                <div>No projects uploaded yet</div>
                <div style="font-size: 0.9rem; margin-top: 0.5rem;">Upload folders or ZIP files to see them here</div>
            </div>
        `;
        return;
    }
    
    indexContainer.innerHTML = uploadedProjects.map(project => `
        <div class="project-index-item" id="project-${project.id}">
            <div class="project-index-info">
                <div class="project-index-icon">${project.type === 'zip' ? '📦' : '📁'}</div>
                <div class="project-index-details">
                    <div class="project-index-name">${project.name}</div>
                    <a href="${project.url}" target="_blank" class="project-index-url">${project.url}</a>
                    <div class="project-index-meta">
                        ${project.extracted ? '✅ Extracted & Live' : '⏳ Ready to extract'} • 
                        ${project.files.length} files • 
                        ${formatFileSize(project.files.reduce((acc, f) => acc + f.size, 0))} • 
                        ${new Date(project.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
            <div class="project-index-actions">
                ${!project.extracted ? `
                    <button class="project-index-btn extract" onclick="extractProject('${project.id}')">
                        📦 Extract
                    </button>
                ` : `
                    <button class="project-index-btn" onclick="window.open('${project.url}', '_blank')">
                        🌐 Open
                    </button>
                `}
                <button class="project-index-btn delete" onclick="deleteProject('${project.id}')">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Live Log Updates
function addLogEntry(message, type = 'info') {
    const logContainer = document.getElementById('logContainer');
    if (!logContainer) return;
    
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    
    logContainer.insertBefore(logEntry, logContainer.firstChild);
    
    // Keep only last 50 entries
    while (logContainer.children.length > 50) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

// Simulate Live Activity
function simulateActivity() {
    const activities = [
        { message: 'Health check passed for server AWS-US-East-1', type: 'success' },
        { message: 'New deployment started: user-portfolio', type: 'info' },
        { message: 'SSL certificate renewed for api.yourcloud.com', type: 'success' },
        { message: 'High memory usage detected on GCP-US-West', type: 'warning' },
        { message: 'Auto-scaling triggered - adding instance', type: 'info' },
        { message: 'Backup completed successfully', type: 'success' },
        { message: 'Cache cleared for static assets', type: 'info' },
        { message: 'Database connection pool optimized', type: 'success' },
        { message: 'CDN cache updated', type: 'info' },
        { message: 'User authentication attempt blocked', type: 'error' }
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    addLogEntry(randomActivity.message, randomActivity.type);
}

// Update Server Status
function updateServerStatus() {
    const serverCards = document.querySelectorAll('.server-card');
    serverCards.forEach(card => {
        const statusIndicator = card.querySelector('.server-status');
        if (statusIndicator) {
            // Randomly simulate status changes (very rare)
            if (Math.random() < 0.01) {
                const isOnline = statusIndicator.classList.contains('online');
                if (isOnline) {
                    // Don't actually change to offline in demo, just add visual feedback
                    statusIndicator.style.opacity = '0.5';
                    setTimeout(() => {
                        statusIndicator.style.opacity = '1';
                    }, 1000);
                }
            }
        }
    });
}

// Update Dashboard Stats
function updateDashboardStats() {
    // Simulate small fluctuations in stats
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const currentValue = stat.textContent;
        if (currentValue.includes('%')) {
            // Don't update percentages
            return;
        }
        
        // Only update numeric values occasionally
        if (Math.random() < 0.3) {
            const numericValue = parseFloat(currentValue.replace(/[^0-9.]/g, ''));
            if (!isNaN(numericValue) && numericValue > 10) {
                const change = (Math.random() - 0.5) * (numericValue * 0.02);
                const newValue = (numericValue + change).toFixed(currentValue.includes('.') ? 1 : 0);
                stat.textContent = newValue + (currentValue.includes('GB') ? ' GB' : 
                                               currentValue.includes('TB') ? ' TB' : 
                                               currentValue.includes('s') ? 's' : '');
            }
        }
    });
}

// Project Card Interactions
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.4)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        });
    });
}

// Satellite Network Animation
function animateSatellites() {
    const satelliteCards = document.querySelectorAll('.satellite-card');
    satelliteCards.forEach((card, index) => {
        // Subtle pulsing animation
        setInterval(() => {
            card.style.boxShadow = '0 0 20px rgba(37, 99, 235, 0.3)';
            setTimeout(() => {
                card.style.boxShadow = 'none';
            }, 1000);
        }, 3000 + (index * 500));
    });
}

// Form Input Enhancements
function initFormInputs() {
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
        
        // Add enter key support for subdomain generator
        if (input.id === 'projectName') {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    generateSubdomain();
                }
            });
        }
    });
}

// Card Hover Effects
function initCardEffects() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-3px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Navigation Smooth Scroll
function initNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });
}

// Copy to Clipboard Function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        toast.textContent = 'Copied to clipboard!';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    });
}

// Add CSS animations for toast
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all interactive elements
    initProjectCards();
    initFormInputs();
    initCardEffects();
    initNavigation();
    animateSatellites();
    
    // Start live activity simulation
    setInterval(simulateActivity, 5000);
    
    // Update server status periodically
    setInterval(updateServerStatus, 10000);
    
    // Update dashboard stats occasionally
    setInterval(updateDashboardStats, 15000);
    
    // Add click-to-copy for subdomain field
    const subdomainField = document.getElementById('generatedSubdomain');
    if (subdomainField) {
        subdomainField.addEventListener('click', () => {
            if (subdomainField.value && subdomainField.value !== 'project-name.yourcloud.com') {
                copyToClipboard(subdomainField.value);
            }
        });
        subdomainField.style.cursor = 'pointer';
        subdomainField.title = 'Click to copy';
    }
    
    // Add welcome message to logs
    addLogEntry('Global Host platform initialized successfully', 'success');
    addLogEntry('Connected to NASA satellite network (12 satellites)', 'info');
    addLogEntry('All systems operational - ready for deployments', 'success');
    
    console.log('🌍 Global Host Cloud Platform Initialized');
    console.log('Created by: olawale abdul-ganiyu');
    console.log('NASA Satellite Network: Connected');
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + 1-9 to navigate to sections
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const sections = ['dashboard', 'servers', 'networking', 'storage', 'deploy', 'projects', 'monitoring', 'security', 'satellites'];
        const sectionIndex = parseInt(e.key) - 1;
        if (sections[sectionIndex]) {
            showSection(sections[sectionIndex]);
        }
    }
});

// Responsive Sidebar Toggle (for mobile)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    sidebar.classList.toggle('mobile-open');
    
    if (sidebar.classList.contains('mobile-open')) {
        sidebar.style.display = 'block';
        mainContent.style.marginLeft = '0';
    } else {
        sidebar.style.display = 'none';
        mainContent.style.marginLeft = '0';
    }
}

// Add mobile menu button if screen is small
if (window.innerWidth <= 768) {
    const menuButton = document.createElement('button');
    menuButton.innerHTML = '☰';
    menuButton.style.cssText = `
        display: block;
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `;
    menuButton.onclick = toggleSidebar;
    document.body.appendChild(menuButton);
}

// Export functions for global access
window.GlobalHost = {
    showSection,
    generateSubdomain,
    handleFileUpload,
    copyToClipboard,
    addLogEntry,
    handleZipUpload,
    extractProject,
    deleteProject,
    updateUploadedProjectsIndex
};
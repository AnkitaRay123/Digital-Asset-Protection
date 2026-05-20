# 🤝 Contributing to Digital Asset Protection

Thank you for considering contributing to Digital Asset Protection! We welcome contributions from the community to help improve this project.

---

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Questions](#questions)

---

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all. We pledge to:
- Be respectful and inclusive
- Accept criticism constructively
- Focus on what is best for the community
- Show empathy towards other community members

### Our Standards
Examples of behavior that contributes to a positive environment include:
- Using welcoming and inclusive language
- Being respectful of differing opinions
- Accepting constructive criticism gracefully
- Focusing on what is best for the community
- Showing empathy towards community members

---

## Getting Started

### Prerequisites
- Git
- Node.js 18+
- Python 3.8+
- npm or yarn
- Basic knowledge of React, TypeScript, and Python

### Development Setup

#### 1. Fork & Clone
```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Digital-Asset-Protection.git
cd Digital-Asset-Protection

# Add upstream remote
git remote add upstream https://github.com/AnkitaRay123/Digital-Asset-Protection.git
```

#### 2. Create Development Branch
```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# or for bug fixes
git checkout -b bugfix/issue-description
```

#### 3. Setup Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

#### 4. Setup Backend
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Run Flask server
python app.py
```

---

## Development Workflow

### 1. Keep Your Branch Updated
```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch
git rebase upstream/main

# If conflicts occur, resolve them and continue
git add .
git rebase --continue
```

### 2. Making Changes

#### Frontend Changes
```typescript
// Follow React and TypeScript best practices
// Use functional components with hooks
// Use TypeScript for type safety

interface ComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent: React.FC<ComponentProps> = ({ title, onAction }) => {
  const [state, setState] = useState<boolean>(false);
  
  return (
    <div className="component">
      <h1>{title}</h1>
      <button onClick={onAction}>Click me</button>
    </div>
  );
};
```

#### Backend Changes
```python
# Follow PEP 8 style guide
# Use type hints where possible
# Keep functions focused and testable

from typing import Dict, List, Optional

def process_asset(
    asset_id: int,
    config: Dict[str, any]
) -> Optional[Dict]:
    """
    Process a digital asset.
    
    Args:
        asset_id: The ID of the asset to process
        config: Configuration dictionary
        
    Returns:
        Processing result dictionary or None if failed
    """
    try:
        # Implementation here
        return result
    except Exception as e:
        logger.error(f"Error processing asset {asset_id}: {str(e)}")
        return None
```

### 3. Testing Changes

#### Frontend Testing
```bash
# Run linter
npm run lint

# Build to check for errors
npm run build

# Test components in browser
# Open browser and test manually
```

#### Backend Testing
```bash
# Run tests (if available)
python -m pytest tests/

# Test API endpoints
python test_upload.py

# Check Python syntax
python -m py_compile backend/*.py
```

---

## Coding Standards

### TypeScript/React

#### File Structure
```
components/
├── MyComponent.tsx       # Component file
├── MyComponent.test.tsx  # Test file (if applicable)
└── useMyHook.ts         # Custom hook
```

#### Naming Conventions
```typescript
// Components: PascalCase
export const MyComponent = () => {}

// Hooks: camelCase with 'use' prefix
export const useMyHook = () => {}

// Constants: UPPER_SNAKE_CASE
export const API_TIMEOUT = 5000

// Functions: camelCase
const processData = () => {}

// Variables: camelCase
let currentUser = null
```

#### Code Quality
- Use `const` by default, `let` when needed, avoid `var`
- Use type annotations for function parameters and returns
- Use arrow functions for callbacks
- Destructure props and imports
- Use template literals instead of string concatenation
- Keep functions small and focused
- Add JSDoc comments for complex functions

```typescript
/**
 * Fetches user data from the API
 * @param userId - The ID of the user to fetch
 * @returns Promise resolving to user data
 */
const fetchUser = async (userId: number): Promise<User> => {
  const response = await axios.get(`/api/users/${userId}`);
  return response.data;
};
```

### Python

#### File Structure
```
backend/
├── app.py           # Flask application
├── crawler.py       # Crawler logic
├── models.py        # Data models
└── utils.py         # Utility functions
```

#### Naming Conventions
```python
# Classes: PascalCase
class AssetProcessor:
    pass

# Functions: snake_case
def process_asset(asset_id):
    pass

# Constants: UPPER_SNAKE_CASE
MAX_FILE_SIZE = 1000000

# Variables: snake_case
current_user = None
```

#### Code Quality
- Follow PEP 8 style guide
- Use type hints for functions
- Add docstrings to functions and classes
- Keep functions small and focused
- Use context managers for resource management
- Handle exceptions explicitly

```python
def upload_asset(
    file_path: str,
    metadata: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Upload and process a digital asset.
    
    Args:
        file_path: Path to the asset file
        metadata: Asset metadata dictionary
        
    Returns:
        Dictionary with upload result and asset details
        
    Raises:
        FileNotFoundError: If file doesn't exist
        ValueError: If metadata is invalid
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    # Process file
    result = {
        "success": True,
        "asset_id": 1,
        "message": "Asset uploaded successfully"
    }
    
    return result
```

---

## Commit Guidelines

### Commit Message Format

Use the following format for commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build, dependencies, or tooling changes

### Scope
The scope specifies what part of the code is affected:
- `frontend`
- `backend`
- `crawler`
- `api`
- `database`
- `ui`

### Subject
- Use imperative, present tense: "add" not "added"
- Don't capitalize first letter
- No period (.) at the end
- Limit to 50 characters

### Body
- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with a blank line

### Footer
- Reference issues: `Closes #123` or `Fixes #456`
- Note breaking changes: `BREAKING CHANGE: description`

### Examples

```
feat(frontend): add real-time alert notifications

Implement WebSocket connection for real-time alerts
instead of polling. This reduces server load and
provides immediate notification to users.

Closes #123
```

```
fix(crawler): prevent infinite loop in web scraper

Add depth limit and timeout to crawler configuration
to prevent infinite loops when crawling recursive sites.

Fixes #456
```

```
docs(readme): update installation instructions

Add detailed setup instructions for both frontend
and backend services.
```

---

## Pull Request Process

### Before Creating a PR

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test your changes**
   ```bash
   npm run lint      # Frontend
   npm run build     # Build check
   python app.py     # Backend
   ```

3. **Review your own code first**
   - Check for obvious issues
   - Ensure code follows standards
   - Remove debug code

### Creating a PR

1. **Push to your fork**
   ```bash
   git push origin your-feature-branch
   ```

2. **Open Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch as source
   - Fill in the PR template

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Describe testing performed:
- Test 1: Expected result ✓
- Test 2: Expected result ✓

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] No console errors/warnings
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests pass (if applicable)
- [ ] No new warnings generated

## Related Issues
Closes #123
Relates to #456
```

### PR Review Process

1. **Automated Checks**
   - Linting passes
   - Build succeeds
   - Tests pass (if applicable)

2. **Code Review**
   - At least 1 approval required
   - Address reviewer comments
   - Keep conversation professional

3. **Merge**
   - Squash commits if multiple
   - Use descriptive merge message
   - Delete branch after merge

---

## Reporting Bugs

### Before Reporting
- Check existing issues (both open and closed)
- Verify the bug still exists in latest version
- Try to reproduce consistently

### Bug Report Template

**Title:** Short description of the bug

**Environment:**
```
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Node version: [version]
- Python version: [version]
```

**Description:**
A clear description of what the bug is

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots/Logs:**
Attach relevant screenshots or error logs

**Additional Context:**
Any other relevant information

---

## Suggesting Features

### Feature Request Template

**Title:** Short description of the feature

**Problem:**
Describe the problem this solves

**Proposed Solution:**
How the feature should work

**Benefits:**
Why this feature is valuable

**Examples:**
How users would use this feature

**Alternatives:**
Alternative approaches considered

---

## Questions?

- Open an issue with the `question` label
- Join our discussion forum
- Contact the maintainers

---

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [React Best Practices](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Python Style Guide (PEP 8)](https://pep8.org)
- [Flask Documentation](https://flask.palletsprojects.com)

---

Thank you for contributing! 🎉

**Last Updated:** May 2026  
**Maintained by:** AnkitaRay123
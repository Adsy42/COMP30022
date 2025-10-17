# 🌿 Git Branching & Development Workflow

> **📍 You are here:** [Documentation Index](./README.md) → [Setup Guide](./01-setup.md) → **Git Workflow**
>
> **➡️ Next:** [Development Guide](./03-development-guide.md)

## 🎯 Overview

This document defines our Git workflow, branching strategy, and development lifecycle for the Legal AI Query & Referral System project. It ensures smooth collaboration between frontend and backend teams while supporting parallel development.

## 🌿 Branch Strategy: GitFlow Adapted

### **Main Branches**

#### `main` Branch - Phase Releases Only

- **Purpose:** Production-ready code at completion of each phase
- **Content:** Fully tested, stakeholder-approved features
- **Merge Frequency:** End of each phase (every 2-4 sprints)
- **Protection:** Highest level (admin-only, 2 reviewers required)

#### `develop` Branch - Ongoing Feature Integration

- **Purpose:** Integration point for daily development work
- **Content:** Work-in-progress and completed features awaiting phase release
- **Merge Frequency:** Daily/multiple times per day
- **Protection:** Medium level (1 reviewer required)

### **Supporting Branches**

#### **Feature Branches**

```
feature/SPRNT2-XX-short-description
```

**Examples:**

- `feature/SPRNT2-14-chat-interface`
- `feature/SPRNT2-20-database-setup`
- `feature/SPRNT2-21-ai-service-integration`

#### **Other Branch Types**

```
bugfix/SPRNT2-XX-issue-description     # Bug fixes
hotfix/critical-issue-description      # Emergency production fixes
release/phase-X                        # Release preparation
```

## 🔄 Development Workflow

### **1. Starting New Work**

```bash
# 1. Always start from latest develop branch
git checkout develop
git pull origin develop

# 2. Create feature branch with Jira ticket reference
git checkout -b feature/SPRNT2-14-chat-interface

# 3. Move Jira ticket to "In Progress" status
# 4. Begin development work
```

### **2. Daily Development Cycle**

```bash
# Make changes and commit frequently with meaningful messages
git add .
git commit -m "feat(SPRNT2-14): implement chat message validation

- Add message length validation
- Implement real-time validation feedback
- Add error message display

Closes SPRNT2-14"

# Push to remote branch at least daily
git push origin feature/SPRNT2-14-chat-interface
```

### **3. Integration Process**

```bash
# 1. Rebase on latest develop before creating PR
git checkout develop
git pull origin develop
git checkout feature/SPRNT2-14-chat-interface
git rebase develop

# 2. Resolve any conflicts and push rebased branch
git push origin feature/SPRNT2-14-chat-interface --force-with-lease

# 3. Create Pull Request to develop branch
# 4. Complete code review process
# 5. Merge after approval (squash merge preferred)
```

## 📝 Commit Message Standards

### **Format: Conventional Commits**

```
<type>(scope): <description>

[optional body]

[optional footer]
```

### **Commit Types**

- **feat:** New feature implementation (SPRNT2-XX)
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, whitespace)
- **refactor:** Code refactoring without feature changes
- **test:** Adding or updating tests
- **chore:** Build process, dependencies, tooling

### **Examples of Good Commit Messages**

```bash
# Feature implementation
feat(SPRNT2-14): add chat interface component

- Implement real-time message display
- Add message input validation
- Include typing indicators
- Add unit tests for chat functionality

Closes SPRNT2-14

# Bug fix
fix(SPRNT2-15): resolve AI service connection timeout

Fixed issue where AI service requests were timing out
after 30 seconds due to incorrect timeout configuration.

# Documentation
docs(SPRNT2-20): update API documentation

Added endpoint documentation for chat message
processing and AI query handling.
```

### **Commit Message Rules**

- ✅ **Include Jira ticket reference** in commit body
- ✅ **Use imperative mood** ("add" not "added")
- ✅ **Keep subject line under 50 characters**
- ✅ **Wrap body at 72 characters**
- ✅ **Explain what and why, not how**

## 🔍 Code Review Process

### **Pull Request Requirements**

**Before Creating PR:**

- [ ] **Jira ticket reference** in title and description
- [ ] **Rebased on latest develop** branch
- [ ] **All tests passing** locally
- [ ] **Code follows style guidelines**
- [ ] **Documentation updated** if needed

### **PR Template**

```markdown
## 🎯 Jira Ticket

Closes [SPRNT2-14](https://itproject24.atlassian.net/browse/SPRNT2-14)

## 📝 Description

Brief description of the changes made and why they were necessary.

## ✅ Acceptance Criteria Met

- [ ] Chat interface displays messages correctly
- [ ] Message validation prevents empty submissions
- [ ] Real-time updates work properly
- [ ] Error handling is implemented

## 🧪 Testing

- [ ] Unit tests added/updated and passing
- [ ] Manual testing completed successfully
- [ ] Cross-browser testing completed (if frontend)
- [ ] Integration testing with dependent components

## 📷 Screenshots/Demo

(Include screenshots for UI changes or GIFs for interactions)

## 🔗 Related PRs

(Link any related or dependent pull requests)

## 📋 Checklist

- [ ] Code follows project coding standards
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Ready for review
```

## 🔒 Branch Protection Rules

### `main` Branch Protection

- ✅ **Require pull request reviews** (minimum 2 reviewers)
- ✅ **Require status checks to pass** (CI/CD pipeline)
- ✅ **Require branches to be up to date** before merging
- ✅ **Restrict pushes** to administrators only
- ✅ **Require conversation resolution** before merging
- ✅ **Dismiss stale reviews** when new commits pushed

### `develop` Branch Protection

- ✅ **Require pull request reviews** (minimum 1 reviewer)
- ✅ **Require status checks to pass** (CI/CD pipeline)
- ✅ **Require branches to be up to date** before merging
- ✅ **Allow squash merging** only (clean commit history)
- ✅ **Require conversation resolution** before merging

### **Feature Branch Guidelines**

- 🔄 **Regular rebasing** on develop required
- 📝 **Descriptive naming** with Jira ticket reference
- 🔍 **Single responsibility** - one feature per branch
- ⏰ **Short-lived** - complete within sprint timeframe

## 🤝 Team Collaboration Guidelines

### **Communication Protocols**

**🔴 Immediate Notification Required:**

- **Merge conflicts** that cannot be resolved quickly
- **Breaking changes** to shared APIs or data models
- **CI/CD pipeline failures** affecting other developers
- **Critical bugs** discovered in develop or main

**🟡 Daily Communication:**

- **Feature completion** and PR creation
- **Blockers or dependencies** on other team members
- **Significant architecture decisions** or changes
- **Testing results** and integration status

### **Conflict Resolution Process**

```bash
# When merge conflicts occur:
# 1. Attempt automatic resolution
git checkout feature/my-branch
git rebase develop

# 2. If conflicts are complex:
git rebase --abort

# 3. Coordinate with team:
# - Post in team chat
# - Schedule pair programming session
# - Review conflicting changes together
# - Resolve conflicts collaboratively

# 4. Test resolution thoroughly before pushing
```

## 🔧 Development Tools & Setup

### **Required Git Configuration**

```bash
# Set up user information
git config --global user.name "Your Name"
git config --global user.email "your.email@student.unimelb.edu.au"

# Set up useful aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.sync '!git checkout develop && git pull origin develop'

# Set up default branch name
git config --global init.defaultBranch main

# Set up rebase as default for pull
git config --global pull.rebase true
```

## 📊 Quick Reference

### **Common Git Commands**

```bash
# Daily workflow
git sync                                    # Pull latest develop
git checkout -b feature/SPRNT2-XX-desc     # Create feature branch
git add . && git commit -m "feat: message"  # Commit changes
git push origin feature/SPRNT2-XX-desc     # Push to remote

# Integration workflow
git checkout develop && git pull            # Get latest develop
git checkout feature/my-branch              # Switch to feature
git rebase develop                          # Rebase on develop
git push origin feature/my-branch --force-with-lease  # Push rebased

# Emergency commands
git stash                                   # Save work temporarily
git stash pop                               # Restore stashed work
git reflog                                  # Find lost commits
```

### **Branch Naming Quick Guide**

```bash
feature/SPRNT2-14-chat-interface           # Feature development
bugfix/SPRNT2-14-validation-fix            # Bug fixes
hotfix/critical-ai-service-failure         # Production emergencies
release/phase-1                             # Release preparation
```

## 📅 Development Workflow

1. **Start containers**: `make dev-up`
2. **Create feature branch** from develop with Jira ticket reference
3. **Make changes** and commit frequently with conventional commit format
4. **Rebase on develop** daily to avoid conflicts
5. **Run tests**: `make test`
6. **Format code**: `make format`
7. **Create Pull Request** to develop branch
8. **Complete code review** process
9. **Squash merge** after approval

**Team Structure:**

- Product Owner: Adam
- Frontend Lead: Farah
- Backend Lead: Himank
- AI Lead: Yusuf
- Scrum Master: Bryan

---

**🎯 Ready to Code?** → **[Next: Development Guide](./03-development-guide.md)**

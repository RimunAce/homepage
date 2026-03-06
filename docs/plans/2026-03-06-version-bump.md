# Version Bump to 1.0.5 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update application version from 1.0.2 to 1.0.5 across all relevant version identifiers.

**Architecture:** Simple string replacement in package manifest files and any user-visible version displays. No code logic changes required.

**Tech Stack:** Node.js/Next.js project with npm package management.

---

## Prerequisites

- Read the design document: [`docs/plans/2026-03-06-version-bump-design.md`](docs/plans/2026-03-06-version-bump-design.md)

---

### Task 1: Update package.json Version

**Files:**
- Modify: [`package.json`](package.json:3)

**Step 1: Update the version field**

Change line 3 in [`package.json`](package.json:3):

```json
"version": "1.0.5",
```

**Step 2: Verify the change**

The [`package.json`](package.json) file should now have `"version": "1.0.5"` on line 3.

---

### Task 2: Update package-lock.json Version

**Files:**
- Modify: [`package-lock.json`](package-lock.json)

**Step 1: Find and update version references**

In [`package-lock.json`](package-lock.json), update:
- The top-level `"version"` field
- Any `"respire"` package references that contain `"version": "1.0.2"`

**Step 2: Verify the change**

The lockfile should reflect version `1.0.5` for the respire package.

---

### Task 3: Search for User-Visible Version Strings

**Files:**
- Search: All project files

**Step 1: Search for displayed version references**

Search the codebase for any user-visible version strings showing `1.0.2`:
- Look in components that might display version info
- Check header, footer, about, or settings components
- Verify no hardcoded version strings exist in UI

**Step 2: Update any found version displays**

If any user-visible version strings are found displaying `1.0.2`, update them to `1.0.5`.

---

### Task 4: Verification

**Step 1: Verify npm install works**

Run: `npm install`

Expected: No errors, package-lock.json remains consistent.

**Step 2: Verify build works**

Run: `npm run build`

Expected: Build completes successfully.

**Step 3: Commit the changes**

```bash
git add package.json package-lock.json
git commit -m "chore: bump version to 1.0.5"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Update package.json version | [`package.json`](package.json:3) |
| 2 | Update package-lock.json version | [`package-lock.json`](package-lock.json) |
| 3 | Search and update user-visible versions | Various (if any) |
| 4 | Verify and commit | - |
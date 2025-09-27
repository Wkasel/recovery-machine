#!/usr/bin/env node

/**
 * Cleanup Script: Replace console statements with proper logging
 * 
 * This script replaces console.log/error/warn statements with proper Logger calls
 * while preserving development functionality.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files and directories to process
const DIRS_TO_PROCESS = ['app', 'components', 'lib'];
const EXCLUDE_PATTERNS = ['node_modules', '.next', 'test', 'spec', 'scripts'];

// Replacement patterns
const REPLACEMENTS = [
  {
    pattern: /console\.log\s*\(\s*["'`]([^"'`]+)["'`]\s*,?\s*([^)]*)\)/g,
    replacement: (match, message, meta) => {
      const metaPart = meta.trim() ? `, ${meta}` : '';
      return `Logger.info("${message}"${metaPart})`;
    }
  },
  {
    pattern: /console\.error\s*\(\s*["'`]([^"'`]+)["'`]\s*,?\s*([^)]*)\)/g,
    replacement: (match, message, meta) => {
      const metaPart = meta.trim() ? `, ${meta}` : '';
      return `Logger.error("${message}"${metaPart})`;
    }
  },
  {
    pattern: /console\.warn\s*\(\s*["'`]([^"'`]+)["'`]\s*,?\s*([^)]*)\)/g,
    replacement: (match, message, meta) => {
      const metaPart = meta.trim() ? `, ${meta}` : '';
      return `Logger.warn("${message}"${metaPart})`;
    }
  }
];

// Track changes
let totalFiles = 0;
let modifiedFiles = 0;
let totalReplacements = 0;

/**
 * Check if file should be processed
 */
function shouldProcessFile(filePath) {
  if (!filePath.match(/\.(ts|tsx|js|jsx)$/)) return false;
  
  const relativePath = path.relative(process.cwd(), filePath);
  return !EXCLUDE_PATTERNS.some(pattern => relativePath.includes(pattern));
}

/**
 * Add Logger import if not present
 */
function addLoggerImport(content) {
  if (content.includes('import') && !content.includes('Logger')) {
    // Find the best place to add the import
    const lines = content.split('\n');
    let importIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^import.*from\s+["']@\/lib/)) {
        importIndex = i + 1;
        break;
      }
    }
    
    if (importIndex === -1) {
      // Look for any import
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^import/)) {
          importIndex = i + 1;
          break;
        }
      }
    }
    
    if (importIndex > -1) {
      lines.splice(importIndex, 0, 'import { Logger } from "@/lib/logger";');
      return lines.join('\n');
    }
  }
  
  return content;
}

/**
 * Process a single file
 */
function processFile(filePath) {
  totalFiles++;
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let fileReplacements = 0;
    
    // Apply replacements
    for (const { pattern, replacement } of REPLACEMENTS) {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, (...args) => {
          fileReplacements++;
          totalReplacements++;
          modified = true;
          return replacement(...args);
        });
      }
    }
    
    // Add Logger import if we made replacements
    if (modified) {
      content = addLoggerImport(content);
      
      fs.writeFileSync(filePath, content, 'utf8');
      modifiedFiles++;
      
      console.log(`✅ ${path.relative(process.cwd(), filePath)} (${fileReplacements} replacements)`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Process directory recursively
 */
function processDirectory(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        if (!EXCLUDE_PATTERNS.some(pattern => entry.name.includes(pattern))) {
          processDirectory(fullPath);
        }
      } else if (entry.isFile() && shouldProcessFile(fullPath)) {
        processFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`❌ Error reading directory ${dirPath}:`, error.message);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🧹 Starting console statement cleanup...\n');
  
  // Check if Logger exists
  const loggerPath = path.join(process.cwd(), 'lib/logger/Logger.ts');
  if (!fs.existsSync(loggerPath)) {
    console.error('❌ Logger not found at lib/logger/Logger.ts');
    process.exit(1);
  }
  
  // Process each directory
  for (const dir of DIRS_TO_PROCESS) {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      console.log(`📁 Processing ${dir}/...`);
      processDirectory(dirPath);
    }
  }
  
  // Summary
  console.log('\n📊 Cleanup Summary:');
  console.log('===================');
  console.log(`Files processed: ${totalFiles}`);
  console.log(`Files modified: ${modifiedFiles}`);
  console.log(`Total replacements: ${totalReplacements}`);
  
  if (modifiedFiles > 0) {
    console.log('\n✅ Console statement cleanup completed!');
    console.log('🔍 Please review the changes and test thoroughly.');
    console.log('📝 Consider running TypeScript checks: npm run check-types');
  } else {
    console.log('\n✨ No console statements found to replace.');
  }
}

// Run the cleanup
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
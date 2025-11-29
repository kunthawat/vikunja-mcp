# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.3] - 2025-11-29

### Fixed
- **MCP Tools List Error**: Resolved `Cannot read properties of undefined (reading '_zod')` error that occurred during `tools/list` operations
- **Zod Schema Definition**: Fixed improper Zod schema usage in `aorpConfig` parameter for the tasks tool
- **Server Initialization**: MCP server now starts correctly without schema introspection errors

### Technical Details
- Corrected Zod schema structure in `src/tools/tasks/index.ts`
- Ensured proper schema generation for MCP framework compatibility
- Verified all tools are accessible and properly listed

## [0.2.2] - 2025-11-29

### Fixed
- **Build Process**: Resolved TypeScript compilation issues
- **Dependencies**: Updated package build configuration

## [0.2.1] - 2025-11-28

### Added
- **AI Clarity Improvements**: Comprehensive enhancements to reduce AI parameter confusion
- **Enhanced Error Messages**: All tools now provide detailed examples with error messages
- **Auto-Inbox Detection**: Tasks tool automatically detects user's Inbox project
- **Date Format Enforcement**: Strict ISO 8601 date validation with clear examples
- **Subtask Creation Guidance**: Enhanced error messages for parent task requirements
- **Label Assignment Clarity**: Distinguished between `labels` and `label_ids` parameters
- **Projects Tool ID Validation**: Enhanced error messages for all ID-required operations
- **Labels Tool Hex Color Guidance**: Clear examples for valid hex color formats
- **Comprehensive Test Suite**: Added tests for all enhanced error scenarios

### Enhanced
- **Tasks Tool Error Messages**: Transformed generic errors into detailed guidance with examples
- **Projects Tool Documentation**: Added comprehensive usage notes and ID requirement warnings
- **Labels Tool Documentation**: Enhanced with hex color format guidance and ID requirements
- **Parameter Validation**: All tools now include specific examples in error messages
- **Tool Descriptions**: Updated to emphasize ID requirements and usage patterns

### Fixed
- **AI Parameter Confusion**: Root cause analysis and comprehensive fixes for ID-related errors
- **Date Format Issues**: Enforced consistent ISO 8601 format across all operations
- **Label Assignment Methods**: Clarified the difference between array formats
- **Project Hierarchy Operations**: Enhanced guidance for move, breadcrumb, and children operations

### Technical Details
- Created `InboxDetectionService` for automatic project detection
- Enhanced validation functions with better error messages
- Implemented standardized error message pattern across all tools
- Added comprehensive test coverage for all enhanced scenarios

## [0.2.0] - Previous Release

### Major Architectural Improvements
- **Storage Architecture Refactoring**: 90% code reduction (33 files → 4 files)
- **Zod-Based Filter System**: Enhanced security with 850+ lines removed
- **Production-Ready Retry System**: Replaced custom retry with opossum circuit breaker
- **Zero Breaking Changes**: Maintained 100% backward compatibility

### Features
- Subcommand-based tools for intuitive AI interactions
- Session-based authentication with automatic token management
- Full task management operations
- Complete project management with CRUD operations
- Label management for organizing tasks
- Team operations for collaboration
- User management with settings and search
- Webhook management for project automation
- Batch import tasks from CSV or JSON files
- Input validation for dates, IDs, and hex colors
- Efficient diff-based updates for assignees
- TypeScript with strict mode for type safety
- Comprehensive error handling with typed errors
- Production-ready retry logic with circuit breaker
- Enhanced security with Zod-based input validation
- Rate limiting protection against DoS attacks
- Memory protection with pagination limits

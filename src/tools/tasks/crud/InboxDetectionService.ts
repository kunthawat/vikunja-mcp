/**
 * Inbox Detection Service
 * Automatically finds the user's Inbox project for task creation
 */

import { MCPError, ErrorCode } from '../../../types/index';
import { getClientFromContext } from '../../../client';
import type { VikunjaClient, Project } from 'node-vikunja';
import { logger } from '../../../utils/logger';

/**
 * Finds the user's Inbox project
 * Vikunja typically creates an "Inbox" project for each user
 */
export async function findInboxProject(): Promise<Project> {
  try {
    const client = await getClientFromContext();
    
    // Get all projects for the user
    const projects = await client.projects.getProjects();
    
    // Look for project named "Inbox" (case-insensitive)
    const inboxProject = projects.find((project: Project) => 
      project.title?.toLowerCase() === 'inbox'
    );
    
    if (inboxProject && inboxProject.id) {
      logger.debug('Found Inbox project', { projectId: inboxProject.id, title: inboxProject.title });
      return inboxProject;
    }
    
    // If no "Inbox" found, look for common alternatives
    const alternativeNames = ['inbox', 'default', 'personal', 'tasks'];
    const alternativeProject = projects.find((project: Project) => 
      alternativeNames.includes(project.title?.toLowerCase() || '')
    );
    
    if (alternativeProject && alternativeProject.id) {
      logger.debug('Found alternative default project', { 
        projectId: alternativeProject.id, 
        title: alternativeProject.title 
      });
      return alternativeProject;
    }
    
    // If still no suitable project found, use the first available project
    if (projects.length > 0 && projects[0]?.id) {
      const firstProject = projects[0];
      logger.debug('Using first available project as fallback', { 
        projectId: firstProject.id, 
        title: firstProject.title 
      });
      return firstProject;
    }
    
    throw new MCPError(
      ErrorCode.VALIDATION_ERROR,
      'No projects found. Please create a project first before creating tasks.'
    );
    
  } catch (error) {
    if (error instanceof MCPError) {
      throw error;
    }
    
    logger.error('Failed to find Inbox project', { error: error instanceof Error ? error.message : String(error) });
    
    throw new MCPError(
      ErrorCode.API_ERROR,
      `Failed to find a suitable project for task creation: ${error instanceof Error ? error.message : String(error)}. Please specify a projectId explicitly.`
    );
  }
}

/**
 * Gets the Inbox project ID with fallback handling
 */
export async function getInboxProjectId(): Promise<number> {
  const inboxProject = await findInboxProject();
  
  if (!inboxProject.id) {
    throw new MCPError(
      ErrorCode.API_ERROR,
      'Found a project but it has no valid ID. Please specify a projectId explicitly.'
    );
  }
  
  return inboxProject.id;
}

/**
 * Validates if a project exists and is accessible
 */
export async function validateProjectExists(projectId: number): Promise<Project> {
  try {
    const client = await getClientFromContext();
    const project = await client.projects.getProject(projectId);
    return project;
  } catch (error) {
    throw new MCPError(
      ErrorCode.VALIDATION_ERROR,
      `Project with ID ${projectId} not found or not accessible. Please check the projectId or omit it to use the Inbox project automatically.`
    );
  }
}

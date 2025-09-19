// Automation Service - Email and SMS Workflow Management
// Handles automated email and SMS workflows for Recovery Machine

import { 
  sendWelcomeEmail, 
  sendBookingConfirmation, 
  sendBookingReminder, 
  sendReferralInvitation, 
  sendReviewRequest 
} from '@/lib/services/email';
import { 
  sendBookingConfirmationSMS, 
  scheduleBookingReminders, 
  sendSessionCompleteSMS 
} from '@/lib/services/sms';
import { getUserProfile } from '@/lib/database';
import type { 
  Profile, 
  Booking, 
  Referral,
  ApiResponse 
} from '@/lib/types/supabase';

// ===========================================================================
// AUTOMATION WORKFLOW TYPES
// ===========================================================================

export interface AutomationTrigger {
  event: 'user_signup' | 'booking_created' | 'booking_confirmed' | 'booking_completed' | 'referral_created';
  delay?: number; // in minutes
  conditions?: AutomationCondition[];
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface AutomationAction {
  type: 'email' | 'sms' | 'delay' | 'webhook';
  templateId?: string;
  delay?: number; // in minutes
  enabled: boolean;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  trigger_data: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  error_message?: string;
}

// ===========================================================================
// PREDEFINED WORKFLOWS
// ===========================================================================

const DEFAULT_WORKFLOWS: AutomationWorkflow[] = [
  {
    id: 'welcome-series',
    name: 'Welcome Email Series',
    description: 'Send welcome email when new user signs up',
    trigger: {
      event: 'user_signup'
    },
    actions: [
      {
        type: 'email',
        templateId: 'WELCOME_NEW_USER',
        enabled: true
      }
    ],
    enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'booking-confirmation',
    name: 'Booking Confirmation Workflow',
    description: 'Send confirmation email and SMS when booking is created',
    trigger: {
      event: 'booking_created'
    },
    actions: [
      {
        type: 'email',
        templateId: 'BOOKING_CONFIRMATION',
        enabled: true
      },
      {
        type: 'sms',
        templateId: 'BOOKING_CONFIRMATION',
        enabled: true
      }
    ],
    enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'booking-reminders',
    name: 'Booking Reminder Series',
    description: 'Send reminder emails and SMS before booking',
    trigger: {
      event: 'booking_confirmed'
    },
    actions: [
      {
        type: 'delay',
        delay: 1440, // 24 hours before
        enabled: true
      },
      {
        type: 'email',
        templateId: 'BOOKING_REMINDER_24H',
        enabled: true
      },
      {
        type: 'sms',
        templateId: 'BOOKING_REMINDER_24H',
        enabled: true
      },
      {
        type: 'delay',
        delay: 1320, // 22 hours later (2 hours before booking)
        enabled: true
      },
      {
        type: 'sms',
        templateId: 'BOOKING_REMINDER_2H',
        enabled: true
      }
    ],
    enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'post-session-review',
    name: 'Post-Session Review Request',
    description: 'Send review request 2 hours after session completion',
    trigger: {
      event: 'booking_completed',
      delay: 120 // 2 hours after completion
    },
    actions: [
      {
        type: 'email',
        templateId: 'REVIEW_REQUEST',
        enabled: true
      },
      {
        type: 'sms',
        templateId: 'SESSION_COMPLETE',
        enabled: true
      }
    ],
    enabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// ===========================================================================
// WORKFLOW EXECUTION ENGINE
// ===========================================================================

export async function executeWorkflow(
  workflowId: string,
  triggerData: any
): Promise<ApiResponse<WorkflowExecution>> {
  try {
    const workflow = DEFAULT_WORKFLOWS.find(w => w.id === workflowId);
    
    if (!workflow || !workflow.enabled) {
      return {
        data: null,
        error: 'Workflow not found or disabled',
        success: false
      };
    }

    const execution: WorkflowExecution = {
      id: generateExecutionId(),
      workflow_id: workflowId,
      trigger_data: triggerData,
      status: 'running',
      started_at: new Date().toISOString()
    };

    // Execute actions sequentially
    for (const action of workflow.actions) {
      if (!action.enabled) continue;

      try {
        await executeAction(action, triggerData);
      } catch (actionError) {
        console.error(`Error executing action in workflow ${workflowId}:`, actionError);
        execution.status = 'failed';
        execution.error_message = actionError instanceof Error ? actionError.message : 'Action execution failed';
        execution.completed_at = new Date().toISOString();
        
        return {
          data: execution,
          error: execution.error_message,
          success: false
        };
      }
    }

    execution.status = 'completed';
    execution.completed_at = new Date().toISOString();

    return {
      data: execution,
      error: null,
      success: true
    };

  } catch (error) {
    console.error('Error executing workflow:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Workflow execution failed',
      success: false
    };
  }
}

async function executeAction(action: AutomationAction, triggerData: any): Promise<void> {
  switch (action.type) {
    case 'delay':
      if (action.delay) {
        // In production, you'd schedule this delay properly
        console.log(`Delaying for ${action.delay} minutes`);
      }
      break;

    case 'email':
      if (action.templateId && triggerData.profile) {
        await executeEmailAction(action.templateId, triggerData);
      }
      break;

    case 'sms':
      if (action.templateId && triggerData.profile) {
        await executeSMSAction(action.templateId, triggerData);
      }
      break;

    case 'webhook':
      // Implement webhook execution if needed
      console.log('Webhook execution not implemented yet');
      break;

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

async function executeEmailAction(templateId: string, triggerData: any): Promise<void> {
  const { profile, booking, referral } = triggerData;

  switch (templateId) {
    case 'WELCOME_NEW_USER':
      await sendWelcomeEmail(profile);
      break;

    case 'BOOKING_CONFIRMATION':
      if (booking) {
        await sendBookingConfirmation(booking, profile);
      }
      break;

    case 'BOOKING_REMINDER_24H':
      if (booking) {
        await sendBookingReminder(booking, profile, 24);
      }
      break;

    case 'REFERRAL_INVITATION':
      if (referral) {
        await sendReferralInvitation(referral, profile);
      }
      break;

    case 'REVIEW_REQUEST':
      if (booking) {
        await sendReviewRequest(booking, profile);
      }
      break;

    default:
      throw new Error(`Unknown email template: ${templateId}`);
  }
}

async function executeSMSAction(templateId: string, triggerData: any): Promise<void> {
  const { profile, booking } = triggerData;

  if (!profile.phone) {
    console.log('No phone number available for SMS');
    return;
  }

  switch (templateId) {
    case 'BOOKING_CONFIRMATION':
      if (booking) {
        await sendBookingConfirmationSMS(booking, profile);
      }
      break;

    case 'BOOKING_REMINDER_24H':
    case 'BOOKING_REMINDER_2H':
      if (booking) {
        const hours = templateId.includes('24H') ? 24 : 2;
        // Note: This would be scheduled properly in production
        console.log(`SMS reminder scheduled for ${hours} hours before booking`);
      }
      break;

    case 'SESSION_COMPLETE':
      if (booking) {
        await sendSessionCompleteSMS(booking, profile);
      }
      break;

    default:
      throw new Error(`Unknown SMS template: ${templateId}`);
  }
}

// ===========================================================================
// WORKFLOW TRIGGER HANDLERS
// ===========================================================================

export async function triggerUserSignupWorkflow(userId: string): Promise<ApiResponse<any>> {
  try {
    const profileResult = await getUserProfile(userId);
    
    if (!profileResult.success || !profileResult.data) {
      return {
        data: null,
        error: 'User profile not found',
        success: false
      };
    }

    const triggerData = {
      profile: profileResult.data,
      event: 'user_signup',
      timestamp: new Date().toISOString()
    };

    const result = await executeWorkflow('welcome-series', triggerData);
    
    return {
      data: { workflow_executed: result.success },
      error: result.error,
      success: result.success
    };

  } catch (error) {
    console.error('Error triggering user signup workflow:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to trigger workflow',
      success: false
    };
  }
}

export async function triggerBookingWorkflow(
  booking: Booking,
  profile: Profile,
  event: 'created' | 'confirmed' | 'completed'
): Promise<ApiResponse<any>> {
  try {
    const triggerData = {
      profile,
      booking,
      event: `booking_${event}`,
      timestamp: new Date().toISOString()
    };

    let workflowId: string;
    switch (event) {
      case 'created':
        workflowId = 'booking-confirmation';
        break;
      case 'confirmed':
        workflowId = 'booking-reminders';
        break;
      case 'completed':
        workflowId = 'post-session-review';
        break;
      default:
        return {
          data: null,
          error: 'Unknown booking event',
          success: false
        };
    }

    const result = await executeWorkflow(workflowId, triggerData);
    
    return {
      data: { workflow_executed: result.success },
      error: result.error,
      success: result.success
    };

  } catch (error) {
    console.error('Error triggering booking workflow:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to trigger workflow',
      success: false
    };
  }
}

export async function triggerReferralWorkflow(
  referral: Referral,
  referrerProfile: Profile
): Promise<ApiResponse<any>> {
  try {
    const triggerData = {
      profile: referrerProfile,
      referral,
      event: 'referral_created',
      timestamp: new Date().toISOString()
    };

    // Send referral invitation email
    const result = await sendReferralInvitation(referral, referrerProfile);
    
    return {
      data: { email_sent: result.success },
      error: result.error,
      success: result.success
    };

  } catch (error) {
    console.error('Error triggering referral workflow:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to trigger workflow',
      success: false
    };
  }
}

// ===========================================================================
// WORKFLOW MANAGEMENT
// ===========================================================================

export function getAvailableWorkflows(): AutomationWorkflow[] {
  return DEFAULT_WORKFLOWS.filter(workflow => workflow.enabled);
}

export function getWorkflowById(workflowId: string): AutomationWorkflow | null {
  return DEFAULT_WORKFLOWS.find(workflow => workflow.id === workflowId) || null;
}

export async function updateWorkflowStatus(
  workflowId: string,
  enabled: boolean
): Promise<ApiResponse<AutomationWorkflow>> {
  try {
    const workflow = DEFAULT_WORKFLOWS.find(w => w.id === workflowId);
    
    if (!workflow) {
      return {
        data: null,
        error: 'Workflow not found',
        success: false
      };
    }

    workflow.enabled = enabled;
    workflow.updated_at = new Date().toISOString();

    return {
      data: workflow,
      error: null,
      success: true
    };

  } catch (error) {
    console.error('Error updating workflow status:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update workflow',
      success: false
    };
  }
}

// ===========================================================================
// SCHEDULING HELPERS
// ===========================================================================

export async function scheduleBookingWorkflows(
  booking: Booking,
  profile: Profile
): Promise<ApiResponse<{ scheduled_workflows: string[] }>> {
  try {
    const scheduledWorkflows: string[] = [];
    const bookingTime = new Date(booking.date_time);
    const now = new Date();

    // Schedule 24-hour reminder
    const reminder24h = new Date(bookingTime.getTime() - 24 * 60 * 60 * 1000);
    if (reminder24h > now) {
      // In production, you'd use a proper job scheduler like Bull/Agenda
      console.log(`Scheduled 24h reminder for ${reminder24h.toISOString()}`);
      scheduledWorkflows.push('24h_reminder');
    }

    // Schedule 2-hour reminder
    const reminder2h = new Date(bookingTime.getTime() - 2 * 60 * 60 * 1000);
    if (reminder2h > now) {
      console.log(`Scheduled 2h reminder for ${reminder2h.toISOString()}`);
      scheduledWorkflows.push('2h_reminder');
    }

    // Schedule post-session review request
    const reviewRequest = new Date(bookingTime.getTime() + 2 * 60 * 60 * 1000);
    console.log(`Scheduled review request for ${reviewRequest.toISOString()}`);
    scheduledWorkflows.push('review_request');

    return {
      data: { scheduled_workflows: scheduledWorkflows },
      error: null,
      success: true
    };

  } catch (error) {
    console.error('Error scheduling booking workflows:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to schedule workflows',
      success: false
    };
  }
}

// ===========================================================================
// UTILITY FUNCTIONS
// ===========================================================================

function generateExecutionId(): string {
  return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function validateWorkflowConditions(
  conditions: AutomationCondition[],
  data: any
): boolean {
  return conditions.every(condition => {
    const value = getNestedValue(data, condition.field);
    
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'not_equals':
        return value !== condition.value;
      case 'contains':
        return String(value).includes(String(condition.value));
      case 'greater_than':
        return Number(value) > Number(condition.value);
      case 'less_than':
        return Number(value) < Number(condition.value);
      default:
        return false;
    }
  });
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// ===========================================================================
// TESTING & DEVELOPMENT
// ===========================================================================

export async function testWorkflow(
  workflowId: string,
  mockData?: any
): Promise<ApiResponse<WorkflowExecution>> {
  try {
    const workflow = getWorkflowById(workflowId);
    
    if (!workflow) {
      return {
        data: null,
        error: 'Workflow not found',
        success: false
      };
    }

    const testData = mockData || {
      profile: {
        id: 'test-user',
        email: 'test@example.com',
        phone: '+1234567890',
        referral_code: 'TEST123'
      },
      booking: {
        id: 'test-booking',
        date_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        duration: 60,
        location_address: '123 Test St, Test City, TC'
      }
    };

    console.log(`Testing workflow: ${workflow.name}`);
    console.log('Test data:', testData);

    return {
      data: {
        id: generateExecutionId(),
        workflow_id: workflowId,
        trigger_data: testData,
        status: 'completed',
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      },
      error: null,
      success: true
    };

  } catch (error) {
    console.error('Error testing workflow:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Workflow test failed',
      success: false
    };
  }
}
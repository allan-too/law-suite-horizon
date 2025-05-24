
# TypeScript Models and Type Definitions

## src/models/index.ts - Model Exports

```typescript
export * from './User';
export * from './Client';
export * from './Document';
export * from './Contract';
export * from './Form';
export * from './Subscription';
export * from './BillingTransaction';
export * from './SystemLog';
```

## src/models/User.ts - User Model

```typescript
export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'user' | 'admin' | 'staff';
  firm_name?: string;
  phone?: string;
  address?: string;
  profile_image?: string;
  subscription_id?: string;
  subscription_status: 'active' | 'canceled' | 'expired' | 'trial';
  subscription_tier: 'basic' | 'premium' | 'enterprise';
  trial_ends_at?: Date;
  email_verified: boolean;
  email_verification_token?: string;
  password_reset_token?: string;
  password_reset_expires?: Date;
  last_login?: Date;
  failed_login_attempts: number;
  locked_until?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  firm_name?: string;
  phone?: string;
  role?: 'user' | 'admin' | 'staff';
}

export interface UpdateUserData {
  name?: string;
  firm_name?: string;
  phone?: string;
  address?: string;
  profile_image?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  firm_name?: string;
  phone?: string;
  address?: string;
  profile_image?: string;
  subscription_status: string;
  subscription_tier: string;
  trial_ends_at?: Date;
  created_at: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

export interface PasswordResetData {
  token: string;
  new_password: string;
}
```

## src/models/Client.ts - Client Model

```typescript
export interface Client {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  jurisdiction: string;
  issue_description?: string;
  status: 'New' | 'Active' | 'Done' | 'VIP' | 'Inactive';
  matter_type?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  retainer_amount?: number;
  hourly_rate?: number;
  notes?: string;
  tags?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface CreateClientData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  jurisdiction: string;
  issue_description?: string;
  status?: 'New' | 'Active' | 'Done' | 'VIP' | 'Inactive';
  matter_type?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  retainer_amount?: number;
  hourly_rate?: number;
  notes?: string;
  tags?: string[];
}

export interface UpdateClientData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  jurisdiction?: string;
  issue_description?: string;
  status?: 'New' | 'Active' | 'Done' | 'VIP' | 'Inactive';
  matter_type?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  retainer_amount?: number;
  hourly_rate?: number;
  notes?: string;
  tags?: string[];
}

export interface ClientSummary {
  id: string;
  name: string;
  email?: string;
  jurisdiction: string;
  status: string;
  matter_type?: string;
  created_at: Date;
}

export interface ClientFilters {
  status?: string[];
  jurisdiction?: string[];
  priority?: string[];
  matter_type?: string[];
  search?: string;
}
```

## src/models/Document.ts - Document Model

```typescript
export interface Document {
  id: string;
  user_id: string;
  client_id?: string;
  name: string;
  original_name: string;
  file_path: string;
  file_type?: string;
  file_size?: number;
  mime_type?: string;
  category: 'contract' | 'intake' | 'correspondence' | 'court' | 'evidence' | 'other';
  subcategory?: string;
  description?: string;
  tags?: string[];
  is_confidential: boolean;
  ai_analyzed: boolean;
  ai_analysis_results?: AIAnalysisResult;
  ai_analysis_date?: Date;
  checksum?: string;
  version: number;
  parent_document_id?: string;
  uploaded_at: Date;
  updated_at: Date;
}

export interface CreateDocumentData {
  name: string;
  original_name: string;
  file_path: string;
  file_type?: string;
  file_size?: number;
  mime_type?: string;
  client_id?: string;
  category: 'contract' | 'intake' | 'correspondence' | 'court' | 'evidence' | 'other';
  subcategory?: string;
  description?: string;
  tags?: string[];
  is_confidential?: boolean;
  checksum?: string;
  parent_document_id?: string;
}

export interface UpdateDocumentData {
  name?: string;
  client_id?: string;
  category?: 'contract' | 'intake' | 'correspondence' | 'court' | 'evidence' | 'other';
  subcategory?: string;
  description?: string;
  tags?: string[];
  is_confidential?: boolean;
}

export interface AIAnalysisResult {
  summary?: string;
  key_terms?: string[];
  entities?: EntityExtraction[];
  clauses?: ClauseAnalysis[];
  risks?: RiskAssessment[];
  recommendations?: string[];
  confidence_score?: number;
  analysis_version?: string;
  processing_time?: number;
}

export interface EntityExtraction {
  type: 'person' | 'organization' | 'location' | 'date' | 'money' | 'other';
  value: string;
  confidence: number;
  context?: string;
}

export interface ClauseAnalysis {
  type: string;
  content: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  suggestions?: string[];
}

export interface RiskAssessment {
  type: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation?: string[];
}

export interface DocumentFilters {
  category?: string[];
  client_id?: string;
  ai_analyzed?: boolean;
  is_confidential?: boolean;
  date_from?: Date;
  date_to?: Date;
  search?: string;
}
```

## src/models/Contract.ts - Contract Model

```typescript
export interface Contract {
  id: string;
  user_id: string;
  client_id: string;
  document_id?: string;
  title: string;
  contract_type?: string;
  jurisdiction: string;
  status: 'Draft' | 'Under Review' | 'Signed' | 'Executed' | 'Expired' | 'Canceled' | 'Flagged';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: Date;
  end_date?: Date;
  expiration_date?: Date;
  value?: number;
  currency: string;
  description?: string;
  terms_summary?: string;
  key_provisions?: KeyProvision[];
  renewal_terms?: string;
  governing_law?: string;
  dispute_resolution?: string;
  signatures_required: number;
  signatures_obtained: number;
  last_review_date?: Date;
  next_review_date?: Date;
  notes?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface CreateContractData {
  title: string;
  client_id: string;
  document_id?: string;
  contract_type?: string;
  jurisdiction: string;
  status?: 'Draft' | 'Under Review' | 'Signed' | 'Executed' | 'Expired' | 'Canceled' | 'Flagged';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: Date;
  end_date?: Date;
  expiration_date?: Date;
  value?: number;
  currency?: string;
  description?: string;
  terms_summary?: string;
  renewal_terms?: string;
  governing_law?: string;
  dispute_resolution?: string;
  signatures_required?: number;
  notes?: string;
  tags?: string[];
}

export interface UpdateContractData {
  title?: string;
  client_id?: string;
  document_id?: string;
  contract_type?: string;
  jurisdiction?: string;
  status?: 'Draft' | 'Under Review' | 'Signed' | 'Executed' | 'Expired' | 'Canceled' | 'Flagged';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: Date;
  end_date?: Date;
  expiration_date?: Date;
  value?: number;
  currency?: string;
  description?: string;
  terms_summary?: string;
  key_provisions?: KeyProvision[];
  renewal_terms?: string;
  governing_law?: string;
  dispute_resolution?: string;
  signatures_required?: number;
  signatures_obtained?: number;
  last_review_date?: Date;
  next_review_date?: Date;
  notes?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface KeyProvision {
  id: string;
  title: string;
  content: string;
  category: string;
  importance: 'low' | 'medium' | 'high' | 'critical';
  page_reference?: string;
  notes?: string;
}

export interface ContractAlert {
  id: string;
  contract_id: string;
  user_id: string;
  alert_type: 'missing_signature' | 'expiration_warning' | 'review_due' | 'clause_issue' | 'deadline' | 'renewal_due' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  ai_generated: boolean;
  ai_confidence?: number;
  trigger_date?: Date;
  due_date?: Date;
  resolved: boolean;
  resolved_at?: Date;
  resolved_by?: string;
  resolution_notes?: string;
  auto_generated: boolean;
  email_sent: boolean;
  email_sent_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ContractFilters {
  status?: string[];
  client_id?: string;
  jurisdiction?: string[];
  contract_type?: string[];
  priority?: string[];
  expiring_soon?: boolean;
  review_due?: boolean;
  search?: string;
}

export interface ContractSummary {
  id: string;
  title: string;
  client_name: string;
  status: string;
  jurisdiction: string;
  expiration_date?: Date;
  value?: number;
  currency: string;
  created_at: Date;
}
```

## src/models/Form.ts - Form Model

```typescript
export interface IntakeForm {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  template_version: string;
  form_schema: FormSchema;
  ui_schema?: UISchema;
  validation_rules?: ValidationRules;
  auto_save: boolean;
  allow_partial_submission: boolean;
  requires_signature: boolean;
  notification_settings?: NotificationSettings;
  active: boolean;
  public_access: boolean;
  access_code?: string;
  expires_at?: Date;
  submission_limit?: number;
  current_submissions: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateFormData {
  title: string;
  description?: string;
  category?: string;
  form_schema: FormSchema;
  ui_schema?: UISchema;
  validation_rules?: ValidationRules;
  auto_save?: boolean;
  allow_partial_submission?: boolean;
  requires_signature?: boolean;
  notification_settings?: NotificationSettings;
  public_access?: boolean;
  expires_at?: Date;
  submission_limit?: number;
}

export interface FormSchema {
  type: 'object';
  properties: Record<string, FieldSchema>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface FieldSchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  title?: string;
  description?: string;
  default?: any;
  enum?: any[];
  format?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  items?: FieldSchema;
  properties?: Record<string, FieldSchema>;
  required?: string[];
}

export interface UISchema {
  'ui:order'?: string[];
  'ui:widget'?: string;
  'ui:options'?: Record<string, any>;
  'ui:help'?: string;
  'ui:placeholder'?: string;
  'ui:disabled'?: boolean;
  'ui:readonly'?: boolean;
  'ui:autofocus'?: boolean;
  [key: string]: any;
}

export interface ValidationRules {
  crossFieldValidation?: CrossFieldRule[];
  customValidators?: CustomValidator[];
  conditionalFields?: ConditionalField[];
}

export interface CrossFieldRule {
  fields: string[];
  rule: string;
  message: string;
}

export interface CustomValidator {
  field: string;
  validator: string;
  message: string;
  parameters?: Record<string, any>;
}

export interface ConditionalField {
  field: string;
  conditions: FieldCondition[];
  action: 'show' | 'hide' | 'require' | 'disable';
}

export interface FieldCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface NotificationSettings {
  email_on_submission?: boolean;
  email_recipients?: string[];
  auto_response?: boolean;
  response_template?: string;
  webhook_url?: string;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  client_id?: string;
  submitter_name?: string;
  submitter_email?: string;
  submitter_ip?: string;
  responses: Record<string, any>;
  metadata?: SubmissionMetadata;
  status: 'draft' | 'submitted' | 'reviewed' | 'processed' | 'archived';
  review_notes?: string;
  processed_by?: string;
  processed_at?: Date;
  signature_data?: SignatureData;
  attachments?: AttachmentData[];
  validation_errors?: ValidationError[];
  submission_source: string;
  referrer?: string;
  user_agent?: string;
  submitted_at: Date;
  updated_at: Date;
}

export interface SubmissionMetadata {
  browser?: string;
  platform?: string;
  screen_resolution?: string;
  time_spent?: number;
  completion_rate?: number;
  [key: string]: any;
}

export interface SignatureData {
  signature_image?: string;
  signature_date?: Date;
  ip_address?: string;
  user_agent?: string;
}

export interface AttachmentData {
  id: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  field_name: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}
```

## src/models/Subscription.ts - Subscription Model

```typescript
export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  plan_name: string;
  payment_provider: 'paypal' | 'stripe' | 'other';
  payment_provider_id?: string;
  subscription_id?: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'failed' | 'expired';
  price: number;
  currency: string;
  billing_period: 'monthly' | 'yearly' | 'one-time';
  trial_start?: Date;
  trial_end?: Date;
  start_date: Date;
  end_date?: Date;
  current_period_start?: Date;
  current_period_end?: Date;
  cancel_at_period_end: boolean;
  canceled_at?: Date;
  cancellation_reason?: string;
  metadata?: SubscriptionMetadata;
  features?: SubscriptionFeatures;
  usage_limits?: UsageLimits;
  created_at: Date;
  updated_at: Date;
}

export interface SubscriptionMetadata {
  source?: string;
  campaign?: string;
  discount_code?: string;
  [key: string]: any;
}

export interface SubscriptionFeatures {
  max_clients?: number;
  max_documents?: number;
  max_contracts?: number;
  max_forms?: number;
  ai_analysis?: boolean;
  priority_support?: boolean;
  white_label?: boolean;
  api_access?: boolean;
  advanced_reporting?: boolean;
  [key: string]: any;
}

export interface UsageLimits {
  clients_used?: number;
  documents_used?: number;
  contracts_used?: number;
  forms_used?: number;
  storage_used?: number; // in bytes
  api_calls_used?: number;
  [key: string]: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  features: SubscriptionFeatures;
  limits: Omit<UsageLimits, keyof { [K in keyof UsageLimits as K extends `${string}_used` ? K : never]: any }>;
  popular?: boolean;
  trial_days?: number;
  setup_fee?: number;
}

export interface CreateSubscriptionData {
  plan_id: string;
  payment_provider: 'paypal' | 'stripe' | 'other';
  billing_period: 'monthly' | 'yearly';
  payment_method_id?: string;
  discount_code?: string;
  metadata?: SubscriptionMetadata;
}

export interface UpdateSubscriptionData {
  plan_id?: string;
  billing_period?: 'monthly' | 'yearly';
  cancel_at_period_end?: boolean;
  metadata?: SubscriptionMetadata;
}
```

## src/models/BillingTransaction.ts - Billing Model

```typescript
export interface BillingTransaction {
  id: string;
  user_id: string;
  subscription_id?: string;
  transaction_id: string;
  payment_provider: 'paypal' | 'stripe' | 'other';
  payment_method?: string;
  type: 'payment' | 'refund' | 'chargeback' | 'dispute' | 'fee';
  status: 'pending' | 'completed' | 'failed' | 'canceled' | 'disputed';
  amount: number;
  currency: string;
  fee_amount: number;
  net_amount?: number;
  description?: string;
  invoice_number?: string;
  receipt_url?: string;
  failure_reason?: string;
  metadata?: TransactionMetadata;
  processed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface TransactionMetadata {
  gateway_transaction_id?: string;
  gateway_fee?: number;
  tax_amount?: number;
  discount_amount?: number;
  payment_source?: string;
  billing_address?: BillingAddress;
  [key: string]: any;
}

export interface BillingAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'paypal' | 'other';
  last_four?: string;
  brand?: string;
  exp_month?: number;
  exp_year?: number;
  is_default: boolean;
  billing_address?: BillingAddress;
  created_at: Date;
}

export interface Invoice {
  id: string;
  user_id: string;
  subscription_id?: string;
  invoice_number: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  amount: number;
  currency: string;
  tax_amount?: number;
  discount_amount?: number;
  due_date: Date;
  paid_at?: Date;
  invoice_pdf?: string;
  line_items: InvoiceLineItem[];
  created_at: Date;
  updated_at: Date;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unit_amount: number;
  total_amount: number;
  period_start?: Date;
  period_end?: Date;
}
```

## src/models/SystemLog.ts - System Log Model

```typescript
export interface SystemLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  entity_name?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  request_id?: string;
  severity: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  details?: LogDetails;
  created_at: Date;
}

export interface LogDetails {
  duration?: number;
  method?: string;
  url?: string;
  status_code?: number;
  error_code?: string;
  stack_trace?: string;
  additional_context?: Record<string, any>;
}

export interface CreateLogData {
  user_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  entity_name?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  request_id?: string;
  severity?: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  details?: LogDetails;
}

export interface AuditLogFilters {
  user_id?: string;
  action?: string[];
  entity_type?: string[];
  severity?: string[];
  date_from?: Date;
  date_to?: Date;
  search?: string;
}
```

## src/types/express.d.ts - Express Type Extensions

```typescript
import { JWTPayload } from '@/config/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload & {
        subscription_status: string;
        subscription_tier: string;
      };
      requestId?: string;
      startTime?: number;
      rawBody?: Buffer;
    }
  }
}
```

## src/types/common.d.ts - Common Type Definitions

```typescript
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  sortBy?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface FilterOptions {
  [key: string]: any;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchOptions {
  query?: string;
  fields?: string[];
}

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface FileUploadResult {
  id: string;
  original_name: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  url: string;
  checksum?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
  encoding?: string;
}

export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  checks: {
    database: 'connected' | 'disconnected';
    redis?: 'connected' | 'disconnected';
    storage: 'available' | 'unavailable';
    external_apis: 'responsive' | 'unresponsive';
  };
}
```

## src/types/paypal.d.ts - PayPal Type Definitions

```typescript
export interface PayPalSubscriptionPlan {
  id: string;
  product_id: string;
  name: string;
  description?: string;
  status: 'CREATED' | 'INACTIVE' | 'ACTIVE';
  billing_cycles: BillingCycle[];
  payment_preferences: PaymentPreferences;
  taxes?: Tax;
  quantity_supported?: boolean;
  create_time?: string;
  update_time?: string;
  links?: Link[];
}

export interface BillingCycle {
  frequency: Frequency;
  tenure_type: 'REGULAR' | 'TRIAL';
  sequence: number;
  total_cycles?: number;
  pricing_scheme: PricingScheme;
}

export interface Frequency {
  interval_unit: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  interval_count: number;
}

export interface PricingScheme {
  fixed_price: Money;
  create_time?: string;
  update_time?: string;
}

export interface Money {
  currency_code: string;
  value: string;
}

export interface PaymentPreferences {
  auto_bill_outstanding?: boolean;
  setup_fee?: Money;
  setup_fee_failure_action?: 'CONTINUE' | 'CANCEL';
  payment_failure_threshold?: number;
}

export interface Tax {
  percentage: string;
  inclusive?: boolean;
}

export interface Link {
  href: string;
  rel: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

export interface PayPalSubscription {
  id: string;
  plan_id: string;
  start_time?: string;
  quantity?: string;
  shipping_amount?: Money;
  subscriber?: Subscriber;
  billing_info?: BillingInfo;
  create_time?: string;
  update_time?: string;
  links?: Link[];
  status: 'APPROVAL_PENDING' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED';
  status_update_time?: string;
}

export interface Subscriber {
  name?: Name;
  email_address?: string;
  payer_id?: string;
  shipping_address?: Address;
}

export interface Name {
  given_name?: string;
  surname?: string;
}

export interface Address {
  address_line_1?: string;
  address_line_2?: string;
  admin_area_2?: string;
  admin_area_1?: string;
  postal_code?: string;
  country_code: string;
}

export interface BillingInfo {
  outstanding_balance?: Money;
  cycle_executions?: CycleExecution[];
  last_payment?: LastPayment;
  next_billing_time?: string;
  final_payment_time?: string;
  failed_payments_count?: number;
}

export interface CycleExecution {
  tenure_type: 'REGULAR' | 'TRIAL';
  sequence: number;
  cycles_completed: number;
  cycles_remaining?: number;
  current_pricing_scheme_version?: number;
  total_cycles?: number;
}

export interface LastPayment {
  amount?: Money;
  time?: string;
}

export interface PayPalWebhookEvent {
  id: string;
  event_version: string;
  create_time: string;
  resource_type: string;
  resource_version?: string;
  event_type: string;
  summary?: string;
  resource: any;
  links?: Link[];
}
```

/**
 * UI Component for Auto-Implementation Approval
 * 
 * Shows users what will be fetched and asks for confirmation.
 * Prevents "magic" behavior and allows user control.
 */

import React, { useState } from 'react';
import {
  createImplementationPlan,
  executeImplementationWithSafeguards,
  type SafeImplementationPlan,
  type SafeImplementationOptions,
  type ImplementationApproval,
  type PlannedAction,
  type UncertainResource,
} from '../lib/autoImplementerWithSafeguards';
import type { ImplementationResult } from '../lib/autoImplementer';

// Inline styles
const styles = {
  container: {
    background: 'white',
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: 800,
    margin: '0 auto',
  } as React.CSSProperties,
  loading: {
    textAlign: 'center' as const,
    padding: 48,
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    width: 40,
    height: 40,
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px',
  } as React.CSSProperties,
  header: {
    textAlign: 'center' as const,
    marginBottom: 24,
  },
  headerTitle: {
    margin: '0 0 8px 0',
    color: '#333',
  } as React.CSSProperties,
  subtitle: {
    color: '#666',
    margin: 0,
  } as React.CSSProperties,
  section: {
    marginBottom: 24,
  } as React.CSSProperties,
  sectionTitle: {
    margin: '0 0 12px 0',
    color: '#333',
    fontSize: 18,
  } as React.CSSProperties,
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },
  costGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
  } as React.CSSProperties,
  costItem: {
    background: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  },
  costLabel: {
    fontSize: 14,
    color: '#666',
  } as React.CSSProperties,
  costValue: {
    fontSize: 20,
    fontWeight: 600,
    color: '#333',
  } as React.CSSProperties,
  warningsList: {
    margin: 0,
    paddingLeft: 20,
    color: '#d97706',
  } as React.CSSProperties,
  warningItem: {
    marginBottom: 8,
  } as React.CSSProperties,
  actions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    marginTop: 24,
  } as React.CSSProperties,
  btnBase: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  btnCancel: {
    background: '#f5f5f5',
    color: '#666',
  } as React.CSSProperties,
  btnApprove: {
    background: '#3b82f6',
    color: 'white',
  } as React.CSSProperties,
  notice: {
    background: '#fef3c7',
    border: '1px solid #fbbf24',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    textAlign: 'center' as const,
  },
  noticeText: {
    margin: 0,
    color: '#92400e',
  } as React.CSSProperties,
  // ActionCard styles
  actionCard: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 16,
    transition: 'all 0.2s',
  } as React.CSSProperties,
  actionCardSkipped: {
    opacity: 0.5,
    background: '#f3f4f6',
  } as React.CSSProperties,
  actionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  } as React.CSSProperties,
  actionType: {
    fontSize: 12,
    textTransform: 'uppercase' as const,
    fontWeight: 600,
    color: '#6b7280',
  },
  confidenceBadge: {
    padding: '4px 8px',
    borderRadius: 4,
    color: 'white',
    fontSize: 12,
    fontWeight: 600,
  } as React.CSSProperties,
  actionBody: {
    marginBottom: 12,
  } as React.CSSProperties,
  actionDescription: {
    margin: '0 0 12px 0',
    color: '#374151',
    fontWeight: 500,
  } as React.CSSProperties,
  editSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  },
  editInput: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
  } as React.CSSProperties,
  editActions: {
    display: 'flex',
    gap: 8,
  } as React.CSSProperties,
  btnSave: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    cursor: 'pointer',
    background: '#10b981',
    color: 'white',
  } as React.CSSProperties,
  btnCancelEdit: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    cursor: 'pointer',
    background: '#f3f4f6',
    color: '#6b7280',
  } as React.CSSProperties,
  valueSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'white',
    padding: '8px 12px',
    borderRadius: 6,
  } as React.CSSProperties,
  valueLabel: {
    fontSize: 12,
    color: '#6b7280',
  } as React.CSSProperties,
  valueText: {
    flex: 1,
    fontWeight: 500,
    color: '#111827',
  } as React.CSSProperties,
  btnEdit: {
    padding: '4px 8px',
    background: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: 4,
    fontSize: 12,
    cursor: 'pointer',
  } as React.CSSProperties,
  costInfo: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  } as React.CSSProperties,
  actionFooter: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: 12,
  } as React.CSSProperties,
  skipCheckbox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    fontSize: 14,
    color: '#6b7280',
  } as React.CSSProperties,
  // UncertainResourceCard styles
  uncertainCard: {
    background: '#fef3c7',
    border: '1px solid #fbbf24',
    borderRadius: 8,
    padding: 16,
  } as React.CSSProperties,
  resourceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  } as React.CSSProperties,
  resourceValue: {
    fontWeight: 600,
    color: '#92400e',
  } as React.CSSProperties,
  resourceType: {
    fontSize: 12,
    background: '#f59e0b',
    color: 'white',
    padding: '2px 8px',
    borderRadius: 4,
  } as React.CSSProperties,
  resourceReason: {
    margin: '0 0 12px 0',
    color: '#92400e',
    fontSize: 14,
  } as React.CSSProperties,
  suggestionsLabel: {
    margin: '0 0 8px 0',
    fontSize: 14,
    fontWeight: 500,
    color: '#78350f',
  } as React.CSSProperties,
  suggestionsList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  suggestionBtn: {
    padding: '6px 12px',
    background: 'white',
    border: '1px solid #fbbf24',
    borderRadius: 6,
    fontSize: 13,
    cursor: 'pointer',
    color: '#92400e',
    transition: 'all 0.2s',
  } as React.CSSProperties,
};

interface Props {
  userInput: string;
  onComplete: (result: ImplementationResult) => void;
  onCancel: () => void;
  options?: SafeImplementationOptions;
}

export function AutoImplementApproval({
  userInput,
  onComplete,
  onCancel,
  options = {},
}: Props) {
  const [plan, setPlan] = useState<SafeImplementationPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [modifications, setModifications] = useState<Record<string, string>>({});
  const [skipEntities, setSkipEntities] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    loadPlan();
  }, [userInput]);

  async function loadPlan() {
    setLoading(true);
    try {
      const implementationPlan = await createImplementationPlan(userInput, options);
      setPlan(implementationPlan);
    } catch (error) {
      console.error('Failed to create plan:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    if (!plan) return;

    setLoading(true);
    try {
      const approval: ImplementationApproval = {
        approved: true,
        modifications: Object.entries(modifications).map(([id, newValue]) => ({
          entityId: id,
          newValue,
        })),
        skipEntities: Array.from(skipEntities),
      };

      const result = await executeImplementationWithSafeguards(userInput, approval, options);
      onComplete(result);
    } catch (error) {
      console.error('Implementation failed:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleDeny() {
    onCancel();
  }

  function handleModify(entityId: string, newValue: string) {
    setModifications((prev) => ({ ...prev, [entityId]: newValue }));
  }

  function handleToggleSkip(entityId: string) {
    setSkipEntities((prev) => {
      const next = new Set(prev);
      if (next.has(entityId)) {
        next.delete(entityId);
      } else {
        next.add(entityId);
      }
      return next;
    });
  }

  if (loading) {
    return (
      <div style={{ ...styles.container, ...styles.loading }}>
        <div style={styles.spinner}></div>
        <p>Analyzing request...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div style={styles.container}>
        <p>Failed to create implementation plan</p>
        <button onClick={onCancel}>Cancel</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>🤖 Auto-Implementation Request</h2>
        <p style={styles.subtitle}>Review what will be fetched before proceeding</p>
      </div>

      {/* Actions List */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📋 Planned Actions ({plan.actions.length})</h3>
        <div style={styles.list}>
          {plan.actions.map((action, index) => (
            <ActionCard
              key={index}
              action={action}
              isSkipped={skipEntities.has(`${action.entity.type}-${action.entity.value}`)}
              currentValue={
                modifications[`${action.entity.type}-${action.entity.value}`] || action.entity.value
              }
              onModify={(newValue) =>
                handleModify(`${action.entity.type}-${action.entity.value}`, newValue)
              }
              onToggleSkip={() =>
                handleToggleSkip(`${action.entity.type}-${action.entity.value}`)
              }
            />
          ))}
        </div>
      </div>

      {/* Uncertain Resources */}
      {plan.uncertainResources.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>⚠️ Resources Needing Attention</h3>
          <div style={styles.list}>
            {plan.uncertainResources.map((resource, index) => (
              <UncertainResourceCard
                key={index}
                resource={resource}
                onSelect={(suggestion) =>
                  handleModify(`${resource.entity.type}-${resource.entity.value}`, suggestion)
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Cost Summary */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>💰 Cost Estimate</h3>
        <div style={styles.costGrid}>
          <div style={styles.costItem}>
            <span style={styles.costLabel}>API Calls:</span>
            <span style={styles.costValue}>{plan.estimatedCost.apiCalls}</span>
          </div>
          <div style={styles.costItem}>
            <span style={styles.costLabel}>Tokens:</span>
            <span style={styles.costValue}>{plan.estimatedCost.tokens}</span>
          </div>
          <div style={styles.costItem}>
            <span style={styles.costLabel}>Dollar Cost:</span>
            <span style={styles.costValue}>${plan.estimatedCost.dollarCost.toFixed(4)}</span>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {plan.warnings.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>⚠️ Warnings</h3>
          <ul style={styles.warningsList}>
            {plan.warnings.map((warning, index) => (
              <li key={index} style={styles.warningItem}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div style={styles.actions}>
        <button
          style={{ ...styles.btnBase, ...styles.btnCancel }}
          onClick={handleDeny}
          disabled={loading}
        >
          ❌ Cancel
        </button>
        <button
          style={{ ...styles.btnBase, ...styles.btnApprove }}
          onClick={handleApprove}
          disabled={loading}
        >
          ✅ Approve & Fetch ({plan.actions.length - skipEntities.size} items)
        </button>
      </div>

      {!plan.canProceedAutomatically && (
        <div style={styles.notice}>
          <p style={styles.noticeText}>
            ⛔ This request cannot proceed automatically. Please review and modify as needed.
          </p>
        </div>
      )}
    </div>
  );
}

interface ActionCardProps {
  action: PlannedAction;
  isSkipped: boolean;
  currentValue: string;
  onModify: (newValue: string) => void;
  onToggleSkip: () => void;
}

function ActionCard({
  action,
  isSkipped,
  currentValue,
  onModify,
  onToggleSkip,
}: ActionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentValue);

  const confidencePercent = Math.floor(action.confidence * 100);
  const confidenceColor =
    confidencePercent >= 80 ? '#10b981' : confidencePercent >= 60 ? '#f59e0b' : '#ef4444';

  function handleSave() {
    onModify(editValue);
    setIsEditing(false);
  }

  return (
    <div style={{ ...styles.actionCard, ...(isSkipped ? styles.actionCardSkipped : {}) }}>
      <div style={styles.actionHeader}>
        <div style={styles.actionType}>{action.actionType}</div>
        <div style={{ ...styles.confidenceBadge, background: confidenceColor }}>
          {confidencePercent}%
        </div>
      </div>

      <div style={styles.actionBody}>
        <p style={styles.actionDescription}>{action.description}</p>

        {isEditing ? (
          <div style={styles.editSection}>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              style={styles.editInput}
            />
            <div style={styles.editActions}>
              <button onClick={handleSave} style={styles.btnSave}>
                Save
              </button>
              <button onClick={() => setIsEditing(false)} style={styles.btnCancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.valueSection}>
            <span style={styles.valueLabel}>Resource:</span>
            <span style={styles.valueText}>{currentValue}</span>
            <button onClick={() => setIsEditing(true)} style={styles.btnEdit}>
              ✏️ Edit
            </button>
          </div>
        )}

        {action.estimatedCost > 0 && (
          <div style={styles.costInfo}>Est. Cost: ${action.estimatedCost.toFixed(4)}</div>
        )}

        {action.alternatives && action.alternatives.length > 0 && (
          <details style={{ marginTop: 8, fontSize: 14 }}>
            <summary style={{ cursor: 'pointer', color: '#3b82f6', userSelect: 'none' }}>
              Alternatives ({action.alternatives.length})
            </summary>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: 20, color: '#6b7280' }}>
              {action.alternatives.map((alt, i) => (
                <li key={i}>{alt}</li>
              ))}
            </ul>
          </details>
        )}
      </div>

      <div style={styles.actionFooter}>
        <label style={styles.skipCheckbox}>
          <input type="checkbox" checked={isSkipped} onChange={onToggleSkip} />
          <span>Skip this action</span>
        </label>
      </div>
    </div>
  );
}

interface UncertainResourceCardProps {
  resource: UncertainResource;
  onSelect: (suggestion: string) => void;
}

function UncertainResourceCard({ resource, onSelect }: UncertainResourceCardProps) {
  return (
    <div style={styles.uncertainCard}>
      <div style={styles.resourceHeader}>
        <span style={styles.resourceValue}>{resource.entity.value}</span>
        <span style={styles.resourceType}>{resource.entity.type}</span>
      </div>

      <p style={styles.resourceReason}>⚠️ {resource.reason}</p>

      <div>
        <p style={styles.suggestionsLabel}>Suggestions:</p>
        <div style={styles.suggestionsList}>
          {resource.suggestions.map((suggestion, i) => (
            <button
              key={i}
              style={styles.suggestionBtn}
              onClick={() => onSelect(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

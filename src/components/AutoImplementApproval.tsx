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
  formatPlanForUser,
  type SafeImplementationPlan,
  type SafeImplementationOptions,
  type ImplementationApproval,
  type PlannedAction,
  type UncertainResource,
} from '../lib/autoImplementerWithSafeguards';
import type { ImplementationResult } from '../lib/autoImplementer';

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
  const [modifications, setModifications] = useState<
    Record<string, string>
  >({});
  const [skipEntities, setSkipEntities] = useState<Set<string>>(
    new Set()
  );

  // Load plan on mount
  React.useEffect(() => {
    loadPlan();
  }, [userInput]);

  async function loadPlan() {
    setLoading(true);
    try {
      const implementationPlan = await createImplementationPlan(
        userInput,
        options
      );
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
        modifications: Object.entries(modifications).map(
          ([id, newValue]) => ({
            entityId: id,
            newValue,
          })
        ),
        skipEntities: Array.from(skipEntities),
      };

      const result = await executeImplementationWithSafeguards(
        userInput,
        approval,
        options
      );

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
    setModifications((prev) => ({
      ...prev,
      [entityId]: newValue,
    }));
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
      <div className="auto-implement-approval loading">
        <div className="spinner"></div>
        <p>Analyzing request...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="auto-implement-approval error">
        <p>Failed to create implementation plan</p>
        <button onClick={onCancel}>Cancel</button>
      </div>
    );
  }

  return (
    <div className="auto-implement-approval">
      <div className="approval-header">
        <h2>🤖 Auto-Implementation Request</h2>
        <p className="subtitle">
          Review what will be fetched before proceeding
        </p>
      </div>

      {/* Actions List */}
      <div className="actions-section">
        <h3>📋 Planned Actions ({plan.actions.length})</h3>
        <div className="actions-list">
          {plan.actions.map((action, index) => (
            <ActionCard
              key={index}
              action={action}
              isSkipped={skipEntities.has(
                `${action.entity.type}-${action.entity.value}`
              )}
              currentValue={
                modifications[
                  `${action.entity.type}-${action.entity.value}`
                ] || action.entity.value
              }
              onModify={(newValue) =>
                handleModify(
                  `${action.entity.type}-${action.entity.value}`,
                  newValue
                )
              }
              onToggleSkip={() =>
                handleToggleSkip(
                  `${action.entity.type}-${action.entity.value}`
                )
              }
            />
          ))}
        </div>
      </div>

      {/* Uncertain Resources */}
      {plan.uncertainResources.length > 0 && (
        <div className="uncertain-section">
          <h3>⚠️ Resources Needing Attention</h3>
          <div className="uncertain-list">
            {plan.uncertainResources.map((resource, index) => (
              <UncertainResourceCard
                key={index}
                resource={resource}
                onSelect={(suggestion) =>
                  handleModify(
                    `${resource.entity.type}-${resource.entity.value}`,
                    suggestion
                  )
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Cost Summary */}
      <div className="cost-summary">
        <h3>💰 Cost Estimate</h3>
        <div className="cost-grid">
          <div className="cost-item">
            <span className="label">API Calls:</span>
            <span className="value">
              {plan.estimatedCost.apiCalls}
            </span>
          </div>
          <div className="cost-item">
            <span className="label">Tokens:</span>
            <span className="value">
              {plan.estimatedCost.tokens}
            </span>
          </div>
          <div className="cost-item">
            <span className="label">Dollar Cost:</span>
            <span className="value">
              ${plan.estimatedCost.dollarCost.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {plan.warnings.length > 0 && (
        <div className="warnings-section">
          <h3>⚠️ Warnings</h3>
          <ul className="warnings-list">
            {plan.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="approval-actions">
        <button
          className="btn-cancel"
          onClick={handleDeny}
          disabled={loading}
        >
          ❌ Cancel
        </button>
        <button
          className="btn-approve"
          onClick={handleApprove}
          disabled={loading}
        >
          ✅ Approve & Fetch ({plan.actions.length - skipEntities.size}{' '}
          items)
        </button>
      </div>

      {!plan.canProceedAutomatically && (
        <div className="notice">
          <p>
            ⛔ This request cannot proceed automatically. Please review
            and modify as needed.
          </p>
        </div>
      )}

      <style jsx>{`
        .auto-implement-approval {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          margin: 0 auto;
        }

        .approval-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .approval-header h2 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .subtitle {
          color: #666;
          margin: 0;
        }

        .actions-section,
        .uncertain-section,
        .cost-summary,
        .warnings-section {
          margin-bottom: 24px;
        }

        .actions-section h3,
        .uncertain-section h3,
        .cost-summary h3,
        .warnings-section h3 {
          margin: 0 0 12px 0;
          color: #333;
          font-size: 18px;
        }

        .actions-list,
        .uncertain-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cost-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .cost-item {
          background: #f5f5f5;
          padding: 16px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cost-item .label {
          font-size: 14px;
          color: #666;
        }

        .cost-item .value {
          font-size: 20px;
          font-weight: 600;
          color: #333;
        }

        .warnings-list {
          margin: 0;
          padding-left: 20px;
          color: #d97706;
        }

        .warnings-list li {
          margin-bottom: 8px;
        }

        .approval-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 24px;
        }

        .btn-cancel,
        .btn-approve {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel {
          background: #f5f5f5;
          color: #666;
        }

        .btn-cancel:hover {
          background: #e5e5e5;
        }

        .btn-approve {
          background: #3b82f6;
          color: white;
        }

        .btn-approve:hover {
          background: #2563eb;
        }

        .btn-cancel:disabled,
        .btn-approve:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .notice {
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 8px;
          padding: 12px;
          margin-top: 16px;
          text-align: center;
        }

        .notice p {
          margin: 0;
          color: #92400e;
        }

        .loading {
          text-align: center;
          padding: 48px;
        }

        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
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
    confidencePercent >= 80
      ? '#10b981'
      : confidencePercent >= 60
        ? '#f59e0b'
        : '#ef4444';

  function handleSave() {
    onModify(editValue);
    setIsEditing(false);
  }

  return (
    <div className={`action-card ${isSkipped ? 'skipped' : ''}`}>
      <div className="action-header">
        <div className="action-type">{action.actionType}</div>
        <div
          className="confidence-badge"
          style={{ background: confidenceColor }}
        >
          {confidencePercent}%
        </div>
      </div>

      <div className="action-body">
        <p className="action-description">{action.description}</p>

        {isEditing ? (
          <div className="edit-section">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="edit-input"
            />
            <div className="edit-actions">
              <button onClick={handleSave} className="btn-save">
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="btn-cancel-edit"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="value-section">
            <span className="value-label">Resource:</span>
            <span className="value-text">{currentValue}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="btn-edit"
            >
              ✏️ Edit
            </button>
          </div>
        )}

        {action.estimatedCost > 0 && (
          <div className="cost-info">
            Est. Cost: ${action.estimatedCost.toFixed(4)}
          </div>
        )}

        {action.alternatives && action.alternatives.length > 0 && (
          <details className="alternatives">
            <summary>Alternatives ({action.alternatives.length})</summary>
            <ul>
              {action.alternatives.map((alt, i) => (
                <li key={i}>{alt}</li>
              ))}
            </ul>
          </details>
        )}
      </div>

      <div className="action-footer">
        <label className="skip-checkbox">
          <input
            type="checkbox"
            checked={isSkipped}
            onChange={onToggleSkip}
          />
          <span>Skip this action</span>
        </label>
      </div>

      <style jsx>{`
        .action-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          transition: all 0.2s;
        }

        .action-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
        }

        .action-card.skipped {
          opacity: 0.5;
          background: #f3f4f6;
        }

        .action-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .action-type {
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 600;
          color: #6b7280;
        }

        .confidence-badge {
          padding: 4px 8px;
          border-radius: 4px;
          color: white;
          font-size: 12px;
          font-weight: 600;
        }

        .action-body {
          margin-bottom: 12px;
        }

        .action-description {
          margin: 0 0 12px 0;
          color: #374151;
          font-weight: 500;
        }

        .edit-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .edit-input {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .edit-actions {
          display: flex;
          gap: 8px;
        }

        .btn-save,
        .btn-cancel-edit {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-save {
          background: #10b981;
          color: white;
        }

        .btn-cancel-edit {
          background: #f3f4f6;
          color: #6b7280;
        }

        .value-section {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          padding: 8px 12px;
          border-radius: 6px;
        }

        .value-label {
          font-size: 12px;
          color: #6b7280;
        }

        .value-text {
          flex: 1;
          font-weight: 500;
          color: #111827;
        }

        .btn-edit {
          padding: 4px 8px;
          background: transparent;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }

        .btn-edit:hover {
          background: #f9fafb;
        }

        .cost-info {
          font-size: 12px;
          color: #6b7280;
          margin-top: 8px;
        }

        .alternatives {
          margin-top: 8px;
          font-size: 14px;
        }

        .alternatives summary {
          cursor: pointer;
          color: #3b82f6;
          user-select: none;
        }

        .alternatives ul {
          margin: 8px 0 0 0;
          padding-left: 20px;
          color: #6b7280;
        }

        .action-footer {
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
        }

        .skip-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #6b7280;
        }

        .skip-checkbox input {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

interface UncertainResourceCardProps {
  resource: UncertainResource;
  onSelect: (suggestion: string) => void;
}

function UncertainResourceCard({
  resource,
  onSelect,
}: UncertainResourceCardProps) {
  return (
    <div className="uncertain-resource-card">
      <div className="resource-header">
        <span className="resource-value">{resource.entity.value}</span>
        <span className="resource-type">{resource.entity.type}</span>
      </div>

      <p className="resource-reason">⚠️ {resource.reason}</p>

      <div className="suggestions">
        <p className="suggestions-label">Suggestions:</p>
        <div className="suggestions-list">
          {resource.suggestions.map((suggestion, i) => (
            <button
              key={i}
              className="suggestion-btn"
              onClick={() => onSelect(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .uncertain-resource-card {
          background: #fef3c7;
          border: 1px solid #fbbf24;
          border-radius: 8px;
          padding: 16px;
        }

        .resource-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .resource-value {
          font-weight: 600;
          color: #92400e;
        }

        .resource-type {
          font-size: 12px;
          background: #f59e0b;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .resource-reason {
          margin: 0 0 12px 0;
          color: #92400e;
          font-size: 14px;
        }

        .suggestions-label {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 500;
          color: #78350f;
        }

        .suggestions-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .suggestion-btn {
          padding: 6px 12px;
          background: white;
          border: 1px solid #fbbf24;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          color: #92400e;
          transition: all 0.2s;
        }

        .suggestion-btn:hover {
          background: #fbbf24;
          color: white;
        }
      `}</style>
    </div>
  );
}

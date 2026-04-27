import { useState } from 'react'
import type { ModalState } from '../../types/models'

interface ActionModalProps {
  modal: ModalState
  onClose: () => void
  onConfirm: (payload?: { reviewer?: string }) => void
}

const reviewerOptions = ['Legal Ops', 'Priya S.', 'Trust & Safety', 'Harsh V.']

export function ActionModal({ modal, onClose, onConfirm }: ActionModalProps) {
  const [reviewer, setReviewer] = useState(reviewerOptions[0])

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <span className="eyebrow">Workflow action</span>
        <h2>{modal.title}</h2>
        <p>{modal.description}</p>

        {modal.action === 'assign' ? (
          <label className="field">
            <span>Assign to reviewer</span>
            <select value={reviewer} onChange={(event) => setReviewer(event.target.value)}>
              {reviewerOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <div className="modal-card__actions">
          <button className="button button--ghost" type="button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="button"
            type="button"
            onClick={() => onConfirm(modal.action === 'assign' ? { reviewer } : undefined)}
          >
            {modal.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

/* eslint-disable no-unused-vars */
import React from 'react';
import './ConfirmationDialog.css';

const ConfirmationDialog = ({ show, message, onConfirm, onCancel }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="confirmation-dialog">
            <div className="dialog-content">
                <p>{message}</p>
                <button className="dialog-btn confirm" onClick={onConfirm}>Yes</button>
                <button className="dialog-btn cancel" onClick={onCancel}>No</button>
            </div>
        </div>
    );
};

export default ConfirmationDialog;

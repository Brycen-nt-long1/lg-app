import React from 'react';
import './TicketFormBase.css';

interface TicketFormBaseProps {
    label: string;
    inputValue: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onClick: () => void;
    isLoading: boolean;
    showError: boolean;
    errorMessage?: string;
    resultNode?: React.ReactNode;
    buttonText?: string;
}

export default function TicketFormBase({
    label,
    inputValue,
    onInputChange,
    onKeyDown,
    onClick,
    isLoading,
    showError,
    errorMessage,
    resultNode,
    buttonText = 'Click Me'
}: TicketFormBaseProps) {
    return (
        <div className='ticket-form-container'>
            <div className='ticket-form-group'>
                <label htmlFor='input-id'>{label}</label>
                <input
                    id='input-id'
                    type='text'
                    value={inputValue}
                    onChange={onInputChange}
                    onKeyDown={onKeyDown}
                    className='ticket-form-input'
                />
                <div className='ticket-form-error'>{showError ? (errorMessage || 'Please enter Id') : '　'} </div>
            </div>
            <div className='ticket-form-group'>
                <button onClick={onClick} disabled={isLoading} className='ticket-form-btn'>
                    {isLoading ? 'Loading...' : buttonText}
                </button>
            </div>
            {resultNode}
        </div>
    );
}
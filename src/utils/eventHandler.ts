import React, { ChangeEvent } from 'react';

/**
 * Higher-order function to create a change handler for checkbox elements
 * that updates a boolean state.
 * @param setter The React state setter function for a boolean value.
 * @returns A function to be used as an onChange event handler for checkboxes.
 */
export const createCheckboxChangeHandler = (setter: React.Dispatch<React.SetStateAction<boolean>>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
        setter(event.target.checked);
    };

/**
 * Higher-order function to create a change handler for form elements (e.g., input, select, textarea)
 * that updates a string state with the element's value.
 * @template E The type of HTML form element (e.g., HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement).
 * @param setter The React state setter function for a string value.
 * @returns A function to be used as an onChange event handler.
 */
export const createValueChangeHandler = <
    E extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>(
    setter: React.Dispatch<React.SetStateAction<string>>
) => (event: ChangeEvent<E>) => {
    setter(event.target.value);
};

/**
 * Higher-order function to create a change handler for select elements
 * that updates a number state by parsing the element's value.
 * @param setter The React state setter function for a number value.
 * @returns A function to be used as an onChange event handler for select elements.
 */
export const createSelectNumericChangeHandler = (setter: React.Dispatch<React.SetStateAction<number>>) =>
    (event: ChangeEvent<HTMLSelectElement>) => {
        setter(Number(event.target.value));
    };

/**
 * Higher-order function to create a change handler for input elements
 * that updates a number state by parsing the element's value.
 * @param setter The React state setter function for a number value.
 * @returns A function to be used as an onChange event handler for input elements.
 */
export const createInputNumericChangeHandler = (setter: React.Dispatch<React.SetStateAction<number>>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
        setter(Number(event.target.value));
    };

/**
 * Higher-order function to create a keydown event handler that triggers a callback
 * when the Enter key is pressed on an input element.
 * @param onEnterPress The async function to call when the Enter key is pressed.
 * @returns A function to be used as an onKeyDown event handler for input elements.
 */
export const createEnterKeyHandler = (onEnterPress: () => Promise<void>) =>
    async (event: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
        if (event.key === 'Enter') {
            await onEnterPress();
        }
    };
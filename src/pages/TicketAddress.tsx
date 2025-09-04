import { useState } from 'react';
import { TicketService } from '../services/ticketService';
import SlCopyButton from '@shoelace-style/shoelace/dist/react/copy-button';
import SlInput from '@shoelace-style/shoelace/dist/react/input';
import {
  createValueChangeHandler,
  createEnterKeyHandler
} from '../utils/eventHandler';
import TicketFormBase from '../components/TicketFormBase';

export default function TicketAddress() {
  const [ticketIdInput, setTicketIdInput] = useState('');
  const [addressResult, setAddressResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTicketIdError, setShowTicketIdError] = useState(false);

  const handleInputChange = createValueChangeHandler(setTicketIdInput);

  const handleClick = async () => {
    setShowTicketIdError(false);
    setAddressResult('');

    const ticketId = ticketIdInput.trim();
    if (!ticketId) {
      setShowTicketIdError(true);
      return;
    }
    setIsLoading(true);
    const address: string = await TicketService.getTicketAddress(ticketId);
    setAddressResult(address);
    setIsLoading(false);
  };

  const handleKeyDown = createEnterKeyHandler(handleClick);

  const resultNode = (
    <div className="ticket-form-group ticket-form-inline">
      <label htmlFor="result">Result:</label>
      <SlInput
        id="my-input"
        type="text"
        value={addressResult}
        className="result-input"
        readonly
      />
      <SlCopyButton className="form-copy" from="my-input.value" />
    </div>
  );

  return (
    <div className="page-container">
      <div className="dashboard-content">
        <TicketFormBase
          label="Ticket ID:"
          inputValue={ticketIdInput}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          isLoading={isLoading}
          showError={showTicketIdError}
          errorMessage="Please enter Ticket ID"
          resultNode={resultNode}
          buttonText="Get Address"
        />
      </div>
    </div>
  );
}
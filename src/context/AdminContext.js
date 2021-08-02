import { createContext, useContext, useState } from 'react';

const adminContext = createContext();

// eslint-disable-next-line
export default function AdminProvider({ children }) {
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showFundTransferModal, setShowFundTransferModal] = useState(false);
  const [showUpdatePNRModal, setShowUpdatePNRModal] = useState(false);

  const toggleShowAgentModal = () => {
    setShowAgentModal(!showAgentModal);
  };

  const toggleShowTicketModal = () => {
    setShowTicketModal(!showTicketModal);
  };

  const toggleShowFundTransferModal = () => {
    setShowFundTransferModal(!showFundTransferModal);
  };

  const toggleShowUpdatePNRModal = () => {
    setShowUpdatePNRModal(!showUpdatePNRModal);
  };

  const values = {
    showAgentModal,
    showTicketModal,
    showFundTransferModal,
    showUpdatePNRModal,
    toggleShowAgentModal,
    toggleShowTicketModal,
    toggleShowFundTransferModal,
    toggleShowUpdatePNRModal
  };
  return <adminContext.Provider value={values}>{children}</adminContext.Provider>;
}

export function useAdminContext() {
  return useContext(adminContext);
}

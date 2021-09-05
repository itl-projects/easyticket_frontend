import { createContext, useContext, useState } from 'react';

const adminContext = createContext();

// eslint-disable-next-line
export default function AdminProvider({ children }) {
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(null);
  const [showFundTransferModal, setShowFundTransferModal] = useState(false);
  const [showUpdatePNRModal, setShowUpdatePNRModal] = useState(null);
  const [bookingPrint, setBookingPrint] = useState(false);
  const [showUserMarkupModal, setShowUserMarkupModal] = useState(null);

  const toggleShowAgentModal = () => {
    setShowAgentModal(!showAgentModal);
  };

  const toggleShowTicketModal = (_, editItem = null) => {
    setShowTicketModal(editItem);
  };

  const toggleShowFundTransferModal = () => {
    setShowFundTransferModal(!showFundTransferModal);
  };

  const toggleShowUpdatePNRModal = (data = null) => {
    setShowUpdatePNRModal(data);
  };

  const toggleShowBookingPrintModal = (data = null) => {
    setBookingPrint(data);
  };

  const toggleShowUserMarkupModal = (editItem = null) => {
    setShowUserMarkupModal(editItem);
  };

  const values = {
    showAgentModal,
    showTicketModal,
    showFundTransferModal,
    showUpdatePNRModal,
    bookingPrint,
    showUserMarkupModal,
    toggleShowAgentModal,
    toggleShowTicketModal,
    toggleShowFundTransferModal,
    toggleShowUpdatePNRModal,
    toggleShowBookingPrintModal,
    toggleShowUserMarkupModal
  };
  return <adminContext.Provider value={values}>{children}</adminContext.Provider>;
}

export function useAdminContext() {
  return useContext(adminContext);
}

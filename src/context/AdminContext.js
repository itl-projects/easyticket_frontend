import { createContext, useContext, useState } from 'react';

const adminContext = createContext();

// eslint-disable-next-line
export default function AdminProvider({ children }) {
  const [showAlertInfo, setShowAlertInfo] = useState(null);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(null);
  const [showFundTransferModal, setShowFundTransferModal] = useState(false);
  const [showUpdatePNRModal, setShowUpdatePNRModal] = useState(null);
  const [bookingPrint, setBookingPrint] = useState(false);
  const [showUserMarkupModal, setShowUserMarkupModal] = useState(null);
  const [showCreditApproveModal, toggleShowCreditApproveModal] = useState(null);
  const [showCreditRequestModal, toggleShowCreditRequestModal] = useState(false);
  const [showGlobalLogoutModal, toggleShowGlobalLogoutModal] = useState(false);

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
    showCreditApproveModal,
    showCreditRequestModal,
    showAlertInfo,
    showGlobalLogoutModal,
    toggleShowGlobalLogoutModal,
    setShowAlertInfo,
    toggleShowAgentModal,
    toggleShowTicketModal,
    toggleShowFundTransferModal,
    toggleShowUpdatePNRModal,
    toggleShowBookingPrintModal,
    toggleShowUserMarkupModal,
    toggleShowCreditApproveModal,
    toggleShowCreditRequestModal
  };
  return <adminContext.Provider value={values}>{children}</adminContext.Provider>;
}

export function useAdminContext() {
  return useContext(adminContext);
}

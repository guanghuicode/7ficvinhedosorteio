import React, { useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeResult, Html5QrcodeError } from "html5-qrcode";
import { useScannerStore } from '../../store/useScannerStore';
import Modal from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scanStand } from '../../services/userService';
import toast from 'react-hot-toast';

const QR_REGION_ID = "qr-reader-region";

const QrScannerModal: React.FC = () => {
  const { isOpen, closeScanner } = useScannerStore();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const scanStandMutation = useMutation({
    mutationFn: scanStand,
    onSuccess: () => {
      toast.success('Stand scanned successfully!');
      queryClient.invalidateQueries({ queryKey: ['userData', user?.uid] });
      closeScanner();
    },
    onError: (error) => {
      toast.error(error.message);
      closeScanner();
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    const html5QrCode = new Html5Qrcode(QR_REGION_ID);
    let isActive = true;

    const qrCodeSuccessCallback = (decodedText: string, result: Html5QrcodeResult) => {
      console.log(result);
      if (!user) {
        toast.error("You must be logged in to scan.");
        return;
      }
      try {
        // Expecting a simple string: "standId" or a JSON: {"standId": "..."}
        let standId: string | undefined;
        try {
          const data = JSON.parse(decodedText);
          standId = data.standId;
        } catch (e) {
          standId = decodedText;
        }

        if (!standId) {
            throw new Error("Invalid QR code format.");
        }
        scanStandMutation.mutate({ userId: user.uid, standId });

      } catch (error) {
        toast.error("Could not read QR code.");
        console.error(error);
      }
    };
    
    const qrCodeErrorCallback = (errorMessage: string, error: Html5QrcodeError) => {
      // Ignore common non-error messages
      if (!errorMessage.includes("No QR code found")) {
        console.warn(`QR Code Scan Error: ${errorMessage}`, error);
      }
    };

    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      )
      .catch((err) => {
        console.error("Failed to start QR scanner", err);
        toast.error("Could not start camera. Please grant permission.");
        closeScanner();
      });

    return () => {
      if (isActive) {
        isActive = false;
        html5QrCode.stop().catch(err => console.error("Failed to stop QR scanner", err));
      }
    };
  }, [isOpen, user, closeScanner, queryClient, scanStandMutation]);

  return (
    <Modal isOpen={isOpen} onClose={closeScanner} title="Scan a Stand QR Code">
      <div id={QR_REGION_ID} style={{ width: '100%' }}/>
    </Modal>
  );
};

export default QrScannerModal;

